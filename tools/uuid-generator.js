// Tool: uuid-generator (Bulk Cryptographically Secure UUID v4 Generator)
function generateUuidsTool(toolId) {
  const countEl = document.getElementById(`${toolId}_count`);
  const upperEl = document.getElementById(`${toolId}_uppercase`);
  const hyphenEl = document.getElementById(`${toolId}_hyphens`);
  const outputEl = document.getElementById(`${toolId}_output`);
  if (!outputEl) return;

  const count = parseInt(countEl ? countEl.value : '5', 10) || 5;
  const isUpper = upperEl ? upperEl.checked : false;
  const hasHyphens = hyphenEl ? hyphenEl.checked : true;

  const results = [];
  for (let i = 0; i < count; i++) {
    let id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    if (!hasHyphens) id = id.replace(/-/g, '');
    if (isUpper) id = id.toUpperCase();
    results.push(id);
  }

  outputEl.value = results.join('\n');
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['uuid-generator'] = Object.assign(window.TOOLS_REGISTRY['uuid-generator'] || {}, {
  id: 'uuid-generator',
  name: 'Bulk UUID / GUID v4 Generator',
  category: 'Productivity & Math',
  standaloneUrl: '/uuid-generator.html',
  description: 'Generate bulk cryptographically secure UUID v4 identifiers locally with custom formatting and uppercase toggles.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <div class="flex flex-wrap items-center justify-between gap-2 bg-workspace-bg p-2 rounded-lg border border-workspace-border text-[11px] font-mono">
        <div class="flex items-center gap-1.5">
          <span class="text-workspace-muted">Count:</span>
          <select id="${toolId}_count" onchange="generateUuidsTool('${toolId}')" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-workspace-accent font-bold focus:outline-none">
            <option value="1">1</option>
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <label class="flex items-center gap-1 cursor-pointer text-workspace-muted hover:text-workspace-text">
            <input type="checkbox" id="${toolId}_uppercase" onchange="generateUuidsTool('${toolId}')" class="accent-[#10B981] rounded" />
            <span>Uppercase</span>
          </label>
          <label class="flex items-center gap-1 cursor-pointer text-workspace-muted hover:text-workspace-text">
            <input type="checkbox" id="${toolId}_hyphens" checked onchange="generateUuidsTool('${toolId}')" class="accent-[#10B981] rounded" />
            <span>Hyphens</span>
          </label>
        </div>
      </div>

      <textarea id="${toolId}_output" readonly class="flex-1 w-full min-h-[140px] bg-workspace-surface/50 border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-accent focus:outline-none resize-none leading-relaxed select-text"></textarea>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <button onclick="generateUuidsTool('${toolId}')" class="px-3 py-1 bg-workspace-accent text-black font-bold rounded-lg hover:bg-workspace-accentHover transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Regenerate</button>
        <button onclick="copyOutputTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Copy All</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    generateUuidsTool(toolId);
  }
});
