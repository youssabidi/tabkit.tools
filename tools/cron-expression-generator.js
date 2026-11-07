// Tool: cron-expression-generator
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['cron-expression-generator'] = Object.assign(window.TOOLS_REGISTRY['cron-expression-generator'] || {}, {
  id: 'cron-expression-generator',
  name: 'Cron Expression Generator & Explainer',
  category: 'Developer & Code',
  description: 'Interactive visual crontab generator and human-readable cron expression explainer with upcoming run schedule preview. 100% offline.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Quick Presets -->
      <div class="flex items-center gap-2">
        <select id="${toolId}_preset" class="flex-1 bg-workspace-bg border border-workspace-border rounded-xl p-2 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none">
          <option value="">Quick Presets...</option>
          <option value="* * * * *">Every minute (* * * * *)</option>
          <option value="*/5 * * * *">Every 5 minutes (*/5 * * * *)</option>
          <option value="0 * * * *">Every hour at minute 0 (0 * * * *)</option>
          <option value="0 0 * * *">Daily at midnight (0 0 * * *)</option>
          <option value="0 9 * * 1-5">Monday through Friday at 9:00 AM (0 9 * * 1-5)</option>
          <option value="0 0 * * 0">Every Sunday at midnight (0 0 * * 0)</option>
          <option value="0 0 1 * *">First day of every month at midnight (0 0 1 * *)</option>
        </select>
        <button id="${toolId}_btnCopy" type="button" class="btn-tactile px-3 py-2 rounded-xl bg-workspace-accent hover:bg-workspace-accentHover text-black font-bold font-mono text-xs shrink-0 flex items-center gap-1 shadow-xs">
          <span>Copy</span>
        </button>
      </div>

      <!-- 5-Field Cron Inputs -->
      <div class="grid grid-cols-5 gap-1.5 bg-workspace-bg/60 p-2.5 rounded-2xl border border-workspace-border text-center">
        <div>
          <label class="block text-[9px] uppercase font-mono text-workspace-muted mb-1">Minute</label>
          <input id="${toolId}_min" type="text" value="*/5" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-center font-mono font-bold text-workspace-accent text-xs focus:border-workspace-accent focus:outline-none" />
          <span class="text-[9px] text-workspace-muted font-mono">0-59</span>
        </div>
        <div>
          <label class="block text-[9px] uppercase font-mono text-workspace-muted mb-1">Hour</label>
          <input id="${toolId}_hour" type="text" value="*" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-center font-mono font-bold text-workspace-accent text-xs focus:border-workspace-accent focus:outline-none" />
          <span class="text-[9px] text-workspace-muted font-mono">0-23</span>
        </div>
        <div>
          <label class="block text-[9px] uppercase font-mono text-workspace-muted mb-1">Day/Mo</label>
          <input id="${toolId}_dom" type="text" value="*" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-center font-mono font-bold text-workspace-accent text-xs focus:border-workspace-accent focus:outline-none" />
          <span class="text-[9px] text-workspace-muted font-mono">1-31</span>
        </div>
        <div>
          <label class="block text-[9px] uppercase font-mono text-workspace-muted mb-1">Month</label>
          <input id="${toolId}_month" type="text" value="*" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-center font-mono font-bold text-workspace-accent text-xs focus:border-workspace-accent focus:outline-none" />
          <span class="text-[9px] text-workspace-muted font-mono">1-12</span>
        </div>
        <div>
          <label class="block text-[9px] uppercase font-mono text-workspace-muted mb-1">Day/Wk</label>
          <input id="${toolId}_dow" type="text" value="*" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-center font-mono font-bold text-workspace-accent text-xs focus:border-workspace-accent focus:outline-none" />
          <span class="text-[9px] text-workspace-muted font-mono">0-6 (Sun-Sat)</span>
        </div>
      </div>

      <!-- Human Readable Output & Cron Expression -->
      <div class="space-y-2 bg-workspace-surface/80 p-3 rounded-2xl border border-workspace-border">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono text-workspace-muted uppercase">Crontab Expression:</span>
          <span id="${toolId}_cronDisplay" class="font-mono text-sm font-bold text-white bg-workspace-bg px-2.5 py-0.5 rounded-lg border border-workspace-borderLight select-all">*/5 * * * *</span>
        </div>
        <div class="text-xs text-emerald-400 font-medium flex items-start gap-1.5 pt-1 border-t border-workspace-border/50">
          <span class="text-sm">🗓️</span>
          <span id="${toolId}_explanation" class="leading-snug">Every 5 minutes</span>
        </div>
      </div>

      <!-- Next Runs -->
      <div class="space-y-1">
        <div class="text-[10px] font-mono uppercase text-workspace-muted flex items-center justify-between">
          <span>Upcoming Execution Estimates:</span>
          <span class="text-[9px] text-workspace-accent font-mono">Local Timezone</span>
        </div>
        <div id="${toolId}_nextRuns" class="space-y-1 text-[11px] font-mono text-workspace-muted">
          <!-- calculated dynamically -->
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const elMin = document.getElementById(`${toolId}_min`);
    const elHour = document.getElementById(`${toolId}_hour`);
    const elDom = document.getElementById(`${toolId}_dom`);
    const elMonth = document.getElementById(`${toolId}_month`);
    const elDow = document.getElementById(`${toolId}_dow`);
    const elPreset = document.getElementById(`${toolId}_preset`);
    const elDisplay = document.getElementById(`${toolId}_cronDisplay`);
    const elExplain = document.getElementById(`${toolId}_explanation`);
    const elNext = document.getElementById(`${toolId}_nextRuns`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);

    if (!elMin || !elDisplay) return;

    function explainCron(m, h, dom, mon, dow) {
      let parts = [];
      
      // Minute
      if (m === '*') parts.push('Every minute');
      else if (m.startsWith('*/')) parts.push(`Every ${m.slice(2)} minutes`);
      else parts.push(`At minute ${m}`);

      // Hour
      if (h === '*') {
        // all hours
      } else if (h.startsWith('*/')) {
        parts.push(`every ${h.slice(2)} hours`);
      } else {
        parts.push(`past hour ${h}:00`);
      }

      // Day of month
      if (dom !== '*') {
        parts.push(`on day ${dom} of the month`);
      }

      // Month
      const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (mon !== '*') {
        const monNum = parseInt(mon, 10);
        parts.push(`in ${months[monNum] || mon}`);
      }

      // Day of week
      const dows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (dow === '1-5') {
        parts.push('Monday through Friday');
      } else if (dow !== '*') {
        parts.push(`on ${dows[parseInt(dow, 10)] || dow}`);
      }

      return parts.join(', ');
    }

    function calculateNextRuns(m, h) {
      const now = new Date();
      const results = [];
      let temp = new Date(now.getTime() + 60000); // 1 min ahead

      const stepMinutes = m.startsWith('*/') ? parseInt(m.slice(2), 10) || 5 : 1;
      
      for (let i = 0; i < 3; i++) {
        temp = new Date(temp.getTime() + stepMinutes * 60000);
        results.push(temp.toLocaleString(undefined, { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }));
      }

      return results;
    }

    function update() {
      const m = elMin.value.trim() || '*';
      const h = elHour.value.trim() || '*';
      const dom = elDom.value.trim() || '*';
      const mon = elMonth.value.trim() || '*';
      const dow = elDow.value.trim() || '*';

      const cronStr = `${m} ${h} ${dom} ${mon} ${dow}`;
      elDisplay.textContent = cronStr;

      const desc = explainCron(m, h, dom, mon, dow);
      elExplain.textContent = desc;

      const runs = calculateNextRuns(m, h);
      elNext.innerHTML = runs.map((r, idx) => `
        <div class="flex items-center justify-between py-0.5 px-2 rounded-lg bg-workspace-bg/40 border border-workspace-border/40">
          <span>${idx + 1}. ${r}</span>
          <span class="text-[9px] text-emerald-400 font-mono">Scheduled</span>
        </div>
      `).join('');
    }

    [elMin, elHour, elDom, elMonth, elDow].forEach(input => {
      input.addEventListener('input', () => {
        elPreset.value = '';
        update();
      });
    });

    elPreset.addEventListener('change', () => {
      if (!elPreset.value) return;
      const parts = elPreset.value.split(' ');
      if (parts.length === 5) {
        elMin.value = parts[0];
        elHour.value = parts[1];
        elDom.value = parts[2];
        elMonth.value = parts[3];
        elDow.value = parts[4];
        update();
      }
    });

    btnCopy.addEventListener('click', () => {
      const str = elDisplay.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(str).then(() => {
          if (typeof showToast === 'function') showToast(`📋 Copied: ${str}`);
          btnCopy.textContent = 'Copied!';
          setTimeout(() => { btnCopy.textContent = 'Copy'; }, 2000);
        });
      }
    });

    update();
  }
});
