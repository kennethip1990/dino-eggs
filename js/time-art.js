/*
 * 恐龍時光機：全部原創 SVG
 * - 時光機 viewBox 0 0 220 200（大鐘面 + 指針會轉，.tm-hands）
 * - 恐龍拍檔 / BB 恐龍 / 恐龍媽媽 借 Art（恐龍搵蛋嗰三隻：腕龍、暴龍、三角龍）
 * - 詞語圖 viewBox 0 0 200 170（同 JediArt / MechaArt 一樣）；時間借 JediArt clock、生日借 MechaArt cake
 * - HUD：化石（只加唔扣）、燈泡 / 時光門 / 電池 / 腳印；結局：煙花、生日蛋糕、星星；主選單卡、貼紙
 */
const TimeArt = (() => {
  const INK = '#3b3247';
  const nest = JediArt.nest;
  const shadow = (cx, rx, y) => `<ellipse cx="${cx}" cy="${y || 163}" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;

  // ---------- 時光機 ----------
  function machine() {
    return `<svg viewBox="0 0 220 200" aria-hidden="true">
      <ellipse cx="110" cy="192" rx="80" ry="7" fill="#000" opacity=".1"/>
      <path d="M58 168 L44 190 M162 168 L176 190" stroke="#7a6a9a" stroke-width="10" stroke-linecap="round"/>
      <g class="tm-jet"><path d="M84 176 Q110 200 136 176Z" fill="#ffb347"/><path d="M96 178 Q110 192 124 178Z" fill="#fff3b0"/></g>
      <path d="M110 6 V24" stroke="#7a6a9a" stroke-width="6" stroke-linecap="round"/>
      <circle class="tm-bulb-top" cx="110" cy="8" r="9" fill="#ff8fb8"/>
      <rect x="22" y="22" width="176" height="152" rx="62" fill="#8fd0f5" stroke="#4f8fc0" stroke-width="7"/>
      <path d="M40 60 Q110 30 180 60" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/>
      <circle cx="44" cy="120" r="9" fill="#ffe680"/><circle cx="176" cy="120" r="9" fill="#7fd6a0"/>
      <circle class="tm-glow" cx="110" cy="104" r="58" fill="#fff6c8" opacity=".35"/>
      <circle cx="110" cy="104" r="50" fill="#fffdf6" stroke="#ffb347" stroke-width="8"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i * Math.PI / 6, r1 = i % 3 ? 40 : 34; return `<path d="M${(110 + Math.sin(a) * r1).toFixed(1)} ${(104 - Math.cos(a) * r1).toFixed(1)} L${(110 + Math.sin(a) * 44).toFixed(1)} ${(104 - Math.cos(a) * 44).toFixed(1)}" stroke="${INK}" stroke-width="${i % 3 ? 3 : 5}" stroke-linecap="round"/>`; }).join('')}
      <g class="tm-hands"><path d="M110 104 V70" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M110 104 L134 116" stroke="#e85858" stroke-width="6" stroke-linecap="round"/></g>
      <circle cx="110" cy="104" r="7" fill="${INK}"/>
    </svg>`;
  }

  // ---------- 詞語圖 ----------
  const T = {
    // 聲音：喇叭 + 音符
    sound: () => `${shadow(100, 56)}
      <path d="M34 66 H62 L104 30 V140 L62 104 H34Z" fill="#7fb0ff" stroke="#4f7fd0" stroke-width="6" stroke-linejoin="round"/>
      <path d="M122 62 Q140 85 122 108 M138 46 Q166 85 138 124" stroke="#4f7fd0" stroke-width="8" fill="none" stroke-linecap="round"/>
      <g fill="#ff8fb8"><circle cx="166" cy="40" r="9"/><path d="M173 40 V12 L186 16" stroke="#ff8fb8" stroke-width="5" fill="none"/></g>
      <g fill="#ffb347"><circle cx="160" cy="146" r="8"/><path d="M166 146 V122 L178 126" stroke="#ffb347" stroke-width="5" fill="none"/></g>`,
    // 學校：校舍 + 旗 + 鐘
    school: () => `${shadow(100, 80)}
      <rect x="24" y="76" width="152" height="84" fill="#ffe3b0" stroke="#d9a050" stroke-width="5"/>
      <path d="M16 80 L100 30 L184 80Z" fill="#e85858" stroke="#c94848" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="100" cy="62" r="12" fill="#fffdf6" stroke="#c94848" stroke-width="4"/><path d="M100 55 V62 L106 65" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M100 30 V6" stroke="#7a6a9a" stroke-width="4"/><path d="M100 6 L122 13 L100 20Z" fill="#7fd6a0"/>
      <rect x="84" y="112" width="32" height="48" rx="4" fill="#a8744c"/>
      <rect x="38" y="96" width="30" height="24" fill="#8fd0f5" stroke="#fff" stroke-width="4"/><rect x="132" y="96" width="30" height="24" fill="#8fd0f5" stroke="#fff" stroke-width="4"/>`,
    // 中國：長城
    china: () => `${shadow(100, 86)}
      <path d="M0 150 Q50 120 100 128 Q150 136 200 104 V170 H0Z" fill="#8fd18a"/>
      <path d="M8 130 L60 112 L110 118 L170 90 L196 84 V104 L172 110 L112 138 L62 132 L8 150Z" fill="#e0c49a" stroke="#b08a5a" stroke-width="4" stroke-linejoin="round"/>
      ${[[14, 124], [34, 117], [70, 106], [92, 109], [128, 104], [150, 94], [182, 80]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="9" fill="#e0c49a" stroke="#b08a5a" stroke-width="3"/>`).join('')}
      <rect x="50" y="78" width="26" height="40" fill="#d9b480" stroke="#b08a5a" stroke-width="4"/><path d="M44 80 L63 64 L82 80Z" fill="#c94848"/>
      <rect x="148" y="52" width="26" height="42" fill="#d9b480" stroke="#b08a5a" stroke-width="4"/><path d="M142 54 L161 38 L180 54Z" fill="#c94848"/>
      <circle cx="30" cy="34" r="16" fill="#ffe680"/>`,
    // 故事：打開嘅故事書（有恐龍圖）
    book: () => `${shadow(100, 80)}
      <path d="M100 44 Q60 26 18 36 V146 Q60 136 100 154Z" fill="#fffdf6" stroke="#7fb0ff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M100 44 Q140 26 182 36 V146 Q140 136 100 154Z" fill="#fffdf6" stroke="#7fb0ff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M100 44 V154" stroke="#7fb0ff" stroke-width="5"/>
      <path d="M30 104 Q42 72 62 80 Q70 62 84 70 L86 96 Q70 112 48 112Z" fill="#8fd18a"/><circle cx="76" cy="76" r="2.6" fill="${INK}"/>
      <path d="M116 70 H168 M116 86 H164 M116 102 H168 M116 118 H150" stroke="#c8c2d6" stroke-width="5" stroke-linecap="round"/>`,
    // 工作：安全帽 + 扳手 + 鎚仔
    work: () => `${shadow(100, 70)}
      <path d="M34 112 Q34 52 100 50 Q166 52 166 112Z" fill="#ffd23e" stroke="#e0a800" stroke-width="6"/>
      <rect x="20" y="108" width="160" height="16" rx="8" fill="#ffc93e" stroke="#e0a800" stroke-width="5"/>
      <rect x="90" y="44" width="20" height="40" rx="8" fill="#ffe680" stroke="#e0a800" stroke-width="4"/>
      <path d="M44 156 L80 132" stroke="#a7adba" stroke-width="12" stroke-linecap="round"/><circle cx="84" cy="130" r="11" fill="none" stroke="#a7adba" stroke-width="7"/>
      <path d="M120 158 L150 134" stroke="#a8744c" stroke-width="10" stroke-linecap="round"/><rect x="138" y="118" width="34" height="18" rx="4" fill="#7a6a9a" transform="rotate(-38 155 127)"/>`,
    // 早上：太陽升起 + 雀仔
    morning: () => `<rect x="0" y="0" width="200" height="170" rx="18" fill="#ffe8c8"/>
      <g stroke="#ffb347" stroke-width="7" stroke-linecap="round">${[-60, -30, 0, 30, 60].map((d) => { const a = d * Math.PI / 180; return `<path d="M${(100 + Math.sin(a) * 58).toFixed(1)} ${(118 - Math.cos(a) * 58).toFixed(1)} L${(100 + Math.sin(a) * 76).toFixed(1)} ${(118 - Math.cos(a) * 76).toFixed(1)}"/>`; }).join('')}</g>
      <circle cx="100" cy="118" r="44" fill="#ffd23e"/>
      <path d="M0 118 Q50 100 100 116 Q150 132 200 112 V170 H0Z" fill="#8fd18a"/>
      <path d="M36 50 q8 -8 16 0 q8 -8 16 0 M140 40 q7 -7 14 0 q7 -7 14 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    clock: () => JediArt.thing('clock'),
    // 星期：月曆（一至日 7 格）
    calendar: () => `${shadow(100, 72)}
      <rect x="28" y="28" width="144" height="128" rx="14" fill="#fffdf6" stroke="#7a6a9a" stroke-width="6"/>
      <path d="M28 42 Q28 28 42 28 H158 Q172 28 172 42 V64 H28Z" fill="#e85858"/>
      <rect x="58" y="14" width="12" height="30" rx="6" fill="#7a6a9a"/><rect x="130" y="14" width="12" height="30" rx="6" fill="#7a6a9a"/>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${40 + (i % 7) * 18}" y="${78 + Math.floor(i / 7) * 32}" width="12" height="20" rx="3" fill="${i === 9 ? '#ffb347' : '#c8c2d6'}"/>`).join('')}`,
    cake: () => MechaArt.thing('cake'),
    // 新年：燈籠 + 炮仗
    newyear: () => `${shadow(100, 70)}
      <path d="M76 6 V22" stroke="#e0a800" stroke-width="4"/>
      <ellipse cx="76" cy="66" rx="46" ry="44" fill="#e8384a"/>
      <path d="M76 22 Q48 66 76 110 M76 22 Q104 66 76 110" stroke="#ffc93e" stroke-width="4" fill="none"/>
      <rect x="58" y="16" width="36" height="12" rx="4" fill="#ffc93e"/><rect x="58" y="104" width="36" height="12" rx="4" fill="#ffc93e"/>
      <path d="M68 116 V148 M76 116 V152 M84 116 V148" stroke="#ffc93e" stroke-width="4" stroke-linecap="round"/>
      <path d="M150 20 Q156 30 150 40" stroke="#a8744c" stroke-width="4" fill="none"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${136 + (i % 2) * 14}" y="${40 + i * 24}" width="24" height="22" rx="4" fill="#e8384a" stroke="#ffc93e" stroke-width="3"/>`).join('')}`,
    // 遊戲：積木 + 波
    game: () => `${shadow(100, 80)}
      <rect x="26" y="104" width="50" height="50" rx="6" fill="#7fb0ff" stroke="#4f7fd0" stroke-width="5"/>
      <rect x="80" y="104" width="50" height="50" rx="6" fill="#ffd23e" stroke="#e0a800" stroke-width="5"/>
      <rect x="52" y="52" width="50" height="50" rx="6" fill="#ff8fb8" stroke="#e05a8a" stroke-width="5"/>
      <circle cx="160" cy="124" r="30" fill="#7fd6a0" stroke="#3fa86a" stroke-width="5"/>
      <path d="M132 116 Q160 132 188 116 M150 96 Q166 124 152 152" stroke="#fff" stroke-width="5" fill="none"/>`
  };
  function thing(pic) {
    const out = T[pic]();
    if (out.startsWith('<svg')) return out;
    return `<svg viewBox="0 0 200 170" aria-hidden="true" class="thing-svg" data-thing="${pic}">${out}</svg>`;
  }

  // ---------- HUD ----------
  // 化石（菊石）：第一下就啱先有
  const fossil = () => `<svg viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="26" fill="#e8c98e" stroke="#b08a5a" stroke-width="4"/>
      <path d="M30 30 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a16 16 0 1 1 16 16" stroke="#8a6440" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  const ICONS = {
    bulb: () => `<svg viewBox="0 0 60 70" aria-hidden="true"><path class="tm-lit" d="M30 4 C12 4 6 20 10 32 C13 40 20 44 20 52 H40 C40 44 47 40 50 32 C54 20 48 4 30 4Z" fill="#fff" stroke="#a7adba" stroke-width="4"/><rect x="20" y="52" width="20" height="12" rx="3" fill="#a7adba"/></svg>`,
    portal: () => `<svg viewBox="0 0 60 70" aria-hidden="true"><ellipse cx="30" cy="38" rx="24" ry="30" fill="none" stroke="#a7adba" stroke-width="6"/><ellipse class="tm-lit" cx="30" cy="38" rx="16" ry="22" fill="#fff"/></svg>`,
    battery: () => `<svg viewBox="0 0 60 70" aria-hidden="true"><rect x="12" y="12" width="36" height="54" rx="6" fill="#fff" stroke="#a7adba" stroke-width="5"/><rect x="22" y="4" width="16" height="9" rx="3" fill="#a7adba"/><rect class="tm-lit" x="18" y="18" width="24" height="42" rx="3" fill="#e9e6ef"/><path d="M33 24 L22 42 H31 L27 56 L39 36 H30Z" fill="#fff"/></svg>`,
    foot: () => `<svg viewBox="0 0 60 70" aria-hidden="true"><path class="tm-lit" d="M30 66 C16 66 12 52 16 40 C20 30 40 30 44 40 C48 52 44 66 30 66Z M14 30 a6 8 -20 1 1 0.1 0Z M30 22 a6 9 0 1 1 0.1 0Z M46 30 a6 8 20 1 1 0.1 0Z" fill="#c8c2d6"/></svg>`
  };
  const hudIcon = (kind) => ICONS[kind]();
  // 恐龍屋企（巢）
  const home = () => `<svg viewBox="0 0 100 70" aria-hidden="true"><ellipse cx="50" cy="48" rx="46" ry="18" fill="#b98a5a"/><ellipse cx="50" cy="42" rx="38" ry="11" fill="#8a6440"/><path d="M10 46 Q50 66 90 46" stroke="#d8ac74" stroke-width="4" fill="none"/></svg>`;

  // ---------- 結局道具 ----------
  // 煙花火箭（撳咗會爆）
  const rocket = (c) => `<svg viewBox="0 0 60 120" aria-hidden="true">
      <path d="M30 4 L46 30 V84 H14 V30Z" fill="${c}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <path d="M14 70 L4 92 L14 86Z M46 70 L56 92 L46 86Z" fill="#ffc93e"/>
      <path d="M22 84 Q30 112 38 84Z" fill="#ffb347"/><path d="M26 84 Q30 100 34 84Z" fill="#fff3b0"/>
      <circle cx="30" cy="44" r="7" fill="#fff"/>
    </svg>`;
  // 生日蛋糕：3 支蠟燭（火由 time.js 疊上去）
  const bigCake = () => `<svg viewBox="0 0 240 200" aria-hidden="true">
      <ellipse cx="120" cy="190" rx="108" ry="9" fill="#000" opacity=".1"/>
      <rect x="20" y="176" width="200" height="12" rx="6" fill="#d9d4e4"/>
      <rect x="34" y="112" width="172" height="66" rx="12" fill="#ffb3c7"/>
      <path d="M34 128 Q55 144 77 128 T120 128 T163 128 T206 128 V118 Q206 112 196 112 H44 Q34 112 34 118Z" fill="#fffdf6"/>
      <rect x="52" y="70" width="136" height="46" rx="10" fill="#fff0d6"/>
      <path d="M52 82 Q69 96 86 82 T120 82 T154 82 T188 82 V78 Q188 70 180 70 H60 Q52 70 52 78Z" fill="#ff8fb8"/>
      ${[[76, '#7fb0ff'], [120, '#ffd23e'], [164, '#7fd6a0']].map(([x, c]) => `<rect x="${x - 6}" y="30" width="12" height="42" rx="3" fill="${c}"/><path d="M${x - 6} 40 L${x + 6} 34 M${x - 6} 54 L${x + 6} 48 M${x - 6} 68 L${x + 6} 62" stroke="#fff" stroke-width="3"/>`).join('')}
      ${[[60, 150], [100, 160], [140, 150], [180, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff6c8"/>`).join('')}
    </svg>`;
  const flame = () => `<svg viewBox="0 0 40 56" aria-hidden="true"><path d="M20 4 C30 18 36 28 32 40 C29 50 11 50 8 40 C4 28 12 18 20 4Z" fill="#ffb347"/><path d="M20 22 C26 30 26 38 23 44 C20 48 16 46 15 42 C13 36 16 30 20 22Z" fill="#fff3b0"/></svg>`;

  // ---------- 主選單卡 + 貼紙 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#c7b8ff"/>
      <circle cx="100" cy="100" r="74" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="8 12" opacity=".7"/>
      <path d="M12 140 Q100 118 188 140 L184 158 Q100 206 16 158Z" fill="#8fd18a"/>
      ${nest(machine(), 14, 22, 126, 115)}
      ${nest(Art.baby(1, 'trex'), 118, 92, 70, 77)}
    </svg>`;
  }
  function sticker(id) {
    if (id === 'newyear') return nest(thing('newyear'), 4, 22, 64, 54) +
      `<g>${[[62, 34, '#ffe680'], [80, 58, '#ff8fb8'], [50, 70, '#9fd3ff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="4 5"/><circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`).join('')}</g>`;
    if (id === 'birthday') return nest(bigCake(), 14, 22, 72, 60) + nest(Art.baby(2, 'trice'), 58, 46, 34, 37);
    // space：時光機 + 星星
    return nest(machine(), 22, 20, 56, 51) + nest(EndArt.star('#ffe680'), 10, 12, 18, 18) + nest(EndArt.star('#ffb3c7'), 72, 16, 16, 16) + nest(EndArt.star('#9fd3ff'), 66, 66, 18, 18);
  }

  return { machine, thing, fossil, hudIcon, home, rocket, bigCake, flame, icon, sticker };
})();
