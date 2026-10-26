/*
 * Jedi Luca 大戰 Sith：學英文（全英文，Yorkland Starters R&W Part 1 + Part 3）
 * 流程：Jedi Luca 出場
 *   → ① Truth Saber ×5：Sith 機械人投影「圖 + 句子」，Luca 撳 ✓ 定 ✗（工作紙 Look and read）
 *        ✗ 嘅話再問「What is it?」揀返啱嘅字，句子改正
 *   → ② Force Spell ×3：4 粒水晶字母跟次序砌字（工作紙 Look at the letters. Write the words.）→ 光劍充電
 *   → ③ Sith Lord 決鬥 ×4：聽字搵圖 / 睇字搵圖 / ✓✗ 混合，答啱一題打一劍
 *   → 結局短片（3 個輪流）→ 貼紙 → 拜拜
 * 答錯唔罰：輕輕搖 + 再講一次；錯兩次啱嗰個會發光
 */
const JediGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const unit = self.JEDI_UNIT;
  const THING = Object.fromEntries(unit.things.map((t) => [t.id, t]));
  const PARTNER = {};
  for (const p of unit.truth) { PARTNER[p.id] = PARTNER[p.id] || p.lie; PARTNER[p.lie] = PARTNER[p.lie] || p.id; }
  const TRUTH = 5, SPELL = 3, BOSS = 4;
  const sentence = (id) => (THING[id].these ? 'These are ' : 'This is a ') + THING[id].word + '.';

  // ---------- 記錄（localStorage）：第一下就啱 / 次數 ----------
  const STORE_KEY = 'jediWords.v1';
  let stats = load(STORE_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const blank = () => ({ truth: 0, truthOk: 0, spell: 0, spellOk: 0, boss: 0, bossOk: 0 });
  function record(id, kind, firstTry) {
    const s = stats[id] || (stats[id] = blank());
    s[kind]++;
    if (firstTry) s[kind + 'Ok']++;
    store(STORE_KEY, stats);
  }
  const rate = (id, kind) => { const s = stats[id] || blank(); return s[kind] ? s[kind + 'Ok'] / s[kind] : 0; };

  // Truth：focus 字（未熟，例如 desk）第一下就啱未夠 3 次就一定出；其餘未熟嘅排先
  function pickTruth() {
    const focus = unit.truth.filter((p) => p.focus && (stats[p.id] || blank()).truthOk < 3);
    const rest = unit.truth.filter((p) => !focus.includes(p))
      .map((p) => ({ p, score: rate(p.id, 'truth') + Math.random() * 0.5 }))
      .sort((a, b) => a.score - b.score).map((x) => x.p);
    const picked = shuffle([...focus, ...rest].slice(0, TRUTH));
    // 真 / 假大約一半一半
    const flags = shuffle([true, true, false, false, Math.random() < 0.5]);
    return picked.map((p, i) => ({ id: p.id, lie: p.lie, isTrue: flags[i] }));
  }
  // Spell：10 個字平均輪流（bag），一輪出晒先再嚟過
  const BAG_KEY = 'jediBag.v1';
  function pickSpell() {
    let bag = load(BAG_KEY, []).filter((id) => unit.spell.includes(id));
    if (bag.length < SPELL) bag = bag.concat(shuffle(unit.spell.filter((id) => !bag.includes(id))));
    const out = bag.slice(0, SPELL);
    store(BAG_KEY, bag.slice(SPELL));
    return out;
  }
  // Boss：用今局出過嘅字，未熟嘅排先
  function pickBoss(truthPlan, spellPlan) {
    const seen = [...new Set([...truthPlan.map((q) => q.id), ...spellPlan])];
    const ranked = seen.map((id) => ({ id, s: rate(id, 'boss') + Math.random() * 0.6 })).sort((a, b) => a.s - b.s).map((x) => x.id);
    const pools = {
      find: ranked.filter((id) => id !== 'swim'),
      read: ranked,
      truth: ranked.filter((id) => PARTNER[id])     // 句子要通順：唔用 swim / sand
    };
    if (!pools.truth.length) pools.truth = unit.truth.map((p) => p.id);
    const types = ['find', 'read', 'truth', 'read'];
    const used = new Set();
    return types.map((type) => {
      const pool = pools[type];
      const id = pool.find((x) => !used.has(x)) || pool[0];
      used.add(id);
      return { type, id, isTrue: Math.random() < 0.5 };
    });
  }

  // ---------- DOM ----------
  const screen = $('#jedi-screen'), lucaEl = $('#jedi-luca'), sithEl = $('#jedi-sith');
  const play = $('#jedi-play'), hud = $('#jedi-hud'), againBtn = $('#jedi-again');
  put($('#jedi-bg'), JediArt.space());
  put(lucaEl, JediArt.luca());
  put(sithEl, JediArt.sith());
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  const dbg = { target: null };     // 開發測試：下一下應該撳邊個

  function armIdle(fn, ms) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000);
  }
  const praise = () => 'jd_yes_' + (1 + Math.floor(Math.random() * 3));
  const letterKey = (l) => Sound.has('ph_' + l) ? 'ph_' + l : 'ltr_' + l;

  // Luca 動作：block / slash / push / lunge / shout
  function pose(cls, ms) {
    restart(lucaEl, cls);
    clearTimeout(pose[cls]);
    pose[cls] = setTimeout(() => lucaEl.classList.remove(cls), ms || 800);
  }

  function reset() {
    document.body.dataset.screen = 'jedi';
    document.body.classList.remove('jedi-done', 'jedi-boss', 'jedi-battle');
    cleanupBattle();
    lucaEl.className = '';
    sithEl.className = '';
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
    const truthPlan = pickTruth(), spellPlan = pickSpell();
    run(tk, truthPlan, spellPlan, pickBoss(truthPlan, spellPlan), (opts && opts.from) || 1);
  }

  async function run(tk, truthPlan, spellPlan, bossPlan, from) {
    lucaEl.classList.add('in');
    Sound.sfx.saber();
    await wait(900);
    if (tk !== token) return;
    pose('shout', 1400);
    if (from <= 1) {
      await Sound.say(['jd_hi', { pause: 250 }, 'jd_intro', { pause: 300 }]);
      if (tk !== token) return;
      // ① Truth Saber
      for (const q of truthPlan) {
        await askTruth(q, tk, false);
        if (tk !== token) return;
      }
    }
    if (from <= 2) {
      // ② Force Spell：光劍充電
      play.replaceChildren();
      buildMeter(spellPlan.length);
      await Sound.say([{ pause: 200 }, 'jd_spell', { pause: 250 }]);
      if (tk !== token) return;
      for (let i = 0; i < spellPlan.length; i++) {
        await askSpell(spellPlan[i], tk);
        if (tk !== token) return;
        fillMeter(i);
      }
      play.replaceChildren();
      lucaEl.classList.add('charged');
      Sound.sfx.saber();
      pose('block', 1000);
      await sayMin(['jd_charge', { pause: 300 }], 1600);
      if (tk !== token) return;
    }
    // ③ Sith Lord 決鬥
    await bossFight(tk, bossPlan);
    if (tk !== token) return;
    // 結局短片：3 個輪流
    const end = Rewards.next('jedi');
    await battle(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('jedi', end, 'en');
    if (tk !== token) return;
    await finale(tk);
  }

  async function finale(tk) {
    play.replaceChildren();
    hud.replaceChildren();
    lucaEl.classList.add('wave');
    await Sound.say([{ pause: 300 }, 'jd_bye']);
    if (tk !== token) return;
    document.body.classList.add('jedi-done');
  }

  // ---------- ① Truth Saber（亦用喺 Boss 嘅 ✓✗ 題） ----------
  function holo(picId, sayId, withDroid) {
    const h = document.createElement('div');
    h.className = 'holo';
    put(h, `<div class="holo-pic">${JediArt.thing(picId)}</div>
      <div class="holo-line"><span class="holo-text"></span><span class="holo-box"></span></div>
      ${withDroid ? `<div class="holo-droid">${JediArt.droid()}</div>` : ''}`);
    h.querySelector('.holo-text').textContent = sentence(sayId);
    return h;
  }

  function askTruth(q, tk, inBoss) {
    return new Promise((resolve) => {
      play.className = 'mode-truth' + (inBoss ? ' in-boss' : '');
      play.replaceChildren();
      const sayId = q.isTrue ? q.id : q.lie;
      const h = holo(q.id, sayId, !inBoss);
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
          Object.values(btn).forEach((b) => b.classList.remove('hint'));
          btn[kind === 'tick' ? 'cross' : 'tick'].classList.add('fade');
          if (kind === 'tick') {
            record(q.id, inBoss ? 'boss' : 'truth', misses === 0);
            pose('block');
            Sound.sfx.saber();
            zapDroid(h);
            Sound.say([{ pause: 200 }, 'jd_tick', { pause: 200 }, inBoss ? { pause: 1 } : praise(), { pause: 400 }]).then(() => resolve(misses === 0));
          } else {
            pose('slash');
            Sound.sfx.saber();
            restart(h, 'slashed');
            if (inBoss) {
              record(q.id, 'boss', misses === 0);
              Sound.say([{ pause: 200 }, 'jd_cross', { pause: 250 },
                { fn: () => fixSentence(h, q.id) }, 'ts_' + q.id, { pause: 300 }]).then(() => resolve(misses === 0));
            } else {
              Sound.say([{ pause: 200 }, 'jd_cross', { pause: 250 }, 'jd_what']).then(() => {
                if (tk !== token) return;
                askWhat(q, h, row, tk, misses).then(resolve);
              });
            }
          }
        } else {
          misses++;
          restart(btn[kind], 'wiggle');
          Sound.sfx.soft();
          if (inBoss) sithLaugh(misses === 1);
          Sound.clear();
          Sound.say([misses === 1 && inBoss ? { pause: 900 } : { pause: 1 }, 'jd_look', { pause: 200 }, 'ts_' + sayId]);
          if (misses >= 2) btn[right].classList.add('hint');
        }
      }
      Sound.say(['ts_' + sayId, { pause: 300 }, 'jd_tick_q']);
      armIdle(() => Sound.say(['ts_' + sayId, { pause: 300 }, 'jd_tick_q']));
    });
  }

  // 句子改正：「This is a pen.」→「This is a crayon.」+ ✓
  function fixSentence(h, id) {
    const t = h.querySelector('.holo-text');
    h.classList.remove('slashed');
    t.textContent = sentence(id);
    restart(t, 'fixed');
    const box = h.querySelector('.holo-box');
    put(box, JediArt.tick());
    restart(box, 'stamp');
  }

  // ✗ 之後：「What is it?」兩張字卡揀一張（睇字）
  function askWhat(q, h, row, tk, prevMisses) {
    return new Promise((resolve) => {
      row.className = 'tx-row words';
      row.replaceChildren();
      let misses = 0, done = false;
      const cards = shuffle([q.id, q.lie]).map((id) => {
        const c = document.createElement('button');
        c.className = 'wcard';
        c.textContent = THING[id].word;
        c.dataset.id = id;
        c.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (id === q.id) {
            done = true;
            clearTimeout(idleTimer);
            record(q.id, 'truth', prevMisses === 0 && misses === 0);
            Sound.clear();
            cards.forEach((x) => { if (x !== c) x.classList.add('fade'); });
            restart(c, 'right');
            fixSentence(h, q.id);
            zapDroid(h);
            Sound.say([{ pause: 200 }, 'ts_' + q.id, { pause: 300 }, praise(), { pause: 400 }]).then(() => resolve());
          } else {
            misses++;
            restart(c, 'wiggle');
            Sound.sfx.soft();
            Sound.clear();
            Sound.say(['w_' + id, { pause: 400 }, 'jd_look', { pause: 200 }, 'jd_what']);
            if (misses >= 2) cards.find((x) => x.dataset.id === q.id).classList.add('hint');
          }
        });
        row.appendChild(c);
        return c;
      });
      dbg.target = cards.find((x) => x.dataset.id === q.id);
      armIdle(() => { Sound.say(['jd_what']); cards.find((x) => x.dataset.id === q.id).classList.add('hint'); });
    });
  }

  // 機械人中咗：火花 + 轉住飛走
  function zapDroid(h) {
    const d = h.querySelector('.holo-droid');
    if (!d) return;
    setTimeout(() => { Sound.sfx.zap(); burstAt(center(d)); d.classList.add('zapped'); }, 250);
  }

  // ---------- ② Force Spell ----------
  function buildMeter(n) {
    hud.className = 'meter';
    put(hud, `<div class="m-hilt"></div>${'<i></i>'.repeat(n)}`);
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
      const word = THING[id].word;
      const wrap = document.createElement('div');
      wrap.className = 'sp-wrap';
      put(wrap, `<div class="sp-pic">${JediArt.thing(id)}</div><div class="sp-slots"></div>`);
      const slotsEl = wrap.querySelector('.sp-slots');
      const slots = [...word].map(() => { const s = document.createElement('span'); s.className = 'sp-slot'; slotsEl.appendChild(s); return s; });
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
          // 砌完：逐粒發光讀一次，再讀成個字
          busy = true;
          dbg.target = null;
          record(id, 'spell', wordMisses === 0);
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

  // 由 from 個位置飛去 el 而家個位置
  function flip(el, from, ms) {
    const to = el.getBoundingClientRect();
    if (!el.animate || !to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(1.2)` }, { transform: 'translate(0,0) scale(1)' }],
      { duration: ms, easing: 'cubic-bezier(.3,1.3,.5,1)' });
  }

  // ---------- ③ Sith Lord 決鬥 ----------
  let hp = 0;
  async function bossFight(tk, plan) {
    play.replaceChildren();
    document.body.classList.add('jedi-boss');
    hud.className = 'hearts';
    hp = plan.length;
    put(hud, `<span class="h-face">${JediArt.sith().replace('viewBox="0 0 200 260"', 'viewBox="48 22 104 104"')}</span>` + plan.map(() => `<span class="heart">${JediArt.heart()}</span>`).join(''));
    sithEl.className = 'enter';
    Sound.sfx.thump();
    restart($('#scene'), 'shake');
    await wait(1100);
    if (tk !== token) return;
    await Sound.say(['jd_boss', { pause: 250 }, 'jd_boss_go', { pause: 300 }]);
    if (tk !== token) return;
    for (const q of plan) {
      if (q.type === 'truth') await askTruth({ id: q.id, lie: PARTNER[q.id], isTrue: q.isTrue }, tk, true);
      else await askPick(q, tk);
      if (tk !== token) return;
      await strike(tk);
      if (tk !== token) return;
    }
    play.replaceChildren();
    sithEl.classList.add('dizzy');
    await sayMin(['sith_give', { pause: 300 }], 2200);
    if (tk !== token) return;
    sithEl.classList.add('flee');
    Sound.sfx.whoosh();
    await wait(1200);
    if (tk !== token) return;
    sithEl.className = '';
    document.body.classList.remove('jedi-boss');
    hud.replaceChildren();
    hud.className = '';
  }

  // 聽字搵圖（find）/ 睇字搵圖（read）
  function askPick(q, tk) {
    return new Promise((resolve) => {
      play.className = 'mode-pick' + (q.type === 'read' ? ' reading' : '');
      play.replaceChildren();
      let card = null;
      if (q.type === 'read') {
        card = document.createElement('div');
        card.className = 'rcard';
        card.textContent = THING[q.id].word;
        play.appendChild(card);
      }
      const row = document.createElement('div');
      row.className = 'jd-picks';
      play.appendChild(row);
      const partner = PARTNER[q.id] && q.id !== 'sock' ? [PARTNER[q.id]] : [];
      const others = shuffle(unit.things.map((t) => t.id).filter((id) => id !== q.id && !partner.includes(id) && !(q.id === 'sock' && id === 'socks') && !(q.id === 'socks' && id === 'sock')));
      const opts = shuffle([q.id, ...partner, ...others].slice(0, 3));
      let misses = 0, done = false;
      const picks = opts.map((id, i) => {
        const b = document.createElement('button');
        b.className = 'jd-pick';
        b.dataset.id = id;
        b.style.animationDelay = i * 110 + 'ms';
        put(b, JediArt.thing(id));
        b.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (id === q.id) {
            done = true;
            clearTimeout(idleTimer);
            record(q.id, 'boss', misses === 0);
            Sound.clear();
            picks.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            restart(b, 'right');
            if (card) restart(card, 'right');
            Sound.say([{ pause: 150 }, 'w_' + q.id, { pause: 300 }]).then(() => resolve());
          } else {
            misses++;
            restart(b, 'wiggle');
            Sound.sfx.soft();
            sithLaugh(misses === 1);
            Sound.clear();
            Sound.say([misses === 1 ? { pause: 900 } : { pause: 1 }, 'w_' + id, { pause: 350 },
              ...(q.type === 'find' ? ['jd_find', 'w_' + q.id] : ['jd_read_q'])]);
            if (misses >= 2) picks.find((x) => x.dataset.id === q.id).classList.add('hint');
          }
        });
        row.appendChild(b);
        return b;
      });
      dbg.target = picks.find((x) => x.dataset.id === q.id);
      if (q.type === 'find') {
        Sound.say(['jd_find', { pause: 100 }, 'w_' + q.id]);
        armIdle(() => Sound.say(['jd_find', { pause: 100 }, 'w_' + q.id]));
      } else {
        Sound.say(['jd_read_q']);
        // 睇字：靜咗一陣就讀埋個字（唔會卡住）
        armIdle(() => Sound.say(['w_' + q.id]));
      }
    });
  }

  function sithLaugh(withVoice) {
    restart(sithEl, 'laugh');
    if (withVoice) Sound.say(['sith_laugh']);
  }

  // 答啱：Luca 衝過去打一劍，Sith 扣一粒心
  async function strike(tk) {
    dbg.target = null;
    await lunge(tk, () => {
      hp--;
      const hearts = hud.querySelectorAll('.heart:not(.lost)');
      if (hearts.length) restart(hearts[hearts.length - 1], 'lost');
    });
    if (tk !== token) return;
    await Sound.say(['sith_ouch_' + (1 + Math.floor(Math.random() * 3)), { pause: 300 }]);
  }

  // 衝向 Sith Lord → 撞劍 → 返原位
  function lunge(tk, onHit, target) {
    target = target || sithEl;
    const svg = lucaEl.querySelector('svg');
    const a = center(lucaEl), b = center(target);
    const dx = (b.x - a.x) * 0.55, dy = (b.y - a.y) * 0.4;
    Sound.sfx.saber();
    pose('slash', 900);
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
    document.body.classList.remove('jedi-battle');
    fx.forEach((e) => e.remove());
    fx = [];
    document.querySelectorAll('.jd-burst').forEach((e) => e.remove());
    lucaEl.classList.remove('rainbow', 'powered');
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
    if (id === 'ship') return battleShip(tk);
    if (id === 'saber') return battleSaber(tk);
    return battleDroids(tk);
  }

  async function jediWins(tk) {
    lucaEl.classList.add('powered');
    Sound.sfx.hatch();
    await sayMin(['jd_win', { pause: 300 }], 2400);
    if (tk !== token) return;
    lucaEl.classList.remove('powered');
    document.body.classList.remove('jedi-battle');
  }

  // 結局 1：機械人大軍 → Force push ×3 → 機械人碌走
  async function battleDroids(tk) {
    document.body.classList.add('jedi-battle');
    const droids = [];
    for (let i = 0; i < 6; i++) {
      const d = addFx('fx-droid', JediArt.droid());
      d.style.setProperty('--col', i % 3);
      d.style.setProperty('--row', Math.floor(i / 3));
      d.style.animationDelay = (i * 0.15) + 's, ' + (-i * 0.4) + 's';
      d.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token) knock(d); });
      droids.push(d);
    }
    [200, 700, 1200].forEach((t) => setTimeout(() => { if (tk === token) Sound.sfx.thump(); }, t));
    await wait(1700);
    if (tk !== token) return;
    await sayMin(['dro_alarm', { pause: 200 }], 2400);
    if (tk !== token) return;
    pose('shout', 1600);
    await sayMin(['dro_go', { pause: 100 }], 1800);
    if (tk !== token) return;
    for (let w = 0; w < 3; w++) {
      pose('push', 900);
      Sound.sfx.whoosh();
      const wave = addFx('force-wave');
      setTimeout(() => wave.remove(), 1000);
      await wait(450);
      if (tk !== token) return;
      droids.filter((d) => !d.classList.contains('gone')).slice(0, 2).forEach(knock);
      await wait(800);
      if (tk !== token) return;
    }
    droids.forEach(knock);
    await sayMin(['dro_win', { pause: 200 }], 2400);
    if (tk !== token) return;
    await jediWins(tk);
  }
  function knock(d) {
    if (d.classList.contains('gone')) return;
    Sound.sfx.boing();
    burstAt(center(d));
    d.classList.add('gone');
  }

  // 結局 2：黑暗星 → Jedi 戰機射 ×3 → 爆開變煙花
  async function battleShip(tk) {
    document.body.classList.add('jedi-battle');
    const star = addFx('fx-darkstar enter', JediArt.darkStar());
    star.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !star.classList.contains('boom')) restart(star, 'hit'); });
    Sound.sfx.thump();
    await wait(1600);
    if (tk !== token) return;
    star.classList.add('charge');
    await sayMin(['shp_alarm', { pause: 200 }], 2400);
    if (tk !== token) return;
    lucaEl.classList.add('away');
    const ship = addFx('fx-fighter', JediArt.fighter());
    Sound.sfx.whoosh();
    await sayMin(['shp_go', { pause: 100 }], 2200);
    if (tk !== token) return;
    for (let i = 1; i <= 3; i++) {
      laser(ship, star, () => { star.classList.add('crack' + i); restart(star, 'hit'); Sound.sfx.thump(); });
      await wait(1000);
      if (tk !== token) return;
    }
    star.classList.add('boom');
    Sound.sfx.hatch();
    fireworks(center(star));
    await wait(600);
    await sayMin(['shp_win', { pause: 200 }], 2600);
    if (tk !== token) return;
    ship.classList.add('leave');
    lucaEl.classList.remove('away');
    await wait(700);
    if (tk !== token) return;
    await jediWins(tk);
  }
  function laser(from, to, onHit) {
    const a = center(from), b = center(to);
    const l = document.createElement('div');
    l.className = 'jd-laser';
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

  // 結局 3：Sith Lord 返嚟 → 彩虹光劍 ×3 → 佢把劍變藍，想做 Jedi
  async function battleSaber(tk) {
    document.body.classList.add('jedi-battle', 'jedi-boss');
    sithEl.className = 'enter';
    sithEl.onpointerdown = (e) => { e.preventDefault(); if (tk === token && !sithEl.classList.contains('friendly')) restart(sithEl, 'laugh'); };
    Sound.sfx.thump();
    await wait(1100);
    if (tk !== token) return;
    restart(sithEl, 'laugh');
    await sayMin(['sab_alarm', { pause: 200 }], 2200);
    if (tk !== token) return;
    lucaEl.classList.add('rainbow');
    pose('shout', 1600);
    Sound.sfx.beam();
    await sayMin(['sab_go', { pause: 100 }], 2000);
    if (tk !== token) return;
    for (let i = 1; i <= 3; i++) {
      await lunge(tk, () => sithEl.style.setProperty('--turn', i / 3));
      if (tk !== token) return;
      await wait(200);
    }
    sithEl.classList.add('friendly');
    lucaEl.classList.remove('rainbow');
    Sound.sfx.hatch();
    await sayMin(['sab_good', { pause: 300 }], 2600);
    if (tk !== token) return;
    await sayMin(['sab_win', { pause: 200 }], 1600);
    if (tk !== token) return;
    sithEl.classList.add('cheer');
    lucaEl.classList.add('cheer');
    await jediWins(tk);
    sithEl.onpointerdown = null;
    sithEl.className = 'friendly cheer';
    lucaEl.classList.remove('cheer');
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() { token++; clearTimeout(idleTimer); cleanupBattle(); sithEl.onpointerdown = null; }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'jedi') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'jedi' && !document.body.classList.contains('jedi-done')) start(); });

  function renderStats(tbody) {
    tbody.replaceChildren();
    const focus = new Set(unit.truth.filter((p) => p.focus).map((p) => p.id));
    const inTruth = new Set(unit.truth.map((p) => p.id));
    for (const t of unit.things) {
      const s = stats[t.id] || blank();
      if (!inTruth.has(t.id) && !unit.spell.includes(t.id) && !s.boss) continue;
      const tr = document.createElement('tr');
      const cells = [(focus.has(t.id) ? '★ ' : '') + t.word,
        inTruth.has(t.id) ? s.truthOk + ' / ' + s.truth : '—',
        unit.spell.includes(t.id) ? s.spellOk + ' / ' + s.spell : '—',
        s.bossOk + ' / ' + s.boss];
      for (const v of cells) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  function resetStats() { stats = {}; store(STORE_KEY, stats); store(BAG_KEY, []); }

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    Sound.clear();
    reset();
    lucaEl.classList.add('in');
    await wait(700);
    if (tk !== token) return;
    await battle(tk, id);
    if (tk !== token) return;
    await finale(tk);
  }

  return { start, stop, renderStats, resetStats, playVideo, _dbg: dbg };
})();
