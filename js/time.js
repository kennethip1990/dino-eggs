/*
 * 恐龍時光機：學認字（廣東話，單元六：其他）
 * 流程：BB 恐龍坐時光機蕩失路 → 每關開頭自己揀恐龍拍檔（腕龍 / 暴龍 / 三角龍，冇啱錯）→ 時光機出發
 *   → ① 時光機開機 ×5：聽字揀卡（3 張卡；共用一粒字嘅詞做干擾：生日 / 生活、故事 / 事情、中國 / 國家）
 *   → ② 時光門 ×4：睇圖揀字（唔讀出個詞，真正自己睇字）
 *   → ③ 時光機充電 ×3：撳兩粒字砌詞（4 粒字掣，有一粒係易撈亂嗰個詞嘅字）
 *   → ④ 送 BB 恐龍返屋企 ×5：三款混合 → 恐龍媽媽嚟接
 *   → 結局短片（3 個輪流，要 Luca 撳）→ 貼紙 → 勳章 → 拜拜
 * 防亂撞（只加唔扣，同光之巨人一樣）：
 *   - 化石：第一下就答啱先 +1 粒（飛去左上角）；答錯唔扣，就係冇加
 *   - 答錯：張卡郁一郁，「咦？再聽多次。」→ 讀多次題目，讀完先畀再撳；錯兩次啱嗰個會發光
 *   - 新題目出咗頭 0.6 秒唔收撳；一關化石儲滿 = 金勳章；冇 game over
 */
const TimeGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.TIME_UNIT;
  const W = Object.fromEntries(unit.words.map((w) => [w.id, w]));
  const IDS = unit.words.map((w) => w.id);
  const PIC = unit.words.filter((w) => w.pic).map((w) => w.id);
  const LISTEN = 5, PICS = 4, BUILD = 3, HOME = 5;
  const STAGES = ['listen', 'pic', 'build', 'home'];
  const PALS = ['brachio', 'trex', 'trice'];
  const PAL_NAME = { brachio: '腕龍', trex: '暴龍', trice: '三角龍' };
  const partnerOf = (id) => { const p = unit.pairs.find((x) => x.includes(id)); return p ? p.find((x) => x !== id) : null; };

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'timeWords.v1', RUN_KEY = 'timeRuns.v1';
  let stats = load(STORE_KEY, {});
  let runs = load(RUN_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const KINDS = ['listen', 'pic', 'build'];
  const blank = () => Object.fromEntries(KINDS.flatMap((k) => [[k, 0], [k + 'Ok', 0]]));
  function record(id, kind, firstTry) {
    const s = stats[id] = Object.assign(blank(), stats[id]);
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    store(STORE_KEY, stats);
  }
  const st = (id) => Object.assign(blank(), stats[id]);
  function bump(stage, field) {
    const r = runs[stage] = Object.assign(stage === 'pals' ? {} : { played: 0, gold: 0 }, runs[stage]);
    r[field] = (r[field] || 0) + 1;
    store(RUN_KEY, runs);
  }

  // 平均輪流（bag）：一輪出晒先再嚟過
  function fromBag(key, all, n) {
    if (n <= 0) return [];
    let bag = load(key, []).filter((id) => all.includes(id));
    if (bag.length < n) bag = bag.concat(shuffle(all.filter((id) => !bag.includes(id))));
    store(key, bag.slice(n));
    return bag.slice(0, n);
  }
  // 揀字：老師未剔（★）而第一下就啱未夠 2 次嘅排先；每關最少留一個位溫習其他字
  function choose(kind, pool, n) {
    const pri = shuffle(pool.filter((id) => W[id].focus && st(id)[kind + 'Ok'] < 2)).slice(0, n - 1);
    const rest = fromBag('timeBag_' + kind + '.v1', pool.filter((id) => !pri.includes(id)), n - pri.length);
    return shuffle([...pri, ...rest]);
  }
  // 干擾卡：有易撈亂嘅詞一定出；睇圖嗰陣唔用「地方 / 國家」做隨機干擾（同圖意思重疊）
  function distractors(id, forPic) {
    const p = partnerOf(id);
    const out = p ? [p] : [];
    const pool = IDS.filter((x) => x !== id && x !== p && !(forPic && (x === 'deifong' || x === 'gwokgaa')));
    return out.concat(shuffle(pool)).slice(0, 2);
  }

  // ---------- DOM ----------
  const screen = $('#time-screen'), machineEl = $('#tm-machine'), palEl = $('#tm-pal'), babyEl = $('#tm-baby'), mamaEl = $('#tm-mama');
  const play = $('#time-play'), hud = $('#time-hud'), meterEl = $('#time-meter'), againBtn = $('#time-again');
  put($('#time-bg'), Art.background());
  put(machineEl, TimeArt.machine());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  let lock = false;            // 答錯之後：讀完題目先可以再撳
  let armId = 0;
  let babySp = 'trex';
  function arm() {
    lock = true;
    const my = ++armId;
    setTimeout(() => { if (armId === my) lock = false; }, 600);
  }
  const dbg = { target: null, fossils: () => meterEl.querySelectorAll('.tm-cell.on').length };     // 開發測試

  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => pick(['tm_yes_1', 'tm_yes_2', 'tm_yes_3']);

  function pose(cls, ms, el) {
    el = el || machineEl;
    restart(el, cls);
    clearTimeout(el['_' + cls]);
    el['_' + cls] = setTimeout(() => el.classList.remove(cls), ms || 800);
  }
  function setPal(sp) {
    palEl.dataset.sp = sp;
    put(palEl, Art.mama(sp));
  }

  function reset() {
    document.body.dataset.screen = 'time';
    document.body.classList.remove('time-done', 'time-home', 'time-battle', 'time-night');
    cleanupBattle();
    screen.className = '';
    machineEl.className = '';
    palEl.className = '';
    setPal('trex');
    babySp = pick(PALS);
    babyEl.className = '';
    mamaEl.className = '';
    put(babyEl, Art.baby(Math.floor(Math.random() * 5), babySp));
    put(mamaEl, Art.mama(babySp));
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

  // ---------- 化石（只加唔扣） ----------
  function buildMeter(n) {
    meterEl.hidden = false;
    meterEl.className = '';
    put(meterEl, Array.from({ length: n }, () => `<span class="tm-cell">${TimeArt.fossil()}</span>`).join(''));
    meterEl.querySelectorAll('.tm-cell').forEach((s, i) => { s.style.animationDelay = i * 80 + 'ms'; restart(s, 'in'); });
  }
  function gainFossil(fromEl) {
    const cell = meterEl.querySelector('.tm-cell:not(.on)');
    if (!cell) return;
    const done = () => { restart(cell, 'on'); Sound.sfx.zap(); pose('charge', 700); };
    if (!fromEl || !fromEl.isConnected) return done();
    const a = center(fromEl), b = center(cell);
    const o = document.createElement('div');
    o.className = 'tm-spark';
    o.style.left = a.x + 'px';
    o.style.top = a.y + 'px';
    document.body.appendChild(o);
    if (!o.animate) { o.remove(); return done(); }
    o.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y}px)) scale(.6)` }],
      { duration: 650, easing: 'cubic-bezier(.5,0,.6,1)' }).onfinish = () => { o.remove(); done(); };
    setTimeout(() => { if (o.isConnected) { o.remove(); done(); } }, 1200);
  }
  const meterFull = () => !meterEl.querySelector('.tm-cell:not(.on)');

  // 答錯通用處理：唔扣嘢；讀多次題目，讀完先畀再撳
  function miss(el, replay) {
    restart(el, 'wiggle');
    Sound.sfx.soft();
    Sound.clear();
    lock = true;
    const my = ++armId;
    Sound.say([{ pause: 400 }, 'tm_look', { pause: 250 }, ...replay]).then(() => { if (armId === my) lock = false; });
  }

  // ---------- HUD：一排圖示，答啱一題着一個 ----------
  function buildHud(kind, n, extra) {
    hud.className = 'k-' + kind;
    put(hud, Array.from({ length: n }, () => `<span class="tm-hi">${TimeArt.hudIcon(kind)}</span>`).join('') + (extra || ''));
  }
  function lightHud(i) {
    const h = hud.querySelectorAll('.tm-hi')[i];
    if (h) { restart(h, 'on'); burstAt(center(h)); }
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
    machineEl.classList.add('in');
    palEl.classList.add('in');
    Sound.sfx.whoosh();
    await wait(900);
    if (tk !== token) return;
    if (from <= 1) {
      await Sound.say(['tm_hi', { pause: 250 }, 'tm_intro', { pause: 300 }, 'tm_rule', { pause: 300 }]);
      if (tk !== token) return;
      medals.push(await stage(tk, 'listen', LISTEN, 1, async () => {
        const plan = choose('listen', IDS, LISTEN);
        buildHud('bulb', plan.length);
        await Sound.say([{ pause: 200 }, 'tm_s1', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askListen(plan[i], tk);
          if (tk !== token) return;
          lightHud(i);
          await Sound.say([{ pause: 150 }, praise(), { pause: 200 }]);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 2) {
      medals.push(await stage(tk, 'pic', PICS, 2, async () => {
        const plan = choose('pic', PIC, PICS);
        buildHud('portal', plan.length);
        await Sound.say([{ pause: 200 }, 'tm_s2', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askPic(plan[i], tk);
          if (tk !== token) return;
          lightHud(i);
          await Sound.say([{ pause: 150 }, praise(), { pause: 200 }]);
        }
      }));
      if (tk !== token) return;
    }
    if (from <= 3) {
      medals.push(await stage(tk, 'build', BUILD, 3, async () => {
        const plan = choose('build', IDS, BUILD);
        buildHud('battery', plan.length);
        await Sound.say([{ pause: 200 }, 'tm_s3', { pause: 250 }]);
        for (let i = 0; i < plan.length; i++) {
          if (tk !== token) return;
          await askBuild(plan[i], tk);
          if (tk !== token) return;
          lightHud(i);
          Sound.sfx.beam();
        }
      }));
      if (tk !== token) return;
    }
    medals.push(await stage(tk, 'home', HOME, 4, async () => { await homeRun(tk); }));
    if (tk !== token) return;
    const end = Rewards.next('time');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('time', end, 'yue');
    if (tk !== token) return;
    await showMedals(tk, medals);
    if (tk !== token) return;
    await finale(tk);
  }

  // 一關：揀恐龍拍檔 → 時光機出發 → 化石清空 → 玩 → 儲滿 = 金勳章；回傳 true = 金
  async function stage(tk, name, cells, era, body) {
    if (tk !== token) return false;
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    await pickPal(tk);
    if (tk !== token) return false;
    await warp(tk, era);
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
      machineEl.classList.add('super');
      await sayMin([{ pause: 200 }, 'tm_full', { pause: 300 }], 2200);
      machineEl.classList.remove('super');
    } else {
      Sound.sfx.pop();
      await Sound.say([{ pause: 200 }, 'tm_good', { pause: 300 }]);
    }
    return gold;
  }

  // 時光機出發：成個畫面轉圈 → 換時代（背景顏色）
  async function warp(tk, era) {
    pose('go', 1600);
    addFx('tm-warp', '<i></i><i></i><i></i>');
    Sound.sfx.whoosh();
    Sound.say(['tm_warp']);
    await wait(700);
    if (tk !== token) return;
    screen.className = 'era-' + era;
    await wait(1000);
    cleanupFx();
  }

  // 揀恐龍拍檔：冇啱錯（俾 Luca 有選擇權）
  function pickPal(tk) {
    return new Promise((resolve) => {
      play.className = 'mode-pal';
      const row = document.createElement('div');
      row.className = 'tm-pals';
      let done = false;
      const btns = PALS.map((sp, i) => {
        const b = document.createElement('button');
        b.className = 'tm-palbtn p-' + sp;
        b.dataset.sp = sp;
        b.style.animationDelay = i * 120 + 'ms';
        put(b, `<span class="pb-art">${Art.mama(sp)}</span><span class="pb-txt"></span>`);
        b.querySelector('.pb-txt').textContent = PAL_NAME[sp];
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          done = true;
          clearTimeout(idleTimer);
          dbg.target = null;
          Sound.clear();
          btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
          restart(b, 'right');
          bump('pals', sp);
          Sound.sfx.roar();
          setPal(sp);
          pose('hop', 900, palEl);
          Sound.say([{ pause: 150 }, 'yue_dino_' + sp, { pause: 200 }, 'tm_go', { pause: 250 }]).then(() => { play.replaceChildren(); play.className = ''; resolve(sp); });
        });
        row.appendChild(b);
        return b;
      });
      play.replaceChildren(row);
      dbg.target = btns[1];
      Sound.say(['tm_pick_q']);
      armIdle(() => Sound.say(['tm_pick_q']));
    });
  }

  async function finale(tk) {
    play.replaceChildren();
    hud.replaceChildren();
    meterEl.hidden = true;
    pose('hop', 1400, palEl);
    await Sound.say([{ pause: 300 }, 'tm_bye']);
    if (tk !== token) return;
    document.body.classList.add('time-done');
  }

  async function showMedals(tk, medals) {
    if (!medals.length) return;
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    play.className = 'mode-medals';
    put(play, `<div class="rb-medals">${medals.map((g, i) => `<span class="rb-medal${g ? ' gold' : ''}" style="animation-delay:${i * 250}ms">${RoboArt.medal(g)}</span>`).join('')}</div>`);
    medals.forEach((g, i) => setTimeout(() => { if (tk === token) (g ? Sound.sfx.hatch : Sound.sfx.pop)(); }, i * 250 + 200));
    const golds = medals.filter(Boolean).length;
    const all = golds === medals.length && medals.length === STAGES.length;
    await sayMin(['tm_medals', { pause: 300 }, all ? 'tm_all_gold' : golds ? 'tm_some_gold' : 'tm_no_gold', { pause: 400 }], 3000);
    play.replaceChildren();
    play.className = '';
  }

  // ---------- 字卡（聽字揀卡 / 睇圖揀字 共用） ----------
  function cards(row, ids, right, onRight, onWrong) {
    let done = false;
    const btns = shuffle(ids).map((id, i) => {
      const c = document.createElement('button');
      c.className = 'wcard tm-card';
      c.dataset.id = id;
      c.textContent = W[id].text;
      c.style.animationDelay = i * 110 + 'ms';
      c.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        if (done || lock) return;
        if (id === right) {
          done = true;
          clearTimeout(idleTimer);
          dbg.target = null;
          Sound.clear();
          btns.forEach((x) => { x.classList.remove('hint'); if (x !== c) x.classList.add('fade'); });
          restart(c, 'right');
          onRight(c);
        } else onWrong(c, btns);
      });
      row.appendChild(c);
      return c;
    });
    dbg.target = btns.find((x) => x.dataset.id === right);
    return btns;
  }

  // ① 聽字揀卡
  function askListen(id, tk, inHome) {
    return new Promise((resolve) => {
      play.className = 'mode-listen' + (inHome ? ' in-home' : '');
      play.replaceChildren();
      const row = document.createElement('div');
      row.className = 'tm-cards';
      play.append(row);
      const prompt = ['tm_find', { pause: 120 }, 'tw_' + id];
      let misses = 0;
      arm();
      cards(row, [id, ...distractors(id, false)], id, (c) => {
        record(id, 'listen', misses === 0);
        if (misses === 0) gainFossil(c);
        Sound.sfx.pop();
        Sound.say([{ pause: 200 }, 'tw_' + id, { pause: 300 }]).then(() => resolve('ok'));
      }, (c, btns) => {
        if (tk !== token) return;
        misses++;
        miss(c, prompt);
        if (misses >= 2) btns.find((x) => x.dataset.id === id).classList.add('hint');
      });
      Sound.say(prompt);
      armIdle(() => Sound.say(prompt));
    });
  }

  // ② 睇圖揀字：唔讀個詞（要自己睇字），啱咗先讀
  function askPic(id, tk, inHome) {
    return new Promise((resolve) => {
      play.className = 'mode-pic' + (inHome ? ' in-home' : '');
      play.replaceChildren();
      const pic = document.createElement('div');
      pic.className = 'tm-pic';
      put(pic, TimeArt.thing(W[id].pic));
      const row = document.createElement('div');
      row.className = 'tm-cards';
      play.append(pic, row);
      restart(pic, 'in');
      let misses = 0;
      arm();
      cards(row, [id, ...distractors(id, true)], id, (c) => {
        record(id, 'pic', misses === 0);
        if (misses === 0) gainFossil(c);
        Sound.sfx.pop();
        restart(pic, 'yay');
        Sound.say([{ pause: 200 }, 'tw_' + id, { pause: 300 }]).then(() => resolve('ok'));
      }, (c, btns) => {
        if (tk !== token) return;
        misses++;
        miss(c, ['tm_pic_q']);
        if (misses >= 2) btns.find((x) => x.dataset.id === id).classList.add('hint');
      });
      Sound.say(['tm_pic_q']);
      armIdle(() => Sound.say(['tm_pic_q']));
    });
  }

  // ③ 砌詞：兩個空位，4 粒字掣（易撈亂嗰個詞嘅另一粒字 + 一粒隨機）
  function decoyChars(id) {
    const mine = W[id].c;
    const out = [];
    const p = partnerOf(id);
    if (p) out.push(...W[p].c.filter((c) => !mine.includes(c)));
    const pool = shuffle(Object.keys(unit.chars).filter((c) => !mine.includes(c) && !out.includes(c)));
    return out.concat(pool).slice(0, 2);
  }
  function askBuild(id, tk, inHome) {
    return new Promise((resolve) => {
      play.className = 'mode-build' + (inHome ? ' in-home' : '');
      play.replaceChildren();
      const word = W[id].c;
      const wrap = document.createElement('div');
      wrap.className = 'tm-slots';
      const slots = word.map(() => { const s = document.createElement('span'); s.className = 'tm-slot'; wrap.appendChild(s); return s; });
      const row = document.createElement('div');
      row.className = 'tm-keys';
      play.append(wrap, row);
      restart(wrap, 'in');
      let next = 0, misses = 0, wordMisses = 0, busy = false;
      arm();
      slots[0].classList.add('now');
      const keys = shuffle([...word, ...decoyChars(id)]).map((cid, i) => {
        const k = document.createElement('button');
        k.className = 'tm-key';
        k.dataset.c = cid;
        k.textContent = unit.chars[cid];
        k.style.animationDelay = i * 100 + 'ms';
        k.addEventListener('pointerdown', (ev) => { ev.preventDefault(); onTap(k); });
        row.appendChild(k);
        return k;
      });
      const target = () => keys.find((k) => k.dataset.c === word[next] && !k.classList.contains('used'));
      dbg.target = target();
      const prompt = ['tm_build', { pause: 120 }, 'tw_' + id];

      function onTap(k) {
        if (busy || lock || tk !== token || k.classList.contains('used')) return;
        if (k.dataset.c === word[next]) {
          clearTimeout(idleTimer);
          keys.forEach((x) => x.classList.remove('hint'));
          const slot = slots[next];
          const from = k.getBoundingClientRect();
          k.classList.add('used');
          slot.textContent = k.textContent;
          slot.classList.remove('now');
          slot.classList.add('filled');
          flip(slot, from, 450);
          Sound.sfx.pop();
          Sound.clear();
          Sound.say(['tc_' + word[next]]);
          next++;
          misses = 0;
          if (next < word.length) { slots[next].classList.add('now'); dbg.target = target(); armIdle(idleHint); return; }
          busy = true;
          dbg.target = null;
          record(id, 'build', wordMisses === 0);
          if (wordMisses === 0) gainFossil(wrap);
          keys.forEach((x) => { if (!x.classList.contains('used')) x.classList.add('fade'); });
          Sound.say([
            { pause: 350 }, { fn: () => { restart(wrap, 'glow'); Sound.sfx.hatch(); } },
            'tw_' + id, { pause: 300 }, praise(), { pause: 400 }
          ]).then(() => resolve('ok'));
        } else {
          misses++;
          if (misses === 1) {
            wordMisses++;
            miss(k, [...prompt]);
          } else {
            restart(k, 'wiggle');
            Sound.sfx.soft();
          }
          if (misses >= 2 && target()) target().classList.add('hint');
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

  // ---------- ④ 送 BB 恐龍返屋企 ----------
  function planHome() {
    const ls = choose('listen', IDS, 2), ps = choose('pic', PIC, 2), bs = choose('build', IDS, 1);
    return [{ t: 'listen', id: ls[0] }, { t: 'pic', id: ps[0] }, { t: 'build', id: bs[0] }, { t: 'listen', id: ls[1] }, { t: 'pic', id: ps[1] }];
  }
  async function homeRun(tk) {
    const plan = planHome();
    play.replaceChildren();
    document.body.classList.add('time-home');
    buildHud('foot', plan.length, `<span class="tm-nest">${TimeArt.home()}</span>`);
    babyEl.className = 'enter';
    Sound.sfx.bubble();
    await wait(900);
    if (tk !== token) return;
    babyEl.classList.add('cry');
    await Sound.say(['tm_baby', { pause: 250 }, 'tm_baby_go', { pause: 300 }]);
    if (tk !== token) return;
    for (let i = 0; i < plan.length; i++) {
      const q = plan[i];
      if (q.t === 'listen') await askListen(q.id, tk, true);
      else if (q.t === 'pic') await askPic(q.id, tk, true);
      else await askBuild(q.id, tk, true);
      if (tk !== token) return;
      lightHud(i);
      pose('hop', 700, babyEl);
      Sound.sfx.boing();
      await wait(500);
      if (tk !== token) return;
    }
    play.replaceChildren();
    // 恐龍媽媽嚟接
    babyEl.classList.remove('cry');
    mamaEl.className = 'enter';
    Sound.sfx.roar();
    await wait(1100);
    if (tk !== token) return;
    babyEl.className = 'hug';
    Sound.sfx.hatch();
    addFx('tm-hearts', '<i></i><i></i><i></i><i></i><i></i>');
    await sayMin(['tm_mama', { pause: 300 }], 2600);
    if (tk !== token) return;
    babyEl.className = 'leave';
    mamaEl.className = 'leave';
    await wait(1100);
    if (tk !== token) return;
    babyEl.className = '';
    mamaEl.className = '';
    document.body.classList.remove('time-home');
    cleanupFx();
    hud.replaceChildren();
    hud.className = '';
  }

  // ---------- 結局短片（要 Luca 撳） ----------
  let fx = [];
  function cleanupFx() {
    fx.forEach((e) => e.remove());
    fx = [];
  }
  function cleanupBattle() {
    document.body.classList.remove('time-battle', 'time-night');
    cleanupFx();
    document.querySelectorAll('.jd-burst, .tm-spark').forEach((e) => e.remove());
    machineEl.classList.remove('fly', 'super', 'charge', 'go');
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
  function burstAt(p, big) {
    const b = document.createElement('div');
    b.className = 'jd-burst' + (big ? ' big' : '');
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }

  function battle(tk, id) {
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    meterEl.hidden = true;
    document.body.classList.add('time-battle');
    if (id === 'birthday') return endBirthday(tk);
    if (id === 'space') return endSpace(tk);
    return endNewYear(tk);
  }
  async function wrapUp(tk) {
    pose('hop', 1400, palEl);
    await wait(1200);
    if (tk !== token) return;
    machineEl.classList.remove('fly');
    document.body.classList.remove('time-battle', 'time-night');
    cleanupFx();
  }

  // 撳到 → 回傳嗰個；等夠 autoMs 就自動揀第一個（唔會卡住）
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
  const spots = (portrait) => [0, 1, 2].map((i) => portrait ? 14 + i * 28 : 40 + i * 17);

  // 結局 1：新年 → 撳 3 支煙花 → 飛上天爆開 → 新年快樂
  async function endNewYear(tk) {
    document.body.classList.add('time-night');
    const portrait = innerHeight > innerWidth;
    const xs = spots(portrait);
    const rockets = ['#ff8fb8', '#ffd23e', '#7fb0ff'].map((c, i) => {
      const r = addFx('tm-rocket', TimeArt.rocket(c));
      r.style.left = xs[i] + 'vw';
      r.style.setProperty('--fc', c);
      r.style.animationDelay = i * 150 + 'ms';
      return r;
    });
    Sound.sfx.whoosh();
    await sayMin(['tn_alarm', { pause: 200 }], 2000);
    if (tk !== token) return;
    await sayMin(['tn_go', { pause: 100 }], 1400);
    if (tk !== token) return;
    let left = rockets.slice();
    while (left.length) {
      const r = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== r);
      r.classList.add('up');
      Sound.sfx.whoosh();
      Sound.say(['yue_' + (3 - left.length)]);
      await wait(700);
      if (tk !== token) return;
      r.classList.add('boom');
      Sound.sfx.pop();
      burstAt(center(r), true);
      await wait(300);
      if (tk !== token) return;
    }
    const fw = addFx('tm-fireworks', '<i></i><i></i><i></i><i></i><i></i><i></i>');
    fw.querySelectorAll('i').forEach((x, i) => setTimeout(() => { if (tk === token) Sound.sfx.pop(); }, 300 + i * 350));
    await sayMin(['tn_win', { pause: 200 }], 2800);
    if (tk !== token) return;
    await wrapUp(tk);
  }

  // 結局 2：BB 恐龍生日 → 撳 3 個蠟燭火 → 吹熄 → 生日歌
  async function endBirthday(tk) {
    const party = addFx('tm-party', `<div class="tm-cake">${TimeArt.bigCake()}<b class="f1">${TimeArt.flame()}</b><b class="f2">${TimeArt.flame()}</b><b class="f3">${TimeArt.flame()}</b></div><div class="tm-bday">${Art.baby(2, babySp)}</div>`);
    Sound.sfx.hatch();
    await sayMin(['tb_alarm', { pause: 200 }], 1800);
    if (tk !== token) return;
    await sayMin(['tb_go', { pause: 100 }], 1400);
    if (tk !== token) return;
    let left = [...party.querySelectorAll('.tm-cake b')];
    while (left.length) {
      const f = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== f);
      f.classList.add('out');
      Sound.sfx.whoosh();
      Sound.say(['yue_' + (3 - left.length)]);
      await wait(700);
      if (tk !== token) return;
    }
    party.classList.add('cheer');
    addFx('tm-confetti', '<i></i>'.repeat(12));
    const t = Sound.sfx.song ? Sound.sfx.song() : 2;
    await sayMin(['tb_win', { pause: 200 }], Math.min(t, 8) * 1000);
    if (tk !== token) return;
    await wrapUp(tk);
  }

  // 結局 3：時光機飛上太空 → 撳 3 粒星 → 彩虹
  async function endSpace(tk) {
    document.body.classList.add('time-night');
    machineEl.classList.add('fly');
    Sound.sfx.whoosh();
    await sayMin(['tx_alarm', { pause: 200 }], 2000);
    if (tk !== token) return;
    const portrait = innerHeight > innerWidth;
    const xs = spots(portrait);
    const stars = ['#ffe680', '#ffb3c7', '#9fd3ff'].map((c, i) => {
      const s = addFx('tm-star', EndArt.star(c));
      s.style.left = xs[i] + 'vw';
      s.style.top = (portrait ? 52 + (i % 2) * 10 : 18 + (i % 2) * 24) + 'vh';
      s.style.animationDelay = i * 150 + 'ms, ' + (-i * 0.5) + 's';
      return s;
    });
    await sayMin(['tx_go', { pause: 100 }], 1300);
    if (tk !== token) return;
    let left = stars.slice();
    while (left.length) {
      const s = await waitTap(tk, left, 8000, 4000);
      if (tk !== token) return;
      left = left.filter((x) => x !== s);
      burstAt(center(s), true);
      s.classList.add('got');
      Sound.sfx.zap();
      Sound.say(['yue_' + (3 - left.length)]);
      await wait(600);
      if (tk !== token) return;
    }
    document.body.classList.remove('time-night');
    addFx('tm-rainbow', EndArt.rainbow());
    Sound.sfx.dance ? Sound.sfx.dance() : Sound.sfx.hatch();
    await sayMin(['tx_win', { pause: 200 }], 3000);
    if (tk !== token) return;
    await wrapUp(tk);
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'time') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'time' && !document.body.classList.contains('time-done')) start(); });

  function renderStats(tbody, info) {
    tbody.replaceChildren();
    const f = (s, k) => s[k] ? s[k + 'Ok'] + ' / ' + s[k] : '—';
    for (const w of unit.words) {
      const s = st(w.id);
      const tr = document.createElement('tr');
      for (const v of [(w.focus ? '★ ' : '') + w.text, f(s, 'listen'), w.pic ? f(s, 'pic') : '（冇圖）', f(s, 'build')]) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    if (info) {
      const NAME = { listen: '開機', pic: '時光門', build: '充電', home: '送 BB 返屋企' };
      const p = Object.assign({}, runs.pals);
      info.textContent = STAGES.map((k) => { const r = Object.assign({ played: 0, gold: 0 }, runs[k]); return NAME[k] + '：玩 ' + r.played + '、金 ' + r.gold; }).join('　') +
        '　｜ 揀恐龍：' + PALS.map((sp) => PAL_NAME[sp] + ' ' + (p[sp] || 0)).join('、');
    }
  }
  function resetStats() { stats = {}; runs = {}; store(STORE_KEY, stats); store(RUN_KEY, runs); KINDS.forEach((k) => store('timeBag_' + k + '.v1', [])); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    machineEl.classList.add('in');
    palEl.classList.add('in');
    await wait(900);
    if (tk !== token) return;
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo, _dbg: dbg };
})();
