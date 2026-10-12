// Tool: pdf-password-protect (Client-Side PDF Password Protect & Encrypt)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['pdf-password-protect'] = Object.assign(window.TOOLS_REGISTRY['pdf-password-protect'] || {}, {
  id: 'pdf-password-protect',
  name: 'Client-Side PDF Password Protect',
  category: 'Documents & PDF',
  standaloneUrl: '/pdf-password-protect.html',
  description: 'Encrypt and lock sensitive PDF documents with custom passwords locally in your browser with zero uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-3 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[240px]">Click or Drop PDF to Password Protect</span>
        <span class="text-[9px] text-workspace-muted">0% Cloud Upload • Client-Side Encryption</span>
      </div>

      <!-- Password Settings -->
      <div class="space-y-3 bg-workspace-bg/60 p-3 rounded-xl border border-workspace-border">
        <div>
          <label class="text-workspace-muted text-[10px] font-mono block mb-1">Set Document Password (Required to Open):</label>
          <div class="relative">
            <input id="${toolId}_passwordInput" type="password" placeholder="Enter secure password..." class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none pr-16" />
            <button id="${toolId}_btnTogglePass" type="button" class="absolute right-2 top-1.5 text-[10px] font-mono text-workspace-muted hover:text-workspace-text">Show</button>
          </div>
        </div>

        <div>
          <label class="text-workspace-muted text-[10px] font-mono block mb-1">Confirm Password:</label>
          <input id="${toolId}_confirmPasswordInput" type="password" placeholder="Re-enter password..." class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-workspace-text focus:border-workspace-accent focus:outline-none" />
        </div>

        <div class="text-[10px] font-mono text-workspace-muted flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <span>Encrypted with standard PDF Security</span>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">Select a PDF document</span>
        <button id="${toolId}_btnLock" disabled class="px-3 py-1.5 rounded-lg bg-workspace-accent text-workspace-bg font-bold hover:brightness-110 disabled:opacity-40 transition-all shadow-sm">Lock & Download PDF</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const passwordInput = document.getElementById(`${toolId}_passwordInput`);
    const confirmPasswordInput = document.getElementById(`${toolId}_confirmPasswordInput`);
    const btnTogglePass = document.getElementById(`${toolId}_btnTogglePass`);
    const btnLock = document.getElementById(`${toolId}_btnLock`);
    const status = document.getElementById(`${toolId}_status`);

    let currentFile = null;
    let originalBaseName = 'protected';

    function ensurePdfLib() {
      return new Promise((resolve, reject) => {
        function loadEncrypt() {
          if (window.PDFEncrypt) return resolve();
          const scrEnc = document.createElement('script');
          scrEnc.src = 'pdf-encrypt.min.js';
          scrEnc.onload = () => resolve();
          scrEnc.onerror = () => reject(new Error('Failed to load PDF Encryption engine.'));
          document.head.appendChild(scrEnc);
        }

        if (window.PDFLib) {
          loadEncrypt();
          return;
        }
        const script = document.createElement('script');
        script.src = 'pdf-lib.min.js';
        script.onload = () => loadEncrypt();
        script.onerror = () => reject(new Error('Failed to load PDF-Lib.'));
        document.head.appendChild(script);
      });
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
      currentFile = file;
      fileName.textContent = file.name;
      originalBaseName = file.name.replace(/\.[^/.]+$/, "");
      status.textContent = 'PDF loaded. Enter password to protect.';
      validateForm();
    }

    btnTogglePass.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      confirmPasswordInput.type = isPass ? 'text' : 'password';
      btnTogglePass.textContent = isPass ? 'Hide' : 'Show';
    });

    function validateForm() {
      const pass = passwordInput.value;
      const conf = confirmPasswordInput.value;
      const isValid = currentFile && pass && pass === conf;
      btnLock.disabled = !isValid;
    }

    passwordInput.addEventListener('input', validateForm);
    confirmPasswordInput.addEventListener('input', validateForm);

    btnLock.addEventListener('click', async () => {
      const pass = passwordInput.value;
      const conf = confirmPasswordInput.value;
      if (!pass) {
        alert('Please enter a password.');
        return;
      }
      if (pass !== conf) {
        alert('Passwords do not match.');
        return;
      }

      status.textContent = 'Encrypting PDF...';
      try {
        await ensurePdfLib();
        const arrayBuffer = await currentFile.arrayBuffer();
        
        // 1. Standardize and serialize PDF document
        const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
        const rawBytes = await pdfDoc.save();

        // 2. Genuine client-side PDF encryption with standard /Encrypt dictionary
        const encryptedBytes = await window.PDFEncrypt.encryptPDF(rawBytes, pass, {
          ownerPassword: pass + '_owner'
        });

        const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalBaseName}_locked.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        status.textContent = 'Protected PDF downloaded successfully!';
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
      }
    });
  }
});
