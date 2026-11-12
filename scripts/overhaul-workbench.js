const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Canvas element alongside bg-dot-grid
if (!html.includes('id="ambientCanvas"')) {
  html = html.replace(
    '<div class="fixed inset-0 z-0 pointer-events-none bg-dot-grid opacity-30"></div>',
    '<div class="fixed inset-0 z-0 pointer-events-none bg-dot-grid opacity-25"></div>\n  <canvas id="ambientCanvas" class="fixed inset-0 z-0 pointer-events-none opacity-40"></canvas>'
  );
  console.log('1. Injected ambientCanvas background');
}

// 2. Add spotlight-card and card-specular to workbench card creation in renderWorkbench()
if (html.includes('glass-card tool-card p-5') && !html.includes('spotlight-card card-specular')) {
  html = html.replace(
    'glass-card tool-card p-5',
    'glass-card tool-card spotlight-card card-specular p-5'
  );
  console.log('2. Added spotlight-card & card-specular to workbench cards');
}

// 3. Add spotlight-card and card-specular to category directory cards
const categoryIds = ['documents-pdf', 'developer-code', 'privacy-security', 'text-data', 'media-design', 'productivity-math'];
categoryIds.forEach(id => {
  const oldRegex = new RegExp(`id="${id}" class="scroll-mt-20 p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-3"`, 'g');
  if (oldRegex.test(html)) {
    html = html.replace(oldRegex, `id="${id}" class="scroll-mt-20 spotlight-card card-specular p-5 sm:p-6 rounded-3xl bg-workspace-surface/60 border border-workspace-border hover:border-workspace-borderLight transition-all space-y-3"`);
    console.log(`3. Upgraded category card: ${id}`);
  }
});

// 4. Upgrade workspace tabs with btn-tactile and tab-pill-active
if (html.includes("bg-workspace-surface border-workspace-borderLight text-workspace-text font-bold shadow-sm")) {
  html = html.replace(
    "bg-workspace-surface border-workspace-borderLight text-workspace-text font-bold shadow-sm",
    "bg-workspace-surface border-workspace-borderLight text-workspace-text font-bold shadow-sm tab-pill-active"
  );
  console.log('4. Added tab-pill-active to active workspace tab');
}

// 5. Upgrade buttons with btn-tactile
const btnSelectors = [
  'id="btnOpenCommandPalette"',
  'id="btnAddToolBtn"',
  'id="btnNewDeck"',
  'id="btnResetWorkbench"',
  'id="btnExportConfig"',
  'id="btnImportConfig"'
];
btnSelectors.forEach(sel => {
  const match = html.match(new RegExp(`${sel}[^>]*class="([^"]+)"`));
  if (match && !match[1].includes('btn-tactile')) {
    html = html.replace(match[0], match[0].replace('class="', 'class="btn-tactile '));
    console.log(`5. Added btn-tactile to ${sel}`);
  }
});

// 6. Upgrade Command Palette Modal markup to include category filter pills
const oldPaletteModalHeader = `<input id="commandInput" type="text" placeholder="Type a tool name or command..." class="w-full bg-transparent text-base sm:text-sm text-workspace-text placeholder-workspace-muted focus:outline-none font-mono" />
        <kbd onclick="closeCommandPalette()" class="cursor-pointer px-2 py-1 rounded-md bg-workspace-bg border border-workspace-border text-[10px] font-mono text-workspace-muted hover:text-workspace-text hover:border-workspace-borderLight transition-colors">ESC</kbd>
      </div>
      <div id="commandResultsList" class="max-h-80 overflow-y-auto p-2 space-y-1 bg-workspace-surface"></div>`;

