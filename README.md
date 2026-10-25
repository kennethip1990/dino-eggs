# 🦕 恐龍搵蛋（Dino Eggs）

一個 app 五個 game（每個 game 3–5 個結局短片 + 貼紙簿 + 秘密短片），開 app 先喺主選單揀：🦖 **恐龍搵蛋**（學數數）、🤖 **英雄裝備站**（學認字）、🦖🦸 **Super Rex 救動物**（學英文）、🐍 **ABC 貪食蛇**（學英文字母）、🎂 **恐龍生日派對**（學認字 + 升小面試練習），後四個見下面。

**恐龍搵蛋：** 幫恐龍媽媽搵蛋：每撳一隻蛋，蛋就飛入巢，遊戲先用廣東話、再用英文讀出數字（「一……one」）。搵齊之後蛋會孵出恐龍 BB，再讀出總數同一句讚佢嘅說話。

- 對象：4 歲、未識字 → 全靠圖像同聲音引導
- 冇計時、冇「錯」、冇廣告、冇外部連結
- 一節 5 局（約 3–5 分鐘），玩完恐龍們會去瞓覺
- 純 HTML / CSS / JS，唔使 build；所有圖都係原創 SVG

---

## 檔案結構

```
index.html              主頁
css/style.css           樣式（橫向 / 直向 layout）
js/voices.js            ★ 所有聲音 key + 句子（改句子改呢度）
js/audio.js             聲音引擎：queue、錄音 → 內置語音 fallback、解鎖
js/game.js              遊戲流程、難度、localStorage、家長區
js/art.js               SVG 圖像
js/version.js           ★ 版本號（每次更新都要 +1）
js/words.js             ★ 英雄認字嘅字表（換單元改呢度）
js/hero.js              英雄裝備站遊戲流程
js/hero-art.js          機械人英雄 SVG
css/hero.css            英雄畫面樣式 + 楷書字體
js/animals.js           ★ Super Rex 嘅英文動物表（換字改呢度）
js/rex.js               Super Rex 遊戲流程
js/rex-art.js           Super Rex + 8 隻動物 SVG
css/rex.css             Super Rex 畫面樣式 + Andika 字體
js/rewards.js           結局輪流 + 貼紙簿 + 秘密短片解鎖
js/endings-art.js       結局短片 SVG（黑雲怪、飛碟、火山怪、八爪魚、龍捲風、隕石、怪獸大王、貼紙）
js/boss.js              秘密短片：英雄 + Super Rex 大戰怪獸大王
css/endings.css         結局短片 + 貼紙簿樣式
js/snake.js             ABC 貪食蛇（canvas 遊戲 + 3 個結局）
js/snake-art.js         貪食蛇主選單卡 + 貼紙 SVG
css/snake.css           貪食蛇畫面
js/family.js            ★ 生日派對嘅字表（單元四：家庭/人物）
js/party.js             恐龍生日派對遊戲流程（開門 / 派嘢 / 坐位 / 合照 / 小記者錄音）
js/party-art.js         派對房間 + 恐龍一家 + 蛋糕 SVG
css/party.css           派對畫面 + 主選單 5 張卡排位
fonts/                  楷書 + Andika 字體（只抽咗用到嘅字）
sw.js                   Service Worker（離線）
manifest.webmanifest    加入主畫面 / 安裝 app
icons/                  App icon
audio/                  錄音檔（初時係空，見下面清單）
tools/list-recordings.js  由 voices.js 印出錄音清單
```

---

## 點樣玩

1. 開始畫面有 3 隻恐龍：**腕龍、暴龍（T-Rex）、三角龍**。撳邊隻，就由嗰隻做恐龍媽媽，同時讀出佢個名（「暴龍……T-Rex」）。呢一下同時會解鎖聲音同開全螢幕；孵出嚟嘅 BB 都係同一種恐龍。上次揀咗邊隻會有黃色框。
2. 恐龍媽媽講「幫我搵返 N 隻蛋呀！Help me find N eggs!」
3. 撳蛋 → 蛋發光 → 輪到佢嗰陣飛入巢，同時讀「一……one」
   - 連續快撳都唔會亂：每隻蛋排隊，數到佢先飛，數字同蛋一定對得上
4. 搵齊 → 孵出恐龍 BB → 「五隻蛋！Five eggs!」+ 讚佢
5. 5 局之後天黑、恐龍瞓覺 →「再玩」掣（🔄）→ 返去揀恐龍

**撳錯位**：唔會有任何負面聲，最多附近嗰隻蛋輕輕搖一搖。靜咗 9 秒，未搵到嘅蛋都會搖一搖做提示。

### 難度規則
- 由 **5 隻蛋**開始，最多 **10 隻**
- 每節第一局係熱身，少一隻蛋
- 同一個數量完成 **2 局**就加一隻
- 例：第 1 節 4,5,5,6,6 → 第 2 節 6,7,7,8,8 → 之後升到 10
- 進度記喺 localStorage（裝咗做 app 同用 Chrome 開係共用同一份）

### 家長區
右上角淡色齒輪，**長按 3 秒**先會開（撳住嗰陣會有個圈慢慢填滿）。入面可以：
- 調整每局蛋數、每節局數（2–10）
- 重設進度
- 睇廣東話 / 英文語音偵測結果
- 試聽任何一句（🎙 = 用緊錄音，🤖 = 用緊內置語音）、「數 1 至 10」測試

開家長區會暫停遊戲；返去之後會重新開始嗰一局。

---

## 🤖 英雄裝備站（學認字）

學校「單元三：身體」嘅 12 個生字。壞蛋偷咗機械人英雄嘅裝備，Luca 要幫佢裝返。

