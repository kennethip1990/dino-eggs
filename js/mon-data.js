/*
 * Luca 怪獸收集隊：數學內容 + 怪獸名（voices.js / sw.js / tools 都會讀，所以用 self）
 * - nums：今次練嘅數（十至十四；老師話 10+1、10+2 概念要加強）。想練到二十，將 15–20 加入 nums 就得（voices 已有 yue_11–yue_20）
 * - focus：第一下就啱未夠 2 次之前排先
 * - shop：怪獸果子店（砌十幾：一盒十粒 + 散果）；同收集隊共用圖鑑 + 拍檔進度
 * - wild = 收集隊會出嘅 12 隻；wild2 = 果子店會出嘅 12 隻；圖鑑 = 兩邊加埋 24 格
 */
(function (root) {
  root.MON_UNIT = {
    nums: [10, 11, 12, 13, 14],
    focus: [11, 12],
    names: {
      cat: '雷雲貓', bunny: '葉子兔', fish: '泡泡魚', bear: '石頭熊',
      fire: '火花雀', snail: '彩虹蝸牛', star: '星星狗', bat: '月光蝙蝠', penguin: '冰冰企鵝', sheep: '雲朵羊',
      mush: '蘑菇仔', bee: '嗡嗡蜂', turtle: '西瓜龜', deer: '花花鹿', jelly: '果凍水母', dragon: '糖果龍',
      frog: '跳跳蛙', fox: '楓葉狐', panda: '竹子熊貓', whale: '噴泉鯨', crab: '鉗鉗蟹', chick: '蛋殼雞',
      cactus: '仙人掌仔', octo: '八爪魚', pig: '蘋果豬', hedge: '栗子刺蝟', lion: '太陽獅', owl: '夜光貓頭鷹'
    },
    partners: ['cat', 'bunny', 'fish', 'bear'],
    wild: ['fire', 'snail', 'star', 'bat', 'penguin', 'sheep', 'mush', 'bee', 'turtle', 'deer', 'jelly', 'dragon'],
    wild2: ['frog', 'fox', 'panda', 'whale', 'crab', 'chick', 'cactus', 'octo', 'pig', 'hedge', 'lion', 'owl'],
    rare: ['jelly', 'dragon', 'deer', 'lion', 'whale', 'owl'],   // 出現機會細啲
    shop: {
      make: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],   // ① 砌果：客人要幾多粒（20 = 兩盒）
      add: [11, 12, 13, 14, 15, 16, 17, 18, 19],        // ② 十加幾：10 + k = ?
      focus: [11, 12, 13]                                // 老師提嘅 10+1、10+2 排先
    },
    evolveAt: 3,                        // 同一隻拍檔玩夠 3 次就進化（Lv1：光環 + 翼 + 金星）
    evolve2At: 6,                       // 玩夠 6 次再進化（Lv2：彩虹光環 + 皇冠）
    failOdds: 0.2,                      // 捉怪獸有兩成機會走甩（第二次一定捉到；第一局唔會）
    failMax: 2                          // 每局最多走甩 2 次
  };
})(typeof self !== 'undefined' ? self : this);
