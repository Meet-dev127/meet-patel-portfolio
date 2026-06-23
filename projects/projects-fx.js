/* =====================================================
   PROJECTS · FX  ·  projects-fx.js
   Category filter with live count + re-stagger.
   Shared motion (parallax / magnetic / back-to-top) is
   handled by about-fx.js, also linked on this page.
   ===================================================== */
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.ax-filter'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-cat]'));
    var countEl = document.querySelector('.ax-count b');

    function apply(filter) {
      var shown = 0;
      cards.forEach(function (c) {
        var cats = (c.getAttribute('data-cat') || '').split(/\s+/);
        var show = (filter === 'all' || cats.indexOf(filter) !== -1);
        c.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (countEl) countEl.textContent = shown;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        apply(btn.getAttribute('data-filter'));
      });
    });
  });
})();
