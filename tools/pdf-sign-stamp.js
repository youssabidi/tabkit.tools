// Tool: pdf-sign-stamp (Client-Side PDF Signature & Stamp Tool)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-sign-stamp'] = Object.assign(window.TOOLS_REGISTRY['pdf-sign-stamp'] || {}, {
  id: 'pdf-sign-stamp',
  name: 'Client-Side PDF Signature & Stamp',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-sign-stamp',
  description: 'Draw or type your digital signature and stamp it onto any page of a PDF locally in your browser.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-2.5 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-5 h-5 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop PDF to Sign</span>
      </div>

      <!-- Signature Pad Area -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-workspace-muted">Draw Signature Below:</span>
          <div class="flex items-center gap-2">
            <button id="${toolId}_btnClearSign" type="button" class="text-workspace-muted hover:text-red-400">Clear Pad</button>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-workspace-border overflow-hidden h-24 relative cursor-crosshair">
          <canvas id="${toolId}_sigCanvas" class="w-full h-full block"></canvas>
          <div id="${toolId}_sigPlaceholder" class="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-300 font-mono text-[10px]">
            Sign with mouse or finger here
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div>
            <label class="text-workspace-muted block mb-0.5">Target Page:</label>
            <select id="${toolId}_pageSelect" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none disabled:opacity-50">
              <option value="last">Last Page</option>
              <option value="1">Page 1</option>
              <option value="all">All Pages</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Stamp Position:</label>
            <select id="${toolId}_positionSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="bottom-right" selected>Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="center">Center</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF to sign</span>
        <button id="${toolId}_btnSign" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all shadow-sm">Stamp & Download PDF</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const sigCanvas = document.getElementById(`${toolId}_sigCanvas`);
    const sigPlaceholder = document.getElementById(`${toolId}_sigPlaceholder`);
    const btnClearSign = document.getElementById(`${toolId}_btnClearSign`);
    const pageSelect = document.getElementById(`${toolId}_pageSelect`);
    const positionSelect = document.getElementById(`${toolId}_positionSelect`);
    const btnSign = document.getElementById(`${toolId}_btnSign`);
    const status = document.getElementById(`${toolId}_status`);

    let currentFile = null;
    let isDrawing = false;
    let hasSignature = false;
    let originalBaseName = 'signed_doc';

    function ensurePdfLib() {
      return new Promise((resolve, reject) => {
        if (window.PDFLib) return resolve(window.PDFLib);
        const script = document.createElement('script');
        script.src = '/pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = () => reject(new Error('Failed to load PDF-Lib.'));
        document.head.appendChild(script);
      });
    }

    // Set up canvas resolution
    function initCanvas() {
      const rect = sigCanvas.getBoundingClientRect();
      sigCanvas.width = rect.width * 2;
      sigCanvas.height = rect.height * 2;
      const ctx = sigCanvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    setTimeout(initCanvas, 50);

    function getCoords(e) {
      const rect = sigCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      hasSignature = true;
      sigPlaceholder.classList.add('hidden');
      const ctx = sigCanvas.getContext('2d');
      const pos = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      checkReady();
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const ctx = sigCanvas.getContext('2d');
      const pos = getCoords(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDraw(e) {
      if (isDrawing) {
        isDrawing = false;
        checkReady();
      }
    }

    sigCanvas.addEventListener('mousedown', startDraw);
    sigCanvas.addEventListener('mousemove', draw);
    sigCanvas.addEventListener('mouseup', stopDraw);
    sigCanvas.addEventListener('mouseleave', stopDraw);

    sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
    sigCanvas.addEventListener('touchmove', draw, { passive: false });
    sigCanvas.addEventListener('touchend', stopDraw);

    btnClearSign.addEventListener('click', () => {
      const ctx = sigCanvas.getContext('2d');
      ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
      hasSignature = false;
      sigPlaceholder.classList.remove('hidden');
      checkReady();
    });

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
      currentFile = file;
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");
      pageSelect.disabled = false;
      status.textContent = 'PDF loaded. Sign above and stamp.';
      checkReady();
    }

    function checkReady() {
      btnSign.disabled = !(currentFile && hasSignature);
    }

    btnSign.addEventListener('click', async () => {
      if (!currentFile || !hasSignature) return;
      status.textContent = 'Stamping signature onto PDF...';

      try {
        const PDFLib = await ensurePdfLib();
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

        // Export signature canvas as PNG bytes
        const sigPngDataUrl = sigCanvas.toDataURL('image/png');
        const sigImage = await pdfDoc.embedPng(sigPngDataUrl);

        const pages = pdfDoc.getPages();
        const targetOption = pageSelect.value;
        const targetPages = [];

        if (targetOption === 'last') targetPages.push(pages[pages.length - 1]);
        else if (targetOption === '1') targetPages.push(pages[0]);
        else if (targetOption === 'all') targetPages.push(...pages);

        const pos = positionSelect.value;
        const sigWidth = 150;
        const sigHeight = (sigCanvas.height / sigCanvas.width) * sigWidth;

        targetPages.forEach(p => {
          const { width, height } = p.getSize();
          let x = width - sigWidth - 40;
          let y = 40;

          if (pos === 'bottom-left') {
            x = 40;
            y = 40;
          } else if (pos === 'bottom-center') {
            x = (width - sigWidth) / 2;
            y = 40;
          } else if (pos === 'center') {
            x = (width - sigWidth) / 2;
            y = (height - sigHeight) / 2;
          }

          p.drawImage(sigImage, {
            x,
            y,
            width: sigWidth,
            height: sigHeight
          });
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalBaseName}_signed.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        status.textContent = 'Signed PDF downloaded!';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    });
  }
});
