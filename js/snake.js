/*
 * ABC 貪食蛇：學英文字母（全英文）
 * 流程：蛇仔出場 → 跟次序食 5 個字母（A→E，下次 F→J …）→ 食咗嘅字母變成身上嘅花紋
 *       → 一齊讀身上啲字母 → 結局短片 + 貼紙 → 拜拜
 * 操控：手指撳住 / 拖 = 蛇仔跟住手指行；放手就直行，撞牆會彈返
 * 唔會死：撞錯字母 = 字母彈開 + 讀返佢個名 + 再講要搵邊個；錯兩次（或者 12 秒冇食到）啱嗰個就閃
 */
const SnakeGame = (() => {
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const put = (el, markup) => el.replaceChildren(document.createRange().createContextualFragment(markup));
  const sayMin = (items, ms) => Promise.all([Sound.say(items), wait(ms)]);
  const hyp = Math.hypot;
  const GROUPS = ['ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'];
  const COLORS = ['#ff8a8a', '#ffb85c', '#ffd84d', '#8fd16a', '#5cc8e0', '#8fa8ff', '#c79bff', '#ff9fd0'];
  const colorOf = (ch) => COLORS[(ch.toUpperCase().charCodeAt(0) - 65) % COLORS.length];

  // ---------- 進度（localStorage） ----------
  // mode: upper = 大楷 ABC；lower = 細楷 abc；match = 上面大楷、要食細楷（Aa 配對）
  const STORE_KEY = 'snake.v1';
  let prog = loadProg();
  function loadProg() {
    try { return Object.assign({ group: 0, mode: 'upper', rounds: 0, miss: {} }, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }
    catch (e) { return { group: 0, mode: 'upper', rounds: 0, miss: {} }; }
  }
  function saveProg() { try { localStorage.setItem(STORE_KEY, JSON.stringify(prog)); } catch (e) {} }
  const fruitCase = (ch) => prog.mode === 'upper' ? ch : ch.toLowerCase();
  const stripCase = (ch) => prog.mode === 'lower' ? ch.toLowerCase() : ch;
  const key = (ch) => 'ltr_' + ch.toLowerCase();

  // ---------- DOM ----------
  const screen = $('#snake-screen'), cv = $('#snake-canvas'), strip = $('#snake-strip'), againBtn = $('#snake-again');
  const ctx = cv.getContext('2d');
  put(againBtn, Art.icons.again);
  let W = 0, H = 0, U = 0, dpr = 1, top = 0;
  let headR, segR, gap, fruitR, speed;
  function resize() {
    const r = screen.getBoundingClientRect();
    W = r.width; H = r.height; U = Math.min(W, H);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    headR = U * .06; segR = U * .05; gap = segR * 1.5; fruitR = U * .075; speed = U * .24;
    top = strip.getBoundingClientRect().bottom - r.top + 6;
  }
  addEventListener('resize', () => { if (document.body.dataset.screen === 'snake') resize(); });

  // ---------- 狀態 ----------
  let token = 0, raf = 0, last = 0, clock = 0;
  let snake = null;           // { x, y, a, trail:[{x,y}], segs:[{ch,col,pop,lit}], gold, mouth }
  let fruits = [];            // { ch, col, x, y, tx, ty, s, wob, hint, bumpAt }
  let letters = [], nextIdx = 0, misses = 0, lastProgress = 0, lastHint = 0;
  let finger = null, fingerDown = false;
  let autopilot = false;      // 開發測試用（#demo=snakeauto）：自動行去啱嗰個字母
  let mode = 'still';         // player | chase | still
  let carrot = null;          // chase 模式：個頭追住呢點
  let chaseSpeed = 0, chaseT = 0;   // chaseT 淨係喺個頭追到先行，咁條路線唔會走喺蛇仔前面
  let paint = null;           // 愛心結局：蛇仔畫出嚟嘅線
  let parts = [];             // canvas 粒子
  let onRoundDone = null;
  let fx = [];

  function newSnake(x, y, plain) {
    const s = { x, y, a: -Math.PI / 2, trail: [], segs: [], gold: false, mouth: 0 };
    for (let i = 0; i < plain; i++) s.segs.push({ ch: null, col: null, pop: 0, lit: 0 });
    for (let i = 40; i >= 1; i--) s.trail.push({ x, y: y + i * gap * .5 });
    return s;
  }
  // 由個頭向後行 d 咁遠，攞返條 trail 上面嗰點
  function along(d) {
    let px = snake.x, py = snake.y;
    for (let i = snake.trail.length - 1; i >= 0; i--) {
      const p = snake.trail[i];
      const l = hyp(px - p.x, py - p.y);
      if (l >= d) { const k = d / l; return { x: px + (p.x - px) * k, y: py + (p.y - py) * k }; }
      d -= l; px = p.x; py = p.y;
    }
    return { x: px, y: py };
  }
  function bodyLen() { return (snake.segs.length + 1.5) * gap; }

  // ---------- 字母生果 ----------
  function place(avoid) {
    const m = fruitR * 1.3;
    for (let tries = 0; tries < 300; tries++) {
      const relax = tries > 200 ? .6 : 1;
      const x = m + Math.random() * (W - 2 * m);
      const y = Math.max(top + fruitR, m) + Math.random() * (H - m - Math.max(top + fruitR, m));
      if (hyp(x - snake.x, y - snake.y) < fruitR * 3 * relax) continue;
      if (fruits.some((f) => f !== avoid && hyp(x - f.tx, y - f.ty) < fruitR * 2.6 * relax)) continue;
      return { x, y };
    }
    return { x: W / 2, y: (top + H) / 2 };
  }
  function spawnFruits() {
    fruits = [];
    letters.forEach((ch, i) => {
      const p = place();
      fruits.push({ ch, col: colorOf(ch), x: p.x, y: p.y, tx: p.x, ty: p.y, s: 0, born: clock + .15 * i, wob: 0, hint: false, bumpAt: -9 });
    });
  }
  const target = () => fruits.find((f) => f.ch === letters[nextIdx]);

  // ---------- 上面嗰條字母帶 ----------
  function renderStrip() {
    strip.replaceChildren();
    letters.forEach((ch, i) => {
      const t = document.createElement('div');
      t.className = 'tile' + (i < nextIdx ? ' done' : i === nextIdx ? ' now' : '');
      t.textContent = stripCase(ch);
      if (i < nextIdx) t.style.background = colorOf(ch);
      strip.appendChild(t);
    });
  }

  // ---------- 操控 ----------
  function toLocal(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  cv.addEventListener('pointerdown', (e) => { e.preventDefault(); fingerDown = true; finger = toLocal(e); try { cv.setPointerCapture(e.pointerId); } catch (err) {} });
  cv.addEventListener('pointermove', (e) => { if (fingerDown) finger = toLocal(e); });
  ['pointerup', 'pointercancel'].forEach((t) => cv.addEventListener(t, () => { fingerDown = false; }));

  function turnTo(desired, rate, dt) {
    let d = desired - snake.a;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const max = rate * dt;
    snake.a += Math.max(-max, Math.min(max, d));
  }

  function step(dt) {
    clock += dt;
    let v = speed;
    if (mode === 'player') {
      if (autopilot) { finger = target() || null; fingerDown = !!finger; }
      let goal = finger, rate = 4.5;
      const tf = target();
      // 磁石：行到好近啱嗰個字母，自動轉過去（細路仔手指唔夠準）
      if (tf && tf.s > .9 && hyp(tf.x - snake.x, tf.y - snake.y) < fruitR * 2.6) { goal = tf; rate = 7; }
      if (goal) {
        const d = hyp(goal.x - snake.x, goal.y - snake.y);
        if (d > headR * .7) turnTo(Math.atan2(goal.y - snake.y, goal.x - snake.x), rate, dt);
        else if (goal === finger && !fingerDown) finger = null;
      }
    } else if (mode === 'chase' && carrot) {
      const p = carrot(chaseT);
      const d = hyp(p.x - snake.x, p.y - snake.y);
      chaseT += d < headR * 1.5 ? dt : dt * .25;
      if (paint && !paint.done && d < headR * 1.5) paint.push(p);
      turnTo(Math.atan2(p.y - snake.y, p.x - snake.x), 11, dt);
      v = d > headR ? chaseSpeed * 1.35 : chaseSpeed;
    } else v = 0;

    if (v) {
      snake.x += Math.cos(snake.a) * v * dt;
      snake.y += Math.sin(snake.a) * v * dt;
      if (mode === 'player') {
        const m = headR;
        if (snake.x < m) { snake.x = m; snake.a = Math.PI - snake.a; }
        if (snake.x > W - m) { snake.x = W - m; snake.a = Math.PI - snake.a; }
        if (snake.y < m) { snake.y = m; snake.a = -snake.a; }
        if (snake.y > H - m) { snake.y = H - m; snake.a = -snake.a; }
      }
      const lp = snake.trail[snake.trail.length - 1];
      if (!lp || hyp(lp.x - snake.x, lp.y - snake.y) > 2) {
        snake.trail.push({ x: snake.x, y: snake.y });
        // 剪走太舊嘅 trail
        let total = 0, i = snake.trail.length - 1;
        for (; i > 0 && total < bodyLen() + gap * 2; i--) total += hyp(snake.trail[i].x - snake.trail[i - 1].x, snake.trail[i].y - snake.trail[i - 1].y);
        if (i > 0) snake.trail.splice(0, i);
      }
    }

    snake.mouth = Math.max(0, snake.mouth - dt * 2.5);
    for (const s of snake.segs) { s.pop = Math.max(0, s.pop - dt * 2); s.lit = Math.max(0, s.lit - dt * .8); }
    for (const f of fruits) {
      if (clock > f.born) f.s = Math.min(1, f.s + dt * 3);
      f.x += (f.tx - f.x) * Math.min(1, dt * 8);
      f.y += (f.ty - f.y) * Math.min(1, dt * 8);
      f.wob = Math.max(0, f.wob - dt * 1.5);
    }
    parts = parts.filter((p) => (p.life -= dt) > 0);
    for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g || 0) * dt; }

    if (mode === 'player') collide();
  }

  // ---------- 食字母 ----------
  function collide() {
    for (const f of fruits) {
      if (f.s < .9 || hyp(f.x - snake.x, f.y - snake.y) > fruitR + headR * .6) continue;
      if (f.ch === letters[nextIdx]) return eat(f);
      bump(f);
    }
  }
  function sparkle(x, y, col, n, kind) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = U * (.15 + Math.random() * .35);
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: .6 + Math.random() * .5, max: 1.1, col, kind: kind || 'dot', r: U * (.008 + Math.random() * .012) });
    }
  }
  function eat(f) {
    fruits.splice(fruits.indexOf(f), 1);
    snake.mouth = 1;
    snake.segs.splice(snake.segs.length - 1, 0, { ch: fruitCase(f.ch), col: f.col, pop: 1, lit: 0 });
    sparkle(f.x, f.y, f.col, 14);
    Sound.sfx.pop();
    nextIdx++;
    misses = 0;
    lastProgress = clock;
    renderStrip();
    Sound.clear();
    if (nextIdx >= letters.length) {
      Sound.say([key(f.ch)]);
      if (onRoundDone) onRoundDone();
      return;
    }
    const yum = Math.random() < .35 ? [{ pause: 200 }, 'snk_yum_' + (1 + Math.floor(Math.random() * 3))] : [];
    Sound.say([key(f.ch), ...yum, { pause: 350 }, 'snk_find', key(letters[nextIdx])]);
  }
  function bump(f) {
    if (clock - f.bumpAt < 1.2) return;
    f.bumpAt = clock;
    f.wob = 1;
    // 彈開：向住蛇頭嘅反方向
    const dx = f.x - snake.x, dy = f.y - snake.y, d = hyp(dx, dy) || 1;
    const m = fruitR * 1.2;
    f.tx = Math.max(m, Math.min(W - m, f.x + dx / d * fruitR * 2.2));
    f.ty = Math.max(top + fruitR, Math.min(H - m, f.y + dy / d * fruitR * 2.2));
    Sound.sfx.boing();
    const now = letters[nextIdx];
    prog.miss[now] = (prog.miss[now] || 0) + 1;
    saveProg();
    if (++misses >= 2) { const t = target(); if (t) t.hint = true; }
    Sound.clear();
    Sound.say([key(f.ch), { pause: 400 }, 'snk_find', key(now)]);
  }
  function idleHint() {
    if (mode !== 'player' || clock - lastProgress < 12 || clock - lastHint < 12) return;
    lastHint = clock;
    const t = target();
    if (t) t.hint = true;
    if (!Sound.isBusy()) Sound.say(['snk_find', key(letters[nextIdx])]);
  }

  // ---------- 畫 ----------
  function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  function letter(ch, x, y, size, col) {
    ctx.font = `700 ${size}px Andika, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = col || '#3b3247';
    ctx.fillText(ch, x, y + size * .04);
  }
  function drawFruit(f) {
    const pulse = f.hint ? 1 + .1 * Math.sin(clock * 8) : 1;
    const r = fruitR * f.s * pulse * (1 + .15 * Math.sin(f.wob * 20) * f.wob);
    if (r < 1) return;
    const x = f.x + Math.sin(f.wob * 25) * f.wob * fruitR * .25, y = f.y;
    if (f.hint) circle(x, y, r * 1.35, `rgba(255,246,176,${.55 + .3 * Math.sin(clock * 8)})`);
    circle(x, y + r * .08, r * 1.08, 'rgba(0,0,0,.08)');
    circle(x, y, r * 1.1, '#fff');
    circle(x, y, r * .97, f.col);
    ctx.beginPath(); ctx.ellipse(x + r * .25, y - r * 1.05, r * .3, r * .14, -.5, 0, Math.PI * 2); ctx.fillStyle = '#4fa83a'; ctx.fill();
    circle(x - r * .4, y - r * .42, r * .16, 'rgba(255,255,255,.6)');
    letter(fruitCase(f.ch), x, y, r * 1.25);
  }
  function drawSnake() {
    const col = snake.gold ? SnakeArt.GOLD : SnakeArt.GREEN, dark = snake.gold ? SnakeArt.GOLD_D : SnakeArt.DARK;
    const pts = snake.segs.map((s, i) => Object.assign(along(gap * (i + 1)), { s, r: segR * (1 + s.pop * .35) * (1 - .25 * (i === snake.segs.length - 1)) }));
    const tail = along(gap * (snake.segs.length + .8));
    // 外框 → 填色 → 字母（由尾到頭畫，頭喺最上面）
    circle(tail.x, tail.y, segR * .55 + segR * .16, dark);
    for (let i = pts.length - 1; i >= 0; i--) circle(pts[i].x, pts[i].y, pts[i].r + segR * .16, dark);
    circle(tail.x, tail.y, segR * .55, col);
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      if (p.s.lit > 0) circle(p.x, p.y, p.r * (1.3 + .3 * p.s.lit), `rgba(255,246,176,${p.s.lit})`);
      circle(p.x, p.y, p.r, p.s.col || col);
      if (!p.s.ch && i % 2) circle(p.x, p.y, p.r * .35, dark);
      if (p.s.ch) letter(p.s.ch, p.x, p.y, p.r * 1.3);
    }
    // 頭
    const r = headR;
    ctx.save();
    ctx.translate(snake.x, snake.y);
    ctx.rotate(snake.a);
    if (snake.gold) {
      ctx.fillStyle = '#ff8a5c';
      for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-r * .4, sgn * r * .6); ctx.lineTo(-r * 1.3, sgn * r * 1.25); ctx.lineTo(-r * .05, sgn * r * .95); ctx.fill(); }
    }
    // 伸脷（間唔中）
    if (Math.sin(clock * 3) > .7 && !snake.mouth) {
      ctx.strokeStyle = '#ff5c7a'; ctx.lineWidth = r * .12; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(r * .9, 0); ctx.lineTo(r * 1.45, 0); ctx.lineTo(r * 1.65, -r * .18); ctx.moveTo(r * 1.45, 0); ctx.lineTo(r * 1.65, r * .18); ctx.stroke();
    }
    circle(0, 0, r * 1.14, dark);
    circle(0, 0, r, col);
    if (snake.mouth > 0) { ctx.beginPath(); ctx.ellipse(r * .62, 0, r * .3 * snake.mouth + 1, r * .45 * snake.mouth + 1, 0, 0, Math.PI * 2); ctx.fillStyle = '#b0506a'; ctx.fill(); }
    for (const sgn of [-1, 1]) {
      circle(r * .2, sgn * r * .45, r * .3, '#fff');
      circle(r * .32, sgn * r * .45, r * .16, '#3b3247');
      circle(r * .36, sgn * r * .5, r * .06, '#fff');
      circle(-r * .15, sgn * r * .74, r * .14, 'rgba(255,143,168,.7)');
    }
    ctx.restore();
  }
  function star(x, y, r, col) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  function heartPath(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + r * .9);
    ctx.bezierCurveTo(x - r * 1.3, y + r * .1, x - r * 1.1, y - r * 1.1, x, y - r * .45);
    ctx.bezierCurveTo(x + r * 1.1, y - r * 1.1, x + r * 1.3, y + r * .1, x, y + r * .9);
  }
  let paintFill = 0, bigStar = null;
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (paint && paint.length > 1) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (paintFill > 0) {
        ctx.beginPath(); paint.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
        ctx.fillStyle = `rgba(255,143,168,${.45 * paintFill})`; ctx.fill();
      }
      ctx.beginPath(); paint.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.strokeStyle = '#ff7a9c'; ctx.lineWidth = U * .025; ctx.stroke();
    }
    if (bigStar) { circle(bigStar.x, bigStar.y, U * .09 * (1 + .1 * Math.sin(clock * 6)), 'rgba(255,246,176,.6)'); star(bigStar.x, bigStar.y, U * .07, '#ffd34d'); }
    fruits.forEach(drawFruit);
    if (snake) drawSnake();
    for (const p of parts) {
      ctx.globalAlpha = Math.min(1, p.life / (p.max * .5));
      if (p.kind === 'star') star(p.x, p.y, p.r * 2, p.col);
      else if (p.kind === 'heart') { heartPath(p.x, p.y, p.r * 2); ctx.fillStyle = p.col; ctx.fill(); }
      else circle(p.x, p.y, p.r, p.col);
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    const dt = Math.min(.05, (t - (last || t)) / 1000);
    last = t;
    step(dt);
    idleHint();
    draw();
    raf = requestAnimationFrame(frame);
  }
  function startLoop() { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); }

  // ---------- 一局 ----------
  function reset() {
    document.body.dataset.screen = 'snake';
    document.body.classList.remove('snake-done');
    cleanupFx();
    resize();
    letters = GROUPS[prog.group % GROUPS.length].split('');
    nextIdx = 0; misses = 0; clock = 0; lastProgress = 0; lastHint = 0;
    finger = null; fingerDown = false; paint = null; paintFill = 0; bigStar = null; parts = [];
    snake = newSnake(W * .5, H * .78, 2);
    renderStrip();
    resize();
  }

  function start(auto) {
    autopilot = !!auto;
    const tk = ++token;
    reset();
    spawnFruits();
    mode = 'player';
    startLoop();
    run(tk);
  }

  async function run(tk) {
    Sound.clear();
    Sound.say(['snk_hi', { pause: 300 }, 'snk_intro', { pause: 300 }, 'snk_find', key(letters[0])]);
    await new Promise((res) => { onRoundDone = res; });
    onRoundDone = null;
    if (tk !== token) return;
    // 完成：下次由下一組開始
    prog.group = (prog.group + 1) % GROUPS.length;
    prog.rounds++;
    saveProg();
    finger = null;
    Sound.sfx.hatch();
    await wait(900);
    if (tk !== token) return;
    await readBody(tk);
    if (tk !== token) return;
    const end = Rewards.next('snake');
    await ending(tk, end);
    if (tk !== token) return;
    await Rewards.celebrate('snake', end, 'en');
    if (tk !== token) return;
    finale(tk);
  }

  // 繞個圈，逐粒字母發光讀出嚟
  function circleAround(cx, cy) {
    const R = Math.max(U * .18, bodyLen() * 1.25 / (2 * Math.PI));
    chaseSpeed = speed;
    const a0 = Math.atan2(snake.y - cy, snake.x - cx), t0 = chaseT;
    mode = 'chase';
    carrot = (t) => { const a = a0 + (t - t0) * speed / R + .6; return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R }; };
  }
  async function readBody(tk) {
    circleAround(W / 2, (top + H) / 2);
    await sayMin(['snk_sing', { pause: 300 }], 1800);
    if (tk !== token) return;
    const items = [];
    snake.segs.forEach((s) => { if (s.ch) items.push({ fn: () => { s.lit = 1; s.pop = 1; Sound.sfx.soft(); } }, key(s.ch), { pause: 350 }); });
    await Sound.say(items);
    if (tk !== token) return;
    snake.segs.forEach((s) => { s.lit = 1; });
    await sayMin(['snk_done', { pause: 300 }], 2400);
  }

  // ---------- 結局（~15–20 秒） ----------
  function ending(tk, id) {
    if (id === 'dragon') return endDragon(tk);
    if (id === 'monster') return endMonster(tk);
    return endHeart(tk);
  }
  // 沿住一串點行（按距離），loop = 繞圈
  function pathOf(pts, v, loop) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + hyp(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const total = cum[cum.length - 1], t0 = chaseT;
    const fn = (t) => {
      let d = (t - t0) * v;
      fn.done = !loop && d >= total;
      d = loop ? d % total : Math.min(d, total);
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      const k = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k };
    };
    return fn;
  }

  // 結局 1：蛇仔畫一個大心心 → 填滿粉紅色 → 心心飛晒出嚟
  async function endHeart(tk) {
    const cx = W / 2, cy = (top + H) / 2, s = Math.min(W * .4, (H - top) * .42) / 17;
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = Math.PI * 2 * i / 120;
      pts.push({ x: cx + s * 16 * Math.pow(Math.sin(t), 3), y: cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - s * 2 });
    }
    // 先去心心頂
    mode = 'chase'; chaseSpeed = speed * 1.4;
    carrot = () => pts[0];
    Sound.say(['snk_heart_1']);
    for (let i = 0; i < 40 && hyp(snake.x - pts[0].x, snake.y - pts[0].y) > headR; i++) { await wait(100); if (tk !== token) return; }
    paint = [];
    chaseSpeed = speed * 1.6;
    carrot = pathOf(pts, chaseSpeed, false);
    for (let i = 0; i < 150 && !carrot.done; i++) { await wait(100); if (tk !== token) return; }
    paint.done = true;
    await wait(500);
    if (tk !== token) return;
    // 填色 + 心心
    for (let i = 0; i <= 10; i++) { paintFill = i / 10; await wait(40); }
    Sound.sfx.hatch();
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2, sp = U * (.2 + Math.random() * .4);
        parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - U * .2, g: U * .3, life: 1.6, max: 1.6, col: ['#ff7a9c', '#ffb3c7', '#ff5c7a'][i % 3], kind: 'heart', r: U * (.012 + Math.random() * .01) });
      }
      await wait(350);
    }
    circleAround(cx, cy);
    await sayMin(['snk_heart_2', { pause: 300 }], 3000);
  }

  // 結局 2：食咗粒魔法星 → 變金色飛龍 → 喺天空飛 8 字，一路留低星星
  async function endDragon(tk) {
    bigStar = { x: W / 2, y: top + (H - top) * .3 };
    Sound.sfx.beam();
    await sayMin(['snk_drg_1', { pause: 200 }], 1800);
    if (tk !== token) return;
    mode = 'chase'; chaseSpeed = speed * 1.4;
    carrot = () => bigStar;
    for (let i = 0; i < 50 && hyp(snake.x - bigStar.x, snake.y - bigStar.y) > headR * 1.2; i++) { await wait(100); if (tk !== token) return; }
    sparkle(bigStar.x, bigStar.y, '#ffd34d', 24, 'star');
    bigStar = null;
    snake.mouth = 1;
    snake.gold = true;
    Sound.sfx.hatch();
    restart($('#scene'), 'shake');
    const pts = [];
    const cx = W / 2, cy = (top + H) / 2;
    const a0 = Math.PI / 2;
    for (let i = 0; i <= 160; i++) { const t = a0 + Math.PI * 2 * i / 160; pts.push({ x: cx + W * .38 * Math.cos(t), y: cy + (H - top) * .3 * Math.sin(2 * t) }); }
    chaseSpeed = speed * 2;
    carrot = pathOf(pts, chaseSpeed, true);
    Sound.say([{ pause: 300 }, 'snk_drg_2']);
    const trail = setInterval(() => {
      if (tk !== token) return clearInterval(trail);
      const t = along(bodyLen());
      parts.push({ x: t.x, y: t.y, vx: (Math.random() - .5) * U * .1, vy: U * .05, life: 1.2, max: 1.2, col: ['#ffd34d', '#ff9fd0', '#8fd3ff'][Math.floor(Math.random() * 3)], kind: 'star', r: U * .01 });
    }, 90);
    await wait(9000);
    clearInterval(trail);
    if (tk !== token) return;
    circleAround(cx, cy);
    await sayMin(['snk_drg_3', { pause: 300 }], 2600);
  }

  // 結局 3：紫色怪獸想偷字母 → 蛇仔射字母炮 ×3 → 怪獸變乖走咗
  let monsterEl = null;
  function center(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function burstAt(p) {
    const b = document.createElement('div');
    b.className = 'burst';
    b.style.left = p.x + 'px'; b.style.top = p.y + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }
  let shotN = 0;
  function letterShot(onHit) {
    if (!monsterEl) return;
    const body = monsterEl.querySelector('.m-body');
    const lit = snake.segs.filter((s) => s.ch);
    const s = lit[shotN++ % lit.length];
    s.pop = 1; s.lit = 1;
    snake.mouth = 1;
    const r = cv.getBoundingClientRect();
    const from = { x: r.left + snake.x, y: r.top + snake.y };
    const to = center(body);
    const el = document.createElement('div');
    el.className = 'letter-shot';
    el.textContent = s.ch;
    el.style.background = s.col;
    el.style.left = from.x + 'px'; el.style.top = from.y + 'px';
    document.body.appendChild(el);
    Sound.sfx.zap();
    Sound.say([key(s.ch)]);
    const done = () => {
      el.remove();
      if (!body.isConnected) return;
      burstAt(to);
      restart(body, 'hit');
      Sound.sfx.thump();
      if (onHit) onHit();
    };
    if (!el.animate) return done();
    el.animate([
      { transform: 'scale(.5) rotate(0)' },
      { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1.2) rotate(360deg)` }
    ], { duration: 650, easing: 'ease-in' }).onfinish = done;
  }
  async function endMonster(tk) {
    monsterEl = document.createElement('div');
    monsterEl.id = 'monster';
    const body = document.createElement('div');
    body.className = 'm-body';
    put(body, HeroArt.monster());
    monsterEl.appendChild(body);
    screen.appendChild(monsterEl);
    body.style.setProperty('--s', 1);
    monsterEl.addEventListener('pointerdown', (e) => { e.preventDefault(); if (tk === token && !monsterEl.classList.contains('friendly')) letterShot(); });
    circleAround(W * .3, (top + H) / 2);
    monsterEl.classList.add('enter');
    [300, 900, 1500].forEach((t) => setTimeout(() => { if (tk === token) { Sound.sfx.thump(); restart($('#scene'), 'shake'); } }, t));
    await wait(1900);
    if (tk !== token) return;
    await sayMin(['snk_mon_1', { pause: 200 }], 2600);
    if (tk !== token) return;
    await sayMin(['snk_mon_2', { pause: 100 }], 1800);
    if (tk !== token) return;
    for (const sz of [.85, .7, .55]) {
      letterShot(() => body.style.setProperty('--s', sz));
      await wait(1300);
      if (tk !== token) return;
    }
    await wait(300);
    monsterEl.classList.add('friendly');
    await sayMin(['rbat_sorry', { pause: 200 }], 2600);
    if (tk !== token) return;
    monsterEl.classList.add('leave');
    await wait(1600);
    if (tk !== token) return;
    monsterEl.remove();
    monsterEl = null;
    Sound.sfx.hatch();
    sparkle(snake.x, snake.y, '#ffd34d', 20, 'star');
    await sayMin(['snk_mon_3', { pause: 300 }], 2400);
  }

  function restart(el, cls) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
  function cleanupFx() {
    if (monsterEl) monsterEl.remove();
    monsterEl = null;
    fx.forEach((e) => e.remove()); fx = [];
    document.querySelectorAll('.letter-shot').forEach((e) => e.remove());
  }

  async function finale(tk) {
    circleAround(W / 2, (top + H) / 2);
    document.body.classList.add('snake-done');
    await sayMin(['rex_bye'], 1000);
  }
  againBtn.addEventListener('click', () => { if (window.App) App.goHome(); });

  // 撳貼紙 / 家長區預覽：直接播結局（唔計貼紙）
  async function playVideo(id) {
    const tk = ++token;
    reset();
    fruits = [];
    letters.forEach((ch) => snake.segs.splice(snake.segs.length - 1, 0, { ch: fruitCase(ch), col: colorOf(ch), pop: 0, lit: 0 }));
    nextIdx = letters.length;
    renderStrip();
    circleAround(W / 2, (top + H) / 2);
    startLoop();
    await wait(1200);
    if (tk !== token) return;
    await ending(tk, Rewards.ENDINGS.snake.includes(id) ? id : 'heart');
    if (tk !== token) return;
    finale(tk);
  }

  function stop() { token++; onRoundDone = null; cancelAnimationFrame(raf); mode = 'still'; cleanupFx(); }
  addEventListener('panel-open', () => { if (document.body.dataset.screen === 'snake') stop(); });
  addEventListener('panel-close', (e) => { if (e.detail === 'snake' && !document.body.classList.contains('snake-done')) start(); });

  // ---------- 家長區 ----------
  const MODES = { upper: '大楷 ABC', lower: '細楷 abc', match: '大細楷配對 Aa' };
  function renderPanel(groupSel, modeSel, info) {
    groupSel.replaceChildren();
    GROUPS.forEach((g, i) => { const o = document.createElement('option'); o.value = i; o.textContent = g[0] + '–' + g[g.length - 1]; groupSel.appendChild(o); });
    groupSel.value = prog.group;
    modeSel.replaceChildren();
    for (const [k, v] of Object.entries(MODES)) { const o = document.createElement('option'); o.value = k; o.textContent = v; modeSel.appendChild(o); }
    modeSel.value = prog.mode;
    const miss = Object.entries(prog.miss).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 8);
    info.textContent = '玩咗 ' + prog.rounds + ' 局' + (miss.length ? '　· 撞錯最多（要搵嗰陣撞咗其他字母）：' + miss.map(([c, n]) => c + '×' + n).join(' ') : '');
  }
  function setGroup(i) { prog.group = +i; saveProg(); }
  function setMode(m) { if (MODES[m]) { prog.mode = m; saveProg(); } }
  function resetStats() { prog = { group: 0, mode: prog.mode, rounds: 0, miss: {} }; saveProg(); }

  return { start, stop, playVideo, renderPanel, setGroup, setMode, resetStats };
})();
