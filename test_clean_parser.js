const fs = require('fs');
const path = require('path');

for (let i = 1; i <= 14; i++) {
  const code = 'B' + i;
  const filePath = path.join(__dirname, 'nag_pages_raw', `${code}.html`);
  if (!fs.existsSync(filePath)) {
    console.log(`${code} does not exist`);
    continue;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  // Strip scripts, styles, svgs
  const stripped = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');
  
  // Find where content starts
  // Look for "In this topic:" first
  let tocIdx = stripped.search(/In this topic:/i);
  if (tocIdx === -1) {
    // If no TOC, look for B1: or B8: in the main text
    tocIdx = stripped.search(new RegExp(`>[0-9]+\\.\\s+[A-Z]`, 'i'));
  }

  // Find where references start
  let endIdx = stripped.search(/>\s*REFERENCES\s*<|id="h\.[a-z0-9_]*references"/i);
  
  let content = stripped;
  if (tocIdx !== -1) {
    if (endIdx !== -1 && endIdx > tocIdx) {
      content = stripped.substring(tocIdx, endIdx);
    } else {
      content = stripped.substring(tocIdx);
    }
  }

  const clean = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  const topics = lines.filter(l => /^[0-9]+(\.[0-9]+)*\s+[A-Za-z]/.test(l) && !/preferred|alternative|comments|duration|references/i.test(l));
  console.log(`${code}: lines=${lines.length}, candidate topics=${topics.length}`);
  console.log('   Sample topics:', topics.slice(0, 5));
}
