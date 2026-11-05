/*
 * Jedi + Sith 大戰 Mecha-Rex：全部原創 SVG（唔用任何官方圖）
 * - 角色：Sith Luca（Jedi Luca 換黑袍 + 紅光劍）、Mecha-Rex（機械恐龍）、baby droid
 * - 方位場景（viewBox 0 0 240 170）：box / table / rock / trees + baby droid 擺唔同位置
 * - 25 樣嘢嘅圖（viewBox 0 0 200 170，同 JediArt 一樣）：VCe 字、陷阱圖、magic e 變身
 * - 結局：降落傘、紅色戰機
 */
const MechaArt = (() => {
  const INK = '#3b3247';
  const SKIN = '#f6cfae';
  const nest = JediArt.nest;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const shadow = (cx, rx, y) => `<ellipse cx="${cx}" cy="${y || 163}" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;

  // ---------- 主角 ----------
  const jedi = () => JediArt.luca();
  // Sith Luca：同一個 Luca，黑袍 + 紅光劍（光劍顏色由 CSS --blade 決定，冇 CSS 時用紅色）
  function sith() {
    return JediArt.luca()
      .replace(/#8a5a3c/g, '#2b2433').replace(/#f1e2c4/g, '#4b3f5e').replace(/#d8c49c/g, '#6d5f80')
      .replace(/#6b4429/g, '#1b1622').replace(/#d9a46c/g, '#a7adba')
      .replace(/var\(--blade, #6fd0ff\)/g, 'var(--blade, #ff4d5e)');
  }

  // ---------- Baby droid（viewBox 0 0 100 100） ----------
  function baby(col) {
    col = col || '#ffd36e';
    return `<svg viewBox="0 0 100 100" aria-hidden="true" class="bb-svg">
      <path d="M50 24 V9" stroke="#a7adba" stroke-width="3.5" stroke-linecap="round"/>
      <circle class="bb-bulb" cx="50" cy="8" r="5.5" fill="${col}"/>
      <ellipse cx="37" cy="92" rx="9" ry="5" fill="#a7adba"/><ellipse cx="63" cy="92" rx="9" ry="5" fill="#a7adba"/>
      <circle cx="17" cy="58" r="7" fill="#dfe6ef"/><circle cx="83" cy="58" r="7" fill="#dfe6ef"/>
      <circle cx="50" cy="56" r="32" fill="#fff" stroke="#dfe6ef" stroke-width="3"/>
      <path d="M21 68 Q50 80 79 68" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="30" y="37" width="40" height="25" rx="12.5" fill="#2c3550"/>
      <circle class="bb-eye" cx="50" cy="49.5" r="7.5" fill="#6fd0ff"/>
      <circle cx="52.5" cy="47" r="2.6" fill="#fff"/>
      <circle cx="31" cy="66" r="4" fill="#ff8fa8" opacity=".5"/><circle cx="69" cy="66" r="4" fill="#ff8fa8" opacity=".5"/>
    </svg>`;
  }
  const BABY_COLS = ['#ffd36e', '#ff8fb8', '#7fd6a0', '#9fb8ff', '#ffb347'];

  // ---------- Mecha-Rex（viewBox 0 0 260 240，面向左；.mr-angry / .mr-happy 由 CSS 切換） ----------
  function rex() {
    let plates = '';
    [[118, 84], [140, 80], [162, 84], [182, 94], [200, 108]].forEach(([x, y], i) => {
      plates += `<path d="M${x - 10} ${y + 8} L${x} ${y - 14 + i} L${x + 10} ${y + 8}Z" fill="#ff8a3d" stroke="#d96a22" stroke-width="2"/>`;
    });
    let teethUp = '', teethDn = '';
    for (let x = 30; x <= 92; x += 10) teethUp += `<path d="M${x} 96 L${x + 5} 106 L${x + 10} 96Z" fill="#fff"/>`;
    for (let x = 34; x <= 86; x += 10) teethDn += `<path d="M${x} 112 L${x + 5} 102 L${x + 10} 112Z" fill="#fff"/>`;
    return `<svg viewBox="0 0 260 240" aria-hidden="true" class="mr-svg">
      <ellipse cx="140" cy="232" rx="92" ry="8" fill="#000" opacity=".14"/>
      <path d="M176 112 Q232 104 256 150 Q226 140 184 158Z" fill="#7d8597"/>
      <path d="M232 128 l8 -4 M244 140 l8 -2" stroke="#5c6375" stroke-width="4" stroke-linecap="round"/>
      <rect x="164" y="160" width="22" height="58" rx="9" fill="#6b7385"/>
      <path d="M156 218 H198 Q200 226 192 228 H156Z" fill="#5c6375"/>
      ${plates}
      <ellipse cx="146" cy="134" rx="64" ry="50" fill="#8b93a7"/>
      <ellipse cx="124" cy="146" rx="34" ry="30" fill="#b9c0cf"/>
      <circle class="mr-light l1" cx="112" cy="140" r="6" fill="#ff4d5e"/>
      <circle class="mr-light l2" cx="128" cy="134" r="6" fill="#ffd36e"/>
      <circle class="mr-light l3" cx="128" cy="154" r="6" fill="#7fd6a0"/>
      ${[[170, 116], [186, 140], [160, 168], [104, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#5c6375"/>`).join('')}
      <ellipse cx="152" cy="172" rx="26" ry="30" fill="#7d8597"/>
      <rect x="140" y="184" width="24" height="38" rx="9" fill="#7d8597"/>
      <path d="M128 220 H172 Q174 230 164 230 H128 Q122 226 128 220Z" fill="#5c6375"/>
      <path d="M128 226 l-8 4 M140 228 l-6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <g class="mr-arm"><path d="M100 150 L82 166" stroke="#7d8597" stroke-width="11" stroke-linecap="round"/>
        <path d="M80 166 l-8 -2 M82 168 l-6 6" stroke="#5c6375" stroke-width="4" stroke-linecap="round"/></g>
      <rect x="86" y="88" width="34" height="34" rx="10" fill="#7d8597"/>
      <path d="M98 40 L104 16" stroke="#a7adba" stroke-width="4" stroke-linecap="round"/>
      <circle class="mr-bulb" cx="105" cy="13" r="6" fill="#ff4d5e"/>
      <g class="mr-jaw">
        <path d="M28 104 H100 Q104 120 92 124 H40 Q26 122 28 104Z" fill="#6b7385"/>
        ${teethDn}
      </g>
      <path d="M22 72 Q20 40 58 38 H100 Q118 40 118 62 V92 Q118 100 108 100 H30 Q20 98 22 84Z" fill="#8b93a7"/>
      ${teethUp}
      <path d="M30 60 H44" stroke="#5c6375" stroke-width="4" stroke-linecap="round"/>
      ${[[96, 52], [108, 80], [40, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#5c6375"/>`).join('')}
      <circle cx="74" cy="62" r="15" fill="#3b3247"/>
      <g class="mr-angry">
        <circle class="mr-eye" cx="74" cy="62" r="10" fill="#ff4d5e"/>
        <circle cx="77" cy="59" r="3" fill="#ffd0d6"/>
        <path d="M56 44 L92 52" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g class="mr-happy" display="none">
        <path d="M64 64 Q74 52 84 64" stroke="#6fd0ff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="54" cy="80" r="6" fill="#ff8fa8" opacity=".6"/>
      </g>
    </svg>`;
  }
  const happyRex = () => rex().replace('class="mr-angry"', 'class="mr-angry" display="none"').replace('class="mr-happy" display="none"', 'class="mr-happy"');

  // ---------- 方位場景（viewBox 0 0 240 170） ----------
  // 每個位置：x = droid 中間、b = 腳底、s = 大細、layer = back（畀物件遮）/ mid（喺箱入面）/ front
  const SPOT = {
    box:   { in: [122, 106, 56, 'mid'], on: [124, 88, 56], next: [204, 152, 54], behind: [154, 96, 52, 'back'], front: [108, 166, 62] },
    table: { on: [103, 78, 58], under: [103, 150, 58], next: [210, 152, 54] },
    rock:  { on: [122, 80, 56], behind: [136, 84, 54, 'back'], next: [210, 152, 52], front: [108, 166, 62] },
    trees: { between: [106, 150, 48], next: [216, 152, 46], front: [160, 166, 58] }
  };
  function boxArt(open) {
    const side = `<path d="M160 92 L172 80 V138 L160 150Z" fill="#b07a4a"/>`;
    const front = `<rect x="80" y="92" width="80" height="58" fill="#c99260" stroke="#8e5f36" stroke-width="3"/>
      <path d="M86 104 H154" stroke="#b07a4a" stroke-width="3"/><path d="M120 92 V150" stroke="#e2b77f" stroke-width="7"/>`;
    if (open) return {
      back: `${side}<path d="M80 92 L92 80 H172 L160 92Z" fill="#6b4429"/>`,
      front: `${front}<path d="M80 92 L58 74 L66 70 L92 80Z" fill="#d9a46c" stroke="#8e5f36" stroke-width="2"/>
        <path d="M160 92 L182 76 L190 82 L172 80Z" fill="#d9a46c" stroke="#8e5f36" stroke-width="2"/>`
    };
    return { back: '', front: `${side}<path d="M80 92 L92 80 H172 L160 92Z" fill="#e2b77f" stroke="#8e5f36" stroke-width="2"/>${front}` };
  }
  const OBJ = {
    box: (prep) => boxArt(prep === 'in'),
    table: () => ({ back: '', front: `
      <rect x="40" y="86" width="11" height="64" rx="3" fill="#8e5f36"/><rect x="155" y="86" width="11" height="64" rx="3" fill="#8e5f36"/>
      <rect x="28" y="76" width="150" height="12" rx="4" fill="#b07a4a"/><rect x="28" y="76" width="150" height="4" rx="2" fill="#c99260"/>` }),
    rock: () => ({ back: '', front: `
      <path d="M64 150 Q56 112 84 96 Q96 70 128 72 Q166 74 172 110 Q184 140 174 150Z" fill="#8b8d99"/>
      <path d="M92 94 Q104 82 122 82" stroke="#b4b6c2" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M140 118 l10 8 l-4 12 M96 128 l8 -6" stroke="#6d6f7c" stroke-width="3" fill="none" stroke-linecap="round"/>` }),
    trees: () => ({ back: '', front: [52, 160].map((x) => `
      <rect x="${x - 8}" y="88" width="16" height="62" rx="4" fill="#8e5f36"/>
      <circle cx="${x}" cy="66" r="30" fill="#4caf72"/><circle cx="${x - 18}" cy="80" r="17" fill="#3e9a62"/><circle cx="${x + 18}" cy="80" r="17" fill="#3e9a62"/>
      <circle cx="${x - 8}" cy="56" r="7" fill="#7fd6a0" opacity=".7"/>`).join('') })
  };
  function scene(obj, prep, col, noDroid) {
    const o = OBJ[obj](prep);
    let d = '';
    if (!noDroid) {
      const [x, b, s, layer] = SPOT[obj][prep];
      d = { svg: nest(baby(col), x - s / 2, b - s * 0.96, s, s).replace('class="bb-svg"', 'class="bb-svg sc-droid"'), layer: layer || 'front' };
    }
    const back = d && d.layer === 'back' ? d.svg : '', mid = d && d.layer === 'mid' ? d.svg : '', front = d && d.layer === 'front' ? d.svg : '';
    return `<svg viewBox="0 0 240 170" aria-hidden="true" class="sc-svg">
      <rect x="0" y="146" width="240" height="24" fill="#e3f1dc"/><path d="M0 147 H240" stroke="#c4dfb8" stroke-width="3"/>
      ${back}${o.back}${mid}${o.front}${front}
    </svg>`;
  }

  // ---------- 25 樣嘢（viewBox 0 0 200 170） ----------
  function mouse(x, y, s, flip) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <path d="M26 6 Q48 4 46 -14 Q44 -26 54 -28" stroke="#4a4258" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="0" rx="30" ry="18" fill="#4a4258"/>
      <circle cx="-30" cy="-6" r="15" fill="#4a4258"/>
      <circle cx="-30" cy="-22" r="9" fill="#4a4258"/><circle cx="-30" cy="-22" r="5" fill="#ff8fb8"/>
      <circle cx="-44" cy="-4" r="4" fill="#ff8fb8"/>
      <circle cx="-34" cy="-9" r="2.8" fill="#ff5a6e"/>
      <path d="M-10 16 v6 M10 16 v6" stroke="#4a4258" stroke-width="4" stroke-linecap="round"/>
    </g>`;
  }
  function rabbit(x, y, s, col) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="-12" cy="-58" rx="7" ry="24" fill="${col}" transform="rotate(-10 -12 -58)"/><ellipse cx="-12" cy="-58" rx="3.5" ry="17" fill="#ffb8cc" transform="rotate(-10 -12 -58)"/>
      <ellipse cx="6" cy="-58" rx="7" ry="24" fill="${col}" transform="rotate(10 6 -58)"/><ellipse cx="6" cy="-58" rx="3.5" ry="17" fill="#ffb8cc" transform="rotate(10 6 -58)"/>
      <ellipse cx="4" cy="0" rx="26" ry="22" fill="${col}"/>
      <circle cx="28" cy="2" r="7" fill="#fff"/>
      <circle cx="-4" cy="-26" r="17" fill="${col}"/>
      ${eye(-10, -28, 3.2)}
      <circle cx="-19" cy="-22" r="2.6" fill="#ff8fb8"/>
    </g>`;
  }
  function wheel(x, y, r) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="7"/>
      <path d="M${x - r + 5} ${y} H${x + r - 5} M${x} ${y - r + 5} V${y + r - 5}" stroke="#c7c9d3" stroke-width="2.5"/>
      <circle cx="${x}" cy="${y}" r="5" fill="#a7adba"/>`;
  }
  const T = {
    kite: () => `
      <path d="M100 132 Q114 146 104 156 Q96 166 112 168" stroke="${INK}" stroke-width="3" fill="none"/>
      <path d="M104 144 l-8 -5 v10z M104 144 l8 -5 v10z" fill="#e85858"/><path d="M106 160 l-7 -4 v8z M106 160 l7 -4 v8z" fill="#4caf72"/>
      <path d="M100 10 L52 66 L100 66Z" fill="#e85858"/><path d="M100 10 L148 66 L100 66Z" fill="#ffb347"/>
      <path d="M52 66 L100 132 L100 66Z" fill="#4f9ee0"/><path d="M148 66 L100 132 L100 66Z" fill="#e8a33c"/>
      <path d="M100 10 V132 M52 66 H148" stroke="${INK}" stroke-width="3"/>
      <path d="M100 10 L148 66 L100 132 L52 66Z" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M150 18 q8 6 4 14 M158 12 q10 8 6 20" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    plane: () => `${shadow(100, 70)}
      <path d="M96 82 L78 48 H94 L126 82Z" fill="#c8d1de"/>
      <path d="M26 80 L14 38 H34 L58 80Z" fill="#3b6fd8"/>
      <path d="M20 92 Q20 78 40 78 H162 Q188 80 194 92 Q188 106 162 106 H40 Q20 106 20 92Z" fill="#eef2f7" stroke="#c8d1de" stroke-width="3"/>
      <path d="M30 99 H182" stroke="#3b6fd8" stroke-width="4"/>
      ${[56, 70, 84, 98, 112, 126, 140, 154].map((x) => `<circle cx="${x}" cy="89" r="4" fill="#4f9ee0"/>`).join('')}
      <path d="M172 84 Q184 86 188 92 H170Z" fill="#4f9ee0"/>
      <path d="M92 100 L64 148 H84 L128 100Z" fill="#dfe6ef" stroke="#c8d1de" stroke-width="2"/>
      <rect x="84" y="122" width="22" height="10" rx="5" fill="#a7adba"/>`,
    phone: () => `${shadow(100, 40)}<g transform="rotate(-14 100 86)">
      <rect x="62" y="12" width="76" height="146" rx="15" fill="#e8743c"/>
      <rect x="69" y="28" width="62" height="108" rx="5" fill="#33406e"/>
      ${[0, 1, 2].flatMap((c) => [0, 1, 2, 3].map((r) => `<rect x="${75 + c * 19}" y="${35 + r * 24}" width="13" height="13" rx="3" fill="${['#ffd36e', '#7fd6a0', '#ff8fb8', '#9fd3ff'][(c + r) % 4]}"/>`)).join('')}
      <rect x="88" y="18" width="24" height="4" rx="2" fill="#a24f24"/>
      <circle cx="100" cy="147" r="6" fill="#ffb347" stroke="#a24f24" stroke-width="2"/>
    </g>`,
    snake: () => `${shadow(96, 66)}
      <path d="M150 150 Q178 140 160 124 Q140 108 100 116 Q48 126 46 98 Q44 72 86 70 Q118 68 120 48" stroke="#4caf50" stroke-width="24" fill="none" stroke-linecap="round"/>
      <path d="M150 150 Q178 140 160 124 Q140 108 100 116 Q48 126 46 98 Q44 72 86 70 Q118 68 120 48" stroke="#2e7d32" stroke-width="24" fill="none" stroke-dasharray="5 17"/>
      <ellipse cx="118" cy="38" rx="25" ry="18" fill="#4caf50"/>
      ${eye(110, 32, 5)}
      <path d="M94 44 L82 46 L76 42 M82 46 L76 51" stroke="#e5484d" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    white: () => `
      <path d="M58 112 Q46 86 78 88 Q84 66 106 78 Q126 62 138 86 Q168 82 158 108 Q180 124 152 136 Q148 158 120 148 Q100 164 84 146 Q54 152 62 128 Q40 122 58 112Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="40" cy="96" r="6" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="176" cy="94" r="5" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="168" cy="150" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <rect x="138" y="2" width="14" height="58" rx="6" fill="#8e5f36" transform="rotate(32 145 31)"/>
      <path d="M118 54 L134 64 L122 84 Q112 92 106 84 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="118" y="44" width="20" height="16" rx="3" fill="#a7adba" transform="rotate(32 128 52)"/>`,
    nose: () => `${shadow(100, 52)}
      <path d="M100 14 Q80 18 79 58 Q78 88 58 110 Q40 132 60 148 Q76 158 92 150 Q100 156 108 150 Q124 158 140 148 Q160 132 142 110 Q122 88 121 58 Q120 18 100 14Z" fill="#c9785a"/>
      <path d="M90 34 Q88 70 82 92" stroke="#e8a07e" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="82" cy="140" rx="10" ry="5.5" fill="#5a2e22"/><ellipse cx="118" cy="140" rx="10" ry="5.5" fill="#5a2e22"/>
      <path d="M62 120 Q70 112 78 118 M138 120 Q130 112 122 118" stroke="#a65a40" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    cake: () => `
      <ellipse cx="100" cy="152" rx="76" ry="12" fill="#dfe6ef"/>
      <rect x="38" y="96" width="124" height="54" rx="12" fill="#4f9ee0"/>
      <path d="M38 108 Q38 96 50 96 H150 Q162 96 162 108 Q154 120 146 108 Q138 122 128 108 Q118 122 108 108 Q98 122 88 108 Q78 122 68 108 Q58 122 50 108 Q44 118 38 108Z" fill="#9fd3ff"/>
      <rect x="56" y="56" width="88" height="44" rx="12" fill="#ff7aa8"/>
      <path d="M56 68 Q56 56 68 56 H132 Q144 56 144 68 Q138 80 130 68 Q122 82 112 68 Q102 82 92 68 Q82 82 74 68 Q66 80 56 68Z" fill="#ffc0d6"/>
      <circle cx="84" cy="50" r="8" fill="#e5484d"/><circle cx="100" cy="44" r="8" fill="#5a5fd0"/><circle cx="116" cy="50" r="8" fill="#e5484d"/>
      <circle cx="82" cy="47" r="2.4" fill="#fff" opacity=".7"/><circle cx="114" cy="47" r="2.4" fill="#fff" opacity=".7"/>`,
    bike: () => `${shadow(100, 86, 154)}
      ${wheel(52, 118, 32)}${wheel(148, 118, 32)}
      <path d="M52 118 L84 70 H132 L148 118 M84 70 L100 118 L132 70 M100 118 H52" stroke="#e85858" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M84 70 V58" stroke="${INK}" stroke-width="5"/><rect x="70" y="52" width="28" height="9" rx="4.5" fill="${INK}"/>
      <path d="M132 70 L126 46 L146 42" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="100" cy="118" r="7" fill="#a7adba"/><path d="M100 118 l10 10" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    lime: () => `${shadow(100, 80)}
      <path d="M58 58 Q70 34 92 44 Q78 62 58 58Z" fill="#3e9a62"/>
      <ellipse cx="72" cy="104" rx="50" ry="42" fill="#4caf50"/>
      <path d="M44 86 Q54 74 70 72" stroke="#8fd68f" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="136" cy="108" r="42" fill="#4caf50"/>
      <circle cx="136" cy="108" r="36" fill="#e8f7c8"/>
      <circle cx="136" cy="108" r="31" fill="#a6d96a"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M136 108 L${(136 + Math.cos(i * Math.PI / 4) * 31).toFixed(1)} ${(108 + Math.sin(i * Math.PI / 4) * 31).toFixed(1)}" stroke="#e8f7c8" stroke-width="3.5"/>`).join('')}
      <circle cx="136" cy="108" r="5" fill="#e8f7c8"/>`,
    mice: () => `${shadow(100, 86)}${mouse(66, 120, .9)}${mouse(150, 126, .85, true)}${mouse(110, 78, .75)}`,
    face: () => `
      <circle cx="56" cy="92" r="11" fill="${SKIN}"/><circle cx="144" cy="92" r="11" fill="${SKIN}"/>
      <circle cx="100" cy="90" r="52" fill="${SKIN}"/>
      <path d="M48 84 Q42 30 100 30 Q158 30 152 84 Q144 58 126 62 Q112 46 96 58 Q76 50 64 66 Q54 68 48 84Z" fill="#5a3a24"/>
      ${eye(82, 94, 6)}${eye(118, 94, 6)}
      <circle cx="70" cy="112" r="8" fill="#ff8fa8" opacity=".45"/><circle cx="130" cy="112" r="8" fill="#ff8fa8" opacity=".45"/>
      <path d="M100 100 Q96 108 102 110" stroke="#d9a07e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M84 120 Q100 134 116 120" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    // ---- 陷阱圖 ----
    helicopter: () => `${shadow(100, 60)}
      <path d="M40 22 H170" stroke="#3b6fd8" stroke-width="7" stroke-linecap="round"/><rect x="98" y="22" width="10" height="20" fill="${INK}"/>
      <path d="M118 84 H186 L192 70 H200 L196 96 H118Z" fill="#e85858"/>
      <circle cx="194" cy="74" r="8" fill="none" stroke="#3b6fd8" stroke-width="4"/>
      <path d="M56 80 Q56 42 100 42 Q140 42 140 84 Q140 116 100 116 H76 Q56 116 56 80Z" fill="#e85858"/>
      <path d="M62 78 Q62 52 94 52 V80Z" fill="#6fd0ff" stroke="#3b6fd8" stroke-width="3"/>
      <path d="M70 116 L64 136 M120 116 L126 136 M48 138 H146" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="112" cy="70" r="5" fill="#ffd36e"/>`,
    radio: () => `${shadow(100, 80)}
      <path d="M150 52 L172 12" stroke="#5c6375" stroke-width="4" stroke-linecap="round"/>
      <path d="M62 52 V34 Q62 24 72 24 H128 Q138 24 138 34 V52" stroke="#2a52a8" stroke-width="8" fill="none"/>
      <rect x="22" y="50" width="156" height="98" rx="16" fill="#4f9ee0" stroke="#2a52a8" stroke-width="4"/>
      ${[56, 144].map((x) => `<circle cx="${x}" cy="104" r="28" fill="${INK}"/><circle cx="${x}" cy="104" r="17" fill="#8b2e3a"/><circle cx="${x}" cy="104" r="6" fill="#3b3247"/>`).join('')}
      <rect x="84" y="62" width="32" height="14" rx="4" fill="#ffd36e"/><path d="M90 69 h20" stroke="#e85858" stroke-width="3"/>
      ${[86, 100, 114].map((x) => `<rect x="${x - 5}" y="88" width="10" height="7" rx="2" fill="#e85858"/>`).join('')}
      <circle cx="100" cy="122" r="7" fill="#e85858"/>`,
    gecko: () => `
      <path d="M100 124 Q120 156 92 160 Q76 160 84 146" stroke="#4caf50" stroke-width="12" fill="none" stroke-linecap="round"/>
      ${[[76, 64, -40], [124, 64, 40], [78, 112, -140], [122, 112, 140]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 V-24" stroke="#4caf50" stroke-width="9" stroke-linecap="round"/>${[-7, 0, 7].map((d) => `<circle cx="${d}" cy="-28" r="4.5" fill="#4caf50"/>`).join('')}</g>`).join('')}
      <ellipse cx="100" cy="90" rx="22" ry="40" fill="#4caf50"/>
      <ellipse cx="100" cy="92" rx="11" ry="26" fill="#d9ef8a"/>
      <ellipse cx="100" cy="40" rx="22" ry="18" fill="#4caf50"/>
      <circle cx="88" cy="32" r="8" fill="#e5484d"/><circle cx="112" cy="32" r="8" fill="#e5484d"/>
      <circle cx="88" cy="32" r="3.5" fill="${INK}"/><circle cx="112" cy="32" r="3.5" fill="${INK}"/>
      <path d="M90 48 Q100 54 110 48" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    rabbits: () => `${shadow(100, 90)}${rabbit(48, 136, .8, '#a4544a')}${rabbit(96, 128, .95, '#f2ece4')}${rabbit(148, 138, .8, '#3b3247')}`,
    lemon: () => `${shadow(100, 66)}
      <path d="M104 40 Q122 18 146 26 Q132 48 104 40Z" fill="#3e9a62"/>
      <path d="M30 98 Q26 90 34 86 Q52 50 100 48 Q148 50 166 86 Q174 90 170 98 Q174 106 166 110 Q148 146 100 148 Q52 146 34 110 Q26 106 30 98Z" fill="#ffd93e"/>
      <path d="M58 78 Q74 64 96 62" stroke="#fff3a8" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${[[70, 110], [120, 120], [140, 90], [92, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#e6b820"/>`).join('')}`,
    motorbike: () => `${shadow(100, 92, 156)}
      ${wheel(44, 120, 30)}${wheel(156, 120, 30)}
      <path d="M44 120 L80 84 M156 120 L132 64" stroke="#5c6375" stroke-width="7" stroke-linecap="round"/>
      <path d="M70 100 Q80 72 110 72 H140 Q150 84 136 100 Z" fill="#e5484d"/>
      <path d="M60 84 Q70 70 98 72 V82 H62Z" fill="${INK}"/>
      <rect x="90" y="96" width="34" height="22" rx="6" fill="#8b8d99"/>
      <path d="M78 116 H40" stroke="#a7adba" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 64 L124 50 L144 46" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="146" cy="72" r="7" fill="#ffd36e"/>`,
    // ---- magic e ----
    cap: () => `${shadow(100, 72)}
      <path d="M40 112 Q40 46 100 44 Q160 46 160 112Z" fill="#3b6fd8"/>
      <path d="M100 44 V112 M70 52 Q64 80 66 112 M130 52 Q136 80 134 112" stroke="#2a52a8" stroke-width="3" fill="none"/>
      <circle cx="100" cy="44" r="6" fill="#2a52a8"/>
      <path d="M40 108 Q30 132 70 132 H190 Q196 120 160 108Z" fill="#2a52a8"/>`,
    cape: () => `
      <path d="M62 30 Q100 46 138 30 L170 150 Q150 160 134 150 Q118 162 100 150 Q82 162 66 150 Q50 160 30 150Z" fill="#e5484d"/>
      <path d="M62 30 Q100 46 138 30 L146 60 Q100 74 54 60Z" fill="#c43a3f"/>
      <path d="M84 60 Q80 110 76 150 M116 60 Q120 110 124 150" stroke="#c43a3f" stroke-width="4" fill="none"/>
      <circle cx="70" cy="40" r="9" fill="#ffd36e"/><circle cx="130" cy="40" r="9" fill="#ffd36e"/>
      <path d="M70 40 Q100 52 130 40" stroke="#ffd36e" stroke-width="4" fill="none"/>`,
    tap: () => `
      <rect x="20" y="40" width="24" height="44" rx="6" fill="#a7adba"/>
      <path d="M44 56 H118 Q140 56 140 78 V96" stroke="#c7c9d3" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M44 50 H118" stroke="#eef2f7" stroke-width="5" stroke-linecap="round"/>
      <rect x="88" y="26" width="12" height="20" fill="#a7adba"/><rect x="70" y="18" width="48" height="12" rx="6" fill="#e85858"/>
      <rect x="128" y="96" width="24" height="10" rx="3" fill="#a7adba"/>
      <path d="M140 116 Q132 130 140 136 Q148 130 140 116Z" fill="#4f9ee0"/>
      <path d="M140 146 Q134 156 140 160 Q146 156 140 146Z" fill="#8fd0f5"/>`,
    tape: () => `${shadow(100, 66)}
      <path d="M128 104 L190 132 L184 146 L120 124Z" fill="#ffe680" opacity=".9"/>
      <circle cx="96" cy="94" r="56" fill="#ffd93e"/>
      <circle cx="96" cy="94" r="44" fill="#ffe680"/>
      <circle cx="96" cy="94" r="30" fill="#e8c27a"/>
      <circle cx="96" cy="94" r="24" fill="#fff"/>
      <path d="M58 70 Q70 52 92 50" stroke="#fff6c8" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    can: () => `${shadow(100, 52)}
      <rect x="54" y="30" width="92" height="124" rx="10" fill="#c7c9d3"/>
      <ellipse cx="100" cy="30" rx="46" ry="11" fill="#dfe6ef" stroke="#a7adba" stroke-width="3"/>
      <rect x="54" y="58" width="92" height="66" fill="#e5484d"/>
      <path d="M54 58 H146 M54 124 H146" stroke="#a7adba" stroke-width="3"/>
      <circle cx="100" cy="91" r="20" fill="#fff"/><circle cx="100" cy="91" r="11" fill="#ffd36e"/>
      <path d="M58 136 H142 M58 46 H142" stroke="#a7adba" stroke-width="2.5"/>`,
    cane: () => `
      <path d="M86 160 V70 Q86 30 116 30 Q146 30 146 62 V78" stroke="#fff" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M86 160 V70 Q86 30 116 30 Q146 30 146 62 V78" stroke="#e5484d" stroke-width="22" fill="none" stroke-linecap="round" stroke-dasharray="14 14"/>
      <path d="M86 160 V70 Q86 30 116 30 Q146 30 146 62 V78" stroke="${INK}" stroke-width="2" fill="none" opacity=".25" transform="translate(-11 0)"/>
      <path d="M80 140 V72" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
    cub: () => `${shadow(100, 54)}
      <circle cx="64" cy="40" r="16" fill="#9c6f3c"/><circle cx="136" cy="40" r="16" fill="#9c6f3c"/>
      <circle cx="64" cy="40" r="8" fill="#e2b77f"/><circle cx="136" cy="40" r="8" fill="#e2b77f"/>
      <ellipse cx="100" cy="126" rx="48" ry="38" fill="#9c6f3c"/>
      <ellipse cx="100" cy="132" rx="26" ry="22" fill="#e2b77f"/>
      <ellipse cx="62" cy="156" rx="16" ry="10" fill="#8a5f32"/><ellipse cx="138" cy="156" rx="16" ry="10" fill="#8a5f32"/>
      <circle cx="100" cy="70" r="38" fill="#9c6f3c"/>
      <ellipse cx="100" cy="84" rx="18" ry="13" fill="#e2b77f"/>
      <ellipse cx="100" cy="78" rx="7" ry="5" fill="${INK}"/>
      <path d="M100 84 V90 M92 92 Q100 96 108 92" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${eye(86, 64, 4.5)}${eye(114, 64, 4.5)}`,
    cube: () => `${shadow(100, 58)}
      <path d="M50 66 L100 42 L150 66 L100 90Z" fill="#d6f2ff" stroke="#8fd0f5" stroke-width="3"/>
      <path d="M50 66 V130 L100 156 V90Z" fill="#9fd8f5" stroke="#8fd0f5" stroke-width="3"/>
      <path d="M150 66 V130 L100 156 V90Z" fill="#7cc3ec" stroke="#8fd0f5" stroke-width="3"/>
      <path d="M62 82 V118" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <path d="M86 58 L110 48" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`
  };

  function thing(id) {
    return `<svg viewBox="0 0 200 170" aria-hidden="true" class="thing-svg" data-thing="${id}">${T[id]()}</svg>`;
  }

  // ---------- 結局：降落傘 / 紅色戰機 ----------
  function parachute() {
    return `<svg viewBox="0 0 160 120" aria-hidden="true">
      <path d="M8 56 Q80 -26 152 56 Q134 46 116 56 Q98 46 80 56 Q62 46 44 56 Q26 46 8 56Z" fill="#ffd36e"/>
      <path d="M44 56 Q62 -10 80 2 Q98 -10 116 56 Q98 46 80 56 Q62 46 44 56Z" fill="#ff8fb8"/>
      <path d="M8 56 L80 118 M44 56 L80 118 M116 56 L80 118 M152 56 L80 118" stroke="${INK}" stroke-width="2"/>
    </svg>`;
  }
  const redFighter = () => JediArt.fighter().replace(/#3b6fd8/g, '#c43a3f').replace(/#6fd0ff/g, '#ff8a95').replace(/#5a3a24/g, '#2b2433');

  // ---------- 主選單卡 + 貼紙 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#2a2350"/>
      ${[[40, 40], [160, 32], [150, 160], [30, 130], [100, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c8"/>`).join('')}
      ${nest(rex(), 74, 18, 120, 111)}
      ${nest(jedi(), 4, 62, 96, 125)}
      ${nest(sith(), 58, 74, 92, 120)}
    </svg>`;
  }
  function sticker(id) {
    if (id === 'combo') return nest(happyRex(), 12, 22, 76, 70) + `<path d="M72 24 C64 16 54 22 60 32 L72 42 L84 32 C90 22 80 16 72 24Z" fill="#ff5a6e"/>`;
    if (id === 'rocket') return nest(JediArt.fighter(), 8, 22, 64, 38) + nest(redFighter(), 30, 52, 64, 38);
    return nest(baby(BABY_COLS[2]), 34, 62, 32, 32) + nest(baby(BABY_COLS[1]), 34, 36, 32, 32) + nest(baby(BABY_COLS[0]), 34, 10, 32, 32);
  }

  return { jedi, sith, baby, BABY_COLS, rex, happyRex, scene, thing, parachute, redFighter, icon, sticker, SPOT };
})();
