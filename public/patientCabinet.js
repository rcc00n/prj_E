// patientCabinet.js ─ выводит актуальные визиты пациента

(async () => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  /* 1. сессия ─────────────────────────────────────────────── */
  const s = await fetch('/api/session', { credentials: 'include' });
  if (!s.ok) { location.href = 'index.html'; return; }
  const me = await s.json();
  if (me.role !== 'patient') { location.href = 'index.html'; return; }                         // {name,email}

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
    const response = await fetch(`/api/patient/${encodeURIComponent(me.email)}/appointments`, { credentials: 'include' });
    if (!response.ok) throw new Error('unavailable');
    appts = await response.json();
  } catch {
    tableEl.textContent = 'Appointments could not be loaded. Please retry.';
    return;
  }

  /* 4. статистика ─────────────────────────────────────────── */
  statsEl.innerHTML = `
    <div class="stats">
      <div class="box"><h3>${escape(appts[0]?.date ?? '—')}</h3><span>Next visit</span></div>
      <div class="box"><h3>${appts.length}</h3><span>Total visits</span></div>
      <div class="box"><h3>${escape(me.email)}</h3><span>Email</span></div>
    </div>`;

  /* 5. таблица / сообщение ───────────────────────────────── */
  tableEl.innerHTML = appts.length
    ? `<table class="cab-table">
         <thead><tr><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
         <tbody>${appts.map(a => `
           <tr><td>${escape(a.doctor)}</td><td>${escape(a.date)}</td><td>${escape(a.status)}</td></tr>`
         ).join('')}</tbody>
       </table>`
    : '<p class="empty">No appointments yet.</p>';
})();
