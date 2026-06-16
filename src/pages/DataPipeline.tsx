import { Network, Globe, ShoppingBag, Store, Target, Code, Zap, AlertCircle, CheckCircle2, GitBranch, Activity, Megaphone, Database, Search, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  {
    icon: Globe, color: 'bg-amber-100 text-amber-700', name: '官網 Shopline', skill: 'shopline-api.md v2.5',
    difficulty: '中', auth: 'OAuth + cookies refresh',
    note: 'Shoplytics 內部 API 需 SSO cookies，2-5 天會過期。寫 Playwright Persistent Profile 自動 refresh，08:40 排程前 health check + LINE 預警。',
    endpoints: [
      { method: 'POST', path: '/api/cleancleantw/metric/homepage/gross-amount', purpose: '網店總額（即時準確）' },
      { method: 'GET', path: '/v1/orders?status=settled', purpose: '訂單明細（Open API）' },
      { method: 'GET', path: 'GA4 Data API', purpose: '漏斗 + 流量來源（OAuth 2.0）' }
    ]
  },
  {
    icon: ShoppingBag, color: 'bg-orange-100 text-orange-700', name: '蝦皮商城', skill: 'shopee-api.md v1.1',
    difficulty: '高', auth: 'CDP 背景真實 Chrome',
    note: 'Playwright (含 stealth plugin) 全部被 fingerprint 擋下。唯一可行解：背景真實 Chrome (port 9222) + connectOverCDP 反偵測。',
    endpoints: [
      { method: 'GET', path: '/api/v3/sce/key-metrics', purpose: '日 4 指標（GMV / 流量 / CVR / 訂單）' },
      { method: 'POST', path: '/api/parentskudetail (triggered → polling → download)', purpose: '月度 SKU 報表（三段式：觸發 → 輪詢 → 下載）' }
    ]
  },
  {
    icon: Store, color: 'bg-red-100 text-red-700', name: 'MOMO', skill: 'momo-api.md v1.1',
    difficulty: '高', auth: 'CDP + JSESSIONID 保活',
    note: 'JSESSIONID 是 session-only cookie，launchPersistentContext 沒法持久化 — 必須背景 Chrome 持續 alive。',
    endpoints: [
      { method: 'GET', path: '/get_category_kpi_detail', purpose: '日 4 指標' },
      { method: 'GET', path: '/get_product_ranking?stats_dim=31', purpose: '月度商品排行（一個 endpoint 用 stats_dim 切換日/月）' }
    ]
  },
  {
    icon: Target, color: 'bg-violet-100 text-violet-700', name: '蝦皮直營', skill: 'shopee-api.md v1.1 (同套架構)',
    difficulty: '中', auth: '同蝦皮商城',
    note: '2026/3 新導入通路，沿用蝦皮商城整套架構。戰略卡位用，業績波動皆為常態（業務脈絡防呆）。',
    endpoints: [
      { method: 'GET', path: '/api/v3/sce/key-metrics', purpose: '日 4 指標（含品類維度）' }
    ]
  },
  {
    icon: Megaphone, color: 'bg-blue-100 text-blue-700', name: 'Meta 廣告 🆕', skill: 'meta-ads-mcp.md v1.1',
    difficulty: '低-中', auth: '官方 Custom MCP + OAuth',
    note: '2026-06-16 完工 — 第 5 個平台串接，使用 Meta 官方 MCP（mcp.facebook.com/ads）。OAuth callback URL 流程 + 18 個 read-only tools。完成 4 平台 + 廣告 ETL 拼圖。',
    endpoints: [
      { method: 'MCP', path: 'mcp__meta-ads__ads_get_field_context', purpose: 'Pre-flight 欄位驗證（spend / purchase_roas 別名 + 可排序性）' },
      { method: 'MCP', path: 'mcp__meta-ads__ads_get_ad_entities', purpose: '核心：campaigns / adsets / ads + KPI（spend / ROAS / CTR / CPM）' },
      { method: 'MCP', path: 'mcp__meta-ads__ads_library_search', purpose: '競品 Ads Library 搜尋（外部雷達官用）' }
    ]
  }
];

