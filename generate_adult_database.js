const fs = require('fs');
const path = require('path');
const { extractCleanLines, adultSections } = require('./test_clean_lines');

function parseAllAdultSections() {
  const allConditions = [];

  for (const sec of adultSections) {
    const lines = extractCleanLines(sec.code);
    if (lines.length === 0) continue;

    // Find where the table of contents ends
    let startIdx = 0;
    const tocIdx = lines.findIndex(l => /in this topic:/i.test(l));
    if (tocIdx !== -1) {
      // Find where topic 1 actually starts in content
      for (let i = tocIdx + 1; i < Math.min(lines.length, tocIdx + 40); i++) {
        if (/^(1\.|i\.|guide for choice)/i.test(lines[i]) && i > tocIdx + 2) {
          startIdx = i;
          break;
        }
      }
      if (startIdx === 0) startIdx = tocIdx + 1;
    }

    let currentParentTopic = sec.name;
    let currentCond = null;
    let currentField = 'clinicalCriteria'; // clinicalCriteria, organisms, preferred, alternative, allergy, comments

    // Regex for major parent topic: e.g. "1. COMMUNITY ACQUIRED PNEUMONIA (CAP)", "1. THROAT AND UPPER RESPIRATORY TRACT", "i. SURGICAL CHEMOPROHYLAXIS"
    const isMajorTopic = (l) => {
      return /^([0-9]+\.\s+[A-Z\s\(\)\/-]{4,}|[iIvVxX]+\.\s+[A-Z\s\(\)\/-]{4,})$/.test(l) &&
        !l.includes('PREFERRED') && !l.includes('ALTERNATIVE') && !l.includes('COMMENTS');
    };

    // Regex for condition / subcondition: e.g. "1.1 Tonsilitis/Pharyngitis", "1.1 Outpatient", "2. UNCOMPLICATED UTI", "1. ASYMPTOMATIC BACTERIURIA"
    const isConditionHeading = (l) => {
      if (/^[0-9]+(\.[0-9]+)+\s+[A-Za-z]/.test(l)) return true;
      if (/^[0-9]+\.\s+[A-Za-z]/.test(l) && !isMajorTopic(l)) return true;
      if (/^guide for choice of empirical therapy in sepsis/i.test(l)) return true;
      return false;
    };

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];

      // Ignore generic footer lines
      if (/^copyright ©|^published by:|^pharmaceutical services programme|^ministry of health \(malaysia\)|^for any enquiries|^page updated|^report abuse/i.test(line)) {
        continue;
      }

      if (isMajorTopic(line)) {
        currentParentTopic = line;
        // If we don't have any condition open, or the current condition is empty
        continue;
      }

      if (isConditionHeading(line)) {
        if (currentCond) {
          allConditions.push(finalizeCondition(currentCond));
        }

        currentCond = {
          id: `${sec.code}_${allConditions.length + 1}`,
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

      // If we haven't encountered a condition heading yet, create one for the parent topic
      if (!currentCond) {
        currentCond = {
          id: `${sec.code}_${allConditions.length + 1}`,
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

      // Section markers
      const lower = line.toLowerCase();
      if (lower.startsWith('common organism') || lower.startsWith('common etiology')) {
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

      // Append content based on current field
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

    if (currentCond) {
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

const conditions = parseAllAdultSections();
console.log(`Successfully parsed ${conditions.length} adult clinical conditions across all A1-A17!`);

// Summary per section
const sectionCounts = {};
conditions.forEach(c => {
  sectionCounts[c.sectionCode] = (sectionCounts[c.sectionCode] || 0) + 1;
});
console.log('Conditions per section:');
console.log(sectionCounts);

// Save to adult_conditions.json
const outputPath = path.join(__dirname, 'public', 'data', 'adult_conditions.json');
fs.writeFileSync(outputPath, JSON.stringify(conditions, null, 2), 'utf8');
console.log(`Saved to ${outputPath} (File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
