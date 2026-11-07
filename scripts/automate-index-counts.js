const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add data-category-badge to the 6 category containers
const badgeReplacements = [
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Documents & PDF</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">17</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Documents & PDF</h3>\n              <span data-category-badge="Documents & PDF" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">17</span>'
  },
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Developer & Code</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">8</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Developer & Code</h3>\n              <span data-category-badge="Developer & Code" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">8</span>'
  },
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Privacy & Security</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">6</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Privacy & Security</h3>\n              <span data-category-badge="Privacy & Security" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">6</span>'
  },
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Text & Data</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">15</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Text & Data</h3>\n              <span data-category-badge="Text & Data" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">15</span>'
  },
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Media & Design</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">9</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Media & Design</h3>\n              <span data-category-badge="Media & Design" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">9</span>'
  },
  {
    search: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Productivity & Math</h3>\n              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">9</span>',
    replace: '<h3 class="text-xs font-bold uppercase font-mono tracking-wider text-workspace-text">Productivity & Math</h3>\n              <span data-category-badge="Productivity & Math" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-muted">9</span>'
  }
];

badgeReplacements.forEach(b => {
  if (html.includes(b.search)) {
    html = html.replace(b.search, b.replace);
    console.log('Added data-category-badge for:', b.replace.match(/data-category-badge="([^"]+)"/)[1]);
  }
});

// 2. Add updateDynamicToolCounts() logic in script
const dynamicCountsFunction = `
    function updateDynamicToolCounts() {
      if (typeof TOOLS_REGISTRY === 'undefined') return;
      const tools = Object.values(TOOLS_REGISTRY);
      const total = tools.length;
      
      const navLabel = document.getElementById('offlineIndicatorLabel');
      if (navLabel) navLabel.textContent = \`100% Local • \${total} Tools\`;

      const searchBtnText = document.querySelector('#btnOpenCommandPalette span.group-hover\\\\:text-workspace-text');
      if (searchBtnText) searchBtnText.textContent = \`Search \${total} tools...\`;

      const allFilterBtn = document.querySelector('.cmd-cat-btn');
      if (allFilterBtn && allFilterBtn.textContent.startsWith('All')) {
        allFilterBtn.textContent = \`All (\${total})\`;
      }

      const cmdInput = document.getElementById('commandInput');
      if (cmdInput) cmdInput.placeholder = \`Search \${total} tools or filter by name...\`;

      const categoryCounts = {};
      tools.forEach(t => {
        const cat = t.category || 'Utilities';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      document.querySelectorAll('[data-category-badge]').forEach(el => {
        const cat = el.getAttribute('data-category-badge');
        if (categoryCounts[cat]) {
          el.textContent = categoryCounts[cat];
        }
      });
    }
`;

if (!html.includes('updateDynamicToolCounts')) {
  html = html.replace('document.addEventListener(\'DOMContentLoaded\', () => {', `${dynamicCountsFunction}\n    document.addEventListener('DOMContentLoaded', () => {\n      updateDynamicToolCounts();`);
  console.log('Injected updateDynamicToolCounts() into DOMContentLoaded');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated with dynamic counts automation!');
