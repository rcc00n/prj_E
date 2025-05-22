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


/* ─────────  IN-PAGE NAV HIGHLIGHT  ───────── */
document.addEventListener('DOMContentLoaded', () => {

  // ссылки внутри сайдбара, ведущие к якорям на текущей странице
  const anchorLinks = [...document.querySelectorAll('.sidebar nav a[href^="#"]')];

  // секции, у которых есть id (hero мы пропустим — стартовая позиция подсвечивается по клику Home)
  const sections = [...document.querySelectorAll('main section[id]')];

  /* ① Подсветка при клике */
  anchorLinks.forEach(link => link.addEventListener('click', () => {
    // снимаем актив с остальных
    document.querySelectorAll('.sidebar nav a.active')
            .forEach(l => l.classList.remove('active'));
    // ставим актив на выбранную ссылку
    link.classList.add('active');
  }));

  /* ② Подсветка при прокрутке */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        anchorLinks.forEach(link => {
          // актив, если href == #id текущей секции
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-50% 0px -40% 0px' // срабатывает, когда секция ~по центру экрана
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
    location.href = target;
  });
});

// при входе с другой страницы — подсветить активный
const pref = localStorage.getItem('lang') || 'en';
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.classList.toggle('active', b.dataset.lang===pref);
});
