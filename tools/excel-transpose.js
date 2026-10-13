// Tool: excel-transpose (Row <-> Column Transposer)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-transpose'] = Object.assign(window.TOOLS_REGISTRY['excel-transpose'] || {}, {
  id: 'excel-transpose',
  name: 'Spreadsheet Row & Column Transposer',
  category: 'Text & Data',
  standaloneUrl: '/excel-transpose',
  description: 'Flip spreadsheet rows to columns and columns to rows in Excel and CSV files instantly in your browser.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".xlsx,.xls,.csv" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop Excel / CSV to Transpose</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Instant 90° Axis Rotation</span>
      </div>

      <!-- Stats Summary Banner -->
      <div id="${toolId}_statsBanner" class="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-workspace-surface border border-workspace-border text-center font-mono">
        <div>
          <span class="text-[9px] text-workspace-muted block">BEFORE TRANSPOSE</span>
          <span id="${toolId}_statBefore" class="font-bold text-xs text-workspace-text">0 rows × 0 cols</span>
        </div>
        <div>
          <span class="text-[9px] text-workspace-accent block">AFTER TRANSPOSE</span>
          <span id="${toolId}_statAfter" class="font-bold text-xs text-workspace-accent">0 rows × 0 cols</span>
        </div>
      </div>

      <!-- Preview Table -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono overflow-hidden">
        <div class="text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          Transposed Table Preview (Sample)
        </div>
        <div id="${toolId}_previewTable" class="flex-1 overflow-auto text-[10px] text-workspace-text">
          <p class="text-workspace-muted text-center py-4">No data loaded yet</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a spreadsheet file</span>
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
    const statBefore = document.getElementById(`${toolId}_statBefore`);
    const statAfter = document.getElementById(`${toolId}_statAfter`);
    const previewTable = document.getElementById(`${toolId}_previewTable`);
    const btnDownloadCsv = document.getElementById(`${toolId}_btnDownloadCsv`);
    const btnDownloadXlsx = document.getElementById(`${toolId}_btnDownloadXlsx`);
    const status = document.getElementById(`${toolId}_status`);

    let transposedData = [];
    let originalBaseName = 'transposed';

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = 'xlsx.full.min.js';
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

        const json2d = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (!json2d || json2d.length === 0) throw new Error('File has no readable cells.');

        const origRows = json2d.length;
        const origCols = Math.max(...json2d.map(r => r.length));

        // Perform 2D Array Matrix Transposition: matrix[col][row]
        transposedData = [];
        for (let c = 0; c < origCols; c++) {
          const newRow = [];
          for (let r = 0; r < origRows; r++) {
            newRow.push(json2d[r] && json2d[r][c] !== undefined ? json2d[r][c] : '');
          }
          transposedData.push(newRow);
        }

        statBefore.textContent = `${origRows} rows × ${origCols} cols`;
        statAfter.textContent = `${transposedData.length} rows × ${origRows} cols`;

        renderPreview();
        status.textContent = 'Transposed successfully';

        btnDownloadCsv.disabled = false;
        btnDownloadXlsx.disabled = false;
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    function renderPreview() {
      if (!transposedData.length) return;
      const sample = transposedData.slice(0, 6);
      let html = '<table class="w-full border-collapse border border-workspace-border text-left"><tbody>';

      sample.forEach((row, rIdx) => {
        html += `<tr class="${rIdx === 0 ? 'bg-workspace-surface font-semibold text-workspace-accent' : 'hover:bg-workspace-surface/50'}">`;
        row.slice(0, 6).forEach(cell => {
          const val = cell !== undefined && cell !== null ? String(cell) : '';
          html += `<td class="p-1 border border-workspace-border truncate max-w-[100px]">${escapeHtml(val)}</td>`;
        });
        if (row.length > 6) html += '<td class="p-1 border border-workspace-border text-workspace-muted">...</td>';
        html += '</tr>';
      });
      if (transposedData.length > 6) html += '<tr><td colspan="7" class="p-1 text-center text-workspace-muted text-[9px]">... more rows ...</td></tr>';
      html += '</tbody></table>';

      previewTable.innerHTML = html;
    }

    btnDownloadCsv.addEventListener('click', () => {
      if (!transposedData.length) return;
      const ws = window.XLSX.utils.aoa_to_sheet(transposedData);
      const csv = window.XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_transposed.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    btnDownloadXlsx.addEventListener('click', () => {
      if (!transposedData.length) return;
      const ws = window.XLSX.utils.aoa_to_sheet(transposedData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Transposed");
      window.XLSX.writeFile(wb, `${originalBaseName}_transposed.xlsx`);
    });
  }
});
