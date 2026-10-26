/* 結局短片用嘅 SVG：黑雲怪、彩虹、飛碟、大廈、火山怪、八爪魚、龍捲風、隕石、星星、怪獸大王、貼紙 */
const EndArt = (() => {
  const INK = '#3b3247';
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;

  // ---------- 黑雲怪（.c-dark 透明度由 CSS 變數 --dark 控制，打一下淡一啲） ----------
  function cloud() {
    const puff = (fill) => `<circle cx="90" cy="110" r="55" fill="${fill}"/><circle cx="152" cy="82" r="70" fill="${fill}"/>
      <circle cx="216" cy="108" r="56" fill="${fill}"/><rect x="60" y="104" width="190" height="62" rx="31" fill="${fill}"/>`;
    return `<svg viewBox="0 0 300 200" aria-hidden="true">
      <g>${puff('#ffffff')}</g>
      <g class="c-dark">${puff('#737892')}</g>
      <g class="c-angry">
        <path d="M110 86 L140 98 M196 86 L166 98" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        ${eye(128, 112, 9)}${eye(178, 112, 9)}
        <path d="M134 148 Q153 136 172 148" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>
      <g class="c-happy">
        <path d="M116 112 Q128 100 140 112 M166 112 Q178 100 190 112" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="110" cy="132" r="9" fill="#ff8fa8" opacity=".55"/><circle cx="196" cy="132" r="9" fill="#ff8fa8" opacity=".55"/>
        <path d="M134 136 Q153 158 172 136" stroke="${INK}" stroke-width="6" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  function rainbow() {
    const cols = ['#ff9a9a', '#ffc46b', '#fff07a', '#8fe0a0', '#8fbdf0', '#c7a3ff'];
    const arcs = cols.map((c, i) => { const r = 190 - i * 16; return `<path d="M${200 - r} 210 A${r} ${r} 0 0 1 ${200 + r} 210" stroke="${c}" stroke-width="17" fill="none"/>`; }).join('');
    return `<svg viewBox="0 0 400 215" aria-hidden="true">${arcs}</svg>`;
  }

  // ---------- 飛碟 + 外星人（.u-beam 吸光、.u-arm 揮手） ----------
  function ufo() {
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <path class="u-beam" d="M112 150 L40 300 L260 300 L188 150Z" fill="#fff6b0" opacity=".55"/>
      <ellipse cx="150" cy="86" rx="62" ry="58" fill="#bfe9ff" opacity=".9"/>
      <g class="u-alien">
        <path d="M128 50 L118 26 M172 50 L182 26" stroke="#6cc067" stroke-width="5" stroke-linecap="round"/>
        <circle cx="117" cy="24" r="7" fill="#ffd36e"/><circle cx="183" cy="24" r="7" fill="#ffd36e"/>
        <ellipse cx="150" cy="86" rx="36" ry="38" fill="#8fe08a"/>
        <ellipse cx="136" cy="80" rx="10" ry="13" fill="#fff"/><ellipse cx="164" cy="80" rx="10" ry="13" fill="#fff"/>
        ${eye(137, 82, 6)}${eye(165, 82, 6)}
        <path d="M138 104 Q150 112 162 104" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="u-arm"><path d="M186 96 Q206 84 208 64" stroke="#8fe08a" stroke-width="10" fill="none" stroke-linecap="round"/></g>
      </g>
      <ellipse cx="128" cy="62" rx="12" ry="18" transform="rotate(30 128 62)" fill="#fff" opacity=".6"/>
      <ellipse cx="150" cy="134" rx="128" ry="34" fill="#9aa8c2"/>
      <ellipse cx="150" cy="124" rx="128" ry="26" fill="#c9d3e6"/>
      <circle cx="62" cy="134" r="9" fill="#ff8fa8"/><circle cx="106" cy="144" r="9" fill="#ffd36e"/>
      <circle cx="150" cy="148" r="9" fill="#7ff0ff"/><circle cx="194" cy="144" r="9" fill="#ffd36e"/><circle cx="238" cy="134" r="9" fill="#ff8fa8"/>
    </svg>`;
  }

  function building() {
    let win = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) win += `<rect x="${26 + c * 40}" y="${96 + r * 34}" width="28" height="22" rx="5" fill="#fff6d6"/>`;
    return `<svg viewBox="0 0 120 260" aria-hidden="true">
      <rect x="8" y="20" width="104" height="236" rx="14" fill="#f6b26b" stroke="#e5964b" stroke-width="5"/>
      <rect x="50" y="2" width="20" height="22" rx="4" fill="#e5964b"/>
      <circle cx="40" cy="54" r="12" fill="#fff"/><circle cx="80" cy="54" r="12" fill="#fff"/>
      ${eye(41, 56, 6)}${eye(81, 56, 6)}
      <path d="M48 76 Q60 84 72 76" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${win}
      <rect x="44" y="228" width="32" height="28" rx="8" fill="#b07a48"/>
    </svg>`;
  }

  // ---------- 龍捲風（有搞笑面） ----------
  function tornado() {
    const rings = [[30, 92], [78, 76], [124, 60], [166, 46], [204, 34], [238, 22], [268, 12]];
    const body = rings.map(([y, rx]) => `<ellipse cx="${100 + (y % 3) * 2}" cy="${y}" rx="${rx}" ry="${Math.max(10, rx * .3)}" fill="#c3c8da" stroke="#9aa1b8" stroke-width="4"/>`).join('');
    return `<svg viewBox="0 0 200 290" aria-hidden="true">
      ${body}
      <path d="M40 70 Q100 90 160 70 M56 116 Q100 132 144 116" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
      <g class="t-angry">
        <path d="M66 26 L88 34 M134 26 L112 34" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        ${eye(80, 46, 8)}${eye(120, 46, 8)}
      </g>
      <g class="t-happy">
        <path d="M70 48 Q80 38 90 48 M110 48 Q120 38 130 48" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  // ---------- 隕石（嬲嬲豬石頭，帶火尾） ----------
  function meteor() {
    return `<svg viewBox="0 0 260 240" aria-hidden="true">
      <path d="M130 110 C170 60 210 30 256 4 C230 46 214 70 196 92 C224 76 244 70 258 70 C222 100 190 130 160 150Z" fill="#ffc46b"/>
      <path d="M132 120 C166 84 196 62 230 40 C210 70 196 86 180 104 C200 96 216 94 228 96 C200 116 178 132 156 146Z" fill="#ff8a5c"/>
      <circle cx="100" cy="150" r="72" fill="#a8968a"/>
      <circle cx="92" cy="142" r="72" fill="#bba99c"/>
      <circle cx="58" cy="110" r="12" fill="#a8968a"/><circle cx="130" cy="186" r="15" fill="#a8968a"/><circle cx="48" cy="180" r="8" fill="#a8968a"/>
      <path d="M62 126 L86 136 M124 126 L100 136" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      ${eye(76, 148, 8)}${eye(110, 148, 8)}
      <path d="M78 180 Q93 170 108 180" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // ---------- 火山怪（.v-lava / .v-smoke 透明度由 --hot 控制；.cool 之後開花） ----------
  function volcano() {
    const flower = (x, y, c) => `<g class="v-flower" style="transform-origin:${x}px ${y}px">
      <path d="M${x} ${y} L${x} ${y + 18}" stroke="#4f9e5a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${x - 7}" cy="${y}" r="6" fill="${c}"/><circle cx="${x + 7}" cy="${y}" r="6" fill="${c}"/>
      <circle cx="${x}" cy="${y - 7}" r="6" fill="${c}"/><circle cx="${x}" cy="${y + 7}" r="6" fill="${c}"/>
      <circle cx="${x}" cy="${y}" r="5" fill="#ffd36e"/></g>`;
    return `<svg viewBox="0 0 300 240" aria-hidden="true">
      <g class="v-smoke">
        <circle cx="132" cy="34" r="16" fill="#a9a2b3"/><circle cx="154" cy="22" r="20" fill="#bdb6c6"/><circle cx="174" cy="36" r="14" fill="#a9a2b3"/>
      </g>
      <path d="M14 236 L112 66 Q150 50 188 66 L286 236Z" fill="#b5835f"/>
      <path d="M150 58 Q172 58 188 66 L286 236 L190 236Z" fill="#a0704f"/>
      <path class="v-grass" d="M14 236 L58 160 Q100 176 150 168 Q200 176 242 160 L286 236Z" fill="#8fd18a"/>
      <ellipse class="v-crater" cx="150" cy="66" rx="40" ry="12" fill="#6e4a36"/>
      <g class="v-lava">
        <ellipse cx="150" cy="66" rx="34" ry="9" fill="#ff7a3c"/>
        <path d="M124 68 Q118 92 126 108 Q132 92 136 70Z M164 70 Q170 98 160 122 Q178 104 178 68Z" fill="#ff9a4c"/>
      </g>
      <g class="v-angry">
        <path d="M108 120 L136 132 M192 120 L164 132" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        ${eye(126, 146, 10)}${eye(174, 146, 10)}
        <path d="M128 192 Q150 176 172 192" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
      </g>
      <g class="v-happy">
        <path d="M114 146 Q126 132 138 146 M162 146 Q174 132 186 146" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <circle cx="106" cy="168" r="10" fill="#ff8fa8" opacity=".55"/><circle cx="194" cy="168" r="10" fill="#ff8fa8" opacity=".55"/>
        <path d="M128 172 Q150 196 172 172" stroke="${INK}" stroke-width="6" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      ${flower(56, 206, '#ff8fa8')}${flower(96, 218, '#c7a3ff')}${flower(204, 218, '#8fbdf0')}${flower(244, 206, '#ffb36b')}${flower(150, 222, '#ff8fa8')}
    </svg>`;
  }

  // ---------- 大八爪魚（兩隻觸手捉住 .o-bus / .o-car；.m-angry / .m-happy） ----------
  function octopus() {
    const PINK = '#ff8fb1', DEEP = '#e66f96';
    const bus = `<g class="o-bus"><rect x="6" y="26" width="64" height="38" rx="8" fill="#ffd36e" stroke="#e5a83a" stroke-width="3"/>
      <rect x="12" y="32" width="14" height="12" rx="3" fill="#bfe9ff"/><rect x="31" y="32" width="14" height="12" rx="3" fill="#bfe9ff"/><rect x="50" y="32" width="14" height="12" rx="3" fill="#bfe9ff"/>
      <circle cx="20" cy="66" r="7" fill="${INK}"/><circle cx="56" cy="66" r="7" fill="${INK}"/></g>`;
    const car = `<g class="o-car"><path d="M232 52 Q238 34 256 34 L274 34 Q288 34 292 52Z" fill="#7fc0ff"/>
      <rect x="226" y="50" width="70" height="20" rx="8" fill="#ff6b6b"/>
      <circle cx="242" cy="72" r="7" fill="${INK}"/><circle cx="280" cy="72" r="7" fill="${INK}"/></g>`;
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <path d="M96 196 C60 230 40 250 30 286 M124 206 C110 240 104 262 108 292 M176 206 C190 240 196 262 192 292 M204 196 C240 230 260 250 270 286"
        stroke="${PINK}" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g class="o-arm-l"><path d="M92 170 C54 156 36 120 40 80" stroke="${PINK}" stroke-width="20" fill="none" stroke-linecap="round"/></g>
      <g class="o-arm-r"><path d="M208 170 C246 156 264 120 260 80" stroke="${PINK}" stroke-width="20" fill="none" stroke-linecap="round"/></g>
      ${bus}${car}
      <ellipse class="o-head" cx="150" cy="140" rx="82" ry="76" fill="${PINK}"/>
      <ellipse cx="124" cy="96" rx="20" ry="12" fill="#fff" opacity=".35" transform="rotate(-25 124 96)"/>
      <circle cx="96" cy="190" r="7" fill="${DEEP}"/><circle cx="128" cy="204" r="7" fill="${DEEP}"/><circle cx="172" cy="204" r="7" fill="${DEEP}"/><circle cx="204" cy="190" r="7" fill="${DEEP}"/>
      <circle cx="122" cy="140" r="20" fill="#fff"/><circle cx="178" cy="140" r="20" fill="#fff"/>
      <g class="m-angry">
        ${eye(126, 144, 10)}${eye(174, 144, 10)}
        <path d="M98 110 L136 124 M202 110 L164 124" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <path d="M134 184 Q150 174 166 184" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>
      <g class="m-happy">
        <path d="M106 142 Q122 126 138 142 M162 142 Q178 126 194 142" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <circle cx="96" cy="166" r="11" fill="#ff5f8f" opacity=".45"/><circle cx="204" cy="166" r="11" fill="#ff5f8f" opacity=".45"/>
        <path d="M128 170 Q150 198 172 170" stroke="${INK}" stroke-width="6" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  function star(col) {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36Z" fill="${col || '#ffd36e'}" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg>`;
  }

  // ---------- 怪獸大王（大隻、戴皇冠；.m-angry / .m-happy） ----------
  function boss() {
    return `<svg viewBox="0 0 300 320" aria-hidden="true">
      <ellipse cx="150" cy="308" rx="115" ry="10" fill="#000" opacity=".1"/>
      <ellipse cx="94" cy="290" rx="38" ry="20" fill="#d9663f"/>
      <ellipse cx="206" cy="290" rx="38" ry="20" fill="#d9663f"/>
      <path d="M150 60 C240 60 270 140 270 200 C270 268 218 296 150 296 C82 296 30 268 30 200 C30 140 60 60 150 60Z" fill="#f08a5d"/>
      <ellipse cx="150" cy="226" rx="78" ry="58" fill="#ffc9a8"/>
      <path class="m-arm-l" d="M36 190 C6 168 2 134 16 116" stroke="#f08a5d" stroke-width="30" fill="none" stroke-linecap="round"/>
      <path class="m-arm-r" d="M264 190 C294 168 298 134 284 116" stroke="#f08a5d" stroke-width="30" fill="none" stroke-linecap="round"/>
      <path d="M92 66 L84 16 L116 44 L150 6 L184 44 L216 16 L208 66Z" fill="#ffd36e" stroke="#d9a53a" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="150" cy="40" r="8" fill="#7ff0ff"/><circle cx="104" cy="48" r="6" fill="#ff8fa8"/><circle cx="196" cy="48" r="6" fill="#ff8fa8"/>
      <circle cx="112" cy="140" r="30" fill="#fff"/><circle cx="188" cy="140" r="30" fill="#fff"/>
      <g class="m-angry">
        <circle cx="118" cy="146" r="14" fill="${INK}"/><circle cx="182" cy="146" r="14" fill="${INK}"/>
        <circle cx="122" cy="141" r="4.5" fill="#fff"/><circle cx="186" cy="141" r="4.5" fill="#fff"/>
        <path d="M80 104 L138 124 M220 104 L162 124" stroke="#a8462a" stroke-width="12" stroke-linecap="round"/>
        <path d="M110 206 Q150 186 190 206" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M120 200 l7 14 l7 -16z M166 196 l7 16 l7 -14z" fill="#fff"/>
      </g>
      <g class="m-happy">
        <path d="M94 144 Q112 126 130 144 M170 144 Q188 126 206 144" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <circle cx="88" cy="176" r="12" fill="#ff8fa8" opacity=".6"/><circle cx="212" cy="176" r="12" fill="#ff8fa8" opacity=".6"/>
        <path d="M112 190 Q150 232 188 190" stroke="${INK}" stroke-width="9" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  // ---------- 貼紙 ----------
  // 將一個完整 <svg> 塞入貼紙入面（nested svg）
  const nest = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const BG = { hero: '#d6e4ff', rex: '#d6f5cd', dino: '#fff0d6', snake: '#ffe3ef', party: '#ffe8d2', jedi: '#2c2a5c' };
  function sticker(game, id) {
    let inner;
    if (game === 'hero' && id === 'monster') inner = nest(HeroArt.monster(), 14, 16, 72, 72);
    else if (game === 'hero' && id === 'cloud') inner = nest(rainbow(), 10, 20, 80, 44) + nest(cloud().replace('class="c-dark"', 'class="c-dark" opacity="0"').replace('class="c-angry"', 'class="c-angry" display="none"'), 14, 40, 72, 48);
    else if (game === 'hero' && id === 'ufo') inner = nest(ufo().replace('class="u-beam"', 'class="u-beam" display="none"'), 12, 10, 76, 76);
    else if (game === 'hero' && id === 'volcano') inner = nest(volcano().replace('class="v-lava"', 'class="v-lava" display="none"').replace('class="v-smoke"', 'class="v-smoke" display="none"').replace('class="v-angry"', 'class="v-angry" display="none"'), 8, 16, 84, 68);
    else if (game === 'hero' && id === 'octopus') inner = nest(octopus().replace('class="o-bus"', 'class="o-bus" display="none"').replace('class="o-car"', 'class="o-car" display="none"').replace('class="m-angry"', 'class="m-angry" display="none"'), 10, 10, 80, 80);
    else if (game === 'rex' && id === 'monster') inner = nest(RexArt.rex(), 6, 14, 56, 56) + nest(HeroArt.monster(), 48, 40, 44, 44);
    else if (game === 'rex' && id === 'tornado') inner = nest(tornado().replace('class="t-angry"', 'class="t-angry" display="none"'), 24, 10, 52, 76);
    else if (game === 'rex' && id === 'meteor') inner = nest(star(), 14, 14, 34, 34) + nest(star('#ffb3c7'), 54, 22, 28, 28) + nest(star('#9fd3ff'), 32, 50, 34, 34);
    else if (game === 'snake' && id === 'heart') inner = nest(SnakeArt.heart(), 8, 8, 84, 84);
    else if (game === 'snake' && id === 'dragon') inner = nest(star(), 58, 10, 28, 28) + nest(SnakeArt.dragon(), 6, 12, 84, 84);
    else if (game === 'snake' && id === 'monster') inner = nest(SnakeArt.shooter(), 2, 10, 70, 70) + nest(HeroArt.monster().replace('class="m-angry"', 'class="m-angry" display="none"'), 50, 36, 42, 42);
    else if (game === 'dino') inner = nest(Art.specialBaby(id, 'trex'), 16, 12, 68, 75);
    else if (game === 'party') inner = PartyArt.sticker(id);
    else if (game === 'jedi') inner = JediArt.sticker(id);
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="${BG[game]}" stroke="#fff" stroke-width="6"/>
      ${inner || ''}
    </svg>`;
  }
  function lockedSticker() {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="rgba(255,255,255,.55)" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>
      <text x="50" y="66" text-anchor="middle" font-family="Andika, system-ui, sans-serif" font-weight="700" font-size="44" fill="#b7aec4">?</text>
    </svg>`;
  }
  // 主選單秘密短片掣
  function bossBadge() {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#fff6d6" stroke="#ffd36e" stroke-width="6"/>
      ${nest(boss(), 18, 18, 64, 68)}
    </svg>`;
  }

  return { cloud, rainbow, ufo, building, volcano, octopus, tornado, meteor, star, boss, sticker, lockedSticker, bossBadge };
})();
