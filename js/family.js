/*
 * 恐龍生日派對：字表（單元四：家庭/人物）
 * - text：學校教嘅字（要喺 fonts/wenkai-subset.woff2 入面，見 README「加新字」）
 * - who：邊個角色（見 party-art.js）；爸爸 / 父親、媽媽 / 母親 係同一個人
 * - group：adult = 大人、kid = 小朋友（坐位分類用）
 * - focus：true = 老師未剔（家長區打 ★）；揀字係輪流平均出
 * - 家人、小朋友 唔係一個人：每局都會出（大合照標題 / 小朋友枱）
 * 亦會被 sw.js importScripts，所以用 `self`。
 */
(function (root) {
  root.FAMILY_UNIT = {
    id: 'family',
    title: '單元四：家庭/人物',
    people: [
      { id: 'baba',    text: '爸爸', who: 'baba',    group: 'adult', focus: false },
      { id: 'fuqin',   text: '父親', who: 'baba',    group: 'adult', focus: true, same: 'baba' },
      { id: 'mama',    text: '媽媽', who: 'mama',    group: 'adult', focus: false },
      { id: 'muqin',   text: '母親', who: 'mama',    group: 'adult', focus: false, same: 'mama' },
      { id: 'yeye',    text: '爺爺', who: 'yeye',    group: 'adult', focus: true },
      { id: 'shushu',  text: '叔叔', who: 'shushu',  group: 'adult', focus: true },
      { id: 'jiujiu',  text: '舅舅', who: 'jiujiu',  group: 'adult', focus: true },
      { id: 'laoshi',  text: '老師', who: 'laoshi',  group: 'adult', focus: true },
      { id: 'gege',    text: '哥哥', who: 'gege',    group: 'kid',   focus: false },
      { id: 'didi',    text: '弟弟', who: 'didi',    group: 'kid',   focus: false },
      { id: 'meimei',  text: '妹妹', who: 'meimei',  group: 'kid',   focus: false },
      { id: 'tongxue', text: '同學', who: 'tongxue', group: 'kid',   focus: true }
    ],
    groups: [
      { id: 'jiaren', text: '家人',   focus: true },
      { id: 'kids',   text: '小朋友', focus: true }
    ]
  };
})(typeof self !== 'undefined' ? self : this);
