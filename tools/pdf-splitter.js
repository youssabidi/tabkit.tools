// Tool: pdf-splitter (Visual Page Selector & PDF Splitter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-splitter'] = Object.assign(window.TOOLS_REGISTRY['pdf-splitter'] || {}, {
  id: 'pdf-splitter',
  name: 'Client-Side PDF Splitter & Page Remover',
  category: 'Privacy',
  standaloneUrl: '/pdf-splitter.html',
  description: 'Extract specific pages or split multi-page PDF documents locally with visual page chips and zero server uploads.',
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
          <div class="flex items-center gap-2">
            <button id="${toolId}_btnSelectAll" disabled class="text-workspace-accent hover:underline">All</button>
            <span class="text-workspace-borderLight">|</span>
            <button id="${toolId}_btnInvert" disabled class="text-workspace-muted hover:text-workspace-text">Invert</button>
          </div>
        </div>
        <input id="${toolId}_pageRange" type="text" placeholder="1-3, 5" disabled class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-workspace-text focus:border-workspace-accent focus:outline-none disabled:opacity-50" />
        
        <!-- Visual Page Chips Grid -->
        <div id="${toolId}_chipsContainer" class="hidden flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-1"></div>
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
    const chipsContainer = document.getElementById(`${toolId}_chipsContainer`);
    const btnSelectAll = document.getElementById(`${toolId}_btnSelectAll`);
    const btnInvert = document.getElementById(`${toolId}_btnInvert`);

    let pdfBytes = null;
    let totalPages = 0;
    let originalName = 'document';
    let selectedPagesSet = new Set();

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

    function updateChipsUI() {
      if (!chipsContainer || totalPages === 0) return;
      chipsContainer.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const isSelected = selectedPagesSet.has(i);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
          isSelected 
            ? 'bg-workspace-accent/20 border-workspace-accent text-workspace-accent font-bold' 
            : 'bg-workspace-surface border-workspace-border text-workspace-muted hover:text-workspace-text opacity-60 line-through'
        }`;
        chip.textContent = `P${i}`;
        chip.title = isSelected ? `Click to exclude page ${i}` : `Click to include page ${i}`;
        chip.onclick = () => {
          if (selectedPagesSet.has(i)) {
            selectedPagesSet.delete(i);
          } else {
            selectedPagesSet.add(i);
          }
          syncInputFromSet();
        };
        chipsContainer.appendChild(chip);
      }
      status.textContent = `${selectedPagesSet.size} of ${totalPages} pages selected`;
    }

    function syncInputFromSet() {
      const sorted = Array.from(selectedPagesSet).sort((a, b) => a - b);
      if (sorted.length === 0) {
        pageRange.value = '';
      } else {
        // Build ranges
        const ranges = [];
        let start = sorted[0];
        let end = sorted[0];
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i] === end + 1) {
            end = sorted[i];
          } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = sorted[i];
            end = sorted[i];
          }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        pageRange.value = ranges.join(', ');
      }
      updateChipsUI();
    }

    function syncSetFromInput() {
      const pages = parsePageRange(pageRange.value, totalPages);
      selectedPagesSet = new Set(pages);
      updateChipsUI();
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
        btnExtract.disabled = false;
        btnSelectAll.disabled = false;
        btnInvert.disabled = false;

        // Default: select all
        selectedPagesSet = new Set(Array.from({ length: totalPages }, (_, i) => i + 1));
        syncInputFromSet();

        chipsContainer.classList.remove('hidden');
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

    pageRange.oninput = () => syncSetFromInput();

    btnSelectAll.onclick = () => {
      selectedPagesSet = new Set(Array.from({ length: totalPages }, (_, i) => i + 1));
      syncInputFromSet();
    };

    btnInvert.onclick = () => {
      const inverted = new Set();
      for (let i = 1; i <= totalPages; i++) {
        if (!selectedPagesSet.has(i)) inverted.add(i);
      }
      selectedPagesSet = inverted;
      syncInputFromSet();
    };

    btnExtract.onclick = async () => {
      if (!pdfBytes) return;
      const selected = Array.from(selectedPagesSet).sort((a, b) => a - b);
      if (selected.length === 0) {
        if (typeof showToast !== 'undefined') showToast('Select at least one page to extract', 'error');
        return;
      }

      status.textContent = 'Extracting pages...';
      btnExtract.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const srcDoc = await lib.PDFDocument.load(pdfBytes);
        const newDoc = await lib.PDFDocument.create();

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

        status.textContent = `Extracted ${selected.length} pages`;
        btnExtract.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`Extracted ${selected.length} pages!`);
      } catch (err) {
        status.textContent = 'Extraction failed';
        btnExtract.disabled = false;
        console.error(err);
      }
    };
  }
});
