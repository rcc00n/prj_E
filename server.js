// server.js  (no frameworks)
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const usersFile = path.join(__dirname,'data','users.json');
const sessions  = new Map();            // sid → userEmail

/* вспомогалки */
function send(res,code,obj){
  res.writeHead(code,{'Content-Type':'application/json'});
  res.end(JSON.stringify(obj));
}
function hash(pw,salt){
  return crypto.pbkdf2Sync(pw,salt,100000,64,'sha512').toString('hex');
}
function readUsers(){
  try{return JSON.parse(fs.readFileSync(usersFile,'utf8'))}catch{ return [] }
}
function writeUsers(arr){ fs.writeFileSync(usersFile,JSON.stringify(arr,null,2)) }

/* роутер */
function handleApi(req,res){
  let body='';
  req.on('data',chunk=>body+=chunk);
  req.on('end',()=>{
    const data = body && JSON.parse(body);
    if(req.url==='/api/signup' && req.method==='POST'){
      let users=readUsers();
      if(users.some(u=>u.email===data.email)) return send(res,409,{err:'exists'});
      const salt  = crypto.randomBytes(16).toString('hex');
      const user  = {name:data.name,email:data.email,salt,hash:hash(data.password,salt)};
      users.push(user); writeUsers(users);
      return newSession(res,user.email);
    }
    if(req.url==='/api/login' && req.method==='POST'){
      const user = readUsers().find(u=>u.email===data.email);
      if(!user || user.hash!==hash(data.password,user.salt))
        return send(res,401,{err:'bad'});
      return newSession(res,user.email);
    }
    send(res,404,{});
  });
}
function newSession(res,email){
  const sid = crypto.randomBytes(24).toString('hex');
  sessions.set(sid,email);
  res.writeHead(200,{
    'Set-Cookie':`sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`,
    'Content-Type':'application/json'
  });
  res.end('{}');
}

/* отдача статики */
function serveStatic(req,res){
  let file = req.url==='/'?'/index.html':req.url;
  const ext = path.extname(file)||'.html';
  const types={'.html':'text/html','.css':'text/css','.js':'text/javascript',
               '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
  const filePath = path.join(__dirname,file);
  fs.readFile(filePath,(err,buf)=>{
    if(err) return send(res,404,{});
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});
    res.end(buf);
  });
}

/* основной сервер */
http.createServer((req,res)=>{
  if(req.url.startsWith('/api/')) return handleApi(req,res);
  serveStatic(req,res);
}).listen(8080,()=>console.log('⇢ http://localhost:8080'));