1. 撳主選單嘅機械人
2. **聽字揀卡（6 條）**：英雄講「幫我搵『耳朵』」→ 3 張字卡揀一張 → 啱嘅話張卡飛去英雄身上，嗰個部位裝返
3. 6 個部位裝齊 → 變身
4. **睇字搵部位（3 條）**：畫面出一個字（冇讀出嚟）→ Luca 撳英雄身上嗰個部位 → 啱咗先讀出個字。呢part先係真正自己認字
5. **獎勵短片：英雄打怪獸**（約 20 秒）：搞笑紫色怪獸跳入城市 → 英雄胸口發射愛心炮 → 怪獸越打越細 → 變返可愛、講「對唔住」再跳走 → 英雄勝利。冇閃光；Luca 撳怪獸可以額外發炮
6. 英雄飛走 → 返主選單掣

- 字卡用**楷書**（同學校工作紙一樣），淨係讀廣東話
- 撳錯：張卡 / 部位輕輕搖、再講一次；**錯兩次**正確答案會發光，一定撳得中
- **揀字平均輪流**：12 個字分兩局出晒先再嚟過（每局 6 個），唔會成日出同一批；同一輪入面未熟嘅字排先。考字（睇字搵部位）揀今局入面考得最少嗰 3 個
- focus: true（老師未剔：耳朵、臉、腳、身體、背、樣子）而家只係家長區打 ★，唔再偏心多出
- 每個字對應嘅英雄部位：頭→頭盔、頭髮→閃電頭髮、耳朵→耳機、臉→面罩、眼睛、鼻子、嘴巴、心→胸口心形核心、身體→戰衣、背→披風、腳→火箭靴、樣子→鏡

**家長區**有「▶ 睇打怪獸短片」可以單獨預覽段片，同埋「英雄認字記錄」：每個字「第一下就啱 / 次數」，分「聽字揀卡」同「睇字搵位」。填工作紙「家長評估」可以參考「睇字搵位」嗰欄。

### 換下一個單元
- 改 `js/words.js`（字、對應部位、focus）
- 新字要加入楷書字體（字體檔只有用到嘅字）、而如果新單元唔係身體，英雄部位要重新設計 → 叫 Claude 做會最快
- 加新字（字體）：將 `words.js` + `family.js` 全部字（再加「大人生日快樂」）放入 Google Fonts `css2?family=LXGW+WenKai+TC:wght@700&text=…`，下載 CSS 入面嗰個 woff2 覆蓋 `fonts/wenkai-subset.woff2`
- 改完記得 `js/version.js` +1

## 🦖🦸 Super Rex 救動物（學英文，全英文）

跟 Yorkland Tutorial 工作紙：dog、cat、cow、pig、frog、duck、hen、fish，同埋 two legs / four legs。調皮怪獸將農場動物困咗喺泡泡入面，Super Rex（戴眼罩、披紅色披風嘅暴龍）同 Luca 一齊救佢哋。

1. Super Rex 飛入嚟：「Super Rex to the rescue! Hi Luca!…」
2. **聽音撳泡泡（4 條）**：「Where's the duck?」→ 3 個泡泡揀一個 → Super Rex 吼一聲、泡泡爆開 → 動物叫「Quack quack!」再讀「Duck!」→ 跑去下面農場
3. **睇字撳泡泡（3 條）**：出英文字牌（例如 `cow`，冇讀出嚟）→ 撳啱嗰隻動物。呢 part 就係工作紙「Look, read and match」
4. **數腳（4 條）**：動物由農場行出嚟 →「Two legs or four legs?」→ 撳「2」定「4」圍欄 → 每隻腳逐隻發光、讀「one, two, three, four… Four legs!」→ 動物入圍欄。最少一隻兩隻腳（duck / hen）。fish 冇腳，唔會出
5. **獎勵短片**（約 20 秒）：怪獸返嚟 → Super Rex 大吼三下 → 怪獸越嚟越細、變乖、講「Sorry!」跳走 → 農場動物一齊跳
6. Super Rex 飛走 → 返主選單掣

- 一節約 3–4 分鐘；撳錯唔罰：泡泡搖一搖、嗰隻動物叫一聲（順便學埋佢係咩），再問一次；錯兩次啱嗰個會發光
- 數腳撳錯：Super Rex 會帶住一齊數一次，之後啱嗰個圍欄發光
- 字牌用 Andika 字體（專為初學閱讀設計，`a` `g` 同學校寫法一樣）
- 未熟嘅動物出多啲

**家長區**有「▶ 睇 Super Rex 短片」同「Super Rex 英文記錄」：每隻動物「第一下就啱 / 次數」，分「聽音撳圖」、「睇字撳圖」、「數腳」。

### 換英文字
- 改 `js/animals.js`。新動物要畫 SVG（`js/rex-art.js`），新字母要加入 Andika 字體 → 叫 Claude 做會最快
- 改完記得 `js/version.js` +1



## 🐍 ABC 貪食蛇（學英文字母，全英文）

蛇仔 Sunny 好肚餓，要**跟次序**食字母：A → B → C → D → E，下一局 F → J，之後 K–O、P–T、U–Z，玩完再由 A 開始。

- **操控**：手指撳住 / 拖 = 蛇仔跟住手指行；放手就直行，撞牆會彈返。**唔會死**，冇時間限制
- 上面有一條字母帶，而家要食嗰個會閃黃色；食咗嘅變色
- 食啱：「A!」+ 字母變成蛇仔身上嘅花紋 → 「Find B」
- 撞錯：字母彈開 + 讀佢個名（「D」）+ 再講「Find B」；錯兩次或者 12 秒冇進展 → 啱嗰個發光
- 行到啱嗰個字母附近會自動轉過去（磁石），細路仔手指唔使好準
- 食晒 → 蛇仔繞圈，逐粒字母發光一齊讀「A, B, C, D, E」→ 結局短片 + 貼紙
- 結局：💗 蛇仔畫一個大心心 / 🐉 食魔法星變金色飛龍 / 👾 字母炮打紫色怪獸
- **家長區「ABC 貪食蛇」**：揀下一局由邊組開始、字款（大楷 ABC / 細楷 abc / 大細楷配對 Aa = 上面大楷、要食細楷）、睇邊啲字母最常撞錯
- 貪食蛇貼紙唔計入秘密短片（仍然係英雄 + Super Rex 6 張）
- 開發測試：`#demo=snakeplay`（玩）、`#demo=snakeauto`（自動行）、`#demo=snake:heart`（`dragon` / `monster`）

