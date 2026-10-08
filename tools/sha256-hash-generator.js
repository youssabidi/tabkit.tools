// Tool: sha256-hash-generator
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['sha256-hash-generator'] = Object.assign(window.TOOLS_REGISTRY['sha256-hash-generator'] || {}, {
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
  });
