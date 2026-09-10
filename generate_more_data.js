const fs = require('fs');
const path = require('path');

const neonatalData = [
  {
    id: "gentamicin_neonatal",
    drugName: "Gentamicin IV",
    indication: "Neonatal Sepsis / Meningitis / UTI / NEC",
    dose: "5 mg/kg/dose IV",
    dosingRules: [
      {
        cga: "< 30 weeks CGA",
        interval: "q48h (every 48 hours)",
        description: "Preterm < 30 weeks corrected gestational age"
      },
      {
        cga: "30 - 34 weeks CGA",
        interval: "q36h (every 36 hours)",
        description: "Preterm 30 to 34 weeks corrected gestational age"
      },
      {
        cga: "≥ 35 weeks CGA",
        interval: "q24h (every 24 hours)",
        description: "Term / Late preterm ≥ 35 weeks corrected gestational age"
      }
    ],
    tdmTarget: "Trough < 1.0 - 2.0 mcg/mL; Peak 5.0 - 10.0 mcg/mL",
    notes: "NAG 2024 CGA protocol. Once-daily extended interval reduces nephrotoxicity. Check trough before 2nd or 3rd dose."
  },
  {
    id: "amikacin_neonatal",
    drugName: "Amikacin IV",
    indication: "Neonatal Resistant Gram-Negative Sepsis / NEC",
    dose: "15 mg/kg/dose IV",
    dosingRules: [
      {
        cga: "< 30 weeks CGA",
        interval: "q48h (every 48 hours)",
        description: "Preterm < 30 weeks corrected gestational age"
      },
      {
        cga: "30 - 34 weeks CGA",
        interval: "q36h (every 36 hours)",
        description: "Preterm 30 to 34 weeks corrected gestational age"
      },
      {
        cga: "≥ 35 weeks CGA",
        interval: "q24h (every 24 hours)",
        description: "Term / Late preterm ≥ 35 weeks corrected gestational age"
      }
    ],
    tdmTarget: "Trough < 5 mcg/mL; Peak 20 - 30 mcg/mL",
    notes: "Infuse over 30-60 minutes. Monitor urine output and serum creatinine."
  },
  {
    id: "ampicillin_neonatal",
    drugName: "Ampicillin IV",
    indication: "Neonatal Sepsis / Meningitis / Listeria / GBS",
    dose: "Sepsis: 50 mg/kg/dose IV; Meningitis: 100 mg/kg/dose IV",
    dosingRules: [
      {
        pna: "PNA ≤ 7 days (≤ 1 week)",
        interval: "q12h (in 2 divided doses)",
        description: "Postnatal age ≤ 7 days: 100-150 mg/kg/day (or 200 mg/kg/day for meningitis)"
      },
      {
        pna: "PNA > 7 days (> 1 week)",
        interval: "q8h (in 3 divided doses)",
        description: "Postnatal age > 7 days: 150-200 mg/kg/day (or 300 mg/kg/day for meningitis divided q6h-q8h)"
      }
    ],
    tdmTarget: "N/A (wide therapeutic index)",
    notes: "Synergistic with Gentamicin for Listeria and Group B Streptococcus."
  },
  {
    id: "cefotaxime_neonatal",
    drugName: "Cefotaxime IV",
    indication: "Neonatal Meningitis / Late Onset Sepsis / NEC Stage 2-3",
    dose: "50 mg/kg/dose IV",
    dosingRules: [
      {
        pna: "PNA ≤ 7 days",
        interval: "q12h (every 12 hours)",
        description: "Total daily dose 100 mg/kg/day"
      },
      {
        pna: "PNA > 7 days",
        interval: "q8h or q6h (every 6-8 hours)",
        description: "Total daily dose 150 - 200 mg/kg/day (q6h for proven meningitis)"
      }
    ],
    tdmTarget: "N/A",
    notes: "First choice 3rd generation cephalosporin in neonates. Avoid Ceftriaxone in neonates."
  },
  {
    id: "metronidazole_neonatal",
    drugName: "Metronidazole IV",
    indication: "Neonatal Necrotising Enterocolitis (NEC) / Anaerobic Sepsis",
    dose: "Loading dose: 15 mg/kg IV once",
    dosingRules: [
      {
        age: "≤ 34 weeks age",
        interval: "7.5 mg/kg/dose IV q12h",
        description: "Preterm ≤ 34 weeks"
      },
      {
        age: "35 - 40 weeks age",
        interval: "7.5 mg/kg/dose IV q8h",
        description: "Term neonates 35 to 40 weeks"
      },
      {
        age: "> 40 weeks age",
        interval: "10 mg/kg/dose IV q8h",
        description: "Post-term > 40 weeks"
      }
    ],
    tdmTarget: "N/A",
    notes: "Critical component of NEC triple therapy (Ampicillin + Gentamicin/Cefotaxime + Metronidazole)."
  },
  {
    id: "benzylpenicillin_neonatal",
    drugName: "Benzylpenicillin (Penicillin G) IV",
    indication: "Congenital Syphilis / Group B Streptococcus (GBS)",
    dose: "50,000 units/kg/dose (or 150,000 units/kg/dose for meningitis)",
    dosingRules: [
      {
        pna: "GA ≤ 34 weeks, PNA ≤ 7 days",
        interval: "q12h",
        description: "Preterm early postnatal"
      },
      {
        pna: "GA ≤ 34 weeks, PNA > 7 days",
        interval: "q8h",
        description: "Preterm after day 7"
      },
      {
        pna: "GA > 34 weeks, PNA ≤ 7 days",
        interval: "q8h",
        description: "Term early postnatal"
      },
      {
        pna: "GA > 34 weeks, PNA > 7 days",
        interval: "q6h",
        description: "Term after day 7"
      }
    ],
    tdmTarget: "N/A",
    notes: "Standard regimen for proven Congenital Syphilis (10-14 days) and GBS bacteraemia."
  }
];

