(function (app) {
  'use strict';
  const state = { music: { volume: 0.30, muted: false }, sfx: { volume: 0.40, muted: false } };
  const maxVolume = { music: 0.20, sfx: 0.25 };
  function playbackVolume(channel, fadeFraction = 1) {
    if (state[channel].muted) return 0;
    return Math.max(0, Math.min(maxVolume[channel], state[channel].volume * maxVolume[channel] * fadeFraction));
  }
  const effects = new Map();
  const effectBuffers = new Map();
  const activeEffects = new Map();
  let effectContext;
  let effectGain;
  function unlockEffects() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      if (!effectContext) {
        effectContext = new Context();
        effectGain = effectContext.createGain();
        effectGain.gain.value = playbackVolume('sfx');
        effectGain.connect(effectContext.destination);
      }
      if (effectContext.state === 'suspended') effectContext.resume().catch(function () {});
    } catch (_) { /* Keep the media-element fallback available. */ }
  }
  const music = new Audio();
  music.preload = 'none';
  music.src = app.data.sounds.music;
  music.loop = true;
  music.volume = 0;
  let unlocked = false;
  let starting = false;
  let fade = 0;
  let generation = 0;

  function stopMusic() {
    generation += 1;
    starting = false;
    cancelAnimationFrame(fade);
    music.pause();
    music.volume = 0;
  }

  music.addEventListener('error', function () {
    stopMusic();
  });

  async function startMusic() {
    if (!unlocked || state.music.muted || !state.music.volume || starting || !music.paused) return;
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
    if (effectContext && effectGain) {
      // Reuse decoded buffers; the context is resumed by real user gestures.
      if (!effectBuffers.has(name)) {
        effectBuffers.set(name, fetch(app.data.sounds[name])
          .then(response => { if (!response.ok) throw new Error('Audio unavailable'); return response.arrayBuffer(); })
          .then(bytes => effectContext.decodeAudioData(bytes))
          .catch(error => { effectBuffers.delete(name); throw error; }));
      }
      const token = {};
      const previous = activeEffects.get(name);
      if (previous && previous.source) previous.source.stop();
      activeEffects.set(name, token);
      effectBuffers.get(name).then(buffer => {
        if (activeEffects.get(name) !== token || effectContext.state !== 'running' || state.sfx.muted || !state.sfx.volume) return;
        const source = effectContext.createBufferSource();
        source.buffer = buffer;
        source.loop = false;
        source.connect(effectGain);
        token.source = source;
        source.onended = () => { source.disconnect(); if (activeEffects.get(name) === token) activeEffects.delete(name); };
        source.start();
      }).catch(function () {});
      return;
    }
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
    unlock() {
      unlocked = true;
      unlockEffects();
      // A transient load/autoplay failure must not disable later gestures.
      if (music.error) music.load();
      startMusic();
    },
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
      } else {
        if (effectGain) effectGain.gain.value = playbackVolume('sfx');
        effects.forEach(sound => { sound.volume = playbackVolume('sfx'); });
      }
    },
    toggleMute(channel) {
      state[channel].muted = !state[channel].muted;
      if (channel === 'sfx' && effectGain) effectGain.gain.value = playbackVolume('sfx');
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
