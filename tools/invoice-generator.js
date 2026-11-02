// Tool: invoice-generator (Client-Side Invoice Builder with Excel & PDF Export)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['invoice-generator'] = Object.assign(window.TOOLS_REGISTRY['invoice-generator'] || {}, {
  id: 'invoice-generator',
  name: 'Free Invoice Generator & Excel Exporter',
  category: 'Productivity & Math',
  standaloneUrl: '/invoice-generator',
  description: 'Generate professional freelance and business invoices locally with live calculations, active formula Excel (.xlsx) workbooks, and print-ready PDF export.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-4 font-sans text-xs">
      <!-- Top Meta Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl border border-workspace-border bg-workspace-bg">
        <!-- From -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono uppercase text-workspace-muted font-bold">From (Your Business)</label>
          <input type="text" id="${toolId}_fromName" placeholder="Business or Freelancer Name" class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden" value="Acme Studio" />
          <input type="text" id="${toolId}_fromEmail" placeholder="Email & Address" class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden" value="billing@acme.example.com" />
        </div>
        <!-- To -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono uppercase text-workspace-muted font-bold">Billed To (Client)</label>
          <input type="text" id="${toolId}_toName" placeholder="Client Name or Company" class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden" value="Global Client LLC" />
          <input type="text" id="${toolId}_toEmail" placeholder="Client Email & Address" class="w-full bg-workspace-surface border border-workspace-border rounded-lg px-2.5 py-1.5 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden" value="accounts@globalclient.com" />
        </div>
      </div>

      <!-- Invoice Details Bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label class="text-[10px] font-mono text-workspace-muted uppercase">Invoice #</label>
          <input type="text" id="${toolId}_invNumber" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 text-workspace-text text-xs font-mono" value="INV-2026-001" />
        </div>
        <div>
          <label class="text-[10px] font-mono text-workspace-muted uppercase">Currency</label>
          <select id="${toolId}_currency" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2 py-1.5 text-workspace-text text-xs font-mono">
            <option value="$" selected>USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="QAR">QAR (ر.ق)</option>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="TND">TND (د.ت)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-mono text-workspace-muted uppercase">Issue Date</label>
          <input type="date" id="${toolId}_issueDate" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2 py-1 text-workspace-text text-xs font-mono" />
        </div>
        <div>
          <label class="text-[10px] font-mono text-workspace-muted uppercase">Due Date</label>
          <input type="date" id="${toolId}_dueDate" class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2 py-1 text-workspace-text text-xs font-mono" />
        </div>
      </div>

      <!-- Line Items Section -->
      <div class="border border-workspace-border rounded-xl bg-workspace-bg overflow-hidden flex flex-col">
        <div class="p-2 border-b border-workspace-border flex items-center justify-between bg-workspace-surface/50">
          <span class="font-bold text-workspace-text">Line Items</span>
          <button id="${toolId}_btnAddItem" class="text-xs bg-workspace-accent/10 border border-workspace-accent/30 text-workspace-accent hover:bg-workspace-accent hover:text-black font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-mono">
            + Add Row
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-[11px]">
            <thead class="bg-workspace-surface text-workspace-muted font-mono border-b border-workspace-border text-[10px] uppercase">
              <tr>
                <th class="py-2 px-3">Description</th>
                <th class="py-2 px-2 w-16 text-center">Qty</th>
                <th class="py-2 px-2 w-24 text-right">Unit Rate</th>
                <th class="py-2 px-3 w-24 text-right">Total</th>
                <th class="py-2 px-2 w-8 text-center"></th>
              </tr>
            </thead>
            <tbody id="${toolId}_itemsTbody" class="divide-y divide-workspace-border/50 text-workspace-text">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary & Totals -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-3 p-3.5 rounded-xl border border-workspace-border bg-workspace-bg">
        <div class="w-full sm:w-1/2 space-y-1">
          <label class="text-[10px] font-mono uppercase text-workspace-muted">Notes / Payment Terms</label>
          <textarea id="${toolId}_notes" rows="2" class="w-full bg-workspace-surface border border-workspace-border rounded-lg p-2 text-workspace-text text-xs focus:border-workspace-accent focus:outline-hidden" placeholder="Payment due within 14 days via Wire Transfer or Stripe. Thank you for your business!">Payment due within 14 days via Bank Transfer. Thank you for your business!</textarea>
        </div>
        <div class="w-full sm:w-1/2 space-y-1.5 font-mono text-xs">
          <div class="flex justify-between text-workspace-muted">
            <span>Subtotal:</span>
            <span id="${toolId}_subtotal">$0.00</span>
          </div>
          <div class="flex justify-between items-center text-workspace-muted">
            <span class="flex items-center gap-1">Tax / VAT (%): <input type="number" id="${toolId}_taxRate" class="w-12 bg-workspace-surface border border-workspace-border rounded px-1 text-center text-workspace-text text-xs" value="10" min="0" max="100" /></span>
            <span id="${toolId}_taxAmount">$0.00</span>
          </div>
          <div class="flex justify-between items-center text-workspace-muted">
            <span class="flex items-center gap-1">Discount: <input type="number" id="${toolId}_discount" class="w-16 bg-workspace-surface border border-workspace-border rounded px-1 text-center text-workspace-text text-xs" value="0" min="0" /></span>
            <span id="${toolId}_discountDisplay">-$0.00</span>
          </div>
          <div class="flex justify-between text-sm font-extrabold text-white border-t border-workspace-border pt-1.5">
            <span>Balance Due:</span>
            <span id="${toolId}_grandTotal" class="text-workspace-accent">$0.00</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2 pt-1">
        <button id="${toolId}_btnExportXlsx" class="flex-1 bg-workspace-accent hover:bg-workspace-accent/90 text-black font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Download Excel (.xlsx)</span>
        </button>
        <button id="${toolId}_btnPrintPdf" class="px-5 py-2.5 rounded-xl border border-workspace-border bg-workspace-surface hover:bg-workspace-border text-workspace-text font-bold transition-all text-xs flex items-center gap-1.5">
          <svg class="w-4 h-4 text-workspace-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const fromName = document.getElementById(`${toolId}_fromName`);
    const fromEmail = document.getElementById(`${toolId}_fromEmail`);
    const toName = document.getElementById(`${toolId}_toName`);
    const toEmail = document.getElementById(`${toolId}_toEmail`);
    const invNumber = document.getElementById(`${toolId}_invNumber`);
    const currency = document.getElementById(`${toolId}_currency`);
    const issueDate = document.getElementById(`${toolId}_issueDate`);
    const dueDate = document.getElementById(`${toolId}_dueDate`);
    const btnAddItem = document.getElementById(`${toolId}_btnAddItem`);
    const itemsTbody = document.getElementById(`${toolId}_itemsTbody`);
    const notes = document.getElementById(`${toolId}_notes`);
    const taxRate = document.getElementById(`${toolId}_taxRate`);
    const discount = document.getElementById(`${toolId}_discount`);
    const subtotalEl = document.getElementById(`${toolId}_subtotal`);
    const taxAmountEl = document.getElementById(`${toolId}_taxAmount`);
    const discountDisplayEl = document.getElementById(`${toolId}_discountDisplay`);
    const grandTotalEl = document.getElementById(`${toolId}_grandTotal`);
    const btnExportXlsx = document.getElementById(`${toolId}_btnExportXlsx`);
    const btnPrintPdf = document.getElementById(`${toolId}_btnPrintPdf`);

    // Set default dates
    const now = new Date();
    issueDate.value = now.toISOString().split('T')[0];
    const due = new Date();
    due.setDate(now.getDate() + 14);
    dueDate.value = due.toISOString().split('T')[0];

    let items = [
      { desc: 'Frontend Development & UI Polish', qty: 40, rate: 75 },
      { desc: 'API Integration & Performance Audit', qty: 15, rate: 90 },
      { desc: 'Technical SEO & Metadata Hardening', qty: 1, rate: 500 }
    ];

    function ensureXlsx() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) return resolve(window.XLSX);
        const script = document.createElement('script');
        script.src = '/xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load SheetJS library.'));
        document.head.appendChild(script);
      });
    }

    function renderItems() {
      itemsTbody.innerHTML = '';
      items.forEach((item, index) => {
        const tr = document.createElement('tr');
        const curr = currency.value;
        const lineTotal = (item.qty * item.rate).toFixed(2);
        tr.innerHTML = `
          <td class="py-1.5 px-2">
            <input type="text" class="w-full bg-workspace-surface border border-workspace-border rounded px-2 py-1 text-workspace-text text-xs item-desc" data-index="${index}" value="${item.desc}" />
          </td>
          <td class="py-1.5 px-1">
            <input type="number" min="0" step="any" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-center text-workspace-text text-xs item-qty font-mono" data-index="${index}" value="${item.qty}" />
          </td>
          <td class="py-1.5 px-1">
            <input type="number" min="0" step="any" class="w-full bg-workspace-surface border border-workspace-border rounded px-1.5 py-1 text-right text-workspace-text text-xs item-rate font-mono" data-index="${index}" value="${item.rate}" />
          </td>
          <td class="py-1.5 px-3 text-right font-mono font-bold text-workspace-accent">
            ${curr}${Number(lineTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td class="py-1.5 px-1 text-center">
            <button class="text-red-400 hover:text-red-300 font-bold p-1 btn-del" data-index="${index}" title="Remove item">×</button>
          </td>
        `;
        itemsTbody.appendChild(tr);
      });

      calculateTotals();
    }

    function calculateTotals() {
      const curr = currency.value;
      let sub = 0;
      items.forEach(i => {
        sub += (Number(i.qty) || 0) * (Number(i.rate) || 0);
      });

      const tRate = Number(taxRate.value) || 0;
      const taxAmt = (sub * tRate) / 100;
      const discAmt = Number(discount.value) || 0;
      const total = Math.max(0, sub + taxAmt - discAmt);

      subtotalEl.textContent = `${curr}${sub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      taxAmountEl.textContent = `${curr}${taxAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      discountDisplayEl.textContent = `-${curr}${discAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      grandTotalEl.textContent = `${curr}${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    itemsTbody.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      if (idx === undefined) return;
      if (e.target.classList.contains('item-desc')) items[idx].desc = e.target.value;
      if (e.target.classList.contains('item-qty')) items[idx].qty = Number(e.target.value) || 0;
      if (e.target.classList.contains('item-rate')) items[idx].rate = Number(e.target.value) || 0;
      renderItems();
    });

    itemsTbody.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-del')) {
        const idx = parseInt(e.target.dataset.index);
        items.splice(idx, 1);
        if (items.length === 0) items.push({ desc: 'Consulting Service', qty: 1, rate: 100 });
        renderItems();
      }
    });

    btnAddItem.addEventListener('click', () => {
      items.push({ desc: 'New Service Item', qty: 1, rate: 100 });
      renderItems();
    });

    taxRate.addEventListener('input', calculateTotals);
    discount.addEventListener('input', calculateTotals);
    currency.addEventListener('change', renderItems);

    btnExportXlsx.addEventListener('click', async () => {
      try {
        const XLSX = await ensureXlsx();
        const curr = currency.value;
        const aoa = [
          ['INVOICE', '', '', '', invNumber.value || 'INV-001'],
          ['Date:', issueDate.value, '', 'Due Date:', dueDate.value],
          [''],
          ['FROM:', fromName.value, '', 'BILLED TO:', toName.value],
          ['Email:', fromEmail.value, '', 'Email:', toEmail.value],
          [''],
          ['#', 'Description', 'Quantity', 'Unit Price (' + curr + ')', 'Line Total (' + curr + ')']
        ];

        let startRow = 8;
        items.forEach((item, i) => {
          const rowNum = startRow + i;
          aoa.push([
            i + 1,
            item.desc,
            item.qty,
            item.rate,
            { f: `C${rowNum}*D${rowNum}` } // Active Excel formula!
          ]);
        });

        const endRow = startRow + items.length - 1;
        aoa.push(['']);
        aoa.push(['', '', '', 'Subtotal:', { f: `SUM(E${startRow}:E${endRow})` }]);
        aoa.push(['', '', '', `Tax (${taxRate.value}%):`, { f: `E${endRow + 2}*${Number(taxRate.value) / 100}` }]);
        aoa.push(['', '', '', 'Discount:', Number(discount.value) || 0]);
        aoa.push(['', '', '', 'TOTAL DUE:', { f: `E${endRow + 2}+E${endRow + 3}-E${endRow + 4}` }]);
        aoa.push(['']);
        aoa.push(['Notes & Terms:']);
        aoa.push([notes.value]);

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [{ wch: 6 }, { wch: 38 }, { wch: 12 }, { wch: 16 }, { wch: 18 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
        XLSX.writeFile(wb, `${invNumber.value || 'invoice'}.xlsx`);
      } catch (err) {
        alert('Failed to generate Excel invoice: ' + err.message);
      }
    });

    btnPrintPdf.addEventListener('click', () => {
      window.print();
    });

    renderItems();
  }
});
