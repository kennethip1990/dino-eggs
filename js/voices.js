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
  // ---- 恐龍生日派對（單元四：家庭/人物，淨係廣東話）----
  if (root.FAMILY_UNIT) {
    for (const w of root.FAMILY_UNIT.people) {
      clips['fam_' + w.id]   = { lang: 'yue', text: w.text };
      clips['greet_' + w.id] = { lang: 'yue', text: w.text + '好！' };
    }
    for (const g of root.FAMILY_UNIT.groups) clips['fam_' + g.id] = { lang: 'yue', text: g.text };
  }
  clips.fam_adult    = { lang: 'yue', text: '大人' };
  clips.pty_hi       = { lang: 'yue', text: '今日係小暴龍生日！Luca，幫手招呼客人啦！' };
  clips.pty_who      = { lang: 'yue', text: '係邊個嚟咗呀？' };
  clips.pty_greet    = { lang: 'yue', text: '同佢打招呼，講：' };
  clips.pty_reply    = { lang: 'yue', text: '你好呀！你好有禮貌呀！' };
  clips.pty_yes_1    = { lang: 'yue', text: '啱喇！' };
  clips.pty_yes_2    = { lang: 'yue', text: '好叻呀！' };
  clips.pty_yes_3    = { lang: 'yue', text: '好犀利！' };
  clips.pty_give     = { lang: 'yue', text: '而家幫手派嘢食！聽清楚先好拎呀！' };
  clips.pty_again    = { lang: 'yue', text: '再聽多次：' };
  clips.pty_thanks   = { lang: 'yue', text: '多謝你！' };
  clips.pty_sit      = { lang: 'yue', text: '大人坐呢邊，小朋友坐嗰邊。' };
  clips.pty_sit_q    = { lang: 'yue', text: '睇吓張咭，佢坐邊度呀？' };
  clips.pty_is_adult = { lang: 'yue', text: '係大人！' };
  clips.pty_is_kid   = { lang: 'yue', text: '係小朋友！' };
  clips.syn_fuqin    = { lang: 'yue', text: '父親即係爸爸！' };
  clips.syn_muqin    = { lang: 'yue', text: '母親即係媽媽！' };
  clips.pty_photo    = { lang: 'yue', text: '大家埋位，影張家人大合照！' };
  clips.pty_cheese   = { lang: 'yue', text: '三、二、一，茄子！' };
  clips.pty_photo_ok = { lang: 'yue', text: '好靚呀！' };
  clips.pty_bye      = { lang: 'yue', text: '多謝你幫手！今日好開心呀！拜拜！' };
  // 派嘢：「攞蛋糕畀」+「爺爺」；兩步：「先攞…畀」+ 名 +「再攞…畀」+ 名
  for (const [id, name] of [['cake', '蛋糕'], ['drink', '汽水'], ['balloon', '氣球']]) {
    clips['give_' + id]  = { lang: 'yue', text: '攞' + name + '畀' };
    clips['first_' + id] = { lang: 'yue', text: '先攞' + name + '畀' };
    clips['then_' + id]  = { lang: 'yue', text: '再攞' + name + '畀' };
  }
  // 小記者問題（面試常見題）：問題 + 示範答法
  clips.q_family    = { lang: 'yue', text: 'Luca，你屋企有咩人呀？' };
  clips.hint_family = { lang: 'yue', text: '你可以咁講：我屋企有爸爸、媽媽……' };
  clips.q_play      = { lang: 'yue', text: '你最鍾意同屋企邊個玩呀？玩咩呀？' };
  clips.hint_play   = { lang: 'yue', text: '你可以咁講：我最鍾意同爺爺玩恐龍。' };
  clips.q_name      = { lang: 'yue', text: '你叫咩名呀？今年幾多歲呀？' };
  clips.hint_name   = { lang: 'yue', text: '你可以咁講：我叫Luca，今年四歲。' };
  clips.q_gift      = { lang: 'yue', text: '你生日想要咩禮物呀？點解呀？' };
  clips.hint_gift   = { lang: 'yue', text: '你可以咁講：我想要恐龍，因為我好鍾意恐龍。' };
  clips.mic_tap     = { lang: 'yue', text: '撳個咪，講俾我聽！' };
  clips.mic_listen  = { lang: 'yue', text: '我聽吓你講咩……' };
  clips.mic_great   = { lang: 'yue', text: '講得好好呀！好叻！' };
  clips.mic_none    = { lang: 'yue', text: '講俾爸爸媽媽聽啦！講完撳一下個咪。' };
  // 結局
  clips.pm_alarm  = { lang: 'yue', text: '哎呀！怪獸偷咗個蛋糕！' };
  clips.pm_go     = { lang: 'yue', text: '彩帶炮，發射！' };
  clips.pm_sorry  = { lang: 'yue', text: '對唔住呀！我都好想食蛋糕！' };
  clips.pm_win    = { lang: 'yue', text: '唔緊要！大家一齊食啦！' };
  clips.pb_alarm  = { lang: 'yue', text: '嘩！氣球拉咗小暴龍上天！' };
  clips.pb_go     = { lang: 'yue', text: 'Luca，快啲撳爆啲氣球！' };
  clips.pb_win    = { lang: 'yue', text: '安全降落！好嘢！' };
  clips.pc_wish   = { lang: 'yue', text: '許個願，吹蠟燭啦！' };
  clips.pc_blow   = { lang: 'yue', text: '用力吹！或者撳蠟燭都得！' };
  clips.pc_win    = { lang: 'yue', text: '生日快樂！' };
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
  // ---- Jedi Luca 大戰 Sith（全英文）----
  if (root.JEDI_UNIT) {
    // 句子淨係出 Truth Saber 用到嘅字（swim / sand 唔會講「This is a …」）
    const inTruth = new Set(root.JEDI_UNIT.truth.flatMap((p) => [p.id, p.lie]));
    for (const t of root.JEDI_UNIT.things) {
      clips['w_' + t.id] = { lang: 'en', text: t.word };
      if (inTruth.has(t.id)) clips['ts_' + t.id] = { lang: 'en', text: (t.these ? 'These are ' : 'This is a ') + t.word + '.' };
    }
  }
  // 字母「音」（phonics，例如 d = /d/）：內置語音讀唔到，所以冇錄音就唔讀，遊戲改讀字母名（ltr_*）
  const PH = { a: 'apple', b: 'bed', c: 'cat', d: 'dog', e: 'egg', f: 'fish', g: 'goat', h: 'hand', i: 'ink', j: 'jam', k: 'kite', l: 'lamp', m: 'mum', n: 'nest', o: 'dog', p: 'pen', q: 'queen', r: 'red', s: 'sock', t: 'ten', u: 'duck', v: 'van', w: 'swim', x: 'box', y: 'yes', z: 'zoo' };
  for (const l of Object.keys(PH)) clips['ph_' + l] = { lang: 'en', text: l + ' 嘅字母音（好似 ' + PH[l] + ' 嗰個音，唔好讀字母名）', noTts: true };
  clips.jd_hi      = { lang: 'en', text: 'Hello, Jedi Luca!' };
  clips.jd_intro   = { lang: 'en', text: 'The Sith droids are playing tricks. Look and read. Is it right?' };
  clips.jd_tick_q  = { lang: 'en', text: 'Tick or cross?' };
  clips.jd_tick    = { lang: 'en', text: 'Tick! That’s right!' };
  clips.jd_cross   = { lang: 'en', text: 'Cross! That’s wrong!' };
  clips.jd_what    = { lang: 'en', text: 'What is it?' };
  clips.jd_look    = { lang: 'en', text: 'Look again!' };
  clips.jd_yes_1   = { lang: 'en', text: 'Yes!' };
  clips.jd_yes_2   = { lang: 'en', text: 'Well done!' };
  clips.jd_yes_3   = { lang: 'en', text: 'Great job, Jedi Luca!' };
  clips.jd_spell   = { lang: 'en', text: 'Now use the Force! Let’s spell the words!' };
  clips.jd_spell_q = { lang: 'en', text: 'Let’s spell' };
  clips.jd_charge  = { lang: 'en', text: 'Your lightsaber is ready!' };
  clips.jd_boss    = { lang: 'en', text: 'Oh no! Here comes the Sith Lord!' };
  clips.jd_boss_go = { lang: 'en', text: 'Answer right to beat him!' };
  clips.jd_find    = { lang: 'en', text: 'Find the' };
  clips.jd_read_q  = { lang: 'en', text: 'What does it say?' };
  clips.sith_laugh = { lang: 'en', text: 'Ha ha! Try again!' };
  clips.sith_ouch_1 = { lang: 'en', text: 'Ouch!' };
  clips.sith_ouch_2 = { lang: 'en', text: 'Oof!' };
  clips.sith_ouch_3 = { lang: 'en', text: 'Oh no!' };
  clips.sith_give  = { lang: 'en', text: 'OK, OK! You win, Jedi Luca!' };
  clips.jd_win     = { lang: 'en', text: 'Hooray! The galaxy is safe!' };
  clips.jd_bye     = { lang: 'en', text: 'Thank you, Jedi Luca! May the Force be with you!' };
  // Jedi 結局
  clips.dro_alarm = { lang: 'en', text: 'Oh no! A Sith droid army!' };
  clips.dro_go    = { lang: 'en', text: 'Jedi Luca, Force push!' };
  clips.dro_win   = { lang: 'en', text: 'Beep boop! Bye bye, droids!' };
  clips.shp_alarm = { lang: 'en', text: 'Oh no! The Sith Dark Star!' };
  clips.shp_go    = { lang: 'en', text: 'Jedi Luca, fly your starfighter!' };
  clips.shp_win   = { lang: 'en', text: 'Wow! Fireworks!' };
  clips.sab_alarm = { lang: 'en', text: 'I’m back! Ha ha ha!' };
  clips.sab_go    = { lang: 'en', text: 'Jedi Luca, rainbow saber!' };
  clips.sab_good  = { lang: 'en', text: 'I want to be good! Can I be a Jedi too?' };
  clips.sab_win   = { lang: 'en', text: 'Yes! Welcome, friend!' };
  // ---- Jedi + Sith 大戰 Mecha-Rex（全英文）----
  if (root.MECHA_UNIT) {
    const U = root.MECHA_UNIT;
    for (const t of U.things) {
      clips['w_' + t.id] = { lang: 'en', text: t.word };
      if (t.no) clips['no_' + t.id] = { lang: 'en', text: t.no };
    }
    for (const id of U.spell) {
      const t = U.things.find((x) => x.id === id);
      clips['ts_' + id] = { lang: 'en', text: t.say || 'This is a ' + t.word + '.' };
    }
    for (const p of U.preps) clips['pw_' + p.id] = { lang: 'en', text: p.word };
    for (const [obj, o] of Object.entries(U.places)) {
      for (const p of o.preps) {
        const word = U.preps.find((x) => x.id === p).word;
        clips['pp_' + p + '_' + obj] = { lang: 'en', text: 'The droid is ' + word + ' ' + (p === 'between' ? o.some : o.one) + '.' };
      }
    }
  }
  clips.mx_hi      = { lang: 'en', text: 'Hello, Jedi Luca! Hello, Sith Luca!' };
  clips.mx_intro   = { lang: 'en', text: 'Oh no! Mecha-Rex took the baby droids! Let’s work together!' };
  clips.mx_who     = { lang: 'en', text: 'Who will go? Jedi or Sith?' };
  clips.mx_go_jedi = { lang: 'en', text: 'Jedi Luca, go!' };
  clips.mx_go_sith = { lang: 'en', text: 'Sith Luca, go!' };
  clips.mx_find    = { lang: 'en', text: 'The baby droids are hiding. Listen and find them!' };
  clips.mx_which   = { lang: 'en', text: 'Which one?' };
  clips.mx_read    = { lang: 'en', text: 'Where is the droid? Read and choose.' };
  clips.mx_saved   = { lang: 'en', text: 'You saved a baby droid!' };
  clips.bb_thanks  = { lang: 'en', text: 'Beep beep! Thank you!' };
  clips.mx_two     = { lang: 'en', text: 'Next to. Two words!' };
  clips.mx_two_q   = { lang: 'en', text: 'Two words. Which one is first?' };
  clips.mx_forge   = { lang: 'en', text: 'Now, the Magic E forge! Spell the words!' };
  clips.mx_magic   = { lang: 'en', text: 'Add the magic e!' };
  clips.mx_magic_wow = { lang: 'en', text: 'Magic e!' };
  clips.mx_says_a  = { lang: 'en', text: 'The A says A!' };
  clips.mx_says_u  = { lang: 'en', text: 'The U says U!' };
  clips.mx_crystal = { lang: 'en', text: 'Power crystal!' };
  clips.mx_ready   = { lang: 'en', text: 'The power crystals are ready!' };
  clips.mx_boss    = { lang: 'en', text: 'Oh no! Here comes Mecha-Rex!' };
  clips.mx_boss_go = { lang: 'en', text: 'Answer right to beat him!' };
  clips.mx_yes_3   = { lang: 'en', text: 'Super team!' };
  clips.mr_laugh   = { lang: 'en', text: 'Roar! Try again!' };
  clips.mr_ouch_1  = { lang: 'en', text: 'Clunk!' };
  clips.mr_ouch_2  = { lang: 'en', text: 'Beep! Ouch!' };
  clips.mr_ouch_3  = { lang: 'en', text: 'Oh no, my bolts!' };
  clips.mr_give    = { lang: 'en', text: 'Beep boop… OK! You win!' };
  clips.mx_win     = { lang: 'en', text: 'Hooray! The baby droids are safe!' };
  clips.mx_bye     = { lang: 'en', text: 'Thank you, Jedi Luca and Sith Luca! Bye bye!' };
  // Mecha-Rex 結局
  clips.xc_alarm = { lang: 'en', text: 'Roar! I’m not done yet!' };
  clips.xc_go    = { lang: 'en', text: 'Jedi and Sith, team saber!' };
  clips.xc_good  = { lang: 'en', text: 'Beep beep! Can we be friends?' };
  clips.xc_win   = { lang: 'en', text: 'Yes! Friends!' };
  clips.rk_alarm = { lang: 'en', text: 'You can’t catch me! Ha ha!' };
  clips.rk_go    = { lang: 'en', text: 'Jedi and Sith, fly!' };
  clips.rk_win   = { lang: 'en', text: 'Parachute! Bye bye, Mecha-Rex!' };
  clips.gd_alarm = { lang: 'en', text: 'Mecha-Rex is back!' };
  clips.gd_go    = { lang: 'en', text: 'Baby droids, team up!' };
  clips.gd_win   = { lang: 'en', text: 'Wow! Giant droid power!' };
  clips.df_alarm = { lang: 'en', text: 'Roar! Laser time! Pew pew!' };
  clips.df_go    = { lang: 'en', text: 'Tap to block the lasers!' };
  clips.df_block = { lang: 'en', text: 'Block!' };
  clips.df_broke = { lang: 'en', text: 'Beep… my laser is broken!' };
  clips.df_win   = { lang: 'en', text: 'Super saber block!' };
  clips.dn_alarm = { lang: 'en', text: 'Roar! Fight me!' };
  clips.dn_go    = { lang: 'en', text: 'Wait! Push his buttons!' };
  clips.dn_spin  = { lang: 'en', text: 'Spin!' };
  clips.dn_jump  = { lang: 'en', text: 'Jump!' };
  clips.dn_wiggle = { lang: 'en', text: 'Wiggle wiggle!' };
  clips.dn_party = { lang: 'en', text: 'Beep boop! Dance party!' };
  clips.dn_win   = { lang: 'en', text: 'Mecha-Rex loves to dance!' };
  clips.cd_alarm = { lang: 'en', text: 'Roar! My candy! You can’t have it!' };
  clips.cd_go    = { lang: 'en', text: 'Tap Mecha-Rex three times!' };
  clips.cd_pop   = { lang: 'en', text: 'Pop! Candy everywhere!' };
  clips.cd_count = { lang: 'en', text: 'Catch five candies. Count with me!' };
  clips.cd_share = { lang: 'en', text: 'Beep beep! Sorry. Let’s share!' };
  clips.cd_win   = { lang: 'en', text: 'Yummy! Thank you, Mecha-Rex!' };
  // ---- 機甲 Luca 出擊（全英文）----
  if (root.ROBO_UNIT) {
    const U = root.ROBO_UNIT;
    const say = (t) => t.say || (t.these ? 'These are ' : 'This is a ') + t.word + '.';
    for (const t of U.things) {
      clips['rw_' + t.id] = { lang: 'en', text: t.word };
      if (t.no) clips['rn_' + t.id] = { lang: 'en', text: t.no };
      if (t.dg) clips['rs_' + t.id] = { lang: 'en', text: say(t) };
    }
    // digraph 嘅音：內置語音讀唔到，冇錄音就改讀字母名（s, h）
    const DG = { sh: 'sheep', ch: 'chair', th: 'three', ph: 'phone' };
    for (const d of U.digraphs) clips['dg_' + d] = { lang: 'en', text: d + ' 嘅音（好似 ' + DG[d] + ' 開頭嗰個音，唔好讀字母名）', noTts: true };
  }
  clips.rb_hi      = { lang: 'en', text: 'Hello, Robo-Luca!' };
  clips.rb_intro   = { lang: 'en', text: 'Oh no! The space monster Gloop is coming! Power up your robot!' };
  clips.rb_shields = { lang: 'en', text: 'You have five shields. Wrong answers break a shield. Listen first, then tap!' };
  clips.rb_scan    = { lang: 'en', text: 'Scanner on! Look and read. Tick or cross?' };
  clips.rb_core    = { lang: 'en', text: 'Power cores! Listen to the word. Which letters are missing?' };
  clips.rb_core_q  = { lang: 'en', text: 'Which letters?' };
  clips.rb_saber   = { lang: 'en', text: 'Beam saber time! Spell the words. Double E, or E A?' };
  clips.rb_team_q  = { lang: 'en', text: 'Double E, or E A?' };
  clips.rb_team_ee = { lang: 'en', text: 'Double E!' };
  clips.rb_team_ea = { lang: 'en', text: 'E A!' };
  clips.rb_ready   = { lang: 'en', text: 'Your beam saber is ready!' };
  clips.rb_look    = { lang: 'en', text: 'Oops! Listen again.' };
  clips.rb_ko      = { lang: 'en', text: 'Oh no! No more shields! Back to base!' };
  clips.rb_fix     = { lang: 'en', text: 'Fixing, fixing… Recharging!' };
  clips.rb_full    = { lang: 'en', text: 'Power full! Let’s try again. Listen carefully!' };
  clips.rb_perfect = { lang: 'en', text: 'Perfect! No shields broken! Gold medal!' };
  clips.rb_yes_1   = { lang: 'en', text: 'Yes!' };
  clips.rb_yes_2   = { lang: 'en', text: 'Great job!' };
  clips.rb_yes_3   = { lang: 'en', text: 'Robo power!' };
  clips.rb_boss    = { lang: 'en', text: 'Here comes Gloop!' };
  clips.rb_boss_go = { lang: 'en', text: 'Answer right to beat him!' };
  clips.gm_laugh   = { lang: 'en', text: 'Gloop gloop! Ha ha!' };
  clips.gm_ouch_1  = { lang: 'en', text: 'Ouch!' };
  clips.gm_ouch_2  = { lang: 'en', text: 'Bloop!' };
  clips.gm_ouch_3  = { lang: 'en', text: 'Oh no!' };
  clips.gm_give    = { lang: 'en', text: 'OK, OK! You win, Robo-Luca!' };
  clips.rb_win     = { lang: 'en', text: 'Hooray! The Earth is safe!' };
  clips.rb_medals  = { lang: 'en', text: 'Look at your medals!' };
  clips.rb_all_gold  = { lang: 'en', text: 'All gold! Super Robo-Luca!' };
  clips.rb_some_gold = { lang: 'en', text: 'Gold medals! Can you get all gold next time?' };
  clips.rb_no_gold   = { lang: 'en', text: 'Next time, listen first and get a gold medal!' };
  clips.rb_bye     = { lang: 'en', text: 'Thank you, Robo-Luca! See you next time!' };
  // 機甲結局
  clips.cn_alarm = { lang: 'en', text: 'Gloop gloop! I’m back!' };
  clips.cn_go    = { lang: 'en', text: 'Tap, tap, tap! Charge the cannon!' };
  clips.cn_fire  = { lang: 'en', text: 'Robo cannon, fire!' };
  clips.cn_good  = { lang: 'en', text: 'Wow, I’m small now! Can we be friends?' };
  clips.cn_win   = { lang: 'en', text: 'Yes! Friends!' };
  clips.pu_alarm = { lang: 'en', text: 'Gloop! You can’t catch me!' };
  clips.pu_go    = { lang: 'en', text: 'Tap Gloop! Rocket punch!' };
  clips.pu_win   = { lang: 'en', text: 'Bye bye, Gloop! He’s a star now!' };
  clips.pt_alarm = { lang: 'en', text: 'Gloop gloop! I want to fight!' };
  clips.pt_go    = { lang: 'en', text: 'Tap the power cores!' };
  clips.pt_big   = { lang: 'en', text: 'Super Robo mode!' };
  clips.pt_sorry = { lang: 'en', text: 'Wow, so cool! Sorry! Let’s play!' };
  clips.pt_win   = { lang: 'en', text: 'Dance party! Hooray!' };
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
  clips.vol_alarm   = { lang: 'yue', text: '哎呀！火山怪噴火球，好熱呀！' };
  clips.vol_go      = { lang: 'yue', text: '英雄出動！水炮，發射！' };
  clips.vol_cool    = { lang: 'yue', text: '火山冷靜返喇！仲開咗好多花添！' };
  clips.vol_win     = { lang: 'yue', text: '好嘢！城市安全喇！' };
  clips.oct_alarm   = { lang: 'yue', text: '哎呀！大八爪魚捉走咗巴士同私家車！' };
  clips.oct_go      = { lang: 'yue', text: '英雄出動！笑笑光，發射！' };
  clips.oct_laugh   = { lang: 'yue', text: '哈哈哈！好痕呀！還返畀你啦！' };
  clips.oct_win     = { lang: 'yue', text: '巴士同私家車返嚟喇！好嘢！' };
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
  clips.locked_yue  = { lang: 'yue', text: '集齊英雄同Super Rex嘅貼紙，就可以睇秘密短片！' };
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
