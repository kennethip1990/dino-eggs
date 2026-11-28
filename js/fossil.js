/*
 * 赤洲化石獵人（3D，three.js）
 * 見龍在田展覽（香港文物探知館 2026-11）跟進：香港第一隻恐龍 = 赤洲蜥腳類，得 4 舊骨（股骨 / 髂骨 / 恥骨 / 尾椎）。
 * 流程：化石點嚟（故事）→ 喺島上掘 4 舊骨 → 放返入骨架（第一下就啱 = 一粒星，只加唔扣）→ 恐龍活返、撳個島叫佢行。
 * 所有 model 用 code 砌（原創），冇外來 3D 檔。操控：固定鏡頭 + 撳，冇搖桿。
 * 測試：fossil.html?fast = 唔等語音。
 */
import * as THREE from '../vendor/three.module.min.js';

const $ = (s) => document.querySelector(s);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const FAST = new URLSearchParams(location.search).has('fast');
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const outBack = (k) => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);

// ---------- 4 舊骨 ----------
const BONES = {
  femur: { name: '大髀骨', sub: '股骨 Femur',           slot: V3(-1.55, 1.9, 0.9),  pos: V3(-1.5, 2.25, 0.85) },
  tail:  { name: '尾巴骨', sub: '尾椎 Tail vertebra',   slot: V3(-2.9, 3.25, 0.3),  pos: V3(-2.79, 3.2, 0) },
  ilium: { name: '腰骨',   sub: '髂骨 Ilium',           slot: V3(-1.5, 4.0, 0.7),   pos: V3(-1.5, 3.85, 0.6) },
  pubis: { name: '盆骨',   sub: '恥骨 Pubis',           slot: V3(-0.4, 2.45, 0.5),  pos: V3(-0.55, 2.5, 0.45) }
};
const ORDER = ['femur', 'tail', 'ilium', 'pubis'];
const SPOTS = { femur: V3(-10, 0, 7), tail: V3(9, 0, 9), ilium: V3(11, 0, -5), pubis: V3(-7, 0, -8) };

function boneSvg(t) {
  const o = 'fill="#f3ead2" stroke="#8a6a4a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const body = {
    femur: `<path ${o} d="M40 14a10 10 0 0 1 18 4c6-2 12 6 6 12-4 4-9 2-10 1l-4 44c5 0 9 6 6 11s-9 4-12 1c-3 4-10 4-12-1s1-10 6-11l3-44c-6 1-11-5-8-11 1-3 4-6 7-6z"/>`,
    tail:  `<path ${o} d="M30 44h40a6 6 0 0 1 0 22H30a6 6 0 0 1 0-22z"/><path ${o} d="M44 44 36 12h12l10 32zM46 66l-2 24h10l2-24z"/>`,
    ilium: `<path ${o} d="M10 46c4-22 26-30 46-28s34 12 34 26-12 16-22 16l-6 20H44l-4-20c-12 2-32 0-30-14z"/>`,
    pubis: `<path ${o} d="M24 14c8-6 18 0 16 9l28 42c8-2 14 6 10 13s-14 7-18 0L32 36c-9 2-16-4-14-12 1-4 3-8 6-10z"/>`
  }[t];
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

// ---------- 記錄 ----------
const KEY = 'fossil-v1';
function loadStats() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || { plays: 0, done: 0, first: {}, tries: {} }; } catch (e) { return { plays: 0, done: 0, first: {}, tries: {} }; } }
function saveStats() { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch (e) {} }
const stats = loadStats();

// ---------- 語音 ----------
const cap = $('#fs-cap');
function caption(items) {
  const keys = items.filter((i) => typeof i === 'string');
  const k = keys[keys.length - 1];
  const c = k && self.VOICES.clips[k];
  cap.textContent = c && c.lang === 'yue' ? c.text : '';
}
function say(items) {
  caption(items);
  const p = Sound.say(items);
  return FAST ? Promise.race([p, wait(150)]) : p;
}
const sayMin = (items, ms) => Promise.all([say(items), wait(FAST ? 60 : ms)]);
let idleTimer = 0;
function armIdle(fn, ms) { clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!Sound.isBusy()) fn(); armIdle(fn, ms); }, ms || 12000); }
function disarmIdle() { clearTimeout(idleTimer); }

// ---------- three.js 基本 ----------
const canvas = $('#fs-canvas');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  $('#fs-fail').hidden = false; $('#fs-start').hidden = true;
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 500);
scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8468, 2.1));
const sun = new THREE.DirectionalLight(0xfff1d0, 2.2);
sun.position.set(18, 40, 22);
scene.add(sun);

const lam = (color, extra) => new THREE.MeshLambertMaterial(Object.assign({ color, flatShading: true }, extra || {}));
const UNIT_SPHERE = new THREE.SphereGeometry(1, 14, 10);

