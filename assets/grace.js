/* Grace Cricket: bat comparison, fit quiz, product gallery and variant price. */
(function () {
  var FILLS = ['#0B54CE', '#0B0F2B', '#6B77A0'];

  /* Shown only while the store has no products, so the section previews properly. */
  var SAMPLE = [
    { title: 'The Gracer', weight: '2lb 9oz', pickup: 'light|balanced', sweet: 'mid', willow: 'Hand-selected English', handle: "Pete's signature shape" },
    { title: 'Tour Edition', weight: '2lb 8oz', pickup: 'light', sweet: 'low', willow: 'Hand-selected English', handle: "Pete's signature shape" },
    { title: 'Grace Full', weight: '2lb 10oz', pickup: 'balanced|heavy', sweet: 'mid|high', willow: 'Hand-selected English', handle: "Pete's signature shape" }
  ];

  function setScale(col, key, value) {
    var scale = col.querySelector('.scale[data-k="' + key + '"]');
    if (!scale) return;
    var on = String(value || '').toLowerCase();
    var segs = scale.querySelectorAll('.scale__seg');
    var labels = scale.nextElementSibling ? scale.nextElementSibling.querySelectorAll('span') : [];
    Array.prototype.forEach.call(labels, function (label, i) {
      var hit = on.indexOf(label.getAttribute('data-v')) !== -1;
      label.classList.toggle('on', hit);
      if (segs[i]) segs[i].classList.toggle('scale__seg--on', hit);
    });
  }

  function initCompare(root) {
    if (root.dataset.graceReady) return;
    root.dataset.graceReady = '1';
    var items = [];
    try { items = JSON.parse(root.querySelector('[data-cmp-data]').textContent) || []; } catch (e) { items = []; }
    if (!items.length) items = SAMPLE;

    var cols = root.querySelectorAll('[data-cmp-col]');
    Array.prototype.forEach.call(cols, function (col, colIndex) {
      var select = col.querySelector('[data-cmp-sel]');
      var img = col.querySelector('[data-cmp-img]');
      var placeholder = col.querySelector('[data-cmp-ph]');
      var link = col.querySelector('[data-cmp-link]');

      items.forEach(function (item, i) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = item.title;
        select.appendChild(option);
      });

      function show(i) {
        var item = items[i];
        if (!item) return;
        if (item.image) {
          img.src = item.image;
          img.alt = item.title;
          img.hidden = false;
          placeholder.setAttribute('hidden', '');
        } else {
          img.hidden = true;
          placeholder.removeAttribute('hidden');
          placeholder.querySelector('path').setAttribute('fill', FILLS[i % FILLS.length]);
        }
        ['weight', 'willow', 'handle'].forEach(function (key) {
          var el = col.querySelector('.attr__v[data-k="' + key + '"]');
          if (el) el.textContent = item[key] || '';
        });
        setScale(col, 'pickup', item.pickup);
        setScale(col, 'sweet', item.sweet);
        if (link) {
          if (item.url) { link.href = item.url; link.hidden = false; } else { link.hidden = true; }
        }
      }

      var start = Math.min(colIndex, items.length - 1);
      select.value = start;
      select.addEventListener('change', function () { show(parseInt(select.value, 10)); });
      show(start);
    });
  }

  function initGallery(root) {
    if (root.dataset.graceReady) return;
    root.dataset.graceReady = '1';
    var slides = root.querySelectorAll('[data-slide]');
    var thumbs = root.querySelectorAll('[data-thumb]');
    Array.prototype.forEach.call(thumbs, function (thumb) {
      thumb.addEventListener('click', function () {
        var target = thumb.getAttribute('data-thumb');
        Array.prototype.forEach.call(slides, function (slide) {
          var active = slide.getAttribute('data-slide') === target;
          slide.classList.toggle('is-on', active);
          var video = slide.querySelector('video');
          if (video && !active) video.pause();
        });
        Array.prototype.forEach.call(thumbs, function (t) { t.classList.toggle('thumb--active', t === thumb); });
      });
    });
  }

  function initBuy(root) {
    if (root.dataset.graceReady) return;
    root.dataset.graceReady = '1';
    var select = root.querySelector('[data-variant-select]');
    var price = root.querySelector('[data-price]');
    if (!select || !price) return;
    select.addEventListener('change', function () {
      var option = select.options[select.selectedIndex];
      if (option && option.getAttribute('data-price')) price.textContent = option.getAttribute('data-price');
    });
  }

  /* Find your fit: scores each bat against the answers using the same metafields as the comparison. */
  function initFit(root) {
    if (root.dataset.graceReady) return;
    root.dataset.graceReady = '1';
    var items = [];
    try { items = JSON.parse(root.querySelector('[data-fit-data]').textContent) || []; } catch (e) { items = []; }
    var sample = !items.length;
    if (sample) {
      items = SAMPLE.map(function (item) {
        return Object.assign({ why: '', price: '', sweet_text: item.sweet.replace('|', ' to '), pickup_text: item.pickup.replace('|', ' to ') }, item);
      });
    }

    var steps = Array.prototype.slice.call(root.querySelectorAll('[data-fit-step]'));
    var questions = steps.filter(function (step) { return step.getAttribute('data-fit-step') === 'question'; });
    var bar = root.querySelector('[data-fit-bar]');
    var answers = {};
    var current = 0;

    function show(index) {
      current = index;
      steps.forEach(function (step, i) { step.hidden = i !== index; });
      if (bar) bar.style.width = (index / (steps.length - 1)) * 100 + '%';
      if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start' });
    }

    function has(value, token) { return String(value || '').toLowerCase().indexOf(token) !== -1; }

    function score(item) {
      var total = 0;
      if (answers.pickup && has(item.pickup, answers.pickup)) total += 2;
      if (answers.middle && has(item.sweet, answers.middle)) total += 2;
      var lean = { power: ['heavy', 'high'], control: ['light', 'low'], allround: ['balanced', 'mid'] }[answers.priority];
      if (lean) {
        if (has(item.pickup, lean[0])) total += 1;
        if (has(item.sweet, lean[1])) total += 1;
      }
      return total;
    }

    function showResult() {
      var bestIndex = 0, bestScore = -1;
      items.forEach(function (item, i) {
        var s = score(item);
        if (s > bestScore) { bestScore = s; bestIndex = i; }
      });
      var item = items[bestIndex];
      root.querySelector('[data-fit-name]').textContent = item.title;
      var why = root.querySelector('[data-fit-why]');
      why.textContent = item.why || '';
      why.hidden = !item.why;

      var img = root.querySelector('[data-fit-img]');
      var placeholder = root.querySelector('[data-fit-ph]');
      if (item.image) {
        img.src = item.image; img.alt = item.title; img.hidden = false;
        placeholder.setAttribute('hidden', '');
      } else {
        img.hidden = true;
        placeholder.removeAttribute('hidden');
        placeholder.querySelector('path').setAttribute('fill', FILLS[bestIndex % FILLS.length]);
      }

      Array.prototype.forEach.call(root.querySelectorAll('[data-fit-k]'), function (cell) {
        var value = item[cell.getAttribute('data-fit-k')] || '';
        cell.textContent = value;
        cell.parentElement.hidden = !value;
      });

      var price = root.querySelector('[data-fit-price]');
      price.textContent = item.price || '';
      price.hidden = !item.price;

      var form = root.querySelector('[data-fit-form]');
      if (item.variant && item.available) {
        form.querySelector('[data-fit-variant]').value = item.variant;
        form.hidden = false;
      } else {
        form.hidden = true;
      }
      var link = root.querySelector('[data-fit-link]');
      if (item.url) { link.href = item.url; link.hidden = false; } else { link.hidden = true; }

      show(steps.length - 1);
    }

    root.querySelector('[data-fit-start]').addEventListener('click', function () { show(1); });

    questions.forEach(function (step) {
      var options = step.querySelectorAll('.fopt');
      Array.prototype.forEach.call(options, function (option) {
        option.addEventListener('click', function () {
          Array.prototype.forEach.call(options, function (o) { o.classList.toggle('fopt--on', o === option); });
          answers[step.getAttribute('data-key')] = option.getAttribute('data-value');
          window.setTimeout(function () {
            if (current < questions.length) show(current + 1); else showResult();
          }, 240);
        });
      });
      var back = step.querySelector('[data-fit-back]');
      if (back) back.addEventListener('click', function () { show(current - 1); });
    });

    root.querySelector('[data-fit-restart]').addEventListener('click', function () {
      answers = {};
      Array.prototype.forEach.call(root.querySelectorAll('.fopt--on'), function (o) { o.classList.remove('fopt--on'); });
      show(0);
    });

    show(0);
  }

  function init(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-grace-compare]'), initCompare);
    Array.prototype.forEach.call(scope.querySelectorAll('[data-grace-gallery]'), initGallery);
    Array.prototype.forEach.call(scope.querySelectorAll('[data-grace-product]'), initBuy);
    Array.prototype.forEach.call(scope.querySelectorAll('[data-grace-fit]'), initFit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
  /* Theme editor: re-run when a section is added or re-rendered. */
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
})();
