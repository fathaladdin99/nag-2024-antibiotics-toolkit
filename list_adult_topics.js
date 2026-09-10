const fs = require('fs');
const path = require('path');

const aFiles = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17'];

aFiles.forEach(code => {
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
      if (lines[i].startsWith('1.') || lines[i].startsWith('2.') || lines[i].startsWith('3.') || lines[i].startsWith('4.') || lines[i].startsWith('5.') || lines[i].startsWith('6.') || lines[i].startsWith('7.') || lines[i].startsWith('8.') || lines[i].startsWith('9.') || lines[i].startsWith('10.') || lines[i].startsWith('11.') || lines[i].startsWith('12.') || lines[i].startsWith('13.') || lines[i].startsWith('14.')) {
        topicLines.push(lines[i]);
      }
      if (topicLines.length > 15 || (topicLines.length > 0 && lines[i].includes('Preferred'))) {
        break;
      }
    }
  }
  console.log(topicLines.join('\n'));
});
