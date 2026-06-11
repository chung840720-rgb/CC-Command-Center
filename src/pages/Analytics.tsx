import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  RotateCw,
  Settings2,
  Smartphone,
  Monitor,
  Tablet,
  Lightbulb,
  Sparkles,
  Copy,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { toast } from 'sonner';
import { formatNumber, cn } from '@/lib/utils';

const SOURCE_COLOR: Record<string, string> = {
  primary: 'bg-primary',
  cyan: 'bg-cyan-400',
  orange: 'bg-orange-400',
  zinc: 'bg-zinc-400',
  violet: 'bg-violet-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
};

const DOT_COLOR: Record<string, string> = {
  primary: 'bg-primary',
  cyan: 'bg-cyan-500',
  orange: 'bg-orange-500',
  zinc: 'bg-zinc-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
};

const DEVICE_ICONS = { 手機: Smartphone, 桌機: Monitor, 平板: Tablet };

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const a = data.analytics;

  const maxSource = Math.max(...a.trafficSources.map((s: any) => s.sessions));

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">行動與活動</p>
            <h1 className="text-3xl font-black tracking-tight">官網分析</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">
              查看 GA4 流量、來源、頁面與裝置表現，支援官網轉換診斷。更新：{a.updatedAt}
            </p>
            <Badge variant="secondary" className="mt-3 bg-amber-100 text-amber-800 border-amber-200 rounded-md text-xs font-bold">
              GA4 已連線
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" className="rounded-full gap-1.5 font-semibold">
            <RotateCw className="w-3.5 h-3.5" />
            重新整理
          </Button>
          <Button variant="outline" className="rounded-full gap-1.5 font-semibold">
            <Settings2 className="w-3.5 h-3.5" />
            串接設定
          </Button>
        </div>
      </section>

      {/* 4 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile label="工作階段" value={formatNumber(a.kpi.sessions)} subValue={a.kpi.sessionsPeriod} icon={TrendingUp} iconColor="cyan" />
        <KpiTile label="用戶" value={formatNumber(a.kpi.users)} subValue={`跳出率 ${a.kpi.usersBounceRate}%`} icon={Users} iconColor="purple" />
        <KpiTile label="瀏覽量" value={formatNumber(a.kpi.pageviews)} subValue={`平均 ${a.kpi.avgDuration}`} icon={Eye} iconColor="amber" />
        <KpiTile label="購買轉換率" value={`${a.kpi.purchaseCvr.toFixed(1)}%`} subValue={`${a.kpi.orders} 筆 / NT$ ${a.kpi.gmv}`} icon={ShoppingCart} iconColor="pink" />
      </div>

      {/* Funnel + Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card-soft p-6 space-y-4">
          <h2 className="text-base font-bold">轉換漏斗</h2>
          <div className="space-y-3">
            {a.funnel.map((stage: any) => {
              const max = a.funnel[1]?.value ?? 1;
              const widthPct = max > 0 ? (stage.value / max) * 100 : 0;
              return (
                <div key={stage.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stage.label}</span>
                    <span className="text-sm font-bold">{formatNumber(stage.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card-soft p-6 space-y-4">
          <h2 className="text-base font-bold">裝置分佈</h2>
          <div className="space-y-3">
            {a.devices.map((d: any) => {
              const Icon = DEVICE_ICONS[d.label as keyof typeof DEVICE_ICONS] ?? Smartphone;
              return (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {d.label}
                    </span>
                    <span className="text-sm font-bold">{formatNumber(d.value)} <span className="text-xs text-muted-foreground font-normal">({d.pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 熱門頁面 */}
      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">熱門頁面</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-3">頁面路徑</th>
                <th className="text-right font-medium py-3">瀏覽量</th>
                <th className="text-right font-medium py-3">工作階段</th>
              </tr>
            </thead>
            <tbody>
              {a.topPages.map((p: any) => (
                <tr key={p.path} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 font-mono text-xs">{p.path}</td>
                  <td className="py-3 text-right font-mono font-bold">{formatNumber(p.pageviews)}</td>
                  <td className="py-3 text-right font-mono">{formatNumber(p.sessions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 流量來源 */}
      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">流量來源</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-3 w-32">管道</th>
                <th className="text-left font-medium py-3"></th>
                <th className="text-right font-medium py-3 w-32">工作階段</th>
                <th className="text-right font-medium py-3 w-24">交易數</th>
              </tr>
            </thead>
            <tbody>
              {a.trafficSources.map((s: any) => {
                const widthPct = (s.sessions / maxSource) * 100;
                return (
                  <tr key={s.channel} className="border-b border-border/40">
                    <td className="py-3.5">
                      <span className="flex items-center gap-2 text-xs">
                        <span className={cn('w-2 h-2 rounded-full', DOT_COLOR[s.color])} />
                        {s.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={cn('h-full rounded-full', SOURCE_COLOR[s.color])} style={{ width: `${widthPct}%` }} />
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold">{formatNumber(s.sessions)}</td>
                    <td className="py-3.5 text-right font-mono text-muted-foreground">{s.orders}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Microsoft Clarity 熱圖 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold">Microsoft Clarity 熱圖</h2>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 rounded-full text-xs font-bold">
            ● {a.clarity.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {a.clarity.description} 專案 ID：
          <code className="ml-1 px-1.5 py-0.5 rounded bg-secondary text-foreground text-xs font-mono">{a.clarity.projectId}</code>
        </p>

        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">安裝步驟</p>
          {a.clarity.steps.map((step: string, i: number) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</div>
              <p className="text-sm text-foreground/85 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            {a.clarity.code}
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 h-7 rounded-md gap-1 text-xs"
            onClick={() => {
              navigator.clipboard.writeText(a.clarity.code);
              toast.success('已複製追蹤碼', { description: '貼上至 theme.liquid' });
            }}
          >
            <Copy className="w-3 h-3" />
            複製
          </Button>
        </div>

        <Button variant="outline" size="sm" className="rounded-full gap-1.5 font-semibold mt-2">
          <ExternalLink className="w-3.5 h-3.5" />
          開啟 Clarity 儀表板
        </Button>
      </section>

      {/* AI 診斷 */}
      <section className="card-soft p-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-bold">AI 診斷</h2>
        </div>
        <p className="text-sm text-muted-foreground">根據 GA4 數據，AI 會找出三大問題並給出具體行動建議</p>
        <Button className="rounded-full gap-2 font-semibold px-6 h-11 bg-gradient-to-br from-primary to-amber-500 border-0 shadow-lg shadow-primary/25 mx-auto">
          <Sparkles className="w-4 h-4" />
          一鍵 AI 診斷
        </Button>
      </section>
    </div>
  );
}
