const fs = require('fs');

console.log('Refining Amazon Partner Cards to use <p class="text-sm font-bold text-white"> (preserving strict H1->H2 hierarchy)...\n');

// 1. secure-password-generator.html
let pwHtml = fs.readFileSync('secure-password-generator.html', 'utf8');
pwHtml = pwHtml.replace(
  /<aside aria-label="Recommended Hardware Security Companion"[\s\S]*?<\/aside>/i,
  `<!-- Recommended Hardware Security Companion -->
    <aside aria-label="Recommended Hardware Security Companion" class="spotlight-card card-specular p-5 sm:p-6 rounded-2xl bg-workspace-surface/80 border border-workspace-border hover:border-emerald-500/50 transition-all max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider">Hardware Security Companion</span>
        </div>
        <p class="text-sm font-bold text-white">Yubico YubiKey 5C NFC (FIDO Certified)</p>
        <p class="text-xs text-workspace-muted max-w-md">Pair cryptographic passwords with phishing-resistant hardware 2FA and passkeys over USB-C or NFC.</p>
      </div>
      <a href="https://link.amazon/B0inHT0lN" target="_blank" rel="sponsored nofollow" class="btn-tactile shrink-0 px-4 py-2.5 rounded-xl bg-workspace-accent hover:bg-workspace-accentHover text-black text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
        <span>View on Amazon</span>
        <span>&rarr;</span>
      </a>
    </aside>`
);
fs.writeFileSync('secure-password-generator.html', pwHtml);

// 2. password-strength.html
let pwStrHtml = fs.readFileSync('password-strength.html', 'utf8');
pwStrHtml = pwStrHtml.replace(
  /<aside aria-label="Recommended Hardware Security Companion"[\s\S]*?<\/aside>/i,
  `<!-- Recommended Hardware Security Companion -->
    <aside aria-label="Recommended Hardware Security Companion" class="spotlight-card card-specular p-5 sm:p-6 rounded-2xl bg-workspace-surface/80 border border-workspace-border hover:border-emerald-500/50 transition-all max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider">Hardware Security Companion</span>
        </div>
        <p class="text-sm font-bold text-white">Yubico YubiKey 5C NFC (FIDO Certified)</p>
        <p class="text-xs text-workspace-muted max-w-md">Pair cryptographic passwords with phishing-resistant hardware 2FA and passkeys over USB-C or NFC.</p>
      </div>
      <a href="https://link.amazon/B0inHT0lN" target="_blank" rel="sponsored nofollow" class="btn-tactile shrink-0 px-4 py-2.5 rounded-xl bg-workspace-accent hover:bg-workspace-accentHover text-black text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
        <span>View on Amazon</span>
        <span>&rarr;</span>
      </a>
    </aside>`
);
fs.writeFileSync('password-strength.html', pwStrHtml);

// 3. excel-shortcuts.html
let excelHtml = fs.readFileSync('excel-shortcuts.html', 'utf8');
excelHtml = excelHtml.replace(
  /<aside aria-label="Recommended Spreadsheet Hardware Companion"[\s\S]*?<\/aside>/i,
  `<!-- Recommended Spreadsheet Hardware Companion -->
    <aside aria-label="Recommended Spreadsheet Hardware Companion" class="spotlight-card card-specular p-5 sm:p-6 rounded-2xl bg-workspace-surface/80 border border-workspace-border hover:border-cyan-500/50 transition-all max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold tracking-wider">Spreadsheet Ergonomics</span>
        </div>
        <p class="text-sm font-bold text-white">Logitech MX Master 3S Wireless Mouse</p>
        <p class="text-xs text-workspace-muted max-w-md">Features a dedicated thumb horizontal scroll wheel designed for navigating wide multi-column spreadsheets and quiet clicks.</p>
      </div>
      <a href="https://link.amazon/B0i6SAtdd" target="_blank" rel="sponsored nofollow" class="btn-tactile shrink-0 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
        <span>View on Amazon</span>
        <span>&rarr;</span>
      </a>
    </aside>`
);
fs.writeFileSync('excel-shortcuts.html', excelHtml);

// 4. bank-statement-to-excel.html
let bankHtml = fs.readFileSync('bank-statement-to-excel.html', 'utf8');
bankHtml = bankHtml.replace(
  /<aside aria-label="Recommended Digitization Hardware Companion"[\s\S]*?<\/aside>/i,
  `<!-- Recommended Digitization Hardware Companion -->
    <aside aria-label="Recommended Digitization Hardware Companion" class="spotlight-card card-specular p-5 sm:p-6 rounded-2xl bg-workspace-surface/80 border border-workspace-border hover:border-amber-500/50 transition-all max-w-2xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-2">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold tracking-wider">Fast Document Digitizer</span>
        </div>
        <p class="text-sm font-bold text-white">ScanSnap High-Speed Document Scanner</p>
        <p class="text-xs text-workspace-muted max-w-md">100-page automatic feeder for scanning stacks of paper bank statements, receipts, and invoices directly into clean PDFs.</p>
      </div>
      <a href="https://link.amazon/B00cgBBMj" target="_blank" rel="sponsored nofollow" class="btn-tactile shrink-0 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
        <span>View on Amazon</span>
        <span>&rarr;</span>
      </a>
    </aside>`
);
fs.writeFileSync('bank-statement-to-excel.html', bankHtml);

console.log('✓ Replaced headings with semantic <p> tags.');
