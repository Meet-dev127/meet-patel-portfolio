/* =====================================================
   ABOUT · FX  ·  about-fx.js   (no dependencies)
   Page-specific interactions for the About page:
     1. Sticky "journey" scrub — active step drives the pinned panel
     2. Section ghost-index + hero wordmark parallax
     3. Magnetic primary buttons (hover devices)
     4. Certification modal
   Respects prefers-reduced-motion. Degrades gracefully.
   ===================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = !window.matchMedia('(hover: hover)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // ---------------------------------------------------
  // 1 · STICKY JOURNEY SCRUB
  // ---------------------------------------------------
  function initJourney() {
    var section = document.querySelector('[data-journey]');
    if (!section) return;
    var steps = Array.prototype.slice.call(section.querySelectorAll('.ax-step'));
    if (!steps.length) return;

    var codeEl  = section.querySelector('.ax-pin-code');
    var placeEl = section.querySelector('.ax-pin-place');
    var yearsEl = section.querySelector('.ax-pin-years');
    var fillEl  = section.querySelector('.ax-pin-fill');
    var curEl   = section.querySelector('.ax-pin-cur');
    var totalEl = section.querySelector('.ax-pin-total');
    var total   = steps.length;
    var active  = -1;

    if (totalEl) totalEl.textContent = ('0' + total).slice(-2);

    function setActive(idx) {
      if (idx === active) return;
      active = idx;
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      var s = steps[idx];
      if (codeEl)  codeEl.textContent  = s.getAttribute('data-code')  || '';
      if (placeEl) placeEl.textContent = s.getAttribute('data-place') || '';
      if (yearsEl) yearsEl.textContent = s.getAttribute('data-years') || '';
      if (curEl)   curEl.textContent   = ('0' + (idx + 1)).slice(-2);
    }

    var ticking = false;
    function measure() {
      ticking = false;
      // reading line sits ~42% down the viewport
      var line = window.innerHeight * 0.42;
      var idx = 0;
      for (var i = 0; i < steps.length; i++) {
        if (steps[i].getBoundingClientRect().top <= line) idx = i;
        else break;
      }
      setActive(idx);

      // continuous progress fill across the whole step list
      if (fillEl) {
        var first = steps[0].getBoundingClientRect();
        var last  = steps[steps.length - 1].getBoundingClientRect();
        var span  = (last.top - first.top) || 1;
        var p = (line - first.top) / span;
        p = Math.max(0, Math.min(1, p));
        fillEl.style.width = (p * 100).toFixed(1) + '%';
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }

    setActive(0);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();
  }

  // ---------------------------------------------------
  // 2 · PARALLAX  (ghost indices + hero wordmark)
  // ---------------------------------------------------
  function initParallax() {
    if (reduced || isTouch) return;
    var items = [];
    Array.prototype.forEach.call(document.querySelectorAll('[data-ax-parallax]'), function (el) {
      items.push({ el: el, speed: parseFloat(el.getAttribute('data-ax-parallax')) || 0.1 });
    });
    if (!items.length) return;

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var delta = (center - vh / 2) * it.speed;
        it.el.style.transform = 'translate3d(0,' + (-delta).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // ---------------------------------------------------
  // 3 · MAGNETIC BUTTONS
  // ---------------------------------------------------
  function initMagnetic() {
    if (reduced || isTouch) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (btn) {
      var strength = 0.34;
      btn.style.transition = 'transform 220ms cubic-bezier(0.16,1,0.3,1)';
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * strength;
        var y = (e.clientY - (r.top + r.height / 2)) * strength;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = 'translate(0,0)'; });
    });
  }

  // ---------------------------------------------------
  // 4 · CERTIFICATION MODAL
  // ---------------------------------------------------
  function initCertModal() {
    var overlay = document.getElementById('certModal');
    if (!overlay) return;

    var certs = {
      az305: { code:'MICROSOFT · AZ-305', name:'Azure Solutions Architect Expert', issuer:'Microsoft Certified', date:'July 27, 2023', score:'720 / 700', candidateId:'MS0995470863', image:((window.__resources&&window.__resources.certAz305)||'assets/cert-az305.jpg'), verifyUrl:'https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/', iconBg:'rgba(0,120,212,0.12)', iconColor:'#0078D4', iconType:'cloud' },
      ai900: { code:'MICROSOFT · AI-900', name:'Azure AI Fundamentals', issuer:'Microsoft Certified', date:'2023', score:'Pass', candidateId:'MS0995470863', image:null, verifyUrl:'https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/', iconBg:'rgba(0,120,212,0.12)', iconColor:'#0078D4', iconType:'cloud' },
      dp900: { code:'MICROSOFT · DP-900', name:'Azure Data Fundamentals', issuer:'Microsoft Certified', date:'2023', score:'Pass', candidateId:'MS0995470863', image:null, verifyUrl:'https://learn.microsoft.com/en-us/certifications/azure-data-fundamentals/', iconBg:'rgba(0,120,212,0.12)', iconColor:'#0078D4', iconType:'cloud' },
      az900: { code:'MICROSOFT · AZ-900', name:'Azure Fundamentals', issuer:'Microsoft Certified', date:'2022', score:'Pass', candidateId:'MS0995470863', image:null, verifyUrl:'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/', iconBg:'rgba(0,120,212,0.12)', iconColor:'#0078D4', iconType:'cloud' },
      ibm:   { code:'IBM', name:'IBM Cloud Essentials', issuer:'IBM', date:'2022', score:'Pass', candidateId:'', image:null, verifyUrl:'https://www.ibm.com/training/badge/cloud-essentials', iconBg:'rgba(30,78,162,0.12)', iconColor:'#1E4EA2', iconType:'doc' },
      github:{ code:'GITHUB', name:'GitHub for Data Scientists', issuer:'GitHub', date:'2023', score:'Pass', candidateId:'', image:null, verifyUrl:'https://training.github.com/', iconBg:'rgba(36,41,47,0.11)', iconColor:'#24292F', iconType:'sun' }
    };
    var svgs = {
      cloud: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 1 1 .8-7.9A6 6 0 0 1 18 11a3.5 3.5 0 0 1 0 7H7z"/></svg>',
      doc:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>',
      sun:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>'
    };

    function openModal(id) {
      var c = certs[id]; if (!c) return;
      var icon = document.getElementById('certModalIcon');
      icon.style.background = c.iconBg; icon.style.color = c.iconColor;
      icon.innerHTML = svgs[c.iconType];
      document.getElementById('certModalCode').textContent = c.code;
      document.getElementById('certModalName').textContent = c.name;
      document.getElementById('certModalIssuer').textContent = c.issuer;
      document.getElementById('certModalVerify').href = c.verifyUrl;
      var proof = document.getElementById('certModalProof');
      proof.innerHTML = c.image
        ? '<img src="' + c.image + '" alt="' + c.name + ' certificate proof" class="cert-modal-proof-img" loading="lazy">'
        : '<div class="cert-modal-no-proof"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity:.3;display:block;margin:0 auto 12px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>Certificate image not uploaded yet.<br>Use "Verify Credential" below to confirm this certification on the issuer site.</div>';
      var meta = '<div class="cert-modal-meta-item"><div class="cert-modal-meta-label">Issued</div><div class="cert-modal-meta-value">' + c.date + '</div></div>';
      meta += '<div class="cert-modal-meta-item"><div class="cert-modal-meta-label">Result</div><div class="cert-modal-meta-value">' + c.score + '</div></div>';
      if (c.candidateId) {
        meta += '<div class="cert-modal-meta-item"><div class="cert-modal-meta-label">Candidate ID</div><div class="cert-modal-meta-value">' + c.candidateId + '</div></div>';
        meta += '<div class="cert-modal-meta-item"><div class="cert-modal-meta-label">Issuer</div><div class="cert-modal-meta-value">' + c.issuer + '</div></div>';
      }
      document.getElementById('certModalMeta').innerHTML = meta;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() { overlay.classList.remove('open'); document.body.style.overflow = ''; }

    document.querySelectorAll('.cert-card[data-cert]').forEach(function (card) {
      card.addEventListener('click', function () { openModal(card.dataset.cert); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.cert); } });
    });
    document.getElementById('certModalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  // ---------------------------------------------------
  // 5 · BACK TO TOP
  // ---------------------------------------------------
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ---------------------------------------------------
  // BOOT
  // ---------------------------------------------------
  ready(function () {
    try { initJourney(); } catch (e) {}
    try { initParallax(); } catch (e) {}
    try { initMagnetic(); } catch (e) {}
    try { initCertModal(); } catch (e) {}
    try { initBackToTop(); } catch (e) {}
  });
})();
