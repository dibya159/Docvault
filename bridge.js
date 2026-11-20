/* bridge.js — config.json padhkar index.html ko automatically set karta hai */
(async () => {
  let cfg;
  try {
    cfg = await (await fetch('config.json', { cache: 'no-cache' })).json();
  } catch (e) {
    cfg = await (await fetch('config.json')).json().catch(() => null);
  }
  if (!cfg) { document.body.innerHTML = '<p style="padding:24px;color:#fff">config.json load nahi hua.</p>'; return; }

  // Theme
  const r = document.documentElement.style;
  Object.entries(cfg.theme).forEach(([k, v]) => r.setProperty('--' + k, v));
  document.title = cfg.app.name;
  document.querySelectorAll('[data-app-name]').forEach(el => (el.textContent = cfg.app.name));
  document.querySelectorAll('[data-tagline]').forEach(el => (el.textContent = cfg.app.tagline));

  // Bottom nav
  const nav = document.getElementById('nav');
  nav.innerHTML = cfg.nav
    .filter(n => n.id !== 'search' || cfg.modules.search)
    .map(n => `<button data-nav="${n.id}" class="${n.id === 'add' ? 'fab' : ''}" aria-label="${n.label}">
      <svg viewBox="0 0 24 24"><path d="${n.icon}"/></svg><span>${n.label}</span></button>`)
    .join('');

  // Modules on/off
  Object.entries(cfg.modules).forEach(([k, on]) => {
    if (!on) document.querySelectorAll(`[data-module="${k}"]`).forEach(el => el.remove());
  });

  window.DV.start(cfg);
})();
