// Tool: unix-timestamp-converter
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['unix-timestamp-converter'] = Object.assign(window.TOOLS_REGISTRY['unix-timestamp-converter'] || {}, {
  id: 'unix-timestamp-converter',
  name: 'Unix Timestamp & Epoch Converter',
  category: 'Developer',
  description: 'Convert between Unix timestamps (seconds & milliseconds), UTC dates, local timezones, and relative time.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2.5 font-sans text-xs">
      <!-- Live Counter -->
      <div class="flex items-center justify-between p-2 rounded-xl bg-workspace-bg border border-workspace-border">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-workspace-accent animate-pulse"></span>
          <span class="text-[10px] font-mono text-workspace-muted">Current Epoch:</span>
          <span id="${toolId}_currentEpoch" class="font-mono font-bold text-workspace-text text-sm">...</span>
        </div>
        <button id="${toolId}_btnCopyNow" class="px-2 py-0.5 rounded text-[10px] font-mono bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-workspace-accent transition-colors">Copy</button>
      </div>

      <!-- Epoch to Date -->
      <div class="space-y-1">
        <label class="block text-[10px] font-mono text-workspace-muted">Timestamp (Seconds or Milliseconds)</label>
        <div class="flex gap-2">
          <input id="${toolId}_epochInput" type="number" placeholder="e.g. 1770542385" class="flex-1 bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-workspace-text focus:border-workspace-accent focus:outline-none" />
          <button id="${toolId}_btnNow" class="px-2.5 py-1 text-[11px] font-mono bg-workspace-surface border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg">Now</button>
        </div>
      </div>

      <!-- Output Display -->
      <div class="p-2.5 rounded-xl bg-workspace-bg/80 border border-workspace-border space-y-1.5 font-mono text-[11px]">
        <div class="flex justify-between items-center text-workspace-muted">
          <span>UTC:</span>
          <span id="${toolId}_outUtc" class="text-workspace-text font-medium select-all truncate max-w-[200px]">...</span>
        </div>
        <div class="flex justify-between items-center text-workspace-muted">
          <span>Local:</span>
          <span id="${toolId}_outLocal" class="text-workspace-text font-medium select-all truncate max-w-[200px]">...</span>
        </div>
        <div class="flex justify-between items-center text-workspace-muted">
          <span>Relative:</span>
          <span id="${toolId}_outRelative" class="text-workspace-accent select-all truncate max-w-[200px]">...</span>
        </div>
      </div>

      <!-- Date to Epoch Input -->
      <div class="space-y-1">
        <label class="block text-[10px] font-mono text-workspace-muted">Date & Time to Timestamp</label>
        <input id="${toolId}_dateInput" type="datetime-local" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none" />
      </div>
    </div>
  `,
  init: (toolId) => {
    const liveEl = document.getElementById(`${toolId}_currentEpoch`);
    const btnCopyNow = document.getElementById(`${toolId}_btnCopyNow`);
    const epochInput = document.getElementById(`${toolId}_epochInput`);
    const btnNow = document.getElementById(`${toolId}_btnNow`);
    const outUtc = document.getElementById(`${toolId}_outUtc`);
    const outLocal = document.getElementById(`${toolId}_outLocal`);
    const outRelative = document.getElementById(`${toolId}_outRelative`);
    const dateInput = document.getElementById(`${toolId}_dateInput`);

    let currentSec = Math.floor(Date.now() / 1000);

    function tick() {
      currentSec = Math.floor(Date.now() / 1000);
      if (liveEl) liveEl.textContent = currentSec;
    }
    tick();
    const interval = setInterval(tick, 1000);

    if (btnCopyNow) {
      btnCopyNow.onclick = () => {
        navigator.clipboard.writeText(String(currentSec));
        if (typeof showToast !== 'undefined') showToast('Copied current timestamp!');
      };
    }

    function formatRelative(timestampMs) {
      const diffSec = Math.round((timestampMs - Date.now()) / 1000);
      const absDiff = Math.abs(diffSec);
      let unit = 'second';
      let count = absDiff;

      if (absDiff >= 86400) {
        count = Math.round(absDiff / 86400);
        unit = 'day';
      } else if (absDiff >= 3600) {
        count = Math.round(absDiff / 3600);
        unit = 'hour';
      } else if (absDiff >= 60) {
        count = Math.round(absDiff / 60);
        unit = 'minute';
      }

      const plural = count === 1 ? '' : 's';
      if (diffSec < 0) return `${count} ${unit}${plural} ago`;
      if (diffSec > 0) return `in ${count} ${unit}${plural}`;
      return 'just now';
    }

    function updateFromEpoch(val) {
      if (!val) {
        outUtc.textContent = '...';
        outLocal.textContent = '...';
        outRelative.textContent = '...';
        return;
      }
      let num = Number(val);
      if (isNaN(num)) return;

      // Detect if in seconds or milliseconds
      let ms = num < 10000000000 ? num * 1000 : num;
      const d = new Date(ms);

      if (isNaN(d.getTime())) {
        outUtc.textContent = 'Invalid timestamp';
        outLocal.textContent = 'Invalid timestamp';
        outRelative.textContent = '';
        return;
      }

      outUtc.textContent = d.toUTCString();
      outLocal.textContent = d.toLocaleString();
      outRelative.textContent = formatRelative(ms);
    }

    function updateFromDate(dateStr) {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const sec = Math.floor(d.getTime() / 1000);
      epochInput.value = sec;
      updateFromEpoch(sec);
    }

    if (epochInput) {
      epochInput.value = currentSec;
      updateFromEpoch(currentSec);
      epochInput.addEventListener('input', (e) => updateFromEpoch(e.target.value.trim()));
    }

    if (btnNow) {
      btnNow.onclick = () => {
        epochInput.value = Math.floor(Date.now() / 1000);
        updateFromEpoch(epochInput.value);
      };
    }

    if (dateInput) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      dateInput.value = now.toISOString().slice(0, 16);
      dateInput.addEventListener('change', (e) => updateFromDate(e.target.value));
    }
  }
});
