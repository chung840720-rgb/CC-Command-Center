import { useEffect, useState } from 'react';
import { Crosshair, Sparkles, Brain, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdsCompetitor() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const c = data.competitorAds;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <Crosshair className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">數位廣告</p>
          <h1 className="text-3xl font-black tracking-tight">競品廣告分析</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">每週自動爬取 3 家主要競品的廣告投放，AI 解析素材策略 + 預算估算 + 行動建議。</p>
          <Badge variant="secondary" className="mt-3 bg-amber-100 text-amber-700 rounded-md text-xs font-bold gap-1">
            <Sparkles className="w-3 h-3" /> AI 自動解析
          </Badge>
        </div>
      </section>

      <section className="card-soft p-6 bg-gradient-to-br from-secondary/30 to-accent/30 border-primary/30">
        <div className="flex gap-3">
          <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary mb-1.5">本月市場觀察</p>
            <p className="text-sm leading-relaxed">{c.summary}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-bold">3 家競品策略拆解</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {c.competitors.map((comp: any) => (
            <div key={comp.name} className="card-soft p-5 space-y-3">
              <div>
                <Badge variant="outline" className="text-[10px] mb-2">{comp.strategy}</Badge>
                <h3 className="text-base font-bold">{comp.name}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">廣告活躍</span><span className="font-bold">{comp.activeAds} 組</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">熱門素材</span><span className="font-bold truncate ml-2">{comp.topAd}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">素材類型</span><span className="font-bold">{comp.creativeType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">月預算（估算）</span><span className="font-bold text-primary">{comp.estimatedSpend}</span></div>
              </div>
              <div className="pt-3 border-t border-border/60">
                <p className="text-[11px] font-bold text-primary mb-1.5">AI 解讀</p>
                <p className="text-xs leading-relaxed text-foreground/80">{comp.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">AI 行動建議</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
            <Link to="/insights">看更多 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
        <div className="space-y-2">
          {c.actions.map((act: string, i: number) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-accent/30">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-[11px] font-bold">{i + 1}</div>
              <p className="text-sm leading-relaxed">{act}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
