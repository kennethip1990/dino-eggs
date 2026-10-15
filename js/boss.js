/*
 * 秘密短片：機械人英雄 + Super Rex 大戰怪獸大王（~30 秒）
 * 英雄 + Super Rex 6 張貼紙集齊先解鎖（見 rewards.js）
 */
const BossGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);

  const scr = $('#boss-screen'), robot = $('#boss-robot'), rex = $('#boss-rex'), mon = $('#boss-monster'), again = $('#boss-again');
  put($('#boss-city'), HeroArt.city());
  put(robot, HeroArt.robot());
  put(rex, RexArt.rex());
  const body = mon.querySelector('.m-body');
  put(body, EndArt.boss());
  put(again, Art.icons.again);

  let token = 0;
  let shotNo = 0;

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

  // 輪流：英雄愛心炮 / Super Rex 吼聲
  function shot(onHit) {
    const heart = shotNo++ % 2 === 0;
    const fromEl = heart ? robot.querySelector('.part[data-part="heart"]') : rex.querySelector('.rex-head');
    if (heart) { Sound.sfx.zap(); restart(robot, 'ready'); }
    else { Sound.sfx.roar(); restart(rex, 'roaring'); }
    const from = center(fromEl), to = center(body);
    const el = document.createElement('div');
    el.className = heart ? 'shot' : 'roar-wave';
    put(el, heart ? HeroArt.heartShot() : RexArt.roarWave());
    el.style.left = from.x + 'px';
    el.style.top = from.y + 'px';
    document.body.appendChild(el);
    const ang = heart ? 0 : Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    const done = () => { el.remove(); burstAt(to); restart(body, 'hit'); if (onHit) onHit(); };
    if (!el.animate) return done();
    el.animate([
      { transform: `rotate(${ang}deg) scale(.5)` },
      { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) rotate(${ang}deg) scale(1.2)` }
    ], { duration: 550, easing: 'ease-out' }).onfinish = done;
  }

  function confetti() {
    const cols = ['#ffd36e', '#ff8fa8', '#7ff0ff', '#a6e3a0', '#c7a3ff', '#f6a05a'];
    for (let i = 0; i < 36; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * 1.5 + 's';
      c.style.animationDuration = 2.5 + Math.random() * 2 + 's';
      scr.appendChild(c);
    }
  }

  function reset() {
    document.body.dataset.screen = 'boss';
    document.body.classList.remove('boss-done');
    scr.classList.remove('party');
    robot.className = ''; rex.className = ''; mon.className = '';
    body.style.setProperty('--s', 1);
    scr.querySelectorAll('.confetti').forEach((e) => e.remove());
    document.querySelectorAll('.shot, .roar-wave, .burst').forEach((e) => e.remove());
    shotNo = 0;
  }

  async function play() {
    const tk = ++token;
    Sound.clear();
    reset();
    // 1. 兩個英雄一齊入場
    robot.classList.add('in');
    rex.classList.add('in');
    Sound.sfx.whoosh();
    await wait(1100);
    if (tk !== token) return;
    // 2. 怪獸大王大步行入嚟
    mon.classList.add('enter');
    [300, 900, 1500, 2100].forEach((t) => setTimeout(() => { if (tk === token) { Sound.sfx.thump(); restart($('#scene'), 'shake'); } }, t));
    await wait(2500);
    if (tk !== token) return;
    await sayMin(['boss_alarm', { pause: 200 }], 2400);
    if (tk !== token) return;
    // 3. 一齊出動
    restart(robot, 'ready');
    restart(rex, 'ready');
    Sound.sfx.whoosh();
    await sayMin(['boss_team', { pause: 200 }], 2800);
    if (tk !== token) return;
    // 4. 愛心炮 + 大吼，輪流 ×4
    for (const sz of [0.86, 0.74, 0.62, 0.5]) {
      shot(() => body.style.setProperty('--s', sz));
      await wait(1000);
      if (tk !== token) return;
    }
    // 5. 怪獸大王變乖
    await wait(300);
    mon.classList.add('friendly');
    await sayMin(['boss_sorry', { pause: 200 }], 2800);
    if (tk !== token) return;
    // 6. 一齊跳舞
    scr.classList.add('party');
    confetti();
    Sound.sfx.hatch();
    await sayMin(['boss_win', { pause: 300 }, 'boss_win_en', { pause: 300 }], 4000);
    if (tk !== token) return;
    document.body.classList.add('boss-done');
  }

  mon.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (document.body.dataset.screen === 'boss' && mon.classList.contains('enter') && !mon.classList.contains('friendly')) shot();
  });
  again.addEventListener('click', () => { if (window.App) App.goHome(); });

  function stop() {
    token++;
    scr.querySelectorAll('.confetti').forEach((e) => e.remove());
    document.querySelectorAll('.shot, .roar-wave').forEach((e) => e.remove());
  }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'boss') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'boss' && !document.body.classList.contains('boss-done')) play(); });

  return { play, stop };
})();
