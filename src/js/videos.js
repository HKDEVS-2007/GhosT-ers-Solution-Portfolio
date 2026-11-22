/**
 * Cinematic Video Asset Controller
 * - Lazy-loads non-hero videos via IntersectionObserver
 * - Plays videos only when in viewport to preserve GPU/battery
 * - Cues Video 03 (engineering.mp4) to its dedicated engineering-chamber segment
 *   (10.5s–19.5s) so it never repeats the corridor walk from Video 02
 * - Respects prefers-reduced-motion
 */
export function initVideos() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = document.querySelectorAll('video[data-video-role]');

  if (!videos.length) return;

  const hydrateSource = (video) => {
    const sources = video.querySelectorAll('source[data-src]');
    if (!sources.length) return false;
    sources.forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
    return true;
  };

  const configureSegmentLoop = (video) => {
    const startTime = parseFloat(video.dataset.startTime || '0');
    const endTime = parseFloat(video.dataset.endTime || '0');
    if (!startTime && !endTime) return;

    const jumpToStart = () => {
      if (video.readyState >= 1 && video.currentTime < startTime) {
        try {
          video.currentTime = startTime;
        } catch {
          // Ignore seek errors before metadata stabilizes
        }
      }
    };

    video.addEventListener('loadedmetadata', jumpToStart);
    video.addEventListener('canplay', jumpToStart);
    video.addEventListener('timeupdate', () => {
      if (endTime > startTime && video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
    });
  };

  videos.forEach((video) => {
    video.muted = true;
    configureSegmentLoop(video);

    if (video.dataset.videoRole === 'awakening') {
      const heroMedia = video.closest('.hero-media');
      video.addEventListener('ended', () => {
        video.pause();
        if (!prefersReducedMotion) {
          heroMedia?.classList.add('is-glitching');
        }
      });
    }

    if (prefersReducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
    }
  });

  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.hasAttribute('data-lazy-video')) {
            hydrateSource(video);
            video.removeAttribute('data-lazy-video');
          }
          const startTime = parseFloat(video.dataset.startTime || '0');
          if (startTime > 0 && video.currentTime < startTime && video.readyState >= 1) {
            video.currentTime = startTime;
          }
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              // Autoplay blocked by browser policy; graceful static frame fallback
            });
          }
        } else {
          video.pause();
        }
      });
    },
    {
      rootMargin: '220px 0px',
      threshold: 0.08,
    }
  );

  videos.forEach((video) => observer.observe(video));
}
