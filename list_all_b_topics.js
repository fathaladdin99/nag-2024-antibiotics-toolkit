const fs = require('fs');
const path = require('path');

const bFiles = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14'];

bFiles.forEach(code => {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${code}.html`);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const clean = content.replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, '\n')
                       .replace(/&nbsp;/g, ' ')
                       .replace(/&amp;/g, '&')
                       .replace(/&#39;/g, "'")
                       .replace(/\n\s*\n/g, '\n');

  console.log(`\n================= ${code} =================`);
  const lines = clean.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let inTopic = false;
  let topicLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('In this topic:')) {
      inTopic = true;
      continue;
    }
    if (inTopic) {
      if (lines[i].startsWith('1.') || lines[i].startsWith('2.') || lines[i].startsWith('3.') || lines[i].startsWith('4.') || lines[i].startsWith('5.') || lines[i].startsWith('6.') || lines[i].startsWith('7.') || lines[i].startsWith('8.') || lines[i].startsWith('9.') || lines[i].startsWith('i.') || lines[i].startsWith('ii.')) {
        topicLines.push(lines[i]);
      } else if (lines[i].toUpperCase() === lines[i] && lines[i].length > 4 && !lines[i].includes('MINISTRY') && !lines[i].includes('NATIONAL') && !lines[i].includes('CONTENTS') && !lines[i].includes('SECTION')) {
        topicLines.push(lines[i]);
      }
      if (topicLines.length > 15 || lines[i].includes('Preferred')) {
        break;
      }
    }
  }
  console.log(topicLines.join('\n'));
});
