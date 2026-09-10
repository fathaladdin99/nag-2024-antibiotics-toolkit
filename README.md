# 🩺 NAG 2024 ANTIBIOTICS TOOLKIT & CALCULATOR

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NAG Version](https://img.shields.io/badge/Guideline-MOH%20NAG%202024%20(Jan%20'26%20Sync)-0d9488.svg)](https://sites.google.com/moh.gov.my/nag/contents?authuser=0)
[![Developer](https://img.shields.io/badge/Developer-fathirosli-0284c7.svg)](mailto:fathirosli98@gmail.com)

A comprehensive, mobile-friendly clinical decision-support toolkit and antibiotic dosing calculator based on the **Ministry of Health (MOH) Malaysia National Antimicrobial Guideline (NAG) 2024 & Revisions**.

Developed by **fathirosli** to assist registered medical practitioners, clinical specialists, and healthcare professionals in making rapid, guideline-concordant antimicrobial choices.

---

## 🌟 Key Clinical Modules

### 1. 🧮 Paediatric Dosing Calculator (Section B1 to B14)
- **Indication-Specific Filtering**: Selecting a condition populates *only* the specific first-line and alternative antibiotics endorsed by NAG 2024 for that indication.
- **Dynamic Dosing Engine**: Computes exact single dose (mg), oral suspension volume (mL), dosing frequency, and duration based on patient weight and age (years & months).
- **Adult Maximum Safety Ceilings**: Automatically enforces maximum single dose (mg/dose) and maximum daily ceilings (g/day) to prevent accidental paediatric overdosing in larger children.
- **WHO / NAG Weight-Band Dosing**: Quick-apply option for standardized outpatient dosing (e.g. Amoxicillin in CAP).
- **Antimicrobial Stewardship Protocol**: Automatically detects non-bacterial/viral conditions (e.g. Viral Myocarditis, Viral Pericarditis) and presents supportive therapy guidelines.
- **Direct NAG Links**: 1-click button to open the exact chapter in official MOH NAG.

### 2. 🧑 Adult Toolkit (Section A1 to A17)
- Complete verbatim clinical guidelines covering all **17 chapters** and **497 adult clinical conditions**.
- Includes clinical assessment criteria, common pathogens, preferred first-line choices, alternatives, antibiotic allergy management, and duration comments.
- **1-Click Official Links**: Direct buttons to jump to the official MOH Google Site page for each section (`A1` to `A17`).

### 3. 📚 Paediatric Toolkit (Section B1 to B14)
- Extensive clinical coverage of all **140 paediatric conditions**:
  - `B1`: Cardiovascular Infections
  - `B2`: Central Nervous Infections
  - `B3`: Chemoprophylaxis
  - `B4`: Gastrointestinal Infections
  - `B5`: Infections in Immunocompromised Patients
  - `B6`: Neonatal Infections
  - `B7`: Ocular Infections
  - `B8`: Orthopaedic Infections
  - `B9`: Otorhinolaryngology Infections
  - `B10`: Respiratory Infections
  - `B11`: Skin & Soft Tissue Infections
  - `B12`: Tropical Infections
  - `B13`: Urinary Tract Infections
  - `B14`: Vascular Infections

### 4. 🗺️ Clinical Pathways in Primary Care (Section C1 to C9)
- High-resolution flowcharts for all 9 official primary care clinical pathways:
  - `C1`: Acute Bronchitis and Pneumonia
  - `C2`: Acute Otitis Media
  - `C3`: Acute Pharyngitis
  - `C4`: Acute Rhinosinusitis
  - `C5`: Acute Gastroenteritis
  - `C6`: Skin and Soft Tissue Infection
  - `C7`: Urinary Tract Infection in Non-Pregnancy
  - `C8`: UTI in Pregnancy (Asymptomatic Bacteriuria)
  - `C9`: UTI in Pregnancy (Symptomatic)
- Interactive lightbox modal with tap-to-enlarge full-screen view and direct PDF links.

### 5. 👶 Neonatal Regimens (Section B6)
- Specialized dosing calculator for neonates factoring in **Gestational Age (GA)** and **Post-Natal Age (PNA)** (e.g., Gentamicin, Amikacin, Vancomycin, Ampicillin).
- Therapeutic Drug Monitoring (TDM) sampling schedules and target trough/peak serum concentrations.

### 6. ⚖️ Clinical Tools (Renal Dose Adjustments)
- **Pediatric eGFR**: Bedside Schwartz Equation (`k × Height (cm) / SCr (µmol/L)`).
- **Adult CrCl**: Cockcroft-Gault Equation with gender correction.
- Automated dosage staging and interval extension guidance per NAG Appendix 2.

### 7. 🔄 NAG Live Updates Engine
- Built-in sync engine that continuously monitors the official MOH Malaysia NAG Google Site (*What's New* section).

---

## 🔄 How & When Updates Are Handled

### 1. How does the system detect updates?
- The backend features an automated scraper endpoint (`/api/updates/check`) that queries the official MOH Malaysia NAG Google Site:  
  `https://sites.google.com/moh.gov.my/nag/information/whats-new`
- It extracts the latest revision date markers (e.g. `Jan '26`, `Latest Updates`) and revision changelog items published by the MOH guideline committee.
- It compares the remote timestamp against the local database cache timestamp.

### 2. When are updates triggered?
- **Manual User Trigger**: Healthcare providers can click the **"↻ Check for Live Updates"** button on Tab 7 at any time.
- **Automated Live Sync**: The app periodically runs a background health check when loaded to verify guideline freshness.
- **Alert Badge**: When MOH releases a revision (e.g., an updated antibiotic line or dose change), the system displays a pulsing **`NEW`** badge on the updates tab, alerting clinicians to review the changes.

---

## ⚖️ Legal & Medical Disclaimer

> ### **CRITICAL NOTICE: NON-MOH AFFILIATION**
> 1. **Independent Project**: This application is an independent digital clinical decision-support and educational tool created solely by **fathirosli**. It is **NOT an official publication of, NOT endorsed by, and NOT formally affiliated with the Ministry of Health Malaysia (MOH), the National Antimicrobial Secretariat, or the Pharmaceutical Services Programme**. This is **NOT the official Antibiotic Secretariat**.
> 2. **Professional Clinical Judgment**: Provided strictly for informational and bedside reference by qualified medical practitioners. It does not replace individualized clinical assessment, physical examination, diagnostic workup, local hospital antibiograms, or microbiological culture and susceptibility results. **Clinical judgement must always prevail.**
> 3. **Exclusion of Liability**: While every reasonable effort has been taken to transcribe official NAG 2024 publications accurately, medical knowledge evolves and transcription or algorithmic discrepancies may occur. The author (**fathirosli**) and contributors expressly disclaim all legal liability and responsibility for any clinical decisions, dosing errors, adverse drug reactions, morbidity, or mortality resulting from the use of or reliance on this software. Prescribers retain sole professional responsibility for all prescriptions.

---

## ✉️ Feedback, Suggestions & Bug Reports

If you have any suggestions, feedback, comment, or spot a guideline discrepancy, please email developer **fathirosli** directly:

📧 **Email**: [fathirosli98@gmail.com](mailto:fathirosli98@gmail.com?subject=NAG%20Antibiotics%20Toolkit%20Feedback)

*(Please do not contact the MOH Secretariat regarding this independent application).*

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/fathaladdin99/nag-2024-antibiotics-toolkit.git

# Navigate into directory
cd nag-2024-antibiotics-toolkit

# Install dependencies (zero external dependencies required)
npm install

# Run the local server
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🌐 Online Deployment

This application is ready to deploy to **Vercel** or **Render** in 1 click:
```bash
# Deploy with Vercel CLI
npx vercel
```
Configured with `vercel.json` for static asset and API routing.
