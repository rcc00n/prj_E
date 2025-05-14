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
