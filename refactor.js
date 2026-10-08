const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'qr-code-generator.html');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add components.js script tag before </head>
  if (!content.includes('<script src="components.js"></script>')) {
    content = content.replace(/<\/head>/i, '  <script src="components.js"></script>\n</head>');
  }

  // 2. Replace <header>...</header> with <tool-header tool-name="...">
  const toolName = path.basename(file, '.html');
  const headerRegex = /<header[\s\S]*?<\/header>/i;
  content = content.replace(headerRegex, `<tool-header tool-name="${toolName}"></tool-header>`);

  // 3. Replace <footer>...</footer> with <tabkit-footer>
  const footerRegex = /<footer[\s\S]*?<\/footer>/i;
  content = content.replace(footerRegex, `<tabkit-footer></tabkit-footer>`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${file}`);
}