// ---------- 鏡頭：望住 look，由 dir 方向睇，自動拉遠到睇得晒 hSpan × vSpan ----------
const cam = { pos: V3(0, 30, 50), look: V3(0, 1, 0), view: null };
function viewPos(v) {
  const half = Math.tan((camera.fov * Math.PI) / 360);
  const d = Math.max(v.v / 2 / half, v.h / 2 / (half * camera.aspect));
  return v.look.clone().add(v.dir.clone().normalize().multiplyScalar(d));
}
const VIEW = {
  wide:  () => ({ look: V3(0, 1, 0), dir: V3(0, 0.6, 0.8), h: 56, v: 34 }),
  story: (p) => ({ look: V3(p.x, 3, p.z), dir: V3(0.25, 0.4, 0.9), h: 30, v: 16 }),
  dig:   (p) => ({ look: V3(p.x, 0.8, p.z), dir: V3(0.2, 0.75, 0.65), h: 11, v: 9 }),
  skel:  () => ({ look: V3(-0.6, 3.9, 0), dir: V3(0, 0.1, 1), h: 18, v: 11 }),
  hip:   () => ({ look: V3(-1.5, 3.0, 0), dir: V3(0, 0.04, 1), h: 7.8, v: 7.8 }),
  alive: () => ({ look: V3(0.5, 3.6, 2), dir: V3(0.4, 0.3, 0.9), h: 22, v: 13 }),
  walk:  () => ({ look: V3(0, 2, 0), dir: V3(0, 0.62, 0.78), h: 48, v: 30 })
};
function camTo(v, ms) {
  cam.view = v;
  const p0 = cam.pos.clone(), l0 = cam.look.clone(), p1 = viewPos(v), l1 = v.look.clone();
  return tween(ms == null ? 1400 : ms, (k) => { cam.pos.lerpVectors(p0, p1, k); cam.look.lerpVectors(l0, l1, k); });
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (cam.view && !tweens.size) { cam.pos.copy(viewPos(cam.view)); cam.look.copy(cam.view.look); }
}

// ---------- tween ----------
const tweens = new Set();
let epoch = 0;
function tween(ms, fn, ez) {
  if (FAST) ms = Math.min(ms, 120);
  return new Promise((res) => { tweens.add({ t: 0, ms, fn, ez: ez || ease, res, epoch }); });
}
function stepTweens(dt) {
  for (const t of [...tweens]) {
    if (t.epoch !== epoch) { tweens.delete(t); t.res(); continue; }
    t.t += dt * 1000;
    const k = Math.min(1, t.t / t.ms);
    t.fn(t.ez(k));
    if (k >= 1) { tweens.delete(t); t.res(); }
  }
}

// ---------- 赤洲島 ----------
const rim = (a) => 1 + 0.045 * Math.sin(a * 3 + 0.6) + 0.03 * Math.sin(a * 7 + 1.9) + 0.02 * Math.sin(a * 11);
function warp(geo, power) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
    if (r < 0.01) continue;
    const s = 1 + (rim(Math.atan2(z, x)) - 1) * power;
    p.setX(i, x * s); p.setZ(i, z * s);
  }
  geo.computeVertexNormals();
  return geo;
}
const world = new THREE.Group();
scene.add(world);
{
  const cliff = new THREE.Mesh(warp(new THREE.CylinderGeometry(22, 25.5, 5.4, 30, 2, true), 1), lam(0xb5533c));
  cliff.position.y = -2.7;
  const top = new THREE.Mesh(warp(new THREE.CircleGeometry(22.05, 30).rotateX(-Math.PI / 2), 1), lam(0x86bd62));
  const beach = new THREE.Mesh(warp(new THREE.CylinderGeometry(25.5, 29, 0.8, 30, 1), 1), lam(0xe6c9a0));
  beach.position.y = -5.2;
  world.add(cliff, top, beach);
  for (const [x, z, sx, sy, sz] of [[-14, -11, 6, 2.2, 5], [13, -13, 5, 1.8, 4], [-17, 3, 3, 1.2, 4]]) {
    const hill = new THREE.Mesh(UNIT_SPHERE, lam(0x6fa850));
    hill.position.set(x, -0.2, z); hill.scale.set(sx, sy, sz);
    world.add(hill);
  }
  for (const [x, z, r] of [[-60, -70, 9], [75, -50, 12], [48, -95, 7]]) {
    const islet = new THREE.Mesh(new THREE.ConeGeometry(r, r * 0.9, 7), lam(0x7fae6a));
    islet.position.set(x, -5 + r * 0.3, z);
    world.add(islet);
  }
}
const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x3f97d3 }));
sea.position.y = -4.9;
scene.add(sea);
const river = new THREE.Mesh(new THREE.PlaneGeometry(47, 3.4).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x58b4ee }));
river.position.set(0, 0.04, 8.5);
world.add(river);
const flood = new THREE.Mesh(new THREE.CircleGeometry(27, 30).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x58b4ee, transparent: true, opacity: 0.72, depthWrite: false }));
flood.position.y = -0.6; flood.visible = false;
world.add(flood);

const trees = [];
for (const [x, z, s] of [[-16, -4, 1.2], [-12, -15, 1], [4, -16, 1.3], [16, -9, 1], [17, 4, 1.2], [-3, 16, 0.9], [-17, 10, 1], [2, -9, 0.8]]) {
  const t = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.6, 6), lam(0x8a5a3a));
  trunk.position.y = 0.8;
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.6, 7), lam(0x3f8f4a));
  leaf.position.y = 2.7;
  const leaf2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 7), lam(0x4fa35a));
  leaf2.position.y = 3.8;
  t.add(trunk, leaf, leaf2);
  t.position.set(x, 0, z); t.userData.s = s; t.scale.setScalar(0.001);
  world.add(t); trees.push(t);
}

