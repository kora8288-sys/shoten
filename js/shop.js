/* ============================================================
   SHOP — loads products from Supabase (table: products) instead
   of a static file, renders them into #shopGrid, and wires:
     · img1 -> img2 crossfade on hover (desktop) / tap (touch)
     · a light pointer-tilt on the card, desktop only
     · its own IntersectionObserver reveal
   Depends on window.sb from js/supabase-client.js, which must
   load first (and the Supabase SDK script before that). Used by
   shop.html. js/shop-data.js is no longer needed by this file.
   ============================================================ */
(function () {
  'use strict';

  var grid = document.getElementById('shopGrid');
  var countEl = document.getElementById('shopCount');
  if (!grid) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  grid.innerHTML = '<p class="shop__loading">جاري تحميل المنتجات…</p>';

  window.sb
    .from('products')
    .select('id, name, price, img1, img2')
    .eq('active', true)
    .order('created_at', { ascending: true })
    .then(function (res) {
      if (res.error) {
        grid.innerHTML = '<p class="shop__loading">تعذر تحميل المنتجات. حاول تحدّث الصفحة.</p>';
        return;
      }
      renderProducts(res.data || []);
    });

  function renderProducts(PRODUCTS) {
    if (!PRODUCTS.length) {
      if (countEl) countEl.textContent = '00';
      grid.innerHTML = '<p class="shop__loading">لا توجد منتجات حاليًا.</p>';
      return;
    }
    if (countEl) countEl.textContent = String(PRODUCTS.length).padStart(2, '0');

    var frag = document.createDocumentFragment();

    PRODUCTS.forEach(function (p, i) {
      var art = document.createElement('article');
      art.className = 'product';
      art.dataset.id = p.id || String(i);

      var media = document.createElement('div');
      media.className = 'product__media';

      var img1 = document.createElement('img');
      img1.className = 'product__img product__img--1';
      img1.src = p.img1;
      img1.alt = p.name;
      img1.loading = 'lazy';
      img1.decoding = 'async';
      media.appendChild(img1);

      var img2 = document.createElement('img');
      img2.className = 'product__img product__img--2';
      img2.src = p.img2;
      img2.alt = p.name;
      img2.loading = 'lazy';
      img2.decoding = 'async';
      media.appendChild(img2);

      if (!canHover) {
        var hint = document.createElement('span');
        hint.className = 'product__hint';
        hint.textContent = 'tap';
        media.appendChild(hint);

        media.addEventListener('click', function () {
          var was = art.classList.contains('is-flipped');
          [].slice.call(grid.querySelectorAll('.product.is-flipped')).forEach(function (n) {
            n.classList.remove('is-flipped');
          });
          if (!was) art.classList.add('is-flipped');
        });
      }

      if (canHover && !reduce) {
        media.addEventListener('pointermove', function (e) {
          var r = media.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          media.style.transform =
            'rotateY(' + (px * 6).toFixed(2) + 'deg) rotateX(' + (py * -6).toFixed(2) + 'deg)';
        });
        media.addEventListener('pointerleave', function () { media.style.transform = ''; });
      }

      art.appendChild(media);

      var meta = document.createElement('div');
      meta.className = 'product__meta';

      var name = document.createElement('h4');
      name.className = 'product__name';
      name.textContent = p.name;

      var price = document.createElement('span');
      price.className = 'product__price';
      price.textContent = typeof p.price === 'number' ? '$' + p.price.toFixed(2) : ('$' + p.price);

      meta.appendChild(name);
      meta.appendChild(price);
      art.appendChild(meta);

          frag.appendChild(art);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);

    var cards = [].slice.call(grid.querySelectorAll('.product'));
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-shown');
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
      cards.forEach(function (c) { io.observe(c); });
    } else {
      cards.forEach(function (c) { c.classList.add('is-shown'); });
    }
  }
})();