/* script.js */

fetch('doctors.json')
  .then(r => r.json())
  .then(renderDoctors)
  .catch(console.error);

function renderDoctors(list){
  const box = document.getElementById('doctorCards');
  box.innerHTML = list                       // весь массив
                   .slice(0, 4)              // ← берём первые 4-е
                   .map(makeCard).join('');
}

function makeCard(d){
  return `
    <article class="card" id="${d.id}">
      <img src="${d.photo}" alt="${d.name}">
      <h3>${d.name}</h3>
      <span>${d.specialty} · ${d.country}</span>
    </article>`;
}

const burger  = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const body    = document.body;

function setCollapsed(state){
  sidebar.classList.toggle('collapsed', state);
  burger .classList.toggle('open',      !state);
  body   .classList.toggle('sidebar-collapsed', state);
  localStorage.setItem('sidebarClosed', state ? '1' : '0');
}

document.addEventListener('DOMContentLoaded',()=>{
  setCollapsed(localStorage.getItem('sidebarClosed') === '1'); // начальное
  burger.addEventListener('click',()=>setCollapsed(!sidebar.classList.contains('collapsed')));
});


//* ───── IN-PAGE NAV HIGHLIGHT (v2) ───── */
document.addEventListener('DOMContentLoaded', () => {

  /* ссылки вида  <a href="#...">  внутри сайдбара */
  const anchorLinks = [...document.querySelectorAll('.sidebar nav a[href^="#"]')];

  /* какие id фигурируют в этих ссылках?  (#home, #how, …) */
  const watchedIDs = anchorLinks.map(l => l.getAttribute('href').slice(1));

  /* берём только те секции, чей id присутствует в watchedIDs */
  const sections = watchedIDs
    .map(id => document.getElementById(id))
    .filter(Boolean);                           // на всякий случай

  /* клик по меню — актив сразу */
  anchorLinks.forEach(link =>
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar nav a.active')
              .forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    })
  );

  /* подсветка при прокрутке */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        anchorLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-50% 0px -40% 0px'   // секция приблизительно в центре
  });

  sections.forEach(sec => observer.observe(sec));
});


// логика переключения страниц и запоминание выбора
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.classList.contains('active')) return;        // уже выбран
    const lang = btn.dataset.lang;
    localStorage.setItem('lang', lang);                 // запомнили выбор

    // меняем имя файла: page.html  <->  page-ru.html
    const path = location.pathname;
    const ruRe = /-ru(\.html)$/;
    let target = path;

    if(lang==='ru' && !ruRe.test(path)){
      target = path.replace(/\.html$/, '-ru.html');
    }else if(lang==='en' && ruRe.test(path)){
      target = path.replace(ruRe, '.html');
    }
    // location.href = target;
  });
});

// при входе с другой страницы — подсветить активный
const pref = localStorage.getItem('lang') || 'en';
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.classList.toggle('active', b.dataset.lang===pref);
});

/* ───────── TOP-DOCTORS ON HOME PAGE ───────── */
const cardsBox = document.getElementById('doctorCards');
if (cardsBox){                 // код запускается только на index.html
  let lang = localStorage.getItem('lang') || 'en';
  let topDoctors = [];

  async function loadTop(lng){
    try{
      const res = await fetch(`./data/doctors-${lng}.json`, {cache:'no-store'});
      if(!res.ok) throw new Error(res.status);
      const all = await res.json();
      // возьмём первые 6 (или меньше, если данных меньше)
      topDoctors = all.slice(0,4);
    }catch(e){
      console.error('Top-docs load error:', e);
      topDoctors = [];
    }
    renderTop(topDoctors);
  }

  function renderTop(arr){
    cardsBox.innerHTML = arr.length
      ? arr.map(d=>`
          <article class="card">
            <img src="${d.photo}" alt="${d.name}">
            <h3>${d.name}</h3>
            <span>${d.specialty} · ${d.country}</span>
          </article>
        `).join('')
      : '<p style="grid-column:1/-1;color:#fff7">—</p>';
  }

  // первая отрисовка
  loadTop(lang);

  // при смене языка
  document.addEventListener('langChanged', e=>{
    lang = e.detail;
    loadTop(lang);
  });
}


