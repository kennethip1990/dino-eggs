/*
 * 英雄認字：字表
 * - text：學校教嘅字（要喺 fonts/wenkai-subset.woff2 入面，見 README「加新字」）
 * - part：機械人身上邊個部位（見 hero-art.js）
 * - focus：true = 老師未剔，出多啲
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.WORD_UNIT = {
    id: 'body',
    title: '單元三：身體',
    words: [
      { id: 'heart', text: '心',   part: 'heart', focus: false },
      { id: 'head',  text: '頭',   part: 'head',  focus: false },
      { id: 'eyes',  text: '眼睛', part: 'eyes',  focus: false },
      { id: 'ears',  text: '耳朵', part: 'ears',  focus: true },
      { id: 'face',  text: '臉',   part: 'face',  focus: true },
      { id: 'nose',  text: '鼻子', part: 'nose',  focus: false },
      { id: 'mouth', text: '嘴巴', part: 'mouth', focus: false },
      { id: 'hair',  text: '頭髮', part: 'hair',  focus: false },
      { id: 'feet',  text: '腳',   part: 'feet',  focus: true },
      { id: 'body',  text: '身體', part: 'body',  focus: true },
      { id: 'back',  text: '背',   part: 'back',  focus: true },
      { id: 'looks', text: '樣子', part: 'looks', focus: true }
    ]
  };
})(typeof self !== 'undefined' ? self : this);
