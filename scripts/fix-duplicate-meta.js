const fs = require('fs');

const files = [
  'about.html', 'contact.html', 'curl-converter.html', 'excel-formula-builder.html',
  'faq.html', 'guide.html', 'index.html', 'json-formatter.html', 'pdf-merger.html',
  'pdf-splitter.html', 'privacy.html', 'report-issue.html', 'terms.html', 'text-diff-checker.html'
];

let cleaned = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/<meta\s+name=["']twitter:card["'][^>]*>\r?\n?/gi);
  if (matches && matches.length > 1) {
    // Keep the one near og:image / summary_large_image, remove the earlier one
    // Remove the first occurrence
    content = content.replace(/<meta\s+name=["']twitter:card["'][^>]*>\r?\n?/i, '');
    fs.writeFileSync(f, content, 'utf8');
    cleaned++;
    console.log(`Cleaned duplicate twitter:card in ${f}`);
  }
});

console.log(`Finished cleaning duplicate meta tags in ${cleaned} files!`);
