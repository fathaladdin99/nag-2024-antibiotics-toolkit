const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function fetchLiveNagUpdates() {
  return new Promise((resolve, reject) => {
    const url = 'https://sites.google.com/moh.gov.my/nag/information/whats-new';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          // Parse HTML for update dates and sections
          const cleanText = data.replace(/<script[\s\S]*?<\/script>/gi, '')
                                .replace(/<style[\s\S]*?<\/style>/gi, '')
                                .replace(/<[^>]+>/g, '\n')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/&amp;/g, '&')
                                .replace(/&#39;/g, "'");

          const updateRegex = /Latest Updates\s*\(([^)]+)\)/gi;
          const foundMonths = [];
          let match;
          while ((match = updateRegex.exec(cleanText)) !== null) {
            foundMonths.push(match[1].trim());
          }

          resolve({
            success: true,
            onlineDate: foundMonths[0] || "January 2026",
            allDetectedDates: foundMonths,
            checkedAt: new Date().toISOString()
          });
        } catch (err) {
          resolve({ success: false, error: err.message, checkedAt: new Date().toISOString() });
        }
      });
    }).on('error', (err) => {
      resolve({ success: false, error: err.message, checkedAt: new Date().toISOString() });
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers for local API flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API Endpoints ---
  if (pathname === '/api/conditions') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'conditions.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/antibiotics') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'antibiotics.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/adult-conditions') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'adult_conditions.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/paediatric-conditions') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'paediatric_all_conditions.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/pathways') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'pathways.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/neonatal') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'neonatal.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/changelog') {
    try {
      const data = fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'changelog.json'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/updates/check') {
    const liveResult = await fetchLiveNagUpdates();
    const changelog = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'data', 'changelog.json'), 'utf8'));

    const currentLocalVersion = changelog.updates[0] ? changelog.updates[0].date : "January 2026";
    let isUpToDate = true;
    let message = `Guidelines are in sync with MOH Malaysia NAG (Up to ${currentLocalVersion}).`;

    if (liveResult.success && liveResult.onlineDate) {
      if (liveResult.onlineDate.toLowerCase() !== currentLocalVersion.toLowerCase()) {
        isUpToDate = false;
        message = `New update detected on official Google Site: ${liveResult.onlineDate}! Local database version is ${currentLocalVersion}.`;
      }
    } else if (!liveResult.success) {
      message = `Offline or live check failed: ${liveResult.error}. Using verified local guidelines (up to ${currentLocalVersion}).`;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      liveStatus: liveResult.success ? "connected" : "fallback",
      isUpToDate: isUpToDate,
      currentLocalVersion: currentLocalVersion,
      detectedOnlineVersion: liveResult.onlineDate || currentLocalVersion,
      allOnlineDates: liveResult.allDetectedDates || [],
      message: message,
      sourceUrl: changelog.officialSourceUrl,
      lastCheckedTime: liveResult.checkedAt,
      updates: changelog.updates
    }));
    return;
  }

  // --- Static File Serving ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🩺 NAG 2024 Paediatric Antibiotic Toolkit & Calculator`);
  console.log(`👤 Created by faithx`);
  console.log(`🌐 Running on http://localhost:${PORT}`);
  console.log(`📡 Live NAG Updates Sync: http://localhost:${PORT}/api/updates/check`);
  console.log(`=======================================================`);
});
