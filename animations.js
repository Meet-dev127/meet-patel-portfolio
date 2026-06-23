/* =====================================================
   PREMIUM ANIMATION SYSTEM  —  meet patel portfolio
   GSAP + ScrollTrigger
   =====================================================

   Architecture:
   -------------
   1.  Word-mask helper (splitWords)  →  reusable cinematic
       headline reveal. Each word is wrapped in an overflow-
       hidden "line" so it can rise from below cleanly.

   2.  Hero opening timeline           →  layered intro:
         backdrop → eyebrow → headline → lede → trust →
         CTAs → preview card → pills → scroll indicator.
       Runs ONCE on load, ~2s total.

   3.  Scroll system                   →  one ScrollTrigger
       per logical section. Each section has its OWN motion
       (not a blanket fade-up):
         • section headers       — eyebrow + word-mask + lede
         • skill cards           — stagger lift + icon pop
         • featured project      — card lift + bar fills
         • project grid          — stagger
         • stats                 — number count-up
         • process               — line draw + step stagger
         • blog cards            — stagger
         • contact CTA           — header reveal + blob parallax

   4.  Parallax                       —  preview card, pills,
       backdrop clouds, contact blobs all scrub against the
       viewport at different rates for depth.

   5.  Hover micro-interactions       —  mouse-position glow
       on every card (radial highlight tracking cursor).

   Performance:
   ------------
   • Only transform + opacity → GPU-composited.
   • will-change applied minimally and removed after intro.
   • prefers-reduced-motion → entirely opts out.
   • Mobile (<720px) → shorter durations, less stagger,
     parallax disabled.
   • Safety net: if anything fails, the .js-anim CSS lock
     is forcibly released so the page is never blank.
   ===================================================== */

