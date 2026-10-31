class TabkitFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tabkit-ad-slot max-w-4xl mx-auto px-4 py-6 w-full text-center">
        <div class="text-[10px] uppercase font-mono tracking-wider text-workspace-muted mb-1.5 opacity-60">Advertisement</div>
        <div class="min-h-[90px] sm:min-h-[100px] flex items-center justify-center rounded-xl border border-workspace-border/60 bg-workspace-surface/40 overflow-hidden">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6634555517108396"
               data-ad-slot="default"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
      <footer class="border-t border-workspace-border bg-workspace-surface/90 px-4 py-4 md:py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-workspace-muted">
        <div>&copy; 2026 TabKit Tools &bull; 100% Client-side local privacy workbench.</div>
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
  }
}

class ToolHeader extends HTMLElement {
  connectedCallback() {
    const toolName = this.getAttribute('tool-name') || 'Tool';
    
    this.innerHTML = `
      <header class="h-12 border-b border-workspace-border bg-workspace-surface/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-3">
          <a href="/" class="flex items-center gap-2 group">
            <svg class="w-5 h-5 text-workspace-accent transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span class="font-bold tracking-tight text-workspace-text text-sm">tabkit<span class="text-workspace-accent font-mono font-medium">.tools</span></span>
          </a>
          <span class="text-workspace-muted text-xs hidden sm:inline">/</span>
          <span class="text-xs font-mono text-workspace-muted hidden sm:inline">${toolName}</span>
          <span class="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>100% Client-Side Private</span>
        </div>
        <div class="flex items-center gap-3 font-mono text-xs">
          <nav class="hidden md:flex items-center gap-3 text-workspace-muted text-[11px] pe-2">
            <a href="/guide" class="hover:text-workspace-text transition-colors">Guide</a>
            <a href="/about" class="hover:text-workspace-text transition-colors">About</a>
            <a href="/privacy" class="hover:text-workspace-text transition-colors">Privacy</a>
            <a href="/faq" class="hover:text-workspace-text transition-colors">FAQ</a>
            <a href="/contact" class="hover:text-workspace-text transition-colors">Contact</a>
          </nav>
          <button onclick="toggleTheme()" class="px-2 py-1 rounded-lg hover:bg-workspace-accent/10 text-workspace-muted hover:text-workspace-accent transition-all" title="Toggle Theme">
            <svg class="w-4 h-4 theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <a href="/" class="px-3 py-1 rounded-lg bg-workspace-accent/10 border border-workspace-accent/30 text-workspace-accent hover:bg-workspace-accent/20 transition-all font-semibold flex items-center gap-1.5">
            <span>&larr; Open Full Workbench</span>
          </a>
        </div>
      </header>
    `;
    if (typeof updateThemeUI === 'function') {
      updateThemeUI();
    }
  }
}

customElements.define('tabkit-footer', TabkitFooter);
customElements.define('tool-header', ToolHeader);
