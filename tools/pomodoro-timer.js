// Tool: pomodoro-timer (Sound & Browser Notifications)
const pomodoroTimers = {};

function togglePomodoroTimer(toolId) {
  const t = pomodoroTimers[toolId];
  if (!t) return;
  const btn = document.getElementById(`${toolId}_btnToggle`);

  if (t.isRunning) {
    clearInterval(t.interval);
    t.isRunning = false;
    if (btn) {
      btn.textContent = 'Resume';
      btn.classList.remove('bg-workspace-danger/20', 'text-workspace-danger');
      btn.classList.add('bg-workspace-accent/15', 'text-workspace-accent');
    }
  } else {
    // Request notification permission if enabled
    if (t.notifyEnabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    t.isRunning = true;
    if (btn) {
      btn.textContent = 'Pause';
      btn.classList.add('bg-workspace-danger/20', 'text-workspace-danger');
      btn.classList.remove('bg-workspace-accent/15', 'text-workspace-accent');
    }
    t.interval = setInterval(() => {
      if (t.timeLeft > 0) {
        t.timeLeft--;
        updatePomodoroTimerDisplay(toolId);
        document.title = `(${Math.floor(t.timeLeft/60)}:${(t.timeLeft%60).toString().padStart(2,'0')}) TabKit Timer`;
      } else {
        clearInterval(t.interval);
        t.isRunning = false;
        document.title = 'TabKit Tools';
        if (btn) {
          btn.textContent = 'Start';
          btn.classList.remove('bg-workspace-danger/20', 'text-workspace-danger');
          btn.classList.add('bg-workspace-accent/15', 'text-workspace-accent');
        }

        // 1. Audio chime
        if (typeof playAudioChime === 'function') {
          playAudioChime();
        }

        // 2. Desktop notification
        if (t.notifyEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            new Notification('Pomodoro Session Complete!', {
              body: 'Great job! Time to take a short breather.',
              icon: '/manifest.json'
            });
          } catch (e) {}
        }

        // 3. Toast
        if (typeof showToast !== 'undefined') {
          showToast('Session complete! Time for a break! 🔔');
        }
      }
    }, 1000);
  }
}

function setPomodoroTimer(toolId, minutes) {
  const t = pomodoroTimers[toolId];
  if (!t) return;
  clearInterval(t.interval);
  t.isRunning = false;
  t.timeLeft = minutes * 60;
  const btn = document.getElementById(`${toolId}_btnToggle`);
  if (btn) {
    btn.textContent = 'Start';
    btn.classList.remove('bg-workspace-danger/20', 'text-workspace-danger');
    btn.classList.add('bg-workspace-accent/15', 'text-workspace-accent');
  }
  updatePomodoroTimerDisplay(toolId);
}

function togglePomodoroNotifications(toolId) {
  const t = pomodoroTimers[toolId];
  if (!t) return;
  t.notifyEnabled = !t.notifyEnabled;
  if (t.notifyEnabled && typeof Notification !== 'undefined') {
    Notification.requestPermission().then(perm => {
      if (typeof showToast !== 'undefined') {
        showToast(perm === 'granted' ? 'Desktop alerts enabled!' : 'Browser alerts blocked');
      }
    });
  }
  const btn = document.getElementById(`${toolId}_btnNotify`);
  if (btn) {
    btn.classList.toggle('text-workspace-accent', t.notifyEnabled);
    btn.classList.toggle('text-workspace-muted', !t.notifyEnabled);
  }
}

function updatePomodoroTimerDisplay(toolId) {
  const t = pomodoroTimers[toolId];
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
  description: 'Countdown timer with sound chimes and native background notifications for focused work sprints.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between py-1 font-sans">
      <div class="flex items-center justify-between gap-1.5 bg-workspace-bg p-1 rounded-lg border border-workspace-border text-xs w-full">
        <button onclick="setPomodoroTimer('${toolId}', 25)" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-text hover:text-workspace-accent transition-colors font-mono text-[11px]">25m Focus</button>
        <button onclick="setPomodoroTimer('${toolId}', 5)" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-text hover:text-workspace-accent transition-colors font-mono text-[11px]">5m Break</button>
        <button onclick="setPomodoroTimer('${toolId}', 15)" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-text hover:text-workspace-accent transition-colors font-mono text-[11px]">15m Rest</button>
        <button id="${toolId}_btnNotify" onclick="togglePomodoroNotifications('${toolId}')" title="Toggle Desktop Notification alerts" class="px-2 py-1 rounded bg-workspace-surface text-workspace-accent hover:border-workspace-accent border border-transparent transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </button>
      </div>

      <div class="flex flex-col items-center justify-center my-auto py-3">
        <div id="${toolId}_display" class="text-6xl font-bold font-mono text-workspace-accent tracking-widest drop-shadow-[0_0_15px_rgba(16,185,129,0.25)] select-none">25:00</div>
        <span class="text-[10px] font-mono text-workspace-muted mt-1">Audio Chime & Desktop Alerts Active</span>
      </div>

      <button id="${toolId}_btnToggle" onclick="togglePomodoroTimer('${toolId}')" class="w-full py-2 bg-workspace-accent/15 border border-workspace-accent/40 hover:bg-workspace-accent hover:text-black text-workspace-accent font-bold rounded-lg transition-all text-xs font-mono tracking-wider">
        START FOCUS
      </button>
    </div>
  `,
  init: (toolId) => {
    pomodoroTimers[toolId] = { timeLeft: 25 * 60, isRunning: false, interval: null, notifyEnabled: true };
    updatePomodoroTimerDisplay(toolId);
  }
});
