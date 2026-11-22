import { SITE_CONFIG } from './config.js';

/**
 * Contact Channels & Honest Form Handling
 * - Supports a real configured endpoint (e.g., Formspree / custom API)
 * - Falls back to a functional mailto: dispatch when an email is configured
 * - Never fakes a successful remote submission when neither is configured
 */
export function initContact(refreshIcons) {
  const channelsContainer = document.getElementById('contact-channels');
  const heroSocials = document.getElementById('hero-socials');
  const form = document.getElementById('contact-form');
  const modeLabel = document.getElementById('contact-mode-label');
  const hint = document.getElementById('contact-hint');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit');

  const email = (SITE_CONFIG.email || '').trim();
  const endpoint = (SITE_CONFIG.contactEndpoint || '').trim();
  const socials = SITE_CONFIG.socials || {};

  // Render hero social chips (only configured links)
  if (heroSocials) {
    const items = [];
    if (socials.github) {
      items.push(`<a href="${socials.github}" target="_blank" rel="noopener noreferrer" class="social-chip"><i data-lucide="github" aria-hidden="true"></i><span>GitHub</span></a>`);
    }
    if (socials.linkedin) {
      items.push(`<a href="${socials.linkedin}" target="_blank" rel="noopener noreferrer" class="social-chip"><i data-lucide="linkedin" aria-hidden="true"></i><span>LinkedIn</span></a>`);
    }
    if (socials.x) {
      items.push(`<a href="${socials.x}" target="_blank" rel="noopener noreferrer" class="social-chip"><i data-lucide="at-sign" aria-hidden="true"></i><span>X / Social</span></a>`);
    }
    if (email) {
      items.push(`<a href="mailto:${email}" class="social-chip"><i data-lucide="mail" aria-hidden="true"></i><span>Email</span></a>`);
    }
    if (!items.length) {
      items.push(`<a href="#contact" class="social-chip"><i data-lucide="terminal" aria-hidden="true"></i><span>Get in Touch</span></a>`);
    }
    heroSocials.innerHTML = items.join('');
  }

  // Render Contact Channels panel
  if (channelsContainer) {
    const channelCards = [
      {
        label: 'Direct Email',
        value: email ? 'Send an Email' : 'Email not configured',
        href: email ? `mailto:${email}` : null,
        icon: 'mail',
      },
      {
        label: 'GitHub',
        value: socials.github ? 'View GitHub Profile' : 'GitHub not configured',
        href: socials.github || null,
        icon: 'github',
      },
      {
        label: 'LinkedIn',
        value: socials.linkedin ? 'Connect on LinkedIn' : 'LinkedIn not configured',
        href: socials.linkedin || null,
        icon: 'linkedin',
      },
    ];

    channelsContainer.innerHTML = channelCards
      .map((ch) => {
        const inner = `
          <div class="channel-card__left">
            <div class="channel-card__icon"><i data-lucide="${ch.icon}" aria-hidden="true"></i></div>
            <div>
              <span class="channel-card__label">${ch.label}</span>
              <span class="channel-card__value">${ch.value}</span>
            </div>
          </div>
          <i data-lucide="${ch.href ? 'arrow-up-right' : 'settings'}" aria-hidden="true"></i>
        `;
        return ch.href
          ? `<a href="${ch.href}" ${ch.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="channel-card">${inner}</a>`
          : `<div class="channel-card">${inner}</div>`;
      })
      .join('');
  }

  refreshIcons?.();

  // Set form transport badge & hint honestly
  if (modeLabel && hint) {
    if (endpoint) {
      modeLabel.textContent = 'LIVE ENDPOINT';
      hint.textContent = 'Submissions are sent securely to your configured form endpoint.';
    } else if (email) {
      modeLabel.textContent = 'MAILTO FALLBACK';
      hint.textContent = 'Opens your default email client pre-filled with your message.';
    } else {
      modeLabel.textContent = 'DIRECT CONTACT';
      hint.textContent = 'Reach out via the direct channels on the left.';
    }
  }

  if (!form) return;

  const fields = {
    name: { input: document.getElementById('contact-name'), error: document.getElementById('error-name') },
    email: { input: document.getElementById('contact-email'), error: document.getElementById('error-email') },
    subject: { input: document.getElementById('contact-subject'), error: document.getElementById('error-subject') },
    message: { input: document.getElementById('contact-message'), error: document.getElementById('error-message') },
  };

  const setFieldError = (key, message) => {
    const field = fields[key];
    if (!field) return;
    field.input.classList.toggle('is-invalid', Boolean(message));
    field.error.textContent = message || '';
  };

  const showFeedback = (type, text) => {
    if (!feedback) return;
    feedback.hidden = false;
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.textContent = text;
  };

  const validate = () => {
    let valid = true;
    const nameVal = fields.name.input.value.trim();
    const emailVal = fields.email.input.value.trim();
    const subjectVal = fields.subject.input.value.trim();
    const messageVal = fields.message.input.value.trim();

    if (nameVal.length < 2) {
      setFieldError('name', 'Please enter your name (at least 2 characters).');
      valid = false;
    } else setFieldError('name', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setFieldError('email', 'Please enter a valid email address.');
      valid = false;
    } else setFieldError('email', '');

    if (subjectVal.length < 3) {
      setFieldError('subject', 'Please provide a brief subject.');
      valid = false;
    } else setFieldError('subject', '');

    if (messageVal.length < 10) {
      setFieldError('message', 'Please write at least 10 characters about your idea.');
      valid = false;
    } else setFieldError('message', '');

    return valid ? { name: nameVal, email: emailVal, subject: subjectVal, message: messageVal } : null;
  };

  Object.keys(fields).forEach((key) => {
    fields[key].input?.addEventListener('input', () => setFieldError(key, ''));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (feedback) feedback.hidden = true;

    const payload = validate();
    if (!payload) return;

    const labelEl = submitBtn?.querySelector('.btn__label');

    // Mode 1: Real configured HTTP endpoint (e.g. Formspree)
    if (endpoint) {
      try {
        if (submitBtn) submitBtn.disabled = true;
        if (labelEl) labelEl.textContent = 'TRANSMITTING...';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        form.reset();
        showFeedback('success', 'Message transmitted successfully. Thank you for reaching out — Hamdan will respond soon.');
      } catch (err) {
        showFeedback(
          'error',
          `Unable to deliver message right now (${err.message}). Please try again or reach out directly via email.`
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (labelEl) labelEl.textContent = 'TRANSMIT MESSAGE';
      }
      return;
    }

    // Mode 2: Functional mailto: fallback if email is configured
    if (email) {
      const subject = encodeURIComponent(`[GhosT'ers Solution] ${payload.subject}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      showFeedback(
        'success',
        `Your email client has been opened with a pre-filled draft to ${email}. Complete sending there to finish.`
      );
      return;
    }

    // Mode 3: Unconfigured fallback notice
    showFeedback(
      'error',
      'Direct form transmission is currently unavailable. Please use the email or social channels on the left.'
    );
  });
}
