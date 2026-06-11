# CC-Command-Center

> **電商 AI 戰情中心** — 18 個月電商組長工作工具的 **Demo Only** 脫敏版
>
> 🌐 **Live**: [chung840720-rgb.github.io/CC-Command-Center](https://chung840720-rgb.github.io/CC-Command-Center/)
> 🛡 **信任聲明**: [/trust](https://chung840720-rgb.github.io/CC-Command-Center/#/trust) — 為什麼這是 Demo Only
> 📚 **20 份 SOP 索引**: [/skills](https://chung840720-rgb.github.io/CC-Command-Center/#/skills)
> 🚀 **資料管線架構**: [/data-pipeline](https://chung840720-rgb.github.io/CC-Command-Center/#/data-pipeline)
> 📝 **單日迭代軌跡**: [/changelog](https://chung840720-rgb.github.io/CC-Command-Center/#/changelog)

---

## 🛡 為什麼這是 Demo Only

**這個 dashboard 不會也不能串接真實系統** — 不是技術限制，是**職業道德選擇**。

面試官常擔心的問題：
> 「妳離職後還能串接到前公司系統嗎？那進到我們公司會不會把資料偷出去？」

**我的答覆**：

1. **不能** — 2026/06/18 是我前公司最後工作日，從那天起，所有系統 OTP / Service Account / API key 全數移除，不留備份。
2. **不會** — Dashboard 內所有業績數字皆 anonymized（per platform per month 用隨機 factor × 0.65~0.95），不洩漏絕對值。
3. **這對你有利** — 我能在「不能用真實資料」的限制下，依然產出 19 頁完整 dashboard + 20 份 SOP + 4 平台爬蟲架構。這證明我能把 AI 落地到工作，且懂得在商業道德底線內運作。

**完整承諾詳見** [/trust 信任聲明](https://chung840720-rgb.github.io/CC-Command-Center/#/trust) 頁面。

---

## 🎯 為什麼這份作品不一樣

絕大多數電商 BI dashboard 的問題：
- **視覺設計不錯，但靠手動上傳 Excel** — 因為 Shopline / 蝦皮 / MoMo 沒給開發者完整 API
- **「自動同步」其實是組員每天手動下載報表** — 自動化是假的
- **AI 功能只是 prompt 包裝** — 沒有真實業務脈絡

**這份作品的差異化**：

1. 🧠 **20 份 SOP Skills 是真實工作沉澱** — 從電商 PM 思考框架（cleanclean-pm）、達人心態（daren-mindset）、月會簡報心法（monthly-report-mindset）、活動跨組 SOP（cross-team-campaign-sop）到平台 API 反向工程（shopline-api v2.5 / shopee-api v1.1 / momo-api v1.1）。每一份都標註觸發詞與應用場景。

2. 🚀 **4 平台爬蟲架構公開** — Playwright + Chrome DevTools Protocol + 背景真實 Chrome 反偵測。Code 在 repo 內展示**技術深度**，但**離職後不再針對前雇主平台執行**（職業道德承諾）。

3. 🎯 **每個 page header 顯示「📋 本頁套用 SOP」** — 點擊跳 /skills 索引，看完整描述與版本。Dashboard 從「AI demo」變「SOP 系統的可視化證據」。

4. 🛡 **主動披露 Demo Only 策略** — 沒有 V2 真實串接，沒有「等加值通過」這種藉口。Demo 永遠是 Demo，這就是它的價值。

---

## ✨ 完整功能清單（21 個 route）

### 作戰總覽
- **`/`** 作戰中心 — Hero + 4 KPI + 3 通路 + 議程 + 路徑（📋 cleanclean-pm + monthly-report-mindset）
- **`/sales-battle`** 銷售戰情 — 5 KPI + 趨勢長條圖 + 達成率環 + 3 平台明細 + 廣告效益（📋 weekly-report-skill）

### 電商通路（4 平台用 PlatformDetailView 元件）
- **`/shopline`** 官網 — 內部 5 tab + YTD + 8 KPI + 4 趨勢圖 + UV + GA4 漏斗 + Top 5（📋 shopline-api v2.5）
- **`/shopee`** 蝦皮 — 同上 + 檔期排程（📋 shopee-api + 蝦皮通路戰略）
- **`/momo`** MoMo — 同上 + 站內關鍵字排名（📋 momo-api）
- **`/shopee-direct`** 蝦皮直營 — 同上 + 戰略卡位（📋 蝦皮通路戰略 + 蝦皮直營分類規格）

### 數位廣告
- **`/ads/meta`** Meta — 7 KPI + 廣告組表 + 4 受眾分析卡
- **`/ads/google`** Google — 7 KPI + 類型分配 + 關鍵字成效
- **`/ads/creatives`** 素材成效 — A/B 雙軌測試 + 8 素材排行榜 + 類型 ROAS 比較 + AI 行動建議
- **`/ads/competitor`** 競品廣告 — 3 競品策略拆解 + AI 行動建議

### 行動與活動
- **`/campaign`** 活動規劃 — 3 欄 Kanban + 報告書 demo + 5 階段 SOP Checklist
- **`/alerts`** 異常監測 — 3 列 + timeline
- **`/upload`** 上傳報表 — 拖曳上傳 UI + 歷史

### 觀察分析
- **`/insights`** AI 決策建議 — 9 預烤變體輪流切換（📋 daily-report + cleanclean-pm + daren-mindset）
- **`/funnel`** 漏斗總覽 — 4 KPI + 視覺漏斗 + 燈號
- **`/category`** 品類熱度 — 4 品類 + AI 摘要
- **`/competitor-web`** 競品網站 AI 解析
- **`/analytics`** GA 分析 — GA4 漏斗 + 流量來源 + Clarity 安裝步驟

### 資料與設定
- **`/products`** 商品資料 — 品類分布 + SKU 表
- **`/log`** 操作日誌
- **`/wishpool`** 願池
- **`/connect`** 串接設定（**展示 UI 設計，Demo Only 不真連**）
- **`/data-pipeline`** 🚀 過去工作沉澱的爬蟲架構
- **`/skills`** 📚 20 份 SOP 索引
- **`/changelog`** 📝 迭代軌跡
- **`/trust`** 🛡 **信任聲明**（核心 narrative 頁面）

---

## 🏗 技術架構

### Frontend
- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS 3.4** + **shadcn/ui** + **Radix UI**
- **React Router 7 HashRouter**
- **Recharts** + **Lucide React** + **Sonner**

### Color System
- Primary: **#b0906f** 奶茶色（HSL 31 29% 56%）
- 字型: Inter（英數）+ Noto Sans TC（中文）

### Data Anonymization
- Per platform per month 用單一隨機 factor (0.65~0.95)
- GMV / target / orders / traffic / adSpend 全乘以同一 factor
- → achievement / ROAS / AOV / 占比 等 ratio **完全保留**
- 結果：dashboard 看起來真實，但**不洩漏絕對值**

---

## 📂 專案結構

```
CC-Command-Center/
├── public/data/
│   ├── snapshot.json           # anonymized demo 數據（1-5月趨勢）
│   └── mock-ai-insights.json   # 9 個預烤 AI 回應變體
├── src/
│   ├── pages/                  # 25 個 page 元件
│   ├── components/
│   │   ├── ui/                 # shadcn/ui (17 個)
│   │   ├── dashboard/          # 業務元件（KpiCard / PlatformDetailView / SopBadge）
│   │   ├── TopNav.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── MarqueeBar.tsx      # 商業道德跑馬燈公告
│   │   └── Layout.tsx
│   └── lib/
│       ├── api.ts              # demo data layer（永遠是 mock，無 real LLM toggle）
│       └── utils.ts
└── （無 workers/ — Demo Only 沒有 backend）
```

---

## 🚀 本地開發

```bash
npm install --legacy-peer-deps
npm run dev        # localhost:5173/CC-Command-Center/
npm run build
npm run deploy     # push to gh-pages branch
```

---

## 👤 關於作者

**Johnny / chung840720** · 18 個月電商組組長（2024-12 ~ 2026-06）

- 主導 MoMo（2025/3）+ 蝦皮直營（2026/3）兩條新通路從 0 到 1
- 推動蝦皮升級商城旗艦店，帶動 **蝦皮通路 2025 YOY +117%**
- 2025 整體線上通路 **YOY +24%**
- 主導官網從 91APP 遷移至 Shopline 重大轉型專案
- 沉澱 **20 份 Claude Code SOP Skills** + 4 平台全自動爬蟲

📧 chung840720@gmail.com
🔗 [GitHub](https://github.com/chung840720-rgb)

---

## 📜 License

MIT — 程式碼可自由參考學習
