// Tool: svg-optimizer
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['svg-optimizer'] = Object.assign(window.TOOLS_REGISTRY['svg-optimizer'] || {}, {
  id: 'svg-optimizer',
  name: 'SVG Optimizer & React / CSS Exporter',
  category: 'Design',
  description: 'Clean and minify SVG markup, convert to CSS Data URIs, and export to React JSX components.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div class="flex gap-2 items-center">
        <textarea id="${toolId}_input" rows="3" class="flex-1 bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-text focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder="Paste <svg> markup here..."></textarea>
        <!-- Live preview box -->
        <div id="${toolId}_preview" class="w-16 h-16 rounded-xl border border-workspace-border bg-white flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-inner">
          <span class="text-[9px] font-mono text-gray-400">Preview</span>
        </div>
      </div>

      <div class="flex items-center justify-between border-b border-workspace-border pb-1">
        <div class="flex gap-1" id="${toolId}_tabs">
          <button data-type="svg" class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent">Minified</button>
          <button data-type="datauri" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">CSS URI</button>
          <button data-type="jsx" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">React JSX</button>
        </div>
        <button id="${toolId}_btnSample" class="text-[10px] font-mono text-workspace-accent hover:underline">Sample</button>
      </div>

      <div class="flex-1 relative min-h-[90px]">
        <textarea id="${toolId}_output" readonly class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-accent focus:outline-none resize-none leading-relaxed"></textarea>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_stats" class="text-workspace-muted">0 bytes</span>
        <button id="${toolId}_btnCopy" class="px-3 py-1 bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-workspace-text rounded-lg transition-colors">Copy Result</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    const output = document.getElementById(`${toolId}_output`);
    const preview = document.getElementById(`${toolId}_preview`);
    const btnSample = document.getElementById(`${toolId}_btnSample`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const tabsContainer = document.getElementById(`${toolId}_tabs`);
    const stats = document.getElementById(`${toolId}_stats`);

    let activeType = 'svg';

    function cleanSvg(raw) {
      if (!raw) return '';
      let s = raw.trim();
      // Remove xml header and doctype
      s = s.replace(/<\?xml[\s\S]*?\?>/gi, '');
      s = s.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
      s = s.replace(/<!--[\s\S]*?-->/g, '');
      s = s.replace(/\s+/g, ' ');
      s = s.replace(/>\s+</g, '><');
      return s.trim();
    }

    function toDataUri(minSvg) {
      const encoded = encodeURIComponent(minSvg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
      return `background-image: url("data:image/svg+xml,${encoded}");`;
    }

    function toJsx(minSvg) {
      let jsx = minSvg
        .replace(/class=/g, 'className=')
        .replace(/stroke-width=/g, 'strokeWidth=')
        .replace(/stroke-linecap=/g, 'strokeLinecap=')
        .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
        .replace(/fill-rule=/g, 'fillRule=')
        .replace(/clip-rule=/g, 'clipRule=')
        .replace(/<svg\s*/, '<svg {...props} ');
      return `import React from 'react';\n\nexport function SvgIcon(props) {\n  return (\n    ${jsx}\n  );\n}`;
    }

    function process() {
      const raw = input.value.trim();
      if (!raw) {
        output.value = '';
        preview.innerHTML = '<span class="text-[9px] font-mono text-gray-400">Preview</span>';
        stats.textContent = '0 bytes';
        return;
      }

      const minified = cleanSvg(raw);

      // Update visual preview safely
      if (minified.includes('<svg')) {
        preview.innerHTML = minified;
        const svgEl = preview.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('width', '100%');
          svgEl.setAttribute('height', '100%');
        }
      }

      if (activeType === 'svg') {
        output.value = minified;
      } else if (activeType === 'datauri') {
        output.value = toDataUri(minified);
      } else if (activeType === 'jsx') {
        output.value = toJsx(minified);
      }

      const origBytes = new Blob([raw]).size;
      const newBytes = new Blob([minified]).size;
      const saved = Math.max(0, Math.round(((origBytes - newBytes) / origBytes) * 100));
      stats.textContent = `${newBytes} B (Saved ${saved}%)`;
    }

    if (btnSample) {
      btnSample.onclick = () => {
        input.value = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
        process();
      };
    }

    if (input) input.addEventListener('input', process);

    if (tabsContainer) {
      tabsContainer.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          tabsContainer.querySelectorAll('button').forEach(b => {
            b.className = "px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text";
          });
          btn.className = "px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent";
          activeType = btn.dataset.type;
          process();
        };
      });
    }

    if (btnCopy) {
      btnCopy.onclick = () => {
        if (output && output.value) {
          navigator.clipboard.writeText(output.value);
          if (typeof showToast !== 'undefined') showToast('Copied result!');
        }
      };
    }

    process();
  }
});
