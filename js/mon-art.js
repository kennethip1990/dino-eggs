/*
 * Luca 怪獸收集隊：全部原創 SVG（唔用任何官方角色 / 名 / 造型；app 係 public）
 * - 怪獸 viewBox 0 0 120 120：4 隻拍檔（雷雲貓 / 葉子兔 / 泡泡魚 / 石頭熊，可以進化）+ 12 隻野生怪獸
 * - 閃閃版 = 同一隻怪獸 + 金色閃光（顏色由 CSS .shiny 轉）
 * - 星星球（青 + 黃，中間粒星；刻意唔似任何官方球）、怪獸蛋、草地背景、主選單卡
 */
const MonArt = (() => {
  const INK = '#3b3247';
  const nest = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
  const shadow = (rx) => `<ellipse cx="60" cy="112" rx="${rx || 32}" ry="5" fill="#000" opacity=".1"/>`;
  // 大眼 + 面珠 + 笑口：所有怪獸共用，保持同一個可愛風格
  const eyes = (x1, x2, y, r) => {
    r = r || 7;
    return [x1, x2].map((x) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + 1}" cy="${y + 1}" r="${r * 0.62}" fill="${INK}"/><circle cx="${x + 2.6}" cy="${y - 1.6}" r="${r * 0.26}" fill="#fff"/>`).join('');
  };
  const cheeks = (x1, x2, y, c) => `<ellipse cx="${x1}" cy="${y}" rx="5" ry="3.2" fill="${c || '#ff8fb8'}" opacity=".75"/><ellipse cx="${x2}" cy="${y}" rx="5" ry="3.2" fill="${c || '#ff8fb8'}" opacity=".75"/>`;
  const smile = (x, y, w) => `<path d="M${x - (w || 6)} ${y} Q${x} ${y + 7} ${x + (w || 6)} ${y}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const feet = (c, y) => `<ellipse cx="44" cy="${y || 106}" rx="10" ry="6" fill="${c}"/><ellipse cx="76" cy="${y || 106}" rx="10" ry="6" fill="${c}"/>`;
  const star5 = (cx, cy, r, fill) => {
    const p = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
    return `<polygon points="${p}" fill="${fill}"/>`;
  };

  // ---------- 怪獸（body 只畫身，外面包 svg） ----------
  const BODY = {
    // 拍檔 1：雷雲貓 — 藍紫色貓仔，頭頂一朵白雲，閃電尾
    cat: () => `${shadow()}
      <path d="M86 84 Q108 78 104 62 L112 58 L100 50 L106 44" stroke="#ffd23e" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M32 40 L28 14 L50 30Z M88 40 L92 14 L70 30Z" fill="#8ea8f5"/><path d="M34 34 L32 20 L45 30Z M86 34 L88 20 L75 30Z" fill="#ffc2d6"/>
      ${feet('#7a92e0')}
      <ellipse cx="60" cy="70" rx="38" ry="38" fill="#9fb8ff"/>
      <ellipse cx="60" cy="84" rx="22" ry="17" fill="#e3ebff"/>
      <g fill="#fff"><circle cx="48" cy="26" r="10"/><circle cx="60" cy="20" r="12"/><circle cx="73" cy="26" r="10"/><rect x="44" y="24" width="34" height="10" rx="5"/></g>
      ${eyes(46, 74, 62)}${cheeks(36, 84, 74)}${smile(60, 74)}`,
    // 拍檔 2：葉子兔 — 薄荷綠兔仔，兩隻葉形長耳
    bunny: () => `${shadow()}
      <path d="M44 44 Q24 22 34 2 Q54 18 50 42Z" fill="#6cc067"/><path d="M76 44 Q96 22 86 2 Q66 18 70 42Z" fill="#6cc067"/>
      <path d="M46 40 Q36 22 37 8 M74 40 Q84 22 83 8" stroke="#3f8f3c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${feet('#8fd8a8')}
      <ellipse cx="60" cy="74" rx="36" ry="34" fill="#b3ecc0"/>
      <ellipse cx="60" cy="86" rx="20" ry="15" fill="#effbf0"/>
      <circle cx="94" cy="88" r="8" fill="#effbf0"/>
      ${eyes(47, 73, 66)}${cheeks(37, 83, 78)}
      <path d="M57 76 L60 79 L63 76" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    // 拍檔 3：泡泡魚 — 藍色圓魚仔，有鰭冠同小腳，頭頂吹泡泡
    fish: () => `${shadow()}
      <circle cx="84" cy="14" r="6" fill="none" stroke="#7fd0ff" stroke-width="3"/><circle cx="96" cy="26" r="4" fill="none" stroke="#7fd0ff" stroke-width="3"/><circle cx="78" cy="30" r="3" fill="none" stroke="#7fd0ff" stroke-width="2.5"/>
      <path d="M40 44 Q52 18 62 38 Q70 20 80 44Z" fill="#ffb347"/>
      <path d="M92 70 L114 56 L112 88Z" fill="#5aa8e8"/>
      ${feet('#ffb347')}
      <ellipse cx="58" cy="72" rx="38" ry="34" fill="#7fc4ff"/>
      <path d="M30 76 Q58 108 86 76" fill="#dff1ff"/>
      <path d="M22 70 Q10 62 12 80Z" fill="#5aa8e8"/>
      ${eyes(46, 70, 64)}${cheeks(36, 80, 76)}
      <ellipse cx="58" cy="80" rx="5" ry="4" fill="${INK}"/>`,
    // 拍檔 4：石頭熊 — 啡色熊仔，肩膊同肚有石頭
    bear: () => `${shadow(36)}
      <circle cx="32" cy="38" r="12" fill="#a8744c"/><circle cx="88" cy="38" r="12" fill="#a8744c"/><circle cx="32" cy="38" r="6" fill="#e0b48c"/><circle cx="88" cy="38" r="6" fill="#e0b48c"/>
      ${feet('#8a5c3a')}
      <ellipse cx="60" cy="72" rx="40" ry="38" fill="#c08a5c"/>
      <path d="M44 84 L52 74 L68 74 L76 84 L68 98 L52 98Z" fill="#b0b8c4" stroke="#8a94a4" stroke-width="3" stroke-linejoin="round"/>
      <path d="M18 62 L26 52 L36 58 L32 70Z M102 62 L94 52 L84 58 L88 70Z" fill="#b0b8c4" stroke="#8a94a4" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="60" cy="64" rx="13" ry="9" fill="#e0b48c"/>
      ${eyes(45, 75, 54, 6.5)}
      <ellipse cx="60" cy="61" rx="5" ry="3.6" fill="${INK}"/>${smile(60, 66, 5)}`,

    // ---- 野生怪獸 ----
    // 火花雀：橙色圓雀仔，頭頂火焰
    fire: () => `${shadow(28)}
      <path d="M60 8 Q74 22 66 34 Q78 28 76 44 L44 44 Q40 28 52 32 Q46 18 60 8Z" fill="#ff7a3c"/><path d="M60 22 Q66 30 62 38 L56 38 Q54 30 60 22Z" fill="#ffe680"/>
      <path d="M44 106 L40 112 M52 106 L52 113 M68 106 L68 113 M76 106 L80 112" stroke="#e8a020" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="60" cy="74" rx="34" ry="34" fill="#ffa24c"/>
      <ellipse cx="60" cy="86" rx="20" ry="16" fill="#fff0d0"/>
      <path d="M26 72 Q12 80 22 94 Q30 86 30 78Z M94 72 Q108 80 98 94 Q90 86 90 78Z" fill="#ff7a3c"/>
      ${eyes(48, 72, 64)}
      <path d="M55 74 L65 74 L60 82Z" fill="#ffd23e" stroke="#e8a020" stroke-width="2" stroke-linejoin="round"/>`,
    // 彩虹蝸牛：綠色身 + 彩虹殼
    snail: () => `${shadow(40)}
      <path d="M18 104 Q16 82 30 76 L34 60 Q30 40 40 36 M40 36 L38 26 M34 60 Q36 44 48 40 L50 30" stroke="#6cc067" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="38" cy="24" r="5" fill="#6cc067"/><circle cx="51" cy="28" r="5" fill="#6cc067"/>
      <path d="M14 106 Q14 88 30 80 L104 92 Q108 106 96 108Z" fill="#8fd18a"/>
      <circle cx="72" cy="70" r="34" fill="#ff8fb8"/><circle cx="74" cy="72" r="26" fill="#ffd23e"/><circle cx="76" cy="73" r="18" fill="#7fd6a0"/><circle cx="77" cy="74" r="10" fill="#7fb0ff"/><circle cx="78" cy="74" r="4" fill="#c7a3ff"/>
      ${eyes(28, 44, 86, 5.5)}${smile(36, 96, 5)}`,
    // 星星狗：奶黃色狗仔，額頭有粒星，大垂耳
    star: () => `${shadow()}
      <path d="M90 80 Q110 70 104 56" stroke="#f0d890" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${feet('#e8c878')}
      <ellipse cx="60" cy="70" rx="38" ry="38" fill="#fff0b8"/>
      <path d="M26 44 Q8 52 14 80 Q26 76 30 56Z M94 44 Q112 52 106 80 Q94 76 90 56Z" fill="#c89858"/>
      ${star5(60, 42, 10, '#ffd23e')}
      <ellipse cx="60" cy="78" rx="14" ry="10" fill="#fff"/>
      ${eyes(46, 74, 62)}${cheeks(36, 84, 74)}
      <ellipse cx="60" cy="74" rx="5" ry="3.6" fill="${INK}"/>${smile(60, 79, 5)}`,
    // 月光蝙蝠：紫色圓蝙蝠，肚有月亮
    bat: () => `${shadow(26)}
      <path d="M30 60 Q4 44 2 70 Q12 66 14 76 Q22 70 26 80Z M90 60 Q116 44 118 70 Q108 66 106 76 Q98 70 94 80Z" fill="#7a5ab8"/>
      <path d="M40 38 L36 18 L52 32Z M80 38 L84 18 L68 32Z" fill="#9b7ad8"/>
      <ellipse cx="60" cy="68" rx="32" ry="32" fill="#a98ae8"/>
      <path d="M66 74 A12 12 0 1 1 66 98 A9 9 0 1 0 66 74Z" fill="#ffe680"/>
      ${eyes(48, 72, 60)}${cheeks(38, 82, 72)}
      <path d="M54 72 L56 76 L58 72 M62 72 L64 76 L66 72" stroke="#fff" stroke-width="2" fill="#fff" stroke-linejoin="round"/>`,
    // 冰冰企鵝：深藍 + 白肚，頭頂冰晶
    penguin: () => `${shadow(30)}
      <path d="M60 4 V24 M51 9 L69 19 M69 9 L51 19" stroke="#9fe0ff" stroke-width="4" stroke-linecap="round"/>
      ${feet('#ffb347', 108)}
      <ellipse cx="60" cy="68" rx="34" ry="40" fill="#3f5a8f"/>
      <ellipse cx="60" cy="76" rx="24" ry="30" fill="#fff"/>
      <path d="M26 64 Q14 80 24 96 Q30 84 30 72Z M94 64 Q106 80 96 96 Q90 84 90 72Z" fill="#2f4a7f"/>
      ${eyes(49, 71, 56, 6)}${cheeks(40, 80, 66)}
      <path d="M55 64 L65 64 L60 71Z" fill="#ffb347"/>`,
    // 雲朵羊：白色雲朵身，深色面
    sheep: () => `${shadow(38)}
      <path d="M44 100 V112 M76 100 V112" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <g fill="#fff" stroke="#e0e4ee" stroke-width="2">${[[36, 60], [52, 48], [70, 48], [86, 60], [92, 78], [80, 94], [60, 98], [40, 94], [28, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16"/>`).join('')}</g>
      <circle cx="60" cy="74" r="28" fill="#fff"/>
      <ellipse cx="60" cy="72" rx="20" ry="22" fill="#5a4a6a"/>
      <path d="M38 64 Q28 60 30 70 Q36 70 40 68Z M82 64 Q92 60 90 70 Q84 70 80 68Z" fill="#5a4a6a"/>
      ${eyes(52, 68, 68, 5.5)}${cheeks(46, 74, 80, '#ffb3c7')}${smile(60, 82, 4)}`,
    // 蘑菇仔：紅點傘帽 + 奶白身
    mush: () => `${shadow(28)}
      ${feet('#e8d8b8')}
      <rect x="34" y="58" width="52" height="48" rx="20" fill="#fff4dc"/>
      <path d="M10 62 Q14 14 60 12 Q106 14 110 62 Q60 74 10 62Z" fill="#ff6b6b"/>
      <circle cx="36" cy="38" r="8" fill="#fff"/><circle cx="64" cy="26" r="7" fill="#fff"/><circle cx="86" cy="42" r="9" fill="#fff"/><circle cx="58" cy="50" r="5" fill="#fff"/>
      ${eyes(49, 71, 78, 6)}${cheeks(41, 79, 89)}${smile(60, 90, 5)}`,
    // 嗡嗡蜂：黃黑間條圓蜂，透明翼
    bee: () => `${shadow(28)}
      <ellipse cx="34" cy="38" rx="18" ry="12" fill="#e8f6ff" stroke="#9fd3ff" stroke-width="3" transform="rotate(-30 34 38)"/>
      <ellipse cx="86" cy="38" rx="18" ry="12" fill="#e8f6ff" stroke="#9fd3ff" stroke-width="3" transform="rotate(30 86 38)"/>
      <path d="M50 34 Q44 18 40 14 M70 34 Q76 18 80 14" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="40" cy="13" r="4" fill="${INK}"/><circle cx="80" cy="13" r="4" fill="${INK}"/>
      <ellipse cx="60" cy="72" rx="34" ry="34" fill="#ffd23e"/>
      <path d="M28 82 Q60 92 92 82 L88 94 Q60 104 32 94Z" fill="${INK}"/>
      <path d="M58 106 L60 114 L62 106Z" fill="${INK}"/>
      ${eyes(48, 72, 62)}${cheeks(38, 82, 72, '#ff9a6b')}${smile(60, 72, 5)}`,
    // 西瓜龜：西瓜殼烏龜
    turtle: () => `${shadow(42)}
      <circle cx="20" cy="72" r="14" fill="#a6e3a0"/>
      ${eyes(14, 26, 68, 5)}${smile(20, 78, 4)}
      <path d="M36 98 L32 110 M90 98 L94 110" stroke="#8fd18a" stroke-width="10" stroke-linecap="round"/>
      <path d="M30 96 Q30 40 70 40 Q110 40 110 96Z" fill="#3f9f4f"/>
      <path d="M44 96 Q44 50 70 46 M70 46 V96 M96 96 Q96 50 70 46" stroke="#a6e3a0" stroke-width="5" fill="none"/>
      <path d="M26 96 H114" stroke="#ff8f8f" stroke-width="8" stroke-linecap="round"/>`,
    // 花花鹿：淺啡鹿仔，頭頂花花角
    deer: () => `${shadow()}
      <path d="M42 36 L36 16 M38 24 L28 20 M78 36 L84 16 M82 24 L92 20" stroke="#a8744c" stroke-width="4" stroke-linecap="round"/>
      ${[[36, 14, '#ff8fb8'], [27, 19, '#ffe680'], [84, 14, '#c7a3ff'], [93, 19, '#ff8fb8']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.2" fill="#fff"/>`).join('')}
      <path d="M30 46 Q16 40 18 54 Q26 56 34 52Z M90 46 Q104 40 102 54 Q94 56 86 52Z" fill="#d8a878"/>
      ${feet('#a8744c')}
      <ellipse cx="60" cy="72" rx="34" ry="36" fill="#e8bc8c"/>
      <g fill="#fff6e8"><circle cx="42" cy="88" r="3.5"/><circle cx="78" cy="90" r="3.5"/><circle cx="50" cy="98" r="3"/><circle cx="72" cy="100" r="3"/></g>
      ${eyes(48, 72, 62)}${cheeks(38, 82, 74)}
      <ellipse cx="60" cy="74" rx="4.5" ry="3.4" fill="${INK}"/>${smile(60, 78, 4)}`,
    // 果凍水母：粉紅水母，會飄
    jelly: () => `${shadow(26)}
      ${[34, 48, 62, 76, 88].map((x, i) => `<path d="M${x} 74 Q${x + (i % 2 ? 6 : -6)} 88 ${x} 100 Q${x + (i % 2 ? -5 : 5)} 106 ${x} 110" stroke="#ffb3d9" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M22 74 Q22 24 60 22 Q98 24 98 74 Q86 82 74 74 Q62 82 50 74 Q36 82 22 74Z" fill="#ff9ed2"/>
      <path d="M34 44 Q44 32 56 32" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
      ${eyes(48, 72, 54)}${cheeks(38, 82, 64, '#ff6b9a')}${smile(60, 64, 5)}`,
    // 糖果龍：粉紅 BB 龍，糖果間條角
    dragon: () => `${shadow(34)}
      <path d="M88 92 Q112 92 108 70 L116 66 L104 62" stroke="#ff9ec4" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M36 46 Q30 22 40 12 L48 40Z M84 46 Q90 22 80 12 L72 40Z" fill="#fff"/>
      <path d="M33 34 L42 30 M34 24 L44 20 M87 34 L78 30 M86 24 L76 20" stroke="#ff6b9a" stroke-width="4"/>
      <path d="M22 62 Q4 50 6 74 Q16 70 24 76Z M98 62 Q116 50 114 74 Q104 70 96 76Z" fill="#c7a3ff"/>
      ${feet('#f08ab4')}
      <ellipse cx="60" cy="72" rx="36" ry="36" fill="#ffb8d4"/>
      <ellipse cx="60" cy="86" rx="20" ry="16" fill="#fff0f6"/>
      ${eyes(47, 73, 62)}${cheeks(37, 83, 74, '#ff6b9a')}${smile(60, 74, 5)}
      <path d="M53 76 L56 80 L59 76" fill="#fff"/>`
  };

  const { partners: PARTNERS, wild: WILD, names: NAMES } = self.MON_UNIT;

  // 進化：背後光環 + 一對翼 + 頭頂金星
  const EVO_BACK = `<circle cx="60" cy="64" r="56" fill="#fff6c8" opacity=".55"/>
    <path d="M24 70 Q-4 40 6 22 Q20 44 36 56Z M96 70 Q124 40 114 22 Q100 44 84 56Z" fill="#fff" stroke="#ffd23e" stroke-width="3" stroke-linejoin="round"/>`;
  const EVO_FRONT = `${star5(60, 8, 9, '#ffd23e')}${star5(60, 8, 4, '#fff6c8')}`;
  const SHINY = `<g class="mn-sparkle">${star5(16, 20, 7, '#ffe680')}${star5(104, 30, 6, '#fff')}${star5(100, 98, 6, '#ffe680')}</g>`;

  function monster(id, opts) {
    opts = opts || {};
    const b = BODY[id] || BODY.cat;
    return `<svg viewBox="0 0 120 120" aria-hidden="true" class="mn-svg${opts.shiny ? ' shiny' : ''}"${opts.evo ? ' overflow="visible"' : ''}>
      ${opts.evo ? EVO_BACK : ''}<g class="mn-body">${b()}</g>${opts.evo ? EVO_FRONT : ''}${opts.shiny ? SHINY : ''}
    </svg>`;
  }

  // ---------- 星星球：一粒青色波波，中間一粒大黃星（冇橫間 / 冇中間掣，刻意唔似任何官方球） ----------
  const ball = () => `<svg viewBox="0 0 60 60" aria-hidden="true">
    <circle cx="30" cy="30" r="27" fill="#3cc6c0"/>
    <circle cx="30" cy="30" r="27" fill="none" stroke="#2a9f9a" stroke-width="3"/>
    <circle cx="30" cy="31" r="19" fill="#5fd8d2"/>
    ${star5(30, 31, 17, '#ffd23e')}${star5(30, 31, 8, '#fff3b0')}
    <path d="M12 20 Q17 10 28 7" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75"/>
  </svg>`;

  // ---------- 怪獸蛋 ----------
  const egg = () => `<svg viewBox="0 0 100 120" aria-hidden="true">
    <ellipse cx="50" cy="114" rx="30" ry="5" fill="#000" opacity=".1"/>
    <path d="M50 6 C80 6 94 52 92 76 C90 102 72 114 50 114 C28 114 10 102 8 76 C6 52 20 6 50 6Z" fill="#fff6e0" stroke="#e8c878" stroke-width="4"/>
    <path class="eg-crack" d="M18 64 L30 56 L40 66 L52 54 L62 66 L72 56 L84 64" stroke="${INK}" stroke-width="3" fill="none" stroke-linejoin="round"/>
    ${star5(50, 34, 10, '#7fd0ff')}<circle cx="28" cy="88" r="7" fill="#ffb3c7"/><circle cx="72" cy="86" r="8" fill="#b3ecc0"/><circle cx="52" cy="98" r="5" fill="#c7a3ff"/>
  </svg>`;

  // ---------- 草地背景 + 草叢 ----------
  const background = () => `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#e6f7ff"/></linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#mn-sky)"/>
    <g fill="#fff" opacity=".9"><ellipse cx="260" cy="150" rx="110" ry="36"/><ellipse cx="320" cy="124" rx="70" ry="40"/><ellipse cx="1180" cy="110" rx="130" ry="38"/><ellipse cx="1250" cy="86" rx="70" ry="38"/></g>
    <path d="M0 560 Q300 440 640 520 Q980 600 1260 480 Q1460 410 1600 470 V1000 H0Z" fill="#a6e3a0"/>
    <path d="M0 700 Q400 600 800 680 Q1200 760 1600 650 V1000 H0Z" fill="#8fd18a"/>
    <g fill="#fff" opacity=".85">${[[180, 760], [520, 830], [900, 780], [1320, 860], [1480, 740]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/><circle cx="${x}" cy="${y}" r="4" fill="#ffd23e"/>`).join('')}</g>
  </svg>`;
  const bush = () => `<svg viewBox="0 0 200 120" aria-hidden="true">
    <ellipse cx="100" cy="112" rx="90" ry="7" fill="#000" opacity=".08"/>
    <g fill="#5fb85a"><circle cx="50" cy="76" r="38"/><circle cx="100" cy="56" r="46"/><circle cx="150" cy="76" r="38"/><rect x="20" y="76" width="160" height="36" rx="18"/></g>
    <g fill="#7fd07a"><circle cx="64" cy="64" r="16"/><circle cx="112" cy="44" r="18"/><circle cx="150" cy="70" r="12"/></g>
  </svg>`;

  // ---------- HUD 星（第一下就啱先着） ----------
  const hudStar = () => `<svg viewBox="0 0 40 40" aria-hidden="true">${star5(20, 21, 18, '#ffd23e')}</svg>`;

  // ---------- 主選單卡 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#b8ecd8"/>
      <path d="M12 138 Q100 116 188 138 L184 158 Q100 206 16 158Z" fill="#8fd18a"/>
      ${nest(monster('cat'), 22, 36, 112, 112)}
      ${nest(monster('bunny'), 112, 82, 70, 70)}
      ${nest(ball(), 124, 26, 46, 46)}
    </svg>`;
  }

  return { monster, ball, egg, background, bush, hudStar, icon, PARTNERS, WILD, NAMES };
})();
