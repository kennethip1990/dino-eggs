// 用法：node tools/list-recordings.js  → 印出 README 用嘅錄音清單（markdown table）
const vm = require('vm'), fs = require('fs'), path = require('path');
global.self = global;
for (const f of ['words.js', 'animals.js', 'voices.js']) vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'));
const groups = [
  ['數數（撳蛋時）', /^(yue|en)_\d+$/],
  ['開場（每局開始）', /_intro_/],
  ['總數（慶祝時）', /_total_/],
  ['讚賞（隨機一句）', /^praise_/],
  ['恐龍名（揀恐龍時）', /_dino_/],
  ['結束（瞓覺）', /^(yue|en)_bye$/],
  ['英雄認字：生字', /^word_/],
  ['英雄認字：句子', /^hero_/],
  ['英雄打怪獸短片', /^battle_/],
  ['Super Rex：動物名', /^an_/],
  ['Super Rex：叫聲', /^snd_/],
  ['Super Rex：問題', /^rex_where_/],
  ['Super Rex：句子', /^(rex_(?!where_)|legs_)/],
  ['Super Rex 打怪獸短片', /^rbat_/],
  ['英雄結局：黑雲怪 / 外星人', /^(cloud|ufo)_/],
  ['Super Rex 結局：龍捲風 / 隕石', /^(torn|met)_/],
  ['恐龍搵蛋：特別恐龍BB', /_(special|sp_\w+)$/],
  ['ABC 貪食蛇：字母', /^ltr_/],
  ['ABC 貪食蛇：句子 + 結局', /^snk_/],
  ['貼紙', /^(sticker|unlock|locked)_/],
  ['秘密短片：怪獸大王', /^boss_/]
];
const clips = self.VOICES.clips;
const out = [];
for (const [title, re] of groups) {
  out.push(`\n**${title}**\n`, '| 檔名 | 語言 | 要讀 |', '|---|---|---|');
  const keys = Object.keys(clips).filter((k) => re.test(k));
  keys.sort((a, b) => {
    const na = +(a.match(/\d+$/) || [0])[0], nb = +(b.match(/\d+$/) || [0])[0];
    return na - nb || (a.startsWith('yue') ? -1 : 1);
  });
  for (const k of keys) out.push(`| \`${k}.mp3\` | ${clips[k].lang === 'yue' ? '廣東話' : 'English'} | ${clips[k].text} |`);
}
console.log(out.join('\n'));
