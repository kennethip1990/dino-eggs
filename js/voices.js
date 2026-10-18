/*
 * 聲音設定 — 所有語音集中喺呢度管理。
 * 每段聲音一個 key；遊戲會先試 audio/<key>.mp3，冇就用內置語音 (Web Speech)。
 * 改句子：直接改下面 text。改完記得 README 嘅錄音清單同步 (node tools/list-recordings.js)。
 *
 * 呢個 file 亦會被 sw.js importScripts，所以用 `self` 唔用 `window`。
 */
(function (root) {
  // 數數用「二」，講數量用「兩」
  const YUE_COUNT = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const YUE_QTY   = ['一', '兩', '三', '四', '五', '六', '七', '八', '九', '十'];
  const EN_NUM    = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const clips = {};
  for (let i = 0; i < 10; i++) {
    const n = i + 1;
    clips['yue_' + n]       = { lang: 'yue', text: YUE_COUNT[i] };
    clips['en_' + n]        = { lang: 'en',  text: EN_NUM[i] };
    clips['yue_intro_' + n] = { lang: 'yue', text: '幫我搵返' + YUE_QTY[i] + '隻蛋呀！' };
    clips['en_intro_' + n]  = { lang: 'en',  text: 'Help me find ' + EN_NUM[i] + (n === 1 ? ' egg!' : ' eggs!') };
    clips['yue_total_' + n] = { lang: 'yue', text: YUE_QTY[i] + '隻蛋！' };
    clips['en_total_' + n]  = { lang: 'en',  text: cap(EN_NUM[i]) + (n === 1 ? ' egg!' : ' eggs!') };
  }
  clips.praise_1 = { lang: 'yue', text: '好叻呀！' };
  clips.praise_2 = { lang: 'yue', text: '多謝你幫我搵返啲蛋！' };
  clips.praise_3 = { lang: 'en',  text: 'Great job!' };
  clips.praise_4 = { lang: 'en',  text: 'You did it!' };
  // 揀恐龍嗰陣讀佢個名
  clips.yue_dino_brachio = { lang: 'yue', text: '腕龍' };
  clips.en_dino_brachio  = { lang: 'en',  text: 'Brachiosaurus' };
  clips.yue_dino_trex    = { lang: 'yue', text: '暴龍' };
  clips.en_dino_trex     = { lang: 'en',  text: 'T-Rex' };
  clips.yue_dino_trice   = { lang: 'yue', text: '三角龍' };
  clips.en_dino_trice    = { lang: 'en',  text: 'Triceratops' };
  // ---- 英雄認字（淨係廣東話）----
  if (root.WORD_UNIT) {
    for (const w of root.WORD_UNIT.words) clips['word_' + w.id] = { lang: 'yue', text: w.text };
  }
  clips.hero_hi     = { lang: 'yue', text: '我係機械人英雄！壞蛋偷咗我啲裝備，幫我搵返啦！' };
  clips.hero_find   = { lang: 'yue', text: '幫我搵' };
  clips.hero_where  = { lang: 'yue', text: '呢個字喺我身上邊度呀？' };
  clips.hero_yes_1  = { lang: 'yue', text: '啱喇！' };
  clips.hero_yes_2  = { lang: 'yue', text: '好叻呀！' };
  clips.hero_yes_3  = { lang: 'yue', text: '好犀利！' };
  clips.hero_power  = { lang: 'yue', text: '裝備齊晒，變身！' };
  clips.hero_test   = { lang: 'yue', text: '而家考吓你！' };
  clips.battle_alarm = { lang: 'yue', text: '哎呀！有怪獸嚟搞亂個城市！' };
  clips.battle_go    = { lang: 'yue', text: '英雄出動！愛心炮，發射！' };
  clips.battle_sorry = { lang: 'yue', text: '對唔住呀，我唔再搞亂喇！' };
  clips.battle_win   = { lang: 'yue', text: '打敗怪獸喇！好嘢！' };
  clips.hero_bye    = { lang: 'yue', text: '多謝你幫我！英雄要去救人喇，拜拜！' };
  // ---- Super Rex 英文（全英文）----
  if (root.ANIMAL_UNIT) {
    for (const a of root.ANIMAL_UNIT.animals) {
      clips['an_' + a.id]        = { lang: 'en', text: cap(a.word) + '!' };
      clips['snd_' + a.id]       = { lang: 'en', text: a.sound };
      clips['rex_where_' + a.id] = { lang: 'en', text: 'Where’s the ' + a.word + '?' };
    }
  }
  clips.rex_hi     = { lang: 'en', text: 'Super Rex to the rescue!' };
  clips.rex_intro  = { lang: 'en', text: 'Hi Luca! A naughty monster trapped the animals in bubbles. Let’s save them!' };
  clips.rex_yes_1  = { lang: 'en', text: 'Yes!' };
  clips.rex_yes_2  = { lang: 'en', text: 'Well done!' };
  clips.rex_yes_3  = { lang: 'en', text: 'Great job, Luca!' };
  clips.rex_read   = { lang: 'en', text: 'Now let’s read!' };
  clips.rex_read_q = { lang: 'en', text: 'What does it say?' };
  clips.rex_legs   = { lang: 'en', text: 'Let’s count legs!' };
  clips.rex_legs_q = { lang: 'en', text: 'Two legs or four legs?' };
  clips.rex_count  = { lang: 'en', text: 'Let’s count!' };
  clips.legs_2     = { lang: 'en', text: 'Two legs!' };
  clips.legs_4     = { lang: 'en', text: 'Four legs!' };
  clips.rbat_alarm = { lang: 'en', text: 'Oh no! The monster is back!' };
  clips.rbat_go    = { lang: 'en', text: 'Super Rex, big roar!' };
  clips.rbat_sorry = { lang: 'en', text: 'Sorry! I’ll be nice now.' };
  clips.rbat_win   = { lang: 'en', text: 'Hooray! Super Rex saves the day!' };
  clips.rex_bye    = { lang: 'en', text: 'Thank you, Luca! See you next time!' };
  // ---- ABC 貪食蛇（全英文）----
  for (let i = 0; i < 26; i++) clips['ltr_' + String.fromCharCode(97 + i)] = { lang: 'en', text: String.fromCharCode(65 + i) };
  clips.snk_hi      = { lang: 'en', text: 'Hi Luca! I’m Sunny the snake. I’m so hungry!' };
  clips.snk_intro   = { lang: 'en', text: 'Let’s eat the letters in order!' };
  clips.snk_find    = { lang: 'en', text: 'Find' };
  clips.snk_yum_1   = { lang: 'en', text: 'Yum!' };
  clips.snk_yum_2   = { lang: 'en', text: 'Yummy!' };
  clips.snk_yum_3   = { lang: 'en', text: 'Crunch, crunch!' };
  clips.snk_sing    = { lang: 'en', text: 'Look at my letters! Let’s read them!' };
  clips.snk_done    = { lang: 'en', text: 'Well done, Luca! My tummy is full!' };
  clips.snk_heart_1 = { lang: 'en', text: 'I can draw a picture!' };
  clips.snk_heart_2 = { lang: 'en', text: 'A big heart! I love letters!' };
  clips.snk_drg_1   = { lang: 'en', text: 'Wow! A magic star!' };
  clips.snk_drg_2   = { lang: 'en', text: 'I’m a flying dragon!' };
  clips.snk_drg_3   = { lang: 'en', text: 'That was so much fun!' };
  clips.snk_mon_1   = { lang: 'en', text: 'Oh no! The monster wants my letters!' };
  clips.snk_mon_2   = { lang: 'en', text: 'Letter power, go!' };
  clips.snk_mon_3   = { lang: 'en', text: 'Hooray! My letters are safe!' };
  // ---- 結局短片 ----
  // 英雄（廣東話）
  clips.cloud_alarm = { lang: 'yue', text: '哎呀！黑雲怪落大雨，個城市濕晒！' };
  clips.cloud_go    = { lang: 'yue', text: '英雄出動！太陽光，發射！' };
  clips.cloud_happy = { lang: 'yue', text: '黑雲變白雲！仲有彩虹添！' };
  clips.cloud_win   = { lang: 'yue', text: '好嘢！天晴喇！' };
  clips.ufo_alarm   = { lang: 'yue', text: '哎呀！外星人用飛碟吸走大廈！' };
  clips.ufo_go      = { lang: 'yue', text: '英雄出動！磁力手，拉返落嚟！' };
  clips.ufo_bye     = { lang: 'yue', text: '對唔住呀，我玩吓啫！拜拜！' };
  clips.ufo_win     = { lang: 'yue', text: '大廈返嚟喇！好嘢！' };
  // Super Rex（英文）
  clips.torn_alarm = { lang: 'en', text: 'Oh no! A big tornado!' };
  clips.torn_go    = { lang: 'en', text: 'Super Rex, tail spin!' };
  clips.torn_safe  = { lang: 'en', text: 'Boing! Boing! Everyone is safe!' };
  clips.met_alarm  = { lang: 'en', text: 'Oh no! A big rock from space!' };
  clips.met_go     = { lang: 'en', text: 'Super Rex, jump!' };
  clips.met_stars  = { lang: 'en', text: 'Wow! Shooting stars!' };
  // 恐龍搵蛋：特別恐龍BB
  clips.yue_special    = { lang: 'yue', text: '咦？有隻特別嘅蛋！' };
  clips.en_special     = { lang: 'en',  text: 'A special egg!' };
  clips.yue_sp_rainbow = { lang: 'yue', text: '係彩虹恐龍BB！' };
  clips.en_sp_rainbow  = { lang: 'en',  text: 'A rainbow baby dino!' };
  clips.yue_sp_gold    = { lang: 'yue', text: '係金色恐龍BB！' };
  clips.en_sp_gold     = { lang: 'en',  text: 'A golden baby dino!' };
  clips.yue_sp_star    = { lang: 'yue', text: '係星星恐龍BB！' };
  clips.en_sp_star     = { lang: 'en',  text: 'A starry baby dino!' };
  // 貼紙
  clips.sticker_yue = { lang: 'yue', text: '你攞到一張新貼紙！' };
  clips.sticker_en  = { lang: 'en',  text: 'You got a new sticker!' };
  clips.unlock_yue  = { lang: 'yue', text: '集齊晒！秘密短片解鎖咗！' };
  clips.unlock_en   = { lang: 'en',  text: 'Secret movie unlocked!' };
  clips.locked_yue  = { lang: 'yue', text: '集齊六張英雄同Super Rex貼紙，就可以睇秘密短片！' };
  // 秘密短片：機械人英雄 + Super Rex 大戰怪獸大王
  clips.boss_alarm  = { lang: 'yue', text: '嘩！怪獸大王嚟咗！' };
  clips.boss_team   = { lang: 'yue', text: '機械人英雄同Super Rex，一齊出動！' };
  clips.boss_sorry  = { lang: 'yue', text: '對唔住！我哋做好朋友啦！' };
  clips.boss_win    = { lang: 'yue', text: '我哋贏咗喇！' };
  clips.boss_win_en = { lang: 'en',  text: 'We did it! Hooray!' };
  clips.yue_bye  = { lang: 'yue', text: '恐龍BB要瞓覺喇，拜拜！' };
  clips.en_bye   = { lang: 'en',  text: 'Good night, little dinos!' };

  root.VOICES = {
    audioDir: 'audio/',
    ext: '.mp3',
    gapMs: 300,            // 廣東話同英文之間嘅停頓
    langs: {
      // match 時會將 _ 轉 -、全部細楷再比較；Android 有時報 yue-HK / zh_HK
      yue: { ttsLang: 'zh-HK', match: ['zh-hk', 'yue-hk', 'yue', 'zh-yue'], nameHints: ['cantonese', '粵', '廣東'], rate: 0.85, pitch: 1.1 },
      en:  { ttsLang: 'en-GB', match: ['en-gb'], fallbackMatch: ['en'],    nameHints: [],                           rate: 0.9,  pitch: 1.1 }
    },
    clips: clips
  };
})(typeof self !== 'undefined' ? self : this);
