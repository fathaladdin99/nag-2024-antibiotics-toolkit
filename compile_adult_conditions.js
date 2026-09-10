const fs = require('fs');
const path = require('path');

const adultConditions = [
  // =========================================================================
  // 1. RESPIRATORY INFECTIONS (A11)
  // =========================================================================
  {
    id: "adult_cap_mild_outpatient",
    name: "Community-Acquired Pneumonia (CAP) - Outpatient / Mild (CRB-65 = 0)",
    category: "Respiratory",
    organism: "Streptococcus pneumoniae, Mycoplasma pneumoniae, Chlamydia pneumoniae, Respiratory viruses",
    preferred: {
      drug: "Amoxicillin PO",
      doseText: "500 mg - 1 g PO TDS (q8h) for 5 days",
      route: "PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Augmentin 625mg PO (Amox 500mg + Clav 125mg)",
        doseText: "625 mg PO TDS (q8h) for 5 days (If comorbidities: COPD, diabetes, renal failure)",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Azithromycin PO (Penicillin Allergy / Atypical Suspicion)",
        doseText: "500 mg PO OD on Day 1, then 250 mg PO OD on Days 2-5 (or 500mg OD for 3 days)",
        route: "PO",
        aware: "Watch"
      },
      {
        drug: "Doxycycline PO (Penicillin Allergy Alternative)",
        doseText: "100 mg PO BD (q12h) for 5 to 7 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "5 days",
    comments: "CRB-65 score = 0 (Confusion, Resp rate ≥30, BP <90/60, Age ≥65). Review at 48 hours. Extend to 7 days if slow clinical response."
  },
  {
    id: "adult_cap_moderate_severe_inpatient",
    name: "Community-Acquired Pneumonia (CAP) - Inpatient / Severe (CRB-65 ≥ 1)",
    category: "Respiratory",
    organism: "Streptococcus pneumoniae, S. aureus, Klebsiella pneumoniae, Legionella pneumophila",
    preferred: {
      drug: "Ampicillin/Sulbactam IV (Unasyn) OR Amoxicillin/Clavulanate IV (Augmentin)",
      doseText: "Ampicillin/Sulbactam 1.5 g - 3 g IV q6h (or Augmentin 1.2 g IV q8h) PLUS Azithromycin 500 mg IV/PO OD",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Ceftriaxone IV PLUS Azithromycin IV/PO",
        doseText: "Ceftriaxone 1 g - 2 g IV OD (q24h) PLUS Azithromycin 500 mg IV/PO OD",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Levofloxacin IV/PO (Severe Beta-lactam Allergy)",
        doseText: "500 mg - 750 mg IV/PO OD (q24h) for 7 days",
        route: "IV / PO",
        aware: "Watch"
      }
    ],
    duration: "5 - 7 days (switch to oral once clinically stable)",
    comments: "Take blood cultures before starting antibiotics. Add MRSA coverage (Vancomycin) if cavitary infiltrates or post-influenza pneumonia. Add antipseudomonal coverage if structural lung disease / bronchiectasis."
  },
  {
    id: "adult_copd_aecopd",
    name: "Acute Exacerbation of COPD (AECOPD - Infective)",
    category: "Respiratory",
    organism: "Haemophilus influenzae, Moraxella catarrhalis, Streptococcus pneumoniae, Pseudomonas (in severe FEV1)",
    preferred: {
      drug: "Amoxicillin/Clavulanate (Augmentin) PO",
      doseText: "625 mg PO TDS (q8h) for 5 days",
      route: "PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Amoxicillin PO (Uncomplicated / Mild)",
        doseText: "500 mg PO TDS (q8h) for 5 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Doxycycline PO (Penicillin Allergy)",
        doseText: "100 mg PO BD (q12h) for 5 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Azithromycin PO",
        doseText: "500 mg PO OD on Day 1, then 250 mg PO OD on Days 2-5",
        route: "PO",
        aware: "Watch"
      }
    ],
    duration: "5 days",
    comments: "Antibiotics indicated if patient has Anthonisen criteria: increased sputum purulence PLUS increased sputum volume or dyspnoea."
  },
  {
    id: "adult_aspiration_pneumonia",
    name: "Aspiration Pneumonia & Lung Abscess",
    category: "Respiratory",
    organism: "Oral anaerobes (Peptostreptococcus, Fusobacterium, Prevotella), Streptococcus anginosus group, Enterobacterales",
    preferred: {
      drug: "Ampicillin/Sulbactam IV (Unasyn) OR Augmentin IV",
      doseText: "Ampicillin/Sulbactam 1.5 g IV q6h OR Augmentin 1.2 g IV q8h",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Ceftriaxone IV PLUS Metronidazole IV",
        doseText: "Ceftriaxone 2 g IV OD + Metronidazole 500 mg IV TDS (q8h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Clindamycin IV/PO (Penicillin Allergy)",
        doseText: "600 mg IV q8h (or 300-450 mg PO TDS)",
        route: "IV / PO",
        aware: "Access"
      }
    ],
    duration: "7 - 14 days (lung abscess: 4 - 6 weeks until radiographic resolution)",
    comments: "Common in stroke, dysphagia, alcoholism, or impaired consciousness. Oral stepdown: Augmentin 625mg PO tds."
  },

  // =========================================================================
  // 2. URINARY TRACT INFECTIONS (A17)
  // =========================================================================
  {
    id: "adult_uncomplicated_cystitis",
    name: "Acute Uncomplicated Cystitis (Non-pregnant Women)",
    category: "Urinary Tract",
    organism: "Escherichia coli (75-90%), Klebsiella pneumoniae, Staphylococcus saprophyticus, Proteus mirabilis",
    preferred: {
      drug: "Nitrofurantoin PO",
      doseText: "100 mg PO BD (sustained-release) with food for 5 days",
      route: "PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Fosfomycin Trometamol PO",
        doseText: "3 g PO single dose sachet dissolved in water",
        route: "PO",
        aware: "Watch"
      },
      {
        drug: "Amoxicillin/Clavulanate (Augmentin) PO",
        doseText: "625 mg PO BD (q12h) for 5 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Cephalexin PO",
        doseText: "500 mg PO BD to TDS (q8-12h) for 5 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "3 - 5 days",
    comments: "Avoid ciprofloxacin/fluoroquinolones as first-line for uncomplicated cystitis to prevent resistance (stewardship). Nitrofurantoin contraindicated if CrCl < 30 mL/min."
  },
  {
    id: "adult_acute_pyelonephritis",
    name: "Acute Pyelonephritis (Uncomplicated / Mild Outpatient)",
    category: "Urinary Tract",
    organism: "Escherichia coli, Klebsiella pneumoniae, Proteus mirabilis, Enterococcus",
    preferred: {
      drug: "Ciprofloxacin PO (If local fluoroquinolone resistance < 10%)",
      doseText: "500 mg PO BD (q12h) for 7 days",
      route: "PO",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Amoxicillin/Clavulanate (Augmentin) PO",
        doseText: "625 mg PO TDS (q8h) for 10 to 14 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Ceftriaxone IV / IM (Initial parenteral stat dose)",
        doseText: "1 g IV/IM stat then switch to oral based on C&S",
        route: "IV / IM",
        aware: "Watch"
      },
      {
        drug: "Cefuroxime Axetil PO",
        doseText: "500 mg PO BD (q12h) for 10 to 14 days",
        route: "PO",
        aware: "Watch"
      }
    ],
    duration: "7 days (fluoroquinolone) or 10-14 days (beta-lactams)",
    comments: "Take urine culture prior to starting. If high fever, vomiting, or signs of urosepsis, admit for intravenous Ceftriaxone 1-2g IV OD."
  },
  {
    id: "adult_urosepsis_complicated_uti",
    name: "Complicated UTI / Urosepsis / Acute Pyelonephritis (Inpatient)",
    category: "Urinary Tract",
    organism: "E. coli (including ESBL), Klebsiella, Pseudomonas aeruginosa, Proteus, Enterococci",
    preferred: {
      drug: "Ceftriaxone IV (First-Line Parenteral)",
      doseText: "1 g - 2 g IV OD (q24h)",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Cefotaxime IV",
        doseText: "1 g - 2 g IV TDS (q8h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Cefepime IV (If Pseudomonas or nosocomial risk)",
        doseText: "2 g IV BD (q12h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Meropenem IV (If ESBL producer or septic shock)",
        doseText: "1 g IV TDS (q8h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Amikacin IV (Add for severe sepsis synergy)",
        doseText: "15 mg/kg IV OD (single daily dose)",
        route: "IV",
        aware: "Access"
      }
    ],
    duration: "10 - 14 days",
    comments: "Rule out urinary obstruction (e.g. renal calculus, hydronephrosis) via urgent ultrasound. Relieve obstruction promptly if present."
  },
  {
    id: "adult_acute_prostatitis",
    name: "Acute Bacterial Prostatitis (ABP)",
    category: "Urinary Tract",
    organism: "Escherichia coli (80%), Pseudomonas aeruginosa, Klebsiella, Proteus",
    preferred: {
      drug: "Ciprofloxacin PO OR Levofloxacin PO",
      doseText: "Ciprofloxacin 500 mg PO BD (or Levofloxacin 500 mg PO OD) for 2 to 4 weeks",
      route: "PO",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Co-trimoxazole (Bactrim) PO",
        doseText: "Bactrim Forte (TMP 160mg + SMX 800mg) 1 tab PO BD for 4 weeks",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Ceftriaxone IV (If severe / hospitalized with sepsis)",
        doseText: "2 g IV OD initially until afebrile, then switch to oral fluoroquinolone",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "2 - 4 weeks (to penetrate prostatic stroma and prevent chronic prostatitis)",
    comments: "Do NOT perform vigorous prostate massage (risk of bacteremia and septic shock). High tissue penetration required."
  },

  // =========================================================================
  // 3. SKIN & SOFT TISSUE INFECTIONS (A14)
  // =========================================================================
  {
    id: "adult_cellulitis_erysipelas",
    name: "Cellulitis & Erysipelas (Non-Purulent / Mild to Moderate)",
    category: "Skin & Soft Tissue",
    organism: "Streptococcus pyogenes (Group A Streptococcus), Staphylococcus aureus (MSSA)",
    preferred: {
      drug: "Cloxacillin PO/IV",
      doseText: "Mild (PO): 500 mg PO QID (q6h) 1h before meals; Moderate (IV): 1 g - 2 g IV q6h",
      route: "PO / IV",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Cephalexin PO (First-Line Oral Alternative)",
        doseText: "500 mg PO QID (q6h) or 1 g PO BD for 5 to 7 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Cefazolin IV (Parenteral Alternative - Convenient q8h)",
        doseText: "1 g - 2 g IV TDS (q8h)",
        route: "IV",
        aware: "Access"
      },
      {
        drug: "Clindamycin PO/IV (Penicillin Allergy / Suspected MRSA)",
        doseText: "300 - 450 mg PO TDS (or 600 mg IV q8h) for 7 days",
        route: "PO / IV",
        aware: "Access"
      }
    ],
    duration: "5 - 7 days",
    comments: "Elevate affected limb to promote lymphatic drainage. Mark advancing borders with a surgical pen. Treat underlying tinea pedis if lower limb."
  },
  {
    id: "adult_furuncles_carbuncles_abscess",
    name: "Cutaneous Abscess, Furuncles & Carbuncles (Purulent SSTI)",
    category: "Skin & Soft Tissue",
    organism: "Staphylococcus aureus (MSSA / CA-MRSA)",
    preferred: {
      drug: "Incision and Drainage (Primary Treatment)",
      doseText: "I&D is definitive. If antibiotics indicated: Cloxacillin 500 mg PO QID for 5-7 days",
      route: "Procedure / PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Cephalexin PO",
        doseText: "500 mg PO QID for 5 to 7 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Co-trimoxazole (Bactrim Forte) PO (If CA-MRSA suspected)",
        doseText: "1 to 2 tablets PO BD (q12h) for 5 to 7 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Doxycycline PO (CA-MRSA Alternative)",
        doseText: "100 mg PO BD for 5 to 7 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "5 - 7 days",
    comments: "Antibiotics are NOT needed for small, simple abscesses adequately drained. Antibiotics indicated if surrounding cellulitis, systemic symptoms, or high-risk sites (face, hand, genitalia)."
  },
  {
    id: "adult_necrotising_fasciitis",
    name: "Necrotising Fasciitis / Fournier's Gangrene (Type 1 & 2)",
    category: "Skin & Soft Tissue",
    organism: "Type 1: Polymicrobial (Bacteroides, Peptostreptococcus, E. coli, Klebsiella); Type 2: Monomicrobial (Group A Streptococcus, S. aureus)",
    preferred: {
      drug: "EMERGENCY SURGICAL DEBRIDEMENT + Broad-Spectrum Triple Therapy",
      doseText: "Benzylpenicillin 3-4 MU IV q4h + Cloxacillin 2g IV q4h + Gentamicin 5-7mg/kg OD + Clindamycin 900mg IV q8h",
      route: "IV + Surgery",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Piperacillin/Tazobactam IV (Tazocin) PLUS Clindamycin IV",
        doseText: "Tazocin 4.5 g IV q6h PLUS Clindamycin 900 mg IV q8h (+ Vancomycin if MRSA suspected)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Meropenem IV PLUS Clindamycin IV",
        doseText: "Meropenem 1 g IV q8h PLUS Clindamycin 900 mg IV q8h (+ Vancomycin)",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "Individualized until serial surgical debridements completed",
    comments: "SURGICAL EMERGENCY! Severe pain out of proportion to skin signs, dishwater pus, crepitus, hemorrhagic bullae. Clindamycin is mandatory for antitoxin / ribosome-inhibiting effect against GAS pyrogenic exotoxins."
  },
  {
    id: "adult_diabetic_foot_infection",
    name: "Diabetic Foot Infection (Moderate to Severe)",
    category: "Skin & Soft Tissue",
    organism: "Staphylococcus aureus, Streptococcus spp., Enterobacterales, Pseudomonas aeruginosa, Anaerobes",
    preferred: {
      drug: "Amoxicillin/Clavulanate (Augmentin) IV/PO",
      doseText: "Augmentin 1.2 g IV TDS (or 625 mg PO TDS if mild/outpatient)",
      route: "IV / PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Ampicillin/Sulbactam IV (Unasyn)",
        doseText: "1.5 g - 3 g IV TDS to QID (q6-8h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Ceftriaxone IV PLUS Metronidazole IV",
        doseText: "Ceftriaxone 2 g IV OD + Metronidazole 500 mg IV TDS",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Piperacillin/Tazobactam IV (Tazocin) (If Pseudomonas / Severe Limb-Threatening)",
        doseText: "4.5 g IV TDS to QID (q6-8h)",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "1 - 2 weeks (soft tissue) or 4 - 6 weeks (if underlying osteomyelitis without bone resection)",
    comments: "Debride devitalized tissue and probe ulcer to bone (positive probe-to-bone test suggests osteomyelitis). Obtain plain radiograph."
  },

  // =========================================================================
  // 4. GASTROINTESTINAL & HEPATOBILIARY (A4)
  // =========================================================================
  {
    id: "adult_h_pylori_eradication",
    name: "Helicobacter pylori Infection (Eradication Therapy)",
    category: "Gastrointestinal",
    organism: "Helicobacter pylori",
    preferred: {
      drug: "14-Day Standard Triple Therapy",
      doseText: "PPI (Esomeprazole 20mg or Pantoprazole 40mg BD) + Amoxicillin 1 g BD + Clarithromycin 500 mg BD for 14 days",
      route: "PO",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "14-Day Bismuth Quadruple Therapy (If High Clarithromycin Resistance)",
        doseText: "PPI BD + Bismuth subcitrate 120 mg QID + Metronidazole 400 mg TDS + Tetracycline 500 mg QID for 14 days",
        route: "PO",
        aware: "Watch"
      },
      {
        drug: "14-Day Concomitant Non-Bismuth Quadruple",
        doseText: "PPI BD + Amoxicillin 1 g BD + Clarithromycin 500 mg BD + Metronidazole 400 mg BD for 14 days",
        route: "PO",
        aware: "Watch"
      }
    ],
    duration: "14 full days",
    comments: "NAG 2024 emphasizes 14-day duration (superior eradication rate compared to 7 or 10 days). Confirm eradication via urea breath test (UBT) at least 4 weeks post-treatment."
  },
  {
    id: "adult_cholecystitis_cholangitis",
    name: "Acute Cholecystitis & Acute Cholangitis (Biliary Sepsis)",
    category: "Gastrointestinal",
    organism: "Escherichia coli, Klebsiella pneumoniae, Enterococcus, Bacteroides fragilis",
    preferred: {
      drug: "Cefoperazone/Sulbactam (Sulperazon) OR Augmentin IV",
      doseText: "Cefoperazone/Sulbactam 1.5 g - 3 g IV q12h OR Augmentin 1.2 g IV q8h",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Ceftriaxone IV PLUS Metronidazole IV",
        doseText: "Ceftriaxone 2 g IV OD + Metronidazole 500 mg IV TDS (q8h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Piperacillin/Tazobactam IV (Tazocin) (Severe / Charcot Triad / Shock)",
        doseText: "4.5 g IV q6-8h",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "4 - 7 days (cholecystitis) or 24-48 hours post-biliary decompression (cholangitis)",
    comments: "In acute cholangitis, emergency biliary decompression (ERCP / stenting / percutaneous transhepatic drainage) is definitive life-saving therapy."
  },
  {
    id: "adult_clostridioides_difficile",
    name: "Clostridioides difficile Infection (CDI / Pseudomembranous Colitis)",
    category: "Gastrointestinal",
    organism: "Clostridioides difficile (toxin-producing)",
    preferred: {
      drug: "Oral Vancomycin (Drug of Choice)",
      doseText: "125 mg PO QID (q6h) for 10 days",
      route: "PO (Oral only - IV vancomycin does not penetrate colonic lumen)",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Fidaxomicin PO (Alternative / Recurrent Episode)",
        doseText: "200 mg PO BD (q12h) for 10 days",
        route: "PO",
        aware: "Reserve"
      },
      {
        drug: "Metronidazole PO (Only if Vancomycin completely unavailable - Non-severe)",
        doseText: "400 - 500 mg PO TDS (q8h) for 10 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "10 days",
    comments: "CRITICAL: IV Vancomycin is NOT excreted into the gut lumen and is ineffective! Must use Oral Vancomycin. Stop precipitating broad-spectrum antibiotics. Contact enteric isolation."
  },
  {
    id: "adult_spontaneous_bacterial_peritonitis",
    name: "Spontaneous Bacterial Peritonitis (SBP in Cirrhosis)",
    category: "Gastrointestinal",
    organism: "E. coli, Klebsiella pneumoniae, Streptococcus pneumoniae, Enterococcus",
    preferred: {
      drug: "Cefotaxime IV OR Ceftriaxone IV",
      doseText: "Cefotaxime 2 g IV TDS (q8h) OR Ceftriaxone 2 g IV OD (q24h)",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Ciprofloxacin IV/PO (If beta-lactam allergic)",
        doseText: "400 mg IV BD or 500 mg PO BD for 5 days",
        route: "IV / PO",
        aware: "Watch"
      },
      {
        drug: "Secondary Prophylaxis Post-SBP",
        doseText: "Norfloxacin 400 mg PO OD or Bactrim Forte 1 tab PO OD long-term",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "5 days (repeat diagnostic paracentesis if no improvement)",
    comments: "Diagnosis: Aschites neutrophil count (PMN) ≥ 250 cells/mm³. Co-administer IV Albumin (1.5 g/kg on Day 1, 1 g/kg on Day 3) to prevent hepatorenal syndrome and reduce mortality."
  },

  // =========================================================================
  // 5. CENTRAL NERVOUS SYSTEM (A2)
  // =========================================================================
  {
    id: "adult_acute_bacterial_meningitis",
    name: "Acute Bacterial Meningitis (Adult Empiric)",
    category: "Central Nervous System",
    organism: "Streptococcus pneumoniae, Neisseria meningitidis, Listeria monocytogenes (in age >50y / immunocompromised)",
    preferred: {
      drug: "Ceftriaxone IV 2g BD PLUS Ampicillin IV (if >50y)",
      doseText: "Ceftriaxone 2 g IV BD (q12h) PLUS Ampicillin 2 g IV q4h (if age ≥ 50 or immunocompromised)",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Cefotaxime IV PLUS Ampicillin IV",
        doseText: "Cefotaxime 2 g IV q4h - q6h PLUS Ampicillin 2 g IV q4h",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Vancomycin IV (Add if Cephalosporin-resistant S. pneumoniae / PRSP suspected)",
        doseText: "15 - 20 mg/kg IV q8-12h (max. 2g/dose). Target trough 15 - 20 mcg/mL.",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Meropenem IV 2g TDS (Beta-lactam Anaphylaxis / Listeria Coverage)",
        doseText: "2 g IV TDS (q8h) (infuse over 3h)",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "10 - 14 days (S. pneumoniae) / 7 days (N. meningitidis) / 21 days (Listeria)",
    comments: "MEDICAL EMERGENCY! Administer Dexamethasone 10 mg IV immediately before or with the first dose of antibiotics (reduces neurological sequelae and hearing loss in pneumococcal meningitis)."
  },

  // =========================================================================
  // 6. SEXUALLY TRANSMITTED INFECTIONS (A13)
  // =========================================================================
  {
    id: "adult_gonorrhoea_chlamydia",
    name: "Gonorrhoea & Chlamydia (Urethritis / Cervicitis)",
    category: "Sexually Transmitted",
    organism: "Neisseria gonorrhoeae, Chlamydia trachomatis",
    preferred: {
      drug: "Ceftriaxone IM PLUS Doxycycline PO (Dual Empiric Therapy)",
      doseText: "Ceftriaxone 500 mg IM single stat dose PLUS Doxycycline 100 mg PO BD for 7 days",
      route: "IM + PO",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Ceftriaxone 500mg IM PLUS Azithromycin 1g PO stat",
        doseText: "Ceftriaxone 500 mg IM stat + Azithromycin 1 g PO single dose (if adherence to 7-day doxycycline is questionable)",
        route: "IM + PO",
        aware: "Watch"
      },
      {
        drug: "Spectinomycin 2g IM stat (Severe Cephalosporin Allergy)",
        doseText: "2 g IM single dose PLUS Doxycycline 100 mg PO BD for 7 days",
        route: "IM + PO",
        aware: "Watch"
      }
    ],
    duration: "Single stat dose (Gonorrhoea) + 7 days (Chlamydia)",
    comments: "Treat all sexual partners within the past 60 days. Counsel patient to abstain from sexual contact until 7 days post-treatment and symptoms resolved. Screen for HIV, Syphilis, and Hepatitis B."
  },
  {
    id: "adult_syphilis_primary_secondary",
    name: "Syphilis (Primary, Secondary, Early Latent < 2 Years)",
    category: "Sexually Transmitted",
    organism: "Treponema pallidum",
    preferred: {
      drug: "Benzathine Penicillin G (BPG) IM",
      doseText: "2.4 Mega Units (2,400,000 units) IM as a single dose (given as two 1.2 MU injections in each buttock)",
      route: "IM",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Doxycycline PO (Penicillin-Allergic Non-Pregnant)",
        doseText: "100 mg PO BD (q12h) for 14 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Ceftriaxone IV/IM (Penicillin-Allergic Alternative)",
        doseText: "1 g IV/IM once daily for 10 to 14 days",
        route: "IV / IM",
        aware: "Watch"
      }
    ],
    duration: "Single dose (BPG) or 14 days (Doxycycline)",
    comments: "Warn patient regarding Jarisch-Herxheimer reaction (fever, chills, headache, myalgia within 2-24 hours). For Late Latent (>2 years): BPG 2.4 MU IM weekly for 3 consecutive weeks."
  },

  // =========================================================================
  // 7. ENT & THROAT (A10)
  // =========================================================================
  {
    id: "adult_tonsillopharyngitis",
    name: "Acute Tonsillopharyngitis (Sore Throat / GAS)",
    category: "ENT",
    organism: "Streptococcus pyogenes (Group A Streptococcus)",
    preferred: {
      drug: "Phenoxymethylpenicillin (Penicillin V) PO",
      doseText: "500 mg PO QID (q6h) or BD for 10 full days",
      route: "PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Amoxicillin PO",
        doseText: "500 mg PO TDS or 1 g PO BD for 10 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Cephalexin PO (Non-severe Allergy)",
        doseText: "500 mg PO BD for 10 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Erythromycin Ethylsuccinate PO (Severe Penicillin Allergy)",
        doseText: "400 mg - 800 mg PO BD for 10 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Azithromycin PO",
        doseText: "500 mg PO OD for 3 to 5 days",
        route: "PO",
        aware: "Watch"
      }
    ],
    duration: "10 days (Penicillin/Amoxicillin) or 5 days (Azithromycin)",
    comments: "Centor score ≥3 indicates testing or treatment. Must complete full 10-day penicillin course to prevent rheumatic fever."
  },
  {
    id: "adult_acute_rhinosinusitis",
    name: "Acute Bacterial Rhinosinusitis (Adult)",
    category: "ENT",
    organism: "Streptococcus pneumoniae, H. influenzae, Moraxella catarrhalis",
    preferred: {
      drug: "Amoxicillin/Clavulanate (Augmentin) PO",
      doseText: "625 mg PO TDS (q8h) for 5 to 7 days",
      route: "PO",
      aware: "Access"
    },
    alternatives: [
      {
        drug: "Amoxicillin PO (Uncomplicated / Low Risk)",
        doseText: "500 mg - 1 g PO TDS for 5 to 7 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Cefuroxime Axetil PO (Penicillin Allergy)",
        doseText: "500 mg PO BD for 5 to 7 days",
        route: "PO",
        aware: "Watch"
      },
      {
        drug: "Doxycycline PO",
        doseText: "100 mg PO BD for 5 to 7 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "5 - 7 days",
    comments: "Majority is viral. Antibiotics indicated if symptoms persist ≥10 days, 'double sickening', or severe onset with high fever."
  },

  // =========================================================================
  // 8. TROPICAL & SEPSIS (A16 & A12)
  // =========================================================================
  {
    id: "adult_melioidosis",
    name: "Melioidosis (Burkholderia pseudomallei) (Updated Jan '26)",
    category: "Tropical",
    organism: "Burkholderia pseudomallei",
    preferred: {
      drug: "Ceftazidime IV (Intensive Phase - First Line)",
      doseText: "2 g IV TDS (q8h) for minimum 10 to 14 days (longer if deep organ abscesses)",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Meropenem IV (Intensive Phase - Septic Shock / Neuromelioidosis)",
        doseText: "1 g - 2 g IV TDS (q8h) (infuse over 3h)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Co-trimoxazole (Bactrim Forte) PO (Eradication Phase)",
        doseText: "Bactrim Forte 2 tablets PO BD with Folic Acid 5mg OD for 12 to 20 weeks",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "Intensive IV (10-14 days minimum) → Eradication PO (12-20 weeks)",
    comments: "NAG 2024 update: Strict compliance with eradication phase is crucial to prevent fatal relapse."
  },
  {
    id: "adult_leptospirosis",
    name: "Leptospirosis (Weil's Disease)",
    category: "Tropical",
    organism: "Leptospira interrogans",
    preferred: {
      drug: "Ceftriaxone IV OR Benzylpenicillin IV (Moderate to Severe)",
      doseText: "Ceftriaxone 1 g - 2 g IV OD OR Benzylpenicillin 1.5 MU IV q6h for 7 days",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Doxycycline PO (Mild / Outpatient)",
        doseText: "100 mg PO BD for 7 days",
        route: "PO",
        aware: "Access"
      },
      {
        drug: "Amoxicillin PO (Mild / Alternative)",
        doseText: "500 mg PO TDS for 7 days",
        route: "PO",
        aware: "Access"
      }
    ],
    duration: "7 days",
    comments: "Look out for Jarisch-Herxheimer reaction. Monitor renal profile, bilirubin, and platelets closely."
  },
  {
    id: "adult_sepsis_shock",
    name: "Sepsis & Septic Shock (Unknown Focus - Community Acquired)",
    category: "Sepsis",
    organism: "Polymicrobial / GNB / Pneumococcus / S. aureus",
    preferred: {
      drug: "Ceftriaxone IV PLUS Amikacin IV (or Cefotaxime IV)",
      doseText: "Ceftriaxone 2 g IV OD (or Cefotaxime 2 g IV TDS) PLUS Amikacin 15 mg/kg IV OD stat",
      route: "IV",
      aware: "Watch"
    },
    alternatives: [
      {
        drug: "Piperacillin/Tazobactam IV (Tazocin) (If Hospital-Acquired / Pseudomonas)",
        doseText: "4.5 g IV q6h (+ Amikacin 15mg/kg OD)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Meropenem IV (If Septic Shock / ESBL risk)",
        doseText: "1 g IV TDS (infuse over 3 hours)",
        route: "IV",
        aware: "Watch"
      },
      {
        drug: "Vancomycin IV (Add if MRSA risk or line sepsis)",
        doseText: "15 - 20 mg/kg IV q8-12h (max. 2g/dose). Target trough 15-20 mcg/mL.",
        route: "IV",
        aware: "Watch"
      }
    ],
    duration: "7 - 10 days",
    comments: "GOLDEN HOUR: Administer first dose within 1 hour of recognition. Take blood cultures, lactate, and start 30 mL/kg crystalloid resuscitation."
  }
];

// Write adult_conditions.json
const adultPath = path.join(__dirname, 'public', 'data', 'adult_conditions.json');
fs.writeFileSync(adultPath, JSON.stringify(adultConditions, null, 2));

console.log(`✅ Successfully compiled Adult NAG dataset: ${adultConditions.length} clinical conditions!`);
