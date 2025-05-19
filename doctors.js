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

// Get modal elements
const modal       = document.getElementById('doctorModal');
const modalContent= modal.querySelector('.modal-content');
const profileView = modal.querySelector('.profile-view');
const formView    = modal.querySelector('.form-view');
const closeBtn    = modal.querySelector('.modal-close');
const bookBtn     = modal.querySelector('.book-btn');
const form        = document.getElementById('appointmentForm');

// Utility: find doctor by ID in our data array
function getDoctorById(id) {
  return doctors.find(d => d.id === id);
}

// Open modal and display profile info for the given doctor
function openModal(doctorId) {
  const doc = getDoctorById(doctorId);
  if (!doc) return;
  // Populate modal content with doctor's data
  modal.querySelector('#modalPhoto').src = doc.photo;
  modal.querySelector('#modalPhoto').alt = doc.name;
  modal.querySelector('#doctorModalTitle').textContent = doc.name;
  modal.querySelector('#modalSpecialty').textContent = `${doc.specialty} \u00B7 ${doc.country}`;
  modal.querySelector('#modalBio').textContent = doc.bio || '';
  modal.querySelector('#modalContact').innerHTML = 
    `<strong>Email:</strong> <a href="mailto:${doc.email}">${doc.email}</a><br/>
     <strong>Phone:</strong> <a href="tel:${doc.phone}">${doc.phone}</a>`;
  modal.querySelector('#modalHours').innerHTML = 
    `<strong>Working Hours:</strong> ${doc.hours}`;
  
  // Show the profile view, hide the form view
  profileView.style.display = 'block';
  formView.style.display    = 'none';
  // Ensure the dialog is labeled by the doctor's name
  modalContent.setAttribute('aria-labelledby', 'doctorModalTitle');
  
  // Display the modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  
  // Set initial focus to the close button (so user can tab into content easily)
  closeBtn.focus();
  // (Alternatively, focus the first interactive element or the heading for screen readers)
}

// Close modal function
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  // Return focus to the last focused element (the card that was clicked)
  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
}

// Open form view when "Book Appointment" is clicked
bookBtn.addEventListener('click', () => {
  // Switch to the form section
  profileView.style.display = 'none';
  formView.style.display    = 'block';
  // Update dialog label for screen readers
  modalContent.setAttribute('aria-labelledby', 'appointmentTitle');
  // Focus the first form field (Name) for convenience
  document.getElementById('app-name').focus();
});

// Close modal on overlay click or close button click
closeBtn.addEventListener('click', closeModal);
modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    closeModal();
  }
});

// Track last focused element (doctor card) to restore focus after closing
let lastFocusedCard = null;
// Use event delegation to handle clicks on any doctor card
const doctorList = document.getElementById('doctorList');
doctorList.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) {
    // make cards focusable if not already
    card.setAttribute('tabindex', '0');
    lastFocusedCard = card;
    openModal(card.id);
  }
});
// Handle keyboard "Enter" on a focused card
doctorList.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement.classList.contains('card')) {
    const card = document.activeElement;
    lastFocusedCard = card;
    openModal(card.id);
  }
});

// Optionally, handle form submission (prevent page reload, since no backend)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Appointment request sent! (demo only)');
  closeModal();
});
