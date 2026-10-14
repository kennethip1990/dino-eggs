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
  clips.hero_bye    = { lang: 'yue', text: '多謝你幫我！英雄要去救人喇，拜拜！' };
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
