const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the entire tailwind script block and any custom <style> block with our new CSS file
  
  // Replace the CDN script
  content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '<link rel="stylesheet" href="styles.css" />');
  
  // Replace the config script
  content = content.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, '');

  // Replace the inline style block since it's now in styles.css
  content = content.replace(/<style>[\s\S]*?<\/style>/, '');

  // Remove duplicate <link rel="stylesheet" href="styles.css" /> if they occur next to each other from the replacements
  content = content.replace(/(<link rel="stylesheet" href="styles.css" \/>\s*)+/, '<link rel="stylesheet" href="styles.css" />\n  ');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated CSS link in ${file}`);
}
