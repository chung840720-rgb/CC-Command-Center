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