---

## 🎂 恐龍生日派對（單元四：家庭/人物 + 升小面試練習，廣東話）

今日係小暴龍生日，Luca 幫手招呼客人。學校「單元四：家庭/人物」嘅 14 個生詞，再加升小面試常考嘅：聽指令、打招呼、介紹屋企人。一局大約 4–5 分鐘：

1. **開門迎客（4 位客人）**：叮噹一聲，門打開見到客人 →「係邊個嚟咗呀？」→ 3 張字卡揀一張 → 字卡變成客人個名牌。之後小暴龍示範「爺爺好！」，對話泡出現，等 Luca 跟住講，客人回應「你好有禮貌呀！」
2. **派嘢食（聽指令）**：上面托盤有蛋糕、汽水、氣球。第 1 條係一步（「攞蛋糕畀爺爺」），之後兩條係兩步（「先攞汽水畀妹妹，再攞氣球畀舅舅」）。**指令講完先拎得**（托盤會變淡），練「聽清楚先做」。拖去個人度，或者撳一下托盤再撳人都得
3. **坐位分類（淨係睇字）**：大人枱 / 小朋友枱。上面出一張字卡（冇圖、冇讀出嚟）→ Luca 拖去（或撳）啱嗰張枱 → 嗰個人坐低、讀出個字。錯一次張卡會出埋個樣做提示；錯兩次啱嗰張枱會發光
4. **家人大合照**：大家排隊，「家人」字卡做標題 →「三、二、一，茄子！」（冇閃光，相框輕輕變白邊）
5. **小記者**：小暴龍問一條面試常見題，4 條輪流：屋企有咩人 / 最鍾意同邊個玩 / 叫咩名幾多歲 / 生日想要咩禮物（點解）。每條都會示範一句答法 → Luca 撳個咪講（最多 10 秒，再撳一下就停）→ 即刻播返佢把聲 →「講得好好呀！」
6. 結局短片 + 貼紙 → 拜拜

- **揀字平均輪流**：12 個「人」嘅字，每局用 8 個（開門 4 + 坐位 4），一輪出晒先再嚟過；同一輪入面未熟嘅字排先。「家人」、「小朋友」每局都會出（合照標題 / 小朋友枱）
- **爸爸 = 父親、媽媽 = 母親**：同一個角色。出到「父親」/「母親」會講「父親即係爸爸！」
- 角色：爺爺（白鬚、眼鏡、拐杖）、爸爸（呔）、媽媽（蝴蝶結、頸鏈）、叔叔（紅帽、鬚）、舅舅（太陽眼鏡、煲呔）、老師（髻、眼鏡、書）、哥哥（頭帶、星星衫）、弟弟（口水肩）、妹妹（孖辮）、同學（書包、校帽）。大人大隻，小朋友細隻，坐位分類都有提示作用
- **錄音私隱**：小記者錄音**淨係存喺嗰部 tablet**（瀏覽器 IndexedDB），最多留 12 段，唔會上載。第一次用 Chrome 會問可唔可以用咪，要撳「允許」；唔畀用 / 公司 tablet 封咗個咪都照玩到，會改做「講俾爸爸媽媽聽，講完撳一下」
- 唔會做語音辨識（廣東話辨識唔準），講咩都讚；家長區可以重聽
- 結局：👾 怪獸偷蛋糕 → 彩帶炮 ×3 → 怪獸講對唔住一齊食 / 🎈 氣球拉咗小暴龍上天 → Luca 撳爆氣球慢慢降落 / 🕯 吹蠟燭（對住咪吹，或者撳蠟燭）→ 生日歌 + 彩紙
- **家長區「生日派對」**：每個字「開門認人 / 坐位分類 / 派嘢指令」第一下就啱嘅次數；「坐位分類」淨係睇字，填工作紙「家長評估」可以參考呢欄。下面有小記者錄音（▶ 重聽、刪除全部）
- 派對貼紙唔計入秘密短片
- 開發測試：`#demo=partyplay`（由頭玩）、`#demo=partyplay:3`（由坐位開始）、`#demo=party:balloon`（`monster` / `candle`）

---

## 🎬 結局短片 + 貼紙簿

每個 game 有 3 個唔同結局（英雄裝備站有 5 個），等 Luca 有動力玩多幾次：

| Game | 結局 1 | 結局 2 | 結局 3 | 結局 4 | 結局 5 |
|---|---|---|---|---|---|
| 🦖 恐龍搵蛋 | 🌈 彩虹恐龍BB | 👑 金色恐龍BB | ✨ 星星恐龍BB |
| 🤖 英雄裝備站 | 紫色怪獸（愛心炮） | ☁️ 黑雲怪落大雨 → 太陽光 → 白雲 + 彩虹 | 🛸 外星人吸走大廈 → 磁力手拉返落嚟 → 外星人拜拜 | 🌋 火山怪噴火球 → 水炮 ×3 → 火山冷靜、開滿花 | 🐙 大八爪魚捉走巴士同私家車 → 笑笑光 ×3 → 痕到放手、揮手游走 |
| 🦖🦸 Super Rex | 紫色怪獸（大吼） | 🌪️ 龍捲風吹起動物 → 擰尾 → 動物「boing」跌返落嚟 | ☄️ 大隕石 → Super Rex 跳上去頂爆 → 變星星 |
| 🐍 ABC 貪食蛇 | 💗 畫大心心 | 🐉 金色飛龍 | 👾 字母炮打怪獸 |
| 🎂 生日派對 | 👾 怪獸偷蛋糕 | 🎈 氣球飛上天 | 🕯 吹蠟燭 + 生日歌 |

