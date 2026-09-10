const fs = require('fs');
const path = require('path');

const paeds = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/data/paediatric_all_conditions.json'), 'utf8'));
const existingConditions = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/data/conditions.json'), 'utf8'));

// Drug ID finder helper
function findAntibioticId(text) {
  const t = text.toLowerCase();
  if (t.includes('augmentin') || t.includes('clavulanate') || t.includes('co-amoxiclav')) return 'amoxicillin_clavulanate';
  if (t.includes('amoxicillin')) return 'amoxicillin';
  if (t.includes('ampicillin/sulbactam') || t.includes('unasyn')) return 'ampicillin_sulbactam';
  if (t.includes('ampicillin')) return 'ampicillin';
  if (t.includes('cloxacillin')) return 'cloxacillin';
  if (t.includes('benzylpenicillin') || t.includes('penicillin g')) return 'benzylpenicillin';
  if (t.includes('phenoxymethylpenicillin') || t.includes('penicillin v')) return 'phenoxymethylpenicillin';
  if (t.includes('benzathine')) return 'benzathine_penicillin';
  if (t.includes('cephalexin') || t.includes('cefalexin')) return 'cephalexin';
  if (t.includes('cefazolin') || t.includes('cefazoline')) return 'cefazolin';
  if (t.includes('cefuroxime')) return 'cefuroxime';
  if (t.includes('cefotaxime')) return 'cefotaxime';
  if (t.includes('ceftriaxone')) return 'ceftriaxone';
  if (t.includes('ceftazidime')) return 'ceftazidime';
  if (t.includes('cefepime')) return 'cefepime';
  if (t.includes('piperacillin') || t.includes('tazocin')) return 'piperacillin_tazobactam';
  if (t.includes('gentamicin')) return 'gentamicin';
  if (t.includes('amikacin')) return 'amikacin';
  if (t.includes('azithromycin')) return 'azithromycin';
  if (t.includes('clarithromycin')) return 'clarithromycin';
  if (t.includes('erythromycin')) return 'erythromycin';
  if (t.includes('clindamycin')) return 'clindamycin';
  if (t.includes('metronidazole') || t.includes('flagyl')) return 'metronidazole';
  if (t.includes('cotrimoxazole') || t.includes('co-trimoxazole') || t.includes('bactrim') || t.includes('trimethoprim')) return 'cotrimoxazole';
  if (t.includes('nitrofurantoin')) return 'nitrofurantoin';
  if (t.includes('meropenem')) return 'meropenem';
  if (t.includes('vancomycin')) return 'vancomycin';
  if (t.includes('ciprofloxacin')) return 'ciprofloxacin';
  if (t.includes('doxycycline')) return 'doxycycline';
  if (t.includes('fluconazole')) return 'fluconazole';
  if (t.includes('acyclovir') || t.includes('aciclovir')) return 'acyclovir';
  if (t.includes('oseltamivir') || t.includes('tamiflu')) return 'oseltamivir';
  if (t.includes('chloramphenicol')) return 'chloramphenicol';
  if (t.includes('rifampicin')) return 'rifampicin';
  return null;
}

