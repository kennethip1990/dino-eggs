// 用法：node tools/list-recordings.js  → 印出 README 用嘅錄音清單（markdown table）
const vm = require('vm'), fs = require('fs'), path = require('path');
global.self = global;
vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'voices.js'), 'utf8'));
const groups = [
  ['數數（撳蛋時）', /^(yue|en)_\d+$/],
  ['開場（每局開始）', /_intro_/],
  ['總數（慶祝時）', /_total_/],
  ['讚賞（隨機一句）', /^praise_/],
  ['恐龍名（揀恐龍時）', /_dino_/],
  ['結束（瞓覺）', /_bye$/]
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
