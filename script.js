document.documentElement.classList.add('js');

// Loading screen (blink logo for ~3s, then reveal page)
(() => {
  const loader = document.getElementById('loadingScreen');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.body) return;

  const finish = () => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');

    // Allow other animations (typewriter, etc.) to start after loader.
    document.dispatchEvent(new Event('loader:done'));

    if (loader instanceof HTMLElement) {
      loader.classList.add('is-hidden');
      window.setTimeout(() => {
        loader.hidden = true;
      }, 360);
    }
  };

  if (prefersReducedMotion) {
    if (loader instanceof HTMLElement) loader.hidden = true;
    finish();
    return;
  }

  // Allow click/tap to skip early.
  const skip = () => finish();
  loader?.addEventListener('click', skip, { once: true });

  window.setTimeout(finish, 3000);
})();

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

// Contact panel (drawer)
(() => {
  const contactBtn = document.getElementById('contactBtn');
  const mobileContactBtn = document.getElementById('mobileContactBtn');
  const panel = document.getElementById('contactPanel');
  const closeBtn = document.getElementById('contactPanelClose');
  const drawer = panel?.querySelector('.contact-panel__drawer');

  if (!(panel instanceof HTMLElement) || !(drawer instanceof HTMLElement)) return;

  let lastFocused = null;
  let closeTimeout = null;

  const onKeyDown = (event) => {
    if (event.key === 'Escape') closePanel();
  };

  function openPanel() {
    if (closeTimeout) {
      window.clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    lastFocused = document.activeElement;
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');

    // Allow transition to run after un-hiding.
    window.requestAnimationFrame(() => {
      panel.classList.add('is-open');
      drawer.focus();
    });

    document.addEventListener('keydown', onKeyDown);
  }

  function closePanel() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('panel-open');
    document.removeEventListener('keydown', onKeyDown);

    closeTimeout = window.setTimeout(() => {
      panel.hidden = true;
      closeTimeout = null;
    }, 240);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  const openHandler = (event) => {
    event.preventDefault?.();
    setMenuOpen(false);
    openPanel();
  };

  contactBtn?.addEventListener('click', openHandler);
  mobileContactBtn?.addEventListener('click', openHandler);
  closeBtn?.addEventListener('click', closePanel);

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('[data-close="true"]')) closePanel();
  });

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) closePanel();
  });
})();

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
const startIntroTypewriter = () => {
  if (introType) runTypewriter(introType);
};

// Start the typewriter after the loading screen finishes.
if (document.body.classList.contains('is-loaded') || !document.body.classList.contains('is-loading')) {
  startIntroTypewriter();
} else {
  document.addEventListener('loader:done', startIntroTypewriter, { once: true });
}

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

// Project card flip previews
(() => {
  const cards = Array.from(document.querySelectorAll('#projects .card[data-preview]'));
  if (cards.length === 0) return;

  const toggleFlip = (card) => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-expanded', String(isFlipped));

    const backFace = card.querySelector('.card-back');
    if (backFace) backFace.setAttribute('aria-hidden', String(!isFlipped));
  };

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    card.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      // Don't flip when user clicks a real link/button.
      if (target.closest('a, button')) return;
      toggleFlip(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('a, button')) return;
      event.preventDefault();
      toggleFlip(card);
    });

    // If the user clicks the GitHub/live link, ensure the card returns to front.
    card.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-expanded', 'false');
        const backFace = card.querySelector('.card-back');
        if (backFace) backFace.setAttribute('aria-hidden', 'true');
      }
    });
  });
})();

// Cursor glow effect (subtle dark circular glow following the pointer)
(() => {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (!canHover || !finePointer) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let rafId = 0;

  const size = 520;
  const half = size / 2;

  const renderOnce = () => {
    rafId = 0;
    glow.style.transform = `translate3d(${Math.round(targetX - half)}px, ${Math.round(targetY - half)}px, 0)`;
  };

  const requestRender = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(renderOnce);
  };

  window.addEventListener(
    'mousemove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add('is-visible');
      requestRender();
    },
    { passive: true }
  );

  window.addEventListener(
    'mouseleave',
    () => {
      glow.classList.remove('is-visible');
    },
    { passive: true }
  );
})();

// Active nav link highlighting (based on the section currently in view)
(() => {
  const header = document.querySelector('.site-header');
  if (!(header instanceof HTMLElement)) return;

  const navLinks = Array.from(
    document.querySelectorAll('.nav-right a[href^="#"], #mobileMenu a[href^="#"]')
  ).filter((el) => el instanceof HTMLAnchorElement);

  if (navLinks.length === 0) return;

  const idFromLink = (link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return null;
    const id = href.slice(1).trim();
    return id || null;
  };

  const sectionIds = Array.from(new Set(navLinks.map(idFromLink).filter(Boolean)));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => el instanceof HTMLElement);

  if (sections.length === 0) return;

  let rafId = 0;

  const setActive = (activeId) => {
    navLinks.forEach((link) => {
      const linkId = idFromLink(link);
      const isActive = linkId === activeId;

      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const getActiveSectionId = () => {
    const y = header.offsetHeight + 24;
    let closest = null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();

      // The section that crosses the "anchor line" under the sticky header wins.
      if (rect.top <= y && rect.bottom >= y) return section.id;

      const dist = Math.abs(rect.top - y);
      if (!closest || dist < closest.dist) closest = { id: section.id, dist };
    }

    return closest?.id || sections[0].id;
  };

  const updateActive = () => {
    rafId = 0;
    setActive(getActiveSectionId());
  };

  const requestUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateActive);
  };

  // Update on scroll/resize/hash changes.
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', requestUpdate);

  // Also update immediately after clicking a nav link.
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = idFromLink(link);
      if (targetId) setActive(targetId);
    });
  });

  // Initial state.
  requestUpdate();
})();
