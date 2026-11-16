/*
 * 光之巨人 Luca 救援隊：字表（Yorkland Starters R&W Part 3 W-controlled + R-controlled vowels）
 * - things：每樣嘢一幅圖；word = 讀 / 顯示；say = 句子（✓✗ 用）；team = 字入面嗰對字母
 * - ow：ow 有兩個音 → 'cow'（/aʊ/，好似 cow、brown）定 'bowl'（/əʊ/，好似 bowl、snow）
 * - no：陷阱圖（杯 ≠ bowl、裙 ≠ skirt、腳 ≠ arm、蟹 ≠ prawn、舊梳化 ≠ new、綠色 ≠ brown），一定係 ✗
 * - truth：✓✗ 句子（圖 + lie = 大話字）；traps：陷阱圖
 * - gap：聲音光球（揀 ow / ew / aw 或者 or / ar / ir 補空位）
 * - spell：砌字；focus = 工作紙嗰 8 個字，第一下就啱 2 次之前排先
 * - sort：決鬥換成「幫 BB 怪獸返屋企」：ow 似 cow 定似 bowl？
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.LIGHT_UNIT = {
    id: 'starters-w-r-vowels',
    families: { w: ['ow', 'ew', 'aw'], r: ['or', 'ar', 'ir'] },
    things: [
      // W-controlled（工作紙：cow / new / bowl / prawn；例子 brown）
      { id: 'cow',    word: 'cow',    team: 'ow', ow: 'cow' },
      { id: 'brown',  word: 'brown',  team: 'ow', ow: 'cow',  say: 'This is brown.' },
      { id: 'owl',    word: 'owl',    team: 'ow', ow: 'cow',  say: 'This is an owl.' },
      { id: 'bowl',   word: 'bowl',   team: 'ow', ow: 'bowl' },
      { id: 'snow',   word: 'snow',   team: 'ow', ow: 'bowl', say: 'This is snow.' },
      { id: 'yellow', word: 'yellow', team: 'ow', ow: 'bowl', say: 'This is yellow.' },
      { id: 'new',    word: 'new',    team: 'ew', say: 'This is new.' },
      { id: 'prawn',  word: 'prawn',  team: 'aw' },
      // R-controlled（工作紙：horse / arm / bird / skirt；例子 car）
      { id: 'horse',  word: 'horse',  team: 'or' },
      { id: 'arm',    word: 'arm',    team: 'ar', say: 'This is an arm.' },
      { id: 'car',    word: 'car',    team: 'ar' },
      { id: 'bird',   word: 'bird',   team: 'ir' },
      { id: 'skirt',  word: 'skirt',  team: 'ir' },
      { id: 'shirt',  word: 'shirt',  team: 'ir' },
      // 陷阱圖（唔使學個字，講返一次就得）
      { id: 'old',   word: 'old',   say: 'This is old.', no: 'No! It’s old. It’s not new.' },
      { id: 'cup',   word: 'cup',   no: 'No! It’s a cup.' },
      { id: 'dress', word: 'dress', no: 'No! It’s a dress.' },
      { id: 'leg',   word: 'leg',   no: 'No! It’s a leg.' },
      { id: 'crab',  word: 'crab',  no: 'No! It’s a crab.' },
      { id: 'green', word: 'green', no: 'No! It’s green.' }
    ],
    truth: [
      { id: 'cow',    lie: 'horse' },
      { id: 'horse',  lie: 'cow' },
      { id: 'bowl',   lie: 'owl' },
      { id: 'prawn',  lie: 'bird' },
      { id: 'bird',   lie: 'prawn' },
      { id: 'skirt',  lie: 'shirt' },
      { id: 'arm',    lie: 'car' },
      { id: 'car',    lie: 'arm' },
      { id: 'owl',    lie: 'cow' },
      { id: 'snow',   lie: 'bowl' },
      { id: 'new',    lie: 'old' },
      { id: 'brown',  lie: 'yellow' },
      { id: 'yellow', lie: 'brown' }
    ],
    traps: [
      { id: 'cup',   lie: 'bowl' },
      { id: 'dress', lie: 'skirt' },
      { id: 'leg',   lie: 'arm' },
      { id: 'crab',  lie: 'prawn' },
      { id: 'old',   lie: 'new' },
      { id: 'green', lie: 'brown' }
    ],
    gap: ['cow', 'brown', 'owl', 'bowl', 'snow', 'yellow', 'new', 'prawn', 'horse', 'arm', 'car', 'bird', 'skirt', 'shirt'],
    spell: [
      { id: 'cow', focus: true }, { id: 'new', focus: true }, { id: 'bowl', focus: true }, { id: 'prawn', focus: true },
      { id: 'horse', focus: true }, { id: 'arm', focus: true }, { id: 'bird', focus: true }, { id: 'skirt', focus: true },
      { id: 'brown' }, { id: 'car' }, { id: 'owl' }, { id: 'snow' }
    ],
    // 多一粒干擾字母（好似工作紙個泡泡，但多一粒）
    decoy: { ow: 'a', ew: 'o', aw: 'o', or: 'a', ar: 'o', ir: 'u' },
    sort: ['brown', 'owl', 'snow', 'yellow']
  };
})(typeof self !== 'undefined' ? self : this);