// ---------- 骨（4 舊目標骨：骨架 + 掘出嚟都用同一個形狀） ----------
const boneMat = lam(0xf3ead2);
const ghostMat = new THREE.MeshBasicMaterial({ color: 0x2c3c63, transparent: true, opacity: 0.42, depthWrite: false });
const slotMat = new THREE.MeshBasicMaterial({ color: 0x35b5ff, transparent: true, opacity: 0.55, depthWrite: false });
function part(geo, x, y, z, sx, sy, sz, rz) {
  const m = new THREE.Mesh(geo, boneMat);
  m.position.set(x || 0, y || 0, z || 0);
  if (sx != null) m.scale.set(sx, sy, sz);
  if (rz) m.rotation.z = rz;
  return m;
}
const CYL = new THREE.CylinderGeometry(1, 1, 1, 8);
const BOX = new THREE.BoxGeometry(1, 1, 1);
function makeBone(type) {
  const g = new THREE.Group();
  if (type === 'femur') {
    g.add(part(CYL, 0, 0, 0, 0.2, 1.6, 0.2), part(UNIT_SPHERE, -0.12, 0.85, 0, 0.3, 0.3, 0.3), part(UNIT_SPHERE, 0.18, 0.75, 0, 0.2, 0.2, 0.2),
      part(UNIT_SPHERE, -0.15, -0.82, 0, 0.25, 0.25, 0.25), part(UNIT_SPHERE, 0.15, -0.82, 0, 0.25, 0.25, 0.25));
  } else if (type === 'tail') {
    g.add(part(CYL, 0, 0, 0, 0.3, 0.55, 0.3, Math.PI / 2), part(BOX, -0.08, 0.55, 0, 0.16, 0.8, 0.12, 0.25), part(BOX, -0.05, -0.5, 0, 0.12, 0.55, 0.1, -0.2),
      part(BOX, 0, 0.12, 0, 0.2, 0.12, 0.9));
  } else if (type === 'ilium') {
    g.add(part(UNIT_SPHERE, 0, 0, 0, 1.05, 0.5, 0.13), part(BOX, 0.1, -0.5, 0, 0.3, 0.5, 0.14));
  } else {
    g.add(part(CYL, 0, 0, 0, 0.14, 1.7, 0.14, 0.82), part(UNIT_SPHERE, 0.62, -0.58, 0, 0.26, 0.26, 0.26), part(UNIT_SPHERE, -0.6, 0.56, 0, 0.22, 0.22, 0.22));
  }
  return g;
}
const setMat = (obj, mat) => obj.traverse((o) => { if (o.isMesh) o.material = mat; });

// ---------- 恐龍（蜥腳類）：脊骨曲線，骨架同有肉版共用 ----------
const tailPt = (t, sway) => V3(-2.2 - 6.3 * t, 3.3 - 2.3 * Math.pow(t, 1.4), (sway || 0) * t * t);
const backPt = (t) => V3(-1.9 + 3.9 * t, 3.4 + 0.3 * Math.sin(Math.PI * t) - 0.1 * t, 0);
const neckPt = (t, sway, lift) => V3(2.0 + (4.3 - (lift || 0) * 0.9) * t, 3.35 + (4.2 + (lift || 0)) * Math.pow(t, 1.1), (sway || 0) * t * t);

