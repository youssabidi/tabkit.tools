// Tool: svg-to-png (Client-Side SVG to PNG & WebP Rasterizer)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['svg-to-png'] = Object.assign(window.TOOLS_REGISTRY['svg-to-png'] || {}, {
  id: 'svg-to-png',
  name: 'SVG to PNG & WebP Converter',
  category: 'Media & Design',
  standaloneUrl: '/svg-to-png',
  description: 'Convert SVG files and raw markup into crisp, high-DPI PNG or WebP raster images locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-4 font-sans text-xs">
      <!-- Top Grid: Upload & Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Input Column -->
        <div class="space-y-3">
          <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-4 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1 min-h-[110px]">
            <input type="file" id="${toolId}_fileInput" accept=".svg,image/svg+xml" class="hidden" />
            <svg class="w-7 h-7 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[260px]">Click or Drop .SVG File</span>
            <span class="text-[9px] text-workspace-muted">or paste SVG code below</span>
          </div>

          <div>
            <div class="flex items-center justify-between text-[10px] font-mono text-workspace-muted mb-1">
              <span>Paste Raw SVG XML:</span>
              <button id="${toolId}_sampleBtn" class="text-workspace-accent hover:underline">Load Sample</button>
            </div>
            <textarea id="${toolId}_rawInput" placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>...</textarea>" class="w-full h-28 bg-workspace-bg border border-workspace-border rounded-xl p-2.5 font-mono text-[11px] text-workspace-text focus:outline-none focus:border-workspace-accent resize-none"></textarea>
          </div>
        </div>

        <!-- Settings Column -->
        <div class="bg-workspace-bg/60 p-4 rounded-xl border border-workspace-border flex flex-col justify-between space-y-3">
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-white font-mono flex items-center justify-between">
              <span>Rasterization Settings</span>
              <span id="${toolId}_dimBadge" class="text-[10px] text-workspace-accent bg-workspace-accent/10 px-2 py-0.5 rounded">0 x 0 px</span>
            </h3>

            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div>
                <label class="text-workspace-muted block mb-1">Scale Multiplier:</label>
                <select id="${toolId}_scaleSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none focus:border-workspace-accent">
                  <option value="1">1x (Original Size)</option>
                  <option value="2" selected>2x (Retina High-DPI)</option>
                  <option value="3">3x (Super Resolution)</option>
                  <option value="4">4x (Ultra 4K Crisp)</option>
                </select>
              </div>
              <div>
                <label class="text-workspace-muted block mb-1">Output Format:</label>
                <select id="${toolId}_formatSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none focus:border-workspace-accent">
                  <option value="image/png" selected>PNG (Lossless & Alpha)</option>
                  <option value="image/webp">WebP (Compressed)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div>
                <label class="text-workspace-muted block mb-1">Background Fill:</label>
                <select id="${toolId}_bgSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none focus:border-workspace-accent">
                  <option value="transparent" selected>Transparent</option>
                  <option value="#ffffff">Solid White (#FFFFFF)</option>
                  <option value="#0f172a">Dark Slate (#0F172A)</option>
                  <option value="#000000">Pure Black (#000000)</option>
                </select>
              </div>
              <div>
                <label class="text-workspace-muted block mb-1">Custom Width (px):</label>
                <input id="${toolId}_customWidth" type="number" placeholder="Auto" min="16" max="8192" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-workspace-text focus:outline-none focus:border-workspace-accent" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-2 pt-2">
            <button id="${toolId}_downloadBtn" class="flex-1 bg-workspace-accent hover:bg-workspace-accent/90 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Image</span>
            </button>
            <button id="${toolId}_copyBtn" class="bg-workspace-surface hover:bg-workspace-border border border-workspace-border text-workspace-text font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Image</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Canvas Area -->
      <div class="flex-1 bg-workspace-bg border border-workspace-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden" style="background-image: radial-gradient(var(--tw-gradient-stops, #334155) 1px, transparent 1px); background-size: 16px 16px;">
        <div id="${toolId}_placeholder" class="text-center font-mono text-workspace-muted text-[11px] space-y-1">
          <svg class="w-8 h-8 mx-auto text-workspace-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Raster preview will appear here upon loading an SVG.</p>
        </div>
        <img id="${toolId}_previewImg" class="max-h-[240px] max-w-full object-contain hidden rounded shadow-lg border border-workspace-border/50" alt="Raster Preview" />
      </div>
    </div>
  `,
  init: (toolId) => {
    let currentSvgText = '';
    let currentBlob = null;
    let baseFileName = 'vector-export';

    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const rawInput = document.getElementById(`${toolId}_rawInput`);
    const sampleBtn = document.getElementById(`${toolId}_sampleBtn`);
    const scaleSelect = document.getElementById(`${toolId}_scaleSelect`);
    const formatSelect = document.getElementById(`${toolId}_formatSelect`);
    const bgSelect = document.getElementById(`${toolId}_bgSelect`);
    const customWidth = document.getElementById(`${toolId}_customWidth`);
    const dimBadge = document.getElementById(`${toolId}_dimBadge`);
    const downloadBtn = document.getElementById(`${toolId}_downloadBtn`);
    const copyBtn = document.getElementById(`${toolId}_copyBtn`);
    const previewImg = document.getElementById(`${toolId}_previewImg`);
    const placeholder = document.getElementById(`${toolId}_placeholder`);

    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad)" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" opacity="0.9" />
  <path d="M85 75 L130 100 L85 125 Z" fill="#6366f1" />
</svg>`;

    sampleBtn.addEventListener('click', () => {
      rawInput.value = sampleSvg;
      baseFileName = 'sample-icon';
      fileName.textContent = 'sample-icon.svg';
      renderRaster();
    });

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    rawInput.addEventListener('input', () => {
      renderRaster();
    });

    scaleSelect.addEventListener('change', renderRaster);
    formatSelect.addEventListener('change', renderRaster);
    bgSelect.addEventListener('change', renderRaster);
    customWidth.addEventListener('input', renderRaster);

    function handleFile(file) {
      baseFileName = file.name.replace(/\.[^/.]+$/, "");
      fileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        rawInput.value = e.target.result;
        renderRaster();
      };
      reader.readAsText(file);
    }

    async function renderRaster() {
      const svgText = rawInput.value.trim();
      if (!svgText || !svgText.includes('<svg')) {
        previewImg.classList.add('hidden');
        placeholder.classList.remove('hidden');
        dimBadge.textContent = '0 x 0 px';
        currentBlob = null;
        return;
      }

      currentSvgText = svgText;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) throw new Error('No root <svg> found');

        let origW = parseFloat(svgEl.getAttribute('width')) || 0;
        let origH = parseFloat(svgEl.getAttribute('height')) || 0;

        if (!origW || !origH) {
          const viewBox = svgEl.getAttribute('viewBox');
          if (viewBox) {
            const parts = viewBox.split(/[\s,]+/).map(Number);
            if (parts.length === 4) {
              origW = parts[2];
              origH = parts[3];
            }
          }
        }

        if (!origW) origW = 300;
        if (!origH) origH = 300;

        const scale = parseFloat(scaleSelect.value) || 1;
        let finalW = origW * scale;
        let finalH = origH * scale;

        const forcedW = parseFloat(customWidth.value);
        if (forcedW && forcedW > 0) {
          const ratio = forcedW / origW;
          finalW = forcedW;
          finalH = Math.round(origH * ratio);
        }

        finalW = Math.round(finalW);
        finalH = Math.round(finalH);

        dimBadge.textContent = `${finalW} x ${finalH} px (${scale}x)`;

        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = finalW;
          canvas.height = finalH;
          const ctx = canvas.getContext('2d');

          const bg = bgSelect.value;
          if (bg !== 'transparent') {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, finalW, finalH);
          }

          ctx.drawImage(img, 0, 0, finalW, finalH);
          URL.revokeObjectURL(url);

          const format = formatSelect.value;
          canvas.toBlob((outBlob) => {
            currentBlob = outBlob;
            const previewUrl = URL.createObjectURL(outBlob);
            previewImg.src = previewUrl;
            previewImg.classList.remove('hidden');
            placeholder.classList.add('hidden');
          }, format, 0.95);
        };

        img.src = url;
      } catch (err) {
        console.error('Error rasterizing SVG:', err);
      }
    }

    downloadBtn.addEventListener('click', () => {
      if (!currentBlob) {
        if (window.showToast) window.showToast('Please upload or paste an SVG first', 'error');
        return;
      }
      const ext = formatSelect.value === 'image/webp' ? 'webp' : 'png';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(currentBlob);
      a.download = `${baseFileName}-${dimBadge.textContent.split(' ')[0]}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (window.showToast) window.showToast('Raster image downloaded!', 'success');
    });

    copyBtn.addEventListener('click', async () => {
      if (!currentBlob) {
        if (window.showToast) window.showToast('Please upload or paste an SVG first', 'error');
        return;
      }
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          // Clipboard standard requires image/png
          if (formatSelect.value !== 'image/png') {
            if (window.showToast) window.showToast('Switching to PNG for clipboard copy...', 'info');
          }
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': currentBlob })
          ]);
          if (window.showToast) window.showToast('PNG image copied to clipboard!', 'success');
        } else {
          throw new Error('Clipboard API not supported');
        }
      } catch (err) {
        if (window.showToast) window.showToast('Clipboard copy not supported by browser. Use Download instead.', 'error');
      }
    });
  }
});
