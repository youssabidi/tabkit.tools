// Tool: css-html-minifier (Client-Side CSS & HTML Minifier and Beautifier)

function detectCodeType(code) {
  const trimmed = code.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || /<\s*[a-z][a-z0-9]*\b[^>]*>/i.test(trimmed)) {
    return 'html';
  }
  return 'css';
}

function minifyCss(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove space around operators and braces
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    // Normalize zeroes
    .replace(/\b0(px|em|rem|%|in|cm|mm|pt|pc)\b/gi, '0')
    // Remove empty rules
    .replace(/[^{};]+\{\}/g, '')
    .trim();
}

function beautifyCss(css) {
  let clean = css
    .replace(/\/\*[\s\S]*?\*\//g, m => '\n' + m.trim() + '\n')
    .replace(/\s+/g, ' ')
    .replace(/\s*\{\s*/g, ' {\n  ')
    .replace(/\s*;\s*/g, ';\n  ')
    .replace(/\s*\}\s*/g, '\n}\n\n')
    .replace(/\n\s*\n/g, '\n');

  // Fix lines ending with extra spaces or indented closing braces
  return clean
    .split('\n')
    .map(l => l.trimRight())
    .join('\n')
    .replace(/\n\s*;\n/g, ';\n')
    .replace(/\n\s*\}/g, '\n}')
    .trim();
}

function minifyHtml(html) {
  return html
    // Remove standard comments (keep conditional comments)
    .replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '')
    // Collapse whitespace between tags
    .replace(/>\s+</g, '><')
    // Collapse multi-spaces within tags or text
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function beautifyHtml(html) {
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  let formatted = '';
  let indentLevel = 0;
  const indent = '  ';

  // Tokenize tags and text content
  const tokens = html.replace(/>\s*</g, '><').match(/<[^>]+>|[^<]+/g) || [];

  tokens.forEach(token => {
    token = token.trim();
    if (!token) return;

    if (token.startsWith('</')) {
      // Closing tag
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += '\n' + indent.repeat(indentLevel) + token;
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.startsWith('<?')) {
      const tagNameMatch = token.match(/<([a-zA-Z0-9\-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);

      formatted += '\n' + indent.repeat(indentLevel) + token;
      if (!isSelfClosing) {
        indentLevel++;
      }
    } else {
      // Text or comment/doctype
      if (token.startsWith('<!')) {
        formatted += '\n' + token;
      } else {
        formatted += '\n' + indent.repeat(indentLevel) + token;
      }
    }
  });

  return formatted.trim();
}

function processMinifier(toolId, action) {
  const inputEl = document.getElementById(`${toolId}_input`);
  const typeSelect = document.getElementById(`${toolId}_mode`);
  const statsEl = document.getElementById(`${toolId}_stats`);
  if (!inputEl) return;

  const raw = inputEl.value;
  if (!raw.trim()) {
    if (typeof showToast !== 'undefined') showToast('Please enter some HTML or CSS code first', 'error');
    return;
  }

  let selectedMode = typeSelect ? typeSelect.value : 'auto';
  if (selectedMode === 'auto') {
    selectedMode = detectCodeType(raw);
    if (typeSelect) typeSelect.value = selectedMode;
  }

  let result = '';
  const originalBytes = new Blob([raw]).size;

  if (action === 'minify') {
    result = selectedMode === 'html' ? minifyHtml(raw) : minifyCss(raw);
    inputEl.value = result;
    const minifiedBytes = new Blob([result]).size;
    const diff = originalBytes - minifiedBytes;
    const pct = originalBytes > 0 ? ((diff / originalBytes) * 100).toFixed(1) : 0;
    
    if (statsEl) {
      statsEl.innerHTML = `
        <span class="text-workspace-accent font-semibold">${originalBytes.toLocaleString()} B ➔ ${minifiedBytes.toLocaleString()} B</span>
        <span class="text-emerald-400">(-${pct}% / -${diff.toLocaleString()} B)</span>
      `;
    }
    if (typeof showToast !== 'undefined') showToast(`${selectedMode.toUpperCase()} Minified! Saved ${pct}%`);
  } else if (action === 'beautify') {
    result = selectedMode === 'html' ? beautifyHtml(raw) : beautifyCss(raw);
    inputEl.value = result;
    if (statsEl) {
      statsEl.innerHTML = `<span class="text-workspace-muted font-normal">${new Blob([result]).size.toLocaleString()} Bytes formatted</span>`;
    }
    if (typeof showToast !== 'undefined') showToast(`${selectedMode.toUpperCase()} Beautified!`);
  } else if (action === 'comments') {
    result = selectedMode === 'html' ? raw.replace(/<!--[\s\S]*?-->/g, '') : raw.replace(/\/\*[\s\S]*?\*\//g, '');
    inputEl.value = result;
    if (typeof showToast !== 'undefined') showToast('Comments stripped!');
  }
}

function chainMinifierTo(toolId, targetTool) {
  const inputEl = document.getElementById(`${toolId}_input`);
  if (!inputEl || !inputEl.value.trim()) {
    if (typeof showToast !== 'undefined') showToast('No code to transfer', 'error');
    return;
  }
  if (typeof sendToTool === 'function') {
    sendToTool(targetTool, inputEl.value);
  }
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['css-html-minifier'] = Object.assign(window.TOOLS_REGISTRY['css-html-minifier'] || {}, {
  id: 'css-html-minifier',
  name: 'CSS & HTML Minifier & Beautifier',
  category: 'Developer & Code',
  standaloneUrl: '/css-html-minifier',
  description: 'Minify, compress, or beautify CSS styles and HTML markup client-side with real-time compression metrics.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-workspace-border text-[11px] font-mono">
        <div class="flex items-center gap-2">
          <label class="text-workspace-muted">Language:</label>
          <select id="${toolId}_mode" class="bg-workspace-bg border border-workspace-border rounded px-2 py-0.5 text-workspace-text focus:outline-none focus:border-workspace-accent">
            <option value="auto">Auto-Detect</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div id="${toolId}_stats" class="text-[10px] text-workspace-muted font-mono flex items-center gap-1">
          <span>Ready to compress</span>
        </div>
      </div>

      <textarea id="${toolId}_input" class="flex-1 w-full min-h-[180px] bg-workspace-bg border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed select-text" placeholder="/* Paste CSS or HTML markup here */&#10;.header { display: flex; align-items: center; padding: 16px 24px; color: #ffffff; }"></textarea>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-workspace-border text-[11px] font-mono">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button onclick="processMinifier('${toolId}', 'minify')" class="px-3 py-1 bg-workspace-accent text-black font-bold rounded-lg hover:bg-workspace-accentHover transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Minify</button>
          <button onclick="processMinifier('${toolId}', 'beautify')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Beautify</button>
          <button onclick="processMinifier('${toolId}', 'comments')" class="px-2 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-muted hover:text-workspace-text rounded-lg transition-all">Strip Comments</button>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="chainMinifierTo('${toolId}', 'text-diff-checker')" title="Send code to Text Diff" class="px-2 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-accent hover:text-workspace-accent text-workspace-muted rounded-lg transition-all flex items-center gap-1">
            <span>Diff &rarr;</span>
          </button>
          <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Copy</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    const mode = document.getElementById(`${toolId}_mode`);
    if (input && mode) {
      input.addEventListener('input', () => {
        if (mode.value === 'auto' && input.value.trim().length > 5) {
          const detected = detectCodeType(input.value);
          // Don't change dropdown value so user preference is preserved, but we know it's detected
        }
      });
    }
  }
});
