// TabKit Tools - Shared Web Components & Agency-Grade Navigation
const TABKIT_TOOLS_MAP = {
  "bank-statement-to-excel": {
    "n": "PDF Bank Statement to Excel Converter",
    "c": "Documents & PDF"
  },
  "convert-chase-statement-to-excel": {
    "n": "Convert Chase Statement to Excel",
    "c": "Documents & PDF"
  },
  "convert-bank-of-america-statement-to-excel": {
    "n": "Convert Bank of America Statement to Excel",
    "c": "Documents & PDF"
  },
  "convert-wells-fargo-statement-to-excel": {
    "n": "Convert Wells Fargo Statement to Excel",
    "c": "Documents & PDF"
  },
  "convert-revolut-statement-to-excel": {
    "n": "Convert Revolut Statement to Excel",
    "c": "Documents & PDF"
  },
  "convert-barclays-statement-to-excel": {
    "n": "Convert Barclays Statement to Excel",
    "c": "Documents & PDF"
  },
  "invoice-generator": {
    "n": "Free Invoice Generator & Excel Exporter",
    "c": "Productivity & Math"
  },
  "excel-shortcuts": {
    "n": "Excel & Google Sheets Shortcuts Studio",
    "c": "Productivity & Math"
  },
  "base64-encoder-decoder": {
    "n": "Base64 Encoder / Decoder",
    "c": "Privacy & Security"
  },
  "case-converter": {
    "n": "Case Converter & Word Counter",
    "c": "Text & Data"
  },
  "chmod-calculator": {
    "n": "Visual chmod Permissions Calculator",
    "c": "Developer & Code"
  },
  "curl-converter": {
    "n": "cURL to Fetch / Axios / Python Converter",
    "c": "Developer & Code"
  },
  "css-html-minifier": {
    "n": "CSS & HTML Minifier & Beautifier",
    "c": "Developer & Code"
  },
  "date-calculator": {
    "n": "Days Between Dates Calculator",
    "c": "Productivity & Math"
  },
  "excel-formula-builder": {
    "n": "Excel Formula Builder Cheat Sheet",
    "c": "Text & Data"
  },
  "exif-metadata-stripper": {
    "n": "Photo EXIF & GPS Metadata Stripper",
    "c": "Privacy & Security"
  },
  "favicon-generator": {
    "n": "Favicon & PWA App Icon Generator",
    "c": "Media & Design"
  },
  "color-palette-contrast": {
    "n": "WCAG Color Contrast & Palette Studio",
    "c": "Media & Design"
  },
  "hex-color-converter": {
    "n": "HEX to RGB Color Converter",
    "c": "Media & Design"
  },
  "image-compressor": {
    "n": "Client-Side Image Compressor & WebP",
    "c": "Media & Design"
  },
  "json-formatter": {
    "n": "JSON Formatter & Validator",
    "c": "Text & Data"
  },
  "json-to-typescript": {
    "n": "JSON to TypeScript & Zod Schema",
    "c": "Developer & Code"
  },
  "pdf-splitter": {
    "n": "Client-Side PDF Splitter & Page Remover",
    "c": "Documents & PDF"
  },
  "percentage-calculator": {
    "n": "Online Percentage Calculator",
    "c": "Productivity & Math"
  },
  "pomodoro-timer": {
    "n": "Pomodoro Timer Online",
    "c": "Productivity & Math"
  },
  "qr-code-generator": {
    "n": "Free QR Code Generator",
    "c": "Media & Design"
  },
  "random-name-picker": {
    "n": "Random Name Picker & Wheel",
    "c": "Productivity & Math"
  },
  "secure-password-generator": {
    "n": "Secure Password Generator",
    "c": "Privacy & Security"
  },
  "sha256-hash-generator": {
    "n": "SHA-256 Hash Generator",
    "c": "Privacy & Security"
  },
  "social-seo-previewer": {
    "n": "Social Media & Google SERP Previewer",
    "c": "Media & Design"
  },
  "svg-optimizer": {
    "n": "SVG Optimizer & React / CSS Exporter",
    "c": "Media & Design"
  },
  "text-diff-checker": {
    "n": "Text Diff Checker & Notepad",
    "c": "Text & Data"
  },
  "time-zone-converter": {
    "n": "World Time Zone Converter",
    "c": "Productivity & Math"
  },
  "unit-converter": {
    "n": "Universal Unit Converter",
    "c": "Productivity & Math"
  },
  "unix-timestamp-converter": {
    "n": "Unix Timestamp & Epoch Converter",
    "c": "Developer & Code"
  },
  "url-link-cleaner": {
    "n": "URL Tracking Link Cleaner",
    "c": "Privacy & Security"
  },
  "markdown-preview": {
    "n": "Markdown Live Editor & HTML Preview",
    "c": "Text & Data"
  },
  "csv-json-converter": {
    "n": "CSV ↔ JSON Converter",
    "c": "Text & Data"
  },
  "regex-tester": {
    "n": "Regular Expression (Regex) Live Tester",
    "c": "Developer & Code"
  },
  "jwt-decoder": {
    "n": "JSON Web Token (JWT) Decoder",
    "c": "Developer & Code"
  },
  "image-to-base64": {
    "n": "Image to Base64 (Data URI) Generator",
    "c": "Media & Design"
  },
  "uuid-generator": {
    "n": "Bulk UUID / GUID v4 Generator",
    "c": "Productivity & Math"
  },
  "sql-formatter": {
    "n": "SQL Query Beautifier & Formatter",
    "c": "Developer & Code"
  },
  "pdf-merger": {
    "n": "Client-Side PDF Merger & Combiner",
    "c": "Documents & PDF"
  },
  "pdf-rotator": {
    "n": "Client-Side PDF Page Rotator",
    "c": "Documents & PDF"
  },
  "images-to-pdf": {
    "n": "Client-Side Images to PDF Converter",
    "c": "Documents & PDF"
  },
  "pdf-watermarker": {
    "n": "Client-Side PDF Watermark & Stamp",
    "c": "Documents & PDF"
  },
  "pdf-metadata-editor": {
    "n": "PDF Metadata Inspector & Stripper",
    "c": "Documents & PDF"
  },
  "pdf-page-numberer": {
    "n": "Client-Side PDF Page Numberer",
    "c": "Documents & PDF"
  },
  "excel-to-csv": {
    "n": "Excel to CSV Converter",
    "c": "Text & Data"
  },
  "excel-to-json": {
    "n": "Excel to JSON Converter",
    "c": "Text & Data"
  },
  "excel-deduplicator": {
    "n": "Spreadsheet Row Deduplicator",
    "c": "Text & Data"
  },
  "pdf-text-extractor": {
    "n": "PDF Text & Markdown Extractor",
    "c": "Documents & PDF"
  },
  "csv-to-excel": {
    "n": "CSV to Excel (.xlsx) Converter",
    "c": "Text & Data"
  },
  "json-to-csv": {
    "n": "JSON to CSV & TSV Converter",
    "c": "Text & Data"
  },
  "json-to-excel": {
    "n": "JSON to Excel (.xlsx) Converter",
    "c": "Text & Data"
  },
  "excel-to-markdown": {
    "n": "Excel to Markdown Table Generator",
    "c": "Text & Data"
  },
  "excel-transpose": {
    "n": "Spreadsheet Row & Column Transposer",
    "c": "Text & Data"
  },
  "excel-empty-cleaner": {
    "n": "Empty Rows & Whitespace Stripper",
    "c": "Text & Data"
  },
  "pdf-to-images": {
    "n": "Client-Side PDF to Images (PNG/JPG)",
    "c": "Documents & PDF"
  },
  "pdf-password-protect": {
    "n": "Client-Side PDF Password Protect",
    "c": "Documents & PDF"
  },
  "pdf-sign-stamp": {
    "n": "Client-Side PDF Signature & Stamp",
    "c": "Documents & PDF"
  },
  "svg-to-png": {
    "n": "SVG to PNG & WebP Converter",
    "c": "Media & Design"
  },
  "password-strength": {
    "n": "Password Strength & Entropy Meter",
    "c": "Privacy & Security"
  },
  "cron-expression-generator": {
    "n": "Cron Expression Generator & Explainer",
    "c": "Developer & Code"
  }
};

