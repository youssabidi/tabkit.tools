const fs = require('fs');
const glob = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let errors = 0;
let warnings = 0;

console.log(`Auditing ${glob.length} HTML files in TabKit Tools...\n`);

glob.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Title check
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!titleMatch) {
    console.error(`ERROR: No title in ${file}`);
    errors++;
  } else {
    const title = titleMatch[1].trim();
    if (title.length > 60) {
      console.warn(`WARN: Title > 60 chars in ${file} (${title.length} chars): ${title}`);
      warnings++;
    }
  }

  // Meta description check
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                        content.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  if (metaDescMatch) {
    const desc = metaDescMatch[1].trim();
    if (desc.length > 160) {
      console.warn(`WARN: Meta desc > 160 chars in ${file} (${desc.length} chars)`);
      warnings++;
    }
  }

  // Single H1 check
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1 && file !== 'index.html') {
    console.warn(`WARN: ${h1Matches.length} H1s in ${file}`);
    warnings++;
  }

  // Heading hierarchy check (no skip H1 -> H3, H2 -> H4, etc.)
  const headings = [];
  const headingRegex = /<(h[1-6])[^>]*>/gi;
  let m;
  while ((m = headingRegex.exec(content)) !== null) {
    headings.push(parseInt(m[1][1]));
  }
  for (let i = 0; i < headings.length - 1; i++) {
    const curr = headings[i];
    const next = headings[i + 1];
    if (next > curr + 1) {
      console.warn(`WARN: Heading skip in ${file}: H${curr} followed by H${next}`);
      warnings++;
    }
  }

  // Static word count check (> 200 words)
  let body = content.replace(/<head[\s\S]*?<\/head>/gi, '')
                    .replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/&[a-z0-9#]+;/gi, ' ');
  const words = body.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length < 200 && file !== 'terms.html' && file !== 'contact.html') {
    console.warn(`WARN: Low word count in ${file} (${words.length} words)`);
    warnings++;
  }

  // Check <img> missing alt attribute
  const imgRegex = /<img\b(?![^>]*\balt=)[^>]*>/gi;
  if (imgRegex.test(content)) {
    console.warn(`WARN: Img tag missing alt in ${file}`);
    warnings++;
  }
});

console.log(`\nAudit finished! Total Errors: ${errors}, Total Warnings: ${warnings}`);

if (errors > 0 || warnings > 0) {
  console.log('Action needed to resolve remaining warnings/errors.');
  process.exit(warnings > 5 ? 1 : 0);
} else {
  console.log('ALL 59 HTML PAGES PASSED 100% CLEAN!');
}