/* ===== script.js  — вставьте в самый конец ===== */

/* ─── 1. Scroll-fade для .fade-in ─── */
(() => {
  const io = new IntersectionObserver(e=>{
    e.forEach(x=>{
      if(x.isIntersecting){
        x.target.classList.add('visible');
        io.unobserve(x.target);
      }
    });
  },{threshold:.15});
  document.querySelectorAll('.fade-in').forEach(s=>io.observe(s));
})();

/* ─── 2. Параллакс заголовка ─── */
(() => {
  const hero = document.querySelector('.hero.parallax');
  if(!hero) return;
  const onScroll = () => {
    const y = window.scrollY * .4;          // скорость параллакса
    hero.style.transform = `translateY(${y}px)`;
  };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
})();

/* ─── 3. Автосмена отзывов ─── */
(() => {
  const quotes = [...document.querySelectorAll('#reviews blockquote')];
  if(!quotes.length) return;
  let i = 0; quotes[0].classList.add('show');
  setInterval(()=>{
    quotes[i].classList.remove('show');
    i = (i+1) % quotes.length;
    quotes[i].classList.add('show');
  }, 6000);
})();

/* ─── 4. 3-D tilt карточек ─── */
(() => {
  const cards = document.querySelectorAll('.doctors .card');
  cards.forEach(c=>{
    c.addEventListener('mousemove', e=>{
      const b = c.getBoundingClientRect();
      const rx = ((e.clientY - b.top)  / b.height - .5) * -10;
      const ry = ((e.clientX - b.left) / b.width  - .5) *  10;
      c.style.setProperty('--rx', rx+'deg');
      c.style.setProperty('--ry', ry+'deg');
    });
    c.addEventListener('mouseleave', ()=>c.style.setProperty('--rx','0deg'));
  });
})();

/* === reviews rotation ===  (вставьте внизу script.js) */
/* ===== reviews rotation (фикс-2, та же позиция) ===== */
(()=>{
  const wrap = document.querySelector('#reviews .rev-wrap');
  if(!wrap) return;

  const cards = [...wrap.children];
  const STEP  = 2;      // показываем две карточки
  const SPEED = 3000;   // 3 с между сменами
  let idx = 0;

  function cycle(){
    cards.forEach((c,i)=>{
      c.classList.toggle('show', i>=idx && i<idx+STEP);
    });
    idx = (idx + STEP) % cards.length;
  }
  cycle();                       // первый вывод
  setInterval(cycle, SPEED);     // дальше по кругу
})();

/* ───── script.js  (в самом конце) ───── */
// === session check ===
document.addEventListener('DOMContentLoaded',async()=>{
  const links = document.querySelector('.auth-links');
  if(!links) return;
  try{
    const r = await fetch('/api/session',{credentials:'include'});
    if(r.ok) links.style.display = 'none';   // ← вместо .remove()
  }catch{}
});

/* === script.js → ЗАМЕНИ прошлую вставку «Dashboard-link» === */
(async () => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  /* прячем блок авторизации, если сессия есть */
  const auth = sidebar.querySelector('.auth-links');
  const r    = await fetch('/api/session', { credentials: 'include' }).catch(()=>{});
  if (!r || !r.ok) return;

  const { role } = await r.json();
  if (auth) auth.style.display = 'none';

  /* удаляем старые варианты */
  sidebar.querySelectorAll('.dash-icon').forEach(el => el.remove());

  /* компактная иконка */
  const link = document.createElement('a');
  link.className = 'dash-icon';
  link.href      = role === 'doctor'
                   ? 'doctor-dashboard.html'
                   : 'patient-dashboard.html';
  link.title     = 'Dashboard';
  link.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"
         aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.1 0-9 1.55-9 4.65V22h18v-3.35C21 15.55 15.1 14 12 14Z"/>
    </svg>`;
  /* вставляем ПЕРВЫМ ребёнком header */
  sidebar.querySelector('header').prepend(link);
})();
