// Tool: base64-encoder-decoder
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['base64-encoder-decoder'] = Object.assign(window.TOOLS_REGISTRY['base64-encoder-decoder'] || {}, {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'Privacy & Security',
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
  });
