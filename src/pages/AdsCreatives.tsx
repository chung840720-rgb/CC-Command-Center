import { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Pencil,
  RotateCw,
  BarChart3,
  TrendingUp,
  Globe,
  ShoppingBag,
  Store,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, cn } from '@/lib/utils';

const PLATFORM_ICON: Record<string, { icon: any; bg: string }> = {
  官網: { icon: Globe, bg: 'bg-amber-100 text-amber-700' },
  蝦皮: { icon: ShoppingBag, bg: 'bg-orange-100 text-orange-700' },
  MoMo: { icon: Store, bg: 'bg-red-100 text-red-700' },
};

const TYPE_COLOR: Record<string, string> = {
  問題解決型: 'bg-amber-100 text-amber-800 border-amber-200',
  促購型: 'bg-rose-100 text-rose-800 border-rose-200',
  生活情境型: 'bg-violet-100 text-violet-800 border-violet-200',
  教育型: 'bg-blue-100 text-blue-800 border-blue-200',
  證言型: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const PLATFORM_COLOR: Record<string, string> = {
  Meta: 'bg-blue-100 text-blue-700 border-blue-200',
  Google: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function AdsCreatives() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<'全部素材' | 'Meta' | 'Google'>('全部素材');

  useEffect(() => { getSnapshot().then(setData); }, []);

  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const ac = data.adCreatives;

  const ranking = filter === '全部素材' ? ac.ranking : ac.ranking.filter((r: any) => r.platform === filter);
  const sorted = [...ranking].sort((a: any, b: any) => b.roas - a.roas);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <ImageIcon className="w-7 h-7" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-bold mb-1.5">數位廣告</p>
              <h1 className="text-3xl font-black tracking-tight">素材成效</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-prose">
                跨平台素材效率分析 + A/B 雙軌測試 + 素材類型 ROAS 比較。挑會打的素材複用，砍效率低的。
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0">
            <Pencil className="w-3 h-3" />
            編輯
          </Button>
        </div>
      </section>

      {/* A/B 雙軌測試 */}
      <section className="card-soft p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
            <RotateCw className="w-5 h-5 text-foreground/70" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">{ac.abTest.title}</h2>
              <Badge variant="outline" className="text-[10px]">{ac.abTest.subtitle}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">{ac.abTest.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ac.abTest.tracks.map((t: any) => (
            <div key={t.name} className="rounded-xl border border-border/60 bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">{t.name}</p>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs font-bold',
                    t.metricColor === 'primary' && 'bg-primary/15 text-primary',
                    t.metricColor === 'emerald' && 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  {t.metric}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{t.examples}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 三通路素材貢獻 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">三通路素材貢獻</h2>
            <p className="text-xs text-muted-foreground mt-1">同一批素材在官網、蝦皮、MoMo 的結果不一定一樣。</p>
          </div>
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ac.platformContribution.map((p: any) => {
            const cfg = PLATFORM_ICON[p.platform];
            const PlatIcon = cfg?.icon ?? Globe;
            return (
              <div key={p.platform} className="rounded-xl border border-border/60 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', cfg?.bg)}>
                    <PlatIcon className="w-4 h-4" strokeWidth={2.4} />
                  </div>
                  <p className="text-sm font-bold">{p.platform}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">素材帶動業績</p>
                  <p className="text-2xl font-extrabold mt-1">{(p.gmv / 10000).toFixed(1)}萬</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">廣告回收</p>
                  <p className="text-xl font-extrabold mt-0.5">{p.roas} 倍</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/60">{p.insight}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 素材排行榜 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              素材排行榜
            </h2>
            <p className="text-xs text-muted-foreground mt-1">示範排序：先看回收，再看點擊率、花費與訂單。</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
            <Link to="/insights">看 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          {(['全部素材', 'Meta', 'Google'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'h-8 px-4 rounded-full text-xs font-semibold transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">素材</th>
                <th className="text-left font-medium px-3 py-3">類型</th>
                <th className="text-left font-medium px-3 py-3">平台</th>
                <th className="text-right font-medium px-3 py-3">花費</th>
                <th className="text-right font-medium px-3 py-3">帶動業績</th>
                <th className="text-right font-medium px-3 py-3">廣告回收</th>
                <th className="text-right font-medium px-3 py-3">點擊率</th>
                <th className="text-right font-medium px-3 py-3">訂單</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r: any, i: number) => {
                const isTop = i === 0;
                return (
                  <tr
                    key={r.name + i}
                    className={cn(
                      'border-t border-border/40 hover:bg-secondary/20 transition-colors',
                      isTop && 'bg-primary/5'
                    )}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        {isTop && (
                          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                            <Trophy className="w-3 h-3" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold leading-tight">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 max-w-md leading-relaxed">{r.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', TYPE_COLOR[r.type])}>
                        {r.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', PLATFORM_COLOR[r.platform])}>
                        {r.platform}
                      </Badge>
                    </td>
                    <td className="px-3 py-4 text-right font-mono">NT${formatNumber(r.spend)}</td>
                    <td className="px-3 py-4 text-right font-mono font-bold">NT${formatNumber(r.gmv)}</td>
                    <td className={cn(
                      'px-3 py-4 text-right font-extrabold',
                      r.roas >= 4 ? 'text-emerald-600' : r.roas >= 2.5 ? 'text-amber-600' : 'text-red-500'
                    )}>
                      {r.roas} 倍
                    </td>
                    <td className="px-3 py-4 text-right">{r.ctr}%</td>
                    <td className="px-3 py-4 text-right font-bold">{r.orders}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
          <TrendingUp className="w-3 h-3" />
          排序依 ROAS 由高到低 — Top 1 標示 🏆，可進入「AI 決策建議」看素材複用 / 砍掉 / 加碼建議
        </p>
      </section>

      {/* 素材類型 ROAS 比較 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold">素材類型 ROAS 比較</h2>
        </div>
        <p className="text-xs text-muted-foreground">看哪個類型在整體預算下最有效率 — 影響下一檔素材策略</p>
        <div className="space-y-2.5">
          {data.adCreatives.typeRoas.map((t: any) => {
            const max = Math.max(...data.adCreatives.typeRoas.map((x: any) => x.avgRoas));
            const widthPct = (t.avgRoas / max) * 100;
            return (
              <div key={t.type} className="grid grid-cols-[120px_1fr_120px] gap-3 items-center">
                <span className="text-sm font-medium">{t.type}</span>
                <div className="h-7 rounded-md bg-secondary overflow-hidden relative">
                  <div className={cn(
                    'h-full rounded-md transition-all',
                    t.color === 'amber' && 'bg-amber-400',
                    t.color === 'rose' && 'bg-rose-400',
                    t.color === 'violet' && 'bg-violet-400',
                    t.color === 'blue' && 'bg-blue-400',
                    t.color === 'emerald' && 'bg-emerald-400'
                  )} style={{ width: `${widthPct}%` }} />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">{t.avgRoas} 倍</span>
                </div>
                <span className="text-xs text-muted-foreground text-right">花費 NT${formatNumber(t.totalSpend)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI 行動建議 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              AI 行動建議
            </h2>
            <p className="text-xs text-muted-foreground mt-1">套用 <code className="px-1 bg-secondary rounded">daily-report.md skill v2.10</code> 的「解讀 → 建議 → 升級判斷」3 段式</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-bold">📋 SOP Applied</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.adCreatives.recommendation.map((r: any, i: number) => (
            <div key={i} className={cn(
              'rounded-xl border p-4 space-y-2',
              r.action === '加碼' && 'border-emerald-200 bg-emerald-50/40',
              r.action === '複用' && 'border-primary/30 bg-primary/5',
              r.action === '改投' && 'border-amber-200 bg-amber-50/40',
              r.action === '砍' && 'border-red-200 bg-red-50/40'
            )}>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={cn(
                  'text-[11px] font-bold rounded-md',
                  r.action === '加碼' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  r.action === '複用' && 'bg-primary/15 text-primary border-primary/30',
                  r.action === '改投' && 'bg-amber-100 text-amber-700 border-amber-200',
                  r.action === '砍' && 'bg-red-100 text-red-700 border-red-200'
                )}>
                  {r.action}
                </Badge>
                <Badge variant="outline" className={cn(
                  'text-[10px]',
                  r.priority === '高' && 'bg-red-50 text-red-700 border-red-200',
                  r.priority === '中' && 'bg-amber-50 text-amber-700 border-amber-200'
                )}>
                  優先 {r.priority}
                </Badge>
              </div>
              <p className="text-sm font-bold">{r.target}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
