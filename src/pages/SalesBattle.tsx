import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Megaphone,
  Bell,
  CircleDollarSign,
} from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { PlatformDetailCard } from '@/components/dashboard/PlatformDetailCard';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

export default function SalesBattle() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpi = data.kpi;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BarChart3}
        iconBg="bg-rose-100 text-rose-700"
        breadcrumb="作戰總覽"
        title="銷售戰情"
        subtitle="集中查看官網、蝦皮、MoMo 的業績、目標達成、訂單、客單價與廣告回收。"
        callout="目前為月中數據，適合看方向，不適合直接與整月比較。"
        rightSlot={
          <div className="grid grid-cols-6 gap-1.5">
            {['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'].map((m, i) => (
              <button
                key={m}
                className={cn(
                  'h-8 px-3 rounded-full text-xs font-semibold transition-colors',
                  i === 4
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      {/* Info banner */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/60 px-5 py-3 flex items-start gap-3 text-sm">
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 font-bold text-[11px] shrink-0">月中數據 (MTD)</Badge>
        <span className="text-amber-900/90">— 5月數據約為前 7 天，達成率與 MOM% 為與 4 月整月比較，僅供參考，不顯示月增率</span>
      </div>

      {/* Notification */}
      <div className="rounded-2xl bg-sky-50/60 border border-sky-200/60 px-5 py-3 flex items-center gap-3">
        <Bell className="w-4 h-4 text-rose-500 shrink-0" />
        <p className="text-sm text-sky-900/90">
          <span className="font-bold">本月重點：</span>持續追蹤蝦皮廣告 ROAS 優化，官網廣告費佔比偏高，建議優先調整投放策略。
        </p>
      </div>

      {/* 5 KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiTile
          label="三平台合計業績"
          value="136萬"
          subValue={`NT$${formatNumber(kpi.monthlyGmv.value)}`}
          badge="月中數據 (MTD)"
          icon={CircleDollarSign}
          iconColor="cyan"
        />
        <KpiTile
          label="年度累計業績"
          value="3,343萬"
          subValue={`YTD 達成 ${kpi.ytdGmv.achievement}%`}
          badge="年度累計"
          icon={TrendingUp}
          iconColor="green"
        />
        <KpiTile
          label="合計訂單數"
          value={`${formatNumber(kpi.monthlyOrders)} 筆`}
          subValue="三平台加總"
          badge="月中數據 (MTD)"
          icon={ShoppingCart}
          iconColor="purple"
        />
        <KpiTile
          label="廣告整體 ROAS"
          value={`${kpi.roas} x`}
          subValue="三平台加權平均"
          badge="月中數據 (MTD)"
          icon={Wallet}
          iconColor="amber"
        />
        <KpiTile
          label="廣告總花費"
          value={`${(kpi.adSpend / 10000).toFixed(1)}萬`}
          subValue={`NT$${formatNumber(kpi.adSpend)}`}
          badge="月中數據 (MTD)"
          icon={Megaphone}
          iconColor="pink"
        />
      </div>

      {/* Trend chart + Achievement ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-soft p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold">三平台合計趨勢（萬元）</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-300" />2025</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" />2026</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">2026 vs 2025 同月對比 / * = 月中數據</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlyTrend} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="萬" />
              <Bar dataKey="y2025" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={14} />
              <Bar dataKey="y2026" fill="hsl(357 28% 68%)" radius={[6, 6, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">5月 達成率</h3>
            <Badge variant="outline" className="text-[10px]">MTD</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">三平台合計 vs 月目標</p>
          <div className="relative w-44 h-44 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'done', value: kpi.monthlyGmv.achievement },
                    { name: 'rest', value: 100 - kpi.monthlyGmv.achievement },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="74%"
                  outerRadius="100%"
                  paddingAngle={1}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="hsl(0 84% 65%)" />
                  <Cell fill="hsl(210 12% 91%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-red-500">{kpi.monthlyGmv.achievement}%</p>
              <p className="text-[10px] text-muted-foreground mt-1">達成率</p>
            </div>
          </div>
          <div className="space-y-1.5 mt-5 text-sm pt-4 border-t border-border/60">
            <Row label="實際業績" value={`NT$${formatNumber(kpi.monthlyGmv.value)}`} />
            <Row label="月目標" value={`NT$${formatNumber(kpi.monthlyGmv.target)}`} />
            <Row label="缺口" value={`-NT$${formatNumber(kpi.monthlyGmv.target - kpi.monthlyGmv.value)}`} highlight="red" />
          </div>
        </div>
      </div>

      {/* Platform detail cards */}
      <section className="space-y-4">
        <h2 className="text-base font-bold">各平台明細</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.platformDetail.map((p: any) => (
            <PlatformDetailCard key={p.id} data={p} />
          ))}
        </div>
      </section>

      {/* Ad effectiveness */}
      <section className="space-y-4">
        <h2 className="text-base font-bold">廣告效益分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.platformDetail.map((p: any) => (
            <AdEffectCard key={p.id} data={p} />
          ))}
        </div>
      </section>

      {/* MoM comparison */}
      <section className="space-y-4">
        <h2 className="text-base font-bold">2026 vs 2025 同月對比（萬元）</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['momo', 'shopee', 'shopline'].map((id) => {
            const labels = { momo: 'MoMo', shopee: '蝦皮', shopline: '官網' } as const;
            const colors = { momo: '#ef4444', shopee: '#f97316', shopline: 'hsl(357 28% 68%)' } as const;
            const chartData = data.platformMoM[id].y2025.map((y25: number, i: number) => ({
              month: ['1月','2月','3月','4月','5月'][i],
              y2025: y25,
              y2026: data.platformMoM[id].y2026[i],
            }));
            // Pad with empty months 6-12
            for (let i = 5; i < 12; i++) {
              chartData.push({ month: `${i + 1}月`, y2025: 0, y2026: 0 });
            }
            return (
              <div key={id} className="card-soft p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: colors[id as keyof typeof colors] }} />
                    {labels[id as keyof typeof labels]}
                  </p>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-zinc-300" />2025</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: colors[id as keyof typeof colors] }} />2026</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Bar dataKey="y2025" fill="#d4d4d8" radius={[4, 4, 0, 0]} barSize={8} />
                    <Bar dataKey="y2026" fill={colors[id as keyof typeof colors]} radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: 'red' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-bold', highlight === 'red' && 'text-red-500')}>{value}</span>
    </div>
  );
}

function AdEffectCard({ data }: { data: any }) {
  const RATING = {
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  const BAR = { red: 'bg-red-400', orange: 'bg-orange-400', cyan: 'bg-rose-400' };
  const DOT = { red: 'bg-red-500', orange: 'bg-orange-500', cyan: 'bg-rose-400' };
  const ROAS_COLOR = data.roas >= 5 ? 'text-emerald-600' : data.roas >= 2.5 ? 'text-amber-600' : 'text-red-500';
  return (
    <div className="card-soft p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full', DOT[data.color as keyof typeof DOT])} />
          {data.label}
        </p>
        <Badge variant="outline" className={cn('text-xs font-bold rounded-md border', RATING[data.ratingColor as keyof typeof RATING])}>
          {data.rating}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground text-xs">廣告花費</span>
        <span className="font-extrabold">NT${formatNumber(data.adSpend)}</span>
      </div>

      <div className="space-y-1">
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn('h-full rounded-full', BAR[data.color as keyof typeof BAR])}
            style={{ width: `${Math.min(data.adShareRatio, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>佔總廣告費比例</span>
          <span className="font-bold">{data.adShareRatio}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <span className="text-muted-foreground text-xs">ROAS</span>
        <span className={cn('text-2xl font-extrabold', ROAS_COLOR)}>{data.roas}x</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">CPA (每單成本)</span>
        <span className="font-extrabold">NT${formatNumber(data.cpa)}</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/60">{data.note}</p>
    </div>
  );
}
