(function (app) {
  'use strict';
  const firstItems = ['suitcase_pink.webp', 'backpack_green.webp', 'duffel_purple.webp', 'backpack_brown.webp', 'duffel_black_white.webp'];
  const baggageItems = ['suitcase.webp', 'duffel_purple.webp', 'suitcase_red.webp', 'suitcase_yellow.webp', 'duffel_black_white.webp', 'suitcase_pink.webp'];
  const backpackItems = ['backpack.webp', 'backpack_green.webp', 'backpack_brown.webp'];
  // Balanced visual slots by question: 0 = left, 1 = center, 2 = right.
  const correctPositions = [0, 2, 1, 0, 1, 2, 2, 1, 0, 2, 0, 1, 1, 2, 0, 0, 1, 2, 1, 2];

  function render(container) {
    const questions = app.data.checkinQuestions;
    // Visual cursors are independent of answer values, grading and answer slots.
    let firstItemCursor = 0;
    let rotationCursor = 0;
    let baggageCursor = 0;
    let backpackCursor = 0;
    function nextItem() {
      if (firstItemCursor < firstItems.length) return firstItems[firstItemCursor++];
      // A seven-item rhythm shifts visuals between slots on successive rounds.
      const backpackTurn = (rotationCursor++ % 7) % 2 === 1;
      return backpackTurn
        ? backpackItems[backpackCursor++ % backpackItems.length]
        : baggageItems[baggageCursor++ % baggageItems.length];
    }

    const debug = new URLSearchParams(window.location.search);
    const step = debug.get('debug') === 'checkin' ? Number(debug.get('step')) : 1;
    let index = Number.isInteger(step) && step >= 1 && step <= questions.length ? step - 1 : 0;
    if (debug.get('debug') === 'checkin-last') index = questions.length - 1;
    let lives = 3;
    let busy = false;
    let disposed = false;
    const timers = new Set();
    let completionAnimation;
    let boardingPass;
    container.innerHTML = `
      <section class="checkin-screen" aria-label="Check-in: Affirmative">
        <div class="checkin-question"><p class="checkin-instruction">Choose the correct verb.</p><img class="question-panel-art" src="assets/images/question_panel.webp" alt=""><span class="checkin-question-number"></span><p id="checkin-sentence" aria-live="polite"></p><p class="checkin-feedback" role="status"></p></div>
        <div class="checkin-baggage" role="group" aria-labelledby="checkin-sentence"></div>
      </section>`;
    const root = container.querySelector('.checkin-screen');
    const hud = document.getElementById('screen-hud');
    hud.innerHTML = `<div class="checkin-hud"><img src="assets/images/checkin_hud.webp" alt="CHECK-IN: Affirmative"><div class="checkin-lives" role="status" aria-label="3 lives remaining"></div></div>${app.ui.journeyMarkup(0)}`;
    const unbindJourney = app.ui.bindJourneyItems(hud);
    const sentence = root.querySelector('#checkin-sentence');
    const questionNumber = root.querySelector('.checkin-question-number');
    const feedback = root.querySelector('.checkin-feedback');
    const hearts = hud.querySelector('.checkin-lives');
    const baggage = root.querySelector('.checkin-baggage');

    function later(callback, delay) {
      const timer = setTimeout(function () {
        timers.delete(timer);
        if (!disposed) callback();
      }, delay);
      timers.add(timer);
    }

    function updateLives() {
      hearts.setAttribute('aria-label', `${lives} lives remaining`);
      hearts.innerHTML = Array.from({ length: lives }, () => '<img src="assets/images/heart.webp" alt="" aria-hidden="true">').join('');
    }

    function lock(value) {
      busy = value;
      baggage.querySelectorAll('button').forEach(button => { button.disabled = value; });
    }

    function loadQuestion(focus = false) {
      busy = false;
      feedback.textContent = '';
      feedback.className = 'checkin-feedback';
      sentence.textContent = questions[index].sentence;
      questionNumber.textContent = `${index + 1}/${questions.length}`;
      questionNumber.hidden = false;
      questionNumber.setAttribute('aria-label', `Question ${index + 1} of ${questions.length}`);
      // Shuffle original indices, keeping grading tied to the approved data.
      const optionOrder = questions[index].options.map((_, optionIndex) => optionIndex);
      for (let i = optionOrder.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
      }
      baggage.innerHTML = '';
      const group = document.createElement('div');
      group.className = 'suitcase-group';
      baggage.append(group);
      const assets = optionOrder.map(() => nextItem());
      const duffelSlot = assets.findIndex(asset => asset.startsWith('duffel_'));
      const targetSlot = correctPositions[index];
      // Allocate answers before pairing them with images, accounting for the
      // subsequent whole-item swap that places a duffel in the center.
      const sourceSlot = duffelSlot < 0 ? targetSlot
        : targetSlot === 1 ? duffelSlot : targetSlot === duffelSlot ? 1 : targetSlot;
      const correctSlot = optionOrder.findIndex(id => questions[index].options[id] === questions[index].answer);
      [optionOrder[sourceSlot], optionOrder[correctSlot]] = [optionOrder[correctSlot], optionOrder[sourceSlot]];
      const items = optionOrder.map((approvedIndex, slot) => ({ approvedIndex, asset: assets[slot] }));
      if (duffelSlot !== -1 && duffelSlot !== 1) [items[1], items[duffelSlot]] = [items[duffelSlot], items[1]];
      items.forEach(({ approvedIndex, asset }, optionIndex) => {
        const option = questions[index].options[approvedIndex];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'suitcase-answer' + (asset.startsWith('duffel_') ? ' is-duffel' : backpackItems.includes(asset) ? ' is-backpack' : '');
        button.dataset.option = approvedIndex;
        button.setAttribute('aria-label', option);
        button.style.setProperty('--slot', optionIndex);
        const img = document.createElement('img');
        img.src = `assets/images/${asset}`;
        img.alt = '';
        img.draggable = false;
        const label = document.createElement('span');
        label.className = 'suitcase-label';
        const labelImage = document.createElement('img');
        labelImage.src = 'assets/images/answer_label.webp';
        labelImage.alt = '';
        labelImage.draggable = false;
        const word = document.createElement('span');
        word.className = 'suitcase-word';
        word.textContent = option;
        label.append(labelImage, word);
        const tag = document.createElement('span');
        tag.className = 'baggage-tag';
        tag.setAttribute('aria-hidden', 'true');
        tag.textContent = 'B24';
        button.append(img, label, tag);
        group.append(button);
      });
      updateLives();
      if (focus) baggage.querySelector('button').focus({ preventScroll: true });
    }

    async function complete() {
      baggage.replaceChildren();
      questionNumber.hidden = true;
      sentence.textContent = '';
      feedback.textContent = '';
      boardingPass = document.createElement('img');
      boardingPass.className = 'checkin-boarding-pass';
      boardingPass.src = 'assets/images/boarding_pass.webp';
      boardingPass.alt = 'Boarding pass earned';
      // Decode before showing the reward so its visible pause includes the image.
      try { await boardingPass.decode(); } catch (_) { /* Allow cached/fallback rendering. */ }
      if (disposed) return;
      const shell = container.closest('.app-shell');
      shell.append(boardingPass);
      app.audio.playEffect('reward');
      const target = hud.querySelector('.journey-hud li');
      const stageBounds = shell.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      const scale = stageBounds.width / shell.offsetWidth;
      const x = (targetBounds.left + targetBounds.width / 2 - stageBounds.left) / scale;
      const y = (targetBounds.top + targetBounds.height / 2 - stageBounds.top) / scale;
      const destination = `translate(-50%, -50%) translate(${x - 720}px, ${y - 405}px) scale(0.06)`;
      completionAnimation = boardingPass.animate([
        { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0, offset: 0 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.12 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.62 },
        { transform: destination, opacity: 0, offset: 1 }
      ], { duration: 3200, easing: 'ease-in-out', fill: 'forwards' });
      completionAnimation.onfinish = function () {
        if (disposed) return;
        boardingPass.remove();
        app.ui.collectBoardingPass(hud);
        sentence.textContent = 'CHECK-IN COMPLETE';
        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'completion-panel-hit';
        next.setAttribute('aria-label', 'Continue to Security');
        next.addEventListener('click', function (event) {
          event.stopPropagation();
          if (disposed || next.disabled) return;
          next.disabled = true;
          app.audio.unlock();
          app.audio.playEffect('click');
          app.router.show('security');
        }, { once: true });
        root.querySelector('.checkin-question').append(next);
      };
    }

    function answer(event) {
      const button = event.target.closest('.suitcase-answer');
      if (!button || !baggage.contains(button) || busy || disposed) return;
      // Answer feedback owns this click; do not layer the global UI click sound over it.
      event.stopPropagation();
      app.audio.unlock();
      lock(true);
      const question = questions[index];
      if (question.options[Number(button.dataset.option)] !== question.answer) {
        app.audio.playEffect('wrong');
        lives -= 1;
        updateLives();
        feedback.textContent = 'INCORRECT / TRY AGAIN';
        feedback.classList.add('is-wrong');
        button.classList.add('is-wrong');
        later(function () {
          if (lives === 0) {
            index = 0;
            lives = 3;
            loadQuestion(true);
            return;
          }
          feedback.textContent = '';
          button.classList.remove('is-wrong');
          lock(false);
          button.focus({ preventScroll: true });
        }, 1000);
        return;
      }
      app.audio.playEffect('correct');
      button.classList.add('is-accepted');
      const group = baggage.querySelector('.suitcase-group');
      let advanced = false;
      function advance() {
        if (disposed || advanced) return;
        advanced = true;
        index += 1;
        if (index < questions.length) loadQuestion(true);
        else complete();
      }
      // Advance on the shared group's arrival offscreen, not on a separate quiz timer.
      group.addEventListener('animationend', function (event) {
        if (event.target === group && event.animationName === 'baggage-group-depart') advance();
      });
      later(function () { group.classList.add('is-departing'); }, 450);
    }

    baggage.addEventListener('click', answer);
    loadQuestion();
    if (debug.get('debug') === 'checkin' && debug.get('step') === 'complete') {
      lock(true);
      complete();
    }
    return function () {
      disposed = true;
      unbindJourney();
      if (completionAnimation) completionAnimation.cancel();
      if (boardingPass) boardingPass.remove();
      timers.forEach(clearTimeout);
      timers.clear();
      baggage.removeEventListener('click', answer);
      hud.replaceChildren();
    };
  }

  app.checkin = { render };
}(window.AirportRush));
