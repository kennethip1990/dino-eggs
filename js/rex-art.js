/* Super Rex（原創超級暴龍）+ 8 隻農場動物 SVG。動物嘅腳每隻有 class="leg"（由左至右），數腳時逐隻發光 */
const RexArt = (() => {
  const INK = '#3b3247';
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="163" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;

  // ---------- Super Rex ----------
  function rex() {
    const g = '#7fcf7a', dark = '#5fb35c', belly = '#e7f7c8';
    return `<svg viewBox="0 0 300 300" aria-hidden="true" class="rex-svg">
      <ellipse cx="150" cy="288" rx="110" ry="10" fill="#000" opacity=".08"/>
      <g class="rex-cape">
        <path d="M128 118 Q96 160 44 252 Q100 274 158 252 Q150 186 168 122Z" fill="#f2706b"/>
        <path d="M58 244 Q104 262 156 246 L156 232 Q104 248 64 232Z" fill="#d95a56"/>
      </g>
      <path d="M112 188 C70 188 30 214 8 256 C48 248 86 238 122 226Z" fill="${g}"/>
      <rect x="104" y="214" width="42" height="62" rx="18" fill="${dark}"/>
      <ellipse cx="128" cy="276" rx="28" ry="9" fill="${dark}"/>
      <ellipse cx="150" cy="186" rx="62" ry="64" fill="${g}"/>
      <ellipse cx="170" cy="204" rx="40" ry="44" fill="${belly}"/>
      <circle cx="170" cy="196" r="21" fill="#ffd36e" stroke="#e8b84a" stroke-width="4"/>
      <path d="M162 208 V184 h10 a7 7 0 0 1 0 14 h-10 M171 198 l9 10" stroke="#f2706b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="156" y="226" width="42" height="54" rx="18" fill="${g}"/>
      <ellipse cx="182" cy="280" rx="28" ry="9" fill="${g}"/>
      <circle cx="112" cy="150" r="9" fill="${dark}"/><circle cx="128" cy="132" r="7" fill="${dark}"/><circle cx="100" cy="176" r="7" fill="${dark}"/>
      <g class="rex-arm"><ellipse cx="214" cy="168" rx="15" ry="7" transform="rotate(-35 214 168)" fill="${dark}"/></g>
      <ellipse cx="206" cy="182" rx="13" ry="6" transform="rotate(30 206 182)" fill="${dark}"/>
      <g class="rex-head">
        <ellipse cx="206" cy="102" rx="64" ry="48" fill="${g}"/>
        <path d="M154 118 Q206 156 266 122 Q262 144 208 150 Q166 148 154 118Z" fill="${g}"/>
        <path d="M150 84 C132 78 118 86 108 74 M150 94 C134 96 122 104 110 98" stroke="#5b8def" stroke-width="8" fill="none" stroke-linecap="round"/>
        <rect x="150" y="70" width="104" height="32" rx="16" fill="#5b8def"/>
        <ellipse cx="222" cy="86" rx="13" ry="12" fill="#fff"/>
        ${eye(224, 87, 7)}
        <path d="M208 64 Q222 56 238 64" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="258" cy="96" r="2.8" fill="${INK}" opacity=".5"/>
        <circle cx="236" cy="118" r="8" fill="#ff8fa8" opacity=".5"/>
        <path class="rex-smile" d="M196 126 Q230 146 262 120" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="rex-roar">
          <path d="M190 122 Q228 172 264 120 Q230 136 190 122Z" fill="#b0506a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M204 128 l4 9 l5 -8z M226 131 l4 9 l5 -9z M246 128 l3 8 l5 -9z" fill="#fff"/>
        </g>
      </g>
    </svg>`;
  }

  // ---------- 動物（viewBox 0 0 200 170，企喺 y≈160） ----------
  const A = {};

  A.dog = () => {
    const c = '#d39a63', d = '#b07a48';
    return `${shadow(100, 72)}
      <path d="M50 92 C34 80 30 62 40 48" stroke="${c}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <rect class="leg" x="56" y="108" width="17" height="50" rx="8" fill="${c}"/>
      <rect class="leg" x="80" y="110" width="17" height="48" rx="8" fill="${d}"/>
      <rect class="leg" x="108" y="110" width="17" height="48" rx="8" fill="${d}"/>
      <rect class="leg" x="130" y="108" width="17" height="50" rx="8" fill="${c}"/>
      <ellipse cx="100" cy="98" rx="56" ry="30" fill="${c}"/>
      <ellipse cx="96" cy="110" rx="30" ry="12" fill="#f1d3b1"/>
      <rect x="128" y="76" width="30" height="10" rx="5" transform="rotate(-50 143 81)" fill="#f2706b"/>
      <circle cx="152" cy="66" r="29" fill="${c}"/>
      <ellipse cx="172" cy="78" rx="18" ry="13" fill="#f1d3b1"/>
      <ellipse cx="188" cy="73" rx="7" ry="6" fill="${INK}"/>
      <path d="M172 88 Q179 93 186 87" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${eye(156, 58, 5.5)}
      <ellipse cx="134" cy="66" rx="11" ry="22" transform="rotate(18 134 66)" fill="${d}"/>`;
  };

  A.cat = () => {
    const c = '#b9b3c9', d = '#9a93ae';
    return `${shadow(100, 66)}
      <path d="M52 96 C26 92 22 60 40 40 C46 34 54 38 50 46 C38 62 42 82 58 86" fill="${c}"/>
      <rect class="leg" x="58" y="106" width="14" height="52" rx="7" fill="${c}"/>
      <rect class="leg" x="80" y="108" width="14" height="50" rx="7" fill="${d}"/>
      <rect class="leg" x="110" y="108" width="14" height="50" rx="7" fill="${d}"/>
      <rect class="leg" x="130" y="106" width="14" height="52" rx="7" fill="${c}"/>
      <ellipse cx="100" cy="98" rx="52" ry="26" fill="${c}"/>
      <path d="M86 74 q4 12 0 22 M102 72 q4 12 0 24 M118 74 q4 12 0 22" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M134 50 L138 22 L156 42Z M164 42 L182 22 L184 52Z" fill="${c}"/>
      <path d="M140 42 L141 30 L150 40Z M170 40 L179 30 L179 44Z" fill="#ffb3c1"/>
      <circle cx="160" cy="64" r="28" fill="${c}"/>
      ${eye(150, 60, 5)}${eye(172, 60, 5)}
      <path d="M157 72 l6 0 l-3 4z" fill="#ff8fa8"/>
      <path d="M154 80 Q160 84 160 78 Q160 84 166 80" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M144 74 l-18 -3 M144 79 l-18 3 M176 74 l18 -3 M176 79 l18 3" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
  };

  A.cow = () => {
    const c = '#ffffff', e = '#d8d0c8';
    return `${shadow(100, 76)}
      <path d="M40 90 C30 100 30 116 34 126" stroke="${e}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="34" cy="128" r="6" fill="${INK}"/>
      <g class="leg"><rect x="50" y="110" width="18" height="44" rx="6" fill="${c}" stroke="${e}" stroke-width="3"/><rect x="50" y="146" width="18" height="12" rx="4" fill="${INK}"/></g>
      <g class="leg"><rect x="74" y="112" width="18" height="42" rx="6" fill="#f2eee8" stroke="${e}" stroke-width="3"/><rect x="74" y="146" width="18" height="12" rx="4" fill="${INK}"/></g>
      <g class="leg"><rect x="108" y="112" width="18" height="42" rx="6" fill="#f2eee8" stroke="${e}" stroke-width="3"/><rect x="108" y="146" width="18" height="12" rx="4" fill="${INK}"/></g>
      <g class="leg"><rect x="132" y="110" width="18" height="44" rx="6" fill="${c}" stroke="${e}" stroke-width="3"/><rect x="132" y="146" width="18" height="12" rx="4" fill="${INK}"/></g>
      <rect x="38" y="64" width="124" height="60" rx="30" fill="${c}" stroke="${e}" stroke-width="4"/>
      <path d="M60 68 C76 66 84 82 74 94 C62 104 48 94 50 80Z M108 92 C122 86 136 96 130 110 C122 120 104 114 106 102Z M128 66 C140 64 148 72 144 80 C136 86 126 80 128 66Z" fill="${INK}"/>
      <path d="M150 38 l-6 -14 l10 8z M184 38 l6 -14 l-10 8z" fill="#ffe9a8" stroke="#e8c76a" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="140" cy="52" rx="14" ry="7" transform="rotate(-20 140 52)" fill="${c}" stroke="${e}" stroke-width="3"/>
      <ellipse cx="194" cy="52" rx="14" ry="7" transform="rotate(20 194 52)" fill="${c}" stroke="${e}" stroke-width="3"/>
      <rect x="146" y="34" width="42" height="60" rx="20" fill="${c}" stroke="${e}" stroke-width="4"/>
      <path d="M150 48 C158 40 166 46 164 56 C160 62 150 60 150 48Z" fill="${INK}"/>
      <ellipse cx="167" cy="88" rx="26" ry="17" fill="#ffc2cf"/>
      <ellipse cx="158" cy="88" rx="4" ry="5" fill="#d9788f"/><ellipse cx="176" cy="88" rx="4" ry="5" fill="#d9788f"/>
      ${eye(158, 60, 4.5)}${eye(178, 60, 4.5)}`;
  };

  A.pig = () => {
    const c = '#ffb3c1', d = '#f497ab';
    return `${shadow(100, 70)}
      <path d="M44 88 c-10 -2 -14 -12 -6 -16 c8 -4 10 8 2 10 c-6 2 -10 -4 -8 -8" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect class="leg" x="56" y="116" width="18" height="42" rx="8" fill="${c}"/>
      <rect class="leg" x="80" y="118" width="18" height="40" rx="8" fill="${d}"/>
      <rect class="leg" x="108" y="118" width="18" height="40" rx="8" fill="${d}"/>
      <rect class="leg" x="130" y="116" width="18" height="42" rx="8" fill="${c}"/>
      <ellipse cx="100" cy="98" rx="60" ry="38" fill="${c}"/>
      <path d="M136 52 L144 30 L158 50Z M170 50 L182 30 L188 54Z" fill="${d}"/>
      <circle cx="162" cy="74" r="30" fill="${c}"/>
      ${eye(152, 66, 4.5)}${eye(174, 66, 4.5)}
      <ellipse cx="166" cy="86" rx="16" ry="12" fill="${d}"/>
      <ellipse cx="160" cy="86" rx="3.5" ry="5" fill="#c9617a"/><ellipse cx="172" cy="86" rx="3.5" ry="5" fill="#c9617a"/>
      <circle cx="144" cy="84" r="6" fill="#ff8fa8" opacity=".6"/>`;
  };

  A.frog = () => {
    const c = '#7fcf7a', d = '#5fb35c';
    return `${shadow(100, 74)}
      <g class="leg"><ellipse cx="50" cy="136" rx="30" ry="16" fill="${d}"/><path d="M24 154 l-8 4 M30 156 l-4 6 M38 156 l0 6" stroke="${d}" stroke-width="5" stroke-linecap="round"/></g>
      <g class="leg"><rect x="74" y="118" width="16" height="38" rx="8" fill="${c}"/><ellipse cx="80" cy="156" rx="13" ry="5" fill="${d}"/></g>
      <g class="leg"><rect x="110" y="118" width="16" height="38" rx="8" fill="${c}"/><ellipse cx="120" cy="156" rx="13" ry="5" fill="${d}"/></g>
      <g class="leg"><ellipse cx="150" cy="136" rx="30" ry="16" fill="${d}"/><path d="M176 154 l8 4 M170 156 l4 6 M162 156 l0 6" stroke="${d}" stroke-width="5" stroke-linecap="round"/></g>
      <ellipse cx="100" cy="102" rx="54" ry="40" fill="${c}"/>
      <ellipse cx="100" cy="116" rx="32" ry="20" fill="#d9f2c4"/>
      <circle cx="74" cy="64" r="20" fill="${c}"/><circle cx="126" cy="64" r="20" fill="${c}"/>
      <circle cx="74" cy="62" r="13" fill="#fff"/><circle cx="126" cy="62" r="13" fill="#fff"/>
      ${eye(76, 63, 7)}${eye(124, 63, 7)}
      <path d="M78 94 Q100 110 122 94" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="66" cy="94" r="7" fill="#ff8fa8" opacity=".5"/><circle cx="134" cy="94" r="7" fill="#ff8fa8" opacity=".5"/>`;
  };

  A.duck = () => {
    const c = '#ffd96e', d = '#f2be45', o = '#f6a05a';
    return `${shadow(98, 54)}
      <g class="leg"><path d="M86 128 V154" stroke="${o}" stroke-width="7" stroke-linecap="round"/><path d="M74 158 L98 158 L86 148Z" fill="${o}" stroke="${o}" stroke-width="4" stroke-linejoin="round"/></g>
      <g class="leg"><path d="M110 128 V154" stroke="${o}" stroke-width="7" stroke-linecap="round"/><path d="M98 158 L122 158 L110 148Z" fill="${o}" stroke="${o}" stroke-width="4" stroke-linejoin="round"/></g>
      <path d="M48 96 L30 80 L40 104Z" fill="${c}"/>
      <ellipse cx="94" cy="104" rx="52" ry="32" fill="${c}"/>
      <path d="M70 96 C88 86 112 92 118 106 C100 118 80 116 70 96Z" fill="${d}"/>
      <circle cx="140" cy="62" r="26" fill="${c}"/>
      <path d="M160 64 C176 60 186 64 186 70 C186 76 174 78 160 74Z" fill="${o}"/>
      ${eye(146, 56, 5)}
      <circle cx="140" cy="72" r="6" fill="#ff8fa8" opacity=".5"/>`;
  };

  A.hen = () => {
    const c = '#fffaf0', e = '#e2d6c2', y = '#f2be45';
    return `${shadow(98, 54)}
      <g class="leg"><path d="M88 124 V152 M88 152 l-10 6 M88 152 l0 8 M88 152 l10 6" stroke="${y}" stroke-width="6" stroke-linecap="round" fill="none"/></g>
      <g class="leg"><path d="M110 124 V152 M110 152 l-10 6 M110 152 l0 8 M110 152 l10 6" stroke="${y}" stroke-width="6" stroke-linecap="round" fill="none"/></g>
      <path d="M58 92 C40 70 30 56 40 44 C48 60 56 64 62 70 C56 52 58 40 70 34 C70 54 74 66 80 76Z" fill="#c9764a"/>
      <ellipse cx="98" cy="100" rx="46" ry="34" fill="${c}" stroke="${e}" stroke-width="4"/>
      <path d="M74 96 C90 84 112 90 116 104 C100 116 84 114 74 96Z" fill="${e}"/>
      <path d="M126 46 C126 34 136 32 138 40 C140 30 150 30 150 40 C154 32 164 36 158 48Z" fill="#f2706b"/>
      <circle cx="140" cy="64" r="22" fill="${c}" stroke="${e}" stroke-width="4"/>
      <path d="M160 62 L176 68 L160 74Z" fill="${y}"/>
      <path d="M156 76 C160 84 160 92 152 92 C148 88 150 80 156 76Z" fill="#f2706b"/>
      ${eye(146, 58, 4.5)}`;
  };

  A.fish = () => {
    const c = '#ff9a5a', d = '#f27a3c';
    return `<path d="M54 92 L18 62 L24 92 L18 122Z" fill="${d}"/>
      <path d="M88 64 C96 44 120 42 132 60Z" fill="${d}"/>
      <ellipse cx="100" cy="92" rx="56" ry="34" fill="${c}"/>
      <path d="M84 70 C90 84 90 100 84 114 M102 66 C108 82 108 102 102 118" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M100 104 C108 116 120 116 120 108Z" fill="${d}"/>
      <circle cx="134" cy="84" r="11" fill="#fff"/>${eye(136, 85, 6)}
      <path d="M146 102 Q152 106 156 100" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="170" cy="62" r="6" fill="none" stroke="#9fd3ff" stroke-width="3"/>
      <circle cx="182" cy="42" r="4" fill="none" stroke="#9fd3ff" stroke-width="3"/>`;
  };

  function animal(id) {
    return `<svg viewBox="0 0 200 170" aria-hidden="true" class="animal-svg" data-animal="${id}">${A[id]()}</svg>`;
  }

  // 農場：草地 + 木欄（喺畫面底）
  function farm() {
    let posts = '';
    for (let x = 20; x < 1600; x += 90) posts += `<rect x="${x}" y="20" width="18" height="90" rx="6"/>`;
    return `<svg viewBox="0 0 1600 200" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="60" width="1600" height="140" fill="#a2da97"/>
      <g fill="#d9a46c">${posts}<rect x="0" y="40" width="1600" height="14" rx="6"/><rect x="0" y="78" width="1600" height="14" rx="6"/></g>
    </svg>`;
  }

  // 數腳圍欄嘅牌：大數字 + 腳印
  function legSign(n) {
    const prints = [];
    const w = n * 34;
    for (let i = 0; i < n; i++) {
      const x = 100 - w / 2 + 17 + i * 34;
      prints.push(`<ellipse cx="${x}" cy="128" rx="11" ry="14" fill="#c98d5a"/><circle cx="${x - 8}" cy="108" r="4" fill="#c98d5a"/><circle cx="${x}" cy="104" r="4" fill="#c98d5a"/><circle cx="${x + 8}" cy="108" r="4" fill="#c98d5a"/>`);
    }
    return `<svg viewBox="0 0 200 150" aria-hidden="true">
      <rect x="14" y="6" width="172" height="140" rx="22" fill="#fff6e0" stroke="#d9a46c" stroke-width="6"/>
      <text x="100" y="84" text-anchor="middle" font-family="Andika, system-ui, sans-serif" font-weight="700" font-size="84" fill="${INK}">${n}</text>
      ${prints.join('')}
    </svg>`;
  }

  // 愛心形狀嘅吼聲波（打怪獸用）
  function roarWave() {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 20 Q60 50 30 80 M50 12 Q88 50 50 88 M70 6 Q112 50 70 94" stroke="#ffd36e" stroke-width="9" fill="none" stroke-linecap="round"/></svg>`;
  }

  return { rex, animal, farm, legSign, roarWave, ANIMALS: Object.keys(A) };
})();
