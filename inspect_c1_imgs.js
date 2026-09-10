const fs = require('fs');

const html = fs.readFileSync('nag_pages_raw/C1.html', 'utf8');
const regex = /<img[^>]+>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('--- IMG ---');
  console.log(m[0]);
}

// Also let's check for iframe, drive, or embed links
const iframeRegex = /<iframe[^>]+>/gi;
while ((m = iframeRegex.exec(html)) !== null) {
  console.log('--- IFRAME ---');
  console.log(m[0]);
}
