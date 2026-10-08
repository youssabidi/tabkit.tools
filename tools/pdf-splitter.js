// Tool: pdf-splitter
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-splitter'] = Object.assign(window.TOOLS_REGISTRY['pdf-splitter'] || {}, {
  id: 'pdf-splitter',
  name: 'Client-Side PDF Splitter & Page Remover',
  category: 'Privacy',
  description: 'Extract specific pages or split multi-page PDF documents locally in your browser with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[200px]">Click or Drop PDF Document</span>
        <span id="${toolId}_pageCount" class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser</span>
      </div>

      <div class="space-y-1.5 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="flex justify-between items-center text-[10px] font-mono">
          <span class="text-workspace-muted">Pages to Keep / Extract:</span>
          <span class="text-workspace-accent font-bold" id="${toolId}_rangeHelp">e.g. 1-3, 5</span>
        </div>
        <input id="${toolId}_pageRange" type="text" placeholder="1-3, 5" disabled class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-workspace-text focus:border-workspace-accent focus:outline-none disabled:opacity-50" />
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF</span>
        <button id="${toolId}_btnExtract" disabled class="px-3 py-1 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all">Extract & Save</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const pageCount = document.getElementById(`${toolId}_pageCount`);
    const pageRange = document.getElementById(`${toolId}_pageRange`);
    const status = document.getElementById(`${toolId}_status`);
    const btnExtract = document.getElementById(`${toolId}_btnExtract`);

    let pdfBytes = null;
    let totalPages = 0;
    let originalName = 'document';

    // Lazy load PDFLib if needed
    function ensurePdfLib() {
      return new Promise((resolve, reject) => {
        if (window.PDFLib) return resolve(window.PDFLib);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.9/pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => reject(new Error('Failed to load PDF engine'));
        document.head.appendChild(script);
      });
    }

    function parsePageRange(rangeStr, max) {
      const pages = new Set();
      const parts = rangeStr.split(',');
      for (let part of parts) {
        part = part.trim();
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
              pages.add(i);
            }
          }
        } else {
          const num = parseInt(part, 10);
          if (!isNaN(num) && num >= 1 && num <= max) {
            pages.add(num);
          }
        }
      }
      return Array.from(pages).sort((a, b) => a - b);
    }

    async function handleFile(file) {
      if (!file || file.type !== 'application/pdf') return;
      fileName.textContent = file.name;
      originalName = file.name.replace(/\.pdf$/i, '');
      status.textContent = 'Reading PDF...';

      try {
        const lib = await ensurePdfLib();
        const arrayBuffer = await file.arrayBuffer();
        pdfBytes = arrayBuffer;

        const doc = await lib.PDFDocument.load(arrayBuffer);
        totalPages = doc.getPageCount();

        pageCount.textContent = `Found ${totalPages} page${totalPages === 1 ? '' : 's'}`;
        pageRange.disabled = false;
        pageRange.value = `1-${Math.min(totalPages, 3)}`;
        btnExtract.disabled = false;
        status.textContent = 'Ready to extract';
      } catch (err) {
        status.textContent = 'Error loading PDF';
        console.error(err);
      }
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => handleFile(e.target.files[0]);

      dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); };
      dropzone.ondragleave = () => dropzone.classList.remove('border-workspace-accent');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-workspace-accent');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
      };
    }

    if (btnExtract) {
      btnExtract.onclick = async () => {
        if (!pdfBytes) return;
        const selected = parsePageRange(pageRange.value, totalPages);
        if (selected.length === 0) {
          if (typeof showToast !== 'undefined') showToast('Please enter valid page numbers', 'error');
          return;
        }

        status.textContent = 'Extracting pages...';
        btnExtract.disabled = true;

        try {
          const lib = await ensurePdfLib();
          const srcDoc = await lib.PDFDocument.load(pdfBytes);
          const newDoc = await lib.PDFDocument.create();

          // 0-indexed page indices
          const indices = selected.map(p => p - 1);
          const copiedPages = await newDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => newDoc.addPage(p));

          const savedBytes = await newDoc.save();
          const blob = new Blob([savedBytes], { type: 'application/pdf' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${originalName}-extracted.pdf`;
          a.click();
          URL.revokeObjectURL(a.href);

          status.textContent = `Saved ${selected.length} pages`;
          btnExtract.disabled = false;
          if (typeof showToast !== 'undefined') showToast(`Extracted ${selected.length} pages!`);
        } catch (err) {
          status.textContent = 'Extraction failed';
          btnExtract.disabled = false;
          console.error(err);
        }
      };
    }
  }
});