function makeDino() {
  const g = new THREE.Group();
  const tilt = new THREE.Group();
  g.add(tilt);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false }));
  shadow.scale.set(6.5, 1, 2.6); shadow.position.set(-0.5, 0.05, 0);
  g.add(shadow);

  // ---- 有肉版 ----
  const flesh = new THREE.Group();
  tilt.add(flesh);
  const skin = lam(0x9c9484, { flatShading: false }), dark = lam(0x6f665b, { flatShading: false }), belly = lam(0xc9c1ae, { flatShading: false });
  const parts = []; // { m, base:Vector3 scale, x }
  const add = (m, sx, sy, sz, order) => { m.userData.base = V3(sx, sy, sz); m.userData.order = order; parts.push(m); flesh.add(m); return m; };
  const body = add(new THREE.Mesh(UNIT_SPHERE, skin), 2.55, 1.55, 1.45, 0); body.position.set(0.05, 3.25, 0);
  const tum = add(new THREE.Mesh(UNIT_SPHERE, belly), 2.2, 1.2, 1.3, 0); tum.position.set(0.1, 2.85, 0);
  const hipB = add(new THREE.Mesh(UNIT_SPHERE, skin), 1.35, 1.3, 1.35, -1.5); hipB.position.set(-1.5, 3.2, 0);
  const shB = add(new THREE.Mesh(UNIT_SPHERE, skin), 1.3, 1.25, 1.3, 1.7); shB.position.set(1.7, 3.2, 0);
  for (let i = 0; i < 3; i++) { const s = add(new THREE.Mesh(UNIT_SPHERE, dark), 0.22, 1.3, 1.36, -0.9 + i * 0.9); s.position.set(-0.9 + i * 0.9, 3.55, 0); }
  const NT = 14, NN = 13;
  const tail = [], neck = [];
  for (let i = 0; i < NT; i++) { const t = (i + 0.5) / NT, r = 1.0 * (1 - t) + 0.12; tail.push(add(new THREE.Mesh(UNIT_SPHERE, i % 3 === 1 ? dark : skin), r * 1.25, r, r, -2.2 - 6.3 * t)); tail[i].userData.t = t; }
  for (let i = 0; i < NN; i++) { const t = (i + 0.5) / NN, r = 0.8 * (1 - t) + 0.4; neck.push(add(new THREE.Mesh(UNIT_SPHERE, i % 3 === 1 ? dark : skin), r * 1.1, r, r * 0.95, 2 + 4.3 * t)); neck[i].userData.t = t; }
  const head = new THREE.Group();
  head.add(part(UNIT_SPHERE, 0, 0, 0, 0.78, 0.5, 0.5), part(UNIT_SPHERE, 0.5, -0.1, 0, 0.5, 0.36, 0.42));
  setMat(head, skin);
  for (const s of [1, -1]) {
    const eye = new THREE.Mesh(UNIT_SPHERE, new THREE.MeshBasicMaterial({ color: 0xffffff })); eye.scale.setScalar(0.16); eye.position.set(0.18, 0.2, 0.4 * s);
    const pup = new THREE.Mesh(UNIT_SPHERE, new THREE.MeshBasicMaterial({ color: 0x222222 })); pup.scale.setScalar(0.09); pup.position.set(0.24, 0.21, 0.5 * s);
    head.add(eye, pup);
  }
  add(head, 1, 1, 1, 7);
  const legs = [];
  for (const [x, z, front] of [[-1.5, 0.95, 0], [-1.5, -0.95, 0], [1.75, 0.9, 1], [1.75, -0.9, 1]]) {
    const leg = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(front ? 0.44 : 0.52, 1.75, 4, 10), skin);
    m.position.y = -1.3;
    const toe = new THREE.Mesh(UNIT_SPHERE, dark); toe.scale.set(0.55, 0.22, 0.5); toe.position.set(0.12, -2.55, 0);
    leg.add(m, toe);
    leg.position.set(x, 2.72, z);
    add(leg, 1, 1, 1, x);
    legs.push(leg);
  }

  // ---- 骨架版 ----
  const skel = new THREE.Group();
  tilt.add(skel);
  const rest = []; // 非目標骨：{ m, x }
  const sk = (m) => { rest.push(m); skel.add(m); return m; };
  for (let i = 0; i < 16; i++) {
    if (i === 1) continue; // 第一節大尾椎 = 目標骨
    const p = tailPt((i + 0.5) / 16), s = 0.42 * (1 - i / 18);
    sk(part(BOX, p.x, p.y, 0, 0.3, s, s));
    if (i < 9) sk(part(BOX, p.x - 0.05, p.y + s * 0.9, 0, 0.1, s * 1.1, 0.08, 0.3));
  }
  for (let i = 0; i < 9; i++) {
    const p = backPt((i + 0.5) / 9);
    sk(part(BOX, p.x, p.y, 0, 0.32, 0.4, 0.4));
    sk(part(BOX, p.x, p.y + 0.42, 0, 0.12, 0.5, 0.08));
    if (i >= 2) {
      const R = 1.02 - Math.abs(i - 5) * 0.05;
      const rib = new THREE.Mesh(new THREE.TorusGeometry(R, 0.055, 5, 14, Math.PI * 1.5).rotateZ(-Math.PI / 4).rotateY(Math.PI / 2), boneMat);
      rib.position.set(p.x, p.y - R, 0);
      sk(rib);
    }
  }
  for (let i = 0; i < 12; i++) {
    const p = neckPt((i + 0.5) / 12), s = 0.34 * (1 - i / 30);
    const v = sk(part(BOX, p.x, p.y, 0, 0.3, s, s, 0.75));
    v.userData.x = p.x;
  }
  const hp = neckPt(1);
  sk(part(BOX, hp.x + 0.45, hp.y + 0.1, 0, 0.95, 0.42, 0.42, 0.1));
  sk(part(BOX, hp.x + 0.5, hp.y - 0.22, 0, 0.8, 0.1, 0.34, 0.05));
  for (const z of [0.85, -0.85]) {
    if (z < 0) { // 左邊（遠嗰邊）嗰套髖骨照砌，右邊嗰套係目標
      const f = makeBone('femur'); f.position.set(-1.5, 2.25, z); sk(f);
      const il = makeBone('ilium'); il.position.set(-1.5, 3.85, -0.6); sk(il);
      const pu = makeBone('pubis'); pu.position.set(-0.55, 2.5, -0.45); sk(pu);
    }
    sk(part(CYL, -1.5, 0.85, z, 0.15, 1.1, 0.15));
    sk(part(BOX, -1.4, 0.15, z, 0.6, 0.25, 0.45));
    sk(part(BOX, 1.75, 3.0, z * 0.95, 0.5, 1.0, 0.1, 0.3));
    sk(part(CYL, 1.75, 2.05, z, 0.17, 1.3, 0.17));
    sk(part(CYL, 1.75, 0.85, z, 0.13, 1.1, 0.13));
    sk(part(BOX, 1.85, 0.15, z, 0.55, 0.25, 0.42));
  }
  const targets = {};
  for (const id of ORDER) { const b = makeBone(id); b.position.copy(BONES[id].pos); skel.add(b); targets[id] = b; }
  skel.visible = false;

  const st = { walk: 0, moving: false, lift: 0, grow: 1, lie: 0 };
  function update(dt, time) {
    if (st.moving) st.walk += dt * 5;
    const sw = Math.sin(time * 0.9) * 0.7, ts = Math.sin(time * 1.3 + 1) * 1.6;
    for (const m of tail) m.position.copy(tailPt(m.userData.t, ts));
    for (const m of neck) m.position.copy(neckPt(m.userData.t, sw, st.lift));
    head.position.copy(neckPt(1, sw, st.lift)).add(V3(0.45, 0.1, 0));
    head.rotation.z = st.lift * 0.25;
    const a = st.moving ? Math.sin(st.walk) * 0.38 : 0;
    legs[0].rotation.z = a; legs[1].rotation.z = -a; legs[2].rotation.z = -a; legs[3].rotation.z = a;
    flesh.position.y = st.moving ? Math.abs(Math.sin(st.walk)) * 0.12 : 0;
    // 生肉：由尾到頭逐舊「卜」出嚟
    for (const m of parts) {
      const k = clamp((st.grow * 1.35 - (m.userData.order + 8.5) / 15.5 * 0.35) / 1, 0, 1);
      const s = st.grow >= 1 ? 1 : clamp(k * 3, 0, 1);
      m.scale.copy(m.userData.base).multiplyScalar(Math.max(0.0001, s));
    }
    tilt.rotation.x = st.lie * 1.38;
    tilt.position.y = st.lie * 0.9;
    shadow.visible = st.lie < 0.5 && (flesh.visible || skel.visible);
  }
  return { g, flesh, skel, rest, targets, st, update };
}
const dino = makeDino();
scene.add(dino.g);
dino.g.visible = false;