const CATEGORY_SLUGS_MAP = {
  "Documents & PDF": "documents-pdf",
  "Developer & Code": "developer-code",
  "Privacy & Security": "privacy-security",
  "Text & Data": "text-data",
  "Media & Design": "media-design",
  "Productivity & Math": "productivity-math"
};

function hydrateDeferredLinks(root) {
  if (!root) return;
  root.querySelectorAll('a[data-tk-href]').forEach(a => {
    a.setAttribute('href', a.getAttribute('data-tk-href'));
    a.removeAttribute('data-tk-href');
  });
}

function recordRecentTool(toolId) {
  if (!toolId || !TABKIT_TOOLS_MAP[toolId]) return;
  try {
    let recents = JSON.parse(localStorage.getItem('tabkit_recent_tools') || '[]');
    recents = recents.filter(x => x !== toolId);
    recents.unshift(toolId);
    if (recents.length > 8) recents = recents.slice(0, 8);
    localStorage.setItem('tabkit_recent_tools', JSON.stringify(recents));
  } catch (e) {}
}

function pinCurrentToolToWorkbench(toolId) {
  if (!toolId) return;
  try {
    let pinned = JSON.parse(localStorage.getItem('tabkit_pinned_tools') || '[]');
    if (!pinned.includes(toolId)) {
      pinned.push(toolId);
      localStorage.setItem('tabkit_pinned_tools', JSON.stringify(pinned));
      if (typeof showToast === 'function') {
        showToast('📌 Pinned to your TabKit Workbench!');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('✓ Already pinned in Workbench');
      }
    }
  } catch(e) {}
}

