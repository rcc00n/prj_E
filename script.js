fetch('doctors.json')
  .then(r=>r.json())
  .then(renderDoctors)
  .catch(console.error);

function renderDoctors(list){
  const box=document.getElementById('doctorCards'); 
  box.innerHTML=list.map(makeCard).join('');
}

function makeCard(d){
  return `
    <article class="card" id="${d.id}">
      <img src="${d.photo}" alt="${d.name}">
      <h3>${d.name}</h3>
      <span>${d.specialty} · ${d.country}</span>
    </article>`;
}

/*  SIDEBAR TOGGLE  */
const burger  = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const body    = document.body;

function setCollapsed(state){
  sidebar.classList.toggle('collapsed', state);
  burger .classList.toggle('open',      !state);
  body   .classList.toggle('sidebar-collapsed', state);
  localStorage.setItem('sidebarClosed', state ? '1' : '0');
}

/* клик по бургеру */
burger.addEventListener('click', () => setCollapsed(!sidebar.classList.contains('collapsed')));

/* восстановление состояния */
setCollapsed(localStorage.getItem('sidebarClosed') === '1');