const newPaletteModalHeader = `<input id="commandInput" type="text" placeholder="Search 64 tools or filter by name..." class="w-full bg-transparent text-base sm:text-sm text-workspace-text placeholder-workspace-muted focus:outline-none font-mono" />
        <kbd onclick="closeCommandPalette()" class="cursor-pointer px-2 py-1 rounded-md bg-workspace-bg border border-workspace-border text-[10px] font-mono text-workspace-muted hover:text-workspace-text hover:border-workspace-borderLight transition-colors">ESC</kbd>
      </div>
      <!-- Quick Category Filter Pills -->
      <div id="commandCategoryPills" class="px-3.5 py-2 border-b border-workspace-border/50 bg-workspace-bg/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono shrink-0 select-none">
        <button type="button" onclick="setCommandCategoryFilter('All')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-accent bg-workspace-accent/15 text-workspace-accent font-semibold transition-all">All (64)</button>
        <button type="button" onclick="setCommandCategoryFilter('Documents & PDF')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">PDF &amp; Docs</button>
        <button type="button" onclick="setCommandCategoryFilter('Developer & Code')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">Developer</button>
        <button type="button" onclick="setCommandCategoryFilter('Privacy & Security')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">Privacy</button>
        <button type="button" onclick="setCommandCategoryFilter('Text & Data')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">Text &amp; Data</button>
        <button type="button" onclick="setCommandCategoryFilter('Media & Design')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">Media &amp; Design</button>
        <button type="button" onclick="setCommandCategoryFilter('Productivity & Math')" class="cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all">Productivity</button>
      </div>
      <div id="commandResultsList" class="max-h-96 overflow-y-auto p-2 space-y-1 bg-workspace-surface"></div>`;

if (html.includes(oldPaletteModalHeader)) {
  html = html.replace(oldPaletteModalHeader, newPaletteModalHeader);
  console.log('6. Upgraded Command Palette with Category Pills');
}

// 7. Add Command Category Filter script logic & Ambient Canvas Engine script before </body>
const scriptAdditions = `
    // ==========================================
    // AMBIENT AIR-GAP CANVAS ENGINE (genjutsu standard)
    // ==========================================
    (function initAmbientCanvas() {
      const canvas = document.getElementById('ambientCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      let animationFrameId = null;

      const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize, { passive: true });

      const particleCount = Math.min(Math.floor((width * height) / 30000), 45);
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.2 + 0.8,
          alpha: Math.random() * 0.35 + 0.15
        });
      }

      let mouse = { x: -999, y: -999 };
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }, { passive: true });

      let isTabActive = true;
      document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
        if (isTabActive && !animationFrameId) render();
      });

      function render() {
        if (!isTabActive) {
          animationFrameId = null;
          return;
        }
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            p.x += (dx / dist) * 1.0;
            p.y += (dy / dist) * 1.0;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(6, 182, 212, " + p.alpha + ")";
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const d2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (d2 < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = "rgba(6, 182, 212, " + (0.1 * (1 - d2 / 100)) + ")";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        animationFrameId = requestAnimationFrame(render);
      }
      render();
    })();

    // ==========================================
    // COMMAND PALETTE CATEGORY FILTER
    // ==========================================
    let commandActiveCategory = 'All';

    function setCommandCategoryFilter(cat) {
      commandActiveCategory = cat;
      const btns = document.querySelectorAll('.cmd-cat-btn');
      btns.forEach(btn => {
        const text = btn.textContent.trim();
        const matches = (cat === 'All' && text.startsWith('All')) ||
                        (cat === 'Documents & PDF' && text.includes('PDF')) ||
                        (cat === 'Developer & Code' && text.includes('Developer')) ||
                        (cat === 'Privacy & Security' && text.includes('Privacy')) ||
                        (cat === 'Text & Data' && text.includes('Text')) ||
                        (cat === 'Media & Design' && text.includes('Media')) ||
                        (cat === 'Productivity & Math' && text.includes('Productivity'));
        if (matches) {
          btn.className = 'cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-accent bg-workspace-accent/15 text-workspace-accent font-semibold transition-all';
        } else {
          btn.className = 'cmd-cat-btn px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface text-workspace-muted hover:text-workspace-text transition-all';
        }
      });
      const input = document.getElementById('commandInput');
      renderCommandList(input ? input.value : '');
    }
`;

// Also update renderCommandList to respect commandActiveCategory
const oldRenderCommandList = `function renderCommandList(query = '') {
      if (!commandResults || typeof TOOLS_REGISTRY === 'undefined') return;
      const q = query.toLowerCase().trim();
      commandFilteredTools = Object.values(TOOLS_REGISTRY).filter(t => 
        t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.category && t.category.toLowerCase().includes(q))
      );`;