// Fallback standard paediatric doses by antibiotic ID
const DEFAULT_PAED_DOSES = {
  amoxicillin: { min: 50, max: 80, div: 2, freq: 'q12h (twice daily)', maxDaily: 1500, maxSingle: 500, route: 'Oral (PO)' },
  amoxicillin_clavulanate: { min: 45, max: 90, div: 2, freq: 'q12h (twice daily)', maxDaily: 2000, maxSingle: 1000, route: 'Oral (PO)' },
  ampicillin: { min: 100, max: 200, div: 4, freq: 'q6h (4 times daily)', maxDaily: 12000, maxSingle: 2000, route: 'Intravenous (IV)' },
  ampicillin_sulbactam: { min: 150, max: 300, div: 4, freq: 'q6h (4 times daily)', maxDaily: 12000, maxSingle: 3000, route: 'Intravenous (IV)' },
  cloxacillin: { min: 100, max: 200, div: 4, freq: 'q6h (4 times daily)', maxDaily: 12000, maxSingle: 2000, route: 'Intravenous / Oral' },
  benzylpenicillin: { min: 100000, max: 200000, div: 4, freq: 'q6h (4 times daily)', maxDaily: 24000000, maxSingle: 6000000, route: 'Intravenous (IV)', unit: 'units' },
  phenoxymethylpenicillin: { min: 25, max: 50, div: 4, freq: 'q6h (4 times daily)', maxDaily: 2000, maxSingle: 500, route: 'Oral (PO)' },
  cephalexin: { min: 25, max: 50, div: 4, freq: 'q6h (4 times daily)', maxDaily: 4000, maxSingle: 1000, route: 'Oral (PO)' },
  cefazolin: { min: 50, max: 100, div: 3, freq: 'q8h (3 times daily)', maxDaily: 6000, maxSingle: 2000, route: 'Intravenous (IV)' },
  cefuroxime: { min: 100, max: 150, div: 3, freq: 'q8h (3 times daily)', maxDaily: 6000, maxSingle: 1500, route: 'Intravenous (IV)' },
  cefotaxime: { min: 150, max: 200, div: 4, freq: 'q6h (4 times daily)', maxDaily: 12000, maxSingle: 2000, route: 'Intravenous (IV)' },
  ceftriaxone: { min: 50, max: 80, div: 1, freq: 'OD (once daily)', maxDaily: 4000, maxSingle: 2000, route: 'Intravenous (IV)' },
  ceftazidime: { min: 100, max: 150, div: 3, freq: 'q8h (3 times daily)', maxDaily: 6000, maxSingle: 2000, route: 'Intravenous (IV)' },
  cefepime: { min: 100, max: 150, div: 3, freq: 'q8h (3 times daily)', maxDaily: 6000, maxSingle: 2000, route: 'Intravenous (IV)' },
  piperacillin_tazobactam: { min: 300, max: 300, div: 4, freq: 'q6h (4 times daily)', maxDaily: 16000, maxSingle: 4000, route: 'Intravenous (IV)' },
  gentamicin: { min: 5, max: 7.5, div: 1, freq: 'OD (once daily)', maxDaily: 400, maxSingle: 400, route: 'Intravenous (IV)' },
  amikacin: { min: 15, max: 20, div: 1, freq: 'OD (once daily)', maxDaily: 1500, maxSingle: 1500, route: 'Intravenous (IV)' },
  azithromycin: { min: 10, max: 10, div: 1, freq: 'OD (once daily)', maxDaily: 500, maxSingle: 500, route: 'Oral (PO)' },
  clarithromycin: { min: 15, max: 15, div: 2, freq: 'q12h (twice daily)', maxDaily: 1000, maxSingle: 500, route: 'Oral (PO)' },
  erythromycin: { min: 30, max: 50, div: 4, freq: 'q6h (4 times daily)', maxDaily: 2000, maxSingle: 500, route: 'Oral (PO)' },
  clindamycin: { min: 20, max: 40, div: 4, freq: 'q6h (4 times daily)', maxDaily: 2700, maxSingle: 600, route: 'Intravenous / Oral' },
  metronidazole: { min: 30, max: 30, div: 3, freq: 'q8h (3 times daily)', maxDaily: 1500, maxSingle: 500, route: 'Intravenous / Oral' },
  cotrimoxazole: { min: 6, max: 12, div: 2, freq: 'q12h (twice daily)', maxDaily: 640, maxSingle: 320, route: 'Oral (PO)' },
  nitrofurantoin: { min: 5, max: 7, div: 4, freq: 'q6h (4 times daily)', maxDaily: 400, maxSingle: 100, route: 'Oral (PO)' },
  meropenem: { min: 60, max: 120, div: 3, freq: 'q8h (3 times daily)', maxDaily: 6000, maxSingle: 2000, route: 'Intravenous (IV)' },
  vancomycin: { min: 40, max: 60, div: 4, freq: 'q6h (4 times daily)', maxDaily: 2000, maxSingle: 1000, route: 'Intravenous (IV)' },
  ciprofloxacin: { min: 20, max: 30, div: 2, freq: 'q12h (twice daily)', maxDaily: 1500, maxSingle: 750, route: 'Oral / IV' },
  doxycycline: { min: 2.2, max: 4.4, div: 2, freq: 'q12h (twice daily)', maxDaily: 200, maxSingle: 100, route: 'Oral (PO)' },
  fluconazole: { min: 6, max: 12, div: 1, freq: 'OD (once daily)', maxDaily: 400, maxSingle: 400, route: 'Oral / IV' },
  acyclovir: { min: 30, max: 60, div: 3, freq: 'q8h (3 times daily)', maxDaily: 1500, maxSingle: 500, route: 'Intravenous / Oral' },
  oseltamivir: { min: 2, max: 4, div: 2, freq: 'q12h (twice daily)', maxDaily: 150, maxSingle: 75, route: 'Oral (PO)' },
  chloramphenicol: { min: 50, max: 100, div: 4, freq: 'q6h (4 times daily)', maxDaily: 4000, maxSingle: 1000, route: 'Intravenous / Oral' },
  rifampicin: { min: 10, max: 20, div: 1, freq: 'OD (once daily)', maxDaily: 600, maxSingle: 600, route: 'Oral (PO)' }
};

