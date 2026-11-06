const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('Auditing ' + files.length + ' HTML files for SEO depth...\n');

let countFaq = 0;
let countApp = 0;
let countBread = 0;
let shortWords = [];
let missingCanonical = [];
let missingOg = [];
let missingTwitter = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('WebApplication')) countApp++;
  if (c.includes('FAQPage')) countFaq++;
  if (c.includes('BreadcrumbList')) countBread++;
  if (!c.includes('<link rel="canonical"')) missingCanonical.push(f);
  if (!c.includes('og:title')) missingOg.push(f);
  if (!c.includes('twitter:card')) missingTwitter.push(f);

  const body = c.replace(/<head[\s\S]*?<\/head>/gi, '')
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<style[\s\S]*?<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/&[a-z0-9#]+;/gi, ' ');
  const words = body.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (words < 400 && f !== 'terms.html' && f !== 'contact.html') {
    shortWords.push({ f, words });
  }
});

console.log('=== SCHEMA & STRUCTURED DATA ===');
console.log(`- WebApplication schema: ${countApp} / ${files.length}`);
console.log(`- FAQPage schema:        ${countFaq} / ${files.length}`);
console.log(`- BreadcrumbList schema: ${countBread} / ${files.length}`);

console.log('\n=== META INTEGRITY ===');
console.log(`- Missing canonical:     ${missingCanonical.length}`);
console.log(`- Missing OpenGraph:     ${missingOg.length}`);
console.log(`- Missing Twitter Card:  ${missingTwitter.length}`);

console.log('\n=== CONTENT DEPTH (< 400 words) ===');
console.log(`Total thin content pages: ${shortWords.length}`);
shortWords.sort((a, b) => a.words - b.words);
shortWords.forEach(item => {
  console.log(`  * ${item.f.padEnd(45)} ${item.words} words`);
});
