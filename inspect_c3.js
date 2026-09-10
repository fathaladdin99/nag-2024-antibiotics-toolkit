const fs = require('fs');
const content = fs.readFileSync('nag_pages_raw/C3.html', 'utf8');
const clean = content.replace(/<script[\s\S]*?<\/script>/gi, '')
                     .replace(/<style[\s\S]*?<\/style>/gi, '')
                     .replace(/<[^>]+>/g, '\n')
                     .replace(/&nbsp;/g, ' ')
                     .replace(/&amp;/g, '&')
                     .replace(/&#39;/g, "'")
                     .replace(/\n\s*\n/g, '\n');

const idx = clean.indexOf('PHARYNGITIS');
console.log(clean.slice(idx - 100, idx + 1500));
