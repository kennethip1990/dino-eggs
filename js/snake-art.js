/*
 * ABC 貪食蛇：主選單卡 + 貼紙用嘅 SVG（遊戲入面嘅蛇仔用 canvas 畫，見 snake.js）
 */
const SnakeArt = (() => {
  const GREEN = '#7ed957', DARK = '#4fa83a', GOLD = '#ffd34d', GOLD_D = '#e0a92e';
  const TXT = 'font-family="Andika, sans-serif" font-weight="700" text-anchor="middle" fill="#3b3247"';

  // 蛇頭：(x, y) 中心，r 半徑，ang = 望住嘅方向（度）
  function head(x, y, r, ang, col, dark, horns) {
    return `<g transform="translate(${x} ${y}) rotate(${ang})">
      ${horns ? `<path d="M${-r * .5} ${-r * .7} l${-r * .7} ${-r * .55} l${r * .25} ${r * .7}z M${-r * .5} ${r * .7} l${-r * .7} ${r * .55} l${r * .25} ${-r * .7}z" fill="#ff8a5c" stroke="#e0663a" stroke-width="2" stroke-linejoin="round"/>` : ''}
      <circle r="${r}" fill="${col}" stroke="${dark}" stroke-width="${r * .14}"/>
      <path d="M${r * .9} 0 l${r * .45} 0 l${r * .18} ${-r * .14} M${r * 1.35} 0 l${r * .18} ${r * .14}" stroke="#ff5c7a" stroke-width="${r * .1}" fill="none" stroke-linecap="round"/>
      <circle cx="${r * .25}" cy="${-r * .45}" r="${r * .3}" fill="#fff"/><circle cx="${r * .25}" cy="${r * .45}" r="${r * .3}" fill="#fff"/>
      <circle cx="${r * .36}" cy="${-r * .45}" r="${r * .16}" fill="#3b3247"/><circle cx="${r * .36}" cy="${r * .45}" r="${r * .16}" fill="#3b3247"/>
      <circle cx="${-r * .1}" cy="${-r * .72}" r="${r * .14}" fill="#ff8fa8" opacity=".7"/><circle cx="${-r * .1}" cy="${r * .72}" r="${r * .14}" fill="#ff8fa8" opacity=".7"/>
    </g>`;
  }
  // 沿住一條 path 排一粒粒身（pts = [[x,y],...]，由尾到頭）
  function body(pts, r, col, dark, letters) {
    const outline = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r + r * .14}" fill="${dark}"/>`).join('');
    const fill = pts.map(([x, y], i) => {
      const L = letters && letters[i];
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${L ? L[1] : col}"/>` +
        (L ? `<text x="${x}" y="${y + r * .42}" font-size="${r * 1.2}" ${TXT}>${L[0]}</text>` : '');
    }).join('');
    return outline + fill;
  }

  // 主選單卡：蛇仔 + 身上 A B C
  function icon() {
    const pts = [[46, 170], [62, 160], [82, 156], [104, 158], [126, 160], [146, 152], [158, 134], [156, 112], [142, 96]];
    const L = [null, null, null, ['C', '#ffd84d'], null, ['B', '#ffb85c'], null, ['A', '#ff8a8a'], null];
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="104" cy="186" rx="70" ry="8" fill="#000" opacity=".08"/>
      ${body(pts, 15, GREEN, DARK, L)}
      ${head(124, 74, 26, -125, GREEN, DARK)}
      <g transform="translate(58 58)">
        <circle r="26" fill="#8fd16a" stroke="#fff" stroke-width="5"/>
        <path d="M0 -26 q8 -12 18 -10 q-6 10 -18 10z" fill="#4fa83a"/>
        <text y="11" font-size="32" ${TXT}>D</text>
      </g>
    </svg>`;
  }

  // 貼紙：愛心蛇（蛇仔用身圍住一個心）
  function heart() {
    const pts = [];
    for (let i = 0; i < 30; i++) {
      const t = Math.PI * 2 * (i / 30) + .25;
      pts.push([50 + 2.4 * 16 * Math.pow(Math.sin(t), 3), 48 - 2.4 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
    }
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 84 C18 62 10 44 18 30 C26 18 42 20 50 34 C58 20 74 18 82 30 C90 44 82 62 50 84Z" fill="#ffb3c7"/>
      ${body(pts.slice(0, 27), 6, GREEN, DARK)}
      ${head(pts[28][0], pts[28][1], 10, -60, GREEN, DARK)}
    </svg>`;
  }

  // 貼紙：金色飛龍
  function dragon() {
    const pts = [];
    for (let i = 0; i < 12; i++) pts.push([12 + i * 6, 58 + Math.sin(i * .8) * 12]);
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      ${body(pts, 7, GOLD, GOLD_D)}
      ${head(84, 46, 11, -30, GOLD, GOLD_D, true)}
    </svg>`;
  }

  // 貼紙：蛇仔 + 字母炮彈
  function shooter() {
    const pts = [[20, 76], [30, 80], [40, 78], [48, 70]];
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      ${body(pts, 7, GREEN, DARK, [null, ['A', '#ff8a8a'], null, null])}
      ${head(54, 58, 11, -40, GREEN, DARK)}
    </svg>`;
  }

  return { icon, heart, dragon, shooter, GREEN, DARK, GOLD, GOLD_D };
})();
