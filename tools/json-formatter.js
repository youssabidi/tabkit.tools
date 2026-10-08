// Tool: json-formatter
// JSON Formatter
function formatJsonTool(toolId, minify = false) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    showToast('Please paste JSON first.', 'error');
    return;
  }
  try {
    const obj = JSON.parse(input.value);
    input.value = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
    showToast(minify ? 'JSON Minified!' : 'JSON Formatted!');
  } catch (e) {
    showToast('Invalid JSON: ' + e.message, 'error');
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['json-formatter'] = Object.assign(window.TOOLS_REGISTRY['json-formatter'] || {}, {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'Developer',
    standaloneUrl: '/json-formatter.html',
    description: 'Format, validate, and minify JSON strings instantly.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <textarea id="${toolId}_input" class="w-full h-40 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder='Paste JSON here... e.g. {"key": "value"}'></textarea>
        <div class="flex items-center gap-2">
          <button onclick="formatJsonTool('${toolId}', false)" class="flex-1 py-1.5 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent rounded-lg text-xs font-medium transition-all">Format JSON</button>
          <button onclick="formatJsonTool('${toolId}', true)" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Minify</button>
          <button onclick="copyTextTool('${toolId}')" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Copy</button>
        </div>
      </div>
    `,
    init: () => {}
  });
