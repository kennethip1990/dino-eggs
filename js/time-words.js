/*
 * 恐龍時光機：字表（單元六：其他）
 * - text：學校教嘅詞（要喺 fonts/wenkai-subset.woff2 入面，見 README「加新字」）
 * - c：兩粒字嘅 id（見下面 chars；砌詞用，每粒字有自己嘅聲音 tc_<id>）
 * - pic：有圖先會出「睇圖揀字」（見 time-art.js）；生活 / 事情 / 地方 / 國家 太抽象，淨係出聽字 + 砌詞
 * - focus：true = 老師未剔，揀字會排先；第一下就啱 2 次之後同其他字平均輪流
 * - pairs：共用一粒字、容易撈亂嘅詞 → 互相做干擾卡 / 干擾字粒
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.TIME_UNIT = {
    id: 'time',
    title: '單元六：其他',
    words: [
      { id: 'singjam',   text: '聲音', c: ['seng', 'jam'],   pic: 'sound',    focus: false },
      { id: 'deifong',   text: '地方', c: ['dei', 'fong'],   focus: false },
      { id: 'hokhaau',   text: '學校', c: ['hok', 'haau'],   pic: 'school',   focus: false },
      { id: 'zunggwok',  text: '中國', c: ['zung', 'gwok'],  pic: 'china',    focus: false },
      { id: 'gwokgaa',   text: '國家', c: ['gwok', 'gaa'],   focus: false },
      { id: 'gusi',      text: '故事', c: ['gu', 'si'],      pic: 'book',     focus: true },
      { id: 'gungzok',   text: '工作', c: ['gung', 'zok'],   pic: 'work',     focus: true },
      { id: 'sangwut',   text: '生活', c: ['sang', 'wut'],   focus: true },
      { id: 'sicing',    text: '事情', c: ['si', 'cing'],    focus: true },
      { id: 'zousoeng',  text: '早上', c: ['zou', 'soeng'],  pic: 'morning',  focus: false },
      { id: 'sigaan',    text: '時間', c: ['sih', 'gaan'],   pic: 'clock',    focus: true },
      { id: 'singkei',   text: '星期', c: ['sing', 'kei'],   pic: 'calendar', focus: true },
      { id: 'saangjat',  text: '生日', c: ['sang', 'jat'],   pic: 'cake',     focus: true },
      { id: 'sannin',    text: '新年', c: ['san', 'nin'],    pic: 'newyear',  focus: true },
      { id: 'jauhei',    text: '遊戲', c: ['jau', 'hei'],    pic: 'game',     focus: true }
    ],
    chars: {
      seng: '聲', jam: '音', dei: '地', fong: '方', hok: '學', haau: '校', zung: '中', gwok: '國', gaa: '家',
      gu: '故', si: '事', gung: '工', zok: '作', sang: '生', wut: '活', cing: '情', zou: '早', soeng: '上',
      sih: '時', gaan: '間', sing: '星', kei: '期', jat: '日', san: '新', nin: '年', jau: '遊', hei: '戲'
    },
    pairs: [['saangjat', 'sangwut'], ['gusi', 'sicing'], ['zunggwok', 'gwokgaa']]
  };
})(typeof self !== 'undefined' ? self : this);
