/* ============================================================
   SHOP PAGE — invert toggle + background music for shop.html,
   without loading the whole boot/3D machinery from js/main.js.

   INVERT shares the SAME localStorage key ('sk_invert') main.js
   uses on index.html, so on/off carries over between pages.

   MUSIC shares the SAME sessionStorage key ('sk_sound') main.js
   uses, so the on/off CHOICE carries over between pages too.
   What can't carry over is the exact playback position: a normal
   multi-page site (this one) does a full page reload on every
   link click, which always destroys and recreates the <audio>
   element — no plain HTML/JS site can keep a sound literally
   playing, uninterrupted, across that reload. What this DOES fix:
   arriving here with sound already wanted, it picks the track
   back up on its own (from the top) instead of staying silent
   until you go back and press the button again.
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;

  /* ---- invert ---- */
  var invertBtn = document.getElementById('invertToggle');
  function applyInvert(on) {
    body.classList.toggle('is-invert', on);
    if (invertBtn) invertBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', on ? '#000000' : '#ffffff');
    try { localStorage.setItem('sk_invert', on ? '1' : '0'); } catch (e) {}
  }
  var savedInvert = false;
  try { savedInvert = localStorage.getItem('sk_invert') === '1'; } catch (e) {}
  if (savedInvert) applyInvert(true);
  if (invertBtn) {
    invertBtn.addEventListener('click', function () {
      applyInvert(!body.classList.contains('is-invert'));
    });
  }

  /* ---- music (same gesture-arming approach as js/main.js) ---- */
  var audio = document.getElementById('bgAudio');
  var soundBtn = document.getElementById('soundToggle');
  var wanted = false, fadeTimer = null, audible = false;
  var VOL = 0.42;

  function fadeTo(target, done) {
    if (!audio) return;
    clearInterval(fadeTimer);
    var step = (target - audio.volume) / 22;
    fadeTimer = setInterval(function () {
      var v = audio.volume + step;
      if ((step > 0 && v >= target) || (step < 0 && v <= target) || step === 0) {
        audio.volume = Math.max(0, Math.min(1, target));
        clearInterval(fadeTimer);
        done && done();
      } else {
        audio.volume = Math.max(0, Math.min(1, v));
      }
    }, 40);
  }

  function reflectSound() { soundBtn && soundBtn.setAttribute('aria-pressed', wanted ? 'true' : 'false'); }

  function rollSilently() {
    if (!audio) return;
    audio.muted = true;
    audio.volume = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }

  var inFlight = null;
  function goAudible() {
    if (!audio) return Promise.resolve(false);
    if (audible) return Promise.resolve(true);
    if (inFlight) return inFlight;

    var wasMuted = audio.muted;
    audio.muted = false;
    if (wasMuted) { try { audio.currentTime = 0; } catch (e) {} }
    audio.volume = 0;

    var p;
    try { p = audio.play(); } catch (e) { p = null; }
    var settle = function (ok) { inFlight = null; return ok; };
    var win = function () { audible = true; fadeTo(VOL); return settle(true); };
    var lose = function () {
      audio.muted = wasMuted;
      if (wasMuted && audio.paused) rollSilently();
      return settle(false);
    };
    if (!p || !p.then) return Promise.resolve(audio.paused ? lose() : win());
    inFlight = p.then(win, lose);
    return inFlight;
  }

  var ARM = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend', 'wheel', 'scroll'];
  var armed = false;
  function kick() {
    if (!wanted || audible) { disarmSound(); return; }
    goAudible().then(function (ok) { if (ok) disarmSound(); });
  }
  function armSound() {
    if (armed || !audio) return;
    armed = true;
    ARM.forEach(function (t) { window.addEventListener(t, kick, { capture: true, passive: true }); });
  }
  function disarmSound() {
    if (!armed) return;
    armed = false;
    ARM.forEach(function (t) { window.removeEventListener(t, kick, true); });
  }

  function setSound(on) {
    if (!audio) return;
    wanted = on;
    reflectSound();
    try { sessionStorage.setItem('sk_sound', on ? '1' : '0'); } catch (e) {}
    if (on) {
      goAudible().then(function (ok) { if (!ok) { rollSilently(); armSound(); } });
    } else {
      audible = false;
      disarmSound();
      fadeTo(0, function () { audio.pause(); });
    }
  }

  if (soundBtn) soundBtn.addEventListener('click', function () { setSound(!wanted); });

  document.addEventListener('visibilitychange', function () {
    if (!audio) return;
    if (document.hidden) { audio.pause(); }
    else if (wanted) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  });

  /* on by default unless the visitor turned it off earlier this session
     (index.html or here — same sessionStorage key, so it carries over) */
  var soundOnByDefault = true;
  try { if (sessionStorage.getItem('sk_sound') === '0') soundOnByDefault = false; } catch (e) {}

  if (audio && soundOnByDefault) {
    wanted = true;
    reflectSound();
    goAudible().then(function (ok) {
      if (ok) return;
      rollSilently();
      armSound();
    });
  }
})();