const fs = require('fs');

function extractLines(code) {
  const raw = fs.readFileSync(`nag_pages_raw/${code}.html`, 'utf8');
  const noScripts = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  let body = noScripts;
  const adultIdx = body.search(/<span[^>]*>\s*ADULT\s*<\/span>|>\s*ADULT\s*<|class="[^"]*wHaque[^"]*">\s*ADULT/i);
  if (adultIdx !== -1) {
    body = body.substring(adultIdx);
  } else {
    const h1Idx = body.indexOf(`>${code}:`) !== -1 ? body.indexOf(`>${code}:`) : body.indexOf(`${code}:`);
    if (h1Idx !== -1) body = body.substring(h1Idx);
  }

  const refIdx = body.search(/>\s*REFERENCES\s*<|id="h\.[a-z0-9_]*references"|>\s*Sub-Committee\s*</i);
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

  return clean.split('\n').map(l => l.trim()).filter(Boolean);
}

module.exports = { extractLines };
