const fs = require('fs');
const path = require('path');

// Load service account JSON
const raw = fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8');
const json = JSON.parse(raw);

// Escape newlines in the private key
json.private_key = json.private_key.replace(/\n/g, '\\n');

// Convert to base64
const base64 = Buffer.from(JSON.stringify(json)).toString('base64');

console.log('\n✅ Copy and paste the following into your .env:\n');
console.log('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64=' + base64);
