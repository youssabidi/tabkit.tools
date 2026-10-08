// Tool: case-converter
// Case Converter
function transformCase(toolId, type) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    showToast('Please enter text first.', 'error');
    return;
  }

  let val = input.value;
  if (type === 'upper') {
    val = val.toUpperCase();
    showToast('Converted to UPPERCASE');
  } else if (type === 'lower') {
    val = val.toLowerCase();
    showToast('Converted to lowercase');
  } else if (type === 'title') {
    val = val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    showToast('Converted to Title Case');
  } else if (type === 'dedupe') {
    const lines = val.split('\n');
    const unique = Array.from(new Set(lines));
    val = unique.join('\n');
    showToast(`Removed ${lines.length - unique.length} duplicate line(s)`);
  }

  input.value = val;
  input.dispatchEvent(new Event('input'));
}

function copyTextTool(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  if (input && input.value) {
    navigator.clipboard.writeText(input.value);
    showToast('Text copied to clipboard!');
  } else {
    showToast('Nothing to copy.', 'error');
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['case-converter'] = Object.assign(window.TOOLS_REGISTRY['case-converter'] || {}, {
    id: 'case-converter',
    name: 'Case Converter & Word Counter',
    category: 'Text',
    standaloneUrl: '/case-converter.html',
    description: 'Deduplicate lines, toggle cases, and count words and characters without uploads.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <div class="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
          <button onclick="transformCase('${toolId}', 'upper')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">UPPER</button>
          <button onclick="transformCase('${toolId}', 'lower')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">lower</button>
          <button onclick="transformCase('${toolId}', 'title')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">Title</button>
          <button onclick="transformCase('${toolId}', 'dedupe')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">Dedupe</button>
        </div>
        <textarea id="${toolId}_input" class="w-full h-36 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Paste text to reformat..."></textarea>
        <div class="flex items-center justify-between text-[11px] font-mono text-workspace-muted">
          <div class="flex gap-2">
            <span id="${toolId}_statsWords">0 words</span>
            <span>•</span>
            <span id="${toolId}_statsChars">0 chars</span>
          </div>
          <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-0.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-workspace-text rounded text-xs transition-all">Copy Text</button>
        </div>
      </div>
    `,
    init: (toolId) => {
      const input = document.getElementById(`${toolId}_input`);
      const words = document.getElementById(`${toolId}_statsWords`);
      const chars = document.getElementById(`${toolId}_statsChars`);
      if (input) {
        input.addEventListener('input', () => {
          const val = input.value;
          if (chars) chars.textContent = `${val.length} chars`;
          const wordCount = val.trim() ? val.trim().split(/\s+/).length : 0;
          if (words) words.textContent = `${wordCount} words`;
        });
      }
    }
  });
