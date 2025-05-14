const listBox  = document.getElementById('doctorList');
const search   = document.getElementById('search');

let doctors = [];
loadDoctors();

async function loadDoctors(){
  try{
    const resp = await fetch('./doctors.json',{cache:'no-store'});
    if(!resp.ok) throw new Error(resp.status);
    doctors = await resp.json();
  }catch{
    doctors = demoData;
  }
  render(doctors);
}

search.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  render(doctors.filter(d=>
    d.name.toLowerCase().includes(q)||
    d.specialty.toLowerCase().includes(q)||
    d.country.toLowerCase().includes(q)
  ));
});

function render(arr){
  listBox.innerHTML = arr.length
    ? arr.map(card).join('')
    : '<p style="grid-column:1/-1;color:#fff7">No matches</p>';
}
function card(d){
  return `<article class="card" id="${d.id}">
            <img src="${d.photo}" alt="${d.name}">
            <h3>${d.name}</h3>
            <span>${d.specialty} · ${d.country}</span>
          </article>`;
}

const demoData=[/* … */];