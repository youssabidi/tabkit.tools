// Tool: jwt-decoder (Client-Side JWT Token Inspector & Expiry Checker)
function b64UrlDecode(str) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: break;
    case 2: output += '=='; break;
    case 3: output += '='; break;
    default: throw new Error('Illegal base64url string');
  }
  return decodeURIComponent(escape(atob(output)));
}

function decodeJwtTool(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  const headerOut = document.getElementById(`${toolId}_header`);
  const payloadOut = document.getElementById(`${toolId}_payload`);
  const statusBadge = document.getElementById(`${toolId}_status`);

  if (!input || !headerOut || !payloadOut || !statusBadge) return;
  const token = input.value.trim();
  if (!token) return;

  const parts = token.split('.');
  if (parts.length < 2) {
    statusBadge.textContent = 'Invalid JWT format (needs header.payload.signature)';
    statusBadge.className = 'text-[10px] font-mono text-workspace-danger';
    return;
  }

  try {
    const headerObj = JSON.parse(b64UrlDecode(parts[0]));
    const payloadObj = JSON.parse(b64UrlDecode(parts[1]));

    headerOut.textContent = JSON.stringify(headerObj, null, 2);
    payloadOut.textContent = JSON.stringify(payloadObj, null, 2);

    // Check expiration
    if (payloadObj.exp) {
      const expDate = new Date(payloadObj.exp * 1000);
      const now = new Date();
      if (expDate > now) {
        const diffMins = Math.round((expDate - now) / 60000);
        statusBadge.textContent = `Valid (Expires in ${diffMins} min${diffMins === 1 ? '' : 's'})`;
        statusBadge.className = 'text-[10px] font-mono text-workspace-accent font-bold';
      } else {
        statusBadge.textContent = `Expired on ${expDate.toLocaleDateString()} ${expDate.toLocaleTimeString()}`;
        statusBadge.className = 'text-[10px] font-mono text-workspace-danger font-bold';
      }
    } else {
      statusBadge.textContent = 'Valid payload (No exp claim)';
      statusBadge.className = 'text-[10px] font-mono text-workspace-accent';
    }
  } catch (err) {
    statusBadge.textContent = 'Failed to decode payload: ' + err.message;
    statusBadge.className = 'text-[10px] font-mono text-workspace-danger';
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['jwt-decoder'] = Object.assign(window.TOOLS_REGISTRY['jwt-decoder'] || {}, {
  id: 'jwt-decoder',
  name: 'JSON Web Token (JWT) Decoder',
  category: 'Developer & Code',
  standaloneUrl: '/jwt-decoder.html',
  description: 'Decode and inspect JWT header and payload claims securely in your browser with expiration validation.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <textarea id="${toolId}_input" class="w-full h-16 bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder="Paste your jwt token (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"></textarea>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[140px]">
        <div class="flex flex-col">
          <span class="text-[10px] font-mono text-workspace-muted mb-0.5">Header (Algorithm)</span>
          <pre id="${toolId}_header" class="flex-1 overflow-auto bg-workspace-surface/50 border border-workspace-border rounded-lg p-2 text-[10px] font-mono text-sky-400 select-text leading-tight"></pre>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-mono text-workspace-muted mb-0.5">Payload (Claims)</span>
          <pre id="${toolId}_payload" class="flex-1 overflow-auto bg-workspace-surface/50 border border-workspace-border rounded-lg p-2 text-[10px] font-mono text-emerald-400 select-text leading-tight"></pre>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Paste a token to inspect</span>
        <button onclick="copyOutputTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg text-xs font-mono transition-all">Copy</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    if (input) {
      input.addEventListener('input', () => decodeJwtTool(toolId));
      if (!input.value) {
        input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.4z6';
        decodeJwtTool(toolId);
      }
    }
  }
});
