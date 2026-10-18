/*
 * 結局 + 貼紙簿
 * - 每個 game 3 個結局：頭 3 次跟次序（保證全部睇到），之後隨機（唔會連續同一個）
 * - 睇完一個新結局就攞一張貼紙；主選單每張卡下面有 3 格，撳已攞到嘅貼紙 = 再睇嗰段短片
 * - 英雄 + Super Rex 6 張集齊 → 解鎖秘密短片（怪獸大王）
 */
const Rewards = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const ENDINGS = { dino: ['rainbow', 'gold', 'star'], hero: ['monster', 'cloud', 'ufo'], rex: ['monster', 'tornado', 'meteor'], snake: ['heart', 'dragon', 'monster'] };
  const NAMES = {
    dino: { rainbow: '彩虹恐龍BB', gold: '金色恐龍BB', star: '星星恐龍BB' },
    hero: { monster: '紫色怪獸', cloud: '黑雲怪', ufo: '搗蛋外星人' },
    rex: { monster: '紫色怪獸', tornado: '龍捲風', meteor: '大隕石' },
    snake: { heart: '愛心蛇', dragon: '金色飛龍', monster: '字母炮打怪獸' }
  };

  const KEY = 'rewards.v1';
  const fresh = () => ({ plays: { dino: 0, hero: 0, rex: 0, snake: 0 }, seen: { dino: [], hero: [], rex: [], snake: [] }, last: {}, unlockShown: false });
  let st = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s || !s.seen) return fresh();
      const f = fresh();
      // 舊版冇新 game 嘅格 → 補返
      return Object.assign(f, s, { plays: Object.assign(f.plays, s.plays), seen: Object.assign(f.seen, s.seen) });
    }
    catch (e) { return fresh(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  function next(game) {
    const list = ENDINGS[game];
    const n = st.plays[game] || 0;
    if (n < list.length) return list[n];
    const pool = list.filter((x) => x !== st.last[game]);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const bossReady = () => st.seen.hero.length >= 3 && st.seen.rex.length >= 3;

  function award(game, id) {
    st.plays[game] = (st.plays[game] || 0) + 1;
    st.last[game] = id;
    const isNew = !st.seen[game].includes(id);
    if (isNew) st.seen[game].push(id);
    let unlocked = false;
    if (bossReady() && !st.unlockShown) { st.unlockShown = true; unlocked = true; }
    save();
    renderMenu();
    return { isNew, unlocked };
  }

  // ---------- 攞貼紙動畫 ----------
  const pop = $('#sticker-pop');
  async function celebrate(game, id, lang) {
    const r = award(game, id);
    if (!r.isNew) return;
    put(pop.querySelector('.sp-art'), EndArt.sticker(game, id));
    pop.hidden = false;
    pop.classList.remove('on');
    void pop.offsetWidth;
    pop.classList.add('on');
    Sound.sfx.hatch();
    const v = lang === 'en' ? ['sticker_en'] : lang === 'yue' ? ['sticker_yue'] : ['sticker_yue', { pause: 300 }, 'sticker_en'];
    if (r.unlocked) v.push({ pause: 400 }, ...(lang === 'en' ? ['unlock_en'] : ['unlock_yue']));
    await Promise.all([Sound.say(v), wait(2600)]);
    pop.classList.remove('on');
    await wait(400);
    pop.hidden = true;
  }
  function hidePop() { pop.hidden = true; pop.classList.remove('on'); }

  // ---------- 主選單貼紙簿 ----------
  let onPlay = null;      // (game, id) => 播短片；由 game.js 設定
  function renderMenu() {
    for (const game of Object.keys(ENDINGS)) {
      const row = document.querySelector(`.stickers[data-game="${game}"]`);
      if (!row) continue;
      row.replaceChildren();
      for (const id of ENDINGS[game]) {
        const got = st.seen[game].includes(id);
        const b = document.createElement('button');
        b.className = 'stk' + (got ? ' got' : '');
        b.setAttribute('aria-label', got ? NAMES[game][id] : '未攞到');
        put(b, got ? EndArt.sticker(game, id) : EndArt.lockedSticker());
        b.addEventListener('click', () => {
          if (got && onPlay) onPlay(game, id);
          else { b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle'); }
        });
        row.appendChild(b);
      }
    }
    const boss = $('#go-boss');
    if (boss) boss.classList.toggle('locked', !bossReady());
  }

  function reset() { st = fresh(); save(); renderMenu(); }
  function summary() {
    return Object.keys(ENDINGS).map((g) => ({ game: g, seen: st.seen[g].length, plays: st.plays[g] || 0 }));
  }

  return {
    ENDINGS, NAMES, next, celebrate, hidePop, bossReady, renderMenu, reset, summary,
    setOnPlay(fn) { onPlay = fn; }
  };
})();
