/* =====================================================
   SCROLL FX  ·  scroll-fx.js   (no dependencies)
   -----------------------------------------------------
   A small, robust scroll-motion layer that runs on every
   page and coexists with the existing .reveal system
   (it never toggles .reveal/.in itself).

   Provides:
     1. Scroll-progress bar
     2. Parallax on decorative hero elements
     3. Count-up on stat / result numbers
     4. Cinematic word-mask headline reveal (above the fold)
     5. Cursor-tracked glow on cards

   Honours prefers-reduced-motion (skips all movement) and
   degrades gracefully if anything is missing.
   ===================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = !window.matchMedia('(hover: hover)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // ---------------------------------------------------
  // 1 · SCROLL PROGRESS BAR
  // ---------------------------------------------------
  function initProgress() {
    if (reduced) return;
    var bar = document.createElement('div');
    bar.className = 'sfx-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - window.innerHeight) || 1;
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.setProperty('--sfx-sp', p.toFixed(4));
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // ---------------------------------------------------
  // 1b · AMBIENT AURA  (inject soft glow into inner-page heroes)
  // ---------------------------------------------------
  function initAura() {
    Array.prototype.forEach.call(document.querySelectorAll('.page-hero, .post-hero'), function (hero) {
      if (hero.querySelector('.sfx-aura')) return;
      var aura = document.createElement('div');
      aura.className = 'sfx-aura';
      aura.setAttribute('aria-hidden', 'true');
      hero.insertBefore(aura, hero.firstChild);
    });
  }

  // ---------------------------------------------------
  // 2 · PARALLAX  (decorative-only, never content)
  // ---------------------------------------------------
  function initParallax() {
    if (reduced || isTouch) return;

    var items = [];
    function add(sel, speed) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        el.setAttribute('data-sfx-parallax', '');
        items.push({ el: el, speed: speed, base: 0 });
      });
    }
    // Inner-page hero ambient
    add('.page-hero .sfx-aura, .post-hero .sfx-aura', 0.18);
    // Home hero atmospherics
    add('.hero .cumulus.bg-tr', 0.12);
    add('.hero .cumulus.bg-bl', -0.08);
    add('.hero .cumulus.v1', 0.06);
    // Contact CTA blobs
    add('.contact-cta .blob.tl', 0.10);
    add('.contact-cta .blob.br', -0.10);

    if (!items.length) return;

    var ticking = false;
    function update() {
      var y = window.scrollY;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        it.el.style.transform = 'translate3d(0,' + (y * it.speed).toFixed(2) + 'px,0)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ---------------------------------------------------
  // 3 · COUNT-UP  (preserves surrounding markup like <em>)
  // ---------------------------------------------------
  function initCountUp() {
    var nums = document.querySelectorAll('.stat-card .num, .result-card .num, [data-count]');
    if (!nums.length) return;

    function prep(el) {
      if (el.dataset.sfxCup) return null;
      // Find the first numeric run in the element's HTML and wrap it.
      var html = el.innerHTML;
      var m = html.match(/\d[\d,]*(?:\.\d+)?/);
      if (!m) return null;
      var raw = m[0];
      var target = parseFloat(raw.replace(/,/g, ''));
      if (isNaN(target)) return null;
      var decimals = (raw.split('.')[1] || '').length;
      var grouped = raw.indexOf(',') !== -1;
      el.dataset.sfxCup = '1';
      el.innerHTML = html.slice(0, m.index) +
        '<span class="sfx-cup">' + raw + '</span>' +
        html.slice(m.index + raw.length);
      return {
        node: el.querySelector('.sfx-cup'),
        target: target,
        decimals: decimals,
        grouped: grouped
      };
    }

    function fmt(v, info) {
      var s = info.decimals ? v.toFixed(info.decimals) : String(Math.round(v));
      if (info.grouped && !info.decimals) {
        s = Math.round(v).toLocaleString();
      }
      return s;
    }

    function run(info) {
      if (reduced) { info.node.textContent = fmt(info.target, info); return; }
      var dur = 1500;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        info.node.textContent = fmt(info.target * eased, info);
        if (t < 1) requestAnimationFrame(step);
        else info.node.textContent = fmt(info.target, info);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nums, function (el) {
        var info = prep(el); if (info) run(info);
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var info = prep(e.target);
        if (info) run(info);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  }

  // ---------------------------------------------------
  // 4 · WORD-MASK HEADLINE REVEAL  (heroes, above the fold)
  // ---------------------------------------------------
  function splitWords(el) {
    // Rebuild children, wrapping each word in a masked line span.
    function build(node) {
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(node.childNodes, function (n) {
        if (n.nodeType === 3) { // text
          var parts = n.textContent.split(/(\s+)/);
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var line = document.createElement('span');
            line.className = 'sfx-line';
            var word = document.createElement('span');
            word.className = 'sfx-word';
            word.textContent = p;
            line.appendChild(word);
            frag.appendChild(line);
          });
        } else if (n.nodeType === 1) {
          if (n.tagName === 'BR') { frag.appendChild(n.cloneNode()); return; }
          var clone = n.cloneNode(false);
          clone.appendChild(build(n));
          frag.appendChild(clone);
        }
      });
      return frag;
    }
    var built = build(el);
    el.innerHTML = '';
    el.appendChild(built);
    return el.querySelectorAll('.sfx-word');
  }

  function initWordMask() {
    var headline = document.querySelector('.hero h1, .page-hero h1, .post-hero h1');
    if (!headline || headline.dataset.sfxWm) return;
    headline.dataset.sfxWm = '1';

    var words = splitWords(headline);
    headline.classList.add('sfx-wm');

    if (reduced) { headline.classList.add('sfx-in'); return; }

    // Stagger each word by tuning its transition-delay, then flip the class.
    Array.prototype.forEach.call(words, function (w, i) {
      w.style.transitionDelay = (i * 55) + 'ms';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { headline.classList.add('sfx-in'); });
    });
    // Clean up will-change once done
    setTimeout(function () {
      Array.prototype.forEach.call(words, function (w) { w.style.willChange = 'auto'; });
    }, 1600 + words.length * 55);
  }

  // ---------------------------------------------------
  // 5 · CURSOR-TRACKED GLOW ON CARDS
  // ---------------------------------------------------
  function initGlow() {
    if (reduced || isTouch) return;
    var cards = document.querySelectorAll(
      '.proj-card, .blog-card, .result-card, .svc-card, .skill-card, .stat-card, .np-card'
    );
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });
  }

  // ---------------------------------------------------
  // BOOT
  // ---------------------------------------------------
  ready(function () {
    try { initAura(); } catch (e) {}
    try { initWordMask(); } catch (e) {}
    try { initProgress(); } catch (e) {}
    try { initParallax(); } catch (e) {}
    try { initCountUp(); } catch (e) {}
    try { initGlow(); } catch (e) {}
  });
})();
