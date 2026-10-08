// Tool: markdown-preview (Offline Markdown Live Editor & HTML Renderer)
function parseMarkdownToHtml(md) {
  if (!md) return '';
  let html = escapeHtml(md);

  // Fenced Code blocks
  html = html.replace(/```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-workspace-bg p-3 rounded-lg border border-workspace-border overflow-x-auto text-[11px] font-mono text-emerald-400 my-2"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-emerald-400 font-mono text-[11px]">$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-workspace-text mt-3 mb-1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-workspace-text mt-4 mb-1.5 border-b border-workspace-border pb-1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-extrabold text-workspace-text mt-4 mb-2 border-b border-workspace-border pb-1">$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-workspace-accent pl-3 my-2 text-workspace-muted italic">$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-workspace-text">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-workspace-accent underline hover:text-workspace-accentHover">$1</a>');

  // Unordered Lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-workspace-text">$1</li>');

  // Paragraph line breaks
  html = html.replace(/\n\n/g, '<div class="h-2"></div>');

  return html;
}

function updateMarkdownView(toolId) {
  const input = document.getElementById(`${toolId}_input`);
  const preview = document.getElementById(`${toolId}_preview`);
  if (!input || !preview) return;
  preview.innerHTML = parseMarkdownToHtml(input.value) || '<span class="text-workspace-muted italic text-[11px]">Formatted preview will appear here...</span>';
}

function copyMarkdownHtml(toolId) {
  const preview = document.getElementById(`${toolId}_preview`);
  if (!preview) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(preview.innerHTML);
    if (typeof showToast !== 'undefined') showToast('Rendered HTML copied!');
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['markdown-preview'] = Object.assign(window.TOOLS_REGISTRY['markdown-preview'] || {}, {
  id: 'markdown-preview',
  name: 'Markdown Live Editor & HTML Preview',
  category: 'Text',
  standaloneUrl: '/markdown-preview.html',
  description: 'Write, preview, and convert GitHub-flavored Markdown into clean HTML with live dual-view rendering.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[180px]">
        <textarea id="${toolId}_input" class="w-full h-full min-h-[160px] bg-workspace-bg border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder="# Project Title&#10;&#10;Write **bold text**, \`inline code\`, or lists:&#10;- Feature 1&#10;- Feature 2&#10;&#10;> Blockquote note"></textarea>
        <div id="${toolId}_preview" class="w-full h-full min-h-[160px] bg-workspace-surface/50 border border-workspace-border rounded-lg p-2.5 overflow-y-auto leading-relaxed select-text">
          <span class="text-workspace-muted italic text-[11px]">Formatted preview will appear here...</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span class="text-workspace-muted text-[10px]">Live HTML Generator</span>
        <div class="flex items-center gap-1.5">
          <button onclick="copyMarkdownHtml('${toolId}')" class="px-2.5 py-1 bg-workspace-accent/15 border border-workspace-accent/40 text-workspace-accent hover:bg-workspace-accent hover:text-black rounded-lg transition-all font-semibold">Copy HTML</button>
          <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Copy MD</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    if (input) {
      input.addEventListener('input', () => updateMarkdownView(toolId));
      if (!input.value) {
        input.value = `# Welcome to TabKit Markdown\n\nA **fast**, 100% offline editor.\n\n- Write GitHub flavored lists\n- Add \`code snippets\`\n- Export clean HTML\n\n> Zero cloud uploads.`;
        updateMarkdownView(toolId);
      }
    }
  }
});
