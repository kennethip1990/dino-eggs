/* 遊戲流程：開始 → 每局（介紹 → 搵蛋 → 孵化慶祝）× N → 瞓覺 */
(() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  // 放入自家嘅靜態 SVG（Art.*），唔會有外來內容
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));

  // ---------- 進度（localStorage） ----------
  const STORE_KEY = 'dinoEggs.v1';
  const DEFAULTS = { level: 5, streak: 0, rounds: 5, dino: 'trex' };
  const MIN_EGGS = 3, MAX_EGGS = 10, LEVEL_UP_AFTER = 2;
  let progress = load();
  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {} }

  // ---------- DOM ----------
  const scene = $('#scene'), field = $('#field'), slots = $('#slots');
  const mamaEl = $('#mama'), homeEl = $('#home');
  put($('#bg'), Art.background());
  put($('#night'), Art.night());
  if (!Art.SPECIES.includes(progress.dino)) progress.dino = 'trex';
  put(mamaEl, Art.mama(progress.dino));
  put($('#nest-art'), Art.nest());
  put($('#again-btn'), Art.icons.again);
  put($('#parent-icon'), Art.icons.gear);

  // ---------- 狀態 ----------
  let round = null;        // { n, eggs:[], picked, token, warmup }
  let roundToken = 0;
  let sessionRound = 0;
  let hintTimer = null;

  function setScreen(name) { document.body.dataset.screen = name; }

  // ---------- 開始畫面：揀恐龍 ----------
  const picker = $('#picker');
  const NAMES = { brachio: '腕龍', trex: '暴龍', trice: '三角龍' };
  let picking = false;
  for (const sp of Art.SPECIES) {
    const b = document.createElement('button');
    b.className = 'pick';
    b.dataset.sp = sp;
    b.setAttribute('aria-label', NAMES[sp]);
    put(b, Art.mama(sp));
    b.addEventListener('click', () => pick(sp, b));
    picker.appendChild(b);
  }
  function markChosen() {
    for (const b of picker.children) b.classList.toggle('chosen', b.dataset.sp === progress.dino);
  }
  markChosen();

  // 撳恐龍 = 開始（呢個 tap 同時解鎖聲音）
  async function pick(sp, btn) {
    if (picking) return;
    picking = true;
    prepare();
    progress.dino = sp;
    save();
    markChosen();
    btn.classList.add('picked');
    put(mamaEl, Art.mama(sp));
    // 讀出恐龍名：「暴龍……T-Rex」；錄音最多等 1.5 秒
    await Promise.race([Sound.loadRecordings(), wait(1500)]);
    await Sound.say(['yue_dino_' + sp, { pause: self.VOICES.gapMs }, 'en_dino_' + sp, { pause: 300 }]);
    btn.classList.remove('picked');
    picking = false;
    begin();
  }

  function begin() {
    document.body.classList.remove('show-again');
    scene.classList.remove('is-night');
    setScreen('play');
    sessionRound = 0;
    nextRound();
  }

  // 每個 tap 開始都做：解鎖聲音、全螢幕、唔熄 mon、攔 back 掣
  function prepare() {
    Sound.unlock();
    goFullscreen();
    keepAwake();
    trapBack();
  }

  // ---------- 主選單：恐龍搵蛋 / 英雄裝備站 ----------
  put($('#go-dino'), `<div class="choose-art">${Art.mama('trex')}</div><div class="choose-egg">${Art.egg(1)}</div>`);
  put($('#go-hero'), `<div class="choose-art">${HeroArt.icon()}</div>`);
  $('#go-dino').addEventListener('click', () => { prepare(); setScreen('start'); });
  $('#go-hero').addEventListener('click', async () => {
    prepare();
    await Promise.race([Sound.loadRecordings(), wait(1500)]);
    HeroGame.start();
  });

  function goHome() {
    Sound.clear();
    roundToken++;
    HeroGame.stop();
    clearField();
    document.body.classList.remove('show-again', 'hero-done');
    scene.classList.remove('is-night');
    setScreen('menu');
    keepAwake();
  }
  window.App = { goHome };
  put($('#picker-home'), Art.icons.home);
  $('#picker-home').addEventListener('click', goHome);

  // 再玩：返主選單
  $('#again-btn').addEventListener('click', goHome);

  function eggsForRound() {
    // 每節第一局 warm-up：少一隻
    const n = sessionRound === 0 ? progress.level - 1 : progress.level;
    return Math.max(MIN_EGGS, Math.min(MAX_EGGS, n));
  }

  async function nextRound() {
    if (sessionRound >= progress.rounds) return goToSleep();
    const token = ++roundToken;
    const n = eggsForRound();
    round = { n, eggs: [], picked: 0, token, warmup: sessionRound === 0 };
    clearField();
    buildSlots(n);
    placeEggs(n);
    // 蛋逐隻彈出
    round.eggs.forEach((e, i) => setTimeout(() => e.el.classList.add('in'), 120 * i));
    await wait(200);
    if (token !== roundToken) return;
    talk(true);
    await Sound.say(['yue_intro_' + n, { pause: self.VOICES.gapMs }, 'en_intro_' + n]);
    if (token !== roundToken) return;
    talk(false);
    armHint();
  }

  // ---------- 佈局 ----------
  function eggSize() {
    const s = Math.min(innerWidth, innerHeight);
    return Math.round(Math.max(88, Math.min(140, s * 0.15)));
  }

  function playArea() {
    const W = innerWidth, H = innerHeight;
    const home = homeEl.getBoundingClientRect();
    const pad = 16;
    // 盡量喺地平線以下（唔好有蛋浮喺天空）；位唔夠先用返上面
    let top = Math.max(76, H * 0.3);
    const bottom = W >= H ? H - pad : home.top - pad;
    if (bottom - top < eggSize() * 3) top = 76;
    if (W >= H) return { x: home.right + pad, y: top, w: W - home.right - pad * 2, h: H - top - pad };
    return { x: pad, y: top, w: W - pad * 2, h: home.top - top - pad };
  }

  function placeEggs(n) {
    const S = eggSize();
    const P = playArea();
    const pts = [];
    let minD = S * 1.25;
    for (let i = 0; i < n; i++) {
      let p = null;
      for (let t = 0; t < 400 && !p; t++) {
        if (t && t % 100 === 0) minD *= 0.88;  // 空間唔夠就放寬
        const c = { fx: Math.random(), fy: Math.random() };
        const x = c.fx * (P.w - S), y = c.fy * (P.h - S * 1.24);
        if (pts.every((q) => Math.hypot(q.x - x, q.y - y) >= minD)) p = Object.assign(c, { x, y });
      }
      pts.push(p || { fx: Math.random(), fy: Math.random(), x: 0, y: 0 });
    }
    // 大約 4 成嘅蛋有草叢 / 石頭遮住底部少少
    const hideCount = Math.round(n * 0.4);
    pts.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'egg';
      put(el, Art.egg(i));
      const egg = { el, fx: p.fx, fy: p.fy, idx: i, state: 'idle', cover: null };
      if (i < hideCount) {
        const cv = document.createElement('div');
        cv.className = 'cover';
        put(cv, Math.random() < 0.6 ? Art.bush() : Art.rock());
        egg.cover = cv;
        egg.coverSide = rand(-0.25, 0.25);
        field.appendChild(cv);
      }
      el.addEventListener('pointerdown', (ev) => { ev.preventDefault(); tapEgg(egg); });
      field.insertBefore(el, field.firstChild);   // 蛋喺 cover 後面
      round.eggs.push(egg);
    });
    layoutEggs();
  }

  function layoutEggs() {
    if (!round) return;
    const S = eggSize();
    const P = playArea();
    for (const e of round.eggs) {
      if (e.state === 'done') continue;
      const x = P.x + e.fx * Math.max(0, P.w - S);
      const y = P.y + e.fy * Math.max(0, P.h - S * 1.24);
      Object.assign(e.el.style, { width: S + 'px', height: S * 1.24 + 'px', left: x + 'px', top: y + 'px' });
      if (e.cover) {
        const cw = S * 1.15;
        Object.assign(e.cover.style, {
          width: cw + 'px', height: cw * 0.58 + 'px',
          left: x + S / 2 - cw / 2 + e.coverSide * S + 'px',
          top: y + S * 1.24 - cw * 0.5 + 'px'
        });
      }
    }
  }
  addEventListener('resize', layoutEggs);

  function buildSlots(n) {
    slots.replaceChildren();
    slots.dataset.n = n;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('div');
      s.className = 'slot';
      slots.appendChild(s);
    }
  }

  function clearField() {
    field.replaceChildren();
    slots.replaceChildren();
    clearTimeout(hintTimer);
  }

  // ---------- 撳蛋 ----------
  function tapEgg(egg) {
    if (!round || egg.state !== 'idle') return;
    egg.state = 'picked';
    egg.el.classList.add('picked');
    if (egg.cover) egg.cover.classList.add('fade');
    Sound.sfx.soft();
    armHint();
    const token = round.token;
    const n = ++round.picked;
    // 蛋要等輪到佢個數字先飛入巢，數字同蛋一定對得上
    Sound.say([
      { fn: () => { if (token === roundToken) flyToNest(egg, n); } },
      { pause: 180 },
      'yue_' + n, { pause: self.VOICES.gapMs }, 'en_' + n, { pause: 250 }
    ]).then(() => {
      if (token === roundToken && n === round.n) celebrate(token);
    });
  }

  function flyToNest(egg, n) {
    Sound.sfx.pop();
    const slot = slots.children[n - 1];
    const from = egg.el.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.height / from.height;
    egg.el.classList.add('flying');
    const land = () => {
      if (egg.state === 'done') return;
      egg.state = 'done';
      egg.el.remove();
      put(slot, Art.egg(egg.idx));
      slot.classList.add('filled');
    };
    if (!egg.el.animate) return land();
    const anim = egg.el.animate([
      { transform: 'translate(0,0) scale(1.08)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(${(1 + scale) / 2})`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }
    ], { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
    anim.onfinish = land;
    setTimeout(land, 900);  // 保險
  }

  // ---------- 慶祝 ----------
  async function celebrate(token) {
    clearTimeout(hintTimer);
    await wait(350);
    if (token !== roundToken) return;
    const n = round.n;
    [...slots.children].forEach((s, i) => setTimeout(() => {
      if (token !== roundToken) return;
      put(s, Art.baby(i, progress.dino));
      s.classList.add('hatched');
      if (i % 3 === 0) Sound.sfx.hatch();
    }, 160 * i));
    await wait(160 * n + 300);
    if (token !== roundToken) return;
    mamaEl.classList.add('happy');
    talk(true);
    const praise = 'praise_' + (1 + Math.floor(Math.random() * 4));
    await Sound.say(['yue_total_' + n, { pause: self.VOICES.gapMs }, 'en_total_' + n, { pause: 450 }, praise]);
    if (token !== roundToken) return;
    talk(false);
    mamaEl.classList.remove('happy');

    // 升級：warm-up 局唔計；同一 level 完成 LEVEL_UP_AFTER 局就 +1
    if (!round.warmup) {
      progress.streak++;
      if (progress.streak >= LEVEL_UP_AFTER && progress.level < MAX_EGGS) {
        progress.level++;
        progress.streak = 0;
      }
    }
    sessionRound++;
    save();

    await wait(900);
    if (token !== roundToken) return;
    slots.classList.add('leaving');
    await wait(700);
    slots.classList.remove('leaving');
    if (token !== roundToken) return;
    nextRound();
  }

  // ---------- 結束：去瞓覺 ----------
  async function goToSleep() {
    const token = ++roundToken;
    round = null;
    clearField();
    // 三隻恐龍BB喺巢入面瞓覺
    buildSlots(3);
    [...slots.children].forEach((s, i) => { put(s, Art.baby(i, progress.dino)); s.classList.add('hatched'); });
    scene.classList.add('is-night');
    setScreen('sleep');
    await wait(1200);
    if (token !== roundToken) return;
    await Sound.say(['yue_bye', { pause: self.VOICES.gapMs }, 'en_bye']);
    if (token !== roundToken) return;
    document.body.classList.add('show-again');
    releaseAwake();
  }

  // ---------- 提示：靜咗一陣，未搵到嘅蛋輕輕搖 ----------
  function wiggle(el) {
    el.classList.remove('wiggle');
    void el.offsetWidth;
    el.classList.add('wiggle');
  }
  function armHint() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      if (!round) return;
      if (Sound.isBusy()) return armHint();
      round.eggs.filter((e) => e.state === 'idle').forEach((e, i) => setTimeout(() => wiggle(e.el), i * 150));
      armHint();
    }, 9000);
  }

  // 撳背景：冇負面聲，只係附近嗰隻蛋搖一搖
  field.addEventListener('pointerdown', (ev) => {
    if (ev.target !== field || !round) return;
    let best = null, bestD = Infinity;
    for (const e of round.eggs) {
      if (e.state !== 'idle') continue;
      const r = e.el.getBoundingClientRect();
      const d = Math.hypot(r.left + r.width / 2 - ev.clientX, r.top + r.height / 2 - ev.clientY);
      if (d < bestD) { bestD = d; best = e; }
    }
    if (best && bestD < eggSize() * 2.2) wiggle(best.el);
  });

  function talk(on) { mamaEl.classList.toggle('talking', on); }

  // ---------- 全螢幕 / 唔熄 mon / 防 back 掣 ----------
  const standalone = () => matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone;
  function goFullscreen() {
    if (standalone() || document.fullscreenElement) return;
    const el = document.documentElement;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) return;
    try { const p = fn.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }
  let wakeLock = null;
  async function keepAwake() {
    try {
      if ('wakeLock' in navigator && !wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (e) {}
  }
  function releaseAwake() { try { if (wakeLock) wakeLock.release(); } catch (e) {} wakeLock = null; }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && /^(play|hero)$/.test(document.body.dataset.screen)) keepAwake();
  });
  let trapped = false;
  function trapBack() {
    if (trapped) return;
    trapped = true;
    history.pushState({ dino: 1 }, '');
    addEventListener('popstate', () => {
      history.pushState({ dino: 1 }, '');
      wiggle(mamaEl);
    });
  }
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---------- 家長區：長按 3 秒 ----------
  const pBtn = $('#parent-btn'), panel = $('#parent-panel');
  let holdTimer = null;
  pBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pBtn.classList.add('holding');
    holdTimer = setTimeout(() => { pBtn.classList.remove('holding'); openPanel(); }, 3000);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => pBtn.addEventListener(t, () => {
    clearTimeout(holdTimer);
    pBtn.classList.remove('holding');
  }));

  let resumeAfterPanel = null;
  function openPanel() {
    Sound.unlock();
    Sound.loadRecordings().then(renderPanel);
    Sound.refreshVoices();
    roundToken++;                       // 暫停遊戲
    resumeAfterPanel = document.body.dataset.screen;
    dispatchEvent(new CustomEvent('panel-open'));
    Sound.clear();
    talk(false);
    renderPanel();
    panel.hidden = false;
  }
  $('#panel-close').addEventListener('click', () => {
    Sound.clear();
    panel.hidden = true;
    // 本來喺遊戲中 → 重新開始呢一局
    if (resumeAfterPanel === 'play') nextRound();
    if (resumeAfterPanel === 'sleep') document.body.classList.add('show-again');
    dispatchEvent(new CustomEvent('panel-close', { detail: resumeAfterPanel }));
  });
  $('#p-hero-video').addEventListener('click', () => {
    Sound.clear();
    panel.hidden = true;
    roundToken++;
    clearField();
    scene.classList.remove('is-night');
    document.body.classList.remove('show-again');
    HeroGame.playVideo();
  });
  $('#p-hero-reset').addEventListener('click', () => {
    if (!confirm('重設英雄認字記錄？')) return;
    HeroGame.resetStats();
    renderPanel();
  });

  function renderPanel() {
    const st = Sound.status();
    $('#p-level').textContent = progress.level;
    $('#p-rounds').textContent = progress.rounds;
    HeroGame.renderStats($('#p-hero-stats'));
    $('#p-yue').textContent = st.yueVoice ? '✅ ' + st.yueVoice : '⚠️ 搵唔到廣東話語音';
    $('#p-yue-help').hidden = !!st.yueVoice;
    $('#p-en').textContent = st.enVoice ? '✅ ' + st.enVoice : '⚠️ 搵唔到英文語音（會用系統預設）';
    $('#p-rec').textContent = st.recorded.length + ' / ' + st.totalKeys;
    $('#p-voices').textContent = st.allVoices.filter((v) => /^(zh|yue|en)/i.test(v)).join('\n') || '（未偵測到）';
    const sel = $('#p-key');
    const rec = new Set(st.recorded);
    const keep = sel.value;
    sel.replaceChildren();
    for (const [k, c] of Object.entries(self.VOICES.clips)) {
      const o = document.createElement('option');
      o.value = k;
      o.textContent = (rec.has(k) ? '🎙 ' : '🤖 ') + k + ' — ' + c.text;
      sel.appendChild(o);
    }
    if (keep) sel.value = keep;
  }

  $('#p-play').addEventListener('click', () => { Sound.clear(); Sound.say([$('#p-key').value]); });
  $('#p-count').addEventListener('click', () => {
    Sound.clear();
    const seq = [];
    for (let i = 1; i <= 10; i++) seq.push('yue_' + i, { pause: self.VOICES.gapMs }, 'en_' + i, { pause: 400 });
    Sound.say(seq);
  });
  $('#p-stop').addEventListener('click', () => Sound.clear());
  const bump = (field, d, lo, hi) => () => {
    progress[field] = Math.max(lo, Math.min(hi, progress[field] + d));
    if (field === 'level') progress.streak = 0;
    save(); renderPanel();
  };
  $('#p-level-dn').addEventListener('click', bump('level', -1, MIN_EGGS, MAX_EGGS));
  $('#p-level-up').addEventListener('click', bump('level', +1, MIN_EGGS, MAX_EGGS));
  $('#p-rounds-dn').addEventListener('click', bump('rounds', -1, 2, 10));
  $('#p-rounds-up').addEventListener('click', bump('rounds', +1, 2, 10));
  $('#p-reset').addEventListener('click', () => {
    if (!confirm('重設進度？（返去 5 隻蛋開始）')) return;
    progress = Object.assign({}, DEFAULTS, { dino: progress.dino });
    save(); renderPanel();
  });

  // ---------- Service worker ----------
  // localhost 開發時唔用（除非網址加 ?sw=1），免得 cache 住舊 code
  const devHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !/[?&]sw=1/.test(location.search);
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    if (devHost) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
    else {
      addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {}));
      // 新版 service worker 接手 → 如果仲喺開始畫面就即刻 reload 用新版（玩緊就唔打擾）
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController && document.body.dataset.screen === 'start') location.reload();
      });
    }
  }
  // 預先 load 錄音（AudioContext 未解鎖都可以 decode）
  Sound.loadRecordings();
})();
