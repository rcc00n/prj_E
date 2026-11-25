const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
async function render(role, status = 200) {
  const elements = new Map();
  const requests = [];
  const document = { getElementById(id) { if (!elements.has(id)) elements.set(id, { textContent: '', innerHTML: '' }); return elements.get(id); }, body: {} };
  const dangerous = '<img src=x onerror=alert(1)>';
  const context = { document, location: {}, fetch: async url => {
    requests.push(url);
    if (url === '/api/session') return { ok: true, json: async () => ({ name: dangerous, email: 'person@example.test', role }) };
    return { ok: status === 200, json: async () => [{ patient: dangerous, doctor: dangerous, date: dangerous, service: dangerous, status: dangerous }] };
  } };
  const source = fs.readFileSync(path.join(__dirname, '..', 'public', role + 'Cabinet.js'), 'utf8');
  await vm.runInNewContext(source, context);
  return { elements, requests, dangerous };
}
test('stored patient and appointment values render as text in both dashboards', async () => {
  for (const role of ['doctor', 'patient']) {
    const { elements, requests, dangerous } = await render(role);
    const html = [...elements.values()].map(e => e.innerHTML).join('');
    assert.ok(!html.includes(dangerous)); assert.ok(html.includes('&lt;img'));
    assert.equal(requests.length, 2); assert.ok(requests[1].startsWith(`/api/${role}/`));
  }
});
test('dashboard failures remain explicit and never fall back to a private record file', async () => {
  for (const role of ['doctor', 'patient']) {
    const { elements, requests } = await render(role, 503);
    assert.equal(requests.length, 2);
    assert.ok([...elements.values()].some(e => e.textContent.includes('could not be loaded')));
    assert.ok(!requests.some(url => url.startsWith('/data/')));
  }
});
