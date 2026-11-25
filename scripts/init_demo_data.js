const fs = require('node:fs');
const path = require('node:path');
const data = process.env.DEMO_DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(data, {recursive: true});
for (const name of ['users.json', 'appointments.json']) {
  const target = path.join(data, name);
  if (!fs.existsSync(target)) fs.writeFileSync(target, '[]\n', {mode: 0o600});
}
console.log('Local record files initialized without overwriting existing data. Use synthetic records only.');
