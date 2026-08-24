/* ============================================================
   ACCOUNT — sign in / sign up / sign out / order history.
   Depends on window.sb from js/supabase-client.js, which must
   load first. Used by account.html.
   ============================================================ */
(function () {
  'use strict';

  var loadingEl = document.getElementById('authLoading');
  var formsEl = document.getElementById('authForms');
  var loggedInEl = document.getElementById('loggedIn');
  var userEmailEl = document.getElementById('userEmail');
  var ordersEl = document.getElementById('ordersList');
  var signOutBtn = document.getElementById('signOutBtn');

  var signInPanel = document.getElementById('signInPanel');
  var signUpPanel = document.getElementById('signUpPanel');
  var signInForm = document.getElementById('signInForm');
  var signUpForm = document.getElementById('signUpForm');
  var signInError = document.getElementById('signInError');
  var signUpError = document.getElementById('signUpError');
  var showSignUp = document.getElementById('showSignUp');
  var showSignIn = document.getElementById('showSignIn');

  /* Supabase doesn't localise its error messages — map the common
     ones so the page reads in Arabic; anything unmapped just shows
     as-is rather than being hidden. */
  function arabicError(msg) {
    var map = {
      'Invalid login credentials': 'البريد الإلكتروني أو كلمة السر غير صحيحة',
      'User already registered': 'هذا البريد الإلكتروني مسجل مسبقًا — جرب تسجيل الدخول',
      'Email not confirmed': 'لازم تأكد بريدك الإلكتروني الأول (تحقق من صندوق الوارد)',
      'Password should be at least 6 characters': 'كلمة السر لازم تكون 6 أحرف على الأقل'
    };
    return map[msg] || msg;
  }

  function showLoggedOut() {
    loadingEl.hidden = true;
    formsEl.hidden = false;
    loggedInEl.hidden = true;
  }

  function showLoggedIn(user) {
    loadingEl.hidden = true;
    formsEl.hidden = true;
    loggedInEl.hidden = false;
    userEmailEl.textContent = user.email;
    loadOrders();
  }

  function loadOrders() {
    ordersEl.innerHTML = '<p class="acct__muted">جاري التحميل…</p>';
    window.sb
      .from('orders')
      .select('id, status, total, created_at, order_items(product_name, quantity, unit_price)')
      .order('created_at', { ascending: false })
      .then(function (res) {
        if (res.error) {
          ordersEl.innerHTML = '<p class="acct__muted">تعذر تحميل الطلبات.</p>';
          return;
        }
        var data = res.data;
        if (!data || !data.length) {
          ordersEl.innerHTML = '<p class="acct__muted">لا توجد طلبات بعد.</p>';
          return;
        }
        ordersEl.innerHTML = '';
        data.forEach(function (o) {
          var card = document.createElement('div');
          card.className = 'acct__order';
          var itemsText = (o.order_items || []).map(function (it) {
            return it.product_name + ' \u00d7 ' + it.quantity;
          }).join('\u060c ');
          card.innerHTML =
            '<div class="acct__order-head"><span>' + new Date(o.created_at).toLocaleDateString() + '</span>' +
            '<span class="acct__order-status">' + o.status + '</span></div>' +
            '<p class="acct__order-items">' + itemsText + '</p>' +
            '<p class="acct__order-total">$' + Number(o.total).toFixed(2) + '</p>';
          ordersEl.appendChild(card);
        });
      });
  }

  signInForm.addEventListener('submit', function (e) {
    e.preventDefault();
    signInError.textContent = '';
    var email = signInForm.email.value.trim();
    var password = signInForm.password.value;
    window.sb.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) signInError.textContent = arabicError(res.error.message);
    });
  });

  signUpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    signUpError.className = 'acct__err';
    signUpError.textContent = '';
    var email = signUpForm.email.value.trim();
    var password = signUpForm.password.value;
    if (password.length < 6) {
      signUpError.textContent = 'كلمة السر لازم تكون 6 أحرف على الأقل';
      return;
    }
    window.sb.auth.signUp({ email: email, password: password }).then(function (res) {
      if (res.error) {
        signUpError.textContent = arabicError(res.error.message);
        return;
      }
      signUpError.className = 'acct__ok';
      signUpError.textContent = 'تم! إذا طلب تأكيد بريد إلكتروني بتشوف رسالة بإيميلك، وإلا رح تسجل دخولك تلقائيًا.';
    });
  });

  showSignUp.addEventListener('click', function (e) {
    e.preventDefault();
    signInPanel.hidden = true;
    signUpPanel.hidden = false;
  });
  showSignIn.addEventListener('click', function (e) {
    e.preventDefault();
    signUpPanel.hidden = true;
    signInPanel.hidden = false;
  });

  signOutBtn.addEventListener('click', function () {
    window.sb.auth.signOut();
  });

  window.sb.auth.onAuthStateChange(function (event, session) {
    if (session && session.user) showLoggedIn(session.user);
    else showLoggedOut();
  });

  window.sb.auth.getSession().then(function (res) {
    var session = res.data.session;
    if (session && session.user) showLoggedIn(session.user);
    else showLoggedOut();
  });
})();
