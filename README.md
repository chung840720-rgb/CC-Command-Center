# CC-Command-Center

> **電商 AI 戰情中心** — 不是純 AI demo，是 18 個月電商 PM 實際工作工具的脫敏版
>
> 🌐 **Live**: [chung840720-rgb.github.io/CC-Command-Center](https://chung840720-rgb.github.io/CC-Command-Center/)
> 📚 **20 份 SOP 索引**: [/skills](https://chung840720-rgb.github.io/CC-Command-Center/#/skills)
> 🚀 **資料管線架構**: [/data-pipeline](https://chung840720-rgb.github.io/CC-Command-Center/#/data-pipeline)
> 📝 **單日迭代軌跡**: [/changelog](https://chung840720-rgb.github.io/CC-Command-Center/#/changelog)

---

## 🎯 為什麼這份作品不一樣

絕大多數電商 BI dashboard 的問題：
- **視覺設計不錯，但靠手動上傳 Excel** — 因為 Shopline / 蝦皮 / MoMo 沒給開發者完整 API
- **「自動同步」其實是組員每天手動下載報表** — 自動化是假的
- **AI 功能只是 prompt 包裝** — 沒有真實業務脈絡

**這份作品的差異化**：

1. 🧠 **20 份 SOP Skills 是真實工作沉澱** — 從電商 PM 思考框架（cleanclean-pm）、達人心態（daren-mindset）、月會簡報心法（monthly-report-mindset）、活動跨組 SOP（cross-team-campaign-sop）到平台 API 反向工程（shopline-api v2.5 / shopee-api v1.1 / momo-api v1.1），全是我 18 個月任職期間寫的，每一份都標註觸發詞與應用場景。

2. 🚀 **4 平台爬蟲不靠 API** — 用 **Playwright + Chrome DevTools Protocol + 背景真實 Chrome** 反偵測，繞過蝦皮 fingerprint、保持 MoMo JSESSIONID alive、處理 Shoplytics OTP 2-5 天過期問題。這是「會用 AI」與「能讓 AI 真正落地電商工作」的差距。

3. 🎯 **每個 page header 顯示「📋 本頁套用 SOP」** — 點擊跳 /skills 索引，看完整描述與版本。Dashboard 從「AI demo」變成「**SOP 系統的可視化證據**」。

---

## ✨ 完整功能清單（19 個 route）

### 作戰總覽
- **`/`** 作戰中心 — Hero + 4 KPI + 3 通路儀錶板 + 議程 + 路徑（📋 cleanclean-pm.md + monthly-report-mindset.md）
- **`/sales-battle`** 銷售戰情 — 5 KPI + 趨勢長條圖 + 達成率環 + 3 平台明細 + 廣告效益（📋 weekly-report-skill.md）

### 電商通路（4 平台統一 PlatformDetailView 元件）
- **`/shopline`** 官網 Shopline — 內部 5 tab + YTD + 8 KPI + 4 趨勢圖 + UV 大圖 + GA4 漏斗 + Top 5（📋 shopline-api.md v2.5）
- **`/shopee`** 蝦皮旗艦 — 同上 + 檔期排程（📋 shopee-api.md + 蝦皮通路戰略.md）
- **`/momo`** MoMo+ — 同上 + 站內關鍵字排名（📋 momo-api.md v1.1）
- **`/shopee-direct`** 蝦皮直營 — 同上 + 戰略卡位脈絡（📋 蝦皮通路戰略.md + 蝦皮直營分類規格.md）

### 數位廣告
- **`/ads/meta`** Meta 廣告 — 7 KPI + 廣告組表 + 4 受眾分析卡
- **`/ads/google`** Google 廣告 — 7 KPI + 類型分配 + 關鍵字成效
- **`/ads/creatives`** 素材成效 — A/B 雙軌測試 + 8 素材排行榜 + 類型 ROAS 比較 + AI 行動建議（📋 daily-report.md v2.10）
- **`/ads/competitor`** 競品廣告 — 3 競品策略拆解 + AI 行動建議

### 行動與活動
- **`/campaign`** 活動規劃 — 5 KPI + 3 欄 Kanban + 目前判讀 + 活動成效表 + 報告書 demo + 5 階段 SOP Checklist（📋 cross-team-campaign-sop.md）
- **`/alerts`** 異常監測 — 3 列 + timeline（📋 daily-report.md v2.10）
- **`/upload`** 上傳報表 — 拖曳上傳 + 歷史

### 觀察分析
- **`/insights`** AI 決策建議 — 9 預烤變體 + 重新生成（📋 daily-report.md + cleanclean-pm.md + daren-mindset.md）
- **`/funnel`** 漏斗總覽 — 4 KPI + 視覺漏斗 + 燈號（📋 weekly-report-skill.md）
- **`/category`** 品類熱度 — 4 品類 + AI 摘要（📋 品類分類規格.md v4.2）
- **`/competitor-web`** 競品網站 AI 解析 — 3 競品 + 定位比較表
- **`/analytics`** GA 分析 — GA4 漏斗 + 流量來源 + Clarity 安裝 + AI 診斷

### 資料與設定
- **`/products`** 商品資料 — 品類分布 + SKU 表
- **`/log`** 操作日誌 — Timeline + filter
- **`/wishpool`** 願池 — 許願卡 + like/comment
- **`/connect`** 串接設定 — 4 平台 cards
- **`/data-pipeline`** 🚀 資料管線架構 — Playwright + CDP 反向工程拆解
- **`/skills`** 📚 SOP Skills 索引 — 20 份 SOP 分 5 類
- **`/changelog`** 📝 迭代軌跡 — 單日 ship 13 個版本

---

## 🏗 技術架構

### Frontend
- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS 3.4** + **shadcn/ui** + **Radix UI**（17 個元件）
- **React Router 7 HashRouter**（GH Pages SPA 不 404）
- **Recharts** 視覺化 + **Lucide React** + **Sonner**

### Color System
- Primary: **#b0906f** 奶茶色（HSL 31 29% 56%）
- Hero gradient: warm cream + rose-pink radial
- 字型: Inter（英數）+ Noto Sans TC（中文）

### Backend（V2 規劃中，Worker code 在 repo 內）
- **Cloudflare Workers** — LLM proxy（藏 Claude API key + rate limit）
- **Anthropic Claude API** — Haiku 4.5 + 20 份 SOP 注入 system prompt
- Worker code: [`workers/insight.ts`](./workers/insight.ts)

### Data Pipeline（本人實作 — 詳見 /data-pipeline）
```
[Windows Task Scheduler @ 08:40 每天]
  ├─ Shopline    (Playwright Persistent Profile + OTP refresh + SSO 健檢)
  ├─ 蝦皮商城     (背景 Chrome :9222 + CDP 反偵測)
  ├─ MoMo        (背景 Chrome :9224 + JSESSIONID 保活)
  └─ 蝦皮直營     (沿用蝦皮架構)
       ↓
  Google Sheets / Notion / JSON snapshot
       ↓
[10:20 daily-report.md skill 套燈號]
       ↓
[10:55 Slack 3 份 draft → 操盤手審 → 11:00 手動 Send]
```

---

## 🔌 V1 (Demo Mode) ↔ V2 (Real LLM) 切換

```bash
# V1 — Demo mode (預設, 從 mock-ai-insights.json 取)
VITE_USE_REAL_LLM=false

# V2 — Live mode (真實 Claude API via Cloudflare Workers)
VITE_USE_REAL_LLM=true
VITE_WORKER_URL=https://insight.your-name.workers.dev
```

V2 啟動流程：
```bash
cd workers
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
VITE_USE_REAL_LLM=true VITE_WORKER_URL=... npm run deploy
```

---

## 🛡 商業道德聲明

- 展示數據（`public/data/snapshot.json`）為**真實業績結構 × random(0.65~0.95) anonymize**
  - 不洩漏絕對值，但保留通路占比、月度趨勢、達成率等結構
  - 確保 demo 看起來真實，又遵守雇主商業道德
- ROAS / 客單價 / 占比等「比例」欄位保留（本身不洩漏絕對值）
- 「Johnny demo」品牌為佔位名稱，無對應真實實體
- 爬蟲程式碼僅展示技術架構，未對任何平台執行真實爬取於 production 環境
- 來源 Sheet ID、API key 等敏感資訊均不在 repo 內

---

## 🚀 本地開發

```bash
npm install --legacy-peer-deps
npm run dev        # localhost:5173/CC-Command-Center/
npm run build      # 產出 dist/
npm run deploy     # push to gh-pages branch
```

---

## 📂 專案結構

```
CC-Command-Center/
├── public/data/
│   ├── snapshot.json           # demo 數據（30 天業績 / 3 平台 / Top 商品 / 等）
│   └── mock-ai-insights.json   # 9 個預烤 AI 回應變體
├── src/
│   ├── pages/                  # 24 個 page 元件
│   ├── components/
│   │   ├── ui/                 # shadcn/ui (17 個)
│   │   ├── dashboard/          # 業務元件 (KpiCard / ChannelCard / PlatformDetailView / SopBadge / 等)
│   │   ├── TopNav.tsx          # 水平 nav + 6 dropdown (含 icon + subtitle)
│   │   ├── ChatBubble.tsx      # 浮動 chat (V2 用)
│   │   └── Layout.tsx
│   ├── lib/
│   │   ├── api.ts              # dual mode API (demo / real-LLM)
│   │   └── utils.ts            # cn + formatCurrency + formatNumber
│   └── types/dashboard.ts
└── workers/
    └── insight.ts              # Cloudflare Worker proxy (Anthropic API)
```

---

## 👤 關於作者

**Johnny / chung840720** · 18 個月電商組組長（2024-12 ~ 2026-06）

- 主導 MoMo（2025/3）+ 蝦皮直營（2026/3）兩條新通路從 0 到 1
- 推動蝦皮升級商城旗艦店，帶動 **蝦皮通路 2025 YOY +117%**
- 2025 整體線上通路 **YOY +24%**，全年 GMV ~1.22 億
- 主導官網從 **91APP 遷移至 Shopline** 重大轉型專案
- 沉澱 **20 份 Claude Code SOP Skills** + 4 平台全自動爬蟲

📧 chung840720@gmail.com
🔗 [GitHub](https://github.com/chung840720-rgb)

---

## 📜 License

MIT — 程式碼可自由參考學習
