const https = require('https');
const fs = require('fs');
const path = require('path');

const adultPages = [
  { code: 'A1', name: 'Cardiovascular Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a1-cardiovascular-infections' },
  { code: 'A2', name: 'Central Nervous Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a2-central-nervous-infections' },
  { code: 'A3', name: 'Chemoprophylaxis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a3-chemoprophyxlaxis' },
  { code: 'A4', name: 'Gastrointestinal & Hepatobiliary Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a4-gastrointestinal-infections' },
  { code: 'A5', name: 'Infections In Immunocompromised Patients', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a5-infections-in-immunocompromised-patients' },
  { code: 'A6', name: 'Obstetrics & Gynaecological Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a6-obstetrics-gyneacological-infections' },
  { code: 'A7', name: 'Ocular Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a7-ocular-infections' },
  { code: 'A8', name: 'Oral / Dental Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a8-oraldental-infections' },
  { code: 'A9', name: 'Orthopaedic Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a9-orthopaedic-infections' },
  { code: 'A10', name: 'Otorhinolaryngology Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a10-otorhinolaryngology-infections' },
  { code: 'A11', name: 'Respiratory Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a11-respiratory-infections' },
  { code: 'A12', name: 'Sepsis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a12-sepsis' },
  { code: 'A13', name: 'Sexually Transmitted Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a13-sexually-transmitted-infections' },
  { code: 'A14', name: 'Skin & Soft Tissue Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a14-skin-soft-tissue-infections' },
  { code: 'A15', name: 'Trauma Related Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a15-trauma-related-infections' },
  { code: 'A16', name: 'Tropical Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a16-tropical-infections' },
  { code: 'A17', name: 'Urinary Tract Infections', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-a-adult/a17-urinary-tract-infections' }
];

const cacheDir = path.join(__dirname, 'nag_pages_raw');

function fetchAdultPage(p) {
  return new Promise((resolve) => {
    const filePath = path.join(cacheDir, `${p.code}.html`);
    if (fs.existsSync(filePath)) {
      console.log(`[Cache Hit] ${p.code}: ${p.name}`);
      resolve({ page: p, html: fs.readFileSync(filePath, 'utf8') });
      return;
    }

    console.log(`[Fetching Adult] ${p.code}: ${p.name}`);
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
  for (const p of adultPages) {
    await fetchAdultPage(p);
  }
  console.log('All Adult A1-A17 pages fetched successfully!');
}

run();
