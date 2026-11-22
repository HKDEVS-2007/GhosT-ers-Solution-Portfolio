# GhosT'ers Solution — Hamdan Kaleem | The Digital Architect

An immersive, dark-futuristic 3D personal portfolio website for **Hamdan Kaleem**, operating under **GhosT'ers Solution** (*Expert Vibe Coder | Software Developer | Desktop Applications | Cybersecurity Enthusiast*).

---

## Tech Stack

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **3D & Motion:** Three.js, GSAP + ScrollTrigger, Lenis Smooth Scroll
- **Icons:** Lucide Icons
- **Bundler:** Vite

---

## Cinematic Video Asset Mapping

The three original videos in `Assets/videos/` are preserved untouched and mapped into `public/assets/videos/`:

| Section | Semantic Asset | Original Source File | Composition Notes |
| --- | --- | --- | --- |
| **01 — The Awakening (Hero)** | `public/assets/videos/awakening.mp4` | `gemini_generated_video_ef427dd9.mp4` (10s) | Cyber character positioned on the right with dark obsidian feathering on the left for crisp headline contrast. |
| **02 — The Identity (About)** | `public/assets/videos/identity.mp4` | `gemini_generated_video_1e49eec0.mp4` (10s) | Corridor journey toward the cyan portal, lazy-loaded and seamlessly blended behind glassmorphic editorial panels. |
| **03 — The Engineering (Expertise)** | `public/assets/videos/engineering.mp4` | `gemini_generated_video_16c7e3ef.mp4` (20s) | Automatically cued to the dedicated engineering-chamber segment (`10.5s–19.5s`) to avoid repeating the corridor walk from Video 02. |

---

## Configuration

All external URLs, contact delivery settings, and availability indicators are centralized in [`src/js/config.js`](src/js/config.js):

- `availability.enabled` & `availability.label` — controls the animated hero availability badge.
- `email` — direct contact email and `mailto:` fallback target.
- `contactEndpoint` — optional live form endpoint (e.g., Formspree URL). When set, the contact form submits asynchronously via `fetch()`.
- `socials.github`, `socials.linkedin`, `socials.x` — social links (only configured links are rendered).
- `projectLinks.shadowtrace`, `projectLinks.eduman`, `projectLinks.pharma` — optional GitHub repository and live demo URLs.

---

## Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Performance & Accessibility

- **Adaptive Three.js Renderer:** Automatically scales particle count and pixel ratio for mobile/lower-core devices and gracefully falls back if WebGL is unavailable.
- **Lazy Video Playback:** Uses `IntersectionObserver` to load non-hero videos only as they approach the viewport and pause offscreen videos.
- **Reduced Motion:** Honors `prefers-reduced-motion: reduce` by disabling animations, custom cursor tracking, Lenis momentum, and autoplay loops.
- **Semantic & Accessible:** Proper heading hierarchy, ARIA roles on interactive tabs/modals/drawers, skip-to-content link, and keyboard-accessible controls.
