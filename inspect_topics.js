const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'nag_pages_raw');
const files = fs.readdirSync(dir);

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const text = content.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, '\n')
                      .replace(/&nbsp;/g, ' ')
                      .replace(/&amp;/g, '&')
                      .replace(/&#39;/g, "'")
                      .replace(/\n\s*\n/g, '\n');

  // Look for "In this topic:" or numbered headings
  const topicIdx = text.indexOf('In this topic:');
  console.log(`=== ${file} ===`);
  if (topicIdx !== -1) {
    console.log(text.slice(topicIdx, topicIdx + 400).trim());
  } else {
    // Look for clinical terms
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5 && l.length < 60);
    console.log(lines.slice(10, 20).join(' | '));
  }
  console.log('-----------------------------------------');
});
