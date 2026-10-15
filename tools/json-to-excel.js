// Tool: json-to-excel (Client-Side JSON to Excel .xlsx Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['json-to-excel'] = Object.assign(window.TOOLS_REGISTRY['json-to-excel'] || {}, {
  id: 'json-to-excel',
  name: 'JSON to Excel (.xlsx) Converter',
  category: 'Text & Data',
  standaloneUrl: '/json-to-excel',
  description: 'Convert JSON arrays or objects directly into formatted Microsoft Excel (.xlsx) workbooks locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept=".json,.txt" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop .json File</span>
        <span class="text-[9px] text-workspace-muted">Or paste JSON array [{...}] directly into the editor</span>
      </div>

      <!-- Settings -->
      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <label class="text-workspace-muted block mb-0.5">Worksheet Name:</label>
            <input id="${toolId}_sheetNameInput" type="text" value="JSON_Export" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-[10px] text-workspace-text focus:outline-none" />
          </div>
          <div>
            <label class="text-workspace-muted block mb-0.5">Header Style:</label>
            <select id="${toolId}_headerStyleSelect" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-[10px] text-workspace-text focus:outline-none">
              <option value="first" selected>Auto Keys (from first object)</option>
              <option value="all">Union of All Keys (all objects)</option>
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
        <textarea id="${toolId}_input" placeholder="Paste JSON here...&#10;[&#10;  { &quot;id&quot;: 1, &quot;name&quot;: &quot;Alice&quot;, &quot;city&quot;: &quot;Doha&quot; },&#10;  { &quot;id&quot;: 2, &quot;name&quot;: &quot;Bob&quot;, &quot;city&quot;: &quot;London&quot; }&#10;]" class="w-full flex-1 bg-transparent text-workspace-text text-[11px] focus:outline-none resize-none font-mono"></textarea>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Enter JSON data</span>
        <button id="${toolId}_btnDownload" class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 transition-all shadow-sm">Convert & Download .xlsx</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const sheetNameInput = document.getElementById(`${toolId}_sheetNameInput`);
    const headerStyleSelect = document.getElementById(`${toolId}_headerStyleSelect`);
    const input = document.getElementById(`${toolId}_input`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnLoadSample = document.getElementById(`${toolId}_btnLoadSample`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);
    const status = document.getElementById(`${toolId}_status`);

    let originalBaseName = 'json_export';

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = '/xlsx.full.min.js';
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
        status.textContent = 'JSON file loaded';
      };
      reader.readAsText(file);
    }

    function updateStats() {
      const raw = input.value.trim();
      if (!raw) {
        stats.textContent = 'JSON Input (Array of Objects)';
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stats.textContent = `${parsed.length} JSON objects detected`;
        } else if (typeof parsed === 'object' && parsed !== null) {
          stats.textContent = `1 root object (${Object.keys(parsed).length} keys)`;
        }
      } catch (e) {
        stats.textContent = 'JSON syntax incomplete...';
      }
    }

    input.addEventListener('input', updateStats);

    btnLoadSample.addEventListener('click', () => {
      input.value = JSON.stringify([
        { "id": 101, "customer": "Global Trade Co", "country": "Qatar", "tier": "Gold", "revenue": 145000 },
        { "id": 102, "customer": "Doha Logistics", "country": "Qatar", "tier": "Platinum", "revenue": 290000 },
        { "id": 103, "customer": "Atlas Ventures", "country": "UAE", "tier": "Silver", "revenue": 82000 },
        { "id": 104, "customer": "Apex Health", "country": "UK", "tier": "Gold", "revenue": 160000 }
      ], null, 2);
      updateStats();
      status.textContent = 'Sample data loaded';
    });

    btnDownload.addEventListener('click', async () => {
      const raw = input.value.trim();
      if (!raw) {
        alert('Please paste or upload JSON first.');
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        alert('Invalid JSON syntax: ' + err.message);
        return;
      }

      status.textContent = 'Converting to Excel...';
      try {
        const XLSX = await ensureXlsx();
        let records = Array.isArray(parsed) ? parsed : [parsed];

        // Flatten nested objects if present and sanitize cells
        records = records.map(item => {
          if (typeof item !== 'object' || item === null) return { value: sanitizeSpreadsheetCell(item) };
          const flat = {};
          for (let [k, v] of Object.entries(item)) {
            if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
            const strVal = (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
            flat[k] = sanitizeSpreadsheetCell(strVal);
          }
          return flat;
        });

        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        const sheetName = (sheetNameInput.value || 'JSON_Export').trim().slice(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        XLSX.writeFile(wb, `${originalBaseName}.xlsx`);
        status.textContent = 'Excel file generated successfully!';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    });
  }
});
