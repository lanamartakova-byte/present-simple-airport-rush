(function (app) {
  'use strict';
  const container = document.getElementById('screen');
  const shell = document.querySelector('.app-shell');
  const audioToggle = document.getElementById('audio-toggle');
  const audioPanel = document.getElementById('audio-panel');
  // Pointer/touch interaction within the iframe unlocks music without autoplay.
  document.addEventListener('pointerdown', () => app.audio.unlock(), { passive: true });
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
  // Use the same literal URLs as the scenes; the Pages build versions these too.
  const sharedImages = [
    'assets/images/question_panel.webp', 'assets/images/journey_hud.webp',
    'assets/images/heart.webp', 'assets/images/boarding_pass.webp',
    'assets/images/answer_label.webp', 'assets/images/suitcase.webp',
    'assets/images/suitcase_red.webp', 'assets/images/suitcase_yellow.webp',
    'assets/images/suitcase_pink.webp', 'assets/images/backpack.webp',
    'assets/images/backpack_green.webp', 'assets/images/backpack_brown.webp',
    'assets/images/duffel_purple.webp', 'assets/images/duffel_black_white.webp'
  ];
  const sceneImages = {
    checkin: ['assets/images/airport_checkin.webp?v=1e3a3443dc14', 'assets/images/checkin_hud.webp', ...sharedImages],
    security: ['assets/images/airport_security.webp', 'assets/images/security_hud.webp', 'assets/images/security_tray.webp', ...sharedImages],
    questions: [
      'assets/images/airport_terminal.webp', 'assets/images/gate_hu.webp',
      'assets/images/question_panel.webp', 'assets/images/journey_hud.webp',
      'assets/images/heart.webp', 'assets/images/boarding_pass.webp',
      'assets/images/traveler_still.webp', 'assets/images/traveler_walking.gif',
      'assets/images/airport_exit.webp', 'assets/images/traveler_still_forward.webp',
      'assets/images/traveler_walking_forward.gif', 'assets/images/airport_shuttle.webp',
      'assets/images/airport_shuttle_bus.webp', 'assets/images/airport_boarding_bg.webp'
    ],
    final: ['assets/images/airport_terminal.webp', 'assets/images/suitcase.webp', 'assets/images/airplane.webp']
  };
  const imageLoads = new Map();
  const readyScenes = new Set();
  const imageQueue = [];
  let activeImages = 0;
  function pumpImages() {
    while (activeImages < 3 && imageQueue.length) {
      const entry = imageQueue.shift();
      activeImages++;
      const picture = entry.picture;
      picture.onload = async function () {
        try {
          if (picture.decode) await picture.decode();
          entry.resolve();
        } catch (error) {
          imageLoads.delete(entry.url);
          entry.reject(error);
        } finally {
          activeImages--;
          pumpImages();
        }
      };
      picture.onerror = function () {
        imageLoads.delete(entry.url);
        entry.reject(new Error('Image unavailable: ' + entry.url));
        activeImages--;
        pumpImages();
      };
      picture.src = entry.url;
    }
  }
  function preloadImage(url, urgent = false) {
    let entry = imageLoads.get(url);
    if (!entry) {
      entry = { url, picture: new Image() };
      entry.promise = new Promise((resolve, reject) => { entry.resolve = resolve; entry.reject = reject; });
      imageLoads.set(url, entry);
      imageQueue.push(entry);
    }
    if (urgent) {
      const pending = imageQueue.indexOf(entry);
      if (pending > 0) { imageQueue.splice(pending, 1); imageQueue.unshift(entry); }
    }
    pumpImages();
    return entry.promise;
  }
  function preloadScene(id, urgent = false) {
    if (readyScenes.has(id)) return Promise.resolve();
    return Promise.all((sceneImages[id] || []).map(url => preloadImage(url, urgent)))
      .then(() => { readyScenes.add(id); });
  }
  let homePreloadScheduled = false;
  function preloadFromHome() {
    if (homePreloadScheduled) return;
    homePreloadScheduled = true;
    preloadImage('assets/images/airport_home.webp', true).then(() => {
      // Give HOME two paint opportunities before starting background downloads.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        Promise.all([preloadScene('checkin'), preloadScene('security')])
          .then(() => preloadScene('questions')).catch(() => { homePreloadScheduled = false; });
      }));
    }).catch(() => { homePreloadScheduled = false; });
  }
  const screens = new Map();
  let cleanup;
  let navigationRequest = 0;
  app.router = {
    register(id, render) { screens.set(id, render); },
    show(id, focus = true) {
      const render = screens.get(id);
      if (!render) return;
      const request = ++navigationRequest;
      function display() {
        if (request !== navigationRequest) return;
        if (typeof cleanup === 'function') cleanup();
        cleanup = render(container);
        container.dataset.screen = id;
        if (focus) container.querySelector('h1')?.focus({ preventScroll: true });
        if (id === 'home') preloadFromHome();
        if (id === 'security') preloadScene('questions').catch(() => {});
      }
      if (!sceneImages[id] || readyScenes.has(id)) display();
      else {
        // Preserve the current rendered scene until every required image decodes.
        // A newer navigation request supersedes an older pending transition.
        preloadScene(id, true).then(display).catch(() => {
          // Keep the intact previous screen; a later navigation can retry.
        });
      }
    }
  };
  app.router.register('home', app.ui.home);
  app.data.games.forEach(game => {
    app.router.register(game.id, container => app.ui.placeholder(container, game));
  });
  app.router.register('checkin', app.checkin.render);
  const securityDebug = new URLSearchParams(window.location.search);
  let questionsDebugStep = securityDebug.get('debug') === 'questions' ? securityDebug.get('step') || 1 : 1;
  app.router.register('questions', container => {
    const start = questionsDebugStep;
    questionsDebugStep = 1;
    return app.questions.render(container, start);
  });
  app.router.register('final', app.gateFinal.render);
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
  app.router.show(['checkin', 'checkin-last'].includes(securityDebug.get('debug')) ? 'checkin' : securityDebug.get('debug') === 'final' ? 'final' : securityDebug.get('debug') === 'questions' ? 'questions' : ['security', 'security-last'].includes(securityDebug.get('debug')) ? 'security' : 'home', false);
}(window.AirportRush));
