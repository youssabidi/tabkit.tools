const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load registry
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('registry.js', 'utf8'), sandbox);
const registry = sandbox.window.TOOLS_REGISTRY;
const registryKeys = Object.keys(registry);

console.log('=== 1. REGISTRY & FILE PARITY AUDIT ===');
console.log(`Tools registered in registry.js: ${registryKeys.length}`);

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html');
const metaPages = ['index.html', 'about.html', 'faq.html', 'guide.html', 'contact.html', 'report-issue.html', 'privacy.html', 'terms.html'];
const toolHtmlFiles = htmlFiles.filter(f => !metaPages.includes(f));

console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Meta/support HTML pages: ${metaPages.length}`);
console.log(`Tool HTML files: ${toolHtmlFiles.length}`);

// Parity checks
const toolsWithoutHtml = registryKeys.filter(k => !fs.existsSync(`${k}.html`));
const htmlWithoutRegistry = toolHtmlFiles.filter(f => {
  const k = f.replace('.html', '');
  return !registry[k] && !(k === 'random-password-generator' && registry['secure-password-generator']);
});

console.log('Registry tools missing HTML page:', toolsWithoutHtml);
console.log('Tool HTML pages not in registry.js:', htmlWithoutRegistry);

// Check tools/ JS files
const toolJsFiles = fs.existsSync('tools') ? fs.readdirSync('tools').filter(f => f.endsWith('.js')) : [];
console.log(`Tools with workbench module in tools/: ${toolJsFiles.length}`);
const registryWithoutToolJs = registryKeys.filter(k => {
  const expectedJs = `${k}.js`;
  return !toolJsFiles.includes(expectedJs) && !(k === 'secure-password-generator' && toolJsFiles.includes('secure-password-generator.js'));
});
console.log('Registry tools without tools/*.js workbench implementation:', registryWithoutToolJs);

// Check sitemap.xml parity
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const missingFromSitemap = [];
htmlFiles.forEach(f => {
  const slug = f === 'index.html' ? '' : f.replace('.html', '');
  const url = `https://tabkit.tools/${slug}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    missingFromSitemap.push(f);
  }
});
console.log(`HTML files missing from sitemap.xml: ${missingFromSitemap.length}`, missingFromSitemap);

// Check duplicate meta tags & metadata health
console.log('\n=== 2. METADATA & META TAG AUDIT ===');
let dupTwitter = [];
let dupCanonical = [];
let dupH1 = [];
let missingH1 = [];
let badDesc = [];
let badTitle = [];

htmlFiles.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const twitterMatches = html.match(/name=["']twitter:card["']/gi) || [];
  if (twitterMatches.length > 1) dupTwitter.push({ f, count: twitterMatches.length });

  const canonMatches = html.match(/<link\s+rel=["']canonical["']/gi) || [];
  if (canonMatches.length > 1) dupCanonical.push({ f, count: canonMatches.length });

  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length > 1) dupH1.push({ f, count: h1Matches.length });
  if (h1Matches.length === 0) missingH1.push(f);

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || titleMatch[1].length < 15 || titleMatch[1].length > 75) {
    badTitle.push({ f, title: titleMatch ? titleMatch[1] : 'NONE', len: titleMatch ? titleMatch[1].length : 0 });
  }

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!descMatch || descMatch[1].length < 50 || descMatch[1].length > 180) {
    badDesc.push({ f, desc: descMatch ? descMatch[1] : 'NONE', len: descMatch ? descMatch[1].length : 0 });
  }
});

console.log(`Duplicate twitter:card tags found: ${dupTwitter.length}`);
if (dupTwitter.length > 0) console.log('Sample files with duplicate twitter:card:', dupTwitter.slice(0, 5));
console.log(`Duplicate canonical tags: ${dupCanonical.length}`);
console.log(`Duplicate H1 tags: ${dupH1.length}`);
console.log(`Missing H1 tags: ${missingH1.length}`);
console.log(`Suboptimal title lengths (<15 or >75 chars): ${badTitle.length}`);
console.log(`Suboptimal description lengths (<50 or >180 chars): ${badDesc.length}`);

// Check Console Logs & Debug Artifacts
console.log('\n=== 3. DEBUG & CONSOLE ARTIFACTS ===');
const jsFilesToCheck = ['components.js', 'utils.js', 'sw.js', 'registry.js'];
jsFilesToCheck.forEach(f => {
  if (fs.existsSync(f)) {
    const code = fs.readFileSync(f, 'utf8');
    const logs = (code.match(/console\.(log|debug|warn|error)/g) || []).length;
    const alertCalls = (code.match(/\balert\s*\(/g) || []).length;
    const debuggerCalls = (code.match(/\bdebugger\b/g) || []).length;
    console.log(`${f.padEnd(16)} -> console calls: ${logs}, alerts: ${alertCalls}, debugger: ${debuggerCalls}`);
  }
});

// Check Service Worker Caching list vs disk
console.log('\n=== 4. SERVICE WORKER & PWA AUDIT ===');
const swCode = fs.readFileSync('sw.js', 'utf8');
const assetsMatch = swCode.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/);
if (assetsMatch) {
  const assets = eval(`[${assetsMatch[1]}]`);
  console.log(`Service worker cache asset count: ${assets.length}`);
  const missingCacheFiles = [];
  assets.forEach(a => {
    if (a !== '/') {
      const p = a.startsWith('/') ? a.slice(1) : a;
      if (!fs.existsSync(p)) missingCacheFiles.push(a);
    }
  });
  console.log('Cache assets missing on disk:', missingCacheFiles);
}

// Manifest check
if (fs.existsSync('manifest.json')) {
  try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    console.log(`Web Manifest valid JSON. Name: "${manifest.name}", Short: "${manifest.short_name}"`);
    console.log(`Icons declared: ${manifest.icons ? manifest.icons.length : 0}`);
    if (manifest.icons) {
      manifest.icons.forEach(ic => {
        const p = ic.src.startsWith('/') ? ic.src.slice(1) : ic.src;
        console.log(`  Icon ${ic.sizes}: ${ic.src} -> exists on disk: ${fs.existsSync(p)}`);
      });
    }
  } catch (err) {
    console.error('manifest.json JSON parse error:', err.message);
  }
}

// Security & external endpoints check
console.log('\n=== 5. SECURITY & THIRD PARTY SCRIPTS ===');
const externalScripts = new Set();
htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const scripts = c.match(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/gi) || [];
  scripts.forEach(s => {
    const srcMatch = s.match(/src=["'](https?:\/\/[^"']+)["']/i);
    if (srcMatch) {
      const u = new URL(srcMatch[1]);
      externalScripts.add(u.origin);
    }
  });
});
console.log('External script origins across all HTML pages:', Array.from(externalScripts));
