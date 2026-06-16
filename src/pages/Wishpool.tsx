import { useEffect, useState } from 'react';
import { Lightbulb, Heart, MessageCircle, Plus, Sparkles } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  '規劃中': 'bg-amber-100 text-amber-800 border-amber-200',
  '已採納': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '進行中': 'bg-cyan-100 text-cyan-800 border-cyan-200',
};

const PRIORITY_COLOR: Record<string, string> = {
  '高': 'bg-red-100 text-red-700',
  '中': 'bg-amber-100 text-amber-700',
  '低': 'bg-zinc-100 text-zinc-600',
};

export default function Wishpool() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const w = data.wishpoolPage;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">沉澱與信任 · 成長觀察員視角</p>
            <h1 className="text-3xl font-black tracking-tight">願池</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">團隊許願清單 — 想要的功能、想自動化的事、想試的新工具，按讚投票推進。</p>
          </div>
        </div>
        <Button className="rounded-full gap-1.5 font-semibold bg-gradient-to-br from-primary to-amber-500 border-0 shadow-sm shadow-primary/30">
          <Plus className="w-4 h-4" /> 許願
        </Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {w.wishes.map((wish: any, i: number) => (
          <div key={i} className="card-soft p-5 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold leading-tight flex-1">{wish.title}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className={cn('text-[10px] font-bold', PRIORITY_COLOR[wish.priority])}>{wish.priority}</Badge>
                <Badge variant="outline" className={cn('text-[10px] font-bold', STATUS_COLOR[wish.status])}>{wish.status}</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">由 {wish.author} 於 {wish.date} 許願</p>
            <p className="text-sm leading-relaxed text-foreground/85">{wish.description}</p>
            <div className="flex items-center gap-4 pt-3 border-t border-border/60">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors">
                <Heart className="w-3.5 h-3.5" />
                <span className="font-bold">{wish.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-bold">{wish.comments}</span>
              </button>
              <button className="ml-auto text-xs text-primary hover:underline flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI 評估
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
