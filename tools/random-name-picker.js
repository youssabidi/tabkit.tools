// Tool: random-name-picker
// Random Picker
function rollNumber(toolId) {
  const min = parseInt(document.getElementById(`${toolId}_min`).value, 10) || 0;
  const max = parseInt(document.getElementById(`${toolId}_max`).value, 10) || 0;
  if (min > max) {
    document.getElementById(`${toolId}_numRes`).textContent = 'Err';
    return;
  }
  const res = Math.floor(Math.random() * (max - min + 1)) + min;
  document.getElementById(`${toolId}_numRes`).textContent = res;
}

function pickRandom(toolId) {
  const listEl = document.getElementById(`${toolId}_list`);
  const resEl = document.getElementById(`${toolId}_listRes`);
  if (!listEl || !resEl) return;

  const items = listEl.value.split('\n').filter(x => x.trim().length > 0);
  if (!items.length) {
    resEl.textContent = 'List is empty';
    return;
  }
  resEl.textContent = items[Math.floor(Math.random() * items.length)];
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['random-name-picker'] = Object.assign(window.TOOLS_REGISTRY['random-name-picker'] || {}, {
    id: 'random-name-picker',
    name: 'Random Name Picker & Wheel',
    category: 'Productivity & Math',
    standaloneUrl: '/random-name-picker.html',
    description: 'Pick a random name from a list or generate a random number.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans text-xs">
        <div class="p-2.5 bg-workspace-bg border border-workspace-border rounded-lg flex items-center gap-2">
          <input id="${toolId}_min" type="number" value="1" class="w-16 bg-workspace-surface border border-workspace-border rounded p-1.5 text-workspace-text focus:outline-none" placeholder="Min">
          <span class="text-workspace-muted">to</span>
          <input id="${toolId}_max" type="number" value="100" class="w-20 bg-workspace-surface border border-workspace-border rounded p-1.5 text-workspace-text focus:outline-none" placeholder="Max">
          <button onclick="rollNumber('${toolId}')" class="flex-1 bg-workspace-surface border border-workspace-border py-1.5 rounded hover:text-workspace-accent transition-colors">Roll</button>
          <div id="${toolId}_numRes" class="w-12 text-center font-mono text-base font-bold text-workspace-accent">--</div>
        </div>
        
        <div class="flex-1 flex flex-col space-y-2">
          <textarea id="${toolId}_list" class="w-full h-24 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-workspace-text focus:outline-none resize-none" placeholder="Paste a list of names or items (one per line)..."></textarea>
          <button onclick="pickRandom('${toolId}')" class="w-full py-2 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent font-medium rounded-lg transition-all">Pick Random Item</button>
          <div id="${toolId}_listRes" class="text-center font-bold text-workspace-accent py-1 truncate text-sm">--</div>
        </div>
      </div>
    `,
    init: () => {}
  });
