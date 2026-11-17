const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const results = [];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<head[\s\S]*?<\/head>/gi, '');
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  content = content.replace(/<textarea[\s\S]*?<\/textarea>/gi, '');
  
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  const hasFaq = content.includes('Frequently Asked Questions');
  const hasHowTo = content.includes('How to') || content.includes('How To');
  results.push({ file, words, hasFaq, hasHowTo });
}

results.sort((a,b) => a.words - b.words);

console.log('=== THINNEST 20 PAGES ===');
results.slice(0, 20).forEach(r => console.log(r.file.padEnd(45) + ' | Words: ' + String(r.words).padStart(4) + ' | FAQ: ' + r.hasFaq + ' | HowTo: ' + r.hasHowTo));

console.log('\n=== SUMMARY ===');
console.log('Total HTML files: ' + results.length);
console.log('Pages with < 400 words: ' + results.filter(r => r.words < 400).length);
console.log('Pages with < 600 words: ' + results.filter(r => r.words < 600).length);
console.log('Pages missing FAQ: ' + results.filter(r => !r.hasFaq).length);
