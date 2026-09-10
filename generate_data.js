const fs = require('fs');
const path = require('path');

const conditions = [
  // --- RESPIRATORY INFECTIONS (B10 & C1) ---
  {
    id: "cap_outpatient",
    name: "Community-Acquired Pneumonia (CAP) - Outpatient / Mild",
    category: "Respiratory",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Viral (RSV, Influenza, hMPV), Streptococcus pneumoniae, Group A Streptococcus, H. influenzae, Mycoplasma pneumoniae",
    comments: "Antibiotics are not routinely recommended if viral infection is suspected. For bacterial suspicion in outpatient setting, high-dose Amoxicillin is preferred. Review at 48 hours.",
    antibiotics: [
      {
        antibioticId: "amoxicillin",
        type: "first_line",
        label: "High-dose Amoxicillin (Preferred)",
        route: "Oral (PO)",
        doseText: "80 - 90 mg/kg/day PO in 2 to 3 divided doses (max. 1g/dose, 3g/day)",
        minDosePerKgDay: 80,
        maxDosePerKgDay: 90,
        dividedDoses: 2,
        frequency: "q12h (every 12 hours) or q8h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 3000,
        duration: "5 days",
        whoWeightBands: [
          { minKg: 3, maxKg: 5, doseText: "250 mg q12h" },
          { minKg: 6, maxKg: 9, doseText: "375 mg q12h" },
          { minKg: 10, maxKg: 14, doseText: "500 mg q12h" },
          { minKg: 15, maxKg: 19, doseText: "750 mg q12h" },
          { minKg: 20, maxKg: 999, doseText: "500 mg q8h or 1g q12h" }
        ],
        notes: "NAG 2024 & WHO endorse weight-band dosing to streamline prescribing and minimize calculation errors. Safe wide therapeutic index."
      },
      {
        antibioticId: "erythromycin",
        type: "alternative",
        label: "Erythromycin Ethylsuccinate (Alternative / Penicillin Allergy)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day PO in 2 divided doses (max. 800mg/dose, 2g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 800,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Macrolide is indicated if Mycoplasma pneumoniae or Chlamydia is suspected, or in non-severe penicillin allergy."
      },
      {
        antibioticId: "azithromycin",
        type: "alternative",
        label: "Azithromycin (Atypical Pathogens / Alternative)",
        route: "Oral (PO)",
        doseText: "10 mg/kg/day PO OD (max. 500mg/day) on Day 1, then 5 mg/kg/day PO OD (max. 250mg/day) on Days 2-5",
        minDosePerKgDay: 10,
        maxDosePerKgDay: 10,
        dividedDoses: 1,
        frequency: "Once daily (OD)",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 500,
        duration: "5 days",
        notes: "Convenient once-daily dosing. Use for suspected atypical pneumonia."
      },
      {
        antibioticId: "amoxicillin_clavulanate",
        type: "alternative",
        label: "Amoxicillin/Clavulanate (Augmentin 7:1) (If Beta-lactamase producer suspected)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day (amoxicillin component) PO in 2 divided doses (max. 2g amoxicillin/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "5 days",
        notes: "Take with meals to minimise gastrointestinal adverse effects."
      }
    ]
  },
  {
    id: "cap_inpatient_severe",
    name: "Community-Acquired Pneumonia (CAP) - Inpatient / Moderate-Severe",
    category: "Respiratory",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Streptococcus pneumoniae, Staphylococcus aureus, Group A Streptococcus, H. influenzae",
    comments: "Blood cultures prior to antibiotics. Switch to oral antibiotics once child is afebrile for 24-48h and clinically improved.",
    antibiotics: [
      {
        antibioticId: "ampicillin",
        type: "first_line",
        label: "Ampicillin IV (First-line Inpatient)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day IV in 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "7 - 10 days",
        notes: "Preferred empiric parenteral therapy for fully immunized children without empyema or severe necrotising features."
      },
      {
        antibioticId: "benzylpenicillin",
        type: "first_line",
        label: "Benzylpenicillin (Penicillin G) IV",
        route: "Intravenous (IV)",
        doseText: "200,000 units/kg/day IV in 4 divided doses (max. 24 million units/day)",
        minDosePerKgDay: 200000,
        maxDosePerKgDay: 200000,
        unit: "units",
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 6000000,
        maxDailyDoseMg: 24000000,
        duration: "7 days",
        notes: "High efficacy against susceptible pneumococcus."
      },
      {
        antibioticId: "cefotaxime",
        type: "second_line",
        label: "Cefotaxime IV (Severe / Unimmunised / Sepsis)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day IV in 3 to 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 3,
        frequency: "q8h or q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "7 - 10 days",
        notes: "Indicated if child is critically ill, not fully vaccinated against Hib/S. pneumoniae, or with pleural effusion."
      },
      {
        antibioticId: "ceftriaxone",
        type: "second_line",
        label: "Ceftriaxone IV (Alternative Inpatient / Once Daily)",
        route: "Intravenous (IV)",
        doseText: "50 - 80 mg/kg/day IV in 1 to 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 50,
        maxDosePerKgDay: 80,
        dividedDoses: 1,
        frequency: "q24h (or q12h)",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Avoid concurrent calcium-containing IV solutions. Do not use in neonates with hyperbilirubinaemia."
      },
      {
        antibioticId: "cloxacillin",
        type: "second_line",
        label: "Cloxacillin IV (Add if Staph aureus suspected / Cavitary / Empyema)",
        route: "Intravenous (IV)",
        doseText: "100 - 200 mg/kg/day IV in 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "10 - 14 days",
        notes: "Add if Staphylococcus aureus is clinically suspected (rapidly progressive pneumonia, pneumatoceles, empyema)."
      }
    ]
  },
  {
    id: "empyema_thoracis",
    name: "Empyema Thoracis / Parapneumonic Effusion",
    category: "Respiratory",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Streptococcus pneumoniae, Staphylococcus aureus, Group A Streptococcus",
    comments: "Diagnostic thoracocentesis & chest drain insertion required. Continue IV antibiotics until chest tube removed and fever resolved, then switch to oral.",
    antibiotics: [
      {
        antibioticId: "ampicillin_sulbactam",
        type: "first_line",
        label: "Ampicillin/Sulbactam IV (Unasyn)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day (ampicillin component) IV in 4 divided doses (max. 8g ampicillin/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "2 - 4 weeks total",
        notes: "Broad coverage including anaerobic and beta-lactamase producing organisms."
      },
      {
        antibioticId: "cefotaxime",
        type: "first_line",
        label: "Cefotaxime IV PLUS Cloxacillin IV",
        route: "Intravenous (IV)",
        doseText: "Cefotaxime 150-200 mg/kg/day IV q6h-q8h + Cloxacillin 100-200 mg/kg/day IV q6h",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "2 - 4 weeks total",
        notes: "Covers both Gram-negative/pneumococcal pathogens and MSSA."
      },
      {
        antibioticId: "vancomycin",
        type: "second_line",
        label: "Vancomycin IV (If MRSA suspected or critical sepsis)",
        route: "Intravenous (IV)",
        doseText: "40 - 60 mg/kg/day IV in 3 to 4 divided doses (max. 2g/day). Monitor trough level.",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 60,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "2 - 4 weeks",
        notes: "Therapeutic drug monitoring (TDM) mandatory. Target trough level: 10-15 mcg/mL (or 15-20 mcg/mL in severe disease)."
      }
    ]
  },

  // --- URINARY TRACT INFECTIONS (B13 & C7) ---
  {
    id: "uti_acute_pyelonephritis_infant_child",
    name: "Acute Pyelonephritis / Febrile UTI (≥3 months)",
    category: "Urinary Tract",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Escherichia coli (80%), Klebsiella spp., Proteus mirabilis, Enterobacter spp.",
    comments: "Obtain clean-catch or catheter urine culture prior to starting antibiotics. Duration: 7 to 10 days. Switch to oral once afebrile for 48h.",
    antibiotics: [
      {
        antibioticId: "cephalexin",
        type: "first_line",
        label: "Cephalexin PO (First Line Oral)",
        route: "Oral (PO)",
        doseText: "25 - 50 mg/kg/day PO in 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 25,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Appropriate for mild to moderate pyelonephritis tolerating oral intake."
      },
      {
        antibioticId: "amoxicillin_clavulanate",
        type: "first_line",
        label: "Amoxicillin/Clavulanate PO (Augmentin 7:1)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day (amoxicillin component) PO in 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Formulation 7:1 (228mg/5mL or 457mg/5mL). For Formulation 14:1, dose is 80-90 mg/kg/day."
      },
      {
        antibioticId: "cefotaxime",
        type: "second_line",
        label: "Cefotaxime IV (Hospitalized / Toxic / Vomiting)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day IV in 3 divided doses (max. 2g/dose, 6g/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 6000,
        duration: "7 - 10 days",
        notes: "First-line parenteral option for sick febrile UTI / pyelonephritis. May add Amikacin if septic shock."
      },
      {
        antibioticId: "ceftriaxone",
        type: "second_line",
        label: "Ceftriaxone IV / IM (Daily Inpatient / Outpatient Parenteral)",
        route: "Intravenous (IV)",
        doseText: "75 - 100 mg/kg/day IV/IM in 1 to 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 75,
        maxDosePerKgDay: 100,
        dividedDoses: 1,
        frequency: "q24h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Convenient once-daily dosing. Switch to oral stepdown when afebrile."
      },
      {
        antibioticId: "amikacin",
        type: "second_line",
        label: "Amikacin IV (Add if septic or suspected resistant GNB)",
        route: "Intravenous (IV)",
        doseText: "15 mg/kg/dose IV once daily (q24h) (max. 1.5g/day)",
        minDosePerKgDay: 15,
        maxDosePerKgDay: 15,
        dividedDoses: 1,
        frequency: "q24h",
        maxSingleDoseMg: 1500,
        maxDailyDoseMg: 1500,
        duration: "3 - 5 days",
        notes: "Once-daily extended interval aminoglycoside dosing. Monitor renal profile."
      }
    ]
  },
  {
    id: "uti_lower_cystitis",
    name: "Lower Urinary Tract Infection (Acute Cystitis)",
    category: "Urinary Tract",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Escherichia coli, Proteus mirabilis, Klebsiella pneumoniae, Staphylococcus saprophyticus",
    comments: "Afebrile child with dysuria, frequency, or urgency. Short-course therapy is effective. Duration: 3 to 5 days.",
    antibiotics: [
      {
        antibioticId: "amoxicillin_clavulanate",
        type: "first_line",
        label: "Amoxicillin/Clavulanate PO (Augmentin 7:1) (Preferred)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day (amoxicillin) PO in 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "3 - 5 days",
        notes: "Excellent urinary penetration. Standard 7:1 oral suspension."
      },
      {
        antibioticId: "cefuroxime",
        type: "first_line",
        label: "Cefuroxime Axetil PO",
        route: "Oral (PO)",
        doseText: "30 mg/kg/day PO in 2 divided doses (max. 250mg/dose, 500mg/day)",
        minDosePerKgDay: 30,
        maxDosePerKgDay: 30,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 250,
        maxDailyDoseMg: 500,
        duration: "3 - 5 days",
        notes: "Take with food to increase absorption and mask bitter taste."
      },
      {
        antibioticId: "cotrimoxazole",
        type: "first_line",
        label: "Co-trimoxazole (Bactrim) PO",
        route: "Oral (PO)",
        doseText: "8 - 10 mg TMP/kg/day PO in 2 divided doses (max. 160mg TMP/dose, 320mg TMP/day)",
        minDosePerKgDay: 8,
        maxDosePerKgDay: 10,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 160,
        maxDailyDoseMg: 320,
        duration: "3 - 5 days",
        notes: "Check local antibiogram for E. coli resistance. Contraindicated in G6PD deficiency with severe hemolysis history and neonates."
      },
      {
        antibioticId: "nitrofurantoin",
        type: "alternative",
        label: "Nitrofurantoin PO (Alternative)",
        route: "Oral (PO)",
        doseText: "2 mg/kg/dose PO q12h (sustained-release) or 1 mg/kg/dose PO q6h (immediate-release) (max. 100mg/dose)",
        minDosePerKgDay: 4,
        maxDosePerKgDay: 4,
        dividedDoses: 2,
        frequency: "q12h (sustained-release)",
        maxSingleDoseMg: 100,
        maxDailyDoseMg: 200,
        duration: "3 - 5 days",
        notes: "For lower UTI only! Ineffective for pyelonephritis due to low tissue/renal parenchyma levels. Contraindicated if CrCl < 30 mL/min or G6PD deficiency."
      }
    ]
  },

  // --- CENTRAL NERVOUS SYSTEM INFECTIONS (B2) ---
  {
    id: "acute_bacterial_meningitis_child",
    name: "Acute Bacterial Meningitis (Infant & Child ≥3 months)",
    category: "Central Nervous System",
    ageSuitability: "≥ 3 months to 18 years",
    commonOrganisms: "Streptococcus pneumoniae, Neisseria meningitidis, Haemophilus influenzae type b",
    comments: "Medical emergency! Start empiric therapy immediately after blood culture. Do NOT delay antibiotics if lumbar puncture is postponed. Add Dexamethasone 0.15 mg/kg IV q6h before or with first dose for Hib/pneumococcal meningitis.",
    antibiotics: [
      {
        antibioticId: "cefotaxime",
        type: "first_line",
        label: "Cefotaxime IV (Preferred First Line Meningitic Dose)",
        route: "Intravenous (IV)",
        doseText: "200 - 300 mg/kg/day IV in 3 to 4 divided doses (max. 2g/dose, 12g/day)",
        minDosePerKgDay: 200,
        maxDosePerKgDay: 300,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 12000,
        duration: "10 - 14 days (longer for Gram-negative)",
        notes: "High CNS penetration. Continue for minimum 10-14 days for S. pneumoniae, 7 days for N. meningitidis."
      },
      {
        antibioticId: "ceftriaxone",
        type: "first_line",
        label: "Ceftriaxone IV (Alternative Meningitic Dose)",
        route: "Intravenous (IV)",
        doseText: "100 mg/kg/day IV in 1 to 2 divided doses (max. 4g/day)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 100,
        dividedDoses: 2,
        frequency: "q12h (or q24h)",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 4000,
        duration: "10 - 14 days",
        notes: "Can give as 100mg/kg OD or 50mg/kg q12h. Highly potent."
      },
      {
        antibioticId: "vancomycin",
        type: "first_line",
        label: "Vancomycin IV (Combine if Cephalosporin-resistant Pneumococcus suspected)",
        route: "Intravenous (IV)",
        doseText: "60 mg/kg/day IV in 4 divided doses (max. 2g/day). Target trough 15 - 20 mcg/mL.",
        minDosePerKgDay: 60,
        maxDosePerKgDay: 60,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 2000,
        duration: "10 - 14 days",
        notes: "Add routinely if PRSP (penicillin/cephalosporin-resistant S. pneumoniae) is suspected or patient is in septic shock."
      },
      {
        antibioticId: "ampicillin",
        type: "second_line",
        label: "Ampicillin IV (Add if Listeria monocytogenes suspected)",
        route: "Intravenous (IV)",
        doseText: "300 mg/kg/day IV in 4 divided doses (max. 2g/dose, 12g/day)",
        minDosePerKgDay: 300,
        maxDosePerKgDay: 300,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 12000,
        duration: "14 - 21 days",
        notes: "Indicated in immunocompromised children or infants < 3 months for Listeria coverage."
      }
    ]
  },

  // --- NEONATAL INFECTIONS (B6) ---
  {
    id: "neonatal_early_onset_sepsis",
    name: "Neonatal Early-Onset Sepsis / Meningitis (≤ 7 days of life)",
    category: "Neonatal",
    ageSuitability: "Neonate 0 - 7 days of life",
    commonOrganisms: "Group B Streptococcus (GBS), Escherichia coli, Listeria monocytogenes, Enterococcus",
    comments: "Empiric combination therapy with Ampicillin + Aminoglycoside (Gentamicin) or Cefotaxime. Adjust Gentamicin dosing interval by gestational age (GA/CGA)!",
    antibiotics: [
      {
        antibioticId: "ampicillin",
        type: "first_line",
        label: "Ampicillin IV (Neonatal Sepsis)",
        route: "Intravenous (IV)",
        doseText: "100 - 150 mg/kg/day IV in 2 divided doses (q12h if ≤7 days; if meningitis: 200-300 mg/kg/day in 3 divided doses)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 150,
        dividedDoses: 2,
        frequency: "q12h (for PNA ≤ 7 days)",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "For meningitis, increase to 200-300 mg/kg/day divided q12h (if ≤7 days) or q8h (if >7 days)."
      },
      {
        antibioticId: "gentamicin",
        type: "first_line",
        label: "Gentamicin IV (Neonatal Gestational-Age Regimen)",
        route: "Intravenous (IV)",
        doseText: "5 mg/kg/dose IV. Frequency: <30w CGA: q48h; 30-34w CGA: q36h; ≥35w CGA: q24h",
        minDosePerKgDay: 5,
        maxDosePerKgDay: 5,
        perDose: true,
        frequency: "Stratified by Gestational Age (<30w: q48h, 30-34w: q36h, ≥35w: q24h)",
        maxSingleDoseMg: 200,
        maxDailyDoseMg: 200,
        duration: "5 - 7 days",
        notes: "NAG 2024 CGA protocol. Monitor serum trough level (<1-2 mcg/mL) and peak level (5-10 mcg/mL)."
      },
      {
        antibioticId: "cefotaxime",
        type: "second_line",
        label: "Cefotaxime IV (Alternative to Gentamicin or if Meningitis proven)",
        route: "Intravenous (IV)",
        doseText: "50 mg/kg/dose IV. Frequency: ≤7 days PNA: q12h; >7 days PNA: q6h-q8h (max. 200mg/kg/day)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 100,
        perDose: true,
        frequency: "q12h (if PNA ≤7 days)",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "14 - 21 days for meningitis",
        notes: "Safe in neonates; does not displace bilirubin from albumin (unlike Ceftriaxone which is contraindicated in neonates)."
      }
    ]
  },
  {
    id: "neonatal_necrotising_enterocolitis",
    name: "Neonatal Necrotising Enterocolitis (NEC - Stage 1 to 3)",
    category: "Neonatal",
    ageSuitability: "Neonate (Preterm & Term)",
    commonOrganisms: "Klebsiella spp., E. coli, Clostridia, CoNS, Enterococci, Bacteroides spp.",
    comments: "Bowel rest, NPO, gastric decompression, fluid resuscitation and prompt triple broad-spectrum coverage.",
    antibiotics: [
      {
        antibioticId: "ampicillin",
        type: "first_line",
        label: "Ampicillin IV (Stage 1 NEC)",
        route: "Intravenous (IV)",
        doseText: "100 mg/kg/dose IV. Frequency: ≤1 week of age: q12h; >1 week of age: q8h",
        minDosePerKgDay: 200,
        maxDosePerKgDay: 200,
        perDose: true,
        frequency: "q12h (≤7 days) or q8h (>7 days)",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 3000,
        duration: "10 - 14 days",
        notes: "Combine with Gentamicin + Metronidazole for Stage 1."
      },
      {
        antibioticId: "gentamicin",
        type: "first_line",
        label: "Gentamicin IV (NEC Stage 1)",
        route: "Intravenous (IV)",
        doseText: "5 mg/kg/dose IV (<30w CGA: q48h; 30-34w CGA: q36h; ≥35w CGA: q24h)",
        minDosePerKgDay: 5,
        maxDosePerKgDay: 5,
        perDose: true,
        frequency: "<30w: q48h; 30-34w: q36h; ≥35w: q24h",
        maxSingleDoseMg: 200,
        maxDailyDoseMg: 200,
        duration: "10 - 14 days",
        notes: "Can substitute with Amikacin 15mg/kg/dose if local Gram-negative resistance is high."
      },
      {
        antibioticId: "metronidazole",
        type: "first_line",
        label: "Metronidazole IV (Anaerobic Coverage for NEC)",
        route: "Intravenous (IV)",
        doseText: "Loading: 15 mg/kg IV once. Maintenance: ≤34w: 7.5 mg/kg q12h; 35-40w: 7.5 mg/kg q8h; >40w: 10 mg/kg q8h",
        minDosePerKgDay: 15,
        maxDosePerKgDay: 22.5,
        perDose: true,
        frequency: "≤34w: q12h; 35-40w: q8h; >40w: q8h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1500,
        duration: "10 - 14 days",
        notes: "Crucial anaerobic gut flora coverage for bowel wall ischemia/necrosis."
      },
      {
        antibioticId: "cefotaxime",
        type: "second_line",
        label: "Cefotaxime IV (NEC Stage 2 / Stage 3 - In place of Amp+Gent)",
        route: "Intravenous (IV)",
        doseText: "50 mg/kg/dose IV. Frequency: ≤1 week of age: q12h; >1 week of age: q8h (PLUS Metronidazole)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 150,
        perDose: true,
        frequency: "q12h (≤7 days) or q8h (>7 days)",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 3000,
        duration: "10 - 14 days",
        notes: "Preferred for established pneumatosis intestinalis or perforation."
      }
    ]
  },

  // --- SKIN & SOFT TISSUE INFECTIONS (B11 & C6) ---
  {
    id: "impetigo_cellulitis_mild",
    name: "Skin & Soft Tissue: Impetigo / Mild Cellulitis / Folliculitis",
    category: "Skin & Soft Tissue",
    ageSuitability: "All paediatric ages",
    commonOrganisms: "Staphylococcus aureus (MSSA), Streptococcus pyogenes (Group A Strep)",
    comments: "For localized impetigo, topical mupirocin 2% or fusidic acid is first line. If extensive or associated with systemic symptoms/cellulitis, use oral anti-staphylococcal therapy.",
    antibiotics: [
      {
        antibioticId: "cephalexin",
        type: "first_line",
        label: "Cephalexin PO (First-Line Oral)",
        route: "Oral (PO)",
        doseText: "25 - 50 mg/kg/day PO in 2 to 4 divided doses (max. 500mg/dose, 2g/day)",
        minDosePerKgDay: 25,
        maxDosePerKgDay: 50,
        dividedDoses: 3,
        frequency: "q8h or q12h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 2000,
        duration: "5 - 7 days",
        notes: "Pleasant suspension taste compared to oral cloxacillin; excellent compliance in children."
      },
      {
        antibioticId: "cloxacillin",
        type: "first_line",
        label: "Cloxacillin PO (Oral Anti-Staphylococcal)",
        route: "Oral (PO)",
        doseText: "50 - 100 mg/kg/day PO in 4 divided doses (max. 500mg/dose, 2g/day) 1 hour before food",
        minDosePerKgDay: 50,
        maxDosePerKgDay: 100,
        dividedDoses: 4,
        frequency: "q6h (1 hour before food)",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 2000,
        duration: "5 - 7 days",
        notes: "Administer on an empty stomach. Highly bitter syrup; advise child/parent."
      },
      {
        antibioticId: "amoxicillin_clavulanate",
        type: "second_line",
        label: "Amoxicillin/Clavulanate PO (Augmentin 7:1)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day (amoxicillin) PO in 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "5 - 7 days",
        notes: "Broad coverage for animal/human bites, or secondary infection of eczema."
      },
      {
        antibioticId: "clindamycin",
        type: "alternative",
        label: "Clindamycin PO (Severe Penicillin Allergy or suspected CA-MRSA)",
        route: "Oral (PO)",
        doseText: "20 - 30 mg/kg/day PO in 3 to 4 divided doses (max. 450mg/dose, 1.8g/day)",
        minDosePerKgDay: 20,
        maxDosePerKgDay: 30,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 450,
        maxDailyDoseMg: 1800,
        duration: "5 - 7 days",
        notes: "Inhibits toxin synthesis in Group A Strep and S. aureus."
      }
    ]
  },
  {
    id: "cellulitis_moderate_severe",
    name: "Severe Cellulitis / Erysipelas / Staphylococcal Scalded Skin Syndrome (SSSS)",
    category: "Skin & Soft Tissue",
    ageSuitability: "All paediatric ages",
    commonOrganisms: "Staphylococcus aureus (toxin-producing), Streptococcus pyogenes",
    comments: "Mark border of erythema with pen to monitor progression. Switch to oral therapy once erythema recedes and fever resolves for 48h.",
    antibiotics: [
      {
        antibioticId: "cloxacillin",
        type: "first_line",
        label: "Cloxacillin IV (First-Line Parenteral)",
        route: "Intravenous (IV)",
        doseText: "100 - 200 mg/kg/day IV in 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "7 - 10 days",
        notes: "Gold standard for Methicillin-Susceptible S. aureus (MSSA) and SSSS."
      },
      {
        antibioticId: "cefazolin",
        type: "first_line",
        label: "Cefazolin IV (Alternative Parenteral)",
        route: "Intravenous (IV)",
        doseText: "50 - 100 mg/kg/day IV in 3 divided doses (max. 1g/dose, 3g/day)",
        minDosePerKgDay: 50,
        maxDosePerKgDay: 100,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 3000,
        duration: "7 - 10 days",
        notes: "Excellent tolerability with convenient 8-hourly dosing."
      },
      {
        antibioticId: "vancomycin",
        type: "second_line",
        label: "Vancomycin IV (Suspected MRSA or Type 1 Penicillin Anaphylaxis)",
        route: "Intravenous (IV)",
        doseText: "40 - 60 mg/kg/day IV in 3 to 4 divided doses (max. 2g/day). Monitor trough level.",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 60,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Target trough: 10-15 mcg/mL. Infuse over at least 60 minutes."
      }
    ]
  },

  // --- OTORHINOLARYNGOLOGY (ENT) & PRIMARY CARE (B9, C2, C3) ---
  {
    id: "acute_otitis_media",
    name: "Acute Otitis Media (AOM)",
    category: "ENT / Primary Care",
    ageSuitability: "≥ 6 months to 18 years",
    commonOrganisms: "Streptococcus pneumoniae, non-typeable H. influenzae, Moraxella catarrhalis, Viral",
    comments: "Watchful waiting (48-72h) recommended if ≥2 years with mild unilateral symptoms. High-dose Amoxicillin is preferred to overcome intermediate penicillin-resistant S. pneumoniae.",
    antibiotics: [
      {
        antibioticId: "amoxicillin",
        type: "first_line",
        label: "High-Dose Amoxicillin PO (Preferred First Line)",
        route: "Oral (PO)",
        doseText: "80 - 90 mg/kg/day PO in 2 to 3 divided doses (max. 1g/dose, 3g/day)",
        minDosePerKgDay: 80,
        maxDosePerKgDay: 90,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 3000,
        duration: "5 - 7 days (10 days if <2 years)",
        whoWeightBands: [
          { minKg: 3, maxKg: 5, doseText: "250 mg q12h" },
          { minKg: 6, maxKg: 9, doseText: "375 mg q12h" },
          { minKg: 10, maxKg: 14, doseText: "500 mg q12h" },
          { minKg: 15, maxKg: 19, doseText: "750 mg q12h" },
          { minKg: 20, maxKg: 999, doseText: "500 mg q8h or 1g q12h" }
        ],
        notes: "Duration: 10 days for age <2 years; 5-7 days for age ≥2 years."
      },
      {
        antibioticId: "amoxicillin_clavulanate",
        type: "second_line",
        label: "Amoxicillin/Clavulanate (Augmentin 7:1) (AOM Treatment Failure / Purulent conjunctivitis)",
        route: "Oral (PO)",
        doseText: "80 - 90 mg/kg/day (amoxicillin) PO in 2 divided doses (max. 2g/day)",
        minDosePerKgDay: 80,
        maxDosePerKgDay: 90,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 10 days",
        notes: "Indicated if child received amoxicillin in past 30 days or failed to improve after 48-72 hours."
      },
      {
        antibioticId: "cefuroxime",
        type: "alternative",
        label: "Cefuroxime Axetil PO (Non-severe Penicillin Allergy)",
        route: "Oral (PO)",
        doseText: "30 mg/kg/day PO in 2 divided doses (max. 250mg/dose, 500mg/day)",
        minDosePerKgDay: 30,
        maxDosePerKgDay: 30,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 250,
        maxDailyDoseMg: 500,
        duration: "7 - 10 days",
        notes: "Second-generation cephalosporin for non-IgE penicillin allergic patients."
      },
      {
        antibioticId: "azithromycin",
        type: "alternative",
        label: "Azithromycin PO (Severe Type 1 Penicillin Allergy)",
        route: "Oral (PO)",
        doseText: "10 mg/kg/day PO OD on Day 1 (max. 500mg), then 5 mg/kg/day PO OD on Days 2-5 (max. 250mg)",
        minDosePerKgDay: 10,
        maxDosePerKgDay: 10,
        dividedDoses: 1,
        frequency: "Once daily (OD)",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 500,
        duration: "5 days",
        notes: "Reserve for true beta-lactam anaphylaxis."
      }
    ]
  },
  {
    id: "acute_streptococcal_pharyngitis",
    name: "Acute Streptococcal Pharyngotonsillitis (GAS)",
    category: "ENT / Primary Care",
    ageSuitability: "≥ 3 years to 18 years",
    commonOrganisms: "Streptococcus pyogenes (Group A Streptococcus)",
    comments: "Routine antibiotic treatment is NOT indicated for viral sore throat (majority of cases). Test with rapid antigen or Centor/McIsaac score. Goal: prevent acute rheumatic fever and suppurative complications.",
    antibiotics: [
      {
        antibioticId: "phenoxymethylpenicillin",
        type: "first_line",
        label: "Penicillin V (Phenoxymethylpenicillin) PO (First-Line)",
        route: "Oral (PO)",
        doseText: "< 27 kg: 250 mg PO q8h or q12h; ≥ 27 kg: 500 mg PO q8h or q12h for 10 full days",
        minDosePerKgDay: 25,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h or q8h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1000,
        duration: "10 days",
        notes: "Must complete full 10-day course to prevent Rheumatic Fever."
      },
      {
        antibioticId: "amoxicillin",
        type: "first_line",
        label: "Amoxicillin PO (Alternative First-Line - Better Taste)",
        route: "Oral (PO)",
        doseText: "50 mg/kg/day PO once daily (OD) or in 2 divided doses (max. 1g/day)",
        minDosePerKgDay: 50,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h or OD",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1000,
        duration: "10 days",
        notes: "Once daily or twice daily dosing improves compliance. Complete 10 days."
      },
      {
        antibioticId: "cephalexin",
        type: "alternative",
        label: "Cephalexin PO (Penicillin Allergy - Non-severe)",
        route: "Oral (PO)",
        doseText: "40 - 50 mg/kg/day PO in 2 divided doses (max. 500mg/dose, 1g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 50,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1000,
        duration: "10 days",
        notes: "First-generation cephalosporin for non-Type 1 allergic patients."
      },
      {
        antibioticId: "erythromycin",
        type: "alternative",
        label: "Erythromycin Ethylsuccinate PO (Severe Penicillin Allergy)",
        route: "Oral (PO)",
        doseText: "40 mg/kg/day PO in 2 to 4 divided doses (max. 1g/day)",
        minDosePerKgDay: 40,
        maxDosePerKgDay: 40,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1000,
        duration: "10 days",
        notes: "For patients with true immediate IgE penicillin hypersensitivity."
      }
    ]
  },

  // --- GASTROINTESTINAL INFECTIONS (B4 & C5) ---
  {
    id: "acute_bacterial_dysentery",
    name: "Acute Bacterial Gastroenteritis / Dysentery (Bloody Diarrhoea)",
    category: "Gastrointestinal",
    ageSuitability: "All paediatric ages",
    commonOrganisms: "Shigella spp., Salmonella (non-typhoidal), Campylobacter jejuni, E. histolytica",
    comments: "Oral rehydration is paramount! Antibiotics are NOT routinely indicated for acute watery diarrhoea. Indicated only for macroscopic blood in stool (dysentery), systemic toxicity, severe malnutrition, or high-risk infants.",
    antibiotics: [
      {
        antibioticId: "azithromycin",
        type: "first_line",
        label: "Azithromycin PO (First Line for Shigellosis & Campylobacter)",
        route: "Oral (PO)",
        doseText: "10 - 12 mg/kg/day PO OD for 3 days (max. 500mg/day) OR 20 mg/kg single dose",
        minDosePerKgDay: 10,
        maxDosePerKgDay: 12,
        dividedDoses: 1,
        frequency: "Once daily (OD)",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 500,
        duration: "3 days",
        notes: "First choice in children. High intracellular tissue concentrations and short course."
      },
      {
        antibioticId: "ceftriaxone",
        type: "second_line",
        label: "Ceftriaxone IV (Severe / Toxic / Sepsis / Unable to take oral)",
        route: "Intravenous (IV)",
        doseText: "50 - 75 mg/kg/day IV once daily (max. 2g/day)",
        minDosePerKgDay: 50,
        maxDosePerKgDay: 75,
        dividedDoses: 1,
        frequency: "q24h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 2000,
        duration: "3 - 5 days",
        notes: "Parenteral therapy for children with severe dehydration, bacteraemia or inability to tolerate oral medications."
      },
      {
        antibioticId: "metronidazole",
        type: "alternative",
        label: "Metronidazole PO (If Amoebic Dysentery / E. histolytica suspected or Giardiasis)",
        route: "Oral (PO)",
        doseText: "30 - 40 mg/kg/day PO in 3 divided doses (max. 500mg/dose, 1.5g/day)",
        minDosePerKgDay: 30,
        maxDosePerKgDay: 40,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 500,
        maxDailyDoseMg: 1500,
        duration: "7 - 10 days",
        notes: "For trophozoites seen in stool microscopy or proven amoebic colitis."
      }
    ]
  },

  // --- SEPSIS & BACTERAEMIA (A12/B) ---
  {
    id: "paediatric_septic_shock",
    name: "Paediatric Sepsis & Septic Shock (Community-Acquired)",
    category: "Sepsis & Critical Care",
    ageSuitability: "≥ 1 month to 18 years",
    commonOrganisms: "Neisseria meningitidis, Streptococcus pneumoniae, Staphylococcus aureus, Group A Streptococcus, Enterobacterales",
    comments: "CRITICAL: Administer empiric intravenous antibiotics within the first hour of recognition ('Golden Hour'). Take blood cultures before starting antibiotics without delaying infusion.",
    antibiotics: [
      {
        antibioticId: "cefotaxime",
        type: "first_line",
        label: "Cefotaxime IV (Preferred First Line Sepsis)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day IV in 3 to 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "7 - 14 days",
        notes: "Third-generation cephalosporin covering encapsulated organisms and GNB."
      },
      {
        antibioticId: "ceftriaxone",
        type: "first_line",
        label: "Ceftriaxone IV (Alternative Sepsis First Line)",
        route: "Intravenous (IV)",
        doseText: "80 - 100 mg/kg/day IV in 1 to 2 divided doses (max. 2g/dose, 4g/day)",
        minDosePerKgDay: 80,
        maxDosePerKgDay: 100,
        dividedDoses: 2,
        frequency: "q12h or q24h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 4000,
        duration: "7 - 14 days",
        notes: "Convenient once or twice daily infusion. Avoid calcium co-administration."
      },
      {
        antibioticId: "cloxacillin",
        type: "first_line",
        label: "Cloxacillin IV (Add for Staphylococcal toxic shock or purpura)",
        route: "Intravenous (IV)",
        doseText: "100 - 200 mg/kg/day IV in 4 divided doses (max. 2g/dose, 8g/day)",
        minDosePerKgDay: 100,
        maxDosePerKgDay: 200,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 8000,
        duration: "7 - 14 days",
        notes: "Add if staphylococcal sepsis or toxic shock syndrome suspected."
      },
      {
        antibioticId: "gentamicin",
        type: "second_line",
        label: "Gentamicin IV (Add for synergistic Gram-negative coverage in shock)",
        route: "Intravenous (IV)",
        doseText: "7.5 mg/kg/dose IV once daily (q24h) (max. 400mg/day). Monitor trough level.",
        minDosePerKgDay: 7.5,
        maxDosePerKgDay: 7.5,
        perDose: true,
        frequency: "q24h (Once daily)",
        maxSingleDoseMg: 400,
        maxDailyDoseMg: 400,
        duration: "3 - 5 days",
        notes: "Once daily extended interval dosing for synergy. Trough target < 1 mcg/mL."
      },
      {
        antibioticId: "vancomycin",
        type: "second_line",
        label: "Vancomycin IV (Add if MRSA risk or central venous catheter sepsis)",
        route: "Intravenous (IV)",
        doseText: "45 - 60 mg/kg/day IV in 3 to 4 divided doses (max. 2g/day). Target trough 15 - 20 mcg/mL.",
        minDosePerKgDay: 45,
        maxDosePerKgDay: 60,
        dividedDoses: 4,
        frequency: "q6h",
        maxSingleDoseMg: 1000,
        maxDailyDoseMg: 2000,
        duration: "7 - 14 days",
        notes: "Target trough: 15-20 mcg/mL for severe sepsis / bacteraemia."
      }
    ]
  },

  // --- TROPICAL INFECTIONS (B12 & Updates Jan 2026) ---
  {
    id: "melioidosis_paediatric",
    name: "Melioidosis (Burkholderia pseudomallei) (Updated Jan '26)",
    category: "Tropical Infections",
    ageSuitability: "All paediatric ages",
    commonOrganisms: "Burkholderia pseudomallei",
    comments: "Two-phase therapy: Intensive IV phase (minimum 10-14 days; longer if deep organ abscesses or neuromelioidosis) followed by Eradication oral phase (minimum 12 weeks with Cotrimoxazole).",
    antibiotics: [
      {
        antibioticId: "ceftazidime",
        type: "first_line",
        label: "Ceftazidime IV (Intensive Phase - First Line)",
        route: "Intravenous (IV)",
        doseText: "150 - 200 mg/kg/day IV in 3 to 4 divided doses (max. 2g/dose, 6g/day)",
        minDosePerKgDay: 150,
        maxDosePerKgDay: 200,
        dividedDoses: 3,
        frequency: "q8h",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 6000,
        duration: "10 - 14 days (intensive)",
        notes: "Intensive phase. Infuse over 30-60 minutes."
      },
      {
        antibioticId: "meropenem",
        type: "second_line",
        label: "Meropenem IV (Intensive Phase - Severe Sepsis / Neuromelioidosis)",
        route: "Intravenous (IV)",
        doseText: "75 - 120 mg/kg/day IV in 3 divided doses (max. 2g/dose, 6g/day)",
        minDosePerKgDay: 75,
        maxDosePerKgDay: 120,
        dividedDoses: 3,
        frequency: "q8h (extended infusion over 3h preferred)",
        maxSingleDoseMg: 2000,
        maxDailyDoseMg: 6000,
        duration: "14 - 28 days",
        notes: "Preferred in septic shock or neuromelioidosis. Extended infusion over 3 hours optimizes time above MIC."
      },
      {
        antibioticId: "cotrimoxazole",
        type: "first_line",
        label: "Co-trimoxazole (Bactrim) PO (Eradication Phase)",
        route: "Oral (PO)",
        doseText: "8 - 10 mg TMP/kg/day PO in 2 divided doses with Folic Acid supplement (5mg/day)",
        minDosePerKgDay: 8,
        maxDosePerKgDay: 10,
        dividedDoses: 2,
        frequency: "q12h",
        maxSingleDoseMg: 320,
        maxDailyDoseMg: 640,
        duration: "12 - 20 weeks",
        notes: "Eradication phase to prevent relapse. Co-prescribe Folic acid 5mg daily. Monitor FBC and renal profile."
      }
    ]
  }
];

