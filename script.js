document.documentElement.classList.add('js');

(() => {
  const header = document.querySelector('.site-header');
  if (!(header instanceof HTMLElement)) return;

  const setHeaderHeightVar = () => {
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  };

  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
})();

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMenuOpen(isOpen) {
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.hidden = !isOpen;
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  mobileMenu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) setMenuOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenuOpen(false);
  });
}

function runTypewriter(element, options = {}) {
  const fullText = (element.getAttribute('data-text') || '').trim();
  if (!fullText) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    element.textContent = fullText;
    return;
  }

  const speed = Number(options.speed ?? 18);
  const startDelay = Number(options.startDelay ?? 250);

  element.textContent = '';
  let index = 0;

  const tick = () => {
    if (index >= fullText.length) return;

    element.textContent += fullText[index];
    const char = fullText[index];
    index += 1;

    let delay = speed;
    if (char === '.' || char === '!' || char === '?') delay = speed * 18;
    else if (char === ',') delay = speed * 10;
    else if (char === ';' || char === ':') delay = speed * 12;

    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, startDelay);
}

const introType = document.getElementById('introType');
if (introType) runTypewriter(introType);

// Fade-in-on-scroll reveal for section text/content.
(() => {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const sectionChildren = Array.from(document.querySelectorAll('.section .section-inner > *'));
  if (sectionChildren.length === 0) return;

  sectionChildren.forEach((el) => {
    el.classList.add('reveal');
  });

  // Stagger within each section for a simple elegant feel.
  const sections = Array.from(document.querySelectorAll('.section .section-inner'));
  for (const section of sections) {
    const kids = Array.from(section.children);
    kids.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index * 70, 260)}ms`;
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (!(el instanceof HTMLElement)) continue;
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -12% 0px',
    }
  );

  sectionChildren.forEach((el) => revealObserver.observe(el));
})();
