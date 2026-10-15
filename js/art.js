/* 原創 SVG 圖像：恐龍媽媽、蛋、恐龍BB、巢、草叢、石頭、背景 */
const Art = (() => {
  const EGG_COLORS = [
    { base: '#fff4dc', spot: '#9ed9b5' },
    { base: '#fdeef2', spot: '#f4a9bf' },
    { base: '#eef6ff', spot: '#9cc4ef' },
    { base: '#fff8d6', spot: '#f2c45c' },
    { base: '#f3edff', spot: '#b9a3ea' }
  ];
  const BABY_COLORS = ['#8fd6a8', '#f6a5bd', '#8fbdf0', '#f5c96a', '#b8a2ea'];

  const EGG_PATH = 'M50 6 C77 6 93 48 93 74 C93 100 74 116 50 116 C26 116 7 100 7 74 C7 48 23 6 50 6Z';

  function egg(ci) {
    const c = EGG_COLORS[ci % EGG_COLORS.length];
    return `<svg viewBox="0 0 100 124" aria-hidden="true">
      <ellipse cx="50" cy="118" rx="32" ry="5" fill="#000" opacity=".10"/>
      <path d="${EGG_PATH}" fill="${c.base}" stroke="#a88b6a" stroke-opacity=".35" stroke-width="2.5"/>
      <circle cx="34" cy="52" r="8" fill="${c.spot}"/>
      <circle cx="64" cy="40" r="6" fill="${c.spot}"/>
      <circle cx="62" cy="80" r="10" fill="${c.spot}"/>
      <circle cx="30" cy="88" r="5.5" fill="${c.spot}"/>
      <circle cx="78" cy="64" r="4" fill="${c.spot}"/>
      <ellipse cx="33" cy="30" rx="7" ry="12" transform="rotate(25 33 30)" fill="#fff" opacity=".7"/>
    </svg>`;
  }

  // 三款恐龍：腕龍（長頸）、暴龍（T-Rex）、三角龍
  const SPECIES = ['brachio', 'trex', 'trice'];

  function baby(ci, species, opts) {
    opts = opts || {};
    const c = opts.shell || EGG_COLORS[ci % EGG_COLORS.length];
    const b = opts.fill || BABY_COLORS[ci % BABY_COLORS.length];
    const sp = species || 'brachio';
    // 頭後面 / 頭上面嘅特徵
    const behind = {
      brachio: `<path d="M36 22 l5 -10 l5 10z M48 17 l5 -11 l5 11z M60 22 l5 -9 l4 10z" fill="${b}" stroke="#000" stroke-opacity=".12"/>`,
      trex: ``,
      trice: `<ellipse cx="50" cy="30" rx="34" ry="24" fill="#f6a5bd"/>
        <circle cx="20" cy="24" r="5" fill="#f6a5bd"/><circle cx="30" cy="10" r="5" fill="#f6a5bd"/><circle cx="50" cy="6" r="5" fill="#f6a5bd"/>
        <circle cx="70" cy="10" r="5" fill="#f6a5bd"/><circle cx="80" cy="24" r="5" fill="#f6a5bd"/>`
    }[sp];
    const front = {
      brachio: ``,
      trex: ``,
      trice: `<path d="M38 22 l3 -12 l5 11z M56 21 l5 -11 l3 12z" fill="#fff4dc" stroke="#a88b6a" stroke-opacity=".4" stroke-linejoin="round"/>
        <path d="M47 27 l3 -8 l3 8z" fill="#fff4dc" stroke="#a88b6a" stroke-opacity=".4" stroke-linejoin="round"/>`
    }[sp];
    const headR = sp === 'trex' ? 27 : 25;
    return `<svg viewBox="0 0 100 110" aria-hidden="true">
      ${opts.defs || ''}
      <ellipse cx="50" cy="105" rx="30" ry="4.5" fill="#000" opacity=".10"/>
      ${behind}
      <ellipse cx="50" cy="58" rx="27" ry="26" fill="${b}"/>
      <circle cx="50" cy="40" r="${headR}" fill="${b}"/>
      ${front}
      <g class="eye-open"><circle cx="41" cy="38" r="5.5" fill="#3b3247"/><circle cx="43" cy="36" r="2" fill="#fff"/>
      <circle cx="61" cy="38" r="5.5" fill="#3b3247"/><circle cx="63" cy="36" r="2" fill="#fff"/></g>
      <path class="eye-closed" d="M36 39 Q41 44 46 39 M56 39 Q61 44 66 39" stroke="#3b3247" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="48" r="4.5" fill="#ff8fa8" opacity=".55"/>
      <circle cx="67" cy="48" r="4.5" fill="#ff8fa8" opacity=".55"/>
      <path d="M44 49 Q51 56 58 49" stroke="#3b3247" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${sp === 'trex' ? '<path d="M46 50.5 l2 3.5 l2 -3z M52 50.5 l2 3.5 l2 -3z" fill="#fff"/>' : ''}
      <ellipse cx="27" cy="64" rx="5" ry="8" transform="rotate(-30 27 64)" fill="${b}" stroke="#000" stroke-opacity=".1"/>
      <ellipse cx="73" cy="64" rx="5" ry="8" transform="rotate(30 73 64)" fill="${b}" stroke="#000" stroke-opacity=".1"/>
      <path d="M12 66 L22 58 L32 68 L42 58 L50 67 L58 58 L68 68 L78 58 L88 66 C92 92 74 104 50 104 C26 104 8 92 12 66Z"
            fill="${c.base}" stroke="#a88b6a" stroke-opacity=".35" stroke-width="2.5"/>
      <circle cx="34" cy="84" r="5" fill="${c.spot}"/><circle cx="64" cy="88" r="7" fill="${c.spot}"/>
      ${opts.extra || ''}
    </svg>`;
  }

  // ---------- 特別恐龍BB（每節完結孵一隻；三款輪流，集貼紙用） ----------
  const SPECIALS = ['rainbow', 'gold', 'star'];
  const sparkle = (x, y, r, col) => `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="${col || '#fff6b0'}"/>`;
  function specialBaby(kind, species) {
    if (kind === 'rainbow') {
      return baby(0, species, {
        defs: `<defs><linearGradient id="rbgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff9a9a"/><stop offset=".2" stop-color="#ffc46b"/><stop offset=".4" stop-color="#fff07a"/>
          <stop offset=".6" stop-color="#8fe0a0"/><stop offset=".8" stop-color="#8fbdf0"/><stop offset="1" stop-color="#c7a3ff"/></linearGradient></defs>`,
        fill: 'url(#rbgrad)',
        shell: { base: '#ffffff', spot: '#ffc46b' },
        extra: sparkle(14, 20, 6) + sparkle(88, 30, 5)
      });
    }
    if (kind === 'gold') {
      return baby(0, species, {
        fill: '#ffd36e',
        shell: { base: '#fff6d6', spot: '#f2c45c' },
        extra: `<path d="M36 18 L38 4 L45 12 L50 2 L55 12 L62 4 L64 18Z" fill="#f2c45c" stroke="#d9a53a" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="50" cy="12" r="2.6" fill="#f2706b"/>` + sparkle(14, 26, 6) + sparkle(88, 18, 5)
      });
    }
    return baby(0, species, {
      fill: '#a9bcff',
      shell: { base: '#3d4a8a', spot: '#ffe27a' },
      extra: sparkle(40, 66, 4, '#fff') + sparkle(60, 60, 3, '#fff') + sparkle(14, 22, 6) + sparkle(88, 30, 6) + sparkle(50, 0 + 6, 5)
    });
  }
  function specialEgg() {
    return `<svg viewBox="0 0 100 124" aria-hidden="true">
      <defs><linearGradient id="spegg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c9"/><stop offset="1" stop-color="#ffd36e"/></linearGradient></defs>
      <ellipse cx="50" cy="118" rx="32" ry="5" fill="#000" opacity=".10"/>
      <path d="${EGG_PATH}" fill="url(#spegg)" stroke="#d9a53a" stroke-width="3"/>
      <path d="M30 60 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8" stroke="#f2706b" stroke-width="4" fill="none" stroke-linejoin="round"/>
      ${sparkle(34, 36, 7, '#fff')}${sparkle(66, 86, 6, '#fff')}${sparkle(40, 92, 4, '#fff')}
      <ellipse cx="33" cy="30" rx="7" ry="12" transform="rotate(25 33 30)" fill="#fff" opacity=".7"/>
    </svg>`;
  }

  // 每隻恐龍媽媽都有：.mama-head / .mama-mouth-open / .eye-open / .eye-closed（俾 CSS 做講嘢、瞓覺動畫）
  function bow(x, y) {
    return `<path d="M${x} ${y} l-14 -10 l2 18z M${x} ${y} l14 -12 l0 18z" fill="#f6a5bd"/><circle cx="${x}" cy="${y - 1}" r="4" fill="#f08aaa"/>`;
  }

  function mamaBrachio() {
    return `<svg viewBox="0 0 280 250" aria-hidden="true">
      <ellipse cx="130" cy="236" rx="110" ry="10" fill="#000" opacity=".08"/>
      <path d="M60 170 C30 175 10 190 4 214 C30 204 50 198 76 196Z" fill="#7cc89a"/>
      <rect x="62" y="186" width="30" height="48" rx="14" fill="#6dbb8b"/>
      <rect x="150" y="186" width="30" height="48" rx="14" fill="#6dbb8b"/>
      <ellipse cx="130" cy="166" rx="84" ry="56" fill="#86d3a4"/>
      <ellipse cx="138" cy="186" rx="56" ry="30" fill="#c9efd2"/>
      <path d="M170 140 C188 112 196 84 200 64 L232 70 C226 100 214 134 196 160Z" fill="#86d3a4"/>
      <g class="mama-head">
        <ellipse cx="222" cy="58" rx="40" ry="31" fill="#86d3a4"/>
        <g class="eye-open"><circle cx="232" cy="48" r="8" fill="#3b3247"/><circle cx="235" cy="45" r="3" fill="#fff"/>
        <path d="M222 40 l-4 -6 M228 38 l-2 -7 M234 38 l0 -7" stroke="#3b3247" stroke-width="2.4" stroke-linecap="round"/></g>
        <path class="eye-closed" d="M223 49 Q232 57 241 49" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="244" cy="66" r="7" fill="#ff8fa8" opacity=".5"/>
        <circle cx="256" cy="54" r="2.2" fill="#3b3247" opacity=".5"/>
        <path d="M236 72 Q248 82 258 70" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse class="mama-mouth-open" cx="247" cy="75" rx="7" ry="5" fill="#b0506a"/>
        ${bow(206, 30)}
      </g>
      <path d="M70 124 l10 -14 l10 12 l12 -14 l10 12 l12 -12 l10 12" stroke="#5fae7f" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="96" cy="150" r="9" fill="#6dbb8b"/><circle cx="122" cy="138" r="6" fill="#6dbb8b"/><circle cx="74" cy="168" r="6" fill="#6dbb8b"/>
      <rect x="92" y="190" width="30" height="46" rx="14" fill="#7cc89a"/>
      <rect x="176" y="190" width="30" height="46" rx="14" fill="#7cc89a"/>
    </svg>`;
  }

  // 暴龍：圓頭、細細對手、圓角牙仔 —— 友善版
  function mamaTrex() {
    const body = '#f6b26b', dark = '#e5964b', belly = '#ffe2bd';
    return `<svg viewBox="0 0 280 250" aria-hidden="true">
      <ellipse cx="140" cy="236" rx="105" ry="10" fill="#000" opacity=".08"/>
      <path d="M96 150 C60 148 26 168 8 204 C44 198 74 190 104 186Z" fill="${body}"/>
      <rect x="92" y="180" width="38" height="50" rx="17" fill="${dark}"/>
      <ellipse cx="114" cy="230" rx="24" ry="8" fill="${dark}"/>
      <ellipse cx="140" cy="152" rx="62" ry="58" fill="${body}"/>
      <ellipse cx="158" cy="168" rx="38" ry="40" fill="${belly}"/>
      <rect x="146" y="184" width="38" height="48" rx="17" fill="${body}"/>
      <ellipse cx="168" cy="230" rx="24" ry="8" fill="${body}"/>
      <ellipse cx="178" cy="112" rx="36" ry="38" fill="${body}"/>
      <!-- 細手 -->
      <ellipse cx="200" cy="146" rx="13" ry="6" transform="rotate(35 200 146)" fill="${dark}"/>
      <ellipse cx="190" cy="156" rx="12" ry="5.5" transform="rotate(35 190 156)" fill="${dark}"/>
      <circle cx="104" cy="128" r="8" fill="${dark}"/><circle cx="124" cy="112" r="6" fill="${dark}"/><circle cx="96" cy="152" r="6" fill="${dark}"/>
      <g class="mama-head">
        <ellipse cx="204" cy="76" rx="60" ry="45" fill="${body}"/>
        <path d="M156 92 Q204 128 258 96 Q254 116 206 122 Q166 120 156 92Z" fill="${body}"/>
        <g class="eye-open"><circle cx="214" cy="60" r="9" fill="#3b3247"/><circle cx="217" cy="57" r="3.2" fill="#fff"/>
        <path d="M204 51 l-4 -7 M210 48 l-2 -8 M217 47 l0 -8" stroke="#3b3247" stroke-width="2.4" stroke-linecap="round"/></g>
        <path class="eye-closed" d="M204 62 Q214 70 224 62" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="240" cy="84" r="8" fill="#ff8fa8" opacity=".5"/>
        <circle cx="254" cy="66" r="2.6" fill="#3b3247" opacity=".5"/>
        <path d="M196 98 Q228 116 258 94" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M212 104 l4 7 l4 -6z M236 105 l3 6 l4 -7z" fill="#fff" stroke="#e5d5c0" stroke-width="1"/>
        <ellipse class="mama-mouth-open" cx="228" cy="106" rx="9" ry="6" fill="#b0506a"/>
        ${bow(178, 36)}
      </g>
    </svg>`;
  }

  // 三角龍：粉紅頸盾 + 三隻圓頭角
  function mamaTrice() {
    const body = '#a9c1f5', dark = '#8ea9e6', belly = '#dfe8ff', frill = '#f6a5bd', horn = '#fff4dc';
    return `<svg viewBox="0 0 280 250" aria-hidden="true">
      <ellipse cx="135" cy="236" rx="110" ry="10" fill="#000" opacity=".08"/>
      <path d="M62 162 C34 164 14 178 6 200 C30 194 50 190 72 188Z" fill="${body}"/>
      <rect x="62" y="186" width="30" height="48" rx="14" fill="${dark}"/>
      <rect x="146" y="186" width="30" height="48" rx="14" fill="${dark}"/>
      <ellipse cx="128" cy="162" rx="82" ry="54" fill="${body}"/>
      <ellipse cx="136" cy="184" rx="54" ry="26" fill="${belly}"/>
      <circle cx="96" cy="140" r="8" fill="${dark}"/><circle cx="120" cy="128" r="6" fill="${dark}"/><circle cx="76" cy="160" r="6" fill="${dark}"/>
      <rect x="90" y="190" width="30" height="46" rx="14" fill="${body}"/>
      <rect x="178" y="190" width="30" height="46" rx="14" fill="${body}"/>
      <g class="mama-head">
        <ellipse cx="190" cy="100" rx="50" ry="56" fill="${frill}"/>
        <g fill="${frill}">
          <circle cx="148" cy="70" r="10"/><circle cx="160" cy="50" r="10"/><circle cx="180" cy="40" r="10"/>
          <circle cx="202" cy="40" r="10"/><circle cx="222" cy="52" r="10"/><circle cx="148" cy="96" r="10"/><circle cx="152" cy="124" r="10"/>
        </g>
        <ellipse cx="190" cy="100" rx="34" ry="40" fill="#f9c1d2"/>
        <ellipse cx="218" cy="122" rx="46" ry="34" fill="${body}"/>
        <path d="M206 92 Q212 64 228 50 Q226 76 222 94Z" fill="${horn}" stroke="#d8c6a6" stroke-width="2" stroke-linejoin="round"/>
        <path d="M232 98 Q244 72 262 62 Q256 86 246 102Z" fill="${horn}" stroke="#d8c6a6" stroke-width="2" stroke-linejoin="round"/>
        <path d="M252 116 Q264 104 276 102 Q272 116 262 124Z" fill="${horn}" stroke="#d8c6a6" stroke-width="2" stroke-linejoin="round"/>
        <g class="eye-open"><circle cx="226" cy="110" r="7.5" fill="#3b3247"/><circle cx="228.5" cy="107.5" r="2.8" fill="#fff"/>
        <path d="M217 103 l-4 -6 M222 100 l-2 -7" stroke="#3b3247" stroke-width="2.2" stroke-linecap="round"/></g>
        <path class="eye-closed" d="M218 111 Q226 118 234 111" stroke="#3b3247" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        <circle cx="240" cy="128" r="7" fill="#ff8fa8" opacity=".5"/>
        <path d="M232 138 Q248 148 262 132" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse class="mama-mouth-open" cx="248" cy="140" rx="7" ry="5" fill="#b0506a"/>
        ${bow(172, 44)}
      </g>
    </svg>`;
  }

  function mama(species) {
    if (species === 'trex') return mamaTrex();
    if (species === 'trice') return mamaTrice();
    return mamaBrachio();
  }

  function nest() {
    return `<svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true">
      <ellipse cx="150" cy="70" rx="146" ry="36" fill="#b98a5a"/>
      <ellipse cx="150" cy="58" rx="124" ry="22" fill="#8a6440"/>
      <path d="M14 66 Q80 96 150 92 Q220 96 286 66" stroke="#d8ac74" stroke-width="5" fill="none"/>
      <path d="M24 78 Q90 104 160 100 Q230 100 276 78" stroke="#a87a4c" stroke-width="5" fill="none"/>
      <path d="M40 60 L70 86 M90 64 L120 96 M180 96 L210 64 M230 90 L262 60 M140 98 L160 70" stroke="#d8ac74" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function bush() {
    return `<svg viewBox="0 0 120 70" aria-hidden="true">
      <circle cx="28" cy="46" r="26" fill="#6cbf7c"/><circle cx="62" cy="34" r="32" fill="#7bcb8a"/>
      <circle cx="94" cy="46" r="26" fill="#6cbf7c"/><rect x="6" y="46" width="108" height="24" rx="12" fill="#6cbf7c"/>
      <circle cx="48" cy="26" r="6" fill="#a5e0ad"/><circle cx="80" cy="40" r="4" fill="#a5e0ad"/>
      <circle cx="30" cy="40" r="3.5" fill="#ffd36e"/><circle cx="96" cy="34" r="3.5" fill="#ff9fb8"/>
    </svg>`;
  }

  function rock() {
    return `<svg viewBox="0 0 120 70" aria-hidden="true">
      <path d="M8 68 C4 40 24 18 54 14 C86 10 112 30 114 68Z" fill="#b9b3c4"/>
      <path d="M24 34 C36 24 50 20 64 22" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M70 68 C76 52 92 46 112 54 L114 68Z" fill="#a29cb0"/>
      <circle cx="40" cy="52" r="4" fill="#8bc49a"/><circle cx="48" cy="56" r="3" fill="#8bc49a"/>
    </svg>`;
  }

  function background() {
    return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bfe6ff"/><stop offset=".7" stop-color="#e8f6ff"/><stop offset="1" stop-color="#fff6e3"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#sky)"/>
      <g class="sun"><circle cx="1380" cy="150" r="80" fill="#ffe9a8"/>
      <circle cx="1380" cy="150" r="110" fill="#ffe9a8" opacity=".35"/></g>
      <g class="cloud cloud-a" fill="#fff" opacity=".9">
        <ellipse cx="300" cy="140" rx="90" ry="34"/><ellipse cx="360" cy="120" rx="60" ry="40"/><ellipse cx="240" cy="130" rx="50" ry="28"/>
      </g>
      <g class="cloud cloud-b" fill="#fff" opacity=".8">
        <ellipse cx="900" cy="220" rx="80" ry="28"/><ellipse cx="950" cy="200" rx="50" ry="34"/>
      </g>
      <path d="M0 520 C200 420 380 470 560 430 C760 380 900 470 1100 420 C1300 370 1460 440 1600 410 L1600 1000 L0 1000Z" fill="#cdeec4"/>
      <path d="M0 600 C240 540 420 600 700 560 C980 520 1200 600 1600 550 L1600 1000 L0 1000Z" fill="#b4e3a9"/>
      <path d="M0 700 C300 660 600 710 900 680 C1200 650 1400 700 1600 680 L1600 1000 L0 1000Z" fill="#a2da97"/>
      <!-- 棕櫚樹 -->
      <g transform="translate(1460 380)">
        <path d="M0 0 C8 80 4 160 14 240" stroke="#c49a6c" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M0 0 C-40 -30 -90 -20 -120 10 C-80 0 -40 0 0 0Z M0 0 C40 -40 100 -30 120 0 C80 -6 40 -4 0 0Z M0 0 C-20 -50 -10 -90 20 -110 C10 -70 8 -30 0 0Z" fill="#78c487"/>
      </g>
      <!-- 蕨類 -->
      <g fill="#8fd09a">
        <ellipse cx="120" cy="720" rx="60" ry="22" transform="rotate(-20 120 720)"/>
        <ellipse cx="180" cy="700" rx="60" ry="20" transform="rotate(15 180 700)"/>
        <ellipse cx="1280" cy="760" rx="70" ry="22" transform="rotate(-15 1280 760)"/>
        <ellipse cx="1350" cy="740" rx="60" ry="20" transform="rotate(20 1350 740)"/>
      </g>
      <!-- 小花 -->
      <g>
        <circle cx="420" cy="820" r="8" fill="#ffd36e"/><circle cx="760" cy="900" r="8" fill="#ffb3c7"/>
        <circle cx="1100" cy="840" r="8" fill="#c7b3ff"/><circle cx="1500" cy="920" r="8" fill="#ffd36e"/>
        <circle cx="260" cy="940" r="8" fill="#ffb3c7"/>
      </g>
    </svg>`;
  }

  function night() {
    return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1600" height="1000" fill="#2c3566" opacity=".55"/>
      <circle cx="1300" cy="170" r="70" fill="#fff6c9"/>
      <circle cx="1330" cy="150" r="66" fill="#4a5490" opacity=".9"/>
      <g fill="#fff6c9">
        <circle cx="200" cy="120" r="4"/><circle cx="420" cy="80" r="3"/><circle cx="640" cy="160" r="4"/>
        <circle cx="880" cy="90" r="3"/><circle cx="1050" cy="200" r="3"/><circle cx="1500" cy="300" r="3"/>
        <circle cx="300" cy="260" r="3"/><circle cx="760" cy="280" r="2.5"/>
      </g>
    </svg>`;
  }

  // 圖示（唔用文字）
  const icons = {
    play: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 28 L74 50 L38 72Z" fill="#fff" stroke="#fff" stroke-width="8" stroke-linejoin="round"/></svg>`,
    again: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M70 36 A26 26 0 1 0 76 58" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M58 22 L78 34 L62 50Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>`,
    home: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 50 L50 20 L82 50" stroke="#f6a05a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 46 V80 H72 V46" fill="#ffe9c9" stroke="#f6a05a" stroke-width="8" stroke-linejoin="round"/><rect x="43" y="58" width="14" height="22" rx="4" fill="#f6a05a"/></svg>`,
    gear: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="8"/><g stroke="currentColor" stroke-width="10" stroke-linecap="round"><path d="M50 14v10M50 76v10M14 50h10M76 50h10M25 25l7 7M68 68l7 7M25 75l7-7M68 32l7-7"/></g></svg>`
  };

  return { SPECIES, SPECIALS, egg, baby, specialBaby, specialEgg, mama, nest, bush, rock, background, night, icons, EGG_COLORS };
})();
