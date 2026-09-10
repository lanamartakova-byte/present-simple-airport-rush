(function (app) {
  'use strict';
  const state = { music: { volume: 0.30, muted: false }, sfx: { volume: 0.40, muted: false } };
  const maxVolume = { music: 0.20, sfx: 0.25 };
  function playbackVolume(channel, fadeFraction = 1) {
    if (state[channel].muted) return 0;
    return Math.max(0, Math.min(maxVolume[channel], state[channel].volume * maxVolume[channel] * fadeFraction));
  }
  const effects = new Map();
  const music = new Audio();
  music.preload = 'none';
  music.src = app.data.sounds.music;
  music.loop = true;
  music.volume = 0;
  let unlocked = false;
  let starting = false;
  let fade = 0;
  let generation = 0;
  let musicFailed = false;

  function stopMusic() {
    generation += 1;
    starting = false;
    cancelAnimationFrame(fade);
    music.pause();
    music.volume = 0;
  }

  music.addEventListener('error', function () {
    musicFailed = true;
    stopMusic();
  });

  async function startMusic() {
    if (!unlocked || musicFailed || state.music.muted || !state.music.volume || starting || !music.paused) return;
    starting = true;
    const token = ++generation;
    music.volume = 0;
    try {
      await music.play();
      if (token !== generation) return;
      starting = false;
      const start = performance.now();
      function tick(now) {
        if (token !== generation) return;
        const fraction = Math.min((now - start) / 900, 1);
        music.volume = playbackVolume('music', fraction);
        fade = fraction < 1 ? requestAnimationFrame(tick) : 0;
      }
      fade = requestAnimationFrame(tick);
    } catch (_) {
      if (token === generation) starting = false;
    }
  }

  function playEffect(name) {
    if (!unlocked || state.sfx.muted || !state.sfx.volume || name === 'music' || !Object.hasOwn(app.data.sounds, name)) return;
    try {
      if (!effects.has(name)) {
        const sound = new Audio(app.data.sounds[name]);
        sound.volume = playbackVolume('sfx');
        sound.preload = 'none';
        sound.addEventListener('error', function () { sound.pause(); });
        effects.set(name, sound);
      }
      const sound = effects.get(name);
      // Reuse each effect, so rapid clicks cannot stack audio instances.
      sound.pause();
      sound.currentTime = 0;
      sound.volume = playbackVolume('sfx');
      sound.muted = state.sfx.muted;
      const playback = sound.play();
      if (playback) playback.catch(function () {});
    } catch (_) {
      // Audio is optional; navigation must remain available on media failure.
    }
  }

  app.audio = {
    unlock() { unlocked = true; startMusic(); },
    playEffect,
    getState(channel) { return { ...state[channel] }; },
    setVolume(channel, value) {
      const volume = Number(value);
      if (!state[channel] || !Number.isFinite(volume)) return;
      state[channel].volume = Math.max(0, Math.min(1, volume));
      if (channel === 'music') {
        if (!state.music.volume) stopMusic();
        else if (!state.music.muted) {
          if (!fade && !starting) music.volume = playbackVolume('music');
          startMusic();
        }
      } else effects.forEach(sound => { sound.volume = playbackVolume('sfx'); });
    },
    toggleMute(channel) {
      state[channel].muted = !state[channel].muted;
      if (channel === 'music') {
        if (state.music.muted) stopMusic();
        else startMusic();
      } else effects.forEach(sound => {
        sound.muted = state.sfx.muted;
        sound.volume = playbackVolume('sfx');
      });
    }
  };
}(window.AirportRush));
