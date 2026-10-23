const header = document.querySelector('.site-header');

if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});

const trackedReplayEvents = new WeakSet();

if (!window.__rallyReplayTrackingBound) {
  window.__rallyReplayTrackingBound = true;
  document.querySelectorAll('[data-replay-cta]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (trackedReplayEvents.has(event)) return;
      trackedReplayEvents.add(event);

      const detail = {
        event: 'replay_cta_click',
        page_path: window.location.pathname,
        cta_location: link.dataset.ctaLocation || 'unknown',
        link_url: link.href,
        match_name: link.dataset.matchName || '신유빈 vs 하시모토 호노카'
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(detail);

      window.dispatchEvent(new CustomEvent('replay_cta_click', { detail }));
    });
  });
}
