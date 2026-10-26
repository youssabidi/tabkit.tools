// Tool: favicon-generator (Client-Side Favicon & PWA App Icon Generator Studio)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['favicon-generator'] = Object.assign(window.TOOLS_REGISTRY['favicon-generator'] || {}, {
  id: 'favicon-generator',
  name: 'Favicon & PWA App Icon Generator',
  category: 'Media & Design',
  standaloneUrl: '/favicon-generator',
  description: 'Generate multi-resolution favicons, Apple touch icons, and Android PWA manifest icons from any image in-browser.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Upload Zone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-4 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="hidden" />
        <svg class="w-7 h-7 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[260px]">Click or Drop PNG / SVG / JPG</span>
        <span class="text-[9px] text-workspace-muted">Square 512x512+ recommended • 100% Client-Side Canvas</span>
      </div>

      <!-- Settings Bar -->
      <div class="bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border space-y-2">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Icon Shape / Padding:</label>
            <select id="${toolId}_shapeSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="square" selected>Full Square (Original)</option>
              <option value="rounded">Rounded Squircle (18% Radius)</option>
              <option value="circle">Circle Mask</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Background Fill:</label>
            <select id="${toolId}_bgSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="transparent" selected>Transparent (PNG default)</option>
              <option value="#ffffff">Solid White (#FFFFFF)</option>
              <option value="#0f172a">Dark Slate (#0F172A)</option>
              <option value="#10b981">Emerald Green (#10B981)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Generated Previews Grid -->
      <div class="flex-1 bg-workspace-bg border border-workspace-border rounded-xl p-3 flex flex-col justify-center">
        <div class="text-[10px] text-workspace-muted mb-2 font-mono flex items-center justify-between">
          <span>Generated Asset Suite</span>
          <span id="${toolId}_stats" class="text-workspace-accent">Awaiting image upload</span>
        </div>
        <div id="${toolId}_previewGrid" class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono text-[9px]">
          <!-- Placeholders -->
          <div class="p-2 border border-workspace-border rounded-lg bg-workspace-surface/50 flex flex-col items-center gap-1.5">
            <div class="w-10 h-10 rounded bg-workspace-border/40 flex items-center justify-center text-workspace-muted">16px</div>
            <span class="text-workspace-muted truncate w-full">favicon-16.png</span>
          </div>
          <div class="p-2 border border-workspace-border rounded-lg bg-workspace-surface/50 flex flex-col items-center gap-1.5">
            <div class="w-10 h-10 rounded bg-workspace-border/40 flex items-center justify-center text-workspace-muted">32px</div>
            <span class="text-workspace-muted truncate w-full">favicon-32.png</span>
          </div>
          <div class="p-2 border border-workspace-border rounded-lg bg-workspace-surface/50 flex flex-col items-center gap-1.5">
            <div class="w-10 h-10 rounded bg-workspace-border/40 flex items-center justify-center text-workspace-muted">180px</div>
            <span class="text-workspace-muted truncate w-full">apple-touch</span>
          </div>
          <div class="p-2 border border-workspace-border rounded-lg bg-workspace-surface/50 flex flex-col items-center gap-1.5">
            <div class="w-10 h-10 rounded bg-workspace-border/40 flex items-center justify-center text-workspace-muted">192px</div>
            <span class="text-workspace-muted truncate w-full">icon-192.png</span>
          </div>
          <div class="p-2 border border-workspace-border rounded-lg bg-workspace-surface/50 flex flex-col items-center gap-1.5">
            <div class="w-10 h-10 rounded bg-workspace-border/40 flex items-center justify-center text-workspace-muted">512px</div>
            <span class="text-workspace-muted truncate w-full">icon-512.png</span>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <button id="${toolId}_btnCopyHtml" class="px-2.5 py-1.5 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-text hover:border-workspace-accent transition-all">Copy &lt;head&gt; HTML</button>
        <button id="${toolId}_btnDownloadAll" class="px-3.5 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 transition-all shadow-sm">Download All Icons</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const shapeSelect = document.getElementById(`${toolId}_shapeSelect`);
    const bgSelect = document.getElementById(`${toolId}_bgSelect`);
    const previewGrid = document.getElementById(`${toolId}_previewGrid`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnCopyHtml = document.getElementById(`${toolId}_btnCopyHtml`);
    const btnDownloadAll = document.getElementById(`${toolId}_btnDownloadAll`);

    if (!dropzone || !fileInput) return;

    let loadedImage = null;
    const SIZES = [
      { size: 16, name: 'favicon-16x16.png', label: '16x16 Favicon' },
      { size: 32, name: 'favicon-32x32.png', label: '32x32 Desktop' },
      { size: 180, name: 'apple-touch-icon.png', label: '180x180 iOS' },
      { size: 192, name: 'icon-192.png', label: '192x192 Android' },
      { size: 512, name: 'icon-512.png', label: '512x512 PWA Splash' }
    ];

    let generatedAssets = [];

    function renderIcons() {
      if (!loadedImage) return;

      generatedAssets = [];
      previewGrid.innerHTML = '';

      const shape = shapeSelect.value;
      const bg = bgSelect.value;

      SIZES.forEach(target => {
        const canvas = document.createElement('canvas');
        canvas.width = target.size;
        canvas.height = target.size;
        const ctx = canvas.getContext('2d');

        // Background
        if (bg !== 'transparent') {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, target.size, target.size);
        }

        // Shape Clipping
        ctx.save();
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(target.size / 2, target.size / 2, target.size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        } else if (shape === 'rounded') {
          const radius = target.size * 0.18;
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(target.size - radius, 0);
          ctx.quadraticCurveTo(target.size, 0, target.size, radius);
          ctx.lineTo(target.size, target.size - radius);
          ctx.quadraticCurveTo(target.size, target.size, target.size - radius, target.size);
          ctx.lineTo(radius, target.size);
          ctx.quadraticCurveTo(0, target.size, 0, target.size - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.clip();
        }

        ctx.drawImage(loadedImage, 0, 0, target.size, target.size);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        generatedAssets.push({ name: target.name, dataUrl, size: target.size });

        // Add preview card
        const card = document.createElement('div');
        card.className = 'p-2 border border-workspace-border hover:border-workspace-accent rounded-lg bg-workspace-surface transition-all flex flex-col items-center gap-1.5 cursor-pointer group shadow-sm';
        card.title = `Click to download ${target.name}`;
        card.innerHTML = `
          <div class="w-10 h-10 rounded bg-checkerboard flex items-center justify-center overflow-hidden border border-workspace-border/50">
            <img src="${dataUrl}" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" alt="${target.name}" />
          </div>
          <span class="text-workspace-text font-bold text-[9px] truncate w-full">${target.size}px</span>
          <span class="text-workspace-accent text-[8px] hover:underline">Download</span>
        `;
        card.addEventListener('click', () => {
          downloadDataUrl(dataUrl, target.name);
        });
        previewGrid.appendChild(card);
      });

      stats.textContent = `${SIZES.length} assets ready`;
    }

    function downloadDataUrl(dataUrl, filename) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof showToast !== 'undefined') showToast(`Downloaded ${filename}`);
    }

    function processImageFile(file) {
      fileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          loadedImage = img;
          renderIcons();
          if (typeof showToast !== 'undefined') showToast(`Loaded ${img.width}x${img.height} source image`);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImageFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processImageFile(e.target.files[0]);
      }
    });

    shapeSelect.addEventListener('change', renderIcons);
    bgSelect.addEventListener('change', renderIcons);

    // Copy HTML Tags
    btnCopyHtml.addEventListener('click', () => {
      const snippet = `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">\n<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">`;
      navigator.clipboard.writeText(snippet).then(() => {
        if (typeof showToast !== 'undefined') showToast('Copied <head> icon tags to clipboard!');
      });
    });

    // Download All
    btnDownloadAll.addEventListener('click', () => {
      if (generatedAssets.length === 0) {
        if (typeof showToast !== 'undefined') showToast('Please upload an image first.', 'error');
        return;
      }
      generatedAssets.forEach((asset, idx) => {
        setTimeout(() => {
          downloadDataUrl(asset.dataUrl, asset.name);
        }, idx * 200);
      });
      if (typeof showToast !== 'undefined') showToast(`Triggered download for all ${generatedAssets.length} icons!`);
    });
  }
});
