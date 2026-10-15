// Tool: excel-deduplicator (Spreadsheet Row Deduplicator & Cleaner)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-deduplicator'] = Object.assign(window.TOOLS_REGISTRY['excel-deduplicator'] || {}, {
  id: 'excel-deduplicator',
  name: 'Spreadsheet Row Deduplicator',
  category: 'Text & Data',
  standaloneUrl: '/excel-deduplicator',
  description: 'Detect and purge duplicate rows in Excel and CSV files by specific columns or entire rows locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".xlsx,.xls,.csv" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop Excel / CSV to Deduplicate</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Instant In-Browser Cleaning</span>
      </div>

      <!-- Controls & Filter Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Deduplicate Based On:</label>
            <select id="${toolId}_columnSelect" disabled class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none disabled:opacity-50">
              <option value="__ALL__">All Columns (Exact Duplicate Rows)</option>
            </select>
          </div>
          <div class="flex flex-col justify-end space-y-1 text-[10px] font-mono">
            <label class="flex items-center gap-1.5 text-workspace-text cursor-pointer">
              <input type="checkbox" id="${toolId}_chkTrim" checked class="rounded text-workspace-accent focus:ring-0">
              <span>Trim Whitespace</span>
            </label>
            <label class="flex items-center gap-1.5 text-workspace-text cursor-pointer">
              <input type="checkbox" id="${toolId}_chkCase" class="rounded text-workspace-accent focus:ring-0">
              <span>Ignore Letter Case (A=a)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Stats Summary Banner -->
      <div id="${toolId}_statsBanner" class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-workspace-surface border border-workspace-border text-center font-mono">
        <div>
          <span class="text-[9px] text-workspace-muted block">TOTAL ROWS</span>
          <span id="${toolId}_statOriginal" class="font-bold text-sm text-workspace-text">0</span>
        </div>
        <div>
          <span class="text-[9px] text-red-400 block">DUPLICATES REMOVED</span>
          <span id="${toolId}_statRemoved" class="font-bold text-sm text-red-400">0</span>
        </div>
        <div>
          <span class="text-[9px] text-emerald-400 block">CLEAN ROWS</span>
          <span id="${toolId}_statClean" class="font-bold text-sm text-emerald-400">0</span>
        </div>
      </div>

      <!-- Output Table Preview -->
      <div class="flex-1 flex flex-col min-h-[110px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono overflow-hidden">
        <div class="text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          Cleaned Data Sample (First 5 Rows)
        </div>
        <div id="${toolId}_previewTable" class="flex-1 overflow-auto text-[10px] text-workspace-text">
          <p class="text-workspace-muted text-center py-4">No data loaded yet</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a file to clean</span>
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
    const columnSelect = document.getElementById(`${toolId}_columnSelect`);
    const chkTrim = document.getElementById(`${toolId}_chkTrim`);
    const chkCase = document.getElementById(`${toolId}_chkCase`);
    const statOriginal = document.getElementById(`${toolId}_statOriginal`);
    const statRemoved = document.getElementById(`${toolId}_statRemoved`);
    const statClean = document.getElementById(`${toolId}_statClean`);
    const previewTable = document.getElementById(`${toolId}_previewTable`);
    const btnDownloadCsv = document.getElementById(`${toolId}_btnDownloadCsv`);
    const btnDownloadXlsx = document.getElementById(`${toolId}_btnDownloadXlsx`);
    const status = document.getElementById(`${toolId}_status`);

    let rawData = [];
    let headers = [];
    let cleanedData = [];
    let originalBaseName = 'cleaned_spreadsheet';

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
        const firstSheetName = wb.SheetNames[0];
        const sheet = wb.Sheets[firstSheetName];

        const json2d = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (!json2d || json2d.length === 0) throw new Error('File appears to be empty.');

        headers = json2d[0].map(h => String(h || '').trim());
        rawData = json2d.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

        columnSelect.innerHTML = '<option value="__ALL__">All Columns (Exact Duplicate Rows)</option>';
        headers.forEach((h, idx) => {
          const opt = document.createElement('option');
          opt.value = String(idx);
          opt.textContent = `Column ${idx + 1}: ${h || `[Col ${idx + 1}]`}`;
          columnSelect.appendChild(opt);
        });
        columnSelect.disabled = false;

        processDeduplication();
        status.textContent = 'Deduplication ready';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    function processDeduplication() {
      if (!rawData || rawData.length === 0) return;

      const selectedCol = columnSelect.value;
      const doTrim = chkTrim.checked;
      const doIgnoreCase = chkCase.checked;

      const seenKeys = new Set();
      cleanedData = [];
      let removedCount = 0;

      rawData.forEach(row => {
        let key = '';
        if (selectedCol === '__ALL__') {
          key = row.map(val => normalizeVal(val, doTrim, doIgnoreCase)).join('|||');
        } else {
          const colIdx = parseInt(selectedCol, 10);
          key = normalizeVal(row[colIdx], doTrim, doIgnoreCase);
        }

        if (seenKeys.has(key)) {
          removedCount++;
        } else {
          seenKeys.add(key);
          cleanedData.push(row);
        }
      });

      statOriginal.textContent = rawData.length;
      statRemoved.textContent = removedCount;
      statClean.textContent = cleanedData.length;

      renderPreview();

      btnDownloadCsv.disabled = cleanedData.length === 0;
      btnDownloadXlsx.disabled = cleanedData.length === 0;
    }

    function normalizeVal(val, doTrim, doIgnoreCase) {
      let str = val !== undefined && val !== null ? String(val) : '';
      if (doTrim) str = str.trim();
      if (doIgnoreCase) str = str.toLowerCase();
      return str;
    }

    function renderPreview() {
      if (cleanedData.length === 0) {
        previewTable.innerHTML = '<p class="text-workspace-muted text-center py-4">No rows left</p>';
        return;
      }

      const sampleRows = cleanedData.slice(0, 5);
      let html = '<table class="w-full border-collapse border border-workspace-border text-left"><thead><tr class="bg-workspace-surface">';
      headers.forEach(h => {
        html += `<th class="p-1 border border-workspace-border text-workspace-accent font-semibold truncate max-w-[120px]">${escapeHtml(h)}</th>`;
      });
      html += '</tr></thead><tbody>';

      sampleRows.forEach(row => {
        html += '<tr class="hover:bg-workspace-surface/50">';
        headers.forEach((_, idx) => {
          const cellVal = row[idx] !== undefined && row[idx] !== null ? row[idx] : '';
          html += `<td class="p-1 border border-workspace-border truncate max-w-[120px]">${escapeHtml(String(cellVal))}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';

      previewTable.innerHTML = html;
    }

    columnSelect.addEventListener('change', processDeduplication);
    chkTrim.addEventListener('change', processDeduplication);
    chkCase.addEventListener('change', processDeduplication);

    btnDownloadCsv.addEventListener('click', () => {
      if (cleanedData.length === 0) return;
      const fullRows = sanitizeSpreadsheetRows([headers, ...cleanedData]);
      const ws = window.XLSX.utils.aoa_to_sheet(fullRows);
      const csv = window.XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_deduped.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    btnDownloadXlsx.addEventListener('click', () => {
      if (cleanedData.length === 0) return;
      const fullRows = sanitizeSpreadsheetRows([headers, ...cleanedData]);
      const ws = window.XLSX.utils.aoa_to_sheet(fullRows);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "CleanedData");
      window.XLSX.writeFile(wb, `${originalBaseName}_deduped.xlsx`);
    });
  }
});
