import { initMintUI } from '/vendor/mint-ui/0.6.1/mint-ui.js';
initMintUI();
const menu = document.querySelector('.mobile-menu');
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
});
document.addEventListener('click', event => { if (menu?.open && !menu.contains(event.target)) menu.open = false; });
const screens = {
  quiz: { src: '/assets/apps/flag-quiz.png', alt: 'Flag Quiz in English with Sweden selected as the correct answer', caption: 'A question, an answer, a little more understanding.' },
  study: { src: '/assets/apps/flag-study.png', alt: 'Flag Quiz Study screen comparing Nordic cross flags', caption: 'Browse, compare, and find the details that make each flag unique.' },
  country: { src: '/assets/apps/flag-country.png', alt: 'Sweden’s country information in Flag Quiz, with flag history and economic statistics', caption: 'Follow a flag into the history and context of a country.' },
};
const screen = document.querySelector('#product-screen');
const caption = document.querySelector('#preview-caption');
const buttons = document.querySelectorAll('[data-screen]');
buttons.forEach(button => button.addEventListener('click', () => {
  const selected = screens[button.dataset.screen];
  if (!selected || !screen || !caption) return;
  screen.src = selected.src; screen.alt = selected.alt; caption.textContent = selected.caption;
  buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));
