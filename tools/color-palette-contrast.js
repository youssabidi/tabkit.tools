// Tool: color-palette-contrast (WCAG 2.1 Contrast & Accessible Palette Studio)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['color-palette-contrast'] = Object.assign(window.TOOLS_REGISTRY['color-palette-contrast'] || {}, {
  id: 'color-palette-contrast',
  name: 'WCAG Color Contrast & Palette Studio',
  category: 'Media & Design',
  standaloneUrl: '/color-palette-contrast',
  description: 'Calculate WCAG 2.1 AA/AAA contrast ratios and test accessible foreground and background colors.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-4 font-sans text-xs">
      <!-- Color Pickers Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Foreground Color -->
        <div class="p-3 rounded-xl bg-workspace-bg border border-workspace-border space-y-2">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-workspace-muted font-mono">
            Text / Foreground Color
          </label>
          <div class="flex items-center gap-2.5">
            <input type="color" id="${toolId}_fgPicker" value="#FFFFFF" class="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0" />
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-workspace-muted font-mono text-xs">#</span>
              <input type="text" id="${toolId}_fgHex" value="FFFFFF" maxlength="6" class="w-full pl-6 pr-2.5 py-1.5 bg-workspace-surface border border-workspace-border rounded-lg font-mono text-xs uppercase font-semibold text-workspace-text focus:outline-none focus:border-workspace-accent" />
            </div>
          </div>
        </div>

        <!-- Background Color -->
        <div class="p-3 rounded-xl bg-workspace-bg border border-workspace-border space-y-2">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-workspace-muted font-mono">
            Background Color
          </label>
          <div class="flex items-center gap-2.5">
            <input type="color" id="${toolId}_bgPicker" value="#0F172A" class="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0" />
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center text-workspace-muted font-mono text-xs">#</span>
              <input type="text" id="${toolId}_bgHex" value="0F172A" maxlength="6" class="w-full pl-6 pr-2.5 py-1.5 bg-workspace-surface border border-workspace-border rounded-lg font-mono text-xs uppercase font-semibold text-workspace-text focus:outline-none focus:border-workspace-accent" />
            </div>
          </div>
        </div>
      </div>

      <!-- Controls: Swap & Presets -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-workspace-border/60">
        <button type="button" id="${toolId}_btnSwap" class="px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:bg-workspace-border/50 text-[11px] font-bold text-workspace-text transition flex items-center gap-1">
          <span>⇄ Swap</span>
        </button>
        <div class="flex items-center gap-1.5 text-[10px] font-mono">
          <span class="text-workspace-muted">Presets:</span>
          <button type="button" class="preset-btn px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700" data-fg="#FFFFFF" data-bg="#0F172A">Dark</button>
          <button type="button" class="preset-btn px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-300" data-fg="#0F172A" data-bg="#F8FAFC">Light</button>
          <button type="button" class="preset-btn px-2 py-0.5 rounded bg-indigo-600 text-white" data-fg="#FFFFFF" data-bg="#4F46E5">Indigo</button>
          <button type="button" class="preset-btn px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700" data-fg="#34D399" data-bg="#064E3B">Emerald</button>
        </div>
      </div>

      <!-- Contrast Score Banner -->
      <div class="p-3.5 rounded-xl bg-workspace-bg border border-workspace-border flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-workspace-muted block font-mono">Contrast Ratio</span>
          <div class="flex items-baseline gap-1.5">
            <span id="${toolId}_ratioVal" class="text-3xl font-black text-workspace-accent font-mono">16.14</span>
            <span class="text-xs font-bold text-workspace-muted">: 1</span>
          </div>
        </div>
        <div class="text-right">
          <span id="${toolId}_verdictBadge" class="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-0.5">
            Excellent (AAA)
          </span>
          <span id="${toolId}_verdictSub" class="text-[10px] text-workspace-muted block">Passes all WCAG standards</span>
        </div>
      </div>

      <!-- Compliance Matrix -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
        <div class="p-2 rounded-lg bg-workspace-bg border border-workspace-border">
          <span class="text-[9px] font-bold uppercase text-workspace-muted block">Normal Text AA</span>
          <span class="text-[10px] text-workspace-muted block">&ge; 4.5:1</span>
          <div id="${toolId}_badgeNormalAA" class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 mt-1">PASS</div>
        </div>
        <div class="p-2 rounded-lg bg-workspace-bg border border-workspace-border">
          <span class="text-[9px] font-bold uppercase text-workspace-muted block">Normal Text AAA</span>
          <span class="text-[10px] text-workspace-muted block">&ge; 7.0:1</span>
          <div id="${toolId}_badgeNormalAAA" class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 mt-1">PASS</div>
        </div>
        <div class="p-2 rounded-lg bg-workspace-bg border border-workspace-border">
          <span class="text-[9px] font-bold uppercase text-workspace-muted block">Large Text AA</span>
          <span class="text-[10px] text-workspace-muted block">&ge; 3.0:1</span>
          <div id="${toolId}_badgeLargeAA" class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 mt-1">PASS</div>
        </div>
        <div class="p-2 rounded-lg bg-workspace-bg border border-workspace-border">
          <span class="text-[9px] font-bold uppercase text-workspace-muted block">UI Elements AA</span>
          <span class="text-[10px] text-workspace-muted block">&ge; 3.0:1</span>
          <div id="${toolId}_badgeUiAA" class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 mt-1">PASS</div>
        </div>
      </div>

      <!-- Live Interactive Typography & Preview Box -->
      <div id="${toolId}_previewBox" class="p-4 rounded-xl transition-colors duration-150 border space-y-2 shadow-inner" style="background-color: #0F172A; color: #FFFFFF; border-color: rgba(255,255,255,0.15);">
        <div class="flex items-center justify-between border-b pb-1.5" style="border-color: currentColor; opacity: 0.25;">
          <span class="text-[10px] font-extrabold uppercase tracking-wider">Preview</span>
          <span class="text-[10px] opacity-75">16px Bold Headline</span>
        </div>
        <h4 class="text-base font-black tracking-tight leading-snug">
          The quick brown fox jumps over the lazy dog.
        </h4>
        <p class="text-[11px] leading-relaxed opacity-90">
          Readable copy ensures that text and controls can be perceived by people with visual impairments.
        </p>
        <div class="pt-1 flex items-center gap-2">
          <span class="px-2.5 py-1 rounded text-[10px] font-bold shadow-xs inline-block" id="${toolId}_btnPreview" style="background-color: #FFFFFF; color: #0F172A;">
            Button
          </span>
          <span class="text-[10px] font-semibold underline decoration-1 underline-offset-2">Link</span>
        </div>
      </div>

      <!-- Harmonious Shades -->
      <div class="space-y-1.5 pt-1 border-t border-workspace-border/60">
        <div class="flex items-center justify-between text-[10px] font-mono text-workspace-muted">
          <span>Harmonious Shades:</span>
          <span>Click swatch to copy</span>
        </div>
        <div id="${toolId}_swatches" class="grid grid-cols-6 gap-1.5"></div>
      </div>
    </div>
  `,
  init: (toolId) => {
    let currentFg = '#FFFFFF';
    let currentBg = '#0F172A';

    const fgPicker = document.getElementById(`${toolId}_fgPicker`);
    const fgHex = document.getElementById(`${toolId}_fgHex`);
    const bgPicker = document.getElementById(`${toolId}_bgPicker`);
    const bgHex = document.getElementById(`${toolId}_bgHex`);
    const btnSwap = document.getElementById(`${toolId}_btnSwap`);
    const previewBox = document.getElementById(`${toolId}_previewBox`);
    const btnPreview = document.getElementById(`${toolId}_btnPreview`);
    const ratioVal = document.getElementById(`${toolId}_ratioVal`);
    const verdictBadge = document.getElementById(`${toolId}_verdictBadge`);
    const verdictSub = document.getElementById(`${toolId}_verdictSub`);
    const swatchesContainer = document.getElementById(`${toolId}_swatches`);

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    function rgbToHex(r, g, b) {
      const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
      return '#' + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }

    function calcContrast(hex1, hex2) {
      try {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
      } catch (e) {
        return 1.0;
      }
    }

    function setBadge(id, isPass) {
      const el = document.getElementById(id);
      if (!el) return;
      if (isPass) {
        el.className = 'inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400 mt-1';
        el.textContent = 'PASS';
      } else {
        el.className = 'inline-block px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/10 text-rose-400 mt-1';
        el.textContent = 'FAIL';
      }
    }

    function update() {
      const ratio = calcContrast(currentFg, currentBg);
      if (ratioVal) ratioVal.textContent = ratio.toFixed(2);

      const normalAA = ratio >= 4.5;
      const normalAAA = ratio >= 7.0;
      const largeAA = ratio >= 3.0;
      const uiAA = ratio >= 3.0;

      setBadge(`${toolId}_badgeNormalAA`, normalAA);
      setBadge(`${toolId}_badgeNormalAAA`, normalAAA);
      setBadge(`${toolId}_badgeLargeAA`, largeAA);
      setBadge(`${toolId}_badgeUiAA`, uiAA);

      if (verdictBadge && verdictSub) {
        if (normalAAA) {
          verdictBadge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-0.5';
          verdictBadge.textContent = 'Excellent (AAA)';
          verdictSub.textContent = 'Passes all WCAG standards';
        } else if (normalAA) {
          verdictBadge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-0.5';
          verdictBadge.textContent = 'Good (AA)';
          verdictSub.textContent = 'Passes normal text standards';
        } else if (largeAA) {
          verdictBadge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-0.5';
          verdictBadge.textContent = 'Large Text Only';
          verdictSub.textContent = 'Fails for normal text';
        } else {
          verdictBadge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-block mb-0.5';
          verdictBadge.textContent = 'Fails WCAG';
          verdictSub.textContent = 'Insufficient contrast';
        }
      }

      if (previewBox) {
        previewBox.style.backgroundColor = currentBg;
        previewBox.style.color = currentFg;
        previewBox.style.borderColor = currentFg + '33';
      }
      if (btnPreview) {
        btnPreview.style.backgroundColor = currentFg;
        btnPreview.style.color = currentBg;
      }

      renderSwatches();
    }

    function renderSwatches() {
      if (!swatchesContainer) return;
      swatchesContainer.innerHTML = '';
      const rgb = hexToRgb(currentBg);
      const steps = [0.35, 0.55, 0.75, 0.95, 1.15, 1.35];

      steps.forEach(mult => {
        const hex = rgbToHex(rgb.r * mult, rgb.g * mult, rgb.b * mult);
        const chip = document.createElement('div');
        chip.className = 'p-1.5 rounded-lg border border-workspace-border bg-workspace-surface text-center cursor-pointer hover:scale-105 transition shadow-xs';
        chip.title = `Click to copy ${hex}`;
        chip.onclick = () => {
          navigator.clipboard.writeText(hex);
          if (typeof showToast === 'function') showToast(`Copied ${hex} to clipboard!`);
        };
        chip.innerHTML = `
          <div class="w-full h-5 rounded mb-1 shadow-inner" style="background-color: ${hex}"></div>
          <span class="text-[9px] font-mono font-bold text-workspace-text uppercase">${hex}</span>
        `;
        swatchesContainer.appendChild(chip);
      });
    }

    function sync(type, hex) {
      if (!hex) return;
      if (type === 'fg') {
        currentFg = hex.startsWith('#') ? hex : '#' + hex;
        if (fgPicker) fgPicker.value = currentFg;
        if (fgHex) fgHex.value = currentFg.replace('#', '').toUpperCase();
      } else {
        currentBg = hex.startsWith('#') ? hex : '#' + hex;
        if (bgPicker) bgPicker.value = currentBg;
        if (bgHex) bgHex.value = currentBg.replace('#', '').toUpperCase();
      }
      update();
    }

    if (fgPicker) fgPicker.addEventListener('input', (e) => sync('fg', e.target.value));
    if (bgPicker) bgPicker.addEventListener('input', (e) => sync('bg', e.target.value));

    if (fgHex) {
      fgHex.addEventListener('input', (e) => {
        const clean = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
        if (clean.length === 6) sync('fg', '#' + clean);
      });
    }

    if (bgHex) {
      bgHex.addEventListener('input', (e) => {
        const clean = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
        if (clean.length === 6) sync('bg', '#' + clean);
      });
    }

    if (btnSwap) {
      btnSwap.addEventListener('click', () => {
        const temp = currentFg;
        currentFg = currentBg;
        currentBg = temp;
        sync('fg', currentFg);
        sync('bg', currentBg);
      });
    }

    const card = document.getElementById(`card_${toolId}`);
    if (card) {
      const presetButtons = card.querySelectorAll('.preset-btn');
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const fg = btn.getAttribute('data-fg');
          const bg = btn.getAttribute('data-bg');
          sync('fg', fg);
          sync('bg', bg);
        });
      });
    }

    update();
  }
});
