// Tool: pomodoro-timer
// Pomodoro Timer
const timers = {};

function toggleTimer(toolId) {
  const t = timers[toolId];
  if (!t) return;
  const btn = document.getElementById(`${toolId}_btnToggle`);

  if (t.isRunning) {
    clearInterval(t.interval);
    t.isRunning = false;
    if (btn) btn.textContent = 'Start';
  } else {
    t.isRunning = true;
    if (btn) btn.textContent = 'Pause';
    t.interval = setInterval(() => {
      if (t.timeLeft > 0) {
        t.timeLeft--;
        updateTimerDisplay(toolId);
      } else {
        clearInterval(t.interval);
        t.isRunning = false;
        if (btn) btn.textContent = 'Start';
        showToast('Time is up!');
      }
    }, 1000);
  }
}

function setTimer(toolId, minutes) {
  const t = timers[toolId];
  if (!t) return;
  clearInterval(t.interval);
  t.isRunning = false;
  t.timeLeft = minutes * 60;
  const btn = document.getElementById(`${toolId}_btnToggle`);
  if (btn) btn.textContent = 'Start';
  updateTimerDisplay(toolId);
}

function updateTimerDisplay(toolId) {
  const t = timers[toolId];
  if (!t) return;
  const m = Math.floor(t.timeLeft / 60).toString().padStart(2, '0');
  const s = (t.timeLeft % 60).toString().padStart(2, '0');
  const el = document.getElementById(`${toolId}_display`);
  if (el) el.textContent = `${m}:${s}`;
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pomodoro-timer'] = Object.assign(window.TOOLS_REGISTRY['pomodoro-timer'] || {}, {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer Online',
    category: 'Productivity',
    standaloneUrl: '/pomodoro-timer.html',
    description: 'A simple Pomodoro countdown timer for focused work sessions.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-4 font-sans items-center justify-center py-2">
        <div class="flex gap-2 bg-workspace-bg p-1 rounded-lg border border-workspace-border text-xs w-full">
          <button onclick="setTimer('${toolId}', 25)" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-text hover:text-workspace-accent transition-colors">25 Work</button>
          <button onclick="setTimer('${toolId}', 5)" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-text hover:text-workspace-accent transition-colors">5 Break</button>
        </div>
        <div id="${toolId}_display" class="text-5xl font-bold font-mono text-workspace-accent tracking-widest">25:00</div>
        <button id="${toolId}_btnToggle" onclick="toggleTimer('${toolId}')" class="w-full py-2 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent font-bold rounded-lg transition-all text-sm">
          Start
        </button>
      </div>
    `,
    init: (toolId) => {
      timers[toolId] = { timeLeft: 25 * 60, isRunning: false, interval: null };
      updateTimerDisplay(toolId);
    }
  });
