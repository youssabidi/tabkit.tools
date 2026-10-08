// Tool: text-diff-checker
// Text Diff & Notes
function toggleScratchMode(toolId, mode) {
  const isNotes = mode === 'notes';
  const notesEl = document.getElementById(`${toolId}_notesContainer`);
  const diffEl = document.getElementById(`${toolId}_diffContainer`);
  const tabNote = document.getElementById(`${toolId}_tabNote`);
  const tabDiff = document.getElementById(`${toolId}_tabDiff`);

  if (notesEl && diffEl) {
    notesEl.classList.toggle('hidden', !isNotes);
    diffEl.classList.toggle('hidden', isNotes);
  }

  if (tabNote && tabDiff) {
    tabNote.className = isNotes 
      ? "px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent"
      : "px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text";
    tabDiff.className = !isNotes 
      ? "px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent"
      : "px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text";
  }
}

function runTextDiff(toolId) {
  const inputA = document.getElementById(`${toolId}_diffA`);
  const inputB = document.getElementById(`${toolId}_diffB`);
  const output = document.getElementById(`${toolId}_diffOutput`);

  if (!inputA || !inputB || !output) return;
  if (!inputA.value && !inputB.value) {
    showToast('Please enter text in both fields to compare.', 'error');
    return;
  }

  const linesA = inputA.value.split('\n');
  const linesB = inputB.value.split('\n');
  const diffs = computeLCSDiff(linesA, linesB);

  output.innerHTML = diffs.map((line, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    let colorClass = 'text-workspace-text';
    let prefix = ' ';
    let bgClass = 'bg-transparent';

    if (line.type === 'add') {
      colorClass = 'text-green-400';
      prefix = '+';
      bgClass = 'bg-green-400/10';
    } else if (line.type === 'del') {
      colorClass = 'text-red-400';
      prefix = '-';
      bgClass = 'bg-red-400/10';
    }

    const safeText = escapeHtml(line.text);
    return `<div class="flex gap-2 px-1 rounded ${bgClass}">
      <span class="text-workspace-muted select-none w-6 text-right border-r border-workspace-borderLight pr-1">${num}</span>
      <span class="select-none font-bold ${colorClass}">${prefix}</span>
      <span class="${colorClass} whitespace-pre-wrap break-all">${safeText || ' '}</span>
    </div>`;
  }).join('');
  
  showToast('Difference computed!');
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['text-diff-checker'] = Object.assign(window.TOOLS_REGISTRY['text-diff-checker'] || {}, {
    id: 'text-diff-checker',
    name: 'Text Diff Checker & Notepad',
    category: 'Text & Data',
    standaloneUrl: '/text-diff-checker.html',
    description: 'Auto-saving local notes and true line-by-line diff comparison.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="flex items-center justify-between text-xs">
          <div class="flex gap-1 bg-workspace-bg p-0.5 rounded-lg border border-workspace-border">
            <button id="${toolId}_tabNote" onclick="toggleScratchMode('${toolId}', 'notes')" class="px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent">Notes</button>
            <button id="${toolId}_tabDiff" onclick="toggleScratchMode('${toolId}', 'diff')" class="px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text">Diff</button>
          </div>
          <span id="${toolId}_saveStatus" class="text-[10px] text-workspace-muted font-mono">Synced</span>
        </div>
        <div id="${toolId}_notesContainer" class="flex-1 flex flex-col space-y-2">
          <textarea id="${toolId}_textarea" class="w-full h-44 bg-workspace-bg border border-workspace-border rounded-lg p-3 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-borderLight focus:outline-none resize-none" placeholder="Type or paste quick notes here (auto-saved locally)..."></textarea>
        </div>
        <div id="${toolId}_diffContainer" class="hidden flex-1 flex flex-col space-y-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 h-36">
            <textarea id="${toolId}_diffA" class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Original text..."></textarea>
            <textarea id="${toolId}_diffB" class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Modified text..."></textarea>
          </div>
          <button onclick="runTextDiff('${toolId}')" class="w-full py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-[11px] rounded text-workspace-text font-mono transition-all">Compute Accurate Diff</button>
          <div id="${toolId}_diffOutput" class="max-h-28 overflow-y-auto p-2 bg-workspace-bg border border-workspace-border rounded text-[10px] font-mono space-y-0.5"></div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const textarea = document.getElementById(`${toolId}_textarea`);
      const status = document.getElementById(`${toolId}_saveStatus`);
      const saved = localStorage.getItem('tabkit_scratchpad_data');
      if (saved && textarea) textarea.value = saved;

      let saveTimer;
      if (textarea) {
        textarea.addEventListener('input', () => {
          if (status) status.textContent = 'Saving...';
          clearTimeout(saveTimer);
          saveTimer = setTimeout(() => {
            localStorage.setItem('tabkit_scratchpad_data', textarea.value);
            if (status) status.textContent = 'Synced';
            if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
          }, 500);
        });
      }
    }
  });
