(() => {
  try {
    const t = localStorage.getItem('theme');
    document.documentElement.dataset.theme = t || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  } catch { document.documentElement.dataset.theme = 'dark'; }
  try {
    if (localStorage.getItem('look') === 'film') document.documentElement.dataset.look = 'film';
  } catch {}
  try {
    const s = localStorage.getItem('spoil');
    if (s && +s >= 1 && +s < 7) document.documentElement.dataset.spoil = s;
  } catch {}
})();
