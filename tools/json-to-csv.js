// Tool: json-to-csv (Client-Side Nested JSON to CSV & TSV Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['json-to-csv'] = Object.assign(window.TOOLS_REGISTRY['json-to-csv'] || {}, {
  id: 'json-to-csv',
  name: 'JSON to CSV & TSV Converter',
  category: 'Text & Data',
  standaloneUrl: '/json-to-csv',
  description: 'Convert JSON objects and nested arrays directly into clean CSV spreadsheets or TSV tables locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".json,.txt" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop .json File</span>
        <span class="text-[9px] text-workspace-muted">Or paste JSON array [{...}] directly into the editor</span>
      </div>

      <!-- Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Delimiter:</label>
            <select id="${toolId}_delimSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="," selected>Comma (Standard CSV)</option>
              <option value=";">Semicolon (European CSV)</option>
              <option value="&#9;">Tab (TSV for Excel / Sheets)</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Nested Key Separator:</label>
            <select id="${toolId}_sepSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="." selected>Dot (e.g. user.profile.name)</option>
              <option value="_">Underscore (e.g. user_profile_name)</option>
              <option value="/">Slash (e.g. user/profile/name)</option>
            </select>
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Encoding / BOM:</label>
            <select id="${toolId}_bomSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="bom" selected>UTF-8 with BOM (Excel-Friendly)</option>
              <option value="nobom">Pure UTF-8 (Dev-Friendly)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- JSON Input Area -->
      <div class="flex-1 flex flex-col min-h-[140px] bg-workspace-bg border border-workspace-border rounded-xl p-2 font-mono">
        <div class="flex items-center justify-between text-[10px] text-workspace-muted mb-1 pb-1 border-b border-workspace-border">
          <span id="${toolId}_stats">JSON Input (Array of Objects)</span>
          <button id="${toolId}_btnLoadSample" class="text-workspace-accent hover:underline">Load Sample</button>
        </div>
        <textarea id="${toolId}_input" placeholder="Paste JSON here...&#10;[&#10;  { &quot;id&quot;: 1, &quot;name&quot;: &quot;Alex Rivera&quot;, &quot;role&quot;: &quot;Engineer&quot;, &quot;contact&quot;: { &quot;city&quot;: &quot;Doha&quot; } },&#10;  { &quot;id&quot;: 2, &quot;name&quot;: &quot;Sarah Chen&quot;, &quot;role&quot;: &quot;Designer&quot;, &quot;contact&quot;: { &quot;city&quot;: &quot;London&quot; } }&#10;]" class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Ready</span>
        <div class="flex items-center gap-1.5">
          <button id="${toolId}_btnCopy" class="px-2.5 py-1.5 rounded-lg bg-workspace-surface border border-workspace-border text-workspace-text hover:border-workspace-accent text-[11px] transition-all">Copy CSV</button>
          <button id="${toolId}_btnDownload" class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 transition-all shadow-sm">Convert & Download .csv</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const delimSelect = document.getElementById(`${toolId}_delimSelect`);
    const sepSelect = document.getElementById(`${toolId}_sepSelect`);
    const bomSelect = document.getElementById(`${toolId}_bomSelect`);
    const input = document.getElementById(`${toolId}_input`);
    const stats = document.getElementById(`${toolId}_stats`);
    const status = document.getElementById(`${toolId}_status`);
    const btnLoadSample = document.getElementById(`${toolId}_btnLoadSample`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);

    if (!input || !btnDownload) return;

    // Helper: Flatten an arbitrary object
    function flattenObject(obj, prefix = '', sep = '.') {
      const flattened = {};
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        const val = obj[key];
        const newKey = prefix ? `${prefix}${sep}${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
          Object.assign(flattened, flattenObject(val, newKey, sep));
        } else if (Array.isArray(val)) {
          flattened[newKey] = JSON.stringify(val);
        } else {
          flattened[newKey] = val;
        }
      }
      return flattened;
    }

    // Convert JSON to CSV text
    function parseJsonToCsv() {
      const raw = input.value.trim();
      if (!raw) throw new Error('Please paste or upload JSON data first.');

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }

      let arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) throw new Error('JSON array is empty.');

      const sep = sepSelect.value || '.';
      const delim = delimSelect.value || ',';

      // Flatten each object
      const flatRows = arr.map(item => {
        if (typeof item === 'object' && item !== null) {
          return flattenObject(item, '', sep);
        }
        return { value: item };
      });

      // Collect union of all keys across objects to preserve missing properties
      const allKeys = [];
      const keySet = new Set();
      flatRows.forEach(row => {
        Object.keys(row).forEach(k => {
          if (!keySet.has(k)) {
            keySet.add(k);
            allKeys.push(k);
          }
        });
      });

      // Escape cell value per RFC 4180
      function escapeCell(val) {
        if (val === null || val === undefined) return '';
        let s = String(val);
        if (s.includes('"') || s.includes(delim) || s.includes('\n') || s.includes('\r')) {
          s = `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      }

      const rows = [];
      // Header row
      rows.push(allKeys.map(k => escapeCell(k)).join(delim));

      // Data rows
      flatRows.forEach(row => {
        const line = allKeys.map(k => escapeCell(row[k] !== undefined ? row[k] : ''));
        rows.push(line.join(delim));
      });

      const csvText = rows.join('\r\n');
      return { csvText, rowCount: flatRows.length, colCount: allKeys.length };
    }

    // Input changes
    input.addEventListener('input', () => {
      try {
        const res = parseJsonToCsv();
        stats.textContent = `JSON Input: ${res.rowCount} rows • ${res.colCount} columns`;
        status.textContent = `Ready (${res.rowCount} rows detected)`;
      } catch (err) {
        stats.textContent = 'JSON Input (Array of Objects)';
        status.textContent = 'Pending valid JSON';
      }
    });

    // Sample
    btnLoadSample.addEventListener('click', () => {
      const sample = [
        { id: 101, name: "Leila Mansour", role: "Frontend Architect", location: { city: "Doha", country: "Qatar" }, skills: ["TypeScript", "Vue", "Tailwind"] },
        { id: 102, name: "Karim Ben Salah", role: "Cloud Systems Engineer", location: { city: "Tunis", country: "Tunisia" }, skills: ["Cloudflare", "Docker", "Node.js"] },
        { id: 103, name: "Marcus Vance", role: "Product Designer", location: { city: "Austin", country: "United States" }, skills: ["Figma", "Design Systems"] }
      ];
      input.value = JSON.stringify(sample, null, 2);
      input.dispatchEvent(new Event('input'));
      if (typeof showToast !== 'undefined') showToast('Sample loaded!');
    });

    // File Drag & Drop
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadFile(e.target.files[0]);
      }
    });

    function loadFile(file) {
      fileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        input.value = e.target.result;
        input.dispatchEvent(new Event('input'));
        if (typeof showToast !== 'undefined') showToast(`Loaded ${file.name}`);
      };
      reader.readAsText(file);
    }

    // Copy CSV
    btnCopy.addEventListener('click', () => {
      try {
        const { csvText, rowCount } = parseJsonToCsv();
        navigator.clipboard.writeText(csvText).then(() => {
          if (typeof showToast !== 'undefined') showToast(`Copied ${rowCount} rows of CSV to clipboard!`);
        });
      } catch (err) {
        if (typeof showToast !== 'undefined') showToast(err.message, 'error');
      }
    });

    // Download CSV
    btnDownload.addEventListener('click', () => {
      try {
        const { csvText, rowCount } = parseJsonToCsv();
        const hasBom = bomSelect.value === 'bom';
        const blobParts = hasBom ? ['\uFEFF', csvText] : [csvText];
        const blob = new Blob(blobParts, { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const delim = delimSelect.value;
        const ext = delim === '\t' ? 'tsv' : 'csv';
        a.download = `tabkit_export_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof showToast !== 'undefined') showToast(`Downloaded ${rowCount} rows (${ext.toUpperCase()})!`);
      } catch (err) {
        if (typeof showToast !== 'undefined') showToast(err.message, 'error');
      }
    });
  }
});
