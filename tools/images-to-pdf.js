// Tool: images-to-pdf (Client-Side Images to PDF Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['images-to-pdf'] = Object.assign(window.TOOLS_REGISTRY['images-to-pdf'] || {}, {
  id: 'images-to-pdf',
  name: 'Client-Side Images to PDF Converter',
  category: 'Documents & PDF',
  standaloneUrl: '/images-to-pdf.html',
  description: 'Convert JPG, PNG, and WebP photos or scans into a clean multi-page PDF document with zero uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/jpeg,image/png,image/webp,image/gif" multiple class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop Images (JPG, PNG, WebP)</span>
        <span class="text-[9px] text-workspace-muted">Multi-Image Batch • 100% In-Browser</span>
      </div>

      <!-- Settings & Images List -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border flex-1 flex flex-col min-h-[140px]">
        <div class="flex items-center justify-between text-[10px] font-mono pb-1 border-b border-workspace-border">
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">Page Size:</span>
            <select id="${toolId}_pageSize" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-workspace-text focus:outline-none focus:border-workspace-accent">
              <option value="fit">Fit to Image</option>
              <option value="a4-portrait" selected>A4 Portrait</option>
              <option value="a4-landscape">A4 Landscape</option>
              <option value="letter">US Letter</option>
            </select>
          </div>
          <button id="${toolId}_btnClear" class="text-workspace-muted hover:text-workspace-danger hidden">Clear All</button>
        </div>

        <!-- Image Items List -->
        <div id="${toolId}_imageList" class="flex-1 overflow-y-auto space-y-1.5 max-h-[140px] pr-1">
          <div id="${toolId}_emptyHint" class="text-center py-6 text-workspace-muted text-[11px]">No images added yet</div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Add at least 1 image</span>
        <button id="${toolId}_btnConvert" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Generate PDF</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const imageList = document.getElementById(`${toolId}_imageList`);
    const pageSizeSelect = document.getElementById(`${toolId}_pageSize`);
    const btnClear = document.getElementById(`${toolId}_btnClear`);
    const status = document.getElementById(`${toolId}_status`);
    const btnConvert = document.getElementById(`${toolId}_btnConvert`);
    const emptyHint = document.getElementById(`${toolId}_emptyHint`);

    let loadedImages = [];

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
      if (e.dataTransfer.files?.length) handleFiles(Array.from(e.dataTransfer.files));
    };

    fileInput.onchange = (e) => {
      if (e.target.files?.length) handleFiles(Array.from(e.target.files));
      fileInput.value = '';
    };

    btnClear.onclick = () => {
      loadedImages = [];
      renderImages();
    };

    function handleFiles(files) {
      const valid = files.filter(f => f.type.startsWith('image/'));
      if (!valid.length) {
        if (typeof showToast !== 'undefined') showToast('Please select image files (JPG, PNG, WebP)', 'error');
        return;
      }

      valid.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          loadedImages.push({
            id: 'img_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            dataUrl: e.target.result,
            file: file
          });
          renderImages();
        };
        reader.readAsDataURL(file);
      });
    }

    function renderImages() {
      if (loadedImages.length === 0) {
        imageList.innerHTML = '';
        imageList.appendChild(emptyHint);
        emptyHint.classList.remove('hidden');
        btnClear.classList.add('hidden');
        btnConvert.disabled = true;
        status.textContent = 'Add at least 1 image';
        return;
      }

      emptyHint.classList.add('hidden');
      btnClear.classList.remove('hidden');
      btnConvert.disabled = false;
      status.textContent = `${loadedImages.length} image${loadedImages.length === 1 ? '' : 's'} ready`;

      imageList.innerHTML = loadedImages.map((img, idx) => `
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-workspace-surface border border-workspace-border text-[11px] group">
          <div class="flex items-center gap-2 overflow-hidden mr-2">
            <img src="${img.dataUrl}" class="w-7 h-7 object-cover rounded border border-workspace-border shrink-0" alt="" />
            <span class="text-[10px] font-mono text-workspace-muted shrink-0">${idx + 1}.</span>
            <span class="font-mono text-workspace-text truncate" title="${escapeHtml(img.name)}">${escapeHtml(img.name)}</span>
            <span class="text-[9px] text-workspace-muted font-mono shrink-0">${img.size}</span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="window._imgPdfMove('${toolId}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="text-workspace-muted hover:text-workspace-text disabled:opacity-20 px-1" title="Move Up">&uarr;</button>
            <button onclick="window._imgPdfMove('${toolId}', ${idx}, 1)" ${idx === loadedImages.length - 1 ? 'disabled' : ''} class="text-workspace-muted hover:text-workspace-text disabled:opacity-20 px-1" title="Move Down">&darr;</button>
            <button onclick="window._imgPdfRemove('${toolId}', ${idx})" class="text-workspace-muted hover:text-workspace-danger px-1" title="Remove">&times;</button>
          </div>
        </div>
      `).join('');
    }

    window._imgPdfMove = (id, idx, direction) => {
      if (id !== toolId) return;
      const target = idx + direction;
      if (target < 0 || target >= loadedImages.length) return;
      const item = loadedImages.splice(idx, 1)[0];
      loadedImages.splice(target, 0, item);
      renderImages();
    };

    window._imgPdfRemove = (id, idx) => {
      if (id !== toolId) return;
      loadedImages.splice(idx, 1);
      renderImages();
    };

    // Helper: Convert any image (including WebP/GIF) to a clean PNG ArrayBuffer via Canvas
    function convertDataUrlToPngBuffer(dataUrl) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (!blob) return reject(new Error('Canvas conversion failed'));
            const buf = await blob.arrayBuffer();
            resolve({ buffer: buf, width: canvas.width, height: canvas.height });
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = dataUrl;
      });
    }

    btnConvert.onclick = async () => {
      if (loadedImages.length === 0) return;
      status.textContent = 'Building PDF document...';
      btnConvert.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const doc = await lib.PDFDocument.create();
        const mode = pageSizeSelect.value;

        // Standard Page Sizes in PostScript points (72 points per inch)
        const SIZES = {
          'a4-portrait': [595.28, 841.89],
          'a4-landscape': [841.89, 595.28],
          'letter': [612.00, 792.00]
        };

        for (const item of loadedImages) {
          const converted = await convertDataUrlToPngBuffer(item.dataUrl);
          const embedded = await doc.embedPng(converted.buffer);

          let pageWidth, pageHeight, drawX, drawY, drawWidth, drawHeight;

          if (mode === 'fit') {
            pageWidth = converted.width;
            pageHeight = converted.height;
            drawX = 0;
            drawY = 0;
            drawWidth = converted.width;
            drawHeight = converted.height;
          } else {
            const dims = SIZES[mode] || SIZES['a4-portrait'];
            pageWidth = dims[0];
            pageHeight = dims[1];
            const margin = 20;
            const maxW = pageWidth - (margin * 2);
            const maxH = pageHeight - (margin * 2);

            const scale = Math.min(maxW / converted.width, maxH / converted.height);
            drawWidth = converted.width * scale;
            drawHeight = converted.height * scale;
            drawX = (pageWidth - drawWidth) / 2;
            drawY = (pageHeight - drawHeight) / 2;
          }

          const page = doc.addPage([pageWidth, pageHeight]);
          page.drawImage(embedded, {
            x: drawX,
            y: drawY,
            width: drawWidth,
            height: drawHeight
          });
        }

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `images-compiled-${Date.now().toString().slice(-4)}.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        status.textContent = `Generated PDF with ${loadedImages.length} pages!`;
        btnConvert.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`PDF created with ${loadedImages.length} images!`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Conversion failed';
        btnConvert.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to compile PDF', 'error');
      }
    };
  }
});
