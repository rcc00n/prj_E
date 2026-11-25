// doctorCabinet.js  –  кабинет врача: статистика + список приёмов
(async () => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
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
    const response = await fetch(`/api/doctor/${encodeURIComponent(me.email)}/appointments`, { credentials: 'include' });
    if (!response.ok) throw new Error('unavailable');
    appts = await response.json();
  } catch {
    tableEl.textContent = 'Appointments could not be loaded. Please retry.';
    return;
  }

  /* сортируем по дате (ближайшие первыми) */
  appts.sort((a,b)=>new Date(a.date)-new Date(b.date));

  /* 4. статистика врача */
  statsEl.innerHTML = `
    <div class="stat"><h3>${appts.length}</h3><span>Upcoming visits</span></div>
    <div class="stat"><h3>${escape(appts[0]?.date ?? '—')}</h3><span>Nearest visit</span></div>
    <div class="stat"><h3>${escape(me.email)}</h3><span>Email</span></div>`;

  /* 5. таблица приёмов */
  tableEl.innerHTML = appts.length
    ? `<table class="cab-table">
         <thead>
           <tr><th>Patient</th><th>Date</th><th>Service</th><th>Status</th></tr>
         </thead>
         <tbody>${appts.map(a => `
           <tr>
             <td>${escape(a.patient)}</td>
             <td>${escape(a.date)}</td>
             <td>${escape(a.service)}</td>
             <td>${escape(a.status)}</td>
           </tr>`).join('')}</tbody>
       </table>`
    : '<p class="empty">No appointments scheduled.</p>';
})();