const changelogData = {
  lastCheckedTime: new Date().toISOString(),
  latestNagVersion: "NAG 2024 (Revisions up to January 2026)",
  officialSourceUrl: "https://sites.google.com/moh.gov.my/nag/information/whats-new",
  updates: [
    {
      date: "January 2026",
      badge: "Latest",
      sections: [
        {
          name: "Paediatric Section",
          items: [
            "Gastrointestinal Infections: Parasitic Infection, Liver Abscess",
            "Neonatal Infections: Congenital and Perinatal Infections (Meningitis)",
            "Otorhinolaryngology Infections: Diphtheria management",
            "Respiratory Infections: Community-acquired pneumonia (Outpatient & Inpatient regimens refined), Empyema Thoracis"
          ]
        },
        {
          name: "Adult Section",
          items: [
            "Cardiovascular: Infective Endocarditis - Culture-Negative (Bartonella spp.)",
            "Chemoprophylaxis: Post Splenectomy vaccination schedule",
            "Ocular: Bacterial Endophthalmitis (Post-op / Trauma), Endogenous Endophthalmitis",
            "Respiratory: Severe Community-acquired pneumonia (Inpatient)",
            "Skin & Soft Tissue: Carbuncles",
            "Tropical: Melioidosis intensive & eradication phase; Filariasis"
          ]
        },
        {
          name: "Clinical Pathways in Primary Care",
          items: [
            "Acute Bronchitis and Pneumonia pathway",
            "Skin and Soft Tissue Infection",
            "Urinary Tract Infection in Non-Pregnancy",
            "Urinary Tract Infection in Pregnancy (Asymptomatic & Symptomatic)"
          ]
        }
      ]
    },
    {
      date: "December 2025",
      badge: "Previous",
      sections: [
        {
          name: "Paediatric Section",
          items: [
            "Central Nervous Infections: Neonatal Herpes Simplex Encephalitis",
            "Chemoprophylaxis: Rheumatic fever secondary prevention, Post-splenectomy, Hib and Meningococcal exposure",
            "Gastrointestinal: Dysentery, Cholera, Peritonitis, Amoebic & Pyogenic Liver abscess, Acute cholangitis",
            "Neonatal Infections: Necrotising enterocolitis (NEC) staging & antibiotic choices; Group B Streptococcus (GBS)"
          ]
        },
        {
          name: "Adult Section",
          items: [
            "Gastrointestinal: H. pylori eradication protocols, Infectious diarrhoea, Spontaneous bacterial peritonitis",
            "Obstetrics & Gynaecology: Septic abortion, Endometritis, Mastitis, LSCS infection, Bartholin's Gland Abscess (NEW TOPIC)",
            "Orthopaedic: Prosthetic Joint Infection (MSSA/MRSA), Diabetic Foot Infections",
            "Skin & Soft Tissue: Furuncles, Ecthyma gangrenosum, Cellulitis, Bite injuries, MRSA, Bedsores",
            "Urinary Tract: ABU, Uncomplicated & Complicated UTI, Urosepsis, Prostatitis, Fournier's Gangrene"
          ]
        }
      ]
    }
  ]
};

fs.writeFileSync(path.join(__dirname, 'public', 'data', 'neonatal.json'), JSON.stringify(neonatalData, null, 2));
fs.writeFileSync(path.join(__dirname, 'public', 'data', 'changelog.json'), JSON.stringify(changelogData, null, 2));
console.log('Successfully generated neonatal.json and changelog.json');
