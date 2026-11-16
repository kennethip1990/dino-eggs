/*
 * 光之巨人 Luca 救援隊：學英文（全英文，Yorkland Starters R&W Part 3 W-controlled + R-controlled vowels）
 * 唔打交：成個 game 係救援。流程：大風暴吹親個小鎮 → Luca 變身光之巨人
 *   → 每關開頭自己揀 Type（Sky / Power / Multi，淨係換顏色 + 動作，冇啱錯）
 *   → ① 點燈 ×5：✓✗ 句子（工作紙陷阱圖：杯 ≠ bowl、裙 ≠ skirt、腳 ≠ arm、蟹 ≠ prawn、舊梳化 ≠ new、綠色 ≠ brown）
 *   → ② 聲音光球 ×4：聽個字，揀 ow / ew / aw 或者 or / ar / ir 補空位
 *   → ③ 光之橋 ×3：砌字（工作紙 8 個字排先，多一粒干擾字母）
 *   → ④ 送 BB 怪獸返屋企 ×5：ow 似 cow 定似 bowl？+ ✓✗ 陷阱圖 + 補空位 → 怪獸媽媽嚟接
 *   → 結局短片（3 個輪流，要 Luca 撳）→ 貼紙 → 勳章 →（全金）金色光之巨人短片 + 金色貼紙 → 拜拜
 * 防亂撞（Luca 驚扣血，所以只加唔扣）：
 *   - 光能量：第一下就答啱先 +1 粒光（飛去左上角）；答錯唔扣，就係冇加
 *   - 答錯：個掣郁一郁，「Hmm. Listen again.」→ 讀多次題目，讀完先畀再撳；錯兩次啱嗰個會發光
 *   - 新題目出咗頭 0.6 秒唔收撳；一關光儲滿 = 金勳章 + 金光 Super 形態；冇 game over，每關一定救到
 */
const LightGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.LIGHT_UNIT;
  const THING = Object.fromEntries(unit.things.map((t) => [t.id, t]));
  const SPELL = unit.spell.map((s) => s.id);
  const SCAN = 5, ORBS = 4, BRIDGE = 3;
  const STAGES = ['scan', 'orb', 'bridge', 'home'];
  const familyOf = (team) => unit.families.w.includes(team) ? unit.families.w : unit.families.r;

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'lightWords.v1', RUN_KEY = 'lightRuns.v1';
  let stats = load(STORE_KEY, {});
  let runs = load(RUN_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const KINDS = ['truth', 'gap', 'spell', 'sort'];
  const blank = () => Object.fromEntries(KINDS.flatMap((k) => [[k, 0], [k + 'Ok', 0]]));
  function record(id, kind, firstTry) {
    const s = stats[id] = Object.assign(blank(), stats[id]);
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    store(STORE_KEY, stats);
  }
  const st = (id) => Object.assign(blank(), stats[id]);
  const rate = (id, kind) => { const s = st(id); return s[kind] ? s[kind + 'Ok'] / s[kind] : 0; };
  function bump(stage, field) {
    const r = runs[stage] = Object.assign(stage === 'types' ? {} : { played: 0, gold: 0 }, runs[stage]);
    r[field] = (r[field] || 0) + 1;
    store(RUN_KEY, runs);
  }

  // 平均輪流（bag）：一輪出晒先再嚟過
  function fromBag(key, all, n) {
    let bag = load(key, []).filter((id) => all.includes(id));
    if (bag.length < n) bag = bag.concat(shuffle(all.filter((id) => !bag.includes(id))));
    store(key, bag.slice(n));
    return bag.slice(0, n);
  }
  const ranked = (list, kind) => list.map((id) => ({ id, s: rate(id, kind) + Math.random() * 0.6 })).sort((a, b) => a.s - b.s).map((x) => x.id);
  const truthQ = (p, isTrue) => ({ type: 'truth', id: p.id, lie: p.lie, isTrue });
  const trapQ = (id) => { const t = unit.traps.find((x) => x.id === id); return { type: 'truth', id: t.id, lie: t.lie, isTrue: false, trap: true }; };

  function planScan() {
    const r = ranked(unit.truth.map((p) => p.id), 'truth').map((id) => unit.truth.find((p) => p.id === id));
    const traps = fromBag('lightTrap.v1', unit.traps.map((t) => t.id), 2);
    return shuffle([truthQ(r[0], true), truthQ(r[1], true), truthQ(r[2], false), trapQ(traps[0]), trapQ(traps[1])]);
  }
  // 聲音光球：一半 W 組（ow / ew / aw）一半 R 組（or / ar / ir）
  function planOrb() {
    const W = unit.gap.filter((id) => familyOf(THING[id].team) === unit.families.w);
    const R = unit.gap.filter((id) => !W.includes(id));
    return shuffle([...fromBag('lightGapW.v1', W, ORBS / 2), ...fromBag('lightGapR.v1', R, ORBS / 2)]).map((id) => ({ type: 'gap', id }));
  }
  function planBridge() {
    // 工作紙 8 個字（cow / new / bowl / prawn / horse / arm / bird / skirt）第一下就啱 2 次之前排先
    const focus = shuffle(unit.spell.filter((s) => s.focus && st(s.id).spellOk < 2).map((s) => s.id)).slice(0, BRIDGE);
    const rest = fromBag('lightSpell.v1', SPELL.filter((id) => !focus.includes(id)), BRIDGE - focus.length);
    return shuffle([...focus, ...rest]);
  }
  function planHome() {
    const sorts = ranked(unit.sort, 'sort').slice(0, 3);
    const trap = fromBag('lightTrap.v1', unit.traps.map((t) => t.id), 1)[0];
    const R = unit.gap.filter((id) => familyOf(THING[id].team) === unit.families.r);
    const gap = ranked(R, 'gap')[0];
    return [{ type: 'sort', id: sorts[0] }, trapQ(trap), { type: 'sort', id: sorts[1] }, { type: 'gap', id: gap }, { type: 'sort', id: sorts[2] }];
  }

  // ---------- DOM ----------
  const screen = $('#light-screen'), heroEl = $('#lg-hero'), babyEl = $('#lg-baby'), mamaEl = $('#lg-mama');
  const play = $('#light-play'), hud = $('#light-hud'), meterEl = $('#light-meter'), againBtn = $('#light-again');
  put($('#light-bg'), LightArt.town());
  put(heroEl, LightArt.hero());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  let lock = false;            // 答錯之後：讀完題目先可以再撳
  let armId = 0;
  let type = 'multi';
  // 新題目出咗頭 0.6 秒唔收撳（上一題撳多下唔會誤中新題）
  function arm() {
    lock = true;
    const my = ++armId;
    setTimeout(() => { if (armId === my) lock = false; }, 600);
  }
  const dbg = { target: null, lights: () => meterEl.querySelectorAll('.lg-cell.on').length };     // 開發測試

  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => pick(['li_yes_1', 'li_yes_2', 'li_yes_3']);
  const letterKey = (l) => Sound.has('ph_' + l) ? 'ph_' + l : 'ltr_' + l;
  const teamKeys = (tm) => Sound.has('lo_' + tm) ? ['lo_' + tm] : [...tm].map((l) => 'ltr_' + l);

  function pose(cls, ms, el) {
    el = el || heroEl;
    restart(el, cls);
    clearTimeout(el['_' + cls]);
    el['_' + cls] = setTimeout(() => el.classList.remove(cls), ms || 800);
  }
  function setType(t) {
    type = t;
    heroEl.classList.remove('t-multi', 't-power', 't-sky');
    heroEl.classList.add('t-' + t);
  }

  function reset() {
    document.body.dataset.screen = 'light';
    document.body.classList.remove('light-done', 'light-home', 'light-battle', 'light-night');
    cleanupBattle();
    heroEl.className = '';
    put(heroEl, LightArt.hero());
    setType('multi');
    babyEl.className = '';
    mamaEl.className = '';
    put(babyEl, LightArt.baby());
    put(mamaEl, LightArt.happy(LightArt.baby(true)));
    play.className = '';
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    meterEl.replaceChildren();
    meterEl.hidden = true;
    meterEl.className = '';
    lock = false;
    dbg.target = null;
  }

  // ---------- 光能量（只加唔扣） ----------
  function buildMeter(n) {
    meterEl.hidden = false;
    meterEl.className = '';
    put(meterEl, Array.from({ length: n }, () => `<span class="lg-cell">${LightArt.cell()}</span>`).join(''));
    meterEl.querySelectorAll('.lg-cell').forEach((s, i) => { s.style.animationDelay = i * 80 + 'ms'; restart(s, 'in'); });
    heroEl.style.setProperty('--glow', 0);
  }
  // 第一下就啱：一粒光由個答案飛去左上角
  function gainLight(fromEl) {
    const cell = meterEl.querySelector('.lg-cell:not(.on)');
    if (!cell) return;
    const all = meterEl.querySelectorAll('.lg-cell').length;
    const done = () => {
      restart(cell, 'on');
      Sound.sfx.zap();
      const n = meterEl.querySelectorAll('.lg-cell.on').length;
      heroEl.style.setProperty('--glow', (n / all).toFixed(2));
      restart(heroEl, 'charge');
    };
    if (!fromEl || !fromEl.isConnected) return done();
    const a = center(fromEl), b = center(cell);
    const o = document.createElement('div');
    o.className = 'lg-spark';
    o.style.left = a.x + 'px';
    o.style.top = a.y + 'px';
    document.body.appendChild(o);
    if (!o.animate) { o.remove(); return done(); }
    o.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y}px)) scale(.6)` }],
      { duration: 650, easing: 'cubic-bezier(.5,0,.6,1)' }).onfinish = () => { o.remove(); done(); };
    setTimeout(() => { if (o.isConnected) { o.remove(); done(); } }, 1200);
  }
  const meterFull = () => !meterEl.querySelector('.lg-cell:not(.on)');

  // 答錯通用處理：唔扣嘢；讀多次題目，讀完先畀再撳
  function miss(el, replay) {
    restart(el, 'wiggle');
    Sound.sfx.soft();
    Sound.clear();
    lock = true;
    const my = ++armId;
    Sound.say([{ pause: 400 }, 'li_look', { pause: 250 }, ...replay]).then(() => { if (armId === my) lock = false; });
  }

  // ---------- 開始 ----------
  function start(opts) {
    const tk = ++token;
    Sound.clear();
    reset();
    run(tk, (opts && opts.from) || 1);
  }

  async function run(tk, from) {
    const medals = [];
    if (from <= 1) {
      // 變身：一道光 → 光之巨人
      await Sound.say(['li_hi', { pause: 250 }, 'li_intro', { pause: 250 }]);
      if (tk !== token) return;
      addFx('lg-flash');
      Sound.sfx.beam();
      Sound.say(['li_transform']);
      await wait(500);
      if (tk !== token) return;
      heroEl.classList.add('in');
      Sound.sfx.hatch();
      await wait(1400);
      if (tk !== token) return;
      await Sound.say(['li_light', { pause: 300 }]);
      if (tk !== token) return;
    } else {
      heroEl.classList.add('in');
      await wait(900);
      if (tk !== token) return;
    }
    if (from <= 1) {
      medals.push(await stage(tk, 'scan', SCAN, async () => {
        const plan = planScan();
        buildHouses(plan.length);
        await Sound.say([{ pause: 200 }, 'li_scan', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askTruth(plan[i], tk);
          if (tk !== token) return;
          await lightHouse(tk, i);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 2) {
      medals.push(await stage(tk, 'orb', ORBS, async () => {
        const plan = planOrb();
        buildSockets(plan.length);
        await Sound.say([{ pause: 200 }, 'li_orb', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askGap(plan[i], tk);
          if (tk !== token) return;
          await orbIn(tk, i, THING[plan[i].id].team);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 3) {
      medals.push(await stage(tk, 'bridge', BRIDGE, async () => {
        const plan = planBridge();
        buildBridge(plan.length);
        await Sound.say([{ pause: 200 }, 'li_bridge', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askSpell(plan[i], tk);
          if (tk !== token) return;
          plank(i);
        }
        play.replaceChildren();
        await busCross(tk);
      }));
      if (tk !== token) return;
    }
    medals.push(await stage(tk, 'home', 5, async () => {
      await homeRun(tk, planHome());
    }));
    if (tk !== token) return;
    const end = Rewards.next('light');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('light', end, 'en');
    if (tk !== token) return;
    const allGold = await showMedals(tk, medals);
    if (tk !== token) return;
    if (allGold) {
      await battle(tk, 'gold');
      if (tk !== token) return;
      await Rewards.celebrate('light', 'gold', 'en');
      if (tk !== token) return;
    }
    await finale(tk);
  }

  // 一關：揀 Type → 光格清空 → 玩 → 儲滿 = 金勳章；回傳 true = 金
  async function stage(tk, name, cells, body) {
    if (tk !== token) return false;
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    heroEl.style.setProperty('--glow', 0);
    await pickType(tk);
    if (tk !== token) return false;
    buildMeter(cells);
    bump(name, 'played');
    await body();
    if (tk !== token) return false;
    play.replaceChildren();
    const gold = meterFull();
    if (gold) {
      bump(name, 'gold');
      Sound.sfx.hatch();
      restart(meterEl, 'perfect');
      heroEl.classList.add('super');
      await sayMin([{ pause: 200 }, 'li_full', { pause: 300 }], 2200);
      heroEl.classList.remove('super');
    } else {
      Sound.sfx.pop();
      await Sound.say([{ pause: 200 }, 'li_good', { pause: 300 }]);
    }
    return gold;
  }

  // 揀 Type：冇啱錯，揀邊個都得（俾 Luca 有選擇權）
  function pickType(tk) {
    return new Promise((resolve) => {
      play.className = 'mode-type';
      const row = document.createElement('div');
      row.className = 'lg-types';
      let done = false;
      const btns = ['sky', 'power', 'multi'].map((t, i) => {
        const b = document.createElement('button');
        b.className = 'lg-typebtn t-' + t;
        b.dataset.t = t;
        b.style.animationDelay = i * 120 + 'ms';
        put(b, `<span class="tb-art">${LightArt.hero(t)}</span><span class="tb-txt"></span>`);
        b.querySelector('.tb-txt').textContent = t === 'sky' ? 'Sky' : t === 'power' ? 'Power' : 'Multi';
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          done = true;
          clearTimeout(idleTimer);
          dbg.target = null;
          Sound.clear();
          btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
          restart(b, 'right');
          bump('types', t);
          addFx('lg-flash');
          Sound.sfx.beam();
          setType(t);
          pose('t-pose-' + t, 1200);
          Sound.say([{ pause: 150 }, 'li_' + t, { pause: 300 }]).then(() => { play.replaceChildren(); play.className = ''; resolve(t); });
        });
        row.appendChild(b);
        return b;
      });
      play.replaceChildren(row);
      dbg.target = btns[2];
      Sound.say(['li_type_q']);
      armIdle(() => Sound.say(['li_type_q']));
    });
  }

  async function finale(tk) {
    play.replaceChildren();
    hud.replaceChildren();
    meterEl.hidden = true;
    heroEl.classList.add('wave');
    await Sound.say([{ pause: 300 }, 'li_bye']);
    if (tk !== token) return;
    document.body.classList.add('light-done');
  }

  // 勳章：每關一個，金 = 光儲滿；回傳 true = 全金
  async function showMedals(tk, medals) {
    if (!medals.length) return false;
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    play.className = 'mode-medals';
    put(play, `<div class="rb-medals">${medals.map((g, i) => `<span class="rb-medal${g ? ' gold' : ''}" style="animation-delay:${i * 250}ms">${RoboArt.medal(g)}</span>`).join('')}</div>`);
    medals.forEach((g, i) => setTimeout(() => { if (tk === token) (g ? Sound.sfx.hatch : Sound.sfx.pop)(); }, i * 250 + 200));
    const golds = medals.filter(Boolean).length;
    const all = golds === medals.length && medals.length === STAGES.length;
    await sayMin(['li_medals', { pause: 300 }, all ? 'li_all_gold' : golds ? 'li_some_gold' : 'li_no_gold', { pause: 400 }], 3000);
    play.replaceChildren();
    play.className = '';
    return all;
  }

  // ---------- ① 點燈：✓✗ ----------
  function buildHouses(n) {
    hud.className = 'houses';
    put(hud, Array.from({ length: n }, () => `<span class="lg-house">${LightArt.house()}</span>`).join(''));
  }
  async function lightHouse(tk, i) {
    const h = hud.querySelectorAll('.lg-house')[i];
    pose('lg-beam', 800);
    Sound.sfx.beam();
    if (h) { restart(h, 'lit'); burstAt(center(h)); }
    await Sound.say([{ pause: 200 }, praise(), { pause: 250 }]);
  }
  const sentence = (id) => THING[id].say || 'This is a ' + THING[id].word + '.';

  function askTruth(q, tk, inHome) {
    return new Promise((resolve) => {
      play.className = 'mode-truth' + (inHome ? ' in-home' : '');
      play.replaceChildren();
      const sayId = q.isTrue ? q.id : q.lie;
      const h = document.createElement('div');
      h.className = 'holo';
      put(h, `<div class="holo-pic">${LightArt.thing(q.id)}</div>
        <div class="holo-line"><span class="holo-text"></span><span class="holo-box"></span></div>`);
      const text = h.querySelector('.holo-text');
      text.textContent = sentence(sayId);
      const row = document.createElement('div');
      row.className = 'tx-row';
      const btn = {};
      for (const kind of ['tick', 'cross']) {
        const b = document.createElement('button');
        b.className = 'tx ' + kind;
        b.setAttribute('aria-label', kind);
        put(b, kind === 'tick' ? JediArt.tick() : JediArt.cross());
        b.addEventListener('pointerdown', (ev) => { ev.preventDefault(); onTap(kind); });
        row.appendChild(b);
        btn[kind] = b;
      }
      play.append(h, row);
      restart(h, 'in');
      const right = q.isTrue ? 'tick' : 'cross';
      dbg.target = btn[right];
      let misses = 0, done = false;
      arm();
      const box = h.querySelector('.holo-box');
      const mark = (kind) => { put(box, kind === 'tick' ? JediArt.tick() : JediArt.cross()); restart(box, 'stamp'); };

      function onTap(kind) {
        if (done || lock || tk !== token) return;
        if (kind === right) {
          done = true;
          clearTimeout(idleTimer);
          dbg.target = null;
          Sound.clear();
          mark(kind);
          btn[kind === 'tick' ? 'cross' : 'tick'].classList.add('fade');
          Object.values(btn).forEach((b) => b.classList.remove('hint'));
          if (!q.trap) record(q.id, 'truth', misses === 0);
          if (misses === 0) gainLight(btn[kind]);
          Sound.sfx.pop();
          if (kind === 'tick') {
            Sound.say([{ pause: 200 }, 'jd_tick', { pause: 300 }]).then(() => resolve('ok'));
            return;
          }
          restart(h, 'slashed');
          const after = q.trap ? ['ln_' + q.id]
            : [{ fn: () => { h.classList.remove('slashed'); text.textContent = sentence(q.id); restart(text, 'fixed'); mark('tick'); } }, 'ls_' + q.id];
          Sound.say([{ pause: 200 }, 'jd_cross', { pause: 250 }, ...after, { pause: 300 }]).then(() => resolve('ok'));
        } else {
          misses++;
          miss(btn[kind], ['ls_' + sayId, { pause: 200 }, 'jd_tick_q']);
          if (misses >= 2) btn[right].classList.add('hint');
        }
      }
      Sound.say(['ls_' + sayId, { pause: 300 }, 'jd_tick_q']);
      armIdle(() => Sound.say(['ls_' + sayId, { pause: 300 }, 'jd_tick_q']));
    });
  }

  // ---------- ② 聲音光球：ow / ew / aw、or / ar / ir ----------
  function buildSockets(n) {
    hud.className = 'sockets';
    put(hud, '<i></i>'.repeat(n));
  }
  async function orbIn(tk, i, team) {
    const sock = hud.querySelectorAll('i')[i];
    if (sock) { put(sock, LightArt.orb(team)); restart(sock, 'on'); }
    pose('lg-beam', 800);
    Sound.sfx.beam();
    await Sound.say([{ pause: 150 }, praise(), { pause: 250 }]);
  }
  // 字 + 空位：horse → ['h', 'or', 'se']
  function splitWord(id) {
    const w = THING[id].word, tm = THING[id].team, at = w.indexOf(tm);
    return [w.slice(0, at), tm, w.slice(at + tm.length)];
  }
  function askGap(q, tk, inHome) {
    return new Promise((resolve) => {
      play.className = 'mode-gap' + (inHome ? ' in-home' : '');
      play.replaceChildren();
      const [pre, tm, post] = splitWord(q.id);
      const wrap = document.createElement('div');
      wrap.className = 'lg-wordwrap';
      put(wrap, `<div class="lg-pic">${LightArt.thing(q.id)}</div>
        <div class="lg-word"><span class="pre"></span><span class="lg-gap"></span><span class="post"></span></div>`);
      wrap.querySelector('.pre').textContent = pre;
      wrap.querySelector('.post').textContent = post;
      const gap = wrap.querySelector('.lg-gap');
      const row = document.createElement('div');
      row.className = 'lg-orbs';
      play.append(wrap, row);
      restart(wrap, 'in');
      const key = 'lw_' + q.id;
      let misses = 0, done = false;
      arm();
      const btns = shuffle(familyOf(tm)).map((t, i) => {
        const b = document.createElement('button');
        b.className = 'lg-orbbtn';
        b.dataset.t = t;
        b.style.setProperty('--c', LightArt.TEAM_COLS[t]);
        b.style.animationDelay = i * 100 + 'ms';
        put(b, `<span class="ob-art">${LightArt.orb(t)}</span><span class="ob-txt"></span>`);
        b.querySelector('.ob-txt').textContent = t;
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (t === tm) {
            done = true;
            clearTimeout(idleTimer);
            dbg.target = null;
            record(q.id, 'gap', misses === 0);
            if (misses === 0) gainLight(b);
            Sound.clear();
            btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            restart(b, 'right');
            gap.textContent = tm;
            gap.style.setProperty('--c', LightArt.TEAM_COLS[tm]);
            restart(gap, 'filled');
            Sound.sfx.pop();
            Sound.say([{ pause: 200 }, ...teamKeys(tm), { pause: 250 }, { fn: () => restart(wrap.querySelector('.lg-pic'), 'yay') }, key, { pause: 300 }]).then(() => resolve('ok'));
          } else {
            misses++;
            miss(b, [key, { pause: 200 }, 'li_orb_q']);
            if (misses >= 2) btns.find((x) => x.dataset.t === tm).classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      dbg.target = btns.find((x) => x.dataset.t === tm);
      Sound.say([key, { pause: 300 }, 'li_orb_q']);
      armIdle(() => Sound.say([key, { pause: 300 }, 'li_orb_q']));
    });
  }

  // ---------- ③ 光之橋：砌字 ----------
  function buildBridge(n) {
    hud.className = 'bridge';
    put(hud, `<span class="lg-cliff"></span>${'<i></i>'.repeat(n)}<span class="lg-cliff r"></span><span class="lg-minibus">${LightArt.bus()}</span>`);
  }
  function plank(i) {
    const seg = hud.querySelectorAll('i')[i];
    if (seg) restart(seg, 'on');
    pose('lg-beam', 800);
    Sound.sfx.beam();
  }
  async function busCross(tk) {
    const b = hud.querySelector('.lg-minibus');
    if (b) restart(b, 'go');
    Sound.sfx.whoosh();
    await sayMin([{ pause: 200 }, 'li_bridge_ok', { pause: 300 }], 2200);
  }

  function askSpell(id, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-spell';
      play.replaceChildren();
      const word = THING[id].word, team = THING[id].team;
      const at = word.indexOf(team);
      const wrap = document.createElement('div');
      wrap.className = 'sp-wrap';
      put(wrap, `<div class="sp-pic">${LightArt.thing(id)}</div><div class="sp-slots"></div>`);
      const slotsEl = wrap.querySelector('.sp-slots');
      const slots = [...word].map(() => { const s = document.createElement('span'); s.className = 'sp-slot'; slotsEl.appendChild(s); return s; });
      const field = document.createElement('div');
      field.className = 'sp-crystals';
      play.append(wrap, field);
      restart(wrap, 'in');
      // 多一粒干擾字母（cow 畀多粒 a、bird 畀多粒 u …）
      const decoy = unit.decoy[team];
      let next = 0, misses = 0, wordMisses = 0, busy = false;
      arm();
      const crystals = shuffle([...word, decoy]).map((l, i) => {
        const c = document.createElement('button');
        c.className = 'crystal';
        c.textContent = l;
        c.dataset.l = l;
        c.style.setProperty('--dy', (i % 2 ? 1 : -1) * (6 + Math.random() * 10) + '%');
        c.style.animationDelay = (i * 120) + 'ms, ' + (-i * 0.7) + 's';
        c.addEventListener('pointerdown', (ev) => { ev.preventDefault(); onTap(c); });
        field.appendChild(c);
        return c;
      });
      const live = () => crystals.filter((c) => !c.classList.contains('used'));
      const target = () => live().find((c) => c.dataset.l === word[next]);
      dbg.target = target();
      const prompt = ['jd_spell_q', { pause: 150 }, 'lw_' + id];

      function onTap(c) {
        if (busy || lock || tk !== token || c.classList.contains('used')) return;
        if (c.dataset.l === word[next]) {
          clearTimeout(idleTimer);
          crystals.forEach((x) => x.classList.remove('hint'));
          const slot = slots[next];
          const from = c.getBoundingClientRect();
          c.classList.add('used');
          slot.textContent = c.dataset.l;
          slot.classList.add('filled');
          flip(slot, from, 450);
          Sound.sfx.pop();
          Sound.say([letterKey(c.dataset.l)]);
          next++;
          misses = 0;
          if (next < word.length) { dbg.target = target(); armIdle(idleHint); return; }
          // 砌完：字母拍檔兩格發光，再讀成個字
          busy = true;
          dbg.target = null;
          record(id, 'spell', wordMisses === 0);
          if (wordMisses === 0) gainLight(slotsEl);
          live().forEach((x) => x.classList.add('fade'));
          slots[at].classList.add('team', 'tm-' + team);
          slots[at + 1].classList.add('team', 'tm-' + team);
          slots[at].style.setProperty('--c', LightArt.TEAM_COLS[team]);
          slots[at + 1].style.setProperty('--c', LightArt.TEAM_COLS[team]);
          Sound.sfx.beam();
          Sound.say([
            { pause: 350 },
            ...slots.flatMap((s, i) => [{ fn: () => restart(s, 'glow') }, letterKey(word[i]), { pause: 120 }]),
            { pause: 200 }, { fn: () => { restart(wrap.querySelector('.sp-pic'), 'yay'); Sound.sfx.hatch(); } },
            'lw_' + id, { pause: 300 }, praise(), { pause: 400 }
          ]).then(() => resolve('ok'));
        } else {
          misses++;
          if (misses === 1) {
            wordMisses++;
            miss(c, [...prompt]);
          } else {
            restart(c, 'wiggle');
            Sound.sfx.soft();
            Sound.clear();
            Sound.say([letterKey(c.dataset.l)]);
          }
          if (misses >= 2) target().classList.add('hint');
        }
      }
      function idleHint() {
        Sound.say(prompt);
        const t = target();
        if (t) t.classList.add('hint');
      }
      Sound.say(prompt);
      armIdle(idleHint);
    });
  }

  function flip(el, from, ms) {
    const to = el.getBoundingClientRect();
    if (!el.animate || !to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.2)` }, { transform: 'translate(0,0) scale(1)' }],
      { duration: ms, easing: 'cubic-bezier(.3,1.3,.5,1)' });
  }

  // ---------- ④ 送 BB 怪獸返屋企 ----------
  async function homeRun(tk, plan) {
    play.replaceChildren();
    document.body.classList.add('light-home');
    hud.className = 'steps';
    put(hud, plan.map(() => `<span class="lg-step">${LightArt.step()}</span>`).join('') + `<span class="lg-cave">${LightArt.cave()}</span>`);
    babyEl.className = 'enter';
    Sound.sfx.bubble();
    await wait(900);
    if (tk !== token) return;
    babyEl.classList.add('cry');
    await Sound.say(['li_baby', { pause: 250 }, 'li_baby_go', { pause: 300 }]);
    if (tk !== token) return;
    for (let i = 0; i < plan.length; i++) {
      const q = plan[i];
      if (q.type === 'truth') await askTruth(q, tk, true);
      else if (q.type === 'gap') await askGap(q, tk, true);
      else await askSort(q, tk);
      if (tk !== token) return;
      const s = hud.querySelectorAll('.lg-step')[i];
      if (s) restart(s, 'on');
      pose('hop', 700, babyEl);
      Sound.sfx.boing();
      await wait(500);
      if (tk !== token) return;
    }
    play.replaceChildren();
    // 怪獸媽媽嚟接
    mamaEl.className = 'enter';
    Sound.sfx.roar();
    await wait(1100);
    if (tk !== token) return;
    put(babyEl, LightArt.happy(LightArt.baby()));
    babyEl.className = 'hug';
    Sound.sfx.hatch();
    addFx('lg-hearts', '<i></i><i></i><i></i><i></i><i></i>');
    await sayMin(['li_mummy', { pause: 300 }], 2600);
    if (tk !== token) return;
    babyEl.className = 'leave';
    mamaEl.className = 'leave';
    await wait(1100);
    if (tk !== token) return;
    babyEl.className = '';
    mamaEl.className = '';
    put(babyEl, LightArt.baby());
    document.body.classList.remove('light-home');
    cleanupFx();
    hud.replaceChildren();
    hud.className = '';
  }

  // ow 似 cow（/aʊ/）定似 bowl（/əʊ/）？
  function askSort(q, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-sort in-home';
      play.replaceChildren();
      const t = THING[q.id], w = t.word, at = w.indexOf('ow');
      const top = document.createElement('div');
      top.className = 'lg-wordwrap';
      put(top, `<div class="lg-pic">${LightArt.thing(q.id)}</div>
        <div class="lg-word"><span class="pre"></span><span class="lg-ow"></span><span class="post"></span></div>`);
      top.querySelector('.pre').textContent = w.slice(0, at);
      top.querySelector('.lg-ow').textContent = 'ow';
      top.querySelector('.post').textContent = w.slice(at + 2);
      const row = document.createElement('div');
      row.className = 'lg-sorts';
      play.append(top, row);
      restart(top, 'in');
      const key = 'lw_' + q.id;
      let misses = 0, done = false;
      arm();
      const cards = ['cow', 'bowl'].map((k, i) => {
        const c = document.createElement('button');
        c.className = 'lg-sortcard s-' + k;
        c.dataset.k = k;
        c.style.animationDelay = i * 110 + 'ms';
        put(c, `<span class="sc-pic">${LightArt.thing(k)}</span><span class="sc-txt"><span></span><b>ow</b><span></span></span>`);
        const parts = c.querySelectorAll('.sc-txt > span');
        parts[0].textContent = k === 'cow' ? 'c' : 'b';
        parts[1].textContent = k === 'cow' ? '' : 'l';
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (k === t.ow) {
            done = true;
            clearTimeout(idleTimer);
            dbg.target = null;
            record(q.id, 'sort', misses === 0);
            if (misses === 0) gainLight(c);
            Sound.clear();
            cards.forEach((x) => { if (x !== c) x.classList.add('fade'); });
            restart(c, 'right');
            top.querySelector('.lg-ow').classList.add('s-' + k);
            restart(top.querySelector('.lg-pic'), 'yay');
            Sound.sfx.pop();
            Sound.say([{ pause: 200 }, 'li_sort_' + k, { pause: 250 }, key, { pause: 300 }]).then(() => resolve('ok'));
          } else {
            misses++;
            miss(c, [key, { pause: 200 }, 'li_sort_q']);
            if (misses >= 2) cards.find((x) => x.dataset.k === t.ow).classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      dbg.target = cards.find((x) => x.dataset.k === t.ow);
      Sound.say([key, { pause: 300 }, 'li_sort_q']);
      armIdle(() => Sound.say([key, { pause: 300 }, 'li_sort_q']));
    });
  }

  // ---------- 結局短片（救援，唔打交） ----------
  let fx = [];
  function cleanupFx() {
    fx.forEach((e) => e.remove());
    fx = [];
  }
  function cleanupBattle() {
    document.body.classList.remove('light-battle', 'light-night');
    cleanupFx();
    document.querySelectorAll('.jd-burst, .lg-spark, .lg-ray').forEach((e) => e.remove());
    heroEl.classList.remove('fly', 'super', 'gold', 'cheer', 'wave', 'charge');
  }
  function addFx(cls, markup) {
    const el = document.createElement('div');
    el.className = cls;
    if (markup) put(el, markup);
    screen.appendChild(el);
    fx.push(el);
    if (cls === 'lg-flash') setTimeout(() => { el.remove(); fx = fx.filter((x) => x !== el); }, 900);
    return el;
  }
  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function burstAt(p, big, kind) {
    const b = document.createElement('div');
    b.className = 'jd-burst' + (big ? ' big' : '') + (kind ? ' ' + kind : '');
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }
  // 由胸口光能燈射一條光去目標
  function ray(toEl) {
    const a = heroEl.getBoundingClientRect(), b = center(toEl);
    const p = { x: a.left + a.width * 0.5, y: a.top + a.height * 0.45 };
    const r = document.createElement('div');
    r.className = 'lg-ray';
    r.style.left = p.x + 'px';
    r.style.top = p.y + 'px';
    r.style.width = Math.hypot(b.x - p.x, b.y - p.y) + 'px';
    r.style.rotate = Math.atan2(b.y - p.y, b.x - p.x) * 180 / Math.PI + 'deg';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 900);
  }

  function battle(tk, id) {
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    heroEl.style.setProperty('--glow', 0);
    document.body.classList.add('light-battle');
    if (id === 'volcano') return endVolcano(tk);
    if (id === 'city') return endCity(tk);
    if (id === 'gold') return endGold(tk);
    return endBus(tk);
  }
  async function heroWins(tk, key) {
    heroEl.classList.add('cheer');
    Sound.sfx.hatch();
    await sayMin([key || 'li_win', { pause: 300 }], 2400);
    if (tk !== token) return;
    heroEl.classList.remove('cheer', 'fly', 'super', 'gold');
    document.body.classList.remove('light-battle', 'light-night');
    cleanupFx();
  }

  // 結局要 Luca 撳：撳到 → 回傳嗰個；等夠 autoMs 就自動揀第一個（唔會卡住）
  function waitTap(tk, els, autoMs, hintMs) {
    els = [].concat(els);
    return new Promise((resolve) => {
      let done = false, t1 = 0;
      const ons = els.map((el) => {
        const on = (e) => { e.preventDefault(); if (tk === token) finish(el); };
        el.addEventListener('pointerdown', on);
        return on;
      });
      function finish(el) {
        if (done) return;
        done = true;
        clearTimeout(t1); clearTimeout(t2);
        els.forEach((x, i) => { x.removeEventListener('pointerdown', ons[i]); x.classList.remove('tap-hint'); });
        if (els.includes(dbg.target)) dbg.target = null;
        resolve(el);
      }
      if (hintMs) t1 = setTimeout(() => restart(els[0], 'tap-hint'), hintMs);
      const t2 = setTimeout(() => finish(els[0]), autoMs);
      dbg.target = els[0];
    });
  }

  // 結局 1：巴士跌落橋 → 撳巴士 3 下 → 光之巨人一下一下托返上嚟 → 安全落地
  async function endBus(tk) {
    const bus = addFx('lg-bus', LightArt.bus());
    Sound.sfx.whoosh();
    restart(bus, 'fall');
    await wait(900);
    if (tk !== token) return;
    await sayMin(['lb_alarm', { pause: 200 }], 1800);
    if (tk !== token) return;
    heroEl.classList.add('fly');
    await sayMin(['lb_go', { pause: 100 }], 1500);
    if (tk !== token) return;
    for (let i = 1; i <= 3; i++) {
      await waitTap(tk, bus, 7000, 3500);
      if (tk !== token) return;
      ray(bus);
      Sound.sfx.beam();
      bus.style.setProperty('--lift', i);
      burstAt(center(bus));
      Sound.say(['en_' + i]);
      await wait(700);
      if (tk !== token) return;
    }
    bus.classList.add('safe');
    heroEl.classList.remove('fly');
    Sound.sfx.hatch();
    await wait(900);
    if (tk !== token) return;
    await sayMin(['lb_win', { pause: 200 }], 2200);
    if (tk !== token) return;
    await heroWins(tk);
  }

  // 結局 2：火山太熱 → 撳 3 朵雲 → 落雨 → 火山笑返、開花
  async function endVolcano(tk) {
    const v = addFx('lg-volcano volcano-fx erupt', EndArt.volcano());
    v.style.setProperty('--hot', 1);
    Sound.sfx.roar();
    restart($('#scene'), 'shake');
    await sayMin(['lv_alarm', { pause: 200 }], 2000);
    if (tk !== token) return;
    const portrait = innerHeight > innerWidth;
    const clouds = [0, 1, 2].map((i) => {
      const c = addFx('lg-cloud', LightArt.raincloud());
      c.style.left = (portrait ? 8 + i * 30 : 34 + i * 16) + 'vw';
      c.style.top = (portrait ? 46 : 8 + (i % 2) * 6) + 'vh';
      c.style.animationDelay = i * 150 + 'ms, ' + (-i * 0.7) + 's';
      return c;
    });
    await sayMin(['lv_go', { pause: 100 }], 1500);
    if (tk !== token) return;
    let left = clouds.slice();
    while (left.length) {
      const c = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== c);
      ray(c);
      Sound.sfx.bubble();
      const from = center(c), to = center(v);
      c.classList.add('raining');
      if (c.animate) c.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${to.x - from.x}px, ${to.y - from.y - v.getBoundingClientRect().height * 0.55}px)` }],
        { duration: 600, easing: 'ease-in-out', fill: 'forwards' });
      const n = 3 - left.length;
      v.style.setProperty('--hot', (1 - n / 3).toFixed(2));
      Sound.say(['en_' + n]);
      await wait(800);
      if (tk !== token) return;
    }
    v.classList.remove('erupt');
    v.classList.add('cool');
    Sound.sfx.hatch();
    await wait(600);
    if (tk !== token) return;
    clouds.forEach((c) => c.classList.add('gone'));
    await sayMin(['lv_win', { pause: 200 }], 2200);
    if (tk !== token) return;
    await heroWins(tk);
  }

  // 結局 3：停電成個城市黑晒 → 撳 3 棟大廈 → 一棟棟着燈 → 放煙花
  async function endCity(tk) {
    document.body.classList.add('light-night');
    Sound.sfx.thump();
    const portrait = innerHeight > innerWidth;
    const blds = [0, 1, 2].map((i) => {
      const b = addFx('lg-bld', EndArt.building());
      b.style.left = (portrait ? 10 + i * 30 : 40 + i * 18) + 'vw';
      b.style.animationDelay = i * 150 + 'ms';
      return b;
    });
    await sayMin(['lc_alarm', { pause: 200 }], 2000);
    if (tk !== token) return;
    await sayMin(['lc_go', { pause: 100 }], 1500);
    if (tk !== token) return;
    let left = blds.slice();
    while (left.length) {
      const b = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== b);
      ray(b);
      pose('lg-beam', 800);
      Sound.sfx.zap();
      b.classList.add('lit');
      burstAt(center(b));
      Sound.say(['en_' + (3 - left.length)]);
      await wait(700);
      if (tk !== token) return;
    }
    document.body.classList.remove('light-night');
    const fw = addFx('lg-fireworks', '<i></i><i></i><i></i><i></i><i></i><i></i>');
    fw.querySelectorAll('i').forEach((x, i) => setTimeout(() => { if (tk === token) Sound.sfx.pop(); }, 300 + i * 350));
    await sayMin(['lc_win', { pause: 200 }], 2600);
    if (tk !== token) return;
    await heroWins(tk);
  }

  // 金色貼紙：全部金勳章先有 → 金色光之巨人飛上天 → 撳 3 粒星 → 彩虹天空
  async function endGold(tk) {
    heroEl.classList.add('gold', 'super', 'fly');
    Sound.sfx.hatch();
    await sayMin(['lg_go', { pause: 200 }], 1800);
    if (tk !== token) return;
    const portrait = innerHeight > innerWidth;
    const stars = [0, 1, 2].map((i) => {
      const s = addFx('lg-star', EndArt.star(['#ffe680', '#ffb3c7', '#9fd3ff'][i]));
      s.style.left = (portrait ? 12 + i * 28 : 38 + i * 17) + 'vw';
      s.style.top = (portrait ? 50 + (i % 2) * 10 : 14 + (i % 2) * 22) + 'vh';
      s.style.animationDelay = i * 150 + 'ms, ' + (-i * 0.5) + 's';
      return s;
    });
    await sayMin(['lg_tap', { pause: 100 }], 1200);
    if (tk !== token) return;
    let left = stars.slice();
    while (left.length) {
      const s = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== s);
      burstAt(center(s), true);
      s.classList.add('got');
      Sound.sfx.zap();
      Sound.say(['en_' + (3 - left.length)]);
      await wait(600);
      if (tk !== token) return;
    }
    addFx('lg-rainbow', EndArt.rainbow());
    Sound.sfx.dance ? Sound.sfx.dance() : Sound.sfx.hatch();
    await sayMin(['lg_win', { pause: 200 }], 3000);
    if (tk !== token) return;
    await heroWins(tk);
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'light') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'light' && !document.body.classList.contains('light-done')) start(); });

  function renderStats(tbody, info) {
    tbody.replaceChildren();
    const row = (cells) => {
      const tr = document.createElement('tr');
      for (const v of cells) { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); }
      tbody.appendChild(tr);
    };
    const f = (s, k) => s[k] ? s[k + 'Ok'] + ' / ' + s[k] : '—';
    const truthIds = new Set(unit.truth.map((t) => t.id));
    for (const t of unit.things) {
      if (!t.team) continue;
      const s = st(t.id);
      const focus = unit.spell.some((x) => x.id === t.id && x.focus);
      row([(focus ? '★ ' : '') + t.word, truthIds.has(t.id) ? f(s, 'truth') : '—', unit.gap.includes(t.id) ? f(s, 'gap') : '—',
        SPELL.includes(t.id) ? f(s, 'spell') : '—', unit.sort.includes(t.id) ? f(s, 'sort') : '—']);
    }
    if (info) {
      const NAME = { scan: '點燈', orb: '光球', bridge: '光之橋', home: '送 BB 返屋企' };
      const ty = Object.assign({}, runs.types);
      info.textContent = STAGES.map((k) => { const r = Object.assign({ played: 0, gold: 0 }, runs[k]); return NAME[k] + '：玩 ' + r.played + '、金 ' + r.gold; }).join('　') +
        '　｜ 揀 Type：Sky ' + (ty.sky || 0) + '、Power ' + (ty.power || 0) + '、Multi ' + (ty.multi || 0);
    }
  }
  function resetStats() { stats = {}; runs = {}; store(STORE_KEY, stats); store(RUN_KEY, runs); ['lightTrap.v1', 'lightGapW.v1', 'lightGapR.v1', 'lightSpell.v1'].forEach((k) => store(k, [])); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    heroEl.classList.add('in');
    await wait(900);
    if (tk !== token) return;
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo, _dbg: dbg };
})();
