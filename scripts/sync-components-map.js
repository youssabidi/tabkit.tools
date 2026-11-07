const fs = require('fs');
const vm = require('vm');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('registry.js', 'utf8'), sandbox);
const registry = sandbox.window.TOOLS_REGISTRY;

const map = {};
Object.values(registry).forEach(t => {
  map[t.id] = { n: t.name, c: t.category };
});

const generatedMapString = `const TABKIT_TOOLS_MAP = ${JSON.stringify(map, null, 2)};`;

let componentsCode = fs.readFileSync('components.js', 'utf8');

// Replace TABKIT_TOOLS_MAP definition
const mapRegex = /const TABKIT_TOOLS_MAP = \{[\s\S]*?\};/;
if (mapRegex.test(componentsCode)) {
  componentsCode = componentsCode.replace(mapRegex, generatedMapString);
  console.log(`Synced TABKIT_TOOLS_MAP with ${Object.keys(map).length} tools from registry.js!`);
}

// Ensure year and counts are dynamic
componentsCode = componentsCode.replace(
  /&copy;\s*\d{4}\s*TabKit Tools\s*&bull;\s*Local-first browser workbench\s*\(\d+\s*tools\)\./,
  '&copy; ${new Date().getFullYear()} TabKit Tools &bull; Local-first browser workbench (${Object.keys(TABKIT_TOOLS_MAP).length} tools).'
);

componentsCode = componentsCode.replace(
  /<span>All \d+ tools<\/span>/,
  '<span>All ${Object.keys(TABKIT_TOOLS_MAP).length} tools</span>'
);

fs.writeFileSync('components.js', componentsCode, 'utf8');
console.log('components.js synced and automated!');
