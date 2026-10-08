// Tool: unit-converter
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['unit-converter'] = Object.assign(window.TOOLS_REGISTRY['unit-converter'] || {}, {
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
  });
