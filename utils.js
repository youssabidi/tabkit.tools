// Theme Initialization (Run immediately to prevent FOUC)
(function() {
  const savedTheme = localStorage.getItem('tabkit_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
  } else {
    document.documentElement.classList.remove('theme-light');
  }
})();

function updateThemeUI() {
  const isLight = document.documentElement.classList.contains('theme-light');
  document.querySelectorAll('.theme-toggle-icon').forEach(el => {
    if (isLight) {
      // Moon icon (to switch to dark)
      el.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    } else {
      // Sun icon (to switch to light)
      el.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }
  });
  document.querySelectorAll('.theme-toggle-label').forEach(el => {
    el.textContent = isLight ? 'Dark' : 'Light';
  });
}

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('theme-light');
  localStorage.setItem('tabkit_theme', isLight ? 'light' : 'dark');
  updateThemeUI();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', updateThemeUI);
}


// ==========================================
// SHARED UTILITY HELPERS
// ==========================================

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-12 right-4 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto px-3.5 py-2 rounded-lg bg-workspace-surface border border-workspace-border shadow-xl text-xs font-mono flex items-center gap-2 text-workspace-text transition-all duration-300 opacity-0 translate-y-2';
  const indicator = type === 'error' ? 'text-workspace-danger' : 'text-workspace-accent';
  toast.innerHTML = `<span class="${indicator}">●</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-2'));
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// LCS Difference Algorithm for Text Diff
function computeLCSDiff(linesA, linesB) {
  const m = linesA.length;
  const n = linesB.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (linesA[i] === linesB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  let i = m, j = n;
  const result = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: 'same', text: linesA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'add', text: linesB[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'del', text: linesA[i - 1] });
      i--;
    }
  }
  return result;
}

// Cities Database Loader
let citiesDataset = null;
let isFetchingCities = false;

async function loadCitiesDatabase(onProgress) {
  if (citiesDataset) return citiesDataset;
  if (isFetchingCities) return null;
  isFetchingCities = true;

  try {
    if (onProgress) onProgress('Loading cities...');
    const res = await fetch('/cities.min.json');
    if (!res.ok) throw new Error('cities.min.json not found');
    const raw = await res.json();

    if (Array.isArray(raw)) {
      citiesDataset = raw.map(item => {
        if (Array.isArray(item)) {
          const country = item[1] === -99 ? '' : (item[1] || '');
          const iana = item[2] || '';
          return { city: item[0], country, iana, tokens: `${item[0]} ${country} ${iana}`.toLowerCase() };
        }
        const city = item.name || item.city || '';
        const country = item.country || '';
        const iana = item.timezone || item.tz || item.iana || '';
        return { city, country, iana, tokens: `${city} ${country} ${iana}`.toLowerCase() };
      }).filter(x => x.city && x.iana && x.iana !== 'null');
    }
    if (onProgress) onProgress('');
    return citiesDataset;
  } catch (e) {
    if (onProgress) onProgress('');
    return fallbackIntlZones();
  } finally {
    isFetchingCities = false;
  }
}

function fallbackIntlZones() {
  let raw = [];
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try { raw = Intl.supportedValuesOf('timeZone'); } catch (e) {}
  }
  if (!raw || !raw.length) {
    raw = ['UTC', 'Asia/Tokyo', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris'];
  }
  return raw.map(iana => {
    const parts = iana.split('/');
    const city = parts[parts.length - 1].replace(/_/g, ' ');
    return { city, country: parts[0], iana, tokens: `${city} ${parts[0]} ${iana}`.toLowerCase() };
  });
}

// ==========================================
// PWA INSTALL LOGIC
// ==========================================
let deferredInstallPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('btnInstallApp');
    if (btn) {
      btn.classList.remove('hidden');
      btn.classList.add('flex');
    }
  });

  window.addEventListener('appinstalled', () => {
    const btn = document.getElementById('btnInstallApp');
    if (btn) btn.classList.add('hidden');
    if (typeof showToast !== 'undefined') showToast('TabKit Tools installed successfully!');
  });
}

function installPwaApp() {
  if (!deferredInstallPrompt) {
    if (typeof showToast !== 'undefined') {
      showToast('To install, tap Share -> Add to Home Screen (Mobile) or the install icon in your address bar (Desktop).', 'info');
    }
    return;
  }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      if (typeof showToast !== 'undefined') showToast('TabKit Tools installed!');
      const btn = document.getElementById('btnInstallApp');
      if (btn) btn.classList.add('hidden');
    }
    deferredInstallPrompt = null;
  });
}

// ==========================================
// TOOL CHAINING & DATA HANDOFF ("Send To...")
// ==========================================
function sendToTool(targetToolId, payload) {
  if (typeof payload !== 'string') {
    payload = JSON.stringify(payload, null, 2);
  }
  
  // If we are on index.html with active workbench
  if (typeof activePinnedTools !== 'undefined' && typeof pinTool === 'function') {
    if (!activePinnedTools.includes(targetToolId)) {
      pinTool(targetToolId);
    }
    setTimeout(() => {
      // Find the primary input in the tool card
      const card = document.getElementById(`card_${targetToolId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-workspace-accent');
        setTimeout(() => card.classList.remove('ring-2', 'ring-workspace-accent'), 1500);

        const inputEl = card.querySelector('textarea, input[type="text"]');
        if (inputEl) {
          inputEl.value = payload;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
          if (typeof showToast !== 'undefined') showToast(`Sent data to ${targetToolId}!`);
        }
      }
    }, 250);
  } else {
    // Navigate to workbench and handoff data via localStorage
    localStorage.setItem('tabkit_handoff_data', JSON.stringify({ toolId: targetToolId, payload }));
    window.location.href = '/index.html';
  }
}

// Check for pending handoff data on workbench load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const rawHandoff = localStorage.getItem('tabkit_handoff_data');
    if (rawHandoff) {
      try {
        const { toolId, payload } = JSON.parse(rawHandoff);
        localStorage.removeItem('tabkit_handoff_data');
        setTimeout(() => sendToTool(toolId, payload), 500);
      } catch (e) {}
    }
  });
}

// ==========================================
// SYNTAX HIGHLIGHTING (Zero-dependency JSON)
// ==========================================
function syntaxHighlightJson(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  json = escapeHtml(json);
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-amber-500 font-mono'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-sky-400 font-bold font-mono'; // key
      } else {
        cls = 'text-emerald-400 font-mono'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-400 font-bold font-mono'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-rose-400 font-bold font-mono'; // null
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// ==========================================
// WEB AUDIO CHIME (Gentle notification bell)
// ==========================================
function playAudioChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  } catch (e) {}
}
