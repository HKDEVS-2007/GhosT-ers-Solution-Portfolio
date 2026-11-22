/**
 * Floating Navigation, Active Section Indicator, Scroll Progress & Mobile Drawer
 */
export function initNavigation(lenis) {
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('main section[id]');

  const drawer = document.getElementById('mobile-drawer');
  const navToggle = document.getElementById('nav-toggle');
  const drawerClose = document.getElementById('mobile-drawer-close');
  const drawerClosers = document.querySelectorAll('[data-close-drawer]');

  const setDrawerState = (open) => {
    if (!drawer || !navToggle) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    navToggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('drawer-open', open);
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    setDrawerState(!isOpen);
  });

  drawerClose?.addEventListener('click', () => setDrawerState(false));
  drawerClosers.forEach((el) => el.addEventListener('click', () => setDrawerState(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-open')) {
      setDrawerState(false);
    }
  });

  // Smooth anchor scrolling via Lenis (or native fallback)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      if (drawer?.classList.contains('is-open')) {
        setDrawerState(false);
      }

      if (lenis) {
        lenis.scrollTo(target, { offset: -20, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Header scroll state & progress indicator
  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    header?.classList.toggle('is-scrolled', scrollY > 40);

    if (progressBar) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      progressBar.style.width = `${percent}%`;
    }
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  // Active section tracker
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.dataset.section === id);
        });
      });
    },
    {
      rootMargin: '-38% 0px -48% 0px',
      threshold: 0,
    }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));
}