// ---------- 掘骨位：沙地 + 石頭堆 + 埋喺下面嘅骨 ----------
const digs = {};
const rockMat = lam(0x9a5f4c), rockMat2 = lam(0x7f4a3c);
for (const id of ORDER) {
  const p = SPOTS[id];
  const g = new THREE.Group();
  g.position.copy(p);
  const sand = new THREE.Mesh(new THREE.CircleGeometry(3.1, 12).rotateX(-Math.PI / 2), lam(0xd9a273));
  sand.position.y = 0.03;
  g.add(sand);
  const rocks = [];
  for (const [x, y, z, s] of [[0, 1.5, 0, 1.05], [-1.1, 0.6, 0.6, 1.0], [1.1, 0.6, 0.5, 0.95], [0.1, 0.55, -1.0, 1.0], [0, 0.6, 1.3, 0.85]]) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), rocks.length % 2 ? rockMat2 : rockMat);
    r.position.set(x, y, z); r.scale.setScalar(s); r.rotation.set(x * 2, y * 3, z);
    r.userData.home = r.position.clone(); r.userData.s = s;
    g.add(r); rocks.push(r);
  }
  const bone = makeBone(id);
  bone.scale.setScalar(1.5); bone.position.set(0, 0.25, 0); bone.rotation.x = -Math.PI / 2 + 0.2;
  bone.visible = false;
  g.add(bone);
  world.add(g);
  digs[id] = { id, g, rocks, bone, left: rocks.length, done: false };
}
function setRocks(k) { for (const id of ORDER) for (const r of digs[id].rocks) r.scale.setScalar(Math.max(0.001, r.userData.s * k)); }

// 巴士（比大細）
const bus = new THREE.Group();
{
  const b = new THREE.Mesh(BOX, lam(0xd8402f)); b.scale.set(4.6, 2.5, 1.5); b.position.y = 1.55;
  const band = new THREE.Mesh(BOX, lam(0xffd75e)); band.scale.set(4.62, 0.3, 1.52); band.position.y = 1.45;
  bus.add(b, band);
  for (const y of [0.95, 2.15]) { const w = new THREE.Mesh(BOX, lam(0x2f4a66)); w.scale.set(4.0, 0.55, 1.54); w.position.set(-0.1, y, 0); bus.add(w); }
  for (const x of [-1.5, 1.5]) for (const z of [0.7, -0.7]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.25, 12).rotateX(Math.PI / 2), lam(0x222222)); w.position.set(x, 0.4, z); bus.add(w); }
  bus.position.set(1.5, 0, 6.2); bus.scale.setScalar(0.001); bus.visible = false;
  scene.add(bus);
}

// ---------- HTML 掣：跟 3D 位置 ----------
const marks = [];
const tmp = new THREE.Vector3();
function addMark(cls, text, getPos, onTap) {
  const el = document.createElement('button');
  el.className = 'fs-mark ' + cls;
  el.innerHTML = `<span>${text}</span>`;
  el.hidden = true;
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); onTap(m); });
  $('#fs-marks').appendChild(el);
  const m = { el, getPos };
  marks.push(m);
  return m;
}
function placeMarks() {
  const w = window.innerWidth, h = window.innerHeight;
  for (const m of marks) {
    if (m.el.hidden) continue;
    tmp.copy(m.getPos()).project(camera);
    m.el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
  }
}

// ---------- HUD ----------
const tray = $('#fs-tray');
const slots = {};
for (const id of ORDER) { const d = document.createElement('div'); d.className = 'fs-slot'; d.innerHTML = boneSvg(id); tray.appendChild(d); slots[id] = d; }
let stars = 0;
function drawStars() {
  const html = ORDER.map((_, i) => `<span class="${i < stars ? 'on' : ''}">⭐</span>`).join('');
  $('#fs-stars').innerHTML = html; $('#fs-end-stars').innerHTML = html;
}
drawStars();
function showCard(id) { $('#fs-card-art').innerHTML = boneSvg(id); $('#fs-card-name').textContent = BONES[id].name; $('#fs-card-sub').textContent = BONES[id].sub; $('#fs-card').hidden = false; }

