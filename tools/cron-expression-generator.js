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

    function parseCronField(expr, min, max, wrapZeroToSeven) {
      if (!expr || expr === '*') return null; // null = wildcard (matches all)
      const allowed = new Set();
      for (const rawPart of expr.split(',')) {
        const part = rawPart.trim();
        if (!part) continue;
        const [rangeStr, stepStr] = part.split('/');
        const step = stepStr ? Math.max(1, parseInt(stepStr, 10) || 1) : 1;
        let start = min, end = max;
        if (rangeStr !== '*' && rangeStr !== '') {
          if (rangeStr.includes('-')) {
            const [a, b] = rangeStr.split('-').map(n => parseInt(n, 10));
            if (isNaN(a) || isNaN(b)) return new Set();
            start = Math.max(min, a);
            end = Math.min(max, b);
          } else {
            const v = parseInt(rangeStr, 10);
            if (isNaN(v)) return new Set();
            start = v;
            end = stepStr ? max : v;
          }
        }
        for (let i = start; i <= end; i += step) {
          allowed.add(wrapZeroToSeven && i === 7 ? 0 : i);
        }
      }
      return allowed;
    }

    function calculateNextRuns(m, h, dom, mon, dow) {
      const mSet = parseCronField(m, 0, 59, false);
      const hSet = parseCronField(h, 0, 23, false);
      const domSet = parseCronField(dom, 1, 31, false);
      const monSet = parseCronField(mon, 1, 12, false);
      const dowSet = parseCronField(dow, 0, 7, true);

      const results = [];
      const cur = new Date();
      cur.setSeconds(0, 0);
      cur.setMinutes(cur.getMinutes() + 1);

      // Scan up to 1 year (366 days) skipping non-matching days/hours quickly
      const limit = cur.getTime() + 366 * 24 * 60 * 60000;
      while (results.length < 3 && cur.getTime() <= limit) {
        if (monSet && !monSet.has(cur.getMonth() + 1)) {
          cur.setMonth(cur.getMonth() + 1, 1);
          cur.setHours(0, 0, 0, 0);
          continue;
        }
        const domMatch = !domSet || domSet.has(cur.getDate());
        const dowMatch = !dowSet || dowSet.has(cur.getDay());
        // Standard Vixie cron: if both DOM and DOW are restricted, match if EITHER matches
        const dayMatch = (domSet && dowSet) ? (domMatch || dowMatch) : (domMatch && dowMatch);
        if (!dayMatch) {
          cur.setDate(cur.getDate() + 1);
          cur.setHours(0, 0, 0, 0);
          continue;
        }
        if (hSet && !hSet.has(cur.getHours())) {
          cur.setHours(cur.getHours() + 1, 0, 0, 0);
          continue;
        }
        if (mSet && !mSet.has(cur.getMinutes())) {
          cur.setMinutes(cur.getMinutes() + 1, 0, 0);
          continue;
        }
        results.push(cur.toLocaleString(undefined, {
          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }));
        cur.setMinutes(cur.getMinutes() + 1, 0, 0);
      }

      if (results.length === 0) {
        return ['No matching run within the next 12 months (check field syntax)'];
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

      const runs = calculateNextRuns(m, h, dom, mon, dow);
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
      const label = btnCopy.querySelector('span') || btnCopy;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(str).then(() => {
          if (typeof showToast === 'function') showToast(`📋 Copied: ${str}`);
          label.textContent = 'Copied!';
          setTimeout(() => { label.textContent = 'Copy'; }, 2000);
        });
      }
    });

    update();
  }
});
