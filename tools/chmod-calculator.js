// Tool: chmod-calculator
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['chmod-calculator'] = Object.assign(window.TOOLS_REGISTRY['chmod-calculator'] || {}, {
  id: 'chmod-calculator',
  name: 'Visual chmod Permissions Calculator',
  category: 'Developer & Code',
  description: 'Interactive visual permission calculator for Linux/Unix file permissions with octal and symbolic modes.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <div class="flex items-center justify-between gap-2">
        <select id="${toolId}_presets" class="flex-1 bg-workspace-bg border border-workspace-border rounded-lg p-1.5 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none">
          <option value="">Quick Presets...</option>
          <option value="755">755 - Standard Script / Executable</option>
          <option value="644">644 - Standard Read/Write File</option>
          <option value="700">700 - Private User Executable</option>
          <option value="600">600 - Private Secret / SSH Key</option>
          <option value="777">777 - Full Access (All)</option>
        </select>
        <div class="flex items-center gap-1.5 bg-workspace-bg border border-workspace-border px-2 py-1 rounded-lg">
          <span class="text-workspace-muted font-mono text-[10px]">Octal:</span>
          <input id="${toolId}_octal" type="text" maxlength="3" value="755" class="w-10 bg-transparent text-center font-mono font-bold text-workspace-accent focus:outline-none" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border text-center">
        <!-- Owner -->
        <div class="space-y-1.5">
          <div class="text-[10px] font-bold uppercase tracking-wider text-workspace-text font-mono">Owner</div>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_u_r" checked class="accent-[#10B981] rounded" /> Read (4)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_u_w" checked class="accent-[#10B981] rounded" /> Write (2)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_u_x" checked class="accent-[#10B981] rounded" /> Exec (1)
          </label>
        </div>

        <!-- Group -->
        <div class="space-y-1.5 border-x border-workspace-border/60 px-1">
          <div class="text-[10px] font-bold uppercase tracking-wider text-workspace-text font-mono">Group</div>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_g_r" checked class="accent-[#10B981] rounded" /> Read (4)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_g_w" class="accent-[#10B981] rounded" /> Write (2)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_g_x" checked class="accent-[#10B981] rounded" /> Exec (1)
          </label>
        </div>

        <!-- Others -->
        <div class="space-y-1.5">
          <div class="text-[10px] font-bold uppercase tracking-wider text-workspace-text font-mono">Others</div>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_o_r" checked class="accent-[#10B981] rounded" /> Read (4)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_o_w" class="accent-[#10B981] rounded" /> Write (2)
          </label>
          <label class="flex items-center justify-center gap-1 text-[11px] text-workspace-muted cursor-pointer hover:text-white">
            <input type="checkbox" id="${toolId}_o_x" checked class="accent-[#10B981] rounded" /> Exec (1)
          </label>
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-[10px] font-mono text-workspace-muted">
          <span>Symbolic: <strong id="${toolId}_symbolic" class="text-workspace-text">-rwxr-xr-x</strong></span>
          <span>Linux Command</span>
        </div>
        <div class="flex items-center gap-2">
          <input id="${toolId}_cmd" type="text" readonly value="chmod 755 filename.sh" class="flex-1 bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-workspace-accent focus:outline-none" />
          <button id="${toolId}_btnCopy" class="px-3 py-1.5 bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-xs font-mono text-workspace-text rounded-lg transition-colors">Copy</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const octalInput = document.getElementById(`${toolId}_octal`);
    const presets = document.getElementById(`${toolId}_presets`);
    const symbolic = document.getElementById(`${toolId}_symbolic`);
    const cmd = document.getElementById(`${toolId}_cmd`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);

    const boxes = {
      ur: document.getElementById(`${toolId}_u_r`),
      uw: document.getElementById(`${toolId}_u_w`),
      ux: document.getElementById(`${toolId}_u_x`),
      gr: document.getElementById(`${toolId}_g_r`),
      gw: document.getElementById(`${toolId}_g_w`),
      gx: document.getElementById(`${toolId}_g_x`),
      or: document.getElementById(`${toolId}_o_r`),
      ow: document.getElementById(`${toolId}_o_w`),
      ox: document.getElementById(`${toolId}_o_x`)
    };

    function updateFromCheckboxes() {
      const u = (boxes.ur.checked ? 4 : 0) + (boxes.uw.checked ? 2 : 0) + (boxes.ux.checked ? 1 : 0);
      const g = (boxes.gr.checked ? 4 : 0) + (boxes.gw.checked ? 2 : 0) + (boxes.gx.checked ? 1 : 0);
      const o = (boxes.or.checked ? 4 : 0) + (boxes.ow.checked ? 2 : 0) + (boxes.ox.checked ? 1 : 0);
      const oct = `${u}${g}${o}`;
      
      octalInput.value = oct;
      symbolic.textContent = '-' + 
        (boxes.ur.checked ? 'r' : '-') + (boxes.uw.checked ? 'w' : '-') + (boxes.ux.checked ? 'x' : '-') +
        (boxes.gr.checked ? 'r' : '-') + (boxes.gw.checked ? 'w' : '-') + (boxes.gx.checked ? 'x' : '-') +
        (boxes.or.checked ? 'r' : '-') + (boxes.ow.checked ? 'w' : '-') + (boxes.ox.checked ? 'x' : '-');
      cmd.value = `chmod ${oct} filename.sh`;
    }

    function applyOctal(val) {
      if (!/^[0-7]{3}$/.test(val)) return;
      const digits = val.split('').map(Number);
      boxes.ur.checked = (digits[0] & 4) !== 0;
      boxes.uw.checked = (digits[0] & 2) !== 0;
      boxes.ux.checked = (digits[0] & 1) !== 0;
      boxes.gr.checked = (digits[1] & 4) !== 0;
      boxes.gw.checked = (digits[1] & 2) !== 0;
      boxes.gx.checked = (digits[1] & 1) !== 0;
      boxes.or.checked = (digits[2] & 4) !== 0;
      boxes.ow.checked = (digits[2] & 2) !== 0;
      boxes.ox.checked = (digits[2] & 1) !== 0;
      updateFromCheckboxes();
    }

    Object.values(boxes).forEach(b => {
      if (b) b.addEventListener('change', updateFromCheckboxes);
    });

    if (octalInput) {
      octalInput.addEventListener('input', (e) => applyOctal(e.target.value.trim()));
    }

    if (presets) {
      presets.addEventListener('change', (e) => {
        if (e.target.value) applyOctal(e.target.value);
      });
    }

    if (btnCopy) {
      btnCopy.onclick = () => {
        if (cmd) {
          navigator.clipboard.writeText(cmd.value);
          if (typeof showToast !== 'undefined') showToast('Copied chmod command!');
        }
      };
    }

    updateFromCheckboxes();
  }
});
