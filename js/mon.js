/*
 * Luca 怪獸收集隊：數學（廣東話，十至十四；老師話 10+1、10+2 概念要加強）
 * 核心教具 = 球盒（十格框 2 × 5）：一盒裝滿 = 十，之後由十開始數落去（count on），唔使由一數起
 * 流程（一局約 3 分鐘）：揀怪獸拍檔（4 隻，冇啱錯）
 *   → ① 執球入盒 ×1：撳 10 粒球，逐粒數「一……十」→ 一盒 = 十
 *   → ② 幾多粒球 ×3：一盒 + 幾粒散球，揀數字（3 張數字卡；干擾 = 個位數（13 揀咗 3）+ 隔籬數）
 *   → ③ 邊個係 ×2：聽數字，揀啱嗰堆球（干擾 = 冇盒淨係散球 + 多一粒 / 少一粒）
 *   → ④ 孵蛋 ×1：盒蓋埋 = 十，撳蛋由十一數落去，數到就孵（每日第一隻蛋一定係新怪獸）
 *   → 怪獸圖鑑（未捉到 = 黑影）→ 拍檔玩夠 3 次進化 → 拜拜
 * 即時獎勵：② ③ 每答啱一題就捉一隻怪獸（掟星星球：向上撥或者撳都得）
 * 只加唔扣（同光之巨人 / 時光機一樣）：第一下就啱 = 一粒星 + 有機會捉到閃閃怪獸；答錯冇扣，
 *   幾多粒球答錯 → 示範一次「呢盒係十，十一、十二……」先畀再揀；邊個係答錯 → 讀多次題目；錯兩次啱嗰個發光
 */
const MonGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const U = self.MON_UNIT;
  const COUNT = 3, WHICH = 2, STARS = COUNT + WHICH;
  const SHINY_ODDS = 0.25;

  // ---------- 記錄（localStorage） ----------
  const STATS_KEY = 'monStats.v1', DEX_KEY = 'monDex.v1';
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const freshDex = () => ({ caught: {}, pals: {}, evo: {}, eggDay: '', sessions: 0, allStars: 0 });
  let stats = load(STATS_KEY, {});
  let dex = Object.assign(freshDex(), load(DEX_KEY, {}));
  const blankStat = () => ({ count: 0, countOk: 0, which: 0, whichOk: 0, ones: 0 });
  const st = (n) => Object.assign(blankStat(), stats[n]);
  function record(n, kind, firstTry) {
    const s = stats[n] = st(n);
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    store(STATS_KEY, stats);
  }
  function recordOnes(n) { const s = stats[n] = st(n); s.ones++; store(STATS_KEY, stats); }
  const saveDex = () => store(DEX_KEY, dex);
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  // 平均輪流（bag）+ 未熟嘅數排先
  function fromBag(key, all, n) {
    if (n <= 0) return [];
    let bag = load(key, []).filter((x) => all.includes(x));
    if (bag.length < n) bag = bag.concat(shuffle(all.filter((x) => !bag.includes(x))));
    store(key, bag.slice(n));
    return bag.slice(0, n);
  }
  function chooseNums(kind, pool, n) {
    const pri = shuffle(pool.filter((x) => U.focus.includes(x) && st(x)[kind + 'Ok'] < 2)).slice(0, n - 1);
    const rest = fromBag('monBag_' + kind + '.v1', pool.filter((x) => !pri.includes(x)), n - pri.length);
    return shuffle([...pri, ...rest]);
  }

  // ---------- 揀邊隻野生怪獸出現 ----------
  const caughtWild = () => U.wild.filter((id) => dex.caught[id]);
  function pickNew() {
    const left = U.wild.filter((id) => !dex.caught[id]);
    if (!left.length) return null;
    const bag = left.flatMap((id) => U.rare.includes(id) ? [id] : [id, id, id]);
    return pick(bag);
  }
  // 每局 5 隻（② ③）：隨機 2 個位係新怪獸，其他係捉過嘅（閃閃機會）→ 圖鑑唔會一日爆晒
  // 第一次玩（圖鑑空）：第 1 隻 + 2 個位 = 3 隻新，第一印象要夠多驚喜
  let newPlan = [];
  function planCatches() {
    const slots = [0, 1, 2, 3, 4];
    const fresh = caughtWild().length ? shuffle(slots).slice(0, 2) : [0, ...shuffle([1, 2, 3, 4]).slice(0, 2)];
    newPlan = slots.map((i) => fresh.includes(i));
  }
  function nextWild(i) {
    const want = newPlan[i];
    const nw = want ? pickNew() : null;
    if (nw) return nw;
    const old = caughtWild();
    return old.length ? pick(old) : (pickNew() || pick(U.wild));
  }

  // ---------- DOM ----------
  const screen = $('#mon-screen'), palEl = $('#mn-pal'), play = $('#mon-play'), meterEl = $('#mon-meter'), againBtn = $('#mon-again');
  put($('#mon-bg'), MonArt.background());
  put(againBtn, Art.icons.again);

  let token = 0, idleTimer = null, lock = false, armId = 0;
  let pal = 'cat';
  let sessionNew = [];
  const dbg = { target: null, stars: () => meterEl.querySelectorAll('.mn-cell.on').length };   // 開發測試

  function arm() {
    lock = true;
    const my = ++armId;
    setTimeout(() => { if (armId === my) lock = false; }, 600);
  }
  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => pick(['tm_yes_1', 'tm_yes_2', 'tm_yes_3']);
  function pose(el, cls, ms) {
    restart(el, cls);
    clearTimeout(el['_' + cls]);
    el['_' + cls] = setTimeout(() => el.classList.remove(cls), ms || 900);
  }
  function setPal(sp) {
    pal = sp;
    palEl.dataset.sp = sp;
    put(palEl, MonArt.monster(sp, { evo: !!dex.evo[sp] }));
  }
  function center(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function burstAt(p, big) {
    const b = document.createElement('div');
    b.className = 'jd-burst' + (big ? ' big' : '');
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }

  function reset() {
    document.body.dataset.screen = 'mon';
    document.body.classList.remove('mon-done');
    screen.className = '';
    palEl.className = '';
    play.className = '';
    play.replaceChildren();
    meterEl.replaceChildren();
    meterEl.hidden = true;
    meterEl.className = '';
    lock = false;
    dbg.target = null;
    document.querySelectorAll('.mn-fly').forEach((e) => e.remove());
  }

  // ---------- 星（只加唔扣） ----------
  function buildMeter(n) {
    meterEl.hidden = false;
    put(meterEl, Array.from({ length: n }, () => `<span class="mn-cell">${MonArt.hudStar()}</span>`).join(''));
    meterEl.querySelectorAll('.mn-cell').forEach((s, i) => { s.style.animationDelay = i * 80 + 'ms'; restart(s, 'in'); });
  }
  function gainStar(fromEl) {
    const cell = meterEl.querySelector('.mn-cell:not(.on)');
    if (!cell) return;
    const done = () => { restart(cell, 'on'); Sound.sfx.zap(); };
    if (!fromEl || !fromEl.isConnected || !fromEl.animate) return done();
    const a = center(fromEl), b = center(cell);
    const o = document.createElement('div');
    o.className = 'mn-fly mn-spark';
    o.style.left = a.x + 'px';
    o.style.top = a.y + 'px';
    document.body.appendChild(o);
    o.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y}px)) scale(.6)` }],
      { duration: 650, easing: 'cubic-bezier(.5,0,.6,1)' }).onfinish = () => { o.remove(); done(); };
    setTimeout(() => { if (o.isConnected) { o.remove(); done(); } }, 1200);
  }
  const meterFull = () => !meterEl.querySelector('.mn-cell:not(.on)');

  // ---------- 球盒（十格框 2 × 5）+ 散球 ----------
  const BALL = MonArt.ball();
  function boxEl(filled, cls) {
    const b = document.createElement('div');
    b.className = 'mn-box' + (cls ? ' ' + cls : '');
    put(b, Array.from({ length: 10 }, (_, i) => `<span class="mn-slot">${i < filled ? BALL : ''}</span>`).join('') + '<b class="mn-ten">10</b>');
    if (filled >= 10) b.classList.add('full');
    return b;
  }
  function looseEl(k, cls) {
    const t = document.createElement('div');
    t.className = 'mn-loose' + (cls ? ' ' + cls : '');
    put(t, Array.from({ length: k }, () => `<span class="mn-lb">${BALL}</span>`).join(''));
    return t;
  }
  // 一堆球：有盒（= 十）+ k 粒散球
  function groupEl(hasBox, k, cls) {
    const g = document.createElement('div');
    g.className = 'mn-group' + (cls ? ' ' + cls : '');
    if (hasBox) g.appendChild(boxEl(10));
    if (k || !hasBox) g.appendChild(looseEl(k));
    return g;
  }

  // ---------- 開始 ----------
  function start(opts) {
    const tk = ++token;
    Sound.clear();
    reset();
    run(tk, (opts && opts.from) || 1);
  }

  async function run(tk, from) {
    sessionNew = [];
    planCatches();
    Sound.sfx.whoosh();
    await wait(700);
    if (tk !== token) return;
    await Sound.say(['mn_hi', { pause: 250 }, 'mn_rule', { pause: 300 }]);
    if (tk !== token) return;
    await pickPal(tk);
    if (tk !== token) return;
    buildMeter(STARS);
    let ci = 0;
    if (from <= 1) {
      await fillBox(tk);
      if (tk !== token) return;
    }
    if (from <= 2) {
      const nums = chooseNums('count', U.nums, COUNT);
      await Sound.say([{ pause: 200 }, 'mn_s2', { pause: 250 }]);
      for (const n of nums) {
        if (tk !== token) return;
        const first = await askCount(n, tk);
        if (tk !== token) return;
        await catchOne(tk, nextWild(ci++), first);
      }
    } else ci = COUNT;
    if (tk !== token) return;
    if (from <= 3) {
      const nums = chooseNums('which', U.nums, WHICH);
      await Sound.say([{ pause: 200 }, 'mn_s3', { pause: 250 }]);
      for (const n of nums) {
        if (tk !== token) return;
        const first = await askWhich(n, tk);
        if (tk !== token) return;
        await catchOne(tk, nextWild(ci++), first);
      }
    }
    if (tk !== token) return;
    if (meterFull()) {
      dex.allStars++;
      saveDex();
      Sound.sfx.hatch();
      restart(meterEl, 'perfect');
      await sayMin([{ pause: 200 }, 'mn_all_star', { pause: 300 }], 2000);
      if (tk !== token) return;
    }
    await eggRun(tk);
    if (tk !== token) return;
    dex.sessions++;
    saveDex();
    await showDex(tk);
    if (tk !== token) return;
    await partnerGrow(tk);
    if (tk !== token) return;
    await finale(tk);
  }

  // 揀拍檔：冇啱錯（俾 Luca 有選擇權）；進化咗嘅會見到進化造型
  function pickPal(tk) {
    return new Promise((resolve) => {
      play.className = 'mode-pal';
      palEl.classList.add('hide');
      const row = document.createElement('div');
      row.className = 'mn-pals';
      let done = false;
      const btns = U.partners.map((sp, i) => {
        const b = document.createElement('button');
        b.className = 'mn-palbtn p-' + sp;
        b.style.animationDelay = i * 110 + 'ms';
        put(b, `<span class="pb-art">${MonArt.monster(sp, { evo: !!dex.evo[sp] })}</span><span class="pb-txt"></span>`);
        b.querySelector('.pb-txt').textContent = U.names[sp];
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          done = true;
          clearTimeout(idleTimer);
          dbg.target = null;
          Sound.clear();
          btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
          restart(b, 'right');
          Sound.sfx.bubble();
          setPal(sp);
          Sound.say([{ pause: 150 }, 'mn_n_' + sp, { pause: 200 }, 'mn_go', { pause: 250 }]).then(() => {
            play.replaceChildren();
            play.className = '';
            palEl.classList.remove('hide');
            palEl.classList.add('in');
            pose(palEl, 'hop', 900);
            resolve(sp);
          });
        });
        row.appendChild(b);
        return b;
      });
      play.replaceChildren(row);
      dbg.target = btns[0];
      Sound.say(['mn_pick_q']);
      armIdle(() => Sound.say(['mn_pick_q']));
    });
  }

  // ① 執球入盒：撳 10 粒球，逐粒飛入格、讀「一……十」
  function fillBox(tk) {
    return new Promise((resolve) => {
      play.className = 'mode-fill';
      const box = boxEl(0, 'big');
      const pile = document.createElement('div');
      pile.className = 'mn-pile';
      play.replaceChildren(box, pile);
      restart(box, 'in');
      const slots = [...box.querySelectorAll('.mn-slot')];
      let n = 0;
      const balls = Array.from({ length: 10 }, (_, i) => {
        const b = document.createElement('button');
        b.className = 'mn-pb';
        b.style.animationDelay = i * 60 + 'ms';
        put(b, BALL);
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (tk !== token || b.classList.contains('used') || n >= 10) return;
          clearTimeout(idleTimer);
          const slot = slots[n];
          const from = b.getBoundingClientRect();
          b.classList.add('used');
          put(slot, BALL);
          flip(slot.firstElementChild, from, 420);
          Sound.sfx.pop();
          n++;
          Sound.say(['yue_' + n]);
          dbg.target = balls.find((x) => !x.classList.contains('used')) || null;
          if (n < 10) { armIdle(idleHint, 8000); return; }
          Sound.say([{ pause: 250 }, { fn: () => { box.classList.add('full'); restart(box, 'glow'); Sound.sfx.hatch(); pose(palEl, 'hop', 900); } }, 'mn_ten', { pause: 400 }])
            .then(() => { play.replaceChildren(); resolve(); });
        });
        pile.appendChild(b);
        return b;
      });
      dbg.target = balls[0];
      function idleHint() {
        const t = balls.find((x) => !x.classList.contains('used'));
        if (t) restart(t, 'hint');
      }
      Sound.say([{ pause: 200 }, 'mn_s1']);
      armIdle(idleHint, 8000);
    });
  }

  function flip(el, from, ms) {
    if (!el) return;
    const to = el.getBoundingClientRect();
    if (!el.animate || !to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.3)` }, { transform: 'translate(0,0) scale(1)' }],
      { duration: ms, easing: 'cubic-bezier(.3,1.3,.5,1)' });
  }

  // 示範由十數落去：盒發光「十」→ 散球逐粒着「十一、十二……」
  function countOnItems(group, n) {
    const box = group.querySelector('.mn-box');
    const lbs = [...group.querySelectorAll('.mn-lb')];
    const items = [{ fn: () => { if (box) restart(box, 'glow'); } }, 'yue_10', { pause: 150 }];
    for (let i = 0; i < n - 10; i++) items.push({ fn: () => { lbs.forEach((x) => x.classList.remove('lit')); restart(lbs[i], 'lit'); Sound.sfx.pop(); } }, 'yue_' + (11 + i), { pause: 120 });
    return items;
  }

  // ② 幾多粒球：一盒 + k 粒散球 → 揀數字卡；回傳 true = 第一下就啱
  function askCount(n, tk) {
    return new Promise((resolve) => {
      const k = n - 10;
      play.className = 'mode-count';
      const group = groupEl(true, k, 'big');
      const row = document.createElement('div');
      row.className = 'mn-nums';
      play.replaceChildren(group, row);
      restart(group, 'in');
      const ones = k === 0 ? 1 : k;
      const near = n >= 14 ? n - 1 : n === 10 ? 11 : pick([n - 1, n + 1]);
      const opts = shuffle([n, ones, near]);
      const prompt = ['mn_howmany'];
      let misses = 0, done = false;
      arm();
      const btns = opts.map((v, i) => {
        const c = document.createElement('button');
        c.className = 'mn-num';
        c.textContent = String(v);
        c.dataset.v = v;
        c.style.animationDelay = i * 110 + 'ms';
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (v === n) {
            done = true;
            clearTimeout(idleTimer);
            dbg.target = null;
            Sound.clear();
            btns.forEach((x) => { x.classList.remove('hint'); if (x !== c) x.classList.add('fade'); });
            restart(c, 'right');
            record(n, 'count', misses === 0);
            if (misses === 0) gainStar(c);
            Sound.sfx.pop();
            pose(palEl, 'hop', 800);
            Sound.say([{ pause: 200 }, 'yue_' + n, { pause: 300 }, ...countOnItems(group, n), { pause: 200 }, praise(), { pause: 250 }])
              .then(() => resolve(misses === 0));
          } else {
            misses++;
            if (v === ones && v < 10) recordOnes(n);
            restart(c, 'wiggle');
            Sound.sfx.soft();
            Sound.clear();
            lock = true;
            const my = ++armId;
            // 示範：呢盒係十，由十開始數 → 再問
            const demo = misses === 1 ? [{ pause: 300 }, 'mn_look', { pause: 200 }, 'mn_box10', { pause: 150 }, ...(k ? ['mn_count_on', { pause: 150 }, ...countOnItems(group, n).slice(3)] : []), { pause: 300 }, ...prompt]
              : [{ pause: 300 }, 'mn_look', { pause: 200 }, ...prompt];
            Sound.say(demo).then(() => { if (armId === my) lock = false; });
            if (misses >= 2) btns.find((x) => +x.dataset.v === n).classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      dbg.target = btns.find((x) => +x.dataset.v === n);
      Sound.say(prompt);
      armIdle(() => Sound.say(prompt));
    });
  }

  // ③ 邊個係 N：聽數字 → 揀啱嗰堆球；干擾 = 冇盒淨係散球 + 多 / 少一粒
  function askWhich(n, tk) {
    return new Promise((resolve) => {
      const k = n - 10;
      play.className = 'mode-which';
      const card = document.createElement('div');
      card.className = 'mn-target';
      card.textContent = String(n);
      const row = document.createElement('div');
      row.className = 'mn-choices';
      play.replaceChildren(card, row);
      restart(card, 'in');
      const nearK = k >= 4 ? k - 1 : k === 0 ? 1 : pick([k - 1, k + 1]);
      const opts = shuffle([{ id: 'ok', box: true, k }, { id: 'ones', box: false, k: k || 1 }, { id: 'near', box: true, k: nearK }]);
      const prompt = ['mn_which', { pause: 100 }, 'yue_' + n];
      let misses = 0, done = false;
      arm();
      const btns = opts.map((o, i) => {
        const b = document.createElement('button');
        b.className = 'mn-choice';
        b.dataset.id = o.id;
        b.style.animationDelay = i * 120 + 'ms';
        b.appendChild(groupEl(o.box, o.k));
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (o.id === 'ok') {
            done = true;
            clearTimeout(idleTimer);
            dbg.target = null;
            Sound.clear();
            btns.forEach((x) => { x.classList.remove('hint'); if (x !== b) x.classList.add('fade'); });
            restart(b, 'right');
            record(n, 'which', misses === 0);
            if (misses === 0) gainStar(b);
            Sound.sfx.pop();
            pose(palEl, 'hop', 800);
            Sound.say([{ pause: 200 }, ...countOnItems(b, n), { pause: 200 }, praise(), { pause: 250 }]).then(() => resolve(misses === 0));
          } else {
            misses++;
            if (o.id === 'ones') recordOnes(n);
            restart(b, 'wiggle');
            Sound.sfx.soft();
            Sound.clear();
            lock = true;
            const my = ++armId;
            Sound.say([{ pause: 300 }, 'mn_look', { pause: 250 }, ...prompt]).then(() => { if (armId === my) lock = false; });
            if (misses >= 2) btns.find((x) => x.dataset.id === 'ok').classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      dbg.target = btns.find((x) => x.dataset.id === 'ok');
      Sound.say(prompt);
      armIdle(() => Sound.say(prompt));
    });
  }

  // ---------- 捉怪獸：草叢郁 → 怪獸彈出嚟 → 掟星星球（向上撥 / 撳都得）→ 搖 3 下 → 捉到 ----------
  function addToDex(id, shiny) {
    const c = dex.caught[id] = Object.assign({ n: 0, shiny: false }, dex.caught[id]);
    const isNew = c.n === 0;
    const newShiny = shiny && !c.shiny;
    c.n++;
    if (shiny) c.shiny = true;
    saveDex();
    if (isNew || newShiny) sessionNew.push(id);
    return { isNew, newShiny };
  }

  async function catchOne(tk, id, firstTry) {
    const shiny = !!firstTry && Math.random() < SHINY_ODDS;
    play.className = 'mode-catch';
    put(play, `<div class="mn-scene"><div class="mn-mon${shiny ? ' is-shiny' : ''}">${MonArt.monster(id, { shiny })}</div><div class="mn-bush">${MonArt.bush()}</div></div><button class="mn-throw" aria-label="掟星星球">${BALL}</button>`);
    const mon = play.querySelector('.mn-mon'), bush = play.querySelector('.mn-bush'), ball = play.querySelector('.mn-throw');
    restart(bush, 'shake');
    Sound.sfx.bubble();
    await sayMin(['mn_appear', { pause: 100 }], 1500);
    if (tk !== token) return;
    mon.classList.add('up');
    Sound.sfx.boing();
    if (shiny) { Sound.sfx.hatch(); burstAt(center(mon), true); }
    await sayMin([{ pause: 300 }, 'mn_n_' + id, { pause: 200 }, ...(shiny ? ['mn_shiny', { pause: 200 }] : [])], 1300);
    if (tk !== token) return;
    ball.classList.add('ready');
    Sound.say(['mn_throw']);
    await waitThrow(tk, ball);
    if (tk !== token) return;
    // 球飛去怪獸度
    Sound.sfx.whoosh();
    const a = center(ball), b = center(mon);
    ball.classList.remove('ready', 'tap-hint');
    ball.classList.add('thrown');
    if (ball.animate) {
      await new Promise((r) => {
        ball.animate([{ transform: 'translate(0,0) rotate(0) scale(1)' }, { transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) - 60}px) rotate(360deg) scale(.9)`, offset: 0.55 }, { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) rotate(720deg) scale(.8)` }],
          { duration: 650, easing: 'ease-in', fill: 'forwards' }).onfinish = r;
        setTimeout(r, 900);
      });
    }
    if (tk !== token) return;
    burstAt(b);
    mon.classList.add('suck');
    Sound.sfx.zap();
    await wait(450);
    for (let i = 0; i < 3; i++) {
      if (tk !== token) return;
      restart(ball, 'wob');
      Sound.sfx.click();
      await wait(520);
    }
    if (tk !== token) return;
    burstAt(center(ball), true);
    ball.classList.add('done');
    Sound.sfx.hatch();
    const r = addToDex(id, shiny);
    pose(palEl, 'hop', 900);
    await sayMin(['mn_caught', { pause: 200 }, ...(r.isNew ? ['mn_new', { pause: 200 }] : [])], 1500);
    if (tk !== token) return;
    if (r.isNew) await newCard(tk, id, shiny);
    play.replaceChildren();
  }

  // 撥 / 撳個球 → 掟；4 秒冇反應發光提示，12 秒自動掟（唔會卡住）
  function waitThrow(tk, ball) {
    return new Promise((resolve) => {
      let done = false, y0 = null;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(t1); clearTimeout(t2);
        ball.removeEventListener('pointerdown', down);
        ball.removeEventListener('pointermove', move);
        ball.removeEventListener('pointerup', up);
        dbg.target = null;
        resolve();
      };
      const down = (e) => { e.preventDefault(); if (tk !== token) return; y0 = e.clientY; try { ball.setPointerCapture(e.pointerId); } catch (err) {} };
      const move = (e) => { if (y0 !== null && y0 - e.clientY > 30) finish(); };
      const up = () => { if (y0 !== null) finish(); };
      ball.addEventListener('pointerdown', down);
      ball.addEventListener('pointermove', move);
      ball.addEventListener('pointerup', up);
      const t1 = setTimeout(() => { restart(ball, 'tap-hint'); if (!Sound.isBusy()) Sound.say(['mn_throw']); }, 4000);
      const t2 = setTimeout(finish, 12000);
      dbg.target = ball;
    });
  }

  // 新怪獸：大卡彈出嚟（圖鑑頁）
  async function newCard(tk, id, shiny) {
    const c = document.createElement('div');
    c.className = 'mn-newcard';
    put(c, `<div class="nc-art${shiny ? ' is-shiny' : ''}">${MonArt.monster(id, { shiny })}</div><div class="nc-name"></div>`);
    c.querySelector('.nc-name').textContent = U.names[id];
    play.replaceChildren(c);
    restart(c, 'in');
    await sayMin([{ pause: 200 }, 'mn_n_' + id, { pause: 300 }], 1800);
  }

  // ---------- ④ 孵蛋：盒（= 十）+ 撳蛋由十一數落去 ----------
  async function eggRun(tk) {
    const n = chooseNums('egg', U.nums.filter((x) => x > 10), 1)[0] || 12;
    const daily = dex.eggDay !== today();
    const nw = daily ? pickNew() : null;
    const id = nw || (caughtWild().length ? pick(caughtWild()) : pick(U.wild));
    const shiny = !nw && Math.random() < 0.3;
    play.className = 'mode-egg';
    const wrap = document.createElement('div');
    wrap.className = 'mn-eggrow';
    const box = boxEl(10, 'closed');
    const tray = looseEl(0, 'grow');
    const egg = document.createElement('button');
    egg.className = 'mn-egg';
    egg.setAttribute('aria-label', '撳蛋');
    put(egg, MonArt.egg());
    const goal = document.createElement('div');
    goal.className = 'mn-goal';
    goal.textContent = String(n);
    const left = document.createElement('div');
    left.className = 'mn-eggleft';
    left.append(box, tray);
    wrap.append(left, egg);
    play.replaceChildren(goal, wrap);
    restart(wrap, 'in');
    Sound.sfx.bubble();
    await Sound.say([{ pause: 200 }, 'mn_egg', { pause: 250 }, 'mn_egg_rule', { pause: 100 }, 'yue_' + n, { pause: 250 }, { fn: () => restart(box, 'glow') }, 'yue_10', { pause: 200 }]);
    if (tk !== token) return;
    // 撳蛋：每下出一粒球 + 讀十一、十二……
    await new Promise((resolve) => {
      let c = 10, busy = false;
      const tap = (ev) => {
        ev.preventDefault();
        if (tk !== token || busy || c >= n) return;
        clearTimeout(idleTimer);
        c++;
        egg.classList.remove('tap-hint');
        restart(egg, 'wob');
        const lb = document.createElement('span');
        lb.className = 'mn-lb';
        put(lb, BALL);
        tray.appendChild(lb);
        restart(lb, 'lit');
        Sound.sfx.pop();
        Sound.say(['yue_' + c]);
        if (c < n) { armIdle(() => restart(egg, 'tap-hint'), 6000); return; }
        busy = true;
        egg.removeEventListener('pointerdown', tap);
        dbg.target = null;
        resolve();
      };
      egg.addEventListener('pointerdown', tap);
      dbg.target = egg;
      armIdle(() => restart(egg, 'tap-hint'), 6000);
    });
    if (tk !== token) return;
    await Promise.race([Sound.whenIdle(), wait(1500)]);
    if (tk !== token) return;
    egg.classList.add('crack');
    Sound.sfx.thump();
    await wait(700);
    if (tk !== token) return;
    egg.classList.add('open');
    burstAt(center(egg), true);
    Sound.sfx.hatch();
    const r = addToDex(id, shiny);
    if (nw) { dex.eggDay = today(); saveDex(); }
    const born = document.createElement('div');
    born.className = 'mn-born' + (shiny ? ' is-shiny' : '');
    put(born, MonArt.monster(id, { shiny }));
    egg.appendChild(born);
    pose(palEl, 'hop', 900);
    await sayMin(['mn_hatch', { pause: 200 }, 'mn_n_' + id, { pause: 200 }, ...(shiny ? ['mn_shiny', { pause: 200 }] : []), ...(r.isNew ? ['mn_new', { pause: 200 }] : []), ...(nw ? ['mn_daily', { pause: 200 }] : [])], 2400);
    if (tk !== token) return;
    play.replaceChildren();
  }

  // ---------- 圖鑑：12 格，未捉到 = 黑影 ----------
  function dexMarkup(highlight) {
    return `<div class="mn-dex">${U.wild.map((id) => {
      const c = dex.caught[id];
      const cls = ['mn-dexcell', c ? 'got' : 'shadow', c && c.shiny ? 'shiny' : '', highlight && highlight.includes(id) ? 'new' : ''].join(' ');
      return `<span class="${cls}"><span class="dx-art${c && c.shiny ? ' is-shiny' : ''}">${MonArt.monster(id, { shiny: !!(c && c.shiny) })}</span><span class="dx-name">${c ? U.names[id] : '？？？'}</span></span>`;
    }).join('')}</div>`;
  }
  async function showDex(tk) {
    meterEl.hidden = true;
    play.className = 'mode-dex';
    put(play, dexMarkup(sessionNew));
    play.querySelectorAll('.mn-dexcell').forEach((x, i) => { x.style.animationDelay = i * 60 + 'ms'; });
    const full = U.wild.every((id) => dex.caught[id]);
    await sayMin([{ pause: 300 }, 'mn_dex', { pause: 300 }, full ? 'mn_dex_full' : 'mn_dex_left', { pause: 400 }], 3500);
    if (tk !== token) return;
    play.replaceChildren();
  }

  // ---------- 拍檔進化 ----------
  async function partnerGrow(tk) {
    const p = dex.pals[pal] = (dex.pals[pal] || 0) + 1;
    saveDex();
    if (dex.evo[pal]) return;
    if (p >= U.evolveAt) {
      dex.evo[pal] = true;
      saveDex();
      play.className = 'mode-evo';
      put(play, `<div class="mn-evo"><div class="ev-art">${MonArt.monster(pal)}</div></div>`);
      const art = play.querySelector('.ev-art');
      palEl.classList.add('hide');
      for (let i = 0; i < 3; i++) {
        restart(art, 'flash');
        Sound.sfx.beam();
        await wait(650);
        if (tk !== token) return;
      }
      put(art, MonArt.monster(pal, { evo: true }));
      restart(art, 'grow');
      burstAt(center(art), true);
      Sound.sfx.hatch();
      setPal(pal);
      await sayMin([{ pause: 200 }, 'mn_evolve', { pause: 250 }, 'mn_n_' + pal, { pause: 300 }], 2800);
      if (tk !== token) return;
      play.replaceChildren();
      palEl.classList.remove('hide');
      return;
    }
    const left = U.evolveAt - p;
    if (left <= 2) await Sound.say([{ pause: 200 }, left === 1 ? 'mn_more_1' : 'mn_more_2', { pause: 300 }]);
  }

  async function finale(tk) {
    play.replaceChildren();
    play.className = '';
    pose(palEl, 'hop', 1400);
    await Sound.say([{ pause: 300 }, 'mn_bye']);
    if (tk !== token) return;
    renderMenu();
    document.body.classList.add('mon-done');
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 主選單：圖鑑進度 ----------
  function renderMenu() {
    const row = document.querySelector('.stickers[data-game="mon"]');
    if (!row) return;
    const got = U.wild.filter((id) => dex.caught[id]).length;
    const shinies = U.wild.filter((id) => dex.caught[id] && dex.caught[id].shiny).length;
    row.replaceChildren();
    const pill = document.createElement('span');
    pill.className = 'mn-pill';
    put(pill, `<span class="mp-ball">${BALL}</span><b></b>`);
    pill.querySelector('b').textContent = got + ' / ' + U.wild.length + (shinies ? '  ✨' + shinies : '');
    row.appendChild(pill);
  }

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); document.querySelectorAll('.mn-fly').forEach((e) => e.remove()); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'mon') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'mon' && !document.body.classList.contains('mon-done')) start(); });

  function renderStats(tbody, info) {
    tbody.replaceChildren();
    const f = (s, k) => s[k] ? s[k + 'Ok'] + ' / ' + s[k] : '—';
    for (const n of U.nums) {
      const s = st(n);
      const tr = document.createElement('tr');
      for (const v of [(U.focus.includes(n) ? '★ ' : '') + n, f(s, 'count'), f(s, 'which'), s.ones ? s.ones + ' 次' : '—']) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    if (info) {
      const got = U.wild.filter((id) => dex.caught[id]).length;
      const sh = U.wild.filter((id) => dex.caught[id] && dex.caught[id].shiny).length;
      info.textContent = '圖鑑 ' + got + ' / ' + U.wild.length + '（閃閃 ' + sh + '）　玩咗 ' + dex.sessions + ' 局、星星全滿 ' + dex.allStars + ' 局　｜ 拍檔：' +
        U.partners.map((sp) => U.names[sp] + ' ' + (dex.pals[sp] || 0) + (dex.evo[sp] ? '（進化咗）' : '')).join('、');
    }
  }
  function resetStats() { stats = {}; store(STATS_KEY, stats); ['count', 'which', 'egg'].forEach((k) => store('monBag_' + k + '.v1', [])); }
  function resetDex() { dex = freshDex(); saveDex(); renderMenu(); }

  renderMenu();
  return { start, stop, renderStats, resetStats, resetDex, renderMenu, _dbg: dbg };
})();
