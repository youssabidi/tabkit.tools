// Tool: pdf-merger (Client-Side PDF Merger & Combiner)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-merger'] = Object.assign(window.TOOLS_REGISTRY['pdf-merger'] || {}, {
  id: 'pdf-merger',
  name: 'Client-Side PDF Merger & Combiner',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-merger.html',
  description: 'Combine multiple PDF documents into a single file locally in your browser with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" multiple class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop PDF Files to Merge</span>
        <span class="text-[9px] text-workspace-muted">Multi-File Support • 100% In-Browser</span>
      </div>

      <!-- File List -->
      <div class="space-y-1.5 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border flex-1 flex flex-col min-h-[140px]">
        <div class="flex justify-between items-center text-[10px] font-mono pb-1 border-b border-workspace-border">
          <span class="text-workspace-muted">Files to Merge (<span id="${toolId}_countBadge" class="text-workspace-accent font-bold">0</span>):</span>
          <button id="${toolId}_btnClear" class="text-workspace-muted hover:text-workspace-danger text-[10px] hidden transition-colors">Clear All</button>
        </div>
        
        <div id="${toolId}_fileList" class="flex-1 overflow-y-auto space-y-1 max-h-[150px] pr-1">
          <div id="${toolId}_emptyHint" class="text-center py-6 text-workspace-muted text-[11px]">No PDFs added yet</div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Add at least 2 PDFs</span>
        <button id="${toolId}_btnMerge" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Merge & Save</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileList = document.getElementById(`${toolId}_fileList`);
    const countBadge = document.getElementById(`${toolId}_countBadge`);
    const btnClear = document.getElementById(`${toolId}_btnClear`);
    const status = document.getElementById(`${toolId}_status`);
    const btnMerge = document.getElementById(`${toolId}_btnMerge`);
    const emptyHint = document.getElementById(`${toolId}_emptyHint`);

    let loadedFiles = [];

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
      if (e.dataTransfer.files?.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    fileInput.onchange = (e) => {
      if (e.target.files?.length) {
        handleFiles(Array.from(e.target.files));
      }
      fileInput.value = '';
    };

    btnClear.onclick = () => {
      loadedFiles = [];
      renderFileList();
    };

    async function handleFiles(newFiles) {
      const pdfs = newFiles.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
      if (!pdfs.length) {
        if (typeof showToast !== 'undefined') showToast('Please select valid PDF documents', 'error');
        return;
      }

      status.textContent = 'Analyzing files...';
      const lib = await ensurePdfLib();

      for (const file of pdfs) {
        try {
          const buffer = await file.arrayBuffer();
          const doc = await lib.PDFDocument.load(buffer, { ignoreEncryption: true });
          const pages = doc.getPageCount();
          loadedFiles.push({
            id: 'file_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            pages: pages,
            bytes: buffer
          });
        } catch (err) {
          console.warn('Could not read PDF:', file.name, err);
          if (typeof showToast !== 'undefined') showToast(`Could not parse ${file.name}`, 'error');
        }
      }

      renderFileList();
    }

    function renderFileList() {
      countBadge.textContent = loadedFiles.length;
      if (loadedFiles.length === 0) {
        fileList.innerHTML = '';
        fileList.appendChild(emptyHint);
        emptyHint.classList.remove('hidden');
        btnClear.classList.add('hidden');
        btnMerge.disabled = true;
        status.textContent = 'Add at least 2 PDFs';
        return;
      }

      emptyHint.classList.add('hidden');
      btnClear.classList.remove('hidden');
      btnMerge.disabled = loadedFiles.length < 2;
      status.textContent = loadedFiles.length >= 2 
        ? `Ready to merge ${loadedFiles.reduce((acc, f) => acc + f.pages, 0)} total pages` 
        : 'Add at least 1 more PDF to merge';

      fileList.innerHTML = loadedFiles.map((f, idx) => `
        <div class="flex items-center justify-between p-2 rounded-lg bg-workspace-surface border border-workspace-border text-[11px] group">
          <div class="flex items-center gap-2 overflow-hidden mr-2">
            <span class="text-[10px] font-mono text-workspace-muted shrink-0">${idx + 1}.</span>
            <span class="font-mono text-workspace-text truncate" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</span>
            <span class="text-[9px] px-1.5 py-0.2 rounded bg-workspace-bg text-workspace-accent font-mono shrink-0">${f.pages} pgs</span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="window._pdfMergerMove('${toolId}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="text-workspace-muted hover:text-workspace-text disabled:opacity-20 px-1" title="Move Up">&uarr;</button>
            <button onclick="window._pdfMergerMove('${toolId}', ${idx}, 1)" ${idx === loadedFiles.length - 1 ? 'disabled' : ''} class="text-workspace-muted hover:text-workspace-text disabled:opacity-20 px-1" title="Move Down">&darr;</button>
            <button onclick="window._pdfMergerRemove('${toolId}', ${idx})" class="text-workspace-muted hover:text-workspace-danger px-1" title="Remove">&times;</button>
          </div>
        </div>
      `).join('');
    }

    window._pdfMergerMove = (id, idx, direction) => {
      if (id !== toolId) return;
      const target = idx + direction;
      if (target < 0 || target >= loadedFiles.length) return;
      const item = loadedFiles.splice(idx, 1)[0];
      loadedFiles.splice(target, 0, item);
      renderFileList();
    };

    window._pdfMergerRemove = (id, idx) => {
      if (id !== toolId) return;
      loadedFiles.splice(idx, 1);
      renderFileList();
    };

    btnMerge.onclick = async () => {
      if (loadedFiles.length < 2) return;
      status.textContent = 'Merging PDFs...';
      btnMerge.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const mergedDoc = await lib.PDFDocument.create();

        for (const f of loadedFiles) {
          const srcDoc = await lib.PDFDocument.load(f.bytes);
          const indices = srcDoc.getPageIndices();
          const copiedPages = await mergedDoc.copyPages(srcDoc, indices);
          copiedPages.forEach(p => mergedDoc.addPage(p));
        }

        const mergedBytes = await mergedDoc.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `merged-document-${Date.now().toString().slice(-4)}.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        status.textContent = 'Merge complete!';
        btnMerge.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`Successfully merged ${loadedFiles.length} PDFs!`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Merge failed';
        btnMerge.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to merge PDFs', 'error');
      }
    };
  }
});
