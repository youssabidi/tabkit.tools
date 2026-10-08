// Tool: qr-code-generator
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['qr-code-generator'] = Object.assign(window.TOOLS_REGISTRY['qr-code-generator'] || {}, {
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
  });
