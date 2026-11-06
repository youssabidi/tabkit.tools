const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load registry
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('registry.js', 'utf8'), sandbox);
const registry = sandbox.window.TOOLS_REGISTRY;

const CATEGORY_SLUGS = {
  'Documents & PDF': 'documents-pdf',
  'Text & Data': 'text-data',
  'Developer & Code': 'developer-code',
  'Privacy & Security': 'privacy-security',
  'Media & Design': 'media-design',
  'Productivity & Math': 'productivity-math'
};

const APP_CATEGORIES = {
  'Documents & PDF': 'UtilitiesApplication',
  'Text & Data': 'BusinessApplication',
  'Developer & Code': 'DeveloperApplication',
  'Privacy & Security': 'SecurityApplication',
  'Media & Design': 'DesignApplication',
  'Productivity & Math': 'UtilitiesApplication'
};

function extractFaq(html) {
  const faqs = [];
  const faqIdx = html.indexOf('Frequently Asked Questions');
  if (faqIdx === -1) return faqs;
  const sub = html.slice(faqIdx, faqIdx + 4000);
  const qRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = qRegex.exec(sub)) !== null) {
    const q = match[1].replace(/<[^>]+>/g, '').trim();
    const a = match[2].replace(/<[^>]+>/g, '').trim();
    if (q && a && q.length > 5 && a.length > 10 && !q.includes('Related')) {
      faqs.push({ q, a });
    }
  }
  return faqs;
}

function extractHowTo(html, toolName, toolId) {
  const match = html.match(/<h2[^>]*>([^<]*?How to Use[^<]*?)<\/h2>\s*<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (!match) return null;
  const rawTitle = match[1].replace(/<[^>]+>/g, '').trim();
  const olContent = match[2];
  const liRegex = /<li><strong[^>]*>([\s\S]*?)<\/strong>\s*:?\s*([\s\S]*?)<\/li>/gi;
  const steps = [];
  let m;
  let pos = 1;
  while ((m = liRegex.exec(olContent)) !== null) {
    const name = m[1].replace(/<[^>]+>/g, '').replace(/:$/, '').trim();
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (name && text) {
      steps.push({
        "@type": "HowToStep",
        "position": pos++,
        "name": name,
        "text": text
      });
    }
  }
  if (steps.length === 0) return null;
  return {
    "@type": "HowTo",
    "@id": `https://tabkit.tools/${toolId}#howto`,
    "name": rawTitle || `How to Use ${toolName}`,
    "step": steps
  };
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['about.html','privacy.html','terms.html','contact.html','report-issue.html','index.html','faq.html','guide.html'].includes(f));

let upgraded = 0;
let howToCount = 0;

files.forEach(file => {
  const toolId = file.replace('.html', '');
  const tool = registry[toolId] || (toolId === 'random-password-generator' ? registry['secure-password-generator'] : null);
  if (!tool) {
    console.warn('No registry entry for:', file);
    return;
  }

  let html = fs.readFileSync(file, 'utf8');

  // Extract meta description
  let desc = tool.description;
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  if (descMatch) {
    desc = descMatch[1].trim();
  }

  const category = tool.category || 'Utilities';
  const categorySlug = CATEGORY_SLUGS[category] || 'tools';
  const appCategory = APP_CATEGORIES[category] || 'UtilitiesApplication';
  const faqs = extractFaq(html);
  const howTo = extractHowTo(html, tool.name, toolId);

  // Build clean graph
  const graph = [
    {
      "@type": "WebApplication",
      "@id": `https://tabkit.tools/${toolId}#app`,
      "name": tool.name,
      "url": `https://tabkit.tools/${toolId}`,
      "applicationCategory": appCategory,
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": desc
    },
    {
      "@type": "BreadcrumbList",
      "@id": `https://tabkit.tools/${toolId}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "TabKit",
          "item": "https://tabkit.tools/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category,
          "item": `https://tabkit.tools/#${categorySlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tool.name,
          "item": `https://tabkit.tools/${toolId}`
        }
      ]
    }
  ];

  if (howTo) {
    graph.push(howTo);
    howToCount++;
  }

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `https://tabkit.tools/${toolId}#faq`,
      "mainEntity": faqs.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
  }

  const jsonLdBlock = `  <script type="application/ld+json">\n  ${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;

  // Replace existing json-ld or insert before </head>
  if (html.includes('<script type="application/ld+json">')) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdBlock.trim());
  } else {
    html = html.replace('</head>', `${jsonLdBlock}\n</head>`);
  }

  fs.writeFileSync(file, html, 'utf8');
  upgraded++;
});

console.log(`Successfully synced Schema.org JSON-LD across ${upgraded} tool pages! (Injected HowTo schema into ${howToCount} pages)`);
