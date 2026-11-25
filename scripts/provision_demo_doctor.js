// Local operator-only fixture setup. Never expose this through an HTTP route.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const email = 'doctor@example.test';
function provisionDoctor({ dataDir, password }) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new Error('Set a local DEMO_DOCTOR_PASSWORD of 12–128 characters.');
  const userFile = path.join(dataDir, 'users.json');
  const users = JSON.parse(fs.readFileSync(userFile, 'utf8'));
  if (!Array.isArray(users) || users.some(user => user.email.toLowerCase() === email)) throw new Error('Demo identity exists or storage is invalid; existing accounts were not modified.');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1e5, 64, 'sha512').toString('hex');
  const catalogues = ['en', 'ru'].map(lang => {
    const file = path.join(dataDir, `doctors-${lang}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(data)) throw new Error('Invalid doctor catalogue; stop the local demo and repair it before setup.');
    if (!data.some(doctor => doctor.email === email)) data.push({ id: 'local-demo-doctor', email, name: 'Synthetic clinician', specialty: 'Demonstration only', country: 'Synthetic data', photo: '/images/doctors/lee.jpg', bio: 'Local synthetic account. No clinical services.', hours: 'Local demonstration', phone: '' });
    return { file, data };
  });
  // Run only with the local server stopped; no production or concurrent provisioning contract.
  for (const { file, data } of catalogues) fs.writeFileSync(file, JSON.stringify(data, null, 2));
  users.push({ name: 'Synthetic clinician', email, role: 'doctor', salt, hash });
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  return email;
}
if (require.main === module) {
  try {
    const dataDir = process.env.DEMO_DATA_DIR || path.join(__dirname, '..', 'data');
    const identity = provisionDoctor({ dataDir, password: process.env.DEMO_DOCTOR_PASSWORD });
    console.log(`Local synthetic doctor created: ${identity}. Sign in using your supplied private password.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { provisionDoctor };
