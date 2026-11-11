const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html');

console.log('=== 1. INTERNAL LINK AUDIT ===');
const existingFiles = new Set(files.map(f => f.replace('.html', '')));
existingFiles.add(''); // root /

const brokenLinks = [];
const externalLinks = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefMatches = content.match(/href=["'](\/[^"']*)["']/gi) || [];
  hrefMatches.forEach(m => {
    const raw = m.match(/href=["'](\/[^"']*)["']/i)[1];
    // ignore anchors or strip query/anchor
    const clean = raw.split('#')[0].split('?')[0].replace(/^\//, '');
    if (clean && !clean.startsWith('http') && !clean.includes('.') && !existingFiles.has(clean)) {
      brokenLinks.push({ file: f, href: raw });
    }
  });
});

console.log(`Broken internal links found: ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log('Broken link details:', brokenLinks);
}

console.log('\n=== 2. ACCESSIBILITY (A11Y) AUDIT ===');
const missingAlt = [];
const iconButtonsWithoutAria = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // img tags without alt
  const imgMatches = content.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || [];
  if (imgMatches.length > 0) {
    missingAlt.push({ file: f, count: imgMatches.length });
  }

  // button with only svg and no aria-label or text
  const buttonMatches = content.match(/<button\b[^>]*>([\s\S]*?)<\/button>/gi) || [];
  buttonMatches.forEach(b => {
    const hasAria = /aria-label=/i.test(b) || /title=/i.test(b);
    const innerText = b.replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<[^>]+>/g, '').trim();
    if (!hasAria && !innerText) {
      iconButtonsWithoutAria.push({ file: f, button: b.slice(0, 80) });
    }
  });
});

console.log(`Images missing alt attribute: ${missingAlt.length}`);
if (missingAlt.length > 0) console.log(missingAlt);
console.log(`Icon-only buttons missing aria-label or title: ${iconButtonsWithoutAria.length}`);
if (iconButtonsWithoutAria.length > 0) {
  console.log('Sample icon-only buttons missing aria:', iconButtonsWithoutAria.slice(0, 5));
}

console.log('\n=== 3. PLACEHOLDER & CODE SMELL AUDIT ===');
const placeholders = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  ['lorem ipsum', 'TODO:', 'FIXME:', 'test test', 'sample text'].forEach(ph => {
    if (new RegExp(ph, 'i').test(content)) {
      placeholders.push({ file: f, placeholder: ph });
    }
  });
});
console.log(`Placeholder occurrences found: ${placeholders.length}`);
if (placeholders.length > 0) console.log(placeholders);

console.log('\n=== 4. ASSET AUDIT & STYLES.CSS ===');
if (fs.existsSync('styles.css')) {
  const styles = fs.readFileSync('styles.css', 'utf8');
  console.log(`styles.css size: ${(styles.length / 1024).toFixed(1)} KB`);
  console.log(`@import rules: ${(styles.match(/@import/g) || []).length}`);
}
