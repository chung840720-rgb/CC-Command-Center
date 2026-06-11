import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Link2,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, cn } from '@/lib/utils';

const PRIMARY = 'hsl(357 28% 68%)';
const PRIMARY_DARK = 'hsl(357 35% 58%)';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

export default function ShoplineDetail() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const sd = data.shoplineDetail;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Globe className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black tracking-tight">官網 Shopline</h1>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                {sd.url}
              </p>
            </div>
          </div>
          <div className="shrink-0 grid grid-cols-6 gap-1.5">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                className={cn(
                  'h-8 px-3 rounded-full text-xs font-semibold transition-colors flex items-center gap-1',
                  i === 4
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {m}
                {i === 4 && <span className="text-[8px] bg-primary-foreground/20 px-1 rounded">MTD</span>}
                {i > 4 && <span className="text-[8px] opacity-60">待匯入</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Internal tab nav */}
        <div className="flex items-center gap-1 mt-5 border-b border-border -mx-6 px-6 pb-0">
          {sd.internalTabs.map((tab: any) => (
            <button
              key={tab.key}
              className={cn(
                'h-10 px-4 text-sm font-bold transition-colors relative -mb-px',
                tab.active
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 目標達成率 大進度條 */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold">目標達成率</h2>
            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs font-bold">{sd.achievementStatus}</Badge>
          </div>
          <p className="text-3xl font-black text-red-500">{sd.achievement}%</p>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-300 to-red-500 rounded-full"
            style={{ width: `${sd.achievement}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-muted-foreground">目標 <strong className="text-foreground">NT${formatNumber(sd.target)}</strong></span>
          <span className="text-muted-foreground">實際 <strong className="text-foreground">NT${formatNumber(sd.monthlyGmv)}</strong></span>
        </div>
      </section>

      {/* YTD 年度累計 */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">YTD</p>
            <h2 className="text-base font-bold mt-0.5">年度累計</h2>
          </div>
          <p className="text-xs text-muted-foreground">{sd.ytd.note}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <YtdTile label="累計業績" value={`NT$${formatNumber(sd.ytd.gmv)}`} />
          <YtdTile label="累計達成" value={`${sd.ytd.achievement}%`} highlight="primary" />
          <YtdTile label="累計訂單" value={`${formatNumber(sd.ytd.orders)} 筆`} />
          <YtdTile label="累計 ROAS" value={`${sd.ytd.roas}x`} />
        </div>

        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full"
            style={{ width: `${sd.ytd.achievement}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-muted-foreground">年度目標 <strong className="text-foreground">NT${formatNumber(sd.ytd.target)}</strong></span>
          <span className="text-muted-foreground">還差 <strong className="text-red-500">NT${formatNumber(sd.ytd.gap)}</strong></span>
        </div>
      </section>

      {/* 6 KPI grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sd.kpiGrid.map((k: any) => (
          <KpiCardWithMoM key={k.label} data={k} />
        ))}
      </section>

      {/* 4 small trend charts (2x2) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendChart title="月業績趨勢" data={sd.trends.gmv} unit="萬" />
        <TrendChart title="訂單數趨勢" data={sd.trends.orders} unit="筆" />
        <TrendChart title="客單價趨勢" data={sd.trends.aov} unit="$" />
        <TrendChart title="ROAS 趨勢" data={sd.trends.roas} unit="x" />
      </section>

      {/* Large UV trend */}
      <section className="card-soft p-6">
        <h3 className="text-base font-bold mb-4">月 UV 流量趨勢</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={sd.trends.uv} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(v: any) => [Number(v).toLocaleString(), 'UV']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={PRIMARY}
              strokeWidth={2.5}
              dot={{ r: 4, fill: PRIMARY, stroke: 'white', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: PRIMARY_DARK }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* GA4 漏斗 5 段橫條 */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            {sd.ga4Funnel.label}
          </h3>
          <Badge variant="outline" className="text-[10px] gap-1 border-emerald-200 text-emerald-700 bg-emerald-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            已串接
          </Badge>
        </div>
        <div className="space-y-3">
          {sd.ga4Funnel.stages.map((stage: any) => {
            const max = Math.max(...sd.ga4Funnel.stages.map((s: any) => s.value));
            const widthPct = max > 0 ? (stage.value / max) * 100 : 0;
            return (
              <div key={stage.label} className="grid grid-cols-[100px_1fr_60px] items-center gap-3">
                <span className="text-xs text-muted-foreground">{stage.label}</span>
                <div className="relative h-6 bg-secondary rounded-md overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-md transition-all"
                    style={{ width: `${widthPct}%` }}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground">{formatNumber(stage.value)}</span>
                </div>
                <span className="text-xs font-bold text-right">{stage.pct}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 熱銷商品 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">熱銷商品（本月）</h3>
            <p className="text-xs text-muted-foreground mt-1">本月熱銷商品排行 / Top 5 / 含 GMV 與佔比</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
            <Link to="/insights">看 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
        <div className="space-y-2">
          {sd.topProducts.map((p: any, i: number) => (
            <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name}</p>
                <div className="h-1.5 rounded-full bg-secondary mt-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full" style={{ width: `${p.share * 2.5}%` }} />
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
    </div>
  );
}

function YtdTile({ label, value, highlight }: { label: string; value: string; highlight?: 'primary' }) {
  return (
    <div className="rounded-xl bg-secondary/40 px-4 py-3.5">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className={cn('text-xl font-extrabold tracking-tight', highlight === 'primary' && 'text-primary')}>{value}</p>
    </div>
  );
}

function KpiCardWithMoM({ data }: { data: any }) {
  const momUp = data.mom != null && data.mom > 0;
  const yoyUp = data.yoy != null && data.yoy > 0;
  return (
    <div className="card-soft p-5">
      <p className="text-xs text-muted-foreground font-medium mb-2">{data.label}</p>
      <p className="text-2xl font-extrabold tracking-tight">{data.value}</p>
      <div className="flex items-center gap-3 mt-2 text-[11px]">
        {data.mom != null && (
          <span className={cn('flex items-center gap-0.5 font-bold', momUp ? 'text-emerald-600' : 'text-red-500')}>
            {momUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {data.mom > 0 ? '+' : ''}{data.mom}%
            <span className="text-muted-foreground font-medium ml-0.5">MoM</span>
          </span>
        )}
        {data.yoy != null && (
          <span className={cn('flex items-center gap-0.5 font-bold', yoyUp ? 'text-emerald-600' : 'text-red-500')}>
            {yoyUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {data.yoy > 0 ? '+' : ''}{data.yoy}%
            <span className="text-muted-foreground font-medium ml-0.5">YoY</span>
          </span>
        )}
      </div>
    </div>
  );
}

function TrendChart({ title, data, unit }: { title: string; data: any[]; unit: string }) {
  return (
    <div className="card-soft p-5">
      <h4 className="text-sm font-bold mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 6, right: 10, left: -16, bottom: 0 }}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} unit={unit} />
          <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={PRIMARY}
            strokeWidth={2}
            dot={{ r: 3, fill: PRIMARY, stroke: 'white', strokeWidth: 1.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
