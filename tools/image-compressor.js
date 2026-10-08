// Tool: image-compressor (Batch & Single Image Compressor)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['image-compressor'] = Object.assign(window.TOOLS_REGISTRY['image-compressor'] || {}, {
  id: 'image-compressor',
  name: 'Client-Side Image Compressor & WebP',
  category: 'Media',
  standaloneUrl: '/image-compressor.html',
  description: 'Batch compress PNG, JPEG, and WebP images locally with dimension scaling and zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/*" multiple class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[220px]">Drop Images (Single or Batch)</span>
        <span class="text-[9px] text-workspace-muted">PNG, JPG, WebP • 100% Offline Processing</span>
      </div>

      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-workspace-muted">Quality: <strong id="${toolId}_qualityLabel" class="text-workspace-accent">80%</strong></span>
          <div class="flex items-center gap-1.5">
            <span class="text-workspace-muted">Scale:</span>
            <select id="${toolId}_scale" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-[10px] text-workspace-text font-mono focus:outline-none">
              <option value="1">100% (Original)</option>
              <option value="0.75">75% Size</option>
              <option value="0.5">50% Size</option>
              <option value="0.25">25% Size</option>
            </select>
            <select id="${toolId}_format" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-[10px] text-workspace-accent font-mono focus:outline-none">
              <option value="image/webp">WebP</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
        </div>
        <input id="${toolId}_quality" type="range" min="10" max="100" value="80" class="w-full accent-[#10B981] h-1.5 bg-workspace-border rounded-lg cursor-pointer" />
      </div>

      <div id="${toolId}_batchList" class="hidden max-h-20 overflow-y-auto space-y-1 bg-workspace-bg p-1.5 rounded-lg border border-workspace-border text-[10px] font-mono"></div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_stats" class="text-workspace-muted text-[10px]">No files selected</span>
        <div class="flex items-center gap-1.5">
          <button id="${toolId}_btnDownload" disabled class="px-3 py-1 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all">Download</button>
        </div>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const quality = document.getElementById(`${toolId}_quality`);
    const qualityLabel = document.getElementById(`${toolId}_qualityLabel`);
    const format = document.getElementById(`${toolId}_format`);
    const scale = document.getElementById(`${toolId}_scale`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);
    const batchList = document.getElementById(`${toolId}_batchList`);

    let fileQueue = [];
    let processedResults = [];

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    async function processQueue() {
      if (fileQueue.length === 0) return;
      processedResults = [];
      const qVal = parseInt(quality.value, 10) / 100;
      const fmt = format.value;
      const scaleVal = parseFloat(scale.value || '1');

      if (batchList) {
        batchList.innerHTML = '<div class="text-workspace-muted text-center py-1">Compressing images locally...</div>';
        batchList.classList.remove('hidden');
      }

      let totalOrig = 0;
      let totalComp = 0;

      for (let i = 0; i < fileQueue.length; i++) {
        const file = fileQueue[i];
        totalOrig += file.size;

        const img = await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = URL.createObjectURL(file);
        });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scaleVal);
        canvas.height = Math.round(img.height * scaleVal);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, fmt, qVal));
        URL.revokeObjectURL(img.src);

        totalComp += blob.size;
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const ext = fmt === 'image/webp' ? '.webp' : (fmt === 'image/jpeg' ? '.jpg' : '.png');
        processedResults.push({ name: `${baseName}-compressed${ext}`, blob, origSize: file.size, compSize: blob.size });
      }

      // Render batch list preview
      if (batchList) {
        batchList.innerHTML = processedResults.map((r, idx) => `
          <div class="flex items-center justify-between p-1 rounded bg-workspace-surface/50 border border-workspace-border">
            <span class="truncate max-w-[130px] text-workspace-text">${escapeHtml(r.name)}</span>
            <span class="text-workspace-accent font-bold">${formatBytes(r.compSize)}</span>
          </div>
        `).join('');
      }

      const savedPct = Math.max(0, Math.round((1 - (totalComp / totalOrig)) * 100));
      stats.textContent = `${processedResults.length} file(s) • Saved ${savedPct}%`;
      btnDownload.disabled = false;
      btnDownload.textContent = processedResults.length > 1 ? `Save All (${processedResults.length})` : 'Download';
    }

    function handleFiles(files) {
      if (!files || files.length === 0) return;
      fileQueue = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (fileQueue.length === 0) return;

      fileName.textContent = fileQueue.length === 1 ? fileQueue[0].name : `${fileQueue.length} images selected`;
      processQueue();
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => handleFiles(e.target.files);

      dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); };
      dropzone.ondragleave = () => dropzone.classList.remove('border-workspace-accent');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-workspace-accent');
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
      };
    }

    quality.oninput = (e) => {
      qualityLabel.textContent = e.target.value + '%';
      processQueue();
    };
    format.onchange = () => processQueue();
    scale.onchange = () => processQueue();

    btnDownload.onclick = () => {
      if (processedResults.length === 0) return;
      processedResults.forEach((res, i) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(res.blob);
          a.download = res.name;
          a.click();
          URL.revokeObjectURL(a.href);
        }, i * 200);
      });
      if (typeof showToast !== 'undefined') showToast(`Downloaded ${processedResults.length} compressed image(s)!`);
    };
  }
});
