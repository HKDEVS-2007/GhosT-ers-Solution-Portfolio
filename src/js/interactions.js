/**
 * Interactive Micro-Experiences:
 * 1. Interactive 6-Domain Technical Ecosystem Lab + SVG Topology Visualizer
 * 2. Magnetic CTA buttons
 * 3. Subtle desktop cursor aura & mouse parallax
 * 4. 3D card tilt hover on project showcases
 */

const EXPERTISE_DOMAINS = {
  desktop: {
    code: 'NODE // 01 OF 06',
    title: 'Desktop Application Development',
    tag: 'NATIVE & CROSS-PLATFORM',
    description:
      'Engineering responsive, offline-capable desktop software tailored for operational workflows, local persistence, and crisp native user interfaces.',
    stack: ['Electron.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', '.NET Windows Forms'],
    focus: 'Structured local-first desktop utilities, management suites, and productivity tools.',
    nodes: ['Electron.js', 'Node.js', '.NET WinForms', 'IPC Bridge', 'Local Storage'],
  },
  backend: {
    code: 'NODE // 02 OF 06',
    title: 'Backend Engineering',
    tag: 'APIs & SERVICES',
    description:
      'Building clean server-side logic, structured REST endpoints, and data validation pipelines that power web and desktop software reliably.',
    stack: ['Python', 'Flask', 'Node.js', 'REST API Development'],
    focus: 'Modular route architecture, log processing pipelines, and predictable API contracts.',
    nodes: ['Python', 'Flask', 'Node.js', 'REST API', 'Validation'],
  },
  database: {
    code: 'NODE // 03 OF 06',
    title: 'Database Management',
    tag: 'RELATIONAL DATA',
    description:
      'Designing normalized schemas, reliable local embedded databases, and structured query layers for business records and forensic event storage.',
    stack: ['SQLite', 'MySQL', 'Schema Design', 'Query Optimization'],
    focus: 'Zero-config embedded SQLite for desktop apps and MySQL for multi-user systems.',
    nodes: ['SQLite', 'MySQL', 'Schemas', 'Indexing', 'Exports'],
  },
  frontend: {
    code: 'NODE // 04 OF 06',
    title: 'Frontend Development',
    tag: 'INTERACTIVE UI & 3D',
    description:
      'Crafting dark-mode glassmorphic interfaces, responsive layouts, smooth GSAP motion choreography, and interactive Three.js environments.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Three.js', 'Responsive UI', 'GSAP Animations'],
    focus: 'Intentional art direction, smooth 60fps interactions, and accessible semantic markup.',
    nodes: ['HTML5 / CSS3', 'Vanilla JS', 'Three.js', 'GSAP', 'Responsive UI'],
  },
  solutions: {
    code: 'NODE // 05 OF 06',
    title: 'Business Software Solutions',
    tag: 'PRACTICAL SYSTEMS',
    description:
      'Translating real-world operational bottlenecks into structured management applications built around clarity, speed, and everyday usability.',
    stack: [
      'Inventory Management Systems',
      'Institution Management Systems',
      'Billing & Invoicing Applications',
      'Business Management Software',
      'Desktop Productivity Applications',
    ],
    focus: 'Practical workflows for pharmacies, academic institutions, and small businesses.',
    nodes: ['Inventory', 'Institution', 'Billing', 'Operations', 'Productivity'],
  },
  cybersecurity: {
    code: 'NODE // 06 OF 06',
    title: 'Cybersecurity Exploration',
    tag: 'ONGOING STUDY',
    description:
      'Currently pursuing a BS in Cyber Security — continuously building foundational knowledge in digital forensics, network security, and defensive/offensive thinking.',
    stack: [
      'BS Cyber Security (Ongoing)',
      'Digital Forensics Learning',
      'Cybersecurity Fundamentals',
      'Networking & Security Concepts',
      'Red Team & Blue Team Exploration',
    ],
    focus: 'Hands-on learning projects like ShadowTrace that connect software engineering with forensic analysis.',
    nodes: ['BS CyberSec', 'Forensics', 'Networking', 'Red Team', 'Blue Team'],
  },
};

function renderTopologySVG(svgEl, domain) {
  if (!svgEl) return;
  const center = { x: 230, y: 95 };
  const coords = [
    { x: 76, y: 38 },
    { x: 384, y: 38 },
    { x: 64, y: 152 },
    { x: 396, y: 152 },
    { x: 230, y: 24 },
  ];

  const lines = coords
    .map(
      (pt) =>
        `<line class="topology-link" x1="${center.x}" y1="${center.y}" x2="${pt.x}" y2="${pt.y}" />`
    )
    .join('');

  const outerNodes = domain.nodes
    .slice(0, coords.length)
    .map((label, idx) => {
      const pt = coords[idx];
      return `
        <g transform="translate(${pt.x}, ${pt.y})">
          <circle r="5" fill="#05070B" stroke="#00D9FF" stroke-width="1.6" />
          <rect x="-54" y="10" width="108" height="20" rx="5" fill="rgba(10,16,25,0.88)" stroke="rgba(0,217,255,0.24)" />
          <text y="23" text-anchor="middle" fill="#F4F7FC" font-family="JetBrains Mono, monospace" font-size="9.5">${label}</text>
        </g>
      `;
    })
    .join('');

  svgEl.innerHTML = `
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00D9FF" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#8055FF" stop-opacity="0" />
      </radialGradient>
    </defs>
    ${lines}
    <circle cx="${center.x}" cy="${center.y}" r="42" fill="url(#coreGlow)" />
    <circle class="topology-node-ring" cx="${center.x}" cy="${center.y}" r="24" stroke="#8055FF" stroke-width="1.2" stroke-dasharray="4 4" fill="rgba(5,7,11,0.8)" />
    <circle cx="${center.x}" cy="${center.y}" r="12" fill="#00D9FF" fill-opacity="0.2" stroke="#00D9FF" stroke-width="1.6" />
    <circle cx="${center.x}" cy="${center.y}" r="3.5" fill="#00D9FF" />
    ${outerNodes}
  `;
}

