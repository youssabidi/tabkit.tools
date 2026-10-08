// Tool: image-to-base64 (Image to Base64 & Data URI Generator)
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['image-to-base64'] = Object.assign(window.TOOLS_REGISTRY['image-to-base64'] || {}, {
  id: 'image-to-base64',
  name: 'Image to Base64 (Data URI) Generator',
  category: 'Media & Design',
  standaloneUrl: '/image-to-base64.html',
  description: 'Convert PNG, JPG, or SVG images into copy-pasteable Base64 Data URIs, HTML tags, and CSS snippets.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div id="${toolId}_dropzone" class="border-2 border-dashed border-workspace-border hover:border-workspace-accent/60 rounded-xl p-3 text-center cursor-pointer bg-workspace-bg transition-colors flex flex-col items-center justify-center space-y-1">
        <input type="file" id="${toolId}_fileInput" accept="image/*" class="hidden" />
        <svg class="w-6 h-6 text-workspace-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span id="${toolId}_fileName" class="text-[11px] font-mono text-workspace-text truncate max-w-[200px]">Click or Drop Image</span>
        <span class="text-[9px] text-workspace-muted">PNG, SVG, JPG, WebP</span>
      </div>

      <div class="flex-1 min-h-[110px] space-y-1.5">
        <div class="flex items-center justify-between text-[10px] font-mono text-workspace-muted">
          <span>Output Format:</span>
          <select id="${toolId}_mode" class="bg-workspace-surface border border-workspace-border rounded px-1.5 py-0.5 text-[10px] text-workspace-accent font-mono focus:outline-none">
            <option value="raw">Raw Data URI</option>
            <option value="html">HTML &lt;img&gt; Tag</option>
            <option value="css">CSS background-image</option>
          </select>
        </div>
        <textarea id="${toolId}_output" readonly class="w-full h-24 bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-text placeholder-workspace-muted focus:outline-none resize-none select-text break-all" placeholder="data:image/png;base64,..."></textarea>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_stats" class="text-workspace-muted text-[10px]">No file loaded</span>
        <button id="${toolId}_btnCopy" disabled class="px-3 py-1 bg-workspace-accent disabled:opacity-40 text-black font-bold rounded-lg transition-all">Copy URI</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const dropzone = document.getElementById(`${toolId}_dropzone`);
    const fileInput = document.getElementById(`${toolId}_fileInput`);
    const fileName = document.getElementById(`${toolId}_fileName`);
    const output = document.getElementById(`${toolId}_output`);
    const mode = document.getElementById(`${toolId}_mode`);
    const stats = document.getElementById(`${toolId}_stats`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);

    let rawDataUri = '';

    function updateOutput() {
      if (!rawDataUri) return;
      const m = mode.value;
      if (m === 'raw') {
        output.value = rawDataUri;
      } else if (m === 'html') {
        output.value = `<img src="${rawDataUri}" alt="embedded image" />`;
      } else if (m === 'css') {
        output.value = `background-image: url("${rawDataUri}");`;
      }
    }

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      fileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        rawDataUri = e.target.result;
        updateOutput();
        const kb = (rawDataUri.length / 1024).toFixed(1);
        stats.textContent = `${kb} KB Base64 string`;
        btnCopy.disabled = false;
        if (typeof showToast !== 'undefined') showToast('Converted to Base64!');
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

    mode.onchange = () => updateOutput();

    btnCopy.onclick = () => {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value);
      if (typeof showToast !== 'undefined') showToast('Copied Base64 snippet!');
    };
  }
});
