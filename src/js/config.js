/**
 * GHOS T'ERS SOLUTION — CENTRAL CONFIGURATION
 * ---------------------------------------------------------------------------
 * Update these values with your real email, social URLs, project links,
 * and optional Formspree / custom contact endpoint before deploying.
 *
 * No URLs or credentials are invented or hardcoded elsewhere in the app.
 */
export const SITE_CONFIG = {
  brand: "GhosT'ers Solution",
  owner: 'Hamdan Kaleem',

  // Set enabled: true and customize label to show the live availability pill in the hero.
  availability: {
    enabled: true,
    label: 'Open to Software & Desktop Collaborations',
  },

  // Real contact email (leave empty string '' if you prefer not to display one yet)
  email: 'hamdankaleem2007@gmail.com',

  // Optional real form endpoint (e.g., Formspree: 'https://formspree.io/f/your-id').
  // When empty, the contact form cleanly falls back to a functional mailto: dispatch
  // if `email` is configured, or displays clear setup guidance.
  contactEndpoint: '',

  // Real social links — only populated URLs are rendered as active links.
  socials: {
    github: 'https://github.com/HKDEVS-2007',
    linkedin: 'https://www.linkedin.com/in/ghost-ers-solutions-b651443b7?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    x: '',
  },

  // Optional real repository / live demo links for each project.
  // Leave empty until published — never invent fake links.
  projectLinks: {
    shadowtrace: {
      github: '',
      demo: '',
    },
    eduman: {
      github: '',
      demo: '',
    },
    pharma: {
      github: '',
      demo: '',
    },
  },
};
