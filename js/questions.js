(function (app) {
  'use strict';
  function normalizeTypedAnswer(value) {
    return value.normalize('NFD').replace(/\p{M}/gu, '');
  }
  function sentence(parts) {
    return parts.join(' ').replace(/ \?/g, '?');
  }
  // Exit anchors share the destination center line; boarding has independent apron/stair anchors.
  const paths = {
    terminal: [[730,770], [795,760], [860,750]],
    exit: [[625,785,1.10], [625,693,1.0333333], [625,601,.9666667], [625,509,.90]],
    boarding: [[500,685,.60], [610,665,.60], [710,640,.60], [825,605,.60], [910,433,.58], [1060,264,.56]]
  };
  // Flat side-view road. All bus travel changes X only.
  const stops = [170, 270, 370, 470, 570, 1460];
  const roadEntry = -804;
  const pathIndex = (zone, index) => zone === 'terminal' ? index : zone === 'exit' ? index - 2 : index - 10;
  const travelTime = 1500; // Boarding movement timing.
  function render(container, start = 1) {
    const questions = app.data.gateQuestions;
    let index = start === 'complete' || start === 'boarding' ? 14 : Number.isInteger(Number(start)) ? Math.max(0, Math.min(14, Number(start) - 1)) : 0;
    const debugEntry = Number(start) === 6;
    let exitPosition = null;
    let firstLoad = true;
    let lives = 3;
    let busy = false;
    let disposed = false;
    let order = [];
    let deck = [];
    const timers = new Set();
    function later(callback, delay) {
      const timer = setTimeout(() => { timers.delete(timer); if (!disposed) callback(); }, delay);
      timers.add(timer);
    }
    container.innerHTML = `
      <section class="questions-screen" aria-label="Find your gate">
        <div class="questions-backdrop"></div>
        <form class="questions-task" novalidate>
          <p class="questions-instruction"></p>
          <div class="questions-panel">
            <span class="questions-number"></span>
            <div class="questions-writing-area">
              <p class="questions-situation"></p>
              <label id="questions-prompt" for="questions-answer"></label>
              <input id="questions-answer" type="text" aria-label="Type the complete question" aria-describedby="questions-prompt" autocomplete="off" autocapitalize="off" spellcheck="false">
              <div class="questions-choices" hidden></div>
              <div class="questions-build" hidden>
                <div class="questions-slots" aria-label="Assembled question"></div>
                <div class="questions-cards" aria-label="Available question cards"></div>
              </div>
            </div>
          </div>
          <button class="questions-check" type="submit">CHECK</button>
          <p class="questions-feedback" role="status" aria-live="polite"></p>
        </form>
        <div class="questions-world">
          <div class="questions-traveler" aria-label="Traveler standing">
            <img class="questions-traveler-still" src="assets/images/traveler_still.webp" alt="">
            <img class="questions-traveler-walking" src="assets/images/traveler_walking.gif" alt="" hidden>
          </div>
          <div class="questions-bus-motion" hidden><img class="questions-bus" src="assets/images/airport_shuttle_bus.webp" alt="Airport shuttle bus"></div>
        </div>
        <div class="questions-complete" hidden role="region" aria-label="Boarding complete">
          <div class="questions-complete-content">
          <h1 tabindex="-1">YOU MADE IT! <span class="questions-complete-plane">✈️</span></h1>
          <p class="questions-complete-flight">FLIGHT AR725<br>BOARDING COMPLETE</p>
          <p class="questions-complete-story">JUST IN TIME!</p>
          <div class="questions-complete-sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
      </section>`;
    const root = container.querySelector('.questions-screen');
    const hud = document.getElementById('screen-hud');
    hud.innerHTML = `<div class="checkin-hud"><img src="assets/images/gate_hu.webp" alt="FIND YOUR GATE: Questions"><div class="checkin-lives questions-lives" role="status"></div></div>${app.ui.journeyMarkup(2)}`;
    const checkpoints = hud.querySelectorAll('.journey-hud li');
    checkpoints[0].querySelector('button').textContent = 'BOARDING PASS ✓';
    checkpoints[1].textContent = 'SECURITY ✓';
    const unbindJourney = app.ui.bindJourneyItems(hud);
    const form = root.querySelector('form');
    const prompt = root.querySelector('#questions-prompt');
    const input = root.querySelector('#questions-answer');
    const feedback = root.querySelector('.questions-feedback');
    const check = root.querySelector('.questions-check');
    const hearts = hud.querySelector('.questions-lives');
    const build = root.querySelector('.questions-build');
    const slots = root.querySelector('.questions-slots');
    const cards = root.querySelector('.questions-cards');
    const complete = root.querySelector('.questions-complete');
    const completionTitle = complete.querySelector('h1');
    let completionSoundPlayed = false;
    function playCompletionSound(event) {
      if (disposed || complete.hidden || completionSoundPlayed || event.target !== completionTitle || event.animationName !== 'questions-finale-reveal') return;
      completionSoundPlayed = true;
      app.audio.playEffect('final_success');
    }
    completionTitle.addEventListener('animationstart', playCompletionSound);
    const bus = root.querySelector('.questions-bus-motion');
    const traveler = root.querySelector('.questions-traveler');
    const still = root.querySelector('.questions-traveler-still');
    const walking = root.querySelector('.questions-traveler-walking');
    const choices = root.querySelector('.questions-choices');
    function updateLives() {
      hearts.setAttribute('aria-label', `${lives} lives remaining`);
      hearts.innerHTML = Array.from({ length: lives }, () => '<img src="assets/images/heart.webp" alt="" aria-hidden="true">').join('');
    }
    function lock(value) {
      busy = value;
      input.disabled = value;
      check.disabled = value;
      form.querySelectorAll('button').forEach(button => { button.disabled = value; button.draggable = !value; });
      form.setAttribute('aria-busy', String(value));
    }
    function renderCards() {
      const pieces = questions[index].cards;
      const card = id => `<button type="button" class="questions-card" data-card="${id}" draggable="${!busy}"${busy ? ' disabled' : ''} aria-label="${order.includes(id) ? 'Remove' : 'Add'} ${pieces[id]}">${pieces[id]}</button>`;
      slots.innerHTML = order.length ? order.map(card).join('') : '<span class="questions-build-empty">Place cards here in question order</span>';
      cards.innerHTML = deck.filter(id => !order.includes(id)).map(card).join('');
    }
    function resetBuild(shuffle = false) {
      order = [];
      if (shuffle) {
        deck = questions[index].cards.map((_, id) => id);
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        if (sentence(deck.map(id => questions[index].cards[id])) === questions[index].answer) deck.push(deck.shift());
      }
      renderCards();
    }
    function positionTraveler(point) {
      traveler.style.transform = `translate(${point[0]}px, ${point[1]}px)` + (root.dataset.zone === 'boarding' || root.dataset.zone === 'exit' ? ` scale(${point[2]})` : '');
    }
    function setWalking(value) {
      // Both images share the same foot anchor and visible body height.
      still.hidden = value;
      walking.hidden = !value;
      traveler.setAttribute('aria-label', value ? 'Traveler walking' : 'Traveler standing');
    }
    function positionBus(x) {
      bus.style.transform = `translateX(${x}px)`;
    }
    function drive(x, duration = 1000) {
      bus.style.setProperty('--bus-duration', `${duration}ms`);
      positionBus(x);
    }
    function focusAttempt() {
      const type = questions[index].type;
      (type === 'build' ? cards.querySelector('button') : type === 'choose' ? choices.querySelector('button') : input)?.focus({ preventScroll: true });
    }
    function loadQuestion(focus = false) {
      const question = questions[index];
      const zone = index < 2 ? 'terminal' : index < 5 ? 'exit' : index < 10 ? 'shuttle' : 'boarding';
      const changedZone = root.dataset.zone !== zone;
      const arriving = index === 5 && changedZone && !(firstLoad && debugEntry);
      firstLoad = false;
      root.dataset.zone = zone;
      root.dataset.step = index + 1;
      root.setAttribute('aria-label', `Find your gate: ${zone === 'terminal' ? 'Information desk' : zone === 'exit' ? 'Exit / shuttle access' : zone === 'shuttle' ? 'Shuttle ride' : 'Board the aircraft'}`);
      root.classList.remove('is-correct', 'is-finale', 'is-transitioning');
      bus.classList.remove('is-exiting');
      traveler.hidden = zone === 'shuttle';
      bus.hidden = zone !== 'shuttle';
      const suffix = zone === 'exit' ? '_forward' : '';
      const stillAsset = `assets/images/traveler_still${suffix}.webp`;
      const walkingAsset = `assets/images/traveler_walking${suffix}.gif`;
      if (still.getAttribute('src') !== stillAsset) still.src = stillAsset;
      if (walking.getAttribute('src') !== walkingAsset) walking.src = walkingAsset;
      setWalking(false);
      traveler.classList.remove('is-walking', 'is-exiting');
      if (zone === 'exit') {
        if (changedZone || !exitPosition) exitPosition = [...paths.exit[pathIndex(zone, index)]];
        positionTraveler(exitPosition);
      } else if (zone !== 'shuttle') positionTraveler(paths[zone][pathIndex(zone, index)]);
      bus.classList.add('is-positioning');
      if (zone === 'shuttle') positionBus(arriving ? roadEntry : stops[index - 5]);
      void bus.offsetWidth;
      bus.classList.remove('is-positioning');
      complete.hidden = true;
      root.querySelector('.questions-instruction').textContent = question.type === 'fix' ? 'FIX THE QUESTION' : question.type === 'choose' ? 'CHOOSE THE QUESTION' : 'MAKE A QUESTION';
      root.querySelector('.questions-situation').textContent = question.situation;
      prompt.textContent = question.prompt || '';
      prompt.hidden = !question.prompt;
      root.querySelector('.questions-number').textContent = `${index + 1}/15`;
      input.hidden = !['type', 'fix'].includes(question.type);
      build.hidden = question.type !== 'build';
      choices.hidden = question.type !== 'choose';
      check.hidden = question.type === 'choose';
      choices.innerHTML = (question.choices || []).map((text, i) => `<button type="button" class="questions-choice" data-choice="${i}">${String.fromCharCode(65 + i)}. ${text}</button>`).join('');
      form.dataset.type = question.type;
      input.value = '';
      feedback.textContent = '';
      feedback.className = 'questions-feedback';
      form.hidden = false;
      lock(false);
      if (question.type === 'build') resetBuild(true);
      updateLives();
      if (arriving) {
        // Stage 2 starts with an arrival, then its first task becomes available.
        form.hidden = true;
        lock(true);
        drive(stops[0], 1800);
        later(() => { form.hidden = false; lock(false); if (focus) focusAttempt(); }, 1800);
      } else if (focus) focusAttempt();
    }
    function revealCompletion() {
      traveler.hidden = true;
      checkpoints[2].textContent = 'GATE B24 ✓';
      checkpoints[2].removeAttribute('aria-current');
      checkpoints[2].classList.add('is-collected');
      form.hidden = true;
      complete.hidden = false;
      complete.querySelector('h1').focus({ preventScroll: true });
    }
    function story() {
      root.classList.add('is-correct');
      const zone = root.dataset.zone;
      const duration = zone === 'exit' ? 1667 : index < 10 ? (index === 9 ? 1800 : 1000) : travelTime;
      if (zone === 'shuttle') drive(stops[index - 5 + 1], duration);
      else {
        if (zone === 'exit') traveler.style.setProperty('--exit-walk-duration', `${duration}ms`);
        setWalking(true);
        traveler.classList.add('is-walking');
        void traveler.offsetWidth;
        positionTraveler(paths[zone][pathIndex(zone, index) + 1]);
      }
      later(() => {
        if (zone === 'exit') {
          exitPosition = [...paths.exit[pathIndex(zone, index) + 1]];
          positionTraveler(exitPosition);
        }
        setWalking(false);
        traveler.classList.remove('is-walking');
        if (index === 14) {
          // Boarding is the payoff; never route into the legacy cinematic.
          traveler.classList.add('is-exiting');
          later(() => {
            app.audio.playEffect('airport_ding');
            revealCompletion();
          }, 180);
        } else if (index === 1 || index === 4 || index === 9) {
          if (index === 4) traveler.classList.add('is-exiting');
          if (index === 9) bus.classList.add('is-exiting');
          later(() => root.classList.add('is-transitioning'), 180);
          later(() => { index++; loadQuestion(true); }, 550);
        } else later(() => { index++; loadQuestion(true); }, 200);
      }, duration);
    }
    function restartSection() {
      // Q1–5: terminal/exit; Q6–10: shuttle; Q11–15: boarding.
      index = index < 5 ? 0 : index < 10 ? 5 : 10;
      lives = 3;
      order = [];
      deck = [];
      exitPosition = null;
      loadQuestion(true);
    }
    function submit(event, selected) {
      event.preventDefault();
      event.stopPropagation();
      if (busy || disposed) return;
      app.audio.unlock();
      const question = questions[index];
      const answer = question.type === 'build' ? sentence(order.map(id => question.cards[id])) : question.type === 'choose' ? question.choices[selected] || '' : input.value;
      lock(true);
      if (normalizeTypedAnswer(answer) !== normalizeTypedAnswer(question.answer)) {
        app.audio.playEffect('wrong');
        lives--;
        updateLives();
        input.value = '';
        if (question.type === 'build') resetBuild();
        feedback.textContent = 'INCORRECT / TRY AGAIN';
        feedback.classList.add('is-wrong');
        later(() => {
          if (lives === 0) restartSection();
          else {
            lock(false);
            focusAttempt();
          }
        }, 900);
        return;
      }
      app.audio.playEffect('correct');
      feedback.classList.remove('is-wrong');
      feedback.textContent = 'CORRECT ✓';
      story();
    }
    function click(event) {
      if (!event.target.closest('button')) return;
      event.stopPropagation();
      if (busy) return;
      const choice = event.target.closest('[data-choice]');
      if (choice) { submit(event, Number(choice.dataset.choice)); return; }
      const button = event.target.closest('[data-card]');
      if (!button) return;
      app.audio.unlock();
      const id = Number(button.dataset.card);
      order = order.includes(id) ? order.filter(value => value !== id) : [...order, id];
      renderCards();
      build.querySelector(`[data-card="${id}"]`).focus({ preventScroll: true });
    }
    function dragStart(event) {
      const button = event.target.closest('[data-card]');
      if (!button || busy) { event.preventDefault(); return; }
      event.dataTransfer.setData('text/plain', button.dataset.card);
      event.dataTransfer.effectAllowed = 'move';
    }
    function dragOver(event) { if (!busy && event.target.closest('.questions-slots, .questions-cards')) event.preventDefault(); }
    function drop(event) {
      event.preventDefault();
      if (busy) return;
      const zone = event.target.closest('.questions-slots, .questions-cards');
      const raw = event.dataTransfer.getData('text/plain');
      const id = Number(raw);
      if (!zone || raw === '' || !deck.includes(id)) return;
      const target = event.target.closest('[data-card]');
      if (target && Number(target.dataset.card) === id) return;
      order = order.filter(value => value !== id);
      if (zone === slots) {
        const position = target ? order.indexOf(Number(target.dataset.card)) : -1;
        order.splice(position < 0 ? order.length : position, 0, id);
      }
      renderCards();
    }
    form.addEventListener('click', click);
    form.addEventListener('submit', submit);
    build.addEventListener('dragstart', dragStart);
    build.addEventListener('dragover', dragOver);
    build.addEventListener('drop', drop);
    loadQuestion();
    if (start === 'complete') { lock(true); revealCompletion(); }
    if (start === 'boarding') {
      lock(true);
      // Let the final approach position render before the existing boarding movement.
      later(story, 100);
    }
    return function () {
      disposed = true;
      completionTitle.removeEventListener('animationstart', playCompletionSound);
      timers.forEach(clearTimeout);
      unbindJourney();
      hud.replaceChildren();
    };
  }
  app.questions = { render };
}(window.AirportRush));
