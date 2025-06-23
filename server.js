// server.js  (без фреймворков)
const http   = require('http');
const fs     = require('fs');
const path = require('path');

/* === helpers for doctors === */
const doctorsDir = path.join(__dirname, 'data');

function readDoctors(lang = 'all') {
  const merge = (...arrs) => [].concat(...arrs);
  const file = n => JSON.parse(fs.readFileSync(path.join(doctorsDir, n), 'utf8'));

  if (lang === 'en') return file('doctors-en.json');
  if (lang === 'ru') return file('doctors-ru.json');
  /* both */
  return merge(file('doctors-en.json'), file('doctors-ru.json'));
}


const crypto = require('crypto');

const usersFile = path.join(__dirname,'data','users.json');
const sessions  = new Map();               // sid → email

/* утилиты */
const apptFile   = path.join(__dirname,'data','appointments.json');
const readAppts  = () => { try{return JSON.parse(fs.readFileSync(apptFile,'utf8'))}catch{return[]} };
const writeAppts = a => fs.writeFileSync(apptFile,JSON.stringify(a,null,2));
const send = (res,c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
const hash = (p,s)=>crypto.pbkdf2Sync(p,s,1e5,64,'sha512').toString('hex');
const readUsers  = ()=>{try{return JSON.parse(fs.readFileSync(usersFile,'utf8'))}catch{return[]}};
const writeUsers = a => fs.writeFileSync(usersFile,JSON.stringify(a,null,2));
// разбираем cookie без Object.fromEntries
const parseCookies = str => {
  const obj = {};
  (str || '').split(';').forEach(p => {
    const [k, v] = p.trim().split('=');
    if (k) obj[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return obj;
};

/* сессия */
function newSession(res,email){
  const sid = crypto.randomBytes(24).toString('hex');
  sessions.set(sid,email);
  res.writeHead(200,{
    'Set-Cookie':`sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`,
    'Content-Type':'application/json'
  });
  res.end('{}');
}

/* API */
function handleApi(req,res){
  let body = '';
  req.on('data', chunk => body += chunk);

  req.on('end', () => {
    /* разбираем JSON безопасно */
    let data = {};
    try{ if(body) data = JSON.parse(body) }catch(e){
      return send(res,400,{err:'invalid_json'});
    }

    /* --- SIGN-UP --- */
    if(req.url === '/api/signup' && req.method === 'POST'){
      const users = readUsers();
      if(users.some(u => u.email === data.email))
        return send(res,409,{err:'exists'});

      const salt = crypto.randomBytes(16).toString('hex');
      users.push({
        name : data.name,
        email: data.email,
        role : data.role || 'patient',
        salt,
        hash : hash(data.password,salt)
      });
      writeUsers(users);
      return newSession(res,data.email);
    }

    /* --- LOGIN --- */
    if(req.url === '/api/login' && req.method === 'POST'){
      const u = readUsers().find(u => u.email === data.email);
      if(!u || u.hash !== hash(data.password,u.salt))
        return send(res,401,{err:'bad'});
      return newSession(res,u.email);
    }

    /* ---- READ APPOINTMENTS BY ROLE ---------------------------------- */
if (req.method === 'GET' &&
    /^\/api\/(patient|doctor)\/[^/]+\/appointments$/.test(req.url)) {

  const [, role, encodedEmail] = req.url.match(/^\/api\/(patient|doctor)\/([^/]+)\/appointments$/);
  const email = decodeURIComponent(encodedEmail);

  /* читаем файл с бронями */
  const apptsFile = path.join(__dirname, 'data', 'appointments.json');
  let list = [];
  try { list = JSON.parse(fs.readFileSync(apptsFile, 'utf8')); }
  catch { return send(res, 500, { err: 'appts_read_fail' }); }

  /* фильтруем по роли */
  const filtered = role === 'patient'
      ? list.filter(a => a.patId === email)
      : list.filter(a => a.docId === email);

  return send(res, 200, filtered);
}

    /* --- SESSION --- */
    if(req.url === '/api/session' && req.method === 'GET'){
      const {sid} = parseCookies(req.headers.cookie);
      const email  = sessions.get(sid);
      if(!email) return send(res,401,{});
      const u = readUsers().find(x => x.email === email) || {};
      return send(res,200,{name:u.name,email:u.email,role:u.role});
    }


  /* --- API: общий список врачей --- */
if (req.url.startsWith('/api/doctors') && req.method === 'GET') {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const lang = u.searchParams.get('lang') || 'all';          // en | ru | all
  return send(res, 200, readDoctors(lang));
}

/* --- API: создать запись на приём --- */
if (req.url === '/api/appointments' && req.method === 'POST') {
  const { sid } = parseCookies(req.headers.cookie || '');
  const patEmail = sessions.get(sid);
  if (!patEmail) return send(res, 401, { err: 'no_session' });

  const users    = readUsers();
  const patient  = users.find(u => u.email === patEmail) || {};
  const doctors  = readDoctors();                                   // ← здесь
  const doctor   = doctors.find(d => d.email === data.doctorEmail); // ищем во врачах

  /* если врач не найден — отвечаем понятной ошибкой */
  if (!doctor)
    return send(res, 400, { err: 'doc_not_found', email: data.doctorEmail });

  const appts = readAppts();
  appts.push({
    id:      crypto.randomBytes(8).toString('hex'),
    docId:   doctor.email,
    patId:   patEmail,
    doctor:  doctor.name,
    patient: patient.name || patEmail,
    date:    data.when,
    service: data.service || 'consult',
    status:  'booked'
  });
  writeAppts(appts);
  return send(res, 201, { ok: true });
}

   
  });
}

/* статические файлы */
function serveStatic(req,res){
  const file=req.url==='/'?'/index.html':req.url;
  const ext = path.extname(file)||'.html';
  const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
  fs.readFile(path.join(__dirname,file),(e,b)=>{if(e)return send(res,404,{});res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream'});res.end(b)});
}

/* сервер */
http.createServer((req,res)=>{
  if(req.url.startsWith('/api/')) return handleApi(req,res);
  serveStatic(req,res);
}).listen(8080,()=>console.log('⇢ http://localhost:8080'));

