import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createIcons,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  X,
  Sparkles,
  Send,
  Ghost,
  Layers,
  ShieldCheck,
  MonitorCog,
  Server,
  Database,
  Boxes,
  Shield,
  ChevronRight,
  Terminal,
  Expand,
  Github,
  ExternalLink,
  Linkedin,
  AtSign,
  Mail,
  Settings,
} from 'lucide';

import { SITE_CONFIG } from './config.js';
import { initThreeScene } from './three-scene.js';
import { initVideos } from './videos.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initInteractions } from './interactions.js';
import { initProjects } from './projects.js';
import { initContact } from './contact.js';

gsap.registerPlugin(ScrollTrigger);

const USED_ICONS = {
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  X,
  Sparkles,
  Send,
  Ghost,
  Layers,
  ShieldCheck,
  MonitorCog,
  Server,
  Database,
  Boxes,
  Shield,
  ChevronRight,
  Terminal,
  Expand,
  Github,
  ExternalLink,
  Linkedin,
  AtSign,
  Mail,
  Settings,
};

function refreshIcons() {
  createIcons({ icons: USED_ICONS });
}

function initAvailabilityAndMeta() {
  const pill = document.getElementById('availability-pill');
  const text = document.getElementById('availability-text');
  if (pill && text && SITE_CONFIG.availability?.enabled) {
    text.textContent = SITE_CONFIG.availability.label;
    pill.hidden = false;
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initLenis() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function runPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  const percentEl = document.getElementById('preloader-percent');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!preloader || prefersReducedMotion) {
    preloader?.classList.add('is-hidden');
    document.documentElement.classList.remove('is-loading');
    onComplete();
    return;
  }

  let progress = 0;
  const finish = () => {
    if (fill) fill.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      preloader.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('is-loading');
      onComplete();
    }, 240);
  };

  const interval = window.setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 12;
    if (progress >= 96) {
      progress = 96;
      window.clearInterval(interval);
      finish();
    } else {
      if (fill) fill.style.width = `${progress}%`;
      if (percentEl) percentEl.textContent = `${String(progress).padStart(2, '0')}%`;
    }
  }, 75);
}

document.addEventListener('DOMContentLoaded', () => {
  initAvailabilityAndMeta();
  const lenis = initLenis();

  initThreeScene();
  initVideos();
  initNavigation(lenis);
  initInteractions();
  initProjects(lenis, refreshIcons);
  initContact(refreshIcons);
  refreshIcons();

  runPreloader(() => {
    initAnimations();
    ScrollTrigger.refresh();
  });
});
