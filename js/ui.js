(function (app) {
  'use strict';
  const journeyItems = {
    boardingPass: { title: 'Boarding Pass', image: 'assets/images/boarding_pass.webp' }
  };
  app.ui = {
    journeyMarkup(current) {
      const labels = ['BOARDING PASS', 'SECURITY', 'GATE B24'];
      return `<aside class="journey-hud" aria-label="Journey"><img src="assets/images/journey_hud.webp" alt=""><ol>${labels.map((label, index) => `<li${index === current ? ' aria-current="step"' : ''}${index < current ? ' class="is-collected"' : ''}>${index === 0 && current > 0 ? app.ui.journeyItemMarkup('boardingPass', label) : label}</li>`).join('')}</ol></aside>`;
    },
    journeyItemMarkup(id, label) {
      return `<button type="button" class="journey-item-button" data-journey-item="${id}" aria-label="View collected ${label}">${label}</button>`;
    },
    collectBoardingPass(hud) {
      const checkpoint = hud.querySelector('.journey-hud li');
      checkpoint.classList.add('is-collected');
      checkpoint.innerHTML = app.ui.journeyItemMarkup('boardingPass', 'BOARDING PASS');
    },
    // Receives item metadata so later rewards can use the same viewer.
    showJourneyItem(item, trigger) {
      const dialog = document.createElement('dialog');
      dialog.className = 'journey-item-viewer';
      dialog.setAttribute('aria-label', item.title);
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'journey-item-close';
      close.setAttribute('aria-label', 'Close item viewer');
      close.textContent = '×';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      dialog.append(close, image);
      document.body.append(dialog);
      function dismiss() {
        dialog.close();
        dialog.remove();
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      }
      dialog.addEventListener('click', function (event) {
        event.stopPropagation();
        if (event.target === close || event.target === dialog) dismiss();
      });
      dialog.addEventListener('keydown', function (event) { event.stopPropagation(); });
      dialog.addEventListener('cancel', function (event) { event.preventDefault(); dismiss(); });
      dialog.showModal();
      close.focus({ preventScroll: true });
      return dismiss;
    },
    bindJourneyItems(hud) {
      let closeViewer;
      function open(event) {
        const trigger = event.target.closest('[data-journey-item]');
        if (!trigger || !hud.contains(trigger)) return;
        event.stopPropagation();
        const item = journeyItems[trigger.dataset.journeyItem];
        if (!item) return;
        if (closeViewer) closeViewer();
        closeViewer = app.ui.showJourneyItem(item, trigger);
      }
      hud.addEventListener('click', open);
      return function () {
        hud.removeEventListener('click', open);
        if (closeViewer) closeViewer();
      };
    },
    home(container) {
      container.innerHTML = `
        <section class="home-screen">
          <nav class="game-choices" aria-label="Mini-games">
            ${app.data.games.map(game => `<button type="button" class="game-card ${game.id}" data-screen="${game.id}"><span class="card-arrow" aria-hidden="true">&#8599;</span><strong>${game.title}</strong><span>${game.grammar}</span></button>`).join('')}
          </nav>
        </section>`;
    },
    placeholder(container, game) {
      container.innerHTML = `<section class="placeholder" aria-labelledby="placeholder-title"><h1 id="placeholder-title" tabindex="-1">${game.title}</h1><p>Coming next</p></section>`;
      const hud = document.getElementById('screen-hud');
      hud.innerHTML = app.ui.journeyMarkup(game.id === 'security' ? 1 : 2);
      const unbind = app.ui.bindJourneyItems(hud);
      return function () { unbind(); hud.replaceChildren(); };
    },
    syncAudio(channel) {
      const state = app.audio.getState(channel);
      const button = document.querySelector(`[data-mute="${channel}"]`);
      const label = `${state.muted ? 'Unmute' : 'Mute'} ${channel === 'music' ? 'music' : 'SFX'}`;
      button.setAttribute('aria-pressed', String(state.muted));
      button.setAttribute('aria-label', label);
      button.title = label;
      document.getElementById(`${channel}-volume`).value = state.volume;
    }
  };
}(window.AirportRush));
