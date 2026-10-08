// Tool: hex-color-converter
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['hex-color-converter'] = Object.assign(window.TOOLS_REGISTRY['hex-color-converter'] || {}, {
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
  });