const antibiotics = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    class: "Aminopenicillin",
    aware: "Access",
    routes: ["PO"],
    formulations: [
      { name: "Amoxicillin Suspension 125 mg / 5 mL", mgPerMl: 25 },
      { name: "Amoxicillin Suspension 250 mg / 5 mL", mgPerMl: 50 },
      { name: "Amoxicillin Capsule 250 mg", mgPerMl: null, isTablet: true },
      { name: "Amoxicillin Capsule 500 mg", mgPerMl: null, isTablet: true }
    ],
    maxDailyDoseAdult: "3000 mg/day",
    maxSingleDoseAdult: "1000 mg/dose",
    renalAdjustment: "CrCl 10-30 mL/min: q12h; CrCl < 10 mL/min: q24h",
    safetyWarnings: "Report skin rash. If rash appears with infectious mononucleosis (EBV), likely non-allergic maculopapular eruption."
  },
  {
    id: "amoxicillin_clavulanate",
    name: "Amoxicillin / Clavulanate (Augmentin)",
    class: "Beta-lactamase inhibitor combination",
    aware: "Access",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Augmentin Suspension 228 mg / 5 mL (7:1 - Amox 200mg + Clav 28.5mg)", mgPerMl: 40, activeComponent: "Amoxicillin" },
      { name: "Augmentin Forte Suspension 457 mg / 5 mL (7:1 - Amox 400mg + Clav 57mg)", mgPerMl: 80, activeComponent: "Amoxicillin" },
      { name: "Augmentin ES-600 Suspension 600 mg / 5 mL (14:1 - Amox 600mg + Clav 42.9mg)", mgPerMl: 120, activeComponent: "Amoxicillin" },
      { name: "Augmentin Tablet 375 mg (Amox 250mg)", mgPerMl: null, isTablet: true },
      { name: "Augmentin Tablet 625 mg (Amox 500mg)", mgPerMl: null, isTablet: true },
      { name: "Augmentin IV 600 mg Vial", mgPerMl: null, isVial: true },
      { name: "Augmentin IV 1.2 g Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "2000 mg amoxicillin/day (PO), 4000 mg/day (IV)",
    maxSingleDoseAdult: "1000 mg/dose (PO), 2000 mg/dose (IV)",
    renalAdjustment: "CrCl 10-30 mL/min: Use 7:1 formulation q12h, avoid 14:1. CrCl < 10 mL/min: q24h.",
    safetyWarnings: "Give at start of meals to reduce gastrointestinal upset. Watch for antibiotic-associated diarrhoea and cholestatic jaundice."
  },
  {
    id: "ampicillin",
    name: "Ampicillin",
    class: "Aminopenicillin",
    aware: "Access",
    routes: ["IV", "IM"],
    formulations: [
      { name: "Ampicillin 500 mg Vial (Powder for Injection)", mgPerMl: null, isVial: true },
      { name: "Ampicillin 1000 mg (1 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "12000 mg/day (12 g/day for meningitis)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "CrCl 10-50 mL/min: q6h-q12h; CrCl < 10 mL/min: q12h-q24h",
    safetyWarnings: "Administer slow IV bolus over 3-5 minutes or infusion over 15-30 minutes."
  },
  {
    id: "ampicillin_sulbactam",
    name: "Ampicillin / Sulbactam (Unasyn)",
    class: "Beta-lactamase inhibitor combination",
    aware: "Watch",
    routes: ["IV"],
    formulations: [
      { name: "Ampicillin/Sulbactam 750 mg Vial (Amp 500mg + Sulb 250mg)", mgPerMl: null, isVial: true },
      { name: "Ampicillin/Sulbactam 1.5 g Vial (Amp 1g + Sulb 500mg)", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "8000 mg ampicillin/day (12 g total)",
    maxSingleDoseAdult: "2000 mg ampicillin/dose",
    renalAdjustment: "CrCl 15-50 mL/min: q8h-q12h; CrCl < 15 mL/min: q24h",
    safetyWarnings: "Doses based on ampicillin component. Infuse over 15 to 30 minutes."
  },
  {
    id: "benzylpenicillin",
    name: "Benzylpenicillin (Penicillin G)",
    class: "Natural Penicillin",
    aware: "Access",
    routes: ["IV"],
    formulations: [
      { name: "Penicillin G 1 Mega Unit (600 mg / 1,000,000 units) Vial", mgPerMl: null, isVial: true },
      { name: "Penicillin G 5 Mega Units (3,000 mg / 5,000,000 units) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "24 Million units/day",
    maxSingleDoseAdult: "4-6 Million units/dose",
    renalAdjustment: "CrCl 10-50 mL/min: 75% of dose q6h; CrCl < 10 mL/min: 50% of dose q8h-q12h",
    safetyWarnings: "Risk of neurotoxicity (seizures) and hyperkalaemia with massive IV doses or in renal impairment."
  },
  {
    id: "phenoxymethylpenicillin",
    name: "Phenoxymethylpenicillin (Penicillin V)",
    class: "Natural Penicillin",
    aware: "Access",
    routes: ["PO"],
    formulations: [
      { name: "Penicillin V Syrup 125 mg / 5 mL", mgPerMl: 25 },
      { name: "Penicillin V Tablet 250 mg", mgPerMl: null, isTablet: true }
    ],
    maxDailyDoseAdult: "2000 mg/day",
    maxSingleDoseAdult: "500 mg/dose",
    renalAdjustment: "CrCl < 10 mL/min: q8h-q12h",
    safetyWarnings: "Take on an empty stomach (1 hour before or 2 hours after meals). Complete full 10 days for GAS pharyngitis."
  },
  {
    id: "cloxacillin",
    name: "Cloxacillin",
    class: "Isoxazolyl Penicillin (Anti-Staphylococcal)",
    aware: "Access",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Cloxacillin Syrup 125 mg / 5 mL", mgPerMl: 25 },
      { name: "Cloxacillin Capsule 250 mg", mgPerMl: null, isTablet: true },
      { name: "Cloxacillin Capsule 500 mg", mgPerMl: null, isTablet: true },
      { name: "Cloxacillin IV 500 mg Vial", mgPerMl: null, isVial: true },
      { name: "Cloxacillin IV 1000 mg (1 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "2000 mg/day (PO), 8000 mg/day (IV)",
    maxSingleDoseAdult: "500 mg/dose (PO), 2000 mg/dose (IV)",
    renalAdjustment: "No reduction needed unless severe renal + hepatic failure (max 2g q6h).",
    safetyWarnings: "Oral form has poor oral bioavailability and very bitter taste; must give 1 hour before food. IV can cause phlebitis; dilute adequately."
  },
  {
    id: "cephalexin",
    name: "Cephalexin",
    class: "First-generation Cephalosporin",
    aware: "Access",
    routes: ["PO"],
    formulations: [
      { name: "Cephalexin Suspension 125 mg / 5 mL", mgPerMl: 25 },
      { name: "Cephalexin Suspension 250 mg / 5 mL", mgPerMl: 50 },
      { name: "Cephalexin Capsule 250 mg", mgPerMl: null, isTablet: true },
      { name: "Cephalexin Capsule 500 mg", mgPerMl: null, isTablet: true }
    ],
    maxDailyDoseAdult: "4000 mg/day",
    maxSingleDoseAdult: "1000 mg/dose",
    renalAdjustment: "CrCl 10-50 mL/min: q8h-q12h; CrCl < 10 mL/min: q12h-q24h",
    safetyWarnings: "Safe alternative in non-severe penicillin allergy (low cross-reactivity with penicillin < 1%)."
  },
  {
    id: "cefazolin",
    name: "Cefazolin",
    class: "First-generation Cephalosporin",
    aware: "Access",
    routes: ["IV"],
    formulations: [
      { name: "Cefazolin 1000 mg (1 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "6000 mg/day (6 g/day)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "CrCl 35-54 mL/min: q8h; CrCl 11-34 mL/min: 50% dose q12h; CrCl < 10 mL/min: 50% dose q24h",
    safetyWarnings: "Workhorse surgical prophylaxis and MSSA parenteral therapy. Infuse over 30 minutes."
  },
  {
    id: "cefuroxime",
    name: "Cefuroxime Axetil / Cefuroxime Sodium",
    class: "Second-generation Cephalosporin",
    aware: "Watch",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Cefuroxime Axetil Suspension 125 mg / 5 mL (Zinnat)", mgPerMl: 25 },
      { name: "Cefuroxime Tablet 250 mg", mgPerMl: null, isTablet: true },
      { name: "Cefuroxime Tablet 500 mg", mgPerMl: null, isTablet: true },
      { name: "Cefuroxime IV 750 mg Vial", mgPerMl: null, isVial: true },
      { name: "Cefuroxime IV 1.5 g Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "1000 mg/day (PO), 4500 mg/day (IV)",
    maxSingleDoseAdult: "500 mg/dose (PO), 1500 mg/dose (IV)",
    renalAdjustment: "CrCl 10-20 mL/min: q12h; CrCl < 10 mL/min: q24h",
    safetyWarnings: "Take oral suspension with food to improve absorption and improve palatability. Do not crush tablets."
  },
  {
    id: "cefotaxime",
    name: "Cefotaxime",
    class: "Third-generation Cephalosporin",
    aware: "Watch",
    routes: ["IV"],
    formulations: [
      { name: "Cefotaxime 500 mg Vial", mgPerMl: null, isVial: true },
      { name: "Cefotaxime 1000 mg (1 g) Vial", mgPerMl: null, isVial: true },
      { name: "Cefotaxime 2000 mg (2 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "12000 mg/day (12 g/day)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "CrCl < 20 mL/min: reduce dose by 50% or extend interval to q12h",
    safetyWarnings: "Preferred 3rd generation cephalosporin in neonates as it does NOT displace bilirubin and does NOT interact with calcium."
  },
  {
    id: "ceftriaxone",
    name: "Ceftriaxone (Rocephin)",
    class: "Third-generation Cephalosporin",
    aware: "Watch",
    routes: ["IV", "IM"],
    formulations: [
      { name: "Ceftriaxone 1000 mg (1 g) Vial", mgPerMl: null, isVial: true },
      { name: "Ceftriaxone 2000 mg (2 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "4000 mg/day (4 g/day for meningitis)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "No dose adjustment required if renal impairment alone. Max 2g/day if combined renal & severe hepatic impairment.",
    safetyWarnings: "CONTRAINDICATED in neonates ≤28 days if requiring calcium-containing IV solutions (risk of fatal ceftriaxone-calcium salt precipitation) or in hyperbilirubinaemic neonates (displaces bilirubin from albumin)."
  },
  {
    id: "ceftazidime",
    name: "Ceftazidime (Fortum)",
    class: "Third-generation Cephalosporin (Anti-Pseudomonal)",
    aware: "Watch",
    routes: ["IV"],
    formulations: [
      { name: "Ceftazidime 1000 mg (1 g) Vial", mgPerMl: null, isVial: true },
      { name: "Ceftazidime 2000 mg (2 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "6000 mg/day (6 g/day)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "CrCl 31-50 mL/min: 1g q12h; CrCl 16-30 mL/min: 1g q24h; CrCl < 15 mL/min: 500mg q24h-q48h",
    safetyWarnings: "Primary choice for intensive phase of Melioidosis and Pseudomonas aeruginosa infections."
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    class: "Aminoglycoside",
    aware: "Access",
    routes: ["IV", "IM"],
    formulations: [
      { name: "Gentamicin Injection 80 mg / 2 mL (40 mg/mL)", mgPerMl: 40, isAmpoule: true },
      { name: "Gentamicin Paediatric Injection 20 mg / 2 mL (10 mg/mL)", mgPerMl: 10, isAmpoule: true }
    ],
    maxDailyDoseAdult: "7 mg/kg/day (extended interval)",
    maxSingleDoseAdult: "400-500 mg/dose",
    renalAdjustment: "Mandatory TDM & interval extension based on CrCl / trough level.",
    safetyWarnings: "NEPHROTOXIC & OTOTOXIC. Always calculate dose using ideal body weight in obese patients. Target trough: < 1 mcg/mL (< 2 mcg/mL in neonates). Target peak: 5-10 mcg/mL (conventional) or 16-24 mcg/mL (once-daily)."
  },
  {
    id: "amikacin",
    name: "Amikacin",
    class: "Aminoglycoside",
    aware: "Access",
    routes: ["IV"],
    formulations: [
      { name: "Amikacin Injection 500 mg / 2 mL (250 mg/mL)", mgPerMl: 250, isAmpoule: true },
      { name: "Amikacin Injection 100 mg / 2 mL (50 mg/mL)", mgPerMl: 50, isAmpoule: true }
    ],
    maxDailyDoseAdult: "15 mg/kg/day (max 1.5 g/day)",
    maxSingleDoseAdult: "1500 mg/dose",
    renalAdjustment: "Mandatory TDM. Extend interval based on renal clearance.",
    safetyWarnings: "Nephrotoxic & ototoxic. Target trough: < 5 mcg/mL. Target peak: 20-30 mcg/mL (conventional) or 50-60 mcg/mL (once daily)."
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    class: "Macrolide / Azalide",
    aware: "Watch",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Azithromycin Suspension 200 mg / 5 mL (40 mg/mL)", mgPerMl: 40 },
      { name: "Azithromycin Tablet 250 mg", mgPerMl: null, isTablet: true },
      { name: "Azithromycin Tablet 500 mg", mgPerMl: null, isTablet: true },
      { name: "Azithromycin IV 500 mg Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "500 mg/day",
    maxSingleDoseAdult: "500 mg/dose",
    renalAdjustment: "No dosage adjustment needed for mild-to-moderate impairment. Caution if CrCl < 10 mL/min.",
    safetyWarnings: "Take 1 hour before or 2 hours after food for suspension. Caution in prolonged QT interval."
  },
  {
    id: "erythromycin",
    name: "Erythromycin Ethylsuccinate (EES)",
    class: "Macrolide",
    aware: "Access",
    routes: ["PO"],
    formulations: [
      { name: "Erythromycin Ethylsuccinate Syrup 200 mg / 5 mL", mgPerMl: 40 },
      { name: "Erythromycin Ethylsuccinate Tablet 400 mg", mgPerMl: null, isTablet: true }
    ],
    maxDailyDoseAdult: "2000 mg/day (2 g/day)",
    maxSingleDoseAdult: "800 mg/dose",
    renalAdjustment: "Max 1.5 g/day if CrCl < 10 mL/min.",
    safetyWarnings: "Strong CYP3A4 inhibitor (multiple drug interactions). Associated with infantile hypertrophic pyloric stenosis in young infants < 6 weeks."
  },
  {
    id: "clindamycin",
    name: "Clindamycin (Dalacin C)",
    class: "Lincosamide",
    aware: "Access",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Clindamycin Capsule 150 mg", mgPerMl: null, isTablet: true },
      { name: "Clindamycin Capsule 300 mg", mgPerMl: null, isTablet: true },
      { name: "Clindamycin Injection 300 mg / 2 mL", mgPerMl: 150, isAmpoule: true },
      { name: "Clindamycin Injection 600 mg / 4 mL", mgPerMl: 150, isAmpoule: true }
    ],
    maxDailyDoseAdult: "1800 mg/day (PO), 2700 mg/day (IV)",
    maxSingleDoseAdult: "600 mg/dose (PO), 900 mg/dose (IV)",
    renalAdjustment: "No adjustment needed.",
    safetyWarnings: "Inhibits bacterial protein synthesis and toxin production. Black box warning for Clostridioides difficile-associated diarrhoea."
  },
  {
    id: "metronidazole",
    name: "Metronidazole (Flagyl)",
    class: "Nitroimidazole",
    aware: "Access",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Metronidazole Suspension 200 mg / 5 mL (as benzoate)", mgPerMl: 40 },
      { name: "Metronidazole Tablet 200 mg", mgPerMl: null, isTablet: true },
      { name: "Metronidazole Tablet 400 mg", mgPerMl: null, isTablet: true },
      { name: "Metronidazole IV 500 mg / 100 mL Infusion Bottle", mgPerMl: 5, isInfusion: true }
    ],
    maxDailyDoseAdult: "1500 mg/day (PO), 1500 mg/day (IV)",
    maxSingleDoseAdult: "500 mg/dose",
    renalAdjustment: "CrCl < 10 mL/min: reduce dose by 50% or give q12h.",
    safetyWarnings: "Disulfiram-like reaction with alcohol. Metallic taste and GI symptoms common. Infuse IV over 30-60 minutes."
  },
  {
    id: "cotrimoxazole",
    name: "Co-trimoxazole (Trimethoprim / Sulfamethoxazole - Bactrim)",
    class: "Folate synthesis inhibitor combination",
    aware: "Access",
    routes: ["PO", "IV"],
    formulations: [
      { name: "Cotrimoxazole Paediatric Suspension 240 mg / 5 mL (TMP 40mg + SMX 200mg)", mgPerMl: 8, activeComponent: "TMP", totalMgPerMl: 48 },
      { name: "Cotrimoxazole Tablet 480 mg (TMP 80mg + SMX 400mg)", mgPerMl: null, isTablet: true },
      { name: "Cotrimoxazole Forte Tablet 960 mg (TMP 160mg + SMX 800mg)", mgPerMl: null, isTablet: true },
      { name: "Cotrimoxazole IV Ampoule 480 mg / 5 mL", mgPerMl: 16, isAmpoule: true }
    ],
    maxDailyDoseAdult: "320 mg TMP/day (standard), up to 960 mg TMP/day (PJP / Melioidosis)",
    maxSingleDoseAdult: "160 mg TMP/dose",
    renalAdjustment: "CrCl 15-30 mL/min: 50% of dose; CrCl < 15 mL/min: Not recommended.",
    safetyWarnings: "Doses specified by TMP component. Contraindicated in severe G6PD deficiency and infants < 6 weeks (risk of kernicterus). Maintain adequate hydration to prevent crystalluria."
  },
  {
    id: "nitrofurantoin",
    name: "Nitrofurantoin (Macrodantin)",
    class: "Nitrofuran",
    aware: "Access",
    routes: ["PO"],
    formulations: [
      { name: "Nitrofurantoin Capsule 50 mg", mgPerMl: null, isTablet: true },
      { name: "Nitrofurantoin Capsule 100 mg", mgPerMl: null, isTablet: true }
    ],
    maxDailyDoseAdult: "200-400 mg/day",
    maxSingleDoseAdult: "100 mg/dose",
    renalAdjustment: "CONTRAINDICATED if CrCl < 30 mL/min (ineffective and risk of peripheral neuropathy).",
    safetyWarnings: "Only for lower urinary tract infection (cystitis). Contraindicated in G6PD deficiency and near-term pregnancy/neonates (haemolytic anaemia)."
  },
  {
    id: "meropenem",
    name: "Meropenem",
    class: "Carbapenem",
    aware: "Watch",
    routes: ["IV"],
    formulations: [
      { name: "Meropenem 500 mg Vial", mgPerMl: null, isVial: true },
      { name: "Meropenem 1000 mg (1 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "6000 mg/day (6 g/day)",
    maxSingleDoseAdult: "2000 mg/dose",
    renalAdjustment: "CrCl 26-50 mL/min: standard dose q12h; CrCl 10-25 mL/min: 50% dose q12h; CrCl < 10 mL/min: 50% dose q24h",
    safetyWarnings: "Broad-spectrum carbapenem for ESBL organisms, severe intra-abdominal sepsis, and Melioidosis. Lower seizure risk than imipenem. Extended 3-hour infusion recommended in critically ill."
  },
  {
    id: "vancomycin",
    name: "Vancomycin",
    class: "Glycopeptide",
    aware: "Watch",
    routes: ["IV"],
    formulations: [
      { name: "Vancomycin 500 mg Vial", mgPerMl: null, isVial: true },
      { name: "Vancomycin 1000 mg (1 g) Vial", mgPerMl: null, isVial: true }
    ],
    maxDailyDoseAdult: "2000 mg/day (higher with TDM guidance)",
    maxSingleDoseAdult: "1000-1500 mg/dose",
    renalAdjustment: "Mandatory TDM and interval adjustment based on CrCl / AUC:MIC / trough level.",
    safetyWarnings: "MANDATORY TDM. Red Man Syndrome with rapid infusion: infuse each 500mg over at least 60 minutes. Monitor renal function and trough level before 4th dose. Trough target: 10-15 mcg/mL (routine), 15-20 mcg/mL (severe/CNS/MRSA pneumonia)."
  }
];

fs.writeFileSync(path.join(__dirname, 'public', 'data', 'conditions.json'), JSON.stringify(conditions, null, 2));
fs.writeFileSync(path.join(__dirname, 'public', 'data', 'antibiotics.json'), JSON.stringify(antibiotics, null, 2));
console.log('Successfully generated conditions.json (' + conditions.length + ' conditions) and antibiotics.json (' + antibiotics.length + ' antibiotics)');
