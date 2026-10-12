// Tool: csv-to-excel (Client-Side CSV to Excel .xlsx Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['csv-to-excel'] = Object.assign(window.TOOLS_REGISTRY['csv-to-excel'] || {}, {
  id: 'csv-to-excel',
  name: 'CSV to Excel (.xlsx) Converter',
  category: 'Text & Data',
  standaloneUrl: '/csv-to-excel.html',
  description: 'Convert raw CSV and TSV files or pasted text into styled Microsoft Excel (.xlsx) workbooks locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".csv,.tsv,.txt" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop CSV / TSV File</span>
        <span class="text-[9px] text-workspace-muted">Or paste raw CSV text into the editor below</span>
      </div>

      <!-- Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Sheet Name:</label>
            <input id="${toolId}_sheetNameInput" type="text" value="Sheet1" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[10px] text-workspace-text focus:outline-none" />
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Input Delimiter:</label>
            <select id="${toolId}_delimiterSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="auto" selected>Auto-Detect (, or \t or ;)</option>
              <option value=",">Comma (,)</option>
              <option value="&#9;">Tab (\t)</option>
              <option value=";">Semicolon (;)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span id="${toolId}_stats">CSV Data Input</span>
          <button id="${toolId}_btnClear" class="text-workspace-muted hover:text-red-400 transition-colors">Clear</button>
        </div>
        <textarea id="${toolId}_input" placeholder="Paste CSV text here, or drop a file above...&#10;Name,Role,Email&#10;Alice,Developer,alice@example.com&#10;Bob,Designer,bob@example.com" class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Enter CSV data</span>
        <button id="${toolId}_btnDownload" class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 transition-all shadow-sm">Convert & Download .xlsx</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const sheetNameInput = document.getElementById(`${toolId}_sheetNameInput`);
    const delimiterSelect = document.getElementById(`${toolId}_delimiterSelect`);
    const input = document.getElementById(`${toolId}_input`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnClear = document.getElementById(`${toolId}_btnClear`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);
    const status = document.getElementById(`${toolId}_status`);

    let originalBaseName = 'converted_spreadsheet';

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
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

    function handleFile(file) {
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");
      const reader = new FileReader();
      reader.onload = (e) => {
        input.value = e.target.result;
        updateStats();
        status.textContent = 'CSV loaded from file';
      };
      reader.readAsText(file);
    }

    function updateStats() {
      const text = input.value.trim();
      if (!text) {
        stats.textContent = 'CSV Data Input';
        return;
      }
      const lines = text.split('\n').filter(l => l.trim()).length;
      stats.textContent = `${lines} rows detected`;
    }

    input.addEventListener('input', updateStats);

    btnClear.addEventListener('click', () => {
      input.value = '';
      fileName.textContent = 'Click or Drop CSV / TSV File';
      originalBaseName = 'converted_spreadsheet';
      updateStats();
    });

    btnDownload.addEventListener('click', async () => {
      const rawText = input.value.trim();
      if (!rawText) {
        alert('Please paste CSV text or upload a CSV file first.');
        return;
      }

      status.textContent = 'Generating Excel workbook...';
      try {
        const XLSX = await ensureXlsx();
        const delimiter = delimiterSelect.value;
        let csvData = rawText;

        // Auto delimiter detect if selected
        let parseOpt = {};
        if (delimiter !== 'auto') {
          parseOpt.FS = delimiter;
        }

        const wb = XLSX.read(csvData, { type: 'string', ...parseOpt });
        const sheetName = (sheetNameInput.value || 'Sheet1').trim().slice(0, 31);
        
        // Rename first sheet if specified
        if (wb.SheetNames.length > 0 && wb.SheetNames[0] !== sheetName) {
          wb.Sheets[sheetName] = wb.Sheets[wb.SheetNames[0]];
          delete wb.Sheets[wb.SheetNames[0]];
          wb.SheetNames[0] = sheetName;
        }

        XLSX.writeFile(wb, `${originalBaseName}.xlsx`);
        status.textContent = 'Excel file downloaded successfully!';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    });
  }
});
