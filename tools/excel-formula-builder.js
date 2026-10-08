// Tool: excel-formula-builder
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['excel-formula-builder'] = Object.assign(window.TOOLS_REGISTRY['excel-formula-builder'] || {}, {
    id: 'excel-formula-builder',
    name: 'Excel Formula Builder Cheat Sheet',
    category: 'Data',
    standaloneUrl: '/excel-formula-builder.html',
    description: 'Massive offline registry of Excel/Sheets formulas with a fill-in-the-blanks builder.',
    render: (toolId) => `
      <div class="flex flex-col h-[480px] font-sans relative overflow-hidden">
        <div id="${toolId}_view_list" class="flex flex-col h-full space-y-3 transition-transform duration-300">
          <input id="${toolId}_search" type="text" placeholder="Search 90+ formulas (e.g. VLOOKUP, PMT)..." class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none" />
          <div id="${toolId}_categories" class="flex flex-wrap gap-1"></div>
          <div id="${toolId}_list" class="flex-1 overflow-y-auto space-y-1.5 pr-1"></div>
        </div>

        <div id="${toolId}_view_builder" class="absolute inset-0 flex flex-col h-full bg-workspace-surface translate-x-full transition-transform duration-300 z-10">
          <div class="flex items-center gap-2 mb-3 pb-2 border-b border-workspace-border">
            <button id="${toolId}_btn_back" class="text-workspace-muted hover:text-workspace-text p-1 bg-workspace-bg rounded border border-workspace-border transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="flex-1">
              <h4 id="${toolId}_bld_title" class="font-bold text-workspace-accent text-sm font-mono leading-none"></h4>
              <p id="${toolId}_bld_desc" class="text-[10px] text-workspace-muted leading-tight mt-1"></p>
            </div>
          </div>
          <div id="${toolId}_bld_inputs" class="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs"></div>
          <div class="mt-3 pt-3 border-t border-workspace-border">
            <div class="text-[10px] font-mono text-workspace-muted mb-1">Generated Formula</div>
            <div class="relative">
              <textarea id="${toolId}_bld_output" readonly class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-2.5 pr-12 text-sm font-mono text-workspace-text focus:outline-none resize-none h-16 leading-tight"></textarea>
              <button id="${toolId}_btn_copy" class="absolute right-1.5 top-1.5 px-2 py-1 bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-[10px] font-mono text-workspace-text rounded transition-all">Copy</button>
            </div>
          </div>
        </div>
      </div>
    `,
    init: (toolId) => {
      const viewList = document.getElementById(`${toolId}_view_list`);
      const viewBld = document.getElementById(`${toolId}_view_builder`);
      const searchInput = document.getElementById(`${toolId}_search`);
      const catsContainer = document.getElementById(`${toolId}_categories`);
      const listContainer = document.getElementById(`${toolId}_list`);
      const bldTitle = document.getElementById(`${toolId}_bld_title`);
      const bldDesc = document.getElementById(`${toolId}_bld_desc`);
      const bldInputs = document.getElementById(`${toolId}_bld_inputs`);
      const bldOutput = document.getElementById(`${toolId}_bld_output`);
      const btnBack = document.getElementById(`${toolId}_btn_back`);
      const btnCopy = document.getElementById(`${toolId}_btn_copy`);

      let activeCat = 'All';
      let activeFormula = null;

      const EXCEL_FORMULAS = [
        { id: 'xlookup', name: 'XLOOKUP', cat: 'Lookups', desc: 'Modern search. Find a value and return a match from another array.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr1', label: 'Lookup Array', pl: 'Sheet2!A:A' }, { id: 'arr2', label: 'Return Array', pl: 'Sheet2!C:C' }, { id: 'err', label: 'If not found (opt)', pl: '"Not Found"' }], gen: (v) => `=XLOOKUP(${v.val || 'A2'}, ${v.arr1 || 'Sheet2!A:A'}, ${v.arr2 || 'Sheet2!C:C'}, ${v.err || '""'})` },
        { id: 'vlookup', name: 'VLOOKUP', cat: 'Lookups', desc: 'Classic vertical lookup.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Table Array', pl: 'Sheet2!A:D' }, { id: 'col', label: 'Column Index Number', pl: '2' }, { id: 'exact', label: 'Exact Match?', pl: 'FALSE' }], gen: (v) => `=VLOOKUP(${v.val || 'A2'}, ${v.arr || 'Sheet2!A:D'}, ${v.col || '2'}, ${v.exact || 'FALSE'})` },
        { id: 'hlookup', name: 'HLOOKUP', cat: 'Lookups', desc: 'Classic horizontal lookup.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Table Array', pl: 'Sheet2!A1:Z5' }, { id: 'row', label: 'Row Index Number', pl: '2' }, { id: 'exact', label: 'Exact Match?', pl: 'FALSE' }], gen: (v) => `=HLOOKUP(${v.val || 'A2'}, ${v.arr || 'Sheet2!A1:Z5'}, ${v.row || '2'}, ${v.exact || 'FALSE'})` },
        { id: 'index', name: 'INDEX', cat: 'Lookups', desc: 'Returns the value in a specific row/col.', inputs: [{ id: 'arr', label: 'Array / Range', pl: 'A1:C10' }, { id: 'row', label: 'Row Number', pl: '2' }, { id: 'col', label: 'Column Number (opt)', pl: '3' }], gen: (v) => `=INDEX(${v.arr || 'A1:C10'}, ${v.row || '2'}${v.col ? `, ${v.col}` : ''})` },
        { id: 'match', name: 'MATCH', cat: 'Lookups', desc: 'Returns the position of an item in a range.', inputs: [{ id: 'val', label: 'Lookup Value', pl: 'A2' }, { id: 'arr', label: 'Lookup Array', pl: 'B:B' }, { id: 'type', label: 'Match Type (0=Exact)', pl: '0' }], gen: (v) => `=MATCH(${v.val || 'A2'}, ${v.arr || 'B:B'}, ${v.type || '0'})` },
        { id: 'indirect', name: 'INDIRECT', cat: 'Lookups', desc: 'Converts a text string into a valid cell reference.', inputs: [{ id: 'text', label: 'Text String / Cell ref', pl: '"A1"' }], gen: (v) => `=INDIRECT(${v.text || '"A1"'})` },
        { id: 'offset', name: 'OFFSET', cat: 'Lookups', desc: 'Returns a reference offset from a starting cell.', inputs: [{ id: 'ref', label: 'Starting Reference', pl: 'A1' }, { id: 'rows', label: 'Rows to offset', pl: '1' }, { id: 'cols', label: 'Cols to offset', pl: '1' }], gen: (v) => `=OFFSET(${v.ref || 'A1'}, ${v.rows || '1'}, ${v.cols || '1'})` },
        { id: 'filter', name: 'FILTER', cat: 'Arrays', desc: 'Filters a range of data based on criteria.', inputs: [{ id: 'arr', label: 'Array to filter', pl: 'A2:C10' }, { id: 'inc', label: 'Include condition', pl: 'B2:B10="Yes"' }, { id: 'emp', label: 'If Empty (opt)', pl: '"None"' }], gen: (v) => `=FILTER(${v.arr || 'A2:C10'}, ${v.inc || 'B2:B10="Yes"'}, ${v.emp || '""'})` },
        { id: 'sort', name: 'SORT', cat: 'Arrays', desc: 'Sorts the contents of a range or array.', inputs: [{ id: 'arr', label: 'Array', pl: 'A2:C10' }, { id: 'idx', label: 'Sort Index (col number)', pl: '1' }, { id: 'ord', label: 'Order (1=Asc, -1=Desc)', pl: '1' }], gen: (v) => `=SORT(${v.arr || 'A2:C10'}, ${v.idx || '1'}, ${v.ord || '1'})` },
        { id: 'unique', name: 'UNIQUE', cat: 'Arrays', desc: 'Returns a list of unique values in a list.', inputs: [{ id: 'arr', label: 'Array', pl: 'A2:A20' }], gen: (v) => `=UNIQUE(${v.arr || 'A2:A20'})` },
        { id: 'sum', name: 'SUM', cat: 'Math', desc: 'Adds all numbers in a range.', inputs: [{ id: 'r1', label: 'Range 1', pl: 'A1:A10' }, { id: 'r2', label: 'Range 2 (opt)', pl: 'B1:B10' }], gen: (v) => `=SUM(${v.r1 || 'A1:A10'}${v.r2 ? `, ${v.r2}` : ''})` },
        { id: 'sumif', name: 'SUMIF', cat: 'Math', desc: 'Sums numbers based on one condition.', inputs: [{ id: 'range', label: 'Range to check', pl: 'A:A' }, { id: 'crit', label: 'Condition', pl: '">100"' }, { id: 'sumr', label: 'Sum Range (opt)', pl: 'B:B' }], gen: (v) => `=SUMIF(${v.range || 'A:A'}, ${v.crit || '">100"'}${v.sumr ? `, ${v.sumr}` : ''})` },
        { id: 'sumifs', name: 'SUMIFS', cat: 'Math', desc: 'Sums numbers based on multiple conditions.', inputs: [{ id: 'sumr', label: 'Range to Sum', pl: 'C:C' }, { id: 'cr1', label: 'Criteria Range 1', pl: 'A:A' }, { id: 'c1', label: 'Condition 1', pl: '"Done"' }], gen: (v) => `=SUMIFS(${v.sumr || 'C:C'}, ${v.cr1 || 'A:A'}, ${v.c1 || '"Done"'})` },
        { id: 'count', name: 'COUNT', cat: 'Stats', desc: 'Counts how many cells contain numbers.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }], gen: (v) => `=COUNT(${v.r || 'A:A'})` },
        { id: 'counta', name: 'COUNTA', cat: 'Stats', desc: 'Counts how many cells are not empty.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }], gen: (v) => `=COUNTA(${v.r || 'A:A'})` },
        { id: 'countif', name: 'COUNTIF', cat: 'Stats', desc: 'Counts cells based on one condition.', inputs: [{ id: 'r', label: 'Range', pl: 'A:A' }, { id: 'c', label: 'Condition', pl: '"*Urgent*"' }], gen: (v) => `=COUNTIF(${v.r || 'A:A'}, ${v.c || '"*Urgent*"'})` },
        { id: 'countifs', name: 'COUNTIFS', cat: 'Stats', desc: 'Counts cells based on multiple conditions.', inputs: [{ id: 'r1', label: 'Criteria Range 1', pl: 'A:A' }, { id: 'c1', label: 'Condition 1', pl: '"Done"' }], gen: (v) => `=COUNTIFS(${v.r1 || 'A:A'}, ${v.c1 || '"Done"'})` },
        { id: 'average', name: 'AVERAGE', cat: 'Stats', desc: 'Calculates the average of numbers.', inputs: [{ id: 'r', label: 'Range', pl: 'B:B' }], gen: (v) => `=AVERAGE(${v.r || 'B:B'})` },
        { id: 'averageif', name: 'AVERAGEIF', cat: 'Stats', desc: 'Average based on a condition.', inputs: [{ id: 'r', label: 'Range to check', pl: 'A:A' }, { id: 'c', label: 'Condition', pl: '"Done"' }, { id: 'ar', label: 'Average Range (opt)', pl: 'B:B' }], gen: (v) => `=AVERAGEIF(${v.r || 'A:A'}, ${v.c || '"Done"'}${v.ar ? `, ${v.ar}` : ''})` },
        { id: 'textjoin', name: 'TEXTJOIN', cat: 'Text', desc: 'Combines text from multiple ranges with a delimiter.', inputs: [{ id: 'del', label: 'Delimiter', pl: '", "' }, { id: 'ign', label: 'Ignore Empty?', pl: 'TRUE' }, { id: 'r', label: 'Text/Range', pl: 'A1:A5' }], gen: (v) => `=TEXTJOIN(${v.del || '", "'}, ${v.ign || 'TRUE'}, ${v.r || 'A1:A5'})` },
        { id: 'concat', name: 'CONCAT', cat: 'Text', desc: 'Joins several text items into one.', inputs: [{ id: 't1', label: 'Text 1', pl: 'A2' }, { id: 't2', label: 'Text 2', pl: 'B2' }], gen: (v) => `=CONCAT(${v.t1 || 'A2'}, ${v.t2 || 'B2'})` },
        { id: 'left', name: 'LEFT', cat: 'Text', desc: 'Extracts chars from the left side.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 'n', label: 'Number of chars', pl: '5' }], gen: (v) => `=LEFT(${v.t || 'A2'}, ${v.n || '5'})` },
        { id: 'right', name: 'RIGHT', cat: 'Text', desc: 'Extracts chars from the right side.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 'n', label: 'Number of chars', pl: '3' }], gen: (v) => `=RIGHT(${v.t || 'A2'}, ${v.n || '3'})` },
        { id: 'mid', name: 'MID', cat: 'Text', desc: 'Extracts chars from the middle.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }, { id: 's', label: 'Start position', pl: '2' }, { id: 'n', label: 'Number of chars', pl: '4' }], gen: (v) => `=MID(${v.t || 'A2'}, ${v.s || '2'}, ${v.n || '4'})` },
        { id: 'trim', name: 'TRIM', cat: 'Text', desc: 'Removes extra spaces from text.', inputs: [{ id: 't', label: 'Text/Cell', pl: 'A2' }], gen: (v) => `=TRIM(${v.t || 'A2'})` },
        { id: 'if', name: 'IF', cat: 'Logic', desc: 'Checks a condition, returns one value if true, another if false.', inputs: [{ id: 'l', label: 'Logical Test', pl: 'A2>100' }, { id: 't', label: 'If True', pl: '"High"' }, { id: 'f', label: 'If False', pl: '"Low"' }], gen: (v) => `=IF(${v.l || 'A2>100'}, ${v.t || '"High"'}, ${v.f || '"Low"'})` },
        { id: 'iferror', name: 'IFERROR', cat: 'Logic', desc: 'Returns fallback if a formula throws an error.', inputs: [{ id: 'v', label: 'Value / Formula', pl: 'A2/B2' }, { id: 'e', label: 'If Error', pl: '0' }], gen: (v) => `=IFERROR(${v.v || 'A2/B2'}, ${v.e || '0'})` },
        { id: 'datedif', name: 'DATEDIF', cat: 'Date', desc: 'Days, months, or years between two dates.', inputs: [{ id: 's', label: 'Start Date', pl: 'A2' }, { id: 'e', label: 'End Date', pl: 'B2' }, { id: 'u', label: 'Unit ("Y", "M", "D")', pl: '"D"' }], gen: (v) => `=DATEDIF(${v.s || 'A2'}, ${v.e || 'B2'}, ${v.u || '"D"'})` },
        { id: 'networkdays', name: 'NETWORKDAYS', cat: 'Date', desc: 'Number of whole working days between dates.', inputs: [{ id: 's', label: 'Start Date', pl: 'A2' }, { id: 'e', label: 'End Date', pl: 'B2' }, { id: 'h', label: 'Holidays (opt)', pl: 'H1:H10' }], gen: (v) => `=NETWORKDAYS(${v.s || 'A2'}, ${v.e || 'B2'}${v.h ? `, ${v.h}` : ''})` }
      ];

      const categories = ['All', ...new Set(EXCEL_FORMULAS.map(f => f.cat))];
      if (catsContainer) {
        catsContainer.innerHTML = categories.map(c => 
          `<button data-cat="${c}" class="px-2 py-0.5 rounded text-[10px] font-mono border ${c === 'All' ? 'bg-workspace-surface border-workspace-border text-workspace-accent' : 'bg-workspace-bg border-transparent text-workspace-muted hover:text-workspace-text'} transition-colors">${c}</button>`
        ).join('');

        catsContainer.querySelectorAll('button').forEach(btn => {
          btn.onclick = () => {
            catsContainer.querySelectorAll('button').forEach(b => {
              b.className = `px-2 py-0.5 rounded text-[10px] font-mono border ${b.dataset.cat === btn.dataset.cat ? 'bg-workspace-surface border-workspace-border text-workspace-accent' : 'bg-workspace-bg border-transparent text-workspace-muted hover:text-workspace-text'} transition-colors`;
            });
            activeCat = btn.dataset.cat;
            renderList();
          };
        });
      }

      function renderList() {
        if (!searchInput || !listContainer) return;
        const q = searchInput.value.toLowerCase().trim();
        const filtered = EXCEL_FORMULAS.filter(f => {
          const matchCat = activeCat === 'All' || f.cat === activeCat;
          const matchQ = f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
          return matchCat && matchQ;
        });

        if (!filtered.length) {
          listContainer.innerHTML = `<div class="text-xs font-mono text-workspace-muted p-2">No formulas found.</div>`;
          return;
        }

        listContainer.innerHTML = filtered.map(f => `
          <button data-fid="${f.id}" class="w-full text-left p-2 rounded-lg bg-workspace-surface border border-workspace-border hover:border-workspace-accent/50 group transition-all">
            <div class="flex items-center justify-between">
              <span class="font-bold text-workspace-text group-hover:text-workspace-accent font-mono text-xs">${f.name}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-workspace-bg text-workspace-muted">${f.cat}</span>
            </div>
            <div class="text-[10px] text-workspace-muted mt-1 leading-tight line-clamp-1">${f.desc}</div>
          </button>
        `).join('');

        listContainer.querySelectorAll('button[data-fid]').forEach(btn => {
          btn.onclick = () => openBuilder(btn.dataset.fid);
        });
      }

      function openBuilder(fid) {
        activeFormula = EXCEL_FORMULAS.find(f => f.id === fid);
        if (!activeFormula) return;
        if (bldTitle) bldTitle.textContent = activeFormula.name;
        if (bldDesc) bldDesc.textContent = activeFormula.desc;

        if (bldInputs) {
          if (activeFormula.inputs.length === 0) {
            bldInputs.innerHTML = `<div class="text-[10px] text-workspace-muted font-mono italic p-2">No arguments required for this formula.</div>`;
          } else {
            bldInputs.innerHTML = activeFormula.inputs.map(inp => `
              <div>
                <label class="block text-[10px] font-mono text-workspace-muted mb-0.5">${inp.label}</label>
                <input id="${toolId}_inp_${inp.id}" type="text" placeholder="e.g. ${inp.pl}" class="w-full bg-workspace-bg border border-workspace-border rounded p-1.5 text-workspace-text focus:border-workspace-accent focus:outline-none font-mono" />
              </div>
            `).join('');

            activeFormula.inputs.forEach(inp => {
              const inputEl = document.getElementById(`${toolId}_inp_${inp.id}`);
              if (inputEl) inputEl.addEventListener('input', updateOutput);
            });
          }
        }

        updateOutput();
        if (viewList) viewList.classList.add('-translate-x-full');
        if (viewBld) viewBld.classList.remove('translate-x-full');
      }

      function updateOutput() {
        if (!activeFormula || !bldOutput) return;
        const vals = {};
        activeFormula.inputs.forEach(inp => {
          const el = document.getElementById(`${toolId}_inp_${inp.id}`);
          vals[inp.id] = el ? el.value.trim() : '';
        });
        bldOutput.value = activeFormula.gen(vals);
      }

      if (btnBack) {
        btnBack.onclick = () => {
          if (viewList) viewList.classList.remove('-translate-x-full');
          if (viewBld) viewBld.classList.add('translate-x-full');
          activeFormula = null;
        };
      }

      if (btnCopy) {
        btnCopy.onclick = () => {
          if (bldOutput && bldOutput.value) {
            navigator.clipboard.writeText(bldOutput.value);
            showToast('Formula copied to clipboard!');
          }
        };
      }

      if (searchInput) searchInput.addEventListener('input', renderList);
      renderList();
    }
  });
