const fs = require('fs');
const path = require('path');

const adultSections = [
  { code: 'A1', name: 'Cardiovascular Infections', shortName: 'Cardiovascular' },
  { code: 'A2', name: 'Central Nervous Infections', shortName: 'CNS' },
  { code: 'A3', name: 'Chemoprophylaxis', shortName: 'Prophylaxis' },
  { code: 'A4', name: 'Gastrointestinal & Hepatobiliary Infections', shortName: 'GI & Hepatobiliary' },
  { code: 'A5', name: 'Infections In Immunocompromised Patients', shortName: 'Immunocompromised' },
  { code: 'A6', name: 'Obstetrics & Gynaecological Infections', shortName: 'O&G' },
  { code: 'A7', name: 'Ocular Infections', shortName: 'Ocular' },
  { code: 'A8', name: 'Oral / Dental Infections', shortName: 'Dental' },
  { code: 'A9', name: 'Orthopaedic Infections', shortName: 'Orthopaedic' },
  { code: 'A10', name: 'Otorhinolaryngology Infections', shortName: 'ENT' },
  { code: 'A11', name: 'Respiratory Infections', shortName: 'Respiratory' },
  { code: 'A12', name: 'Sepsis', shortName: 'Sepsis' },
  { code: 'A13', name: 'Sexually Transmitted Infections', shortName: 'STD' },
  { code: 'A14', name: 'Skin & Soft Tissue Infections', shortName: 'Skin & Soft Tissue' },
  { code: 'A15', name: 'Trauma Related Infections', shortName: 'Trauma' },
  { code: 'A16', name: 'Tropical Infections', shortName: 'Tropical' },
  { code: 'A17', name: 'Urinary Tract Infections', shortName: 'Urinary' }
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
  // Look for ADULT header or section title in the body
  const adultIdx = body.search(/<span[^>]*>\s*ADULT\s*<\/span>|>\s*ADULT\s*<|class="[^"]*wHaque[^"]*">\s*ADULT/i);
  if (adultIdx !== -1) {
    body = body.substring(adultIdx);
  } else {
    const h1Idx = body.indexOf(`>${code}:`) !== -1 ? body.indexOf(`>${code}:`) : body.indexOf(`${code}:`);
    if (h1Idx !== -1) body = body.substring(h1Idx);
  }

  // Remove references / footer if present
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

module.exports = { extractCleanLines, adultSections };
