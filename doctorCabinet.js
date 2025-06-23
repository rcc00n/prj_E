// doctorCabinet.js  –  кабинет врача: статистика + список приёмов
(async () => {
  /* 1. сессия */
  const s = await fetch('/api/session', { credentials: 'include' });
  if (!s.ok) { location.href = 'index.html'; return; }
  const me = await s.json();                       // {name,email,role}
  if (me.role !== 'doctor') { location.href = 'index.html'; return; }

  /* 2. контейнеры (создаём при надобности) */
  const body = document.body;

  const greet = document.getElementById('greeting')
        || body.insertBefore(Object.assign(
             document.createElement('p'), { id:'greeting' }), body.firstChild);

  const statsEl = document.getElementById('docStats')
        || body.appendChild(Object.assign(
             document.createElement('section'), { id:'docStats', className:'stats' }));

  const tableEl = document.getElementById('docTable')
        || body.appendChild(Object.assign(
             document.createElement('div'), { id:'docTable', className:'table-wrap' }));

  const last = me.name.split(' ').pop();
  greet.textContent = `Hello, Dr. ${last}`;

  /* 3. получаем приёмы */
  let appts = [];
  try {
    const r = await fetch(`/api/doctor/${encodeURIComponent(me.email)}/appointments`);
    appts = r.ok ? await r.json() : [];
  } catch {
    /* fallback: читаем общий файл и фильтруем */
    try {
      const r = await fetch('/data/appointments.json', { cache:'no-store' });
      if (r.ok) appts = (await r.json()).filter(a => a.docId === me.email);
    } catch {}
  }

  /* сортируем по дате (ближайшие первыми) */
  appts.sort((a,b)=>new Date(a.date)-new Date(b.date));

  /* 4. статистика врача */
  statsEl.innerHTML = `
    <div class="stat"><h3>${appts.length}</h3><span>Upcoming visits</span></div>
    <div class="stat"><h3>${appts[0]?.date ?? '—'}</h3><span>Nearest visit</span></div>
    <div class="stat"><h3>${me.email}</h3><span>Email</span></div>`;

  /* 5. таблица приёмов */
  tableEl.innerHTML = appts.length
    ? `<table class="cab-table">
         <thead>
           <tr><th>Patient</th><th>Date</th><th>Service</th><th>Status</th></tr>
         </thead>
         <tbody>${appts.map(a => `
           <tr>
             <td>${a.patient}</td>
             <td>${a.date}</td>
             <td>${a.service}</td>
             <td>${a.status}</td>
           </tr>`).join('')}</tbody>
       </table>`
    : '<p class="empty">No appointments scheduled.</p>';
})();
