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

  // Find start of content
  const tocIdx = body.search(/In this topic:/i);
  if (tocIdx !== -1) {
    body = body.substring(tocIdx);
  } else {
    const h1Idx = body.search(new RegExp(`>${code}:|id="h\\.[a-z0-9_]+"[^>]*>${code}:`, 'i'));
    if (h1Idx !== -1) {
      body = body.substring(h1Idx);
    }
  }

  // Find end of content (References / Sub-committee / Footer)
  const refIdx = body.search(/>\s*REFERENCES\s*<|id="h\.[a-z0-9_]*references"|>\s*Sub-Committee\s*<|published by:|report abuse/i);
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

function parseAllPaediatricSections() {
  const allConditions = [];

  for (const sec of bSections) {
    const lines = extractCleanLines(sec.code);
    if (lines.length === 0) continue;

    // Determine startIdx by skipping the TOC list
    let startIdx = 0;
    const tocIdx = lines.findIndex(l => /in this topic:/i.test(l));
    if (tocIdx !== -1) {
      // Find when 1. appears again after tocIdx + 1
      for (let i = tocIdx + 2; i < Math.min(lines.length, tocIdx + 30); i++) {
        if (/^1\./.test(lines[i])) {
          startIdx = i;
          break;
        }
      }
      if (startIdx === 0) startIdx = tocIdx + 1;
    }

    let currentParentTopic = sec.name;
    let currentCond = null;
    let currentField = 'clinicalCriteria';

    const headingRegex = /^([0-9]+(?:\.[0-9]+)*\.?[\s\u00a0]+[A-Za-z]|SEPTIC ARTHRITIS|OSTEOMYELITIS)/;

    const isNonHeading = (l) => {
      return /^(preferred|alternative|comments|remarks|duration|total duration|criteria|organisms|reference|mg\/kg|weeks for|days for|petaling jaya|report abuse|table [0-9]|note:|caution)/i.test(l) ||
        l.length > 120;
    };

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];

      if (/^copyright ©|^published by:|^pharmaceutical services programme|^ministry of health \(malaysia\)|^for any enquiries|^page updated|^report abuse/i.test(line)) {
        continue;
      }

      if (headingRegex.test(line) && !isNonHeading(line)) {
        const isSubTopic = /^[0-9]+\.[0-9]+/.test(line);

        if (currentCond) {
          if (currentCond.preferred.length > 0 || currentCond.alternative.length > 0 || currentCond.allergy.length > 0 || currentCond.clinicalCriteria.length > 0 || currentCond.comments.length > 0) {
            allConditions.push(finalizeCondition(currentCond));
          }
        }

        if (!isSubTopic) {
          currentParentTopic = line;
        }

        currentCond = {
          id: `${sec.code.toLowerCase()}_cond_${allConditions.length + 1}`,
          sectionCode: sec.code,
          sectionName: sec.name,
          category: sec.shortName,
          parentTopic: currentParentTopic,
          title: line,
          clinicalCriteria: [],
          commonOrganisms: [],
          preferred: [],
          alternative: [],
          allergy: [],
          comments: [],
          rawLines: [line]
        };
        currentField = 'clinicalCriteria';
        continue;
      }

      if (!currentCond) {
        currentCond = {
          id: `${sec.code.toLowerCase()}_cond_${allConditions.length + 1}`,
          sectionCode: sec.code,
          sectionName: sec.name,
          category: sec.shortName,
          parentTopic: currentParentTopic,
          title: currentParentTopic || sec.name,
          clinicalCriteria: [],
          commonOrganisms: [],
          preferred: [],
          alternative: [],
          allergy: [],
          comments: [],
          rawLines: []
        };
      }

      currentCond.rawLines.push(line);

      const lower = line.toLowerCase();
      if (lower.startsWith('common organism') || lower.startsWith('common etiology') || lower.startsWith('pathogen')) {
        currentField = 'organisms';
        continue;
      } else if (line === 'Preferred' || lower === 'preferred' || lower === 'preferred regimen' || lower === 'preferred therapy') {
        currentField = 'preferred';
        continue;
      } else if (line === 'Alternative' || lower === 'alternative' || lower === 'alternative regimen' || lower === 'alternative therapy') {
        currentField = 'alternative';
        continue;
      } else if (lower.includes('antibiotic allergy') || lower.includes('penicillin allergy') || lower === 'allergy:') {
        currentField = 'allergy';
        if (line.includes(':') && line.length > 25) {
          currentCond.allergy.push(line);
        }
        continue;
      } else if (line === 'Comments' || lower === 'comments' || lower.startsWith('comments:') || lower.startsWith('remarks:')) {
        currentField = 'comments';
        if (line.includes(':') && line.length > 15) {
          currentCond.comments.push(line.replace(/^comments:?\s*/i, ''));
        }
        continue;
      }

      switch (currentField) {
        case 'organisms':
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

    if (currentCond && (currentCond.preferred.length > 0 || currentCond.alternative.length > 0 || currentCond.clinicalCriteria.length > 0 || currentCond.comments.length > 0)) {
      allConditions.push(finalizeCondition(currentCond));
    }
  }

  return allConditions;
}

function finalizeCondition(cond) {
  return {
    id: cond.id,
    sectionCode: cond.sectionCode,
    sectionName: cond.sectionName,
    category: cond.category,
    parentTopic: cond.parentTopic,
    title: cond.title,
    clinicalCriteria: cond.clinicalCriteria.join('\n').trim(),
    commonOrganisms: cond.commonOrganisms.join('\n').trim(),
    preferred: cond.preferred,
    alternative: cond.alternative,
    allergy: cond.allergy,
    comments: cond.comments.join('\n').trim(),
    verbatimText: cond.rawLines.join('\n').trim()
  };
}

const conditions = parseAllPaediatricSections();
console.log(`Parsed ${conditions.length} paediatric conditions across B1 to B14!`);

const counts = {};
conditions.forEach(c => {
  counts[c.sectionCode] = (counts[c.sectionCode] || 0) + 1;
});
console.log('Section counts:', counts);

fs.writeFileSync(path.join(__dirname, 'public', 'data', 'paediatric_all_conditions.json'), JSON.stringify(conditions, null, 2));
console.log('Saved to public/data/paediatric_all_conditions.json');
