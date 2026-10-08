// Tool: curl-converter
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['curl-converter'] = Object.assign(window.TOOLS_REGISTRY['curl-converter'] || {}, {
  id: 'curl-converter',
  name: 'cURL to Fetch / Axios / Python Converter',
  category: 'Developer',
  description: 'Convert cURL requests into copy-pasteable JavaScript fetch, Node.js axios, and Python requests code.',
  render: (toolId) => `
    <div class="flex flex-col h-full justify-between space-y-2 font-sans text-xs">
      <div class="space-y-1">
        <div class="flex justify-between items-center text-[10px] font-mono text-workspace-muted">
          <span>Paste cURL command</span>
          <button id="${toolId}_btnSample" class="text-workspace-accent hover:underline">Sample</button>
        </div>
        <textarea id="${toolId}_input" rows="3" class="w-full bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[11px] text-workspace-text focus:border-workspace-accent focus:outline-none resize-none leading-relaxed" placeholder="curl -X POST https://api.example.com/v1/users -H 'Content-Type: application/json' -d '{\"name\":\"Alex\"}'"></textarea>
      </div>

      <div class="flex items-center justify-between border-b border-workspace-border pb-1">
        <div class="flex gap-1" id="${toolId}_tabs">
          <button data-lang="fetch" class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent">fetch</button>
          <button data-lang="axios" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">axios</button>
          <button data-lang="python" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">python</button>
          <button data-lang="go" class="px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text">go</button>
        </div>
        <button id="${toolId}_btnCopy" class="px-2.5 py-1 text-[11px] font-mono bg-workspace-surface hover:bg-workspace-borderLight border border-workspace-border text-workspace-text rounded-lg">Copy Code</button>
      </div>

      <div class="flex-1 relative min-h-[90px]">
        <textarea id="${toolId}_output" readonly class="w-full h-full bg-workspace-bg border border-workspace-border rounded-lg p-2 font-mono text-[10px] text-workspace-accent focus:outline-none resize-none leading-relaxed"></textarea>
      </div>
    </div>
  `,
  init: (toolId) => {
    const input = document.getElementById(`${toolId}_input`);
    const output = document.getElementById(`${toolId}_output`);
    const btnSample = document.getElementById(`${toolId}_btnSample`);
    const btnCopy = document.getElementById(`${toolId}_btnCopy`);
    const tabsContainer = document.getElementById(`${toolId}_tabs`);

    let activeLang = 'fetch';

    function parseCurl(str) {
      if (!str) return null;
      let cleaned = str.trim().replace(/\\\n/g, ' ').replace(/\s+/g, ' ');
      if (!cleaned.toLowerCase().startsWith('curl')) return null;

      let method = 'GET';
      let url = '';
      const headers = {};
      let body = null;

      // Extract URL
      const urlMatch = cleaned.match(/curl\s+(?:-[^\s]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/i) ||
                       cleaned.match(/['"](https?:\/\/[^\s'"]+)['"]/i);
      if (urlMatch) url = urlMatch[1];

      // Extract Method
      const methodMatch = cleaned.match(/(?:-X|--request)\s+['"]?([A-Z]+)['"]?/i);
      if (methodMatch) method = methodMatch[1].toUpperCase();

      // Extract Headers
      const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/gi;
      let hMatch;
      while ((hMatch = headerRegex.exec(cleaned)) !== null) {
        const parts = hMatch[1].split(':');
        if (parts.length >= 2) {
          headers[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      }

      // Extract Data / Body
      const dataMatch = cleaned.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"]([\s\S]*?)['"](?:\s+-[a-zA-Z]|\s*$)/i);
      if (dataMatch) {
        body = dataMatch[1];
        if (method === 'GET') method = 'POST';
      }

      return { method, url, headers, body };
    }

    function generateCode(parsed, lang) {
      if (!parsed || !parsed.url) return '// Paste a valid cURL command to generate code.';

      const { method, url, headers, body } = parsed;

      if (lang === 'fetch') {
        const opts = { method };
        if (Object.keys(headers).length) opts.headers = headers;
        if (body) {
          try {
            opts.body = JSON.stringify(JSON.parse(body), null, 2);
          } catch (e) {
            opts.body = body;
          }
        }

        let code = `fetch("${url}", {\n  method: "${method}",\n`;
        if (Object.keys(headers).length) {
          code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
        }
        if (body) {
          try {
            JSON.parse(body);
            code += `  body: JSON.stringify(${body})\n`;
          } catch(e) {
            code += `  body: "${body.replace(/"/g, '\\"')}"\n`;
          }
        }
        code += `})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
        return code;
      }

      if (lang === 'axios') {
        let code = `const axios = require('axios');\n\naxios({\n  method: '${method.toLowerCase()}',\n  url: '${url}',\n`;
        if (Object.keys(headers).length) {
          code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
        }
        if (body) {
          try {
            JSON.parse(body);
            code += `  data: ${body}\n`;
          } catch(e) {
            code += `  data: "${body.replace(/"/g, '\\"')}"\n`;
          }
        }
        code += `})\n  .then(response => console.log(response.data))\n  .catch(error => console.error(error));`;
        return code;
      }

      if (lang === 'python') {
        let code = `import requests\n\nurl = "${url}"\n`;
        if (Object.keys(headers).length) {
          code += `headers = ${JSON.stringify(headers, null, 4)}\n`;
        }
        if (body) {
          try {
            JSON.parse(body);
            code += `data = ${body}\n`;
          } catch(e) {
            code += `data = "${body.replace(/"/g, '\\"')}"\n`;
          }
        }
        code += `\nresponse = requests.${method.toLowerCase()}(url`;
        if (Object.keys(headers).length) code += `, headers=headers`;
        if (body) {
          const isJson = (headers['Content-Type'] || '').toLowerCase().includes('json');
          code += isJson ? ', json=data' : ', data=data';
        }
        code += `)\nprint(response.json())`;
        return code;
      }

      if (lang === 'go') {
        return `package main\n\nimport (\n  "fmt"\n  "net/http"\n  "io"\n)\n\nfunc main() {\n  req, _ := http.NewRequest("${method}", "${url}", nil)\n  res, _ := http.DefaultClient.Do(req)\n  defer res.Body.Close()\n  body, _ := io.ReadAll(res.Body)\n  fmt.Println(string(body))\n}`;
      }

      return '';
    }

    function update() {
      const parsed = parseCurl(input.value);
      output.value = generateCode(parsed, activeLang);
    }

    if (btnSample) {
      btnSample.onclick = () => {
        input.value = `curl -X POST https://httpbin.org/post -H "Content-Type: application/json" -H "Authorization: Bearer token123" -d '{"hello":"world"}'`;
        update();
      };
    }

    if (input) input.addEventListener('input', update);

    if (tabsContainer) {
      tabsContainer.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          tabsContainer.querySelectorAll('button').forEach(b => {
            b.className = "px-2 py-0.5 rounded text-[11px] font-mono text-workspace-muted hover:text-workspace-text";
          });
          btn.className = "px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-workspace-surface text-workspace-accent";
          activeLang = btn.dataset.lang;
          update();
        };
      });
    }

    if (btnCopy) {
      btnCopy.onclick = () => {
        if (output && output.value) {
          navigator.clipboard.writeText(output.value);
          if (typeof showToast !== 'undefined') showToast(`Copied ${activeLang} code!`);
        }
      };
    }

    update();
  }
});
