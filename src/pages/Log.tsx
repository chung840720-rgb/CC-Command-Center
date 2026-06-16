import { useEffect, useState } from 'react';
import { ScrollText, Sparkles, Settings2, Upload, Edit, MessageCircle } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TYPE_ICON: Record<string, { Icon: any; color: string }> = {
  ai:     { Icon: Sparkles, color: 'bg-violet-100 text-violet-700' },
  system: { Icon: Settings2, color: 'bg-zinc-100 text-zinc-600' },
  upload: { Icon: Upload, color: 'bg-cyan-100 text-cyan-700' },
  edit:   { Icon: Edit, color: 'bg-amber-100 text-amber-700' },
  wish:   { Icon: MessageCircle, color: 'bg-rose-100 text-rose-700' },
};

const TYPE_LABEL: Record<string, string> = {
  ai: 'AI', system: '系統', upload: '上傳', edit: '編輯', wish: '願池',
};

export default function Log() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<string>('全部');
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const l = data.logPage;
  const events = filter === '全部' ? l.events : l.events.filter((e: any) => TYPE_LABEL[e.type] === filter);

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <ScrollText className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">沉澱與信任 · 成長觀察員視角</p>
          <h1 className="text-3xl font-black tracking-tight">📋 操作日誌</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">所有 AI 分析、編輯、上傳、系統行為的時序紀錄，跨成員共用。</p>
        </div>
      </section>

      <div className="flex items-center gap-1.5">
        {['全部', 'AI', '編輯', '上傳', '系統', '願池'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'h-8 px-4 rounded-full text-xs font-semibold transition-colors',
              filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="card-soft p-6">
        <div className="space-y-3">
          {events.map((e: any, i: number) => {
            const cfg = TYPE_ICON[e.type] ?? TYPE_ICON.system;
            return (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                <div className="text-[10px] text-muted-foreground font-mono shrink-0 w-24 pt-1.5">{e.time}</div>
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', cfg.color)}>
                  <cfg.Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{e.actor}</span>
                    <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[e.type]}</Badge>
                    <span className="text-xs text-muted-foreground">{e.page}</span>
                  </div>
                  <p className="text-sm mt-0.5">{e.action}</p>
                  {e.comment && <p className="text-xs text-muted-foreground mt-1">💬 {e.comment}</p>}
                  {e.fileInfo && <p className="text-[11px] font-mono text-muted-foreground mt-1">📎 {e.fileInfo}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
