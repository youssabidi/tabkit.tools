const fs = require('fs');

console.log('=== INVESTIGATING GSC ISSUES ACROSS CODEBASE ===\n');

// 1. Check for any .html in sitemap.xml
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapHtmlMatches = sitemap.match(/<loc>[^<]+\.html<\/loc>/g) || [];
console.log(`1. sitemap.xml entries ending in .html: ${sitemapHtmlMatches.length}`);
if (sitemapHtmlMatches.length) {
  console.log('   Entries:', sitemapHtmlMatches);
}

// 2. Check for any internal links with .html in all HTML and JS files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));
let hrefHtmlCount = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/href=["'](\/[^"'>\s]+\.html)["']/g) || [];
  if (matches.length > 0) {
    console.log(`   Found in ${f}:`, matches);
    hrefHtmlCount += matches.length;
  }
});
console.log(`2. Internal href links ending in .html: ${hrefHtmlCount}`);

// 3. Check for any canonical tags ending in .html or pointing to redirected URLs
let badCanonicals = 0;
files.filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canonMatch) {
    const url = canonMatch[1];
    if (url.endsWith('.html')) {
      console.log(`   Canonical ending in .html in ${f}: ${url}`);
      badCanonicals++;
    }
  }
});
console.log(`3. Canonical tags ending in .html: ${badCanonicals}`);

// 4. Check for alternate/canonical alias pages
let aliasPages = [];
files.filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const slug = f.replace('.html', '');
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/tabkit\.tools\/([^"']+)["']/i);
  if (canonMatch && canonMatch[1] !== slug && !(slug === 'index' && canonMatch[1] === '')) {
    aliasPages.push({ file: f, canonical: canonMatch[1] });
  }
});
console.log(`4. Alternate pages with proper canonical tag: ${aliasPages.length}`, aliasPages);
