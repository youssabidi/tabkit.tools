// Tool: regex-tester (Interactive Live Regular Expression Sandbox)
function testRegexTool(toolId) {
  const patternInput = document.getElementById(`${toolId}_pattern`);
  const flagsInput = document.getElementById(`${toolId}_flags`);
  const textInput = document.getElementById(`${toolId}_text`);
  const highlight = document.getElementById(`${toolId}_highlight`);
  const matchCount = document.getElementById(`${toolId}_matchCount`);

  if (!patternInput || !textInput || !highlight || !matchCount) return;

  const rawPattern = patternInput.value;
  const flags = flagsInput ? flagsInput.value : 'g';
  const text = textInput.value;

  if (!rawPattern || !text) {
    highlight.innerHTML = escapeHtml(text);
    matchCount.textContent = '0 matches';
    return;
  }

  try {
    const re = new RegExp(rawPattern, flags.includes('g') ? flags : flags + 'g');
    let matches = 0;
    const highlighted = text.replace(re, (m) => {
      matches++;
      return `<mark class="bg-amber-400/30 text-amber-300 font-bold px-0.5 rounded border border-amber-400/40">${escapeHtml(m)}</mark>`;
    });

    highlight.innerHTML = highlighted;
    matchCount.textContent = `${matches} match${matches === 1 ? '' : 'es'}`;
    matchCount.className = matches > 0 ? 'text-workspace-accent font-bold' : 'text-workspace-muted';
  } catch (err) {
    matchCount.textContent = 'Invalid regex';
    matchCount.className = 'text-workspace-danger font-bold';
    highlight.innerHTML = escapeHtml(text);
  }
}

function loadRegexPreset(toolId, pattern) {
  const patternInput = document.getElementById(`${toolId}_pattern`);
  if (patternInput) {
    patternInput.value = pattern;
    testRegexTool(toolId);
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['regex-tester'] = Object.assign(window.TOOLS_REGISTRY['regex-tester'] || {}, {
  id: 'regex-tester',
  name: 'Regular Expression (Regex) Live Tester',
  category: 'Developer',
  standaloneUrl: '/regex-tester.html',
  description: 'Test, debug, and highlight regular expressions against sample text with live capture badges and cheatsheets.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <div class="flex items-center gap-1.5 bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1">
        <span class="text-workspace-muted font-mono text-xs">/</span>
        <input id="${toolId}_pattern" type="text" placeholder="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" class="flex-1 bg-transparent font-mono text-xs text-workspace-text focus:outline-none placeholder-workspace-muted" />
        <span class="text-workspace-muted font-mono text-xs">/</span>
        <input id="${toolId}_flags" type="text" value="g" title="Flags (g, i, m, s)" class="w-8 text-center bg-workspace-surface border border-workspace-border rounded text-[11px] font-mono text-workspace-accent focus:outline-none" />
      </div>

      <div class="relative flex-1 min-h-[140px]">
        <div id="${toolId}_highlight" class="absolute inset-0 p-2.5 font-mono text-[11px] leading-relaxed overflow-y-auto whitespace-pre-wrap break-words pointer-events-none text-workspace-text"></div>
        <textarea id="${toolId}_text" class="w-full h-full min-h-[140px] bg-transparent border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-transparent caret-white placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed select-text" placeholder="Paste sample text here to test against regex pattern..."></textarea>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-workspace-border text-[10px] font-mono">
        <div class="flex items-center gap-1 text-workspace-muted">
          <span>Presets:</span>
          <button onclick="loadRegexPreset('${toolId}', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}')" class="hover:text-workspace-accent underline">Email</button>
          <span>•</span>
          <button onclick="loadRegexPreset('${toolId}', 'https?:\\\\/\\\\/[\\\\w\\\\.-]+(\\\\.[\\\\w\\\\.-]+)+[\\\\w\\\\-\\\\._~:/?#[\\\\]@!\\\\$&\\'()*+,;=.]+')" class="hover:text-workspace-accent underline">URL</button>
          <span>•</span>
          <button onclick="loadRegexPreset('${toolId}', '\\\\b(?:\\\\d{1,3}\\\\.){3}\\\\d{1,3}\\\\b')" class="hover:text-workspace-accent underline">IP</button>
        </div>
        <span id="${toolId}_matchCount" class="text-workspace-muted">0 matches</span>
      </div>
    </div>
  `,
  init: (toolId) => {
    const patternInput = document.getElementById(`${toolId}_pattern`);
    const flagsInput = document.getElementById(`${toolId}_flags`);
    const textInput = document.getElementById(`${toolId}_text`);
    const highlight = document.getElementById(`${toolId}_highlight`);

    if (textInput && highlight) {
      textInput.addEventListener('scroll', () => {
        highlight.scrollTop = textInput.scrollTop;
      });
      textInput.addEventListener('input', () => testRegexTool(toolId));
    }
    if (patternInput) patternInput.addEventListener('input', () => testRegexTool(toolId));
    if (flagsInput) flagsInput.addEventListener('input', () => testRegexTool(toolId));

    if (textInput && !textInput.value) {
      patternInput.value = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
      textInput.value = 'Contact support@tabkit.tools or dev.team@company.org for assistance.';
      testRegexTool(toolId);
    }
  }
});
