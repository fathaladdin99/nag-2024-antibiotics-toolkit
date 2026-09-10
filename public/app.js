/**
 * NAG 2024 Paediatric Antibiotics Toolkit & Calculator
 * Author / Creator: fathirosli
 * MOH Malaysia National Antimicrobial Guideline Engine
 */

// Application State
const AppState = {
  conditions: [],
  antibiotics: [],
  neonatalDrugs: [],
  adultConditions: [],
  changelog: null,
  activeCondition: null,
  activeAntibiotic: null,
  activeFormulation: null,
  isDarkTheme: false
};

// DOM Elements Cache
const DOM = {};

document.addEventListener('DOMContentLoaded', async () => {
  initDOMElements();
  initTheme();
  initTabs();
  initEventListeners();
  await loadDatasets();
  initCalculator();
  initNeonatalCalculator();
  initAdultGuide();
  initPaediatricToolkit();
  initPathways();
  initClinicalTools();
  initDisclaimerAndFeedbackModals();
  checkLiveUpdates();
});

function initDOMElements() {
  DOM.themeToggleBtn = document.getElementById('themeToggleBtn');
  DOM.themeIcon = document.getElementById('themeIcon');
  DOM.navTabs = document.querySelectorAll('.nav-tab');
  DOM.tabContents = document.querySelectorAll('.tab-content');
  DOM.liveSyncChip = document.getElementById('liveSyncChip');
  DOM.syncChipText = document.getElementById('syncChipText');
  DOM.updateAlertDot = document.getElementById('updateAlertDot');

  // Calculator DOM
  DOM.ageYears = document.getElementById('ageYears');
  DOM.ageMonths = document.getElementById('ageMonths');
  DOM.patientWeight = document.getElementById('patientWeight');
  DOM.estimatedWeightHint = document.getElementById('estimatedWeightHint');
  DOM.conditionSearchInput = document.getElementById('conditionSearchInput');
  DOM.conditionSelect = document.getElementById('conditionSelect');
  DOM.conditionBadgeContainer = document.getElementById('conditionBadgeContainer');
  DOM.calcOpenNagBtn = document.getElementById('calcOpenNagBtn');
  DOM.antibioticSelect = document.getElementById('antibioticSelect');
  DOM.antibioticLineBadge = document.getElementById('antibioticLineBadge');
  DOM.antibioticNoteText = document.getElementById('antibioticNoteText');
  DOM.formulationSelect = document.getElementById('formulationSelect');
  DOM.customDoseToggle = document.getElementById('customDoseToggle');
  DOM.customDoseInputWrapper = document.getElementById('customDoseInputWrapper');
  DOM.customDoseInput = document.getElementById('customDoseInput');

  // Results DOM
  DOM.singleDoseMg = document.getElementById('singleDoseMg');
  DOM.singleDoseMl = document.getElementById('singleDoseMl');
  DOM.liquidVolumeBlock = document.getElementById('liquidVolumeBlock');
  DOM.liquidVolumeSublabel = document.getElementById('liquidVolumeSublabel');
  DOM.dosingFrequency = document.getElementById('dosingFrequency');
  DOM.dailyDoseMg = document.getElementById('dailyDoseMg');
  DOM.treatmentDuration = document.getElementById('treatmentDuration');
  DOM.calculatedMgPerKg = document.getElementById('calculatedMgPerKg');
  DOM.routeHeroTag = document.getElementById('routeHeroTag');
  DOM.awareClassificationBadge = document.getElementById('awareClassificationBadge');
  DOM.safetyGuardrailBox = document.getElementById('safetyGuardrailBox');
  DOM.safetyAlertTitle = document.getElementById('safetyAlertTitle');
  DOM.safetyAlertDesc = document.getElementById('safetyAlertDesc');
  DOM.whoWeightBandBox = document.getElementById('whoWeightBandBox');
  DOM.whoWeightBandText = document.getElementById('whoWeightBandText');
  DOM.applyWeightBandBtn = document.getElementById('applyWeightBandBtn');
  DOM.syringeAdviceText = document.getElementById('syringeAdviceText');
  DOM.administrationNotes = document.getElementById('administrationNotes');
  DOM.conditionCommentsText = document.getElementById('conditionCommentsText');
  DOM.renalAdjustmentText = document.getElementById('renalAdjustmentText');
  DOM.copyPrescriptionBtn = document.getElementById('copyPrescriptionBtn');
  DOM.printPrescriptionBtn = document.getElementById('printPrescriptionBtn');

  // Neonatal DOM
  DOM.neonatalWeight = document.getElementById('neonatalWeight');
  DOM.neonatalCGA = document.getElementById('neonatalCGA');
  DOM.neonatalPNA = document.getElementById('neonatalPNA');
  DOM.neonatalDrugSelect = document.getElementById('neonatalDrugSelect');
  DOM.neonatalDrugName = document.getElementById('neonatalDrugName');
  DOM.neonateSingleDoseMg = document.getElementById('neonateSingleDoseMg');
  DOM.neonateSingleDoseMl = document.getElementById('neonateSingleDoseMl');
  DOM.neonateInterval = document.getElementById('neonateInterval');
  DOM.neonateBaseFormula = document.getElementById('neonateBaseFormula');
  DOM.neonateTdmText = document.getElementById('neonateTdmText');
  DOM.neonateClinicalNotes = document.getElementById('neonateClinicalNotes');
  DOM.copyNeonatePrescriptionBtn = document.getElementById('copyNeonatePrescriptionBtn');

  // Guidelines / Paediatric Toolkit DOM
  DOM.guidelineSearchInput = document.getElementById('guidelineSearchInput');
  DOM.filterBtns = document.querySelectorAll('.filter-btn');
  DOM.paedFilterBtns = document.querySelectorAll('[data-paed-sec]');
  DOM.guidelinesContainer = document.getElementById('guidelinesContainer');

  // Pathways DOM
  DOM.pathwaysContainer = document.getElementById('pathwaysContainer');
  DOM.pathwayFilterBtns = document.querySelectorAll('[data-pathway-code]');
  DOM.pathwayModal = document.getElementById('pathwayModal');
  DOM.pathwayModalOverlay = document.getElementById('pathwayModalOverlay');
  DOM.closePathwayModalBtn = document.getElementById('closePathwayModalBtn');
  DOM.modalPathwayTitle = document.getElementById('modalPathwayTitle');
  DOM.modalPathwayImg = document.getElementById('modalPathwayImg');
  DOM.modalDriveLink = document.getElementById('modalDriveLink');
  DOM.modalNagLink = document.getElementById('modalNagLink');

  // Adult Guide DOM
  DOM.adultSearchInput = document.getElementById('adultSearchInput');
  DOM.adultFilterBtns = document.querySelectorAll('[data-adult-sec], [data-adult-cat]');
  DOM.adultConditionsContainer = document.getElementById('adultConditionsContainer');

  // Clinical Tools DOM
  DOM.egfrHeight = document.getElementById('egfrHeight');
  DOM.egfrCreatinine = document.getElementById('egfrCreatinine');
  DOM.egfrResultNumber = document.getElementById('egfrResultNumber');
  DOM.egfrStageTag = document.getElementById('egfrStageTag');
  DOM.egfrDoseAdvice = document.getElementById('egfrDoseAdvice');

  // Adult CrCl DOM
  DOM.crclAge = document.getElementById('crclAge');
  DOM.crclGender = document.getElementById('crclGender');
  DOM.crclWeight = document.getElementById('crclWeight');
  DOM.crclCreatinine = document.getElementById('crclCreatinine');
  DOM.crclResultNumber = document.getElementById('crclResultNumber');
  DOM.crclStageTag = document.getElementById('crclStageTag');
  DOM.crclDoseAdvice = document.getElementById('crclDoseAdvice');

  // Updates DOM
  DOM.checkUpdatesManualBtn = document.getElementById('checkUpdatesManualBtn');
  DOM.syncBannerTitle = document.getElementById('syncBannerTitle');
  DOM.syncBannerDesc = document.getElementById('syncBannerDesc');
  DOM.lastCheckedTime = document.getElementById('lastCheckedTime');
  DOM.changelogList = document.getElementById('changelogList');
  DOM.toastContainer = document.getElementById('toastContainer');

  // Disclaimer & Feedback Modals DOM
  DOM.disclaimerModal = document.getElementById('disclaimerModal');
  DOM.disclaimerModalOverlay = document.getElementById('disclaimerModalOverlay');
  DOM.disclaimerModalBtn = document.getElementById('disclaimerModalBtn');
  DOM.openDisclaimerModalBtn = document.getElementById('openDisclaimerModalBtn');
  DOM.closeDisclaimerModalBtn = document.getElementById('closeDisclaimerModalBtn');
  DOM.acknowledgeDisclaimerBtn = document.getElementById('acknowledgeDisclaimerBtn');

  DOM.feedbackModal = document.getElementById('feedbackModal');
  DOM.feedbackModalOverlay = document.getElementById('feedbackModalOverlay');
  DOM.feedbackNavBtn = document.getElementById('feedbackNavBtn');
  DOM.footerFeedbackBtn = document.getElementById('footerFeedbackBtn');
  DOM.closeFeedbackModalBtn = document.getElementById('closeFeedbackModalBtn');
  DOM.copyFeedbackEmailBtn = document.getElementById('copyFeedbackEmailBtn');
}

