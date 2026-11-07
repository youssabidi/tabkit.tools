const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));
const results = {
  hardcoded64: [],
  hardcodedYear: [],
  hardcodedVersion: [],
  duplicateRegistry: []
};

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (/64\s*tools/i.test(c) || /All\s*\(64\)/.test(c)) {
    results.hardcoded64.push(f);
  }
  if (c.includes('2026') && (c.includes('&copy;') || c.includes('©') || c.includes('Copyright'))) {
    results.hardcodedYear.push(f);
  }
  if (c.includes('registry.js?v=') || c.includes('tabkit-v')) {
    results.hardcodedVersion.push(f);
  }
});

console.log('=== HARDCODED STRINGS & VALUES ===');
console.log(`1. Hardcoded "64 tools" in ${results.hardcoded64.length} files:`, results.hardcoded64);
console.log(`2. Hardcoded Copyright Year in ${results.hardcodedYear.length} files:`, results.hardcodedYear);
console.log(`3. Hardcoded cache-buster or versioning:`, results.hardcodedVersion);

// Check components.js TABKIT_TOOLS_MAP vs registry.js TOOLS_REGISTRY
const componentsJs = fs.readFileSync('components.js', 'utf8');
const registryJs = fs.readFileSync('registry.js', 'utf8');
console.log('4. components.js defines its own TABKIT_TOOLS_MAP:', componentsJs.includes('TABKIT_TOOLS_MAP ='));
console.log('   registry.js defines window.TOOLS_REGISTRY:', registryJs.includes('TOOLS_REGISTRY ='));

// Check package.json scripts
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('5. package.json scripts:', pkg.scripts);
} else {
  console.log('5. package.json does not exist!');
}
