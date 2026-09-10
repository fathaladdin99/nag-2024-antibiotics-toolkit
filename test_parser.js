const fs = require('fs');

function extractPageContent(code) {
  const raw = fs.readFileSync(`nag_pages_raw/${code}.html`, 'utf8');
  const noScripts = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  let body = noScripts;
  // Look for "ADULT" header or section title in the body
  const adultIdx = body.indexOf('>ADULT<');
  if (adultIdx !== -1) {
    body = body.substring(adultIdx);
  } else {
    const h1Idx = body.indexOf(`>${code}:`) !== -1 ? body.indexOf(`>${code}:`) : body.indexOf(`${code}:`);
    if (h1Idx !== -1) body = body.substring(h1Idx);
  }

  // Remove references / footer if present
  const refIdx = body.search(/>\s*REFERENCES\s*<|>\s*Sub-Committee\s*<|id="h\.[a-z0-9_]*references"/i);
  if (refIdx !== -1 && refIdx > 500) {
    body = body.substring(0, refIdx);
  }

  const clean = body
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  return lines;
}

const lines = extractPageContent('A10');
console.log('Lines 50 to 120:');
console.log(lines.slice(50, 120).join('\n'));
