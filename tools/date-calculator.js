// Tool: date-calculator
// Date Calculations
function calcDateDiff(toolId) {
  const a = document.getElementById(`${toolId}_d1A`).value;
  const b = document.getElementById(`${toolId}_d1B`).value;
  if (a && b) {
    const da = new Date(a);
    const db = new Date(b);
    const diffTime = Math.abs(db - da);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById(`${toolId}_d1R`).textContent = `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }
}

function calcDateAdd(toolId) {
  const a = document.getElementById(`${toolId}_d2A`).value;
  const days = parseInt(document.getElementById(`${toolId}_d2B`).value, 10) || 0;
  if (a) {
    const parts = a.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + days);
    document.getElementById(`${toolId}_d2R`).textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['date-calculator'] = Object.assign(window.TOOLS_REGISTRY['date-calculator'] || {}, {
    id: 'date-calculator',
    name: 'Days Between Dates Calculator',
    category: 'Productivity & Math',
    standaloneUrl: '/date-calculator.html',
    description: 'Calculate days between dates or add/subtract days from a date.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans text-xs">
        <div class="p-3 bg-workspace-bg border border-workspace-border rounded-lg space-y-2.5">
          <div class="text-workspace-muted font-mono text-[10px] uppercase tracking-wider">Days Between Dates</div>
          <div class="flex items-center gap-2">
            <input id="${toolId}_d1A" type="date" onchange="calcDateDiff('${toolId}')" class="flex-1 bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none">
            <span class="text-workspace-muted">and</span>
            <input id="${toolId}_d1B" type="date" onchange="calcDateDiff('${toolId}')" class="flex-1 bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none">
          </div>
          <div class="text-workspace-accent font-bold text-sm text-right" id="${toolId}_d1R">0 days</div>
        </div>
        <div class="p-3 bg-workspace-bg border border-workspace-border rounded-lg space-y-2.5">
          <div class="text-workspace-muted font-mono text-[10px] uppercase tracking-wider">Add / Subtract Days</div>
          <div class="flex items-center gap-2">
            <input id="${toolId}_d2A" type="date" onchange="calcDateAdd('${toolId}')" class="flex-1 bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none">
            <span class="text-workspace-muted">+</span>
            <input id="${toolId}_d2B" type="number" value="30" oninput="calcDateAdd('${toolId}')" class="w-16 bg-workspace-surface border border-workspace-border rounded px-2 py-1.5 text-workspace-text focus:outline-none">
            <span class="text-workspace-muted">days</span>
          </div>
          <div class="text-workspace-accent font-bold text-sm text-right" id="${toolId}_d2R">--</div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const today = new Date().toISOString().split('T')[0];
      document.getElementById(`${toolId}_d1A`).value = today;
      document.getElementById(`${toolId}_d1B`).value = today;
      document.getElementById(`${toolId}_d2A`).value = today;
      calcDateDiff(toolId);
      calcDateAdd(toolId);
    }
  });
