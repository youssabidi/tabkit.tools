// Tool: excel-shortcuts (Interactive Excel & Sheets Shortcuts & Modern Formula Studio)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-shortcuts'] = Object.assign(window.TOOLS_REGISTRY['excel-shortcuts'] || {}, {
  id: 'excel-shortcuts',
  name: 'Excel & Google Sheets Shortcuts Studio',
  category: 'Productivity & Math',
  standaloneUrl: '/excel-shortcuts',
  description: 'Interactive keyboard shortcuts reference and modern formula playground for Microsoft Excel and Google Sheets with Windows and Mac support.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-4 font-sans text-xs">
      <!-- Search & OS Switcher Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border border-workspace-border bg-workspace-bg">
        <!-- Search Input -->
        <div class="relative w-full sm:w-2/3">
          <input type="text" id="${toolId}_searchInput" placeholder="Search shortcuts or actions (e.g., flash fill, freeze, xlookup, filter)..." class="w-full bg-workspace-surface border border-workspace-border rounded-lg pl-8 pr-3 py-2 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden font-mono" />
          <svg class="w-4 h-4 text-workspace-muted absolute left-2.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- OS Toggle (Windows vs Mac) -->
        <div class="flex items-center gap-1.5 p-1 rounded-lg border border-workspace-border bg-workspace-surface shrink-0 font-mono text-xs">
          <button id="${toolId}_btnWin" class="px-3 py-1 rounded-md bg-workspace-accent text-black font-bold transition-all flex items-center gap-1">
            <span>Windows / PC</span>
          </button>
          <button id="${toolId}_btnMac" class="px-3 py-1 rounded-md text-workspace-muted hover:text-workspace-text transition-all flex items-center gap-1">
            <span>macOS ⌘</span>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div id="${toolId}_categoryFilters" class="flex flex-wrap gap-1.5 font-mono text-[11px]">
        <button data-cat="all" class="px-2.5 py-1 rounded-lg border border-workspace-accent/60 bg-workspace-accent/10 text-workspace-accent font-bold cat-pill transition-all">All Shortcuts</button>
        <button data-cat="nav" class="px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:border-workspace-accent text-workspace-muted hover:text-workspace-text cat-pill transition-all">Navigation & Selection</button>
        <button data-cat="formatting" class="px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:border-workspace-accent text-workspace-muted hover:text-workspace-text cat-pill transition-all">Formatting & Data Entry</button>
        <button data-cat="formulas" class="px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:border-workspace-accent text-workspace-muted hover:text-workspace-text cat-pill transition-all">Formulas & Calculating</button>
        <button data-cat="rows" class="px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:border-workspace-accent text-workspace-muted hover:text-workspace-text cat-pill transition-all">Rows, Columns & Cells</button>
      </div>

      <!-- Shortcuts Grid -->
      <div class="border border-workspace-border rounded-xl bg-workspace-bg overflow-hidden flex flex-col min-h-[260px] max-h-[380px]">
        <div class="p-2 border-b border-workspace-border flex items-center justify-between bg-workspace-surface/50 text-[11px]">
          <span class="font-bold text-workspace-text">Keyboard Shortcut Cheatsheet</span>
          <span id="${toolId}_matchCount" class="text-workspace-muted font-mono text-[10px]">Showing 25 shortcuts</span>
        </div>
        <div class="flex-1 overflow-auto p-2">
          <div id="${toolId}_shortcutsList" class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>

      <!-- Interactive Modern Formula Playground -->
      <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/60 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-white text-xs flex items-center gap-1.5">
            <span class="text-workspace-accent font-mono">⚡</span> Live Modern Formula Sandbox
          </h3>
          <select id="${toolId}_formulaSelector" class="bg-workspace-bg border border-workspace-border rounded-lg px-2 py-1 text-workspace-text text-xs font-mono">
            <option value="xlookup">XLOOKUP (Modern VLOOKUP replacement)</option>
            <option value="indexmatch">INDEX / MATCH (Two-way matrix lookup)</option>
            <option value="textsplit">TEXTSPLIT (Split text by delimiter)</option>
            <option value="sumifs">SUMIFS (Multi-condition sum)</option>
          </select>
        </div>
        <div id="${toolId}_formulaBox" class="p-3 rounded-lg border border-workspace-border bg-workspace-bg font-mono text-xs space-y-2">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const searchInput = document.getElementById(`${toolId}_searchInput`);
    const btnWin = document.getElementById(`${toolId}_btnWin`);
    const btnMac = document.getElementById(`${toolId}_btnMac`);
    const categoryFilters = document.getElementById(`${toolId}_categoryFilters`);
    const shortcutsList = document.getElementById(`${toolId}_shortcutsList`);
    const matchCount = document.getElementById(`${toolId}_matchCount`);
    const formulaSelector = document.getElementById(`${toolId}_formulaSelector`);
    const formulaBox = document.getElementById(`${toolId}_formulaBox`);

    let currentOs = 'win';
    let currentCat = 'all';

    const SHORTCUTS = [
      // Navigation
      { cat: 'nav', action: 'Move to edge of current data region', win: 'Ctrl + Arrow Key', mac: 'Cmd + Arrow Key' },
      { cat: 'nav', action: 'Select all cells to the edge of data', win: 'Ctrl + Shift + Arrow Key', mac: 'Cmd + Shift + Arrow Key' },
      { cat: 'nav', action: 'Move to beginning of worksheet (A1)', win: 'Ctrl + Home', mac: 'Cmd + Fn + Left Arrow' },
      { cat: 'nav', action: 'Move to last used cell on worksheet', win: 'Ctrl + End', mac: 'Cmd + Fn + Right Arrow' },
      { cat: 'nav', action: 'Switch to next worksheet tab', win: 'Ctrl + Page Down', mac: 'Option + Right Arrow' },
      { cat: 'nav', action: 'Switch to previous worksheet tab', win: 'Ctrl + Page Up', mac: 'Option + Left Arrow' },

      // Formatting & Data Entry
      { cat: 'formatting', action: 'Flash Fill (Auto-detect pattern & fill)', win: 'Ctrl + E', mac: 'Ctrl + E' },
      { cat: 'formatting', action: 'Format cells as Currency ($#,##0.00)', win: 'Ctrl + Shift + $', mac: 'Ctrl + Shift + $' },
      { cat: 'formatting', action: 'Format cells as Percentage (0%)', win: 'Ctrl + Shift + %', mac: 'Ctrl + Shift + %' },
      { cat: 'formatting', action: 'Format cells as Date (DD-MMM-YY)', win: 'Ctrl + Shift + #', mac: 'Ctrl + Shift + #' },
      { cat: 'formatting', action: 'Open Format Cells dialog box', win: 'Ctrl + 1', mac: 'Cmd + 1' },
      { cat: 'formatting', action: 'Insert Current Date', win: 'Ctrl + ;', mac: 'Cmd + ;' },
      { cat: 'formatting', action: 'Insert Current Time', win: 'Ctrl + Shift + :', mac: 'Cmd + Shift + :' },
      { cat: 'formatting', action: 'Fill Down (Duplicate value from above)', win: 'Ctrl + D', mac: 'Ctrl + D' },
      { cat: 'formatting', action: 'Fill Right (Duplicate value from left)', win: 'Ctrl + R', mac: 'Ctrl + R' },

      // Formulas
      { cat: 'formulas', action: 'AutoSum selected range', win: 'Alt + =', mac: 'Cmd + Shift + T' },
      { cat: 'formulas', action: 'Toggle Absolute / Relative references ($A$1)', win: 'F4', mac: 'Cmd + T' },
      { cat: 'formulas', action: 'Insert Function arguments dialog', win: 'Shift + F3', mac: 'Shift + F3' },
      { cat: 'formulas', action: 'Show / Hide all formulas on sheet', win: 'Ctrl + `', mac: 'Ctrl + `' },
      { cat: 'formulas', action: 'Calculate all worksheets immediately', win: 'F9', mac: 'F9' },

      // Rows & Columns
      { cat: 'rows', action: 'Select entire row', win: 'Shift + Spacebar', mac: 'Shift + Spacebar' },
      { cat: 'rows', action: 'Select entire column', win: 'Ctrl + Spacebar', mac: 'Ctrl + Spacebar' },
      { cat: 'rows', action: 'Insert new row / column', win: 'Ctrl + Shift + +', mac: 'Cmd + Shift + +' },
      { cat: 'rows', action: 'Delete selected row / column', win: 'Ctrl + -', mac: 'Cmd + -' },
      { cat: 'rows', action: 'Hide selected column(s)', win: 'Ctrl + 0', mac: 'Ctrl + 0' },
      { cat: 'rows', action: 'Hide selected row(s)', win: 'Ctrl + 9', mac: 'Ctrl + 9' },
      { cat: 'rows', action: 'Toggle AutoFilter on/off', win: 'Ctrl + Shift + L', mac: 'Cmd + Shift + F' }
    ];

    const FORMULAS = {
      xlookup: {
        title: 'XLOOKUP (Modern, safe alternative to VLOOKUP)',
        syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])',
        example: '=XLOOKUP("INV-102", A2:A100, C2:C100, "Not Found")',
        why: 'Unlike VLOOKUP, XLOOKUP searches both left and right, defaults to exact match without breaking when columns are inserted, and handles missing values cleanly.'
      },
      indexmatch: {
        title: 'INDEX + MATCH (High-performance two-way matrix search)',
        syntax: '=INDEX(return_range, MATCH(lookup_val, lookup_range, 0))',
        example: '=INDEX(D2:D50, MATCH("Widget Pro", B2:B50, 0))',
        why: 'Compatible with all legacy versions of Excel and Google Sheets. Does not slow down huge workbooks with tens of thousands of rows.'
      },
      textsplit: {
        title: 'TEXTSPLIT (Split text by delimiter dynamically)',
        syntax: '=TEXTSPLIT(text, col_delimiter, [row_delimiter])',
        example: '=TEXTSPLIT("Jane;Doe;Engineering", ";")',
        why: 'Instantly splits a comma-separated or delimited cell into multiple columns across the sheet without requiring the "Text to Columns" wizard.'
      },
      sumifs: {
        title: 'SUMIFS (Conditional sum with multiple criteria)',
        syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)',
        example: '=SUMIFS(D2:D100, A2:A100, "Q1", B2:B100, "Enterprise")',
        why: 'Sums numerical values matching multiple simultaneous conditions (e.g., Year 2026 AND Department "Engineering").'
      }
    };

    function renderShortcuts() {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = SHORTCUTS.filter(s => {
        const matchesCat = currentCat === 'all' || s.cat === currentCat;
        const matchesQuery = !q || s.action.toLowerCase().includes(q) || s[currentOs].toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      });

      matchCount.textContent = `Showing ${filtered.length} of ${SHORTCUTS.length} shortcuts`;
      shortcutsList.innerHTML = '';

      if (filtered.length === 0) {
        shortcutsList.innerHTML = `<div class="col-span-2 py-6 text-center text-workspace-muted font-mono">No matching shortcuts found. Try searching "filter", "date", or "format".</div>`;
        return;
      }

      filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'p-2.5 rounded-xl border border-workspace-border bg-workspace-surface/50 hover:border-workspace-accent/40 transition-all flex items-center justify-between gap-2';
        const keyParts = item[currentOs].split('+').map(k => k.trim());
        const keyBadges = keyParts.map(k => `<kbd class="px-2 py-1 rounded bg-workspace-bg border border-workspace-border text-workspace-accent font-bold font-mono text-[10px] shadow-xs">${k}</kbd>`).join('<span class="text-workspace-muted text-[10px]">+</span>');

        div.innerHTML = `
          <div class="text-xs text-workspace-text leading-snug">${item.action}</div>
          <div class="flex items-center gap-1 shrink-0">${keyBadges}</div>
        `;
        shortcutsList.appendChild(div);
      });
    }

    function renderFormula() {
      const f = FORMULAS[formulaSelector.value];
      if (!f) return;
      formulaBox.innerHTML = `
        <div class="text-workspace-accent font-bold">${f.title}</div>
        <div class="p-2 rounded bg-workspace-surface border border-workspace-border text-[11px] text-white">
          <span class="text-workspace-muted select-none">Syntax: </span>${f.syntax}
        </div>
        <div class="p-2 rounded bg-workspace-surface border border-workspace-border text-[11px] text-emerald-400">
          <span class="text-workspace-muted select-none">Example: </span>${f.example}
        </div>
        <p class="text-[11px] text-workspace-muted leading-relaxed font-sans">${f.why}</p>
      `;
    }

    btnWin.addEventListener('click', () => {
      currentOs = 'win';
      btnWin.className = 'px-3 py-1 rounded-md bg-workspace-accent text-black font-bold transition-all flex items-center gap-1';
      btnMac.className = 'px-3 py-1 rounded-md text-workspace-muted hover:text-workspace-text transition-all flex items-center gap-1';
      renderShortcuts();
    });

    btnMac.addEventListener('click', () => {
      currentOs = 'mac';
      btnMac.className = 'px-3 py-1 rounded-md bg-workspace-accent text-black font-bold transition-all flex items-center gap-1';
      btnWin.className = 'px-3 py-1 rounded-md text-workspace-muted hover:text-workspace-text transition-all flex items-center gap-1';
      renderShortcuts();
    });

    categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-pill');
      if (!btn) return;
      currentCat = btn.dataset.cat;
      categoryFilters.querySelectorAll('.cat-pill').forEach(b => {
        b.className = 'px-2.5 py-1 rounded-lg border border-workspace-border bg-workspace-surface hover:border-workspace-accent text-workspace-muted hover:text-workspace-text cat-pill transition-all';
      });
      btn.className = 'px-2.5 py-1 rounded-lg border border-workspace-accent/60 bg-workspace-accent/10 text-workspace-accent font-bold cat-pill transition-all';
      renderShortcuts();
    });

    searchInput.addEventListener('input', renderShortcuts);
    formulaSelector.addEventListener('change', renderFormula);

    renderShortcuts();
    renderFormula();
  }
});
