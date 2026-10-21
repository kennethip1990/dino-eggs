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

  // 揀字：輪流出 —— 一輪入面每個字都出完先再嚟過，咁每個字出現次數平均
  // 同一輪入面，未熟（第一下就啱嘅比率低）嘅字排先，加少少隨機
  const BAG_KEY = 'heroBag.v1';
  function loadBag() { try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]'); } catch (e) { return []; } }
  function saveBag(b) { try { localStorage.setItem(BAG_KEY, JSON.stringify(b)); } catch (e) {} }
  const hearRate = (w) => { const s = stats[w.id]; return s && s.hear ? s.hearOk / s.hear : 0; };
  function pickWords(n) {
    const allIds = unit.words.map((w) => w.id);
    let bag = loadBag().filter((id) => allIds.includes(id));
    const plan = [];
    while (plan.length < n) {
      if (!bag.length) bag = allIds.slice();
      const pool = unit.words.filter((w) => bag.includes(w.id) && !plan.includes(w));
      if (!pool.length) break;
      const take = pool.map((w) => ({ w, score: hearRate(w) + Math.random() * 0.5 }))
        .sort((a, b) => a.score - b.score).slice(0, n - plan.length).map((x) => x.w);
      plan.push(...take);
      bag = bag.filter((id) => !take.some((w) => w.id === id));
    }
    saveBag(bag);
    return shuffle(plan);
  }
  // 考字：今次 6 個入面，考得最少嗰 3 個
  function pickTest(plan, n) {
    return plan.map((w) => ({ w, k: ((stats[w.id] && stats[w.id].read) || 0) + Math.random() * 0.9 }))
      .sort((a, b) => a.k - b.k).slice(0, n).map((x) => x.w);
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
    for (const w of shuffle(pickTest(plan, TEST_COUNT))) {
      await askPart(w, tk);
      if (tk !== token) return;
    }
    cardsEl.replaceChildren();
    // 獎勵短片：5 個結局輪流
    const end = Rewards.next('hero');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('hero', end, 'yue');
    if (tk !== token) return;
    // 英雄飛走
    stage.classList.add('fly');
    await Sound.say([{ pause: 300 }, 'hero_bye']);
    if (tk !== token) return;
    document.body.classList.add('hero-done');
  }

  // ---------- 獎勵短片：5 個結局（~20 秒，冇閃光；Luca 撳壞蛋可以額外攻擊） ----------
  let monsterEl = null;
  let fx = [];                        // 結局用嘅臨時元素，完咗一次過清
  const screenEl = $('#hero-screen');

  function cleanupBattle() {
    document.body.classList.remove('battle');
    screenEl.classList.remove('gloomy', 'hot');
    if (monsterEl) monsterEl.remove();
    monsterEl = null;
    fx.forEach((e) => e.remove());
    fx = [];
    document.querySelectorAll('.shot, .burst, .beam').forEach((e) => e.remove());
  }
  function addFx(cls, markup, parent) {
    const el = document.createElement('div');
    el.className = cls;
    if (markup) put(el, markup);
    (parent || screenEl).appendChild(el);
    if (!parent) fx.push(el);
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

  // 愛心炮：由胸口飛去 target
  function shoot(onHit, target) {
    target = target || (monsterEl && monsterEl.querySelector('.m-body'));
    if (!target) return;
    Sound.sfx.zap();
    const from = center(partEl('heart'));
    const to = center(target);
    const s = document.createElement('div');
    s.className = 'shot';
    put(s, HeroArt.heartShot());
    s.style.left = from.x + 'px';
    s.style.top = from.y + 'px';
    document.body.appendChild(s);
    const done = () => {
      s.remove();
      if (!target.isConnected) return;
      burstAt(to);
      if (target.classList.contains('m-body')) restart(target, 'hit');
      if (onHit) onHit();
    };
    if (!s.animate) return done();
    s.animate([
      { transform: 'translate(0,0) scale(.5)' },
      { transform: `translate(${(to.x - from.x) * 0.6}px, ${(to.y - from.y) * 0.6 - 50}px) scale(1.1)`, offset: 0.6 },
      { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1)` }
    ], { duration: 500, easing: 'ease-out' }).onfinish = done;
  }

  // 光束（太陽光 / 磁力 / 水炮 / 笑笑光）：由胸口射去 target，一條直線閃一閃
  function beam(target, kind, onHit) {
    if (!target || !target.isConnected) return;
    Sound.sfx.beam();
    const from = center(partEl(kind === 'magnet' ? 'body' : 'heart'));
    const to = center(target);
    const len = Math.hypot(to.x - from.x, to.y - from.y);
    const el = document.createElement('div');
    el.className = 'beam ' + kind;
    Object.assign(el.style, { left: from.x + 'px', top: from.y + 'px', width: len + 'px', transform: `rotate(${Math.atan2(to.y - from.y, to.x - from.x)}rad)` });
    document.body.appendChild(el);
    setTimeout(() => { burstAt(to); if (onHit) onHit(); }, 380);
    setTimeout(() => el.remove(), 700);
  }

  // 每一幕最少播咁耐（冇語音 / 語音好快都唔會趕）
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);

  function battle(tk, id) {
    if (id === 'cloud') return battleCloud(tk);
    if (id === 'ufo') return battleUfo(tk);
    if (id === 'volcano') return battleVolcano(tk);
    if (id === 'octopus') return battleOctopus(tk);
    return battleMonster(tk);
  }

  async function heroWins(tk, clip) {
    stage.classList.add('powered');
    Sound.sfx.hatch();
    await sayMin([clip, { pause: 300 }], 2400);
    if (tk !== token) return;
    stage.classList.remove('powered');
    document.body.classList.remove('battle');
  }

  // 結局 1：紫色怪獸（愛心炮）
  async function battleMonster(tk) {
    document.body.classList.add('battle');
    monsterEl = document.createElement('div');
    monsterEl.id = 'monster';
    const body = document.createElement('div');
    body.className = 'm-body';
    put(body, HeroArt.monster());
    monsterEl.appendChild(body);
    screenEl.appendChild(monsterEl);
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
    for (const sz of [0.85, 0.7, 0.55]) {
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
    await heroWins(tk, 'battle_win');
  }

  // 結局 2：黑雲怪落大雨 → 太陽光 ×3 → 白雲 + 彩虹
  async function battleCloud(tk) {
    document.body.classList.add('battle');
    const rb = addFx('rainbow-fx', EndArt.rainbow());
    const rain = addFx('rain-fx');
    const cl = addFx('cloud-fx enter', EndArt.cloud());
    cl.style.setProperty('--dark', 1);
    cl.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !cl.classList.contains('happy')) beam(cl, 'sun'); });
    Sound.sfx.whoosh();
    await wait(1500);
    if (tk !== token) return;
    rain.classList.add('on');
    screenEl.classList.add('gloomy');
    await sayMin(['cloud_alarm', { pause: 200 }], 2800);
    if (tk !== token) return;

    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['cloud_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    for (const d of [0.66, 0.33, 0]) {
      beam(cl, 'sun', () => { cl.style.setProperty('--dark', d); rain.style.opacity = d; restart(cl, 'hit'); });
      await wait(1000);
      if (tk !== token) return;
    }
    rain.classList.remove('on');
    screenEl.classList.remove('gloomy');
    cl.classList.add('happy');
    rb.classList.add('show');
    Sound.sfx.hatch();
    await sayMin(['cloud_happy', { pause: 200 }], 2800);
    if (tk !== token) return;
    await heroWins(tk, 'cloud_win');
  }

  // 結局 3：外星人飛碟吸走大廈 → 磁力 ×3 拉返落嚟 → 外星人講拜拜飛走
  async function battleUfo(tk) {
    document.body.classList.add('battle');
    const scene = addFx('ufo-scene');
    const ufo = addFx('ufo-fx enter', EndArt.ufo(), scene);
    const bd = addFx('building-fx', EndArt.building(), scene);
    ufo.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !ufo.classList.contains('friendly')) beam(bd, 'magnet'); });
    Sound.sfx.whoosh();
    await wait(1500);
    if (tk !== token) return;
    ufo.classList.add('beaming');
    bd.style.setProperty('--lift', 1);
    bd.classList.add('wobble');
    Sound.sfx.whoosh();
    await sayMin(['ufo_alarm', { pause: 200 }], 2800);
    if (tk !== token) return;

    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['ufo_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    for (const l of [0.66, 0.33, 0]) {
      beam(bd, 'magnet', () => bd.style.setProperty('--lift', l));
      await wait(1000);
      if (tk !== token) return;
    }
    ufo.classList.remove('beaming');
    bd.classList.remove('wobble');
    Sound.sfx.thump();
    restart($('#scene'), 'shake');
    await wait(500);
    ufo.classList.add('friendly');
    await sayMin(['ufo_bye', { pause: 200 }], 2800);
    if (tk !== token) return;
    ufo.classList.add('leave');
    Sound.sfx.whoosh();
    await wait(1400);
    if (tk !== token) return;
    await heroWins(tk, 'ufo_win');
  }

  // 結局 4：火山怪噴火球 → 水炮 ×3 → 火山冷靜，開滿花
  async function battleVolcano(tk) {
    document.body.classList.add('battle');
    const vol = addFx('volcano-fx enter', EndArt.volcano());
    vol.style.setProperty('--hot', 1);
    const balls = [-1, 1, -0.5, 0.6].map((dx, i) => {
      const b = addFx('fireball', '', vol);
      b.style.setProperty('--dx', dx);
      b.style.animationDelay = i * 0.4 + 's';
      return b;
    });
    const crater = vol.querySelector('.v-crater');
    vol.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !vol.classList.contains('cool')) beam(crater, 'water'); });
    [400, 1000].forEach((t) => setTimeout(() => { if (tk === token) { Sound.sfx.thump(); restart($('#scene'), 'shake'); } }, t));
    await wait(1600);
    if (tk !== token) return;
    vol.classList.add('erupt');
    screenEl.classList.add('hot');
    await sayMin(['vol_alarm', { pause: 200 }], 2800);
    if (tk !== token) return;

    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['vol_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    for (const h of [0.66, 0.33, 0]) {
      beam(crater, 'water', () => {
        vol.style.setProperty('--hot', h);
        const b = balls.pop();
        if (b) b.remove();
        if (!h) balls.splice(0).forEach((x) => x.remove());
        restart(vol, 'hit');
      });
      await wait(1000);
      if (tk !== token) return;
    }
    vol.classList.remove('erupt');
    screenEl.classList.remove('hot');
    vol.classList.add('cool');
    Sound.sfx.hatch();
    await sayMin(['vol_cool', { pause: 200 }], 2800);
    if (tk !== token) return;
    await heroWins(tk, 'vol_win');
  }

  // 結局 5：大八爪魚捉走巴士同私家車 → 笑笑光 ×3（痕到放手）→ 揮手游走
  async function battleOctopus(tk) {
    document.body.classList.add('battle');
    const oc = addFx('octo-fx enter', EndArt.octopus());
    const head = oc.querySelector('.o-head');
    oc.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !oc.classList.contains('friendly')) beam(head, 'tickle', () => restart(oc, 'giggle')); });
    Sound.sfx.bubble();
    await wait(1700);
    if (tk !== token) return;
    oc.classList.add('grab');
    await sayMin(['oct_alarm', { pause: 200 }], 2800);
    if (tk !== token) return;

    restart(stage, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['oct_go', { pause: 100 }], 2200);
    if (tk !== token) return;

    for (const drop of ['bus', 'car', null]) {
      beam(head, 'tickle', () => {
        restart(oc, 'giggle');
        Sound.sfx.boing();
        if (drop) oc.classList.add('drop-' + drop);
      });
      await wait(1000);
      if (tk !== token) return;
    }
    oc.classList.remove('grab');
    oc.classList.add('friendly');
    Sound.sfx.hatch();
    await sayMin(['oct_laugh', { pause: 200 }], 3000);
    if (tk !== token) return;
    oc.classList.add('leave');
    Sound.sfx.bubble();
    await wait(1400);
    if (tk !== token) return;
    await heroWins(tk, 'oct_win');
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

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    cleanupBattle();
    document.body.dataset.screen = 'hero';
    document.body.classList.remove('hero-done');
    stage.className = '';
    cardsEl.replaceChildren();
    allParts().forEach((p) => p.classList.remove('off', 'pop', 'hint', 'wiggle'));
    await wait(300);
    await battle(tk, id);
    if (tk !== token) return;
    stage.classList.add('fly');
    await Sound.say([{ pause: 300 }, 'hero_bye']);
    if (tk !== token) return;
    document.body.classList.add('hero-done');
  }

  return { start, stop, renderStats, resetStats, playVideo };
})();
