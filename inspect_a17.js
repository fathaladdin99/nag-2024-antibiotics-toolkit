const fs = require('fs');
const { extractLines } = require('./test_all_adult');

// Let's inspect A17
const a17Lines = extractLines('A17');
console.log('--- A17 lines ---');
console.log(a17Lines.slice(0, 80).join('\n'));