/* ==========================================================================
   Theme & Navigation Tabs
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('nag_theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    AppState.isDarkTheme = true;
    DOM.themeIcon.textContent = '☀️';
  }

  DOM.themeToggleBtn.addEventListener('click', () => {
    AppState.isDarkTheme = !AppState.isDarkTheme;
    if (AppState.isDarkTheme) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      DOM.themeIcon.textContent = '☀️';
      localStorage.setItem('nag_theme', 'dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      DOM.themeIcon.textContent = '🌙';
      localStorage.setItem('nag_theme', 'light');
    }
  });
}

function initTabs() {
  DOM.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });

  DOM.liveSyncChip.addEventListener('click', () => {
    switchTab('updatesTab');
  });
}

function switchTab(tabId) {
  DOM.navTabs.forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
  });
  DOM.tabContents.forEach(c => {
    c.classList.toggle('active', c.id === tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   Dataset Loader (Supports Node Server, Vercel & GitHub Pages)
   ========================================================================== */
async function loadDatasets() {
  const fetchJson = async (apiUrl, fallbackPath) => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) return await res.json();
    } catch (e) {
      // Ignore and fallback
    }
    const fallbackRes = await fetch(fallbackPath);
    return await fallbackRes.json();
  };

  try {
    const [condRes, abxRes, neoRes, clRes, adultRes, paedRes, pathRes] = await Promise.all([
      fetchJson('/api/conditions', 'data/conditions.json'),
      fetchJson('/api/antibiotics', 'data/antibiotics.json'),
      fetchJson('/api/neonatal', 'data/neonatal.json'),
      fetchJson('/api/changelog', 'data/changelog.json'),
      fetchJson('/api/adult-conditions', 'data/adult_conditions.json'),
      fetchJson('/api/paediatric-conditions', 'data/paediatric_all_conditions.json'),
      fetchJson('/api/pathways', 'data/pathways.json')
    ]);

    AppState.conditions = condRes;
    AppState.antibiotics = abxRes;
    AppState.neonatalDrugs = neoRes;
    AppState.changelog = clRes;
    AppState.adultConditions = adultRes;
    AppState.paediatricAllConditions = paedRes;
    AppState.pathways = pathRes;

    // Cache locally for offline capability
    localStorage.setItem('nag_cached_conditions', JSON.stringify(condRes));
    localStorage.setItem('nag_cached_antibiotics', JSON.stringify(abxRes));
    localStorage.setItem('nag_cached_adult', JSON.stringify(adultRes));
    localStorage.setItem('nag_cached_paed_all', JSON.stringify(paedRes));
    localStorage.setItem('nag_cached_pathways', JSON.stringify(pathRes));
  } catch (err) {
    console.warn('Network fetch error, attempting offline cache:', err);
    const cachedCond = localStorage.getItem('nag_cached_conditions');
    const cachedAbx = localStorage.getItem('nag_cached_antibiotics');
    const cachedAdult = localStorage.getItem('nag_cached_adult');
    const cachedPaed = localStorage.getItem('nag_cached_paed_all');
    const cachedPaths = localStorage.getItem('nag_cached_pathways');
    if (cachedCond && cachedAbx) {
      AppState.conditions = JSON.parse(cachedCond);
      AppState.antibiotics = JSON.parse(cachedAbx);
      if (cachedAdult) AppState.adultConditions = JSON.parse(cachedAdult);
      if (cachedPaed) AppState.paediatricAllConditions = JSON.parse(cachedPaed);
      if (cachedPaths) AppState.pathways = JSON.parse(cachedPaths);
      showToast('Loaded guidelines from offline cache');
    }
  }
}

/* ==========================================================================
   Paediatric Calculator Engine (Condition Filtered)
   ========================================================================== */
function initCalculator() {
  populateConditions();

  // Quick weight button events
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.patientWeight.value = btn.getAttribute('data-weight');
      recalculate();
    });
  });

  // Age changes
  DOM.ageYears.addEventListener('input', onAgeChange);
  DOM.ageMonths.addEventListener('input', onAgeChange);

  // Weight changes
  DOM.patientWeight.addEventListener('input', recalculate);

  // Quick search filter for condition
  if (DOM.conditionSearchInput) {
    DOM.conditionSearchInput.addEventListener('input', () => {
      const q = DOM.conditionSearchInput.value;
      populateConditions(q);
      if (DOM.conditionSelect.options.length > 0 && DOM.conditionSelect.value) {
        onConditionChange();
      }
    });
  }

  // Condition change: Re-filter the antibiotics
  DOM.conditionSelect.addEventListener('change', onConditionChange);

  // Antibiotic change
  DOM.antibioticSelect.addEventListener('change', onAntibioticChange);

  // Formulation change
  DOM.formulationSelect.addEventListener('change', recalculate);

  // Custom dose toggle
  DOM.customDoseToggle.addEventListener('change', () => {
    DOM.customDoseInputWrapper.classList.toggle('hidden', !DOM.customDoseToggle.checked);
    recalculate();
  });
  DOM.customDoseInput.addEventListener('input', recalculate);

  // WHO weight band quick apply
  DOM.applyWeightBandBtn.addEventListener('click', applyWhoWeightBandDose);

  // Copy prescription
  DOM.copyPrescriptionBtn.addEventListener('click', copyPrescriptionToClipboard);
  DOM.printPrescriptionBtn.addEventListener('click', () => window.print());

  // Trigger initial calculation
  if (AppState.conditions.length > 0) {
    DOM.conditionSelect.value = AppState.conditions[0].id;
    onConditionChange();
  }
}

function onAgeChange() {
  const years = parseInt(DOM.ageYears.value) || 0;
  const months = parseInt(DOM.ageMonths.value) || 0;

  // Estimate weight hint based on Nelson/APLS paediatric formula
  let est = 0;
  if (years === 0) {
    est = Math.round((months * 0.5 + 3.5) * 10) / 10;
  } else if (years < 9) {
    est = Math.round((years * 2 + 8) * 10) / 10;
  } else {
    est = Math.round((years * 3 + 7) * 10) / 10;
  }
  DOM.estimatedWeightHint.textContent = `Est: ~${est} kg`;

  // If age is 0y 0m (<1 month), suggest neonatal calculator
  if (years === 0 && months === 0) {
    DOM.estimatedWeightHint.innerHTML = `Neonate? <a href="#" style="color:var(--primary);font-weight:700" onclick="switchTab('neonatalTab');return false;">Use Neonatal Tab</a>`;
  }

  recalculate();
}

function populateConditions(filterText = '') {
  DOM.conditionSelect.innerHTML = '';
  const q = (filterText || '').toLowerCase().trim();

  const filtered = q ? AppState.conditions.filter(c => 
    (c.name && c.name.toLowerCase().includes(q)) ||
    (c.category && c.category.toLowerCase().includes(q)) ||
    (c.sectionCode && c.sectionCode.toLowerCase().includes(q)) ||
    (c.commonOrganisms && c.commonOrganisms.toLowerCase().includes(q)) ||
    (c.antibiotics && c.antibiotics.some(a => a.label.toLowerCase().includes(q)))
  ) : AppState.conditions;

  if (filtered.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = `-- No matching condition found for "${filterText}" --`;
    DOM.conditionSelect.appendChild(opt);
    return;
  }

  // Group conditions by category (Section B1 to B14)
  const categories = {};
  filtered.forEach(cond => {
    if (!categories[cond.category]) categories[cond.category] = [];
    categories[cond.category].push(cond);
  });

  for (const [catName, list] of Object.entries(categories)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = catName.toUpperCase();
    list.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      optgroup.appendChild(opt);
    });
    DOM.conditionSelect.appendChild(optgroup);
  }

  if (filtered.length > 0) {
    DOM.conditionSelect.value = filtered[0].id;
  }
}

