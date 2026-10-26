/*
 * Jedi Luca 大戰 Sith：全部原創 SVG（唔用任何官方圖）
 * - 角色：Jedi Luca（藍光劍）、Sith 機械人、Sith Lord（紅光劍，變好人會變藍）
 * - 23 樣嘢嘅圖（viewBox 0 0 200 170，同 Super Rex 動物一樣；dog / frog / duck / fish 借 RexArt）
 * - 結局：Sith 黑暗星、Jedi 戰機
 * 光劍顏色用 CSS 變數：--blade（Luca）、--sblade（Sith Lord）
 */
const JediArt = (() => {
  const INK = '#3b3247';
  const SKIN = '#f6cfae';
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const nest = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const shadow = (cx, rx, y) => `<ellipse cx="${cx}" cy="${y || 163}" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;

  // 光劍：(x, y) 係手，ang = 由垂直向上順時針轉幾度
  function saber(x, y, ang, cls, colorVar, len) {
    len = len || 104;
    colorVar = colorVar + ', ' + (colorVar === '--blade' ? '#6fd0ff' : '#ff4d5e');   // 主選單 / 貼紙冇 CSS 變數都有顏色
    return `<g class="${cls}" transform="translate(${x} ${y}) rotate(${ang})">
      <g class="${cls}-blade">
        <rect x="-10" y="${-len - 10}" width="20" height="${len + 6}" rx="10" fill="var(${colorVar})" opacity=".35"/>
        <rect x="-5.5" y="${-len - 4}" width="11" height="${len}" rx="5.5" fill="var(${colorVar})"/>
        <rect x="-2.2" y="${-len - 1}" width="4.4" height="${len - 6}" rx="2.2" fill="#fff" opacity=".9"/>
      </g>
      <rect x="-6" y="-6" width="12" height="28" rx="3" fill="#a7adba"/>
      <rect x="-7" y="-2" width="14" height="4" fill="${INK}"/><rect x="-7" y="8" width="14" height="3" fill="${INK}"/>
      <rect x="-4" y="16" width="8" height="5" fill="#6d6476"/>
    </g>`;
  }

  // ---------- Jedi Luca（viewBox 0 0 200 260，面向右） ----------
  function luca() {
    return `<svg viewBox="0 0 200 260" aria-hidden="true" class="jl-svg">
      <ellipse cx="100" cy="250" rx="62" ry="8" fill="#000" opacity=".12"/>
      <rect x="80" y="212" width="17" height="36" rx="7" fill="#5a3a24"/>
      <rect x="104" y="212" width="17" height="36" rx="7" fill="#5a3a24"/>
      <path d="M58 118 Q100 100 142 118 L158 234 Q100 246 42 234Z" fill="#8a5a3c"/>
      <path d="M82 114 L118 114 L130 230 L70 230Z" fill="#f1e2c4"/>
      <path d="M86 114 L100 142 L114 114" stroke="#d8c49c" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <rect x="72" y="170" width="56" height="11" rx="3" fill="#6b4429"/>
      <rect x="94" y="168" width="12" height="15" rx="3" fill="#d9a46c"/>
      <ellipse cx="62" cy="150" rx="11" ry="26" transform="rotate(14 62 150)" fill="#8a5a3c"/>
      <circle cx="57" cy="174" r="9" fill="${SKIN}"/>
      <g class="jl-arm">
        <ellipse cx="146" cy="136" rx="11" ry="24" transform="rotate(-48 146 136)" fill="#8a5a3c"/>
        ${saber(162, 150, 32, 'jl-saber', '--blade', 112)}
        <circle cx="162" cy="150" r="9.5" fill="${SKIN}"/>
      </g>
      <rect x="90" y="104" width="20" height="14" fill="${SKIN}"/>
      <g class="jl-head">
        <circle cx="100" cy="74" r="40" fill="${SKIN}"/>
        <path d="M59 72 Q56 30 100 29 Q144 30 141 72 Q133 52 120 55 Q110 43 97 53 Q80 45 71 60 Q63 62 59 72Z" fill="#5a3a24"/>
        <ellipse cx="60" cy="80" rx="6" ry="9" fill="${SKIN}"/><ellipse cx="140" cy="80" rx="6" ry="9" fill="${SKIN}"/>
        ${eye(86, 80, 5.5)}${eye(116, 80, 5.5)}
        <circle cx="76" cy="94" r="7" fill="#ff8fa8" opacity=".45"/><circle cx="126" cy="94" r="7" fill="#ff8fa8" opacity=".45"/>
        <path class="jl-smile" d="M90 96 Q101 106 112 96" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path class="jl-shout" display="none" d="M90 95 Q101 112 112 95Z" fill="#b0506a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  // ---------- Sith 機械人（viewBox 0 0 100 100） ----------
  function droid() {
    return `<svg viewBox="0 0 100 100" aria-hidden="true" class="dr-svg">
      <path d="M38 22 L30 4 M62 22 L72 6" stroke="#6d6476" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="30" cy="4" r="3.5" fill="#ff4d5e"/><circle cx="72" cy="6" r="3.5" fill="#ff4d5e"/>
      <path d="M36 70 L28 90 M50 74 L50 96 M64 70 L72 90" stroke="#6d6476" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="46" r="30" fill="#3b3247"/>
      <path d="M22 50 Q50 60 78 50" stroke="#55496a" stroke-width="5" fill="none"/>
      <path d="M32 26 Q42 18 54 18" stroke="#6d6476" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle class="dr-eye" cx="50" cy="44" r="11" fill="#ff4d5e"/>
      <circle cx="50" cy="44" r="4.5" fill="#ffd0d6"/>
      <circle cx="47" cy="41" r="2" fill="#fff"/>
    </svg>`;
  }

  // ---------- Sith Lord（viewBox 0 0 200 260，面向左；.sl-angry / .sl-happy 由 CSS 切換） ----------
  function sith() {
    return `<svg viewBox="0 0 200 260" aria-hidden="true" class="sl-svg">
      <ellipse cx="100" cy="250" rx="70" ry="8" fill="#000" opacity=".12"/>
      <path d="M50 112 Q100 88 150 112 L172 240 Q100 254 28 240Z" fill="#2b2433"/>
      <path d="M100 120 L100 236" stroke="#3d3348" stroke-width="5"/>
      <rect x="70" y="168" width="60" height="10" rx="3" fill="#55496a"/>
      <rect x="92" y="165" width="16" height="16" rx="3" fill="#a7adba"/>
      <ellipse cx="150" cy="150" rx="12" ry="26" transform="rotate(-12 150 150)" fill="#2b2433"/>
      <g class="sl-arm">
        <ellipse cx="60" cy="138" rx="12" ry="25" transform="rotate(46 60 138)" fill="#2b2433"/>
        ${saber(42, 152, -30, 'sl-saber', '--sblade', 112)}
        <circle cx="42" cy="152" r="9.5" fill="#d9cbd8"/>
      </g>
      <path d="M50 96 Q46 26 100 24 Q154 26 150 96 L142 116 Q100 126 58 116Z" fill="#2b2433"/>
      <ellipse cx="100" cy="82" rx="38" ry="38" fill="#1b1622"/>
      <ellipse cx="100" cy="86" rx="31" ry="30" fill="#d9cbd8"/>
      <g class="sl-angry">
        <path d="M74 70 L94 78 M126 70 L106 78" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
        <circle cx="87" cy="86" r="7" fill="#ffd23e" stroke="#ff5a5a" stroke-width="2.2"/><circle cx="87" cy="86" r="3" fill="${INK}"/>
        <circle cx="113" cy="86" r="7" fill="#ffd23e" stroke="#ff5a5a" stroke-width="2.2"/><circle cx="113" cy="86" r="3" fill="${INK}"/>
        <path d="M88 106 Q100 98 112 106" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      </g>
      <g class="sl-happy" display="none">
        <path d="M80 86 Q87 78 94 86 M106 86 Q113 78 120 86" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <circle cx="78" cy="98" r="6" fill="#ff8fa8" opacity=".55"/><circle cx="122" cy="98" r="6" fill="#ff8fa8" opacity=".55"/>
        <path d="M88 101 Q100 114 112 101" stroke="${INK}" stroke-width="4.5" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  // ---------- 23 樣嘢（viewBox 0 0 200 170） ----------
  const T = {
    hand: () => `${shadow(100, 46)}
      <rect x="62" y="34" width="18" height="76" rx="9" fill="#e9a77e"/>
      <rect x="83" y="18" width="18" height="90" rx="9" fill="#e9a77e"/>
      <rect x="104" y="22" width="18" height="86" rx="9" fill="#e9a77e"/>
      <rect x="125" y="38" width="16" height="70" rx="8" fill="#e9a77e"/>
      <rect x="140" y="82" width="17" height="52" rx="8.5" transform="rotate(48 148 108)" fill="#e9a77e"/>
      <rect x="60" y="76" width="84" height="80" rx="34" fill="#e9a77e"/>
      <path d="M78 116 Q96 128 120 112" stroke="#c98560" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M71 40 h0 M92 24 h0 M113 28 h0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`,
    bed: () => `${shadow(100, 80)}
      <rect x="22" y="40" width="20" height="120" rx="6" fill="#b07a4a"/>
      <rect x="160" y="84" width="18" height="76" rx="6" fill="#b07a4a"/>
      <rect x="34" y="98" width="134" height="32" rx="6" fill="#fff" stroke="#e2dccf" stroke-width="3"/>
      <rect x="80" y="92" width="88" height="44" rx="10" fill="#8fbdf0"/>
      <path d="M84 106 h80 M84 120 h80" stroke="#6fa0d8" stroke-width="3"/>
      <ellipse cx="60" cy="92" rx="22" ry="12" fill="#fff" stroke="#e2dccf" stroke-width="3"/>
      <rect x="40" y="130" width="8" height="28" fill="#8e5f36"/><rect x="152" y="130" width="8" height="28" fill="#8e5f36"/>`,
    bath: () => `${shadow(100, 70)}
      <path d="M42 78 V34 Q42 20 56 20 Q70 20 70 34 V40" stroke="#c96a6a" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="44" r="6" fill="#c96a6a"/>
      <circle cx="96" cy="66" r="9" fill="#fff" opacity=".9"/><circle cx="112" cy="58" r="6" fill="#fff" opacity=".9"/><circle cx="124" cy="68" r="8" fill="#fff" opacity=".9"/>
      <path d="M28 84 H172 Q172 138 128 146 H72 Q28 138 28 84Z" fill="#4f9ee0"/>
      <rect x="20" y="76" width="160" height="14" rx="7" fill="#fff" stroke="#dfe6ef" stroke-width="3"/>
      <path d="M40 98 Q44 128 74 136" stroke="#8cc3f0" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="62" cy="152" rx="10" ry="7" fill="#d9a46c"/><ellipse cx="138" cy="152" rx="10" ry="7" fill="#d9a46c"/>`,
    pen: () => `${shadow(100, 66)}<g transform="rotate(-32 100 88)">
      <path d="M26 79 L8 88 L26 97Z" fill="#f0e0c0"/><path d="M14 85 L8 88 L14 91Z" fill="${INK}"/>
      <rect x="26" y="77" width="112" height="22" rx="8" fill="#3b6fd8"/>
      <rect x="40" y="77" width="10" height="22" fill="#2a52a8" opacity=".5"/>
      <rect x="132" y="74" width="40" height="28" rx="9" fill="#2a52a8"/>
      <rect x="140" y="66" width="30" height="7" rx="3" fill="#a7adba"/>
    </g>`,
    crayon: () => `${shadow(100, 66)}<g transform="rotate(-38 100 88)">
      <path d="M34 75 L6 88 L34 101Z" fill="#e8a33c"/><path d="M14 84 L6 88 L14 92Z" fill="#c4781c"/>
      <rect x="34" y="75" width="122" height="26" rx="5" fill="#f2b44f"/>
      <rect x="52" y="75" width="8" height="26" fill="${INK}" opacity=".7"/>
      <rect x="132" y="75" width="8" height="26" fill="${INK}" opacity=".7"/>
      <ellipse cx="96" cy="88" rx="24" ry="8" fill="none" stroke="${INK}" stroke-width="3" opacity=".6"/>
      <rect x="152" y="75" width="12" height="26" rx="4" fill="#e8a33c"/>
    </g>`,
    socks: () => `${shadow(100, 74)}${sockShape(-28, 0, '#4fb0d8')}${sockShape(34, 8, '#ffb347')}`,
    sock: () => `${shadow(100, 50)}${sockShape(4, 0, '#4fb0d8')}`,
    shoes: () => `${shadow(100, 86)}${shoeShape(-22, -14, .82, '#d84848')}${shoeShape(10, 10, .9, '#e85858')}`,
    lamp: () => `${shadow(100, 48)}
      <ellipse cx="96" cy="152" rx="40" ry="11" fill="#2e8b7a"/>
      <path d="M96 150 L74 96 L118 58" stroke="#2e8b7a" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="74" cy="96" r="7" fill="#256f62"/>
      <circle cx="146" cy="88" r="11" fill="#ffe680"/>
      <path d="M104 40 L150 22 L180 74 Q148 98 112 92Z" fill="#4caf72"/>
      <path d="M112 92 Q148 98 180 74" stroke="#3a8e5a" stroke-width="5" fill="none"/>`,
    desk: () => `${shadow(100, 86)}
      <rect x="132" y="22" width="22" height="26" rx="4" fill="#8fbdf0"/>
      <path d="M138 22 L134 6 M146 22 L150 8" stroke="#e85858" stroke-width="4" stroke-linecap="round"/>
      <rect x="40" y="38" width="44" height="10" rx="2" fill="#e85858"/><rect x="44" y="30" width="40" height="8" rx="2" fill="#ffd36e"/>
      <rect x="14" y="48" width="172" height="16" rx="4" fill="#b07a4a"/>
      <rect x="22" y="64" width="12" height="94" rx="3" fill="#8e5f36"/>
      <rect x="114" y="64" width="64" height="94" rx="4" fill="#c99260"/>
      <rect x="120" y="72" width="52" height="24" rx="3" fill="#d9a46c"/><rect x="120" y="102" width="52" height="24" rx="3" fill="#d9a46c"/><rect x="120" y="132" width="52" height="22" rx="3" fill="#d9a46c"/>
      <circle cx="146" cy="84" r="3.5" fill="${INK}"/><circle cx="146" cy="114" r="3.5" fill="${INK}"/><circle cx="146" cy="143" r="3.5" fill="${INK}"/>`,
    dress: () => `${shadow(100, 56)}
      <path d="M80 18 H120 L128 36 L152 48 L142 74 L128 66 L152 158 H48 L72 66 L58 74 L48 48 L72 36Z" fill="#ff7aa8"/>
      <path d="M86 18 Q100 32 114 18" fill="#fff"/>
      <rect x="70" y="68" width="60" height="9" rx="4" fill="#e04878"/>
      <path d="M48 158 Q62 150 76 158 Q90 150 104 158 Q118 150 132 158 Q144 150 152 158" stroke="#e04878" stroke-width="4" fill="none"/>
      <circle cx="100" cy="100" r="5" fill="#fff" opacity=".7"/><circle cx="82" cy="126" r="5" fill="#fff" opacity=".7"/><circle cx="120" cy="130" r="5" fill="#fff" opacity=".7"/>`,
    skirt: () => `${shadow(100, 80)}
      <path d="M58 56 H142 L190 116 Q100 140 10 116Z" fill="#ff9cbf"/>
      <path d="M62 56 H138 L176 104 Q100 124 24 104Z" fill="#ffb8d2"/>
      <path d="M10 116 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 2 q10 10 20 -4" stroke="#ff7aa8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="56" y="40" width="88" height="18" rx="6" fill="#e04878"/>`,
    clock: () => `${shadow(100, 60)}
      <circle cx="52" cy="34" r="20" fill="#e85858"/><circle cx="148" cy="34" r="20" fill="#e85858"/>
      <rect x="94" y="14" width="12" height="16" rx="4" fill="#a7adba"/>
      <path d="M60 140 L46 160 M140 140 L154 160" stroke="#c94848" stroke-width="9" stroke-linecap="round"/>
      <circle cx="100" cy="90" r="60" fill="#e85858"/>
      <circle cx="100" cy="90" r="48" fill="#fff"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i * Math.PI / 6; return `<circle cx="${(100 + Math.sin(a) * 40).toFixed(1)}" cy="${(90 - Math.cos(a) * 40).toFixed(1)}" r="${i % 3 ? 2.5 : 4}" fill="${INK}"/>`; }).join('')}
      <path d="M100 90 V60 M100 90 L122 100" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="100" cy="90" r="5" fill="${INK}"/>`,
    watch: () => `${shadow(100, 40)}
      <rect x="80" y="4" width="40" height="160" rx="12" fill="#c0473f"/>
      <path d="M86 20 h28 M86 30 h28 M86 136 h28 M86 146 h28" stroke="#9b3530" stroke-width="3"/>
      <rect x="146" y="78" width="12" height="14" rx="3" fill="#8b8d99"/>
      <circle cx="100" cy="85" r="48" fill="#8b8d99"/>
      <circle cx="100" cy="85" r="39" fill="#fff"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i * Math.PI / 6; return `<rect x="-1.5" y="-34" width="3" height="${i % 3 ? 5 : 9}" fill="${INK}" transform="translate(100 85) rotate(${i * 30})"/>`; }).join('')}
      <path d="M100 85 V60 M100 85 L118 94" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M100 85 L84 108" stroke="#e85858" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="100" cy="85" r="4" fill="${INK}"/>`,
    truck: () => `${shadow(100, 90)}
      <rect x="8" y="42" width="124" height="84" rx="6" fill="#e85858"/>
      <path d="M20 54 h100" stroke="#ff8a8a" stroke-width="4"/>
      <path d="M136 62 H168 L190 92 V126 H136Z" fill="#d84848"/>
      <path d="M144 70 H166 L180 92 H144Z" fill="#bfe6ff"/>
      <rect x="182" y="110" width="10" height="10" rx="2" fill="#ffd36e"/>
      <rect x="6" y="124" width="188" height="10" rx="4" fill="#5c5566"/>
      ${[38, 76, 160].map((x) => `<circle cx="${x}" cy="136" r="17" fill="${INK}"/><circle cx="${x}" cy="136" r="7" fill="#c7c9d3"/>`).join('')}`,
    doll: () => `${shadow(100, 44)}
      <circle cx="64" cy="48" r="16" fill="#ffd36e"/><circle cx="136" cy="48" r="16" fill="#ffd36e"/>
      <path d="M70 120 L48 96 M130 120 L152 96" stroke="#f6cfae" stroke-width="11" stroke-linecap="round"/>
      <path d="M86 150 V162 M114 150 V162" stroke="#f6cfae" stroke-width="11" stroke-linecap="round"/>
      <ellipse cx="86" cy="164" rx="10" ry="6" fill="#e04848"/><ellipse cx="114" cy="164" rx="10" ry="6" fill="#e04848"/>
      <path d="M78 80 H122 L144 152 H56Z" fill="#ff7aa8"/>
      <path d="M56 152 Q70 144 84 152 Q100 144 116 152 Q130 144 144 152" stroke="#fff" stroke-width="4" fill="none"/>
      <rect x="80" y="80" width="40" height="22" rx="6" fill="#ffd36e"/>
      <circle cx="100" cy="52" r="30" fill="${SKIN}"/>
      <path d="M70 50 Q70 20 100 20 Q130 20 130 50 Q120 34 100 36 Q80 34 70 50Z" fill="#ffd36e"/>
      ${eye(89, 56, 4.5)}${eye(111, 56, 4.5)}
      <circle cx="82" cy="66" r="5" fill="#ff8fa8" opacity=".55"/><circle cx="118" cy="66" r="5" fill="#ff8fa8" opacity=".55"/>
      <path d="M93 68 Q100 74 107 68" stroke="#d24a6a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    ship: () => `
      <path d="M0 150 q16 -10 33 0 q16 -10 33 0 q16 -10 33 0 q16 -10 33 0 q16 -10 33 0 q16 -10 35 0 V170 H0Z" fill="#8fd0f5"/>
      <rect x="94" y="22" width="16" height="34" rx="3" fill="#e85858"/><rect x="94" y="22" width="16" height="7" fill="${INK}"/>
      <rect x="118" y="30" width="14" height="26" rx="3" fill="#e85858"/><rect x="118" y="30" width="14" height="6" fill="${INK}"/>
      <rect x="66" y="54" width="82" height="26" rx="4" fill="#fff" stroke="#dfe6ef" stroke-width="3"/>
      <rect x="40" y="78" width="134" height="30" rx="4" fill="#fff" stroke="#dfe6ef" stroke-width="3"/>
      ${[56, 76, 96, 116, 136, 156].map((x) => `<circle cx="${x}" cy="93" r="5" fill="#4f9ee0"/>`).join('')}
      ${[80, 98, 116, 134].map((x) => `<rect x="${x}" y="62" width="10" height="9" rx="2" fill="#4f9ee0"/>`).join('')}
      <path d="M14 106 H192 L170 148 H40Z" fill="#3b6fd8"/>
      <path d="M22 116 H186" stroke="#e85858" stroke-width="6"/>`,
    sand: () => `
      <ellipse cx="100" cy="156" rx="96" ry="14" fill="#f3d79a"/>
      <path d="M100 18 V42" stroke="#8e5f36" stroke-width="3"/><path d="M100 18 L124 25 L100 32Z" fill="#e85858"/>
      <rect x="34" y="70" width="34" height="86" rx="3" fill="#e2b866"/>
      <rect x="132" y="70" width="34" height="86" rx="3" fill="#e2b866"/>
      <rect x="64" y="96" width="72" height="60" fill="#e8c27a"/>
      <rect x="82" y="42" width="36" height="114" rx="3" fill="#ecc985"/>
      ${[[34, 62], [48, 62], [60, 62], [132, 62], [146, 62], [158, 62], [82, 34], [96, 34], [110, 34]].map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="10" fill="#e2b866"/>`).join('')}
      <path d="M88 156 V132 Q100 118 112 132 V156Z" fill="#9c6f3c"/>
      <circle cx="51" cy="96" r="5" fill="#9c6f3c"/><circle cx="149" cy="96" r="5" fill="#9c6f3c"/>
      <path d="M176 156 L170 120" stroke="#3b6fd8" stroke-width="4"/><path d="M164 112 h14 l-3 12 h-8Z" fill="#3b6fd8"/>`,
    swim: () => `
      <circle cx="40" cy="60" r="5" fill="#8fd0f5"/><circle cx="26" cy="74" r="4" fill="#8fd0f5"/><circle cx="168" cy="70" r="5" fill="#8fd0f5"/>
      <path d="M86 98 Q60 52 34 80" stroke="${SKIN}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <circle cx="116" cy="84" r="26" fill="${SKIN}"/>
      <path d="M90 82 Q92 56 116 56 Q140 56 142 82 Z" fill="#ff8a3d"/>
      <rect x="96" y="80" width="40" height="12" rx="6" fill="#3b6fd8"/>
      <circle cx="106" cy="86" r="6" fill="#bfe6ff" stroke="#3b6fd8" stroke-width="3"/><circle cx="126" cy="86" r="6" fill="#bfe6ff" stroke="#3b6fd8" stroke-width="3"/>
      <ellipse cx="116" cy="102" rx="6" ry="4" fill="#b0506a"/>
      <path d="M0 104 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 q20 -14 40 0 V170 H0Z" fill="#4f9ee0"/>
      <path d="M0 132 q20 -12 40 0 q20 -12 40 0 q20 -12 40 0 q20 -12 40 0 q20 -12 40 0" stroke="#8fd0f5" stroke-width="5" fill="none"/>`
  };

  function sockShape(dx, dy, col) {
    return `<g transform="translate(${dx} ${dy})">
      <path d="M74 18 H112 V98 Q112 106 120 112 L146 130 Q158 140 148 150 Q140 158 126 152 L80 122 Q72 116 72 104 V18Z" fill="${col}"/>
      <rect x="70" y="14" width="46" height="18" rx="5" fill="#eef2f7"/>
      <path d="M72 50 h40 M72 64 h40" stroke="#fff" stroke-width="5" opacity=".6"/>
      <path d="M130 140 Q144 136 146 148" stroke="#e85858" stroke-width="8" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  function shoeShape(dx, dy, s, col) {
    return `<g transform="translate(${dx} ${dy}) translate(100 120) scale(${s}) translate(-100 -120)">
      <path d="M22 128 Q20 98 46 92 L92 62 Q112 52 124 70 L132 92 Q172 98 180 122 V134 H22Z" fill="${col}"/>
      <path d="M22 122 H180 V136 Q180 146 168 146 H32 Q22 146 22 136Z" fill="#fff" stroke="#dfe6ef" stroke-width="3"/>
      <ellipse cx="160" cy="118" rx="18" ry="9" fill="#fff"/>
      <path d="M98 74 L114 86 M90 82 L108 94 M82 90 L100 102" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M46 100 L38 112" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M64 104 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1z" fill="#fff"/>
    </g>`;
  }

  function thing(id) {
    if (!T[id]) return RexArt.animal(id);
    return `<svg viewBox="0 0 200 170" aria-hidden="true" class="thing-svg" data-thing="${id}">${T[id]()}</svg>`;
  }

  // ---------- 剔 / 交叉 ----------
  const tick = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 54 L42 78 L84 24" stroke="#36b37e" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const cross = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 24 L76 76 M76 24 L24 76" stroke="#e5484d" stroke-width="15" fill="none" stroke-linecap="round"/></svg>`;
  const heart = () => `<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M50 84 C10 56 4 34 14 20 C26 4 46 8 50 26 C54 8 74 4 86 20 C96 34 90 56 50 84Z" fill="#ff5a6e" stroke="#fff" stroke-width="6"/></svg>`;

  // ---------- 結局：黑暗星 / Jedi 戰機 ----------
  function darkStar() {
    let spikes = '';
    for (let i = 0; i < 12; i++) spikes += `<path d="M96 6 L100 -10 L104 6Z" fill="#4a4258" transform="rotate(${i * 30} 100 100)"/>`;
    return `<svg viewBox="-12 -12 224 224" aria-hidden="true" class="ds-svg">
      ${spikes}
      <circle cx="100" cy="100" r="88" fill="#5a5168"/>
      <path d="M14 108 Q100 124 186 108" stroke="#3d3548" stroke-width="7" fill="none"/>
      ${[[50, 140], [80, 160], [120, 150], [150, 130], [140, 70], [60, 40], [110, 36]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="6" rx="2" fill="#7a7088"/>`).join('')}
      <circle cx="72" cy="72" r="28" fill="#3d3548"/>
      <circle class="ds-eye" cx="72" cy="72" r="13" fill="#ff4d5e"/>
      <g class="ds-angry"><path d="M118 70 L144 80 M170 70 L148 80" stroke="#2b2433" stroke-width="6" stroke-linecap="round"/></g>
      <g class="ds-crack" opacity="0" stroke="#ffd36e" stroke-width="5" fill="none" stroke-linecap="round">
        <path class="c1" d="M100 100 L120 84 L130 92 L150 76"/>
        <path class="c2" d="M100 100 L86 124 L98 134 L88 160"/>
        <path class="c3" d="M100 100 L132 118 L144 140"/>
      </g>
    </svg>`;
  }
  function fighter() {
    return `<svg viewBox="0 0 220 130" aria-hidden="true" class="sf-svg">
      <path d="M86 58 L54 8 H74 L118 56Z" fill="#dfe6ef"/><path d="M60 8 h14 l-2 8 h-12z" fill="#e85858"/>
      <path d="M86 72 L54 122 H74 L118 74Z" fill="#c8d1de"/><path d="M60 122 h14 l-2 -8 h-12z" fill="#e85858"/>
      <circle class="sf-flame" cx="26" cy="65" r="13" fill="#ffb347"/>
      <path d="M30 52 L160 52 Q206 58 210 65 Q206 72 160 78 L30 78Z" fill="#eef2f7" stroke="#c8d1de" stroke-width="3"/>
      <path d="M40 65 H170" stroke="#3b6fd8" stroke-width="5"/>
      <ellipse cx="140" cy="62" rx="22" ry="10" fill="#6fd0ff" stroke="#3b6fd8" stroke-width="3"/>
      <circle cx="144" cy="60" r="7" fill="${SKIN}"/><path d="M137 58 Q144 50 151 58" fill="#5a3a24"/>
      <rect x="24" y="54" width="12" height="22" rx="3" fill="#a7adba"/>
    </svg>`;
  }

  // ---------- 主選單卡 + 貼紙 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#2c2a5c"/>
      ${[[40, 40], [160, 32], [150, 150], [30, 130], [100, 22], [176, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c8"/>`).join('')}
      ${nest(droid(), 128, 30, 58, 58)}
      ${nest(luca(), 14, 30, 136, 176)}
    </svg>`;
  }
  function sticker(id) {
    if (id === 'droids') return nest(droid(), 50, 18, 40, 40) + nest(droid(), 56, 52, 32, 32) + saberIcon(30, 84, 20, '#6fd0ff');
    if (id === 'ship') return nest(fighter(), 8, 30, 84, 50) + `<circle cx="22" cy="24" r="3" fill="#ffd36e"/><circle cx="80" cy="20" r="3.5" fill="#ffd36e"/><circle cx="74" cy="84" r="3" fill="#ffd36e"/>`;
    return nest(sith().replace('class="sl-angry"', 'class="sl-angry" display="none"').replace('class="sl-happy" display="none"', 'class="sl-happy"').replace(/var\(--sblade[^)]*\)/g, '#6fd0ff'), 18, 10, 64, 84);
  }
  function saberIcon(x, y, ang, col) {
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="-3" y="-60" width="6" height="56" rx="3" fill="${col}"/><rect x="-1" y="-58" width="2" height="52" fill="#fff"/><rect x="-3.5" y="-4" width="7" height="16" rx="2" fill="#a7adba"/></g>`;
  }
  // 背景：太空 + 星星 + 星球
  function space() {
    let stars = '';
    for (let i = 0; i < 70; i++) {
      const x = (i * 137.5) % 1600, y = (i * 71.3) % 620, r = 1.2 + (i % 4) * .7;
      stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="#fff6c8" opacity="${.45 + (i % 3) * .2}"/>`;
    }
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="jdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1b4b"/><stop offset="1" stop-color="#4a3a86"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#jdsky)"/>
      <g class="jd-stars">${stars}</g>
      <circle cx="1380" cy="150" r="70" fill="#f2a65a"/><path d="M1300 160 Q1380 120 1460 140" stroke="#ffd09a" stroke-width="10" fill="none" opacity=".7"/>
      <circle cx="230" cy="120" r="28" fill="#8fd0f5" opacity=".8"/>
      <ellipse cx="800" cy="1010" rx="1100" ry="260" fill="#6b5aa8"/>
      <ellipse cx="800" cy="1030" rx="1100" ry="250" fill="#7d6bb8"/>
      <circle cx="380" cy="800" r="18" fill="#6b5aa8"/><circle cx="1180" cy="820" r="26" fill="#6b5aa8"/><circle cx="940" cy="790" r="12" fill="#6b5aa8"/>
    </svg>`;
  }

  return { luca, droid, sith, thing, tick, cross, heart, darkStar, fighter, icon, sticker, space, nest };
})();
