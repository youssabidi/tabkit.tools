
import os, re
cluster = ['csv-to-excel.html', 'bank-statement-to-excel.html', 'excel-to-json.html', 'excel-transpose.html', 'excel-deduplicator.html']
path = r'C:\Users\bru_t\Desktop\Projects-Github\tabkit.tools'

print('--- CROSS-LINK CHECK ---')
for f in cluster:
    with open(os.path.join(path, f), 'r', encoding='utf-8') as file:
        content = file.read()
    other_links = [c for c in cluster if c in content]
    print(f'{f}: links to {other_links}')

print('\n--- H1 & INTRO CHECK ---')
keywords = {
    'csv-to-excel.html': 'convert csv to excel',
    'excel-transpose.html': 'excel transpose',
    'excel-deduplicator.html': 'remove duplicate rows in excel',
    'image-compressor.html': 'compress image',
    'date-calculator.html': 'date calculator'
}

for f, kw in keywords.items():
    with open(os.path.join(path, f), 'r', encoding='utf-8') as file:
        content = file.read()
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    p_match = re.search(r'<p[^>]*>(.*?)</p>', content, re.IGNORECASE | re.DOTALL)
    h1_text = re.sub(r'<[^>]+>', '', h1_match.group(1)) if h1_match else 'NOT FOUND'
    p_text = re.sub(r'<[^>]+>', '', p_match.group(1)) if p_match else 'NOT FOUND'
    
    h1_has = kw.lower() in h1_text.lower()
    p_has = kw.lower() in p_text.lower()
    print(f'{f} [Target: {kw}]\n  H1 ({h1_has}): {h1_text.strip()}\n  P ({p_has}): {p_text.strip()[:100]}\n')
