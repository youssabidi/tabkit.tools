// Tool: exif-metadata-stripper
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['exif-metadata-stripper'] = Object.assign(window.TOOLS_REGISTRY['exif-metadata-stripper'] || {}, {
  id: 'exif-metadata-stripper',
  name: 'Photo EXIF & Privacy Metadata Stripper',
  category: 'Privacy',
  description: 'Strip hidden GPS coordinates, camera serial numbers, and device metadata from photos before sharing.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/*" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[200px]">Click or Drop Photo to Clean</span>
        <span class="text-[9px] text-workspace-muted">Strips GPS, Camera Model, Timestamp</span>
      </div>

      <!-- Checklist of metadata stripped -->
      <div class="space-y-1.5 bg-workspace-bg/60 p-2.5 rounded-xl border border-workspace-border text-[11px] font-mono">
        <div class="text-[10px] uppercase font-bold text-workspace-muted tracking-wider">Sanitization Status</div>
        <div class="flex items-center gap-2 text-workspace-text">
          <span class="w-1.5 h-1.5 rounded-full bg-workspace-accent"></span>
          <span>GPS Geolocation Coordinates: <strong class="text-workspace-accent">Stripped</strong></span>
        </div>
        <div class="flex items-center gap-2 text-workspace-text">
          <span class="w-1.5 h-1.5 rounded-full bg-workspace-accent"></span>
          <span>Camera & Lens Model / Serial: <strong class="text-workspace-accent">Stripped</strong></span>
        </div>
        <div class="flex items-center gap-2 text-workspace-text">
          <span class="w-1.5 h-1.5 rounded-full bg-workspace-accent"></span>
          <span>Timestamp & Software History: <strong class="text-workspace-accent">Stripped</strong></span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted text-[10px]">100% Local Sandbox</span>
        <button id="${toolId}_btnDownload" disabled class="px-3 py-1 bg-workspace-accent disabled:opacity-40 disabled:hover:scale-100 text-black font-bold rounded-lg transition-all">Download Sanitized</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const status = document.getElementById(`${toolId}_status`);
    const btnDownload = document.getElementById(`${toolId}_btnDownload`);

    let cleanedBlob = null;
    let originalName = 'sanitized-photo';

    function cleanPhoto(file) {
      if (!file || !file.type.startsWith('image/')) return;
      fileName.textContent = file.name;
      originalName = file.name.replace(/\.[^/.]+$/, "");
      status.textContent = 'Sanitizing pixels...';

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Re-render to offscreen canvas to completely discard EXIF/IPTC/XMP headers
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            cleanedBlob = blob;
            status.textContent = 'Sanitized & Ready';
            btnDownload.disabled = false;
            if (typeof showToast !== 'undefined') showToast('Metadata stripped successfully!');
          }, 'image/jpeg', 0.95);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => cleanPhoto(e.target.files[0]);

      dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('border-workspace-accent'); };
      dropzone.ondragleave = () => dropzone.classList.remove('border-workspace-accent');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-workspace-accent');
        if (e.dataTransfer.files.length) cleanPhoto(e.dataTransfer.files[0]);
      };
    }

    if (btnDownload) {
      btnDownload.onclick = () => {
        if (!cleanedBlob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(cleanedBlob);
        a.download = `${originalName}-clean.jpg`;
        a.click();
        URL.revokeObjectURL(a.href);
      };
    }
  }
});
