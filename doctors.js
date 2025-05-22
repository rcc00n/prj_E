// ──────────────────────────────
// doctors.js
// ──────────────────────────────
const listBox   = document.getElementById('doctorList');
const searchInp = document.getElementById('search');

// текущий язык интерфейса
let lang     = localStorage.getItem('lang') || 'en';
let doctors  = [];        // рабочий массив

/* ===============================
   ЗАГРУЗКА ДОКТОРОВ ПО ЯЗЫКУ
   =============================== */
async function loadDoctors(lng = 'en'){
  try{
    // обращаемся к ./data/doctors-en.json или doctors-ru.json
    const resp = await fetch(`./data/doctors-${lng}.json`, {cache:'no-store'});
    if(!resp.ok) throw new Error(resp.status);
    doctors = await resp.json();
  }catch(err){
    console.error('Cannot load doctors:', err);
    // fallback на встроенный demoData
    doctors = demoData;
  }
  render(doctors);
}

/* ===============================
   ОТРИСОВКА КАРТОЧЕК
   =============================== */
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
    : `<p style="grid-column:1/-1;color:#fff7">No matches</p>`;
}

/* ===============================
   ПОИСК по имени / специальности / стране
   =============================== */
searchInp?.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  render(
    doctors.filter(d=>
      d.name.toLowerCase().includes(q)||
      d.specialty.toLowerCase().includes(q)||
      d.country.toLowerCase().includes(q)
    )
  );
});

/* ===============================
   ПЕРВАЯ ЗАГРУЗКА
   =============================== */
loadDoctors(lang);

/* ===============================
   ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА
   =============================== */
document.addEventListener('langChanged', e=>{
  lang = e.detail;
  loadDoctors(lang);          // перезапрашиваем JSON и перерисовываем
});

/* ==========================================================
   МОДАЛЬНОЕ ОКНО (как в вашем прежнем рабочем коде, не трогаем)
   ========================================================== */
const modal        = document.getElementById('doctorModal');
const modalContent = modal?.querySelector('.modal-content');
const profileView  = modal?.querySelector('.profile-view');
const formView     = modal?.querySelector('.form-view');
const closeBtn     = modal?.querySelector('.modal-close');
const bookBtn      = modal?.querySelector('.book-btn');
const form         = document.getElementById('appointmentForm');

// --- утилита для поиска врача по id ---
function getDoctorById(id){ return doctors.find(d=>d.id===id); }

// --- открытие карточки ---
function openModal(id){
  const doc = getDoctorById(id);
  if(!doc) return;
  modal.querySelector('#modalPhoto').src       = doc.photo;
  modal.querySelector('#modalPhoto').alt       = doc.name;
  modal.querySelector('#doctorModalTitle').textContent = doc.name;
  modal.querySelector('#modalSpecialty').textContent   = `${doc.specialty} · ${doc.country}`;
  modal.querySelector('#modalBio').textContent         = doc.bio || '';
  modal.querySelector('#modalContact').innerHTML =
      `<strong>Email:</strong> <a href="mailto:${doc.email}">${doc.email}</a><br/>
       <strong>Phone:</strong> <a href="tel:${doc.phone}">${doc.phone}</a>`;
  modal.querySelector('#modalHours').innerHTML =
      `<strong>Working Hours:</strong> ${doc.hours}`;

  profileView.style.display = 'block';
  formView.style.display    = 'none';
  modalContent.setAttribute('aria-labelledby','doctorModalTitle');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  closeBtn.focus();
}

// --- закрытие ---
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  if(lastFocusedCard){ lastFocusedCard.focus(); lastFocusedCard=null; }
}

// --- переключение в форму брони ---
bookBtn?.addEventListener('click',()=>{
  profileView.style.display = 'none';
  formView.style.display    = 'block';
  modalContent.setAttribute('aria-labelledby','appointmentTitle');
  document.getElementById('app-name')?.focus();
});

// --- события закрытия ---
closeBtn?.addEventListener('click',closeModal);
modal?.querySelector('.modal-overlay')?.addEventListener('click',closeModal);
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && modal?.classList.contains('show')) closeModal();
});

/* ===============================
   КЛИК/ENTER ПО КАРТОЧКАМ
   =============================== */
let lastFocusedCard = null;
listBox.addEventListener('click', e=>{
  const card = e.target.closest('.card');
  if(card){
    card.setAttribute('tabindex','0');
    lastFocusedCard = card;
    openModal(card.id);
  }
});
listBox.addEventListener('keydown', e=>{
  if(e.key==='Enter' && document.activeElement.classList.contains('card')){
    lastFocusedCard = document.activeElement;
    openModal(lastFocusedCard.id);
  }
});

/* ===============================
   ОТПРАВКА ФОРМЫ (демо)
   =============================== */
form?.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Appointment request sent! (demo only)');
  closeModal();
});

/* ===============================
   FALLBACK demoData (если JSON не найден)
   =============================== */
const demoData = [
  {id:'demo', name:'Demo Doctor', specialty:'Demo', country:'Nowhere',
   photo:'https://via.placeholder.com/160x160', bio:'Demo profile.', email:'', phone:'', hours:'-'}
];
