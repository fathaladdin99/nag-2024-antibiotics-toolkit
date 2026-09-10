const fs = require('fs');

const content = fs.readFileSync('nag_pages_raw/C3.html', 'utf8');

// Look for iframes or drive embeds
const iframes = content.match(/<iframe[^>]*>/gi);
console.log('Iframes in C3:', iframes);

const driveLinks = content.match(/https:\/\/(?:drive|docs)\.google\.com\/[^\s"'<>]+/gi);
console.log('Drive/Docs links in C3:', driveLinks);

// Let's also check B9 (Otorhinolaryngology: Pharyngitis/Tonsillitis)
const b9 = fs.readFileSync('nag_pages_raw/B9.html', 'utf8');
const b9Text = b9.replace(/<script[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?<\/style>/gi, '')
                 .replace(/<[^>]+>/g, '\n')
                 .replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&#39;/g, "'")
                 .replace(/\n\s*\n/g, '\n');

const b9Idx = b9Text.indexOf('TONSILLITIS/PHARYNGITIS');
console.log('--- B9 TONSILLITIS / PHARYNGITIS Content ---');
console.log(b9Text.slice(b9Idx, b9Idx + 1200));