class TabkitFooter extends HTMLElement {
  connectedCallback() {
    const rawPath = window.location.pathname.replace(/^\/|\.html$/g, '');
    const currentId = rawPath === 'random-password-generator' ? 'secure-password-generator' : rawPath;
    const currentTool = TABKIT_TOOLS_MAP[currentId];

    let relatedHtml = '';
    if (currentTool) {
      const sameCategory = Object.keys(TABKIT_TOOLS_MAP).filter(id => id !== currentId && TABKIT_TOOLS_MAP[id].c === currentTool.c);
      const fallbackTools = ['json-formatter', 'bank-statement-to-excel', 'pdf-merger', 'secure-password-generator'];
      const chosenIds = sameCategory.length >= 4 
        ? sameCategory.slice(0, 4) 
        : [...sameCategory, ...fallbackTools.filter(id => id !== currentId && !sameCategory.includes(id))].slice(0, 4);

      const catSlug = CATEGORY_SLUGS_MAP[currentTool.c] || '';

      relatedHtml = `
        <div class="tabkit-related-tools max-w-4xl mx-auto px-4 pt-8 pb-2 w-full text-left">
          <div class="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-workspace-border text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-workspace-accent animate-pulse"></span>
              <span class="font-bold text-workspace-text uppercase tracking-wider text-[11px]">Related Offline Utilities</span>
              <span class="text-[10px] text-workspace-muted hidden sm:inline">(${currentTool.c})</span>
            </div>
            <a data-tk-href="/#${catSlug}" class="text-workspace-muted hover:text-workspace-accent text-[11px] transition-colors flex items-center gap-1 group">
              <span>View category</span>
              <span class="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${chosenIds.map(id => {
              const t = TABKIT_TOOLS_MAP[id];
              return `
                <a data-tk-href="/${id}" class="spotlight-card card-specular p-3.5 rounded-2xl bg-workspace-surface/60 border border-workspace-border hover:border-workspace-accent/50 hover:bg-workspace-surfaceHover transition-all flex flex-col justify-between group shadow-sm">
                  <div class="text-xs font-bold text-workspace-text group-hover:text-workspace-accent transition-colors line-clamp-1">${t.n}</div>
                  <div class="text-[10px] font-mono text-workspace-muted mt-3 flex items-center justify-between">
                    <span class="text-emerald-400/90 font-medium">100% Private</span>
                    <span class="group-hover:translate-x-0.5 transition-transform text-workspace-accent">&rarr;</span>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    this.innerHTML = `
      ${relatedHtml}
      <div class="tabkit-ad-slot max-w-4xl mx-auto px-4 py-6 w-full text-center" style="contain: layout style;">
        <div class="text-[9px] uppercase font-mono tracking-wider text-workspace-muted mb-1 opacity-50">Advertisement</div>
        <div class="min-h-[100px] flex items-center justify-center rounded-2xl border border-workspace-border/60 bg-workspace-surface/40 overflow-hidden">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6634555517108396"
               data-ad-slot="default"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
      <footer class="border-t border-workspace-border bg-workspace-surface/90 backdrop-blur-md px-4 py-4 md:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-workspace-muted relative z-20">
        <div class="flex flex-col sm:flex-row items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>&copy; ${new Date().getFullYear()} TabKit Tools &bull; Local-first browser workbench (${Object.keys(TABKIT_TOOLS_MAP).length} tools).</span>
          </div>
          <span class="hidden sm:inline text-workspace-border">&bull;</span>
          <span class="text-[10px] text-workspace-muted/80">As an Amazon Associate I earn from qualifying purchases.</span>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <a href="/" class="hover:text-workspace-accent transition-colors">Workbench</a>
          <span>&bull;</span>
          <a href="/guide" class="hover:text-workspace-accent transition-colors">Guides</a>
          <span>&bull;</span>
          <a href="/about" class="hover:text-workspace-accent transition-colors">About</a>
          <span>&bull;</span>
          <a href="/faq" class="hover:text-workspace-accent transition-colors">FAQ</a>
          <span>&bull;</span>
          <a href="/contact" class="hover:text-workspace-accent transition-colors">Contact</a>
          <span>&bull;</span>
          <a href="/privacy" class="hover:text-workspace-accent transition-colors">Privacy</a>
          <span>&bull;</span>
          <a href="/terms" class="hover:text-workspace-accent transition-colors">Terms</a>
          <span>&bull;</span>
          <a href="/report-issue" class="text-rose-400 hover:text-rose-300 font-semibold transition-colors">Report Issue</a>
        </div>
      </footer>
    `;
    hydrateDeferredLinks(this);
  }
}

class ToolHeader extends HTMLElement {
  connectedCallback() {
    const toolName = this.getAttribute('tool-name') || 'Tool';
    const rawPath = window.location.pathname.replace(/^\/|\.html$/g, '');
    const currentId = rawPath === 'random-password-generator' ? 'secure-password-generator' : rawPath;
    recordRecentTool(currentId);

    const toolMeta = TABKIT_TOOLS_MAP[currentId];
    const categoryName = toolMeta ? toolMeta.c : 'Tools';
    const categorySlug = CATEGORY_SLUGS_MAP[categoryName] || '';

    this.innerHTML = `
      <header class="h-14 border-b border-workspace-border bg-workspace-surface/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-3">
        <!-- Brand & Breadcrumbs -->
        <div class="flex items-center gap-2.5 sm:gap-3 truncate">
          <a href="/" class="flex items-center gap-2 group shrink-0">
            <div class="w-7 h-7 rounded-lg bg-workspace-accent/10 border border-workspace-accent/25 flex items-center justify-center transition-all group-hover:border-workspace-accent group-hover:bg-workspace-accent/20 btn-tactile">
              <svg class="w-4 h-4 text-workspace-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <span class="font-bold tracking-tight text-workspace-text text-sm">tabkit<span class="text-workspace-accent font-mono font-medium">.tools</span></span>
          </a>

          <span class="text-workspace-borderLight text-xs hidden sm:inline">&bull;</span>

          <nav class="hidden sm:flex items-center gap-1.5 text-xs font-mono text-workspace-muted truncate" aria-label="Breadcrumb">
            ${categorySlug ? `<a data-tk-href="/#${categorySlug}" class="hover:text-workspace-accent transition-colors truncate">${categoryName}</a><span class="text-workspace-borderLight">/</span>` : ''}
            <span class="text-workspace-text font-medium truncate">${toolName}</span>
          </nav>

          <span class="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono shrink-0">
            <span class="relative flex h-1.5 w-1.5">
              <span class="radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span>Zero-Telemetry Sandbox</span>
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-2.5 font-mono text-xs shrink-0">
          ${currentId && TABKIT_TOOLS_MAP[currentId] ? `
            <button onclick="pinCurrentToolToWorkbench('${currentId}')" class="btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-workspace-border hover:border-workspace-accent/60 bg-workspace-bg/80 hover:bg-workspace-surfaceHover text-workspace-text hover:text-workspace-accent transition-all text-xs shadow-xs" title="Pin this tool into your multi-deck workbench">
              <span>⚡</span>
              <span class="hidden md:inline">Pin to Workbench</span>
            </button>
          ` : ''}

          <button onclick="copyCitation('${toolName.replace(/'/g, "\\'")}')" class="btn-tactile hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-workspace-border hover:border-workspace-borderLight bg-workspace-bg/80 text-workspace-muted hover:text-workspace-text transition-all text-xs" title="Copy Markdown citation to clipboard">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            <span class="hidden lg:inline">Cite</span>
          </button>

          <button onclick="toggleTheme()" class="btn-tactile p-2 rounded-xl border border-workspace-border hover:border-workspace-borderLight text-workspace-muted hover:text-workspace-accent transition-all" title="Toggle Theme" aria-label="Toggle visual theme">
            <svg class="w-3.5 h-3.5 theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <a href="/" class="btn-tactile px-3 py-1.5 rounded-xl bg-workspace-accent hover:bg-workspace-accentHover text-black font-semibold transition-all flex items-center gap-1.5 text-xs shadow-sm">
            <span>&larr;</span>
            <span class="hidden xs:inline">Workbench</span>
          </a>
        </div>
      </header>
    `;
    hydrateDeferredLinks(this);
    if (typeof updateThemeUI === 'function') {
      updateThemeUI();
    }
  }
}

function copyCitation(toolName) {
  const name = toolName || document.title.split('|')[0].trim() || 'TabKit Tool';
  const url = window.location.href.split('?')[0].split('#')[0];
  const md = `[${name}](${url}) — Free in-browser developer utility (100% private, client-side).`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(md).then(() => {
      if (typeof showToast === 'function') {
        showToast('📋 Markdown citation copied for README or Docs!');
      } else {
        const fallbackToast = document.createElement('div');
        fallbackToast.className = 'fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg border border-emerald-400';
        fallbackToast.textContent = '📋 Citation copied to clipboard!';
        document.body.appendChild(fallbackToast);
        setTimeout(() => fallbackToast.remove(), 2500);
      }
    }).catch(() => {
      prompt('Copy Markdown link:', md);
    });
  } else {
    prompt('Copy Markdown link:', md);
  }
}

// Global Spotlight Cursor Tracking (Aceternity / Linear pattern)
let _spotlightScheduled = false;
document.addEventListener('mousemove', (e) => {
  if (_spotlightScheduled) return;
  _spotlightScheduled = true;
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.spotlight-card:hover');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    _spotlightScheduled = false;
  });
}, { passive: true });

customElements.define('tabkit-footer', TabkitFooter);
customElements.define('tool-footer', TabkitFooter);
customElements.define('tool-header', ToolHeader);
