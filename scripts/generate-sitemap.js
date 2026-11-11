const fs = require('fs');

const HIGH_PRIORITY_TOOLS = [
  'bank-statement-to-excel',
  'pdf-splitter',
  'pdf-merger',
  'json-formatter',
  'csv-to-excel',
  'invoice-generator',
  'image-compressor',
  'base64-encoder-decoder',
  'convert-chase-statement-to-excel',
  'secure-password-generator'
];

const SUPPORT_PAGES = {
  'about.html': { priority: '0.8', freq: 'monthly' },
  'guide.html': { priority: '0.8', freq: 'monthly' },
  'faq.html': { priority: '0.8', freq: 'monthly' },
  'privacy.html': { priority: '0.7', freq: 'monthly' },
  'terms.html': { priority: '0.7', freq: 'monthly' },
  'contact.html': { priority: '0.7', freq: 'monthly' },
  'report-issue.html': { priority: '0.6', freq: 'monthly' }
};

const today = new Date().toISOString().split('T')[0];

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html');
const entries = [];

// 1. Root page
entries.push({
  url: 'https://tabkit.tools/',
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0'
});

// 2. Support pages
Object.keys(SUPPORT_PAGES).forEach(page => {
  if (fs.existsSync(page)) {
    const slug = page.replace('.html', '');
    entries.push({
      url: `https://tabkit.tools/${slug}`,
      lastmod: today,
      changefreq: SUPPORT_PAGES[page].freq,
      priority: SUPPORT_PAGES[page].priority
    });
  }
});

// 3. Tool pages (only canonical pages, skip aliases pointing elsewhere)
files.forEach(f => {
  if (f === 'index.html' || SUPPORT_PAGES[f]) return;
  const content = fs.readFileSync(f, 'utf8');
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const slug = f.replace('.html', '');
  const expectedUrl = `https://tabkit.tools/${slug}`;

  // If canonical points elsewhere (e.g. random-password-generator -> secure-password-generator), skip
  if (canonMatch && canonMatch[1] !== expectedUrl) {
    console.log(`Skipping alias ${f} -> canonical: ${canonMatch[1]}`);
    return;
  }

  const isHighPri = HIGH_PRIORITY_TOOLS.includes(slug);
  entries.push({
    url: expectedUrl,
    lastmod: today,
    changefreq: isHighPri ? 'daily' : 'weekly',
    priority: isHighPri ? '0.9' : '0.8'
  });
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
entries.forEach(e => {
  xml += `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>\n`;
});
xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log(`Generated sitemap.xml with ${entries.length} canonical URLs and date ${today}!`);
