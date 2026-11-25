// Educational scheduling demo. Do not use with real patient data.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function createServer({ dataDir = process.env.DEMO_DATA_DIR || path.join(__dirname, 'data'), publicDir = path.join(__dirname, 'public') } = {}) {
  const sessions = new Map();
  const sessionLifetime = 7 * 24 * 60 * 60 * 1000;
  const usersFile = path.join(dataDir, 'users.json');
  const apptFile = path.join(dataDir, 'appointments.json');
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2));
  const send = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(value));
  };
  const hash = (password, salt) => crypto.pbkdf2Sync(password, salt, 1e5, 64, 'sha512').toString('hex');
  const userSession = req => {
    const match = (req.headers.cookie || '').match(/(?:^|;\s*)sid=([a-f0-9]{48})(?:;|$)/);
    if (!match) return null;
    const session = sessions.get(match[1]);
    if (!session) return null;
    if (session.expires <= Date.now()) { sessions.delete(match[1]); return null; }
    return read(usersFile).find(user => user.email === session.email) || null;
  };
  const newSession = (res, email) => {
    const sid = crypto.randomBytes(24).toString('hex');
    sessions.set(sid, { email, expires: Date.now() + sessionLifetime });
    res.setHeader('Set-Cookie', `sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    send(res, 200, {});
  };
  const readDoctors = (lang = 'all') => {
    const languages = lang === 'en' || lang === 'ru' ? [lang] : ['en', 'ru'];
    return languages.flatMap(language => read(path.join(dataDir, `doctors-${language}.json`)));
  };
  const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.length <= max;

  function handleApi(req, res, url, data) {
    const pathname = url.pathname;
    if ((pathname === '/api/signup' || pathname === '/api/login') && req.method === 'POST') {
      if (!validText(data.email, 3, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !validText(data.password, 8, 128)) return send(res, 400, { err: 'invalid_credentials' });
      const users = read(usersFile);
      if (pathname === '/api/signup') {
        if (!validText(data.name, 1, 100) || !['patient', 'doctor'].includes(data.role || 'patient')) return send(res, 400, { err: 'invalid_profile' });
        if (users.some(user => user.email === data.email)) return send(res, 409, { err: 'exists' });
        const salt = crypto.randomBytes(16).toString('hex');
        users.push({ name: data.name, email: data.email, role: data.role || 'patient', salt, hash: hash(data.password, salt) });
        write(usersFile, users);
        return newSession(res, data.email);
      }
      const user = users.find(item => item.email === data.email);
      if (!user || user.hash !== hash(data.password, user.salt)) return send(res, 401, { err: 'bad' });
      return newSession(res, user.email);
    }
    const appointments = pathname.match(/^\/api\/(patient|doctor)\/([^/]+)\/appointments$/);
    if (appointments && req.method === 'GET') {
      const user = userSession(req);
      if (!user) return send(res, 401, { err: 'no_session' });
      let email;
      try { email = decodeURIComponent(appointments[2]); } catch { return send(res, 400, { err: 'invalid_path' }); }
      const role = appointments[1];
      if (user.email !== email || user.role !== role) return send(res, 403, { err: 'forbidden' });
      const field = role === 'patient' ? 'patId' : 'docId';
      return send(res, 200, read(apptFile).filter(item => item[field] === user.email));
    }
    if (pathname === '/api/session' && req.method === 'GET') {
      const user = userSession(req);
      return user ? send(res, 200, { name: user.name, email: user.email, role: user.role }) : send(res, 401, {});
    }
    if (pathname === '/api/doctors' && req.method === 'GET') return send(res, 200, readDoctors(url.searchParams.get('lang')));
    if (pathname === '/api/appointments' && req.method === 'POST') {
      const patient = userSession(req);
      if (!patient) return send(res, 401, { err: 'no_session' });
      if (patient.role !== 'patient') return send(res, 403, { err: 'forbidden' });
      if (!validText(data.doctorEmail, 3, 254) || !validText(data.when, 1, 100) || (data.service !== undefined && !validText(data.service, 1, 100))) return send(res, 400, { err: 'invalid_appointment' });
      const doctor = readDoctors().find(item => item.email === data.doctorEmail);
      if (!doctor) return send(res, 400, { err: 'doc_not_found' });
      const appts = read(apptFile);
      appts.push({ id: crypto.randomBytes(8).toString('hex'), docId: doctor.email, patId: patient.email, doctor: doctor.name, patient: patient.name, date: data.when, service: data.service || 'consult', status: 'booked' });
      write(apptFile, appts);
      return send(res, 201, { ok: true });
    }
    return send(res, 404, { err: 'not_found' });
  }

  function serveStatic(req, res, url) {
    if (!['GET', 'HEAD'].includes(req.method)) return send(res, 405, { err: 'method_not_allowed' });
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return send(res, 400, { err: 'invalid_path' }); }
    const target = path.resolve(publicDir, '.' + (pathname === '/' ? '/index.html' : pathname));
    const root = path.resolve(publicDir) + path.sep;
    if (!target.startsWith(root)) return send(res, 404, { err: 'not_found' });
    fs.realpath(target, (error, real) => {
      if (error || !real.startsWith(root)) return send(res, 404, { err: 'not_found' });
      fs.readFile(real, (error, bytes) => {
        if (error) return send(res, 404, { err: 'not_found' });
        const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
        if (!mime[path.extname(real)]) return send(res, 404, { err: 'not_found' });
        res.writeHead(200, { 'Content-Type': mime[path.extname(real)], 'X-Content-Type-Options': 'nosniff' });
        res.end(req.method === 'HEAD' ? undefined : bytes);
      });
    });
  }

  return http.createServer((req, res) => {
    let url;
    try { url = new URL(req.url, 'http://localhost'); } catch { return send(res, 400, { err: 'invalid_path' }); }
    if (!url.pathname.startsWith('/api/')) return serveStatic(req, res, url);
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') return send(res, 415, { err: 'json_required' });
    let body = '', size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 64 * 1024) { if (!res.writableEnded) send(res, 413, { err: 'body_too_large' }); return; }
      body += chunk;
    });
    req.on('end', () => {
      if (res.writableEnded) return;
      let data = {};
      try { data = body ? JSON.parse(body) : {}; } catch { return send(res, 400, { err: 'invalid_json' }); }
      if (!data || Array.isArray(data) || typeof data !== 'object') return send(res, 400, { err: 'invalid_json' });
      try { handleApi(req, res, url, data); } catch { send(res, 500, { err: 'storage_unavailable' }); }
    });
  });
}

if (require.main === module) createServer().listen(Number(process.env.PORT || 8080), '127.0.0.1', () => console.log('Demo listening on localhost; synthetic data only.'));
module.exports = { createServer };
