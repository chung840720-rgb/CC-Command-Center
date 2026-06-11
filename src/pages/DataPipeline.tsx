import { Network, Globe, ShoppingBag, Store, Target, Cloud, Code, Zap, AlertCircle, CheckCircle2, GitBranch, Activity } from 'lucide-react';
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
  }
];

const PIPELINE_STAGES = [
  { time: '08:40', stage: '取數', actor: 'Windows Task Scheduler', detail: '4 平台 Playwright + CDP 並行抓取 → fill Sheet R-U 欄位' },
  { time: '08:45', stage: '健檢', actor: 'check-session-health.js', detail: 'Shoplytics OTP age 監測，>2.5 天 LINE 預警，>4 天 LINE 紅燈' },
  { time: '10:20', stage: '日報', actor: 'daily-report.md skill', detail: '抓 Sheet 昨日數據 + Notion 三問 → 套燈號 → 產 3 份 Slack draft' },
  { time: '10:55', stage: '審稿', actor: '操盤手', detail: '人工 review 3 份 draft，確認語氣 / 數字 typo / 三問原文' },
  { time: '11:00', stage: '發送', actor: '操盤手', detail: 'Slack 手動 Send（防 AI 代發踩雷）' }
];

const TECH_STACK = [
  { layer: '爬蟲層', items: ['Playwright + CDP connectOverCDP', 'Chrome remote debugging port 9222/9224/9226', 'Stealth plugin (fallback)', 'Auto-bootstrap (spawn chrome.exe)'] },
  { layer: '排程層', items: ['Windows Task Scheduler', 'AtLogon + 10:20 daily', 'Health check at +1min', 'LINE Messaging API 主動預警'] },
  { layer: '資料層', items: ['Google Sheets API（4 平台主表）', 'Notion API（活動庫 + 三問）', 'Cloudflare KV（secret 儲存）', 'JSON snapshot（dashboard demo）'] },
  { layer: 'AI 層', items: ['Cloudflare Workers proxy', 'Claude Haiku 4.5 API', 'Skill prompt template (20 SOPs)', '業務脈絡防呆規則'] },
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
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">資料與設定</p>
            <h1 className="text-3xl font-black tracking-tight">資料管線架構</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">
              一般電商 Dashboard 都靠手動上傳報表 — 我的 4 平台全自動 ETL 用 <strong>Playwright + CDP 反偵測爬蟲</strong>，每天 08:40 跑完取數，視覺化只是最後一哩。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold gap-1"><CheckCircle2 className="w-3 h-3" />全自動</Badge>
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-bold">4 平台</Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-bold">7 個 endpoint</Badge>
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-bold">5 份 SOP Skill</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 我的差異化 vs 老闆 dashboard */}
      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-accent/30 border-primary/20">
        <div className="flex gap-3">
          <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary mb-1.5">為什麼這個架構有差異化價值</p>
            <p className="text-sm leading-relaxed text-foreground/85">
              絕大多數電商 BI 工具的「自動同步」是<strong>從 SaaS 公開 API 拉</strong>，但 Shopline / 蝦皮 / MoMo 都沒給開發者完整 API（蝦皮直營更是無 API）。
              一般做法是「組員每天手動匯出 Excel」。我用 <strong>F12 反向工程 + Playwright + CDP 連背景真實 Chrome</strong> 繞過所有 fingerprint 偵測，
              4 平台全自動抓 — 這就是「會用 AI」與「能讓 AI 真正落地到電商工作」的差距。
            </p>
          </div>
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