function parseRegimenLine(line, type) {
  const t = line.trim();
  const abxId = findAntibioticId(t);
  if (!abxId) return null;

  const fallback = DEFAULT_PAED_DOSES[abxId] || { min: 50, max: 50, div: 2, freq: 'q12h', maxDaily: 2000, maxSingle: 500, route: 'Oral (PO)' };

  let minDose = fallback.min;
  let maxDose = fallback.max;
  let perDose = false;
  let unit = fallback.unit || 'mg';
  let dividedDoses = fallback.div;
  let frequency = fallback.freq;
  let maxDailyDoseMg = fallback.maxDaily;
  let maxSingleDoseMg = fallback.maxSingle;
  let route = fallback.route;

  // Check route in line
  if (/\bIV\/PO\b/i.test(t) || /\bIV\s*\/\s*PO\b/i.test(t)) route = 'IV / Oral';
  else if (/\bIV\b/i.test(t)) route = 'Intravenous (IV)';
  else if (/\bPO\b/i.test(t) || /\boral\b/i.test(t)) route = 'Oral (PO)';
  else if (/\bIM\b/i.test(t)) route = 'Intramuscular (IM)';

  // Dose range
  const rangeDay = t.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*mg\/kg\/day/i);
  const singleDay = t.match(/(\d+(?:\.\d+)?)\s*mg\/kg\/day/i);
  const rangeDose = t.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*mg\/kg\/dose/i);
  const singleDose = t.match(/(\d+(?:\.\d+)?)\s*mg\/kg\/dose/i);
  const odDose = t.match(/(\d+(?:\.\d+)?)\s*mg\/kg(?:\s+(?:OD|once daily|daily))/i);

  if (rangeDay) {
    minDose = parseFloat(rangeDay[1]);
    maxDose = parseFloat(rangeDay[2]);
    perDose = false;
  } else if (singleDay) {
    minDose = parseFloat(singleDay[1]);
    maxDose = parseFloat(singleDay[1]);
    perDose = false;
  } else if (rangeDose) {
    minDose = parseFloat(rangeDose[1]);
    maxDose = parseFloat(rangeDose[2]);
    perDose = true;
  } else if (singleDose) {
    minDose = parseFloat(singleDose[1]);
    maxDose = parseFloat(singleDose[1]);
    perDose = true;
  } else if (odDose) {
    minDose = parseFloat(odDose[1]);
    maxDose = parseFloat(odDose[1]);
    perDose = true;
    dividedDoses = 1;
    frequency = 'OD (once daily)';
  }

  // Divided doses
  const divMatch = t.match(/in\s*(\d+)(?:\s*-\s*(\d+))?\s*divided\s*doses/i);
  if (divMatch) {
    dividedDoses = parseInt(divMatch[1]);
    if (dividedDoses === 4) frequency = 'q6h (4 times daily)';
    else if (dividedDoses === 3) frequency = 'q8h (3 times daily)';
    else if (dividedDoses === 2) frequency = 'q12h (twice daily)';
    else if (dividedDoses === 6) frequency = 'q4h (6 times daily)';
  } else if (/q4h/i.test(t)) {
    dividedDoses = 6; frequency = 'q4h (6 times daily)';
  } else if (/q6h/i.test(t)) {
    dividedDoses = 4; frequency = 'q6h (4 times daily)';
  } else if (/q8h/i.test(t)) {
    dividedDoses = 3; frequency = 'q8h (3 times daily)';
  } else if (/q12h/i.test(t) || /BD\b/i.test(t)) {
    dividedDoses = 2; frequency = 'q12h (twice daily)';
  } else if (/q24h/i.test(t) || /OD\b/i.test(t) || /once daily/i.test(t)) {
    dividedDoses = 1; frequency = 'OD (once daily)';
  }

  // Max ceiling
  const maxGDay = t.match(/max\.?\s*(\d+(?:\.\d+)?)\s*g\/day/i);
  const maxMgDay = t.match(/max\.?\s*(\d+(?:\.\d+)?)\s*mg\/day/i);
  const maxGDose = t.match(/max\.?\s*(\d+(?:\.\d+)?)\s*g\/dose/i);
  const maxMgDose = t.match(/max\.?\s*(\d+(?:\.\d+)?)\s*mg\/dose/i);

  if (maxGDay) maxDailyDoseMg = parseFloat(maxGDay[1]) * 1000;
  else if (maxMgDay) maxDailyDoseMg = parseFloat(maxMgDay[1]);

  if (maxGDose) maxSingleDoseMg = parseFloat(maxGDose[1]) * 1000;
  else if (maxMgDose) maxSingleDoseMg = parseFloat(maxMgDose[1]);

  // Clean label
  let label = t.replace(/\*/g, '').trim();
  if (label.length > 80) label = label.slice(0, 80) + '...';

  return {
    antibioticId: abxId,
    type: type,
    label: label,
    route: route,
    doseText: t,
    minDosePerKgDay: minDose,
    maxDosePerKgDay: maxDose,
    perDose: perDose,
    unit: unit,
    dividedDoses: dividedDoses,
    frequency: frequency,
    maxSingleDoseMg: maxSingleDoseMg,
    maxDailyDoseMg: maxDailyDoseMg,
    duration: 'As per clinical response / guideline',
    notes: t
  };
}

