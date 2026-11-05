/*
 * Jedi + Sith 大戰 Mecha-Rex：字表（Yorkland Starters R&W Part 1 + Part 3（VCe）+ Notes2 方位字）
 * - things：每樣嘢一幅圖；word = 讀 / 顯示嘅字；say = 句子（預設「This is a …」）
 * - spell：Part 3「Look at the letters. Write the words.」VCe 字（最後一粒 e = magic e）
 * - truth：Part 1「Look and read ✓/✗」：圖 + lie（同一個長元音、似但唔係嘅字）
 * - traps：工作紙陷阱圖（直升機配 plane、收音機配 phone…），一定係 ✗，之後講返佢係乜
 * - magic：magic e 變身（cap → cape）
 * - preps：方位字；focus = 工作紙冇考到 / 寫錯，每局都出，直到第一下就啱 3 次
 * - places：每樣物件可以擺邊啲方位（圖要分得清先擺）
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.MECHA_UNIT = {
    id: 'starters-vce',
    things: [
      { id: 'kite',  word: 'kite' },
      { id: 'plane', word: 'plane' },
      { id: 'phone', word: 'phone' },
      { id: 'snake', word: 'snake' },
      { id: 'white', word: 'white', say: 'This is white.' },
      { id: 'nose',  word: 'nose' },
      { id: 'cake',  word: 'cake' },
      { id: 'bike',  word: 'bike' },
      { id: 'lime',  word: 'lime' },
      { id: 'mice',  word: 'mice', say: 'These are mice.' },
      { id: 'face',  word: 'face' },
      // 陷阱圖（唔使學個字，講返一次就得）
      { id: 'helicopter', word: 'helicopter', no: 'No! It’s a helicopter.' },
      { id: 'radio',      word: 'radio',      no: 'No! It’s a radio.' },
      { id: 'gecko',      word: 'gecko',      no: 'No! It’s a gecko.' },
      { id: 'rabbits',    word: 'rabbits',    no: 'No! They are rabbits.' },
      { id: 'lemon',      word: 'lemon',      no: 'No! It’s a lemon.' },
      { id: 'motorbike',  word: 'motorbike',  no: 'No! It’s a motorbike.' },
      // magic e
      { id: 'cap',  word: 'cap' },  { id: 'cape', word: 'cape' },
      { id: 'tap',  word: 'tap' },  { id: 'tape', word: 'tape' },
      { id: 'can',  word: 'can' },  { id: 'cane', word: 'cane' },
      { id: 'cub',  word: 'cub' },  { id: 'cube', word: 'cube' }
    ],
    spell: ['kite', 'plane', 'phone', 'snake', 'white', 'nose', 'cake', 'bike', 'lime', 'mice', 'face'],
    truth: [
      { id: 'kite',  lie: 'bike' },
      { id: 'bike',  lie: 'kite' },
      { id: 'cake',  lie: 'snake' },
      { id: 'snake', lie: 'cake' },
      { id: 'nose',  lie: 'face' },
      { id: 'face',  lie: 'nose' },
      { id: 'lime',  lie: 'mice' },
      { id: 'plane', lie: 'kite' },
      { id: 'phone', lie: 'nose' },
      { id: 'white' }                        // 冇 lie：一定係 ✓
    ],
    traps: [
      { id: 'helicopter', lie: 'plane' },
      { id: 'radio',      lie: 'phone' },
      { id: 'gecko',      lie: 'snake' },
      { id: 'rabbits',    lie: 'mice' },
      { id: 'lemon',      lie: 'lime' },
      { id: 'motorbike',  lie: 'bike' }
    ],
    magic: [
      { from: 'cap', to: 'cape', vowel: 'a' },
      { from: 'tap', to: 'tape', vowel: 'a' },
      { from: 'can', to: 'cane', vowel: 'a' },
      { from: 'cub', to: 'cube', vowel: 'u' }
    ],
    preps: [
      { id: 'in',      word: 'in' },
      { id: 'on',      word: 'on' },
      { id: 'under',   word: 'under', focus: true },
      { id: 'next',    word: 'next to', parts: ['next', 'to'] },
      { id: 'behind',  word: 'behind' },
      { id: 'front',   word: 'in front of', focus: true },
      { id: 'between', word: 'between' }
    ],
    // 物件：one = 單數（the tree），some = 用喺 between（the trees）
    places: {
      box:   { one: 'the box',   preps: ['in', 'on', 'next', 'behind', 'front'] },
      table: { one: 'the table', preps: ['on', 'under', 'next'] },
      rock:  { one: 'the rock',  preps: ['on', 'behind', 'next', 'front'] },
      trees: { one: 'the tree',  some: 'the trees', preps: ['between', 'next', 'front'] }
    }
  };
})(typeof self !== 'undefined' ? self : this);
