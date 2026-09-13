(function (app) {
  'use strict';
  // The automatic reward belongs to GAME 3; no grammar or saved progress here.
  function render(container) {
    const timers = [];
    let disposed = false;
    const later = (fn, delay) => timers.push(setTimeout(() => { if (!disposed) fn(); }, delay));
    const hud = document.getElementById('screen-hud');
    hud.innerHTML = app.ui.journeyMarkup(3);
    hud.querySelectorAll('.journey-hud li').forEach(item => {
      const label = item.querySelector('button') || item;
      label.textContent += ' ✓';
    });
    const unbind = app.ui.bindJourneyItems(hud);
    container.innerHTML = `<section class="gate-final-screen" aria-label="Final Call">
      <div class="gate-final-terminal"></div>
      <div class="gate-final-board" role="status" aria-live="polite"><strong>FINAL CALL</strong><span>FLIGHT AR725 TO LONDON</span><span>GATE B24 — CLOSING</span></div>
      <div class="gate-final-action" aria-hidden="true"><img class="gate-final-case" src="assets/images/suitcase.webp" alt=""><div class="gate-final-lights"></div><div class="gate-final-doors"></div><img class="gate-final-plane" src="assets/images/airplane.webp" alt=""></div>
      <div class="gate-final-result" hidden><h1 tabindex="-1">YOU MADE IT! ✈️</h1><p>Have a great flight!</p><button type="button" data-screen="home">HOME</button> <button type="button" data-screen="questions">PLAY AGAIN</button></div>
    </section>`;
    const root = container.querySelector('.gate-final-screen');
    const board = root.querySelector('.gate-final-board');
    const phase = (name, text) => { root.dataset.phase = name; if (text) board.innerHTML = text; };
    phase('call');
    later(() => phase('luggage'), 1000);
    later(() => phase('walkway', '<strong>MOVING WALKWAY</strong><span>B22 → B24</span>'), 2100);
    later(() => phase('gate', '<strong>GATE B24</strong><span>CLOSING</span>'), 3500);
    later(() => phase('bridge', '<strong>WELCOME ABOARD ✓</strong><span>FLIGHT AR725 TO LONDON</span>'), 4800);
    later(() => { phase('apron', '<strong>FLIGHT AR725</strong><span>READY FOR DEPARTURE</span>'); app.audio.playEffect('seatbelt'); }, 6000);
    later(() => phase('taxi'), 7100);
    later(() => { phase('runway', '<strong>LONDON →</strong><span>TAKEOFF</span>'); app.audio.playEffect('takeoff'); }, 8300);
    later(() => phase('takeoff'), 9400);
    later(() => {
      phase('complete');
      board.hidden = true;
      root.querySelector('.gate-final-result').hidden = false;
      root.querySelector('h1').focus({ preventScroll: true });
      app.audio.playEffect('reward');
    }, 11400);
    return () => { disposed = true; timers.forEach(clearTimeout); unbind(); hud.replaceChildren(); };
  }
  app.gateFinal = { render };
}(window.AirportRush));