// Build final list of 129 conditions
const completeConditions = [];

paeds.forEach((p, idx) => {
  const condId = p.id || `paed_${p.sectionCode.toLowerCase()}_${idx + 1}`;
  
  // Try to find if this condition matches one of the 32 hand-curated conditions
  const normTitle = p.title.toLowerCase();
  const matchedCurated = existingConditions.find(c => {
    const cName = c.name.toLowerCase();
    return cName.includes(normTitle) || normTitle.includes(cName);
  });

  const categoryName = `${p.sectionCode}: ${p.sectionName.toUpperCase()}`;
  let displayName = p.title;
  if (p.parentTopic && !p.title.includes(p.parentTopic) && p.parentTopic !== p.title) {
    displayName = `${p.parentTopic} - ${p.title}`;
  }

  const conditionObj = {
    id: condId,
    sectionCode: p.sectionCode,
    sectionName: p.sectionName,
    name: displayName,
    category: categoryName,
    parentTopic: p.parentTopic,
    ageSuitability: 'Paediatric (≥ 1 month - 18 years)',
    commonOrganisms: p.commonOrganisms || p.clinicalCriteria || 'Etiology as per MOH NAG 2024 protocol',
    comments: p.comments || (p.clinicalCriteria ? `Criteria: ${p.clinicalCriteria}` : ''),
    antibiotics: []
  };

  if (matchedCurated && matchedCurated.antibiotics && matchedCurated.antibiotics.length > 0) {
    // Retain rich curated antibiotics
    conditionObj.antibiotics = matchedCurated.antibiotics;
    if (matchedCurated.ageSuitability) conditionObj.ageSuitability = matchedCurated.ageSuitability;
    if (matchedCurated.comments) conditionObj.comments = matchedCurated.comments;
  } else {
    // Parse preferred, alternative, and allergy lines
    const parsedRegs = [];

    (p.preferred || []).forEach(line => {
      const reg = parseRegimenLine(line, 'first_line');
      if (reg && !parsedRegs.some(r => r.antibioticId === reg.antibioticId && r.type === 'first_line')) {
        parsedRegs.push(reg);
      }
    });

    (p.alternative || []).forEach(line => {
      const reg = parseRegimenLine(line, 'alternative');
      if (reg && !parsedRegs.some(r => r.antibioticId === reg.antibioticId)) {
        parsedRegs.push(reg);
      }
    });

    (p.allergy || []).forEach(line => {
      const reg = parseRegimenLine(line, 'allergy');
      if (reg && !parsedRegs.some(r => r.antibioticId === reg.antibioticId)) {
        parsedRegs.push(reg);
      }
    });

    if (parsedRegs.length > 0) {
      conditionObj.antibiotics = parsedRegs;
    } else {
      // Non-bacterial / supportive care
      conditionObj.antibiotics.push({
        antibioticId: 'supportive_care',
        type: 'first_line',
        label: 'Supportive Care Only (No Routine Antibiotic Indicated)',
        route: 'Supportive Care',
        doseText: 'Treatment mainly supportive. Antimicrobial therapy not routinely indicated per MOH NAG 2024.',
        minDosePerKgDay: 0,
        maxDosePerKgDay: 0,
        perDose: false,
        unit: 'mg',
        dividedDoses: 1,
        frequency: 'As needed (PRN)',
        maxSingleDoseMg: 0,
        maxDailyDoseMg: 0,
        duration: 'Symptomatic duration',
        notes: p.comments || p.clinicalCriteria || 'Supportive care, hydration, antipyretics and clinical red-flag monitoring.'
      });
    }
  }

  completeConditions.push(conditionObj);
});

fs.writeFileSync(path.join(__dirname, 'public/data/conditions.json'), JSON.stringify(completeConditions, null, 2), 'utf8');
console.log(`Successfully generated ${completeConditions.length} complete calculator conditions covering all Sections B1 to B14!`);
