import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('netlify/edge-functions/retired.js', root), 'utf8');
const { default: retire } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
for (const path of ['/', '/index.html', '/deep/old/page', '/api/session', '/data/users.json', '/data/appointments.json', '/server.js', '/images/doctors/lee.jpg', '/robots.txt', '/?query=unchanged']) {
  for (const method of ['GET', 'HEAD', 'POST']) {
    const response = await retire(new Request('https://historical.example.test' + path, { method }));
    assert.equal(response.status, 410, `${method} ${path}`);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('location'), null);
    const body = await response.text();
    if (method === 'HEAD') assert.equal(body, '');
    else assert.match(body, /This historical demo has been retired/);
  }
}
assert.deepEqual((await readdir(new URL('ops/netlify-retired/', root))).sort(), ['404.html', 'robots.txt']);
console.log('Retirement checks passed: 30 method/path cases; isolated two-file publish directory.');
