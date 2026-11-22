import { SITE_CONFIG } from './config.js';
import { initCardTilt } from './interactions.js';

/**
 * Project Showcase & Detail Modal
 * Clearly distinguishes implemented/active workflows from architectural concepts
 * and never invents fake GitHub URLs or live deployments.
 */
const PROJECTS = [
  {
    id: 'shadowtrace',
    index: 'PROJECT 01',
    title: 'ShadowTrace',
    category: 'Digital Forensics & Cybersecurity',
    statusLabel: 'Learning Workflow // Active Build',
    isConcept: false,
    description:
      'A learning-focused digital-forensics and incident-reconstruction workflow. It imports permitted CSV logs, validates and normalizes records, builds chronological event views, detects documented suspicious patterns and exports explainable findings.',
    stack: ['Python', 'Flask', 'SQLite', 'HTML5', 'CSS3', 'JavaScript'],
    highlights: [
      'Permitted CSV log ingestion with schema validation and record normalization',
      'Chronological event timeline reconstruction stored in SQLite',
      'Rule-based detection of documented suspicious patterns with explainable exports',
    ],
    implementedScope: [
      'CSV log import, parsing, and normalization pipeline',
      'SQLite event storage & chronological timeline views',
      'Documented pattern detection & explainable report export',
    ],
    plannedScope: [
      'Expanded log-source format adapters for broader lab datasets',
      'Interactive correlation graph enhancements for multi-host timelines',
    ],
    mockup: {
      windowTitle: 'SHADOWTRACE // FORENSIC TIMELINE ENGINE',
      stats: [
        { label: 'INGEST PIPELINE', value: 'CSV -> SQLite', tone: 'cyan' },
        { label: 'TIMELINE VIEW', value: 'Chronological', tone: 'default' },
        { label: 'OUTPUT', value: 'Explainable', tone: 'violet' },
      ],
      rows: [
        { left: '01:14:08 UTC · AUTH_EVENT · Normalized', tag: 'VALIDATED', warn: false },
        { left: '01:14:42 UTC · PATTERN_RULE_04 · Matched', tag: 'FLAGGED', warn: true },
        { left: '01:15:10 UTC · REPORT_EXPORT · Ready', tag: 'EXPLAINABLE', warn: false },
      ],
      bars: [34, 52, 44, 88, 66, 48],
    },
  },
  {
    id: 'eduman',
    index: 'PROJECT 02',
    title: 'EduMan',
    category: 'Institution Management System',
    statusLabel: 'Software Concept // Architecture',
    isConcept: true,
    description:
      'A comprehensive institution management software concept focused on organizing academic and administrative workflows through a unified digital platform.',
    stack: ['Desktop / Web Architecture', 'Relational Database Design', 'UI/UX Workflow Modeling'],
    highlights: [
      'Unified administrative workspace for student records and class rosters',
      'Attendance tracking and fee/financial summary architecture',
      'Designed around clarity and low-friction daily school operations',
    ],
    implementedScope: [
      'Core institutional workflow architecture & module specifications',
      'Dashboard interface design covering students, attendance, and finance',
    ],
    plannedScope: [
      'Full production backend & role-based portal implementation',
      'Automated report card generation & parent/faculty notifications',
    ],
    mockup: {
      windowTitle: 'EDUMAN // INSTITUTION COMMAND CONCEPT',
      stats: [
        { label: 'DOMAIN', value: 'Academic Ops', tone: 'cyan' },
        { label: 'MODULES', value: 'Roster & Fees', tone: 'default' },
        { label: 'STAGE', value: 'Concept Spec', tone: 'violet' },
      ],
      rows: [
        { left: 'MODULE 01 · Student Directory & Profiles', tag: 'DESIGNED', warn: false },
        { left: 'MODULE 02 · Daily Attendance Matrix', tag: 'CONCEPT', warn: true },
        { left: 'MODULE 03 · Fee Ledger & Receipts', tag: 'CONCEPT', warn: true },
      ],
      bars: [58, 72, 64, 78, 82, 70],
    },
  },
  {
    id: 'pharma',
    index: 'PROJECT 03',
    title: 'Pharma',
    category: 'Inventory & Billing Management',
    statusLabel: 'Desktop Concept // Prototype',
    isConcept: true,
    description:
      'A desktop-based pharmacy management application concept designed around inventory management, billing workflows and business operations.',
    stack: ['Electron', 'Node.js', 'SQLite', 'HTML5', 'CSS3'],
    highlights: [
      'Offline-ready desktop pharmacy workspace powered by Electron & SQLite',
      'Structured medicine catalog, batch stock tracking, and reorder visibility',
      'Fast counter billing & invoicing workflow designed for daily operations',
    ],
    implementedScope: [
      'Desktop application architecture (Electron + Node.js + SQLite)',
      'Inventory, catalog, and billing workflow interface design',
    ],
    plannedScope: [
      'Barcode scanner integration & thermal receipt printing',
      'Expiry-alert automation and supplier purchase-order ledger',
    ],
    mockup: {
      windowTitle: 'PHARMA // DESKTOP INVENTORY & BILLING',
      stats: [
        { label: 'RUNTIME', value: 'Electron.js', tone: 'cyan' },
        { label: 'STORAGE', value: 'Local SQLite', tone: 'default' },
        { label: 'WORKFLOW', value: 'Stock + POS', tone: 'violet' },
      ],
      rows: [
        { left: 'CATALOG · Medicine Stock & Batch Lookup', tag: 'INVENTORY', warn: false },
        { left: 'POS · Fast Counter Billing & Invoice', tag: 'BILLING', warn: false },
        { left: 'ALERTS · Low-Stock & Expiry Monitoring', tag: 'PLANNED', warn: true },
      ],
      bars: [46, 62, 75, 68, 90, 60],
    },
  },
];

