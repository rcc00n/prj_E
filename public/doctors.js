// doctors.js  — бронирование
const listBox   = document.getElementById('doctorList');
const searchInp = document.getElementById('search');
const modal     = document.getElementById('doctorModal');
const profileView = modal.querySelector('.profile-view');
const formView    = modal.querySelector('.form-view');
const closeBtn = modal.querySelector('.modal-close');
const bookBtn  = modal.querySelector('.book-btn');
const form     = document.getElementById('appointmentForm');

let lang = localStorage.getItem('lang') || 'en';
let doctors = [];
let patient  = {};              // данные вошедшего пользователя
let current  = null;            // выбранный доктор

/* ── 0. получаем сессию ── */
(async ()=>{
  const r = await fetch('/api/session',{credentials:'include'});
  if(r.ok) patient = await r.json();        // {name,email,role}
})();

/* ── 1. загрузка докторов ── */
async function loadDoctors(lng='en'){
  try{
    const resp = await fetch(`./data/doctors-${lng}.json`,{cache:'no-store'});
    doctors = resp.ok ? await resp.json() : [];
  }catch{ doctors = []; }
  render(doctors);
}
loadDoctors(lang);
document.addEventListener('langChanged',e=>{lang=e.detail;loadDoctors(lang)});

/* ── 2. рендер карточек ── */
function card(d){
  return `<article class="card" id="${d.id}">
            <img src="${d.photo}" alt="${d.name}">
            <h3>${d.name}</h3>
            <span>${d.specialty} · ${d.country}</span>
          </article>`;
}
function render(arr){
  listBox.innerHTML = arr.length
    ? arr.map(card).join('')
    : '<p style="grid-column:1/-1;color:#fff7">No matches</p>';
}

/* ── 3. поиск ── */
searchInp?.addEventListener('input',e=>{
  const q = e.target.value.toLowerCase();
  render(doctors.filter(d=>
    d.name.toLowerCase().includes(q)||
    d.specialty.toLowerCase().includes(q)||
    d.country.toLowerCase().includes(q)
  ));
});

/* ── 4. модалка ── */
function openModal(id){
  current = doctors.find(d=>d.id===id);
  if(!current) return;
  modal.querySelector('#modalPhoto').src = current.photo;
  modal.querySelector('#doctorModalTitle').textContent = current.name;
  modal.querySelector('#modalSpecialty').textContent   = `${current.specialty} · ${current.country}`;
  modal.querySelector('#modalBio').textContent         = current.bio||'';
  modal.querySelector('#modalContact').innerHTML =
    `<strong>Email:</strong> <a href="mailto:${current.email}">${current.email}</a>`;
  modal.querySelector('#modalHours').innerHTML =
    `<strong>Hours:</strong> ${current.hours}`;

  /* автозаполнение формы */
  form.name.value  = patient.name  || '';
  form.email.value = patient.email || '';
  form.phone.value = '';

  profileView.style.display='block';
  formView.style.display='none';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  closeBtn.focus();
}
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

/* кнопки и события */
listBox.addEventListener('click',e=>{
  const c=e.target.closest('.card'); if(c) openModal(c.id);
});
bookBtn.addEventListener('click',()=>{
  profileView.style.display='none';
  formView.style.display='block';
  form.when.focus();
});
closeBtn.addEventListener('click',closeModal);
modal.querySelector('.modal-overlay').addEventListener('click',closeModal);

/* === real booking === */
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = Object.fromEntries(new FormData(form));
  if (!current) return;

  const r = await fetch('/api/appointments', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctorEmail: current.email,
       doctorName  : current.name, 
      when: fd.when
    })
  });

  if (r.ok) {
    alert('Booked ✔');
    location.href = 'patient-cabinet.html'; // сразу к записям
  } else {
    const { err = 'unknown' } = await r.json();
    alert('Error: ' + err);
  }
});
