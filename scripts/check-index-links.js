const fs = require('fs');
const vm = require('vm');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('registry.js', 'utf8'), sandbox);
const registry = sandbox.window.TOOLS_REGISTRY;
const toolKeys = Object.keys(registry);

const indexHtml = fs.readFileSync('index.html', 'utf8');

const unlinkedInIndex = [];
toolKeys.forEach(k => {
  const href1 = `href="/${k}"`;
  const href2 = `href="${k}"`;
  if (!indexHtml.includes(href1) && !indexHtml.includes(href2)) {
    unlinkedInIndex.push(k);
  }
});

console.log(`Total tools in registry: ${toolKeys.length}`);
console.log(`Tools linked directly on index.html: ${toolKeys.length - unlinkedInIndex.length}`);
console.log('Tools unlinked on index.html:', unlinkedInIndex);
