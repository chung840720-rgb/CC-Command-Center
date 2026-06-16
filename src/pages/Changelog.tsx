import { History, Sparkles, GitCommit, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Release {
  version: string;
  date: string;
  time: string;
  type: 'feature' | 'fix' | 'major' | 'docs';
  title: string;
  items: string[];
}

const RELEASES: Release[] = [
  {
    version: 'v2.9', date: '2026-06-16', time: '17:00', type: 'major',
    title: 'Claude Code 直連 Meta MCP · SOP+script 雙武器化',
    items: [
      '🎯 Claude Code 透過 ~/.claude.json 直連 Meta MCP（脫離 Claude.ai 中介人肉截圖流程）',
      'OAuth callback URL 流程完整跑通：mcp__meta-ads__authenticate → 瀏覽器授權 → 貼 callback URL → complete_authentication',
      '真實拉取 2,762 個 adsets（近 7 天 32 個 active / 21 個有效 ROAS / 11 個 LL10% lookalike 歸因不可用）',
      '🆕 skills/meta-ads-mcp.md 升級到 v1.1：加 Claude Code 直連版本（含 4 條新踩雷：500 error / ROAS 不可排序 / Not available 字串 / NT$ 格式解析）',
      '🆕 scripts/meta/sync-meta-snapshot.cjs 自動化模板：raw JSON → 解析 → 脫敏（factor 0.82 + KOL generic 化）→ 寫 snapshot',
      '🆕 scripts/meta/README.md 一句 prompt SOP：未來新公司改 KOL_MAP + ad_account_id 即可重用',
      '.gitignore 加 raw-meta-entities.json 防止真實 BM 資料誤推',
      'E2E 驗證通過：Top by ROAS 偵測 ✓ / 紅旗自動標記 ✓ / 受眾分布推斷 ✓',
    ],
  },
  {
    version: 'v2.8', date: '2026-06-16', time: '14:00', type: 'major',
    title: 'Meta Ads MCP 真實串接 — 完成 4 平台 ETL 拼圖',
    items: [
      '🎉 真實串接 Meta Ads MCP（官方 Custom Connector）— act_1322065504565230 淨淨 CleanClean 廣告帳號',
      'URL: https://mcp.facebook.com/ads · 18 個 read-only tools 全部可呼叫',
      '透過 Claude.ai 拉到 6/9-6/15 真實 Meta 廣告數據（39 個有花費廣告組、Top 10 by ROAS）',
      '/ads/meta 頁完全重寫：📡 資料源溯源卡 + 6 KPI + 🚨 紅旗警示（RT_L1000 NT$40k/ROAS 0.02）+ Top 10 表 + 4 受眾類型分布 + AI trace + 命名規則 SOP',
      '保留真實命名 convention（00：目錄銷售_DPA / 01：清潔皂_RT(已購買名單)_CPA / 07：洗衣精_RT(溫+熱)_CPA）— 數字 anonymize 但結構真實',
      '新增 skills/meta-ads-mcp.md v1.0 — 串接 SOP + 18 tools 對照 + 5 條踩雷沉澱 + 命名規則 SOP（漏斗 5 層：NEW→溫→熱→RT→DPA）',
      '/skills 索引加 meta-ads-mcp.md 🆕 標記',
      '至此 4 平台 ETL 全自動化拼圖完成：Shopline + Shopee + MoMo + Meta',
    ],
  },
  {
    version: 'v2.7', date: '2026-06-11', time: '22:00', type: 'major',
    title: '從「看 dashboard」升級成「撥動業績的 AI 工具」',
    items: [
      '所有 "MoMo+" / "MOMO+" 統一改為 "MoMo" / "MOMO"（移除 +）',
      '新增 DateRangeSwitcher 元件：今天 / 昨天 / 近7天 / 近30天 / 自訂區間 — 所有數據區塊都掛上',
      'snapshot 加 campaignMaster（6 個有 ID 的活動）+ adActionsMaster（6 個有 ID 的廣告動作）',
      '所有 AI 分析（通路週環比、品類貢獻度、競品建議）都 trace 到具體活動/廣告 ID — 從「憑空建議」升級成「有憑有據」',
      '競品改為鎖定 4 家直接競品：淨毒五郎 / 漫享 / DUDA CLEAN / 古寶（含定位、月廣告預算、最新動態、我們反制）',
      'AdsCompetitor 重做：4 競品策略卡（威脅度色帶）+ 官網流量+社群比較表 + AI 反制建議（trace 到既有活動/廣告 ID）',
      'Home 加 P0-1【今日該做什麼】：3 件事 + 連結到具體活動 ID + 對應 SOP',
      'Home 加 P0-2【黃金三指標】：流量 × 客單價 × 轉換率（老闆月報 P2 核心）+ 目標 CR 對照',
      'Home 加 P0-3【老闆三行回報 AI 草稿】：套 daren-mindset + monthly-report-mindset，按一鍵複製到剪貼簿',
      'Category 加廣告動作 / 品類反應 trace 連結（點擊跳活動規劃 / 廣告效率）',
    ],
  },
  {
    version: 'v2.6', date: '2026-06-11', time: '21:00', type: 'major',
    title: '融合 CC-Data-Dashboard 優點 · 品類貢獻度升級為核心',
    items: [
      '通路卡 ChannelCard 升級：5 KPI（業績/流量/轉換率/客單價/ROAS）全帶「近7天 vs 前7天」週環比 ▲▼ %',
      'AI 建議內嵌通路卡（學原本 dashboard 設計）— 看數據 + 看建議一氣呵成，不切斷脈絡',
      '通路卡加優先度色帶：🚨 紅（優先修正）/ 🎯 黃（觀察調整）/ ✅ 綠（可加碼）',
      'Home 加大區塊：🏷️ 品類貢獻度 — PM 撥動業績的核心邏輯',
      '品類貢獻度視覺：5 大品類 stacked bar + 4 平台占比 mini bar + 廣告動作 ↔ 品類反應因果連結',
      'TopNav 品類從「找問題」上移到「做行動」第一項 — 反映 PM 工作流：總表 → 各平台 → 品類 → 廣告調整',
      '/category 整頁重構：4 平台貢獻矩陣 + 廣告動作（投入）→ 品類反應（產出）因果視覺化',
      'Home 加月份業績彙整表（仿 CC-Data-Dashboard 表格設計）',
      'Hero 加「Google Sheets · 自動同步 02:40」綠色標籤 + footer 真實感 narrative',
      'Home 結構：Hero → 智慧數據分析（通路卡）→ 品類貢獻度 → 月度彙整表 → 6 切角入口 → 資料來源',
    ],
  },
  {
    version: 'v2.5', date: '2026-06-11', time: '20:30', type: 'major',
    title: '通路頁大重構：每通路內分「自然 + 付費」流量',
    items: [
      'TopNav「看戰情」改為 5 通路入口（總覽 / 官網 / 蝦皮 / MoMo / 直營），通路明細從「做行動」上移',
      'PlatformDetailView 從 8 段（KPI grid + 4 趨勢圖 + UV + GA4 漏斗 + 活動排程 + 站內排名 + Top 5）→ 4 段（業績總覽 / 自然流量 / 付費流量 / 熱銷 Top 5）',
      'snapshot.json 4 平台各加 organic / paid 拆分（虛構但比例合理：官網 60/40、蝦皮 35/65、MoMo 50/50、直營 25/75）',
      '自然流量區塊：自然訪客 / 訂單 / GMV / AOV + 流量來源拆解 bar chart',
      '付費流量區塊：花費 / 訂單 / ROAS / CPA + 各廣告通路 ROAS 比較',
      'Home 重寫：砍 4 KPI 重複 grid、砍 3 警示 row、砍議程+今日行動建議、砍作戰路徑 → 留下 Hero + 跨通路儀錶板 + 6 切角入口',
      'Hero KPI panel 砍掉（與 4 KPI grid 重複），改為單一大標題顯示當月業績 + 月份切換器',
      'Bundle 956KB → 906KB（移除無用 chart 程式）',
    ],
  },
  {
    version: 'v2.4', date: '2026-06-11', time: '19:30', type: 'major',
    title: 'IA 重構：跳脫老闆 dashboard 框架 · 改用 6 切角 PM 思考',
    items: [
      'Nav 從 6 父分類（作戰總覽/電商通路/數位廣告/行動與活動/觀察分析/資料與設定）→ 4 父分類（看戰情/找問題/做行動/沉澱與信任）',
      '父+子分類從 6+26 = 32 項 → 4+16 = 20 項，縮減 1/3（避免與前公司 dashboard 結構雷同）',
      '每個父分類顯示對應「6 切角視角」（數據觀測員 / 策略軍師+外部雷達官 / 執行操盤手+內部關係官 / 成長觀察員）',
      'Logo: 電商作戰中心 → Johnny PM 工作台；副標: JOHNNY DEMO → 6-PERSPECTIVES · ECOMMERCE',
      'Hero: 數位電商3大平台行銷增長作戰中心 → 6 切角電商 PM 思考工作框架',
      '通路 4 平台從父分類層級下放到「做行動」子項（PM 視角：通路是執行手段，不是結構分類）',
      '廣告 Meta/Google/Competitor/Creatives 4 個 nav 項合併成「廣告效率」+「競品雷達」2 項',
    ],
  },
  {
    version: 'v2.3', date: '2026-06-11', time: '19:00', type: 'major',
    title: '策略轉變：Demo Only · 商業道德為 Selling Point',
    items: [
      '新增 /trust 信任聲明頁 — 對前雇主 + 未來雇主的 4 大承諾',
      '主動披露「離職後不再有任何系統存取權」 — 把面試官的擔憂變成信任點',
      '全站移除「V2 真實 LLM 串接」暗示（ChatBubble / Insights / Connect / DataPipeline）',
      '改為「Demo Only 永久 — 不是技術限制，是職業道德選擇」narrative',
      'README 改寫：聚焦「我留下 SOP + 帶走能力，留下你的真實資料」承諾',
    ],
  },
  {
    version: 'v2.2', date: '2026-06-11', time: '18:30', type: 'major',
    title: 'SOP badges + changelog 頁',
    items: [
      '每個 page header 加「📋 本頁套用 SOP」標記 + 點擊可跳 /skills 索引',
      '新增 /changelog 完整迭代軌跡',
      'README 改寫為 Johnny portfolio 敘事',
    ],
  },
  {
    version: 'v2.1', date: '2026-06-11', time: '18:00', type: 'major',
    title: 'Skills 索引 + Data Pipeline 兩個 killer 頁',
    items: [
      '新增 /skills — 20 份 SOP 分 5 大類 + 觸發詞 + 應用 route 連結',
      '新增 /data-pipeline — 4 平台 Network 反向工程 / 每日全自動流程 / 5 層技術棧 / 6 個踩雷沉澱',
      '把 dashboard 從「AI demo」變「真實工作工具脫敏版」narrative',
    ],
  },
  {
    version: 'v2.0', date: '2026-06-11', time: '17:30', type: 'major',
    title: 'Campaign + Ads/Creatives 補強到 ≥ boss',
    items: [
      'Campaign +5 階段 SOP Checklist（套 cross-team-campaign-sop.md）',
      'Ads/Creatives +素材類型 ROAS 比較 + AI 行動建議卡（加碼/複用/改投/砍）',
    ],
  },
  {
    version: 'v1.9', date: '2026-06-11', time: '17:00', type: 'fix',
    title: 'Shopline 趨勢圖 Recharts 渲染修復',
    items: [
      'ResponsiveContainer 包進固定尺寸 div（recharts 需可量測父容器）',
      'isAnimationActive={false} 防動畫衝突',
      '修正 margin（left -16 太激進導致 YAxis 跑出畫面）',
    ],
  },
  {
    version: 'v1.8', date: '2026-06-11', time: '16:30', type: 'feature',
    title: '一次完工 10 個剩餘 nav routes',
    items: [
      '/connect 串接設定（4 平台 cards 含 secret toggle）',
      '/ads/meta + /ads/google + /ads/competitor + /competitor-web',
      '/products + /upload + /log + /wishpool',
      '/shopee-direct 套 PlatformDetailView 紫色 theme',
      'TopNav dropdown 自動更新',
    ],
  },
  {
    version: 'v1.7', date: '2026-06-11', time: '16:00', type: 'feature',
    title: '/campaign + /analytics 兩頁',
    items: [
      '/campaign — Kanban 3 欄 + 判讀 + 活動成效表 + 完成報告書 demo',
      '/analytics — GA4 漏斗 + 裝置 + 熱門頁 + 流量來源 + Clarity 安裝步驟（含複製按鈕）+ AI 診斷 CTA',
    ],
  },
  {
    version: 'v1.6', date: '2026-06-11', time: '15:30', type: 'feature',
    title: '/ads/creatives 素材成效',
    items: [
      'A/B 雙軌測試（問題解決型 vs 促購型）',
      '三通路素材貢獻 cards',
      '8 個素材排行榜 + filter tabs + Top 1 Trophy',
    ],
  },
  {
    version: 'v1.5', date: '2026-06-11', time: '15:00', type: 'feature',
    title: 'Shopee + MoMo 詳細頁 + PlatformDetailView 抽取',
    items: [
      '把 ShoplineDetail 重構為通用 PlatformDetailView 元件',
      '/shopee 橘色 theme + 檔期排程獨家區塊',
      '/momo 紅色 theme + 站內關鍵字排名獨家區塊',
      '3 頁共用 12 月選擇 / YTD / 8 KPI / 4 趨勢圖 / Top 5',
    ],
  },
  {
    version: 'v1.4', date: '2026-06-11', time: '14:30', type: 'feature',
    title: '色系改奶茶 #b0906f',
    items: [
      'Primary: hsl(31 29% 56%) milk tea brown',
      'Hero gradient: cream + warm beige tones',
      'rose-* utility classes → amber-* (匹配奶茶調性)',
    ],
  },
  {
    version: 'v1.3', date: '2026-06-11', time: '14:00', type: 'feature',
    title: 'DEMO → Johnny demo 品牌化 + 玫瑰色',
    items: [
      'Logo subtitle: CLEANCLEAN COMMAND → JOHNNY DEMO',
      '臨時用色: 玫瑰粉 #C49799',
    ],
  },
  {
    version: 'v1.2', date: '2026-06-11', time: '13:00', type: 'feature',
    title: '視覺升級（學老闆 dashboard）',
    items: [
      'Logo: 圓形漸層 + Gauge 儀表 icon',
      'Hero 主標漸層文字 + KPI sub-card 獨立漸層',
      'CTA 漸層按鈕 + 立體陰影',
      'Top Nav dropdown 加 icon + 副標題',
    ],
  },
  {
    version: 'v1.1', date: '2026-06-11', time: '12:00', type: 'feature',
    title: '銷售戰情 + Shopline 詳細頁',
    items: [
      '/sales-battle: 5 KPI + 趨勢長條圖 + 達成率環 + 3 平台明細 + 廣告效益',
      '/shopline: 內部 tab + YTD + 8 KPI + 4 趨勢 + UV 大圖 + GA4 漏斗',
      '作戰總覽 nav 改為 dropdown',
    ],
  },
  {
    version: 'v1.0', date: '2026-06-11', time: '11:00', type: 'major',
    title: 'V1 dashboard ship + GH Pages deploy',
    items: [
      'Vite + React + TS + Tailwind 3.4 + shadcn/ui + React Router HashRouter',
      '17 routes（5 完整 + 12 Roadmap placeholder）',
      '老闆 design tokens 套入（oklch + Inter + Noto Sans TC）',
      'Home / Insights / Funnel / Category / Alerts 完整實作',
      '9 個預烤 AI insight 變體（mock LLM）',
      'ChatBubble 元件（V2 真 LLM 預留）',
      'Worker code 完整在 repo（V2 用）',
      'README + gh-pages deploy → chung840720-rgb.github.io/CC-Command-Center/',
    ],
  },
];

const TYPE_COLOR = {
  major:   { label: 'Major',   color: 'bg-rose-100 text-rose-700 border-rose-200', icon: Rocket },
  feature: { label: 'Feature', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sparkles },
  fix:     { label: 'Fix',     color: 'bg-amber-100 text-amber-800 border-amber-200', icon: GitCommit },
  docs:    { label: 'Docs',    color: 'bg-zinc-100 text-zinc-700 border-zinc-200', icon: GitCommit },
};

export default function Changelog() {
  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <History className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">關於本工具</p>
          <h1 className="text-3xl font-black tracking-tight">迭代軌跡 Changelog</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
            從 2026/06/11 早上 11:00 開始，<strong>單日 ship {RELEASES.length} 個版本</strong>。
            每個 commit 都對應業務需求 + 設計決策 + 技術突破，這份 changelog 反映了「AI + 人類」協作的真實速度。
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-primary text-primary-foreground text-xs font-bold">{RELEASES.length} releases</Badge>
            <Badge variant="outline" className="text-xs font-bold">{RELEASES.filter((r) => r.type === 'major').length} Major</Badge>
            <Badge variant="outline" className="text-xs font-bold">{RELEASES.filter((r) => r.type === 'feature').length} Feature</Badge>
            <Badge variant="outline" className="text-xs font-bold">{RELEASES.filter((r) => r.type === 'fix').length} Fix</Badge>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {RELEASES.map((r, i) => {
          const meta = TYPE_COLOR[r.type];
          const Icon = meta.icon;
          return (
            <div key={r.version} className="card-soft p-6 relative">
              {i < RELEASES.length - 1 && (
                <div className="absolute left-[3.25rem] top-20 bottom-0 w-px bg-border" aria-hidden />
              )}
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10', meta.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <code className="text-base font-extrabold font-mono">{r.version}</code>
                    <Badge variant="outline" className={cn('text-[10px] font-bold', meta.color)}>{meta.label}</Badge>
                    <span className="text-xs text-muted-foreground">{r.date} · {r.time}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2">{r.title}</h3>
                  <ul className="space-y-1">
                    {r.items.map((it, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                        <span className="text-primary shrink-0">▸</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
