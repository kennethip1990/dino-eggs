/*
 * 機甲 Luca 出擊：字表（Yorkland Starters R&W Part 1 Digraphs + Part 3 Long ee / ea）
 * - things：每樣嘢一幅圖；word = 讀 / 顯示；these = 用「These are …」；say = 自訂句子
 * - dg：digraph（sh / ch / th / ph）；at = 喺個字邊個位（畫面用 _ _ 代替）
 * - truth：Part 1 ✓/✗：圖 + lie（同類 digraph 但唔係嘅字）
 * - traps：工作紙陷阱圖（山羊配 sheep、老鼠配 mouth、梳化配 chair、T-shirt 配 shirt、甜品配 lunch），一定係 ✗
 * - spell：Part 3 ee / ea 字；team = ee 定 ea；focus = 工作紙嗰 4 個，第一下就啱 2 次之前排先
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.ROBO_UNIT = {
    id: 'starters-digraph-ee',
    digraphs: ['sh', 'ch', 'th', 'ph'],
    things: [
      { id: 'sheep',   word: 'sheep',   dg: 'sh' },
      { id: 'shell',   word: 'shell',   dg: 'sh' },
      { id: 'shorts',  word: 'shorts',  dg: 'sh', these: true },
      { id: 'shirt',   word: 'shirt',   dg: 'sh' },
      { id: 'fish',    word: 'fish',    dg: 'sh' },
      { id: 'chair',   word: 'chair',   dg: 'ch' },
      { id: 'lunch',   word: 'lunch',   dg: 'ch', say: 'This is lunch.' },
      { id: 'beach',   word: 'beach',   dg: 'ch' },
      { id: 'chick',   word: 'chick',   dg: 'ch' },
      { id: 'mouth',   word: 'mouth',   dg: 'th' },
      { id: 'clothes', word: 'clothes', dg: 'th', these: true },
      { id: 'teeth',   word: 'teeth',   dg: 'th', these: true },
      { id: 'bath',    word: 'bath',    dg: 'th' },
      { id: 'three',   word: 'three',   dg: 'th', say: 'This is three.' },
      { id: 'phone',   word: 'phone',   dg: 'ph' },
      { id: 'photo',   word: 'photo',   dg: 'ph' },
      // 陷阱圖（唔使學個字，講返一次就得）
      { id: 'goat',   word: 'goat',    no: 'No! It’s a goat.' },
      { id: 'mouse',  word: 'mouse',   no: 'No! It’s a mouse.' },
      { id: 'sofa',   word: 'sofa',    no: 'No! It’s a sofa.' },
      { id: 'tshirt', word: 'T-shirt', no: 'No! It’s a T-shirt.' },
      { id: 'cake',   word: 'cake',    no: 'No! It’s cake. Cake is not lunch!' },
      // Long ee / ea
      { id: 'meat',  word: 'meat',  team: 'ea' },
      { id: 'peas',  word: 'peas',  team: 'ea', these: true },
      { id: 'feet',  word: 'feet',  team: 'ee', these: true },
      { id: 'green', word: 'green', team: 'ee', say: 'This is green.' },
      { id: 'bee',   word: 'bee',   team: 'ee' },
      { id: 'tree',  word: 'tree',  team: 'ee' },
      { id: 'sea',   word: 'sea',   team: 'ea', say: 'This is the sea.' },
      { id: 'tea',   word: 'tea',   team: 'ea', say: 'This is tea.' }
    ],
    truth: [
      { id: 'sheep',   lie: 'shell' },
      { id: 'shell',   lie: 'fish' },
      { id: 'shorts',  lie: 'shirt' },
      { id: 'shirt',   lie: 'shorts' },
      { id: 'chair',   lie: 'beach' },
      { id: 'beach',   lie: 'chair' },
      { id: 'lunch',   lie: 'chick' },
      { id: 'mouth',   lie: 'teeth' },
      { id: 'clothes', lie: 'shorts' },
      { id: 'teeth',   lie: 'mouth' },
      { id: 'phone',   lie: 'photo' },
      { id: 'photo',   lie: 'phone' }
    ],
    traps: [
      { id: 'goat',   lie: 'sheep' },
      { id: 'mouse',  lie: 'mouth' },
      { id: 'sofa',   lie: 'chair' },
      { id: 'tshirt', lie: 'shirt' },
      { id: 'cake',   lie: 'lunch' }
    ],
    // 能量核心：聽個字，揀 sh / ch / th / ph 補返個空位
    core: ['sheep', 'shell', 'shorts', 'fish', 'chair', 'lunch', 'beach', 'chick', 'mouth', 'teeth', 'bath', 'three', 'phone', 'photo', 'clothes'],
    spell: [
      { id: 'meat', focus: true }, { id: 'peas', focus: true }, { id: 'feet', focus: true }, { id: 'green', focus: true },
      { id: 'bee' }, { id: 'tree' }, { id: 'sea' }, { id: 'tea' }
    ]
  };
})(typeof self !== 'undefined' ? self : this);