- 恐龍搵蛋：一節完咗會出一隻金色大蛋，搖三下孵出特別恐龍BB，之後佢會喺巢中間一齊瞓覺
- **次序**：未睇過嘅結局跟次序先出（保證全部睇到；新加嘅結局下一次就會出），之後隨機（唔會連續同一個）
- **貼紙簿**：主選單每張卡下面每個結局一格，未攞到係「?」。睇完一個新結局 → 大貼紙彈出嚟 +「你攞到一張新貼紙！」。撳已攞到嘅貼紙 = 再睇嗰段短片
- **秘密短片**：英雄 + Super Rex 6 張貼紙集齊，主選單頂部嘅怪獸大王掣解鎖 → 機械人英雄同 Super Rex 合體大戰怪獸大王（約 30 秒，廣東話 + 英文）。未解鎖撳落去會講「集齊六張…就可以睇」
- 冇閃光；短片入面撳壞蛋可以額外攻擊（純粹好玩）
- **家長區「短片同貼紙簿」**：睇每個 game 集咗幾多張、揀任何一段短片預覽（唔計貼紙）、重設貼紙簿
- 開發測試：網址加 `#demo=hero:cloud`（或 `rex:meteor`、`dino:gold`、`boss:`）直接播嗰段

---

## 本機試玩（電腦）

```bash
cd C:\LucaDinoEggs
python -m http.server 8765
```
然後用 Chrome 開 `http://localhost:8765`。

- 喺 localhost 為咗方便改 code，**Service Worker 預設唔開**；想測離線就開 `http://localhost:8765/?sw=1`
- Tablet 用同一個 WiFi 開 `http://<電腦IP>:8765` 都玩到，但係**唔可以離線、唔可以安裝**（因為唔係 HTTPS），而且電腦要一直開住 → 所以正式用請部署去 GitHub Pages

---

## 部署去 GitHub Pages（免費，有 HTTPS）

> 建議 repo 名用 `dino-eggs`，**唔好用 Luca 個名**，因為 public repo 嘅網址同內容人人都睇到。

1. 去 https://github.com/new 開一個新 repo：名 `dino-eggs`、揀 **Public**（免費 Pages 一定要 public）、**唔好**剔「Add a README」
2. 喺電腦：
   ```bash
   cd C:\LucaDinoEggs
   git remote add origin https://github.com/<你嘅username>/dino-eggs.git
   git branch -M main
   git push -u origin main
   ```
3. Repo 頁面 → **Settings → Pages** → Source 揀「Deploy from a branch」→ Branch 揀 `main`、folder 揀 `/ (root)` → Save
4. 等 1–2 分鐘，網址會係 `https://<你嘅username>.github.io/dino-eggs/`

### 更新（例如加咗錄音）
1. 將 mp3 放入 `audio/`
2. **將 `js/version.js` 個數字 +1**（例如 `'1'` → `'2'`）← 唔改嘅話 tablet 會一直用舊 cache
3. ```bash
   git add -A
   git commit -m "Add recordings"
   git push
   ```
4. Tablet 有網開 app 就會自動用新版（程式檔係 network-first）；錄音要 version +1 先會重新 cache

---

## 裝去 Samsung tablet

1. 用 **Chrome** 開 `https://<你嘅username>.github.io/dino-eggs/`
2. 右上角 ⋮ → **「加至主畫面」/「安裝應用程式」** → 安裝
3. 喺主畫面開「恐龍搵蛋」→ 會係全螢幕
4. **連住網開一次**，等佢 cache 好；之後冇網都玩到

### 防止小朋友撳走（強烈建議）
遊戲已經攔住 back 掣，但 Home 鍵同手勢 web app 係攔唔到嘅。用 Android 內置嘅 **「固定應用程式」（App pinning）**：
1. 設定 → 安全性與私隱（或「生物識別和安全性」）→ 其他安全性設定 → **固定應用程式** → 開啟（建議同時開「取消固定前要求解鎖」）
2. 開咗遊戲之後 → 撳「最近使用的應用程式」掣 → 撳遊戲上面個 icon → **固定此應用程式**
3. 取消固定：同時長按「返回」+「最近使用」

（每部機嘅選單名稱可能有少少唔同，跟住意思搵就得。）

### 廣東話語音（未錄音之前好重要）
未有錄音嘅句子會用 tablet 內置語音讀。冇廣東話語音嘅話，中文可能會用普通話讀、讀錯，甚至唔出聲。

1. 設定 → 一般管理 → 語言（或「語言和輸入」）→ **文字轉語音**
2. 偏好的引擎揀 **Google 語音服務**（Samsung 自己個引擎未必有廣東話）
3. 撳 Google 隔籬嘅齒輪 → **安裝語音數據** → 揀 **中文（香港）/ 粵語** → 下載
4. 完全關閉遊戲 / Chrome 再開
5. 家長區見到「廣東話語音：✅ …」就得

> ⚠️ 公司 tablet：如果部機有 MDM / IT 限制，可能裝唔到語音數據或者開唔到固定應用程式。最穩陣嘅做法係自己錄音（見下面），錄晒之後就完全唔使靠內置語音。

---

## 錄音清單（298 個檔）

放喺 `audio/` folder，**檔名要一模一樣**（細楷、底線、`.mp3`）。唔使一次錄晒，錄咗邊個就用邊個，未錄嘅照用內置語音。

### 錄音 tips
- 用手機內置錄音 app 就得，安靜房間、離咪 20–30cm
- 語氣：溫柔、開心、慢少少，好似同 Luca 玩緊咁
- **頭尾唔好留空白**（剪走前後靜音，否則句子之間會有長停頓）
- 每句一個檔；數字只讀個字（「三」「three」），唔好讀「三隻」
- 轉做 mp3（mono、64–128kbps 已經足夠）。可以用免費嘅 Audacity：匯入 → 剪頭尾 → 檔案 → 匯出 → MP3
- 數數用「一、**二**、三」；講數量用「**兩**隻蛋」（已經寫喺清單入面）
- 廣東話同英文可以分開兩個人錄（例如爸爸讀廣東話、媽媽讀英文）
- 錄完喺家長區揀嗰句試聽，🎙 就代表用緊錄音
- Super Rex 嗰啲全部英文；動物叫聲（`snd_*`）用把聲扮就得，好玩為主
- 想改句子：改 `js/voices.js`，再行 `node tools/list-recordings.js` 印出新清單

