// Tool: pdf-to-images (Client-Side PDF to PNG/JPG Images Extractor)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-to-images'] = Object.assign(window.TOOLS_REGISTRY['pdf-to-images'] || {}, {
  id: 'pdf-to-images',
  name: 'Client-Side PDF to Images (PNG/JPG)',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-to-images.html',
  description: 'Convert every page of a PDF document into high-resolution PNG or JPG images locally in your browser.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop PDF to Extract Images</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Canvas-Rendered In-Browser</span>
      </div>

      <!-- Controls -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Image Format:</label>
            <select id="${toolId}_formatSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="image/png" selected>PNG (Lossless, Best Quality)</option>
              <option value="image/jpeg">JPG (Smaller File Size)</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Render Resolution:</label>
            <select id="${toolId}_scaleSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="1.5" selected>1.5x (Crisp Standard)</option>
              <option value="2.0">2.0x (High-Res 300 DPI)</option>
              <option value="1.0">1.0x (Standard Web)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Rendered Pages Grid -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono overflow-hidden">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span id="${toolId}_stats">Rendered Pages (0)</span>
          <span class="text-[9px]">Click individual page to download</span>
        </div>
        <div id="${toolId}_pagesGrid" class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-1">
          <p class="text-workspace-muted text-center py-6 col-span-3">No PDF loaded yet</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF</span>
        <button id="${toolId}_btnDownloadAll" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all">Download All Pages</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const formatSelect = document.getElementById(`${toolId}_formatSelect`);
    const scaleSelect = document.getElementById(`${toolId}_scaleSelect`);
    const pagesGrid = document.getElementById(`${toolId}_pagesGrid`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnDownloadAll = document.getElementById(`${toolId}_btnDownloadAll`);
    const status = document.getElementById(`${toolId}_status`);

    let currentPdf = null;
    let renderedImages = [];
    let originalBaseName = 'page';

    function ensurePdfJs() {
      return new Promise((resolve, reject) => {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js library.'));
        document.head.appendChild(script);
      });
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    async function handleFile(file) {
      status.textContent = 'Rendering PDF pages...';
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");

      try {
        const pdfjs = await ensurePdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        currentPdf = await loadingTask.promise;

        await renderPages();
        status.textContent = 'All pages rendered!';
        btnDownloadAll.disabled = false;
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    async function renderPages() {
      if (!currentPdf) return;
      pagesGrid.innerHTML = '';
      renderedImages = [];

      const scale = parseFloat(scaleSelect.value) || 1.5;
      const format = formatSelect.value;
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';

      const totalPages = currentPdf.numPages;
      const MAX_PAGES = 50;
      const pagesToRender = Math.min(totalPages, MAX_PAGES);

      stats.textContent = totalPages > MAX_PAGES 
        ? `Rendering first ${MAX_PAGES} of ${totalPages} pages (Memory Safeguard)...` 
        : `Rendering ${totalPages} pages...`;

      for (let i = 1; i <= pagesToRender; i++) {
        status.textContent = `Rendering page ${i} of ${pagesToRender}...`;
        const page = await currentPdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL(format, 0.92);
        renderedImages.push({ pageNum: i, dataUrl, ext });

        // Add thumbnail card to grid
        const card = document.createElement('div');
        card.className = 'border border-workspace-border rounded-lg bg-workspace-surface p-1.5 flex flex-col items-center hover:border-workspace-accent transition-all cursor-pointer group';
        card.innerHTML = `
          <div class="w-full aspect-[3/4] bg-workspace-bg rounded overflow-hidden flex items-center justify-center mb-1">
            <img src="${dataUrl}" alt="Page ${i}" class="w-full h-full object-contain">
          </div>
          <div class="w-full flex items-center justify-between text-[9px] text-workspace-muted px-1">
            <span>Page ${i}</span>
            <span class="text-workspace-accent group-hover:underline">Save</span>
          </div>
        `;
        card.addEventListener('click', () => {
          downloadImage(dataUrl, `${originalBaseName}_page_${i}.${ext}`);
        });
        pagesGrid.appendChild(card);
      }

      stats.textContent = totalPages > MAX_PAGES
        ? `Rendered ${renderedImages.length} of ${totalPages} pages (Capped to prevent memory crash)`
        : `Rendered Pages (${renderedImages.length})`;
    }

    function downloadImage(dataUrl, name) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    formatSelect.addEventListener('change', () => { if (currentPdf) renderPages(); });
    scaleSelect.addEventListener('change', () => { if (currentPdf) renderPages(); });

    btnDownloadAll.addEventListener('click', () => {
      renderedImages.forEach((img, idx) => {
        setTimeout(() => {
          downloadImage(img.dataUrl, `${originalBaseName}_page_${img.pageNum}.${img.ext}`);
        }, idx * 250);
      });
    });
  }
});