const newRenderCommandList = `function renderCommandList(query = '') {
      if (!commandResults || typeof TOOLS_REGISTRY === 'undefined') return;
      const q = query.toLowerCase().trim();
      commandFilteredTools = Object.values(TOOLS_REGISTRY).filter(t => {
        const matchesCategory = commandActiveCategory === 'All' || t.category === commandActiveCategory;
        if (!matchesCategory) return false;
        if (!q) return true;
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.category && t.category.toLowerCase().includes(q));
      });`;

if (html.includes(oldRenderCommandList)) {
  html = html.replace(oldRenderCommandList, newRenderCommandList);
  console.log('7. Updated renderCommandList to respect category filters');
}

// Update updateCommandListHtml to show both Pin action and Standalone action link
const oldUpdateCommandList = `<button onclick="pinTool('\${t.id}'); closeCommandPalette();" id="cmd_item_\${idx}" class="w-full text-left p-3.5 rounded-xl flex items-center justify-between group transition-all border \${
            isSelected ? 'bg-workspace-accent/15 border-workspace-accent' : 'border-transparent hover:bg-workspace-surfaceHover hover:border-workspace-borderLight'
          } mb-1">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-workspace-text group-hover:text-workspace-accent transition-colors text-sm">\${escapeHtml(t.name)}</span>
                <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-workspace-bg text-workspace-muted border border-workspace-border">\${escapeHtml(t.category || 'Tool')}</span>
              </div>
              <div class="text-xs text-workspace-muted truncate max-w-[280px] sm:max-w-xs mt-0.5">\${escapeHtml(t.description)}</div>
            </div>
            \${isPinned ? '<span class="text-[10px] bg-workspace-bg border border-workspace-border px-2.5 py-1 rounded text-workspace-muted font-mono">Pinned</span>' : '<span class="text-xs font-bold text-workspace-accent font-mono bg-workspace-bg/50 px-2 py-1 rounded">Add +</span>'}
          </button>`;

const newUpdateCommandList = `<div id="cmd_item_\${idx}" class="w-full p-3 rounded-2xl flex items-center justify-between group transition-all border \${
            isSelected ? 'bg-workspace-accent/10 border-workspace-accent/60' : 'border-workspace-border/40 hover:bg-workspace-surfaceHover hover:border-workspace-borderLight'
          } mb-1.5">
            <div class="cursor-pointer flex-1 min-w-0 pr-3" onclick="pinTool('\${t.id}'); closeCommandPalette();">
              <div class="flex items-center gap-2 truncate">
                <span class="font-bold text-workspace-text group-hover:text-workspace-accent transition-colors text-sm truncate">\${escapeHtml(t.name)}</span>
                <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-workspace-bg text-workspace-muted border border-workspace-border shrink-0">\${escapeHtml(t.category || 'Tool')}</span>
              </div>
              <div class="text-xs text-workspace-muted truncate mt-0.5">\${escapeHtml(t.description)}</div>
            </div>
            <div class="flex items-center gap-2 shrink-0 font-mono">
              <a data-tk-href="/\${t.id}" target="_blank" rel="noopener noreferrer" class="btn-tactile px-2.5 py-1 rounded-lg border border-workspace-border hover:border-workspace-borderLight text-workspace-muted hover:text-workspace-text text-[11px] transition-colors flex items-center gap-1" title="Open standalone page in new tab">
                <span>↗</span>
                <span class="hidden sm:inline">Open</span>
              </a>
              <button type="button" onclick="pinTool('\${t.id}'); closeCommandPalette();" class="btn-tactile px-3 py-1 rounded-lg text-xs font-semibold \${
                isPinned 
                  ? 'bg-workspace-bg border border-workspace-border text-workspace-muted' 
                  : 'bg-workspace-accent hover:bg-workspace-accentHover text-black'
              }">
                \${isPinned ? 'Pinned' : '+ Pin'}
              </button>
            </div>
          </div>`;
      if (typeof hydrateDeferredLinks === 'function') hydrateDeferredLinks(commandResults);

if (html.includes(oldUpdateCommandList)) {
  html = html.replace(oldUpdateCommandList, newUpdateCommandList);
  console.log('8. Enhanced Command Palette list items with dual actions (Pin & Standalone)');
}

if (!html.includes('initAmbientCanvas')) {
  html = html.replace('</script>\n</body>', `${scriptAdditions}\n  </script>\n</body>`);
  console.log('9. Injected Canvas Engine and Category Filter scripts');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Workbench & index.html overhauled successfully!');
