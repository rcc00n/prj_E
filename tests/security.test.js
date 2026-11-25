const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../server');
let directory, server, base;
beforeEach(async () => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'medlink-test-'));
  for (const name of ['users', 'appointments']) fs.writeFileSync(path.join(directory, name + '.json'), '[]');
  fs.writeFileSync(path.join(directory, 'doctors-en.json'), JSON.stringify([{ name: 'Synthetic clinician', email: 'doctor@example.test' }]));
  fs.writeFileSync(path.join(directory, 'doctors-ru.json'), '[]');
  server = createServer({ dataDir: directory });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => { await new Promise(resolve => server.close(resolve)); fs.rmSync(directory, { recursive: true }); });
const post = (pathname, body, cookie) => fetch(base + pathname, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
async function signup(email, role = 'patient') {
  const response = await post('/api/signup', { name: 'Synthetic user', email, password: 'fixture-only-password', role });
  assert.equal(response.status, 200);
  return response.headers.get('set-cookie').split(';')[0];
}
test('anonymous and cross-user appointment reads are rejected; owner sees only own records', async () => {
  const alice = await signup('alice@example.test');
  const bob = await signup('bob@example.test');
  assert.equal((await post('/api/appointments', { doctorEmail: 'doctor@example.test', when: '2030-01-01T12:00' }, alice)).status, 201);
  const url = '/api/patient/alice%40example.test/appointments';
  assert.equal((await fetch(base + url)).status, 401);
  assert.equal((await fetch(base + url, { headers: { Cookie: bob } })).status, 403);
  const own = await fetch(base + url, { headers: { Cookie: alice } });
  assert.equal(own.status, 200);assert.equal((await own.json()).length, 1);
  assert.equal((await fetch(base + '/api/doctor/alice%40example.test/appointments', { headers: { Cookie: alice } })).status, 403);
});
test('doctor session can read own assigned records but cannot impersonate a patient', async () => {
  const alice = await signup('alice@example.test'); const doctor = await signup('doctor@example.test', 'doctor');
  await post('/api/appointments', { doctorEmail: 'doctor@example.test', when: '2030-01-01' }, alice);
  const response = await fetch(base + '/api/doctor/doctor%40example.test/appointments', { headers: { Cookie: doctor } });
  assert.equal(response.status, 200); assert.equal((await response.json()).length, 1);
  assert.equal((await post('/api/appointments', { doctorEmail: 'doctor@example.test', when: '2030-01-01' }, doctor)).status, 403);
});
test('static requests cannot expose records, source, package files or escaped paths', async () => {
  for (const url of ['/data/users.json', '/data/appointments.json', '/server.js', '/package.json', '/.git/config', '/%2e%2e%2fserver.js']) {
    assert.equal((await fetch(base + url)).status, 404, url);
  }
  const home = await fetch(base + '/'); assert.equal(home.status, 200); assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal((await fetch(base + '/auth.js?version=1')).status, 200);
});
test('malformed bodies, cookies and unknown API routes return bounded JSON failures', async () => {
  for (const value of [null, [], {}, { email: {}, password: [] }]) assert.equal((await post('/api/signup', value)).status, 400);
  assert.equal((await fetch(base + '/api/signup', { method: 'POST', body: '{}'})).status, 415);
  assert.equal((await fetch(base + '/api/signup', { method: 'POST', headers:{'Content-Type':'application/json'},body:'{'})).status, 400);
  assert.equal((await post('/api/signup', { name:'x'.repeat(70000) })).status, 413);
  assert.equal((await fetch(base + '/api/session', {headers:{Cookie:'sid=%ZZ'}})).status, 401);
  assert.equal((await fetch(base + '/api/missing')).status, 404);
});
