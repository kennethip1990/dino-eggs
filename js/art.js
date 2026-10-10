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

  function baby(ci) {
    const c = EGG_COLORS[ci % EGG_COLORS.length];
    const b = BABY_COLORS[ci % BABY_COLORS.length];
    return `<svg viewBox="0 0 100 110" aria-hidden="true">
      <ellipse cx="50" cy="105" rx="30" ry="4.5" fill="#000" opacity=".10"/>
      <path d="M36 22 l5 -10 l5 10z M48 17 l5 -11 l5 11z M60 22 l5 -9 l4 10z" fill="${b}" stroke="#000" stroke-opacity=".12"/>
      <ellipse cx="50" cy="58" rx="27" ry="26" fill="${b}"/>
      <circle cx="50" cy="40" r="25" fill="${b}"/>
      <g class="eye-open"><circle cx="41" cy="38" r="5.5" fill="#3b3247"/><circle cx="43" cy="36" r="2" fill="#fff"/>
      <circle cx="61" cy="38" r="5.5" fill="#3b3247"/><circle cx="63" cy="36" r="2" fill="#fff"/></g>
      <path class="eye-closed" d="M36 39 Q41 44 46 39 M56 39 Q61 44 66 39" stroke="#3b3247" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="48" r="4.5" fill="#ff8fa8" opacity=".55"/>
      <circle cx="67" cy="48" r="4.5" fill="#ff8fa8" opacity=".55"/>
      <path d="M44 49 Q51 56 58 49" stroke="#3b3247" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="27" cy="64" rx="5" ry="8" transform="rotate(-30 27 64)" fill="${b}" stroke="#000" stroke-opacity=".1"/>
      <ellipse cx="73" cy="64" rx="5" ry="8" transform="rotate(30 73 64)" fill="${b}" stroke="#000" stroke-opacity=".1"/>
      <path d="M12 66 L22 58 L32 68 L42 58 L50 67 L58 58 L68 68 L78 58 L88 66 C92 92 74 104 50 104 C26 104 8 92 12 66Z"
            fill="${c.base}" stroke="#a88b6a" stroke-opacity=".35" stroke-width="2.5"/>
      <circle cx="34" cy="84" r="5" fill="${c.spot}"/><circle cx="64" cy="88" r="7" fill="${c.spot}"/>
    </svg>`;
  }

  function mama() {
    return `<svg viewBox="0 0 280 250" aria-hidden="true">
      <ellipse cx="130" cy="236" rx="110" ry="10" fill="#000" opacity=".08"/>
      <!-- 尾 -->
      <path d="M60 170 C30 175 10 190 4 214 C30 204 50 198 76 196Z" fill="#7cc89a"/>
      <!-- 後腳 -->
      <rect x="62" y="186" width="30" height="48" rx="14" fill="#6dbb8b"/>
      <rect x="150" y="186" width="30" height="48" rx="14" fill="#6dbb8b"/>
      <!-- 身 -->
      <ellipse cx="130" cy="166" rx="84" ry="56" fill="#86d3a4"/>
      <ellipse cx="138" cy="186" rx="56" ry="30" fill="#c9efd2"/>
      <!-- 頸 + 頭 -->
      <path d="M170 140 C188 112 196 84 200 64 L232 70 C226 100 214 134 196 160Z" fill="#86d3a4"/>
      <g class="mama-head">
        <ellipse cx="222" cy="58" rx="40" ry="31" fill="#86d3a4"/>
        <g class="eye-open"><circle cx="232" cy="48" r="8" fill="#3b3247"/><circle cx="235" cy="45" r="3" fill="#fff"/>
        <path d="M222 40 l-4 -6 M228 38 l-2 -7 M234 38 l0 -7" stroke="#3b3247" stroke-width="2.4" stroke-linecap="round"/></g>
        <path class="eye-closed" d="M223 49 Q232 57 241 49" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="244" cy="66" r="7" fill="#ff8fa8" opacity=".5"/>
        <circle cx="256" cy="54" r="2.2" fill="#3b3247" opacity=".5"/>
        <path class="mama-mouth" d="M236 72 Q248 82 258 70" stroke="#3b3247" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse class="mama-mouth-open" cx="247" cy="75" rx="7" ry="5" fill="#b0506a"/>
        <!-- 頭上蝴蝶結 -->
        <path d="M206 30 l-14 -10 l2 18z M206 30 l14 -12 l0 18z" fill="#f6a5bd"/>
        <circle cx="206" cy="29" r="4" fill="#f08aaa"/>
      </g>
      <!-- 背脊 -->
      <path d="M70 124 l10 -14 l10 12 l12 -14 l10 12 l12 -12 l10 12" stroke="#5fae7f" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <!-- 斑點 -->
      <circle cx="96" cy="150" r="9" fill="#6dbb8b"/><circle cx="122" cy="138" r="6" fill="#6dbb8b"/><circle cx="74" cy="168" r="6" fill="#6dbb8b"/>
      <!-- 前腳 -->
      <rect x="92" y="190" width="30" height="46" rx="14" fill="#7cc89a"/>
      <rect x="176" y="190" width="30" height="46" rx="14" fill="#7cc89a"/>
    </svg>`;
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
    gear: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="8"/><g stroke="currentColor" stroke-width="10" stroke-linecap="round"><path d="M50 14v10M50 76v10M14 50h10M76 50h10M25 25l7 7M68 68l7 7M25 75l7-7M68 32l7-7"/></g></svg>`
  };

  return { egg, baby, mama, nest, bush, rock, background, night, icons, EGG_COLORS };
})();
