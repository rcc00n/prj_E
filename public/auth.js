const modal      = document.getElementById('authModal');
const loginView  = modal.querySelector('.login-view');
const signupView = modal.querySelector('.signup-view');
const openLogin  = document.getElementById('openLogin');
const openSignup = document.getElementById('openSignup');
const toLogin    = document.getElementById('toLogin');
const toSignup   = document.getElementById('toSignup');
const closeBtn   = modal.querySelector('.modal-close');

function show(view){
  loginView.style.display  = view==='login'  ? 'block' : 'none';
  signupView.style.display = view==='signup' ? 'block' : 'none';
  modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
}

openLogin .addEventListener('click',e=>{e.preventDefault();show('login')});
openSignup.addEventListener('click',e=>{e.preventDefault();show('signup')});
toLogin  .addEventListener('click',e=>{e.preventDefault();show('login')});
toSignup .addEventListener('click',e=>{e.preventDefault();show('signup')});
closeBtn .addEventListener('click',()=>{modal.classList.remove('show');modal.setAttribute('aria-hidden','true')});
modal.querySelector('.modal-overlay').addEventListener('click',()=>closeBtn.click());

document.getElementById('loginForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  const r = await fetch('/api/login', {method:'POST',credentials:'include',
               headers:{'Content-Type':'application/json'},
               body:JSON.stringify(body)});
  if(r.ok){location.reload()} else alert('Wrong credentials');
});
// auth.js  → замена только нужной части
document.getElementById('signupForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.target));
  const r = await fetch('/api/signup',{method:'POST',credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)});
  if(r.ok){location.reload()}else alert('User exists');
});
