// Tool: password-strength (Client-Side Cryptographic Password Strength & Entropy Meter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['password-strength'] = Object.assign(window.TOOLS_REGISTRY['password-strength'] || {}, {
  id: 'password-strength',
  name: 'Password Strength & Entropy Meter',
  category: 'Privacy & Security',
  standaloneUrl: '/password-strength',
  description: 'Evaluate cryptographic password strength, entropy bits, and brute force crack duration locally.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-4 font-sans text-xs">
      <!-- Input Section -->
      <div class="space-y-2">
        <label class="text-workspace-muted text-[11px] font-mono flex items-center justify-between">
          <span>Enter or Paste Password to Audit:</span>
          <span class="text-emerald-400 flex items-center gap-1 text-[10px]">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Processed 100% In Browser Memory
          </span>
        </label>
        <div class="relative flex items-center">
          <input type="password" id="${toolId}_input" placeholder="Type or paste password..." class="w-full bg-workspace-bg border border-workspace-border rounded-xl px-3.5 py-3 font-mono text-sm text-workspace-text focus:outline-none focus:border-workspace-accent pr-24" autocomplete="off" spellcheck="false" />
          <div class="absolute right-2.5 flex items-center gap-1">
            <button id="${toolId}_toggleVis" class="p-1.5 rounded hover:bg-workspace-surface text-workspace-muted hover:text-workspace-text" title="Toggle Visibility">
              <svg id="${toolId}_eyeIcon" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button id="${toolId}_genSample" class="text-[10px] font-mono px-2 py-1 rounded bg-workspace-surface border border-workspace-border text-workspace-accent hover:bg-workspace-border" title="Generate Sample Password">Sample</button>
          </div>
        </div>

        <!-- Dynamic Strength Bar -->
        <div class="space-y-1 pt-1">
          <div class="h-2 w-full bg-workspace-bg rounded-full overflow-hidden border border-workspace-border/50">
            <div id="${toolId}_bar" class="h-full w-0 transition-all duration-300 bg-rose-500"></div>
          </div>
          <div class="flex items-center justify-between font-mono text-[10px]">
            <span id="${toolId}_scoreLabel" class="font-bold text-rose-400">Empty</span>
            <span id="${toolId}_entropyBits" class="text-workspace-muted">0 bits of entropy</span>
          </div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Metric 1: Character Pool -->
        <div class="bg-workspace-bg p-3 rounded-xl border border-workspace-border space-y-1">
          <span class="text-workspace-muted text-[10px] font-mono block">Character Variety:</span>
          <span id="${toolId}_poolText" class="text-xs font-bold text-white font-mono">0 possible chars</span>
          <div class="flex gap-1 pt-1 text-[9px] font-mono" id="${toolId}_poolChips">
            <span id="${toolId}_chipLower" class="px-1.5 py-0.5 rounded bg-workspace-surface text-workspace-muted border border-workspace-border">a-z</span>
            <span id="${toolId}_chipUpper" class="px-1.5 py-0.5 rounded bg-workspace-surface text-workspace-muted border border-workspace-border">A-Z</span>
            <span id="${toolId}_chipNum" class="px-1.5 py-0.5 rounded bg-workspace-surface text-workspace-muted border border-workspace-border">0-9</span>
            <span id="${toolId}_chipSym" class="px-1.5 py-0.5 rounded bg-workspace-surface text-workspace-muted border border-workspace-border">#$&</span>
          </div>
        </div>

        <!-- Metric 2: Online Crack Time -->
        <div class="bg-workspace-bg p-3 rounded-xl border border-workspace-border space-y-1">
          <span class="text-workspace-muted text-[10px] font-mono block">Online Attack (Throttled):</span>
          <span id="${toolId}_onlineTime" class="text-xs font-bold text-emerald-400 font-mono">Instant</span>
          <span class="text-[9px] text-workspace-muted block">at 1,000 attempts / sec</span>
        </div>

        <!-- Metric 3: Offline GPU Crack Time -->
        <div class="bg-workspace-bg p-3 rounded-xl border border-workspace-border space-y-1">
          <span class="text-workspace-muted text-[10px] font-mono block">Offline Hash Attack (Rig):</span>
          <span id="${toolId}_offlineTime" class="text-xs font-bold text-rose-400 font-mono">Instant</span>
          <span class="text-[9px] text-workspace-muted block">at 100 Billion hashes / sec</span>
        </div>
      </div>

      <!-- Checklist & Analysis -->
      <div class="bg-workspace-bg/60 p-3.5 rounded-xl border border-workspace-border space-y-2">
        <h4 class="text-[11px] font-bold text-white font-mono flex items-center justify-between">
          <span>NIST SP 800-63B Compliance Checklist:</span>
          <span id="${toolId}_checklistStatus" class="text-[10px] text-workspace-muted">0 / 4 Met</span>
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
          <div id="${toolId}_checkLen" class="flex items-center gap-1.5 text-workspace-muted">
            <span class="w-3.5 h-3.5 rounded-full border border-workspace-border flex items-center justify-center text-[8px]">&times;</span>
            <span>Length $\ge$ 12 characters</span>
          </div>
          <div id="${toolId}_checkVariety" class="flex items-center gap-1.5 text-workspace-muted">
            <span class="w-3.5 h-3.5 rounded-full border border-workspace-border flex items-center justify-center text-[8px]">&times;</span>
            <span>Mix of Letters &amp; Numbers</span>
          </div>
          <div id="${toolId}_checkSymbols" class="flex items-center gap-1.5 text-workspace-muted">
            <span class="w-3.5 h-3.5 rounded-full border border-workspace-border flex items-center justify-center text-[8px]">&times;</span>
            <span>Contains Symbols or Spaces</span>
          </div>
          <div id="${toolId}_checkPatterns" class="flex items-center gap-1.5 text-workspace-muted">
            <span class="w-3.5 h-3.5 rounded-full border border-workspace-border flex items-center justify-center text-[8px]">&times;</span>
            <span>No Simple Sequences (e.g. 1234, qwerty)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    const toggleVis = document.getElementById(`${toolId}_toggleVis`);
    const genSample = document.getElementById(`${toolId}_genSample`);
    const bar = document.getElementById(`${toolId}_bar`);
    const scoreLabel = document.getElementById(`${toolId}_scoreLabel`);
    const entropyBits = document.getElementById(`${toolId}_entropyBits`);
    const poolText = document.getElementById(`${toolId}_poolText`);
    const chipLower = document.getElementById(`${toolId}_chipLower`);
    const chipUpper = document.getElementById(`${toolId}_chipUpper`);
    const chipNum = document.getElementById(`${toolId}_chipNum`);
    const chipSym = document.getElementById(`${toolId}_chipSym`);
    const onlineTime = document.getElementById(`${toolId}_onlineTime`);
    const offlineTime = document.getElementById(`${toolId}_offlineTime`);
    const checklistStatus = document.getElementById(`${toolId}_checklistStatus`);
    const checkLen = document.getElementById(`${toolId}_checkLen`);
    const checkVariety = document.getElementById(`${toolId}_checkVariety`);
    const checkSymbols = document.getElementById(`${toolId}_checkSymbols`);
    const checkPatterns = document.getElementById(`${toolId}_checkPatterns`);

    let isVisible = false;
    toggleVis.addEventListener('click', () => {
      isVisible = !isVisible;
      input.type = isVisible ? 'text' : 'password';
    });

    genSample.addEventListener('click', () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
      let res = '';
      const arr = new Uint32Array(16);
      window.crypto.getRandomValues(arr);
      for (let i = 0; i < 16; i++) {
        res += chars[arr[i] % chars.length];
      }
      input.value = res;
      auditPassword();
    });

    input.addEventListener('input', auditPassword);

    function auditPassword() {
      const pwd = input.value;
      if (!pwd) {
        bar.style.width = '0%';
        scoreLabel.textContent = 'Empty';
        scoreLabel.className = 'font-bold text-rose-400';
        entropyBits.textContent = '0 bits of entropy';
        poolText.textContent = '0 possible chars';
        onlineTime.textContent = 'Instant';
        offlineTime.textContent = 'Instant';
        checklistStatus.textContent = '0 / 4 Met';
        resetChips();
        resetChecklist();
        return;
      }

      let pool = 0;
      const hasLower = /[a-z]/.test(pwd);
      const hasUpper = /[A-Z]/.test(pwd);
      const hasNum = /[0-9]/.test(pwd);
      const hasSym = /[^a-zA-Z0-9]/.test(pwd);

      if (hasLower) pool += 26;
      if (hasUpper) pool += 26;
      if (hasNum) pool += 10;
      if (hasSym) pool += 33;

      updateChip(chipLower, hasLower);
      updateChip(chipUpper, hasUpper);
      updateChip(chipNum, hasNum);
      updateChip(chipSym, hasSym);
      poolText.textContent = `${pool} character pool`;

      // Shannon entropy bits = L * log2(pool)
      const rawEntropy = pool > 0 ? pwd.length * (Math.log(pool) / Math.LN2) : 0;
      const entropy = Math.round(rawEntropy);
      entropyBits.textContent = `${entropy} bits of entropy`;

      // Crack time calculations
      // Total combinations = pool ^ length
      // At 100 Billion (1e11) hashes/sec for offline
      // At 1,000 / sec for online
      const log10Combos = pool > 0 ? pwd.length * Math.log10(pool) : 0;

      offlineTime.textContent = formatCrackTime(log10Combos - 11);
      onlineTime.textContent = formatCrackTime(log10Combos - 3);

      // Score evaluation
      let scorePercent = Math.min(100, Math.round((entropy / 85) * 100));
      bar.style.width = `${scorePercent}%`;

      if (entropy < 35) {
        bar.className = 'h-full transition-all duration-300 bg-rose-500';
        scoreLabel.textContent = 'Very Weak';
        scoreLabel.className = 'font-bold text-rose-500';
      } else if (entropy < 55) {
        bar.className = 'h-full transition-all duration-300 bg-amber-500';
        scoreLabel.textContent = 'Moderate';
        scoreLabel.className = 'font-bold text-amber-500';
      } else if (entropy < 75) {
        bar.className = 'h-full transition-all duration-300 bg-indigo-400';
        scoreLabel.textContent = 'Strong';
        scoreLabel.className = 'font-bold text-indigo-400';
      } else {
        bar.className = 'h-full transition-all duration-300 bg-emerald-400';
        scoreLabel.textContent = 'Military Grade (80+ bits)';
        scoreLabel.className = 'font-bold text-emerald-400';
      }

      // Checklist
      const lenPass = pwd.length >= 12;
      const varPass = (hasLower || hasUpper) && hasNum;
      const symPass = hasSym;
      const seqPattern = /(1234|abcd|qwerty|password|admin)/i.test(pwd);
      const patPass = !seqPattern;

      updateChecklistItem(checkLen, lenPass);
      updateChecklistItem(checkVariety, varPass);
      updateChecklistItem(checkSymbols, symPass);
      updateChecklistItem(checkPatterns, patPass);

      const passedCount = [lenPass, varPass, symPass, patPass].filter(Boolean).length;
      checklistStatus.textContent = `${passedCount} / 4 Met`;
    }

    function updateChip(el, active) {
      if (active) {
        el.className = 'px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold';
      } else {
        el.className = 'px-1.5 py-0.5 rounded bg-workspace-surface text-workspace-muted border border-workspace-border';
      }
    }

    function resetChips() {
      [chipLower, chipUpper, chipNum, chipSym].forEach(c => updateChip(c, false));
    }

    function updateChecklistItem(el, pass) {
      const icon = el.querySelector('span:first-child');
      if (pass) {
        el.className = 'flex items-center gap-1.5 text-emerald-400';
        icon.className = 'w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[9px] text-emerald-400';
        icon.innerHTML = '&#10003;';
      } else {
        el.className = 'flex items-center gap-1.5 text-workspace-muted';
        icon.className = 'w-3.5 h-3.5 rounded-full border border-workspace-border flex items-center justify-center text-[8px]';
        icon.innerHTML = '&times;';
      }
    }

    function resetChecklist() {
      [checkLen, checkVariety, checkSymbols, checkPatterns].forEach(el => updateChecklistItem(el, false));
    }

    function formatCrackTime(log10Seconds) {
      if (log10Seconds <= 0) return 'Instant (< 1 sec)';
      if (log10Seconds < 1.78) return Math.round(Math.pow(10, log10Seconds)) + ' seconds';
      if (log10Seconds < 3.55) return Math.round(Math.pow(10, log10Seconds) / 60) + ' minutes';
      if (log10Seconds < 4.93) return Math.round(Math.pow(10, log10Seconds) / 3600) + ' hours';
      if (log10Seconds < 7.50) return Math.round(Math.pow(10, log10Seconds) / 86400) + ' days';
      if (log10Seconds < 9.50) return Math.round(Math.pow(10, log10Seconds) / 31536000) + ' years';
      if (log10Seconds < 12.0) return Math.round(Math.pow(10, log10Seconds) / 3.1536e7) + ' centuries';
      return 'Trillions of Years';
    }
  }
});
