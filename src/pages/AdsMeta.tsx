import { useEffect, useState } from 'react';
import { Megaphone, Wallet, Eye, MousePointerClick, TrendingUp, Users, Target } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { formatNumber, cn } from '@/lib/utils';

const RATING_COLOR = {
  優秀: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  良好: 'bg-blue-100 text-blue-700 border-blue-200',
  普通: 'bg-amber-100 text-amber-700 border-amber-200',
  偏低: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdsMeta() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const m = data.adsMeta;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Megaphone className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">數位廣告</p>
            <h1 className="text-3xl font-black tracking-tight">Meta 廣告</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">Facebook + Instagram 廣告組績效分析、受眾表現、預算分配診斷。</p>
            <Badge variant="secondary" className="mt-3 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Meta API 已連線</Badge>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiTile label="廣告花費" value={`${(m.kpi.spend / 10000).toFixed(1)}萬`} subValue="月中數據" icon={Wallet} iconColor="cyan" />
        <KpiTile label="曝光" value={`${(m.kpi.impressions / 10000).toFixed(0)}萬`} subValue="總觸及" icon={Eye} iconColor="purple" />
        <KpiTile label="點擊" value={formatNumber(m.kpi.clicks)} subValue={`CTR ${m.kpi.ctr}%`} icon={MousePointerClick} iconColor="amber" />
        <KpiTile label="CPC" value={`NT$${m.kpi.cpc}`} subValue="每次點擊" icon={Target} iconColor="pink" />
        <KpiTile label="ROAS" value={`${m.kpi.roas}x`} subValue="平均回收" icon={TrendingUp} iconColor="green" />
        <KpiTile label="觸及" value={`${(m.kpi.reach / 10000).toFixed(0)}萬`} subValue="不重複用戶" icon={Users} iconColor="cyan" />
        <KpiTile label="CTR" value={`${m.kpi.ctr}%`} subValue="點擊率" icon={MousePointerClick} iconColor="amber" />
      </div>

      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">廣告組績效</h2>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">廣告組名稱</th>
                <th className="text-left font-medium px-3 py-3">目標</th>
                <th className="text-left font-medium px-3 py-3">狀態</th>
                <th className="text-right font-medium px-3 py-3">花費</th>
                <th className="text-right font-medium px-3 py-3">ROAS</th>
                <th className="text-right font-medium px-3 py-3">CTR</th>
                <th className="text-right font-medium px-3 py-3">訂單</th>
              </tr>
            </thead>
            <tbody>
              {m.campaigns.map((c: any, i: number) => (
                <tr key={i} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3.5 font-bold">{c.name}</td>
                  <td className="px-3 py-3.5"><Badge variant="outline" className="text-[10px]">{c.objective}</Badge></td>
                  <td className="px-3 py-3.5">
                    <Badge variant="outline" className={cn(
                      'text-[10px] font-bold',
                      c.status === '進行中' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      c.status === '已暫停' && 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    )}>{c.status}</Badge>
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono">NT${formatNumber(c.spend)}</td>
                  <td className={cn(
                    'px-3 py-3.5 text-right font-extrabold',
                    c.roas == null ? 'text-muted-foreground font-normal text-xs' :
                    c.roas >= 4 ? 'text-emerald-600' :
                    c.roas >= 2 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {c.roas != null ? `${c.roas}x` : '—'}
                  </td>
                  <td className="px-3 py-3.5 text-right">{c.ctr}%</td>
                  <td className="px-3 py-3.5 text-right font-bold">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">受眾分析</h2>
          <p className="text-xs text-muted-foreground">CTR 與轉換率對比 — 找出最值得加碼的受眾</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {m.audiences.map((a: any) => (
            <div key={a.name} className="rounded-xl border border-border/60 p-4 space-y-2">
              <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', RATING_COLOR[a.rating as keyof typeof RATING_COLOR])}>{a.rating}</Badge>
              <p className="text-sm font-bold">{a.name}</p>
              <p className="text-xs text-muted-foreground">受眾規模 {formatNumber(a.size)}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <div>
                  <p className="text-[10px] text-muted-foreground">CTR</p>
                  <p className="text-sm font-extrabold">{a.ctr}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">CVR</p>
                  <p className="text-sm font-extrabold">{a.cvr}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
