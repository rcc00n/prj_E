/* theme.js — единая логика светлой/тёмной темы */
(()=>{               // ранняя вставка класса до отрисовки страницы
  const t = localStorage.getItem('theme');
  if (t === 'light') document.documentElement.classList.add('light');
})();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const btn  = document.getElementById('themeBtn');

  // выставляем правильную пиктограмму
  const setIcon = () =>
    btn.textContent = root.classList.contains('light') ? '🌞' : '🌙';

  setIcon();                                   // при загрузке

  btn.addEventListener('click', () => {        // при клике
    const nowLight = root.classList.toggle('light');
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
    setIcon();
  });
});
