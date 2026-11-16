/*
 * 光之巨人 Luca 救援隊：全部原創 SVG（唔用任何官方英雄嘅名 / 造型）
 * - 主角：光之巨人 Luca（銀色身 + 兩隻顏色 + 胸口光能燈）viewBox 0 0 200 260，面向前
 *   顏色用 CSS 變數：--lg-a / --lg-b（Type 顏色）、--lg-timer（胸口燈）→ 換 Type 唔使重畫
 * - BB 怪獸 Pip + 怪獸媽媽（綠色恐龍仔）viewBox 0 0 160 150；.bm-sad / .bm-happy 切換
 * - 字表嘅圖 viewBox 0 0 200 170（同 JediArt / RoboArt 一樣）；cow 借 RexArt，skirt / dress 借 JediArt，shirt / green 借 RoboArt
 * - 背景小鎮、HUD（屋仔、聲音光球、光格）、結局道具（巴士）、主選單卡、貼紙
 */
const LightArt = (() => {
  const INK = '#3b3247';
  const SKIN = '#f6cfae', SKIN2 = '#d9a483';
  const nest = JediArt.nest;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const shadow = (cx, rx, y) => `<ellipse cx="${cx}" cy="${y || 163}" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;
  const SIL = '#eef1f7', SIL2 = '#c3cad8', GOLD = '#e2b84a';

  // Type 顏色（亦俾 light.js 用）
  const TYPES = {
    multi: { a: '#e03a4a', b: '#7a4fd0' },
    power: { a: '#e03a4a', b: '#b8283a' },
    sky:   { a: '#9a6ae8', b: '#6a3fc8' },
    gold:  { a: '#ffc93e', b: '#f0a800' }
  };
  const typeStyle = (t) => `--lg-a:${TYPES[t].a};--lg-b:${TYPES[t].b}`;

  // ---------- 光之巨人 Luca ----------
  function hero(type) {
    const st = type ? ` style="${typeStyle(type)}${type === 'gold' ? ';--lg-timer:#fff6c8' : ''}"` : '';
    const A = 'var(--lg-a, #e03a4a)', B = 'var(--lg-b, #7a4fd0)';
    return `<svg viewBox="0 0 200 260" aria-hidden="true" class="lg-svg"${st}>
      <ellipse cx="100" cy="252" rx="58" ry="7" fill="#000" opacity=".14"/>
      <g class="lg-legs">
        <rect x="68" y="174" width="26" height="66" rx="11" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
        <rect x="106" y="174" width="26" height="66" rx="11" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
        <path d="M70 186 Q74 210 72 232 L80 232 Q82 208 78 186Z" fill="${A}"/>
        <path d="M130 186 Q126 210 128 232 L120 232 Q118 208 122 186Z" fill="${B}"/>
        <rect x="64" y="230" width="32" height="14" rx="7" fill="#d5dbe8" stroke="${SIL2}" stroke-width="2"/>
        <rect x="104" y="230" width="32" height="14" rx="7" fill="#d5dbe8" stroke="${SIL2}" stroke-width="2"/>
      </g>
      <g class="lg-arm-l">
        <path d="M64 104 L50 160" stroke="${SIL2}" stroke-width="22" stroke-linecap="round"/>
        <path d="M64 104 L50 160" stroke="${SIL}" stroke-width="16" stroke-linecap="round"/>
        <path d="M60 112 L50 152" stroke="${A}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="48" cy="166" r="11" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
      </g>
      <path d="M62 100 Q100 90 138 100 L130 178 Q100 186 70 178Z" fill="${SIL}" stroke="${SIL2}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M62 100 L80 97 L86 180 L70 178Z" fill="${A}"/>
      <path d="M138 100 L120 97 L114 180 L130 178Z" fill="${B}"/>
      <path d="M86 142 L100 154 L114 142 L114 178 Q100 182 86 178Z" fill="${A}" opacity=".85"/>
      <path d="M70 100 Q100 92 130 100 L124 132 Q100 142 76 132Z" fill="#f9fbff" stroke="${SIL2}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M78 104 L84 130 M122 104 L116 130 M90 98 L93 124 M110 98 L107 124" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>
      <circle class="lg-timer-glow" cx="100" cy="118" r="16" fill="var(--lg-timer, #5fd0ff)" opacity=".35"/>
      <circle class="lg-timer" cx="100" cy="118" r="10" fill="var(--lg-timer, #5fd0ff)" stroke="#fff" stroke-width="3"/>
      <circle cx="97" cy="115" r="3" fill="#fff" opacity=".85"/>
      <rect x="70" y="170" width="60" height="9" rx="4" fill="#d5dbe8" stroke="${SIL2}" stroke-width="2"/>
      <circle cx="64" cy="104" r="14" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
      <rect x="92" y="82" width="16" height="16" fill="${SIL2}"/>
      <g class="lg-head">
        <rect x="74" y="56" width="8" height="16" rx="3" fill="${SIL2}"/><rect x="118" y="56" width="8" height="16" rx="3" fill="${SIL2}"/>
        <ellipse cx="100" cy="62" rx="22" ry="27" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
        <path d="M93 74 L95 40 Q100 28 105 40 L107 74 Q100 70 93 74Z" fill="#e3e8f1" stroke="${SIL2}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M96 44 L97 70 M104 44 L103 70" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>
        <g class="lg-eyes">
          <ellipse cx="88" cy="64" rx="7.5" ry="10.5" transform="rotate(-28 88 64)" fill="#fff6c8" stroke="#e8d27a" stroke-width="2"/>
          <ellipse cx="112" cy="64" rx="7.5" ry="10.5" transform="rotate(28 112 64)" fill="#fff6c8" stroke="#e8d27a" stroke-width="2"/>
          <ellipse cx="86" cy="60" rx="2.5" ry="3.5" transform="rotate(-28 86 60)" fill="#fff"/>
          <ellipse cx="110" cy="60" rx="2.5" ry="3.5" transform="rotate(28 110 60)" fill="#fff"/>
        </g>
        <path d="M94 80 Q100 84 106 80" stroke="#aeb6c6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
      <g class="lg-arm">
        <path d="M136 104 L150 160" stroke="${SIL2}" stroke-width="22" stroke-linecap="round"/>
        <path d="M136 104 L150 160" stroke="${SIL}" stroke-width="16" stroke-linecap="round"/>
        <path d="M140 112 L150 152" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="152" cy="166" r="11" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
        <circle cx="136" cy="104" r="14" fill="${SIL}" stroke="${SIL2}" stroke-width="3"/>
      </g>
    </svg>`;
  }

  // ---------- BB 怪獸 Pip（綠色恐龍仔）/ 怪獸媽媽 ----------
  function baby(mama) {
    const c = mama ? '#4fb06a' : '#7fd67a', d = mama ? '#3a8c52' : '#5fb85c', belly = mama ? '#cdeec0' : '#e2f8d4';
    const spikes = [[40, 80], [34, 100], [36, 120]].map(([x, y]) => `<path d="M${x + 8} ${y - 10} L${x - 10} ${y} L${x + 8} ${y + 10}Z" fill="#ffd36e" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>`).join('');
    return `<svg viewBox="0 0 160 150" aria-hidden="true" class="bm-svg">
      <ellipse cx="82" cy="144" rx="46" ry="5" fill="#000" opacity=".12"/>
      <path class="bm-tail" d="M44 116 Q10 120 8 96 Q20 110 46 102Z" fill="${d}"/>
      ${spikes}
      <ellipse cx="66" cy="138" rx="15" ry="8" fill="${d}"/><ellipse cx="100" cy="138" rx="15" ry="8" fill="${d}"/>
      <ellipse cx="82" cy="106" rx="42" ry="34" fill="${c}"/>
      <ellipse cx="88" cy="114" rx="24" ry="20" fill="${belly}"/>
      <path d="M58 104 Q48 116 54 124" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path class="bm-arm" d="M112 100 Q126 108 122 120" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="90" cy="54" r="34" fill="${c}"/>
      <path d="M86 22 L92 4 L100 22Z" fill="#ffd36e" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>
      ${mama ? '<g transform="translate(64 26)"><circle cx="-7" cy="0" r="6" fill="#ff8fb8"/><circle cx="7" cy="0" r="6" fill="#ff8fb8"/><circle cx="0" cy="-7" r="6" fill="#ff8fb8"/><circle cx="0" cy="7" r="6" fill="#ff8fb8"/><circle r="5" fill="#ffd36e"/></g>' : ''}
      <ellipse cx="96" cy="70" rx="20" ry="13" fill="${belly}"/>
      <circle cx="88" cy="70" r="2.4" fill="${d}"/><circle cx="104" cy="70" r="2.4" fill="${d}"/>
      <circle cx="76" cy="48" r="10" fill="#fff"/><circle cx="104" cy="48" r="10" fill="#fff"/>
      ${eye(78, 49, 6)}${eye(106, 49, 6)}
      <g class="bm-sad">
        <path d="M64 38 Q72 36 82 31 M118 38 Q110 36 100 31" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M88 84 Q96 78 104 84" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path class="bm-tear" d="M70 60 Q66 70 70 74 Q74 70 70 60Z" fill="#8fd0ff"/>
        <path class="bm-tear t2" d="M112 60 Q108 70 112 74 Q116 70 112 60Z" fill="#8fd0ff"/>
      </g>
      <g class="bm-happy" display="none">
        <circle cx="66" cy="66" r="7" fill="#ff8fb8" opacity=".6"/><circle cx="118" cy="66" r="7" fill="#ff8fb8" opacity=".6"/>
        <path d="M86 80 Q96 92 106 80" stroke="${INK}" stroke-width="3.5" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }
  const happy = (svg) => svg.replace('class="bm-sad"', 'class="bm-sad" display="none"').replace('class="bm-happy" display="none"', 'class="bm-happy"');

  // ---------- 字表嘅圖（viewBox 0 0 200 170） ----------
  const splat = (f, s) => `
      <path d="M100 26 Q120 50 140 34 Q138 62 170 60 Q150 82 176 104 Q146 106 150 136 Q124 118 108 148 Q96 120 68 140 Q72 112 34 112 Q58 92 28 70 Q62 66 54 38 Q82 54 100 26Z" fill="${f}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="40" cy="36" r="8" fill="${f}"/><circle cx="168" cy="140" r="10" fill="${f}"/><circle cx="178" cy="34" r="6" fill="${f}"/>
      <ellipse cx="86" cy="70" rx="12" ry="7" fill="#fff" opacity=".35"/>`;
  const sofaBase = (c1, c2, c3, cushion) => `
      <rect x="40" y="40" width="120" height="58" rx="18" fill="${c1}"/>
      <rect x="22" y="70" width="30" height="66" rx="14" fill="${c2}"/><rect x="148" y="70" width="30" height="66" rx="14" fill="${c2}"/>
      <rect x="46" y="92" width="54" height="34" rx="10" fill="${c3}"/><rect x="100" y="92" width="54" height="34" rx="10" fill="${c3}"/>
      ${cushion ? `<rect x="58" y="56" width="26" height="26" rx="6" transform="rotate(-10 71 69)" fill="${cushion}"/><rect x="118" y="56" width="26" height="26" rx="6" transform="rotate(10 131 69)" fill="#6fb6f0"/>` : ''}
      <rect x="34" y="132" width="10" height="20" rx="3" fill="#8e5f36"/><rect x="156" y="132" width="10" height="20" rx="3" fill="#8e5f36"/>`;
  const sparkle = (x, y, s, c) => `<path d="M${x} ${y - s} Q${x + s * .18} ${y - s * .18} ${x + s} ${y} Q${x + s * .18} ${y + s * .18} ${x} ${y + s} Q${x - s * .18} ${y + s * .18} ${x - s} ${y} Q${x - s * .18} ${y - s * .18} ${x} ${y - s}Z" fill="${c || '#ffd23e'}"/>`;

  const T = {
    new: () => `${shadow(100, 86)}${sofaBase('#d84a5a', '#c23a4b', '#e8616f', '#ffd36e')}
      <path d="M48 46 Q60 42 70 44" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
      ${sparkle(30, 34, 14)}${sparkle(176, 40, 11)}${sparkle(170, 148, 9, '#fff6c8')}${sparkle(14, 120, 8, '#fff6c8')}`,
    old: () => `${shadow(100, 86)}${sofaBase('#8a5a4a', '#74493b', '#9c6a58')}
      <rect x="56" y="54" width="20" height="16" rx="2" transform="rotate(-12 66 62)" fill="#c9a26b" stroke="#6e4a36" stroke-width="2" stroke-dasharray="4 3"/>
      <rect x="114" y="98" width="22" height="16" rx="2" transform="rotate(8 125 106)" fill="#7fae8a" stroke="#4e6e56" stroke-width="2" stroke-dasharray="4 3"/>
      <path d="M128 52 L136 62 L130 70 L140 80" stroke="#4a2e24" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="70" cy="110" rx="9" ry="6" fill="#4a2e24"/>
      <path d="M70 110 q-6 -10 2 -14 q8 -4 4 -12 q-4 -8 4 -12" stroke="#b9c1d0" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M150 42 q6 -4 10 0 M160 32 q6 -4 10 0" stroke="#a9a2b3" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    bowl: () => `${shadow(100, 62, 158)}
      <ellipse cx="100" cy="150" rx="30" ry="8" fill="#1d5f99"/>
      <path d="M28 66 H172 Q168 144 100 150 Q32 144 28 66Z" fill="#3b9fe8"/>
      <ellipse cx="100" cy="66" rx="72" ry="17" fill="#2a7fc4"/>
      <ellipse cx="100" cy="68" rx="62" ry="12" fill="#1d5f99"/>
      <path d="M44 88 Q50 120 76 136" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>`,
    cup: () => `${shadow(100, 54)}
      <path d="M128 70 Q164 70 162 98 Q160 124 126 122" stroke="#e8763c" stroke-width="12" fill="none" stroke-linecap="round"/>
      <rect x="54" y="50" width="80" height="100" rx="12" fill="#ff9a5a"/>
      <ellipse cx="94" cy="52" rx="40" ry="9" fill="#e8763c"/>
      <path d="M94 112 C78 100 80 88 88 88 C92 88 94 92 94 94 C94 92 96 88 100 88 C108 88 110 100 94 112Z" fill="#fff" opacity=".9"/>
      <path d="M78 36 q-8 -10 0 -18 M100 36 q-8 -10 0 -18" stroke="#c9c2d6" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    prawn: () => `${shadow(104, 66)}
      <path d="M126 140 L104 154 L108 132Z M126 140 L118 162 L134 144Z" fill="#c8402e"/>
      <path d="M56 70 Q118 34 156 82 Q178 120 140 144 Q120 152 112 136 Q140 126 140 102 Q134 70 70 88Z" fill="#e8553e" stroke="#c8402e" stroke-width="3" stroke-linejoin="round"/>
      <path d="M96 60 Q104 76 96 90 M118 58 Q128 76 118 96 M140 72 Q146 92 132 108 M152 98 Q150 116 134 124" stroke="#c8402e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M86 92 l-6 16 M100 96 l-4 16 M114 100 l-2 16 M126 108 l2 14" stroke="#e8553e" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="62" cy="78" rx="18" ry="13" fill="#f06a52"/>
      ${eye(58, 72, 5)}
      <path d="M46 78 Q20 60 14 22 M48 82 Q16 82 6 50" stroke="#e8553e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    crab: () => `${shadow(100, 70)}
      <path d="M50 110 l-24 10 l-8 20 M52 120 l-20 18 M150 110 l24 10 l8 20 M148 120 l20 18" stroke="#e8553e" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M60 92 Q30 70 30 46" stroke="#e8553e" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M140 92 Q170 70 170 46" stroke="#e8553e" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M30 46 Q8 40 14 18 Q24 32 32 30 Q30 18 40 12 Q48 32 30 46Z" fill="#f06a52" stroke="#c8402e" stroke-width="3" stroke-linejoin="round"/>
      <path d="M170 46 Q192 40 186 18 Q176 32 168 30 Q170 18 160 12 Q152 32 170 46Z" fill="#f06a52" stroke="#c8402e" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="100" cy="110" rx="56" ry="36" fill="#f06a52" stroke="#c8402e" stroke-width="3"/>
      <path d="M86 78 V62 M114 78 V62" stroke="#c8402e" stroke-width="4"/>
      <circle cx="86" cy="58" r="9" fill="#fff"/><circle cx="114" cy="58" r="9" fill="#fff"/>${eye(86, 59, 5)}${eye(114, 59, 5)}
      <path d="M88 122 Q100 132 112 122" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    horse: () => `${shadow(96, 70)}
      <path d="M50 84 Q26 90 24 128 Q34 110 50 100Z" fill="#4a2e24"/>
      <rect x="56" y="104" width="13" height="50" rx="6" fill="#7a4c32"/><rect x="74" y="106" width="13" height="50" rx="6" fill="#8a5a3c"/>
      <rect x="112" y="106" width="13" height="50" rx="6" fill="#7a4c32"/><rect x="130" y="104" width="13" height="50" rx="6" fill="#8a5a3c"/>
      <path d="M54 152 h17 v6 h-17z M72 154 h17 v6 h-17z M110 154 h17 v6 h-17z M128 152 h17 v6 h-17z" fill="#3b2a22"/>
      <ellipse cx="98" cy="96" rx="52" ry="26" fill="#8a5a3c"/>
      <path d="M128 86 Q132 48 150 34 L168 52 Q152 64 150 96Z" fill="#8a5a3c"/>
      <path d="M150 30 Q172 26 186 52 Q192 66 180 70 Q166 70 160 60Z" fill="#8a5a3c"/>
      <ellipse cx="182" cy="64" rx="9" ry="7" fill="#6e4430"/><circle cx="184" cy="62" r="1.8" fill="${INK}"/>
      <path d="M152 30 L150 16 L160 26Z" fill="#6e4430"/>
      <path d="M146 34 Q134 40 132 54 Q126 66 128 84 Q140 70 140 56 Q148 46 156 40Z" fill="#4a2e24"/>
      ${eye(164, 44, 4)}`,
    arm: () => `${shadow(110, 70)}
      <path d="M182 132 L86 132 Q60 132 60 106 L60 64" stroke="${SKIN2}" stroke-width="42" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M182 132 L86 132 Q60 132 60 106 L60 64" stroke="${SKIN}" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="126" cy="112" rx="34" ry="20" fill="${SKIN}" stroke="${SKIN2}" stroke-width="4"/>
      <path d="M100 116 Q126 100 152 114" stroke="${SKIN}" stroke-width="12" fill="none"/>
      <circle cx="60" cy="48" r="26" fill="${SKIN}" stroke="${SKIN2}" stroke-width="4"/>
      <path d="M44 40 Q60 34 76 40 M44 52 Q60 46 76 52" stroke="${SKIN2}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M118 104 Q126 98 134 104" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`,
    leg: () => `${shadow(118, 52, 160)}
      <path d="M96 12 L96 128 Q96 150 120 150 L156 150" stroke="${SKIN2}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M96 12 L96 128 Q96 150 120 150 L156 150" stroke="${SKIN}" stroke-width="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M86 70 Q96 76 106 70" stroke="${SKIN2}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${172 - i * 3}" cy="${136 + i * 6}" r="${7 - i * .8}" fill="${SKIN}" stroke="${SKIN2}" stroke-width="2"/>`).join('')}`,
    bird: () => `${shadow(100, 50)}
      <path d="M30 140 H176" stroke="#8e5f36" stroke-width="8" stroke-linecap="round"/>
      <path d="M66 108 Q28 104 22 80 Q44 92 70 92Z" fill="#2f7fd0"/>
      <ellipse cx="100" cy="100" rx="42" ry="34" fill="#4aa3f0"/>
      <ellipse cx="110" cy="112" rx="24" ry="18" fill="#fff6c8"/>
      <path d="M78 96 Q96 82 112 104 Q92 120 78 96Z" fill="#2f7fd0"/>
      <circle cx="132" cy="68" r="24" fill="#4aa3f0"/>
      <path d="M152 64 L176 72 L152 80Z" fill="#ffb347"/>
      ${eye(138, 62, 5)}
      <path d="M126 46 Q130 34 140 36 Q134 40 136 46" fill="#2f7fd0"/>
      <path d="M92 134 v8 M108 134 v8" stroke="#ffb347" stroke-width="4" stroke-linecap="round"/>`,
    owl: () => `${shadow(100, 52)}
      <path d="M28 150 H172" stroke="#8e5f36" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="100" cy="98" rx="48" ry="52" fill="#a0704f"/>
      <path d="M58 58 L52 30 L78 48Z M142 58 L148 30 L122 48Z" fill="#a0704f"/>
      <ellipse cx="100" cy="118" rx="30" ry="28" fill="#e8cfa8"/>
      <path d="M86 108 q4 4 8 0 M106 108 q4 4 8 0 M90 124 q4 4 8 0 M102 124 q4 4 8 0" stroke="#c9a26b" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="76" r="20" fill="#fff6e0" stroke="#e0b97c" stroke-width="3"/><circle cx="120" cy="76" r="20" fill="#fff6e0" stroke="#e0b97c" stroke-width="3"/>
      ${eye(80, 78, 10)}${eye(120, 78, 10)}
      <path d="M94 92 L100 106 L106 92Z" fill="#ffb347"/>
      <path d="M52 100 Q44 130 70 146 M148 100 Q156 130 130 146" stroke="#7a4c32" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M84 148 v8 M94 148 v8 M106 148 v8 M116 148 v8" stroke="#ffb347" stroke-width="4" stroke-linecap="round"/>`,
    snow: () => `
      <rect x="6" y="6" width="188" height="158" rx="20" fill="#bfe4ff"/>
      <path d="M6 120 Q60 96 104 116 Q150 134 194 108 V144 Q194 164 174 164 H26 Q6 164 6 144Z" fill="#fff"/>
      <path d="M6 138 Q70 120 120 138 Q160 150 194 134" stroke="#dbeeff" stroke-width="6" fill="none"/>
      ${[[40, 34], [92, 24], [150, 40], [62, 74], [126, 76], [172, 86], [24, 96], [100, 54]].map(([x, y], i) => `<g stroke="#fff" stroke-width="${3 + (i % 2)}" stroke-linecap="round"><path d="M${x - 9} ${y} H${x + 9} M${x - 5} ${y - 8} L${x + 5} ${y + 8} M${x + 5} ${y - 8} L${x - 5} ${y + 8}"/></g>`).join('')}`,
    brown: () => splat('#8a5a3c', '#5e3b24'),
    yellow: () => splat('#ffd23e', '#e0a800'),
    car: () => `${shadow(100, 80)}
      <path d="M22 118 Q22 92 46 90 L64 62 Q70 54 82 54 H124 Q136 54 142 62 L160 90 Q180 92 180 118 V128 H22Z" fill="#e5484d"/>
      <path d="M72 66 Q76 60 84 60 H98 V90 H58Z M106 60 H120 Q128 60 132 66 L146 90 H106Z" fill="#bfe9ff"/>
      <rect x="18" y="112" width="166" height="18" rx="9" fill="#c23a40"/>
      <circle cx="60" cy="132" r="18" fill="#3b3247"/><circle cx="60" cy="132" r="7" fill="#d5dbe8"/>
      <circle cx="144" cy="132" r="18" fill="#3b3247"/><circle cx="144" cy="132" r="7" fill="#d5dbe8"/>
      <rect x="166" y="98" width="12" height="8" rx="3" fill="#fff6c8"/>`
  };

  function thing(id) {
    if (T[id]) return `<svg viewBox="0 0 200 170" aria-hidden="true" class="thing-svg" data-thing="${id}">${T[id]()}</svg>`;
    if (id === 'cow') return RexArt.animal('cow');
    if (id === 'shirt' || id === 'green') return RoboArt.thing(id);
    return JediArt.thing(id);
  }

  // ---------- 背景：雨後小鎮（viewBox 1600 900） ----------
  function town() {
    const bld = [[60, 520, 150, '#ffb3a7'], [230, 470, 120, '#ffd59e'], [370, 540, 140, '#a7d8ff'], [1080, 500, 130, '#c9b3ff'], [1230, 450, 150, '#ffb3d1'], [1400, 530, 140, '#b3ecc0']];
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="lgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4f5"/><stop offset="1" stop-color="#d9f0ff"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#lgsky)"/>
      <circle cx="1400" cy="140" r="70" fill="#fff3b0"/><circle cx="1400" cy="140" r="100" fill="#fff3b0" opacity=".3"/>
      <g fill="#fff" opacity=".9"><ellipse cx="300" cy="140" rx="110" ry="36"/><ellipse cx="360" cy="116" rx="70" ry="40"/><ellipse cx="900" cy="90" rx="90" ry="30"/><ellipse cx="950" cy="70" rx="56" ry="32"/></g>
      <ellipse cx="400" cy="760" rx="700" ry="200" fill="#9fd8a0"/>
      <ellipse cx="1300" cy="780" rx="700" ry="210" fill="#8fd18a"/>
      ${bld.map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${900 - y}" rx="14" fill="${c}"/>` +
        Array.from({ length: 6 }, (_, i) => `<rect x="${x + 22 + (i % 2) * (w / 2 - 6)}" y="${y + 30 + Math.floor(i / 2) * 70}" width="${w / 2 - 34}" height="40" rx="6" fill="#fff6d6" opacity=".9"/>`).join('')).join('')}
      <rect x="0" y="830" width="1600" height="70" fill="#7fc47a"/>
    </svg>`;
  }

  // ---------- HUD ----------
  // 屋仔：lit = 着咗燈
  const house = () => `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 28 L30 8 L52 28Z" fill="#e5484d"/><rect x="13" y="26" width="34" height="28" rx="3" fill="#ffe8c2"/><rect class="lg-win" x="18" y="32" width="12" height="11" rx="2"/><rect x="34" y="36" width="9" height="18" rx="2" fill="#b07a48"/></svg>`;
  const TEAM_COLS = { ow: '#6fd0ff', ew: '#7fd6a0', aw: '#ffb347', or: '#ff8fb8', ar: '#c78bff', ir: '#ffd36e' };
  function orb(team) {
    const c = TEAM_COLS[team] || '#fff';
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="${c}" opacity=".3"/>
      <circle cx="50" cy="50" r="38" fill="#fff" stroke="${c}" stroke-width="8"/>
      <circle cx="50" cy="50" r="30" fill="${c}" opacity=".35"/>
      <circle cx="36" cy="34" r="8" fill="#fff" opacity=".8"/>
    </svg>`;
  }
  // 光格（星）
  const cell = () => `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3 L25 14 L37 15 L28 23 L31 36 L20 29 L9 36 L12 23 L3 15 L15 14Z" fill="#fff6c8" stroke="#ffd23e" stroke-width="3" stroke-linejoin="round"/></svg>`;
  // 腳印（BB 怪獸行返屋企）
  const step = () => `<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="25" rx="11" ry="12" fill="#7fd67a"/><circle cx="10" cy="10" r="5" fill="#7fd67a"/><circle cx="20" cy="7" r="5" fill="#7fd67a"/><circle cx="30" cy="10" r="5" fill="#7fd67a"/></svg>`;
  // 怪獸屋企（山洞）
  const cave = () => `<svg viewBox="0 0 200 160" aria-hidden="true"><path d="M8 156 Q20 30 100 20 Q180 30 192 156Z" fill="#9c8a7a"/><path d="M50 156 Q56 70 100 66 Q144 70 150 156Z" fill="#4a3a36"/><path d="M8 156 H192" stroke="#7fc47a" stroke-width="8"/><circle cx="40" cy="60" r="6" fill="#b5a493"/><circle cx="160" cy="80" r="8" fill="#b5a493"/></svg>`;

  // ---------- 結局道具 ----------
  function bus() {
    return `<svg viewBox="0 0 220 120" aria-hidden="true">
      <rect x="6" y="14" width="208" height="84" rx="16" fill="#ffd23e" stroke="#e0a800" stroke-width="4"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 44}" y="26" width="34" height="30" rx="6" fill="#bfe9ff"/><circle cx="${37 + i * 44}" cy="44" r="8" fill="${SKIN}"/><path d="M${33 + i * 44} 46 q4 3 8 0" stroke="${INK}" stroke-width="2" fill="none"/>`).join('')}
      <rect x="196" y="26" width="12" height="40" rx="4" fill="#bfe9ff"/>
      <rect x="6" y="66" width="208" height="8" fill="#e5484d"/>
      <circle cx="50" cy="100" r="16" fill="${INK}"/><circle cx="50" cy="100" r="6" fill="#d5dbe8"/>
      <circle cx="170" cy="100" r="16" fill="${INK}"/><circle cx="170" cy="100" r="6" fill="#d5dbe8"/>
    </svg>`;
  }
  const raincloud = () => EndArt.cloud().replace('class="c-angry"', 'class="c-angry" display="none"').replace('class="c-happy"', 'class="c-happy" display="none"');

  // ---------- 主選單卡 + 貼紙 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#8fd0f5"/>
      <circle cx="160" cy="46" r="16" fill="#fff3b0"/>
      <path d="M8 130 Q100 110 192 130 L190 150 Q100 200 10 150Z" fill="#8fd18a"/>
      ${nest(happy(baby()), 112, 108, 74, 70)}
      ${nest(hero(), 18, 18, 116, 151)}
    </svg>`;
  }
  function sticker(id) {
    if (id === 'bus') return nest(bus(), 14, 34, 72, 40) + `<path d="M20 78 Q50 70 80 78" stroke="#fff6c8" stroke-width="5" fill="none" stroke-linecap="round"/>` + nest(EndArt.star('#ffe680'), 64, 12, 22, 22);
    if (id === 'volcano') return nest(EndArt.volcano().replace('class="v-lava"', 'class="v-lava" display="none"').replace('class="v-smoke"', 'class="v-smoke" display="none"').replace('class="v-angry"', 'class="v-angry" display="none"'), 10, 22, 80, 64);
    if (id === 'city') return nest(EndArt.building(), 18, 22, 30, 64) + nest(EndArt.building(), 52, 30, 26, 56) + nest(EndArt.star('#ffb3c7'), 46, 8, 20, 20) + nest(EndArt.star('#9fd3ff'), 70, 14, 16, 16) + nest(EndArt.star('#ffe680'), 16, 10, 16, 16);
    // gold：金色光之巨人
    return nest(hero('gold'), 26, 10, 48, 62) + nest(EndArt.star('#ffe680'), 10, 18, 18, 18) + nest(EndArt.star('#fff6c8'), 72, 14, 16, 16) + nest(EndArt.star('#ffe680'), 70, 62, 18, 18);
  }

  return { hero, baby, happy, thing, town, house, orb, TEAM_COLS, cell, step, cave, bus, raincloud, icon, sticker, TYPES };
})();
