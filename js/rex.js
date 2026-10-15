/*
 * Super Rex 救動物：學英文（全英文）
 * 流程：Super Rex 出場 → 聽音撳泡泡 ×4 → 睇字撳泡泡 ×3（救返嘅動物去農場）
 *       → 數腳：two legs / four legs 分類 ×4 → 打怪獸短片 → 拜拜
 * 答錯唔罰：泡泡輕輕搖 + 嗰隻動物叫一聲，再講一次問題；錯兩次就提示啱嗰個
 */
const RexGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.ANIMAL_UNIT;
  const LISTEN = 4, READ = 3, LEGS = 4;

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'rexAnimals.v1';
  let stats = loadStats();
  function loadStats() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; } }
  function saveStats() { try { localStorage.setItem(STORE_KEY, JSON.stringify(stats)); } catch (e) {} }
  const blank = () => ({ hear: 0, hearOk: 0, read: 0, readOk: 0, legs: 0, legsOk: 0 });
  function record(id, kind, firstTry) {
    const s = stats[id] || (stats[id] = blank());
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    saveStats();
  }

  // 揀動物：未熟嘅排先，加少少隨機
  function pickPlan() {
    const scored = unit.animals.map((a) => {
      const s = stats[a.id] || blank();
      const n = s.hear + s.read;
      const rate = n ? (s.hearOk + s.readOk) / n : 0;
      return { a, score: rate + Math.random() * 0.4 };
    });
    return scored.sort((x, y) => x.score - y.score).slice(0, LISTEN + READ).map((x) => x.a);
  }

  // 數腳：最少一隻兩隻腳、一隻四隻腳；盡量用啱啱救返嘅
  function pickLegs(plan) {
    const saved = plan.filter((a) => a.legs > 0);
    const pool = (n, from) => shuffle(from.filter((a) => a.legs === n));
    const two = pool(2, saved)[0] || pool(2, unit.animals)[0];
    const four = pool(4, saved)[0] || pool(4, unit.animals)[0];
    const rest = shuffle(saved.filter((a) => a !== two && a !== four)).slice(0, LEGS - 2);
    return shuffle([two, four, ...rest]);
  }

  // ---------- DOM ----------
  const screen = $('#rex-screen'), stage = $('#rex-stage'), play = $('#rex-play');
  const saved = $('#rex-saved'), againBtn = $('#rex-again');
  put(stage, RexArt.rex());
  put($('#rex-farm-art'), RexArt.farm());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  let onPenTap = null;

  function armIdle(fn) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn); }, 12000);
  }
  function praise() { return 'rex_yes_' + (1 + Math.floor(Math.random() * 3)); }

  // Super Rex 吼一聲（張大口 + 頭擰一擰）
  function roar(withSound) {
    restart(stage, 'roaring');
    if (withSound) Sound.sfx.roar();
    clearTimeout(roar.t);
    roar.t = setTimeout(() => stage.classList.remove('roaring'), 900);
  }

  function reset() {
    document.body.dataset.screen = 'rex';
    document.body.classList.remove('rex-done');
    cleanupBattle();
    stage.className = '';
    play.className = '';
    play.replaceChildren();
    saved.replaceChildren();
    saved.classList.remove('cheer');
  }

  // ---------- 開始 ----------
  function start() {
    const tk = ++token;
    Sound.clear();
    reset();
    run(tk, pickPlan());
  }

  async function run(tk, plan) {
    stage.classList.add('flyin');
    Sound.sfx.whoosh();
    await wait(1100);
    if (tk !== token) return;
    roar(true);
    await Sound.say(['rex_hi', { pause: 250 }, 'rex_intro', { pause: 300 }]);
    if (tk !== token) return;
    // 第一部分：聽音撳泡泡
    for (const a of plan.slice(0, LISTEN)) {
      await askBubble(a, 'hear', tk);
      if (tk !== token) return;
    }
    // 第二部分：睇字撳泡泡
    play.replaceChildren();
    await Sound.say([{ pause: 200 }, 'rex_read', { pause: 200 }]);
    if (tk !== token) return;
    for (const a of plan.slice(LISTEN, LISTEN + READ)) {
      await askBubble(a, 'read', tk);
      if (tk !== token) return;
    }
    // 第三部分：數腳分類
    play.replaceChildren();
    await Sound.say([{ pause: 200 }, 'rex_legs', { pause: 200 }]);
    if (tk !== token) return;
    buildPens();
    for (const a of pickLegs(plan)) {
      await askLegs(a, tk);
      if (tk !== token) return;
    }
    await wait(500);
    if (tk !== token) return;
    play.replaceChildren();
    // 數完腳嘅動物返去農場
    saved.querySelectorAll('.away').forEach((el) => el.classList.remove('away'));
    // 獎勵短片：3 個結局輪流
    const end = Rewards.next('rex');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('rex', end, 'en');
    if (tk !== token) return;
    await finale(tk);
  }

  async function finale(tk) {
    saved.classList.add('cheer');
    stage.classList.add('fly');
    Sound.sfx.whoosh();
    await Sound.say([{ pause: 300 }, 'rex_bye']);
    if (tk !== token) return;
    document.body.classList.add('rex-done');
  }

  // ---------- 泡泡（聽音 / 睇字） ----------
  function askBubble(a, kind, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-bubbles' + (kind === 'read' ? ' reading' : '');
      play.replaceChildren();
      let card = null;
      if (kind === 'read') {
        card = document.createElement('div');
        card.className = 'rcard';
        card.textContent = a.word;
        play.appendChild(card);
      }
      const row = document.createElement('div');
      row.className = 'bubbles';
      play.appendChild(row);
      const others = shuffle(unit.animals.filter((x) => x.id !== a.id)).slice(0, 2);
      let misses = 0, done = false;
      const bubbles = shuffle([a, ...others]).map((c, i) => {
        const b = document.createElement('button');
        b.className = 'bubble';
        b.dataset.id = c.id;
        b.setAttribute('aria-label', c.word);
        b.style.animationDelay = i * 110 + 'ms, ' + (-i * 0.9) + 's';
        put(b, RexArt.animal(c.id));
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (c.id === a.id) {
            done = true;
            clearTimeout(idleTimer);
            record(a.id, kind, misses === 0);
            bubbles.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            if (card) restart(card, 'right');
            Sound.clear();
            rescue(b, a);
            Sound.say([{ pause: 250 }, 'snd_' + a.id, { pause: 200 }, 'an_' + a.id, { pause: 250 }, praise(), { pause: 400 }]).then(resolve);
          } else {
            misses++;
            restart(b, 'wiggle');
            Sound.sfx.soft();
            if (!Sound.isBusy()) Sound.say(['snd_' + c.id, { pause: 350 }, 'rex_where_' + a.id]);
            if (misses >= 2) bubbles.find((x) => x.dataset.id === a.id).classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      const ask = () => Sound.say([kind === 'hear' ? 'rex_where_' + a.id : 'rex_read_q']);
      ask();
      // 睇字：靜咗一陣就讀埋個字出嚟（唔會卡住）
      armIdle(() => Sound.say(['rex_where_' + a.id]));
    });
  }

  // 泡泡爆開 → 動物飛去底下農場
  function rescue(b, a) {
    roar(false);
    Sound.sfx.bubble();
    b.classList.remove('hint');
    b.classList.add('popped');
    const el = savedAnimal(a);
    setTimeout(() => {
      const from = b.querySelector('svg').getBoundingClientRect();
      saved.appendChild(el);
      b.style.visibility = 'hidden';
      flip(el, from, 700);
    }, 650);
  }

  function savedAnimal(a) {
    const el = document.createElement('div');
    el.className = 'saved-animal';
    el.dataset.id = a.id;
    put(el, RexArt.animal(a.id));
    return el;
  }

  // 由 from 個位置飛去 el 而家個位置
  function flip(el, from, ms) {
    const to = el.getBoundingClientRect();
    if (!el.animate || !to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = from.width / to.width;
    el.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(${(1 + s) / 2})`, offset: 0.5 },
      { transform: 'translate(0,0) scale(1)' }
    ], { duration: ms, easing: 'ease-in-out' });
  }

  // ---------- 數腳 ----------
  let showEl = null;
  const pens = {};
  function buildPens() {
    play.className = 'mode-legs';
    play.replaceChildren();
    showEl = document.createElement('div');
    showEl.className = 'show';
    const row = document.createElement('div');
    row.className = 'pens';
    for (const n of [2, 4]) {
      const p = document.createElement('button');
      p.className = 'pen';
      p.dataset.legs = n;
      p.setAttribute('aria-label', n === 2 ? 'two legs' : 'four legs');
      const sign = document.createElement('div');
      sign.className = 'pen-sign';
      put(sign, RexArt.legSign(n));
      const inside = document.createElement('div');
      inside.className = 'pen-in';
      p.append(sign, inside);
      p.addEventListener('pointerdown', (ev) => { ev.preventDefault(); if (onPenTap) onPenTap(n, p); });
      pens[n] = p;
      row.appendChild(p);
    }
    play.append(showEl, row);
  }

  // 逐隻腳發光，同時讀 one, two, three…（重用恐龍 game 嘅 en_1..en_4）
  function countItems(svg, n) {
    const legs = [...svg.querySelectorAll('.leg')];
    const items = [];
    legs.slice(0, n).forEach((leg, i) => items.push({ fn: () => leg.classList.add('count') }, 'en_' + (i + 1), { pause: 200 }));
    items.push({ fn: () => legs.forEach((l) => l.classList.remove('count')) });
    return items;
  }

  function askLegs(a, tk) {
    return new Promise((resolve) => {
      put(showEl, RexArt.animal(a.id));
      restart(showEl, 'in');
      // 由農場行出嚟
      let inFarm = saved.querySelector(`.saved-animal[data-id="${a.id}"]`);
      if (inFarm) flip(showEl, inFarm.getBoundingClientRect(), 600);
      else { inFarm = savedAnimal(a); saved.appendChild(inFarm); }   // 未救過嘅（例如冇兩隻腳）都放入農場
      inFarm.classList.add('away');
      let misses = 0, busy = false;
      onPenTap = (n, pen) => {
        if (busy || tk !== token) return;
        const svg = showEl.querySelector('svg');
        if (n === a.legs) {
          busy = true;
          onPenTap = null;
          clearTimeout(idleTimer);
          record(a.id, 'legs', misses === 0);
          Object.values(pens).forEach((p) => p.classList.remove('hint'));
          Sound.clear();
          Sound.say([
            ...countItems(svg, a.legs), { pause: 100 }, 'legs_' + a.legs,
            { fn: () => { if (tk === token) moveToPen(a, pen); } },
            { pause: 300 }, praise(), { pause: 400 }
          ]).then(resolve);
        } else {
          misses++;
          busy = true;
          restart(pen, 'wiggle');
          Sound.sfx.soft();
          Sound.clear();
          Sound.say(['rex_count', { pause: 200 }, ...countItems(svg, a.legs), { pause: 100 }, 'legs_' + a.legs]).then(() => {
            busy = false;
            if (tk === token) pens[a.legs].classList.add('hint');
          });
        }
      };
      const ask = () => Sound.say(['an_' + a.id, { pause: 200 }, 'rex_legs_q']);
      ask();
      armIdle(() => Sound.say(['rex_legs_q']));
    });
  }

  function moveToPen(a, pen) {
    Sound.sfx.pop();
    const from = showEl.querySelector('svg').getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'pen-animal';
    put(el, RexArt.animal(a.id));
    pen.querySelector('.pen-in').appendChild(el);
    showEl.replaceChildren();
    flip(el, from, 600);
    restart(pen, 'got');
  }

  // ---------- 獎勵短片：3 個結局（~20 秒） ----------
  let monsterEl = null;
  let fx = [];
  function cleanupBattle() {
    document.body.classList.remove('rex-battle');
    if (monsterEl) monsterEl.remove();
    monsterEl = null;
    fx.forEach((e) => e.remove());
    fx = [];
    saved.classList.remove('scared', 'whirl', 'drop');
    document.querySelectorAll('.roar-wave, .burst').forEach((e) => e.remove());
  }
  function addFx(cls, markup) {
    const el = document.createElement('div');
    el.className = cls;
    if (markup) put(el, markup);
    screen.appendChild(el);
    fx.push(el);
    return el;
  }
  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function burstAt(p) {
    const b = document.createElement('div');
    b.className = 'burst';
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }

  // 吼聲波：由 Super Rex 個頭飛去 target
  function roarShot(onHit, target) {
    target = target || (monsterEl && monsterEl.querySelector('.m-body'));
    if (!target || !target.isConnected) return;
    roar(true);
    const from = center(stage.querySelector('.rex-head'));
    const to = center(target);
    const w = document.createElement('div');
    w.className = 'roar-wave';
    put(w, RexArt.roarWave());
    w.style.left = from.x + 'px';
    w.style.top = from.y + 'px';
    const ang = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    document.body.appendChild(w);
    const done = () => {
      w.remove();
      if (!target.isConnected) return;
      burstAt(to);
      if (target.classList.contains('m-body')) restart(target, 'hit');
      if (onHit) onHit();
    };
    if (!w.animate) return done();
    w.animate([
      { transform: `rotate(${ang}deg) scale(.4)`, opacity: 1 },
      { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) rotate(${ang}deg) scale(1.3)`, opacity: .9 }
    ], { duration: 550, easing: 'ease-out' }).onfinish = done;
  }

  function battle(tk, id) {
    if (id === 'tornado') return battleTornado(tk);
    if (id === 'meteor') return battleMeteor(tk);
    return battleMonster(tk);
  }

  async function rexWins(tk) {
    stage.classList.add('powered');
    saved.classList.add('cheer');
    Sound.sfx.hatch();
    await sayMin(['rbat_win', { pause: 300 }], 2400);
    if (tk !== token) return;
    stage.classList.remove('powered');
    document.body.classList.remove('rex-battle');
  }

  // 結局 1：紫色怪獸（大吼）
  async function battleMonster(tk) {
    document.body.classList.add('rex-battle');
    monsterEl = document.createElement('div');
    monsterEl.id = 'monster';
    const body = document.createElement('div');
    body.className = 'm-body';
    put(body, HeroArt.monster());
    monsterEl.appendChild(body);
    screen.appendChild(monsterEl);
    body.style.setProperty('--s', 1);
    monsterEl.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !monsterEl.classList.contains('friendly')) roarShot(); });

    // 1. 怪獸跳入嚟，農場啲動物驚到縮埋
    monsterEl.classList.add('enter');
    saved.classList.add('scared');
    [300, 900, 1500].forEach((t) => setTimeout(() => { if (tk === token) { Sound.sfx.thump(); restart($('#scene'), 'shake'); } }, t));
    await wait(1900);
    if (tk !== token) return;
    await sayMin(['rbat_alarm', { pause: 200 }], 2600);
    if (tk !== token) return;

    // 2. Super Rex 準備
    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['rbat_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    // 3. 大吼 ×3：每中一下，怪獸細一個碼
    for (const sz of [0.85, 0.7, 0.55]) {
      roarShot(() => body.style.setProperty('--s', sz));
      await wait(1000);
      if (tk !== token) return;
    }

    // 4. 怪獸變乖，講對唔住，跳走
    await wait(300);
    monsterEl.classList.add('friendly');
    saved.classList.remove('scared');
    await sayMin(['rbat_sorry', { pause: 200 }], 2600);
    if (tk !== token) return;
    monsterEl.classList.add('leave');
    await wait(1600);
    if (tk !== token) return;
    monsterEl.remove();
    monsterEl = null;
    await rexWins(tk);
  }

  // 結局 2：龍捲風吹起啲動物 → 擰尾 ×3 → 龍捲風冇咗，動物「boing」跌返落嚟
  async function battleTornado(tk) {
    document.body.classList.add('rex-battle');
    const t = addFx('tornado-fx enter', EndArt.tornado());
    t.style.setProperty('--s', 1);
    t.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !t.classList.contains('gone')) roarShot(null, t); });
    Sound.sfx.whoosh();
    await wait(1400);
    if (tk !== token) return;
    saved.classList.add('whirl');
    Sound.sfx.whoosh();
    await sayMin(['torn_alarm', { pause: 200 }], 2600);
    if (tk !== token) return;

    restart(stage, 'ready');
    await sayMin(['torn_go', { pause: 100 }], 2000);
    if (tk !== token) return;

    for (const sz of [0.72, 0.45, 0.2]) {
      restart(stage, 'spin');
      Sound.sfx.whoosh();
      await wait(450);
      roarShot(() => t.style.setProperty('--s', sz), t);
      await wait(900);
      if (tk !== token) return;
    }
    t.classList.add('gone');
    await wait(500);
    // 動物逐隻跌返落嚟
    saved.classList.remove('whirl');
    saved.classList.add('drop');
    [...saved.children].forEach((el, i) => setTimeout(() => { if (tk === token) Sound.sfx.boing(); }, 250 + i * 160));
    await sayMin(['torn_safe', { pause: 200 }], 2800);
    if (tk !== token) return;
    saved.classList.remove('drop');
    await rexWins(tk);
  }

  // 結局 3：大隕石飛埋嚟 → Super Rex 跳上去用頭頂 ×3 → 爆開變星星
  async function battleMeteor(tk) {
    document.body.classList.add('rex-battle');
    const m = addFx('meteor-fx enter', EndArt.meteor());
    m.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token) restart(m, 'hit'); });
    Sound.sfx.whoosh();
    await wait(1800);
    if (tk !== token) return;
    saved.classList.add('scared');
    await sayMin(['met_alarm', { pause: 200 }], 2600);
    if (tk !== token) return;

    restart(stage, 'ready');
    await sayMin(['met_go', { pause: 100 }], 1800);
    if (tk !== token) return;

    for (let i = 0; i < 3; i++) {
      await jumpAt(m, i === 2 ? 1 : 0.8, () => {
        Sound.sfx.thump();
        burstAt(center(m));
        if (i < 2) restart(m, 'hit');
        else starBurst(m, tk);
      });
      if (tk !== token) return;
      await wait(250);
    }
    saved.classList.remove('scared');
    await sayMin(['met_stars', { pause: 200 }], 2800);
    if (tk !== token) return;
    await rexWins(tk);
  }

  // Super Rex 跳去 target 個方向，頂一下再跌返落嚟
  function jumpAt(target, reach, onBonk) {
    const svg = stage.querySelector('svg');
    const from = center(stage.querySelector('.rex-head'));
    const to = center(target);
    const dx = (to.x - from.x) * reach * 0.75, dy = (to.y - from.y) * reach * 0.9;
    roar(true);
    setTimeout(onBonk, 380);
    if (!svg.animate) return wait(800);
    return new Promise((r) => {
      svg.animate([
        { transform: 'translate(0,0)' },
        { transform: `translate(${dx}px, ${dy}px) rotate(-8deg)`, offset: 0.45 },
        { transform: `translate(${dx * 0.9}px, ${dy * 0.85}px)`, offset: 0.55 },
        { transform: 'translate(0,0)' }
      ], { duration: 850, easing: 'ease-in-out' }).onfinish = r;
      setTimeout(r, 1100);
    });
  }

  // 隕石爆開：星星四散，再跌落農場
  function starBurst(m, tk) {
    const c = center(m);
    m.classList.add('gone');
    Sound.sfx.hatch();
    const cols = ['#ffd36e', '#ffb3c7', '#9fd3ff', '#a6e3a0', '#c7a3ff'];
    const farm = $('#rex-farm').getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const s = addFx('star-fx', EndArt.star(cols[i % cols.length]));
      s.style.left = c.x + 'px';
      s.style.top = c.y + 'px';
      if (!s.animate) continue;
      const ang = (i / 10) * Math.PI * 2;
      const ox = Math.cos(ang) * 160, oy = Math.sin(ang) * 120;
      const lx = farm.left + farm.width * (0.08 + 0.84 * Math.random()) - c.x;
      const ly = farm.top + farm.height * (0.15 + 0.3 * Math.random()) - c.y;
      s.animate([
        { transform: 'translate(0,0) scale(.3) rotate(0)' },
        { transform: `translate(${ox}px, ${oy}px) scale(1.2) rotate(180deg)`, offset: 0.35 },
        { transform: `translate(${lx}px, ${ly}px) scale(.8) rotate(360deg)` }
      ], { duration: 1800 + i * 60, easing: 'ease-in-out', fill: 'forwards' });
    }
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; onPenTap = null; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'rex') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'rex' && !document.body.classList.contains('rex-done')) start(); });

  function renderStats(tbody) {
    tbody.replaceChildren();
    for (const a of unit.animals) {
      const s = stats[a.id] || blank();
      const tr = document.createElement('tr');
      for (const v of [a.word, s.hearOk + ' / ' + s.hear, s.readOk + ' / ' + s.read, a.legs ? s.legsOk + ' / ' + s.legs : '—']) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  function resetStats() { stats = {}; saveStats(); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    for (const a of shuffle(unit.animals).slice(0, 5)) saved.appendChild(savedAnimal(a));
    await wait(300);
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo };
})();
