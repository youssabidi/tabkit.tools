// Tool: social-seo-previewer
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['social-seo-previewer'] = Object.assign(window.TOOLS_REGISTRY['social-seo-previewer'] || {}, {
  id: 'social-seo-previewer',
  name: 'Social Media & Google SERP Previewer',
  category: 'Marketing',
  description: 'Simulate how your meta tags, title, and description will look on Google Search, X (Twitter), and LinkedIn.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-[10px] font-mono text-workspace-muted">
          <span>Title (<span id="${toolId}_titleCount">0</span>/60)</span>
          <span id="${toolId}_titleWarn" class="text-workspace-accent font-bold">Good</span>
        </div>
        <input id="${toolId}_inputTitle" type="text" value="TabKit Tools - Fast & Private Local Utilities" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1 text-xs text-workspace-text focus:border-workspace-accent focus:outline-none" />

        <div class="flex justify-between items-center text-[10px] font-mono text-workspace-muted">
          <span>Description (<span id="${toolId}_descCount">0</span>/160)</span>
          <span id="${toolId}_descWarn" class="text-workspace-accent font-bold">Good</span>
        </div>
        <input id="${toolId}_inputDesc" type="text" value="100% in-browser productivity toolkit with zero telemetry. Run QR codes, diff checks, and developer tools completely offline." class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1 text-xs text-workspace-text focus:border-workspace-accent focus:outline-none" />
      </div>

      <!-- Preview Platform Tabs -->
      <div class="flex gap-1 border-b border-workspace-border pb-1" id="${toolId}_tabs">
        <button data-view="google" class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent">Google</button>
        <button data-view="twitter" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">X / Twitter</button>
      </div>

      <!-- Preview Containers -->
      <div class="flex-1 bg-workspace-bg rounded-xl border border-workspace-border p-3 overflow-hidden flex flex-col justify-center">
        <!-- Google SERP -->
        <div id="${toolId}_viewGoogle" class="space-y-1">
          <div class="flex items-center gap-1.5 text-[11px] text-[#202124] dark:text-[#bdc1c6] truncate">
            <span class="w-4 h-4 rounded-full bg-workspace-accent/20 flex items-center justify-center text-[9px] text-workspace-accent font-bold">T</span>
            <span class="text-[11px] text-gray-400">tabkit.tools</span>
          </div>
          <div id="${toolId}_pvGoogleTitle" class="text-[#8ab4f8] text-sm font-medium hover:underline truncate cursor-pointer leading-tight"></div>
          <div id="${toolId}_pvGoogleDesc" class="text-gray-400 text-[11px] line-clamp-2 leading-snug"></div>
        </div>

        <!-- Twitter Card -->
        <div id="${toolId}_viewTwitter" class="hidden rounded-lg border border-workspace-border bg-workspace-surface p-2.5 space-y-1">
          <div class="text-[10px] text-workspace-muted font-mono truncate">tabkit.tools</div>
          <div id="${toolId}_pvTwTitle" class="font-bold text-workspace-text text-xs line-clamp-1"></div>
          <div id="${toolId}_pvTwDesc" class="text-[11px] text-workspace-muted line-clamp-2"></div>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const inputTitle = document.getElementById(`${toolId}_inputTitle`);
    const inputDesc = document.getElementById(`${toolId}_inputDesc`);
    const titleCount = document.getElementById(`${toolId}_titleCount`);
    const descCount = document.getElementById(`${toolId}_descCount`);
    const titleWarn = document.getElementById(`${toolId}_titleWarn`);
    const descWarn = document.getElementById(`${toolId}_descWarn`);

    const pvGoogleTitle = document.getElementById(`${toolId}_pvGoogleTitle`);
    const pvGoogleDesc = document.getElementById(`${toolId}_pvGoogleDesc`);
    const pvTwTitle = document.getElementById(`${toolId}_pvTwTitle`);
    const pvTwDesc = document.getElementById(`${toolId}_pvTwDesc`);

    const viewGoogle = document.getElementById(`${toolId}_viewGoogle`);
    const viewTwitter = document.getElementById(`${toolId}_viewTwitter`);
    const tabs = document.getElementById(`${toolId}_tabs`);

    function update() {
      const t = inputTitle.value || 'Page Title';
      const d = inputDesc.value || 'Page meta description goes here.';

      titleCount.textContent = t.length;
      descCount.textContent = d.length;

      if (t.length > 60) {
        titleWarn.textContent = 'Too Long';
        titleWarn.className = 'text-workspace-danger font-bold';
      } else {
        titleWarn.textContent = 'Good';
        titleWarn.className = 'text-workspace-accent font-bold';
      }

      if (d.length > 160) {
        descWarn.textContent = 'Too Long';
        descWarn.className = 'text-workspace-danger font-bold';
      } else {
        descWarn.textContent = 'Good';
        descWarn.className = 'text-workspace-accent font-bold';
      }

      pvGoogleTitle.textContent = t;
      pvGoogleDesc.textContent = d;
      pvTwTitle.textContent = t;
      pvTwDesc.textContent = d;
    }

    if (inputTitle) inputTitle.addEventListener('input', update);
    if (inputDesc) inputDesc.addEventListener('input', update);

    if (tabs) {
      tabs.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          tabs.querySelectorAll('button').forEach(b => {
            b.className = "px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text";
          });
          btn.className = "px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent";
          const v = btn.dataset.view;
          if (v === 'google') {
            viewGoogle.classList.remove('hidden');
            viewTwitter.classList.add('hidden');
          } else {
            viewGoogle.classList.add('hidden');
            viewTwitter.classList.remove('hidden');
          }
        };
      });
    }

    update();
  }
});