// ---------- 撳畫面（掘石 / 叫恐龍行） ----------
let onTap = null;
canvas.addEventListener('pointerdown', (e) => { if (onTap) onTap(e); });
const ray = new THREE.Raycaster();
function groundPoint(e) {
  ray.setFromCamera(new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), camera);
  const o = ray.ray.origin, d = ray.ray.direction;
  if (d.y >= -0.01) return null;
  const t = -o.y / d.y;
  return V3(o.x + d.x * t, 0, o.z + d.z * t);
}

// ---------- 故事：化石點嚟 ----------
let skipped = false;
let skipNow = null;
const skipP = new Promise((r) => { skipNow = r; });
const orSkip = (p) => Promise.race([p, skipP]);
function setDigReady() {
  river.visible = false; flood.visible = false;
  document.body.classList.remove('night');
  dino.g.visible = false; dino.g.position.set(0, 0, 0); dino.g.rotation.y = 0;
  Object.assign(dino.st, { lie: 0, moving: false, grow: 1, lift: 0 });
  for (const t of trees) t.scale.setScalar(t.userData.s);
  setRocks(1);
  for (const id of ORDER) { const d = digs[id]; d.bone.visible = false; d.bone.position.set(0, 0.25, 0); d.bone.rotation.set(-Math.PI / 2 + 0.2, 0, 0); d.bone.scale.setScalar(1.5); }
  cam.view = VIEW.wide(); cam.pos.copy(viewPos(cam.view)); cam.look.copy(cam.view.look);
}
async function story() {
  const my = epoch;
  const alive = () => my === epoch && !skipped;
  setRocks(0);
  for (const t of trees) t.scale.setScalar(0.001);
  river.visible = true;
  dino.g.visible = true; dino.flesh.visible = true; dino.skel.visible = false;
  dino.g.position.set(-11, 0, 3);
  dino.st.moving = true;
  cam.view = VIEW.story(V3(-4, 0, 3)); cam.pos.copy(viewPos(cam.view)); cam.look.copy(cam.view.look);
  // 1. 好耐以前有隻大恐龍
  await orSkip(Promise.all([sayMin(['fs_story1', { pause: 200 }], 3800), tween(4200, (k) => { dino.g.position.x = -11 + 10 * k; }, (k) => k)]));
  if (!alive()) return;
  dino.st.moving = false;
  // 2. 老咗，喺河邊瞓低
  await orSkip(Promise.all([sayMin(['fs_story2', { pause: 200 }], 2600), tween(1800, (k) => { dino.st.lie = k; })]));
  if (!alive()) return;
  // 3. 大水沖散啲骨
  flood.visible = true; river.visible = false;
  Sound.sfx.whoosh();
  camTo(VIEW.wide(), 2600);
  const start = dino.g.position.clone();
  const p3 = sayMin(['fs_story3', { pause: 200 }], 4200);
  await orSkip(tween(1500, (k) => { flood.position.y = -0.6 + 2.4 * k; }));
  if (!alive()) return;
  dino.g.visible = false;
  for (const id of ORDER) { const d = digs[id]; d.bone.visible = true; d.bone.scale.setScalar(3); } // 遠鏡，骨要大啲先見到
  await orSkip(tween(2600, (k) => {
    for (const id of ORDER) {
      const d = digs[id], from = start.clone().sub(SPOTS[id]);
      d.bone.position.set(from.x * (1 - k), 1.5 + Math.sin(k * 9 + from.x) * 0.25, from.z * (1 - k));
      d.bone.rotation.y = k * 5;
    }
  }));
  await orSkip(p3);
  if (!alive()) return;
  // 4. 沙泥冚住
  const p4 = sayMin(['fs_story4', { pause: 200 }], 3200);
  await orSkip(tween(1600, (k) => { flood.position.y = 1.8 - 2.6 * k; for (const id of ORDER) { digs[id].bone.position.y = 1.5 - 1.25 * k; digs[id].bone.rotation.set((-Math.PI / 2 + 0.2) * k, 5 * (1 - k), 0); digs[id].bone.scale.setScalar(3 - 1.5 * k); } }));
  if (!alive()) return;
  flood.visible = false;
  Sound.sfx.thump();
  await orSkip(tween(1400, (k) => setRocks(k), outBack));
  await orSkip(p4);
  if (!alive()) return;
  for (const id of ORDER) digs[id].bone.visible = false;
  // 5. 過咗好耐好耐 → 變化石
  const p5 = sayMin(['fs_story5', { pause: 300 }], 4200);
  for (let i = 0; i < 4 && alive(); i++) { document.body.classList.add('night'); await orSkip(wait(FAST ? 20 : 420)); document.body.classList.remove('night'); await orSkip(wait(FAST ? 20 : 420)); }
  if (!alive()) return;
  Sound.sfx.hatch();
  await orSkip(tween(1300, (k) => { for (const t of trees) t.scale.setScalar(Math.max(0.001, t.userData.s * k)); }, outBack));
  await orSkip(p5);
}

