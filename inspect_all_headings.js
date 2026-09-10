const fs = require('fs');
const path = require('path');

const adultSections = [
  { code: 'A1', name: 'Cardiovascular Infections', category: 'Cardiovascular' },
  { code: 'A2', name: 'Central Nervous Infections', category: 'CNS' },
  { code: 'A3', name: 'Chemoprophylaxis', category: 'Prophylaxis' },
  { code: 'A4', name: 'Gastrointestinal & Hepatobiliary Infections', category: 'GI & Hepatobiliary' },
  { code: 'A5', name: 'Infections In Immunocompromised Patients', category: 'Immunocompromised' },
  { code: 'A6', name: 'Obstetrics & Gynaecological Infections', category: 'O&G' },
  { code: 'A7', name: 'Ocular Infections', category: 'Ocular' },
  { code: 'A8', name: 'Oral / Dental Infections', category: 'Dental' },
  { code: 'A9', name: 'Orthopaedic Infections', category: 'Orthopaedic' },
  { code: 'A10', name: 'Otorhinolaryngology Infections', category: 'ENT' },
  { code: 'A11', name: 'Respiratory Infections', category: 'Respiratory' },
  { code: 'A12', name: 'Sepsis', category: 'Sepsis' },
  { code: 'A13', name: 'Sexually Transmitted Infections', category: 'STD' },
  { code: 'A14', name: 'Skin & Soft Tissue Infections', category: 'Skin & Soft Tissue' },
  { code: 'A15', name: 'Trauma Related Infections', category: 'Trauma' },
  { code: 'A16', name: 'Tropical Infections', category: 'Tropical' },
  { code: 'A17', name: 'Urinary Tract Infections', category: 'Urinary' }
];

function extractLines(sec) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${sec.code}.html`);
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, 'utf8');
  const noScripts = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  let body = noScripts;
  const adultIdx = body.search(/<span[^>]*>\s*ADULT\s*<\/span>|>\s*ADULT\s*<|class="[^"]*wHaque[^"]*">\s*ADULT/i);
  if (adultIdx !== -1) {
    body = body.substring(adultIdx);
  } else {
    const h1Idx = body.indexOf(`>${sec.code}:`) !== -1 ? body.indexOf(`>${sec.code}:`) : body.indexOf(`${sec.code}:`);
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

for (const sec of adultSections) {
  const lines = extractLines(sec);
  console.log(`=== ${sec.code}: ${sec.name} (${lines.length} lines) ===`);
  const candidates = [];
  lines.forEach((l, idx) => {
    // Condition headings usually start with a number or roman numeral or ALL CAPS
    if (/^[0-9]+(\.[0-9]+)*\s+[A-Z]|^[iIvVxX]+\.\s+[A-Z]|^[A-Z\s\(\)\/-]{5,40}$/.test(l)) {
      if (!l.includes('PREFERRED') && !l.includes('ALTERNATIVE') && !l.includes('COMMENTS') && !l.includes('ORGANISM') && !l.includes('ADULT') && !l.includes('IN THIS TOPIC')) {
        candidates.push({ idx, text: l });
      }
    }
  });
  console.log(`Found ${candidates.length} candidates:`);
  console.log(candidates.slice(0, 10).map(c => `  - [${c.idx}] ${c.text}`).join('\n'));
}
