const fs = require('fs');
const path = require('path');

const bSections = [
  { code: 'B1', name: 'Cardiovascular Infections', shortName: 'Cardiovascular' },
  { code: 'B2', name: 'Central Nervous Infections', shortName: 'CNS' },
  { code: 'B3', name: 'Chemoprophylaxis', shortName: 'Prophylaxis' },
  { code: 'B4', name: 'Gastrointestinal Infections', shortName: 'Gastrointestinal' },
  { code: 'B5', name: 'Infections In Immunocompromised Patients', shortName: 'Immunocompromised' },
  { code: 'B6', name: 'Neonatal Infections', shortName: 'Neonatal' },
  { code: 'B7', name: 'Ocular Infections', shortName: 'Ocular' },
  { code: 'B8', name: 'Orthopaedic Infections', shortName: 'Orthopaedic' },
  { code: 'B9', name: 'Otorhinolaryngology Infections', shortName: 'ENT' },
  { code: 'B10', name: 'Respiratory Infections', shortName: 'Respiratory' },
  { code: 'B11', name: 'Skin & Soft Tissue Infections', shortName: 'Skin & Soft Tissue' },
  { code: 'B12', name: 'Tropical Infections', shortName: 'Tropical' },
  { code: 'B13', name: 'Urinary Tract Infections', shortName: 'Urinary' },
  { code: 'B14', name: 'Vascular Infections', shortName: 'Vascular' }
];

function cleanSectionLines(code) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${code}.html`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  let body = raw.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  
  const paedsIdx = body.search(/<span[^>]*>\s*PAEDIATRIC[S]?\s*<\/span>|>\s*PAEDIATRIC[S]?\s*</i);
  if (paedsIdx !== -1) body = body.substring(paedsIdx);
  else {
    const h1Idx = body.indexOf(`>${code}:`) !== -1 ? body.indexOf(`>${code}:`) : body.indexOf(`${code}:`);
    if (h1Idx !== -1) body = body.substring(h1Idx);
  }

  const refIdx = body.search(/>\s*REFERENCES\s*<|id="h\.[a-z0-9_]*references"|>\s*Sub-Committee\s*</i);
  if (refIdx !== -1 && refIdx > 500) body = body.substring(0, refIdx);

  const clean = body
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

  return clean.split('\n').map(l => l.trim()).filter(Boolean);
}

let totalAll = 0;
bSections.forEach(sec => {
  const lines = cleanSectionLines(sec.code);
  let startIdx = 0;
  const tocIdx = lines.findIndex(l => /in this topic:/i.test(l));
  if (tocIdx !== -1) {
    for (let i = tocIdx + 1; i < Math.min(lines.length, tocIdx + 25); i++) {
      if (/^(1\.|i\.)/i.test(lines[i]) && i > tocIdx + 2) {
        startIdx = i;
        break;
      }
    }
  }

  const condHeadings = [];
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    if (/^[0-9]+(\.[0-9]+)?\s+[A-Za-z]/.test(l) && !/preferred|alternative|comments|duration|references/i.test(l)) {
      condHeadings.push(l);
    }
  }
  totalAll += condHeadings.length;
  console.log(`${sec.code}: ${sec.name} -> ${condHeadings.length} topics:`, condHeadings);
});
console.log('TOTAL DETECTED TOPICS:', totalAll);