// ---------- 掘骨 ----------
function digPhase() {
  return new Promise((resolve) => {
    let busy = false, found = 0;
    const ms = {};
    const prompt = () => say(['fs_find']);
    const showMarks = (on) => { for (const id of ORDER) ms[id].el.hidden = !on || digs[id].done; };
    for (const id of ORDER) {
      ms[id] = addMark('dig', '✨', () => tmp.copy(SPOTS[id]).setY(2.2).clone(), async () => {
        if (busy) return;
        busy = true; disarmIdle(); showMarks(false);
        Sound.sfx.pop(); Sound.clear();
        const d = digs[id];
        await camTo(VIEW.dig(SPOTS[id]), 1300);
        say(['fs_dig']);
        d.bone.visible = true;
        armIdle(() => say(['fs_dig']), 9000);
        await new Promise((dugOut) => {
          onTap = () => {
            if (!d.left) return;
            const r = d.rocks[d.rocks.length - d.left];
            d.left--;
            Sound.sfx.thump();
            const dir = V3(r.userData.home.x || 0.4, 0, r.userData.home.z || 0.6).normalize();
            const s = r.userData.s;
            tween(520, (k) => { r.position.set(r.userData.home.x + dir.x * 6 * k, r.userData.home.y + Math.sin(k * Math.PI) * 3, r.userData.home.z + dir.z * 6 * k); r.rotation.x += 0.2; r.scale.setScalar(Math.max(0.001, s * (1 - k))); }, (k) => k);
            if (!d.left) { onTap = null; dugOut(); }
          };
        });
        disarmIdle(); Sound.clear();
        Sound.sfx.hatch();
        await tween(900, (k) => { d.bone.position.y = 0.25 + 2.4 * k; d.bone.rotation.set((-Math.PI / 2 + 0.2) * (1 - k), k * Math.PI * 2, 0); d.bone.scale.setScalar(1.5 + 0.4 * k); }, outBack);
        showCard(id);
        slots[id].classList.add('got');
        await sayMin(['fs_got', { pause: 150 }, 'fs_b_' + id, { pause: 400 }], 1800);
        $('#fs-card').hidden = true;
        tween(400, (k) => { d.bone.scale.setScalar(Math.max(0.001, 1.9 * (1 - k))); }).then(() => { d.bone.visible = false; });
        d.done = true; found++;
        await camTo(VIEW.wide(), 1100);
        if (found === ORDER.length) { for (const id2 of ORDER) ms[id2].el.remove(); resolve(); return; }
        busy = false; showMarks(true);
        armIdle(prompt);
      });
    }
    showMarks(true);
    prompt();
    armIdle(prompt);
  });
}

// ---------- 砌骨 ----------
async function buildPhase() {
  await say(['fs_all', { pause: 250 }]);
  dino.g.visible = true; dino.flesh.visible = false; dino.skel.visible = true;
  dino.g.position.set(0, 0, 0); dino.g.rotation.y = 0;
  for (const m of dino.rest) setMat(m, ghostMat);
  for (const id of ORDER) setMat(dino.targets[id], slotMat);
  Sound.sfx.whoosh();
  tween(700, (k) => { for (const t of trees) t.scale.setScalar(Math.max(0.001, t.userData.s * (1 - k))); }); // 樹收埋，骨架睇得清楚啲
  camTo(VIEW.skel(), 1600);
  await tween(900, (k) => dino.g.scale.setScalar(Math.max(0.001, k)), outBack);
  await sayMin(['fs_ghost', { pause: 300 }], 2200);
  await camTo(VIEW.hip(), 1500);

  const left = new Set(ORDER);
  const ms = {};
  let ask = null, lock = true, firstTry = true, wrongs = 0, next = null;
  for (const id of ORDER) {
    ms[id] = addMark('slot', '', () => BONES[id].slot, async (m) => {
      if (lock || !ask) return;
      stats.tries[ask] = (stats.tries[ask] || 0) + 1;
      if (id === ask) {
        lock = true; disarmIdle(); Sound.clear();
        Sound.sfx.hatch();
        for (const k of ORDER) ms[k].el.hidden = true;
        const b = dino.targets[id];
        setMat(b, boneMat);
        tween(500, (k) => b.scale.setScalar(0.4 + 0.6 * k), outBack);
        slots[id].classList.remove('ask'); slots[id].classList.add('used');
        if (firstTry) { stars++; stats.first[id] = (stats.first[id] || 0) + 1; drawStars(); }
        saveStats();
        left.delete(id);
        await sayMin([{ pause: 150 }, firstTry ? 'praise_1' : 'fs_yes', { pause: 250 }], 900);
        next();
      } else {
        // 答錯：唔扣，嗰格收埋 + 聽多次提示先畀再撳
        lock = true; firstTry = false; wrongs++;
        Sound.sfx.soft(); Sound.clear();
        m.el.classList.add('no');
        if (wrongs >= 2) for (const k of left) if (k !== ask) ms[k].el.classList.add('no');
        await say([{ pause: 150 }, 'fs_no', { pause: 200 }, 'fs_hint_' + ask, { pause: 200 }]);
        lock = false;
      }
    });
  }
  await new Promise((done) => {
    const queue = ORDER.slice().sort(() => Math.random() - 0.5);
    next = async () => {
      ask = queue.shift();
      if (!ask) { done(); return; }
      firstTry = true; wrongs = 0; lock = true;
      slots[ask].classList.add('ask');
      for (const k of ORDER) { ms[k].el.classList.remove('no'); ms[k].el.hidden = !left.has(k); }
      const prompt = ['fs_where_' + ask];
      await say([{ pause: 200 }, ...prompt]);
      lock = false;
      armIdle(() => say(prompt));
    };
    next();
  });
  disarmIdle();
  for (const id of ORDER) ms[id].el.remove();
  // 得四舊骨都估到成隻
  camTo(VIEW.skel(), 1500);
  const p = sayMin([{ pause: 200 }, 'fs_guess', { pause: 300 }], 3400);
  const order = dino.rest.slice().sort((a, b) => a.position.x - b.position.x);
  const step = FAST ? 2 : 3000 / order.length;
  for (let i = 0; i < order.length; i++) { setMat(order[i], boneMat); if (i % 6 === 0) Sound.sfx.click(); await wait(step); }
  await p;
}

