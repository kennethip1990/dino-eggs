/*
 * 機甲 Luca 出擊：學英文（全英文，Yorkland Starters R&W Part 1 Digraphs + Part 3 Long ee / ea）
 * 流程：太空怪獸 Gloop 嚟緊 → Robo-Luca 出擊
 *   → ① 雷達掃描 ×5：✓✗ 句子（工作紙陷阱圖：山羊 ≠ sheep、老鼠 ≠ mouth、梳化 ≠ chair、T-shirt ≠ shirt、蛋糕 ≠ lunch）
 *   → ② 能量核心 ×4：聽個字，揀 sh / ch / th / ph 補返空位
 *   → ③ 光束劍砌字 ×3：ee / ea 字（多一粒干擾字母）
 *   → ④ Gloop 決鬥 ×5：✓✗ / 核心 / ee 定 ea
 *   → 結局短片（3 個輪流，要 Luca 撳）→ 貼紙 → 勳章 → 拜拜
 * 同之前啲 game 唔同：主角有 5 格護盾（HP）。答錯扣一格 + 鎖住掣、讀多次題目先畀再答（唔好亂估）
 *   錯兩次啱嗰個會發光；護盾冇晒 → 返基地維修（5 秒叉電）→ 淨係重玩嗰一關；一格都冇扣 = 金勳章
 */
const RoboGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.ROBO_UNIT;
  const THING = Object.fromEntries(unit.things.map((t) => [t.id, t]));
  const SPELL = unit.spell.map((s) => s.id);
  const HP = 5, SCAN = 5, CORES = 4, SABER = 3;
  const sentence = (id) => THING[id].say || (THING[id].these ? 'These are ' : 'This is a ') + THING[id].word + '.';
  const STAGES = ['scan', 'core', 'saber', 'boss'];

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'roboWords.v1', RUN_KEY = 'roboRuns.v1';
  let stats = load(STORE_KEY, {});
  let runs = load(RUN_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const KINDS = ['truth', 'core', 'spell', 'team'];
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
    const r = runs[stage] = Object.assign({ played: 0, ko: 0, gold: 0 }, runs[stage]);
    r[field]++;
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
    const traps = fromBag('roboTrap.v1', unit.traps.map((t) => t.id), 2);
    return shuffle([truthQ(r[0], true), truthQ(r[1], true), truthQ(r[2], false), trapQ(traps[0]), trapQ(traps[1])]);
  }
  const planCore = () => fromBag('roboCore.v1', unit.core, CORES).map((id) => ({ type: 'core', id }));
  function planSaber() {
    // 工作紙 4 個字（meat / peas / feet / green）第一下就啱 2 次之前排先
    const focus = shuffle(unit.spell.filter((s) => s.focus && st(s.id).spellOk < 2).map((s) => s.id)).slice(0, SABER);
    const rest = fromBag('roboSpell.v1', SPELL.filter((id) => !focus.includes(id)), SABER - focus.length);
    return shuffle([...focus, ...rest]);
  }
  function planBoss(saberPlan) {
    const r = ranked(unit.truth.map((p) => p.id), 'truth').map((id) => unit.truth.find((p) => p.id === id));
    const trap = fromBag('roboTrap.v1', unit.traps.map((t) => t.id), 1)[0];
    const core = ranked(unit.core, 'core')[0];
    const teams = ranked(SPELL, 'team');
    // ee / ea：一個今局砌過嘅 + 一個最未熟嘅
    const t1 = pick(saberPlan), t2 = teams.find((id) => id !== t1 && THING[id].team !== THING[t1].team) || teams[0];
    return [truthQ(r[0], Math.random() < 0.5), { type: 'team', id: t1 }, { type: 'core', id: core }, trapQ(trap), { type: 'team', id: t2 }];
  }

  // ---------- DOM ----------
  const screen = $('#robo-screen'), robotEl = $('#rb-robot'), monEl = $('#rb-monster');
  const play = $('#robo-play'), hud = $('#robo-hud'), hpEl = $('#robo-hp'), againBtn = $('#robo-again');
  put($('#robo-bg'), JediArt.space().replace(/jdsky/g, 'rbsky'));   // gradient id 唔可以同其他 game 撞
  put(robotEl, RoboArt.robot());
  put(monEl, RoboArt.monster());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  let hp = HP;
  let lock = false;            // 答錯之後：讀完題目先可以再撳
  let armId = 0;
  // 新題目出咗頭 0.6 秒唔收撳（上一題撳多下唔會誤中新題扣護盾）
  function arm() {
    lock = true;
    const my = ++armId;
    setTimeout(() => { if (armId === my) lock = false; }, 600);
  }
  const dbg = { target: null, hp: () => hp };     // 開發測試：下一下應該撳邊個

  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => pick(['rb_yes_1', 'rb_yes_2', 'rb_yes_3']);
  const letterKey = (l) => Sound.has('ph_' + l) ? 'ph_' + l : 'ltr_' + l;
  const dgKeys = (dg) => Sound.has('dg_' + dg) ? ['dg_' + dg] : [...dg].map((l) => 'ltr_' + l);

  function pose(cls, ms, el) {
    el = el || robotEl;
    restart(el, cls);
    clearTimeout(el['_' + cls]);
    el['_' + cls] = setTimeout(() => el.classList.remove(cls), ms || 800);
  }

  function reset() {
    document.body.dataset.screen = 'robo';
    document.body.classList.remove('robo-done', 'robo-boss', 'robo-battle', 'robo-ko');
    cleanupBattle();
    robotEl.className = '';
    robotEl.style.removeProperty('--core');
    put(robotEl, RoboArt.robot());
    monEl.className = '';
    put(monEl, RoboArt.monster());
    play.className = '';
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    hpEl.replaceChildren();
    hpEl.hidden = true;
    lock = false;
    dbg.target = null;
  }

  // ---------- 護盾（HP） ----------
  function fillHp() {
    hp = HP;
    hpEl.hidden = false;
    put(hpEl, Array.from({ length: HP }, () => `<span class="rb-shield">${RoboArt.shield()}</span>`).join(''));
    hpEl.querySelectorAll('.rb-shield').forEach((s, i) => { s.style.animationDelay = i * 90 + 'ms'; restart(s, 'on'); });
  }
  // 扣一格：機械人震 + 火花；回傳 true = 冇晒
  function hurt() {
    hp = Math.max(0, hp - 1);
    const s = hpEl.querySelectorAll('.rb-shield:not(.lost)');
    if (s.length) restart(s[s.length - 1], 'lost');
    pose('hurt', 700);
    Sound.sfx.thump();
    const r = robotEl.getBoundingClientRect();
    burstAt({ x: r.left + r.width * 0.55, y: r.top + r.height * 0.45 }, false, 'zap');
    if (hp === 1) hpEl.classList.add('low');
    return hp === 0;
  }

  // 答錯通用處理：扣 HP；未冇晒就鎖住掣、讀多次題目
  // 回傳 'ko' = 護盾冇晒（個問題即刻完）
  function miss(el, replay, inBoss) {
    restart(el, 'wiggle');
    Sound.sfx.soft();
    if (inBoss) monsterAttack();
    const dead = hurt();
    Sound.clear();
    if (dead) { lock = true; return 'ko'; }
    lock = true;
    const my = ++armId;
    Sound.say([{ pause: inBoss ? 900 : 500 }, 'rb_look', { pause: 250 }, ...replay]).then(() => { if (armId === my) lock = false; });
    return null;
  }

  // ---------- 開始 ----------
  function start(opts) {
    const tk = ++token;
    Sound.clear();
    reset();
    run(tk, (opts && opts.from) || 1);
  }

  async function run(tk, from) {
    robotEl.classList.add('in');
    Sound.sfx.beam();
    await wait(900);
    if (tk !== token) return;
    const medals = [];
    let saberPlan = planSaber();
    if (from <= 1) {
      await Sound.say(['rb_hi', { pause: 250 }, 'rb_intro', { pause: 300 }]);
      if (tk !== token) return;
      fillHp();
      await Sound.say(['rb_shields', { pause: 300 }]);
      if (tk !== token) return;
    }
    if (from <= 1) {
      medals.push(await stage(tk, 'scan', async () => {
        const plan = planScan();
        buildDrones(plan.length);
        await Sound.say(['rb_scan', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          const r = await askTruth(plan[i], tk);
          if (r === 'ko') return 'ko';
          if (tk !== token) return;
          await zapDrone(tk, i);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 2) {
      medals.push(await stage(tk, 'core', async () => {
        const plan = planCore();
        buildSockets(plan.length);
        await Sound.say([{ pause: 200 }, 'rb_core', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          const r = await askCore(plan[i], tk);
          if (r === 'ko') return 'ko';
          if (tk !== token) return;
          await coreIn(tk, i, THING[plan[i].id].dg);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 3) {
      medals.push(await stage(tk, 'saber', async () => {
        saberPlan = planSaber();
        buildMeter(saberPlan.length);
        await Sound.say([{ pause: 200 }, 'rb_saber', { pause: 250 }]);
        for (let i = 0; i < saberPlan.length; i++) {
          if (tk !== token) return;
          const r = await askSpell(saberPlan[i], tk);
          if (r === 'ko') return 'ko';
          if (tk !== token) return;
          fillMeter(i);
        }
        play.replaceChildren();
        robotEl.classList.add('charged');
        Sound.sfx.saber();
        pose('slash', 900);
        await sayMin(['rb_ready', { pause: 300 }], 1600);
      }));
      if (tk !== token) return;
    }
    // ④ Gloop 決鬥
    medals.push(await stage(tk, 'boss', async () => {
      const r = await bossFight(tk, planBoss(saberPlan));
      if (r === 'ko') return 'ko';
    }));
    if (tk !== token) return;
    const end = Rewards.next('robo');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('robo', end, 'en');
    if (tk !== token) return;
    await showMedals(tk, medals);
    if (tk !== token) return;
    await finale(tk);
  }

  // 一關：HP 補滿 → 玩 → 護盾冇晒就返基地維修再玩過（淨係呢關）；回傳 true = 金勳章（一格都冇扣）
  async function stage(tk, name, body) {
    let ko = false;
    for (;;) {
      if (tk !== token) return false;
      play.replaceChildren();
      hud.replaceChildren();
      hud.className = '';
      if (hp < HP || hpEl.hidden) fillHp();
      hpEl.classList.remove('low');
      bump(name, 'played');
      const r = await body();
      if (tk !== token) return false;
      if (r !== 'ko') break;
      ko = true;
      bump(name, 'ko');
      await recharge(tk);
    }
    const gold = !ko && hp === HP;
    if (gold) {
      bump(name, 'gold');
      Sound.sfx.hatch();
      restart(hpEl, 'perfect');
      await Sound.say([{ pause: 200 }, 'rb_perfect', { pause: 300 }]);
    }
    return gold;
  }

  // 返基地維修：技師機械人叉電 5 格（每秒一格），可以撳技師玩
  async function recharge(tk) {
    clearTimeout(idleTimer);
    dbg.target = null;
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    document.body.classList.add('robo-ko');
    pose('hurt', 900);
    Sound.sfx.whoosh();
    await sayMin(['rb_ko', { pause: 300 }], 1800);
    if (tk !== token) return;
    const bay = addFx('rb-bay', `<div class="rb-mech">${RoboArt.mechanic()}</div><div class="rb-battery">${'<i></i>'.repeat(HP)}</div>`);
    const mech = bay.querySelector('.rb-mech');
    mech.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token) { Sound.sfx.boing(); restart(mech, 'boop'); } });
    Sound.say(['rb_fix']);
    const cells = [...bay.querySelectorAll('.rb-battery i')];
    for (let i = 0; i < cells.length; i++) {
      await wait(1000);
      if (tk !== token) return;
      restart(cells[i], 'on');
      restart(mech, 'fix');
      Sound.sfx.pop();
    }
    Sound.sfx.hatch();
    fillHp();
    hpEl.classList.remove('low');
    document.body.classList.remove('robo-ko');
    robotEl.classList.add('powered');
    await sayMin([{ pause: 200 }, 'rb_full', { pause: 300 }], 2000);
    robotEl.classList.remove('powered');
    bay.remove();
    fx = fx.filter((x) => x !== bay);
  }

  async function finale(tk) {
    play.replaceChildren();
    hud.replaceChildren();
    hpEl.hidden = true;
    robotEl.classList.add('wave');
    await Sound.say([{ pause: 300 }, 'rb_bye']);
    if (tk !== token) return;
    document.body.classList.add('robo-done');
  }

  // 勳章：每關一個，金 = 一格護盾都冇扣
  async function showMedals(tk, medals) {
    if (!medals.length) return;
    play.className = 'mode-medals';
    put(play, `<div class="rb-medals">${medals.map((g, i) => `<span class="rb-medal${g ? ' gold' : ''}" style="animation-delay:${i * 250}ms">${RoboArt.medal(g)}</span>`).join('')}</div>`);
    medals.forEach((g, i) => setTimeout(() => { if (tk === token) (g ? Sound.sfx.hatch : Sound.sfx.pop)(); }, i * 250 + 200));
    const golds = medals.filter(Boolean).length;
    await sayMin(['rb_medals', { pause: 300 }, golds === medals.length ? 'rb_all_gold' : golds ? 'rb_some_gold' : 'rb_no_gold', { pause: 400 }], 3000);
  }

  // ---------- ① 雷達掃描：✓✗ ----------
  function buildDrones(n) {
    hud.className = 'drones';
    put(hud, Array.from({ length: n }, () => `<span class="rb-drone">${JediArt.droid()}</span>`).join(''));
  }
  async function zapDrone(tk, i) {
    const d = hud.querySelectorAll('.rb-drone')[i];
    pose('slash', 800);
    Sound.sfx.zap();
    if (d) { burstAt(center(d), true); restart(d, 'zapped'); }
    await Sound.say([{ pause: 200 }, praise(), { pause: 250 }]);
  }

  function askTruth(q, tk, inBoss) {
    return new Promise((resolve) => {
      play.className = 'mode-truth' + (inBoss ? ' in-boss' : '');
      play.replaceChildren();
      const sayId = q.isTrue ? q.id : q.lie;
      const h = document.createElement('div');
      h.className = 'holo';
      put(h, `<div class="holo-pic">${RoboArt.thing(q.id)}</div>
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
          Sound.clear();
          mark(kind);
          btn[kind === 'tick' ? 'cross' : 'tick'].classList.add('fade');
          Object.values(btn).forEach((b) => b.classList.remove('hint'));
          if (!q.trap) record(q.id, 'truth', misses === 0);
          Sound.sfx.saber();
          if (kind === 'tick') {
            Sound.say([{ pause: 200 }, 'jd_tick', { pause: 300 }]).then(() => resolve('ok'));
            return;
          }
          restart(h, 'slashed');
          const after = q.trap ? ['rn_' + q.id]
            : [{ fn: () => { h.classList.remove('slashed'); text.textContent = sentence(q.id); restart(text, 'fixed'); mark('tick'); } }, 'rs_' + q.id];
          Sound.say([{ pause: 200 }, 'jd_cross', { pause: 250 }, ...after, { pause: 300 }]).then(() => resolve('ok'));
        } else {
          misses++;
          if (miss(btn[kind], ['rs_' + sayId, { pause: 200 }, 'jd_tick_q'], inBoss) === 'ko') { done = true; clearTimeout(idleTimer); return resolve('ko'); }
          if (misses >= 2) btn[right].classList.add('hint');
        }
      }
      Sound.say(['rs_' + sayId, { pause: 300 }, 'jd_tick_q']);
      armIdle(() => Sound.say(['rs_' + sayId, { pause: 300 }, 'jd_tick_q']));
    });
  }

  // ---------- ② 能量核心：sh / ch / th / ph ----------
  function buildSockets(n) {
    hud.className = 'sockets';
    put(hud, '<i></i>'.repeat(n));
  }
  async function coreIn(tk, i, dg) {
    const sock = hud.querySelectorAll('i')[i];
    const col = RoboArt.CORE_COLS[dg];
    if (sock) { put(sock, RoboArt.core(dg)); restart(sock, 'on'); }
    robotEl.style.setProperty('--core', col);
    restart(robotEl, 'coreflash');
    Sound.sfx.beam();
    await Sound.say([{ pause: 150 }, praise(), { pause: 250 }]);
  }
  // 字 + 空位：sheep → ['', 'sh', 'eep']
  function splitWord(id) {
    const w = THING[id].word, dg = THING[id].dg, at = w.indexOf(dg);
    return [w.slice(0, at), dg, w.slice(at + dg.length)];
  }
  function askCore(q, tk, inBoss) {
    return new Promise((resolve) => {
      play.className = 'mode-core' + (inBoss ? ' in-boss' : '');
      play.replaceChildren();
      const [pre, dg, post] = splitWord(q.id);
      const wrap = document.createElement('div');
      wrap.className = 'rb-wordwrap';
      put(wrap, `<div class="rb-pic">${RoboArt.thing(q.id)}</div>
        <div class="rb-word"><span class="pre"></span><span class="rb-gap"></span><span class="post"></span></div>`);
      wrap.querySelector('.pre').textContent = pre;
      wrap.querySelector('.post').textContent = post;
      const gap = wrap.querySelector('.rb-gap');
      const row = document.createElement('div');
      row.className = 'rb-cores';
      play.append(wrap, row);
      restart(wrap, 'in');
      const key = 'rw_' + q.id;
      let misses = 0, done = false;
      arm();
      const btns = shuffle(unit.digraphs).map((d, i) => {
        const b = document.createElement('button');
        b.className = 'rb-corebtn';
        b.dataset.dg = d;
        b.style.setProperty('--c', RoboArt.CORE_COLS[d]);
        b.style.animationDelay = i * 100 + 'ms';
        put(b, `<span class="cb-art">${RoboArt.core(d)}</span><span class="cb-txt"></span>`);
        b.querySelector('.cb-txt').textContent = d;
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (d === dg) {
            done = true;
            clearTimeout(idleTimer);
            record(q.id, 'core', misses === 0);
            Sound.clear();
            btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            restart(b, 'right');
            gap.textContent = dg;
            gap.style.setProperty('--c', RoboArt.CORE_COLS[dg]);
            restart(gap, 'filled');
            Sound.sfx.pop();
            Sound.say([{ pause: 200 }, ...dgKeys(dg), { pause: 250 }, { fn: () => restart(wrap.querySelector('.rb-pic'), 'yay') }, key, { pause: 300 }]).then(() => resolve('ok'));
          } else {
            misses++;
            if (miss(b, [key, { pause: 200 }, 'rb_core_q'], inBoss) === 'ko') { done = true; clearTimeout(idleTimer); return resolve('ko'); }
            if (misses >= 2) btns.find((x) => x.dataset.dg === dg).classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      dbg.target = btns.find((x) => x.dataset.dg === dg);
      Sound.say([key, { pause: 300 }, 'rb_core_q']);
      armIdle(() => Sound.say([key, { pause: 300 }, 'rb_core_q']));
    });
  }

  // ---------- ③ 光束劍砌字：ee / ea ----------
  function buildMeter(n) {
    hud.className = 'meter';
    put(hud, '<i></i>'.repeat(n));
  }
  function fillMeter(i) {
    const seg = hud.querySelectorAll('i')[i];
    if (seg) restart(seg, 'on');
    Sound.sfx.beam();
  }

  function askSpell(id, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-spell';
      play.replaceChildren();
      const word = THING[id].word, team = THING[id].team;
      const at = word.indexOf(team);
      const wrap = document.createElement('div');
      wrap.className = 'sp-wrap';
      put(wrap, `<div class="sp-pic">${RoboArt.thing(id)}</div><div class="sp-slots"></div>`);
      const slotsEl = wrap.querySelector('.sp-slots');
      const slots = [...word].map(() => { const s = document.createElement('span'); s.className = 'sp-slot'; slotsEl.appendChild(s); return s; });
      const field = document.createElement('div');
      field.className = 'sp-crystals';
      play.append(wrap, field);
      restart(wrap, 'in');
      // 多一粒干擾字母：ee 字畀 a，ea 字畀多粒 e（好似工作紙）
      const decoy = team === 'ee' ? 'a' : 'e';
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
      const prompt = ['jd_spell_q', { pause: 150 }, 'rw_' + id];

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
          // 砌完：ee / ea 兩格發光（孖寶 / 拍檔），再讀成個字
          busy = true;
          dbg.target = null;
          record(id, 'spell', wordMisses === 0);
          live().forEach((x) => x.classList.add('fade'));
          slots[at].classList.add('team', team);
          slots[at + 1].classList.add('team', team);
          Sound.sfx.beam();
          Sound.say([
            { pause: 350 },
            ...slots.flatMap((s, i) => [{ fn: () => restart(s, 'glow') }, letterKey(word[i]), { pause: 120 }]),
            { pause: 200 }, { fn: () => { restart(wrap.querySelector('.sp-pic'), 'yay'); Sound.sfx.hatch(); } },
            'rw_' + id, { pause: 250 }, 'rb_team_' + team, { pause: 300 }, praise(), { pause: 400 }
          ]).then(() => resolve('ok'));
        } else {
          misses++;
          // 每格錯第一次先扣護盾（逐粒字母咁扣會太快冇晒）
          if (misses === 1) {
            wordMisses++;
            if (miss(c, [...prompt], false) === 'ko') { busy = true; clearTimeout(idleTimer); return resolve('ko'); }
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

  // 決鬥：ee 定 ea？（m _ _ t）
  function askTeam(q, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-core in-boss';
      play.replaceChildren();
      const word = THING[q.id].word, team = THING[q.id].team, at = word.indexOf(team);
      const wrap = document.createElement('div');
      wrap.className = 'rb-wordwrap';
      put(wrap, `<div class="rb-pic">${RoboArt.thing(q.id)}</div>
        <div class="rb-word"><span class="pre"></span><span class="rb-gap"></span><span class="post"></span></div>`);
      wrap.querySelector('.pre').textContent = word.slice(0, at);
      wrap.querySelector('.post').textContent = word.slice(at + 2);
      const gap = wrap.querySelector('.rb-gap');
      const row = document.createElement('div');
      row.className = 'rb-teams';
      play.append(wrap, row);
      restart(wrap, 'in');
      const key = 'rw_' + q.id;
      let misses = 0, done = false;
      arm();
      const chips = shuffle(['ee', 'ea']).map((t, i) => {
        const c = document.createElement('button');
        c.className = 'wcard rb-team ' + t;
        c.dataset.t = t;
        c.textContent = t;
        c.style.animationDelay = i * 110 + 'ms';
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || lock || tk !== token) return;
          if (t === team) {
            done = true;
            clearTimeout(idleTimer);
            record(q.id, 'team', misses === 0);
            Sound.clear();
            chips.forEach((x) => { if (x !== c) x.classList.add('fade'); });
            restart(c, 'right');
            gap.textContent = team;
            gap.classList.add(team);
            restart(gap, 'filled');
            Sound.sfx.pop();
            Sound.say([{ pause: 200 }, { fn: () => restart(wrap.querySelector('.rb-pic'), 'yay') }, key, { pause: 250 }, 'rb_team_' + team, { pause: 300 }]).then(() => resolve('ok'));
          } else {
            misses++;
            if (miss(c, [key, { pause: 200 }, 'rb_team_q'], true) === 'ko') { done = true; clearTimeout(idleTimer); return resolve('ko'); }
            if (misses >= 2) chips.find((x) => x.dataset.t === team).classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      dbg.target = chips.find((x) => x.dataset.t === team);
      Sound.say([key, { pause: 300 }, 'rb_team_q']);
      armIdle(() => Sound.say([key, { pause: 300 }, 'rb_team_q']));
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

  // ---------- ④ Gloop 決鬥 ----------
  async function bossFight(tk, plan) {
    play.replaceChildren();
    document.body.classList.add('robo-boss');
    hud.className = 'hearts';
    put(hud, `<span class="h-face">${RoboArt.monster().replace('viewBox="0 0 260 240"', 'viewBox="30 30 180 180"')}</span>` + plan.map(() => `<span class="heart">${JediArt.heart()}</span>`).join(''));
    monEl.className = 'enter';
    Sound.sfx.roar();
    restart($('#scene'), 'shake');
    await wait(1100);
    if (tk !== token) return;
    await Sound.say(['rb_boss', { pause: 250 }, 'rb_boss_go', { pause: 300 }]);
    if (tk !== token) return;
    for (const q of plan) {
      let r;
      if (q.type === 'truth') r = await askTruth(q, tk, true);
      else if (q.type === 'core') r = await askCore(q, tk, true);
      else r = await askTeam(q, tk);
      if (tk !== token) return;
      if (r === 'ko') { monEl.className = 'laugh'; await sayMin(['gm_laugh'], 1000); monEl.className = ''; document.body.classList.remove('robo-boss'); return 'ko'; }
      await strike(tk);
      if (tk !== token) return;
    }
    play.replaceChildren();
    monEl.classList.add('dizzy');
    await sayMin(['gm_give', { pause: 300 }], 2200);
    if (tk !== token) return;
    monEl.classList.add('flee');
    Sound.sfx.whoosh();
    await wait(1200);
    if (tk !== token) return;
    monEl.className = '';
    document.body.classList.remove('robo-boss');
    hud.replaceChildren();
    hud.className = '';
  }

  // 答錯：Gloop 笑 + 噴 goo 射向機械人
  function monsterAttack() {
    restart(monEl, 'laugh');
    const a = center(monEl), b = center(robotEl);
    const goo = document.createElement('div');
    goo.className = 'rb-goo';
    goo.style.left = (a.x - monEl.getBoundingClientRect().width * 0.3) + 'px';
    goo.style.top = a.y + 'px';
    document.body.appendChild(goo);
    Sound.sfx.bubble();
    const done = () => goo.remove();
    if (!goo.animate) return done();
    goo.animate([{ transform: 'translate(-50%,-50%) scale(.4)' }, { transform: `translate(calc(-50% + ${b.x - a.x + monEl.getBoundingClientRect().width * 0.3}px), calc(-50% + ${b.y - a.y}px)) scale(1.2)` }],
      { duration: 450, easing: 'ease-in' }).onfinish = () => { burstAt(b, false, 'goo'); done(); };
  }

  async function strike(tk) {
    dbg.target = null;
    await lunge(tk, () => {
      const hearts = hud.querySelectorAll('.heart:not(.lost)');
      if (hearts.length) restart(hearts[hearts.length - 1], 'lost');
    });
    if (tk !== token) return;
    await Sound.say(['gm_ouch_' + (1 + Math.floor(Math.random() * 3)), { pause: 300 }]);
  }

  // 衝向 Gloop → 光束劍斬 → 返原位
  function lunge(tk, onHit) {
    const svg = robotEl.querySelector('svg');
    const a = center(robotEl), b = center(monEl);
    const dx = (b.x - a.x) * 0.55, dy = (b.y - a.y) * 0.4;
    Sound.sfx.saber();
    pose('slash', 900);
    setTimeout(() => {
      if (tk !== token) return;
      Sound.sfx.clash();
      burstAt({ x: (a.x + dx + b.x) / 2 + 20, y: b.y - 20 }, true);
      restart(monEl, 'hit');
      if (onHit) onHit();
    }, 380);
    if (!svg.animate) return wait(900);
    return new Promise((r) => {
      svg.animate([
        { transform: 'translate(0,0)' },
        { transform: `translate(${dx}px, ${dy}px)`, offset: 0.4 },
        { transform: `translate(${dx * 0.92}px, ${dy}px)`, offset: 0.6 },
        { transform: 'translate(0,0)' }
      ], { duration: 900, easing: 'ease-in-out' }).onfinish = r;
      setTimeout(r, 1200);
    });
  }

  // ---------- 結局短片 ----------
  let fx = [];
  function cleanupBattle() {
    document.body.classList.remove('robo-battle');
    fx.forEach((e) => e.remove());
    fx = [];
    document.querySelectorAll('.jd-burst, .rb-goo, .rb-ray').forEach((e) => e.remove());
    monEl.onpointerdown = null;
    robotEl.classList.remove('powered', 'charged', 'giant', 'cheer', 'wave');
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
  function burstAt(p, big, kind) {
    const b = document.createElement('div');
    b.className = 'jd-burst' + (big ? ' big' : '') + (kind ? ' ' + kind : '');
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }

  function battle(tk, id) {
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    hpEl.hidden = true;
    if (id === 'punch') return battlePunch(tk);
    if (id === 'parts') return battleParts(tk);
    return battleCannon(tk);
  }

  // 結局入面要 Luca 撳：撳到 → 回傳嗰個；等夠 autoMs 就自動揀第一個（唔會卡住）
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

  async function monsterBack(tk, alarmKey) {
    document.body.classList.add('robo-battle', 'robo-boss');
    monEl.className = 'enter';
    Sound.sfx.roar();
    await wait(1100);
    if (tk !== token) return;
    restart(monEl, 'laugh');
    await sayMin([alarmKey, { pause: 200 }], 2200);
  }
  async function robotWins(tk, key) {
    robotEl.classList.add('powered');
    Sound.sfx.hatch();
    await sayMin([key, { pause: 300 }], 2400);
    if (tk !== token) return;
    robotEl.classList.remove('powered');
    document.body.classList.remove('robo-battle', 'robo-boss');
    monEl.className = '';
  }
  // 由機械人胸口射一條光束去 Gloop
  function ray(big) {
    const a = robotEl.getBoundingClientRect(), b = center(monEl);
    const p = { x: a.left + a.width * 0.5, y: a.top + a.height * 0.6 };
    const r = addFx('rb-ray' + (big ? ' big' : ''));
    r.style.left = p.x + 'px';
    r.style.top = p.y + 'px';
    r.style.width = Math.hypot(b.x - p.x, b.y - p.y) + 'px';
    r.style.rotate = Math.atan2(b.y - p.y, b.x - p.x) * 180 / Math.PI + 'deg';
    setTimeout(() => { r.remove(); }, 900);
    return r;
  }

  // 結局 1：撳 3 下叉滿胸口光束炮 → 發射 → Gloop 縮細變 BB 怪獸，做朋友
  async function battleCannon(tk) {
    await monsterBack(tk, 'cn_alarm');
    if (tk !== token) return;
    await sayMin(['cn_go', { pause: 100 }], 1600);
    if (tk !== token) return;
    const layer = addFx('rb-taplayer');
    const gauge = addFx('rb-gauge', '<i></i>'.repeat(3));
    for (let i = 0; i < 3; i++) {
      await waitTap(tk, layer, 7000, 3500);
      if (tk !== token) return;
      restart(gauge.querySelectorAll('i')[i], 'on');
      robotEl.style.setProperty('--core', ['#6fd0ff', '#ffd36e', '#ff7ad9'][i]);
      restart(robotEl, 'coreflash');
      Sound.sfx.beam();
      Sound.say(['en_' + (i + 1)]);
      await wait(500);
      if (tk !== token) return;
    }
    layer.remove();
    gauge.remove();
    robotEl.classList.add('charged');
    await sayMin(['cn_fire'], 1200);
    if (tk !== token) return;
    ray(true);
    Sound.sfx.zap();
    await wait(400);
    if (tk !== token) return;
    burstAt(center(monEl), true);
    restart(monEl, 'hit');
    Sound.sfx.clash();
    await wait(600);
    if (tk !== token) return;
    put(monEl, RoboArt.happyMonster());
    monEl.classList.add('friendly');
    Sound.sfx.hatch();
    burstAt(center(monEl));
    await sayMin(['cn_good', { pause: 300 }], 2600);
    if (tk !== token) return;
    monEl.classList.add('cheer');
    robotEl.classList.add('cheer');
    await sayMin(['cn_win', { pause: 200 }], 1600);
    if (tk !== token) return;
    robotEl.classList.remove('cheer', 'charged');
    await robotWins(tk, 'rb_win');
  }

  // 結局 2：撳 Gloop 3 下 = 3 下火箭飛拳 → Gloop 飛去太空變星星
  async function battlePunch(tk) {
    await monsterBack(tk, 'pu_alarm');
    if (tk !== token) return;
    await sayMin(['pu_go', { pause: 100 }], 1600);
    if (tk !== token) return;
    for (let i = 1; i <= 3; i++) {
      await waitTap(tk, monEl, 7000, 3500);
      if (tk !== token) return;
      Sound.say(['en_' + i]);
      await rocketFist(tk, i === 3);
      if (tk !== token) return;
    }
    monEl.classList.add('blast');
    Sound.sfx.whoosh();
    await wait(1000);
    if (tk !== token) return;
    const s = addFx('rb-twinkle', EndArt.star('#ffe680'));
    Sound.sfx.hatch();
    setTimeout(() => s.remove(), 2600);
    await sayMin(['pu_win', { pause: 200 }], 2400);
    if (tk !== token) return;
    await robotWins(tk, 'rb_win');
  }
  function rocketFist(tk, last) {
    const a = robotEl.getBoundingClientRect(), b = center(monEl);
    const f = addFx('rb-fist', RoboArt.fist());
    const p = { x: a.left + a.width * 0.85, y: a.top + a.height * 0.55 };
    f.style.left = p.x + 'px';
    f.style.top = p.y + 'px';
    pose('punch', 600);
    Sound.sfx.whoosh();
    return new Promise((resolve) => {
      const hit = () => {
        f.remove();
        burstAt(b, true);
        restart(monEl, 'hit');
        Sound.sfx.thump();
        Sound.sfx.clash();
        setTimeout(resolve, last ? 200 : 500);
      };
      if (!f.animate) return hit();
      f.animate([{ transform: 'translate(-50%,-50%) scale(.6)' }, { transform: `translate(calc(-50% + ${b.x - p.x}px), calc(-50% + ${b.y - p.y}px)) scale(1.1)` }],
        { duration: 450, easing: 'ease-in', fill: 'forwards' }).onfinish = hit;
    });
  }

  // 結局 3：撳 3 粒能量核心 → Super Robo 大變身（變大 + 彩虹光）→ Gloop 話好型，對唔住，一齊跳
  async function battleParts(tk) {
    await monsterBack(tk, 'pt_alarm');
    if (tk !== token) return;
    await sayMin(['pt_go', { pause: 100 }], 1600);
    if (tk !== token) return;
    const portrait = innerHeight > innerWidth;
    const cores = ['sh', 'ch', 'th'].map((dg, i) => {
      const c = addFx('rb-floatcore', RoboArt.core(dg));
      c.style.left = (portrait ? 20 + i * 30 : 34 + i * 12) + 'vw';
      c.style.top = (portrait ? 68 : 22 + (i % 2) * 18) + 'vh';
      c.style.animationDelay = i * 150 + 'ms, ' + (-i * 0.6) + 's';
      c.dataset.dg = dg;
      return c;
    });
    let left = cores.slice();
    while (left.length) {
      const c = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== c);
      const from = center(c), to = center(robotEl);
      Sound.sfx.pop();
      if (c.animate) c.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(.3)`, opacity: 0.3 }],
        { duration: 450, easing: 'ease-in', fill: 'forwards' });
      await wait(430);
      if (tk !== token) return;
      c.remove();
      robotEl.style.setProperty('--core', RoboArt.CORE_COLS[c.dataset.dg]);
      restart(robotEl, 'coreflash');
      Sound.sfx.beam();
      Sound.say(['en_' + (3 - left.length)]);
      await wait(500);
      if (tk !== token) return;
    }
    robotEl.classList.add('giant');
    Sound.sfx.hatch();
    await sayMin(['pt_big', { pause: 200 }], 2000);
    if (tk !== token) return;
    restart(monEl, 'hit');
    put(monEl, RoboArt.happyMonster());
    monEl.classList.add('friendly');
    await sayMin(['pt_sorry', { pause: 200 }], 2400);
    if (tk !== token) return;
    addFx('rb-lights');
    robotEl.classList.add('cheer');
    monEl.classList.add('cheer');
    const tune = Sound.sfx.dance ? Sound.sfx.dance() : 3;
    await sayMin(['pt_win', { pause: 200 }], Math.max(2600, tune * 1000));
    if (tk !== token) return;
    robotEl.classList.remove('giant', 'cheer');
    await robotWins(tk, 'rb_win');
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'robo') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'robo' && !document.body.classList.contains('robo-done')) start(); });

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
      if (!t.dg && !t.team) continue;
      const s = st(t.id);
      const focus = unit.spell.some((x) => x.id === t.id && x.focus);
      row([(focus ? '★ ' : '') + t.word, truthIds.has(t.id) ? f(s, 'truth') : '—', t.dg ? f(s, 'core') : '—', t.team ? f(s, 'spell') : '—', t.team ? f(s, 'team') : '—']);
    }
    if (info) {
      const NAME = { scan: '雷達', core: '核心', saber: '光束劍', boss: 'Gloop' };
      info.textContent = STAGES.map((k) => { const r = Object.assign({ played: 0, ko: 0, gold: 0 }, runs[k]); return NAME[k] + '：玩 ' + r.played + '、返基地 ' + r.ko + '、金 ' + r.gold; }).join('　');
    }
  }
  function resetStats() { stats = {}; runs = {}; store(STORE_KEY, stats); store(RUN_KEY, runs); ['roboTrap.v1', 'roboCore.v1', 'roboSpell.v1'].forEach((k) => store(k, [])); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    robotEl.classList.add('in');
    await wait(700);
    if (tk !== token) return;
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo, _dbg: dbg };
})();
