const fs = require('fs');
const content = fs.readFileSync('registry.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);
const tools = Object.keys(sandbox.window.TOOLS_REGISTRY);
console.log('Total tools:', tools.length);
const byCategory = {};
for (const id of tools) {
  const cat = sandbox.window.TOOLS_REGISTRY[id].category || 'Other';
  byCategory[cat] = byCategory[cat] || [];
  byCategory[cat].push(id);
}
for (const cat in byCategory) {
  console.log(`\n=== Category: ${cat} (${byCategory[cat].length} tools) ===`);
  console.log(byCategory[cat].join(', '));
}