// ---------- 活返 + 行 ----------
async function alivePhase() {
  Sound.sfx.zap();
  dino.st.grow = 0; dino.flesh.visible = true;
  camTo(VIEW.alive(), 1800);
  const p = sayMin(['fs_alive', { pause: 250 }], 2400);
  await tween(2200, (k) => { dino.st.grow = k; }, (k) => k);
  dino.st.grow = 1; dino.skel.visible = false;
  tween(900, (k) => { for (const t of trees) t.scale.setScalar(Math.max(0.001, t.userData.s * k)); }, outBack);
  await p;
  await roar();
  bus.visible = true;
  Sound.sfx.boing();
  tween(600, (k) => bus.scale.setScalar(Math.max(0.001, k)), outBack);
  await sayMin(['fs_big', { pause: 400 }], 3000);
  await camTo(VIEW.walk(), 1500);
  say(['fs_walk']);
  const target = V3(0, 0, 0);
  let going = false;
  onTap = (e) => {
    const p2 = groundPoint(e);
    if (!p2) return;
    if (p2.distanceTo(dino.g.position) < 4) { roar(); return; }
    const r = Math.hypot(p2.x, p2.z);
    if (r > 15.5) p2.multiplyScalar(15.5 / r);
    target.copy(p2); going = true; dino.st.moving = true;
    Sound.sfx.pop();
  };
  walker = (dt) => {
    if (!going) return;
    const d = tmp.copy(target).sub(dino.g.position); d.y = 0;
    const len = d.length();
    if (len < 0.25) { going = false; dino.st.moving = false; return; }
    const want = Math.atan2(-d.z, d.x);
    let diff = want - dino.g.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    dino.g.rotation.y += clamp(diff, -dt * 2.6, dt * 2.6);
    if (Math.abs(diff) < 1.1) dino.g.position.add(d.normalize().multiplyScalar(Math.min(len, dt * 4.2)));
  };
  await wait(FAST ? 600 : 26000);
  stats.done++; saveStats();
  await say(['fs_end', { pause: 300 }, 'fs_bye']);
  cap.textContent = '';
  $('#fs-end').hidden = false;
}
let walker = null;
let roaring = false;
async function roar() {
  if (roaring) return;
  roaring = true;
  Sound.sfx.roar();
  await tween(450, (k) => { dino.st.lift = k; });
  await wait(FAST ? 20 : 350);
  await tween(600, (k) => { dino.st.lift = 1 - k; });
  roaring = false;
}

// ---------- 主流程 ----------
async function run() {
  $('#fs-start').hidden = true; $('#fs-start').style.display = 'none';
  $('#fs-hud').hidden = false;
  const seen = stats.plays > 0;
  stats.plays++; saveStats();
  $('#fs-skip').hidden = !seen;
  const stage = new URLSearchParams(location.search).get('stage'); // 測試：?stage=build 直接去砌骨
  if (stage !== 'build') {
    await say(['fs_hi', { pause: 250 }]);
    await story();
  }
  epoch++; // 故事入面未完嘅 tween 作廢
  $('#fs-skip').hidden = true;
  setDigReady();
  if (stage !== 'build') await digPhase();
  else for (const id of ORDER) { slots[id].classList.add('got'); for (const r of digs[id].rocks) r.visible = false; }
  await buildPhase();
  await alivePhase();
}
$('#fs-skip').addEventListener('pointerdown', () => { skipped = true; epoch++; Sound.clear(); skipNow(); $('#fs-skip').hidden = true; });
$('#fs-go').addEventListener('click', () => {
  Sound.unlock();
  const el = document.documentElement, fn = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fn && !document.fullscreenElement && !window.matchMedia('(display-mode: standalone)').matches) { try { const p = fn.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(() => {});
  Promise.race([Sound.loadRecordings(), wait(1500)]).then(run);
});
$('#fs-again').addEventListener('click', () => location.reload());
{ // 返主選單要撳實 0.7 秒，費事撳錯
  const b = $('#fs-home'); let t = 0;
  const off = () => { clearTimeout(t); b.classList.remove('hold'); };
  b.addEventListener('pointerdown', () => { b.classList.add('hold'); t = setTimeout(() => { Sound.clear(); location.href = 'index.html'; }, 700); });
  b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
}

// ---------- loop ----------
const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(0.05, clock.getDelta()), time = clock.elapsedTime;
  stepTweens(dt);
  if (walker) walker(dt);
  dino.update(dt, time);
  sea.position.y = -4.9 + Math.sin(time * 0.8) * 0.12;
  camera.position.copy(cam.pos);
  camera.position.x += Math.sin(time * 0.25) * 0.5;
  camera.lookAt(cam.look);
  camera.updateMatrixWorld();
  placeMarks();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
// 開始畫面：遠景 + 恐龍企喺島中間
setDigReady();
dino.g.visible = true; dino.flesh.visible = true;
cam.view = VIEW.walk(); cam.pos.copy(viewPos(cam.view)); cam.look.copy(cam.view.look);
frame();
// 測試用
window.__fossil = { dino, digs, cam, stats, tweens, THREE, scene, camera };