**數數（撳蛋時）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_1.mp3` | 廣東話 | 一 |
| `en_1.mp3` | English | one |
| `yue_2.mp3` | 廣東話 | 二 |
| `en_2.mp3` | English | two |
| `yue_3.mp3` | 廣東話 | 三 |
| `en_3.mp3` | English | three |
| `yue_4.mp3` | 廣東話 | 四 |
| `en_4.mp3` | English | four |
| `yue_5.mp3` | 廣東話 | 五 |
| `en_5.mp3` | English | five |
| `yue_6.mp3` | 廣東話 | 六 |
| `en_6.mp3` | English | six |
| `yue_7.mp3` | 廣東話 | 七 |
| `en_7.mp3` | English | seven |
| `yue_8.mp3` | 廣東話 | 八 |
| `en_8.mp3` | English | eight |
| `yue_9.mp3` | 廣東話 | 九 |
| `en_9.mp3` | English | nine |
| `yue_10.mp3` | 廣東話 | 十 |
| `en_10.mp3` | English | ten |

**開場（每局開始）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_intro_1.mp3` | 廣東話 | 幫我搵返一隻蛋呀！ |
| `en_intro_1.mp3` | English | Help me find one egg! |
| `yue_intro_2.mp3` | 廣東話 | 幫我搵返兩隻蛋呀！ |
| `en_intro_2.mp3` | English | Help me find two eggs! |
| `yue_intro_3.mp3` | 廣東話 | 幫我搵返三隻蛋呀！ |
| `en_intro_3.mp3` | English | Help me find three eggs! |
| `yue_intro_4.mp3` | 廣東話 | 幫我搵返四隻蛋呀！ |
| `en_intro_4.mp3` | English | Help me find four eggs! |
| `yue_intro_5.mp3` | 廣東話 | 幫我搵返五隻蛋呀！ |
| `en_intro_5.mp3` | English | Help me find five eggs! |
| `yue_intro_6.mp3` | 廣東話 | 幫我搵返六隻蛋呀！ |
| `en_intro_6.mp3` | English | Help me find six eggs! |
| `yue_intro_7.mp3` | 廣東話 | 幫我搵返七隻蛋呀！ |
| `en_intro_7.mp3` | English | Help me find seven eggs! |
| `yue_intro_8.mp3` | 廣東話 | 幫我搵返八隻蛋呀！ |
| `en_intro_8.mp3` | English | Help me find eight eggs! |
| `yue_intro_9.mp3` | 廣東話 | 幫我搵返九隻蛋呀！ |
| `en_intro_9.mp3` | English | Help me find nine eggs! |
| `yue_intro_10.mp3` | 廣東話 | 幫我搵返十隻蛋呀！ |
| `en_intro_10.mp3` | English | Help me find ten eggs! |

**總數（慶祝時）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_total_1.mp3` | 廣東話 | 一隻蛋！ |
| `en_total_1.mp3` | English | One egg! |
| `yue_total_2.mp3` | 廣東話 | 兩隻蛋！ |
| `en_total_2.mp3` | English | Two eggs! |
| `yue_total_3.mp3` | 廣東話 | 三隻蛋！ |
| `en_total_3.mp3` | English | Three eggs! |
| `yue_total_4.mp3` | 廣東話 | 四隻蛋！ |
| `en_total_4.mp3` | English | Four eggs! |
| `yue_total_5.mp3` | 廣東話 | 五隻蛋！ |
| `en_total_5.mp3` | English | Five eggs! |
| `yue_total_6.mp3` | 廣東話 | 六隻蛋！ |
| `en_total_6.mp3` | English | Six eggs! |
| `yue_total_7.mp3` | 廣東話 | 七隻蛋！ |
| `en_total_7.mp3` | English | Seven eggs! |
| `yue_total_8.mp3` | 廣東話 | 八隻蛋！ |
| `en_total_8.mp3` | English | Eight eggs! |
| `yue_total_9.mp3` | 廣東話 | 九隻蛋！ |
| `en_total_9.mp3` | English | Nine eggs! |
| `yue_total_10.mp3` | 廣東話 | 十隻蛋！ |
| `en_total_10.mp3` | English | Ten eggs! |

**讚賞（隨機一句）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `praise_1.mp3` | 廣東話 | 好叻呀！ |
| `praise_2.mp3` | 廣東話 | 多謝你幫我搵返啲蛋！ |
| `praise_3.mp3` | English | Great job! |
| `praise_4.mp3` | English | You did it! |

**恐龍名（揀恐龍時）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_dino_trice.mp3` | 廣東話 | 三角龍 |
| `yue_dino_trex.mp3` | 廣東話 | 暴龍 |
| `yue_dino_brachio.mp3` | 廣東話 | 腕龍 |
| `en_dino_brachio.mp3` | English | Brachiosaurus |
| `en_dino_trex.mp3` | English | T-Rex |
| `en_dino_trice.mp3` | English | Triceratops |

