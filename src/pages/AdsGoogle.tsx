import { useEffect, useState } from 'react';
import { Search, Wallet, MousePointerClick, TrendingUp, Target, Eye } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { formatNumber, cn } from '@/lib/utils';

const COLOR_BG = {
  primary: 'bg-primary',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
};

export default function AdsGoogle() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const g = data.adsGoogle;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Search className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 執行操盤手視角</p>
          <h1 className="text-3xl font-black tracking-tight">Google 廣告</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">Search + Display + YouTube 廣告整合分析、關鍵字成效、預算分配。</p>
          <Badge variant="secondary" className="mt-3 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Google Ads Demo 架構</Badge>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiTile label="廣告花費" value={`${(g.kpi.spend / 10000).toFixed(1)}萬`} subValue="月中數據" icon={Wallet} iconColor="cyan" />
        <KpiTile label="曝光" value={`${(g.kpi.impressions / 10000).toFixed(0)}萬`} subValue="總曝光" icon={Eye} iconColor="purple" />
        <KpiTile label="點擊" value={formatNumber(g.kpi.clicks)} subValue={`CTR ${g.kpi.ctr}%`} icon={MousePointerClick} iconColor="amber" />
        <KpiTile label="CPC" value={`NT$${g.kpi.cpc}`} subValue="每次點擊" icon={Target} iconColor="pink" />
        <KpiTile label="ROAS" value={`${g.kpi.roas}x`} subValue="平均回收" icon={TrendingUp} iconColor="green" />
        <KpiTile label="轉換" value={`${g.kpi.conversions}`} subValue="完成購買" icon={Target} iconColor="cyan" />
        <KpiTile label="CTR" value={`${g.kpi.ctr}%`} subValue="點擊率" icon={MousePointerClick} iconColor="amber" />
      </div>

      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">廣告類型分配</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {g.split.map((s: any) => (
            <div key={s.type} className="rounded-xl border border-border/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{s.type}</p>
                <Badge variant="outline" className="text-[10px]">{s.share}%</Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">花費</p>
                <p className="text-xl font-extrabold">NT${formatNumber(s.spend)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">ROAS</p>
                <p className="text-lg font-extrabold text-primary">{s.roas}x</p>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className={cn('h-full rounded-full', COLOR_BG[s.color as keyof typeof COLOR_BG])} style={{ width: `${s.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">關鍵字成效</h2>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">關鍵字</th>
                <th className="text-left font-medium px-3 py-3">比對方式</th>
                <th className="text-right font-medium px-3 py-3">曝光</th>
                <th className="text-right font-medium px-3 py-3">點擊</th>
                <th className="text-right font-medium px-3 py-3">CTR</th>
                <th className="text-right font-medium px-3 py-3">CPC</th>
                <th className="text-right font-medium px-3 py-3">CVR</th>
              </tr>
            </thead>
            <tbody>
              {g.keywords.map((k: any, i: number) => (
                <tr key={i} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3.5 font-bold">{k.keyword}</td>
                  <td className="px-3 py-3.5"><Badge variant="outline" className="text-[10px]">{k.matchType}</Badge></td>
                  <td className="px-3 py-3.5 text-right font-mono">{formatNumber(k.impressions)}</td>
                  <td className="px-3 py-3.5 text-right font-mono font-bold">{formatNumber(k.clicks)}</td>
                  <td className="px-3 py-3.5 text-right font-mono">{k.ctr}%</td>
                  <td className="px-3 py-3.5 text-right font-mono">NT${k.cpc}</td>
                  <td className={cn(
                    'px-3 py-3.5 text-right font-extrabold',
                    k.cvr >= 3 ? 'text-emerald-600' : k.cvr >= 2 ? 'text-amber-600' : 'text-red-500'
                  )}>{k.cvr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
