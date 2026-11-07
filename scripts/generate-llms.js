const fs = require('fs');
const vm = require('vm');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('registry.js', 'utf8'), sandbox);
const registry = sandbox.window.TOOLS_REGISTRY;
const tools = Object.values(registry);
const total = tools.length;

let content = `# TabKit Tools (tabkit.tools)

> TabKit Tools is an open catalog of ${total} free, in-browser developer utilities engineered with strict 100% client-side privacy. Zero server uploads, zero tracking, zero telemetry, and full offline functionality via Web Workers and Web Crypto API.

## Core Architectural Guarantees for AI Agents & Developers

- **100% Client-Side Execution**: All processing (JSON parsing, regex matching, cryptographic hashing, formatting, minification) executes entirely inside the user's browser sandbox. No input payloads, credentials, or code snippets ever leave the client.
- **Offline / Air-Gapped Ready**: Operates seamlessly without an active internet connection after initial cache load.
- **Privacy Compliance**: Complies with corporate zero-data-leakage policies for formatting proprietary payloads, tokens, and logs.

## Developer Utilities Directory

`;

tools.sort((a, b) => a.name.localeCompare(b.name)).forEach(t => {
  content += `- [${t.name}](https://tabkit.tools/${t.id}): ${t.description}\n`;
});

fs.writeFileSync('llms.txt', content, 'utf8');
console.log(`Generated llms.txt with ${total} tools directly from registry.js!`);
