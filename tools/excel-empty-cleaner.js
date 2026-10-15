// Tool: excel-empty-cleaner (Empty Rows & Whitespace Stripper)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-empty-cleaner'] = Object.assign(window.TOOLS_REGISTRY['excel-empty-cleaner'] || {}, {
  id: 'excel-empty-cleaner',
  name: 'Empty Rows & Whitespace Stripper',
  category: 'Text & Data',
  standaloneUrl: '/excel-empty-cleaner',
  description: 'Clean messy spreadsheets by removing blank rows, empty columns, and phantom whitespace in Excel & CSV files.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".xlsx,.xls,.csv" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop Excel / CSV to Sanitize</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Instant Phantom Data Purge</span>
      </div>

      <!-- Cleaner Options -->
      <div class="space-y-1.5 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border text-[10px] font-mono">
        <label class="flex items-center gap-2 text-workspace-text cursor-pointer">
          <input type="checkbox" id="${toolId}_chkEmptyRows" checked class="rounded text-workspace-accent focus:ring-0">
          <span>Remove Completely Empty Rows</span>
        </label>
        <label class="flex items-center gap-2 text-workspace-text cursor-pointer">
          <input type="checkbox" id="${toolId}_chkEmptyCols" checked class="rounded text-workspace-accent focus:ring-0">
          <span>Remove Completely Empty Columns</span>
        </label>
        <label class="flex items-center gap-2 text-workspace-text cursor-pointer">
          <input type="checkbox" id="${toolId}_chkTrimSpaces" checked class="rounded text-workspace-accent focus:ring-0">
          <span>Trim Leading & Trailing Whitespace in Every Cell</span>
        </label>
      </div>

      <!-- Stats Summary -->
      <div id="${toolId}_statsBanner" class="grid grid-cols-3 gap-2 p-2 rounded-xl bg-workspace-surface border border-workspace-border text-center font-mono">
        <div>
          <span class="text-[9px] text-workspace-muted block">EMPTY ROWS REMOVED</span>
          <span id="${toolId}_statRows" class="font-bold text-xs text-red-400">0</span>
        </div>
        <div>
          <span class="text-[9px] text-workspace-muted block">EMPTY COLS REMOVED</span>
          <span id="${toolId}_statCols" class="font-bold text-xs text-red-400">0</span>
        </div>
        <div>
          <span class="text-[9px] text-workspace-accent block">CLEAN ROWS KEPT</span>
          <span id="${toolId}_statKept" class="font-bold text-xs text-emerald-400">0</span>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a spreadsheet</span>
        <div class="flex items-center gap-2">
          <button id="${toolId}_btnDownloadCsv" disabled class="px-2.5 py-1.5 rounded-lg border border-workspace-border text-workspace-text hover:bg-workspace-surface disabled:opacity-40 transition-all">Export CSV</button>
          <button id="${toolId}_btnDownloadXlsx" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all">Download .xlsx</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const chkEmptyRows = document.getElementById(`${toolId}_chkEmptyRows`);
    const chkEmptyCols = document.getElementById(`${toolId}_chkEmptyCols`);
    const chkTrimSpaces = document.getElementById(`${toolId}_chkTrimSpaces`);
    const statRows = document.getElementById(`${toolId}_statRows`);
    const statCols = document.getElementById(`${toolId}_statCols`);
    const statKept = document.getElementById(`${toolId}_statKept`);
    const btnDownloadCsv = document.getElementById(`${toolId}_btnDownloadCsv`);
    const btnDownloadXlsx = document.getElementById(`${toolId}_btnDownloadXlsx`);
    const status = document.getElementById(`${toolId}_status`);

    let rawRows = [];
    let cleanRows = [];
    let originalBaseName = 'sanitized';

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = '/xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load SheetJS.'));
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
      status.textContent = 'Reading spreadsheet...';
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");

      try {
        const XLSX = await ensureXlsx();
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];

        rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        processCleaning();
        status.textContent = 'Spreadsheet cleaned';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    function processCleaning() {
      if (!rawRows.length) return;
      const doEmptyRows = chkEmptyRows.checked;
      const doEmptyCols = chkEmptyCols.checked;
      const doTrim = chkTrimSpaces.checked;

      let rows = rawRows.map(r => r.map(c => {
        if (c === undefined || c === null) return '';
        let s = String(c);
        return doTrim ? s.trim() : s;
      }));

      const origRowCount = rows.length;
      const maxColCount = rows.reduce((max, r) => Math.max(max, r.length), 0);

      // Remove empty rows
      let filteredRows = rows;
      let removedRowsCount = 0;
      if (doEmptyRows) {
        filteredRows = rows.filter(r => r.some(c => c !== ''));
        removedRowsCount = origRowCount - filteredRows.length;
      }

      // Detect empty columns across all remaining rows
      let keptColIndices = [];
      let removedColsCount = 0;
      if (doEmptyCols && filteredRows.length > 0) {
        for (let col = 0; col < maxColCount; col++) {
          const hasVal = filteredRows.some(row => row[col] !== undefined && row[col] !== '');
          if (hasVal) {
            keptColIndices.push(col);
          } else {
            removedColsCount++;
          }
        }
        filteredRows = filteredRows.map(row => keptColIndices.map(ci => row[ci] || ''));
      }

      cleanRows = filteredRows;

      statRows.textContent = removedRowsCount;
      statCols.textContent = removedColsCount;
      statKept.textContent = cleanRows.length;

      btnDownloadCsv.disabled = cleanRows.length === 0;
      btnDownloadXlsx.disabled = cleanRows.length === 0;
    }

    chkEmptyRows.addEventListener('change', processCleaning);
    chkEmptyCols.addEventListener('change', processCleaning);
    chkTrimSpaces.addEventListener('change', processCleaning);

    btnDownloadCsv.addEventListener('click', () => {
      if (!cleanRows.length) return;
      const safeRows = sanitizeSpreadsheetRows(cleanRows);
      const ws = window.XLSX.utils.aoa_to_sheet(safeRows);
      const csv = window.XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_cleaned.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    btnDownloadXlsx.addEventListener('click', () => {
      if (!cleanRows.length) return;
      const safeRows = sanitizeSpreadsheetRows(cleanRows);
      const ws = window.XLSX.utils.aoa_to_sheet(safeRows);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "CleanedData");
      window.XLSX.writeFile(wb, `${originalBaseName}_cleaned.xlsx`);
    });
  }
});
