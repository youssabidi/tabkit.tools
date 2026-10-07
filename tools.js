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
// TOOL ACTION HANDLERS
// ==========================================

// Text Diff & Notes
function toggleScratchMode(toolId, mode) {
  const isNotes = mode === 'notes';
  const notesEl = document.getElementById(`${toolId}_notesContainer`);
  const diffEl = document.getElementById(`${toolId}_diffContainer`);
  const tabNote = document.getElementById(`${toolId}_tabNote`);
  const tabDiff = document.getElementById(`${toolId}_tabDiff`);

  if (notesEl && diffEl) {
    notesEl.classList.toggle('hidden', !isNotes);
    diffEl.classList.toggle('hidden', isNotes);
  }

  if (tabNote && tabDiff) {
    tabNote.className = isNotes 
      ? "px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent"
      : "px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text";
    tabDiff.className = !isNotes 
      ? "px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent"
      : "px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text";
  }
}

function runTextDiff(toolId) {
  const inputA = document.getElementById(`${toolId}_diffA`);
  const inputB = document.getElementById(`${toolId}_diffB`);
  const output = document.getElementById(`${toolId}_diffOutput`);

  if (!inputA || !inputB || !output) return;
  if (!inputA.value && !inputB.value) {
    showToast('Please enter text in both fields to compare.', 'error');
    return;
  }

  const linesA = inputA.value.split('\n');
  const linesB = inputB.value.split('\n');
  const diffs = computeLCSDiff(linesA, linesB);

  output.innerHTML = diffs.map((line, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    let colorClass = 'text-workspace-text';
    let prefix = ' ';
    let bgClass = 'bg-transparent';

    if (line.type === 'add') {
      colorClass = 'text-green-400';
      prefix = '+';
      bgClass = 'bg-green-400/10';
    } else if (line.type === 'del') {
      colorClass = 'text-red-400';
      prefix = '-';
      bgClass = 'bg-red-400/10';
    }

    const safeText = escapeHtml(line.text);
    return `<div class="flex gap-2 px-1 rounded ${bgClass}">
      <span class="text-workspace-muted select-none w-6 text-right border-r border-workspace-borderLight pr-1">${num}</span>
      <span class="select-none font-bold ${colorClass}">${prefix}</span>
      <span class="${colorClass} whitespace-pre-wrap break-all">${safeText || ' '}</span>
    </div>`;
  }).join('');
  
  showToast('Difference computed!');
}

// URL Cleaner
function cleanUrls(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  const output = document.getElementById(`${toolId}_output`);
  const count = document.getElementById(`${toolId}_count`);

  if (!input || !input.value.trim()) {
    showToast('Please paste links or text first.', 'error');
    return;
  }

  const urlRegex = /(https?:\/\/[^\s"',]+)/g;
  let match;
  const cleanSet = new Set();
  let totalFound = 0;

  while ((match = urlRegex.exec(input.value)) !== null) {
    totalFound++;
    try {
      const u = new URL(match[0]);
      const paramsToDelete = [];
      for (const key of u.searchParams.keys()) {
        if (key.startsWith('utm_') || ['fbclid', 'gclid', 'gclsrc', 'mc_eid', 'igshid', '_bta_tid', '_bta_c'].includes(key)) {
          paramsToDelete.push(key);
        }
      }
      paramsToDelete.forEach(k => u.searchParams.delete(k));
      cleanSet.add(u.toString());
    } catch (e) {}
  }

  const outArray = Array.from(cleanSet);
  if (output) output.value = outArray.join('\n');
  if (count) count.textContent = `${outArray.length} link${outArray.length === 1 ? '' : 's'}`;

  if (totalFound > 0) {
    showToast(`Sanitized ${outArray.length} link(s)!`);
  } else {
    showToast('No valid HTTP/HTTPS URLs found.', 'error');
  }
}

function openAllCleanUrls(toolId) {
  const output = document.getElementById(`${toolId}_output`);
  if (!output || !output.value.trim()) {
    showToast('No clean links to open.', 'error');
    return;
  }
  const links = output.value.split('\n').filter(l => l.trim().startsWith('http'));
  if (links.length > 8 && !confirm(`Open ${links.length} tabs simultaneously?`)) {
    return;
  }
  links.forEach(link => window.open(link, '_blank'));
}

function copyCleanUrls(toolId) {
  const output = document.getElementById(`${toolId}_output`);
  if (output && output.value.trim()) {
    navigator.clipboard.writeText(output.value);
    showToast('Copied clean links to clipboard!');
  } else {
    showToast('Nothing to copy.', 'error');
  }
}

// Case Converter
function transformCase(toolId, type) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    showToast('Please enter text first.', 'error');
    return;
  }

  let val = input.value;
  if (type === 'upper') {
    val = val.toUpperCase();
    showToast('Converted to UPPERCASE');
  } else if (type === 'lower') {
    val = val.toLowerCase();
    showToast('Converted to lowercase');
  } else if (type === 'title') {
    val = val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    showToast('Converted to Title Case');
  } else if (type === 'dedupe') {
    const lines = val.split('\n');
    const unique = Array.from(new Set(lines));
    val = unique.join('\n');
    showToast(`Removed ${lines.length - unique.length} duplicate line(s)`);
  }

  input.value = val;
  input.dispatchEvent(new Event('input'));
}

function copyTextTool(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  if (input && input.value) {
    navigator.clipboard.writeText(input.value);
    showToast('Text copied to clipboard!');
  } else {
    showToast('Nothing to copy.', 'error');
  }
}

// QR Code Generator
function downloadQrCode(toolId) {
  const container = document.getElementById(`${toolId}_canvas`);
  if (!container) return;
  const img = container.querySelector('img');
  const canvas = container.querySelector('canvas');

  if (img && img.src) {
    const a = document.createElement('a');
    a.href = img.src;
    a.download = 'qrcode.png';
    a.click();
    showToast('QR Image downloaded!');
  } else if (canvas) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qrcode.png';
    a.click();
    showToast('QR Image downloaded!');
  } else {
    showToast('No QR code generated yet.', 'error');
  }
}

function copyQrSource(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  if (input && input.value) {
    navigator.clipboard.writeText(input.value);
    showToast('Copied QR code text!');
  }
}

// Password Generator
function setPwType(toolId, type) {
  const card = document.getElementById(`card_${toolId}`);
  if (!card) return;
  card.dataset.mode = type;

  const tabPass = document.getElementById(`${toolId}_tabPass`);
  const tabPin = document.getElementById(`${toolId}_tabPin`);
  const slider = document.getElementById(`${toolId}_lenSlider`);
  const label = document.getElementById(`${toolId}_lenLabel`);

  if (type === 'pass') {
    if (tabPass) tabPass.className = "flex-1 py-1 rounded bg-workspace-surface text-workspace-accent font-medium";
    if (tabPin) tabPin.className = "flex-1 py-1 rounded text-workspace-muted hover:text-workspace-text font-medium";
    if (slider && parseInt(slider.value, 10) < 8) slider.value = 16;
  } else {
    if (tabPin) tabPin.className = "flex-1 py-1 rounded bg-workspace-surface text-workspace-accent font-medium";
    if (tabPass) tabPass.className = "flex-1 py-1 rounded text-workspace-muted hover:text-workspace-text font-medium";
    if (slider && parseInt(slider.value, 10) > 12) slider.value = 6;
  }

  if (slider && label) label.textContent = slider.value;
  generateNewPassword(toolId);
}

function generateNewPassword(toolId) {
  const slider = document.getElementById(`${toolId}_lenSlider`);
  const output = document.getElementById(`${toolId}_output`);
  const card = document.getElementById(`card_${toolId}`);

  if (!slider || !output || !card) return;

  const length = parseInt(slider.value, 10);
  const mode = card.dataset.mode || 'pass';
  const chars = mode === 'pin' 
    ? '0123456789' 
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';

  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  output.value = result;
}

