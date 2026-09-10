const fs = require('fs');
const path = require('path');
const https = require('https');

const cDriveFiles = [
  { code: 'C1', id: '1wD4vGeDK7ZYxFcAbfTDWHh_5yzeVLLcn', name: 'Acute Bronchitis and Pneumonia' },
  { code: 'C2', id: '1zBEHgP-8SOvaN_a8RPlkBHQCWkydkW3d', name: 'Acute Otitis Media' },
  { code: 'C3', id: '1uGy5f2QkESC7qVUCp6tH9_HR2bbDx8ck', name: 'Acute Pharyngitis' },
  { code: 'C4', id: '1-ZWDXr-lCCn9raDqfmg3HpUWDCRjQFQ6', name: 'Acute Rhinosinusitis' },
  { code: 'C5', id: '13hJDWa6-xG2hKSpJoqHshJtoUhEkq3SI', name: 'Acute Gastroenteritis' },
  { code: 'C6', id: '1iUe7Bn__TY3lrP1L3xuiuAK9MQh9KBQe', name: 'Skin and Soft Tissue Infection' },
  { code: 'C7', id: '1UDZcoSzxBgjM-9FDgcEbnV6841yzxOwy', name: 'Urinary Tract Infection in Non-Pregnancy' },
  { code: 'C8', id: '1-W60YOHBNYiP8fusR3R-PkwcxvqUwC0C', name: 'Urinary Tract Infection in Pregnancy (Asymptomatic Bacteriuria)' },
  { code: 'C9', id: '11Ew6KXAhdBIRdiBV3nUehdOqaWZi9_OZ', name: 'Urinary Tract Infection in Pregnancy (Symptomatic)' }
];

function fetchDownload(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchDownload(res.headers.location, dest).then(resolve);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
    }).on('error', () => resolve(0));
  });
}

async function run() {
  const dir = path.join(__dirname, 'public', 'images', 'pathways');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of cDriveFiles) {
    const url = `https://drive.google.com/thumbnail?id=${item.id}&sz=w1600`;
    const dest = path.join(dir, `${item.code}_flowchart.jpg`);
    const size = await fetchDownload(url, dest);
    console.log(`${item.code}: fetched ${size} bytes from drive thumbnail`);
  }
}

run();
