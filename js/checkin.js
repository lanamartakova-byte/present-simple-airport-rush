(function (app) {
  'use strict';
  const suitcases = ['suitcase.png', 'suitcase_red.png', 'suitcase_yellow.png'];

  function render(container) {
    const questions = app.data.checkinQuestions;
    let index = 0;
    let lives = 3;
    let busy = false;
    let disposed = false;
    const timers = new Set();
    let completionAnimation;
    let boardingPass;
    let lastCorrectSlot = -1;
    let correctSlotStreak = 0;
    container.innerHTML = `
      <section class="checkin-screen" aria-label="Check-in: Affirmative">
        <div class="checkin-question"><p class="checkin-instruction">Choose the correct verb.</p><img class="question-panel-art" src="assets/images/question_panel.png" alt=""><span class="checkin-question-number"></span><p id="checkin-sentence" aria-live="polite"></p><p class="checkin-feedback" role="status"></p></div>
        <div class="checkin-baggage" role="group" aria-labelledby="checkin-sentence"></div>
      </section>`;
    const root = container.querySelector('.checkin-screen');
    const hud = document.getElementById('screen-hud');
    hud.innerHTML = `<div class="checkin-hud"><img src="assets/images/checkin_hud.png" alt="CHECK-IN: Affirmative"><div class="checkin-lives" role="status" aria-label="3 lives remaining"></div></div>${app.ui.journeyMarkup(0)}`;
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
      hearts.innerHTML = Array.from({ length: lives }, () => '<img src="assets/images/heart.png" alt="" aria-hidden="true">').join('');
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
      let correctSlot = optionOrder.findIndex(optionIndex => questions[index].options[optionIndex] === questions[index].answer);
      if (correctSlot === lastCorrectSlot && correctSlotStreak >= 2) {
        const otherSlots = optionOrder.map((_, slot) => slot).filter(slot => slot !== correctSlot);
        const nextSlot = otherSlots[Math.floor(Math.random() * otherSlots.length)];
        [optionOrder[correctSlot], optionOrder[nextSlot]] = [optionOrder[nextSlot], optionOrder[correctSlot]];
        correctSlot = nextSlot;
      }
      correctSlotStreak = correctSlot === lastCorrectSlot ? correctSlotStreak + 1 : 1;
      lastCorrectSlot = correctSlot;
      baggage.innerHTML = '';
      const group = document.createElement('div');
      group.className = 'suitcase-group';
      baggage.append(group);
      optionOrder.forEach((approvedIndex, optionIndex) => {
        const option = questions[index].options[approvedIndex];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'suitcase-answer';
        button.dataset.option = approvedIndex;
        button.setAttribute('aria-label', option);
        button.style.setProperty('--slot', optionIndex);
        const img = document.createElement('img');
        img.src = `assets/images/${suitcases[optionIndex % suitcases.length]}`;
        img.alt = '';
        img.draggable = false;
        const label = document.createElement('span');
        label.className = 'suitcase-label';
        const labelImage = document.createElement('img');
        labelImage.src = 'assets/images/answer_label.png';
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
      boardingPass.src = 'assets/images/boarding_pass.png';
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
            lastCorrectSlot = -1;
            correctSlotStreak = 0;
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
