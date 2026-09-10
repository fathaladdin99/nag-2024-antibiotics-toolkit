const fs = require('fs');
const path = require('path');
const https = require('https');

const cPages = [
  { code: 'C1', name: 'Acute Bronchitis and Pneumonia', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c1-acute-bronchitis-and-pneumonia?authuser=0' },
  { code: 'C2', name: 'Acute Otitis Media', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c2-acute-otitis-media?authuser=0' },
  { code: 'C3', name: 'Acute Pharyngitis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c3-acute-pharyngitis?authuser=0' },
  { code: 'C4', name: 'Acute Rhinosinusitis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c4-acute-rhinosinusitis?authuser=0' },
  { code: 'C5', name: 'Acute Gastroenteritis', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c5-acute-gastroenteritis?authuser=0' },
  { code: 'C6', name: 'Skin and Soft Tissue Infection', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c6-skin-and-soft-tissue-infection?authuser=0' },
  { code: 'C7', name: 'Urinary Tract Infection in Non-Pregnancy', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c7-urinary-tract-infection-in-non-pregnancy?authuser=0' },
  { code: 'C8', name: 'Urinary Tract Infection in Pregnancy (Asymptomatic Bacteriuria)', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c8-urinary-tract-infection-in-pregnancy-asymptomatic-bacteriuria?authuser=0' },
  { code: 'C9', name: 'Urinary Tract Infection in Pregnancy (Symptomatic)', url: 'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care/c9-urinary-tract-infection-in-pregnancy-symptomatic?authuser=0' }
];

const rawDir = path.join(__dirname, 'nag_pages_raw');
const imgDir = path.join(__dirname, 'public', 'images', 'pathways');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

function fetchUrl(url, targetPath) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      // follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, targetPath).then(resolve);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(targetPath, buffer);
        resolve(buffer);
      });
    }).on('error', err => {
      console.error(`Fetch error for ${url}:`, err.message);
      resolve(null);
    });
  });
}

async function run() {
  for (const p of cPages) {
    const rawPath = path.join(rawDir, `${p.code}.html`);
    if (!fs.existsSync(rawPath)) {
      console.log(`Fetching HTML for ${p.code}: ${p.name}...`);
      await fetchUrl(p.url, rawPath);
    }

    const html = fs.readFileSync(rawPath, 'utf8');
    // Extract image URLs
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let m;
    const urls = [];
    while ((m = imgRegex.exec(html)) !== null) {
      const src = m[1].replace(/&amp;/g, '&');
      // Look for googleusercontent or drive images (clinical pathway flowcharts)
      if (src.includes('googleusercontent') || src.includes('docs.google.com') || src.includes('drive.google.com') || src.includes('sites.google.com')) {
        urls.push(src);
      }
    }
    console.log(`${p.code} (${p.name}) found ${urls.length} relevant images`);

    // Download the primary flowchart image(s)
    let idx = 1;
    for (const imgUrl of urls) {
      // Filter out tiny icons, logos, or avatars if any
      const imgPath = path.join(imgDir, `${p.code}_pathway_${idx}.png`);
      if (!fs.existsSync(imgPath)) {
        console.log(`  Downloading flowchart image ${idx} for ${p.code}...`);
        await fetchUrl(imgUrl, imgPath);
      }
      idx++;
    }
  }

  console.log('Section C pages & pathway flowcharts processed!');
}

run();
