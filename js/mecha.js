/*
 * Jedi + Sith 大戰 Mecha-Rex：學英文（全英文，Yorkland Starters R&W Part 1 + Part 3（VCe）+ Notes2 方位字）
 * 流程：Mecha-Rex 捉咗 baby droid；Jedi Luca + Sith Luca 組隊（每關開頭 Luca 揀邊個出戰）
 *   → ① 救 baby droid ×4：聽句子揀場景（The droid is under the table.）×3 + 睇句子揀方位字 ×1（工作紙 Part B）
 *   → ② Magic E 鍛造爐：水晶字母砌 VCe 字 ×3（最後一格 = magic e）+ magic e 變身 ×1（cap → cape）
 *   → ③ Mecha-Rex 決鬥 ×5：✓✗ 句子（有工作紙陷阱圖）/ 聽方位 / 睇方位或「next to」兩個字，答啱打一劍
 *   → 結局短片（3 個輪流）→ 貼紙 → 拜拜
 * 答錯唔罰：輕輕搖 + 再講一次；錯兩次啱嗰個會發光
 */
const MechaGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.MECHA_UNIT;
  const THING = Object.fromEntries(unit.things.map((t) => [t.id, t]));
  const PREP = Object.fromEntries(unit.preps.map((p) => [p.id, p]));
  const FIND = 4, SPELL = 3;
  const sentence = (id) => THING[id].say || 'This is a ' + THING[id].word + '.';
  const objText = (obj, prep) => prep === 'between' ? unit.places[obj].some : unit.places[obj].one;

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'mechaWords.v1';
  let stats = load(STORE_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const KINDS = ['where', 'read', 'two', 'spell', 'truth'];
  const blank = () => Object.fromEntries(KINDS.flatMap((k) => [[k, 0], [k + 'Ok', 0]]));
  function record(id, kind, firstTry) {
    const s = stats[id] = Object.assign(blank(), stats[id]);
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    store(STORE_KEY, stats);
  }
  const st = (id) => Object.assign(blank(), stats[id]);
  const rate = (id, ...kinds) => {
    const s = st(id);
    const n = kinds.reduce((a, k) => a + s[k], 0);
    return n ? kinds.reduce((a, k) => a + s[k + 'Ok'], 0) / n : 0;
  };
  const okCount = (id, ...kinds) => kinds.reduce((a, k) => a + st(id)[k + 'Ok'], 0);

  // 方位：focus（under / in front of）第一下就啱未夠 3 次就一定出；其餘未熟嘅排先
  function rankPreps() {
    const focus = unit.preps.filter((p) => p.focus && okCount(p.id, 'where', 'read') < 3).map((p) => p.id);
    const rest = unit.preps.filter((p) => !focus.includes(p.id))
      .map((p) => ({ id: p.id, s: rate(p.id, 'where', 'read') + Math.random() * 0.6 }))
      .sort((a, b) => a.s - b.s).map((x) => x.id);
    return [...shuffle(focus), ...rest];
  }
  const objsFor = (prep) => Object.keys(unit.places).filter((o) => unit.places[o].preps.includes(prep));
  function prepQ(type, prep) {
    const obj = pick(objsFor(prep));
    const others = shuffle(unit.places[obj].preps.filter((p) => p !== prep)).slice(0, 2);
    return { type, prep, obj, opts: shuffle([prep, ...others]), col: pick(MechaArt.BABY_COLS) };
  }
  function pickFind() {
    const preps = rankPreps().slice(0, FIND);
    const types = ['where', 'where', 'read', 'where'];
    return shuffle(preps).map((p, i) => prepQ(types[i], p));
  }
  // 平均輪流（bag）：一輪出晒先再嚟過
  function fromBag(key, all, n) {
    let bag = load(key, []).filter((id) => all.includes(id));
    if (bag.length < n) bag = bag.concat(shuffle(all.filter((id) => !bag.includes(id))));
    store(key, bag.slice(n));
    return bag.slice(0, n);
  }
  const pickSpell = () => fromBag('mechaBag.v1', unit.spell, SPELL);
  const pickMagic = () => { const id = fromBag('mechaMagic.v1', unit.magic.map((m) => m.from), 1)[0]; return unit.magic.find((m) => m.from === id); };
  function pickBoss(spellPlan, findPlan) {
    // ✓✗：今局砌過嘅字 + 未熟嘅排先；陷阱圖輪流
    const ranked = unit.truth.map((p) => ({ p, s: rate(p.id, 'truth') + (spellPlan.includes(p.id) ? -0.4 : 0) + Math.random() * 0.6 }))
      .sort((a, b) => a.s - b.s).map((x) => x.p);
    const [t1, t2] = ranked;
    const trapId = fromBag('mechaTrap.v1', unit.traps.map((x) => x.id), 1)[0];
    const trap = unit.traps.find((t) => t.id === trapId);
    const truthQ = (p) => ({ type: 'truth', id: p.id, lie: p.lie, isTrue: !p.lie || Math.random() < 0.5 });
    const used = new Set(findPlan.map((q) => q.prep));
    const preps = rankPreps();
    const wherePrep = preps.find((p) => !used.has(p)) || preps[0];
    // 「next to」寫咗 nextto：兩個字題第一下就啱 3 次之前每局都出
    const last = okCount('next', 'two') < 3 ? { type: 'two', prep: 'next', obj: pick(objsFor('next')), col: pick(MechaArt.BABY_COLS) }
      : prepQ('read', preps.find((p) => p !== wherePrep) || preps[1]);
    return [truthQ(t1), prepQ('where', wherePrep), truthQ(t2), last, { type: 'truth', id: trap.id, lie: trap.lie, isTrue: false, trap: true }];
  }

  // ---------- DOM ----------
  const screen = $('#mecha-screen'), rexEl = $('#mx-rex');
  const heroes = { jedi: $('#mx-jedi'), sith: $('#mx-sith') };
  const play = $('#mecha-play'), hud = $('#mecha-hud'), againBtn = $('#mecha-again');
  put($('#mecha-bg'), JediArt.space().replace(/jdsky/g, 'mxsky'));   // gradient id 唔可以同 Jedi 撞（Jedi 畫面 display:none 會令 url(#jdsky) 失效）
  put(heroes.jedi, MechaArt.jedi());
  put(heroes.sith, MechaArt.sith());
  put(rexEl, MechaArt.rex());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  let active = 'jedi';
  const dbg = { target: null };     // 開發測試：下一下應該撳邊個
  const hero = () => heroes[active];
  const partner = () => heroes[active === 'jedi' ? 'sith' : 'jedi'];

  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => pick(['jd_yes_1', 'jd_yes_2', 'mx_yes_3']);
  const letterKey = (l) => Sound.has('ph_' + l) ? 'ph_' + l : 'ltr_' + l;

  // 主角動作：block / slash / push / shout（同 Jedi Luca 一樣）
  function pose(cls, ms, el) {
    el = el || hero();
    restart(el, cls);
    clearTimeout(el['_' + cls]);
    el['_' + cls] = setTimeout(() => el.classList.remove(cls), ms || 800);
  }
  function setActive(who) {
    active = who;
    hero().classList.add('front');
    hero().classList.remove('back');
    partner().classList.add('back');
    partner().classList.remove('front');
  }

  function reset() {
    document.body.dataset.screen = 'mecha';
    document.body.classList.remove('mecha-done', 'mecha-boss', 'mecha-battle', 'mecha-team');
    cleanupBattle();
    for (const el of Object.values(heroes)) el.className = 'mx-hero';
    setActive('jedi');
    rexEl.className = '';
    rexEl.style.removeProperty('--turn');
    put(rexEl, MechaArt.rex());
    play.className = '';
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    dbg.target = null;
  }

  // ---------- 開始 ----------
  function start(opts) {
    const tk = ++token;
    Sound.clear();
    reset();
    const findPlan = pickFind(), spellPlan = pickSpell();
    run(tk, findPlan, spellPlan, pickMagic(), pickBoss(spellPlan, findPlan), (opts && opts.from) || 1);
  }

  async function run(tk, findPlan, spellPlan, magic, bossPlan, from) {
    Object.values(heroes).forEach((el) => el.classList.add('in'));
    Sound.sfx.saber();
    await wait(900);
    if (tk !== token) return;
    if (from <= 1) {
      await Sound.say(['mx_hi', { pause: 250 }, 'mx_intro', { pause: 300 }]);
      if (tk !== token) return;
      // ① 救 baby droid
      await chooseHero(tk);
      if (tk !== token) return;
      buildRescue(findPlan.length);
      await Sound.say(['mx_find', { pause: 250 }]);
      if (tk !== token) return;
      for (let i = 0; i < findPlan.length; i++) {
        const q = findPlan[i];
        await (q.type === 'read' ? askRead(q, tk) : askWhere(q, tk));
        if (tk !== token) return;
        await rescued(tk, i, q.col);
        if (tk !== token) return;
      }
    }
    if (from <= 2) {
      // ② Magic E 鍛造爐
      play.replaceChildren();
      hud.replaceChildren();
      hud.className = '';
      await chooseHero(tk);
      if (tk !== token) return;
      buildMeter(spellPlan.length + 1);
      await Sound.say([{ pause: 200 }, 'mx_forge', { pause: 250 }]);
      if (tk !== token) return;
      for (let i = 0; i < spellPlan.length; i++) {
        await askSpell(spellPlan[i], tk);
        if (tk !== token) return;
        fillMeter(i);
      }
      await askMagic(magic, tk);
      if (tk !== token) return;
      fillMeter(spellPlan.length);
      play.replaceChildren();
      Object.values(heroes).forEach((el) => el.classList.add('charged'));
      Sound.sfx.saber();
      pose('block', 1000);
      await sayMin(['mx_ready', { pause: 300 }], 1600);
      if (tk !== token) return;
    }
    // ③ Mecha-Rex 決鬥
    play.replaceChildren();
    hud.replaceChildren();
    hud.className = '';
    await chooseHero(tk);
    if (tk !== token) return;
    await bossFight(tk, bossPlan);
    if (tk !== token) return;
    const end = Rewards.next('mecha');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('mecha', end, 'en');
    if (tk !== token) return;
    await finale(tk);
  }

  async function finale(tk) {
    play.replaceChildren();
    hud.replaceChildren();
    Object.values(heroes).forEach((el) => el.classList.add('wave'));
    await Sound.say([{ pause: 300 }, 'mx_bye']);
    if (tk !== token) return;
    document.body.classList.add('mecha-done');
  }

  // ---------- 揀邊個出戰 ----------
  function chooseHero(tk) {
    return new Promise((resolve) => {
      play.className = 'mode-who';
      play.replaceChildren();
      const row = document.createElement('div');
      row.className = 'mx-who';
      let done = false;
      const btns = ['jedi', 'sith'].map((who, i) => {
        const b = document.createElement('button');
        b.className = 'mx-who-btn ' + who;
        b.style.animationDelay = i * 120 + 'ms';
        put(b, `<span class="who-art">${who === 'jedi' ? MechaArt.jedi() : MechaArt.sith()}</span><span class="who-name">${who === 'jedi' ? 'Jedi' : 'Sith'}</span>`);
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          done = true;
          clearTimeout(idleTimer);
          Sound.clear();
          btns.forEach((x) => { if (x !== b) x.classList.add('fade'); });
          restart(b, 'right');
          setActive(who);
          Sound.sfx.saber();
          pose('shout', 1400);
          Sound.say([{ pause: 150 }, 'mx_go_' + who, { pause: 300 }]).then(() => { play.replaceChildren(); resolve(); });
        });
        row.appendChild(b);
        return b;
      });
      play.appendChild(row);
      dbg.target = pick(btns);
      Sound.say(['mx_who']);
      armIdle(() => { Sound.say(['mx_who']); btns.forEach((b) => restart(b, 'hint')); });
    });
  }

  // ---------- ① 救 baby droid ----------
  function buildRescue(n) {
    hud.className = 'rescue';
    put(hud, MechaArt.BABY_COLS.slice(0, n).map((c) => `<span class="bb-slot">${MechaArt.baby(c)}</span>`).join(''));
  }
  async function rescued(tk, i, col) {
    const slot = hud.querySelectorAll('.bb-slot')[i];
    if (slot) { put(slot, MechaArt.baby(col)); restart(slot, 'on'); }
    Sound.sfx.hatch();
    await Sound.say([{ pause: 150 }, 'bb_thanks', { pause: 300 }]);
  }

  // 聽句子，揀啱嗰個場景（3 張圖同一樣物件，droid 喺唔同位）
  function askWhere(q, tk, inBoss) {
    return new Promise((resolve) => {
      play.className = 'mode-where' + (inBoss ? ' in-boss' : '');
      play.replaceChildren();
      const row = document.createElement('div');
      row.className = 'mx-scenes';
      play.appendChild(row);
      const key = 'pp_' + q.prep + '_' + q.obj;
      let misses = 0, done = false;
      const cards = q.opts.map((p, i) => {
        const b = document.createElement('button');
        b.className = 'mx-scene';
        b.dataset.prep = p;
        b.style.animationDelay = i * 110 + 'ms';
        put(b, MechaArt.scene(q.obj, p, q.col));
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (p === q.prep) {
            done = true;
            clearTimeout(idleTimer);
            record(q.prep, 'where', misses === 0);
            Sound.clear();
            cards.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            restart(b, 'right');
            pose('push', 700);
            Sound.say([{ pause: 150 }, key, { pause: 300 }, inBoss ? { pause: 1 } : praise(), { pause: 300 }]).then(() => resolve(misses === 0));
          } else {
            misses++;
            restart(b, 'wiggle');
            Sound.sfx.soft();
            if (inBoss) rexLaugh(misses === 1);
            Sound.clear();
            Sound.say([inBoss && misses === 1 ? { pause: 900 } : { pause: 1 }, 'jd_look', { pause: 200 }, key]);
            if (misses >= 2) cards.find((x) => x.dataset.prep === q.prep).classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      dbg.target = cards.find((x) => x.dataset.prep === q.prep);
      Sound.say([key, { pause: 300 }, 'mx_which']);
      armIdle(() => Sound.say([key, { pause: 300 }, 'mx_which']));
    });
  }

  // 睇句子揀方位字（工作紙 Part B：The droid is ____ the box.）
  function sceneLine(q, blanks) {
    const wrap = document.createElement('div');
    wrap.className = 'mx-readwrap';
    put(wrap, `<div class="mx-bigscene">${MechaArt.scene(q.obj, q.prep, q.col)}</div>
      <div class="mx-line"><span>The droid is</span>${'<span class="mx-blank"></span>'.repeat(blanks)}<span class="mx-obj"></span></div>`);
    wrap.querySelector('.mx-obj').textContent = objText(q.obj, q.prep) + '.';
    return wrap;
  }
  function askRead(q, tk, inBoss) {
    return new Promise((resolve) => {
      play.className = 'mode-read' + (inBoss ? ' in-boss' : '');
      play.replaceChildren();
      const wrap = sceneLine(q, 1);
      const row = document.createElement('div');
      row.className = 'mx-chips';
      play.append(wrap, row);
      restart(wrap, 'in');
      const key = 'pp_' + q.prep + '_' + q.obj;
      const blankEl = wrap.querySelector('.mx-blank');
      let misses = 0, done = false;
      const chips = q.opts.map((p, i) => {
        const c = document.createElement('button');
        c.className = 'wcard mx-chip';
        c.dataset.prep = p;
        c.textContent = PREP[p].word;
        c.style.animationDelay = i * 110 + 'ms';
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (p === q.prep) {
            done = true;
            clearTimeout(idleTimer);
            record(q.prep, 'read', misses === 0);
            Sound.clear();
            chips.forEach((x) => { if (x !== c) x.classList.add('fade'); });
            restart(c, 'right');
            blankEl.textContent = PREP[p].word;
            restart(blankEl, 'filled');
            restart(wrap.querySelector('.mx-bigscene'), 'yay');
            pose('push', 700);
            Sound.say([{ pause: 200 }, key, { pause: 300 }, inBoss ? { pause: 1 } : praise(), { pause: 300 }]).then(() => resolve(misses === 0));
          } else {
            misses++;
            restart(c, 'wiggle');
            Sound.sfx.soft();
            if (inBoss) rexLaugh(misses === 1);
            Sound.clear();
            Sound.say([inBoss && misses === 1 ? { pause: 900 } : { pause: 1 }, 'pw_' + p, { pause: 350 }, 'jd_look']);
            if (misses >= 2) chips.find((x) => x.dataset.prep === q.prep).classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      dbg.target = chips.find((x) => x.dataset.prep === q.prep);
      Sound.say(['mx_read']);
      // 睇字：靜咗一陣就讀埋句子（唔會卡住）
      armIdle(() => { Sound.say([key]); dbg.target.classList.add('hint'); });
    });
  }

  // 「next to」係兩個字：The droid is ____ ____ the rock.，跟次序撳 next → to
  function askTwo(q, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-read in-boss';
      play.replaceChildren();
      const wrap = sceneLine(q, 2);
      const row = document.createElement('div');
      row.className = 'mx-chips';
      play.append(wrap, row);
      restart(wrap, 'in');
      const key = 'pp_next_' + q.obj;
      const blanks = [...wrap.querySelectorAll('.mx-blank')];
      const words = ['next', 'to'];
      let next = 0, misses = 0, done = false;
      const chips = shuffle([...words, pick(['in', 'on', 'under'])]).map((w, i) => {
        const c = document.createElement('button');
        c.className = 'wcard mx-chip';
        c.dataset.w = w;
        c.textContent = w;
        c.style.animationDelay = i * 110 + 'ms';
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token || c.classList.contains('used')) return;
          if (w === words[next]) {
            clearTimeout(idleTimer);
            chips.forEach((x) => x.classList.remove('hint'));
            c.classList.add('used');
            blanks[next].textContent = w;
            restart(blanks[next], 'filled');
            Sound.sfx.pop();
            next++;
            if (next < words.length) { dbg.target = target(); armIdle(idleHint); return; }
            done = true;
            dbg.target = null;
            record('next', 'two', misses === 0);
            Sound.clear();
            chips.forEach((x) => { if (!x.classList.contains('used')) x.classList.add('fade'); });
            pose('push', 700);
            Sound.say([{ pause: 200 }, { fn: () => blanks.forEach((b) => restart(b, 'glow')) }, 'mx_two', { pause: 300 }, key, { pause: 300 }]).then(() => resolve(misses === 0));
          } else {
            misses++;
            restart(c, 'wiggle');
            Sound.sfx.soft();
            rexLaugh(misses === 1);
            Sound.clear();
            Sound.say([misses === 1 ? { pause: 900 } : { pause: 1 }, next === 0 ? 'mx_two_q' : 'jd_look']);
            if (misses >= 2) target().classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      const target = () => chips.find((x) => x.dataset.w === words[next]);
      function idleHint() { Sound.say([key]); target().classList.add('hint'); }
      dbg.target = target();
      Sound.say(['mx_read', { pause: 200 }, 'mx_two_q']);
      armIdle(idleHint);
    });
  }

  // ---------- ② Magic E 鍛造爐 ----------
  function buildMeter(n) {
    hud.className = 'forge';
    put(hud, '<i></i>'.repeat(n));
  }
  function fillMeter(i) {
    const seg = hud.querySelectorAll('i')[i];
    if (seg) restart(seg, 'on');
    Sound.sfx.beam();
  }

  function spellWrap(picId, letters, magicSlot) {
    const wrap = document.createElement('div');
    wrap.className = 'sp-wrap';
    put(wrap, `<div class="sp-pic">${MechaArt.thing(picId)}</div><div class="sp-slots"></div>`);
    const slotsEl = wrap.querySelector('.sp-slots');
    const slots = letters.map(() => { const s = document.createElement('span'); s.className = 'sp-slot'; slotsEl.appendChild(s); return s; });
    if (magicSlot) slots[slots.length - 1].classList.add('magic');
    return { wrap, slots };
  }

  function askSpell(id, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-spell';
      play.replaceChildren();
      const word = THING[id].word;
      const { wrap, slots } = spellWrap(id, [...word], true);
      const field = document.createElement('div');
      field.className = 'sp-crystals';
      play.append(wrap, field);
      restart(wrap, 'in');

      let next = 0, misses = 0, wordMisses = 0, busy = false;
      const crystals = shuffle([...word]).map((l, i) => {
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

      function onTap(c) {
        if (busy || tk !== token || c.classList.contains('used')) return;
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
          pose('push', 600);
          Sound.say([letterKey(c.dataset.l)]);
          next++;
          misses = 0;
          if (next < word.length) { dbg.target = target(); armIdle(idleHint); return; }
          // 砌完：magic e 閃一閃，逐粒讀一次，再讀成個字
          busy = true;
          dbg.target = null;
          record(id, 'spell', wordMisses === 0);
          Sound.sfx.beam();
          Sound.say([
            { pause: 350 },
            ...slots.flatMap((s, i) => [{ fn: () => restart(s, 'glow') }, letterKey(word[i]), { pause: 120 }]),
            { pause: 200 }, { fn: () => { restart(wrap.querySelector('.sp-pic'), 'yay'); Sound.sfx.hatch(); } },
            'w_' + id, { pause: 300 }, praise(), { pause: 400 }
          ]).then(() => resolve());
        } else {
          misses++;
          wordMisses++;
          restart(c, 'wiggle');
          Sound.sfx.soft();
          Sound.clear();
          Sound.say([letterKey(c.dataset.l)]);
          if (misses >= 2) target().classList.add('hint');
        }
      }
      function idleHint() {
        Sound.say(['jd_spell_q', { pause: 150 }, 'w_' + id]);
        const t = target();
        if (t) t.classList.add('hint');
      }
      Sound.say(['jd_spell_q', { pause: 150 }, 'w_' + id]);
      armIdle(idleHint);
    });
  }

  // magic e 變身：cap + e → cape（圖都會變）
  function askMagic(m, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-spell mode-magic';
      play.replaceChildren();
      const { wrap, slots } = spellWrap(m.from, [...m.to], true);
      [...m.from].forEach((l, i) => { slots[i].textContent = l; slots[i].classList.add('filled'); });
      const field = document.createElement('div');
      field.className = 'sp-crystals';
      const c = document.createElement('button');
      c.className = 'crystal magic';
      c.textContent = 'e';
      field.appendChild(c);
      play.append(wrap, field);
      restart(wrap, 'in');
      dbg.target = c;
      let done = false;
      c.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        if (done || tk !== token) return;
        done = true;
        dbg.target = null;
        clearTimeout(idleTimer);
        Sound.clear();
        const slot = slots[slots.length - 1];
        const from = c.getBoundingClientRect();
        c.classList.add('used');
        slot.textContent = 'e';
        slot.classList.add('filled');
        flip(slot, from, 600);
        pose('push', 700);
        Sound.sfx.beam();
        const pic = wrap.querySelector('.sp-pic');
        setTimeout(() => {
          if (tk !== token) return;
          burstAt(center(pic));
          put(pic, MechaArt.thing(m.to));
          restart(pic, 'morph');
          Sound.sfx.hatch();
        }, 650);
        Sound.say([{ pause: 900 }, 'mx_magic_wow', { pause: 300 },
          { fn: () => restart(slots[m.from.length - 2], 'glow') }, 'w_' + m.to, { pause: 300 },
          'mx_says_' + m.vowel, { pause: 300 }, praise(), { pause: 400 }]).then(() => resolve());
      });
      Sound.say(['w_' + m.from, { pause: 400 }, 'mx_magic']);
      armIdle(() => { Sound.say(['mx_magic']); c.classList.add('hint'); });
    });
  }

  // 由 from 個位置飛去 el 而家個位置
  function flip(el, from, ms) {
    const to = el.getBoundingClientRect();
    if (!el.animate || !to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.2)` }, { transform: 'translate(0,0) scale(1)' }],
      { duration: ms, easing: 'cubic-bezier(.3,1.3,.5,1)' });
  }

  // ---------- ③ Mecha-Rex 決鬥 ----------
  async function bossFight(tk, plan) {
    play.replaceChildren();
    document.body.classList.add('mecha-boss');
    hud.className = 'hearts';
    put(hud, `<span class="h-face">${MechaArt.rex().replace('viewBox="0 0 260 240"', 'viewBox="14 20 110 110"')}</span>` + plan.map(() => `<span class="heart">${JediArt.heart()}</span>`).join(''));
    rexEl.className = 'enter';
    Sound.sfx.roar();
    restart($('#scene'), 'shake');
    await wait(1100);
    if (tk !== token) return;
    await Sound.say(['mx_boss', { pause: 250 }, 'mx_boss_go', { pause: 300 }]);
    if (tk !== token) return;
    for (const q of plan) {
      if (q.type === 'truth') await askTruth(q, tk);
      else if (q.type === 'where') await askWhere(q, tk, true);
      else if (q.type === 'two') await askTwo(q, tk);
      else await askRead(q, tk, true);
      if (tk !== token) return;
      await strike(tk);
      if (tk !== token) return;
    }
    play.replaceChildren();
    rexEl.classList.add('dizzy');
    await sayMin(['mr_give', { pause: 300 }], 2200);
    if (tk !== token) return;
    rexEl.classList.add('flee');
    Sound.sfx.whoosh();
    await wait(1200);
    if (tk !== token) return;
    rexEl.className = '';
    document.body.classList.remove('mecha-boss');
    hud.replaceChildren();
    hud.className = '';
  }

  // ✓✗（工作紙 Part 1）：陷阱圖一定係 ✗，之後講返佢係乜
  function askTruth(q, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-truth in-boss';
      play.replaceChildren();
      const sayId = q.isTrue ? q.id : q.lie;
      const h = document.createElement('div');
      h.className = 'holo';
      put(h, `<div class="holo-pic">${MechaArt.thing(q.id)}</div>
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
      const box = h.querySelector('.holo-box');
      const mark = (kind) => { put(box, kind === 'tick' ? JediArt.tick() : JediArt.cross()); restart(box, 'stamp'); };

      function onTap(kind) {
        if (done || tk !== token) return;
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
            pose('block');
            Sound.say([{ pause: 200 }, 'jd_tick', { pause: 300 }]).then(() => resolve(misses === 0));
            return;
          }
          pose('slash');
          restart(h, 'slashed');
          const after = q.trap ? ['no_' + q.id]
            : [{ fn: () => { h.classList.remove('slashed'); text.textContent = sentence(q.id); restart(text, 'fixed'); mark('tick'); } }, 'ts_' + q.id];
          Sound.say([{ pause: 200 }, 'jd_cross', { pause: 250 }, ...after, { pause: 300 }]).then(() => resolve(misses === 0));
        } else {
          misses++;
          restart(btn[kind], 'wiggle');
          Sound.sfx.soft();
          rexLaugh(misses === 1);
          Sound.clear();
          Sound.say([misses === 1 ? { pause: 900 } : { pause: 1 }, 'jd_look', { pause: 200 }, 'ts_' + sayId]);
          if (misses >= 2) btn[right].classList.add('hint');
        }
      }
      Sound.say(['ts_' + sayId, { pause: 300 }, 'jd_tick_q']);
      armIdle(() => Sound.say(['ts_' + sayId, { pause: 300 }, 'jd_tick_q']));
    });
  }

  function rexLaugh(withVoice) {
    restart(rexEl, 'laugh');
    if (withVoice) Sound.say(['mr_laugh']);
  }

  // 答啱：出戰嗰個衝過去打一劍，Mecha-Rex 扣一粒心
  async function strike(tk) {
    dbg.target = null;
    await lunge(tk, hero(), () => {
      const hearts = hud.querySelectorAll('.heart:not(.lost)');
      if (hearts.length) restart(hearts[hearts.length - 1], 'lost');
    });
    if (tk !== token) return;
    await Sound.say(['mr_ouch_' + (1 + Math.floor(Math.random() * 3)), { pause: 300 }]);
  }

  // 衝向 Mecha-Rex → 撞劍 → 返原位
  function lunge(tk, who, onHit, target) {
    target = target || rexEl;
    const svg = who.querySelector('svg');
    const a = center(who), b = center(target);
    const dx = (b.x - a.x) * 0.55, dy = (b.y - a.y) * 0.4;
    Sound.sfx.saber();
    pose('slash', 900, who);
    setTimeout(() => {
      if (tk !== token) return;
      Sound.sfx.clash();
      burstAt({ x: (a.x + dx + b.x) / 2 + 20, y: b.y - 20 }, true);
      restart(target, 'hit');
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

  // ---------- 結局短片（~20 秒） ----------
  let fx = [];
  function cleanupBattle() {
    document.body.classList.remove('mecha-battle', 'mecha-team');
    fx.forEach((e) => e.remove());
    fx = [];
    document.querySelectorAll('.jd-burst, .jd-laser').forEach((e) => e.remove());
    rexEl.onpointerdown = null;
    for (const el of Object.values(heroes)) el.classList.remove('powered', 'away', 'cheer');
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
    if (id === 'rocket') return battleRocket(tk);
    if (id === 'giant') return battleGiant(tk);
    return battleCombo(tk);
  }

  async function teamWins(tk) {
    Object.values(heroes).forEach((el) => el.classList.add('powered'));
    Sound.sfx.hatch();
    await sayMin(['mx_win', { pause: 300 }], 2400);
    if (tk !== token) return;
    Object.values(heroes).forEach((el) => el.classList.remove('powered'));
    document.body.classList.remove('mecha-battle');
  }
  // Mecha-Rex 返嚟（3 個結局都係咁開始）
  async function rexBack(tk, alarmKey) {
    document.body.classList.add('mecha-battle', 'mecha-boss');
    rexEl.className = 'enter';
    rexEl.onpointerdown = (e) => { e.preventDefault(); if (tk === token && !rexEl.classList.contains('friendly')) restart(rexEl, 'laugh'); };
    Sound.sfx.roar();
    await wait(1100);
    if (tk !== token) return;
    restart(rexEl, 'laugh');
    await sayMin([alarmKey, { pause: 200 }], 2200);
  }

  // 結局 1：Jedi + Sith 交叉光劍 ×3 → Mecha-Rex 縮細變 BB 機械恐龍，做好朋友
  async function battleCombo(tk) {
    await rexBack(tk, 'xc_alarm');
    if (tk !== token) return;
    document.body.classList.add('mecha-team');
    Object.values(heroes).forEach((el) => pose('shout', 1600, el));
    Sound.sfx.beam();
    await sayMin(['xc_go', { pause: 100 }], 2000);
    if (tk !== token) return;
    for (let i = 1; i <= 3; i++) {
      Object.values(heroes).forEach((el) => pose('slash', 900, el));
      Sound.sfx.saber();
      const beam = addFx('mx-beam');
      await wait(450);
      if (tk !== token) return;
      Sound.sfx.clash();
      burstAt(center(rexEl), true);
      restart(rexEl, 'hit');
      rexEl.style.setProperty('--turn', i / 3);
      await wait(650);
      beam.remove();
      if (tk !== token) return;
    }
    put(rexEl, MechaArt.happyRex());
    rexEl.classList.add('friendly');
    Sound.sfx.hatch();
    burstAt(center(rexEl));
    await sayMin(['xc_good', { pause: 300 }], 2600);
    if (tk !== token) return;
    Object.values(heroes).forEach((el) => el.classList.add('cheer'));
    rexEl.classList.add('cheer');
    await sayMin(['xc_win', { pause: 200 }], 1600);
    if (tk !== token) return;
    await teamWins(tk);
    rexEl.onpointerdown = null;
  }

  // 結局 2：Mecha-Rex 着火箭飛走 → 藍 + 紅戰機追 → 射 ×3 → 火箭熄咗，開降落傘慢慢飄走
  async function battleRocket(tk) {
    document.body.classList.add('mecha-battle');
    const fly = addFx('fx-rexfly', `<div class="rf-para">${MechaArt.parachute()}</div><div class="rf-rex">${MechaArt.rex()}</div><i class="rf-flame"></i><i class="rf-flame b"></i>`);
    Sound.sfx.roar();
    await wait(1400);
    if (tk !== token) return;
    await sayMin(['rk_alarm', { pause: 200 }], 2200);
    if (tk !== token) return;
    Object.values(heroes).forEach((el) => el.classList.add('away'));
    const f1 = addFx('fx-fighter mx-f1', JediArt.fighter());
    const f2 = addFx('fx-fighter mx-f2', MechaArt.redFighter());
    Sound.sfx.whoosh();
    await sayMin(['rk_go', { pause: 100 }], 2200);
    if (tk !== token) return;
    for (let i = 0; i < 3; i++) {
      laser(i % 2 ? f2 : f1, fly, () => { restart(fly, 'hit'); Sound.sfx.thump(); }, i % 2 ? '#ff6b7a' : '#8fe4ff');
      await wait(1000);
      if (tk !== token) return;
    }
    fly.classList.add('para');
    Sound.sfx.boing();
    await wait(900);
    if (tk !== token) return;
    await sayMin(['rk_win', { pause: 200 }], 2600);
    if (tk !== token) return;
    f1.classList.add('leave');
    f2.classList.add('leave');
    Object.values(heroes).forEach((el) => el.classList.remove('away'));
    await wait(700);
    if (tk !== token) return;
    await teamWins(tk);
  }
  function laser(from, to, onHit, col) {
    const a = center(from), b = center(to);
    const l = document.createElement('div');
    l.className = 'jd-laser';
    if (col) { l.style.background = col; l.style.boxShadow = `0 0 12px ${col}, 0 0 4px #fff`; }
    l.style.left = (a.x + from.getBoundingClientRect().width * 0.4) + 'px';
    l.style.top = a.y + 'px';
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    l.style.transform = `rotate(${ang}deg)`;
    document.body.appendChild(l);
    Sound.sfx.zap();
    const done = () => { l.remove(); burstAt(b, true); if (onHit) onHit(); };
    if (!l.animate) return done();
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    l.animate([{ transform: `rotate(${ang}deg) translateX(0)` }, { transform: `rotate(${ang}deg) translateX(${dist * 0.85}px)` }],
      { duration: 420, easing: 'linear' }).onfinish = done;
  }

  // 結局 3：baby droid 返嚟幫手 → 疊高變巨型機械人 → Force 波 ×2 → Mecha-Rex 嚇走 → 煙花
  async function battleGiant(tk) {
    await rexBack(tk, 'gd_alarm');
    if (tk !== token) return;
    const babies = MechaArt.BABY_COLS.slice(0, 4).map((c, i) => {
      const b = addFx('fx-baby', MechaArt.baby(c));
      b.style.setProperty('--i', i);
      b.style.animationDelay = i * 0.25 + 's';
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token) { Sound.sfx.boing(); restart(b, 'boop'); } });
      return b;
    });
    [0, 250, 500, 750].forEach((t) => setTimeout(() => { if (tk === token) Sound.sfx.pop(); }, t));
    await wait(1300);
    if (tk !== token) return;
    await sayMin(['gd_go', { pause: 100 }], 1800);
    if (tk !== token) return;
    babies.forEach((b) => b.classList.add('stack'));
    Sound.sfx.beam();
    await wait(1200);
    if (tk !== token) return;
    babies.forEach((b) => b.classList.add('giant'));
    Sound.sfx.hatch();
    await wait(900);
    if (tk !== token) return;
    for (let w = 0; w < 2; w++) {
      Object.values(heroes).forEach((el) => pose('push', 900, el));
      Sound.sfx.whoosh();
      const wave = addFx('force-wave');
      setTimeout(() => wave.remove(), 1000);
      await wait(500);
      if (tk !== token) return;
      restart(rexEl, 'hit');
      Sound.sfx.thump();
      await wait(700);
      if (tk !== token) return;
    }
    rexEl.classList.add('flee');
    Sound.sfx.whoosh();
    fireworks({ x: innerWidth * 0.55, y: innerHeight * 0.35 });
    await sayMin(['gd_win', { pause: 200 }], 2600);
    if (tk !== token) return;
    rexEl.className = '';
    babies.forEach((b) => b.classList.add('cheer'));
    await teamWins(tk);
  }
  function fireworks(c) {
    const cols = ['#ffd36e', '#ffb3c7', '#9fd3ff', '#a6e3a0', '#c7a3ff', '#ff8a8a'];
    for (let i = 0; i < 14; i++) {
      const s = addFx('fx-spark', EndArt.star(cols[i % cols.length]));
      s.style.left = c.x + 'px';
      s.style.top = c.y + 'px';
      if (!s.animate) continue;
      const ang = (i / 14) * Math.PI * 2, r = 140 + (i % 3) * 60;
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * r}px), calc(-50% + ${Math.sin(ang) * r}px)) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * r}px), calc(-50% + ${Math.sin(ang) * r + 60}px)) scale(.8)`, opacity: 0 }
      ], { duration: 1800 + i * 40, easing: 'ease-out', fill: 'forwards' });
    }
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); cleanupBattle(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'mecha') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'mecha' && !document.body.classList.contains('mecha-done')) start(); });

  function renderStats(tbody) {
    tbody.replaceChildren();
    const row = (cells) => {
      const tr = document.createElement('tr');
      for (const v of cells) { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); }
      tbody.appendChild(tr);
    };
    const f = (s, k) => s[k + 'Ok'] + ' / ' + s[k];
    for (const p of unit.preps) {
      const s = st(p.id);
      row([(p.focus ? '★ ' : '') + p.word, f(s, 'where'), f(s, 'read') + (p.id === 'next' ? '（兩個字 ' + f(s, 'two') + '）' : ''), '—', '—']);
    }
    for (const id of unit.spell) {
      const s = st(id);
      row([THING[id].word, '—', '—', f(s, 'spell'), unit.truth.some((t) => t.id === id) ? f(s, 'truth') : '—']);
    }
  }
  function resetStats() { stats = {}; store(STORE_KEY, stats); ['mechaBag.v1', 'mechaMagic.v1', 'mechaTrap.v1'].forEach((k) => store(k, [])); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    Object.values(heroes).forEach((el) => el.classList.add('in'));
    await wait(700);
    if (tk !== token) return;
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo, _dbg: dbg };
})();
