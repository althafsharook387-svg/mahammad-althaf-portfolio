/* Mahammad Althaf — portfolio interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  var toggle = document.getElementById('themeToggle');
  try {
    var saved = localStorage.getItem('ma-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked — fall back to system theme */ }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ma-theme', next); } catch (e) {}
    });
  }

  /* ---------- sticky nav state ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = siblings.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 70 : 0) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active nav link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav__links a');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- count-up stats ---------- */
  var stats = document.querySelectorAll('.hero__stats strong[data-count]');
  var animate = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var divisor = Math.pow(10, decimals);
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased / divisor).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduced && 'IntersectionObserver' in window) {
    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        counter.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { counter.observe(el); });
  }


  /* ---------- split hero title into animatable words ---------- */
  var title = document.querySelector('[data-split]');
  if (title) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (chunk) {
            if (!chunk) return;
            if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
            var outer = document.createElement('span');
            outer.className = 'word';
            var inner = document.createElement('span');
            inner.textContent = chunk;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(title);
    var words = title.querySelectorAll('.word > span');
    words.forEach(function (w, i) { w.style.transitionDelay = (260 + i * 95) + 'ms'; });
  }

  /* ---------- entrance sequence ---------- */
  var start = function () {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    if (title) requestAnimationFrame(function () { title.classList.add('is-in'); });
  };
  if (document.readyState === 'complete') { requestAnimationFrame(start); }
  else { window.addEventListener('load', function () { requestAnimationFrame(start); }); }
  // safety net so the hero never stays hidden if `load` is slow or blocked
  setTimeout(start, 1800);

  /* ---------- scroll progress bar ---------- */
  var bar = document.querySelector('#progress span');
  if (bar) {
    var ticking = false;
    var paint = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- timeline rail draw ---------- */
  var rail = document.querySelector('.timeline__rail i');
  var timeline = document.querySelector('.timeline');
  if (rail && timeline && !reduced) {
    var drawing = false;
    var draw = function () {
      var r = timeline.getBoundingClientRect();
      var span = r.height + window.innerHeight * 0.5;
      var p = (window.innerHeight * 0.75 - r.top) / span;
      rail.style.transform = 'scaleY(' + Math.max(0, Math.min(p, 1)) + ')';
      drawing = false;
    };
    window.addEventListener('scroll', function () {
      if (!drawing) { drawing = true; requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
  }

  /* ---------- pointer-tracked glow + 3D tilt ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = el.classList.contains('card') ? 6 : 4;
      var raf = null;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var rx = ((y / r.height) - 0.5) * -2 * max;
          var ry = ((x / r.width) - 0.5) * 2 * max;
          el.classList.add('is-tilting');
          el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
          raf = null;
        });
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
      });
    });

    /* ---------- magnetic buttons ---------- */
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.28;
        var y = (e.clientY - r.top - r.height / 2) * 0.4;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    /* ---------- hero parallax ---------- */
    var par = document.querySelectorAll('[data-parallax]');
    if (par.length) {
      var pTick = false;
      var move = function () {
        par.forEach(function (el) {
          var rate = parseFloat(el.getAttribute('data-parallax')) || 0.05;
          el.style.setProperty('--py', (-window.scrollY * rate).toFixed(1) + 'px');
          if (el.classList.contains('is-in')) {
            el.style.transform = 'translateY(' + (-window.scrollY * rate).toFixed(1) + 'px)';
          }
        });
        pTick = false;
      };
      window.addEventListener('scroll', function () {
        if (!pTick) { pTick = true; requestAnimationFrame(move); }
      }, { passive: true });
    }
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
