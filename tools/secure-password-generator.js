// Tool: secure-password-generator
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['secure-password-generator'] = Object.assign(window.TOOLS_REGISTRY['secure-password-generator'] || {}, {
    id: 'secure-password-generator',
    name: 'Secure Password Generator',
    category: 'Privacy & Security',
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
  });
