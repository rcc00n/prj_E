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

/* SIDEBAR TOGGLE (без изменений) */
const burger  = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const body    = document.body;

function setCollapsed(state){
  sidebar.classList.toggle('collapsed', state);
  burger .classList.toggle('open',      !state);
  body   .classList.toggle('sidebar-collapsed', state);
  localStorage.setItem('sidebarClosed', state ? '1' : '0');
}
burger.addEventListener('click', () => setCollapsed(!sidebar.classList.contains('collapsed')));
setCollapsed(localStorage.getItem('sidebarClosed') === '1');


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
      topDoctors = all.slice(0,6);
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
