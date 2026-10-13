// Tool: excel-to-markdown (Excel to Markdown Table Generator)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-to-markdown'] = Object.assign(window.TOOLS_REGISTRY['excel-to-markdown'] || {}, {
  id: 'excel-to-markdown',
  name: 'Excel to Markdown Table Generator',
  category: 'Text & Data',
  standaloneUrl: '/excel-to-markdown',
  description: 'Convert Excel and CSV spreadsheets into clean GitHub-flavored Markdown tables locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".xlsx,.xls,.csv" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop Excel / CSV File</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Instant Markdown Table Formatting</span>
      </div>

      <!-- Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Column Alignment:</label>
            <select id="${toolId}_alignSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="left" selected>Left (:---)</option>
              <option value="center">Center (:---:)</option>
              <option value="right">Right (---:)</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Formatting Style:</label>
            <select id="${toolId}_styleSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="padded" selected>Pretty Padded Columns</option>
              <option value="compact">Compact (No padding)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Markdown Output -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span id="${toolId}_stats">Markdown Table Output</span>
          <button id="${toolId}_btnCopy" disabled class="text-workspace-accent hover:underline disabled:opacity-40">Copy Markdown</button>
        </div>
        <textarea id="${toolId}_output" readonly placeholder="Generated Markdown table will appear here..." class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select an Excel or CSV file</span>
        <button id="${toolId}_btnDownload" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all">Download .md</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const alignSelect = document.getElementById(`${toolId}_alignSelect`);
    const styleSelect = document.getElementById(`${toolId}_styleSelect`);
    const output = document.getElementById(`${toolId}_output`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);
    const status = document.getElementById(`${toolId}_status`);

    let tableRows = [];
    let originalBaseName = 'table';

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
        if (!json2d || json2d.length === 0) throw new Error('File has no readable data.');

        tableRows = json2d.filter(row => row.some(c => c !== undefined && c !== null && String(c).trim() !== ''));
        renderMarkdown();
        status.textContent = 'Markdown table generated';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    }

    function renderMarkdown() {
      if (!tableRows.length) return;
      const align = alignSelect.value;
      const isPadded = styleSelect.value === 'padded';

      const maxCols = Math.max(...tableRows.map(r => r.length));
      const colWidths = Array(maxCols).fill(3);

      // Normalize row cell strings
      const stringRows = tableRows.map(row => {
        const rowArr = [];
        for (let i = 0; i < maxCols; i++) {
          const val = row[i] !== undefined && row[i] !== null ? String(row[i]).replace(/\|/g, '\\|') : '';
          rowArr.push(val);
          if (val.length > colWidths[i]) colWidths[i] = val.length;
        }
        return rowArr;
      });

      let md = '';
      const headers = stringRows[0];
      const dataRows = stringRows.slice(1);

      // Header row
      if (isPadded) {
        md += '| ' + headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ') + ' |\n';
      } else {
        md += '| ' + headers.join(' | ') + ' |\n';
      }

      // Separator row
      let sepArr = colWidths.map(w => {
        const len = isPadded ? Math.max(3, w) : 3;
        if (align === 'center') return ':' + '-'.repeat(len - 2) + ':';
        if (align === 'right') return '-'.repeat(len - 1) + ':';
        return ':' + '-'.repeat(len - 1);
      });
      md += '| ' + sepArr.join(' | ') + ' |\n';

      // Data rows
      dataRows.forEach(row => {
        if (isPadded) {
          md += '| ' + row.map((cell, i) => cell.padEnd(colWidths[i])).join(' | ') + ' |\n';
        } else {
          md += '| ' + row.join(' | ') + ' |\n';
        }
      });

      output.value = md;
      stats.textContent = `${headers.length} columns • ${dataRows.length} data rows`;

      btnCopy.disabled = !md;
      btnDownload.disabled = !md;
    }

    alignSelect.addEventListener('change', renderMarkdown);
    styleSelect.addEventListener('change', renderMarkdown);

    btnCopy.addEventListener('click', () => {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value);
      btnCopy.textContent = 'Copied!';
      setTimeout(() => { btnCopy.textContent = 'Copy Markdown'; }, 1500);
    });

    btnDownload.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalBaseName}_table.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