function copyGeneratedPw(toolId) {
  const output = document.getElementById(`${toolId}_output`);
  if (output && output.value) {
    navigator.clipboard.writeText(output.value);
    showToast('Password copied to clipboard!');
  }
}

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

// JSON Formatter
function formatJsonTool(toolId, minify = false) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    showToast('Please paste JSON first.', 'error');
    return;
  }
  try {
    const obj = JSON.parse(input.value);
    input.value = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
    showToast(minify ? 'JSON Minified!' : 'JSON Formatted!');
  } catch (e) {
    showToast('Invalid JSON: ' + e.message, 'error');
  }
}

// Base64
function convertBase64(toolId, action) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) {
    showToast('Please enter text first.', 'error');
    return;
  }
  try {
    if (action === 'encode') {
      input.value = btoa(unescape(encodeURIComponent(input.value)));
      showToast('Encoded to Base64');
    } else {
      input.value = decodeURIComponent(escape(atob(input.value)));
      showToast('Decoded from Base64');
    }
  } catch (e) {
    showToast('Invalid Base64 string', 'error');
  }
}

// Hash Generator
async function generateHashes(toolId) {
  const text = document.getElementById(`${toolId}_input`).value;
  const o256 = document.getElementById(`${toolId}_sha256`);
  const o384 = document.getElementById(`${toolId}_sha384`);
  const o512 = document.getElementById(`${toolId}_sha512`);

  if (!text) {
    if (o256) o256.value = '';
    if (o384) o384.value = '';
    if (o512) o512.value = '';
    return;
  }

  const msgBuffer = new TextEncoder().encode(text);
  try {
    const hash256 = await crypto.subtle.digest('SHA-256', msgBuffer);
    if (o256) o256.value = Array.from(new Uint8Array(hash256)).map(b => b.toString(16).padStart(2, '0')).join('');

    const hash384 = await crypto.subtle.digest('SHA-384', msgBuffer);
    if (o384) o384.value = Array.from(new Uint8Array(hash384)).map(b => b.toString(16).padStart(2, '0')).join('');

    const hash512 = await crypto.subtle.digest('SHA-512', msgBuffer);
    if (o512) o512.value = Array.from(new Uint8Array(hash512)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {}
}

function copyHash(toolId, hashKey) {
  const el = document.getElementById(`${toolId}_${hashKey}`);
  if (el && el.value) {
    navigator.clipboard.writeText(el.value);
    showToast('Hash copied to clipboard!');
  }
}

// Color Converter
function updateColorConverter(toolId, source) {
  const hexInput = document.getElementById(`${toolId}_hex`);
  const rgbInput = document.getElementById(`${toolId}_rgb`);
  const hslInput = document.getElementById(`${toolId}_hsl`);
  const picker = document.getElementById(`${toolId}_picker`);

  if (!hexInput || !rgbInput || !hslInput || !picker) return;

  let hex = source === 'picker' ? picker.value : hexInput.value;
  if (!hex.startsWith('#')) hex = '#' + hex;

  if (/^#[0-9A-F]{6}$/i.test(hex)) {
    if (source !== 'hex') hexInput.value = hex.toUpperCase();
    if (source !== 'picker') picker.value = hex;

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    rgbInput.value = `rgb(${r}, ${g}, ${b})`;

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    hslInput.value = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
}

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

// Unit Converter Config
const CONVERTER_CONFIG = {
  digital: { name: 'Digital Storage', units: { b: { label: 'Bytes (B)', ratio: 1 }, kb: { label: 'Kilobytes (KB)', ratio: 1024 }, mb: { label: 'Megabytes (MB)', ratio: 1024 ** 2 }, gb: { label: 'Gigabytes (GB)', ratio: 1024 ** 3 }, tb: { label: 'Terabytes (TB)', ratio: 1024 ** 4 }, pb: { label: 'Petabytes (PB)', ratio: 1024 ** 5 } }, defaultA: 'gb', defaultB: 'mb' },
  length: { name: 'Length & Distance', units: { mm: { label: 'Millimeters (mm)', ratio: 0.001 }, cm: { label: 'Centimeters (cm)', ratio: 0.01 }, m: { label: 'Meters (m)', ratio: 1 }, km: { label: 'Kilometers (km)', ratio: 1000 }, in: { label: 'Inches (in)', ratio: 0.0254 }, ft: { label: 'Feet (ft)', ratio: 0.3048 }, yd: { label: 'Yards (yd)', ratio: 0.9144 }, mi: { label: 'Miles (mi)', ratio: 1609.344 } }, defaultA: 'cm', defaultB: 'in' },
  weight: { name: 'Weight & Mass', units: { mg: { label: 'Milligrams (mg)', ratio: 0.000001 }, g: { label: 'Grams (g)', ratio: 0.001 }, kg: { label: 'Kilograms (kg)', ratio: 1 }, t: { label: 'Metric Tons (t)', ratio: 1000 }, oz: { label: 'Ounces (oz)', ratio: 0.028349523125 }, lbs: { label: 'Pounds (lbs)', ratio: 0.45359237 }, st: { label: 'Stone (st)', ratio: 6.35029318 } }, defaultA: 'kg', defaultB: 'lbs' },
  temp: { name: 'Temperature', units: { c: { label: 'Celsius (°C)' }, f: { label: 'Fahrenheit (°F)' }, k: { label: 'Kelvin (K)' } }, defaultA: 'c', defaultB: 'f' },
  speed: { name: 'Speed', units: { mps: { label: 'Meters / sec (m/s)', ratio: 1 }, kmh: { label: 'Kilometers / hr (km/h)', ratio: 0.2777777778 }, mph: { label: 'Miles / hr (mph)', ratio: 0.44704 }, kn: { label: 'Knots (kn)', ratio: 0.5144444444 }, mach: { label: 'Mach (std atm)', ratio: 340.29 } }, defaultA: 'kmh', defaultB: 'mph' },
  volume: { name: 'Volume & Capacity', units: { ml: { label: 'Milliliters (ml)', ratio: 0.001 }, l: { label: 'Liters (L)', ratio: 1 }, m3: { label: 'Cubic Meters (m³)', ratio: 1000 }, floz: { label: 'US Fluid Ounces (fl oz)', ratio: 0.0295735 }, cup: { label: 'US Cups', ratio: 0.236588 }, pt: { label: 'US Pints (pt)', ratio: 0.473176 }, gal: { label: 'US Gallons (gal)', ratio: 3.78541 } }, defaultA: 'l', defaultB: 'gal' },
  time: { name: 'Time Duration', units: { ms: { label: 'Milliseconds (ms)', ratio: 0.001 }, s: { label: 'Seconds (s)', ratio: 1 }, min: { label: 'Minutes (min)', ratio: 60 }, h: { label: 'Hours (h)', ratio: 3600 }, d: { label: 'Days (d)', ratio: 86400 }, wk: { label: 'Weeks (wk)', ratio: 604800 } }, defaultA: 'min', defaultB: 's' }
};

// ==========================================
// CENTRAL TOOLS REGISTRY
// ==========================================
const TOOLS_REGISTRY = {
  'text-diff-checker': {
    id: 'text-diff-checker',
    name: 'Text Diff Checker & Notepad',
    category: 'Workspace',
    standaloneUrl: '/text-diff-checker.html',
    description: 'Auto-saving local notes and true line-by-line diff comparison.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="flex items-center justify-between text-xs">
          <div class="flex gap-1 bg-workspace-bg p-0.5 rounded-lg border border-workspace-border">
            <button id="${toolId}_tabNote" onclick="toggleScratchMode('${toolId}', 'notes')" class="px-2 py-0.5 rounded text-[11px] font-medium bg-workspace-surface text-workspace-accent">Notes</button>
            <button id="${toolId}_tabDiff" onclick="toggleScratchMode('${toolId}', 'diff')" class="px-2 py-0.5 rounded text-[11px] font-medium text-workspace-muted hover:text-workspace-text">Diff</button>
          </div>
          <span id="${toolId}_saveStatus" class="text-[10px] text-workspace-muted font-mono">Synced</span>
        </div>
        <div id="${toolId}_notesContainer" class="flex-1 flex flex-col space-y-2">
          <textarea id="${toolId}_textarea" class="w-full h-44 bg-workspace-bg border border-workspace-border rounded-lg p-3 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-borderLight focus:outline-none resize-none" placeholder="Type or paste quick notes here (auto-saved locally)..."></textarea>
        </div>
        <div id="${toolId}_diffContainer" class="hidden flex-1 flex flex-col space-y-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 h-36">
            <textarea id="${toolId}_diffA" class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Original text..."></textarea>
            <textarea id="${toolId}_diffB" class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Modified text..."></textarea>
          </div>
          <button onclick="runTextDiff('${toolId}')" class="w-full py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-[11px] rounded text-workspace-text font-mono transition-all">Compute Accurate Diff</button>
          <div id="${toolId}_diffOutput" class="max-h-28 overflow-y-auto p-2 bg-workspace-bg border border-workspace-border rounded text-[10px] font-mono space-y-0.5"></div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const textarea = document.getElementById(`${toolId}_textarea`);
      const status = document.getElementById(`${toolId}_saveStatus`);
      const saved = localStorage.getItem('tabkit_scratchpad_data');
      if (saved && textarea) textarea.value = saved;

      let saveTimer;
      if (textarea) {
        textarea.addEventListener('input', () => {
          if (status) status.textContent = 'Saving...';
          clearTimeout(saveTimer);
          saveTimer = setTimeout(() => {
            localStorage.setItem('tabkit_scratchpad_data', textarea.value);
            if (status) status.textContent = 'Synced';
            if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
          }, 500);
        });
      }
    }
  },

  'url-link-cleaner': {
    id: 'url-link-cleaner',
    name: 'URL Tracking Link Cleaner',
    category: 'Links',
    standaloneUrl: '/url-link-cleaner.html',
    description: 'Extract URLs, strip tracking tags (UTM, fbclid, gclid), and copy clean links.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <textarea id="${toolId}_input" class="w-full h-24 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Paste messy text with URLs or links with ?utm_ params..."></textarea>
        <div class="flex items-center gap-2">
          <button onclick="cleanUrls('${toolId}')" class="flex-1 py-1.5 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent rounded-lg text-xs font-medium transition-all">Sanitize URLs</button>
          <button onclick="openAllCleanUrls('${toolId}')" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Open All</button>
          <button onclick="copyCleanUrls('${toolId}')" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Copy</button>
        </div>
        <div class="flex-1">
          <div class="text-[10px] font-mono text-workspace-muted mb-1 flex justify-between">
            <span>Sanitized Output:</span>
            <span id="${toolId}_count">0 links</span>
          </div>
          <textarea id="${toolId}_output" readonly class="w-full h-24 bg-workspace-bg/50 border border-workspace-border rounded-lg p-2.5 text-base sm:text-[11px] font-mono text-workspace-text/80 focus:outline-none resize-none" placeholder="Clean links appear here..."></textarea>
        </div>
      </div>
    `,
    init: () => {}
  },

  'case-converter': {
    id: 'case-converter',
    name: 'Case Converter & Word Counter',
    category: 'Text',
    standaloneUrl: '/case-converter.html',
    description: 'Deduplicate lines, toggle cases, and count words and characters without uploads.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <div class="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
          <button onclick="transformCase('${toolId}', 'upper')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">UPPER</button>
          <button onclick="transformCase('${toolId}', 'lower')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">lower</button>
          <button onclick="transformCase('${toolId}', 'title')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">Title</button>
          <button onclick="transformCase('${toolId}', 'dedupe')" class="py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight rounded text-workspace-text">Dedupe</button>
        </div>
        <textarea id="${toolId}_input" class="w-full h-36 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Paste text to reformat..."></textarea>
        <div class="flex items-center justify-between text-[11px] font-mono text-workspace-muted">
          <div class="flex gap-2">
            <span id="${toolId}_statsWords">0 words</span>
            <span>•</span>
            <span id="${toolId}_statsChars">0 chars</span>
          </div>
          <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-0.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-workspace-text rounded text-xs transition-all">Copy Text</button>
        </div>
      </div>
    `,
    init: (toolId) => {
      const input = document.getElementById(`${toolId}_input`);
      const words = document.getElementById(`${toolId}_statsWords`);
      const chars = document.getElementById(`${toolId}_statsChars`);
      if (input) {
        input.addEventListener('input', () => {
          const val = input.value;
          if (chars) chars.textContent = `${val.length} chars`;
          const wordCount = val.trim() ? val.trim().split(/\s+/).length : 0;
          if (words) words.textContent = `${wordCount} words`;
        });
      }
    }
  },

  'qr-code-generator': {
    id: 'qr-code-generator',
    name: 'Free QR Code Generator',
    category: 'Utilities',
    standaloneUrl: '/qr-code-generator.html',
    description: 'Generate high-contrast QR codes for links, phone dialer numbers, or plain text.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <textarea id="${toolId}_input" rows="2" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none font-mono resize-none" placeholder="Type or paste links, phrases, or a phone number..."></textarea>
        <div id="${toolId}_telBar" class="hidden flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-workspace-bg border border-workspace-border text-xs font-mono">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-workspace-accent"></span>
            <span class="text-[11px] text-workspace-muted">Phone Number Detected</span>
          </div>
          <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-workspace-text">
            <input id="${toolId}_telToggle" type="checkbox" checked class="accent-[#10B981] rounded" />
            <span>Open Phone Keypad</span>
          </label>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-workspace-border w-fit mx-auto shadow-inner">
          <div id="${toolId}_canvas"></div>
        </div>
        <div class="flex items-center justify-between text-[11px] font-mono text-workspace-muted">
          <span id="${toolId}_charCount">0 characters</span>
          <div class="flex gap-2">
            <button onclick="downloadQrCode('${toolId}')" class="px-2 py-0.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-workspace-text rounded transition-all">Save Image</button>
            <button onclick="copyQrSource('${toolId}')" class="px-2 py-0.5 bg-workspace-bg border border-workspace-border hover:border-workspace-accent text-workspace-text rounded transition-all">Copy Text</button>
          </div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const input = document.getElementById(`${toolId}_input`);
      const container = document.getElementById(`${toolId}_canvas`);
      const count = document.getElementById(`${toolId}_charCount`);
      const telBar = document.getElementById(`${toolId}_telBar`);
      const telToggle = document.getElementById(`${toolId}_telToggle`);

      function isPhoneNumber(str) {
        return /^\+?[0-9]{3,15}$/.test(str.trim().replace(/[\s().-]/g, ''));
      }

      function renderCode() {
        if (!container || !input) return;
        container.innerHTML = '';
        const rawVal = input.value;
        const isPhone = isPhoneNumber(rawVal);

        if (telBar) {
          if (isPhone) telBar.classList.remove('hidden');
          else telBar.classList.add('hidden');
        }

        let textToEncode = rawVal.length > 0 ? String(rawVal) : 'https://tabkit.tools';
        if (isPhone && telToggle && telToggle.checked) {
          textToEncode = 'tel:' + rawVal.trim().replace(/[\s().-]/g, '');
        }

        if (count) {
          count.textContent = `${rawVal.length} character${rawVal.length === 1 ? '' : 's'}${isPhone && telToggle.checked ? ' (Dialer ready)' : ''}`;
        }

        if (typeof QRCode !== 'undefined') {
          try {
            new QRCode(container, {
              text: textToEncode,
              width: 140,
              height: 140,
              colorDark: '#0F1117',
              colorLight: '#FFFFFF',
              correctLevel: 2
            });
          } catch (e) {}
        }
      }

      if (input) input.addEventListener('input', renderCode);
      if (telToggle) telToggle.addEventListener('change', renderCode);
      renderCode();
    }
  },

  'time-zone-converter': {
    id: 'time-zone-converter',
    name: 'World Time Zone Converter',
    category: 'Productivity',
    standaloneUrl: '/time-zone-converter.html',
    description: 'Interactive world clock with 25,000+ searchable cities and synchronized hour slider.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="relative">
          <input id="${toolId}_search" type="text" placeholder="Search any city (e.g. Osaka, Doha, Miami) or country..." class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none" autocomplete="off" />
          <div id="${toolId}_statusBadge" class="absolute right-2.5 top-2 text-[10px] font-mono text-workspace-muted hidden"></div>
          <div id="${toolId}_results" class="absolute left-0 right-0 top-full mt-1 bg-workspace-surface border border-workspace-border rounded-lg max-h-52 overflow-y-auto hidden z-30 shadow-2xl p-1 text-xs"></div>
        </div>
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-workspace-muted">Drag Hour:</span>
          <span id="${toolId}_selectedHour" class="text-workspace-accent font-bold text-sm">12:00 UTC</span>
        </div>
        <input id="${toolId}_slider" type="range" min="0" max="23" value="12" step="1" class="w-full accent-workspace-accent cursor-pointer bg-workspace-bg rounded-lg h-2" />
        <div id="${toolId}_zonesContainer" class="space-y-1.5 max-h-56 overflow-y-auto font-mono text-xs"></div>
      </div>
    `,
    init: (toolId) => {
      let pinned = JSON.parse(localStorage.getItem('tabkit_tz_pinned') || '["Asia/Qatar", "Africa/Tunis", "UTC", "America/New_York"]');
      const slider = document.getElementById(`${toolId}_slider`);
      const label = document.getElementById(`${toolId}_selectedHour`);
      const container = document.getElementById(`${toolId}_zonesContainer`);
      const search = document.getElementById(`${toolId}_search`);
      const results = document.getElementById(`${toolId}_results`);
      const badge = document.getElementById(`${toolId}_statusBadge`);
      let searchTimer = null;

      const currentUtc = new Date().getUTCHours();
      if (slider) slider.value = currentUtc;
      if (label) label.textContent = `${String(currentUtc).padStart(2, '0')}:00 UTC`;

      function getZoneDisplay(iana, utcHour) {
        try {
          const now = new Date();
          const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, 0, 0));
          const timeStr = date.toLocaleTimeString('en-US', { timeZone: iana, hour: '2-digit', minute: '2-digit', hour12: false });
          const hour = parseInt(timeStr.split(':')[0], 10);
          const isWork = hour >= 9 && hour <= 18;
          return { timeStr, isWork };
        } catch (e) {
          return { timeStr: '--:--', isWork: false };
        }
      }

      function renderPinnedZones() {
        if (!container) return;
        container.innerHTML = pinned.map(iana => {
          const parts = iana.split('/');
          const title = parts[parts.length - 1].replace(/_/g, ' ');
          const subtitle = parts[0] || 'Zone';
          const { timeStr, isWork } = getZoneDisplay(iana, parseInt(slider.value, 10));

          return `
            <div class="flex items-center justify-between p-2 rounded bg-workspace-bg border border-workspace-border">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-workspace-text font-bold">${title}</span>
                  <span class="text-workspace-muted text-[11px]">— ${subtitle}</span>
                </div>
                <span class="text-[10px] text-workspace-muted">${iana}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm ${isWork ? 'text-workspace-accent' : 'text-workspace-muted'}">${timeStr}</span>
                <button data-remove-iana="${iana}" title="Remove zone" class="text-workspace-muted hover:text-workspace-danger p-0.5 rounded text-xs leading-none">×</button>
              </div>
            </div>
          `;
        }).join('');

        container.querySelectorAll('[data-remove-iana]').forEach(btn => {
          btn.onclick = () => {
            pinned = pinned.filter(z => z !== btn.dataset.removeIana);
            localStorage.setItem('tabkit_tz_pinned', JSON.stringify(pinned));
            renderPinnedZones();
            if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
          };
        });
      }

      if (slider) {
        slider.oninput = () => {
          if (label) label.textContent = `${String(slider.value).padStart(2, '0')}:00 UTC`;
          renderPinnedZones();
        };
      }

      if (search) {
        search.addEventListener('focus', async () => {
          if (!citiesDataset) {
            if (badge) badge.classList.remove('hidden');
            await loadCitiesDatabase((msg) => {
              if (badge) {
                badge.textContent = msg;
                if (!msg) badge.classList.add('hidden');
              }
            });
          }
        });

        search.oninput = () => {
          clearTimeout(searchTimer);
          searchTimer = setTimeout(async () => {
            const q = search.value.toLowerCase().trim();
            if (!q) {
              if (results) results.classList.add('hidden');
              return;
            }
            const data = await loadCitiesDatabase();
            if (!data || !results) return;

            const matches = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].tokens.includes(q)) {
                matches.push(data[i]);
                if (matches.length >= 15) break;
              }
            }

            if (!matches.length) {
              results.innerHTML = `<div class="p-2 text-center text-workspace-muted text-xs font-mono">No matching cities found</div>`;
            } else {
              results.innerHTML = matches.map(item => `
                <div data-pick-iana="${item.iana}" class="p-2 hover:bg-workspace-surfaceHover rounded cursor-pointer flex items-center justify-between">
                  <div>
                    <span class="font-bold text-workspace-text">${item.city}</span>
                    <span class="text-workspace-muted text-[11px]"> (${item.country})</span>
                  </div>
                  <span class="text-[10px] font-mono text-workspace-accent">${item.iana}</span>
                </div>
              `).join('');

              results.querySelectorAll('[data-pick-iana]').forEach(row => {
                row.onclick = () => {
                  const pick = row.dataset.pickIana;
                  if (!pinned.includes(pick)) {
                    pinned.push(pick);
                    localStorage.setItem('tabkit_tz_pinned', JSON.stringify(pinned));
                    renderPinnedZones();
                    if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
                  }
                  search.value = '';
                  results.classList.add('hidden');
                };
              });
            }
            results.classList.remove('hidden');
          }, 120);
        };
      }

      window.addEventListener('click', (e) => {
        if (search && results && !search.contains(e.target) && !results.contains(e.target)) {
          results.classList.add('hidden');
        }
      });

      renderPinnedZones();
    }
  },

  'secure-password-generator': {
    id: 'secure-password-generator',
    name: 'Secure Password Generator',
    category: 'Security',
    standaloneUrl: '/random-password-generator.html',
    description: 'Generate cryptographically secure passwords or numeric PIN codes.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="flex gap-2 bg-workspace-bg p-1 rounded-lg border border-workspace-border text-xs">
          <button id="${toolId}_tabPass" onclick="setPwType('${toolId}', 'pass')" class="flex-1 py-1 rounded bg-workspace-surface text-workspace-accent font-medium">Password</button>
          <button id="${toolId}_tabPin" onclick="setPwType('${toolId}', 'pin')" class="flex-1 py-1 rounded text-workspace-muted hover:text-workspace-text font-medium">PIN Code</button>
        </div>
        <div class="relative">
          <input id="${toolId}_output" readonly type="text" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-sm font-mono text-workspace-accent pr-16 select-all focus:outline-none" />
          <button onclick="copyGeneratedPw('${toolId}')" class="absolute right-1.5 top-1.5 px-2.5 py-1 bg-workspace-surface hover:bg-workspace-border border border-workspace-border text-[11px] font-mono text-workspace-text rounded transition-all">Copy</button>
        </div>
        <div class="flex items-center justify-between text-xs font-mono text-workspace-muted">
          <span>Length: <strong id="${toolId}_lenLabel" class="text-workspace-text">16</strong></span>
          <input id="${toolId}_lenSlider" type="range" min="6" max="32" value="16" class="w-32 accent-workspace-accent cursor-pointer" />
        </div>
        <button onclick="generateNewPassword('${toolId}')" class="w-full py-2 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5">
          <span>⚡ Generate New</span>
        </button>
      </div>
    `,
    init: (toolId) => {
      const card = document.getElementById(`card_${toolId}`);
      if (card) card.dataset.mode = 'pass';
      const slider = document.getElementById(`${toolId}_lenSlider`);
      const label = document.getElementById(`${toolId}_lenLabel`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          if (label) label.textContent = e.target.value;
          generateNewPassword(toolId);
        });
      }
      generateNewPassword(toolId);
    }
  },

  'unit-converter': {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    category: 'Utilities',
    standaloneUrl: '/unit-converter.html',
    description: 'Multi-category converter for data, length, mass, temperature, speed, volume, and time.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="flex items-center justify-between gap-2">
          <select id="${toolId}_category" class="flex-1 bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-base sm:text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none">
            <option value="digital">Digital Storage (B / KB / MB / GB...)</option>
            <option value="length">Length &amp; Distance (cm, m, in, ft...)</option>
            <option value="weight">Weight &amp; Mass (kg, lbs, oz, g...)</option>
            <option value="temp">Temperature (°C, °F, K)</option>
            <option value="speed">Speed (km/h, mph, m/s, knots)</option>
            <option value="volume">Volume (L, ml, gal, fl oz...)</option>
            <option value="time">Time Duration (ms, s, min, h, d...)</option>
          </select>
          <select id="${toolId}_precision" title="Decimal precision" class="bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-base sm:text-xs font-mono text-workspace-muted hover:text-workspace-text focus:outline-none">
            <option value="2">2 dec</option>
            <option value="4" selected>4 dec</option>
            <option value="6">6 dec</option>
            <option value="0">0 dec</option>
          </select>
        </div>
        <div class="grid grid-cols-[1fr,auto,1fr] gap-2 items-center font-mono">
          <div class="space-y-1.5">
            <select id="${toolId}_unitA" class="w-full bg-workspace-bg border border-workspace-border rounded p-1 text-base sm:text-[11px] text-workspace-text focus:outline-none"></select>
            <input id="${toolId}_inputA" type="number" step="any" value="1" class="w-full bg-workspace-bg border border-workspace-border rounded p-2 text-base sm:text-xs text-workspace-text focus:border-workspace-accent focus:outline-none" />
          </div>
          <button id="${toolId}_btnSwap" type="button" title="Swap Units" class="p-1.5 mt-5 rounded bg-workspace-bg hover:bg-workspace-surfaceHover border border-workspace-border text-workspace-muted hover:text-workspace-accent transition-colors">
            ⇄
          </button>
          <div class="space-y-1.5">
            <select id="${toolId}_unitB" class="w-full bg-workspace-bg border border-workspace-border rounded p-1 text-base sm:text-[11px] text-workspace-text focus:outline-none"></select>
            <input id="${toolId}_inputB" type="number" step="any" class="w-full bg-workspace-bg border border-workspace-border rounded p-2 text-base sm:text-xs text-workspace-accent font-bold focus:border-workspace-accent focus:outline-none" />
          </div>
        </div>
        <div id="${toolId}_formula" class="text-[11px] font-mono text-center text-workspace-muted pt-2 border-t border-workspace-border/50"></div>
      </div>
    `,
    init: (toolId) => {
      const categorySelect = document.getElementById(`${toolId}_category`);
      const precisionSelect = document.getElementById(`${toolId}_precision`);
      const unitA = document.getElementById(`${toolId}_unitA`);
      const unitB = document.getElementById(`${toolId}_unitB`);
      const inputA = document.getElementById(`${toolId}_inputA`);
      const inputB = document.getElementById(`${toolId}_inputB`);
      const btnSwap = document.getElementById(`${toolId}_btnSwap`);
      const formula = document.getElementById(`${toolId}_formula`);

      function populateUnitOptions() {
        const catKey = categorySelect.value;
        const config = CONVERTER_CONFIG[catKey];
        const entries = Object.entries(config.units);
        const optionsHtml = entries.map(([key, u]) => `<option value="${key}">${u.label}</option>`).join('');
        unitA.innerHTML = optionsHtml;
        unitB.innerHTML = optionsHtml;
        unitA.value = config.defaultA;
        unitB.value = config.defaultB;
      }

      function convertValue(val, fromKey, toKey, catKey) {
        if (isNaN(val) || val === '') return '';
        val = parseFloat(val);
        if (catKey === 'temp') {
          let celsius = val;
          if (fromKey === 'f') celsius = (val - 32) * (5 / 9);
          else if (fromKey === 'k') celsius = val - 273.15;
          if (toKey === 'c') return celsius;
          if (toKey === 'f') return (celsius * (9 / 5)) + 32;
          if (toKey === 'k') return celsius + 273.15;
          return celsius;
        }
        const config = CONVERTER_CONFIG[catKey];
        const fromRatio = config.units[fromKey].ratio;
        const toRatio = config.units[toKey].ratio;
        return (val * fromRatio) / toRatio;
      }

      function formatNumber(num) {
        if (num === '' || isNaN(num)) return '';
        num = Number(num);
        if (num === 0) return '0';
        const dec = parseInt(precisionSelect.value, 10);
        if (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e12) {
          return num.toExponential(dec);
        }
        return parseFloat(num.toFixed(dec)).toString();
      }

      function calculateFromA() {
        const catKey = categorySelect.value;
        if (inputA.value === '') { inputB.value = ''; return; }
        const res = convertValue(inputA.value, unitA.value, unitB.value, catKey);
        inputB.value = formatNumber(res);
        updateFormulaBar();
      }

      function calculateFromB() {
        const catKey = categorySelect.value;
        if (inputB.value === '') { inputA.value = ''; return; }
        const res = convertValue(inputB.value, unitB.value, unitA.value, catKey);
        inputA.value = formatNumber(res);
        updateFormulaBar();
      }

      function updateFormulaBar() {
        const catKey = categorySelect.value;
        if (catKey === 'temp') {
          formula.textContent = `${unitA.value.toUpperCase()} ↔ ${unitB.value.toUpperCase()}`;
        } else {
          const oneConverted = convertValue(1, unitA.value, unitB.value, catKey);
          formula.textContent = `1 ${unitA.value} ≈ ${formatNumber(oneConverted)} ${unitB.value}`;
        }
      }

      categorySelect.addEventListener('change', () => { populateUnitOptions(); calculateFromA(); });
      precisionSelect.addEventListener('change', calculateFromA);
      unitA.addEventListener('change', calculateFromA);
      unitB.addEventListener('change', calculateFromA);
      inputA.addEventListener('input', calculateFromA);
      inputB.addEventListener('input', calculateFromB);
      btnSwap.addEventListener('click', () => {
        const temp = unitA.value;
        unitA.value = unitB.value;
        unitB.value = temp;
        calculateFromA();
      });

      populateUnitOptions();
      calculateFromA();
    }
  },

  'percentage-calculator': {
    id: 'percentage-calculator',
    name: 'Online Percentage Calculator',
    category: 'Utilities',
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
  },

  'date-calculator': {
    id: 'date-calculator',
    name: 'Days Between Dates Calculator',
    category: 'Utilities',
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
  },

  'random-name-picker': {
    id: 'random-name-picker',
    name: 'Random Name Picker & Wheel',
    category: 'Utilities',
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
  },

  'json-formatter': {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'Developer',
    standaloneUrl: '/json-formatter.html',
    description: 'Format, validate, and minify JSON strings instantly.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <textarea id="${toolId}_input" class="w-full h-40 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-[11px] font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder='Paste JSON here... e.g. {"key": "value"}'></textarea>
        <div class="flex items-center gap-2">
          <button onclick="formatJsonTool('${toolId}', false)" class="flex-1 py-1.5 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent rounded-lg text-xs font-medium transition-all">Format JSON</button>
          <button onclick="formatJsonTool('${toolId}', true)" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Minify</button>
          <button onclick="copyTextTool('${toolId}')" class="px-3 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Copy</button>
        </div>
      </div>
    `,
    init: () => {}
  },

  'base64-encoder-decoder': {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Developer',
    standaloneUrl: '/base64-encoder-decoder.html',
    description: 'Encode or decode text to Base64 format locally.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-2.5 font-sans">
        <textarea id="${toolId}_input" class="w-full h-40 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Paste text or Base64 string here..."></textarea>
        <div class="flex items-center gap-2">
          <button onclick="convertBase64('${toolId}', 'encode')" class="flex-1 py-1.5 bg-workspace-accent/10 border border-workspace-accent/30 hover:bg-workspace-accent/20 text-workspace-accent rounded-lg text-xs font-medium transition-all">Encode to Base64</button>
          <button onclick="convertBase64('${toolId}', 'decode')" class="flex-1 py-1.5 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-medium transition-all">Decode Base64</button>
        </div>
      </div>
    `,
    init: () => {}
  },

  'sha256-hash-generator': {
    id: 'sha256-hash-generator',
    name: 'SHA-256 Hash Generator',
    category: 'Security',
    standaloneUrl: '/sha256-hash-generator.html',
    description: 'Generate SHA-256, SHA-384, and SHA-512 hashes instantly.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <textarea id="${toolId}_input" oninput="generateHashes('${toolId}')" class="w-full h-16 bg-workspace-bg border border-workspace-border rounded-lg p-2.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:outline-none resize-none" placeholder="Type text to hash..."></textarea>
        <div class="space-y-2 flex-1">
          <div>
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">SHA-256</div>
            <div class="relative">
              <input id="${toolId}_sha256" readonly class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 pr-10 text-[10px] font-mono text-workspace-accent focus:outline-none select-all" />
              <button onclick="copyHash('${toolId}', 'sha256')" class="absolute right-1 top-1 px-2 py-0.5 bg-workspace-surface border border-workspace-border text-[9px] text-workspace-text rounded hover:bg-workspace-borderLight">Copy</button>
            </div>
          </div>
          <div>
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">SHA-384</div>
            <div class="relative">
              <input id="${toolId}_sha384" readonly class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 pr-10 text-[10px] font-mono text-workspace-accent focus:outline-none select-all" />
              <button onclick="copyHash('${toolId}', 'sha384')" class="absolute right-1 top-1 px-2 py-0.5 bg-workspace-surface border border-workspace-border text-[9px] text-workspace-text rounded hover:bg-workspace-borderLight">Copy</button>
            </div>
          </div>
          <div>
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">SHA-512</div>
            <div class="relative">
              <input id="${toolId}_sha512" readonly class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 pr-10 text-[10px] font-mono text-workspace-accent focus:outline-none select-all" />
              <button onclick="copyHash('${toolId}', 'sha512')" class="absolute right-1 top-1 px-2 py-0.5 bg-workspace-surface border border-workspace-border text-[9px] text-workspace-text rounded hover:bg-workspace-borderLight">Copy</button>
            </div>
          </div>
        </div>
      </div>
    `,
    init: () => {}
  },

  'hex-color-converter': {
    id: 'hex-color-converter',
    name: 'HEX to RGB Color Converter',
    category: 'Developer',
    standaloneUrl: '/hex-color-converter.html',
    description: 'Convert colors between HEX, RGB, and HSL formats.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="flex items-center gap-3 p-3 bg-workspace-bg border border-workspace-border rounded-lg">
          <input type="color" id="${toolId}_picker" value="#10B981" oninput="updateColorConverter('${toolId}', 'picker')" class="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0">
          <div class="flex-1">
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">HEX Code</div>
            <input id="${toolId}_hex" type="text" value="#10B981" oninput="updateColorConverter('${toolId}', 'hex')" class="w-full bg-workspace-surface border border-workspace-border rounded p-1.5 text-xs font-mono text-workspace-text focus:outline-none uppercase" />
          </div>
        </div>
        <div class="space-y-2">
          <div>
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">RGB</div>
            <input id="${toolId}_rgb" readonly value="rgb(16, 185, 129)" class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 text-xs font-mono text-workspace-accent focus:outline-none select-all" />
          </div>
          <div>
            <div class="text-[10px] font-mono text-workspace-muted mb-0.5">HSL</div>
            <input id="${toolId}_hsl" readonly value="hsl(160, 84%, 39%)" class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 text-xs font-mono text-workspace-accent focus:outline-none select-all" />
          </div>
        </div>
      </div>
    `,
    init: () => {}
  },

  'pomodoro-timer': {
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
  },

  'excel-formula-builder': {
    id: 'excel-formula-builder',
    name: 'Excel Formula Builder Cheat Sheet',
    category: 'Data',
    standaloneUrl: '/excel-formula-builder.html',
    description: 'Massive offline registry of Excel/Sheets formulas with a fill-in-the-blanks builder.',
    render: (toolId) => `
      <div class="flex flex-col h-[480px] font-sans relative overflow-hidden">
        <div id="${toolId}_view_list" class="flex flex-col h-full space-y-3 transition-transform duration-300">
          <input id="${toolId}_search" type="text" placeholder="Search 90+ formulas (e.g. VLOOKUP, PMT)..." class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none" />
          <div id="${toolId}_categories" class="flex flex-wrap gap-1"></div>
          <div id="${toolId}_list" class="flex-1 overflow-y-auto space-y-1.5 pr-1"></div>
        </div>

        <div id="${toolId}_view_builder" class="absolute inset-0 flex flex-col h-full bg-workspace-surface translate-x-full transition-transform duration-300 z-10">
          <div class="flex items-center gap-2 mb-3 pb-2 border-b border-workspace-border">
            <button id="${toolId}_btn_back" class="text-workspace-muted hover:text-workspace-text p-1 bg-workspace-bg rounded border border-workspace-border transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="flex-1">
              <h4 id="${toolId}_bld_title" class="font-bold text-workspace-accent text-sm font-mono leading-none"></h4>
              <p id="${toolId}_bld_desc" class="text-[10px] text-workspace-muted leading-tight mt-1"></p>
            </div>
          </div>
          <div id="${toolId}_bld_inputs" class="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs"></div>
          <div class="mt-3 pt-3 border-t border-workspace-border">
            <div class="text-[10px] font-mono text-workspace-muted mb-1">Generated Formula</div>
            <div class="relative">
              <textarea id="${toolId}_bld_output" readonly class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-2.5 pr-12 text-sm font-mono text-workspace-text focus:outline-none resize-none h-16 leading-tight"></textarea>
              <button id="${toolId}_btn_copy" class="absolute right-1.5 top-1.5 px-2 py-1 bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-[10px] font-mono text-workspace-text rounded transition-all">Copy</button>
            </div>
          </div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const viewList = document.getElementById(`${toolId}_view_list`);
      const viewBld = document.getElementById(`${toolId}_view_builder`);
      const searchInput = document.getElementById(`${toolId}_search`);
      const catsContainer = document.getElementById(`${toolId}_categories`);
      const listContainer = document.getElementById(`${toolId}_list`);
      const bldTitle = document.getElementById(`${toolId}_bld_title`);
      const bldDesc = document.getElementById(`${toolId}_bld_desc`);
      const bldInputs = document.getElementById(`${toolId}_bld_inputs`);
      const bldOutput = document.getElementById(`${toolId}_bld_output`);
      const btnBack = document.getElementById(`${toolId}_btn_back`);
      const btnCopy = document.getElementById(`${toolId}_btn_copy`);

      let activeCat = 'All';
      let activeFormula = null;

      const EXCEL_FORMULAS = [
        { id: 'xlookup', name: 'XLOOKUP', cat: 'Lookups', desc: 'Modern search. Find a value and return a match from another array.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr1', label: 'Lookup Array', pl: 'Sheet2!A:A' }, { id: 'arr2', label: 'Return Array', pl: 'Sheet2!C:C' }, { id: 'err', label: 'If not found (opt)', pl: '"Not Found"' }], gen: (v) => `=XLOOKUP(${v.val || 'A2'}, ${v.arr1 || 'Sheet2!A:A'}, ${v.arr2 || 'Sheet2!C:C'}, ${v.err || '""'})` },
        { id: 'vlookup', name: 'VLOOKUP', cat: 'Lookups', desc: 'Classic vertical lookup.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Table Array', pl: 'Sheet2!A:D' }, { id: 'col', label: 'Column Index Number', pl: '2' }, { id: 'exact', label: 'Exact Match?', pl: 'FALSE' }], gen: (v) => `=VLOOKUP(${v.val || 'A2'}, ${v.arr || 'Sheet2!A:D'}, ${v.col || '2'}, ${v.exact || 'FALSE'})` },
        { id: 'hlookup', name: 'HLOOKUP', cat: 'Lookups', desc: 'Classic horizontal lookup.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Table Array', pl: 'Sheet2!A1:Z5' }, { id: 'row', label: 'Row Index Number', pl: '2' }, { id: 'exact', label: 'Exact Match?', pl: 'FALSE' }], gen: (v) => `=HLOOKUP(${v.val || 'A2'}, ${v.arr || 'Sheet2!A1:Z5'}, ${v.row || '2'}, ${v.exact || 'FALSE'})` },
        { id: 'index', name: 'INDEX', cat: 'Lookups', desc: 'Returns the value in a specific row/col.', inputs: [{ id: 'arr', label: 'Array / Range', pl: 'A1:C10' }, { id: 'row', label: 'Row Number', pl: '2' }, { id: 'col', label: 'Column Number (opt)', pl: '3' }], gen: (v) => `=INDEX(${v.arr || 'A1:C10'}, ${v.row || '2'}${v.col ? `, ${v.col}` : ''})` },
        { id: 'match', name: 'MATCH', cat: 'Lookups', desc: 'Returns the position of an item in a range.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Lookup Array', pl: 'B:B' }, { id: 'type', label: 'Match Type (0=Exact)', pl: '0' }], gen: (v) => `=MATCH(${v.val || 'A2'}, ${v.arr || 'B:B'}, ${v.type || '0'})` },
        { id: 'indirect', name: 'INDIRECT', cat: 'Lookups', desc: 'Converts a text string into a valid cell reference.', inputs: [{ id: 'text', label: 'Text String / Cell ref', pl: '"A1"' }], gen: (v) => `=INDIRECT(${v.text || '"A1"'})` },
        { id: 'offset', name: 'OFFSET', cat: 'Lookups', desc: 'Returns a reference offset from a starting cell.', inputs: [{ id: 'ref', label: 'Starting Reference', pl: 'A1' }, { id: 'rows', label: 'Rows to offset', pl: '1' }, { id: 'cols', label: 'Cols to offset', pl: '1' }], gen: (v) => `=OFFSET(${v.ref || 'A1'}, ${v.rows || '1'}, ${v.cols || '1'})` },
        { id: 'filter', name: 'FILTER', cat: 'Arrays', desc: 'Filters a range of data based on criteria.', inputs: [{ id: 'arr', label: 'Array to filter', pl: 'A2:C10' }, { id: 'inc', label: 'Include condition', pl: 'B2:B10="Yes"' }, { id: 'emp', label: 'If Empty (opt)', pl: '"None"' }], gen: (v) => `=FILTER(${v.arr || 'A2:C10'}, ${v.inc || 'B2:B10="Yes"'}, ${v.emp || '""'})` },
        { id: 'sort', name: 'SORT', cat: 'Arrays', desc: 'Sorts the contents of a range or array.', inputs: [{ id: 'arr', label: 'Array', pl: 'A2:C10' }, { id: 'idx', label: 'Sort Index (col number)', pl: '1' }, { id: 'ord', label: 'Order (1=Asc, -1=Desc)', pl: '1' }], gen: (v) => `=SORT(${v.arr || 'A2:C10'}, ${v.idx || '1'}, ${v.ord || '1'})` },
        { id: 'unique', name: 'UNIQUE', cat: 'Arrays', desc: 'Returns a list of unique values in a list.', inputs: [{ id: 'arr', label: 'Array', pl: 'A2:A20' }], gen: (v) => `=UNIQUE(${v.arr || 'A2:A20'})` },
        { id: 'sum', name: 'SUM', cat: 'Math', desc: 'Adds all numbers in a range.', inputs: [{ id: 'r1', label: 'Range 1', pl: 'A1:A10' }, { id: 'r2', label: 'Range 2 (opt)', pl: 'B1:B10' }], gen: (v) => `=SUM(${v.r1 || 'A1:A10'}${v.r2 ? `, ${v.r2}` : ''})` },
        { id: 'sumif', name: 'SUMIF', cat: 'Math', desc: 'Sums numbers based on one condition.', inputs: [{ id: 'range', label: 'Range to check', pl: 'A:A' }, { id: 'crit', label: 'Condition', pl: '">100"' }, { id: 'sumr', label: 'Sum Range (opt)', pl: 'B:B' }], gen: (v) => `=SUMIF(${v.range || 'A:A'}, ${v.crit || '">100"'}${v.sumr ? `, ${v.sumr}` : ''})` },
        { id: 'sumifs', name: 'SUMIFS', cat: 'Math', desc: 'Sums numbers based on multiple conditions.', inputs: [{ id: 'sumr', label: 'Range to Sum', pl: 'C:C' }, { id: 'cr1', label: 'Criteria Range 1', pl: 'A:A' }, { id: 'c1', label: 'Condition 1', pl: '"Done"' }], gen: (v) => `=SUMIFS(${v.sumr || 'C:C'}, ${v.cr1 || 'A:A'}, ${v.c1 || '"Done"'})` },
        { id: 'count', name: 'COUNT', cat: 'Stats', desc: 'Counts how many cells contain numbers.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }], gen: (v) => `=COUNT(${v.r || 'A:A'})` },
        { id: 'counta', name: 'COUNTA', cat: 'Stats', desc: 'Counts how many cells are not empty.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }], gen: (v) => `=COUNTA(${v.r || 'A:A'})` },
        { id: 'countif', name: 'COUNTIF', cat: 'Stats', desc: 'Counts cells based on one condition.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }, { id: 'c', label: 'Condition', pl: '"*Urgent*"' }], gen: (v) => `=COUNTIF(${v.r || 'A:A'}, ${v.c || '"*Urgent*"'})` },
        { id: 'countifs', name: 'COUNTIFS', cat: 'Stats', desc: 'Counts cells based on multiple conditions.', inputs: [{ id: 'r1', label: 'Criteria Range 1', pl: 'A:A' }, { id: 'c1', label: 'Condition 1', pl: '"Done"' }], gen: (v) => `=COUNTIFS(${v.r1 || 'A:A'}, ${v.c1 || '"Done"'})` },
        { id: 'average', name: 'AVERAGE', cat: 'Stats', desc: 'Calculates the average of numbers.', inputs: [{ id: 'r', label: 'Range', pl: 'B:B' }], gen: (v) => `=AVERAGE(${v.r || 'B:B'})` },
        { id: 'averageif', name: 'AVERAGEIF', cat: 'Stats', desc: 'Average based on a condition.', inputs: [{ id: 'r', label: 'Range to check', pl: 'A:A' }, { id: 'c', label: 'Condition', pl: '"Done"' }, { id: 'ar', label: 'Average Range (opt)', pl: 'B:B' }], gen: (v) => `=AVERAGEIF(${v.r || 'A:A'}, ${v.c || '"Done"'}${v.ar ? `, ${v.ar}` : ''})` },
        { id: 'textjoin', name: 'TEXTJOIN', cat: 'Text', desc: 'Combines text from multiple ranges with a delimiter.', inputs: [{ id: 'del', label: 'Delimiter', pl: '", "' }, { id: 'ign', label: 'Ignore Empty?', pl: 'TRUE' }, { id: 'r', label: 'Text/Range', pl: 'A1:A5' }], gen: (v) => `=TEXTJOIN(${v.del || '", "'}, ${v.ign || 'TRUE'}, ${v.r || 'A1:A5'})` },
        { id: 'concat', name: 'CONCAT', cat: 'Text', desc: 'Joins several text items into one.', inputs: [{ id: 't1', label: 'Text 1', pl: 'A2' }, { id: 't2', label: 'Text 2', pl: 'B2' }], gen: (v) => `=CONCAT(${v.t1 || 'A2'}, ${v.t2 || 'B2'})` },
        { id: 'left', name: 'LEFT', cat: 'Text', desc: 'Extracts chars from the left side.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 'n', label: 'Number of chars', pl: '5' }], gen: (v) => `=LEFT(${v.t || 'A2'}, ${v.n || '5'})` },
        { id: 'right', name: 'RIGHT', cat: 'Text', desc: 'Extracts chars from the right side.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 'n', label: 'Number of chars', pl: '3' }], gen: (v) => `=RIGHT(${v.t || 'A2'}, ${v.n || '3'})` },
        { id: 'mid', name: 'MID', cat: 'Text', desc: 'Extracts chars from the middle.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 's', label: 'Start position', pl: '2' }, { id: 'n', label: 'Number of chars', pl: '4' }], gen: (v) => `=MID(${v.t || 'A2'}, ${v.s || '2'}, ${v.n || '4'})` },
        { id: 'trim', name: 'TRIM', cat: 'Text', desc: 'Removes extra spaces from text.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }], gen: (v) => `=TRIM(${v.t || 'A2'})` },
        { id: 'if', name: 'IF', cat: 'Logic', desc: 'Checks a condition, returns one value if true, another if false.', inputs: [{ id: 'l', label: 'Logical Test', pl: 'A2>100' }, { id: 't', label: 'If True', pl: '"High"' }, { id: 'f', label: 'If False', pl: '"Low"' }], gen: (v) => `=IF(${v.l || 'A2>100'}, ${v.t || '"High"'}, ${v.f || '"Low"'})` },
        { id: 'iferror', name: 'IFERROR', cat: 'Logic', desc: 'Returns fallback if a formula throws an error.', inputs: [{ id: 'v', label: 'Value / Formula', pl: 'A2/B2' }, { id: 'e', label: 'If Error', pl: '0' }], gen: (v) => `=IFERROR(${v.v || 'A2/B2'}, ${v.e || '0'})` },
        { id: 'datedif', name: 'DATEDIF', cat: 'Date', desc: 'Days, months, or years between two dates.', inputs: [{ id: 's', label: 'Start Date', pl: 'A2' }, { id: 'e', label: 'End Date', pl: 'B2' }, { id: 'u', label: 'Unit ("Y", "M", "D")', pl: '"D"' }], gen: (v) => `=DATEDIF(${v.s || 'A2'}, ${v.e || 'B2'}, ${v.u || '"D"'})` },
        { id: 'networkdays', name: 'NETWORKDAYS', cat: 'Date', desc: 'Number of whole working days between dates.', inputs: [{ id: 's', label: 'Start Date', pl: 'A2' }, { id: 'e', label: 'End Date', pl: 'B2' }, { id: 'h', label: 'Holidays (opt)', pl: 'H1:H10' }], gen: (v) => `=NETWORKDAYS(${v.s || 'A2'}, ${v.e || 'B2'}${v.h ? `, ${v.h}` : ''})` }
      ];

      const categories = ['All', ...new Set(EXCEL_FORMULAS.map(f => f.cat))];
      if (catsContainer) {
        catsContainer.innerHTML = categories.map(c => 
          `<button data-cat="${c}" class="px-2 py-0.5 rounded text-[10px] font-mono border ${c === 'All' ? 'bg-workspace-surface border-workspace-border text-workspace-accent' : 'bg-workspace-bg border-transparent text-workspace-muted hover:text-workspace-text'} transition-colors">${c}</button>`
        ).join('');

        catsContainer.querySelectorAll('button').forEach(btn => {
          btn.onclick = () => {
            catsContainer.querySelectorAll('button').forEach(b => {
              b.className = `px-2 py-0.5 rounded text-[10px] font-mono border ${b.dataset.cat === btn.dataset.cat ? 'bg-workspace-surface border-workspace-border text-workspace-accent' : 'bg-workspace-bg border-transparent text-workspace-muted hover:text-workspace-text'} transition-colors`;
            });
            activeCat = btn.dataset.cat;
            renderList();
          };
        });
      }

      function renderList() {
        if (!searchInput || !listContainer) return;
        const q = searchInput.value.toLowerCase().trim();
        const filtered = EXCEL_FORMULAS.filter(f => {
          const matchCat = activeCat === 'All' || f.cat === activeCat;
          const matchQ = f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
          return matchCat && matchQ;
        });

        if (!filtered.length) {
          listContainer.innerHTML = `<div class="text-xs font-mono text-workspace-muted p-2">No formulas found.</div>`;
          return;
        }

        listContainer.innerHTML = filtered.map(f => `
          <button data-fid="${f.id}" class="w-full text-left p-2 rounded-lg bg-workspace-surface border border-workspace-border hover:border-workspace-accent/50 group transition-all">
            <div class="flex items-center justify-between">
              <span class="font-bold text-workspace-text group-hover:text-workspace-accent font-mono text-xs">${f.name}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-workspace-bg text-workspace-muted">${f.cat}</span>
            </div>
            <div class="text-[10px] text-workspace-muted mt-1 leading-tight line-clamp-1">${f.desc}</div>
          </button>
        `).join('');

        listContainer.querySelectorAll('button[data-fid]').forEach(btn => {
          btn.onclick = () => openBuilder(btn.dataset.fid);
        });
      }

      function openBuilder(fid) {
        activeFormula = EXCEL_FORMULAS.find(f => f.id === fid);
        if (!activeFormula) return;
        if (bldTitle) bldTitle.textContent = activeFormula.name;
        if (bldDesc) bldDesc.textContent = activeFormula.desc;

        if (bldInputs) {
          if (activeFormula.inputs.length === 0) {
            bldInputs.innerHTML = `<div class="text-[10px] text-workspace-muted font-mono italic p-2">No arguments required for this formula.</div>`;
          } else {
            bldInputs.innerHTML = activeFormula.inputs.map(inp => `
              <div>
                <label class="block text-[10px] font-mono text-workspace-muted mb-0.5">${inp.label}</label>
                <input id="${toolId}_inp_${inp.id}" type="text" placeholder="e.g. ${inp.pl}" class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 text-workspace-text focus:border-workspace-accent focus:outline-none font-mono" />
              </div>
            `).join('');

            activeFormula.inputs.forEach(inp => {
              const inputEl = document.getElementById(`${toolId}_inp_${inp.id}`);
              if (inputEl) inputEl.addEventListener('input', updateOutput);
            });
          }
        }

        updateOutput();
        if (viewList) viewList.classList.add('-translate-x-full');
        if (viewBld) viewBld.classList.remove('translate-x-full');
      }

      function updateOutput() {
        if (!activeFormula || !bldOutput) return;
        const vals = {};
        activeFormula.inputs.forEach(inp => {
          const el = document.getElementById(`${toolId}_inp_${inp.id}`);
          vals[inp.id] = el ? el.value.trim() : '';
        });
        bldOutput.value = activeFormula.gen(vals);
      }

      if (btnBack) {
        btnBack.onclick = () => {
          if (viewList) viewList.classList.remove('-translate-x-full');
          if (viewBld) viewBld.classList.add('translate-x-full');
          activeFormula = null;
        };
      }

      if (btnCopy) {
        btnCopy.onclick = () => {
          if (bldOutput && bldOutput.value) {
            navigator.clipboard.writeText(bldOutput.value);
            showToast('Formula copied to clipboard!');
          }
        };
      }

      if (searchInput) searchInput.addEventListener('input', renderList);
      renderList();
    }
  }
};