function initEngineeringLab() {
  const buttons = document.querySelectorAll('.lab-node');
  const inspectorContent = document.getElementById('lab-inspector-content');
  const topologySvg = document.getElementById('lab-topology');
  const activeCode = document.getElementById('lab-active-code');
  const overviewGrid = document.getElementById('expertise-cards-grid');

  if (!buttons.length || !inspectorContent) return;

  // Render scannable 6-card overview synced with the lab
  if (overviewGrid) {
    overviewGrid.innerHTML = Object.entries(EXPERTISE_DOMAINS)
      .map(
        ([key, item], idx) => `
        <article class="domain-mini-card ${idx === 0 ? 'is-active' : ''}" data-domain-card="${key}" tabindex="0" role="button" aria-label="Inspect ${item.title}">
          <div class="domain-mini-card__top">
            <span class="mono-label mono-label--accent">0${idx + 1}</span>
            <span class="mono-label">${item.tag}</span>
          </div>
          <h3 class="domain-mini-card__title">${item.title}</h3>
          <p class="domain-mini-card__list">${item.stack.join(' · ')}</p>
        </article>
      `
      )
      .join('');
  }

  const miniCards = document.querySelectorAll('[data-domain-card]');

  const activateDomain = (key) => {
    const domain = EXPERTISE_DOMAINS[key];
    if (!domain) return;

    buttons.forEach((btn) => {
      const match = btn.dataset.domain === key;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-selected', String(match));
    });

    miniCards.forEach((card) => {
      card.classList.toggle('is-active', card.dataset.domainCard === key);
    });

    if (activeCode) activeCode.textContent = domain.code;
    renderTopologySVG(topologySvg, domain);

    inspectorContent.innerHTML = `
      <div class="lab-inspector__header">
        <h3 class="lab-inspector__title">${domain.title}</h3>
        <span class="lab-inspector__tag">${domain.tag}</span>
      </div>
      <p class="lab-inspector__desc">${domain.description}</p>
      <div class="tech-pill-list">
        ${domain.stack.map((tech) => `<span class="tech-pill tech-pill--cyan">${tech}</span>`).join('')}
      </div>
      <div class="lab-inspector__focus">
        <strong>Engineering Focus:</strong> ${domain.focus}
      </div>
    `;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activateDomain(btn.dataset.domain));
  });

  miniCards.forEach((card) => {
    const trigger = () => {
      activateDomain(card.dataset.domainCard);
      document.getElementById('engineering-lab')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  activateDomain('desktop');
}

function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.22;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

function initCharacterPrompt() {
  const hotspot = document.getElementById('character-hotspot');
  const promptEl = document.getElementById('character-prompt');
  if (!hotspot || !promptEl) return;

  const positionPrompt = (clientX, clientY) => {
    const promptRect = promptEl.getBoundingClientRect();
    const width = promptRect.width || 240;
    const height = promptRect.height || 76;

    // Flip to the left of the cursor if near the right edge of the viewport
    let left = clientX + 18;
    if (left + width > window.innerWidth - 16) {
      left = clientX - width - 18;
    }

    const top = Math.max(height / 2 + 16, Math.min(window.innerHeight - height / 2 - 16, clientY));
    promptEl.style.left = `${Math.round(left)}px`;
    promptEl.style.top = `${Math.round(top)}px`;
  };

  const show = (x, y) => {
    positionPrompt(x, y);
    promptEl.classList.add('is-visible');
    promptEl.setAttribute('aria-hidden', 'false');
  };

  const hide = () => {
    promptEl.classList.remove('is-visible');
    promptEl.setAttribute('aria-hidden', 'true');
  };

  hotspot.addEventListener('mouseenter', (e) => show(e.clientX, e.clientY));
  hotspot.addEventListener('mousemove', (e) => positionPrompt(e.clientX, e.clientY));
  hotspot.addEventListener('mouseleave', hide);

  // Keyboard accessibility
  hotspot.addEventListener('focus', () => {
    const rect = hotspot.getBoundingClientRect();
    show(rect.left + rect.width * 0.45, rect.top + rect.height * 0.35);
  });
  hotspot.addEventListener('blur', hide);
}

function initCursorAndParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (prefersReducedMotion || !isFinePointer) return;

  const aura = document.getElementById('cursor-aura');
  const dot = document.getElementById('cursor-dot');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;
  let visible = false;

  const hoverSelector = 'a, button, .domain-mini-card, .project-card, .character-hotspot';

  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible && aura && dot) {
        visible = true;
        aura.style.opacity = '1';
        dot.style.opacity = '1';
      }

      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    },
    { passive: true }
  );

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) {
      aura?.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) {
      aura?.classList.remove('is-hovering');
    }
  });

  const tick = () => {
    auraX += (mouseX - auraX) * 0.14;
    auraY += (mouseY - auraY) * 0.14;
    if (aura) {
      aura.style.left = `${auraX}px`;
      aura.style.top = `${auraY}px`;
    }
    window.requestAnimationFrame(tick);
  };
  tick();
}

export function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${-py * 3.5}deg) rotateY(${px * 3.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

export function initInteractions() {
  initEngineeringLab();
  initMagneticButtons();
  initCharacterPrompt();
  initCursorAndParallax();
}
