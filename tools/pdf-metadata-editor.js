// Tool: pdf-metadata-editor (Client-Side PDF Metadata Inspector & Stripper)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-metadata-editor'] = Object.assign(window.TOOLS_REGISTRY['pdf-metadata-editor'] || {}, {
  id: 'pdf-metadata-editor',
  name: 'PDF Metadata Inspector & Stripper',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-metadata-editor.html',
  description: 'View, edit, or completely wipe author, producer, and title metadata from PDF files locally for total privacy.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop PDF Document</span>
        <span id="${toolId}_pageMeta" class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser</span>
      </div>

      <!-- Metadata Fields Grid -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border flex-1 flex flex-col min-h-[140px] overflow-y-auto max-h-[160px] pr-1">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">Title:</label>
            <input id="${toolId}_metaTitle" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">Author:</label>
            <input id="${toolId}_metaAuthor" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">Subject:</label>
            <input id="${toolId}_metaSubject" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">Keywords:</label>
            <input id="${toolId}_metaKeywords" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">Creator Application:</label>
            <input id="${toolId}_metaCreator" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
          <div>
            <label class="text-[9px] font-mono text-workspace-muted block">PDF Producer:</label>
            <input id="${toolId}_metaProducer" type="text" placeholder="Not set" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[11px] font-mono text-workspace-text focus:outline-none focus:border-workspace-accent disabled:opacity-40" />
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono gap-2">
        <button id="${toolId}_btnStrip" disabled class="px-2.5 py-1.5 bg-workspace-danger/15 border border-workspace-danger/40 text-workspace-danger disabled:opacity-30 disabled:border-transparent hover:bg-workspace-danger hover:text-white rounded-lg transition-all text-[10px] font-bold">Wipe All Metadata</button>
        <button id="${toolId}_btnSave" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Save PDF</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const pageMeta = document.getElementById(`${toolId}_pageMeta`);
    const metaTitle = document.getElementById(`${toolId}_metaTitle`);
    const metaAuthor = document.getElementById(`${toolId}_metaAuthor`);
    const metaSubject = document.getElementById(`${toolId}_metaSubject`);
    const metaKeywords = document.getElementById(`${toolId}_metaKeywords`);
    const metaCreator = document.getElementById(`${toolId}_metaCreator`);
    const metaProducer = document.getElementById(`${toolId}_metaProducer`);
    const btnStrip = document.getElementById(`${toolId}_btnStrip`);
    const btnSave = document.getElementById(`${toolId}_btnSave`);

    let pdfBytes = null;
    let originalName = 'document';

    function ensurePdfLib() {
      return new Promise((resolve, reject) => {
        if (window.PDFLib) return resolve(window.PDFLib);
        const script = document.createElement('script');
        script.src = 'pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => reject(new Error('Failed to load PDF engine'));
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

      originalName = file.name.replace(/\.pdf$/i, '');
      fileName.textContent = file.name;

      try {
        const lib = await ensurePdfLib();
        pdfBytes = await file.arrayBuffer();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });

        pageMeta.textContent = `${doc.getPageCount()} pages • ${(file.size / 1024).toFixed(1)} KB`;

        metaTitle.value = doc.getTitle() || '';
        metaAuthor.value = doc.getAuthor() || '';
        metaSubject.value = doc.getSubject() || '';
        metaKeywords.value = (doc.getKeywords() || []).join(', ');
        metaCreator.value = doc.getCreator() || '';
        metaProducer.value = doc.getProducer() || '';

        [metaTitle, metaAuthor, metaSubject, metaKeywords, metaCreator, metaProducer].forEach(input => {
          input.disabled = false;
        });

        btnStrip.disabled = false;
        btnSave.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Extracted document metadata');
      } catch (err) {
        console.error(err);
        if (typeof showToast !== 'undefined') showToast('Failed to parse metadata', 'error');
      }
    }

    btnStrip.onclick = async () => {
      metaTitle.value = '';
      metaAuthor.value = '';
      metaSubject.value = '';
      metaKeywords.value = '';
      metaCreator.value = '';
      metaProducer.value = '';
      if (typeof showToast !== 'undefined') showToast('Cleared fields! Click "Save PDF" to export.');
    };

    btnSave.onclick = async () => {
      if (!pdfBytes) return;
      btnSave.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });

        doc.setTitle(metaTitle.value.trim());
        doc.setAuthor(metaAuthor.value.trim());
        doc.setSubject(metaSubject.value.trim());
        const kw = metaKeywords.value.split(',').map(s => s.trim()).filter(Boolean);
        doc.setKeywords(kw);
        doc.setCreator(metaCreator.value.trim());
        doc.setProducer(metaProducer.value.trim());

        const savedBytes = await doc.save();
        const blob = new Blob([savedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${originalName}-clean.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        btnSave.disabled = false;
        if (typeof showToast !== 'undefined') showToast('PDF metadata updated and exported!');
      } catch (err) {
        console.error(err);
        btnSave.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to save metadata', 'error');
      }
    };
  }
});
