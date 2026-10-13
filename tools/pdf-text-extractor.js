// Tool: pdf-text-extractor (Client-Side PDF Text & Markdown Extractor)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-text-extractor'] = Object.assign(window.TOOLS_REGISTRY['pdf-text-extractor'] || {}, {
  id: 'pdf-text-extractor',
  name: 'PDF Text & Markdown Extractor',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-text-extractor',
  description: 'Extract raw text, paragraphs, and formatted markdown from PDF files locally with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop PDF to Extract Text</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% In-Browser Privacy</span>
      </div>

      <!-- Controls -->
      <div class="space-y-2 bg-workspace-bg/60 p-2 rounded-xl border border-workspace-border">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <label class="flex items-center gap-1.5 text-workspace-text cursor-pointer">
            <input type="checkbox" id="${toolId}_chkHeaders" checked class="rounded text-workspace-accent focus:ring-0">
            <span>Include Page Separators (--- Page X ---)</span>
          </label>
          <div class="flex items-center gap-2">
            <span id="${toolId}_statsBadge" class="text-workspace-muted">0 pages • 0 words</span>
          </div>
        </div>
      </div>

      <!-- Output Text Area -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span>Extracted Text</span>
          <button id="${toolId}_btnCopy" disabled class="text-workspace-accent hover:underline disabled:opacity-40">Copy to Clipboard</button>
        </div>
        <textarea id="${toolId}_output" readonly placeholder="Extracted text will appear here..." class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF document</span>
        <div class="flex items-center gap-2">
          <button id="${toolId}_btnDownloadTxt" disabled class="px-2.5 py-1.5 rounded-lg border border-workspace-border text-workspace-text hover:bg-workspace-surface disabled:opacity-40 transition-all">Download .txt</button>
          <button id="${toolId}_btnDownloadMd" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all">Download .md</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const chkHeaders = document.getElementById(`${toolId}_chkHeaders`);
    const statsBadge = document.getElementById(`${toolId}_statsBadge`);
    const output = document.getElementById(`${toolId}_output`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const btnDownloadTxt = document.getElementById(`${toolId}_btnDownloadTxt`);
    const btnDownloadMd = document.getElementById(`${toolId}_btnDownloadMd`);
    const status = document.getElementById(`${toolId}_status`);

    let extractedPages = [];
    let originalBaseName = 'document';

    function ensurePdfJs() {
      return new Promise((resolve, reject) => {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF engine.'));
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
      status.textContent = 'Extracting text...';
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");
      output.value = 'Processing PDF pages...';

      try {
        const pdfjs = await ensurePdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        extractedPages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          status.textContent = `Extracting page ${i} of ${pdf.numPages}...`;
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          let lastY, pageText = '';
          for (let item of textContent.items) {
            if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              pageText += ' ';
            }
            pageText += item.str;
            lastY = item.transform[5];
          }
          extractedPages.push(pageText.trim());
        }

        renderOutput();
        status.textContent = 'Text extracted successfully';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
        output.value = 'Failed to extract text from this PDF.';
      }
    }

    function renderOutput() {
      if (!extractedPages.length) return;
      const withHeaders = chkHeaders.checked;

      let fullText = '';
      extractedPages.forEach((pText, idx) => {
        if (withHeaders) {
          fullText += `--- Page ${idx + 1} ---\n\n`;
        }
        fullText += pText + '\n\n';
      });

      output.value = fullText.trim();
      const words = fullText.trim().split(/\s+/).filter(Boolean).length;
      statsBadge.textContent = `${extractedPages.length} pages • ${words} words`;

      btnCopy.disabled = !fullText;
      btnDownloadTxt.disabled = !fullText;
      btnDownloadMd.disabled = !fullText;
    }

    chkHeaders.addEventListener('change', renderOutput);

    btnCopy.addEventListener('click', () => {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value);
      btnCopy.textContent = 'Copied!';
      setTimeout(() => { btnCopy.textContent = 'Copy to Clipboard'; }, 1500);
    });

    btnDownloadTxt.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_extracted.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    btnDownloadMd.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_extracted.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
