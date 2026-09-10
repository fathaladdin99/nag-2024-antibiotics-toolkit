const fs = require('fs');
const path = require('path');

// Let's inspect B9, B8, B1, B3, B7, B12, B14 texts to get exact doses
function getSectionText(file, startTerm, endTerm) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${file}.html`);
  if (!fs.existsSync(filePath)) return '';
  const content = fs.readFileSync(filePath, 'utf8');
  const clean = content.replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, '\n')
                       .replace(/&nbsp;/g, ' ')
                       .replace(/&amp;/g, '&')
                       .replace(/&#39;/g, "'")
                       .replace(/\n\s*\n/g, '\n');
  const sIdx = clean.indexOf(startTerm);
  if (sIdx === -1) return '';
  const eIdx = endTerm ? clean.indexOf(endTerm, sIdx + startTerm.length) : sIdx + 2000;
  return clean.slice(sIdx, eIdx !== -1 ? eIdx : sIdx + 2000);
}

console.log('=== B9 Rhinosinusitis & Epiglottitis ===');
console.log(getSectionText('B9', 'RHINOSINUSITIS', '3. ACUTE OTITIS MEDIA'));
console.log(getSectionText('B9', 'ACUTE EPIGLOTTITIS', 'LATEST UPDATES'));

console.log('=== B8 Septic Arthritis ===');
console.log(getSectionText('B8', 'Preferred', 'Comments'));

console.log('=== B1 Infective Endocarditis ===');
console.log(getSectionText('B1', 'INFECTIVE ENDOCARDITIS', '4. CULTURE-NEGATIVE'));

console.log('=== B3 Chemoprophylaxis Non-Surgical ===');
console.log(getSectionText('B3', 'CARDIOVASCULAR', '3. TROPICAL'));
