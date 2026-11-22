import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP + ScrollTrigger Choreographed Motion System
 * - Intentional entrance reveals (no visual clutter)
 * - About timeline vertical rail progress synced to scroll
 * - Respects prefers-reduced-motion
 */
export function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    const rail = document.getElementById('timeline-rail-fill');
    if (rail) rail.style.height = '100%';
    return;
  }

  // Hero entrance sequence (triggered right after preloader clears)
  const heroItems = document.querySelectorAll('.hero-animate');
  if (heroItems.length) {
    gsap.fromTo(
      heroItems,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
      }
    );
  }

  // Section reveal-up blocks
  document.querySelectorAll('.reveal-up').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          once: true,
        },
      }
    );
  });

  // Animated About timeline rail fill
  const timeline = document.getElementById('about-timeline');
  const railFill = document.getElementById('timeline-rail-fill');
  if (timeline && railFill) {
    gsap.to(railFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 76%',
        end: 'bottom 68%',
        scrub: 0.6,
      },
    });
  }
}
