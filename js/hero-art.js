/* 原創機械人英雄 SVG：每個部位一個 <g class="part" data-part="...">，方便逐個裝備 / 撳 */
const HeroArt = (() => {
  const C = {
    shell: '#eef2f8', shellEdge: '#b8c3d6',
    suit: '#5b8def', suitDark: '#4673d1',
    screen: '#2b3a67', glow: '#7ff0ff',
    cape: '#f2706b', capeDark: '#d95a56',
    boot: '#f6a05a', bootDark: '#e0843c',
    ear: '#5fd1c1', hair: '#ffd36e',
    heart: '#ff7a9c', gold: '#f2c45c'
  };

  // 透明擴大嘅撳位（細部位用）
  const hit = (shape) => shape.replace('/>', ' fill="transparent" class="hit"/>');

  function robot() {
    return `<svg viewBox="0 0 520 570" aria-hidden="true" class="robot-svg">
      <ellipse cx="200" cy="552" rx="130" ry="12" fill="#000" opacity=".08"/>

      <!-- 背：披風 -->
      <g class="part" data-part="back">
        <path d="M128 262 Q200 248 272 262 L330 500 Q200 528 70 500Z" fill="${C.cape}"/>
        <path d="M100 500 Q200 522 300 500 L292 470 Q200 492 108 470Z" fill="${C.capeDark}"/>
      </g>

      <!-- 腳：腳 + 火箭靴 -->
      <g class="part" data-part="feet">
        <rect x="150" y="420" width="38" height="70" rx="14" fill="#9aa8c2"/>
        <rect x="212" y="420" width="38" height="70" rx="14" fill="#9aa8c2"/>
        <rect x="134" y="476" width="64" height="52" rx="20" fill="${C.boot}"/>
        <rect x="202" y="476" width="64" height="52" rx="20" fill="${C.boot}"/>
        <path d="M146 528 l10 18 l10 -18z M178 528 l8 14 l8 -14z M214 528 l10 18 l10 -18z M246 528 l8 14 l8 -14z" fill="${C.hair}"/>
        <rect x="134" y="500" width="64" height="10" fill="${C.bootDark}"/>
        <rect x="202" y="500" width="64" height="10" fill="${C.bootDark}"/>
      </g>

      <!-- 身體：戰衣 + 手 -->
      <g class="part" data-part="body">
        <rect x="76" y="268" width="46" height="128" rx="23" fill="${C.suit}"/>
        <rect x="278" y="268" width="46" height="128" rx="23" fill="${C.suit}"/>
        <circle cx="99" cy="404" r="26" fill="${C.shell}" stroke="${C.shellEdge}" stroke-width="4"/>
        <circle cx="301" cy="404" r="26" fill="${C.shell}" stroke="${C.shellEdge}" stroke-width="4"/>
        <rect x="118" y="250" width="164" height="186" rx="40" fill="${C.suit}"/>
        <rect x="118" y="398" width="164" height="22" fill="${C.suitDark}"/>
        <rect x="186" y="396" width="28" height="26" rx="6" fill="${C.gold}"/>
      </g>

      <!-- 心：胸口能量核心 -->
      <g class="part" data-part="heart">
        ${hit('<circle cx="200" cy="322" r="46"/>')}
        <circle cx="200" cy="322" r="38" fill="#fff" stroke="${C.shellEdge}" stroke-width="4"/>
        <path d="M200 346 C172 326 176 302 192 302 C198 302 200 308 200 310 C200 308 202 302 208 302 C224 302 228 326 200 346Z" fill="${C.heart}"/>
      </g>

      <!-- 頸 -->
      <rect x="176" y="226" width="48" height="34" rx="10" fill="#9aa8c2"/>

      <!-- 頭：頭盔外殼 -->
      <g class="part" data-part="head">
        <rect x="80" y="36" width="240" height="206" rx="70" fill="${C.shell}" stroke="${C.shellEdge}" stroke-width="5"/>
        <path d="M120 58 Q200 30 280 58" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
      </g>

      <!-- 耳朵：兩邊通訊耳機 -->
      <g class="part" data-part="ears">
        <circle cx="74" cy="142" r="32" fill="${C.ear}" stroke="#3fae9f" stroke-width="5"/>
        <circle cx="74" cy="142" r="13" fill="#fff" opacity=".8"/>
        <circle cx="326" cy="142" r="32" fill="${C.ear}" stroke="#3fae9f" stroke-width="5"/>
        <circle cx="326" cy="142" r="13" fill="#fff" opacity=".8"/>
        <path d="M326 110 L340 70" stroke="#3fae9f" stroke-width="6" stroke-linecap="round"/>
        <circle cx="342" cy="64" r="9" fill="${C.heart}"/>
      </g>

      <!-- 頭髮：閃電頭髮 -->
      <g class="part" data-part="hair">
        ${hit('<rect x="130" y="0" width="140" height="56"/>')}
        <path d="M140 52 L152 8 L172 34 L188 0 L204 30 L222 2 L236 32 L258 10 L262 52 Q200 40 140 52Z"
              fill="${C.hair}" stroke="#e8b84a" stroke-width="4" stroke-linejoin="round"/>
      </g>

      <!-- 臉：面罩螢幕 -->
      <g class="part" data-part="face">
        <rect x="112" y="78" width="176" height="140" rx="48" fill="${C.screen}"/>
        <circle cx="140" cy="186" r="11" fill="${C.heart}" opacity=".55"/>
        <circle cx="260" cy="186" r="11" fill="${C.heart}" opacity=".55"/>
      </g>

      <!-- 眼睛 -->
      <g class="part" data-part="eyes">
        ${hit('<rect x="126" y="100" width="148" height="66" rx="20"/>')}
        <ellipse cx="164" cy="132" rx="24" ry="27" fill="${C.glow}"/>
        <ellipse cx="236" cy="132" rx="24" ry="27" fill="${C.glow}"/>
        <circle cx="170" cy="136" r="11" fill="${C.screen}"/>
        <circle cx="242" cy="136" r="11" fill="${C.screen}"/>
        <circle cx="174" cy="131" r="4" fill="#fff"/>
        <circle cx="246" cy="131" r="4" fill="#fff"/>
      </g>

      <!-- 鼻子 -->
      <g class="part" data-part="nose">
        ${hit('<circle cx="200" cy="168" r="22"/>')}
        <ellipse cx="200" cy="168" rx="11" ry="9" fill="${C.boot}"/>
      </g>

      <!-- 嘴巴 -->
      <g class="part" data-part="mouth">
        ${hit('<rect x="160" y="180" width="80" height="34" rx="14"/>')}
        <path d="M172 192 Q200 214 228 192" stroke="${C.glow}" stroke-width="8" fill="none" stroke-linecap="round"/>
      </g>

      <!-- 樣子：鏡（照到英雄個樣） -->
      <g class="part" data-part="looks">
        <rect x="452" y="388" width="20" height="90" rx="10" fill="${C.gold}"/>
        <ellipse cx="462" cy="320" rx="54" ry="72" fill="${C.gold}"/>
        <ellipse cx="462" cy="320" rx="44" ry="62" fill="#dff3ff"/>
        <rect x="428" y="294" width="68" height="58" rx="22" fill="${C.shell}" stroke="${C.shellEdge}" stroke-width="3"/>
        <rect x="436" y="302" width="52" height="40" rx="15" fill="${C.screen}"/>
        <circle cx="452" cy="318" r="6" fill="${C.glow}"/><circle cx="472" cy="318" r="6" fill="${C.glow}"/>
        <path d="M452 330 Q462 338 472 330" stroke="${C.glow}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M444 284 l6 -14 l6 10 l6 -14 l6 10 l6 -12 l4 16z" fill="${C.hair}"/>
        <path d="M430 280 Q440 262 460 258" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
      </g>
    </svg>`;
  }

  // 主選單用嘅細 icon
  function icon() {
    return `<svg viewBox="60 -10 300 270" aria-hidden="true">
      <circle cx="74" cy="142" r="32" fill="${C.ear}"/><circle cx="326" cy="142" r="32" fill="${C.ear}"/>
      <path d="M140 52 L152 8 L172 34 L188 0 L204 30 L222 2 L236 32 L258 10 L262 52Z" fill="${C.hair}"/>
      <rect x="80" y="36" width="240" height="206" rx="70" fill="${C.shell}" stroke="${C.shellEdge}" stroke-width="5"/>
      <rect x="112" y="78" width="176" height="140" rx="48" fill="${C.screen}"/>
      <ellipse cx="164" cy="132" rx="24" ry="27" fill="${C.glow}"/><ellipse cx="236" cy="132" rx="24" ry="27" fill="${C.glow}"/>
      <circle cx="170" cy="136" r="11" fill="${C.screen}"/><circle cx="242" cy="136" r="11" fill="${C.screen}"/>
      <ellipse cx="200" cy="168" rx="11" ry="9" fill="${C.boot}"/>
      <path d="M172 192 Q200 214 228 192" stroke="${C.glow}" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // 城市背景（柔和）
  function city() {
    return `<svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="#c9d8f2">
        <rect x="40" y="160" width="120" height="240" rx="10"/><rect x="190" y="90" width="90" height="310" rx="10"/>
        <rect x="300" y="200" width="140" height="200" rx="10"/><rect x="1150" y="120" width="110" height="280" rx="10"/>
        <rect x="1280" y="190" width="150" height="210" rx="10"/><rect x="1450" y="70" width="100" height="330" rx="10"/>
      </g>
      <g fill="#e6eefc">
        <rect x="64" y="190" width="22" height="22" rx="4"/><rect x="110" y="190" width="22" height="22" rx="4"/>
        <rect x="64" y="236" width="22" height="22" rx="4"/><rect x="212" y="120" width="20" height="20" rx="4"/>
        <rect x="246" y="120" width="20" height="20" rx="4"/><rect x="212" y="164" width="20" height="20" rx="4"/>
        <rect x="1174" y="150" width="22" height="22" rx="4"/><rect x="1214" y="150" width="22" height="22" rx="4"/>
        <rect x="1474" y="100" width="22" height="22" rx="4"/><rect x="1510" y="100" width="22" height="22" rx="4"/>
      </g>
    </svg>`;
  }

  // 搞笑怪獸（唔恐怖）：.m-angry 同 .m-happy 兩個表情，被打敗之後轉做開心
  function monster() {
    return `<svg viewBox="0 0 300 300" aria-hidden="true">
      <ellipse cx="150" cy="288" rx="105" ry="10" fill="#000" opacity=".1"/>
      <path d="M96 60 l-18 -42 l34 26z M204 60 l18 -42 l-34 26z" fill="#ffd36e" stroke="#e8b84a" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="96" cy="270" rx="34" ry="18" fill="#8a63c9"/>
      <ellipse cx="204" cy="270" rx="34" ry="18" fill="#8a63c9"/>
      <path d="M150 40 C236 40 262 118 262 182 C262 246 214 274 150 274 C86 274 38 246 38 182 C38 118 64 40 150 40Z" fill="#a47de0"/>
      <ellipse cx="150" cy="206" rx="72" ry="56" fill="#cbb3f2"/>
      <circle cx="84" cy="120" r="9" fill="#8a63c9"/><circle cx="224" cy="104" r="7" fill="#8a63c9"/><circle cx="236" cy="150" r="10" fill="#8a63c9"/>
      <path class="m-arm-l" d="M44 170 C14 150 10 120 22 104" stroke="#a47de0" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path class="m-arm-r" d="M256 170 C286 150 290 120 278 104" stroke="#a47de0" stroke-width="26" fill="none" stroke-linecap="round"/>
      <circle cx="116" cy="124" r="28" fill="#fff"/><circle cx="184" cy="124" r="28" fill="#fff"/>
      <g class="m-angry">
        <circle cx="122" cy="130" r="13" fill="#3b3247"/><circle cx="178" cy="130" r="13" fill="#3b3247"/>
        <circle cx="126" cy="125" r="4" fill="#fff"/><circle cx="182" cy="125" r="4" fill="#fff"/>
        <path d="M88 92 L140 108 M212 92 L160 108" stroke="#5b3f8f" stroke-width="10" stroke-linecap="round"/>
        <path d="M116 186 Q150 170 184 186" stroke="#3b3247" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M124 182 l6 12 l6 -14z M164 178 l6 14 l6 -12z" fill="#fff"/>
      </g>
      <g class="m-happy">
        <path d="M100 128 Q116 112 132 128 M168 128 Q184 112 200 128" stroke="#3b3247" stroke-width="8" fill="none" stroke-linecap="round"/>
        <circle cx="96" cy="158" r="11" fill="#ff8fa8" opacity=".6"/><circle cx="204" cy="158" r="11" fill="#ff8fa8" opacity=".6"/>
        <path d="M118 172 Q150 206 182 172" stroke="#3b3247" stroke-width="8" fill="#b0506a" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  // 愛心炮彈
  function heartShot() {
    return `<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M30 54 C6 36 0 22 8 10 C16 0 28 4 30 14 C32 4 44 0 52 10 C60 22 54 36 30 54Z" fill="#ff7a9c" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>`;
  }

  return { robot, icon, city, monster, heartShot };
})();
