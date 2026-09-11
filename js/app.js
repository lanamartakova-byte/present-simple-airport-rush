(function (app) {
  'use strict';
  const container = document.getElementById('screen');
  const shell = document.querySelector('.app-shell');
  const audioToggle = document.getElementById('audio-toggle');
  const audioPanel = document.getElementById('audio-panel');
  function setAudioPanel(open) {
    audioPanel.hidden = !open;
    audioToggle.setAttribute('aria-expanded', String(open));
  }
  audioToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    setAudioPanel(audioPanel.hidden);
  });
  // Capture outside clicks even when a suitcase handles its own click event.
  document.addEventListener('click', function (event) {
    if (!audioPanel.contains(event.target) && !audioToggle.contains(event.target)) setAudioPanel(false);
  }, true);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !audioPanel.hidden) {
      setAudioPanel(false);
      audioToggle.focus();
    }
  });
  function fitViewport() {
    const scale = Math.min(document.documentElement.clientWidth / 1440, document.documentElement.clientHeight / 810);
    shell.style.setProperty('--game-scale', scale);
  }
  window.addEventListener('resize', fitViewport);
  fitViewport();
  const screens = new Map();
  let cleanup;
  app.router = {
    register(id, render) { screens.set(id, render); },
    show(id, focus = true) {
      const render = screens.get(id);
      if (!render) return;
      if (typeof cleanup === 'function') cleanup();
      cleanup = render(container);
      container.dataset.screen = id;
      if (focus) container.querySelector('h1')?.focus({ preventScroll: true });
    }
  };
  app.router.register('home', app.ui.home);
  app.data.games.forEach(game => {
    app.router.register(game.id, container => app.ui.placeholder(container, game));
  });
  app.router.register('checkin', app.checkin.render);
  const securityDebug = new URLSearchParams(window.location.search);
  app.router.register('security', container => app.security.render(container,
    securityDebug.get('debug') === 'security' ? securityDebug.get('step') : 1));

  document.addEventListener('click', function (event) {
    const mute = event.target.closest('[data-mute]');
    if (mute) {
      app.audio.toggleMute(mute.dataset.mute);
      app.ui.syncAudio(mute.dataset.mute);
    }
    // Apply a first-click mute before attempting to start music.
    app.audio.unlock();
    const route = event.target.closest('[data-screen]');
    if (route && route !== container) app.router.show(route.dataset.screen);
    if (event.target.closest('button')) app.audio.playEffect('click');
  });
  document.addEventListener('keydown', function (event) {
    if (!['Enter', ' ', 'Tab', 'Escape'].includes(event.key)) app.audio.unlock();
  });
  ['music', 'sfx'].forEach(channel => {
    document.getElementById(`${channel}-volume`).addEventListener('input', function (event) {
      app.audio.setVolume(channel, event.target.value);
      app.audio.unlock();
    });
    app.ui.syncAudio(channel);
  });
  app.router.show(securityDebug.get('debug') === 'security' ? 'security' : 'home', false);
}(window.AirportRush));
