// Tool: sql-formatter (Client-Side SQL Query Beautifier & Minifier)
function formatSqlTool(toolId, minify = false) {
  const input = document.getElementById(`${toolId}_input`);
  if (!input || !input.value.trim()) return;

  const sql = input.value.trim();
  if (minify) {
    input.value = sql.replace(/\s+/g, ' ');
    if (typeof showToast !== 'undefined') showToast('SQL Minified!');
    return;
  }

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
    'OUTER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
    'ALTER TABLE', 'DROP TABLE', 'UNION ALL', 'UNION', 'ON', 'AS', 'IN', 'NOT IN',
    'EXISTS', 'NOT EXISTS', 'LIKE', 'BETWEEN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  let formatted = sql;

  // Uppercase keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  });

  // Major line breaks before top-level clauses
  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'VALUES', 'SET'
  ];

  majorClauses.forEach(clause => {
    const re = new RegExp(`\\s*\\b(${clause})\\b\\s*`, 'g');
    formatted = formatted.replace(re, '\n$1 ');
  });

  // Indent secondary conditions
  formatted = formatted.replace(/\s*\b(AND|OR)\b\s*/g, '\n  $1 ');

  // Clean trailing spaces and normalize line breaks
  formatted = formatted.split('\n').map(l => l.trimRight()).filter((l, i) => i === 0 || l.length > 0).join('\n').trim();

  input.value = formatted;
  if (typeof showToast !== 'undefined') showToast('SQL Beautified!');
}

window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['sql-formatter'] = Object.assign(window.TOOLS_REGISTRY['sql-formatter'] || {}, {
  id: 'sql-formatter',
  name: 'SQL Query Beautifier & Formatter',
  category: 'Developer',
  standaloneUrl: '/sql-formatter.html',
  description: 'Format, beautify, and capitalize SQL queries offline with clean clause indentation and minification.',
  render: (toolId) => `
    <div class="flex flex-col h-full space-y-2 font-sans text-xs">
      <textarea id="${toolId}_input" class="flex-1 w-full min-h-[160px] bg-workspace-bg border border-workspace-border rounded-lg p-2.5 font-mono text-[11px] text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none resize-none leading-relaxed select-text" placeholder="SELECT u.id, u.name, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.total > 100 AND u.status = 'active' ORDER BY o.total DESC LIMIT 10;"></textarea>

      <div class="flex items-center justify-between pt-1 border-t border-workspace-border text-[11px] font-mono">
        <div class="flex items-center gap-1.5">
          <button onclick="formatSqlTool('${toolId}', false)" class="px-3 py-1 bg-workspace-accent text-black font-bold rounded-lg hover:bg-workspace-accentHover transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">Beautify</button>
          <button onclick="formatSqlTool('${toolId}', true)" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-muted hover:text-workspace-text rounded-lg transition-all">Minify</button>
        </div>
        <button onclick="copyTextTool('${toolId}')" class="px-2.5 py-1 bg-workspace-bg border border-workspace-border hover:border-workspace-borderLight text-workspace-text rounded-lg transition-all">Copy</button>
      </div>
    </div>
  `,
  init: () => {}
});
