(function () {
  var CONFIG = {
    enabled: true,       
    once: true,           
    minDisplay: 1500,    
    exitDuration: 950,    
    reducedExit: 250
  };

  try {
    var override = window.localStorage.getItem('himam-splash-enabled');
    if (override === 'false') CONFIG.enabled = false;
    if (override === 'true') CONFIG.enabled = true;
  } catch (e) {}

  var splash = document.getElementById('himamSplash');
  if (!splash) return;

  var alreadySeen = false;
  try {
    alreadySeen = CONFIG.once && window.sessionStorage.getItem('himam-splash-seen') === '1';
  } catch (e) {}

  if (!CONFIG.enabled || alreadySeen) {
    splash.parentNode && splash.parentNode.removeChild(splash);
    return;
  }

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  document.documentElement.classList.add('splash-active');

  function markSeen() {
    try { window.sessionStorage.setItem('himam-splash-seen', '1'); } catch (e) {}
  }

  function finish() {
    splash.classList.add('is-leaving');
    document.documentElement.classList.remove('splash-active');
    var dur = reduced ? CONFIG.reducedExit : CONFIG.exitDuration;
    window.setTimeout(function () {
      splash.classList.add('is-hidden');
      splash.parentNode && splash.parentNode.removeChild(splash);
    }, dur + 60);
    markSeen();
  }

  if (reduced) {
    splash.classList.add('reduced');
    window.setTimeout(finish, 200);
    return;
  }

  var start = (window.performance && performance.now) ? performance.now() : Date.now();
  var logoImg = splash.querySelector('.splash-logo');
  var proceeded = false;

  function proceedOnce() {
    if (proceeded) return;
    proceeded = true;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var elapsed = now - start;
    var wait = Math.max(0, CONFIG.minDisplay - elapsed);
    window.setTimeout(finish, wait);
  }

  if (logoImg) {
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      proceedOnce();
    } else {
      logoImg.addEventListener('load', proceedOnce);
      logoImg.addEventListener('error', proceedOnce);
    }
  } else {
    proceedOnce();
  }

  window.setTimeout(proceedOnce, 2600);
})();