const PIPELINE_STAGES = [
  { time: '08:40', stage: '4 通路取數', actor: 'Windows Task Scheduler', detail: 'Shopline + Shopee + MoMo + 蝦皮直營 並行抓取 → fill Sheet R-U 欄位' },
  { time: '08:42', stage: 'Meta 廣告取數 🆕', actor: 'Claude Code + Meta MCP', detail: '透過 mcp__meta-ads__ads_get_ad_entities 拉 yesterday 廣告組 → 過濾 + 脫敏 → 寫進 snapshot.json' },
  { time: '08:45', stage: '健檢', actor: 'check-session-health.js', detail: 'Shoplytics OTP age 監測，>2.5 天 LINE 預警，>4 天 LINE 紅燈' },
  { time: '10:20', stage: '日報生成', actor: 'daily-report.md skill', detail: '抓 Sheet 昨日數據 + Notion 三問 + Meta 紅旗 → 套燈號 → 產 3 份 Slack draft' },
  { time: '10:55', stage: '審稿', actor: '操盤手（人類）', detail: '人工 review 3 份 draft，確認語氣 / 數字 typo / 三問原文 — AI 給選項，人拍板' },
  { time: '11:00', stage: '發送', actor: '操盤手（人類）', detail: 'Slack 手動 Send（防 AI 代發踩雷）— 最後一道人工關卡' }
];

const DASHBOARD_PHILOSOPHY = [
  {
    stage: 1,
    icon: Database,
    title: '串聯不同地方的數據',
    detail: '5 個資料源（Shopline / Shopee / MoMo / 蝦皮直營 / Meta）統一進 snapshot.json，避免「組員每天手動匯 5 份 Excel」的痛點',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    stage: 2,
    icon: Search,
    title: '找出脈絡',
    detail: '揭示「廣告動作 → 品類反應」「週環比 → 成因」這種因果，不只是數字陳列。例：Meta 紅旗組 NT$40k / ROAS 0.02 → trace 到「LL10% lookalike 歸因設定」根因',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    stage: 3,
    icon: Sparkles,
    title: 'AI 產出高品質監測建議',
    detail: '套 cleanclean-pm + 6-perspectives + daren-mindset 三個 skill 產建議。例：「⛔ 暫停 RT_L1000」「✅ Top 5 RT 組下週預算 +30%」「🔍 提報 Pixel 歸因檢視」',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    stage: 4,
    icon: UserCheck,
    title: '輔助人工判定下一步',
    detail: 'AI 給選項 + 證據，最終決定權留給人。例：日報 3 份 Slack draft 一定要操盤手 review 完才 Send — 防 AI 代發踩雷',
    color: 'bg-sky-100 text-sky-700',
  },
];

const TECH_STACK = [
  { layer: '爬蟲層', items: ['Playwright + CDP connectOverCDP', 'Chrome remote debugging port 9222/9224/9226', 'Stealth plugin (fallback)', 'Auto-bootstrap (spawn chrome.exe)'] },
  { layer: 'MCP 層 🆕', items: ['Meta Ads MCP (mcp.facebook.com/ads)', 'Custom Remote HTTP MCP + OAuth callback', '18 個 read-only tools 一鍵呼叫', '~/.claude.json 全域 config'] },
  { layer: '排程層', items: ['Windows Task Scheduler', 'AtLogon + 10:20 daily', 'Health check at +1min', 'LINE Messaging API 主動預警'] },
  { layer: '資料層', items: ['Google Sheets API（4 平台主表）', 'Notion API（活動庫 + 三問）', 'Cloudflare KV（secret 儲存）', 'JSON snapshot（dashboard demo）'] },
  { layer: 'AI 層', items: ['Cloudflare Workers proxy', 'Claude Haiku 4.5 API', 'Skill prompt template (21 SOPs)', '業務脈絡防呆規則'] },
  { layer: '前端層', items: ['Vite + React + TypeScript', 'Tailwind 3.4 + shadcn/ui', 'Recharts 視覺化', 'GitHub Pages (gh-pages branch)'] }
];

