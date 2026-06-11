import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Globe,
  Users,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function ShoplineDetail() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 rounded-2xl" />;

  const sd = data.shoplineDetail;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Globe}
        iconBg="bg-cyan-100 text-cyan-700"
        breadcrumb="電商通路"
        title="官網 Shopline"
        subtitle="流量、轉換率、客單價、ROAS、VIP 私域、會員回購 — 品牌自有轉換能力主場。"
        callout={`本月達成 ${sd.achievement}%（${formatCurrency(sd.monthlyGmv)} / ${formatCurrency(8800000)}），ROAS 偏低需優先修正`}
        calloutVariant="amber"
        rightSlot={
          <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5">
            <Link to="/insights">看 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiTile label="月業績" value={`NT$${formatNumber(sd.monthlyGmv)}`} subValue={`達成 ${sd.achievement}%`} icon={Wallet} iconColor="cyan" />
        <KpiTile label="年度累計" value={`${(sd.ytdGmv / 10000).toFixed(0)}萬`} subValue="占整體 60.1%" icon={TrendingUp} iconColor="green" />
        <KpiTile label="流量 UV" value={`${(sd.uv / 1000).toFixed(1)}K`} subValue="月中數據" icon={Users} iconColor="purple" />
        <KpiTile label="訂單數" value={`${sd.orders}`} subValue="月中數據" icon={ShoppingCart} iconColor="pink" />
        <KpiTile label="ROAS" value={`${sd.roas}x`} subValue="偏低，需優化" icon={Award} iconColor="amber" />
        <KpiTile label="客單價" value={`NT$${formatNumber(sd.aov)}`} subValue="月中數據" icon={Sparkles} iconColor="cyan" />
      </div>

      {/* 2 column: 趨勢 + 重點觀察 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-soft p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">月度業績趨勢（萬元）</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-zinc-300" />2025</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-500" />2026</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[
                { month: '1月', y2025: 780, y2026: 540 },
                { month: '2月', y2025: 580, y2026: 500 },
                { month: '3月', y2025: 720, y2026: 560 },
                { month: '4月', y2025: 600, y2026: 480 },
                { month: '5月*', y2025: 0, y2026: 64.8 },
                { month: '6月', y2025: 0, y2026: 0 },
                { month: '7月', y2025: 0, y2026: 0 },
                { month: '8月', y2025: 0, y2026: 0 },
                { month: '9月', y2025: 0, y2026: 0 },
                { month: '10月', y2025: 0, y2026: 0 },
                { month: '11月', y2025: 0, y2026: 0 },
                { month: '12月', y2025: 0, y2026: 0 },
              ]}
              margin={{ top: 10, right: 6, left: -16, bottom: 0 }}
            >
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="萬" />
              <Bar dataKey="y2025" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={14} />
              <Bar dataKey="y2026" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-soft p-6 space-y-4">
          <h3 className="text-base font-bold">本月重點觀察</h3>
          <div className="space-y-3">
            {sd.highlights.map((h: string, i: number) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</div>
                <p className="text-sm leading-relaxed text-foreground/85">{h}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-accent/40 p-4 space-y-1.5 mt-4">
            <p className="text-xs text-muted-foreground">VIP 比例</p>
            <p className="text-2xl font-extrabold">{sd.repurchaseRate}%</p>
            <p className="text-[11px] text-muted-foreground">回購率（vs 整體 18%）</p>
          </div>
        </div>
      </div>

      {/* Top 商品 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Top 5 暢銷商品</h3>
            <p className="text-xs text-muted-foreground mt-1">5 月月中數據 / 含 GMV 與佔比</p>
          </div>
          <Badge variant="outline" className="text-xs">MTD</Badge>
        </div>
        <div className="space-y-2">
          {sd.topProducts.map((p: any, i: number) => (
            <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name}</p>
                <div className="h-1.5 rounded-full bg-secondary mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${p.share * 2.5}%` }} />
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