function onConditionChange() {
  const conditionId = DOM.conditionSelect.value;
  AppState.activeCondition = AppState.conditions.find(c => c.id === conditionId);

  if (!AppState.activeCondition) return;

  // Update official NAG button link
  if (DOM.calcOpenNagBtn) {
    const secCode = AppState.activeCondition.sectionCode || 'B1';
    const nagUrl = PAEDS_NAG_URLS[secCode] || 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics?authuser=0';
    DOM.calcOpenNagBtn.href = nagUrl;
    DOM.calcOpenNagBtn.textContent = `🔗 Open ${secCode} in Official NAG ↗`;
  }

  // Render condition metadata badges
  DOM.conditionBadgeContainer.innerHTML = `
    <span class="meta-chip">📁 ${escapeHtml(AppState.activeCondition.category)}</span>
    <span class="meta-chip">👶 Age: ${escapeHtml(AppState.activeCondition.ageSuitability)}</span>
    <span class="meta-chip">🦠 ${escapeHtml((AppState.activeCondition.commonOrganisms || '').slice(0, 45))}...</span>
  `;

  // Filter antibiotics strictly to this condition
  DOM.antibioticSelect.innerHTML = '';

  const antibiotics = AppState.activeCondition.antibiotics || [];
  const firstLines = [];
  const alternatives = [];

  antibiotics.forEach((a, idx) => {
    if (a.type === 'first_line') firstLines.push({ item: a, idx });
    else alternatives.push({ item: a, idx });
  });

  if (firstLines.length > 0) {
    const optgroupFirst = document.createElement('optgroup');
    optgroupFirst.label = 'PREFERRED / FIRST-LINE REGIMENS';
    firstLines.forEach(({ item, idx }) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = item.label;
      optgroupFirst.appendChild(opt);
    });
    DOM.antibioticSelect.appendChild(optgroupFirst);
  }

  if (alternatives.length > 0) {
    const optgroupAlt = document.createElement('optgroup');
    optgroupAlt.label = 'ALTERNATIVE / SECOND-LINE / ALLERGY';
    alternatives.forEach(({ item, idx }) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = item.label;
      optgroupAlt.appendChild(opt);
    });
    DOM.antibioticSelect.appendChild(optgroupAlt);
  }

  if (antibiotics.length > 0) {
    DOM.antibioticSelect.value = 0;
  }

  onAntibioticChange();
}

function onAntibioticChange() {
  if (!AppState.activeCondition || !AppState.activeCondition.antibiotics || AppState.activeCondition.antibiotics.length === 0) return;

  const regIdx = parseInt(DOM.antibioticSelect.value) || 0;
  const conditionAbxRule = AppState.activeCondition.antibiotics[regIdx] || AppState.activeCondition.antibiotics[0];
  if (!conditionAbxRule) return;

  const masterAbx = AppState.antibiotics.find(a => a.id === conditionAbxRule.antibioticId) || {
    id: conditionAbxRule.antibioticId,
    name: conditionAbxRule.label,
    aware: 'Access',
    routes: [conditionAbxRule.route || 'Oral / IV'],
    formulations: [{ name: 'Standard Preparation', mgPerMl: null, unit: 'mg', type: 'standard' }]
  };

  AppState.activeAntibiotic = {
    rule: conditionAbxRule,
    master: masterAbx
  };

  // Update Line Badge
  if (conditionAbxRule.type === 'first_line') {
    DOM.antibioticLineBadge.className = 'badge-line badge-first-line';
    DOM.antibioticLineBadge.textContent = 'Preferred First-Line';
  } else {
    DOM.antibioticLineBadge.className = 'badge-line badge-second-line';
    DOM.antibioticLineBadge.textContent = 'Alternative / 2nd Line';
  }

  DOM.antibioticNoteText.textContent = conditionAbxRule.notes || conditionAbxRule.doseText;

  // Populate formulations for this antibiotic
  DOM.formulationSelect.innerHTML = '';
  masterAbx.formulations.forEach((f, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = f.name;
    DOM.formulationSelect.appendChild(opt);
  });

  // Preset custom dose input with default midpoint
  const midDose = Math.round((conditionAbxRule.minDosePerKgDay + conditionAbxRule.maxDosePerKgDay) / 2);
  DOM.customDoseInput.value = midDose;

  recalculate();
}

function recalculate() {
  if (!AppState.activeCondition || !AppState.activeAntibiotic) return;

  const rule = AppState.activeAntibiotic.rule;
  const master = AppState.activeAntibiotic.master;
  const weight = parseFloat(DOM.patientWeight.value) || 10;
  const formIdx = parseInt(DOM.formulationSelect.value) || 0;
  const formulation = master.formulations[formIdx] || master.formulations[0];
  AppState.activeFormulation = formulation;

  // Handle supportive care or viral conditions where no antibiotic is needed
  if (rule.antibioticId === 'supportive_care' || (rule.minDosePerKgDay === 0 && rule.maxDosePerKgDay === 0)) {
    DOM.awareClassificationBadge.className = 'aware-tag aware-access';
    DOM.awareClassificationBadge.innerHTML = 'WHO AWaRe: ACCESS / STEWARDSHIP';
    DOM.routeHeroTag.textContent = 'Supportive Care';
    DOM.singleDoseMg.textContent = '0';
    DOM.dailyDoseMg.textContent = 'Supportive Only';
    DOM.dosingFrequency.textContent = 'PRN (As required)';
    DOM.treatmentDuration.textContent = 'Symptom resolution';
    DOM.calculatedMgPerKg.textContent = '0 mg/kg (No antibiotics)';
    DOM.liquidVolumeBlock.classList.add('hidden');
    DOM.safetyGuardrailBox.className = 'alert-box alert-safe';
    DOM.safetyAlertTitle.textContent = 'Antimicrobial Stewardship Protocol';
    DOM.safetyAlertDesc.textContent = 'No routine antibiotic indicated per MOH NAG 2024. Supportive therapy, antipyresis, and clinical observation recommended.';
    DOM.syringeAdviceText.innerHTML = `<strong>Antimicrobial Stewardship:</strong> Explain to caregiver that viral/supportive etiology does not respond to antibiotics. Emphasize hydration, oral antipyretics (Paracetamol 15mg/kg PRN), and red flag advice.`;
    DOM.administrationNotes.textContent = 'Supportive hydration, nutrition and red flag monitoring.';
    DOM.conditionCommentsText.textContent = AppState.activeCondition.comments || rule.notes || 'Treatment mainly supportive.';
    return;
  }

  // AWaRe badge update
  const aware = master.aware || 'Access';
  DOM.awareClassificationBadge.className = `aware-tag aware-${aware.toLowerCase()}`;
  DOM.awareClassificationBadge.innerHTML = `WHO AWaRe: ${aware.toUpperCase()}`;

  // Route Tag
  DOM.routeHeroTag.textContent = rule.route || master.routes.join(' / ');

  // Determine mg/kg target
  let targetMgPerKg = (rule.minDosePerKgDay + rule.maxDosePerKgDay) / 2;
  if (DOM.customDoseToggle.checked) {
    const custom = parseFloat(DOM.customDoseInput.value);
    if (!isNaN(custom) && custom > 0) targetMgPerKg = custom;
  }

  // Calculate daily dose and single dose
  let totalDailyDoseMg = 0;
  let singleDoseMg = 0;
  const dividedDoses = rule.dividedDoses || 2;

  if (rule.perDose) {
    // Some regimens specify per dose directly (e.g. Gentamicin 7.5mg/kg/dose)
    singleDoseMg = Math.round(weight * targetMgPerKg * 10) / 10;
    totalDailyDoseMg = Math.round(singleDoseMg * dividedDoses);
  } else {
    // Standard mg/kg/day divided
    totalDailyDoseMg = Math.round(weight * targetMgPerKg);
    singleDoseMg = Math.round((totalDailyDoseMg / dividedDoses) * 10) / 10;
  }

  // Safety Cap Check against Adult maximums
  let isCapped = false;
  let capReason = '';

  if (rule.maxSingleDoseMg && singleDoseMg > rule.maxSingleDoseMg) {
    singleDoseMg = rule.maxSingleDoseMg;
    isCapped = true;
    capReason = `Single dose capped at maximum allowable limit of ${rule.maxSingleDoseMg} mg/dose.`;
  }

  if (rule.maxDailyDoseMg && totalDailyDoseMg > rule.maxDailyDoseMg) {
    totalDailyDoseMg = rule.maxDailyDoseMg;
    singleDoseMg = Math.round((totalDailyDoseMg / dividedDoses) * 10) / 10;
    isCapped = true;
    capReason = `Daily dose capped at maximum adult ceiling of ${rule.maxDailyDoseMg} mg/day.`;
  }

  // Update numbers on Hero Display
  DOM.singleDoseMg.textContent = singleDoseMg.toLocaleString();
  DOM.dailyDoseMg.textContent = `${totalDailyDoseMg.toLocaleString()} mg/day`;
  DOM.dosingFrequency.textContent = rule.frequency;
  DOM.treatmentDuration.textContent = rule.duration || '5 - 7 days';
  DOM.calculatedMgPerKg.textContent = `${rule.minDosePerKgDay === rule.maxDosePerKgDay ? rule.minDosePerKgDay : rule.minDosePerKgDay + ' - ' + rule.maxDosePerKgDay} mg/kg/day`;

  // Calculate liquid suspension volume in mL if applicable
  if (formulation && formulation.mgPerMl) {
    DOM.liquidVolumeBlock.classList.remove('hidden');
    const volumeMl = Math.round((singleDoseMg / formulation.mgPerMl) * 10) / 10;
    DOM.singleDoseMl.textContent = volumeMl.toFixed(1);

    const activeText = formulation.activeComponent ? ` (${formulation.activeComponent} base)` : '';
    DOM.liquidVolumeSublabel.textContent = `Vol per dose (${formulation.name.split('(')[0].trim()}${activeText})`;

    // Syringe guide
    let syringeSize = '5 mL oral syringe';
    if (volumeMl > 5 && volumeMl <= 10) syringeSize = '10 mL oral syringe';
    else if (volumeMl <= 1) syringeSize = '1 mL oral syringe (tuberculin gradation)';

    DOM.syringeAdviceText.innerHTML = `Recommended syringe: <strong>${syringeSize}</strong>. Rounded to <strong>${volumeMl.toFixed(1)} mL</strong> per dose.`;
  } else {
    // Solid oral tablet or parenteral vial
    DOM.liquidVolumeBlock.classList.add('hidden');
    let prepType = formulation.isVial ? 'IV/IM Vial' : 'Oral Tablet/Capsule';
    DOM.syringeAdviceText.innerHTML = `Preparation: <strong>${formulation.name}</strong> (${prepType}). Dose: <strong>${singleDoseMg} mg</strong>.`;
  }

  // Safety Guardrails Box
  if (isCapped) {
    DOM.safetyGuardrailBox.className = 'alert-box alert-danger';
    DOM.safetyAlertTitle.textContent = '⚠️ Dose Capped at Maximum Ceiling';
    DOM.safetyAlertDesc.textContent = `${capReason} Weight-based dose would have exceeded recommended upper limits.`;
  } else {
    DOM.safetyGuardrailBox.className = 'alert-box alert-safe';
    DOM.safetyAlertTitle.textContent = '🛡️ Within Safe Paediatric Range';
    DOM.safetyAlertDesc.textContent = `Calculated dose is appropriate for ${weight} kg under NAG 2024 recommendations.`;
  }

  // WHO Weight-Band Card
  if (rule.whoWeightBands && rule.whoWeightBands.length > 0) {
    DOM.whoWeightBandBox.classList.remove('hidden');
    const matchingBand = rule.whoWeightBands.find(b => weight >= b.minKg && weight <= b.maxKg);
    if (matchingBand) {
      DOM.whoWeightBandText.textContent = `Weight Band (${matchingBand.minKg} - ${matchingBand.maxKg} kg): ${matchingBand.doseText}`;
      DOM.whoWeightBandBox.setAttribute('data-band-dose', matchingBand.doseText);
    } else {
      DOM.whoWeightBandText.textContent = `Weight Band: > 20 kg: 500 mg q8h or 1 g q12h`;
    }
  } else {
    DOM.whoWeightBandBox.classList.add('hidden');
  }

  // Notes and Remarks
  DOM.administrationNotes.textContent = master.safetyWarnings || '--';
  DOM.conditionCommentsText.textContent = AppState.activeCondition.comments || '--';
  DOM.renalAdjustmentText.textContent = master.renalAdjustment || 'No routine reduction unless severe impairment.';
}

