import { useState } from 'react';
import {
  Link2,
  ArrowRight,
  Leaf,
  Megaphone,
  Trophy,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, cn } from '@/lib/utils';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

interface Props {
  data: any;
  monthlyData?: Record<string, any>;
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconColor?: 'amber' | 'orange' | 'red' | 'violet';
}

const ICON_BG = {
  amber: 'bg-amber-100 text-amber-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  violet: 'bg-violet-100 text-violet-700',
};

export function PlatformDetailView({ data: sdRaw, monthlyData, title, icon: Icon, iconColor = 'amber' }: Props) {
  const [activeMonthIdx, setActiveMonthIdx] = useState(4);

  if (!sdRaw) return <Skeleton className="h-96 rounded-2xl" />;

  const monthKey = MONTHS[activeMonthIdx];
  const mData = monthlyData?.[monthKey];

  const sd = mData ? {
    ...sdRaw,
    monthlyGmv: mData.gmv,
    target: mData.target,
    achievement: mData.achievement,
    achievementStatus: mData.achievement >= 100 ? '達標' : mData.achievement >= 80 ? '符合節奏' : '落後',
    monthlyOrders: mData.orders,
    monthlyAov: mData.aov,
    monthlyTraffic: mData.traffic,
    monthlyAdSpend: mData.adSpend,
    monthlyRoas: mData.roas,
  } : sdRaw;

  const organic = sd.split?.organic;
  const paid = sd.split?.paid;
  const isLow = sd.achievement < 80;

  return (
    <div className="space-y-5">
      {/* ━━━ Section 1: Header + 業績總覽 ━━━ */}
      <section className="card-soft p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5 justify-between mb-5">
          <div className="flex gap-4 flex-1">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', ICON_BG[iconColor])}>
              <Icon className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black tracking-tight">{title}</h1>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                {sd.url}
              </p>
            </div>
          </div>
          <div className="shrink-0 grid grid-cols-6 gap-1.5">
            {MONTHS.map((m, i) => {
              const hasData = !!monthlyData?.[m];
              const isActive = i === activeMonthIdx;
              return (
                <button
                  key={m}
                  onClick={() => setActiveMonthIdx(i)}
                  className={cn(
                    'h-7 px-2.5 rounded-full text-[11px] font-semibold transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                      : hasData
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-secondary/30 text-muted-foreground/50'
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 KPI: GMV / 達成率 / 訂單 / AOV */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiTile label={`${monthKey}業績`} value={`NT$${formatNumber(sd.monthlyGmv)}`} sub={`目標 NT$${formatNumber(sd.target)}`} />
          <KpiTile
            label="目標達成"
            value={`${sd.achievement}%`}
            sub={isLow ? `落後 ${(80 - sd.achievement).toFixed(0)}pp` : '符合節奏'}
            highlight={isLow ? 'red' : 'green'}
          />
          <KpiTile label="月訂單" value={`${formatNumber(sd.monthlyOrders || 0)} 筆`} />
          <KpiTile label="客單價" value={`NT$${formatNumber(sd.monthlyAov || 0)}`} />
        </div>

        {/* 達成率 bar */}
        <div className="mt-5">
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full',
                isLow ? 'bg-gradient-to-r from-red-300 to-red-500' : 'bg-gradient-to-r from-primary to-amber-400'
              )}
              style={{ width: `${Math.min(sd.achievement, 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* ━━━ Section 2: 自然流量 ━━━ */}
      {organic && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">自然流量</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">不靠廣告的免費業績 — 反映品牌力與 CRM 深耕</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs font-bold">
              占 {organic.sharePct}%
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <KpiTile label="自然訪客" value={formatNumber(organic.uv)} accent="emerald" />
            <KpiTile label="自然訂單" value={`${formatNumber(organic.orders)} 筆`} accent="emerald" />
            <KpiTile label="自然 GMV" value={`NT$${formatNumber(organic.gmv)}`} accent="emerald" />
            <KpiTile label="自然 AOV" value={`NT$${formatNumber(organic.aov)}`} accent="emerald" />
          </div>

          {sd.organicSources && (
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">流量來源拆解</p>
              <div className="space-y-2">
                {sd.organicSources.map((src: any) => (
                  <div key={src.name} className="grid grid-cols-[130px_1fr_50px] items-center gap-3">
                    <span className="text-xs text-foreground">{src.name}</span>
                    <div className="h-5 rounded bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded" style={{ width: `${src.share * 2}%` }} />
                    </div>
                    <span className="text-xs font-bold text-right">{src.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ━━━ Section 3: 付費流量 ━━━ */}
      {paid && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Megaphone className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">付費流量</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">廣告投放帶來的業績 — 效率 = ROAS 與 CPA</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-xs font-bold">
              占 {paid.sharePct}%
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <KpiTile label="廣告花費" value={`NT$${formatNumber(paid.spend)}`} accent="violet" />
            <KpiTile label="付費訂單" value={`${formatNumber(paid.orders)} 筆`} accent="violet" />
            <KpiTile
              label="ROAS"
              value={`${paid.roas}x`}
              sub={paid.roas >= 3 ? '健康' : paid.roas >= 2 ? '可接受' : '需檢討'}
              highlight={paid.roas >= 3 ? 'green' : paid.roas >= 2 ? undefined : 'red'}
              accent="violet"
            />
            <KpiTile label="CPA" value={`NT$${formatNumber(paid.cpa)}`} accent="violet" />
          </div>

          {sd.paidChannels && (
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">廣告通路效率</p>
              <div className="space-y-2">
                {sd.paidChannels.map((ch: any) => {
                  const healthy = ch.roas >= 2.5;
                  return (
                    <div key={ch.name} className="flex items-center justify-between p-3 rounded-lg bg-violet-50/40 border border-violet-100/40">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{ch.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">花費 NT${formatNumber(ch.spend)} · 占廣告預算 {ch.share}%</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn('text-base font-extrabold', healthy ? 'text-emerald-600' : 'text-amber-600')}>
                          {ch.roas}x
                        </span>
                        {healthy ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-amber-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ━━━ Section 4: 熱銷 Top 5 ━━━ */}
      {sd.topProducts && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">本月熱銷 Top 5</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">看 SKU 集中度 · 是否倚賴單一商品</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
              <Link to="/insights">看 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
            </Button>
          </div>
          <div className="space-y-2">
            {sd.topProducts.slice(0, 5).map((p: any, i: number) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <div className="h-1.5 rounded-full bg-secondary mt-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" style={{ width: `${p.share * 2.5}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold">NT${formatNumber(p.gmv)}</p>
                  <p className="text-[10px] text-muted-foreground">佔 {p.share}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* YTD 小區塊（次要資訊收底）*/}
      {sd.ytd && (
        <section className="card-soft p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-muted-foreground">YTD 年度累計</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-sm">
              <p className="text-[10px] text-muted-foreground">累計業績</p>
              <p className="font-extrabold mt-0.5">NT${formatNumber(sd.ytd.gmv)}</p>
            </div>
            <div className="text-sm">
              <p className="text-[10px] text-muted-foreground">累計達成</p>
              <p className="font-extrabold text-primary mt-0.5">{sd.ytd.achievement}%</p>
            </div>
            <div className="text-sm">
              <p className="text-[10px] text-muted-foreground">累計訂單</p>
              <p className="font-extrabold mt-0.5">{formatNumber(sd.ytd.orders)} 筆</p>
            </div>
            <div className="text-sm">
              <p className="text-[10px] text-muted-foreground">年度目標缺口</p>
              <p className="font-extrabold text-red-500 mt-0.5">NT${formatNumber(sd.ytd.gap)}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function KpiTile({
  label, value, sub, highlight, accent
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'red' | 'green';
  accent?: 'emerald' | 'violet';
}) {
  const accentBg = accent === 'emerald' ? 'bg-emerald-50/40 border-emerald-100/50'
                 : accent === 'violet' ? 'bg-violet-50/40 border-violet-100/50'
                 : 'bg-secondary/40 border-border';
  return (
    <div className={cn('rounded-xl px-4 py-3.5 border', accentBg)}>
      <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">{label}</p>
      <p className={cn(
        'text-xl font-extrabold tracking-tight',
        highlight === 'red' && 'text-red-500',
        highlight === 'green' && 'text-emerald-600',
      )}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
