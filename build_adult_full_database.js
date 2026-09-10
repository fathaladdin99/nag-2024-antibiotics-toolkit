const fs = require('fs');
const path = require('path');

const adultSections = [
  { code: 'A1', name: 'Cardiovascular Infections' },
  { code: 'A2', name: 'Central Nervous Infections' },
  { code: 'A3', name: 'Chemoprophylaxis' },
  { code: 'A4', name: 'Gastrointestinal & Hepatobiliary Infections' },
  { code: 'A5', name: 'Infections In Immunocompromised Patients' },
  { code: 'A6', name: 'Obstetrics & Gynaecological Infections' },
  { code: 'A7', name: 'Ocular Infections' },
  { code: 'A8', name: 'Oral / Dental Infections' },
  { code: 'A9', name: 'Orthopaedic Infections' },
  { code: 'A10', name: 'Otorhinolaryngology Infections' },
  { code: 'A11', name: 'Respiratory Infections' },
  { code: 'A12', name: 'Sepsis' },
  { code: 'A13', name: 'Sexually Transmitted Infections' },
  { code: 'A14', name: 'Skin & Soft Tissue Infections' },
  { code: 'A15', name: 'Trauma Related Infections' },
  { code: 'A16', name: 'Tropical Infections' },
  { code: 'A17', name: 'Urinary Tract Infections' }
];

function extractSectionContent(sec) {
  const filePath = path.join(__dirname, 'nag_pages_raw', `${sec.code}.html`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File missing for ${sec.code}`);
    return [];
  }

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

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);
  return lines;
}

// Inspect lines of each section
const sampleA10 = extractSectionContent({ code: 'A10', name: 'Otorhinolaryngology Infections' });
console.log('Sample A10 total lines:', sampleA10.length);