function applyWhoWeightBandDose() {
  const text = DOM.whoWeightBandText.textContent;
  showToast(`WHO Weight-Band selected: ${text}`);
}

function copyPrescriptionToClipboard() {
  if (!AppState.activeCondition || !AppState.activeAntibiotic) return;

  const cond = AppState.activeCondition.name;
  const abx = AppState.activeAntibiotic.master.name;
  const rule = AppState.activeAntibiotic.rule;
  const form = AppState.activeFormulation ? AppState.activeFormulation.name : '';
  const weight = DOM.patientWeight.value;
  const years = DOM.ageYears.value;
  const months = DOM.ageMonths.value;
  const doseMg = DOM.singleDoseMg.textContent;
  const doseMl = DOM.singleDoseMl.textContent;
  const freq = DOM.dosingFrequency.textContent;
  const dur = DOM.treatmentDuration.textContent;

  let volumePart = '';
  if (AppState.activeFormulation && AppState.activeFormulation.mgPerMl) {
    volumePart = ` [${doseMl} mL]`;
  }

  const prescription = `Rx: ${abx} (${form})
Dose: ${doseMg} mg${volumePart} ${rule.route} ${freq} for ${dur}
Diagnosis: ${cond}
Patient: ${years}y ${months}m (${weight} kg)
Guideline: NAG 2024 Malaysia (${AppState.activeAntibiotic.master.aware} Group)
Created via NAG 2024 Toolkit (fathirosli)`;

  navigator.clipboard.writeText(prescription).then(() => {
    showToast('Prescription copied to clipboard! 📋');
  }).catch(() => {
    showToast('Prescription text ready.');
  });
}

/* ==========================================================================
   Neonatal Sub-Calculator
   ========================================================================== */
