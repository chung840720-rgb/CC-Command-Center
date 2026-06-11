import { useEffect, useState } from 'react';
import { Globe2, Brain, Link2, Sparkles, RefreshCw } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CompetitorWeb() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const c = data.competitorWeb;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
            <Globe2 className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">觀察分析</p>
            <h1 className="text-3xl font-black tracking-tight">競品網站分析</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">{c.summary}</p>
            <p className="text-xs text-muted-foreground mt-2">最後更新：{c.lastUpdated}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> 立即更新
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-bold">3 家競品官網 AI 解析</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {c.competitors.map((comp: any) => (
            <div key={comp.name} className="card-soft p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] mb-2">{comp.category}</Badge>
                  <h3 className="text-base font-bold">{comp.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    {comp.url}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center"><p className="text-[10px] text-muted-foreground">月流量</p><p className="text-sm font-extrabold">{comp.monthlyTraffic}</p></div>
                <div className="text-center"><p className="text-[10px] text-muted-foreground">SKU</p><p className="text-sm font-extrabold">{comp.skuCount}</p></div>
                <div className="text-center"><p className="text-[10px] text-muted-foreground">均價</p><p className="text-sm font-extrabold">{comp.avgPrice}</p></div>
              </div>
              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground mb-1.5">促銷活動</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.promotions.map((p: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-[10px] font-normal">{p}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground mb-1">UX 觀察</p>
                  <ul className="text-xs space-y-0.5 text-foreground/80">
                    {comp.uxObservations.map((o: string, i: number) => (
                      <li key={i} className="flex gap-1"><span>•</span>{o}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex gap-2">
                  <Brain className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-foreground/80">{comp.aiSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold">競爭定位比較表</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                {c.comparisonTable.headers.map((h: string) => (
                  <th key={h} className={cn('px-4 py-3 font-medium', h === 'Johnny demo' ? 'text-primary text-right font-bold' : 'text-left')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.comparisonTable.rows.map((row: any, i: number) => (
                <tr key={i} className="border-t border-border/40">
                  <td className="px-4 py-3 font-bold">{row.label}</td>
                  <td className="px-4 py-3 text-sm">{row.a}</td>
                  <td className="px-4 py-3 text-sm">{row.b}</td>
                  <td className="px-4 py-3 text-sm">{row.c}</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-primary">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
