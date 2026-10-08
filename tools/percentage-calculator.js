// Tool: percentage-calculator
// Percentage Calculations
function calcPct1(toolId) {
  const a = parseFloat(document.getElementById(`${toolId}_p1A`).value) || 0;
  const b = parseFloat(document.getElementById(`${toolId}_p1B`).value) || 0;
  const res = (a / 100) * b;
  document.getElementById(`${toolId}_p1R`).textContent = Number.isInteger(res) ? res : res.toFixed(2);
}

function calcPct2(toolId) {
  const a = parseFloat(document.getElementById(`${toolId}_p2A`).value) || 0;
  const b = parseFloat(document.getElementById(`${toolId}_p2B`).value) || 0;
  if (b === 0) {
    document.getElementById(`${toolId}_p2R`).textContent = '0';
    return;
  }
  const res = (a / b) * 100;
  document.getElementById(`${toolId}_p2R`).textContent = Number.isInteger(res) ? res : res.toFixed(2);
}

function calcPct3(toolId) {
  const a = parseFloat(document.getElementById(`${toolId}_p3A`).value) || 0;
  const b = parseFloat(document.getElementById(`${toolId}_p3B`).value) || 0;
  const res = a + (a * (b / 100));
  document.getElementById(`${toolId}_p3R`).textContent = Number.isInteger(res) ? res : res.toFixed(2);
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['percentage-calculator'] = Object.assign(window.TOOLS_REGISTRY['percentage-calculator'] || {}, {
    id: 'percentage-calculator',
    name: 'Online Percentage Calculator',
    category: 'Productivity & Math',
    standaloneUrl: '/percentage-calculator.html',
    description: 'Everyday percentage calculator for discounts, tips, and fractions.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans text-xs">
        <div class="p-2.5 bg-workspace-bg border border-workspace-border rounded-lg flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">What is</span>
            <input id="${toolId}_p1A" type="number" oninput="calcPct1('${toolId}')" class="w-14 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="15">
            <span class="text-workspace-muted">% of</span>
            <input id="${toolId}_p1B" type="number" oninput="calcPct1('${toolId}')" class="w-20 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="100">
          </div>
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">=</span>
            <span id="${toolId}_p1R" class="font-bold text-workspace-accent text-sm w-12 text-right">15</span>
          </div>
        </div>
        <div class="p-2.5 bg-workspace-bg border border-workspace-border rounded-lg flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <input id="${toolId}_p2A" type="number" oninput="calcPct2('${toolId}')" class="w-16 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="25">
            <span class="text-workspace-muted">is what % of</span>
            <input id="${toolId}_p2B" type="number" oninput="calcPct2('${toolId}')" class="w-20 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="100">
          </div>
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">=</span>
            <span id="${toolId}_p2R" class="font-bold text-workspace-accent text-sm w-12 text-right">25</span>
          </div>
        </div>
        <div class="p-2.5 bg-workspace-bg border border-workspace-border rounded-lg flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">Increase</span>
            <input id="${toolId}_p3A" type="number" oninput="calcPct3('${toolId}')" class="w-16 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="100">
            <span class="text-workspace-muted">by</span>
            <input id="${toolId}_p3B" type="number" oninput="calcPct3('${toolId}')" class="w-14 bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-workspace-text focus:outline-none" value="10">
            <span class="text-workspace-muted">%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-workspace-muted">=</span>
            <span id="${toolId}_p3R" class="font-bold text-workspace-accent text-sm w-12 text-right">110</span>
          </div>
        </div>
      </div>
    `,
    init: (toolId) => {
      calcPct1(toolId);
      calcPct2(toolId);
      calcPct3(toolId);
    }
  });
