// Tool: json-to-typescript
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['json-to-typescript'] = Object.assign(window.TOOLS_REGISTRY['json-to-typescript'] || {}, {
  id: 'json-to-typescript',
  name: 'JSON to TypeScript & Zod Schema',
  category: 'Developer',
  description: 'Convert JSON payloads into clean TypeScript interfaces, types, and Zod validation schemas.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div class="grid grid-cols-2 gap-2 flex-1 min-h-[180px]">
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center text-[10px] font-mono text-workspace-muted">
            <span>Input JSON</span>
            <button id="${toolId}_btnSample" class="text-workspace-accent hover:underline">Sample</button>
          </div>
          <textarea id="${toolId}_jsonInput" class="flex-1 w-full bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-text focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder='{\n  "id": 1,\n  "username": "alex",\n  "isActive": true\n}'></textarea>
        </div>

        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center text-[10px] font-mono text-workspace-muted">
            <span id="${toolId}_outLabel">TypeScript</span>
            <div class="flex gap-1">
              <button id="${toolId}_modeTs" class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-workspace-surface text-workspace-accent">TS</button>
              <button id="${toolId}_modeZod" class="px-1.5 py-0.5 rounded text-[10px] font-mono text-workspace-muted hover:text-workspace-text">Zod</button>
            </div>
          </div>
          <textarea id="${toolId}_tsOutput" readonly class="flex-1 w-full bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-accent focus:outline-none resize-none leading-relaxed"></textarea>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <span id="${toolId}_status" class="text-workspace-muted">Ready</span>
        <button id="${toolId}_btnCopy" class="px-3 py-1 bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-workspace-text rounded-lg transition-colors">Copy Generated Code</button>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_jsonInput`);
    const output = document.getElementById(`${toolId}_tsOutput`);
    const btnSample = document.getElementById(`${toolId}_btnSample`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const modeTs = document.getElementById(`${toolId}_modeTs`);
    const modeZod = document.getElementById(`${toolId}_modeZod`);
    const status = document.getElementById(`${toolId}_status`);
    const outLabel = document.getElementById(`${toolId}_outLabel`);

    let currentMode = 'ts';

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function generateTs(val, rootName = 'RootObject') {
      const interfaces = [];

      function getType(obj, name) {
        if (obj === null) return 'any';
        if (typeof obj === 'string') return 'string';
        if (typeof obj === 'number') return 'number';
        if (typeof obj === 'boolean') return 'boolean';

        if (Array.isArray(obj)) {
          if (obj.length === 0) return 'any[]';
          const innerType = getType(obj[0], name.endsWith('s') ? name.slice(0, -1) : name + 'Item');
          return `${innerType}[]`;
        }

        if (typeof obj === 'object') {
          const interfaceName = capitalize(name);
          const fields = [];
          for (const [k, v] of Object.entries(obj)) {
            const fieldType = getType(v, k);
            fields.push(`  ${k}: ${fieldType};`);
          }
          interfaces.push(`export interface ${interfaceName} {\n${fields.join('\n')}\n}`);
          return interfaceName;
        }

        return 'any';
      }

      getType(val, rootName);
      return interfaces.reverse().join('\n\n');
    }

    function generateZod(val, rootName = 'rootSchema') {
      function getZodType(obj) {
        if (obj === null) return 'z.any()';
        if (typeof obj === 'string') return 'z.string()';
        if (typeof obj === 'number') return 'z.number()';
        if (typeof obj === 'boolean') return 'z.boolean()';

        if (Array.isArray(obj)) {
          if (obj.length === 0) return 'z.array(z.any())';
          return `z.array(${getZodType(obj[0])})`;
        }

        if (typeof obj === 'object') {
          const lines = [];
          for (const [k, v] of Object.entries(obj)) {
            lines.push(`  ${k}: ${getZodType(v)}`);
          }
          return `z.object({\n${lines.join(',\n')}\n})`;
        }

        return 'z.any()';
      }

      return `import { z } from 'zod';\n\nexport const ${rootName} = ${getZodType(val)};\n\nexport type ${capitalize(rootName.replace('Schema', ''))} = z.infer<typeof ${rootName}>;`;
    }

    function convert() {
      const raw = input.value.trim();
      if (!raw) {
        output.value = '';
        status.textContent = 'Paste JSON';
        status.className = 'text-workspace-muted';
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        if (currentMode === 'ts') {
          output.value = generateTs(parsed);
          outLabel.textContent = 'TypeScript';
        } else {
          output.value = generateZod(parsed);
          outLabel.textContent = 'Zod Schema';
        }
        status.textContent = 'Valid JSON';
        status.className = 'text-workspace-accent';
      } catch (err) {
        output.value = '// Syntax Error: ' + err.message;
        status.textContent = 'Invalid JSON';
        status.className = 'text-workspace-danger';
      }
    }

    if (btnSample) {
      btnSample.onclick = () => {
        input.value = JSON.stringify({
          id: 42,
          name: "TabKit Pro",
          isPublished: true,
          stats: { views: 12000, likes: 850 },
          tags: ["developer", "privacy", "tools"]
        }, null, 2);
        convert();
      };
    }

    if (input) input.addEventListener('input', convert);

    if (modeTs && modeZod) {
      modeTs.onclick = () => {
        currentMode = 'ts';
        modeTs.className = "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-workspace-surface text-workspace-accent";
        modeZod.className = "px-1.5 py-0.5 rounded text-[10px] font-mono text-workspace-muted hover:text-workspace-text";
        convert();
      };
      modeZod.onclick = () => {
        currentMode = 'zod';
        modeZod.className = "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-workspace-surface text-workspace-accent";
        modeTs.className = "px-1.5 py-0.5 rounded text-[10px] font-mono text-workspace-muted hover:text-workspace-text";
        convert();
      };
    }

    if (btnCopy) {
      btnCopy.onclick = () => {
        if (output && output.value) {
          navigator.clipboard.writeText(output.value);
          if (typeof showToast !== 'undefined') showToast('Copied to clipboard!');
        }
      };
    }

    convert();
  }
});
