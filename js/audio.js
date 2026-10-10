/*
 * 聲音引擎
 * - 一條 queue：所有語音逐段播，永遠唔會兩段重疊
 * - 每個 key：先用 audio/<key>.mp3（Web Audio 預先 decode），冇就用 Web Speech
 * - unlock()：要喺「開始」掣嘅 tap handler 入面 call
 */
const Sound = (() => {
  const V = self.VOICES;
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  const buffers = {};          // key -> AudioBuffer（有錄音先有）
  let loadPromise = null;
  const voices = { yue: null, en: null };
  let voiceListReady = false;

  const queue = [];            // { key } | { pause } | { fn }
  let running = false;
  let generation = 0;          // clear() 時 +1，令舊 item 作廢
  let current = null;          // 而家播緊嘅嘢，用嚟中斷
  const idleWaiters = [];

  function getCtx() {
    if (!ctx && AC) {
      try { ctx = new AC(); } catch (e) { ctx = null; }
    }
    return ctx;
  }

  // ---------- 錄音載入 ----------
  function loadRecordings() {
    if (loadPromise) return loadPromise;
    const c = getCtx();
    if (!c) return (loadPromise = Promise.resolve(0));
    const keys = Object.keys(V.clips);
    loadPromise = Promise.all(keys.map(async (key) => {
      try {
        const res = await fetch(V.audioDir + key + V.ext, { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.arrayBuffer();
        if (!data.byteLength) return;
        buffers[key] = await new Promise((ok, bad) => c.decodeAudioData(data, ok, bad));
      } catch (e) { /* 冇檔或者 decode 失敗 → 用 TTS */ }
    })).then(() => Object.keys(buffers).length);
    return loadPromise;
  }

  // ---------- 內置語音 ----------
  const norm = (s) => (s || '').toLowerCase().replace(/_/g, '-');
  function pickVoices() {
    if (!('speechSynthesis' in window)) return;
    const list = speechSynthesis.getVoices() || [];
    if (list.length) voiceListReady = true;
    for (const lang of ['yue', 'en']) {
      const cfg = V.langs[lang];
      const byLang = (codes) => {
        for (const code of codes) {
          const local = list.filter((v) => norm(v.lang) === code || norm(v.lang).startsWith(code + '-'));
          if (local.length) return local.find((v) => v.localService) || local[0];
        }
        return null;
      };
      let v = byLang(cfg.match);
      if (!v && cfg.nameHints.length) {
        v = list.find((x) => cfg.nameHints.some((h) => norm(x.name).includes(h))) || null;
      }
      if (!v && cfg.fallbackMatch) v = byLang(cfg.fallbackMatch);
      voices[lang] = v;
    }
  }
  if ('speechSynthesis' in window) {
    pickVoices();
    speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pickVoices);
    // 有啲 Android 版本唔 fire voiceschanged，poll 幾次
    let tries = 0;
    const poll = setInterval(() => { pickVoices(); if (voiceListReady || ++tries > 20) clearInterval(poll); }, 250);
  }

  function speakTTS(key) {
    const clip = V.clips[key];
    return new Promise((resolve) => {
      if (!clip || !('speechSynthesis' in window)) return resolve();
      const cfg = V.langs[clip.lang];
      const u = new SpeechSynthesisUtterance(clip.text);
      u.lang = cfg.ttsLang;
      if (voices[clip.lang]) u.voice = voices[clip.lang];
      u.rate = cfg.rate;
      u.pitch = cfg.pitch;
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(watchdog); resolve(); };
      u.onend = finish;
      u.onerror = finish;
      // 有啲 engine 唔 fire onend：按字數估時間做保險
      const est = 1500 + clip.text.length * (clip.lang === 'yue' ? 450 : 150);
      const watchdog = setTimeout(finish, Math.min(est, 8000));
      current = { stop: () => { speechSynthesis.cancel(); finish(); } };
      speechSynthesis.speak(u);
    });
  }

  function playBuffer(key) {
    return new Promise((resolve) => {
      const c = getCtx();
      const src = c.createBufferSource();
      src.buffer = buffers[key];
      const gain = c.createGain();
      gain.gain.value = 1;
      src.connect(gain).connect(c.destination);
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(watchdog); resolve(); };
      src.onended = finish;
      const watchdog = setTimeout(finish, buffers[key].duration * 1000 + 1500);
      current = { stop: () => { try { src.stop(); } catch (e) {} finish(); } };
      src.start();
    });
  }

  function playKey(key) {
    if (buffers[key] && ctx && ctx.state === 'running') return playBuffer(key);
    return speakTTS(key);
  }

  // ---------- Queue ----------
  async function pump() {
    if (running) return;
    running = true;
    while (queue.length) {
      const item = queue.shift();
      const gen = generation;
      if (item.fn) { try { item.fn(); } catch (e) { console.error(e); } }
      else if (item.pause) await new Promise((r) => setTimeout(r, item.pause));
      else if (item.key) await playKey(item.key);
      current = null;
      if (gen !== generation) break;
    }
    running = false;
    if (!queue.length) idleWaiters.splice(0).forEach((r) => r());
    if (queue.length) pump();
  }

  /** 加一串嘢入 queue。items: 'key' | {pause:ms} | {fn} ；回傳 Promise（呢串播完時 resolve） */
  function say(items) {
    return new Promise((resolve) => {
      for (const it of items) queue.push(typeof it === 'string' ? { key: it } : it);
      queue.push({ fn: resolve });
      pump();
    });
  }

  /** 中斷而家播緊嘅嘢 + 清空 queue（例如家長區、轉畫面） */
  function clear() {
    generation++;
    queue.length = 0;
    if (current) current.stop();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    idleWaiters.splice(0).forEach((r) => r());
  }

  const isBusy = () => running || queue.length > 0;
  const whenIdle = () => isBusy() ? new Promise((r) => idleWaiters.push(r)) : Promise.resolve();

  // ---------- 解鎖（一定要喺 tap handler 入面 call） ----------
  function unlock() {
    const c = getCtx();
    if (c) {
      if (c.state !== 'running') c.resume();
      try { // 播一個無聲 buffer
        const b = c.createBuffer(1, 1, 22050);
        const s = c.createBufferSource();
        s.buffer = b; s.connect(c.destination); s.start(0);
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
    // iOS 17+：唔受靜音掣影響
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  }

  // ---------- 合成音效（輕柔，唔使檔案） ----------
  function tone(freqFrom, freqTo, dur, type, vol, delay) {
    const c = getCtx();
    if (!c || c.state !== 'running') return;
    const t0 = c.currentTime + (delay || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freqFrom, t0);
    o.frequency.exponentialRampToValueAtTime(freqTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }
  const sfx = {
    pop()   { tone(520, 880, 0.18, 'sine', 0.12); },
    hatch() { tone(784, 784, 0.35, 'triangle', 0.07); tone(988, 988, 0.4, 'triangle', 0.06, 0.12); tone(1175, 1175, 0.5, 'triangle', 0.05, 0.24); },
    soft()  { tone(440, 520, 0.25, 'sine', 0.05); }
  };

  return {
    unlock, loadRecordings, say, clear, isBusy, whenIdle, sfx, playKey,
    status() {
      return {
        recorded: Object.keys(buffers).slice().sort(),
        totalKeys: Object.keys(V.clips).length,
        yueVoice: voices.yue ? voices.yue.name + ' (' + voices.yue.lang + ')' : null,
        enVoice: voices.en ? voices.en.name + ' (' + voices.en.lang + ')' : null,
        voiceListReady,
        allVoices: ('speechSynthesis' in window) ? speechSynthesis.getVoices().map((v) => v.lang + ' · ' + v.name) : [],
        ttsSupported: 'speechSynthesis' in window
      };
    },
    refreshVoices: pickVoices
  };
})();
