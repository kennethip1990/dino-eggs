/*
 * 恐龍生日派對：單元四 家庭/人物 + 升小面試練習
 * 流程：小暴龍打招呼
 *   → ① 開門迎客 ×4（睇人揀字卡 → 示範打招呼，等 Luca 跟住講）
 *   → ② 派嘢食 ×3（聽指令：一步 → 兩步「先…再…」；講完先拎得）
 *   → ③ 坐位分類 ×4（淨係睇字：大人枱 / 小朋友枱）
 *   → ④ 家人大合照 + 小記者問題（撳咪講，錄低再播返）
 *   → 結局短片 → 拜拜
 * 答錯唔罰：輕輕搖、再講一次；錯兩次就提示啱嗰個
 */
const PartyGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const unit = self.FAMILY_UNIT;
  const people = unit.people;
  const byId = (id) => people.find((w) => w.id === id);
  const GUESTS = 4, SORTS = 4;
  const ITEMS = ['cake', 'drink', 'balloon'];
  const QUESTIONS = ['family', 'play', 'name', 'gift'];

  // ---------- 記錄（localStorage）：每個字第一下就啱嘅次數 ----------
  const STORE_KEY = 'partyWords.v1';
  let stats = load(STORE_KEY, {});
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function record(id, kind, firstTry) {
    const s = stats[id] || (stats[id] = {});
    s[kind] = (s[kind] || 0) + 1;
    if (firstTry) s[kind + 'Ok'] = (s[kind + 'Ok'] || 0) + 1;
    store(STORE_KEY, stats);
  }

  // ---------- 揀字：輪流平均（一輪 12 個字出晒先再嚟過），未熟嘅排先 ----------
  const BAG_KEY = 'partyBag.v1';
  const rate = (w) => { const s = stats[w.id] || {}; const n = (s.door || 0) + (s.sit || 0); return n ? ((s.doorOk || 0) + (s.sitOk || 0)) / n : 0; };
  let lastGuests = [];      // 今局開門嘅客人（大合照要用）
  function drawWords() {
    const allIds = people.map((w) => w.id);
    let bag = load(BAG_KEY, []).filter((id) => allIds.includes(id));
    const take = (n, ok) => {
      const out = [];
      for (let guard = 0; out.length < n && guard < 4; guard++) {
        if (bag.filter((id) => ok(byId(id), out)).length === 0) bag = bag.concat(allIds);
        const pool = [...new Set(bag)].map(byId).filter((w) => ok(w, out))
          .map((w) => ({ w, s: rate(w) + Math.random() * 0.5 })).sort((a, b) => a.s - b.s).map((x) => x.w);
        for (const w of pool) {
          if (out.length >= n) break;
          if (!ok(w, out)) continue;
          out.push(w);
          bag.splice(bag.indexOf(w.id), 1);
        }
      }
      return out;
    };
    // 開門：4 個唔同嘅人（爸爸 / 父親 唔會一齊出）；坐位：4 個唔同嘅字
    const guests = take(GUESTS, (w, out) => !out.some((o) => o.who === w.who));
    const sorts = take(SORTS, (w, out) => !out.includes(w));
    store(BAG_KEY, bag);
    lastGuests = guests.map((w) => w.who);
    return { guests: shuffle(guests), sorts: shuffle(sorts) };
  }

  // ---------- DOM ----------
  const screen = $('#party-screen');
  const peopleEl = $('#party-people'), cardsEl = $('#party-cards'), trayEl = $('#party-tray');
  const tablesEl = $('#party-tables'), photoEl = $('#party-photo'), micBtn = $('#party-mic');
  const fxEl = $('#party-fx'), titleEl = $('#party-title'), bubbleEl = $('#party-bubble'), againBtn = $('#party-again');
  const door = $('#party-door');
  put($('#party-room'), PartyArt.room());
  put(door.querySelector('.door-back'), PartyArt.doorBack());
  put(door.querySelector('.door-leaf'), PartyArt.doorLeaf());
  put(micBtn.querySelector('.mic-art'), PartyArt.mic);
  put(againBtn, Art.icons.again);

  let token = 0;
  let idleTimer = null;
  const dbg = {};           // 自動測試用：而家要答咩
  const STOP = {};
  // 每個 await 記住開始嗰陣嘅 token：中途返主選單 / 重新開始 → 舊嗰局即刻停（throw STOP）
  async function guard(p) { const t = token; const v = await p; if (t !== token) throw STOP; return v; }
  const sleep = (ms) => guard(wait(ms));
  const say = (items) => guard(Sound.say(items));
  // 邊個講嘢就郁佢個口
  async function speak(el, items) {
    if (el) el.classList.add('talking');
    try { return await guard(Sound.say(items)); } finally { if (el) el.classList.remove('talking'); }
  }
  const sayMin = (el, items, ms) => guard(Promise.all([speak(el, items), wait(ms)]));
  function restart(el, cls) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
  function praise() { return 'pty_yes_' + (1 + Math.floor(Math.random() * 3)); }
  function armIdle(fn) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn); }, 12000);
  }

  // ---------- 角色 ----------
  let cast = new Map();     // who -> element
  let host = null;
  function makePerson(who, pos) {
    const el = document.createElement('div');
    el.className = 'pp' + (who === 'host' ? ' host' : '');
    el.dataset.who = who;
    put(el, PartyArt.person(who));
    el.style.setProperty('--tag', tagTop(who));
    const held = document.createElement('div');
    held.className = 'held';
    el.appendChild(held);
    peopleEl.appendChild(el);
    place(el, pos);
    if (who !== 'host') cast.set(who, el);
    return el;
  }
  // 名牌貼喺肚：細路仔細隻，肚低啲
  const tagTop = (who) => ((166 - 36 * PartyArt.PEOPLE[who].scale) / 170 * 100).toFixed(1) + '%';
  function place(el, pos) {
    if (pos.x != null) el.style.setProperty('--x', typeof pos.x === 'number' ? pos.x + '%' : pos.x);
    if (pos.y != null) el.style.setProperty('--y', typeof pos.y === 'number' ? pos.y + 'vh' : pos.y);
    if (pos.h != null) el.style.setProperty('--h', `calc(${pos.h} * var(--u))`);
    if (pos.z != null) el.style.zIndex = pos.z;
  }
  const tagText = new Map();   // who -> 今局用過嘅字（大合照名牌）
  function setTag(el, text) {
    tagText.set(el.dataset.who, text);
    let t = el.querySelector('.ptag');
    if (!t) { t = document.createElement('div'); t.className = 'ptag'; el.appendChild(t); }
    t.textContent = text;
  }
  const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  // 撳中 / 放落邊個人：用真正畫咗嘢嘅位（啲人企得近，個框會重疊）；冇就揀最近嗰個
  function personAt(x, y) {
    for (const e of document.elementsFromPoint(x, y)) {
      const p = e.closest && e.closest('#party-people .pp');
      if (p) return p;
    }
    let best = null, bd = Infinity;
    for (const el of cast.values()) {
      if (!hits(el, x, y, 20)) continue;
      const c = center(el), d = Math.hypot(c.x - x, c.y - y);
      if (d < bd) { bd = d; best = el; }
    }
    return best;
  }
  function hits(el, x, y, pad) {
    const r = el.getBoundingClientRect(), p = pad || 0;
    return x >= r.left - p && x <= r.right + p && y >= r.top - p && y <= r.bottom + p;
  }
  // 嘢由 from 飛去 to（DOM rect），完咗 callback
  function flyClone(markup, fromRect, toEl, cls) {
    return new Promise((resolve) => {
      const g = document.createElement('div');
      g.className = 'pghost ' + (cls || '');
      put(g, markup);
      Object.assign(g.style, { left: fromRect.left + 'px', top: fromRect.top + 'px', width: fromRect.width + 'px', height: fromRect.height + 'px' });
      document.body.appendChild(g);
      const to = toEl.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (fromRect.left + fromRect.width / 2);
      const dy = to.top + to.height / 2 - (fromRect.top + fromRect.height / 2);
      const done = () => { g.remove(); resolve(); };
      if (!g.animate) return done();
      g.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx}px, ${dy}px) scale(.5)` }],
        { duration: 500, easing: 'ease-in', fill: 'forwards' }).onfinish = done;
      setTimeout(done, 800);
    });
  }

  // ---------- 拖放（亦可以撳一下揀，再撳目標） ----------
  function draggable(el, { markup, onDrop, onTap }) {
    let start = null, ghost = null;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      start = { x: e.clientX, y: e.clientY, r: el.getBoundingClientRect() };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener('pointermove', (e) => {
      if (!start) return;
      if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) {
        ghost = document.createElement('div');
        ghost.className = 'pghost dragging';
        put(ghost, markup());
        Object.assign(ghost.style, { width: start.r.width + 'px', height: start.r.height + 'px' });
        document.body.appendChild(ghost);
        el.classList.add('lifted');
      }
      if (ghost) Object.assign(ghost.style, { left: e.clientX - start.r.width / 2 + 'px', top: e.clientY - start.r.height / 2 + 'px' });
    });
    const end = (e) => {
      if (!start) return;
      const g = ghost;
      start = null; ghost = null;
      el.classList.remove('lifted');
      if (g) { const r = g.getBoundingClientRect(); g.remove(); onDrop(e.clientX, e.clientY, r); }
      else if (e.type === 'pointerup') onTap();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  // ---------- 開始 ----------
  function reset() {
    Sound.clear();
    clearTimeout(idleTimer);
    document.body.classList.remove('party-done');
    screen.className = '';
    for (const el of [peopleEl, cardsEl, trayEl, tablesEl, fxEl, titleEl]) el.replaceChildren();
    photoEl.className = '';
    micBtn.className = '';
    bubbleEl.className = '';
    door.className = '';
    cast = new Map();
    tagText.clear();
    host = null;
  }

  function start(opts) {
    ++token;
    reset();
    document.body.dataset.screen = 'party';
    run((opts && opts.from) || 1).catch((e) => { if (e !== STOP) console.error(e); });
  }

  async function run(from) {
    const plan = drawWords();
    host = makePerson('host', { x: 30, y: 10, h: 42, z: 5 });
    await sleep(400);
    if (from <= 1) {
      await speak(host, ['pty_hi', { pause: 300 }]);
      await segDoor(plan.guests);
    } else plan.guests.forEach((w, i) => { const el = makePerson(w.who, roomSlot(i)); setTag(el, w.text); });
    if (from <= 2) await segGive(plan.guests);
    if (from <= 3) await segSit(plan.sorts);
    await segPhoto();
    await segMic();
    // 獎勵短片：3 個結局輪流
    const end = Rewards.next('party');
    await ending(end);
    await guard(Rewards.celebrate('party', end, 'yue'));
    await finish();
  }

  async function finish() {
    closeMic();
    titleEl.replaceChildren();
    for (const el of cast.values()) el.classList.add('wave');
    if (host) host.classList.add('wave');
    await speak(host, [{ pause: 200 }, 'pty_bye']);
    document.body.classList.add('party-done');
  }

  // ---------- ① 開門迎客 ----------
  const roomSlot = (i) => ({ x: [40, 52, 46, 58][i], y: [12, 12, 4, 4][i], h: 40, z: [5, 5, 7, 7][i] });
  const DOOR_POS = { x: 'var(--door-x)', y: 'var(--door-y)', h: 44, z: 3 };   // 門口位置跟橫 / 直向（party.css）

  async function segDoor(guests) {
    screen.classList.add('seg-door');
    for (let i = 0; i < guests.length; i++) {
      const w = guests[i];
      Sound.sfx.ding();
      await sleep(900);
      const el = makePerson(w.who, DOOR_POS);
      el.classList.add('peek');
      door.classList.add('open');
      await sleep(900);
      await speak(host, ['pty_who']);
      await askDoor(w, el);
      // 示範打招呼 → 等 Luca 跟住講 → 客人回應
      await speak(host, ['pty_greet', { pause: 150 }]);
      await speak(host, ['greet_' + w.id]);
      bubbleEl.className = 'on';
      await sleep(2600);
      bubbleEl.className = '';
      await speak(el, ['pty_reply', { pause: 200 }]);
      el.classList.remove('peek');
      el.classList.add('walk');
      place(el, roomSlot(i));
      await sleep(1300);
      el.classList.remove('walk');
      door.classList.remove('open');
      await sleep(500);
    }
    screen.classList.remove('seg-door');
  }

  function askDoor(w, el) {
    dbg.door = w.id;
    return new Promise((resolve) => {
      const others = shuffle(people.filter((x) => x.who !== w.who)).slice(0, 2);
      const choices = shuffle([w, ...others]);
      cardsEl.replaceChildren();
      let misses = 0, done = false;
      const tk = token;
      const cards = choices.map((c, i) => {
        const b = document.createElement('button');
        b.className = 'wcard';
        b.textContent = c.text;
        b.style.animationDelay = i * 90 + 'ms';
        b.addEventListener('pointerdown', async (ev) => {
          ev.preventDefault();
          if (done || tk !== token) return;
          if (c.id === w.id) {
            done = true;
            clearTimeout(idleTimer);
            record(w.id, 'door', misses === 0);
            cards.forEach((x) => { if (x !== b) x.classList.add('fade'); });
            Sound.sfx.pop();
            await flyClone(`<div class="wcard">${w.text}</div>`, b.getBoundingClientRect(), el, 'card');
            if (tk !== token) return;
            cardsEl.replaceChildren();
            setTag(el, w.text);
            restart(el, 'hop');
            const extra = w.same ? [{ pause: 250 }, 'syn_' + w.id] : [];
            Sound.say([{ pause: 200 }, 'fam_' + w.id, ...extra, { pause: 250 }, praise(), { pause: 300 }]).then(resolve);
          } else {
            misses++;
            restart(b, 'wiggle');
            if (!Sound.isBusy()) Sound.say(['pty_who']);
            if (misses >= 2) cards.find((x) => x.textContent === w.text).classList.add('hint');
          }
        });
        cardsEl.appendChild(b);
        return b;
      });
      armIdle(() => Sound.say(['pty_who']));
    });
  }

  // ---------- ② 派嘢食（聽指令） ----------
  async function segGive(guests) {
    screen.classList.add('seg-give');
    place(host, { x: 9, y: 10, h: 40 });
    const order = guests.map((w) => cast.get(w.who));
    order.forEach((el, i) => { el.classList.add('walk'); place(el, { x: 30 + i * 19, y: 10, h: 40, z: 5 }); });
    await sleep(1300);
    order.forEach((el) => el.classList.remove('walk'));
    // 托盤：拖去人度，或者撳一下再撳人
    trayEl.replaceChildren();
    const tray = {};
    for (const id of ITEMS) {
      const b = document.createElement('div');
      b.className = 'titem';
      b.dataset.item = id;
      put(b, PartyArt.ITEMS[id]);
      trayEl.appendChild(b);
      tray[id] = b;
      draggable(b, {
        markup: () => PartyArt.ITEMS[id],
        onDrop: (x, y, r) => { if (activeGive) activeGive.drop(id, r, x, y); },
        onTap: () => { if (activeGive) activeGive.tap(id); }
      });
    }
    await speak(host, ['pty_give', { pause: 300 }]);
    // 第 1 條一步，之後兩步
    const rounds = [1, 2, 2];
    for (const n of rounds) {
      const who = shuffle(guests).slice(0, n);
      const its = shuffle(ITEMS).slice(0, n);
      await giveRound(who.map((w, i) => ({ w, item: its[i] })), tray);
    }
    trayEl.replaceChildren();
    screen.classList.remove('seg-give');
  }

  const instruction = (steps, fromStep) => {
    if (steps.length === 1) return ['give_' + steps[0].item, 'fam_' + steps[0].w.id];
    if (fromStep === 1) return ['then_' + steps[1].item, 'fam_' + steps[1].w.id];
    return ['first_' + steps[0].item, 'fam_' + steps[0].w.id, { pause: 350 }, 'then_' + steps[1].item, 'fam_' + steps[1].w.id];
  };

  let activeGive = null;
  async function giveRound(steps, tray) {
    const tk = token;
    let i = 0, misses = 0, listening = true, selected = null, finished = null;
    const doneP = new Promise((r) => (finished = r));
    dbg.give = () => ({ steps: steps.map((x) => ({ who: x.w.who, item: x.item })), i, listening });
    const clearHints = () => document.querySelectorAll('.titem.hint, .pp.hint').forEach((e) => e.classList.remove('hint'));
    // 講指令：講緊嗰陣托盤變淡、拎唔到（聽清楚先做）
    const sayInstr = async (prefix) => {
      listening = true;
      trayEl.classList.add('wait');
      try { await speak(host, [...(prefix || []), ...instruction(steps, i)]); } catch (e) { if (e !== STOP) throw e; return; }
      listening = false;
      trayEl.classList.remove('wait');
    };
    const deliver = async (item, fromRect, x, y) => {
      if (tk !== token || listening) return;
      const target = personAt(x, y);
      if (!target || target === host) return;
      const step = steps[i];
      if (item === step.item && target.dataset.who === step.w.who) {
        clearTimeout(idleTimer);
        clearHints();
        record(step.w.id, 'give', misses === 0);
        Sound.sfx.pop();
        await flyClone(PartyArt.ITEMS[item], fromRect, target, '');
        if (tk !== token) return;
        const h = document.createElement('div');
        h.className = 'hitem';
        put(h, PartyArt.ITEMS[item]);
        target.querySelector('.held').appendChild(h);
        restart(target, 'hop');
        i++;
        misses = 0;
        listening = true;
        target.classList.add('talking');
        await Sound.say([{ pause: 100 }, 'pty_thanks']);
        target.classList.remove('talking');
        if (tk !== token) return;
        listening = false;
        if (i >= steps.length) {
          await Sound.say([praise(), { pause: 300 }]);
          if (tk === token) finished();
        } else armIdle(() => sayInstr());
      } else {
        misses++;
        restart(target, 'wiggle');
        if (misses >= 2) { tray[step.item].classList.add('hint'); cast.get(step.w.who).classList.add('hint'); }
        await sayInstr(['pty_again', { pause: 150 }]);
        if (tk === token) armIdle(() => sayInstr());
      }
    };
    activeGive = {
      drop: (id, r, x, y) => deliver(id, r, x, y),
      tap: (id) => {
        if (listening) return;
        document.querySelectorAll('.titem.sel').forEach((e) => e.classList.remove('sel'));
        selected = id;
        tray[id].classList.add('sel');
        Sound.sfx.soft();
      }
    };
    // 撳咗托盤再撳人
    const onPerson = (e) => {
      if (!selected || tk !== token) return;
      const id = selected;
      selected = null;
      document.querySelectorAll('.titem.sel').forEach((el) => el.classList.remove('sel'));
      deliver(id, tray[id].getBoundingClientRect(), e.clientX, e.clientY);
    };
    peopleEl.addEventListener('pointerdown', onPerson);
    await sayInstr();
    armIdle(() => sayInstr());
    try { await guard(doneP); } finally { peopleEl.removeEventListener('pointerdown', onPerson); activeGive = null; }
  }

  // ---------- ③ 坐位分類（淨係睇字） ----------
  async function segSit(sorts) {
    screen.classList.add('seg-sit');
    for (const el of cast.values()) el.classList.add('gone');
    host.classList.add('gone');
    await sleep(600);
    for (const el of cast.values()) el.remove();
    cast = new Map();
    tablesEl.replaceChildren();
    const tables = {};
    for (const kind of ['adult', 'kid']) {
      const t = document.createElement('div');
      t.className = 'ptable ' + kind;
      t.dataset.kind = kind;
      put(t, `<div class="seats"></div><div class="tart">${PartyArt.table(kind)}</div><div class="tlabel">${kind === 'adult' ? '大人' : '小朋友'}</div>`);
      tablesEl.appendChild(t);
      tables[kind] = t;
    }
    await sleep(500);
    await speak(null, ['pty_sit', { pause: 200 }]);
    restart(tables.adult, 'hop');
    await say(['fam_adult', { pause: 300 }]);
    restart(tables.kid, 'hop');
    await say(['fam_kids', { pause: 400 }]);
    for (const w of sorts) await askSit(w, tables);
    screen.classList.remove('seg-sit');
  }

  function askSit(w, tables) {
    dbg.sit = w.group;
    return new Promise((resolve) => {
      const tk = token;
      cardsEl.replaceChildren();
      const card = document.createElement('div');
      card.className = 'wcard big sortcard';
      put(card, `<span class="face"></span><span class="txt"></span>`);
      card.querySelector('.txt').textContent = w.text;
      cardsEl.appendChild(card);
      let misses = 0, done = false;
      const answer = async (kind, fromRect) => {
        if (done || tk !== token) return;
        const t = tables[kind];
        if (kind === w.group) {
          done = true;
          clearTimeout(idleTimer);
          Object.values(tables).forEach((x) => x.classList.remove('hint'));
          record(w.id, 'sit', misses === 0);
          Sound.sfx.pop();
          await flyClone(card.outerHTML, fromRect || card.getBoundingClientRect(), t, 'card');
          if (tk !== token) return;
          cardsEl.replaceChildren();
          const seats = t.querySelector('.seats');
          let el = [...seats.children].find((x) => x.dataset.who === w.who);
          if (!el) {
            el = document.createElement('div');
            el.className = 'pp seated';
            el.dataset.who = w.who;
            put(el, PartyArt.person(w.who));
            el.style.setProperty('--tag', tagTop(w.who));
            el.style.setProperty('--h', 'calc(28 * var(--u))');
            seats.appendChild(el);
          }
          setTag(el, w.text);
          restart(el, 'hop');
          const extra = w.same ? [{ pause: 250 }, 'syn_' + w.id] : [];
          Sound.say([{ pause: 200 }, 'fam_' + w.id, { pause: 200 }, w.group === 'adult' ? 'pty_is_adult' : 'pty_is_kid', ...extra, { pause: 250 }, praise(), { pause: 300 }]).then(resolve);
        } else {
          misses++;
          restart(t, 'wiggle');
          // 錯一次：張卡出埋個樣做提示；錯兩次：啱嗰張枱發光
          if (misses === 1) { put(card.querySelector('.face'), PartyArt.face(w.who)); card.classList.add('reveal'); }
          if (misses >= 2) tables[w.group].classList.add('hint');
          if (!Sound.isBusy()) Sound.say(['pty_sit_q']);
        }
      };
      draggable(card, {
        markup: () => card.outerHTML,
        onDrop: (x, y, r) => { const t = Object.values(tables).find((el) => hits(el, x, y, 10)); if (t) answer(t.dataset.kind, r); },
        onTap: () => { if (!Sound.isBusy()) Sound.say(['pty_sit_q']); }
      });
      for (const t of Object.values(tables)) t.onpointerdown = (e) => { e.preventDefault(); answer(t.dataset.kind); };
      Sound.say(['pty_sit_q']);
      armIdle(() => Sound.say(['pty_sit_q']));
    });
  }

  // ---------- ④ 家人大合照 ----------
  const castOrder = () => {
    const seen = new Set();
    const list = [];
    tablesEl.querySelectorAll('.pp').forEach((el) => { if (!seen.has(el.dataset.who)) { seen.add(el.dataset.who); list.push(el.dataset.who); } });
    return list;
  };
  async function segPhoto() {
    screen.classList.add('seg-photo');
    const whos = castOrder();
    // 坐位入面嘅人 + 開門入嚟嘅人（如果冇喺坐位出現）
    for (const id of lastGuests) if (!whos.includes(id)) whos.push(id);
    tablesEl.classList.add('gone');
    await sleep(500);
    tablesEl.replaceChildren();
    tablesEl.classList.remove('gone');
    const all = shuffle(whos).slice(0, 8);
    all.splice(Math.floor(all.length / 2), 0, 'host');
    const n = all.length;
    all.forEach((who, i) => {
      const x = 8 + (84 * (i + 0.5)) / n;
      const el = who === 'host' ? (host.classList.remove('gone'), host) : makePerson(who, {});
      place(el, { x, y: 8, h: n > 7 ? 34 : 38, z: 5 });
      if (tagText.has(who)) setTag(el, tagText.get(who));
      el.classList.add('pop');
      setTimeout(() => el.classList.remove('pop'), 700);
    });
    titleEl.replaceChildren();
    const t = document.createElement('div');
    t.className = 'wcard';
    t.textContent = '家人';
    titleEl.appendChild(t);
    await sleep(700);
    await speak(host, ['pty_photo', { pause: 300 }]);
    photoEl.className = 'on';
    await sleep(600);
    await speak(host, ['pty_cheese']);
    Sound.sfx.click();
    photoEl.className = 'on shot';
    for (const el of peopleEl.querySelectorAll('.pp')) restart(el, 'hop');
    await sleep(900);
    await speak(host, ['pty_photo_ok', { pause: 400 }]);
    photoEl.className = '';
    titleEl.replaceChildren();
    screen.classList.remove('seg-photo');
  }

  // ---------- 小記者：撳咪講，錄低再播返 ----------
  let micStream = null, micCtx = null, micAn = null, micBuf = null;
  async function openMic() {
    if (micStream && micStream.active) return micStream;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) throw new Error('no mic');
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      micCtx = new AC();
      micAn = micCtx.createAnalyser();
      micAn.fftSize = 1024;
      micBuf = new Uint8Array(micAn.fftSize);
      micCtx.createMediaStreamSource(micStream).connect(micAn);
    } catch (e) { micAn = null; }
    return micStream;
  }
  function micLevel() {
    if (!micAn) return 0;
    micAn.getByteTimeDomainData(micBuf);
    let s = 0;
    for (let i = 0; i < micBuf.length; i++) { const v = (micBuf[i] - 128) / 128; s += v * v; }
    return Math.sqrt(s / micBuf.length);
  }
  function closeMic() {
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    if (micCtx) try { micCtx.close(); } catch (e) {}
    micStream = micCtx = micAn = null;
  }

  // 錄音存喺 tablet 本機（IndexedDB），最多 12 段，唔會上載
  const VoiceDB = {
    db: null,
    open() {
      if (this.db) return Promise.resolve(this.db);
      return new Promise((ok, bad) => {
        if (!window.indexedDB) return bad(new Error('no idb'));
        const r = indexedDB.open('luca-party', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('voice', { keyPath: 'id' });
        r.onsuccess = () => ok((this.db = r.result));
        r.onerror = () => bad(r.error);
      });
    },
    async tx(mode, fn) {
      const db = await this.open();
      return new Promise((ok, bad) => {
        const t = db.transaction('voice', mode);
        const out = fn(t.objectStore('voice'));
        t.oncomplete = () => ok(out && out.result);
        t.onerror = () => bad(t.error);
      });
    },
    add(rec) { return this.tx('readwrite', (s) => s.put(rec)); },
    list() { return this.tx('readonly', (s) => s.getAll()).then((a) => (a || []).sort((x, y) => y.id - x.id)); },
    del(id) { return this.tx('readwrite', (s) => s.delete(id)); },
    clear() { return this.tx('readwrite', (s) => s.clear()); },
    async trim(max) { const all = await this.list(); for (const r of all.slice(max)) await this.del(r.id); }
  };

  function playBlob(blob) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      let done = false;
      const fin = () => { if (done) return; done = true; URL.revokeObjectURL(url); resolve(); };
      a.onended = fin;
      a.onerror = fin;
      setTimeout(fin, 15000);
      a.play().catch(fin);
    });
  }

  // 等 Luca 撳個咪（最多 ms），撳咗 resolve true
  function waitMicTap(ms) {
    return new Promise((resolve) => {
      const tk = token;
      const timer = setTimeout(() => { micBtn.onclick = null; resolve(false); }, ms);
      micBtn.onclick = () => { if (tk !== token) return; clearTimeout(timer); micBtn.onclick = null; resolve(true); };
    });
  }

  function record10s() {
    return new Promise((resolve) => {
      const tk = token;
      let rec;
      try { rec = new MediaRecorder(micStream); } catch (e) { return resolve(null); }
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => { clearInterval(meter); micBtn.style.removeProperty('--lv'); resolve(chunks.length ? new Blob(chunks, { type: rec.mimeType || 'audio/webm' }) : null); };
      const t0 = Date.now();
      const stop = () => { if (rec.state !== 'inactive') rec.stop(); };
      const meter = setInterval(() => {
        if (tk !== token) return stop();
        micBtn.style.setProperty('--lv', Math.min(1, micLevel() * 6).toFixed(2));
        if (Date.now() - t0 > 10000) stop();
      }, 80);
      micBtn.onclick = () => { if (Date.now() - t0 > 800) { micBtn.onclick = null; stop(); } };
      rec.start();
    });
  }

  async function segMic() {
    const qi = load('partyQ.v1', 0) % QUESTIONS.length;
    store('partyQ.v1', qi + 1);
    const q = QUESTIONS[qi];
    screen.classList.add('seg-mic');
    place(host, { x: 50, y: 3, h: 50, z: 8 });
    for (const el of cast.values()) el.classList.add('back');
    await sleep(800);
    micBtn.className = 'on';
    await speak(host, ['q_' + q, { pause: 500 }, 'hint_' + q, { pause: 400 }, 'mic_tap']);
    micBtn.classList.add('pulse');
    let tapped = await guard(waitMicTap(20000));
    if (!tapped) {
      await speak(host, ['q_' + q, { pause: 300 }, 'mic_tap']);
      tapped = await guard(waitMicTap(20000));
    }
    micBtn.classList.remove('pulse');
    if (tapped) {
      let ok = true;
      try { await guard(openMic()); } catch (e) { if (e === STOP) throw e; ok = false; }
      if (ok) {
        micBtn.classList.add('rec');
        const blob = await guard(record10s());
        micBtn.classList.remove('rec');
        if (blob) {
          VoiceDB.add({ id: Date.now(), q, blob }).then(() => VoiceDB.trim(12)).catch(() => {});
          await speak(host, ['mic_listen', { pause: 200 }]);
          await guard(playBlob(blob));
        }
      } else {
        // 冇咪 / 唔畀用：講俾爸爸媽媽聽，講完撳一下
        await speak(host, ['mic_none']);
        micBtn.classList.add('pulse', 'done');
        await guard(waitMicTap(25000));
      }
      await speak(host, [{ pause: 200 }, 'mic_great', { pause: 300 }]);
    }
    micBtn.className = '';
    screen.classList.remove('seg-mic');
    for (const el of cast.values()) el.classList.remove('back');
  }

  // ---------- 結局（~20 秒，冇閃光） ----------
  function addFx(cls, markup) {
    const el = document.createElement('div');
    el.className = cls;
    if (markup) put(el, markup);
    fxEl.appendChild(el);
    return el;
  }
  function confetti(n) {
    const cols = ['#ff9a9a', '#ffc46b', '#fff07a', '#8fe0a0', '#8fbdf0', '#c7a3ff'];
    for (let i = 0; i < n; i++) {
      const c = addFx('confetti');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * 1.4 + 's';
      c.style.animationDuration = 2.4 + Math.random() * 1.6 + 's';
      setTimeout(() => c.remove(), 5000);
    }
  }
  function burstAt(el) {
    const p = center(el);
    const b = document.createElement('div');
    b.className = 'pburst';
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
  // 彩帶炮：由 from 射去 to
  function popper(fromEl, toEl, onHit) {
    Sound.sfx.zap();
    const a = center(fromEl), b = center(toEl);
    const s = document.createElement('div');
    s.className = 'pshot';
    s.style.left = a.x + 'px';
    s.style.top = a.y + 'px';
    document.body.appendChild(s);
    const done = () => { s.remove(); if (!toEl.isConnected) return; burstAt(toEl); if (onHit) onHit(); };
    if (!s.animate) return done();
    s.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) / 2 - 80}px)`, offset: .5 }, { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px)` }],
      { duration: 550, easing: 'ease-out' }).onfinish = done;
  }

  // 結局：大家企後面兩邊，中間留位畀蛋糕 / 小暴龍
  function lineupBack(skip) {
    const els = [...peopleEl.querySelectorAll('.pp')].filter((el) => el !== skip);
    const nl = Math.ceil(els.length / 2), nr = els.length - nl;
    els.forEach((el, i) => {
      const x = i < nl ? 5 + (30 * (i + 0.5)) / nl : 65 + (30 * (i - nl + 0.5)) / nr;
      place(el, { x, y: 22, h: 30, z: 4 });
    });
  }
  function ensureCast() {
    if (peopleEl.querySelector('.pp')) return;
    host = makePerson('host', {});
    for (const w of ['yeye', 'mama', 'baba', 'meimei']) makePerson(w, {});
    lineupBack();
  }

  function ending(id) {
    screen.classList.add('ending');
    if (id === 'balloon') return endBalloon();
    if (id === 'candle') return endCandle();
    return endMonster();
  }

  // 結局 1：怪獸偷蛋糕 → 彩帶炮 ×3 → 怪獸講對唔住，一齊食
  async function endMonster() {
    ensureCast();
    lineupBack();
    const cake = addFx('pcake', PartyArt.bigCake(4));
    cake.classList.add('lit');
    await sleep(900);
    const m = addFx('pmonster enter', `<div class="m-body">${HeroArt.monster()}</div>`);
    m.addEventListener('pointerdown', (e) => { e.preventDefault(); if (!m.classList.contains('friendly')) popper(host, m.querySelector('.m-body')); });
    const tk = token;
    [300, 800, 1300].forEach((t) => setTimeout(() => { if (tk === token) Sound.sfx.thump(); }, t));
    await sleep(1700);
    cake.classList.add('stolen');
    Sound.sfx.whoosh();
    await sayMin(null, ['pm_alarm', { pause: 200 }], 2600);
    restart(host, 'hop');
    await sayMin(host, ['pm_go', { pause: 100 }], 2000);
    for (let k = 0; k < 3; k++) {
      popper(host, m.querySelector('.m-body'), () => restart(m.querySelector('.m-body'), 'hit'));
      await sleep(950);
    }
    m.classList.add('friendly');
    cake.classList.remove('stolen');
    Sound.sfx.hatch();
    await sayMin(null, ['pm_sorry', { pause: 200 }], 2600);
    confetti(36);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.add('dance'));
    await sayMin(host, ['pm_win', { pause: 300 }], 2600);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.remove('dance'));
    fxEl.replaceChildren();
    screen.classList.remove('ending');
  }

  // 結局 2：氣球拉咗小暴龍上天 → Luca 撳爆氣球 → 慢慢降落
  async function endBalloon() {
    ensureCast();
    lineupBack(host);
    place(host, { x: 50, y: 6, h: 36, z: 9 });
    host.classList.add('flying');
    await sleep(800);
    const bunch = document.createElement('div');
    bunch.className = 'pballoons';
    const cols = ['#ff6b6b', '#8fbdf0', '#ffd36e'];
    const balloons = cols.map((c, i) => {
      const b = document.createElement('div');
      b.className = 'pbl b' + i;
      put(b, `<svg viewBox="-50 -60 100 190" aria-hidden="true">${PartyArt.balloon(0, 0, c, 1)}</svg>`);
      bunch.appendChild(b);
      return b;
    });
    host.appendChild(bunch);
    Sound.sfx.whoosh();
    await sleep(900);
    place(host, { y: 34, h: 30 });
    await sayMin(null, ['pb_alarm', { pause: 200 }], 2800);
    await sayMin(null, ['pb_go', { pause: 100 }], 1800);
    // 撳一個氣球就爆一個，跌落少少；冇撳都會自己爆（唔會卡住）
    let left = balloons.length;
    const popOne = (b) => {
      if (!b || b.classList.contains('gone')) return;
      b.classList.add('gone');
      Sound.sfx.pop();
      burstAt(b);
      left--;
      place(host, { y: 6 + left * 9.3, h: 30 + (3 - left) * 2 });
    };
    balloons.forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); popOne(b); }));
    for (let guard = 0; left > 0 && guard < 60; guard++) {
      await sleep(100);
      if (guard % 30 === 29) popOne(balloons.find((b) => !b.classList.contains('gone')));
    }
    await sleep(900);
    host.classList.remove('flying');
    bunch.remove();
    Sound.sfx.boing();
    restart(host, 'hop');
    confetti(30);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.add('dance'));
    await sayMin(host, ['pb_win', { pause: 300 }], 2800);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.remove('dance'));
    fxEl.replaceChildren();
    screen.classList.remove('ending');
  }

  // 結局 3：許願吹蠟燭（對住咪吹 / 撳蠟燭）→ 生日歌 + 彩紙
  async function endCandle() {
    ensureCast();
    lineupBack();
    const cake = addFx('pcake big', PartyArt.bigCake(4));
    cake.classList.add('lit');
    await sleep(1000);
    await sayMin(host, ['pc_wish', { pause: 200 }], 2400);
    await say(['pc_blow', { pause: 100 }]);
    const candles = [...cake.querySelectorAll('.candle')];
    let left = candles.length;
    const blowOne = (c) => {
      if (!c || c.classList.contains('out')) return;
      c.classList.add('out');
      Sound.sfx.soft();
      left--;
    };
    candles.forEach((c) => c.addEventListener('pointerdown', (e) => { e.preventDefault(); blowOne(c); }));
    // 之前開咗咪就聽吹氣聲（吹得大力 = 熄一枝）
    let loud = 0;
    for (let t = 0; left > 0 && t < 160; t++) {
      await sleep(100);
      if (micAn) {
        loud = micLevel() > 0.12 ? loud + 1 : 0;
        if (loud >= 3) { loud = 0; blowOne(candles.find((c) => !c.classList.contains('out'))); }
      }
      if (t === 70) cake.classList.add('hint');
      if (t >= 110 && t % 12 === 0) blowOne(candles.find((c) => !c.classList.contains('out')));
    }
    cake.classList.remove('hint');
    closeMic();
    await sleep(700);
    const songS = Sound.sfx.song();
    confetti(50);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.add('dance'));
    await sleep(Math.min(songS * 1000, 9000));
    await sayMin(host, ['pc_win', { pause: 300 }], 1800);
    peopleEl.querySelectorAll('.pp').forEach((el) => el.classList.remove('dance'));
    fxEl.replaceChildren();
    screen.classList.remove('ending');
  }

  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // ---------- 家長區 ----------
  function stop() {
    token++;
    clearTimeout(idleTimer);
    closeMic();
    micBtn.onclick = null;
    document.querySelectorAll('.pghost, .pshot, .pburst').forEach((e) => e.remove());
  }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'party') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'party' && !document.body.classList.contains('party-done')) start(); });

  function renderStats(tbody) {
    tbody.replaceChildren();
    for (const w of people) {
      const s = stats[w.id] || {};
      const tr = document.createElement('tr');
      for (const v of [w.text + (w.focus ? ' ★' : ''), (s.doorOk || 0) + ' / ' + (s.door || 0), (s.sitOk || 0) + ' / ' + (s.sit || 0), (s.giveOk || 0) + ' / ' + (s.give || 0)]) {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  function resetStats() { stats = {}; store(STORE_KEY, stats); }

  const Q_TEXT = { family: '屋企有咩人', play: '鍾意同邊個玩', name: '名 + 幾多歲', gift: '想要咩禮物（點解）' };
  async function renderVoices(box) {
    box.replaceChildren();
    let list = [];
    try { list = await VoiceDB.list(); } catch (e) {}
    if (!list.length) { box.textContent = '未有錄音（玩到大合照之後撳咪講嘢就會錄低）'; return; }
    for (const r of list) {
      const row = document.createElement('div');
      row.className = 'row';
      const b = document.createElement('button');
      b.textContent = '▶';
      b.addEventListener('click', () => { Sound.clear(); playBlob(r.blob); });
      const d = new Date(r.id);
      const label = document.createElement('span');
      label.textContent = ' ' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' · ' + (Q_TEXT[r.q] || r.q);
      row.append(b, label);
      box.appendChild(row);
    }
  }
  const clearVoices = () => VoiceDB.clear().catch(() => {});

  // 預覽 / 撳貼紙重播：淨係播短片（唔計貼紙）
  async function playVideo(id) {
    ++token;
    reset();
    document.body.dataset.screen = 'party';
    try {
      await sleep(300);
      await ending(id);
      await finish();
    } catch (e) { if (e !== STOP) console.error(e); }
  }

  return { start, stop, renderStats, resetStats, renderVoices, clearVoices, playVideo, _dbg: dbg };
})();
