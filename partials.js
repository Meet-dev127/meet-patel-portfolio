/* Shared site chrome: nav + mobile menu, contact CTA, footer.
   Each page may set window.__currentPage to one of:
   'home' | 'projects' | 'blog' | 'about' | 'services' | 'contact'
   to flag the active link. */

(function () {
  const ROOT = (document.querySelector('meta[name="site-root"]') || {}).content || './';
  const link = (path) => ROOT + path;

  const NAV = `
    <header class="navbar" id="navbar" data-screen-label="Nav">
      <div class="nav-inner">
        <a href="${link('Portfolio Animated v2.html')}#top" class="brand" aria-label="Meet Patel, home">
          <span class="brand-mark" aria-hidden="true">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Base circle -->
              <circle cx="23" cy="23" r="23" fill="#0C1F18"/>
              <!-- Inner ring subtle -->
              <circle cx="23" cy="23" r="20.5" stroke="#1E3D2F" stroke-width="1"/>
              <!-- Wave-M form: smooth S-curve peaks reading as M initial -->
              <path d="M8 30C8 30 8 15 14 15C20 15 18 26 23 26C28 26 26 15 32 15C38 15 38 30 38 30"
                stroke="#34D399" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Peak accent dots -->
              <circle cx="14" cy="15" r="2.8" fill="#34D399"/>
              <circle cx="32" cy="15" r="2.8" fill="#34D399"/>
              <!-- Valley node (dimmer) -->
              <circle cx="23" cy="26" r="2.2" fill="#0E8A6B"/>
              <!-- Bottom baseline glow -->
              <line x1="8" y1="30" x2="38" y2="30" stroke="#1E3D2F" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="brand-text">
            <span class="name">Meet Patel</span>
            <span class="role">web dev · data analyst · azure certified</span>
          </span>
        </a>

        <nav aria-label="Primary">
          <ul class="nav-links">
            <li><a href="${link('about.html')}" data-nav="about">About</a></li>
            <li><a href="${link('projects/index.html')}" data-nav="projects">Projects</a></li>
            <li><a href="${link('blog/index.html')}" data-nav="blog">Blog</a></li>
            <li><a href="${link('services.html')}" data-nav="services">Services</a></li>
            <li><a href="${link('contact.html')}" data-nav="contact">Contact</a></li>
          </ul>
        </nav>

        <a href="${link('contact.html')}" class="nav-cta">Let's Talk</a>

        <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">
          <span></span>
        </button>
      </div>
    </header>

    <svg class="nav-wisp" viewBox="0 0 1440 24" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wispGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"  stop-color="#E2E5E8" stop-opacity="0"/>
          <stop offset="50%" stop-color="#E2E5E8" stop-opacity="1"/>
          <stop offset="100%" stop-color="#E2E5E8" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,8 C360,22 720,22 1080,14 C1260,10 1380,8 1440,10" stroke="url(#wispGrad)" stroke-width="1" fill="none" />
    </svg>

    <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
      <a href="${link('about.html')}">About</a>
      <a href="${link('projects/index.html')}">Projects</a>
      <a href="${link('blog/index.html')}">Blog</a>
      <a href="${link('services.html')}">Services</a>
      <a href="${link('contact.html')}">Contact</a>
      <a href="${link('contact.html')}" class="nav-cta">Let's Talk</a>
    </div>
  `;

  const CONTACT_CTA = `
    <section class="contact-cta" id="contact" data-screen-label="Contact">
      <div class="blob tl" aria-hidden="true"></div>
      <div class="blob br" aria-hidden="true"></div>

      <svg class="wisp-bg" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-50,310 C300,290 700,330 1100,300 C1300,285 1450,295 1490,300"
              stroke="rgba(74,144,196,0.18)" stroke-width="1" fill="none"/>
        <path d="M-50,260 C400,250 800,280 1200,250 C1350,240 1490,250 1490,255"
              stroke="rgba(74,144,196,0.12)" stroke-width="1" fill="none"/>
      </svg>

      <div class="container" style="position: relative; z-index: 2;">
        <span class="eyebrow">Let's Work Together</span>
        <h2>Have a <em>Project</em> in Mind?</h2>
        <p>
          Whether you need a web platform, an automation workflow,
          or a smarter dashboard, I build systems that work.
          Let's talk about what you need.
        </p>
        <div class="cta-row">
            <a href="mailto:patelmeet20112000@gmail.com" class="btn btn-light">Get In Touch</a>
          <a href="${link('contact.html')}" class="btn btn-ghost-light">Full Contact Page</a>
        </div>
      </div>
    </section>
  `;

  const FOOTER = `
    <footer class="footer" data-screen-label="Footer">
      <div class="footer-cta">
        <div class="container">
          <div class="footer-cta-inner">
            <div class="footer-cta-text">
              <p class="footer-cta-eyebrow">Open to opportunities</p>
              <h2 class="footer-cta-headline">Let's build something.</h2>
            </div>
            <a href="mailto:patelmeet20112000@gmail.com" class="footer-cta-btn">
              Send a message
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="footer-rule"></div>
        <div class="footer-grid">
          <div class="footer-col footer-col-brand">
            <a href="${link('Portfolio Animated v2.html')}#top" class="footer-wordmark">Meet Patel</a>
            <p class="footer-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Saint John, NB · Canada
            </p>
            <div class="footer-socials">
              <a href="https://github.com/" rel="noopener" target="_blank" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.74-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.17a11 11 0 0 1 5.78 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.17v3.22c0 .31.21.66.8.55C20.21 21.4 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/meet-patel-a483501b4/" rel="noopener" target="_blank" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.23 0z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
            <span class="footer-avail">
              <span class="footer-dot" aria-hidden="true"></span>
              Available for projects
            </span>
          </div>
          <div class="footer-col">
            <span class="footer-col-label">Explore</span>
            <ul>
              <li><a href="${link('Portfolio Animated v2.html')}">Home</a></li>
              <li><a href="${link('about.html')}">About</a></li>
              <li><a href="${link('projects/index.html')}">Projects</a></li>
              <li><a href="${link('blog/index.html')}">Blog</a></li>
              <li><a href="${link('services.html')}">Services</a></li>
              <li><a href="${link('contact.html')}">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <span class="footer-col-label">Credentials</span>
            <ul class="footer-creds">
              <li><span class="cred-name">Azure Fundamentals</span><code class="cred-code">AZ-900</code></li>
              <li><span class="cred-name">Azure Data</span><code class="cred-code">DP-900</code></li>
              <li><span class="cred-name">Azure AI</span><code class="cred-code">AI-900</code></li>
              <li><span class="cred-name">Azure Architect Expert</span><code class="cred-code">AZ-305</code></li>
              <li><span class="cred-name">IBM Cloud</span><code class="cred-code">Essentials</code></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Meet Patel</span>
          <span class="footer-tech">Hand-coded · Hosted on Azure</span>
        </div>
      </div>
    </footer>
  `;

    function mount(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.outerHTML = html;
  }

  function init() {
    // Inject chrome
    mount('#site-nav', NAV);
    mount('#site-cta', CONTACT_CTA);
    mount('#site-footer', FOOTER);

    // Active nav link
    const active = window.__currentPage;
    if (active) {
      document.querySelectorAll('[data-nav="' + active + '"]').forEach(a => {
        a.style.color = 'var(--cloud-sky)';
        a.setAttribute('aria-current', 'page');
      });
    }

    // Scroll state
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
      if (window.scrollY > 60) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    const toggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('mobileMenu');
    toggle.addEventListener('click', () => {
      const open = overlay.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        overlay.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Reveal on scroll
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const groups = new Map();
      reveals.forEach(el => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });
      groups.forEach(list => list.forEach((el, i) => el.dataset.stagger = i));

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = parseInt(e.target.dataset.stagger || '0', 10);
            e.target.style.transitionDelay = (i * 100) + 'ms';
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(el => io.observe(el));
    }

    // Safety net: ensure reveals become visible even if IO never fires
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
      }, 600);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
