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

function parseSection(sec) {
  const lines = extractLines(sec);
  if (lines.length === 0) return [];

  // Skip table of contents: find where "In this topic:" ends or where the first actual condition begins
  let startIdx = 0;
  const inThisTopicIdx = lines.findIndex(l => l.toLowerCase().includes('in this topic:'));
  if (inThisTopicIdx !== -1) {
    // Look for the first line after inThisTopicIdx that repeats a heading or starts section 1
    // Usually "In this topic:" lists 1. ..., 2. ... and then the content begins with 1. ...
    // Let's find index where the actual content starts (typically after 5-15 TOC items)
    let foundStart = false;
    for (let i = inThisTopicIdx + 1; i < Math.min(lines.length, inThisTopicIdx + 30); i++) {
      // Check if line looks like start of topic 1
      if (/^1\.\s+|^1\.1\s+/i.test(lines[i]) && i > inThisTopicIdx + 3) {
        startIdx = i;
        foundStart = true;
        break;
      }
    }
    if (!foundStart) {
      startIdx = inThisTopicIdx + 1;
    }
  }

  // Now scan through content lines and split into conditions
  const conditions = [];
  let currentCond = null;
  let currentSection = 'meta'; // meta, common_organisms, preferred, alternative, allergy, comments

  // Regex to detect condition headings:
  // e.g. "1.1 Tonsilitis/Pharyngitis", "1.2 Acute Peritonsillar...", "1. ASYMPTOMATIC BACTERIURIA", "2. UNCOMPLICATED UTI", "2.1 Acute Rhinosinusitis"
  // or uppercase headings like "NATIVE VALVE ENDOCARDITIS (NVE)"
  const headingRegex = /^([0-9]+\.[0-9]+|[0-9]+\.)\s+[A-Z]/;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    if (headingRegex.test(line) && !line.startsWith('10.') && !line.startsWith('12.')) {
      // New condition
      if (currentCond) {
        conditions.push(currentCond);
      }
      currentCond = {
        id: `${sec.code}_cond_${conditions.length + 1}`,
        sectionCode: sec.code,
        sectionName: sec.name,
        category: sec.category,
        title: line,
        commonOrganisms: [],
        clinicalCriteria: [],
        preferred: [],
        alternative: [],
        allergy: [],
        comments: [],
        rawLines: [line]
      };
      currentSection = 'meta';
      continue;
    }

    if (!currentCond) {
      // Pre-condition content or section intro
      continue;
    }

    currentCond.rawLines.push(line);

    // Check for section transitions
    const lower = line.toLowerCase();
    if (lower.startsWith('common organism') || lower.startsWith('common etiology')) {
      currentSection = 'common_organisms';
      continue;
    } else if (line === 'Preferred' || lower === 'preferred regimen' || lower === 'preferred treatment' || lower === 'preferred therapy') {
      currentSection = 'preferred';
      continue;
    } else if (line === 'Alternative' || lower === 'alternative regimen' || lower === 'alternative therapy' || lower === 'alternative treatment') {
      currentSection = 'alternative';
      continue;
    } else if (lower.includes('antibiotic allergy') || lower.includes('penicillin allergy') || lower.includes('allergy:')) {
      currentSection = 'allergy';
      if (line.includes(':') && line.length > 20) {
        currentCond.allergy.push(line);
      }
      continue;
    } else if (line === 'Comments' || lower === 'comments' || lower.startsWith('comments:') || lower.startsWith('remarks:')) {
      currentSection = 'comments';
      if (line.includes(':') && line.length > 15) {
        currentCond.comments.push(line.replace(/^comments:?\s*/i, ''));
      }
      continue;
    }

    // Append to current section
    switch (currentSection) {
      case 'common_organisms':
        currentCond.commonOrganisms.push(line);
        break;
      case 'preferred':
        currentCond.preferred.push(line);
        break;
      case 'alternative':
        currentCond.alternative.push(line);
        break;
      case 'allergy':
        currentCond.allergy.push(line);
        break;
      case 'comments':
        currentCond.comments.push(line);
        break;
      default:
        currentCond.clinicalCriteria.push(line);
        break;
    }
  }

  if (currentCond) {
    conditions.push(currentCond);
  }

  return conditions;
}

// Test on A10 and A17
const condsA10 = parseSection(adultSections.find(s => s.code === 'A10'));
console.log('A10 conditions count:', condsA10.length);
condsA10.forEach((c, idx) => {
  console.log(`  [${idx + 1}] ${c.title}`);
  if (idx === 0) {
    console.log('      Comments:', c.comments.join(' | '));
  }
});

const condsA17 = parseSection(adultSections.find(s => s.code === 'A17'));
console.log('A17 conditions count:', condsA17.length);
condsA17.forEach((c, idx) => {
  console.log(`  [${idx + 1}] ${c.title}`);
});
