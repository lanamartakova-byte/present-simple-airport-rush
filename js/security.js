(function (app) {
  'use strict';
  const objects = ['suitcase.png', 'suitcase_red.png', 'suitcase_yellow.png', 'security_tray.png', 'backpack.png'];

  function render(container, startStep = 1) {
    const questions = app.data.securityQuestions;
    const step = Number(startStep);
    let index = Number.isInteger(step) && step >= 1 && step <= questions.length ? step - 1 : 0;
    let lives = 3;
    let busy = false;
    let disposed = false;
    const timers = new Set();
    const animations = new Set();
    container.innerHTML = `
      <section class="security-screen" aria-label="Security: Present Simple negative">
        <div class="security-question"><p class="security-instruction">Choose the correct negative form.</p><img class="security-question-art" src="assets/images/question_panel.png" alt=""><span class="security-number"></span><p id="security-sentence" aria-live="polite"></p></div>
        <div class="security-belt-motion" aria-hidden="true"></div>
        <div class="security-options" role="group" aria-labelledby="security-sentence"></div>
        <div class="security-scan" aria-hidden="true"></div>
        <p class="security-feedback" role="status" aria-live="polite"></p>
      </section>`;
    const root = container.querySelector('.security-screen');
    const hud = document.getElementById('screen-hud');
    hud.innerHTML = `<div class="checkin-hud"><img src="assets/images/security_hud.png" alt="SECURITY: Negative"><div class="checkin-lives security-lives" role="status"></div></div>${app.ui.journeyMarkup(1)}`;
    const boardingCheckpoint = hud.querySelector('.journey-item-button');
    boardingCheckpoint.textContent = 'BOARDING PASS ✓';
    const unbindJourney = app.ui.bindJourneyItems(hud);
    const sentence = root.querySelector('#security-sentence');
    const number = root.querySelector('.security-number');
    const options = root.querySelector('.security-options');
    const feedback = root.querySelector('.security-feedback');
    const hearts = hud.querySelector('.security-lives');
    const scan = root.querySelector('.security-scan');

    function later(callback, delay) {
      const timer = setTimeout(function () {
        timers.delete(timer);
        if (!disposed) callback();
      }, delay);
      timers.add(timer);
    }

    function animate(element, frames, duration, done) {
      const animation = element.animate(frames, { duration, easing: 'ease-in-out', fill: 'forwards' });
      animations.add(animation);
      animation.onfinish = function () {
        animations.delete(animation);
        if (!disposed) done();
      };
    }

    function updateLives() {
      hearts.setAttribute('aria-label', `${lives} lives remaining`);
      hearts.innerHTML = Array.from({ length: lives }, () => '<img src="assets/images/heart.png" alt="" aria-hidden="true">').join('');
    }

    function lock(value) {
      busy = value;
      options.querySelectorAll('button').forEach(button => { button.disabled = value; });
    }

    function loadQuestion(focus = false) {
      busy = false;
      feedback.textContent = '';
      feedback.className = 'security-feedback';
      scan.classList.remove('is-scanning');
      sentence.textContent = questions[index].sentence;
      number.textContent = `${index + 1}/${questions.length}`;
      options.replaceChildren();
      // Copy and shuffle indices; the approved strings and grading stay untouched.
      const order = questions[index].options.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      order.forEach((answerIndex, slot) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'security-object';
        button.dataset.answer = answerIndex;
        button.dataset.slot = slot;
        button.style.setProperty('--slot', slot);
        button.setAttribute('aria-label', questions[index].options[answerIndex]);
        const image = document.createElement('img');
        image.src = `assets/images/${objects[(index + slot) % objects.length]}`;
        image.alt = '';
        image.draggable = false;
        const label = document.createElement('span');
        label.textContent = questions[index].options[answerIndex];
        button.append(image, label);
        options.append(button);
      });
      updateLives();
      if (focus) options.querySelector('button').focus({ preventScroll: true });
    }

    function complete() {
      number.hidden = true;
      sentence.textContent = 'SECURITY CLEARED';
      feedback.textContent = '';
      const checkpoint = hud.querySelectorAll('.journey-hud li')[1];
      checkpoint.classList.add('is-collected', 'security-collected');
      checkpoint.textContent = 'SECURITY ✓';
      checkpoint.setAttribute('aria-label', 'Security cleared');
      app.audio.playEffect('reward');
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'completion-panel-hit';
      next.setAttribute('aria-label', 'Continue to Find Your Gate');
      next.addEventListener('click', function (event) {
        event.stopPropagation();
        if (disposed || next.disabled) return;
        next.disabled = true;
        app.audio.unlock();
        app.audio.playEffect('click');
        app.router.show('questions');
      }, { once: true });
      root.querySelector('.security-question').append(next);
    }

    function answer(event) {
      const button = event.target.closest('.security-object');
      if (!button || !options.contains(button) || busy || disposed) return;
      event.stopPropagation();
      app.audio.unlock();
      lock(true);
      if (questions[index].options[Number(button.dataset.answer)] !== questions[index].answer) {
        app.audio.playEffect('wrong');
        lives -= 1;
        updateLives();
        feedback.textContent = 'CHECK AGAIN / INCORRECT';
        feedback.classList.add('is-wrong');
        button.classList.add('is-wrong');
        later(function () {
          if (lives === 0) {
            index = 0;
            lives = 3;
            loadQuestion(true);
          } else {
            button.classList.remove('is-wrong');
            feedback.textContent = '';
            feedback.classList.remove('is-wrong');
            lock(false);
            button.focus({ preventScroll: true });
          }
        }, 1000);
        return;
      }
      app.audio.playEffect('correct');
      button.classList.add('is-selected');
      options.querySelectorAll('button').forEach(other => {
        if (other !== button) other.classList.add('is-waiting');
      });
      const slot = Number(button.dataset.slot);
      // Keep the object's bottom on the belt's perspective line to the curtain.
      // The final short travel is occluded, not lifted or faded above the opening.
      const dx = 843 - (880 + slot * 200);
      const dy = 510 - (640 + slot * 24);
      animate(button, [
        { transform: 'translate(0, 0) scale(1)', clipPath: 'inset(0 0 0 0)' },
        { transform: `translate(${dx}px, ${dy}px) scale(0.60)`, clipPath: 'inset(0 0 0 0)', offset: 0.80 },
        { transform: `translate(${dx - 8}px, ${dy - 10}px) scale(0.56)`, clipPath: 'inset(100% 0 0 0)' }
      ], 1600, function () {
        options.replaceChildren();
        scan.classList.add('is-scanning');
        feedback.textContent = 'SCANNING';
        later(function () {
          scan.classList.remove('is-scanning');
          feedback.textContent = 'CLEARED ✓';
          later(function () {
            if (index === questions.length - 1) complete();
            else { index += 1; loadQuestion(true); }
          }, 650);
        }, 800);
      });
    }

    options.addEventListener('click', answer);
    loadQuestion();
    if (startStep === 'complete') {
      lock(true);
      options.replaceChildren();
      complete();
    }
    return function () {
      disposed = true;
      timers.forEach(clearTimeout);
      timers.clear();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      options.removeEventListener('click', answer);
      unbindJourney();
      hud.replaceChildren();
    };
  }
  app.security = { render };
}(window.AirportRush));
