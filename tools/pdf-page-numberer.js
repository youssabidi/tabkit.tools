// Tool: pdf-page-numberer (Client-Side PDF Page Numbering & Pagination Tool)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-page-numberer'] = Object.assign(window.TOOLS_REGISTRY['pdf-page-numberer'] || {}, {
  id: 'pdf-page-numberer',
  name: 'Client-Side PDF Page Numberer',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-page-numberer.html',
  description: 'Add page numbers, pagination headers, or footers to PDF documents locally in your browser with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop PDF to Paginate</span>
        <span id="${toolId}_pageMeta" class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser</span>
      </div>

      <!-- Settings Grid -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border text-[10px] font-mono">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-workspace-muted block mb-0.5">Format:</label>
            <select id="${toolId}_formatSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none focus:border-workspace-accent">
              <option value="page_n_of_total" selected>Page {n} of {total}</option>
              <option value="n_slash_total">{n} / {total}</option>
              <option value="n_only">{n}</option>
              <option value="hyphen_n">- {n} -</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Position:</label>
            <select id="${toolId}_posSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none focus:border-workspace-accent">
              <option value="bottom-center" selected>Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-workspace-border">
          <label class="flex items-center gap-1.5 cursor-pointer text-workspace-text">
            <input type="checkbox" id="${toolId}_skipFirst" class="accent-workspace-accent" />
            <span>Skip 1st Page (Cover)</span>
          </label>
          <div class="flex items-center gap-1">
            <span class="text-workspace-muted">Start At:</span>
            <input type="number" id="${toolId}_startNum" value="1" min="1" max="999" class="w-12 bg-workspace-surface border border-workspace-border rounded px-1 py-0.5 text-center text-workspace-text focus:outline-none" />
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF</span>
        <button id="${toolId}_btnPaginate" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Add Numbers & Save</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const pageMeta = document.getElementById(`${toolId}_pageMeta`);
    const formatSelect = document.getElementById(`${toolId}_formatSelect`);
    const posSelect = document.getElementById(`${toolId}_posSelect`);
    const skipFirst = document.getElementById(`${toolId}_skipFirst`);
    const startNum = document.getElementById(`${toolId}_startNum`);
    const status = document.getElementById(`${toolId}_status`);
    const btnPaginate = document.getElementById(`${toolId}_btnPaginate`);

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
        btnPaginate.disabled = false;
        status.textContent = `Ready (${totalPages} pages)`;
        if (typeof showToast !== 'undefined') showToast(`Loaded ${totalPages} pages`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Failed to load PDF';
        btnPaginate.disabled = true;
      }
    }

    btnPaginate.onclick = async () => {
      if (!pdfBytes) return;
      status.textContent = 'Adding page numbers...';
      btnPaginate.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const font = await doc.embedFont(lib.StandardFonts.Helvetica);
        const count = doc.getPageCount();
        const skipCover = skipFirst.checked;
        const initialNum = parseInt(startNum.value, 10) || 1;
        const fmt = formatSelect.value;
        const pos = posSelect.value;

        const effectiveTotal = skipCover ? count - 1 : count;
        let currentNum = initialNum;

        for (let i = 0; i < count; i++) {
          if (skipCover && i === 0) continue;

          const page = doc.getPage(i);
          const { width, height } = page.getSize();
          const fontSize = 10;

          let label = '';
          if (fmt === 'page_n_of_total') label = `Page ${currentNum} of ${effectiveTotal}`;
          else if (fmt === 'n_slash_total') label = `${currentNum} / ${effectiveTotal}`;
          else if (fmt === 'n_only') label = `${currentNum}`;
          else if (fmt === 'hyphen_n') label = `- ${currentNum} -`;

          const textWidth = font.widthOfTextAtSize(label, fontSize);
          const textHeight = font.heightAtSize(fontSize);

          let x = 0;
          let y = 0;
          const margin = 28;

          if (pos === 'bottom-center') {
            x = (width - textWidth) / 2;
            y = margin;
          } else if (pos === 'bottom-right') {
            x = width - textWidth - margin;
            y = margin;
          } else if (pos === 'bottom-left') {
            x = margin;
            y = margin;
          } else if (pos === 'top-right') {
            x = width - textWidth - margin;
            y = height - textHeight - margin;
          }

          page.drawText(label, {
            x: x,
            y: y,
            size: fontSize,
            font: font,
            color: lib.rgb(0.35, 0.4, 0.45)
          });

          currentNum++;
        }

        const paginatedBytes = await doc.save();
        const blob = new Blob([paginatedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${originalName}-numbered.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        status.textContent = `Numbered ${count} pages!`;
        btnPaginate.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`Successfully added page numbers!`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Pagination failed';
        btnPaginate.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to paginate PDF', 'error');
      }
    };
  }
});
