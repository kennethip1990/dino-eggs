/* 恐龍生日派對用嘅 SVG：房間、門、恐龍一家、嘢食、枱、蛋糕、咪、貼紙 */
const PartyArt = (() => {
  const INK = '#3b3247';
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const KAI = '"WenKai", "Kaiti TC", "STKaiti", serif';
  // 將一個完整 <svg> 塞入另一個 svg 嘅 (x, y, w, h)
  const vb = (svg) => (svg.match(/viewBox="([^"]+)"/) || [])[1];
  const inner = (svg) => svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const nest = (svg, x, y, w, h) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb(svg)}">${inner(svg)}</svg>`;

  function balloonArt(x, y, c, s) {
    return `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M0 60 Q-8 90 6 120" stroke="#9a8fa8" stroke-width="3" fill="none"/>
      <ellipse cx="0" cy="0" rx="40" ry="50" fill="${c}"/><path d="M-6 50 L6 50 L0 60Z" fill="${c}"/>
      <ellipse cx="-14" cy="-18" rx="9" ry="15" fill="#fff" opacity=".4" transform="rotate(-20 -14 -18)"/></g>`;
  }

  // ---------- 房間背景 ----------
  function room() {
    const flagCols = ['#ff9a9a', '#ffc46b', '#fff07a', '#8fe0a0', '#8fbdf0', '#c7a3ff'];
    let flags = '';
    for (let i = 0; i < 17; i++) {
      const x = 360 + i * 70, y = 70 + Math.sin(i / 16 * Math.PI) * 50;
      flags += `<path d="M${x} ${y} L${x + 60} ${y + (i < 8 ? 6 : -6)} L${x + 30} ${y + 64}Z" fill="${flagCols[i % 6]}"/>`;
    }
    const stripes = Array.from({ length: 20 }, (_, i) => `<rect x="${i * 84}" y="0" width="40" height="760" fill="#ffeacc" opacity=".55"/>`).join('');
    const boards = Array.from({ length: 10 }, (_, i) => `<path d="M${i * 200} 748 L${i * 200 - 90} 1000" stroke="#dfb27c" stroke-width="5"/>`).join('');
    return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1600" height="1000" fill="#fff3de"/>
      ${stripes}
      <rect x="0" y="740" width="1600" height="260" fill="#efc795"/>
      ${boards}
      <rect x="0" y="728" width="1600" height="20" fill="#e3b27a"/>
      <path d="M340 64 Q980 150 1600 64" stroke="#d9a86a" stroke-width="5" fill="none"/>
      ${flags}
      <g transform="translate(1200 240)">
        <rect x="0" y="0" width="300" height="230" rx="18" fill="#fff"/>
        <rect x="14" y="14" width="272" height="202" rx="10" fill="#bfe6ff"/>
        <circle cx="220" cy="70" r="30" fill="#fff07a"/>
        <ellipse cx="90" cy="160" rx="70" ry="22" fill="#fff" opacity=".9"/>
        <rect x="144" y="14" width="12" height="202" fill="#fff"/><rect x="14" y="108" width="272" height="12" fill="#fff"/>
      </g>
      <g class="r-banner" transform="translate(760 200)">
        <rect x="-170" y="0" width="340" height="96" rx="20" fill="#ff8fb1"/>
        <text x="0" y="68" text-anchor="middle" font-family='${KAI}' font-weight="700" font-size="58" fill="#fff">生日快樂</text>
      </g>
      ${balloonArt(1100, 320, '#8fbdf0', .8)}${balloonArt(1150, 350, '#ffd36e', .7)}
    </svg>`;
  }

  // ---------- 門：背（門框 + 門口）同門板分開，客人企喺中間 ----------
  function doorBack() {
    return `<svg viewBox="0 0 200 360" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="200" height="360" rx="14" fill="#b7855a"/>
      <rect x="16" y="16" width="168" height="344" rx="8" fill="#6f5442"/>
      <rect x="16" y="300" width="168" height="60" fill="#5c4536"/>
    </svg>`;
  }
  function doorLeaf() {
    return `<svg viewBox="0 0 168 344" preserveAspectRatio="none" aria-hidden="true">
      <rect x="3" y="3" width="162" height="338" rx="8" fill="#f2a65a" stroke="#d98a3c" stroke-width="6"/>
      <rect x="26" y="26" width="116" height="110" rx="12" fill="#bfe6ff" stroke="#d98a3c" stroke-width="5"/>
      <rect x="26" y="168" width="116" height="140" rx="12" fill="none" stroke="#d98a3c" stroke-width="5"/>
      <circle cx="140" cy="200" r="10" fill="#ffd36e" stroke="#d9a53a" stroke-width="4"/>
      <path d="M84 60 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2z" fill="#fff07a"/>
    </svg>`;
  }

  // ---------- 恐龍一家：正面企、細路仔細隻啲 ----------
  const PEOPLE = {
    host:    { body: '#8fd6a8', belly: '#e6f7ea', scale: .72 },
    baba:    { body: '#7fc47f', belly: '#e3f5d9', scale: 1 },
    mama:    { body: '#f5a6b8', belly: '#ffe6ec', scale: .96 },
    yeye:    { body: '#a9c8b8', belly: '#eef3e8', scale: .94 },
    shushu:  { body: '#f6b26b', belly: '#ffe2bd', scale: 1 },
    jiujiu:  { body: '#b8a2ea', belly: '#efe8ff', scale: 1 },
    laoshi:  { body: '#7fd0d0', belly: '#e3f7f5', scale: .96 },
    gege:    { body: '#6f9fe0', belly: '#e2ecff', scale: .8 },
    didi:    { body: '#9fd3ff', belly: '#eaf6ff', scale: .64 },
    meimei:  { body: '#ffc98a', belly: '#fff0dc', scale: .7 },
    tongxue: { body: '#c3e07a', belly: '#f3f9de', scale: .76 }
  };
  const bowAt = (x, y, c, s) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><path d="M0 0 L-16 -10 L-16 10Z M0 0 L16 -10 L16 10Z" fill="${c}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle r="5" fill="${c}" stroke="#fff" stroke-width="2"/></g>`;
  // 每個人嘅特徵（back = 身後；face / front / top / hand = 身前）
  const EXTRA = {
    host: {
      top: `<path d="M44 34 L60 -6 L76 34Z" fill="#ffd36e" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
        <path d="M50 20 L70 20 M47 28 L73 28" stroke="#ff8fb1" stroke-width="4"/><circle cx="60" cy="-8" r="6" fill="#ff8fb1"/>`,
      noSpikes: true
    },
    baba: {
      front: `<path d="M50 92 L60 100 L70 92Z" fill="#fff"/><path d="M56 96 L64 96 L62 102 L66 124 L60 131 L54 124 L58 102Z" fill="#4f7fd9"/>`,
      top: `<path d="M50 32 Q56 18 62 30 Q66 20 72 32" stroke="#4d7a4d" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      noSpikes: true
    },
    mama: {
      top: bowAt(84, 38, '#ff6b9a', 1.1),
      front: [0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${42 + i * 6}" cy="${94 + Math.sin(i / 6 * Math.PI) * 6}" r="3.4" fill="#fff"/>`).join(''),
      lashes: true
    },
    yeye: {
      face: `<circle cx="49" cy="60" r="10" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2.5"/><circle cx="71" cy="60" r="10" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2.5"/>
        <path d="M59 60 L61 60" stroke="${INK}" stroke-width="2.5"/>
        <path d="M40 46 Q49 40 56 46 M64 46 Q71 40 80 46" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M42 74 Q51 66 60 72 Q69 66 78 74 Q69 80 60 75 Q51 80 42 74Z" fill="#fff" stroke="#d8d8d8" stroke-width="1.5"/>`,
      hand: `<path d="M98 112 Q100 100 110 102 Q116 104 114 112 L106 164" stroke="#a8743f" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      mouthY: 82
    },
    shushu: {
      top: `<path d="M30 46 Q32 18 60 18 Q88 18 90 46Z" fill="#ff6b6b"/><path d="M86 40 Q108 38 112 46 Q100 50 86 47Z" fill="#e05252"/><circle cx="60" cy="18" r="4" fill="#e05252"/>`,
      face: `<path d="M44 73 Q52 68 60 72 Q68 68 76 73 Q68 77 60 74 Q52 77 44 73Z" fill="#7a4a2a"/>`,
      noSpikes: true, mouthY: 82
    },
    jiujiu: {
      face: `<rect x="38" y="52" width="22" height="15" rx="6" fill="${INK}"/><rect x="62" y="52" width="22" height="15" rx="6" fill="${INK}"/>
        <path d="M58 57 L64 57" stroke="${INK}" stroke-width="3"/><path d="M42 56 l6 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`,
      front: `<path d="M60 98 L46 90 L46 106Z M60 98 L74 90 L74 106Z" fill="#ff6b9a"/><circle cx="60" cy="98" r="4" fill="#e0457a"/>`,
      noEyes: true
    },
    laoshi: {
      top: `<circle cx="60" cy="26" r="11" fill="#6b4a3a"/><path d="M30 54 Q32 30 60 30 Q88 30 90 54 Q78 40 60 42 Q42 40 30 54Z" fill="#6b4a3a"/>`,
      face: `<rect x="39" y="52" width="20" height="16" rx="3" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2.5"/><rect x="61" y="52" width="20" height="16" rx="3" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="2.5"/>
        <path d="M59 58 L61 58" stroke="${INK}" stroke-width="2.5"/>`,
      hand: `<g transform="rotate(-12 100 120)"><rect x="86" y="104" width="30" height="24" rx="3" fill="#ff8a5c"/><rect x="100" y="104" width="2" height="24" fill="#fff"/><path d="M90 110 h8 M90 116 h8 M104 110 h8 M104 116 h8" stroke="#fff" stroke-width="2"/></g>`,
      noSpikes: true, lashes: true
    },
    gege: {
      top: `<rect x="29" y="40" width="62" height="9" rx="4" fill="#ff6b6b"/>`,
      front: `<path d="M60 108 l5 10 l11 1 l-8 7 l3 11 l-11 -6 l-11 6 l3 -11 l-8 -7 l11 -1z" fill="#ffd36e"/>`
    },
    didi: {
      top: `<path d="M60 30 Q54 18 62 14 Q70 12 68 20" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      front: `<path d="M42 92 Q60 86 78 92 Q80 116 60 118 Q40 116 42 92Z" fill="#fff" stroke="#9fc5e8" stroke-width="2.5"/><circle cx="60" cy="104" r="5" fill="#ffd36e"/>`,
      noSpikes: true
    },
    meimei: {
      top: `<circle cx="28" cy="54" r="10" fill="#6b4a3a"/><circle cx="92" cy="54" r="10" fill="#6b4a3a"/>${bowAt(30, 42, '#ff6b9a', .7)}${bowAt(90, 42, '#ff6b9a', .7)}`,
      lashes: true
    },
    tongxue: {
      back: `<rect x="20" y="96" width="80" height="58" rx="16" fill="#ff8a5c"/>`,
      front: `<path d="M40 92 L44 140 M80 92 L76 140" stroke="#e5663a" stroke-width="7" stroke-linecap="round"/>`,
      top: `<ellipse cx="60" cy="40" rx="40" ry="8" fill="#ffd36e"/><path d="M34 40 Q36 18 60 18 Q84 18 86 40Z" fill="#ffd36e" stroke="#e8b84a" stroke-width="2"/><rect x="36" y="32" width="48" height="6" fill="#4f7fd9"/>`,
      noSpikes: true
    }
  };

  function person(id) {
    const p = PEOPLE[id], x = EXTRA[id] || {};
    const s = p.scale;
    const my = x.mouthY || 76;
    const eyes = x.noEyes ? '' : `${eye(49, 60, 5.5)}${eye(71, 60, 5.5)}` +
      (x.lashes ? `<path d="M43 55 l-5 -4 M77 55 l5 -4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` : '');
    const spikes = x.noSpikes ? '' : `<path d="M44 34 l6 -14 l6 12z M56 30 l5 -15 l5 15z M66 32 l6 -12 l6 14z" fill="${p.body}" stroke="#000" stroke-opacity=".12"/>`;
    return `<svg viewBox="0 0 120 170" aria-hidden="true">
      <ellipse cx="60" cy="166" rx="${34 * s}" ry="5" fill="#000" opacity=".1"/>
      <g transform="translate(60 166) scale(${s}) translate(-60 -166)">
        ${x.back || ''}
        <path d="M86 140 Q112 142 116 120 Q104 136 84 128Z" fill="${p.body}"/>
        <ellipse cx="44" cy="160" rx="13" ry="7" fill="${p.body}" stroke="#000" stroke-opacity=".1"/>
        <ellipse cx="76" cy="160" rx="13" ry="7" fill="${p.body}" stroke="#000" stroke-opacity=".1"/>
        <ellipse cx="60" cy="124" rx="34" ry="36" fill="${p.body}"/>
        <ellipse cx="60" cy="130" rx="22" ry="24" fill="${p.belly}"/>
        <ellipse cx="27" cy="118" rx="7" ry="13" transform="rotate(20 27 118)" fill="${p.body}" stroke="#000" stroke-opacity=".1"/>
        <ellipse cx="93" cy="118" rx="7" ry="13" transform="rotate(-20 93 118)" fill="${p.body}" stroke="#000" stroke-opacity=".1"/>
        ${spikes}
        <circle cx="60" cy="62" r="32" fill="${p.body}"/>
        ${eyes}
        <circle cx="40" cy="72" r="5" fill="#ff8fa8" opacity=".5"/><circle cx="80" cy="72" r="5" fill="#ff8fa8" opacity=".5"/>
        <path class="pp-smile" d="M52 ${my} Q60 ${my + 7} 68 ${my}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <ellipse class="pp-talk" cx="60" cy="${my + 3}" rx="6" ry="5" fill="#b0506a"/>
        ${x.face || ''}${x.front || ''}${x.top || ''}${x.hand || ''}
      </g>
    </svg>`;
  }
  // 頭像（坐位分類提示用）：裁淨頭部
  function face(id) {
    const s = PEOPLE[id].scale;
    const top = 166 - (166 + 12) * s, h = 112 * s;
    return person(id).replace('viewBox="0 0 120 170"', `viewBox="${60 - h * .55} ${top} ${h * 1.1} ${h}"`);
  }

  // ---------- 派嘢用嘅嘢食 ----------
  const ITEMS = {
    cake: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M12 54 L88 54 L88 86 Q50 94 12 86Z" fill="#ffe2bd"/><path d="M12 54 L88 54 L88 64 Q50 70 12 64Z" fill="#ff9ab8"/>
      <path d="M12 72 L88 72 L88 76 Q50 82 12 76Z" fill="#ff9ab8"/>
      <path d="M8 54 Q20 40 30 54 Q40 40 50 54 Q60 40 70 54 Q80 40 92 54Z" fill="#fff"/>
      <circle cx="50" cy="38" r="11" fill="#ff5f6d"/><path d="M50 27 q4 -8 10 -6" stroke="#5aa85a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
    drink: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M58 10 L52 40" stroke="#ff6b9a" stroke-width="6" stroke-linecap="round"/>
      <path d="M24 30 L76 30 L68 92 L32 92Z" fill="#bfe6ff" stroke="#8fbdf0" stroke-width="4" stroke-linejoin="round"/>
      <path d="M28 52 L72 52 L68 88 L32 88Z" fill="#ffb36b"/><circle cx="44" cy="66" r="4" fill="#fff" opacity=".7"/><circle cx="56" cy="76" r="3" fill="#fff" opacity=".7"/></svg>`,
    balloon: `<svg viewBox="0 0 100 100" aria-hidden="true">${balloonArt(50, 34, '#ff6b6b', .6)}</svg>`
  };

  // ---------- 大人枱 / 小朋友枱 ----------
  function table(kind) {
    const c = kind === 'adult' ? '#8fbdf0' : '#ffb3c7';
    return `<svg viewBox="0 0 300 140" aria-hidden="true">
      <rect x="10" y="20" width="280" height="22" rx="10" fill="#fff" stroke="${c}" stroke-width="5"/>
      <path d="M10 34 Q16 70 30 70 L270 70 Q284 70 290 34" fill="${kind === 'adult' ? '#c9def8' : '#ffd6e2'}"/>
      <path d="M10 34 Q16 70 30 70 L270 70 Q284 70 290 34" fill="none" stroke="${c}" stroke-width="4"/>
      <rect x="40" y="60" width="14" height="76" rx="6" fill="#c89466"/><rect x="246" y="60" width="14" height="76" rx="6" fill="#c89466"/>
    </svg>`;
  }

  // ---------- 生日蛋糕（結局用；.candle.out = 吹熄咗） ----------
  function bigCake(n) {
    let candles = '';
    for (let i = 0; i < n; i++) {
      const x = 80 + i * (140 / Math.max(1, n - 1));
      candles += `<g class="candle" data-i="${i}"><rect x="${x - 7}" y="40" width="14" height="46" rx="4" fill="${['#8fbdf0', '#ffd36e', '#8fe0a0', '#c7a3ff'][i % 4]}"/>
        <path d="M${x - 7} 54 l14 -6 M${x - 7} 68 l14 -6" stroke="#fff" stroke-width="3"/>
        <g class="flame"><path d="M${x} 4 Q${x + 15} 24 ${x} 38 Q${x - 15} 24 ${x} 4Z" fill="#ffb347"/><path d="M${x} 16 Q${x + 7} 28 ${x} 34 Q${x - 7} 28 ${x} 16Z" fill="#fff07a"/></g>
        <path class="smoke" d="M${x} 36 q-8 -10 0 -18 q8 -8 0 -16" stroke="#c9c2d4" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect class="c-hit" x="${x - 22}" y="0" width="44" height="90" fill="transparent"/></g>`;
    }
    return `<svg viewBox="0 0 300 220" aria-hidden="true">
      <ellipse cx="150" cy="210" rx="130" ry="8" fill="#000" opacity=".08"/>
      <rect x="20" y="190" width="260" height="14" rx="7" fill="#fff" stroke="#e8ddd0" stroke-width="3"/>
      <path d="M40 120 L260 120 L260 190 L40 190Z" fill="#ffe2bd"/><rect x="40" y="148" width="220" height="12" fill="#ff9ab8"/>
      <path d="M60 84 L240 84 L240 122 L60 122Z" fill="#fff6e8"/>
      <path d="M54 86 Q70 72 84 86 Q98 72 112 86 Q126 72 140 86 Q154 72 168 86 Q182 72 196 86 Q210 72 224 86 Q238 72 246 86Z" fill="#ff9ab8"/>
      <path d="M36 122 Q52 110 66 122 Q80 110 94 122 Q108 110 122 122 Q136 110 150 122 Q164 110 178 122 Q192 110 206 122 Q220 110 234 122 Q248 110 264 122Z" fill="#fff"/>
      <circle cx="90" cy="136" r="7" fill="#ff5f6d"/><circle cx="150" cy="138" r="7" fill="#ff5f6d"/><circle cx="210" cy="136" r="7" fill="#ff5f6d"/>
      ${candles}
    </svg>`;
  }

  // ---------- 咪 ----------
  const mic = `<svg viewBox="0 0 100 100" aria-hidden="true">
    <rect x="36" y="14" width="28" height="46" rx="14" fill="#fff"/>
    <path d="M26 46 Q26 72 50 72 Q74 72 74 46" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M50 72 L50 86 M36 88 L64 88" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`;

  // ---------- 主選單卡 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="104" r="88" fill="#ffe3ef"/>
      ${balloonArt(40, 62, '#8fbdf0', .5)}${balloonArt(164, 54, '#ffd36e', .5)}
      ${nest(person('host'), 20, 6, 150, 212)}
      ${nest(ITEMS.cake, 110, 112, 80, 80)}
    </svg>`;
  }

  // ---------- 貼紙（圓形底由 EndArt.sticker 畫） ----------
  function sticker(id) {
    if (id === 'monster') return nest(HeroArt.monster().replace('class="m-angry"', 'class="m-angry" display="none"'), 8, 12, 70, 70) + nest(ITEMS.cake, 52, 50, 40, 40);
    if (id === 'balloon') return `${balloonArt(32, 36, '#ff6b6b', .4)}${balloonArt(68, 32, '#8fbdf0', .4)}${balloonArt(50, 50, '#ffd36e', .4)}`;
    return nest(bigCake(4), 8, 16, 84, 64);
  }

  return { room, doorBack, doorLeaf, person, face, PEOPLE, ITEMS, table, bigCake, mic, icon, sticker, balloon: balloonArt, nest };
})();
