// Tab functionality for "For Patients" section
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Deactivate all tabs and panels
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(panel => panel.classList.remove('active'));
    // Activate the clicked tab and corresponding panel
    btn.classList.add('active');
    const target = btn.dataset.tab;
    const content = document.querySelector(`.tab-content[data-content="${target}"]`);
    if (content) content.classList.add('active');
  });
});

// Accordion functionality for "For Doctors" section
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    // Toggle the "open" class on the parent .accordion-item
    item.classList.toggle('open');
  });
});

// Scroll-triggered animations
const observers = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observers.observe(el));

// Animated counters for stats
function startCounters() {
  document.querySelectorAll('.stat-number').forEach(span => {
    const target = Number(span.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 50);  // divide into ~50 increments
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(interval);
      }
      span.textContent = count;
    }, 40);
  });
}

// Observe stats section to trigger counters once
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      startCounters();
      obs.unobserve(entries[0].target);
    }
  }, { threshold: 0.2 });
  statsObserver.observe(statsSection);
}


document.querySelectorAll('.accordion-header').forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.parentElement.classList.toggle('open');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // grab every header inside this page’s accordion
  const headers = document.querySelectorAll('.doctors-section .accordion-header');

  headers.forEach(btn => {
    btn.addEventListener('click', () => {
      // close any other open item (optional – remove if you want multi-open)
      /* document.querySelectorAll('.doctors-section .accordion-item.open')
              .forEach(item => item !== btn.parentElement && item.classList.remove('open')); */

      // toggle the clicked one
      btn.parentElement.classList.toggle('open');
    });
  });
});
