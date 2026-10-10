// Tool: pdf-rotator (Client-Side PDF Page Rotator & Fixer)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-rotator'] = Object.assign(window.TOOLS_REGISTRY['pdf-rotator'] || {}, {
  id: 'pdf-rotator',
  name: 'Client-Side PDF Page Rotator',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-rotator.html',
  description: 'Rotate upside-down or sideways PDF pages by 90°, 180°, or 270° locally in your browser.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Click or Drop PDF to Rotate</span>
        <span id="${toolId}_pageMeta" class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser</span>
      </div>

      <!-- Controls -->
      <div class="space-y-2.5 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <!-- Rotation Angle Selection -->
        <div>
          <label class="text-[10px] font-mono text-workspace-muted block mb-1">Rotation Angle:</label>
          <div class="grid grid-cols-3 gap-1.5" id="${toolId}_angleGroup">
            <button type="button" data-angle="90" class="angle-btn active py-1 px-2 rounded-lg bg-workspace-accent/15 border border-workspace-accent text-workspace-accent font-mono text-center font-bold">90° CW ↻</button>
            <button type="button" data-angle="180" class="angle-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center">180° ⇅</button>
            <button type="button" data-angle="270" class="angle-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center">90° CCW ↺</button>
          </div>
        </div>

        <!-- Scope Selection -->
        <div>
          <label class="text-[10px] font-mono text-workspace-muted block mb-1">Apply To Pages:</label>
          <div class="grid grid-cols-3 gap-1.5 mb-1.5" id="${toolId}_scopeGroup">
            <button type="button" data-scope="all" class="scope-btn active py-1 px-2 rounded-lg bg-workspace-accent/15 border border-workspace-accent text-workspace-accent font-mono text-center font-bold text-[10px]">All Pages</button>
            <button type="button" data-scope="odd" class="scope-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center text-[10px]">Odd Pages</button>
            <button type="button" data-scope="even" class="scope-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center text-[10px]">Even Pages</button>
          </div>
          <input id="${toolId}_customRange" type="text" placeholder="Or custom pages e.g. 1, 3-5 (optional)" disabled class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1 text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none disabled:opacity-40" />
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF</span>
        <button id="${toolId}_btnRotate" disabled class="px-3.5 py-1.5 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Rotate & Save</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const pageMeta = document.getElementById(`${toolId}_pageMeta`);
    const customRange = document.getElementById(`${toolId}_customRange`);
    const status = document.getElementById(`${toolId}_status`);
    const btnRotate = document.getElementById(`${toolId}_btnRotate`);
    const angleGroup = document.getElementById(`${toolId}_angleGroup`);
    const scopeGroup = document.getElementById(`${toolId}_scopeGroup`);

    let pdfBytes = null;
    let totalPages = 0;
    let originalName = 'document';
    let selectedAngle = 90;
    let selectedScope = 'all';

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

    // Angle selection tabs
    angleGroup.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        angleGroup.querySelectorAll('button').forEach(b => {
          b.className = 'angle-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center text-[10px]';
        });
        btn.className = 'angle-btn active py-1 px-2 rounded-lg bg-workspace-accent/15 border border-workspace-accent text-workspace-accent font-mono text-center font-bold text-[10px]';
        selectedAngle = parseInt(btn.dataset.angle, 10);
      };
    });

    // Scope selection tabs
    scopeGroup.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        scopeGroup.querySelectorAll('button').forEach(b => {
          b.className = 'scope-btn py-1 px-2 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-muted hover:text-workspace-text font-mono text-center text-[10px]';
        });
        btn.className = 'scope-btn active py-1 px-2 rounded-lg bg-workspace-accent/15 border border-workspace-accent text-workspace-accent font-mono text-center font-bold text-[10px]';
        selectedScope = btn.dataset.scope;
      };
    });

    async function handleFile(file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        if (typeof showToast !== 'undefined') showToast('Please select a valid PDF', 'error');
        return;
      }

      status.textContent = 'Reading document...';
      originalName = file.name.replace(/\.pdf$/i, '');
      fileName.textContent = file.name;

      try {
        const lib = await ensurePdfLib();
        pdfBytes = await file.arrayBuffer();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        totalPages = doc.getPageCount();

        pageMeta.textContent = `${totalPages} page${totalPages === 1 ? '' : 's'} • ${(file.size / 1024).toFixed(1)} KB`;
        btnRotate.disabled = false;
        customRange.disabled = false;
        status.textContent = `Ready (${totalPages} pages)`;
        if (typeof showToast !== 'undefined') showToast(`Loaded ${totalPages} pages`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Failed to load PDF';
        btnRotate.disabled = true;
      }
    }

    function parseRange(rangeStr, max) {
      const set = new Set();
      const parts = rangeStr.split(',');
      for (const p of parts) {
        const trimmed = p.trim();
        if (trimmed.includes('-')) {
          const [startStr, endStr] = trimmed.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.max(1, start); i <= Math.min(max, end); i++) set.add(i);
          }
        } else {
          const num = parseInt(trimmed, 10);
          if (!isNaN(num) && num >= 1 && num <= max) set.add(num);
        }
      }
      return set;
    }

    btnRotate.onclick = async () => {
      if (!pdfBytes) return;
      status.textContent = 'Rotating pages...';
      btnRotate.disabled = true;

      try {
        const lib = await ensurePdfLib();
        const doc = await lib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const count = doc.getPageCount();

        let targetIndices = [];
        const customInput = customRange.value.trim();

        if (customInput) {
          const parsedSet = parseRange(customInput, count);
          targetIndices = Array.from(parsedSet).map(p => p - 1);
        } else if (selectedScope === 'all') {
          targetIndices = Array.from({ length: count }, (_, i) => i);
        } else if (selectedScope === 'odd') {
          targetIndices = Array.from({ length: count }, (_, i) => i).filter(i => (i + 1) % 2 !== 0);
        } else if (selectedScope === 'even') {
          targetIndices = Array.from({ length: count }, (_, i) => i).filter(i => (i + 1) % 2 === 0);
        }

        if (targetIndices.length === 0) {
          if (typeof showToast !== 'undefined') showToast('No pages matched criteria', 'error');
          btnRotate.disabled = false;
          status.textContent = 'No pages selected';
          return;
        }

        targetIndices.forEach(idx => {
          const page = doc.getPage(idx);
          const currentRotation = page.getRotation().angle || 0;
          const newRotation = (currentRotation + selectedAngle) % 360;
          page.setRotation(lib.degrees(newRotation));
        });

        const rotatedBytes = await doc.save();
        const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${originalName}-rotated.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);

        status.textContent = `Rotated ${targetIndices.length} pages by ${selectedAngle}°`;
        btnRotate.disabled = false;
        if (typeof showToast !== 'undefined') showToast(`Successfully rotated ${targetIndices.length} pages!`);
      } catch (err) {
        console.error(err);
        status.textContent = 'Rotation failed';
        btnRotate.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Failed to rotate PDF', 'error');
      }
    };
  }
});
