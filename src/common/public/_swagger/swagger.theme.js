(function () {
  const STORAGE_KEY = 'swagger-dark-mode';

  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
  }

  function createToggle() {
    const btn = document.createElement('button');
    btn.innerText = '🌙 Dark mode';
    btn.style.cssText = `
      position: fixed;
      top: 15px;
      right: 25px;
      z-index: 9999;
      padding: 8px 12px;
      border-radius: 8px;
      background: #00f5ff;
      color: #000;
      border: none;
      cursor: pointer;
      font-weight: 600;
    `;

    btn.onclick = () => {
      const isDark = !document.documentElement.classList.contains('dark-mode');
      localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');
      applyTheme(isDark);
    };

    document.body.appendChild(btn);
  }

  window.addEventListener('load', () => {
    const saved = localStorage.getItem(STORAGE_KEY) === '1';
    applyTheme(saved);
    createToggle();
  });
})();
