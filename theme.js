/* theme.js — единая логика светлой/тёмной темы */

/* 1. текущий режим */
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'light') root.classList.add('light');   // ранняя инициализация

/* 2. переключатель */
const themeBtn = document.getElementById('themeBtn');
themeBtn?.addEventListener('click', () => {
  const nowLight = root.classList.toggle('light');    // переключили класс
  /* 3. запомнили результат */
  localStorage.setItem('theme', nowLight ? 'light' : 'dark');
});
