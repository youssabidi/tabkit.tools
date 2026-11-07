const fs = require('fs');

const files = [
  'about.html', 'contact.html', 'curl-converter.html', 'excel-formula-builder.html',
  'faq.html', 'guide.html', 'index.html', 'json-formatter.html', 'pdf-merger.html',
  'pdf-splitter.html', 'privacy.html', 'report-issue.html', 'terms.html', 'text-diff-checker.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/<meta\s+name=["']twitter:card["'][^>]*>/gi);
  console.log(f, m);
});
