const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Category IDs and scroll-mt-20
const categories = [
  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Documents & PDF</h3>',
    replace: '<div id="documents-pdf" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Documents & PDF</h3>' },
  
  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Developer & Code</h3>',
    replace: '<div id="developer-code" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Developer & Code</h3>' },

  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-amber-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Privacy & Security</h3>',
    replace: '<div id="privacy-security" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-amber-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Privacy & Security</h3>' },

  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-sky-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Text & Data</h3>',
    replace: '<div id="text-data" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-sky-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Text & Data</h3>' },

  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-violet-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Media & Design</h3>',
    replace: '<div id="media-design" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-violet-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Media & Design</h3>' },

  { search: '<div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-rose-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Productivity & Math</h3>',
    replace: '<div id="productivity-math" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3">\n            <div class="flex items-center gap-2 border-b border-workspace-border pb-2.5">\n              <span class="w-2 h-2 rounded-full bg-rose-400"></span>\n              <h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Productivity & Math</h3>' }
];

categories.forEach(cat => {
  if (!html.includes(cat.search)) {
    console.error('Failed to find category pattern:', cat.replace.match(/id="([^"]+)"/)[1]);
  } else {
    html = html.replace(cat.search, cat.replace);
    console.log('Added anchor ID for:', cat.replace.match(/id="([^"]+)"/)[1]);
  }
});

// 2. Update Schema.org JSON-LD to full @graph
const oldSchemaRegex = /<!-- Structured Data: WebSite & SearchAction JSON-LD -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/i;

const newSchema = `<!-- Structured Data: WebSite, WebApplication, BreadcrumbList & FAQPage JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tabkit.tools/#website",
        "name": "TabKit Tools",
        "url": "https://tabkit.tools/",
        "description": "Local-first browser workbench with 64 client-side utilities including PDF merge, bank statement converter, invoice generator, JSON formatting, and regex testing."
      },
      {
        "@type": "WebApplication",
        "@id": "https://tabkit.tools/#webapp",
        "name": "TabKit Tools Workbench",
        "url": "https://tabkit.tools/",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Modular in-browser productivity workbench and offline utility suite. Run PDF, developer, privacy, and text tools locally with zero cloud uploads."
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://tabkit.tools/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tabkit.tools/"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://tabkit.tools/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is TabKit Tools and how does it work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "TabKit Tools is a local-first browser workbench featuring 64 free developer, PDF, design, and calculation tools. All processing happens entirely within your web browser using HTML5, WebAssembly, and modern JavaScript APIs, meaning zero data or files are ever sent to remote servers."
            }
          },
          {
            "@type": "Question",
            "name": "Do my files, PDFs, or data get uploaded to any server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. None of your data, documents, images, or code snippets ever leave your device. All conversions, compression, encryption, and parsing run client-side in memory."
            }
          },
          {
            "@type": "Question",
            "name": "Can TabKit Tools work offline without an internet connection?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. TabKit Tools features an offline-first Service Worker architecture. Once loaded, you can disconnect your internet completely and all utilities continue functioning smoothly."
            }
          },
          {
            "@type": "Question",
            "name": "Is TabKit Tools free to use for commercial and professional work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. TabKit Tools is 100% free for personal, commercial, and enterprise workflows with no subscriptions, usage limits, or account requirements."
            }
          }
        ]
      }
    ]
  }
  </script>`;

if (!oldSchemaRegex.test(html)) {
  console.error('Failed to locate old schema in index.html');
} else {
  html = html.replace(oldSchemaRegex, newSchema);
  console.log('Replaced JSON-LD schema with complete @graph in index.html');
}

// 3. Add FAQ UI section before </main>
const faqSection = `
    <!-- ==================== WORKBENCH FAQ SECTION ==================== -->
    <section class="max-w-5xl mx-auto my-12 p-8 sm:p-10 rounded-3xl border border-workspace-border bg-workspace-surface/40 backdrop-blur-sm relative z-10">
      <div class="max-w-3xl mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-workspace-accent/10 border border-workspace-accent/25 text-workspace-accent text-xs font-mono mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-workspace-accent"></span>
          Common Questions
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Frequently Asked Questions
        </h2>
        <p class="text-xs sm:text-sm text-workspace-muted leading-relaxed">
          Everything you need to know about TabKit Tools, client-side privacy architecture, and offline browser processing.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="font-bold text-white flex items-center gap-2">
            <span class="text-workspace-accent font-mono text-xs">01.</span>
            What is TabKit Tools and how does it work?
          </h3>
          <p class="text-workspace-muted text-xs leading-relaxed">
            TabKit Tools is a modular in-browser workbench with 64 developer, PDF, finance, and productivity utilities. Unlike legacy SaaS converters, all transformations execute inside your device's browser memory using WebAssembly, Web Workers, and HTML5 APIs.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="font-bold text-white flex items-center gap-2">
            <span class="text-workspace-accent font-mono text-xs">02.</span>
            Do my files or documents get uploaded to any server?
          </h3>
          <p class="text-workspace-muted text-xs leading-relaxed">
            Never. Zero files, bank statements, code snippets, or passwords cross the network. Everything stays strictly inside your browser sandbox. You can verify this by inspecting the Network tab in your browser's Developer Tools.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="font-bold text-white flex items-center gap-2">
            <span class="text-workspace-accent font-mono text-xs">03.</span>
            Can TabKit Tools work completely offline?
          </h3>
          <p class="text-workspace-muted text-xs leading-relaxed">
            Yes. TabKit includes a Progressive Web App (PWA) Service Worker that caches static assets locally. Once opened, you can turn off Wi-Fi or go into Airplane mode and continue using all tools seamlessly.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="font-bold text-white flex items-center gap-2">
            <span class="text-workspace-accent font-mono text-xs">04.</span>
            Is TabKit Tools free for commercial &amp; business work?
          </h3>
          <p class="text-workspace-muted text-xs leading-relaxed">
            Yes, 100% free with no per-seat fees, paywalls, or limits. Financial analysts, developers, and businesses can safely parse confidential spreadsheets and PDFs without third-party compliance risk.
          </p>
        </div>
      </div>
    </section>
`;

if (html.includes('id="documents-pdf"') && !html.includes('WORKBENCH FAQ SECTION')) {
  html = html.replace('</main>', `${faqSection}\n  </main>`);
  console.log('Added FAQ section before </main> in index.html');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully!');
