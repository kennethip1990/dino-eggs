# 🦕 恐龍搵蛋（Dino Eggs）

一個 app 三個 game，開 app 先喺主選單揀：🦖 **恐龍搵蛋**（學數數）、🤖 **英雄裝備站**（學認字）、🦖🦸 **Super Rex 救動物**（學英文），後兩個見下面。

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
- 老師未剔嘅字（耳朵、臉、腳、身體、背、樣子，字表入面 focus: true）會出多啲；撳得準嘅字會慢慢少出
- 每個字對應嘅英雄部位：頭→頭盔、頭髮→閃電頭髮、耳朵→耳機、臉→面罩、眼睛、鼻子、嘴巴、心→胸口心形核心、身體→戰衣、背→披風、腳→火箭靴、樣子→鏡

**家長區**有「▶ 睇打怪獸短片」可以單獨預覽段片，同埋「英雄認字記錄」：每個字「第一下就啱 / 次數」，分「聽字揀卡」同「睇字搵位」。填工作紙「家長評估」可以參考「睇字搵位」嗰欄。

### 換下一個單元
- 改 `js/words.js`（字、對應部位、focus）
- 新字要加入楷書字體（字體檔只有用到嘅字）、而如果新單元唔係身體，英雄部位要重新設計 → 叫 Claude 做會最快
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

## 錄音清單（138 個檔）

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

---

## 技術備註
- **聲音 queue**：所有語音同一條 queue，一段播完先播下一段；廣東話同英文之間停 300ms（`voices.js` 嘅 `gapMs`）
- **錄音優先**：開機會 fetch `audio/<key>.mp3` 並用 Web Audio decode；冇檔或者 decode 失敗就用 Web Speech（`zh-HK` / `en-GB`）。冇錄音嗰陣 console 會見到 404，屬正常
- **解鎖**：▶ 掣嘅 tap 會同時 resume AudioContext、播一段無聲 buffer、講一句無聲 TTS
- **音效**：用 Web Audio 即場合成，好輕柔，唔使檔案
- **離線**：`sw.js` cache-first；install 嗰陣會 cache 晒核心檔同所有已存在嘅錄音
- **唔熄 mon**：遊戲中用 Screen Wake Lock
- **全螢幕**：用 Chrome 開嗰陣，撳 ▶ 會 request fullscreen；裝咗做 app 就本身係全螢幕