(function () {
  const root = document.documentElement;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hard safety net — release the CSS hide-lock no matter what.
  const release = () => root.classList.remove('js-anim');
  setTimeout(release, 4000);
  window.addEventListener('error', release);

  // Honour reduced-motion: just show everything, skip GSAP entirely.
  if (reduced || typeof gsap === 'undefined') {
    release();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // ----------------------------------------------------
  // WORD-MASK HELPER
  // Wraps each word in <span class="an-word-line"><span class="an-word">…
  // Preserves inline children (e.g. <em>, <br>).
  // ----------------------------------------------------
  function splitWords(el) {
    if (!el || el.dataset.split) return el ? el.querySelectorAll('.an-word') : [];
    el.dataset.split = '1';

    const buildFrag = (node) => {
      const frag = document.createDocumentFragment();
      node.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const parts = n.textContent.split(/(\s+)/);
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              const line = document.createElement('span');
              line.className = 'an-word-line';
              const word = document.createElement('span');
              word.className = 'an-word';
              word.textContent = p;
              line.appendChild(word);
              frag.appendChild(line);
            }
          });
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          if (n.tagName === 'BR') {
            frag.appendChild(n.cloneNode());
            return;
          }
          // Inline element (em, strong, a…). Recurse, preserve tag + attrs.
          const clone = n.cloneNode(false);
          clone.appendChild(buildFrag(n));
          frag.appendChild(clone);
        }
      });
      return frag;
    };

    const built = buildFrag(el);
    el.innerHTML = '';
    el.appendChild(built);
    return el.querySelectorAll('.an-word');
  }

  // ----------------------------------------------------
  // HERO OPENING TIMELINE
  // ----------------------------------------------------
  const intro = gsap.timeline({
    onStart: () => root.classList.add('intro-playing'),
    onComplete: () => {
      release();
      root.classList.remove('intro-playing');
      // Free up will-change after intro is done
      gsap.set(['.hero .an-word', '.preview-card', '.float-pill'], { willChange: 'auto' });
    },
  });

  // Nav drops in
  intro.to('.navbar', { opacity: 1, y: 0, duration: 0.6 }, 0)
       .fromTo('.navbar', { y: -16 }, { y: 0, duration: 0.7 }, 0);

  // Backdrop clouds breathe in
  intro.to('.hero .cumulus.bg-tr, .hero .cumulus.bg-bl', {
    opacity: 1,
    duration: 1.6,
    ease: 'power2.out',
  }, 0.05)
  .fromTo('.hero .cumulus.bg-tr', { scale: 0.92, xPercent: 4 }, { scale: 1, xPercent: 0, duration: 2.0, ease: 'power2.out' }, 0.05)
  .fromTo('.hero .cumulus.bg-bl', { scale: 0.92, xPercent: -4 }, { scale: 1, xPercent: 0, duration: 2.0, ease: 'power2.out' }, 0.05);

  intro.to('.hero .cumulus.v1', { opacity: 0.85, duration: 1.4 }, 0.15)
       .fromTo('.hero .cumulus.v1', { scale: 0.9 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.15);

  // Eyebrow
  intro.to('.hero .eyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0.4)
       .fromTo('.hero .eyebrow', { y: 12 }, { y: 0, duration: 0.6 }, 0.4);

  // Headline word-mask reveal
  const headline = document.querySelector('.hero h1');
  if (headline) {
    const words = splitWords(headline);
    intro.to(words, { opacity: 1, duration: 0.01 }, 0.5);
    intro.to(words, {
      y: '0%',
      duration: 1.05,
      stagger: isMobile ? 0.035 : 0.055,
      ease: 'expo.out',
    }, 0.5);
    // GSAP needs us to set the start translateY since CSS uses % units
    gsap.set(words, { yPercent: 110 });
  }

  // Lede
  intro.to('.hero .lede', { opacity: 1, duration: 0.7 }, 1.0)
       .fromTo('.hero .lede', { y: 16 }, { y: 0, duration: 0.8, ease: 'power3.out' }, 1.0);

  // Trust row staggered (children appear individually but stay container-aligned)
  intro.to('.hero .trust-row', { opacity: 1, duration: 0.01 }, 1.15);
  intro.from('.hero .trust-row > *:not(.sep)', {
    opacity: 0, y: 10, duration: 0.55, stagger: 0.06, ease: 'power3.out',
  }, 1.15);

  // CTAs
  intro.to('.hero .cta-row', { opacity: 1, duration: 0.01 }, 1.3);
  intro.from('.hero .cta-row .btn', {
    opacity: 0, y: 14, scale: 0.96, duration: 0.55,
    stagger: 0.08, ease: 'back.out(1.6)',
  }, 1.3);

  // Hero visual — preview card + pills (start a touch earlier so it feels parallel)
  intro.to('.preview-card', { opacity: 1, duration: 0.01 }, 0.7);
  intro.fromTo('.preview-card',
    { y: 40, scale: 0.96 },
    { y: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
    0.7
  );

  intro.to('.float-pill', { opacity: 1, duration: 0.01 }, 1.0);
  intro.from('.float-pill', {
    y: 12, scale: 0.9, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)',
  }, 1.0);

  // Animate the preview-card bars filling in
  const pcBars = gsap.utils.toArray('.preview-card .pc-bar');
  if (pcBars.length) {
    pcBars.forEach((bar) => { bar.dataset.h = bar.style.height || '60%'; bar.style.height = '0%'; });
    intro.to(pcBars, {
      height: (i, t) => t.dataset.h,
      duration: 0.9,
      stagger: 0.05,
      ease: 'power3.out',
    }, 1.1);
  }

  // Scroll indicator last
  intro.to('.scroll-indicator', { opacity: 1, duration: 0.7 }, 1.7);

  // ----------------------------------------------------
  // PARALLAX  (hero visual + backdrops)
  // ----------------------------------------------------
  if (!isMobile) {
    gsap.to('.preview-card', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('.float-pill.p1', {
      yPercent: -40, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
    gsap.to('.float-pill.p2', {
      yPercent: 24, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
    gsap.to('.float-pill.p3', {
      yPercent: -22, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
    gsap.to('.hero .cumulus.bg-tr', {
      yPercent: 15, xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.hero .cumulus.bg-bl', {
      yPercent: -10, xPercent: -4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  // ----------------------------------------------------
  // SECTION HEADER reveal pattern
  //   eyebrow rises → headline word-mask → lede fades
  // ----------------------------------------------------
  const startPct = isMobile ? '90%' : '82%';

  document.querySelectorAll('.section-header').forEach((header) => {
    const eyebrow = header.querySelector('.eyebrow');
    const heading = header.querySelector('h2, h3');
    const para = header.querySelector('p');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: header, start: `top ${startPct}`, once: true },
    });
    if (eyebrow) {
      tl.from(eyebrow, { y: 12, opacity: 0, duration: 0.55 });
    }
    if (heading) {
      const words = splitWords(heading);
      gsap.set(words, { yPercent: 110, opacity: 1 });
      tl.to(words, {
        yPercent: 0, duration: 0.95,
        stagger: isMobile ? 0.03 : 0.045,
        ease: 'expo.out',
      }, eyebrow ? '-=0.3' : 0);
    }
    if (para) {
      tl.from(para, { y: 14, opacity: 0, duration: 0.6 }, '-=0.5');
    }
  });

  // Also do word-mask on the About section's text-side h2
  const aboutH2 = document.querySelector('.about-text h2');
  if (aboutH2) {
    const aboutEyebrow = document.querySelector('.about-text .eyebrow');
    const aboutP = document.querySelector('.about-text p');
    const aboutCta = document.querySelector('.about-text .arrow-link');
    const words = splitWords(aboutH2);
    gsap.set(words, { yPercent: 110, opacity: 1 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.about-text', start: `top ${startPct}`, once: true },
    });
    if (aboutEyebrow) tl.from(aboutEyebrow, { y: 12, opacity: 0, duration: 0.55 });
    tl.to(words, { yPercent: 0, duration: 0.95, stagger: 0.045, ease: 'expo.out' }, '-=0.3');
    if (aboutP) tl.from(aboutP, { y: 14, opacity: 0, duration: 0.6 }, '-=0.5');
    if (aboutCta) tl.from(aboutCta, { y: 10, opacity: 0, duration: 0.5 }, '-=0.3');
  }

  // ----------------------------------------------------
  // STAT CARDS — staggered lift + count-up
  // ----------------------------------------------------
  gsap.utils.toArray('.stat-grid .stat-card').forEach((card, i) => {
    gsap.from(card, {
      y: 28, opacity: 0,
      duration: 0.75, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.stat-grid', start: `top ${startPct}`, once: true },
    });
  });

  gsap.utils.toArray('.stat-card .num, .contact-cta + * .num, .result-card .num').forEach((el) => {
    const text = (el.textContent || '').trim();
    const match = text.match(/(\d[\d,]*)/);
    if (!match) return;
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    if (isNaN(target) || target === 0) return;
    const prefix = text.slice(0, match.index);
    const suffix = text.slice(match.index + match[0].length);
    const fmt = target.toLocaleString().includes(',');
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        const n = Math.round(obj.v);
        el.textContent = prefix + (fmt ? n.toLocaleString() : n) + suffix;
      },
    });
  });

  // ----------------------------------------------------
  // TECH STRIP — items reveal in sequence
  // ----------------------------------------------------
  const techItems = gsap.utils.toArray('.trust-strip .tech-row > *');
  if (techItems.length) {
    gsap.from(techItems, {
      y: 10, opacity: 0,
      duration: 0.5,
      stagger: { amount: 0.6, from: 'start' },
      ease: 'power2.out',
      scrollTrigger: { trigger: '.trust-strip', start: 'top 92%', once: true },
    });
  }

  // ----------------------------------------------------
  // SKILL CARDS — card lift + icon pop
  // ----------------------------------------------------
  gsap.utils.toArray('.skills-grid .skill-card').forEach((card, i) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.skills-grid', start: `top ${startPct}`, once: true },
    });
    tl.from(card, {
      y: 36, opacity: 0,
      duration: 0.8, delay: i * (isMobile ? 0.06 : 0.09), ease: 'power3.out',
    }, 0);
    const icon = card.querySelector('.icon');
    if (icon) {
      tl.from(icon, {
        scale: 0.5, opacity: 0,
        duration: 0.6, delay: i * (isMobile ? 0.06 : 0.09) + 0.15, ease: 'back.out(2.2)',
      }, 0);
    }
    const tags = card.querySelectorAll('.tag');
    if (tags.length) {
      tl.from(tags, {
        opacity: 0, y: 6,
        duration: 0.4, stagger: 0.05, delay: i * (isMobile ? 0.06 : 0.09) + 0.3, ease: 'power2.out',
      }, 0);
    }
  });

  // ----------------------------------------------------
  // FEATURED PROJECT — card lift + bar fills + ATS score
  // ----------------------------------------------------
  const featured = document.querySelector('.featured-card');
  if (featured) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: featured, start: `top ${startPct}`, once: true },
    });
    tl.from(featured, { y: 44, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0);

    const bars = featured.querySelectorAll('.bar-fill');
    bars.forEach((bar) => {
      const w = bar.style.width || '70%';
      bar.dataset.w = w;
      bar.style.width = '0%';
    });
    tl.to(bars, {
      width: (i, t) => t.dataset.w,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power2.out',
    }, 0.4);

    // ATS dashoffset
    const atsArc = featured.querySelector('.ats-circle circle:nth-child(2)');
    if (atsArc) {
      const targetOffset = atsArc.getAttribute('stroke-dashoffset');
      atsArc.setAttribute('stroke-dashoffset', '150.8');
      tl.to(atsArc, {
        attr: { 'stroke-dashoffset': targetOffset },
        duration: 1.3,
        ease: 'power2.out',
      }, 0.4);
    }
    // ATS number count
    const atsNum = featured.querySelector('.ats-circle .num');
    if (atsNum) {
      const t = parseInt(atsNum.textContent.trim(), 10);
      if (!isNaN(t)) {
        const o = { v: 0 };
        atsNum.textContent = '0';
        tl.to(o, {
          v: t, duration: 1.3, ease: 'power2.out',
          onUpdate: () => { atsNum.textContent = Math.round(o.v); },
        }, 0.4);
      }
    }
  }

  // ----------------------------------------------------
  // PROJECT CARDS — 2x2 stagger
  // ----------------------------------------------------
  gsap.utils.toArray('.proj-grid .proj-card').forEach((card, i) => {
    gsap.from(card, {
      y: 40, opacity: 0,
      duration: 0.8,
      delay: i * (isMobile ? 0.06 : 0.1),
      ease: 'power3.out',
      scrollTrigger: { trigger: '.proj-grid', start: `top ${startPct}`, once: true },
    });
  });

  // ----------------------------------------------------
  // SERVICES — stagger with icon pop
  // ----------------------------------------------------
  gsap.utils.toArray('.svc-grid .svc-card').forEach((card, i) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.svc-grid', start: `top ${startPct}`, once: true },
    });
    tl.from(card, {
      y: 36, opacity: 0, duration: 0.8,
      delay: i * (isMobile ? 0.06 : 0.11), ease: 'power3.out',
    }, 0);
    const icon = card.querySelector('.icon');
    if (icon) {
      tl.from(icon, {
        scale: 0.5, opacity: 0, duration: 0.6,
        delay: i * (isMobile ? 0.06 : 0.11) + 0.15, ease: 'back.out(2.2)',
      }, 0);
    }
  });

  // ----------------------------------------------------
  // PROCESS — line draws, then dots pop, then text
  // ----------------------------------------------------
  const processLine = document.querySelector('.process-line');
  const processSteps = gsap.utils.toArray('.process-step');
  if (processLine || processSteps.length) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.process-wrap', start: `top ${startPct}`, once: true },
    });
    if (processLine) {
      gsap.set(processLine, { scaleX: 0, transformOrigin: 'left center' });
      tl.to(processLine, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0);
    }
    processSteps.forEach((step, i) => {
      const dot = step.querySelector('.dot');
      const num = step.querySelector('.num');
      const h3 = step.querySelector('h3');
      const p = step.querySelector('p');
      const t = 0.25 + i * 0.18;
      if (dot) tl.from(dot, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, t);
      step.classList.add('is-in');
      if (num) tl.from(num, { y: 8, opacity: 0, duration: 0.4 }, t + 0.1);
      if (h3) tl.from(h3, { y: 10, opacity: 0, duration: 0.5 }, t + 0.15);
      if (p) tl.from(p, { y: 10, opacity: 0, duration: 0.5 }, t + 0.2);
    });
  }

  // ----------------------------------------------------
  // BLOG CARDS — stagger with thumb scale-in
  // ----------------------------------------------------
  gsap.utils.toArray('.blog-grid .blog-card').forEach((card, i) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.blog-grid', start: `top ${startPct}`, once: true },
    });
    tl.from(card, {
      y: 36, opacity: 0, duration: 0.8,
      delay: i * (isMobile ? 0.06 : 0.1), ease: 'power3.out',
    }, 0);
    const thumb = card.querySelector('.blog-thumb');
    if (thumb) {
      tl.from(thumb, {
        scale: 1.06, opacity: 0, duration: 0.9,
        delay: i * (isMobile ? 0.06 : 0.1) + 0.05, ease: 'power3.out',
      }, 0);
    }
  });

  // ----------------------------------------------------
  // CONTACT CTA — header + buttons + parallax blobs
  // ----------------------------------------------------
  const contact = document.querySelector('.contact-cta');
  if (contact) {
    const eyebrow = contact.querySelector('.eyebrow');
    const h = contact.querySelector('h2');
    const p = contact.querySelector('p');
    const buttons = contact.querySelectorAll('.cta-row .btn');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: contact, start: `top ${startPct}`, once: true },
    });
    if (eyebrow) tl.from(eyebrow, { y: 12, opacity: 0, duration: 0.55 });
    if (h) {
      const words = splitWords(h);
      gsap.set(words, { yPercent: 110, opacity: 1 });
      tl.to(words, { yPercent: 0, duration: 0.95, stagger: 0.045, ease: 'expo.out' }, '-=0.3');
    }
    if (p) tl.from(p, { y: 14, opacity: 0, duration: 0.6 }, '-=0.5');
    if (buttons.length) {
      tl.from(buttons, {
        y: 12, opacity: 0, scale: 0.96,
        duration: 0.55, stagger: 0.08, ease: 'back.out(1.5)',
      }, '-=0.3');
    }

    if (!isMobile) {
      gsap.to('.contact-cta .blob.tl', {
        yPercent: -18, xPercent: 6, ease: 'none',
        scrollTrigger: { trigger: contact, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.contact-cta .blob.br', {
        yPercent: 14, xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: contact, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }
  }

  // ----------------------------------------------------
  // FOOTER — soft reveal
  // ----------------------------------------------------
  gsap.from('.footer .footer-grid > *', {
    y: 22, opacity: 0,
    duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true },
  });
  gsap.from('.footer-bottom', {
    y: 12, opacity: 0, duration: 0.6,
    scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', once: true },
  });

  // ----------------------------------------------------
  // HOVER GLOW — cursor-tracked radial spotlight on cards
  // ----------------------------------------------------
  const glowSel = '.proj-card, .featured-card, .blog-card, .svc-card, .skill-card, .stat-card';
  if (!isMobile && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll(glowSel).forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      }, { passive: true });
    });
  }

  // ----------------------------------------------------
  // SCROLL INDICATOR — hide once user scrolls
  // ----------------------------------------------------
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    ScrollTrigger.create({
      trigger: document.body,
      start: '120 top',
      onEnter: () => gsap.to(indicator, { opacity: 0, duration: 0.4, pointerEvents: 'none' }),
      onLeaveBack: () => gsap.to(indicator, { opacity: 1, duration: 0.5 }),
    });
  }

  // Final paint sync
  requestAnimationFrame(() => ScrollTrigger.refresh());
})();
