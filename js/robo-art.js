/*
 * 機甲 Luca 出擊：全部原創 SVG（唔用任何官方機械人圖 / 名）
 * - 主角：Robo-Luca（白藍機甲，胸口駕駛艙見到 Luca，能量核心、光束劍、盾）viewBox 0 0 200 260，面向右
 * - Boss：太空怪獸 Gloop（紫色，三隻角）viewBox 0 0 260 240，面向左；.rb-angry / .rb-happy 切換
 * - 25 樣嘢（viewBox 0 0 200 170，同 JediArt / MechaArt 一樣）；fish / bath 借 JediArt，phone / cake 借 MechaArt
 * 光束顏色用 CSS 變數 --beam；能量核心顏色用 --core
 */
const RoboArt = (() => {
  const INK = '#3b3247';
  const SKIN = '#f6cfae';
  const nest = JediArt.nest;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .35}" cy="${y - r * .35}" r="${r * .38}" fill="#fff"/>`;
  const shadow = (cx, rx, y) => `<ellipse cx="${cx}" cy="${y || 163}" rx="${rx}" ry="6" fill="#000" opacity=".08"/>`;
  const W = '#f4f6fb', W2 = '#d5dbe8', BLUE = '#3b6fd8', RED = '#e5484d', YEL = '#ffd23e';

  // ---------- Robo-Luca ----------
  function robot() {
    return `<svg viewBox="0 0 200 260" aria-hidden="true" class="rb-svg">
      <ellipse cx="100" cy="250" rx="66" ry="8" fill="#000" opacity=".14"/>
      <g class="rb-back">
        <path d="M46 112 L36 160" stroke="${W2}" stroke-width="18" stroke-linecap="round"/>
        <path d="M14 128 H54 L58 176 L34 206 L10 176Z" fill="${RED}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
        <path d="M34 140 V192 M20 160 H48" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
        <circle cx="34" cy="160" r="7" fill="${YEL}"/>
      </g>
      <rect x="68" y="184" width="28" height="54" rx="8" fill="${W}" stroke="${W2}" stroke-width="3"/>
      <rect x="104" y="184" width="28" height="54" rx="8" fill="${W}" stroke="${W2}" stroke-width="3"/>
      <rect x="70" y="200" width="24" height="14" rx="4" fill="${BLUE}"/><rect x="106" y="200" width="24" height="14" rx="4" fill="${BLUE}"/>
      <path d="M62 236 H100 Q102 248 94 250 H62 Q56 246 62 236Z" fill="${RED}"/>
      <path d="M102 236 H140 Q146 246 140 250 H106 Q98 248 102 236Z" fill="${RED}"/>
      <rect x="64" y="170" width="72" height="22" rx="8" fill="${W}" stroke="${W2}" stroke-width="3"/>
      <path d="M92 170 H108 L104 192 H96Z" fill="${RED}"/>
      <path d="M56 98 H144 L134 176 H66Z" fill="${BLUE}" stroke="#2c56b0" stroke-width="3" stroke-linejoin="round"/>
      <path d="M62 104 L72 104 L70 140 L64 140Z M138 104 L128 104 L130 140 L136 140Z" fill="${YEL}"/>
      <circle cx="100" cy="126" r="21" fill="#bfe9ff" stroke="#fff" stroke-width="4"/>
      <circle cx="100" cy="130" r="12" fill="${SKIN}"/>
      <path d="M88 128 Q88 114 100 114 Q112 114 112 128 Q106 120 100 123 Q94 120 88 128Z" fill="#5a3a24"/>
      <circle cx="96" cy="131" r="1.8" fill="${INK}"/><circle cx="104" cy="131" r="1.8" fill="${INK}"/>
      <path d="M96 135 Q100 138 104 135" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M86 112 Q96 108 104 110" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle class="rb-core" cx="100" cy="161" r="10" fill="var(--core, #6fd0ff)" stroke="#fff" stroke-width="3.5"/>
      <circle cx="97" cy="158" r="3" fill="#fff" opacity=".8"/>
      <circle cx="52" cy="104" r="20" fill="${W}" stroke="${W2}" stroke-width="3"/>
      <path d="M36 98 H68" stroke="${RED}" stroke-width="6"/>
      <rect x="90" y="84" width="20" height="16" fill="${W2}"/>
      <g class="rb-head">
        <path d="M100 52 L80 24 L88 22 L100 42 L112 22 L120 24Z" fill="${YEL}" stroke="#d9a400" stroke-width="2" stroke-linejoin="round"/>
        <path d="M72 62 Q72 40 100 40 Q128 40 128 62 V78 Q128 90 116 90 H84 Q72 90 72 78Z" fill="${W}" stroke="${W2}" stroke-width="3"/>
        <circle cx="100" cy="46" r="5" fill="${RED}"/>
        <rect x="78" y="58" width="44" height="16" rx="8" fill="#2c3550"/>
        <g class="rb-eyes"><rect x="84" y="62" width="12" height="7" rx="3.5" fill="#7dffb0"/><rect x="104" y="62" width="12" height="7" rx="3.5" fill="#7dffb0"/></g>
        <rect x="92" y="80" width="16" height="8" rx="3" fill="${RED}"/>
        <rect x="66" y="58" width="8" height="18" rx="3" fill="${W2}"/><rect x="126" y="58" width="8" height="18" rx="3" fill="${W2}"/>
      </g>
      <g class="rb-arm">
        <path d="M148 106 L166 148" stroke="${W2}" stroke-width="18" stroke-linecap="round"/>
        <g class="rb-blade" transform="translate(170 152) rotate(28)">
          <rect x="-10" y="-120" width="20" height="112" rx="10" fill="var(--beam, #ff7ad9)" opacity=".35"/>
          <rect x="-5.5" y="-114" width="11" height="104" rx="5.5" fill="var(--beam, #ff7ad9)"/>
          <rect x="-2.2" y="-110" width="4.4" height="96" rx="2.2" fill="#fff" opacity=".9"/>
          <rect x="-6" y="-8" width="12" height="26" rx="3" fill="#a7adba"/><rect x="-7" y="0" width="14" height="4" fill="${INK}"/>
        </g>
        <circle cx="170" cy="152" r="11" fill="#a7adba" stroke="#fff" stroke-width="3"/>
        <circle cx="148" cy="104" r="20" fill="${W}" stroke="${W2}" stroke-width="3"/>
        <path d="M132 98 H164" stroke="${RED}" stroke-width="6"/>
      </g>
    </svg>`;
  }

  // ---------- 太空怪獸 Gloop ----------
  function monster() {
    let spikes = '';
    [[150, 62], [178, 74], [202, 96], [220, 124]].forEach(([x, y], i) => {
      spikes += `<path d="M${x - 12} ${y + 10} L${x + 4} ${y - 18 + i * 2} L${x + 14} ${y + 12}Z" fill="#ffb347" stroke="#e08a1e" stroke-width="2.5" stroke-linejoin="round"/>`;
    });
    return `<svg viewBox="0 0 260 240" aria-hidden="true" class="gm-svg">
      <ellipse cx="140" cy="232" rx="96" ry="8" fill="#000" opacity=".14"/>
      <path class="gm-tail" d="M196 170 Q252 172 254 120 Q262 160 236 196 Q214 214 190 204Z" fill="#7a4fc4"/>
      ${spikes}
      <ellipse cx="102" cy="226" rx="26" ry="11" fill="#5f3aa3"/><ellipse cx="176" cy="226" rx="26" ry="11" fill="#5f3aa3"/>
      <path d="M40 150 Q30 54 128 44 Q222 46 224 150 Q226 222 132 224 Q42 224 40 150Z" fill="#8d5fd6"/>
      <path d="M78 150 Q78 104 130 104 Q182 104 182 150 Q182 206 130 208 Q78 206 78 150Z" fill="#b8f0a8"/>
      ${[[110, 130], [148, 128], [128, 166], [100, 180], [158, 176]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="#93d97f"/>`).join('')}
      <path d="M70 52 L60 12 L86 40Z M118 42 L124 2 L140 40Z M168 50 L188 18 L188 58Z" fill="#ffe680" stroke="#e0b830" stroke-width="2.5" stroke-linejoin="round"/>
      <g class="gm-arm"><path d="M52 150 Q22 156 18 136" stroke="#7a4fc4" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M10 128 l-4 -8 M18 124 l0 -10 M26 128 l4 -8" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>
      <g class="rb-angry">
        <ellipse cx="84" cy="92" rx="18" ry="20" fill="#fff"/><ellipse cx="136" cy="88" rx="18" ry="20" fill="#fff"/>
        <circle class="gm-eye" cx="80" cy="96" r="9" fill="#ff4d5e"/><circle cx="132" cy="92" r="9" fill="#ff4d5e" class="gm-eye"/>
        <circle cx="83" cy="93" r="3" fill="#fff"/><circle cx="135" cy="89" r="3" fill="#fff"/>
        <path d="M62 68 L100 82 M156 64 L118 78" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <g class="gm-jaw"><path d="M64 122 Q108 156 152 118 Q150 140 108 146 Q72 144 64 122Z" fill="#5a1f4a"/>
        ${[76, 92, 108, 124, 140].map((x) => `<path d="M${x} ${124 + Math.abs(108 - x) * -.05} l7 12 l7 -12Z" fill="#fff"/>`).join('')}</g>
      </g>
      <g class="rb-happy" display="none">
        <path d="M68 96 Q84 80 100 96 M120 92 Q136 76 152 92" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="62" cy="116" r="10" fill="#ff8fb8" opacity=".6"/><circle cx="160" cy="110" r="10" fill="#ff8fb8" opacity=".6"/>
        <path d="M82 120 Q110 150 140 118" stroke="${INK}" stroke-width="6" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }
  const happyMonster = () => monster().replace('class="rb-angry"', 'class="rb-angry" display="none"').replace('class="rb-happy" display="none"', 'class="rb-happy"');

  // 細機械人技師（維修站）：MechaArt baby droid + 扳手
  function mechanic() {
    return MechaArt.baby('#7fd6a0').replace('</svg>', `
      <g class="mc-wrench" transform="rotate(-30 88 66)"><rect x="84" y="44" width="8" height="34" rx="3" fill="#a7adba"/>
      <path d="M80 40 Q88 30 96 40 L92 46 H84Z" fill="#a7adba"/></g></svg>`);
  }

  // ---------- 25 樣嘢（viewBox 0 0 200 170） ----------
  const T = {
    sheep: () => `${shadow(100, 70)}
      <rect x="62" y="112" width="11" height="38" rx="5" fill="${INK}"/><rect x="82" y="116" width="11" height="36" rx="5" fill="${INK}"/>
      <rect x="114" y="116" width="11" height="36" rx="5" fill="${INK}"/><rect x="134" y="112" width="11" height="38" rx="5" fill="${INK}"/>
      ${[[70, 84], [96, 74], [124, 76], [146, 92], [124, 112], [94, 114], [66, 104], [104, 94]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="#e3e0ea" stroke-width="3"/>`).join('')}
      <ellipse cx="52" cy="80" rx="19" ry="24" fill="${INK}"/>
      <ellipse cx="34" cy="70" rx="11" ry="6" transform="rotate(-20 34 70)" fill="${INK}"/>
      ${[[46, 60], [58, 56], [52, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/>`).join('')}
      <circle cx="46" cy="78" r="4" fill="#fff"/><circle cx="47" cy="77" r="2" fill="${INK}"/>
      <circle cx="60" cy="80" r="4" fill="#fff"/><circle cx="61" cy="79" r="2" fill="${INK}"/>`,
    goat: () => `${shadow(100, 66)}
      <rect x="70" y="104" width="10" height="46" rx="4" fill="#8e6a52"/><rect x="88" y="108" width="10" height="44" rx="4" fill="#8e6a52"/>
      <rect x="118" y="108" width="10" height="44" rx="4" fill="#8e6a52"/><rect x="136" y="104" width="10" height="46" rx="4" fill="#8e6a52"/>
      <ellipse cx="108" cy="98" rx="50" ry="26" fill="#c29a7c"/>
      <path d="M156 88 Q170 80 168 96" stroke="#c29a7c" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M58 82 L72 98" stroke="#c29a7c" stroke-width="20" stroke-linecap="round"/>
      <path d="M50 46 Q42 22 62 16 Q52 30 60 44Z M66 44 Q66 20 86 18 Q72 30 74 46Z" fill="#6e5848"/>
      <ellipse cx="56" cy="62" rx="18" ry="22" fill="#c29a7c"/>
      <ellipse cx="34" cy="54" rx="12" ry="6" transform="rotate(-10 34 54)" fill="#a8806a"/>
      <path d="M48 82 Q52 100 58 82Z" fill="#6e5848"/>
      ${eye(50, 58, 4)}${eye(64, 58, 4)}
      <ellipse cx="54" cy="74" rx="7" ry="4" fill="#a8806a"/>`,
    shell: () => `${shadow(100, 60)}
      <path d="M100 148 L40 70 Q60 22 100 20 Q140 22 160 70Z" fill="#ffa98a" stroke="#e0705a" stroke-width="4" stroke-linejoin="round"/>
      ${[-48, -30, -12, 6, 24, 42].map((a) => `<path d="M100 146 L${100 + a * 1.25} ${36 + Math.abs(a) * .5}" stroke="#e0705a" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
      <path d="M84 146 H116 L110 158 H90Z" fill="#ffd0b8" stroke="#e0705a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M58 60 Q70 40 86 34" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`,
    shorts: () => `${shadow(100, 62)}
      <path d="M50 34 H150 L162 140 H112 L100 82 L88 140 H38Z" fill="#4f8fb8" stroke="#336c92" stroke-width="4" stroke-linejoin="round"/>
      <rect x="50" y="34" width="100" height="16" fill="#3a7aa6"/>
      ${[66, 100, 134].map((x) => `<rect x="${x - 4}" y="32" width="8" height="20" rx="2" fill="#2b5f84"/>`).join('')}
      <path d="M100 50 V76" stroke="#336c92" stroke-width="3"/>
      <path d="M62 60 Q72 70 84 62" stroke="#336c92" stroke-width="3" fill="none"/><path d="M138 60 Q128 70 116 62" stroke="#336c92" stroke-width="3" fill="none"/>`,
    shirt: () => `${shadow(100, 64)}
      <path d="M72 22 L40 38 L24 82 L46 90 L56 70 V156 H144 V70 L154 90 L176 82 L160 38 L128 22 Q100 34 72 22Z" fill="#cfe4ff" stroke="#7e9fc8" stroke-width="4" stroke-linejoin="round"/>
      <path d="M72 22 L86 50 L100 34 L114 50 L128 22 L114 18 L100 30 L86 18Z" fill="#fff" stroke="#7e9fc8" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M100 34 V156" stroke="#7e9fc8" stroke-width="3"/>
      ${[60, 84, 108, 132].map((y) => `<circle cx="108" cy="${y}" r="4" fill="#7e9fc8"/>`).join('')}
      <rect x="64" y="70" width="22" height="20" rx="3" fill="none" stroke="#7e9fc8" stroke-width="3"/>
      <path d="M40 76 L46 90 M160 76 L154 90" stroke="#7e9fc8" stroke-width="5"/>`,
    tshirt: () => `${shadow(100, 66)}
      <path d="M74 26 L34 44 L20 82 L48 92 L56 74 V152 H144 V74 L152 92 L180 82 L166 44 L126 26 Q100 46 74 26Z" fill="#3fa9b8" stroke="#2b7f8c" stroke-width="4" stroke-linejoin="round"/>
      <path d="M74 26 Q100 50 126 26" stroke="#2b7f8c" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    chair: () => `${shadow(100, 52)}
      <rect x="62" y="16" width="76" height="80" rx="8" fill="#c98a52" stroke="#8e5f36" stroke-width="4"/>
      <rect x="76" y="30" width="48" height="10" rx="3" fill="#e2a96c"/><rect x="76" y="52" width="48" height="10" rx="3" fill="#e2a96c"/>
      <path d="M52 96 H148 L142 112 H58Z" fill="#e2a96c" stroke="#8e5f36" stroke-width="4" stroke-linejoin="round"/>
      <rect x="62" y="110" width="12" height="48" rx="3" fill="#a96f3e"/><rect x="126" y="110" width="12" height="48" rx="3" fill="#a96f3e"/>`,
    sofa: () => `${shadow(100, 86)}
      <rect x="40" y="40" width="120" height="58" rx="18" fill="#d84a5a"/>
      <rect x="22" y="70" width="30" height="66" rx="14" fill="#c23a4b"/><rect x="148" y="70" width="30" height="66" rx="14" fill="#c23a4b"/>
      <rect x="46" y="92" width="54" height="34" rx="10" fill="#e8616f"/><rect x="100" y="92" width="54" height="34" rx="10" fill="#e8616f"/>
      <rect x="58" y="56" width="26" height="26" rx="6" transform="rotate(-10 71 69)" fill="#ffd36e"/><rect x="118" y="56" width="26" height="26" rx="6" transform="rotate(10 131 69)" fill="#ffd36e"/>
      <rect x="34" y="132" width="10" height="20" rx="3" fill="#8e5f36"/><rect x="156" y="132" width="10" height="20" rx="3" fill="#8e5f36"/>`,
    lunch: () => `${shadow(100, 84)}
      <ellipse cx="100" cy="112" rx="86" ry="40" fill="#fff" stroke="#c8d1de" stroke-width="4"/>
      <ellipse cx="100" cy="110" rx="66" ry="28" fill="#f2f5fa"/>
      <ellipse cx="74" cy="104" rx="30" ry="18" fill="#fffaf0" stroke="#e8dcc0" stroke-width="3"/>
      ${[[64, 98], [78, 96], [70, 108], [86, 106]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#fff" stroke="#eee3c8" stroke-width="1.5"/>`).join('')}
      <path d="M100 94 Q122 80 146 92 Q148 108 128 116 Q104 116 100 94Z" fill="#c9773e"/>
      <path d="M108 96 Q124 88 140 96" stroke="#9c5426" stroke-width="3" fill="none"/>
      <path d="M96 122 Q104 108 116 118 Q124 108 132 120" stroke="#5cb85c" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="140" cy="124" r="6" fill="#ff8a3d"/><circle cx="126" cy="128" r="6" fill="#ff8a3d"/>
      <path d="M176 60 V130 M168 60 V82 Q176 90 184 82 V60" stroke="#a7adba" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    beach: () => `
      <rect x="0" y="0" width="200" height="88" fill="#bfe6ff"/>
      <circle cx="160" cy="30" r="16" fill="#ffd23e"/>
      <rect x="0" y="70" width="200" height="34" fill="#4fb0d8"/>
      <path d="M0 76 Q20 70 40 76 T80 76 T120 76 T160 76 T200 76" stroke="#fff" stroke-width="4" fill="none"/>
      <path d="M0 100 Q100 88 200 100 V170 H0Z" fill="#f2d49a"/>
      <path d="M58 150 L70 82" stroke="#8e5f36" stroke-width="4"/>
      <path d="M30 92 Q70 50 110 92 Q90 84 70 92 Q50 84 30 92Z" fill="${RED}"/><path d="M50 88 Q70 54 90 88 Q80 84 70 92 Q60 84 50 88Z" fill="#fff"/>
      <circle cx="130" cy="138" r="14" fill="#fff" stroke="#3b6fd8" stroke-width="3"/><path d="M118 132 Q130 140 142 132" stroke="${RED}" stroke-width="4" fill="none"/>
      <path d="M156 152 h22 v-14 h-6 v-8 h-10 v8 h-6Z" fill="#e8c27c" stroke="#c49a52" stroke-width="2"/>`,
    chick: () => `${shadow(100, 46)}
      <path d="M92 150 v10 M86 160 h12 M110 150 v10 M104 160 h12" stroke="#f08a24" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="102" cy="112" rx="44" ry="40" fill="${YEL}"/>
      <circle cx="96" cy="66" r="30" fill="${YEL}"/>
      <path d="M94 38 Q90 26 100 24 Q96 32 104 36" stroke="#f0b400" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M128 106 Q150 100 146 122 Q136 116 128 120Z" fill="#f0b400"/>
      <path d="M64 66 L52 72 L64 78Z" fill="#f08a24"/>
      ${eye(84, 60, 5)}
      <circle cx="80" cy="76" r="5" fill="#ff8fa8" opacity=".5"/>`,
    mouth: () => `
      <path d="M22 80 Q60 42 100 58 Q140 42 178 80 Q140 136 100 136 Q60 136 22 80Z" fill="#e8616f" stroke="#b03a4a" stroke-width="5" stroke-linejoin="round"/>
      <path d="M36 82 Q100 70 164 82 Q140 120 100 122 Q60 120 36 82Z" fill="#7a1f32"/>
      <path d="M40 82 Q100 72 160 82 L156 94 Q100 86 44 94Z" fill="#fff"/>
      <path d="M70 120 Q100 102 130 120 Q100 128 70 120Z" fill="#ff8fa8"/>
      <path d="M60 60 Q74 52 88 58" stroke="#ffb3be" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    mouse: () => `${shadow(100, 62)}
      <path d="M150 122 Q186 126 182 96 Q180 80 168 84" stroke="#e7a0a8" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="108" cy="114" rx="52" ry="34" fill="#a7adba"/>
      <circle cx="78" cy="62" r="18" fill="#a7adba"/><circle cx="78" cy="62" r="10" fill="#f2b8c0"/>
      <path d="M44 112 Q46 76 80 80 Q100 96 82 120 Q60 128 44 112Z" fill="#a7adba"/>
      <circle cx="40" cy="108" r="6" fill="#e7a0a8"/>
      ${eye(62, 98, 5)}
      <path d="M40 104 L18 98 M40 110 L18 112" stroke="#6d6476" stroke-width="2"/>
      <ellipse cx="84" cy="146" rx="10" ry="5" fill="#8b93a7"/><ellipse cx="128" cy="146" rx="10" ry="5" fill="#8b93a7"/>`,
    clothes: () => `${shadow(100, 86)}
      <path d="M22 50 L40 36 H64 L80 50 L72 62 L66 58 V120 H36 V58 L30 62Z" fill="#ffb347" stroke="#d98a1e" stroke-width="3" stroke-linejoin="round"/>
      <path d="M44 36 Q52 46 60 36" stroke="#d98a1e" stroke-width="3" fill="none"/>
      <path d="M86 30 H124 L128 152 H110 L105 72 L100 152 H82Z" fill="#3a4f8f" stroke="#26366a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M132 74 L148 64 H166 L182 74 L176 84 L172 82 V140 H140 V82 L136 84Z" fill="#ff8fb8" stroke="#d8607f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M150 64 Q157 72 164 64" stroke="#d8607f" stroke-width="3" fill="none"/>`,
    teeth: () => `
      <path d="M30 52 Q100 18 170 52 Q172 74 150 80 H50 Q28 74 30 52Z" fill="#f2919c"/>
      <path d="M30 118 Q100 152 170 118 Q172 96 150 90 H50 Q28 96 30 118Z" fill="#f2919c"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${44 + i * 23}" y="${i === 0 || i === 4 ? 48 : 44}" width="20" height="${i === 0 || i === 4 ? 32 : 36}" rx="7" fill="#fff" stroke="#d8dee8" stroke-width="2.5"/>`).join('')}
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${44 + i * 23}" y="90" width="20" height="${i === 0 || i === 4 ? 30 : 34}" rx="7" fill="#fff" stroke="#d8dee8" stroke-width="2.5"/>`).join('')}
      <path d="M100 48 l6 -10 M106 40 l6 4" stroke="#ffd23e" stroke-width="3" stroke-linecap="round"/>`,
    three: () => `
      <text x="100" y="128" text-anchor="middle" font-family="Andika, system-ui, sans-serif" font-weight="700" font-size="128" fill="${BLUE}" stroke="#fff" stroke-width="5" paint-order="stroke">3</text>
      ${[[40, 142], [100, 156], [160, 142]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${RED}"/>`).join('')}`,
    photo: () => `${shadow(100, 60)}
      <g transform="rotate(-6 100 86)">
        <rect x="40" y="18" width="120" height="136" rx="6" fill="#fff" stroke="#c8d1de" stroke-width="4"/>
        <rect x="52" y="30" width="96" height="88" fill="#bfe6ff"/>
        <circle cx="128" cy="52" r="10" fill="#ffd23e"/>
        <path d="M52 118 L84 72 L104 98 L118 84 L148 118Z" fill="#5cb85c"/>
        <circle cx="74" cy="104" r="8" fill="${SKIN}"/><rect x="69" y="110" width="10" height="8" fill="${RED}"/>
      </g>`,
    meat: () => `${shadow(100, 80)}
      <path d="M30 100 Q24 50 80 42 Q140 32 168 64 Q186 92 160 122 Q124 150 70 140 Q34 132 30 100Z" fill="#c94a4a" stroke="#f6d9cc" stroke-width="10" stroke-linejoin="round"/>
      <path d="M60 80 Q96 64 132 76 M54 104 Q96 88 146 100 M80 126 Q110 116 138 120" stroke="#e8858a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="128" cy="92" rx="12" ry="9" fill="#fff" opacity=".9"/>`,
    peas: () => `${shadow(100, 80)}
      <path d="M22 96 Q60 140 130 120 Q170 104 180 64 Q160 96 118 102 Q60 108 22 96Z" fill="#4e9a3f"/>
      <path d="M26 94 Q70 70 120 72 Q164 72 178 62 Q160 94 118 100 Q60 108 26 94Z" fill="#6cc05a"/>
      ${[[56, 88], [90, 84], [124, 80]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="#8fd96f" stroke="#4e9a3f" stroke-width="3"/>${eye(x - 5, y - 2, 2.6)}${eye(x + 5, y - 2, 2.6)}<path d="M${x - 5} ${y + 6} Q${x} ${y + 10} ${x + 5} ${y + 6}" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M178 62 Q190 50 186 38" stroke="#4e9a3f" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    feet: () => `${shadow(100, 80)}
      ${[[72, -1], [128, 1]].map(([x, f]) => `
        <rect x="${x - 13}" y="10" width="26" height="112" rx="10" fill="${SKIN}" stroke="#d9a483" stroke-width="3"/>
        <ellipse cx="${x + f * 14}" cy="136" rx="34" ry="20" fill="${SKIN}" stroke="#d9a483" stroke-width="3"/>
        ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${x + f * (40 - i * 2)}" cy="${120 + i * 8}" r="${7 - i}" fill="${SKIN}" stroke="#d9a483" stroke-width="2"/>`).join('')}`).join('')}`,
    green: () => `
      <path d="M100 26 Q120 50 140 34 Q138 62 170 60 Q150 82 176 104 Q146 106 150 136 Q124 118 108 148 Q96 120 68 140 Q72 112 34 112 Q58 92 28 70 Q62 66 54 38 Q82 54 100 26Z" fill="#4cc25a" stroke="#2f8f3c" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="40" cy="36" r="8" fill="#4cc25a"/><circle cx="168" cy="140" r="10" fill="#4cc25a"/><circle cx="178" cy="34" r="6" fill="#4cc25a"/>
      <ellipse cx="86" cy="70" rx="12" ry="7" fill="#9ce6a2" opacity=".8"/>`,
    bee: () => `${shadow(100, 50)}
      <ellipse cx="80" cy="56" rx="26" ry="18" transform="rotate(-20 80 56)" fill="#cdeeff" stroke="#9fd3f5" stroke-width="3"/>
      <ellipse cx="112" cy="52" rx="26" ry="18" transform="rotate(20 112 52)" fill="#cdeeff" stroke="#9fd3f5" stroke-width="3"/>
      <ellipse cx="100" cy="100" rx="52" ry="38" fill="${YEL}"/>
      <path d="M92 64 Q86 100 92 136 M120 66 Q114 100 120 134" stroke="${INK}" stroke-width="12" fill="none"/>
      <path d="M152 100 L168 100" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="62" cy="96" r="24" fill="${YEL}"/>
      ${eye(54, 92, 5)}
      <path d="M50 106 Q58 112 64 106" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M56 72 Q50 54 40 52 M66 72 Q68 54 78 48" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    tree: () => `${shadow(100, 56)}
      <path d="M88 160 L92 104 H108 L112 160Z" fill="#8e5f36"/>
      <circle cx="100" cy="62" r="42" fill="#4cae4c"/><circle cx="66" cy="88" r="30" fill="#5cb85c"/><circle cx="134" cy="88" r="30" fill="#5cb85c"/>
      <circle cx="80" cy="56" r="7" fill="${RED}"/><circle cx="122" cy="72" r="7" fill="${RED}"/><circle cx="98" cy="96" r="7" fill="${RED}"/>`,
    sea: () => `
      <rect x="0" y="0" width="200" height="70" fill="#d6efff"/>
      <circle cx="150" cy="38" r="18" fill="#ffd23e"/>
      <path d="M0 66 Q25 52 50 66 T100 66 T150 66 T200 66 V170 H0Z" fill="#4fb0d8"/>
      <path d="M0 100 Q25 86 50 100 T100 100 T150 100 T200 100 V170 H0Z" fill="#3a8fc4"/>
      <path d="M0 134 Q25 120 50 134 T100 134 T150 134 T200 134 V170 H0Z" fill="#2b72a8"/>
      <path d="M30 60 Q50 50 70 58" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M150 110 q8 -10 16 0" stroke="#fff" stroke-width="3" fill="none"/>`,
    tea: () => `${shadow(100, 62)}
      <ellipse cx="96" cy="140" rx="70" ry="14" fill="#fff" stroke="#c8d1de" stroke-width="4"/>
      <path d="M44 78 H148 Q146 136 96 138 Q46 136 44 78Z" fill="#fff" stroke="#c8d1de" stroke-width="4"/>
      <path d="M146 90 Q176 88 170 110 Q164 128 140 120" stroke="#c8d1de" stroke-width="7" fill="none"/>
      <ellipse cx="96" cy="80" rx="52" ry="9" fill="#b9733a"/>
      <path d="M70 92 Q78 110 72 124" stroke="#ff8fb8" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M74 64 Q66 52 74 40 Q82 28 74 16 M100 64 Q92 50 100 38 Q108 26 100 14 M124 64 Q116 52 124 40" stroke="#c8d1de" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`
  };

  function thing(id) {
    if (T[id]) return `<svg viewBox="0 0 200 170" aria-hidden="true" class="thing-svg" data-thing="${id}">${T[id]()}</svg>`;
    if (id === 'phone' || id === 'cake') return MechaArt.thing(id);
    return JediArt.thing(id);
  }

  // ---------- 能量核心（viewBox 0 0 100 100） ----------
  const CORE_COLS = { sh: '#6fd0ff', ch: '#ffb347', th: '#7fd6a0', ph: '#ff7ad9' };
  function core(dg) {
    const c = CORE_COLS[dg] || '#fff';
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="${c}" opacity=".35"/>
      <circle cx="50" cy="50" r="36" fill="#fff" stroke="${c}" stroke-width="8"/>
      <circle cx="50" cy="50" r="27" fill="${c}"/>
      <circle cx="38" cy="38" r="7" fill="#fff" opacity=".75"/>
    </svg>`;
  }

  // 護盾（HP 一格）
  const shield = () => `<svg viewBox="0 0 100 110" aria-hidden="true"><path d="M50 6 L90 20 Q92 72 50 104 Q8 72 10 20Z" fill="#6fd0ff" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M50 22 V88 M28 40 H72" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/></svg>`;
  const medal = (gold) => `<svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M30 0 L44 46 H56 L70 0 H56 L50 20 L44 0Z" fill="${gold ? RED : '#8fa0bf'}"/>
      <circle cx="50" cy="76" r="38" fill="${gold ? '#ffd23e' : '#d5dbe8'}" stroke="${gold ? '#e0a800' : '#a7adba'}" stroke-width="7"/>
      <path d="M50 52 L57 68 L74 69 L61 80 L65 97 L50 88 L35 97 L39 80 L26 69 L43 68Z" fill="${gold ? '#fff6c8' : '#fff'}"/>
    </svg>`;

  // 結局用：拳頭（火箭飛拳）
  function fist() {
    return `<svg viewBox="0 0 120 80" aria-hidden="true">
      <path d="M8 40 L28 30 V50Z" fill="#ffb347"/><path d="M0 40 L20 34 V46Z" fill="#fff6c8"/>
      <rect x="26" y="22" width="34" height="36" rx="6" fill="${W2}"/><rect x="30" y="30" width="26" height="8" fill="${BLUE}"/>
      <rect x="56" y="12" width="56" height="56" rx="18" fill="${W}" stroke="${W2}" stroke-width="4"/>
      <path d="M96 22 V58 M84 18 V62 M72 18 V62" stroke="${W2}" stroke-width="3"/>
    </svg>`;
  }

  // ---------- 主選單卡 + 貼紙 ----------
  function icon() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#1c2a5c"/>
      ${[[40, 40], [160, 32], [150, 160], [26, 120], [100, 20], [176, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6c8"/>`).join('')}
      ${nest(monster(), 98, 66, 100, 92)}
      ${nest(robot(), 10, 24, 124, 161)}
    </svg>`;
  }
  function sticker(id) {
    if (id === 'cannon') return nest(happyMonster(), 30, 36, 56, 52) + `<path d="M8 40 L46 52" stroke="#ff7ad9" stroke-width="9" stroke-linecap="round" opacity=".6"/><path d="M8 40 L46 52" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` + nest(EndArt.star('#ffe680'), 62, 12, 24, 24);
    if (id === 'punch') return nest(fist(), 10, 28, 66, 44) + nest(EndArt.star('#ffe680'), 64, 14, 22, 22) + nest(EndArt.star('#9fd3ff'), 70, 60, 18, 18);
    return nest(robot(), 22, 8, 56, 73) + nest(core('sh'), 12, 64, 22, 22) + nest(core('ch'), 66, 64, 22, 22) + nest(core('th'), 39, 74, 22, 22);
  }

  return { robot, monster, happyMonster, mechanic, thing, core, CORE_COLS, shield, medal, fist, icon, sticker };
})();
