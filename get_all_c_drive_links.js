const fs = require('fs');
const path = require('path');

for (let i = 1; i <= 9; i++) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `C${i}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`C${i}: not found`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const iframeMatch = html.match(/data-src="([^"]+)"|src="([^"]+drive\.google\.com[^"]+)"/i);
  const pdfMatch = html.match(/aria-label="([^"]+)"/i);
  console.log(`C${i}:`);
  console.log('  Label:', pdfMatch ? pdfMatch[1] : 'none');
  console.log('  URL:', iframeMatch ? (iframeMatch[1] || iframeMatch[2]) : 'none');
}
