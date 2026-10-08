// Tool: url-link-cleaner
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

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['url-link-cleaner'] = Object.assign(window.TOOLS_REGISTRY['url-link-cleaner'] || {}, {
    id: 'url-link-cleaner',
    name: 'URL Tracking Link Cleaner',
    category: 'Privacy & Security',
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
  });