**結束（瞓覺）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_bye.mp3` | 廣東話 | 恐龍BB要瞓覺喇，拜拜！ |
| `en_bye.mp3` | English | Good night, little dinos! |

**英雄認字：生字**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `word_heart.mp3` | 廣東話 | 心 |
| `word_head.mp3` | 廣東話 | 頭 |
| `word_eyes.mp3` | 廣東話 | 眼睛 |
| `word_ears.mp3` | 廣東話 | 耳朵 |
| `word_face.mp3` | 廣東話 | 臉 |
| `word_nose.mp3` | 廣東話 | 鼻子 |
| `word_mouth.mp3` | 廣東話 | 嘴巴 |
| `word_hair.mp3` | 廣東話 | 頭髮 |
| `word_feet.mp3` | 廣東話 | 腳 |
| `word_body.mp3` | 廣東話 | 身體 |
| `word_back.mp3` | 廣東話 | 背 |
| `word_looks.mp3` | 廣東話 | 樣子 |

**英雄認字：句子**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `hero_hi.mp3` | 廣東話 | 我係機械人英雄！壞蛋偷咗我啲裝備，幫我搵返啦！ |
| `hero_find.mp3` | 廣東話 | 幫我搵 |
| `hero_where.mp3` | 廣東話 | 呢個字喺我身上邊度呀？ |
| `hero_power.mp3` | 廣東話 | 裝備齊晒，變身！ |
| `hero_test.mp3` | 廣東話 | 而家考吓你！ |
| `hero_bye.mp3` | 廣東話 | 多謝你幫我！英雄要去救人喇，拜拜！ |
| `hero_yes_1.mp3` | 廣東話 | 啱喇！ |
| `hero_yes_2.mp3` | 廣東話 | 好叻呀！ |
| `hero_yes_3.mp3` | 廣東話 | 好犀利！ |

**英雄打怪獸短片**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `battle_alarm.mp3` | 廣東話 | 哎呀！有怪獸嚟搞亂個城市！ |
| `battle_go.mp3` | 廣東話 | 英雄出動！愛心炮，發射！ |
| `battle_sorry.mp3` | 廣東話 | 對唔住呀，我唔再搞亂喇！ |
| `battle_win.mp3` | 廣東話 | 打敗怪獸喇！好嘢！ |

**生日派對：生字**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `fam_baba.mp3` | 廣東話 | 爸爸 |
| `fam_fuqin.mp3` | 廣東話 | 父親 |
| `fam_mama.mp3` | 廣東話 | 媽媽 |
| `fam_muqin.mp3` | 廣東話 | 母親 |
| `fam_yeye.mp3` | 廣東話 | 爺爺 |
| `fam_shushu.mp3` | 廣東話 | 叔叔 |
| `fam_jiujiu.mp3` | 廣東話 | 舅舅 |
| `fam_laoshi.mp3` | 廣東話 | 老師 |
| `fam_gege.mp3` | 廣東話 | 哥哥 |
| `fam_didi.mp3` | 廣東話 | 弟弟 |
| `fam_meimei.mp3` | 廣東話 | 妹妹 |
| `fam_tongxue.mp3` | 廣東話 | 同學 |
| `fam_jiaren.mp3` | 廣東話 | 家人 |
| `fam_kids.mp3` | 廣東話 | 小朋友 |
| `fam_adult.mp3` | 廣東話 | 大人 |

**生日派對：打招呼**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `greet_baba.mp3` | 廣東話 | 爸爸好！ |
| `greet_fuqin.mp3` | 廣東話 | 父親好！ |
| `greet_mama.mp3` | 廣東話 | 媽媽好！ |
| `greet_muqin.mp3` | 廣東話 | 母親好！ |
| `greet_yeye.mp3` | 廣東話 | 爺爺好！ |
| `greet_shushu.mp3` | 廣東話 | 叔叔好！ |
| `greet_jiujiu.mp3` | 廣東話 | 舅舅好！ |
| `greet_laoshi.mp3` | 廣東話 | 老師好！ |
| `greet_gege.mp3` | 廣東話 | 哥哥好！ |
| `greet_didi.mp3` | 廣東話 | 弟弟好！ |
| `greet_meimei.mp3` | 廣東話 | 妹妹好！ |
| `greet_tongxue.mp3` | 廣東話 | 同學好！ |

**生日派對：句子**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `pty_hi.mp3` | 廣東話 | 今日係小暴龍生日！Luca，幫手招呼客人啦！ |
| `pty_who.mp3` | 廣東話 | 係邊個嚟咗呀？ |
| `pty_greet.mp3` | 廣東話 | 同佢打招呼，講： |
| `pty_reply.mp3` | 廣東話 | 你好呀！你好有禮貌呀！ |
| `pty_give.mp3` | 廣東話 | 而家幫手派嘢食！聽清楚先好拎呀！ |
| `pty_again.mp3` | 廣東話 | 再聽多次： |
| `pty_thanks.mp3` | 廣東話 | 多謝你！ |
| `pty_sit.mp3` | 廣東話 | 大人坐呢邊，小朋友坐嗰邊。 |
| `pty_sit_q.mp3` | 廣東話 | 睇吓張咭，佢坐邊度呀？ |
| `pty_is_adult.mp3` | 廣東話 | 係大人！ |
| `pty_is_kid.mp3` | 廣東話 | 係小朋友！ |
| `syn_fuqin.mp3` | 廣東話 | 父親即係爸爸！ |
| `syn_muqin.mp3` | 廣東話 | 母親即係媽媽！ |
| `pty_photo.mp3` | 廣東話 | 大家埋位，影張家人大合照！ |
| `pty_cheese.mp3` | 廣東話 | 三、二、一，茄子！ |
| `pty_photo_ok.mp3` | 廣東話 | 好靚呀！ |
| `pty_bye.mp3` | 廣東話 | 多謝你幫手！今日好開心呀！拜拜！ |
| `pty_yes_1.mp3` | 廣東話 | 啱喇！ |
| `pty_yes_2.mp3` | 廣東話 | 好叻呀！ |
| `pty_yes_3.mp3` | 廣東話 | 好犀利！ |

**生日派對：派嘢（後面接名）**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `give_cake.mp3` | 廣東話 | 攞蛋糕畀 |
| `first_cake.mp3` | 廣東話 | 先攞蛋糕畀 |
| `then_cake.mp3` | 廣東話 | 再攞蛋糕畀 |
| `give_drink.mp3` | 廣東話 | 攞汽水畀 |
| `first_drink.mp3` | 廣東話 | 先攞汽水畀 |
| `then_drink.mp3` | 廣東話 | 再攞汽水畀 |
| `give_balloon.mp3` | 廣東話 | 攞氣球畀 |
| `first_balloon.mp3` | 廣東話 | 先攞氣球畀 |
| `then_balloon.mp3` | 廣東話 | 再攞氣球畀 |

**生日派對：小記者問題**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `q_family.mp3` | 廣東話 | Luca，你屋企有咩人呀？ |
| `hint_family.mp3` | 廣東話 | 你可以咁講：我屋企有爸爸、媽媽…… |
| `q_play.mp3` | 廣東話 | 你最鍾意同屋企邊個玩呀？玩咩呀？ |
| `hint_play.mp3` | 廣東話 | 你可以咁講：我最鍾意同爺爺玩恐龍。 |
| `q_name.mp3` | 廣東話 | 你叫咩名呀？今年幾多歲呀？ |
| `hint_name.mp3` | 廣東話 | 你可以咁講：我叫Luca，今年四歲。 |
| `q_gift.mp3` | 廣東話 | 你生日想要咩禮物呀？點解呀？ |
| `hint_gift.mp3` | 廣東話 | 你可以咁講：我想要恐龍，因為我好鍾意恐龍。 |
| `mic_tap.mp3` | 廣東話 | 撳個咪，講俾我聽！ |
| `mic_listen.mp3` | 廣東話 | 我聽吓你講咩…… |
| `mic_great.mp3` | 廣東話 | 講得好好呀！好叻！ |
| `mic_none.mp3` | 廣東話 | 講俾爸爸媽媽聽啦！講完撳一下個咪。 |

**生日派對結局**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `pm_alarm.mp3` | 廣東話 | 哎呀！怪獸偷咗個蛋糕！ |
| `pm_go.mp3` | 廣東話 | 彩帶炮，發射！ |
| `pm_sorry.mp3` | 廣東話 | 對唔住呀！我都好想食蛋糕！ |
| `pm_win.mp3` | 廣東話 | 唔緊要！大家一齊食啦！ |
| `pb_alarm.mp3` | 廣東話 | 嘩！氣球拉咗小暴龍上天！ |
| `pb_go.mp3` | 廣東話 | Luca，快啲撳爆啲氣球！ |
| `pb_win.mp3` | 廣東話 | 安全降落！好嘢！ |
| `pc_wish.mp3` | 廣東話 | 許個願，吹蠟燭啦！ |
| `pc_blow.mp3` | 廣東話 | 用力吹！或者撳蠟燭都得！ |
| `pc_win.mp3` | 廣東話 | 生日快樂！ |

**Super Rex：動物名**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `an_dog.mp3` | English | Dog! |
| `an_cat.mp3` | English | Cat! |
| `an_cow.mp3` | English | Cow! |
| `an_pig.mp3` | English | Pig! |
| `an_frog.mp3` | English | Frog! |
| `an_duck.mp3` | English | Duck! |
| `an_hen.mp3` | English | Hen! |
| `an_fish.mp3` | English | Fish! |

**Super Rex：叫聲**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `snd_dog.mp3` | English | Woof woof! |
| `snd_cat.mp3` | English | Meow! |
| `snd_cow.mp3` | English | Moo! |
| `snd_pig.mp3` | English | Oink oink! |
| `snd_frog.mp3` | English | Ribbit! |
| `snd_duck.mp3` | English | Quack quack! |
| `snd_hen.mp3` | English | Cluck cluck! |
| `snd_fish.mp3` | English | Blub blub! |

**Super Rex：問題**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `rex_where_dog.mp3` | English | Where’s the dog? |
| `rex_where_cat.mp3` | English | Where’s the cat? |
| `rex_where_cow.mp3` | English | Where’s the cow? |
| `rex_where_pig.mp3` | English | Where’s the pig? |
| `rex_where_frog.mp3` | English | Where’s the frog? |
| `rex_where_duck.mp3` | English | Where’s the duck? |
| `rex_where_hen.mp3` | English | Where’s the hen? |
| `rex_where_fish.mp3` | English | Where’s the fish? |

**Super Rex：句子**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `rex_hi.mp3` | English | Super Rex to the rescue! |
| `rex_intro.mp3` | English | Hi Luca! A naughty monster trapped the animals in bubbles. Let’s save them! |
| `rex_read.mp3` | English | Now let’s read! |
| `rex_read_q.mp3` | English | What does it say? |
| `rex_legs.mp3` | English | Let’s count legs! |
| `rex_legs_q.mp3` | English | Two legs or four legs? |
| `rex_count.mp3` | English | Let’s count! |
| `rex_bye.mp3` | English | Thank you, Luca! See you next time! |
| `rex_yes_1.mp3` | English | Yes! |
| `rex_yes_2.mp3` | English | Well done! |
| `legs_2.mp3` | English | Two legs! |
| `rex_yes_3.mp3` | English | Great job, Luca! |
| `legs_4.mp3` | English | Four legs! |

**Super Rex 打怪獸短片**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `rbat_alarm.mp3` | English | Oh no! The monster is back! |
| `rbat_go.mp3` | English | Super Rex, big roar! |
| `rbat_sorry.mp3` | English | Sorry! I’ll be nice now. |
| `rbat_win.mp3` | English | Hooray! Super Rex saves the day! |

**英雄結局：黑雲怪 / 外星人 / 火山怪 / 八爪魚**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `cloud_alarm.mp3` | 廣東話 | 哎呀！黑雲怪落大雨，個城市濕晒！ |
| `cloud_go.mp3` | 廣東話 | 英雄出動！太陽光，發射！ |
| `cloud_happy.mp3` | 廣東話 | 黑雲變白雲！仲有彩虹添！ |
| `cloud_win.mp3` | 廣東話 | 好嘢！天晴喇！ |
| `ufo_alarm.mp3` | 廣東話 | 哎呀！外星人用飛碟吸走大廈！ |
| `ufo_go.mp3` | 廣東話 | 英雄出動！磁力手，拉返落嚟！ |
| `ufo_bye.mp3` | 廣東話 | 對唔住呀，我玩吓啫！拜拜！ |
| `ufo_win.mp3` | 廣東話 | 大廈返嚟喇！好嘢！ |
| `vol_alarm.mp3` | 廣東話 | 哎呀！火山怪噴火球，好熱呀！ |
| `vol_go.mp3` | 廣東話 | 英雄出動！水炮，發射！ |
| `vol_cool.mp3` | 廣東話 | 火山冷靜返喇！仲開咗好多花添！ |
| `vol_win.mp3` | 廣東話 | 好嘢！城市安全喇！ |
| `oct_alarm.mp3` | 廣東話 | 哎呀！大八爪魚捉走咗巴士同私家車！ |
| `oct_go.mp3` | 廣東話 | 英雄出動！笑笑光，發射！ |
| `oct_laugh.mp3` | 廣東話 | 哈哈哈！好痕呀！還返畀你啦！ |
| `oct_win.mp3` | 廣東話 | 巴士同私家車返嚟喇！好嘢！ |

**Super Rex 結局：龍捲風 / 隕石**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `torn_alarm.mp3` | English | Oh no! A big tornado! |
| `torn_go.mp3` | English | Super Rex, tail spin! |
| `torn_safe.mp3` | English | Boing! Boing! Everyone is safe! |
| `met_alarm.mp3` | English | Oh no! A big rock from space! |
| `met_go.mp3` | English | Super Rex, jump! |
| `met_stars.mp3` | English | Wow! Shooting stars! |

**恐龍搵蛋：特別恐龍BB**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `yue_sp_star.mp3` | 廣東話 | 係星星恐龍BB！ |
| `yue_sp_gold.mp3` | 廣東話 | 係金色恐龍BB！ |
| `yue_sp_rainbow.mp3` | 廣東話 | 係彩虹恐龍BB！ |
| `yue_special.mp3` | 廣東話 | 咦？有隻特別嘅蛋！ |
| `en_special.mp3` | English | A special egg! |
| `en_sp_rainbow.mp3` | English | A rainbow baby dino! |
| `en_sp_gold.mp3` | English | A golden baby dino! |
| `en_sp_star.mp3` | English | A starry baby dino! |

**ABC 貪食蛇：字母**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `ltr_a.mp3` | English | A |
| `ltr_b.mp3` | English | B |
| `ltr_c.mp3` | English | C |
| `ltr_d.mp3` | English | D |
| `ltr_e.mp3` | English | E |
| `ltr_f.mp3` | English | F |
| `ltr_g.mp3` | English | G |
| `ltr_h.mp3` | English | H |
| `ltr_i.mp3` | English | I |
| `ltr_j.mp3` | English | J |
| `ltr_k.mp3` | English | K |
| `ltr_l.mp3` | English | L |
| `ltr_m.mp3` | English | M |
| `ltr_n.mp3` | English | N |
| `ltr_o.mp3` | English | O |
| `ltr_p.mp3` | English | P |
| `ltr_q.mp3` | English | Q |
| `ltr_r.mp3` | English | R |
| `ltr_s.mp3` | English | S |
| `ltr_t.mp3` | English | T |
| `ltr_u.mp3` | English | U |
| `ltr_v.mp3` | English | V |
| `ltr_w.mp3` | English | W |
| `ltr_x.mp3` | English | X |
| `ltr_y.mp3` | English | Y |
| `ltr_z.mp3` | English | Z |

**ABC 貪食蛇：句子 + 結局**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `snk_hi.mp3` | English | Hi Luca! I’m Sunny the snake. I’m so hungry! |
| `snk_intro.mp3` | English | Let’s eat the letters in order! |
| `snk_find.mp3` | English | Find |
| `snk_sing.mp3` | English | Look at my letters! Let’s read them! |
| `snk_done.mp3` | English | Well done, Luca! My tummy is full! |
| `snk_yum_1.mp3` | English | Yum! |
| `snk_heart_1.mp3` | English | I can draw a picture! |
| `snk_drg_1.mp3` | English | Wow! A magic star! |
| `snk_mon_1.mp3` | English | Oh no! The monster wants my letters! |
| `snk_yum_2.mp3` | English | Yummy! |
| `snk_heart_2.mp3` | English | A big heart! I love letters! |
| `snk_drg_2.mp3` | English | I’m a flying dragon! |
| `snk_mon_2.mp3` | English | Letter power, go! |
| `snk_yum_3.mp3` | English | Crunch, crunch! |
| `snk_drg_3.mp3` | English | That was so much fun! |
| `snk_mon_3.mp3` | English | Hooray! My letters are safe! |

**貼紙**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `sticker_yue.mp3` | 廣東話 | 你攞到一張新貼紙！ |
| `sticker_en.mp3` | English | You got a new sticker! |
| `unlock_yue.mp3` | 廣東話 | 集齊晒！秘密短片解鎖咗！ |
| `unlock_en.mp3` | English | Secret movie unlocked! |
| `locked_yue.mp3` | 廣東話 | 集齊英雄同Super Rex嘅貼紙，就可以睇秘密短片！ |

**秘密短片：怪獸大王**

| 檔名 | 語言 | 要讀 |
|---|---|---|
| `boss_alarm.mp3` | 廣東話 | 嘩！怪獸大王嚟咗！ |
| `boss_team.mp3` | 廣東話 | 機械人英雄同Super Rex，一齊出動！ |
| `boss_sorry.mp3` | 廣東話 | 對唔住！我哋做好朋友啦！ |
| `boss_win.mp3` | 廣東話 | 我哋贏咗喇！ |
| `boss_win_en.mp3` | English | We did it! Hooray! |

---

## 技術備註
- **聲音 queue**：所有語音同一條 queue，一段播完先播下一段；廣東話同英文之間停 300ms（`voices.js` 嘅 `gapMs`）
- **錄音優先**：開機會 fetch `audio/<key>.mp3` 並用 Web Audio decode；冇檔或者 decode 失敗就用 Web Speech（`zh-HK` / `en-GB`）。冇錄音嗰陣 console 會見到 404，屬正常
- **解鎖**：▶ 掣嘅 tap 會同時 resume AudioContext、播一段無聲 buffer、講一句無聲 TTS
- **音效**：用 Web Audio 即場合成，好輕柔，唔使檔案
- **離線**：`sw.js` cache-first；install 嗰陣會 cache 晒核心檔同所有已存在嘅錄音
- **唔熄 mon**：遊戲中用 Screen Wake Lock
- **全螢幕**：用 Chrome 開嗰陣，撳 ▶ 會 request fullscreen；裝咗做 app 就本身係全螢幕