function renderMockup(mockup) {
  return `
    <div class="mockup-window" aria-hidden="true">
      <div class="mockup-window__bar">
        <div class="mockup-dots"><span></span><span></span><span></span></div>
        <span class="mockup-title">${mockup.windowTitle}</span>
      </div>
      <div class="mockup-body">
        <div class="mockup-stats">
          ${mockup.stats
            .map(
              (s) => `
            <div class="mockup-stat">
              <span class="mockup-stat__label">${s.label}</span>
              <span class="mockup-stat__val ${s.tone === 'cyan' ? 'mockup-stat__val--cyan' : s.tone === 'violet' ? 'mockup-stat__val--violet' : ''}">${s.value}</span>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="mockup-rows">
          ${mockup.rows
            .map(
              (r) => `
            <div class="mockup-row">
              <span>${r.left}</span>
              <span class="mockup-row__tag ${r.warn ? 'mockup-row__tag--warn' : ''}">${r.tag}</span>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="mockup-bars">
          ${mockup.bars.map((h) => `<span style="height:${h}%"></span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function initProjects(lenis, refreshIcons) {
  const container = document.getElementById('projects-showcase');
  const modal = document.getElementById('project-modal');
  const modalDialog = document.getElementById('modal-dialog');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalClosers = document.querySelectorAll('[data-close-modal]');

  if (!container) return;

  container.innerHTML = PROJECTS.map((project, idx) => {
    const links = SITE_CONFIG.projectLinks?.[project.id] || {};
    const reverseClass = idx % 2 === 1 ? 'project-card--reverse' : '';

    return `
      <article class="glass-panel project-card ${reverseClass} reveal-up">
        <div class="project-card__visual">
          ${renderMockup(project.mockup)}
        </div>

        <div class="project-card__content">
          <div class="project-card__meta">
            <span class="mono-label">${project.index} // ${project.category}</span>
            <span class="project-badge ${project.isConcept ? 'project-badge--concept' : ''}">${project.statusLabel}</span>
          </div>

          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__desc">${project.description}</p>

          <ul class="project-card__highlights">
            ${project.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>

          <div class="tech-pill-list">
            ${project.stack.map((tech) => `<span class="tech-pill">${tech}</span>`).join('')}
          </div>

          <div class="project-card__actions">
            <button type="button" class="btn btn--secondary btn--sm" data-open-project="${project.id}">
              <span>Inspect Architecture</span>
              <i data-lucide="expand" aria-hidden="true"></i>
            </button>
            ${
              links.github
                ? `<a href="${links.github}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm"><span>GitHub</span><i data-lucide="github" aria-hidden="true"></i></a>`
                : ''
            }
            ${
              links.demo
                ? `<a href="${links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm"><span>Live Demo</span><i data-lucide="external-link" aria-hidden="true"></i></a>`
                : ''
            }
          </div>
        </div>
      </article>
    `;
  }).join('');

  initCardTilt();
  refreshIcons?.();

  const setModalOpen = (open) => {
    if (!modal) return;
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('modal-open', open);
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
  };

  const openProjectModal = (projectId) => {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project || !modalBody) return;

    const links = SITE_CONFIG.projectLinks?.[project.id] || {};

    modalBody.innerHTML = `
      <div class="project-card__meta" style="margin-bottom:0.85rem;">
        <span class="mono-label">${project.index} // ${project.category}</span>
        <span class="project-badge ${project.isConcept ? 'project-badge--concept' : ''}">${project.statusLabel}</span>
      </div>
      <h3 id="modal-title" class="project-card__title">${project.title}</h3>
      <p class="project-card__desc">${project.description}</p>

      ${renderMockup(project.mockup)}

      <div class="modal__grid">
        <div class="modal__box">
          <h4>Core &amp; Implemented Scope</h4>
          <ul>
            ${project.implementedScope.map((item) => `<li>&bull; ${item}</li>`).join('')}
          </ul>
        </div>
        <div class="modal__box">
          <h4>Planned &amp; Exploration Scope</h4>
          <ul>
            ${project.plannedScope.map((item) => `<li>&bull; ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="tech-pill-list">
        ${project.stack.map((tech) => `<span class="tech-pill tech-pill--cyan">${tech}</span>`).join('')}
      </div>

      <div class="project-card__actions">
        ${
          links.github
            ? `<a href="${links.github}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm"><span>View Repository</span><i data-lucide="github" aria-hidden="true"></i></a>`
            : `<span class="mono-label">Private / Internal Build</span>`
        }
        ${
          links.demo
            ? `<a href="${links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm"><span>Open Live Demo</span><i data-lucide="external-link" aria-hidden="true"></i></a>`
            : ''
        }
      </div>
    `;

    refreshIcons?.();
    if (modalDialog) modalDialog.scrollTop = 0;
    setModalOpen(true);
  };

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-project]');
    if (!btn) return;
    openProjectModal(btn.dataset.openProject);
  });

  modalClose?.addEventListener('click', () => setModalOpen(false));
  modalClosers.forEach((el) => el.addEventListener('click', () => setModalOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      setModalOpen(false);
    }
  });
}
