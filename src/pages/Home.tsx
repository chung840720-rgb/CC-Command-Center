import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChannelCard } from '@/components/dashboard/ChannelCard';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import {
  Eye,
  AlertTriangle,
  Rocket,
  Brain,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ClipboardCopy,
  Send,
  Target,
  RefreshCw,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

const FOUR_PILLARS = [
  { key: 'see', icon: Eye, title: '看戰情', perspective: '數據觀測員', desc: '看清楚現況 — 跨通路 KPI、目標達成、ROAS、缺口', to: '/shopline', color: 'emerald' },
  { key: 'find', icon: AlertTriangle, title: '找問題', perspective: '策略軍師 + 外部雷達官', desc: '哪裡漏血、哪裡可加碼 — 異常、AI 建議、競品雷達', to: '/alerts', color: 'amber' },
  { key: 'act', icon: Rocket, title: '做行動', perspective: '執行操盤手', desc: '撥動品類貢獻 — 廣告、活動、商品執行', to: '/category', color: 'violet' },
  { key: 'learn', icon: Brain, title: '沉澱迭代', perspective: '成長觀察員', desc: 'SOP、管線、迭代軌跡', to: '/skills', color: 'sky' },
];

const PILLAR_COLOR: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200',
  amber:   'bg-amber-100 text-amber-700 group-hover:bg-amber-200',
  violet:  'bg-violet-100 text-violet-700 group-hover:bg-violet-200',
  sky:     'bg-sky-100 text-sky-700 group-hover:bg-sky-200',
};

const PLATFORM_COLOR: Record<string, string> = {
  shopline:     'bg-amber-500',
  shopee:       'bg-orange-500',
  momo:         'bg-red-500',
  shopeeDirect: 'bg-violet-500',
};

const PLATFORM_LABEL: Record<string, string> = {
  shopline: '官網',
  shopee: '蝦皮',
  momo: 'MoMo',
  shopeeDirect: '直營',
};

const PLATFORM_FETCH_STAGES = [
  { platform: 'Shopline',  emoji: '🌐', detail: 'Playwright + Shoplytics 內部 API' },
  { platform: 'Shopee',    emoji: '🦐', detail: '背景 Chrome + CDP key-metrics' },
  { platform: 'MoMo',      emoji: '🏬', detail: '背景 Chrome + JSESSIONID 保活' },
  { platform: '蝦皮直營',   emoji: '⚡', detail: '蝦皮商城同套架構' },
  { platform: 'Meta 廣告', emoji: '📘', detail: 'Meta MCP ads_get_ad_entities' },
];

