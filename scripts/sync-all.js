const { execSync } = require('child_process');

console.log('🚀 Running TabKit Tools Unified Build & Synchronization Pipeline...\n');

function run(step, script) {
  console.log(`[Step ${step}] Executing node scripts/${script}...`);
  try {
    const out = execSync(`node scripts/${script}`, { stdio: 'pipe', encoding: 'utf8' });
    console.log(out.trim());
    console.log(`✓ Step ${step} completed successfully.\n`);
  } catch (err) {
    console.error(`❌ Step ${step} failed:`, err.message);
    process.exit(1);
  }
}

run(1, 'sync-components-map.js');
run(2, 'generate-sitemap.js');
run(3, 'generate-llms.js');
run(4, 'generate-llms-full.js');
run(5, 'sync-schemas.js');
run(6, 'verify-seo.js');

console.log('🎉 Full pipeline synchronized and verified 100% clean!');
