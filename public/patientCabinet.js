// patientCabinet.js ─ выводит актуальные визиты пациента

(async () => {
  /* 1. сессия ─────────────────────────────────────────────── */
  const s = await fetch('/api/session', { credentials: 'include' });
  if (!s.ok) { location.href = 'index.html'; return; }
  const me = await s.json();                         // {name,email}

  /* 2. контейнеры (создаём при необходимости) ─────────────── */
  const body = document.body;

  const greet   = document.getElementById('patGreet')
             ||  body.insertBefore(Object.assign(
                   document.createElement('p'), { id:'patGreet' }), body.firstChild);

  const statsEl = document.getElementById('patStats')
             ||  body.appendChild(Object.assign(
                   document.createElement('section'), { id:'patStats' }));

  const tableEl = document.getElementById('patTable')
             ||  body.appendChild(Object.assign(
                   document.createElement('div'), { id:'patTable' }));

  greet.textContent = `Hello, ${me.name.split(' ')[0]}`;

  /* 3. получаем визиты ────────────────────────────────────── */
  let appts = [];
  try {
    const url = `/api/patient/${encodeURIComponent(me.email)}/appointments`;
    const r   = await fetch(url);
    if (r.ok) appts = await r.json();
    else throw new Error('fallback');
  } catch {
    /* fallback: читаем общий appointments.json и фильтруем */
    try {
      const r = await fetch('/data/appointments.json', { cache:'no-store' });
      if (r.ok) {
        const all = await r.json();
        appts = all.filter(a => a.patId === me.email);
      }
    } catch {/* network fail → оставим [] */}
  }

  /* 4. статистика ─────────────────────────────────────────── */
  statsEl.innerHTML = `
    <div class="stats">
      <div class="box"><h3>${appts[0]?.date ?? '—'}</h3><span>Next visit</span></div>
      <div class="box"><h3>${appts.length}</h3><span>Total visits</span></div>
      <div class="box"><h3>${me.email}</h3><span>Email</span></div>
    </div>`;

  /* 5. таблица / сообщение ───────────────────────────────── */
  tableEl.innerHTML = appts.length
    ? `<table class="cab-table">
         <thead><tr><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
         <tbody>${appts.map(a => `
           <tr><td>${a.doctor}</td><td>${a.date}</td><td>${a.status}</td></tr>`
         ).join('')}</tbody>
       </table>`
    : '<p class="empty">No appointments yet.</p>';
})();