export default function Home() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [activeMonthIdx, setActiveMonthIdx] = useState(4);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('2026-06-16 02:40');

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setCurrentStage(0);

    for (let i = 0; i < PLATFORM_FETCH_STAGES.length; i++) {
      setCurrentStage(i);
      await new Promise((r) => setTimeout(r, 800));
    }

    setIsUpdating(false);
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLastUpdate(ts);

    toast.success('5 平台數據更新完成', {
      description: '📡 Shopline + 🦐 Shopee + 🏬 MoMo + ⚡ 直營 + 📘 Meta · Demo 模式（真實版觸發爬蟲 + Meta MCP → 寫 snapshot → 自動部署）',
      duration: 6000,
    });
  };

  if (!data) return <Skeleton className="h-screen w-full rounded-3xl" />;

  const monthKey = MONTHS[activeMonthIdx];
  const monthTotal = (data as any).monthlyTotal?.[monthKey];
  const kpi = monthTotal
    ? { monthlyGmv: { value: monthTotal.gmv, target: monthTotal.target, achievement: monthTotal.achievement },
        ytdGmv: data.kpi.ytdGmv, monthlyOrders: monthTotal.orders, roas: monthTotal.roas, adSpend: monthTotal.adSpend }
    : data.kpi;

  const channels = data.channels.map((c: any) => {
    const m = (data as any).monthlyByPlatform?.[c.id]?.[monthKey];
    if (!m) return c;
    return { ...c, monthlyGmv: m.gmv, achievement: m.achievement, roas: m.roas, orders: m.orders, ytdShare: m.sharePct };
  });

  const wow = (data as any).weekOverWeek;
  const cc = (data as any).categoryContribution;
  const today = (data as any).todayTasks;
  const golden = (data as any).goldenTriangle;
  const boss = (data as any).bossReport;
  const campaignMaster = (data as any).campaignMaster || [];
  const isLow = kpi.monthlyGmv.achievement < 80;

  const findCampaign = (id: string) => campaignMaster.find((c: any) => c.id === id);

  return (
    <div className="space-y-6">
      <SopBadge skills={[
        { name: 'cleanclean-pm.md', version: 'v7.3' },
        { name: '6-perspectives.md', version: 'v1.0' },
        { name: 'daren-mindset.md', version: 'v1.0' },
      ]} />

      {/* ━━━ Hero（精簡）━━━ */}
      <section className="hero-gradient rounded-3xl border border-white/60 shadow-[0_4px_30px_-8px_rgba(176,144,111,0.18)] overflow-hidden p-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            <Badge variant="outline" className="bg-white/70 backdrop-blur rounded-full font-semibold text-xs gap-1.5 py-1 px-3 shadow-sm border-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              6 切角 PM 工作框架 · Johnny
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-primary via-amber-400 to-amber-500 bg-clip-text text-transparent">{monthKey}戰況</span>
              <span className="text-foreground">．{formatCurrency(kpi.monthlyGmv.value)}</span>
            </h1>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">
                2025 線上通路 <strong className="text-emerald-600 font-extrabold">YoY +24%</strong>．蝦皮通路 <strong className="text-emerald-600 font-extrabold">+117%</strong>．訂單 {formatNumber(kpi.monthlyOrders)} 筆．ROAS {kpi.roas}x
              </p>
              <p className="text-[11px] text-muted-foreground/85">
                {monthKey} MTD 達成 <strong className={cn('font-bold', isLow ? 'text-amber-600' : 'text-emerald-600')}>{kpi.monthlyGmv.achievement}%</strong>
                ．目標 {formatCurrency(kpi.monthlyGmv.target)}．月底預估 94% 結案（含 618 主檔）
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            {/* 更新數據按鈕 */}
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className={cn(
                'h-10 px-4 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-end',
                isUpdating
                  ? 'bg-white/80 text-muted-foreground cursor-wait'
                  : 'bg-primary text-primary-foreground hover:shadow-md hover:scale-[1.02]'
              )}
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isUpdating && 'animate-spin')} />
              {isUpdating
                ? `更新中：${PLATFORM_FETCH_STAGES[currentStage]?.emoji} ${PLATFORM_FETCH_STAGES[currentStage]?.platform}...`
                : '🔄 更新昨日數據'}
            </button>
            <p className="text-[10px] text-muted-foreground self-end flex items-center gap-1">
              <Database className="w-2.5 h-2.5" />
              上次更新：{lastUpdate}
            </p>

            <div className="grid grid-cols-6 gap-1.5">
              {MONTHS.map((m, i) => {
                const hasData = !!(data as any).monthlyTotal?.[m];
                const isActive = i === activeMonthIdx;
                return (
                  <button
                    key={m}
                    onClick={() => setActiveMonthIdx(i)}
                    className={cn(
                      'h-8 px-3 rounded-full text-xs font-semibold transition-colors',
                      isActive ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                      : hasData ? 'bg-white/70 text-foreground hover:bg-white'
                      : 'bg-white/30 text-muted-foreground/60'
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5 平台 fetch 進度條（更新中才顯示） */}
        {isUpdating && (
          <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-white/80 backdrop-blur">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">5 平台 ETL 串聯中</p>
            <div className="space-y-1.5">
              {PLATFORM_FETCH_STAGES.map((p, i) => (
                <div key={p.platform} className="flex items-center gap-3 text-xs">
                  <span className="w-5">{i < currentStage ? '✅' : i === currentStage ? '⏳' : '⏸'}</span>
                  <span className="w-8">{p.emoji}</span>
                  <span className={cn('font-bold w-20', i === currentStage && 'text-primary')}>{p.platform}</span>
                  <span className="text-muted-foreground text-[10px]">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="h-2 rounded-full bg-white/50 overflow-hidden">
            <div className={cn('h-full rounded-full', isLow ? 'bg-gradient-to-r from-red-300 to-red-500' : 'bg-gradient-to-r from-primary to-amber-400')} style={{ width: `${Math.min(kpi.monthlyGmv.achievement, 100)}%` }} />
          </div>
        </div>
      </section>

      {/* ━━━ P0-1：今日該做什麼（連結活動 ID）━━━ */}
      {today && (
        <section className="card-soft p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                ⚡ 今日該做什麼
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {today.date}（{today.weekday}）· 距離下次月會 {today.daysUntilMonthlyReview} 天 · 連結到 [做行動 → 活動規劃] 進行中專案
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {today.tasks.map((t: any) => {
              const linked = findCampaign(t.linkedCampaign);
              return (
                <div key={t.priority} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                    {t.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-sm font-extrabold">{t.title}</p>
                      <Badge variant="outline" className="text-[9px] bg-secondary/60 font-bold">{t.perspective}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.detail}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-[10px]">
                      {linked && (
                        <Link to="/campaign" className="text-violet-600 hover:underline font-bold">
                          📋 連結活動：{linked.id} {linked.name}
                        </Link>
                      )}
                      <span className="text-muted-foreground">📖 SOP：{t.sopRef}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━ P0-2：黃金三指標（流量 × 客單價 × 轉換率）━━━ */}
      {golden && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                🎯 黃金三指標
              </h2>
              <p className="text-xs text-muted-foreground mt-1">{golden.description}</p>
            </div>
            <DateRangeSwitcher value="last7" compact />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="py-2.5 pr-3 font-bold">平台</th>
                  <th className="py-2.5 px-2 text-right font-bold">👥 流量</th>
                  <th className="py-2.5 px-2 text-right font-bold">🛒 客單價</th>
                  <th className="py-2.5 px-2 text-right font-bold">🔄 轉換率</th>
                  <th className="py-2.5 pl-2 text-right font-bold">🎯 目標 CR</th>
                </tr>
              </thead>
              <tbody>
                {golden.platforms.map((p: any) => {
                  const alert = p.alert === 'cr-low';
                  return (
                    <tr key={p.id} className="border-b border-border/40 hover:bg-secondary/30">
                      <td className="py-3 pr-3 font-bold">{p.label}</td>
                      <td className="py-3 px-2 text-right font-mono">{formatNumber(p.traffic)}</td>
                      <td className="py-3 px-2 text-right font-mono">{formatCurrency(p.aov)}</td>
                      <td className={cn('py-3 px-2 text-right font-mono font-extrabold', alert ? 'text-red-500' : 'text-emerald-600')}>
                        {p.cr}%
                        {alert && ' ⚠️'}
                      </td>
                      <td className="py-3 pl-2 text-right font-mono text-muted-foreground">{p.target.cr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-amber-50/60 border border-amber-200/40 text-xs leading-relaxed">
            <span className="font-bold">💡 AI 判讀：</span>{golden.insight}
          </div>
        </section>
      )}

      {/* ━━━ P0-3：老闆三行回報草稿（套 daren-mindset）━━━ */}
      {boss && (
        <section className="card-soft p-6 bg-gradient-to-br from-stone-50/60 to-amber-50/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                📩 老闆三行回報（AI 草稿）
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {boss.draftFor}．基於 [{boss.basedOn.join(', ')}] 自動產生．套 {boss.sopRef}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const text = `${boss.draft.conclusion}\n${boss.draft.status}\n${boss.draft.next}\nJohnny`;
                navigator.clipboard?.writeText(text);
                toast.success('已複製到剪貼簿，可直接貼 Slack DM 給老闆');
              }}
              className="gap-1.5"
            >
              <ClipboardCopy className="w-3.5 h-3.5" />
              複製草稿
            </Button>
          </div>
          <div className="space-y-2 bg-white/70 rounded-xl p-4 border border-border/40 font-mono text-sm">
            <p>老闆，</p>
            <p className="text-foreground/85">{boss.draft.conclusion}</p>
            <p className="text-foreground/85">{boss.draft.status}</p>
            <p className="text-foreground/85">{boss.draft.next}</p>
            <p>Johnny</p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            草稿原則：結論先行 · 3 行內 · 有數字 · 有 AI 應用佐證（{boss.draftedAt}）
          </p>
        </section>
      )}

      {/* ━━━ 智慧數據分析（通路週環比 + AI 內嵌 + Trace）━━━ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">📊 智慧數據分析</h2>
            <p className="text-xs text-muted-foreground mt-1">近 7 天 vs 前 7 天．AI 建議皆 trace 到具體活動/廣告 ID</p>
          </div>
          <DateRangeSwitcher value="last7" compact />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {channels.map((c) => (
            <ChannelCard key={c.id} channel={c} weekData={wow?.[c.id]} />
          ))}
        </div>
      </section>

      {/* ━━━ 品類貢獻度（含 trace 到活動 ID）━━━ */}
      {cc && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">🏷️ 品類貢獻度</h2>
              <p className="text-xs text-muted-foreground mt-1">廣告動作 → 品類反應 — 每條 AI 分析都 trace 到活動 ID</p>
            </div>
            <DateRangeSwitcher value="last7" compact />
          </div>

          <div className="card-soft p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-3">
              本週 5 大品類業績組成（NT${formatNumber(cc.categories.reduce((s: number, c: any) => s + c.totalGmv, 0))}）
            </p>
            <div className="flex h-10 rounded-xl overflow-hidden border border-border/40">
              {cc.categories.map((cat: any, i: number) => (
                <div key={cat.name}
                  className={cn('flex items-center justify-center text-[11px] font-bold text-white transition-all hover:opacity-90',
                    ['bg-primary', 'bg-amber-500', 'bg-orange-400', 'bg-rose-400', 'bg-stone-400'][i % 5])}
                  style={{ width: `${cat.sharePct}%` }}>
                  {cat.sharePct >= 10 ? `${cat.icon} ${cat.sharePct}%` : cat.sharePct + '%'}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-muted-foreground">
              {cc.categories.map((cat: any) => (
                <span key={cat.name} className="flex items-center gap-1">
                  <span>{cat.icon}</span>
                  <span className="font-bold text-foreground">{cat.name}</span>
                  <span>NT${formatNumber(cat.totalGmv)}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cc.categories.map((cat: any) => {
              const up = cat.wowPct >= 0;
              const linkedCampaigns = (cat.traceTo || []).filter((id: string) => id.startsWith('C-')).map((id: string) => findCampaign(id)).filter(Boolean);
              return (
                <div key={cat.name} className="card-soft p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="text-2xl">{cat.icon}</div>
                      <div>
                        <h3 className="text-base font-extrabold tracking-tight">{cat.name}</h3>
                        <p className="text-[10px] text-muted-foreground">總業績 NT${formatNumber(cat.totalGmv)}．占 {cat.sharePct}%</p>
                      </div>
                    </div>
                    <div className={cn('text-right', up ? 'text-emerald-600' : 'text-red-500')}>
                      <div className="flex items-center gap-0.5 font-extrabold text-base">
                        {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {up ? '+' : ''}{cat.wowPct}%
                      </div>
                      <p className="text-[9px] text-muted-foreground">週環比</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {Object.entries(cat.platforms).map(([key, val]: any) => {
                      const widthPct = (val / cat.totalGmv) * 100;
                      return (
                        <div key={key} className="grid grid-cols-[40px_1fr_60px] items-center gap-2 text-[10px]">
                          <span className="text-muted-foreground">{PLATFORM_LABEL[key]}</span>
                          <div className="h-2.5 bg-secondary rounded overflow-hidden">
                            <div className={cn('h-full rounded', PLATFORM_COLOR[key])} style={{ width: `${widthPct}%` }} />
                          </div>
                          <span className="font-bold text-right">{Math.round(widthPct)}%</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-secondary/40 rounded-lg p-3 space-y-1.5 text-[11px]">
                    <div className="flex gap-1.5">
                      <span className="shrink-0 text-violet-600 font-bold">📣 廣告動作：</span>
                      <span className="text-foreground/85">{cat.adAction}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="shrink-0 text-emerald-600 font-bold">📈 品類反應：</span>
                      <span className="text-foreground/85">{cat.reaction}</span>
                    </div>
                    {linkedCampaigns.length > 0 && (
                      <div className="pt-1.5 border-t border-border/40 flex items-center gap-1.5 text-[10px]">
                        <Link to="/campaign" className="text-violet-600 hover:underline font-bold flex items-center gap-1">
                          📋 trace to {linkedCampaigns.map((c: any) => c.id).join(', ')}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━ 月份業績彙整 ━━━ */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">📋 {monthKey} 各平台業績彙整</h2>
            <p className="text-xs text-muted-foreground mt-1">月度跨平台一覽表</p>
          </div>
          <DateRangeSwitcher value="last30" compact />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="py-2 pr-3 font-bold">平台</th>
                <th className="py-2 px-2 text-right font-bold">累計業績</th>
                <th className="py-2 px-2 text-right font-bold">達成率</th>
                <th className="py-2 px-2 text-right font-bold">占比</th>
                <th className="py-2 px-2 text-right font-bold">ROAS</th>
                <th className="py-2 px-2 text-right font-bold">廣告花費</th>
                <th className="py-2 pl-2 text-right font-bold">客單價</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/30">
                  <td className="py-3 pr-3 font-bold">{c.label}</td>
                  <td className="py-3 px-2 text-right font-mono">{formatCurrency(c.monthlyGmv)}</td>
                  <td className={cn('py-3 px-2 text-right font-mono font-bold', c.achievement < 80 ? 'text-red-500' : 'text-emerald-600')}>{c.achievement}%</td>
                  <td className="py-3 px-2 text-right font-mono">{c.ytdShare}%</td>
                  <td className="py-3 px-2 text-right font-mono">{c.roas}x</td>
                  <td className="py-3 px-2 text-right font-mono text-muted-foreground">{formatCurrency((c as any).adSpend || Math.round(c.monthlyGmv / c.roas))}</td>
                  <td className="py-3 pl-2 text-right font-mono">{formatCurrency(Math.round(c.monthlyGmv / c.orders))}</td>
                </tr>
              ))}
              <tr className="bg-primary/5 font-bold">
                <td className="py-3 pr-3">全平台</td>
                <td className="py-3 px-2 text-right font-mono">{formatCurrency(kpi.monthlyGmv.value)}</td>
                <td className={cn('py-3 px-2 text-right font-mono', isLow ? 'text-red-500' : 'text-emerald-600')}>{kpi.monthlyGmv.achievement}%</td>
                <td className="py-3 px-2 text-right font-mono">100%</td>
                <td className="py-3 px-2 text-right font-mono">{kpi.roas}x</td>
                <td className="py-3 px-2 text-right font-mono">{formatCurrency(kpi.adSpend)}</td>
                <td className="py-3 pl-2 text-right font-mono">{formatCurrency(Math.round(kpi.monthlyGmv.value / kpi.monthlyOrders))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ━━━ 6 切角入口 ━━━ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">6 切角 PM 工作流</h2>
          <p className="text-xs text-muted-foreground mt-1">看戰情 → 找問題 → 做行動 → 沉澱迭代</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {FOUR_PILLARS.map((p) => (
            <Link key={p.key} to={p.to} className="group card-soft p-5 hover:shadow-md hover:border-primary/30 transition-all">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors', PILLAR_COLOR[p.color])}>
                <p.icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <p className="font-extrabold text-base mb-1.5 group-hover:text-primary transition-colors">{p.title}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">{p.perspective}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                進入 <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
