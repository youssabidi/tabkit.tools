// Tool: excel-to-json (Client-Side Excel to JSON Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-to-json'] = Object.assign(window.TOOLS_REGISTRY['excel-to-json'] || {}, {
  id: 'excel-to-json',
  name: 'Excel to JSON Converter',
  category: 'Text & Data',
  standaloneUrl: '/excel-to-json',
  description: 'Convert Excel (.xlsx, .xls) spreadsheets to clean JSON objects or arrays locally with zero uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".xlsx,.xls,.csv" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop Excel / CSV to JSON</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • 100% Client-Side Privacy</span>
      </div>

      <!-- Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-3 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Select Sheet:</label>
            <select id="${toolId}_sheetSelect" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none disabled:opacity-50">
              <option value="">No sheet loaded</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Output Format:</label>
            <select id="${toolId}_formatSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="objects" selected>Array of Objects [{...}]</option>
              <option value="2d">2D Array [[...]]</option>
              <option value="keyed">Keyed by 1st Column</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Indentation:</label>
            <select id="${toolId}_indentSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="0">Minified (1-line)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview Box -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span id="${toolId}_stats">JSON Output Preview</span>
          <button id="${toolId}_btnCopy" disabled class="text-workspace-accent hover:underline disabled:opacity-40">Copy JSON</button>
        </div>
        <textarea id="${toolId}_output" readonly placeholder="Converted JSON will appear here..." class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select an Excel or CSV file</span>
        <button id="${toolId}_btnDownload" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all">Download .json</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const sheetSelect = document.getElementById(`${toolId}_sheetSelect`);
    const formatSelect = document.getElementById(`${toolId}_formatSelect`);
    const indentSelect = document.getElementById(`${toolId}_indentSelect`);
    const output = document.getElementById(`${toolId}_output`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);
    const status = document.getElementById(`${toolId}_status`);

    let currentWorkbook = null;
    let originalBaseName = 'data';

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = 'xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load SheetJS library.'));
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
      status.textContent = 'Parsing file...';
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");

      try {
        const XLSX = await ensureXlsx();
        const arrayBuffer = await file.arrayBuffer();
        currentWorkbook = XLSX.read(arrayBuffer, { type: 'array' });

        sheetSelect.innerHTML = '';
        currentWorkbook.SheetNames.forEach((name, idx) => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = `${idx + 1}. ${name}`;
          sheetSelect.appendChild(opt);
        });
        sheetSelect.disabled = false;

        renderJson();
        status.textContent = 'Converted to JSON successfully';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    function renderJson() {
      if (!currentWorkbook) return;
      const sheetName = sheetSelect.value || currentWorkbook.SheetNames[0];
      const sheet = currentWorkbook.Sheets[sheetName];
      if (!sheet) return;

      const format = formatSelect.value;
      const indent = parseInt(indentSelect.value, 10);
      let jsonData;

      if (format === '2d') {
        jsonData = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });
      } else if (format === 'keyed') {
        const rows = window.XLSX.utils.sheet_to_json(sheet);
        const keyed = {};
        rows.forEach((r, idx) => {
          const firstKey = Object.keys(r)[0];
          const primaryVal = firstKey ? r[firstKey] : `row_${idx}`;
          keyed[primaryVal] = r;
        });
        jsonData = keyed;
      } else {
        jsonData = window.XLSX.utils.sheet_to_json(sheet);
      }

      const jsonStr = indent > 0 ? JSON.stringify(jsonData, null, indent) : JSON.stringify(jsonData);
      output.value = jsonStr;

      const count = Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length;
      stats.textContent = `${sheetName} • ${count} records (${(jsonStr.length / 1024).toFixed(1)} KB)`;

      btnCopy.disabled = !jsonStr;
      btnDownload.disabled = !jsonStr;
    }

    sheetSelect.addEventListener('change', renderJson);
    formatSelect.addEventListener('change', renderJson);
    indentSelect.addEventListener('change', renderJson);

    btnCopy.addEventListener('click', () => {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value);
      btnCopy.textContent = 'Copied!';
      setTimeout(() => { btnCopy.textContent = 'Copy JSON'; }, 1500);
    });

    btnDownload.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
