(function () {
  'use strict';
  const runningVersion = document.querySelector('meta[name="airport-build"]')?.content;
  if (!runningVersion) return; // Local, unbuilt game stays unchanged.
  let pendingVersion;
  let checking = false;
  let lastCheck = 0;
  function applyWhenHome() {
    if (pendingVersion && document.visibilityState === 'visible' && document.getElementById('screen')?.dataset.screen === 'home') {
      // Cached index.html is also safe: its shell always checks release.json.
      location.reload();
    }
  }
  async function checkRelease() {
    if (checking || Date.now() - lastCheck < 30000) return;
    checking = true;
    lastCheck = Date.now();
    try {
      const url = new URL('release.json', location.href);
      url.searchParams.set('check', Date.now() + '-' + Math.random().toString(36).slice(2));
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return;
      const release = await response.json();
      if (/^[a-f0-9]{16}$/.test(release.version) && release.version !== runningVersion) {
        pendingVersion = release.version;
        applyWhenHome();
      }
    } catch (_) { /* A network failure must not interrupt the current game. */ }
    finally { checking = false; }
  }
  window.addEventListener('pageshow', event => { if (event.persisted) checkRelease(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { applyWhenHome(); checkRelease(); }
  });
  window.addEventListener('focus', checkRelease);
  const screen = document.getElementById('screen');
  if (screen) new MutationObserver(applyWhenHome).observe(screen, { attributes: true, attributeFilter: ['data-screen'] });
}());
