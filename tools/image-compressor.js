// Tool: image-compressor
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['image-compressor'] = Object.assign(window.TOOLS_REGISTRY['image-compressor'] || {}, {
  id: 'image-compressor',
  name: 'Client-Side Image Compressor & WebP',
  category: 'Media',
  description: 'Compress PNG, JPEG, and WebP images locally inside your browser with zero server uploads.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/*" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[200px]">Click or Drop Image</span>
        <span class="text-[9px] text-workspace-muted">PNG, JPG, WebP (100% Offline)</span>
      </div>

      <div class="space-y-2 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-workspace-muted">Quality: <strong id="${toolId}_qualityLabel" class="text-workspace-text">80%</strong></span>
          <select id="${toolId}_format" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-[10px] text-workspace-accent font-mono focus:outline-none">
            <option value="image/webp">WebP (Best)</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
        <input id="${toolId}_quality" type="range" min="10" max="100" value="80" class="w-full accent-[#10B981] h-1.5 bg-workspace-border rounded-lg cursor-pointer" />
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_stats" class="text-workspace-muted text-[10px]">No image selected</span>
        <button id="${toolId}_btnDownload" disabled class="px-3 py-1 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all">Download</button>
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
    const stats = document.getElementById(`${toolId}_stats`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);

    let loadedImage = null;
    let originalSize = 0;
    let compressedBlob = null;
    let originalName = 'compressed-image';

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    function compress() {
      if (!loadedImage) return;

      const canvas = document.createElement('canvas');
      canvas.width = loadedImage.width;
      canvas.height = loadedImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(loadedImage, 0, 0);

      const mime = format.value;
      const q = Number(quality.value) / 100;

      canvas.toBlob((blob) => {
        if (!blob) return;
        compressedBlob = blob;
        const saved = originalSize > 0 ? Math.max(0, Math.round(((originalSize - blob.size) / originalSize) * 100)) : 0;
        stats.innerHTML = `<span class="text-workspace-text">${formatBytes(originalSize)}</span> &rarr; <span class="text-workspace-accent font-bold">${formatBytes(blob.size)}</span> (-${saved}%)`;
        btnDownload.disabled = false;
      }, mime, q);
    }

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      originalSize = file.size;
      originalName = file.name.replace(/\.[^/.]+$/, "");
      fileName.textContent = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          loadedImage = img;
          compress();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => handleFile(e.target.files[0]);

      dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); };
      dropzone.ondragleave = () => dropzone.classList.remove('border-workspace-accent');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-workspace-accent');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
      };
    }

    if (quality) {
      quality.addEventListener('input', () => {
        qualityLabel.textContent = quality.value + '%';
        compress();
      });
    }

    if (format) format.addEventListener('change', compress);

    if (btnDownload) {
      btnDownload.onclick = () => {
        if (!compressedBlob) return;
        const ext = format.value === 'image/webp' ? 'webp' : (format.value === 'image/png' ? 'png' : 'jpg');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(compressedBlob);
        a.download = `${originalName}-compressed.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        if (typeof showToast !== 'undefined') showToast('Downloaded compressed image!');
      };
    }
  }
});
