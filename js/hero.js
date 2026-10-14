/*
 * 英雄裝備站：學認字
 * 流程：英雄打招呼 → 聽字揀卡 ×6（每啱一個，嗰個部位裝返）→ 變身 → 睇字搵部位 ×3 → 英雄飛走
 * 答錯唔罰：張卡 / 部位輕輕搖，再讀一次；錯兩次就提示啱嗰個
 */
const HeroGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const unit = self.WORD_UNIT;
  const LEARN_COUNT = 6, TEST_COUNT = 3;

  // ---------- 記錄（localStorage）：每個字第一下就啱嘅次數 ----------
  const STORE_KEY = 'heroWords.v1';
  let stats = loadStats();
  function loadStats() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; } }
  function saveStats() { try { localStorage.setItem(STORE_KEY, JSON.stringify(stats)); } catch (e) {} }
  function record(id, kind, firstTry) {
    const s = stats[id] || (stats[id] = { hear: 0, hearOk: 0, read: 0, readOk: 0 });
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    saveStats();
  }

  // 揀字：老師未剔（focus）同未熟嘅字排先，加少少隨機
  function pickWords(n) {
    const scored = unit.words.map((w) => {
      const s = stats[w.id];
      const rate = s && s.hear ? s.hearOk / s.hear : 0;
      return { w, score: rate + (w.focus ? 0 : 0.35) + Math.random() * 0.35 };
    });
    return scored.sort((a, b) => a.score - b.score).slice(0, n).map((x) => x.w);
  }

  // ---------- DOM ----------
  const stage = $('#hero-stage'), cardsEl = $('#hero-cards'), againBtn = $('#hero-again');
  put(stage, HeroArt.robot());
  put($('#hero-city'), HeroArt.city());
  put(againBtn, Art.icons.again);
  const partEl = (p) => stage.querySelector(`.part[data-part="${p}"]`);
  const allParts = () => [...stage.querySelectorAll('.part')];

  let token = 0;
  let idleTimer = null;
  let onPartTap = null;

  function restart(el, cls) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }

  // ---------- 開始 ----------
  function start() {
    const tk = ++token;
    Sound.clear();
    document.body.dataset.screen = 'hero';
    document.body.classList.remove('hero-done');
    cleanupBattle();
    stage.className = '';
    cardsEl.replaceChildren();
    const plan = pickWords(LEARN_COUNT);
    // 其他部位已經有；今次要搵嘅部位畀壞蛋偷咗（灰色）
    allParts().forEach((p) => p.classList.remove('off', 'pop', 'hint', 'wiggle'));
    plan.forEach((w) => partEl(w.part).classList.add('off'));
    run(tk, plan);
  }

  async function run(tk, plan) {
    await wait(400);
    if (tk !== token) return;
    await Sound.say(['hero_hi', { pause: 300 }]);
    // 第一部分：聽字揀卡
    for (const w of plan) {
      await askCard(w, tk);
      if (tk !== token) return;
    }
    // 變身
    cardsEl.replaceChildren();
    stage.classList.add('powered');
    Sound.sfx.hatch();
    await Sound.say([{ pause: 300 }, 'hero_power']);
    await wait(1200);
    if (tk !== token) return;
    stage.classList.remove('powered');
    // 第二部分：睇字搵部位（真正認字）
    await Sound.say(['hero_test', { pause: 200 }]);
    for (const w of shuffle(plan).slice(0, TEST_COUNT)) {
      await askPart(w, tk);
      if (tk !== token) return;
    }
    cardsEl.replaceChildren();
    // 獎勵短片：英雄打怪獸
    await battle(tk);
    if (tk !== token) return;
    // 英雄飛走
    stage.classList.add('fly');
    await Sound.say([{ pause: 300 }, 'hero_bye']);
    if (tk !== token) return;
    document.body.classList.add('hero-done');
  }

  // ---------- 獎勵短片：打怪獸（~20 秒，冇閃光；Luca 撳怪獸可以額外發炮） ----------
  let monsterEl = null;
  const heroSvg = () => stage.querySelector('svg');

  function cleanupBattle() {
    document.body.classList.remove('battle');
    if (monsterEl) monsterEl.remove();
    monsterEl = null;
    document.querySelectorAll('.shot, .burst').forEach((e) => e.remove());
  }

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function shoot(onHit) {
    if (!monsterEl) return;
    Sound.sfx.zap();
    const from = center(partEl('heart'));
    const to = center(monsterEl.querySelector('.m-body'));
    const s = document.createElement('div');
    s.className = 'shot';
    put(s, HeroArt.heartShot());
    s.style.left = from.x + 'px';
    s.style.top = from.y + 'px';
    document.body.appendChild(s);
    const done = () => {
      s.remove();
      if (!monsterEl) return;
      const b = document.createElement('div');
      b.className = 'burst';
      b.style.left = to.x + 'px';
      b.style.top = to.y + 'px';
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 700);
      restart(monsterEl.querySelector('.m-body'), 'hit');
      if (onHit) onHit();
    };
    if (!s.animate) return done();
    s.animate([
      { transform: 'translate(0,0) scale(.5)' },
      { transform: `translate(${(to.x - from.x) * 0.6}px, ${(to.y - from.y) * 0.6 - 50}px) scale(1.1)`, offset: 0.6 },
      { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1)` }
    ], { duration: 500, easing: 'ease-out' }).onfinish = done;
  }

  // 每一幕最少播咁耐（冇語音 / 語音好快都唔會趕）
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);

  async function battle(tk) {
    document.body.classList.add('battle');
    monsterEl = document.createElement('div');
    monsterEl.id = 'monster';
    const body = document.createElement('div');
    body.className = 'm-body';
    put(body, HeroArt.monster());
    monsterEl.appendChild(body);
    $('#hero-screen').appendChild(monsterEl);
    body.style.setProperty('--s', 1);
    // Luca 撳怪獸 = 額外發炮（純粹好玩，唔影響流程）
    monsterEl.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !monsterEl.classList.contains('friendly')) shoot(); });

    // 1. 怪獸跳入城市（咚、咚、咚）
    monsterEl.classList.add('enter');
    [300, 900, 1500].forEach((t) => setTimeout(() => { if (tk === token) { Sound.sfx.thump(); restart($('#scene'), 'shake'); } }, t));
    await wait(1900);
    if (tk !== token) return;
    await sayMin(['battle_alarm', { pause: 200 }], 2600);
    if (tk !== token) return;

    // 2. 英雄出動
    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['battle_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    // 3. 愛心炮 ×3：每中一下，怪獸細一個碼
    const sizes = [0.85, 0.7, 0.55];
    for (const sz of sizes) {
      shoot(() => body.style.setProperty('--s', sz));
      await wait(900);
      if (tk !== token) return;
    }

    // 4. 怪獸變返可愛，講對唔住，跳走
    await wait(300);
    monsterEl.classList.add('friendly');
    await sayMin(['battle_sorry', { pause: 200 }], 2600);
    if (tk !== token) return;
    monsterEl.classList.add('leave');
    await wait(1600);
    if (tk !== token) return;
    monsterEl.remove();
    monsterEl = null;

    // 5. 英雄勝利
    stage.classList.add('powered');
    Sound.sfx.hatch();
    await sayMin(['battle_win', { pause: 300 }], 2400);
    if (tk !== token) return;
    stage.classList.remove('powered');
    document.body.classList.remove('battle');
  }

  function praise() { return 'hero_yes_' + (1 + Math.floor(Math.random() * 3)); }

  // 提示：靜咗一陣，再講一次問題
  function armIdle(fn) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn); }, 12000);
  }

  // ---------- 聽字揀卡 ----------
  function askCard(w, tk) {
    return new Promise((resolve) => {
      const others = shuffle(unit.words.filter((x) => x.id !== w.id)).slice(0, 2);
      const choices = shuffle([w, ...others]);
      cardsEl.className = 'mode-choose';
      cardsEl.replaceChildren();
      let misses = 0, done = false;
      const cards = choices.map((c, i) => {
        const b = document.createElement('button');
        b.className = 'wcard';
        b.textContent = c.text;
        b.style.animationDelay = i * 90 + 'ms';
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (c.id === w.id) {
            done = true;
            clearTimeout(idleTimer);
            record(w.id, 'hear', misses === 0);
            cards.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            flyCardToPart(b, w.part);
            Sound.say([{ pause: 450 }, 'word_' + w.id, { pause: 250 }, praise(), { pause: 300 }]).then(resolve);
          } else {
            misses++;
            restart(b, 'wiggle');
            if (!Sound.isBusy()) Sound.say(['hero_find', 'word_' + w.id]);
            if (misses >= 2) cards.find((x) => x.textContent === w.text).classList.add('hint');
          }
        });
        cardsEl.appendChild(b);
        return b;
      });
      const ask = () => Sound.say(['hero_find', 'word_' + w.id]);
      ask();
      armIdle(ask);
    });
  }

  function flyCardToPart(card, part) {
    Sound.sfx.pop();
    const target = partEl(part);
    const from = card.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const land = () => {
      target.classList.remove('off');
      restart(target, 'pop');
      card.style.visibility = 'hidden';
    };
    if (!card.animate) return land();
    card.classList.add('flying');
    const anim = card.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(.35)`, opacity: 0.2 }
    ], { duration: 550, easing: 'ease-in', fill: 'forwards' });
    anim.onfinish = land;
    setTimeout(land, 800);
  }

  // ---------- 睇字搵部位 ----------
  function askPart(w, tk) {
    return new Promise((resolve) => {
      cardsEl.className = 'mode-show';
      const card = document.createElement('div');
      card.className = 'wcard big';
      card.textContent = w.text;
      cardsEl.replaceChildren(card);
      stage.classList.add('asking');
      let misses = 0;
      onPartTap = (p) => {
        if (tk !== token) return;
        const el = partEl(p);
        if (p === w.part) {
          onPartTap = null;
          clearTimeout(idleTimer);
          stage.classList.remove('asking');
          record(w.id, 'read', misses === 0);
          partEl(w.part).classList.remove('hint');
          restart(el, 'pop');
          Sound.sfx.pop();
          restart(card, 'right');
          Sound.say([{ pause: 200 }, 'word_' + w.id, { pause: 250 }, praise(), { pause: 400 }]).then(resolve);
        } else {
          misses++;
          restart(el, 'wiggle');
          if (misses >= 2) partEl(w.part).classList.add('hint');
        }
      };
      const ask = () => Sound.say(['hero_where']);
      ask();
      armIdle(ask);
    });
  }

  stage.addEventListener('pointerdown', (ev) => {
    if (!onPartTap) return;
    const part = ev.target.closest && ev.target.closest('.part');
    if (part) { ev.preventDefault(); onPartTap(part.dataset.part); }
  });

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; onPartTap = null; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'hero') stop(); });
  // 由家長區返嚟：未玩完就重新開始呢一節；玩完咗就淨係顯示返主選單掣
  addEventListener('panel-close', (e) => { if (e.detail === 'hero' && !document.body.classList.contains('hero-done')) start(); });

  function renderStats(tbody) {
    tbody.replaceChildren();
    for (const w of unit.words) {
      const s = stats[w.id] || { hear: 0, hearOk: 0, read: 0, readOk: 0 };
      const tr = document.createElement('tr');
      for (const v of [w.text + (w.focus ? ' ★' : ''), s.hearOk + ' / ' + s.hear, s.readOk + ' / ' + s.read]) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  function resetStats() { stats = {}; saveStats(); }

  // 家長區預覽：淨係播打怪獸短片
  async function playVideo() {
    const tk = ++token;
    Sound.clear();
    cleanupBattle();
    document.body.dataset.screen = 'hero';
    document.body.classList.remove('hero-done');
    stage.className = '';
    cardsEl.replaceChildren();
    allParts().forEach((p) => p.classList.remove('off', 'pop', 'hint', 'wiggle'));
    await wait(300);
    await battle(tk);
    if (tk !== token) return;
    stage.classList.add('fly');
    await Sound.say([{ pause: 300 }, 'hero_bye']);
    if (tk !== token) return;
    document.body.classList.add('hero-done');
  }

  return { start, stop, renderStats, resetStats, playVideo };
})();
