const https = require('https');
const http = require('http');

async function followRedirects(url, maxRedirects = 6) {
  let currentUrl = url;
  for (let i = 0; i < maxRedirects; i++) {
    const protocol = currentUrl.startsWith('https') ? https : http;
    const res = await new Promise((resolve, reject) => {
      const req = protocol.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, location: res.headers.location, body }));
      });
      req.on('error', reject);
    });

    console.log(`[Step ${i + 1}] ${currentUrl} -> Status ${res.statusCode}`);
    if (res.location) {
      currentUrl = res.location.startsWith('http') ? res.location : new URL(res.location, currentUrl).href;
      console.log(`         Redirected to: ${currentUrl}`);
    } else {
      // Find title in body if 200
      const titleMatch = res.body.match(/<title[^>]*>([^<]+)<\/title>/i);
      console.log(`         Final Page Title: ${titleMatch ? titleMatch[1].trim() : 'No title'}`);
      return { finalUrl: currentUrl, title: titleMatch ? titleMatch[1].trim() : '' };
    }
  }
}

(async () => {
  const urls = [
    'https://link.amazon/B0inHT0lN',
    'https://link.amazon/B0i6SAtdd',
    'https://link.amazon/B00cgBBMj'
  ];
  for (const u of urls) {
    console.log(`\n================================`);
    console.log(`Tracing: ${u}`);
    try {
      await followRedirects(u);
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
})();