function initNeonatalCalculator() {
  // Populate Neonatal Regimens
  DOM.neonatalDrugSelect.innerHTML = '';
  AppState.neonatalDrugs.forEach((d, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${d.drugName} - ${d.indication}`;
    DOM.neonatalDrugSelect.appendChild(opt);
  });

  DOM.neonatalWeight.addEventListener('input', recalculateNeonatal);
  DOM.neonatalCGA.addEventListener('change', recalculateNeonatal);
  DOM.neonatalPNA.addEventListener('change', recalculateNeonatal);
  DOM.neonatalDrugSelect.addEventListener('change', recalculateNeonatal);
  DOM.copyNeonatePrescriptionBtn.addEventListener('click', copyNeonatePrescription);

  recalculateNeonatal();
}

function recalculateNeonatal() {
  if (!AppState.neonatalDrugs || AppState.neonatalDrugs.length === 0) return;

  const drugIdx = parseInt(DOM.neonatalDrugSelect.value) || 0;
  const drug = AppState.neonatalDrugs[drugIdx];
  const weight = parseFloat(DOM.neonatalWeight.value) || 2.0;
  const cga = DOM.neonatalCGA.value;
  const pna = DOM.neonatalPNA.value;

  DOM.neonatalDrugName.textContent = drug.drugName;
  DOM.neonateBaseFormula.textContent = drug.dose;
  DOM.neonateTdmText.textContent = drug.tdmTarget;
  DOM.neonateClinicalNotes.textContent = drug.notes;

  let singleDoseMg = 0;
  let singleDoseMl = 0;
  let interval = 'q24h';

  if (drug.id === 'gentamicin_neonatal') {
    singleDoseMg = Math.round(weight * 5 * 10) / 10;
    singleDoseMl = Math.round((singleDoseMg / 10) * 100) / 100; // 10 mg/mL paediatric ampoule
    if (cga === 'under30') interval = 'q48h (every 48 hours)';
    else if (cga === '30to34') interval = 'q36h (every 36 hours)';
    else interval = 'q24h (every 24 hours)';
  } else if (drug.id === 'amikacin_neonatal') {
    singleDoseMg = Math.round(weight * 15 * 10) / 10;
    singleDoseMl = Math.round((singleDoseMg / 50) * 100) / 100; // 50 mg/mL paediatric injection
    if (cga === 'under30') interval = 'q48h (every 48 hours)';
    else if (cga === '30to34') interval = 'q36h (every 36 hours)';
    else interval = 'q24h (every 24 hours)';
  } else if (drug.id === 'ampicillin_neonatal') {
    singleDoseMg = Math.round(weight * 50 * 10) / 10; // 50 mg/kg/dose
    singleDoseMl = Math.round((singleDoseMg / 100) * 100) / 100; // reconstituted to 100mg/mL
    interval = pna === 'early' ? 'q12h (PNA ≤ 7 days)' : 'q8h (PNA > 7 days)';
  } else if (drug.id === 'cefotaxime_neonatal') {
    singleDoseMg = Math.round(weight * 50 * 10) / 10; // 50 mg/kg/dose
    singleDoseMl = Math.round((singleDoseMg / 100) * 100) / 100;
    interval = pna === 'early' ? 'q12h (PNA ≤ 7 days)' : 'q8h or q6h (PNA > 7 days)';
  } else if (drug.id === 'metronidazole_neonatal') {
    singleDoseMg = Math.round(weight * 7.5 * 10) / 10;
    singleDoseMl = Math.round((singleDoseMg / 5) * 10) / 10; // 5 mg/mL ready infusion
    interval = cga === 'under30' ? 'q12h (≤ 34 weeks)' : 'q8h (≥ 35 weeks)';
  } else {
    singleDoseMg = Math.round(weight * 50 * 10) / 10;
    singleDoseMl = 0.5;
    interval = 'q12h';
  }

  DOM.neonateSingleDoseMg.textContent = singleDoseMg.toFixed(1);
  DOM.neonateSingleDoseMl.textContent = singleDoseMl.toFixed(2);
  DOM.neonateInterval.textContent = interval;
}

function copyNeonatePrescription() {
  const drug = DOM.neonatalDrugName.textContent;
  const dose = DOM.neonateSingleDoseMg.textContent;
  const vol = DOM.neonateSingleDoseMl.textContent;
  const interval = DOM.neonateInterval.textContent;
  const wt = DOM.neonatalWeight.value;

  const note = `Rx (Neonatal): ${drug}
Dose: ${dose} mg [${vol} mL] IV ${interval}
Weight: ${wt} kg
TDM: ${DOM.neonateTdmText.textContent}
Reference: MOH NAG 2024 Section B6 (fathirosli)`;

  navigator.clipboard.writeText(note).then(() => {
    showToast('Neonatal prescription copied! 👶');
  });
}

/* ==========================================================================
   Guidelines Browser & Search
   ========================================================================== */
/* ================================    Adult Antibiotics Guide (Section A1 to A17 - Verbatim NAG 2024)
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ADULT_NAG_URLS = {
  'A1': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a1-cardiovascular-infections',
  'A2': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a2-central-nervous-infections',
  'A3': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a3-chemoprophyxlaxis',
  'A4': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a4-gastrointestinal-infections',
  'A5': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a5-infections-in-immunocompromised-patients',
  'A6': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a6-obstetrics-gyneacological-infections',
  'A7': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a7-ocular-infections',
  'A8': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a8-oraldental-infections',
  'A9': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a9-orthopaedic-infections',
  'A10': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a10-otorhinolaryngology-infections',
  'A11': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a11-respiratory-infections',
  'A12': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a12-sepsis',
  'A13': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a13-sexually-transmitted-infections',
  'A14': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a14-skin-soft-tissue-infections',
  'A15': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a15-trauma-related-infections',
  'A16': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a16-tropical-infections',
  'A17': 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a17-urinary-tract-infections'
};

const PAEDS_NAG_URLS = {
  'B1': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b1-cardiovascular-infections?authuser=0',
  'B2': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b2-central-nervous-infections?authuser=0',
  'B3': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b3-chemoprophylaxis?authuser=0',
  'B4': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b4-gastrointestinal-infections?authuser=0',
  'B5': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b5-infections-in-immunocompromised-patients?authuser=0',
  'B6': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b6-neonatal-infections?authuser=0',
  'B7': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b7-ocular-infections?authuser=0',
  'B8': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b8-orthopaedic-infections?authuser=0',
  'B9': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b9-otorhinolaryngology-infections?authuser=0',
  'B10': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b10-respiratory-infections?authuser=0',
  'B11': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b11-skin-soft-tissue-infections?authuser=0',
  'B12': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b12-tropical-infections?authuser=0',
  'B13': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b13-urinary-tract-infections?authuser=0',
  'B14': 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b14-vascular-infections?authuser=0'
};

let currentAdultSec = 'all';
let currentAdultQuery = '';

function initAdultGuide() {
  if (AppState.adultConditions && AppState.adultConditions.length > 0) {
    renderAdultConditions(AppState.adultConditions);
  }

  DOM.adultSearchInput.addEventListener('input', () => {
    currentAdultQuery = DOM.adultSearchInput.value.toLowerCase().trim();
    filterAdultConditions();
  });

  DOM.adultFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.adultFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAdultSec = btn.getAttribute('data-adult-sec') || btn.getAttribute('data-adult-cat') || 'all';
      filterAdultConditions();
    });
  });
}

function filterAdultConditions() {
  let list = AppState.adultConditions || [];

  if (currentAdultSec !== 'all') {
    list = list.filter(c => 
      c.sectionCode === currentAdultSec ||
      (c.category && c.category.toLowerCase().includes(currentAdultSec.toLowerCase()))
    );
  }

  if (currentAdultQuery) {
    const q = currentAdultQuery;
    list = list.filter(c =>
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.parentTopic && c.parentTopic.toLowerCase().includes(q)) ||
      (c.sectionName && c.sectionName.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.commonOrganisms && c.commonOrganisms.toLowerCase().includes(q)) ||
      (c.clinicalCriteria && c.clinicalCriteria.toLowerCase().includes(q)) ||
      (c.preferred && c.preferred.some(p => p.toLowerCase().includes(q))) ||
      (c.alternative && c.alternative.some(a => a.toLowerCase().includes(q))) ||
      (c.allergy && c.allergy.some(al => al.toLowerCase().includes(q))) ||
      (c.comments && c.comments.toLowerCase().includes(q)) ||
      (c.verbatimText && c.verbatimText.toLowerCase().includes(q))
    );
  }

  renderAdultConditions(list);
}

function renderAdultConditions(list) {
  DOM.adultConditionsContainer.innerHTML = '';

  if (!list || list.length === 0) {
    DOM.adultConditionsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">No matching adult condition found.</p>
        <p style="font-size: 0.85rem;">Try another search term or reset filters.</p>
      </div>
    `;
    return;
  }

  const displayLimit = (currentAdultSec === 'all' && !currentAdultQuery) ? 50 : list.length;
  const itemsToRender = list.slice(0, displayLimit);

  itemsToRender.forEach(item => {
    const card = document.createElement('div');
    card.className = 'adult-condition-card';

    let criteriaHtml = '';
    if (item.clinicalCriteria) {
      criteriaHtml = `
        <div class="acc-criteria-box">
          <strong>📋 Clinical Assessment / Criteria:</strong><br>
          ${escapeHtml(item.clinicalCriteria).replace(/\n/g, '<br>')}
        </div>
      `;
    }

    let organismHtml = '';
    if (item.commonOrganisms) {
      organismHtml = `
        <p class="acc-organism">
          <strong>🦠 Common Pathogens:</strong><br>
          ${escapeHtml(item.commonOrganisms).replace(/\n/g, '<br>')}
        </p>
      `;
    }

    let prefHtml = '';
    if (item.preferred && item.preferred.length > 0) {
      prefHtml = `
        <div class="acc-preferred-box">
          <div class="acc-pref-label">
            <span>⭐ Preferred First-Line Choice</span>
            <span class="aware-tag aware-access" style="font-size:0.65rem;padding:2px 6px;">NAG Preferred</span>
          </div>
          ${item.preferred.map(p => `<div class="acc-pref-drug">${escapeHtml(p)}</div>`).join('')}
        </div>
      `;
    }

    let altHtml = '';
    if (item.alternative && item.alternative.length > 0) {
      altHtml = `
        <div class="acc-alt-box">
          <div class="acc-alt-label">🔄 Alternative Regimens:</div>
          ${item.alternative.map(a => `<div class="acc-alt-item">${escapeHtml(a)}</div>`).join('')}
        </div>
      `;
    }

    let allergyHtml = '';
    if (item.allergy && item.allergy.length > 0) {
      allergyHtml = `
        <div class="acc-allergy-box">
          <div class="acc-allergy-label">⚠️ Penicillin / Antibiotic Allergy:</div>
          ${item.allergy.map(al => `<div class="acc-alt-item">${escapeHtml(al)}</div>`).join('')}
        </div>
      `;
    }

    let commentsHtml = '';
    if (item.comments) {
      commentsHtml = `
        <div class="acc-comments">
          <strong>💡 Comments &amp; Duration:</strong><br>
          ${escapeHtml(item.comments).replace(/\n/g, '<br>')}
        </div>
      `;
    }

    let verbatimHtml = '';
    if (item.verbatimText) {
      verbatimHtml = `
        <details class="acc-raw-details">
          <summary>📄 View Full Verbatim NAG Text</summary>
          <pre class="acc-raw-pre">${escapeHtml(item.verbatimText)}</pre>
        </details>
      `;
    }

    const nagUrl = ADULT_NAG_URLS[item.sectionCode] || 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult';

    card.innerHTML = `
      <div>
        <div class="acc-header">
          <div>
            <h3 class="acc-title">${escapeHtml(item.title)}</h3>
            ${item.parentTopic && item.parentTopic !== item.title ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">📁 ${escapeHtml(item.parentTopic)}</div>` : ''}
          </div>
          <span class="acc-category">${item.sectionCode}: ${item.category}</span>
        </div>

        ${criteriaHtml}
        ${organismHtml}
        ${prefHtml}
        ${altHtml}
        ${allergyHtml}
        ${commentsHtml}
        ${verbatimHtml}
      </div>

      <div class="pathway-btn-row" style="margin-top:0.85rem;">
        <a href="${nagUrl}" target="_blank" rel="noopener" class="open-nag-btn">
          🔗 Open in Official NAG (${item.sectionCode}) ↗
        </a>
        <button class="btn-secondary copy-adult-rx-btn" data-adult-id="${item.id}" style="padding:0.6rem 0.85rem;font-size:0.8rem;font-weight:700;">
          📋 Copy Note
        </button>
      </div>
    `;

    card.querySelector('.copy-adult-rx-btn').addEventListener('click', () => {
      const rxLines = [
        `=== MOH NAG 2024 Adult Guideline ===`,
        `Condition: ${item.title}`,
        `Section: ${item.sectionCode} - ${item.sectionName}`
      ];
      if (item.commonOrganisms) rxLines.push(`Pathogens:\n${item.commonOrganisms}`);
      if (item.clinicalCriteria) rxLines.push(`Criteria:\n${item.clinicalCriteria}`);
      if (item.preferred && item.preferred.length > 0) rxLines.push(`Preferred:\n${item.preferred.join('\n')}`);
      if (item.alternative && item.alternative.length > 0) rxLines.push(`Alternative:\n${item.alternative.join('\n')}`);
      if (item.allergy && item.allergy.length > 0) rxLines.push(`Allergy:\n${item.allergy.join('\n')}`);
      if (item.comments) rxLines.push(`Comments:\n${item.comments}`);
      rxLines.push(`Official NAG: ${nagUrl}`);
      rxLines.push(`Reference: MOH Malaysia NAG 2024 (fathirosli)`);

      navigator.clipboard.writeText(rxLines.join('\n\n')).then(() => {
        showToast(`Copied note for ${item.title}! 📋`);
      });
    });

    DOM.adultConditionsContainer.appendChild(card);
  });

  if (displayLimit < list.length) {
    const moreBtnWrap = document.createElement('div');
    moreBtnWrap.style.gridColumn = '1 / -1';
    moreBtnWrap.style.textAlign = 'center';
    moreBtnWrap.style.padding = '1.5rem 0';

    const moreBtn = document.createElement('button');
    moreBtn.className = 'btn-secondary';
    moreBtn.style.padding = '0.75rem 2rem';
    moreBtn.style.fontWeight = '700';
    moreBtn.textContent = `📥 Load All Remaining ${list.length - displayLimit} Conditions (${list.length} Total)`;
    moreBtn.addEventListener('click', () => {
      renderAdultConditions(list);
    });

    moreBtnWrap.appendChild(moreBtn);
    DOM.adultConditionsContainer.appendChild(moreBtnWrap);
  }
}

/* ==========================================================================
   Paediatric Toolkit (Section B1 to B14 - Complete Verbatim NAG 2024)
   ========================================================================== */
let currentPaedSec = 'all';
let currentPaedQuery = '';

function initPaediatricToolkit() {
  if (AppState.paediatricAllConditions && AppState.paediatricAllConditions.length > 0) {
    renderPaediatricConditions(AppState.paediatricAllConditions);
  }

  if (DOM.guidelineSearchInput) {
    DOM.guidelineSearchInput.addEventListener('input', () => {
      currentPaedQuery = DOM.guidelineSearchInput.value.toLowerCase().trim();
      filterPaediatricConditions();
    });
  }

  if (DOM.paedFilterBtns) {
    DOM.paedFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.paedFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPaedSec = btn.getAttribute('data-paed-sec') || 'all';
        filterPaediatricConditions();
      });
    });
  }
}

function filterPaediatricConditions() {
  let list = AppState.paediatricAllConditions || [];

  if (currentPaedSec !== 'all') {
    list = list.filter(c => 
      c.sectionCode === currentPaedSec ||
      (c.category && c.category.toLowerCase().includes(currentPaedSec.toLowerCase()))
    );
  }

  if (currentPaedQuery) {
    const q = currentPaedQuery;
    list = list.filter(c =>
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.parentTopic && c.parentTopic.toLowerCase().includes(q)) ||
      (c.sectionName && c.sectionName.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.commonOrganisms && c.commonOrganisms.toLowerCase().includes(q)) ||
      (c.clinicalCriteria && c.clinicalCriteria.toLowerCase().includes(q)) ||
      (c.preferred && c.preferred.some(p => p.toLowerCase().includes(q))) ||
      (c.alternative && c.alternative.some(a => a.toLowerCase().includes(q))) ||
      (c.allergy && c.allergy.some(al => al.toLowerCase().includes(q))) ||
      (c.comments && c.comments.toLowerCase().includes(q)) ||
      (c.verbatimText && c.verbatimText.toLowerCase().includes(q))
    );
  }

  renderPaediatricConditions(list);
}

function renderPaediatricConditions(list) {
  if (!DOM.guidelinesContainer) return;
  DOM.guidelinesContainer.innerHTML = '';

  if (!list || list.length === 0) {
    DOM.guidelinesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">No matching paediatric condition found.</p>
        <p style="font-size: 0.85rem;">Try another search term or reset filters.</p>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'adult-condition-card';

    let criteriaHtml = '';
    if (item.clinicalCriteria) {
      criteriaHtml = `
        <div class="acc-criteria-box">
          <strong>📋 Clinical Assessment / Criteria:</strong><br>
          ${escapeHtml(item.clinicalCriteria).replace(/\n/g, '<br>')}
        </div>
      `;
    }

    let organismHtml = '';
    if (item.commonOrganisms) {
      organismHtml = `
        <p class="acc-organism">
          <strong>🦠 Common Pathogens:</strong><br>
          ${escapeHtml(item.commonOrganisms).replace(/\n/g, '<br>')}
        </p>
      `;
    }

    let prefHtml = '';
    if (item.preferred && item.preferred.length > 0) {
      prefHtml = `
        <div class="acc-preferred-box">
          <div class="acc-pref-label">
            <span>⭐ Preferred First-Line Choice</span>
            <span class="aware-tag aware-access" style="font-size:0.65rem;padding:2px 6px;">NAG Paeds Preferred</span>
          </div>
          ${item.preferred.map(p => `<div class="acc-pref-drug">${escapeHtml(p)}</div>`).join('')}
        </div>
      `;
    }

    let altHtml = '';
    if (item.alternative && item.alternative.length > 0) {
      altHtml = `
        <div class="acc-alt-box">
          <div class="acc-alt-label">🔄 Alternative Regimens:</div>
          ${item.alternative.map(a => `<div class="acc-alt-item">${escapeHtml(a)}</div>`).join('')}
        </div>
      `;
    }

    let allergyHtml = '';
    if (item.allergy && item.allergy.length > 0) {
      allergyHtml = `
        <div class="acc-allergy-box">
          <div class="acc-allergy-label">⚠️ Penicillin / Antibiotic Allergy:</div>
          ${item.allergy.map(al => `<div class="acc-alt-item">${escapeHtml(al)}</div>`).join('')}
        </div>
      `;
    }

    let commentsHtml = '';
    if (item.comments) {
      commentsHtml = `
        <div class="acc-comments">
          <strong>💡 Comments &amp; Duration:</strong><br>
          ${escapeHtml(item.comments).replace(/\n/g, '<br>')}
        </div>
      `;
    }

    let verbatimHtml = '';
    if (item.verbatimText) {
      verbatimHtml = `
        <details class="acc-raw-details">
          <summary>📄 View Full Verbatim NAG Text</summary>
          <pre class="acc-raw-pre">${escapeHtml(item.verbatimText)}</pre>
        </details>
      `;
    }

    const nagUrl = PAEDS_NAG_URLS[item.sectionCode] || 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics?authuser=0';

    card.innerHTML = `
      <div>
        <div class="acc-header">
          <div>
            <h3 class="acc-title">${escapeHtml(item.title)}</h3>
            ${item.parentTopic && item.parentTopic !== item.title ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">📁 ${escapeHtml(item.parentTopic)}</div>` : ''}
          </div>
          <span class="acc-category" style="background:rgba(14, 165, 233, 0.15);color:var(--primary);">${item.sectionCode}: ${item.category}</span>
        </div>

        ${criteriaHtml}
        ${organismHtml}
        ${prefHtml}
        ${altHtml}
        ${allergyHtml}
        ${commentsHtml}
        ${verbatimHtml}
      </div>

      <div class="pathway-btn-row" style="margin-top:0.85rem;">
        <a href="${nagUrl}" target="_blank" rel="noopener" class="open-nag-btn">
          🔗 Open in Official NAG (${item.sectionCode}) ↗
        </a>
        <button class="btn-secondary copy-paed-note-btn" style="padding:0.6rem 0.85rem;font-size:0.8rem;font-weight:700;">
          📋 Copy Note
        </button>
      </div>
    `;

    card.querySelector('.copy-paed-note-btn').addEventListener('click', () => {
      const rxLines = [
        `=== MOH NAG 2024 Paediatric Guideline ===`,
        `Condition: ${item.title}`,
        `Section: ${item.sectionCode} - ${item.sectionName}`
      ];
      if (item.commonOrganisms) rxLines.push(`Pathogens:\n${item.commonOrganisms}`);
      if (item.clinicalCriteria) rxLines.push(`Criteria:\n${item.clinicalCriteria}`);
      if (item.preferred && item.preferred.length > 0) rxLines.push(`Preferred:\n${item.preferred.join('\n')}`);
      if (item.alternative && item.alternative.length > 0) rxLines.push(`Alternative:\n${item.alternative.join('\n')}`);
      if (item.allergy && item.allergy.length > 0) rxLines.push(`Allergy:\n${item.allergy.join('\n')}`);
      if (item.comments) rxLines.push(`Comments:\n${item.comments}`);
      rxLines.push(`Official NAG: ${nagUrl}`);
      rxLines.push(`Reference: MOH Malaysia NAG 2024 (fathirosli)`);

      navigator.clipboard.writeText(rxLines.join('\n\n')).then(() => {
        showToast(`Copied note for ${item.title}! 📋`);
      });
    });

    DOM.guidelinesContainer.appendChild(card);
  });
}

/* ==========================================================================
   Clinical Pathways in Primary Care (Section C1 - C9 Flowcharts)
   ========================================================================== */
let currentPathwayFilter = 'all';

function initPathways() {
  if (AppState.pathways && AppState.pathways.length > 0) {
    renderPathways(AppState.pathways);
  }

  if (DOM.pathwayFilterBtns) {
    DOM.pathwayFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.pathwayFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPathwayFilter = btn.getAttribute('data-pathway-code') || 'all';
        filterPathways();
      });
    });
  }

  // Modal events
  if (DOM.closePathwayModalBtn) {
    DOM.closePathwayModalBtn.addEventListener('click', closePathwayModal);
  }
  if (DOM.pathwayModalOverlay) {
    DOM.pathwayModalOverlay.addEventListener('click', closePathwayModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.pathwayModal && !DOM.pathwayModal.classList.contains('hidden')) {
      closePathwayModal();
    }
  });
}

function filterPathways() {
  let list = AppState.pathways || [];
  if (currentPathwayFilter !== 'all') {
    list = list.filter(p => p.code === currentPathwayFilter);
  }
  renderPathways(list);
}

function renderPathways(list) {
  if (!DOM.pathwaysContainer) return;
  DOM.pathwaysContainer.innerHTML = '';

  if (!list || list.length === 0) {
    DOM.pathwaysContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">No matching clinical pathway found.</p>
      </div>
    `;
    return;
  }

  list.forEach(pw => {
    const card = document.createElement('div');
    card.className = 'pathway-card';

    const imgPath = `images/pathways/${pw.filename}`;

    card.innerHTML = `
      <div class="pathway-img-wrap" data-img="${imgPath}" data-title="${pw.title}" data-nag="${pw.nagUrl}" data-drive="${pw.embedUrl}">
        <img src="${imgPath}" alt="${pw.title}" class="pathway-thumb-img" loading="lazy" onerror="this.src='images/pathways/C1_pathway_1.png'">
        <div class="pathway-zoom-badge">
          <span>🔍</span> Tap to Enlarge Flowchart
        </div>
      </div>
      <div class="pathway-content">
        <div>
          <h3 class="pathway-card-title">${pw.title}</h3>
          <p class="pathway-card-desc">${pw.summary}</p>
        </div>
        <div class="pathway-btn-row">
          <button class="btn-primary view-flowchart-btn" data-img="${imgPath}" data-title="${pw.title}" data-nag="${pw.nagUrl}" data-drive="${pw.embedUrl}" style="flex:1;min-width:140px;padding:0.6rem 0.85rem;font-size:0.8rem;">
            🔍 View Full Flowchart
          </button>
          <a href="${pw.nagUrl}" target="_blank" rel="noopener" class="open-nag-btn" style="flex:1;min-width:140px;">
            🔗 Open in NAG ↗
          </a>
          <a href="${pw.embedUrl}" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.6rem 0.85rem;font-size:0.8rem;font-weight:700;">
            📄 PDF
          </a>
        </div>
      </div>
    `;

    // Click on image or button opens modal
    const openModalHandler = () => {
      openPathwayModal(pw.title, imgPath, pw.nagUrl, pw.embedUrl);
    };

    card.querySelector('.pathway-img-wrap').addEventListener('click', openModalHandler);
    card.querySelector('.view-flowchart-btn').addEventListener('click', openModalHandler);

    DOM.pathwaysContainer.appendChild(card);
  });
}

function openPathwayModal(title, imgSrc, nagUrl, driveUrl) {
  if (!DOM.pathwayModal) return;
  DOM.modalPathwayTitle.textContent = title;
  DOM.modalPathwayImg.src = imgSrc;
  DOM.modalNagLink.href = nagUrl;
  DOM.modalDriveLink.href = driveUrl;
  DOM.pathwayModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePathwayModal() {
  if (!DOM.pathwayModal) return;
  DOM.pathwayModal.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Disclaimer & Feedback Modals
   ========================================================================== */
function initDisclaimerAndFeedbackModals() {
  const openDisclaimer = () => {
    if (DOM.disclaimerModal) {
      DOM.disclaimerModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };
  const closeDisclaimer = () => {
    if (DOM.disclaimerModal) {
      DOM.disclaimerModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (DOM.disclaimerModalBtn) DOM.disclaimerModalBtn.addEventListener('click', openDisclaimer);
  if (DOM.openDisclaimerModalBtn) DOM.openDisclaimerModalBtn.addEventListener('click', openDisclaimer);
  if (DOM.closeDisclaimerModalBtn) DOM.closeDisclaimerModalBtn.addEventListener('click', closeDisclaimer);
  if (DOM.disclaimerModalOverlay) DOM.disclaimerModalOverlay.addEventListener('click', closeDisclaimer);
  if (DOM.acknowledgeDisclaimerBtn) DOM.acknowledgeDisclaimerBtn.addEventListener('click', closeDisclaimer);

  const openFeedback = () => {
    if (DOM.feedbackModal) {
      DOM.feedbackModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };
  const closeFeedback = () => {
    if (DOM.feedbackModal) {
      DOM.feedbackModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (DOM.feedbackNavBtn) DOM.feedbackNavBtn.addEventListener('click', openFeedback);
  if (DOM.footerFeedbackBtn) DOM.footerFeedbackBtn.addEventListener('click', openFeedback);
  if (DOM.closeFeedbackModalBtn) DOM.closeFeedbackModalBtn.addEventListener('click', closeFeedback);
  if (DOM.feedbackModalOverlay) DOM.feedbackModalOverlay.addEventListener('click', closeFeedback);

  if (DOM.copyFeedbackEmailBtn) {
    DOM.copyFeedbackEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('fathirosli98@gmail.com').then(() => {
        showToast('Email copied: fathirosli98@gmail.com ✉️');
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDisclaimer();
      closeFeedback();
    }
  });
}

function recalculateCrcl() {
  const age = parseFloat(DOM.crclAge.value) || 65;
  const weight = parseFloat(DOM.crclWeight.value) || 60;
  const gender = DOM.crclGender.value;
  const scr = parseFloat(DOM.crclCreatinine.value) || 110;

  // Cockcroft-Gault Equation with Serum Creatinine in µmol/L:
  // Male: CrCl = [(140 - Age) × Weight (kg) × 1.23] / SCr (µmol/L)
  // Female: CrCl = [(140 - Age) × Weight (kg) × 1.04] / SCr (µmol/L)
  const factor = gender === 'male' ? 1.23 : 1.04;
  const crcl = Math.round((((140 - age) * weight * factor) / scr) * 10) / 10;

  DOM.crclResultNumber.textContent = crcl.toFixed(1);

  if (crcl >= 90) {
    DOM.crclStageTag.className = 'badge-stage stage-normal';
    DOM.crclStageTag.textContent = 'Normal Renal Function (≥ 90 mL/min)';
    DOM.crclDoseAdvice.textContent = 'Standard adult antibiotic dosing appropriate. No automatic dose reduction required.';
  } else if (crcl >= 50) {
    DOM.crclStageTag.className = 'badge-stage stage-normal';
    DOM.crclStageTag.textContent = 'Mild Impairment (50 - 89 mL/min)';
    DOM.crclDoseAdvice.textContent = 'Standard dosing for most beta-lactams. Minor adjustment for high-dose aminoglycosides/vancomycin.';
  } else if (crcl >= 30) {
    DOM.crclStageTag.className = 'badge-stage stage-impaired';
    DOM.crclStageTag.textContent = 'Moderate Impairment (30 - 49 mL/min)';
    DOM.crclDoseAdvice.textContent = 'Renal adjustment required per Appendix 2: Extend interval (e.g. Cefepime 2g q12h, Meropenem 1g q12h, Ciprofloxacin 500mg q24h).';
  } else if (crcl >= 10) {
    DOM.crclStageTag.className = 'badge-stage stage-impaired';
    DOM.crclStageTag.style.background = 'var(--aware-reserve-bg)';
    DOM.crclStageTag.style.color = 'var(--aware-reserve-text)';
    DOM.crclStageTag.textContent = 'Severe Impairment (10 - 29 mL/min)';
    DOM.crclDoseAdvice.textContent = 'Significant dose reduction required! Nitrofurantoin contraindicated. TDM mandatory for Vancomycin and Aminoglycosides.';
  } else {
    DOM.crclStageTag.className = 'badge-stage stage-impaired';
    DOM.crclStageTag.style.background = 'var(--aware-reserve-bg)';
    DOM.crclStageTag.style.color = 'var(--aware-reserve-text)';
    DOM.crclStageTag.textContent = 'End-Stage Renal Disease (< 10 mL/min / Dialysis)';
    DOM.crclDoseAdvice.textContent = 'Give supplemental dose post-haemodialysis for dialyzable drugs (Aminopenicillins, Cephalosporins, Aminoglycosides).';
  }
}

function initClinicalTools() {
  renderGuidelines(AppState.conditions);

  DOM.guidelineSearchInput.addEventListener('input', () => {
    const q = DOM.guidelineSearchInput.value.toLowerCase().trim();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
    filterGuidelines(q, activeCategory);
  });

  DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      const q = DOM.guidelineSearchInput.value.toLowerCase().trim();
      filterGuidelines(q, cat);
    });
  });

  // eGFR calculator events
  DOM.egfrHeight.addEventListener('input', recalculateEgfr);
  DOM.egfrCreatinine.addEventListener('input', recalculateEgfr);
  recalculateEgfr();

  // CrCl calculator events
  DOM.crclAge.addEventListener('input', recalculateCrcl);
  DOM.crclGender.addEventListener('change', recalculateCrcl);
  DOM.crclWeight.addEventListener('input', recalculateCrcl);
  DOM.crclCreatinine.addEventListener('input', recalculateCrcl);
  recalculateCrcl();
}

function filterGuidelines(query, category) {
  let filtered = AppState.conditions;

  if (category !== 'all') {
    filtered = filtered.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (query) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.commonOrganisms.toLowerCase().includes(query) ||
      c.antibiotics.some(a => a.label.toLowerCase().includes(query))
    );
  }

  renderGuidelines(filtered);
}

function renderGuidelines(list) {
  DOM.guidelinesContainer.innerHTML = '';

  if (list.length === 0) {
    DOM.guidelinesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">No matching NAG guideline found.</p>
        <p style="font-size: 0.85rem;">Try another search term or reset filters.</p>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'guideline-card';

    let abxHtml = item.antibiotics.map(a => `
      <div class="gc-abx-item">
        <span class="gc-abx-badge ${a.type === 'first_line' ? 'badge-first-line' : 'badge-second-line'}">
          ${a.type === 'first_line' ? '1st Line' : 'Alternative'}
        </span>
        <strong>${a.label.split('(')[0].trim()}</strong>: ${a.doseText}
      </div>
    `).join('');

    card.innerHTML = `
      <div>
        <div class="gc-category">${item.category} • ${item.ageSuitability}</div>
        <h3 class="gc-title">${item.name}</h3>
        <p class="gc-organisms"><strong>Pathogens:</strong> ${item.commonOrganisms}</p>
        <div class="gc-antibiotics-list">
          ${abxHtml}
        </div>
        <p class="gc-comments">${item.comments}</p>
      </div>
      <button class="gc-action-btn" data-cond-id="${item.id}">
        🧮 Load into Calculator
      </button>
    `;

    card.querySelector('.gc-action-btn').addEventListener('click', () => {
      DOM.conditionSelect.value = item.id;
      onConditionChange();
      switchTab('calculatorTab');
      showToast(`Loaded "${item.name}" into calculator`);
    });

    DOM.guidelinesContainer.appendChild(card);
  });
}

function recalculateEgfr() {
  const height = parseFloat(DOM.egfrHeight.value) || 100;
  const scr = parseFloat(DOM.egfrCreatinine.value) || 40;

  // Revised Bedside Schwartz equation:
  // eGFR (mL/min/1.73 m2) = 36.5 * height(cm) / Serum Creatinine(µmol/L)
  const egfr = Math.round((36.5 * height / scr) * 10) / 10;
  DOM.egfrResultNumber.textContent = egfr.toFixed(1);

  if (egfr >= 90) {
    DOM.egfrStageTag.className = 'badge-stage stage-normal';
    DOM.egfrStageTag.textContent = 'Normal / Stage 1 Kidney Function (≥ 90 mL/min)';
    DOM.egfrDoseAdvice.textContent = 'Standard antibiotic dosing appropriate. No automatic dose adjustment needed.';
  } else if (egfr >= 60) {
    DOM.egfrStageTag.className = 'badge-stage stage-normal';
    DOM.egfrStageTag.textContent = 'Mild Reduction / Stage 2 (60 - 89 mL/min)';
    DOM.egfrDoseAdvice.textContent = 'Standard dosing for most beta-lactams. Monitor Aminoglycoside / Vancomycin levels.';
  } else if (egfr >= 30) {
    DOM.egfrStageTag.className = 'badge-stage stage-impaired';
    DOM.egfrStageTag.textContent = 'Moderate Reduction / Stage 3 (30 - 59 mL/min)';
    DOM.egfrDoseAdvice.textContent = 'Renal dose adjustment advised (Appendix 2). Extend dosing intervals (e.g. q12h instead of q8h).';
  } else {
    DOM.egfrStageTag.className = 'badge-stage stage-impaired';
    DOM.egfrStageTag.style.background = 'var(--aware-reserve-bg)';
    DOM.egfrStageTag.style.color = 'var(--aware-reserve-text)';
    DOM.egfrStageTag.textContent = 'Severe Impairment / Stage 4-5 (< 30 mL/min)';
    DOM.egfrDoseAdvice.textContent = 'Significant dose reduction required! Contraindicated: Nitrofurantoin. TDM mandatory for Vancomycin & Gentamicin.';
  }
}

/* ==========================================================================
   Live NAG Updates & Sync Engine
   ========================================================================== */
function initEventListeners() {
  DOM.checkUpdatesManualBtn.addEventListener('click', checkLiveUpdates);
}

async function checkLiveUpdates() {
  const icon = DOM.checkUpdatesManualBtn.querySelector('.spin-icon');
  if (icon) icon.classList.add('spinning');
  DOM.checkUpdatesManualBtn.disabled = true;

  try {
    const res = await fetch('/api/updates/check');
    const data = await res.json();

    DOM.lastCheckedTime.textContent = `Last checked: ${new Date().toLocaleTimeString()} (Online Status: ${data.liveStatus})`;

    if (data.isUpToDate) {
      DOM.liveSyncChip.className = 'live-sync-chip status-synced';
      DOM.syncChipText.textContent = `NAG Live: Sync (${data.currentLocalVersion})`;
      DOM.updateAlertDot.classList.add('hidden');

      DOM.syncBannerTitle.textContent = `Toolkit is Up to Date with Official NAG Google Site`;
      DOM.syncBannerDesc.textContent = `${data.message} Verified against ${data.sourceUrl}.`;
    } else {
      DOM.liveSyncChip.className = 'live-sync-chip status-update-needed';
      DOM.syncChipText.textContent = `NAG Update: ${data.detectedOnlineVersion}!`;
      DOM.updateAlertDot.classList.remove('hidden');

      DOM.syncBannerTitle.textContent = `🔔 New Revision Published on NAG Google Site!`;
      DOM.syncBannerDesc.textContent = `${data.message} Official revision detected: ${data.detectedOnlineVersion}.`;
      showToast(`New MOH NAG Revision Detected: ${data.detectedOnlineVersion}! 🔔`);
    }

    renderChangelog(data.updates || (AppState.changelog ? AppState.changelog.updates : []));
  } catch (err) {
    console.error('Update check failed:', err);
    DOM.lastCheckedTime.textContent = `Last checked: Failed to connect to server (${err.message}).`;
  } finally {
    if (icon) icon.classList.remove('spinning');
    DOM.checkUpdatesManualBtn.disabled = false;
  }
}

function renderChangelog(updatesList) {
  if (!updatesList || updatesList.length === 0) return;

  DOM.changelogList.innerHTML = '';
  updatesList.forEach(up => {
    const card = document.createElement('div');
    card.className = 'changelog-card';

    let sectionsHtml = up.sections.map(sec => `
      <div class="cl-section-block">
        <h4 class="cl-section-title">${sec.name}</h4>
        <ul class="cl-items-list">
          ${sec.items.map(it => `<li>${it}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="cl-header">
        <div class="cl-date-wrap">
          <span class="cl-date">${up.date}</span>
          <span class="cl-badge">${up.badge}</span>
        </div>
        <a href="https://sites.google.com/moh.gov.my/nag/information/whats-new" target="_blank" rel="noopener" style="font-size:0.8rem;color:var(--primary);font-weight:600;text-decoration:none;">
          View on MOH Google Site ↗
        </a>
      </div>
      <div class="cl-body">
        ${sectionsHtml}
      </div>
    `;

    DOM.changelogList.appendChild(card);
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
