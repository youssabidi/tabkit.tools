// Tool: bank-statement-to-excel (Private In-Browser Bank Statement PDF to Excel & CSV Converter)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['bank-statement-to-excel'] = Object.assign(window.TOOLS_REGISTRY['bank-statement-to-excel'] || {}, {
  id: 'bank-statement-to-excel',
  name: 'PDF Bank Statement to Excel Converter',
  category: 'Documents & PDF',
  standaloneUrl: '/bank-statement-to-excel',
  description: 'Convert PDF bank statements into structured Excel (.xlsx) and CSV spreadsheets locally with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-4 font-sans text-xs">
      <!-- Dropzone -->
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-5 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-2">
        <input type="file" id="${toolId}_fileInput" accept="application/pdf" class="hidden" />
        <svg class="w-8 h-8 text-workspace-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <div class="font-medium text-workspace-text text-sm">Drop your bank statement PDF here, or <span class="text-workspace-accent underline">browse</span></div>
        <p class="text-[11px] text-workspace-muted">Supports Chase, Bank of America, Wells Fargo, PayPal, Barclays, QNB & standard statements</p>
      </div>

      <!-- OCR Toggle Banner -->
      <div class="flex items-center justify-between px-2 py-2 rounded-xl bg-workspace-surface/50 border border-workspace-border text-[11px] font-mono">
        <label class="flex items-center gap-2 cursor-pointer text-workspace-text hover:text-workspace-accent transition-colors">
          <input type="checkbox" id="${toolId}_chkOcr" class="rounded text-workspace-accent focus:ring-0">
          <span class="font-semibold">Auto-Detect Scanned Photocopies (WebAssembly OCR)</span>
        </label>
        <span class="text-[10px] text-emerald-400 font-mono">🔒 100% In-Browser Privacy</span>
      </div>

      <!-- File Details & Parsing Controls -->
      <div id="${toolId}_fileDetails" class="hidden flex items-center justify-between p-3 rounded-xl border border-workspace-border bg-workspace-bg/80">
        <div class="flex items-center space-x-2 truncate">
          <svg class="w-5 h-5 text-workspace-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <div class="truncate">
            <div id="${toolId}_fileName" class="font-bold text-workspace-text truncate">statement.pdf</div>
            <div id="${toolId}_fileInfo" class="text-[10px] text-workspace-muted font-mono">Ready to parse</div>
          </div>
        </div>
        <button id="${toolId}_btnRemove" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded transition-colors font-mono">Remove</button>
      </div>

      <!-- Parsing Status / Progress -->
      <div id="${toolId}_status" class="hidden p-3 rounded-xl border border-workspace-accent/30 bg-workspace-accent/10 text-workspace-accent text-center font-mono">
        <span class="inline-block animate-spin mr-2">⟳</span> Parsing PDF text coordinates and transactions locally...
      </div>

      <!-- Extracted Transactions Summary & Data Grid -->
      <div id="${toolId}_resultsContainer" class="hidden flex-1 flex flex-col space-y-3 min-h-0">
        <!-- Summary Stats -->
        <div class="grid grid-cols-3 gap-2">
          <div class="p-2.5 rounded-xl border border-workspace-border bg-workspace-bg text-center">
            <div class="text-[10px] text-workspace-muted uppercase font-mono">Transactions</div>
            <div id="${toolId}_statCount" class="text-base font-extrabold text-white font-mono">0</div>
          </div>
          <div class="p-2.5 rounded-xl border border-workspace-border bg-workspace-bg text-center">
            <div class="text-[10px] text-workspace-muted uppercase font-mono">Total Debits</div>
            <div id="${toolId}_statDebits" class="text-base font-extrabold text-amber-400 font-mono">$0.00</div>
          </div>
          <div class="p-2.5 rounded-xl border border-workspace-border bg-workspace-bg text-center">
            <div class="text-[10px] text-workspace-muted uppercase font-mono">Total Credits</div>
            <div id="${toolId}_statCredits" class="text-base font-extrabold text-emerald-400 font-mono">$0.00</div>
          </div>
        </div>

        <!-- Scrollable Table Preview -->
        <div class="flex-1 border border-workspace-border rounded-xl bg-workspace-bg overflow-hidden flex flex-col min-h-[220px] max-h-[300px]">
          <div class="p-2 border-b border-workspace-border flex items-center justify-between bg-workspace-surface/50 text-[11px]">
            <span class="font-bold text-workspace-text">Extracted Transactions Preview</span>
            <span class="text-workspace-muted font-mono text-[10px]">Showing parsed rows</span>
          </div>
          <div class="flex-1 overflow-auto">
            <table class="w-full text-left border-collapse text-[11px]">
              <thead class="sticky top-0 bg-workspace-surface text-workspace-muted font-mono border-b border-workspace-border text-[10px] uppercase">
                <tr>
                  <th class="py-2 px-3">Date</th>
                  <th class="py-2 px-3">Description</th>
                  <th class="py-2 px-3 text-right">Debit</th>
                  <th class="py-2 px-3 text-right">Credit</th>
                  <th class="py-2 px-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody id="${toolId}_tableBody" class="divide-y divide-workspace-border/50 text-workspace-text font-mono">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Export Buttons -->
        <div class="flex items-center space-x-2 pt-1">
          <button id="${toolId}_btnDownloadXlsx" class="flex-1 bg-workspace-accent hover:bg-workspace-accent/90 text-black font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Download Excel (.xlsx)</span>
          </button>
          <button id="${toolId}_btnDownloadCsv" class="px-4 py-2.5 rounded-xl border border-workspace-border bg-workspace-surface hover:bg-workspace-border text-workspace-text font-bold transition-all text-xs font-mono">
            Download CSV
          </button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileDetails = document.getElementById(`${toolId}_fileDetails`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const fileInfo = document.getElementById(`${toolId}_fileInfo`);
    const btnRemove = document.getElementById(`${toolId}_btnRemove`);
    const status = document.getElementById(`${toolId}_status`);
    const resultsContainer = document.getElementById(`${toolId}_resultsContainer`);
    const statCount = document.getElementById(`${toolId}_statCount`);
    const statDebits = document.getElementById(`${toolId}_statDebits`);
    const statCredits = document.getElementById(`${toolId}_statCredits`);
    const tableBody = document.getElementById(`${toolId}_tableBody`);
    const btnDownloadXlsx = document.getElementById(`${toolId}_btnDownloadXlsx`);
    const btnDownloadCsv = document.getElementById(`${toolId}_btnDownloadCsv`);
    const chkOcr = document.getElementById(`${toolId}_chkOcr`);

    let currentTransactions = [];
    let originalBaseName = 'statement';
    let loadedPdfDoc = null;

    function ensurePdfJs() {
      return new Promise((resolve, reject) => {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF processing library.'));
        document.head.appendChild(script);
      });
    }

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = '/xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load Excel export library.'));
        document.head.appendChild(script);
      });
    }

    function ensureTesseract() {
      return new Promise((resolve, reject) => {
        if (window.Tesseract) return resolve(window.Tesseract);
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.onload = () => resolve(window.Tesseract);
        script.onerror = () => reject(new Error('Failed to load WebAssembly OCR engine.'));
        document.head.appendChild(script);
      });
    }

    async function runWebAssemblyOcr(pdf) {
      status.classList.remove('hidden');
      status.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Initializing in-browser WebAssembly OCR engine (Tesseract.js)...`;
      
      const tesseract = await ensureTesseract();
      const worker = await tesseract.createWorker('eng');
      const ocrRows = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        status.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Running WebAssembly OCR on Page ${pageNum}/${pdf.numPages}...`;
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        const { data } = await worker.recognize(canvas);
        if (data && data.lines) {
          data.lines.forEach(line => {
            const fullLine = line.text.trim();
            const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2})\b/i;
            const dateMatch = fullLine.match(dateRegex);
            const amountMatches = fullLine.match(/[\$\€\£]?\s*\(?-?\d{1,3}(?:,\d{3})*\.\d{2}\)?/g);

            if (dateMatch && amountMatches && amountMatches.length >= 1) {
              const dateStr = dateMatch[0];
              let desc = fullLine.replace(dateStr, '').trim();
              amountMatches.forEach(am => { desc = desc.replace(am, ''); });
              desc = desc.replace(/\s+/g, ' ').trim();

              const amounts = amountMatches.map(a => {
                const isNeg = a.includes('(') || a.includes('-');
                const clean = parseFloat(a.replace(/[^0-9.]/g, ''));
                return isNeg ? -clean : clean;
              });

              let debit = '';
              let credit = '';
              let balance = '';

              if (amounts.length === 1) {
                if (amounts[0] < 0) debit = Math.abs(amounts[0]); else credit = amounts[0];
              } else if (amounts.length === 2) {
                if (amounts[0] < 0) debit = Math.abs(amounts[0]); else credit = amounts[0];
                balance = amounts[1];
              } else if (amounts.length >= 3) {
                debit = amounts[0] < 0 ? Math.abs(amounts[0]) : '';
                credit = amounts[1] > 0 ? amounts[1] : '';
                balance = amounts[amounts.length - 1];
              }

              ocrRows.push({
                date: dateStr,
                description: desc || 'Scanned Transaction',
                debit: debit !== '' ? Number(debit) : '',
                credit: credit !== '' ? Number(credit) : '',
                balance: balance !== '' ? Number(balance) : ''
              });
            }
          });
        }
      }

      await worker.terminate();
      return ocrRows;
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-workspace-accent'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-workspace-accent');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    btnRemove.addEventListener('click', () => {
      fileInput.value = '';
      currentTransactions = [];
      loadedPdfDoc = null;
      fileDetails.classList.add('hidden');
      resultsContainer.classList.add('hidden');
      status.classList.add('hidden');
      dropzone.classList.remove('hidden');
    });

    async function handleFile(file) {
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a valid PDF bank statement.');
        return;
      }
      originalBaseName = file.name.replace(/\.[^/.]+$/, '');
      fileName.textContent = file.name;
      fileInfo.textContent = `${(file.size / 1024).toFixed(1)} KB`;
      dropzone.classList.add('hidden');
      fileDetails.classList.remove('hidden');
      status.classList.remove('hidden');
      resultsContainer.classList.add('hidden');

      try {
        const pdfjs = await ensurePdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        loadedPdfDoc = pdf;
        fileInfo.textContent = `${pdf.numPages} Page(s) • ${(file.size / 1024).toFixed(1)} KB`;

        let parsedRows = [];

        // Check if user forced OCR or if we should try digital text first
        if (!chkOcr.checked) {
          status.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Parsing digital text coordinates locally...`;
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const items = textContent.items.map(item => ({
              str: item.str.trim(),
              x: Math.round(item.transform[4]),
              y: Math.round(item.transform[5])
            })).filter(i => i.str.length > 0);

            const lines = {};
            items.forEach(item => {
              const yKey = Object.keys(lines).find(y => Math.abs(Number(y) - item.y) <= 3);
              if (yKey) {
                lines[yKey].push(item);
              } else {
                lines[item.y] = [item];
              }
            });

            const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
            sortedY.forEach(y => {
              const lineItems = lines[y].sort((a, b) => a.x - b.x);
              const fullLine = lineItems.map(i => i.str).join(' ');

              const dateRegex = /\b(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2})\b/i;
              const dateMatch = fullLine.match(dateRegex);
              const amountMatches = fullLine.match(/[\$\€\£]?\s*\(?-?\d{1,3}(?:,\d{3})*\.\d{2}\)?/g);

              if (dateMatch && amountMatches && amountMatches.length >= 1) {
                const dateStr = dateMatch[0];
                const remaining = fullLine.replace(dateStr, '').trim();

                const amounts = amountMatches.map(a => {
                  const isNeg = a.includes('(') || a.includes('-');
                  const clean = parseFloat(a.replace(/[^0-9.]/g, ''));
                  return isNeg ? -clean : clean;
                });

                let debit = '';
                let credit = '';
                let balance = '';

                if (amounts.length === 1) {
                  if (amounts[0] < 0) debit = Math.abs(amounts[0]); else credit = amounts[0];
                } else if (amounts.length === 2) {
                  if (amounts[0] < 0) debit = Math.abs(amounts[0]); else credit = amounts[0];
                  balance = amounts[1];
                } else if (amounts.length >= 3) {
                  debit = amounts[0] < 0 ? Math.abs(amounts[0]) : '';
                  credit = amounts[1] > 0 ? amounts[1] : '';
                  balance = amounts[amounts.length - 1];
                }

                let desc = remaining;
                amountMatches.forEach(am => { desc = desc.replace(am, ''); });
                desc = desc.replace(/\s+/g, ' ').trim();

                parsedRows.push({
                  date: dateStr,
                  description: desc || 'Transaction',
                  debit: debit !== '' ? Number(debit) : '',
                  credit: credit !== '' ? Number(credit) : '',
                  balance: balance !== '' ? Number(balance) : ''
                });
              }
            });
          }
        }

        // Auto-fallback to WebAssembly OCR if digital text yielded 0 rows or if OCR was checked
        if (parsedRows.length === 0) {
          try {
            parsedRows = await runWebAssemblyOcr(pdf);
          } catch(ocrErr) {
            console.warn('OCR processing fallback encountered issue:', ocrErr);
          }
        }

        currentTransactions = parsedRows;
        renderResults(parsedRows);
      } catch (err) {
        console.error('PDF parsing error:', err);
        status.innerHTML = `<span class="text-red-400 font-bold">Error parsing PDF:</span> ${err.message || 'Could not parse text table.'}`;
      }
    }

    function renderResults(rows) {
      status.classList.add('hidden');
      resultsContainer.classList.remove('hidden');

      statCount.textContent = rows.length;

      let totalDebits = 0;
      let totalCredits = 0;

      rows.forEach(r => {
        if (typeof r.debit === 'number') totalDebits += r.debit;
        if (typeof r.credit === 'number') totalCredits += r.credit;
      });

      statDebits.textContent = `$${totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      statCredits.textContent = `$${totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      tableBody.innerHTML = '';
      if (rows.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="py-6 text-center text-workspace-muted font-mono space-y-2">
              <p>No transactions detected via text layer.</p>
              <button id="${toolId}_btnManualOcr" class="mt-2 bg-workspace-accent/20 hover:bg-workspace-accent text-workspace-accent hover:text-black border border-workspace-accent/50 px-3 py-1.5 rounded-lg font-bold transition-all text-xs font-mono">
                🔍 Run WebAssembly OCR (Scan Page Images)
              </button>
            </td>
          </tr>
        `;
        const btnManualOcr = document.getElementById(`${toolId}_btnManualOcr`);
        if (btnManualOcr && loadedPdfDoc) {
          btnManualOcr.addEventListener('click', async () => {
            resultsContainer.classList.add('hidden');
            const ocrRows = await runWebAssemblyOcr(loadedPdfDoc);
            currentTransactions = ocrRows;
            renderResults(ocrRows);
          });
        }
        return;
      }

      rows.slice(0, 100).forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-workspace-surface/50 transition-colors';
        tr.innerHTML = `
          <td class="py-1.5 px-3 whitespace-nowrap text-workspace-muted">${r.date}</td>
          <td class="py-1.5 px-3 max-w-[200px] truncate" title="${r.description}">${r.description}</td>
          <td class="py-1.5 px-3 text-right text-amber-400">${r.debit ? '$' + Number(r.debit).toFixed(2) : '-'}</td>
          <td class="py-1.5 px-3 text-right text-emerald-400">${r.credit ? '$' + Number(r.credit).toFixed(2) : '-'}</td>
          <td class="py-1.5 px-3 text-right text-workspace-muted">${r.balance ? '$' + Number(r.balance).toFixed(2) : '-'}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    btnDownloadXlsx.addEventListener('click', async () => {
      if (currentTransactions.length === 0) return;
      try {
        const XLSX = await ensureXlsx();
        const aoa = [
          ['Date', 'Description', 'Withdrawals (Debit)', 'Deposits (Credit)', 'Balance']
        ];
        currentTransactions.forEach(t => {
          aoa.push([t.date, t.description, t.debit || '', t.credit || '', t.balance || '']);
        });

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [{ wch: 14 }, { wch: 40 }, { wch: 18 }, { wch: 18 }, { wch: 16 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, `${originalBaseName}_converted.xlsx`);
      } catch (err) {
        alert('Failed to generate Excel file: ' + err.message);
      }
    });

    btnDownloadCsv.addEventListener('click', () => {
      if (currentTransactions.length === 0) return;
      const headers = ['Date', 'Description', 'Debit', 'Credit', 'Balance'];
      const rows = currentTransactions.map(t => [
        `"${t.date}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.debit || '',
        t.credit || '',
        t.balance || ''
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${originalBaseName}_transactions.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
});