export default function DataPipeline() {
  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Network className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">沉澱與信任 · 成長觀察員視角</p>
            <h1 className="text-3xl font-black tracking-tight">資料管線架構（過去工作沉澱）</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">
              一般電商 Dashboard 都靠手動上傳報表 — 我前 18 個月任職期間，用 <strong>Playwright + CDP 反偵測爬蟲</strong> 做了 4 平台全自動 ETL，每天 08:40 跑完取數。
              <strong className="text-primary">這頁展示「我能做出什麼樣的系統」</strong>，code 與 SOP 都是過去工作沉澱可重複用的能力 — 但離職後不再執行於前雇主平台（<a href="#/trust" className="text-primary underline">職業道德承諾</a>）。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold gap-1"><CheckCircle2 className="w-3 h-3" />Demo 展示</Badge>
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-bold">5 平台 · 過去實作</Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-bold">10 個 endpoint / tool</Badge>
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-bold">6 份 SOP Skill</Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-bold">🆕 Meta MCP 串接</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 🆕 儀表板 4 階段哲學（核心） */}
      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-amber-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">儀表板真實意義 — 4 階段</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              儀表板不是看板，是「<strong className="text-primary">串聯數據 → 找脈絡 → AI 監測建議 → 輔助人工判定</strong>」的決策輔助系統
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {DASHBOARD_PHILOSOPHY.map((p, i) => (
            <div key={p.stage} className="relative">
              <div className="card-soft p-4 h-full bg-white/60 border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', p.color)}>
                    <p.icon className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">Stage {p.stage}</div>
                </div>
                <h3 className="text-sm font-extrabold mb-2 tracking-tight">{p.title}</h3>
                <p className="text-[11px] text-foreground/75 leading-relaxed">{p.detail}</p>
              </div>
              {i < DASHBOARD_PHILOSOPHY.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 z-10" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-white/70 border border-border/40 text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">為什麼這 4 階段順序不能跳：</strong>
          沒有 Stage 1，AI 看到的數據不完整；沒有 Stage 2，AI 只會講 KPI 不會講故事；沒有 Stage 3，人類要自己想，dashboard 就退化成 Excel；沒有 Stage 4，AI 變獨裁者，會有「代發 Slack 訊息」這種風險。
        </div>
      </section>

      {/* vs 老闆 dashboard：誠實 inspired-by + 3 點差異化 */}
      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-amber-50/30 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight">與前公司老闆 dashboard 的差異化</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              <strong>誠實聲明</strong>：老闆 dashboard 是 inspiration（我們確實大量參考它的 UI 風格）。下方明確列出我做了什麼加值。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 老闆 dashboard 有的 */}
          <div className="card-soft p-4 bg-stone-50/40 border-stone-200/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-2">📊 老闆 dashboard 既有</p>
            <ul className="space-y-1.5 text-[11px] text-foreground/80">
              <li className="flex gap-1.5"><span>•</span><span>Google Sheets + Apps Script 自動同步</span></li>
              <li className="flex gap-1.5"><span>•</span><span>3 通路 KPI 卡（業績 / 流量 / 轉換）</span></li>
              <li className="flex gap-1.5"><span>•</span><span>近 7 天 vs 前 7 天週環比</span></li>
              <li className="flex gap-1.5"><span>•</span><span>紅黃綠燈標記</span></li>
              <li className="flex gap-1.5"><span>•</span><span>每月報表卡（1-5 月）</span></li>
            </ul>
          </div>

          {/* inspired-by 但加值 */}
          <div className="card-soft p-4 bg-primary/5 border-primary/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">🎯 我加值的 5 點</p>
            <ul className="space-y-1.5 text-[11px] text-foreground/80">
              <li className="flex gap-1.5"><span>1.</span><span><strong>4 階段哲學</strong>（串聯 → 脈絡 → AI 建議 → 輔助判定）</span></li>
              <li className="flex gap-1.5"><span>2.</span><span><strong>Meta 官方 MCP</strong> 真實串接（老闆版沒有）</span></li>
              <li className="flex gap-1.5"><span>3.</span><span><strong>4 平台 ETL</strong>（蝦皮直營老闆版沒納入）</span></li>
              <li className="flex gap-1.5"><span>4.</span><span><strong>AI trace ID</strong>（每條分析連回活動 / 廣告動作）</span></li>
              <li className="flex gap-1.5"><span>5.</span><span><strong>命名規則 SOP</strong>（漏斗 5 層命名 convention）</span></li>
            </ul>
          </div>

          {/* 自己獨有的 */}
          <div className="card-soft p-4 bg-emerald-50/40 border-emerald-200/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-2">🚀 完全原創的 4 點</p>
            <ul className="space-y-1.5 text-[11px] text-foreground/80">
              <li className="flex gap-1.5"><span>1.</span><span><strong>6 切角 PM 思考框架</strong>（對應老闆 9 字方針）</span></li>
              <li className="flex gap-1.5"><span>2.</span><span><strong>21 份 SOP</strong>（含老闆 dashboard 沒有的踩雷沉澱）</span></li>
              <li className="flex gap-1.5"><span>3.</span><span><strong>解題進度看板</strong>（不只找問題、追蹤已解 vs 待解）</span></li>
              <li className="flex gap-1.5"><span>4.</span><span><strong>Trust 信任聲明頁</strong>（主動披露 Demo Only）</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-white/60 border border-border/40 text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">為什麼這個誠實聲明對你有利：</strong>
          一個願意承認 inspired-by 又能講清楚自己加值在哪的求職者，比聲稱「100% 自己想的」更可信。
          這代表 (1) 我懂得分辨 reference vs original，(2) 我能在既有架構上做有意義的迭代，
          (3) 我到貴司後也會這樣對待你既有的工具 —— 先承認、再加值，不是推倒重來。
        </div>
      </section>

      {/* 4 平台爬蟲架構 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          4 平台 Network 反向工程
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="card-soft p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', p.color)}>
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{p.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{p.skill}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  'text-[10px] font-bold',
                  p.difficulty === '高' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                )}>
                  難度 {p.difficulty}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold mb-1">認證機制</p>
                <p className="text-xs font-mono bg-secondary/40 rounded px-2 py-1.5">{p.auth}</p>
              </div>
              <div className="rounded-lg bg-amber-50/40 border border-amber-100 p-3">
                <p className="text-xs leading-relaxed text-foreground/85">⚠ {p.note}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold mb-1.5">關鍵 endpoint</p>
                <div className="space-y-1.5">
                  {p.endpoints.map((e: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <Badge variant="outline" className={cn(
                        'text-[9px] font-bold shrink-0 font-mono',
                        e.method === 'GET' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        e.method === 'POST' && 'bg-blue-50 text-blue-700 border-blue-200'
                      )}>{e.method}</Badge>
                      <code className="font-mono text-[10px] text-foreground/80 break-all">{e.path}</code>
                    </div>
                  ))}
                  <ul className="text-[10px] text-muted-foreground mt-1 pl-2 space-y-0.5">
                    {p.endpoints.map((e: any, i: number) => (
                      <li key={i}>— {e.purpose}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Pipeline */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            每日全自動流程（08:40 → 11:00）
          </h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-bold">📋 SOP Chain</Badge>
        </div>
        <div className="space-y-3">
          {PIPELINE_STAGES.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="font-mono text-xs text-muted-foreground shrink-0 w-14 pt-1.5">{s.time}</div>
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm">{s.stage}</p>
                  <Badge variant="outline" className="text-[10px] font-mono">{s.actor}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          完整技術棧
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {TECH_STACK.map((t) => (
            <div key={t.layer} className="rounded-xl border border-border/60 p-4 space-y-2">
              <Badge variant="outline" className="text-[10px] font-bold">{t.layer}</Badge>
              <ul className="space-y-1 mt-2">
                {t.items.map((it, i) => (
                  <li key={i} className="text-[11px] text-foreground/85 flex gap-1.5 leading-relaxed">
                    <span className="text-primary mt-0.5">▸</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 踩雷沉澱 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-bold">踩雷沉澱（all in skill 內）</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { issue: '.cmd LF 會 exit 255', fix: 'Windows 批次檔必須 CRLF 行尾，否則 schtasks 觸發直接死。沉澱進 shopline-api.md.' },
            { issue: 'shopee Playwright 全被擋', fix: 'fingerprint 太精準。改 connectOverCDP 連背景真實 Chrome 才繞過。' },
            { issue: 'MoMo JSESSIONID 一關 Chrome 就死', fix: 'session-only cookie 無法持久化。背景 Chrome (port 9224) 必須長時間 alive。' },
            { issue: 'Shoplytics SSO 2-5 天過期', fix: 'OTP age 監測 + LINE 主動預警。寫進 check-session-health.js + AtLogon +1min 排程。' },
            { issue: 'spawn cmd.exe + netstat\\|findstr 卡死', fix: 'stdio:"ignore" 下 pipe 會死鎖。改 spawn chrome.exe 直接跳過 cmd 層。' },
            { issue: 'schtasks /sc onlogon sandbox 內 access denied', fix: 'AtLogon 任務需 Admin 權限。寫 fix-atlogon-task.cmd 讓 user 手動執行一次。' }
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-4 space-y-1.5">
              <p className="text-sm font-bold text-amber-900">{i + 1}. {t.issue}</p>
              <p className="text-xs text-amber-800/80 leading-relaxed">→ {t.fix}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
