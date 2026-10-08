// Tool: csv-json-converter (Bi-directional CSV & JSON Data Converter)
function convertCsvToJsonTool(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  const output = document.getElementById(`${toolId}_output`);
  if (!input || !output || !input.value.trim()) return;

  try {
    const raw = input.value.trim();
    // Check if input is JSON
    if (raw.startsWith('[') || raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) return;

      const keys = Object.keys(arr[0]);
      const csvRows = [keys.join(',')];
      arr.forEach(row => {
        const vals = keys.map(k => {
          let v = row[k] === null || row[k] === undefined ? '' : String(row[k]);
          if (v.includes(',') || v.includes('"') || v.includes('\n')) {
            v = `"${v.replace(/"/g, '""')}"`;
          }
          return v;
        });
        csvRows.push(vals.join(','));
      });
      output.value = csvRows.join('\n');
      if (typeof showToast !== 'undefined') showToast('Converted JSON to CSV!');
      return;
    }

    // CSV to JSON
    const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      if (typeof showToast !== 'undefined') showToast('Please enter at least header + 1 row', 'error');
      return;
    }

    // Detect delimiter
    const headerLine = lines[0];
    const delimiter = headerLine.includes('\t') ? '\t' : (headerLine.includes(';') ? ';' : ',');
    const headers = headerLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        let val = parts[idx] !== undefined ? parts[idx] : '';
        if (!isNaN(val) && val !== '') val = Number(val);
        else if (val.toLowerCase() === 'true') val = true;
        else if (val.toLowerCase() === 'false') val = false;
        obj[h] = val;
      });
      result.push(obj);
    }

    output.value = JSON.stringify(result, null, 2);
    if (typeof showToast !== 'undefined') showToast(`Converted ${result.length} rows to JSON!`);
  } catch (e) {
    if (typeof showToast !== 'undefined') showToast('Conversion failed: ' + e.message, 'error');
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['csv-json-converter'] = Object.assign(window.TOOLS_REGISTRY['csv-json-converter'] || {}, {
  id: 'csv-json-converter',
  name: 'CSV ↔ JSON Converter',
  category: 'Data',
  standaloneUrl: '/csv-json-converter.html',
  description: 'Convert CSV spreadsheets to JSON arrays or transform JSON objects back into CSV tables locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[170px]">
        <textarea id="${toolId}_input" class="w-full h-full min-h-[150px] bg-workspace-bg border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder="id,name,role&#10;1,Alex,Developer&#10;2,Sarah,Designer"></textarea>
        <textarea id="${toolId}_output" readonly class="w-full h-full min-h-[150px] bg-workspace-surface/50 border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:outline-none resize-none leading-relaxed select-text" placeholder="Resulting JSON or CSV output will appear here..."></textarea>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <button onclick="convertCsvToJsonTool('${toolId}')" class="px-3 py-1 bg-workspace-accent text-black font-bold rounded-lg hover:bg-workspace-accentHover transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Convert &harr;</button>
        <div class="flex items-center gap-1.5">
          <button onclick="copyOutputTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Copy Result</button>
        </div>
      </div>
    </div>
  `,
  init: () => {}
});
