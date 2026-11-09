const https = require('https');

const urls = [
  'https://link.amazon/B0inHT0lN',
  'https://link.amazon/B0i6SAtdd',
  'https://link.amazon/B00cgBBMj'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          headers: res.headers,
          bodySnippet: body.slice(0, 300)
        });
      });
    });
    req.on('error', (err) => resolve({ url, error: err.message }));
  });
}

(async () => {
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log('Result for:', u);
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers ? res.headers.location : 'none');
    console.log('Body:', res.bodySnippet);
    console.log('---');
  }
})();
