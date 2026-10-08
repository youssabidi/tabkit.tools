class TabkitFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="h-12 border-t border-workspace-border bg-workspace-surface/90 px-4 flex items-center justify-between text-xs font-mono text-workspace-muted">
        <div>&copy; TabKit Tools &bull; Local-first privacy workbench.</div>
        <div class="flex items-center gap-3">
          <a href="/" class="hover:text-workspace-accent transition-colors">Workbench Dashboard</a>
          <span>&bull;</span>
          <a href="/about.html" class="hover:text-workspace-accent transition-colors">About</a>
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
        </div>
        <div class="flex items-center gap-3 font-mono text-xs">
          <a href="/" class="px-3 py-1 rounded-lg bg-workspace-accent/10 border border-workspace-accent/30 text-workspace-accent hover:bg-workspace-accent/20 transition-all font-semibold flex items-center gap-1.5">
            <span>&larr; Open Full Workbench</span>
          </a>
        </div>
      </header>
    `;
  }
}

customElements.define('tabkit-footer', TabkitFooter);
customElements.define('tool-header', ToolHeader);
