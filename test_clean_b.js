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

function extractCleanLines(code) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${code}.html`);
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, 'utf8');
  const noScripts = raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  let body = noScripts;
  const paedsIdx = body.search(/<span[^>]*>\s*PAEDIATRIC[S]?\s*<\/span>|>\s*PAEDIATRIC[S]?\s*<|class="[^"]*wHaque[^"]*">\s*PAEDIATRIC[S]?/i);
  if (paedsIdx !== -1) {
    body = body.substring(paedsIdx);
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

for (const s of bSections) {
  const lines = extractCleanLines(s.code);
  console.log(`${s.code} (${s.name}): ${lines.length} lines`);
}
