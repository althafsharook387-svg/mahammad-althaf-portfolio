/* Mahammad Althaf — portfolio interactions
   Plain ES5-compatible DOM work, no dependencies. Every motion path is
   guarded by prefers-reduced-motion and by feature detection. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- theme ---------- */
  try {
    var saved = localStorage.getItem('ma-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked — fall back to system preference */ }

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      // dark is the brand default, so an unset theme is dark
      var current = root.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ma-theme', next); } catch (e) {}
    });
  }

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var closeMenu = function () {
    if (!links) return;
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  };
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- split the hero name into animatable words ---------- */
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
        } else if (child.nodeType === 1) { walk(child); }
      });
    };
    walk(title);
    Array.prototype.forEach.call(title.querySelectorAll('.word > span'), function (w, i) {
      w.style.transitionDelay = (230 + i * 95) + 'ms';
    });
  }

  /* ---------- entrance ---------- */
  var started = false;
  var start = function () {
    if (started) return;
    started = true;
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    if (title) requestAnimationFrame(function () { title.classList.add('is-in'); });
  };
  if (document.readyState === 'complete') requestAnimationFrame(start);
  else window.addEventListener('load', function () { requestAnimationFrame(start); });
  setTimeout(start, 1800);   // never leave the hero hidden

  /* ---------- scroll progress ---------- */
  var bar = document.querySelector('#progress span');
  if (bar) {
    var pTick = false;
    var paint = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
      pTick = false;
    };
    window.addEventListener('scroll', function () {
      if (!pTick) { pTick = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal, .bar, .corr__row, .flow__step, .demo, .wave');
  if (reduced || !hasIO) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) {
          return n.className && String(n.className).indexOf(el.className.split(' ')[0]) > -1;
        });
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 70 : 0) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---------- active nav link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav__links a');
  if (hasIO && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        Array.prototype.forEach.call(navLinks, function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(sections, function (s) { spy.observe(s); });
  }

  /* ---------- count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var animate = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var divisor = Math.pow(10, decimals);
    var t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 1150, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased / divisor).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduced && hasIO) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { counterIO.observe(el); });
  }

  /* ---------- experience rail ---------- */
  var rail = document.querySelector('.tl__rail i');
  var tl = document.querySelector('.tl');
  if (rail && tl && !reduced) {
    var rTick = false;
    var draw = function () {
      var r = tl.getBoundingClientRect();
      var span = r.height + window.innerHeight * 0.5;
      var p = (window.innerHeight * 0.75 - r.top) / span;
      rail.style.transform = 'scaleY(' + Math.max(0, Math.min(p, 1)) + ')';
      rTick = false;
    };
    window.addEventListener('scroll', function () {
      if (!rTick) { rTick = true; requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
  }

  /* ---------- map routes draw when the map enters view ---------- */
  var routes = document.querySelectorAll('.route');
  if (routes.length) {
    Array.prototype.forEach.call(routes, function (path) {
      var len = 900;
      try { len = Math.ceil(path.getTotalLength()); } catch (e) {}
      path.style.setProperty('--len', len);
    });
    if (reduced || !hasIO) {
      Array.prototype.forEach.call(routes, function (p) { p.style.strokeDashoffset = '0'; });
    } else {
      var mapIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          Array.prototype.forEach.call(routes, function (p, i) {
            p.style.animationDelay = (i * 90) + 'ms';
            p.classList.add('is-drawn');
          });
          mapIO.disconnect();
        });
      }, { threshold: 0.25 });
      var mapEl = document.querySelector('.map');
      if (mapEl) mapIO.observe(mapEl);
    }
  }

  /* ---------- centre the scrollable map on India ---------- */
  var mapBox = document.querySelector('.map__scroll');
  if (mapBox) {
    var centreMap = function () {
      if (mapBox.scrollWidth <= mapBox.clientWidth) return;
      var base = mapBox.querySelector('.node--base circle');
      var svg = mapBox.querySelector('svg');
      if (!base || !svg) return;
      var ratio = svg.getBoundingClientRect().width / 1000;   // viewBox is 1000 wide
      var target = 754 * ratio - mapBox.clientWidth / 2;      // India sits at x=754
      mapBox.scrollLeft = Math.max(0, target);
    };
    centreMap();
    window.addEventListener('resize', centreMap);
    window.addEventListener('load', centreMap);
  }

  /* ---------- hero globe: draw the arcs, pop the nodes ---------- */
  var globe = document.querySelector('.globe');
  if (globe) {
    var garcs = globe.querySelectorAll('.garc');
    Array.prototype.forEach.call(garcs, function (path) {
      var len = 420;
      try { len = Math.ceil(path.getTotalLength()); } catch (e) {}
      path.style.setProperty('--glen', len);
    });
    var liveGlobe = function () {
      globe.classList.add('is-live');
      Array.prototype.forEach.call(garcs, function (p, i) {
        p.style.animationDelay = (250 + i * 130) + 'ms';
        p.classList.add('is-drawn');
      });
    };
    if (reduced) { globe.classList.add('is-live'); }
    else { setTimeout(liveGlobe, 450); }
  }

  /* ---------- AI wave ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.wv'), function (path) {
    var len = 900;
    try { len = Math.ceil(path.getTotalLength()); } catch (e) {}
    path.style.setProperty('--wlen', len);
  });

  /* ---------- floating particles ---------- */
  var field = document.getElementById('particles');
  if (field && !reduced) {
    var n = window.innerWidth < 720 ? 10 : 20;
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;' +
              'top:' + (55 + Math.random() * 45).toFixed(1) + '%;' +
              'animation-duration:' + (11 + Math.random() * 13).toFixed(1) + 's;' +
              'animation-delay:-' + (Math.random() * 18).toFixed(1) + 's"></i>';
    }
    field.innerHTML = html;
  }

  /* ---------- tooltip for chart marks ---------- */
  var tip = document.getElementById('tip');
  var tipped = document.querySelectorAll('[data-tip]');
  if (tip && tipped.length && finePointer) {
    var place = function (e) {
      var pad = 14;
      var x = e.clientX + pad, y = e.clientY + pad;
      var w = tip.offsetWidth, h = tip.offsetHeight;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - pad;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    };
    Array.prototype.forEach.call(tipped, function (el) {
      el.addEventListener('pointerenter', function (e) {
        tip.textContent = el.getAttribute('data-tip');
        tip.classList.add('is-on');
        place(e);
      });
      el.addEventListener('pointermove', place);
      el.addEventListener('pointerleave', function () { tip.classList.remove('is-on'); });
    });
  }

  /* ---------- pointer glow, tilt, magnetic buttons, parallax ---------- */
  if (finePointer && !reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tilt]'), function (el) {
      var max = 5, raf = null;
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

    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.26;
        var y = (e.clientY - r.top - r.height / 2) * 0.38;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    var par = document.querySelectorAll('[data-parallax]');
    if (par.length) {
      var parTick = false;
      var move = function () {
        Array.prototype.forEach.call(par, function (el) {
          var rate = parseFloat(el.getAttribute('data-parallax')) || 0.05;
          el.style.transform = 'translateY(' + (-window.scrollY * rate).toFixed(1) + 'px)';
        });
        parTick = false;
      };
      window.addEventListener('scroll', function () {
        if (!parTick) { parTick = true; requestAnimationFrame(move); }
      }, { passive: true });
    }
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
