document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const btn  = document.getElementById('themeBtn');
  
    updateIcon();                         // показываем 🌞 или 🌙
  
    btn.addEventListener('click', () => {
      root.classList.toggle('light');
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'night');
      updateIcon();
    });
  
    function updateIcon() {
      btn.textContent = root.classList.contains('light') ? '🌞' : '🌙';
    }
  });
  