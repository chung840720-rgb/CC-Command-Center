# CC-Command-Center

> **AI 自動化電商戰情系統** — 個人作品集 / Demo
>
> 🌐 **Live**: [chung840720-rgb.github.io/CC-Command-Center](https://chung840720-rgb.github.io/CC-Command-Center/)

---

## 🎯 專案介紹

本專案為個人作品集，整合 18 個月的電商組組長實戰經驗 + AI 工具鏈，建構「會自主分析 + 給出可執行建議」的 AI 戰情中心。

**核心 narrative**：一般電商 PM 看 dashboard 只能看到「數字」，這個 dashboard 直接給出「**解讀 → 行動 → 升級判斷**」三段式分析，套用真實業務脈絡（業界 SOP Skills），讓 1 個組長的決策產能能放大成全自動 24 小時值班。

---

## ✨ 核心功能（5 個實作頁面）

### 🏠 作戰總覽 (`/`)
- 4 KPI 即時面板（業績 / 達成率 / 累計 / 訂單）
- 3 通路儀錶板（官網 / 蝦皮 / MoMo+）含 KPI + 特性解讀 + 下一步建議
- 議程式 dashboard（看戰情 → 拆通路 → 開行動 → 做復盤）
- 今日行動建議卡（含團隊角色分配）

### 🧠 AI 決策建議 (`/insights`) — 全場最殺
每個業績異常自動套用自寫 SOP Skills（daily-report / ecommerce-pm），AI 產出三段式分析：

```
🧠 AI 解讀     → 1 句話含關鍵數字
🎯 建議行動    → 3 條具體可執行
🚨 升級判斷    → 什麼狀況要請主管裁示
```

**「重新生成」按鈕** 可切換不同切角的 AI 分析。

### 📊 行銷漏斗 (`/funnel`)
整合 Meta 廣告 → GA4 進站 → 訂單 全鏈路漏斗監測。

### 📈 品類熱度 (`/category`)
跨平台品類分類 ETL 結果 + AI 摘要。

### 🚨 異常監測 (`/alerts`)
套用 daily-report skill 燈號規則（DoD ±10/15%）+ 業務脈絡防呆。

### 💬 戰情 AI 助理（右下浮動）
自然語言問答 dashboard（V2 開放真實 Claude 串接）。

---

## 🏗 技術架構

### Frontend
- **Vite 8** + **React 18** + **TypeScript**
- **Tailwind CSS 3.4** + **shadcn/ui** + **Radix UI**
- **React Router 7 HashRouter**
- **Recharts** + **Lucide React** + **Sonner**

### Backend (V2 規劃中)
- **Cloudflare Workers** — LLM proxy（藏 API key + rate limit）
- **Anthropic Claude API** — Haiku 4.5
- 完整 Worker code 已實作於 [`workers/insight.ts`](./workers/insight.ts)

---

## 🔌 V1 (現在) ↔ V2 (規劃) 切換

`src/lib/api.ts` 支援 env var 切換：

```bash
# V1 — Demo mode
VITE_USE_REAL_LLM=false

# V2 — Live mode
VITE_USE_REAL_LLM=true
VITE_WORKER_URL=https://insight.your-name.workers.dev
```

---

## 🛡 商業道德聲明

- 所有展示數據（`public/data/snapshot.json`）皆為**虛構** demo 資料
- 不包含任何來自實際雇主的商業敏感資料
- 「DEMO」品牌為佔位名稱，無對應真實實體
- 爬蟲程式碼僅展示技術架構，未對任何平台執行真實爬取於 production 環境

---

## 🚀 本地開發

```bash
npm install --legacy-peer-deps
npm run dev        # localhost:5173/CC-Command-Center/
npm run build
npm run deploy     # push to gh-pages
```

---

## 📜 License

MIT
