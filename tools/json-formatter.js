// Tool: json-formatter
function formatJsonTool(toolId, minify = false) {
  const input = document.getElementById(`${toolId}_input`);
  const preview = document.getElementById(`${toolId}_preview`);
  const viewToggle = document.getElementById(`${toolId}_viewToggle`);

  if (!input || !input.value.trim()) {
    if (typeof showToast !== 'undefined') showToast('Please paste JSON first.', 'error');
    return;
  }
  try {
    const obj = JSON.parse(input.value);
    const formatted = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
    input.value = formatted;
    
    if (preview && typeof syntaxHighlightJson === 'function') {
      preview.innerHTML = syntaxHighlightJson(formatted);
      if (!minify && viewToggle) {
        // Show highlighted preview
        input.classList.add('hidden');
        preview.classList.remove('hidden');
        viewToggle.textContent = 'Edit Raw';
      }
    }
    if (typeof showToast !== 'undefined') showToast(minify ? 'JSON Minified!' : 'JSON Formatted!');
  } catch (e) {
    if (typeof showToast !== 'undefined') showToast('Invalid JSON: ' + e.message, 'error');
  }
}

function toggleJsonPreview(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  const preview = document.getElementById(`${toolId}_preview`);
  const viewToggle = document.getElementById(`${toolId}_viewToggle`);

  if (!input || !preview) return;

  if (preview.classList.contains('hidden')) {
    // Switch to preview
    try {
      if (input.value.trim()) {
        JSON.parse(input.value); // validate
        preview.innerHTML = typeof syntaxHighlightJson === 'function' ? syntaxHighlightJson(input.value) : escapeHtml(input.value);
        input.classList.add('hidden');
        preview.classList.remove('hidden');
        if (viewToggle) viewToggle.textContent = 'Edit Raw';
      } else {
        if (typeof showToast !== 'undefined') showToast('Please enter JSON first');
      }
    } catch (e) {
      if (typeof showToast !== 'undefined') showToast('Fix JSON errors before preview: ' + e.message, 'error');
    }
  } else {
    // Switch to raw editor
    preview.classList.add('hidden');
    input.classList.remove('hidden');
    input.focus();
    if (viewToggle) viewToggle.textContent = 'Highlight';
  }
}

function sendJsonToTs(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    if (typeof showToast !== 'undefined') showToast('Enter JSON first', 'error');
    return;
  }
  if (typeof sendToTool === 'function') {
    sendToTool('json-to-typescript', input.value);
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['json-formatter'] = Object.assign(window.TOOLS_REGISTRY['json-formatter'] || {}, {
  id: 'json-formatter',
  name: 'JSON Formatter & Validator',
  category: 'Text & Data',
  standaloneUrl: '/json-formatter.html',
  description: 'Format, validate, syntax-highlight, and minify JSON strings instantly.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans">
      <div class="relative flex-1 min-h-[160px]">
        <textarea id="${toolId}_input" class="w-full h-full min-h-[160px] bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none" placeholder='Paste JSON here... e.g. {"name": "TabKit", "active": true, "version": 2}'></textarea>
        <pre id="${toolId}_preview" class="hidden w-full h-full min-h-[160px] overflow-auto bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-xs font-mono leading-relaxed select-text"></pre>
      </div>
      
      <div class="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-workspace-border">
        <div class="flex items-center gap-1.5">
          <button onclick="formatJsonTool('${toolId}', false)" class="px-2.5 py-1 bg-workspace-accent/15 border border-workspace-accent/30 hover:bg-workspace-accent/25 text-workspace-accent rounded-lg text-xs font-semibold transition-all">Format</button>
          <button id="${toolId}_viewToggle" onclick="toggleJsonPreview('${toolId}')" class="px-2 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Highlight</button>
          <button onclick="formatJsonTool('${toolId}', true)" class="px-2 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-muted hover:text-workspace-text rounded-lg text-xs font-mono transition-all">Minify</button>
        </div>

        <div class="flex items-center gap-1.5">
          <button onclick="sendJsonToTs('${toolId}')" title="Send JSON to TypeScript generator" class="px-2 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 rounded-lg text-xs font-mono transition-all flex items-center gap-1">
            <span>&rarr; TS</span>
          </button>
          <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Copy</button>
        </div>
      </div>
    </div>
  `,
  init: () => {}
});
