// Theme Initialization (Run immediately to prevent FOUC)
(function() {
  const savedTheme = localStorage.getItem('tabkit_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
  } else {
    document.documentElement.classList.remove('theme-light');
  }
})();

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('theme-light');
  localStorage.setItem('tabkit_theme', isLight ? 'light' : 'dark');
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
