const https = require('https');
const fs = require('fs');
const path = require('path');

const pages = [
  { code: 'B1', name: 'Cardiovascular Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b1-cardiovascular-infections' },
  { code: 'B2', name: 'Central Nervous Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b2-central-nervous-infections' },
  { code: 'B3', name: 'Chemoprophylaxis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b3-chemoprophylaxis' },
  { code: 'B4', name: 'Gastrointestinal Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b4-gastrointestinal-infections' },
  { code: 'B5', name: 'Infections In Immunocompromised Patients', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b5-infections-in-immunocompromised-patients' },
  { code: 'B6', name: 'Neonatal Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b6-neonatal-infections' },
  { code: 'B7', name: 'Ocular Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b7-ocular-infections' },
  { code: 'B8', name: 'Orthopaedic Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b8-orthopaedic-infections' },
  { code: 'B9', name: 'Otorhinolaryngology Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b9-otorhinolaryngology-infections' },
  { code: 'B10', name: 'Respiratory Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b10-respiratory-infections' },
  { code: 'B11', name: 'Skin & Soft Tissue Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b11-skin-soft-tissue-infections' },
  { code: 'B12', name: 'Tropical Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b12-tropical-infections' },
  { code: 'B13', name: 'Urinary Tract Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b13-urinary-tract-infections' },
  { code: 'B14', name: 'Vascular Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-b-paediatrics/b14-vascular-infections' },
  { code: 'C1', name: 'Acute Bronchitis and Pneumonia', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c1-acute-bronchitis-and-pneumonia' },
  { code: 'C2', name: 'Acute Otitis Media', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c2-acute-otitis-media' },
  { code: 'C3', name: 'Acute Pharyngitis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c3-acute-pharyngitis' },
  { code: 'C4', name: 'Acute Rhinosinusitis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c4-acute-rhinosinusitis' },
  { code: 'C5', name: 'Acute Gastroenteritis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c5-acute-gastroenteritis' },
  { code: 'C6', name: 'Skin and Soft Tissue Infection', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c6-skin-and-soft-tissue-infection' },
  { code: 'C7', name: 'Urinary Tract Infection in Non-Pregnancy', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c7-urinary-tract-infection-in-non-pregnancy' }
];

const cacheDir = path.join(__dirname, 'nag_pages_raw');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

function fetchPage(p) {
  return new Promise((resolve) => {
    const filePath = path.join(cacheDir, `${p.code}.html`);
    if (fs.existsSync(filePath)) {
      console.log(`[Cache Hit] ${p.code}: ${p.name}`);
      resolve({ page: p, html: fs.readFileSync(filePath, 'utf8') });
      return;
    }

    console.log(`[Fetching] ${p.code}: ${p.name} from ${p.url}`);
    https.get(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        fs.writeFileSync(filePath, data);
        resolve({ page: p, html: data });
      });
    }).on('error', err => {
      console.error(`Error fetching ${p.code}:`, err.message);
      resolve({ page: p, html: '' });
    });
  });
}

async function run() {
  for (const p of pages) {
    await fetchPage(p);
  }
  console.log('All pages fetched!');
}

run();
