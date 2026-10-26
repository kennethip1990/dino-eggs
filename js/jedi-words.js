/*
 * Jedi Luca 英文：字表（Yorkland Tutorial Starters R&W Part 1 + Part 3）
 * - things：每樣嘢一幅圖；word = 讀 / 顯示嘅字；these = 用「These are …」
 * - truth：Part 1「Look and read ✓/✗」：圖 + 句子。lie = 似但唔係嘅字（工作紙就係咁考）
 * - spell：Part 3「Look at the letters. Write the words.」4 個字母砌字
 * - focus：未熟（例如 desk：工作紙打錯咗），Truth Saber 每局都出，直到第一下就啱 3 次
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.JEDI_UNIT = {
    id: 'starters-cvc',
    things: [
      { id: 'hand',   word: 'hand' },
      { id: 'bed',    word: 'bed' },
      { id: 'bath',   word: 'bath' },
      { id: 'dog',    word: 'dog' },
      { id: 'frog',   word: 'frog' },
      { id: 'pen',    word: 'pen' },
      { id: 'crayon', word: 'crayon' },
      { id: 'socks',  word: 'socks', these: true },
      { id: 'shoes',  word: 'shoes', these: true },
      { id: 'lamp',   word: 'lamp' },
      { id: 'desk',   word: 'desk' },
      { id: 'dress',  word: 'dress' },
      { id: 'skirt',  word: 'skirt' },
      { id: 'clock',  word: 'clock' },
      { id: 'watch',  word: 'watch' },
      { id: 'truck',  word: 'truck' },
      { id: 'duck',   word: 'duck' },
      { id: 'doll',   word: 'doll' },
      { id: 'fish',   word: 'fish' },
      { id: 'sock',   word: 'sock' },
      { id: 'ship',   word: 'ship' },
      { id: 'sand',   word: 'sand' },
      { id: 'swim',   word: 'swim' }
    ],
    // 圖 id + 似但唔係嘅字（lie）。出題時一半講真（This is a hand.），一半講大話（This is a pen. 配蠟筆）
    truth: [
      { id: 'hand',   lie: 'pen' },
      { id: 'bath',   lie: 'bed' },
      { id: 'frog',   lie: 'dog' },
      { id: 'crayon', lie: 'pen' },
      { id: 'shoes',  lie: 'socks' },
      { id: 'lamp',   lie: 'clock' },
      { id: 'desk',   lie: 'bed', focus: true },
      { id: 'skirt',  lie: 'dress' },
      { id: 'watch',  lie: 'clock' },
      { id: 'truck',  lie: 'duck' },
      { id: 'dog',    lie: 'frog' },
      { id: 'bed',    lie: 'bath' },
      { id: 'clock',  lie: 'watch' },
      { id: 'dress',  lie: 'skirt' }
    ],
    spell: ['hand', 'duck', 'doll', 'lamp', 'fish', 'sock', 'desk', 'ship', 'sand', 'swim']
  };
})(typeof self !== 'undefined' ? self : this);
