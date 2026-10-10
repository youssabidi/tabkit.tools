// Tool: pdf-watermarker (Client-Side PDF Watermark & Stamp Tool)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-watermarker'] = Object.assign(window.TOOLS_REGISTRY['pdf-watermarker'] || {}, {
  id: 'pdf-watermarker',
  name: 'Client-Side PDF Watermark & Stamp',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-watermarker.html',
  description: 'Stamp custom text or diagonal watermark overlays onto every page of a PDF document with zero uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop PDF to Watermark</span>
        <span id="${toolId}_pageMeta" class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser</span>
      </div>

      <!-- Watermark Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <!-- Text Input & Presets -->
        <div>
          <label class="text-[10px] font-mono text-workspace-muted block mb-1">Watermark Text:</label>
          <input id="${toolId}_textInput" type="text" value="CONFIDENTIAL" placeholder="e.g. DRAFT, CONFIDENTIAL, COPY" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none mb-1.5" />
          <div class="flex flex-wrap gap-1" id="${toolId}_presetChips">
            <button type="button" class="preset-chip text-[9px] font-mono px-1.5 py-0.5 rounded bg-workspace-surface border border-workspace-border hover:border-workspace-accent text-workspace-muted hover:text-workspace-accent">CONFIDENTIAL</button>
            <button type="button" class="preset-chip text-[9px] font-mono px-1.5 py-0.5 rounded bg-workspace-surface border border-workspace-border hover:border-workspace-accent text-workspace-muted hover:text-workspace-accent">DRAFT</button>
            <button type="button" class="preset-chip text-[9px] font-mono px-1.5 py-0.5 rounded bg-workspace-surface border border-workspace-border hover:border-workspace-accent text-workspace-muted hover:text-workspace-accent">COPY</button>
            <button type="button" class="preset-chip text-[9px] font-mono px-1.5 py-0.5 rounded bg-workspace-surface border border-workspace-border hover:border-workspace-accent text-workspace-muted hover:text-workspace-accent">FOR REVIEW</button>
          </div>
        </div>

        <!-- Controls: Opacity & Angle & Color -->
        <div class="grid grid-cols-3 gap-2 pt-1 border-t border-workspace-border text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Opacity: <span id="${toolId}_opacityLabel" class="text-workspace-text">25%</span></label>
            <input id="${toolId}_opacityRange" type="range" min="10" max="75" value="25" class="w-full accent-workspace-accent cursor-pointer" />
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Color:</label>
            <select id="${toolId}_colorSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="red" selected>Red</option>
              <option value="gray">Gray</option>
              <option value="blue">Blue</option>
              <option value="emerald">Emerald</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Style:</label>
            <select id="${toolId}_styleSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="diagonal" selected>Diagonal (45°)</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF</span>
        <button id="${toolId}_btnApply" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Stamp & Save</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const pageMeta = document.getElementById(`${toolId}_pageMeta`);
    const textInput = document.getElementById(`${toolId}_textInput`);
    const presetChips = document.getElementById(`${toolId}_presetChips`);
    const opacityRange = document.getElementById(`${toolId}_opacityRange`);
    const opacityLabel = document.getElementById(`${toolId}_opacityLabel`);
    const colorSelect = document.getElementById(`${toolId}_colorSelect`);
    const styleSelect = document.getElementById(`${toolId}_styleSelect`);
    const status = document.getElementById(`${toolId}_status`);
    const btnApply = document.getElementById(`${toolId}_btnApply`);

    let pdfBytes = null;
    let totalPages = 0;
    let originalName = 'document';

    function ensurePdfLib() {
      return new Promise((resolve, reject) => {
        if (window.PDFLib) return resolve(window.PDFLib);
        const script = document.createElement('script');
        script.src = 'pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => {
          if (status) status.textContent = 'Error: Failed to load PDF engine';
          reject(new Error('Failed to load PDF engine'));
        };
        document.head.appendChild(script);
      });
    }

    dropzone.onclick = () => fileInput.click();
    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); };
    dropzone.ondragleave = () => dropzone.classList.remove('border-workspace-accent');
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files?.length) handleFile(e.dataTransfer.files[0]);
    };

    fileInput.onchange = (e) => {
      if (e.target.files?.length) handleFile(e.target.files[0]);
    };

    presetChips.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        textInput.value = btn.textContent;
      };
    });

    opacityRange.oninput = () => {
      opacityLabel.textContent = opacityRange.value + '%';
    };

    async function handleFile(file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        if (typeof showToast !== 'undefined') showToast('Please select a valid PDF', 'error');
        return;
      }

      status.textContent = 'Loading document...';
      originalName = file.name.replace(/\.pdf$/i, '');
      fileName.textContent = file.name;

      try {
        const lib = await ensurePdfLib();
        pdfBytes = await file.arrayBuffer();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        totalPages = doc.getPageCount();

        pageMeta.textContent = `${totalPages} page${totalPages === 1 ? '' : 's'} • ${(file.size / 1024).toFixed(1)} KB`;
        btnApply.disabled = false;
        status.textContent = `Ready (${totalPages} pages)`;
        if (typeof showToast !== 'undefined') showToast(`Loaded ${totalPages} pages`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Failed to load PDF';
        btnApply.disabled = true;
      }
    }

    btnApply.onclick = async () => {
      if (!pdfBytes) return;
      const stampText = textInput.value.trim();
      if (!stampText) {
        if (typeof showToast !== 'undefined') showToast('Enter watermark text', 'error');
        return;
      }

      status.textContent = 'Applying watermark...';
      btnApply.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const font = await doc.embedFont(lib.StandardFonts.HelveticaBold);
        const count = doc.getPageCount();

        // Color mapping
        const colors = {
          red: lib.rgb(0.9, 0.2, 0.2),
          gray: lib.rgb(0.5, 0.5, 0.5),
          blue: lib.rgb(0.2, 0.45, 0.9),
          emerald: lib.rgb(0.06, 0.72, 0.5)
        };
        const chosenColor = colors[colorSelect.value] || colors.red;
        const opacity = parseFloat(opacityRange.value) / 100;
        const isDiagonal = styleSelect.value === 'diagonal';

        for (let i = 0; i < count; i++) {
          const page = doc.getPage(i);
          const { width, height } = page.getSize();
          
          // Adaptive font size based on page width
          const fontSize = Math.min(width, height) / 8;
          const textWidth = font.widthOfTextAtSize(stampText, fontSize);
          const textHeight = font.heightAtSize(fontSize);

          if (isDiagonal) {
            // Center of the page
            const centerX = width / 2;
            const centerY = height / 2;
            const angleDeg = 45;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Offset to rotate around the text's visual center
            const x = centerX - (textWidth / 2) * Math.cos(angleRad) + (textHeight / 2) * Math.sin(angleRad);
            const y = centerY - (textWidth / 2) * Math.sin(angleRad) - (textHeight / 2) * Math.cos(angleRad);

            page.drawText(stampText, {
              x: x,
              y: y,
              size: fontSize,
              font: font,
              color: chosenColor,
              opacity: opacity,
              rotate: lib.degrees(angleDeg)
            });
          } else {
            page.drawText(stampText, {
              x: (width - textWidth) / 2,
              y: (height - textHeight) / 2,
              size: fontSize,
              font: font,
              color: chosenColor,
              opacity: opacity
            });
          }
        }

        const watermarkedBytes = await doc.save();
        const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${originalName}-watermarked.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        status.textContent = `Watermarked ${count} pages!`;
        btnApply.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`Successfully watermarked ${count} pages!`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Watermarking failed';
        btnApply.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to apply watermark', 'error');
      }
    };
  }
});
