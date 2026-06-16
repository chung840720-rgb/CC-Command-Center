import { useEffect, useState } from 'react';
import { MessageSquareCode, Copy, Filter, Sparkles } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { formatNumber, cn } from '@/lib/utils';
import { toast } from 'sonner';

const CAT_COLOR: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  blue:    'bg-blue-100 text-blue-700 border-blue-200',
  rose:    'bg-rose-100 text-rose-700 border-rose-200',
  amber:   'bg-amber-100 text-amber-700 border-amber-200',
  stone:   'bg-stone-100 text-stone-700 border-stone-200',
  red:     'bg-red-100 text-red-700 border-red-200',
  violet:  'bg-violet-100 text-violet-700 border-violet-200',
};

export default function PmPrompts() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const pm = data.pmPrompts;
  if (!pm) return <div className="p-6">尚無 PM Prompts 資料</div>;

  const visibleCategories = filter === 'all' ? pm.categories : pm.categories.filter((c: any) => c.id === filter);

  const copyPrompt = (prompt: string) => {
    navigator.clipboard?.writeText(prompt);
    toast.success('Prompt 已複製，貼到 Claude Code / Claude.ai 都能跑');
  };

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
            <MessageSquareCode className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">沉澱與信任 · 成長觀察員視角</p>
            <h1 className="text-3xl font-black tracking-tight">💬 PM 自然語言 Prompt 庫</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              {pm.totalCount} 個經實戰驗證的 Shopline MCP 提問範本 — 複製貼到任何 Claude 就能跑。
              不用寫 code、不用後台撈、不用 Excel — <strong>「一句話拿答案」</strong>的工作模式。
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Badge className="bg-violet-100 text-violet-700 rounded-md text-xs font-bold border-violet-200">
                📦 對應 Shopline MCP v1.2.0
              </Badge>
              <SopBadge skills={[{ name: 'shopline-pm-prompts.md', version: 'v1.0' }]} />
            </div>
          </div>
        </div>
      </section>

      {/* ROI 估算 */}
      <section className="card-soft p-5 bg-gradient-to-br from-emerald-50/40 to-violet-50/30 border-emerald-200/40">
        <div className="flex items-start gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-extrabold">⏱ ROI 估算（若團隊全套用）</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{pm.roiEstimate.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
          {pm.roiEstimate.items.map((r: any) => (
            <div key={r.task} className="rounded-lg bg-white/70 border border-border/40 p-2.5">
              <p className="text-[10px] font-bold">{r.task}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">舊：{r.old}</p>
              <p className="text-[9px] text-emerald-700 font-bold">新：{r.new}</p>
              <p className="text-xs font-extrabold text-emerald-600 mt-1">月省 {r.monthSaving}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-100/60">
          <span className="text-sm font-bold text-emerald-800">月省合計：{pm.roiEstimate.monthTotal}</span>
          <span className="text-sm font-extrabold text-emerald-700">年值 NT$ {formatNumber(pm.roiEstimate.yearValueNtd)}</span>
        </div>
      </section>

      {/* 篩選器 */}
      <section className="card-soft p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-full text-xs"
          >
            全部 ({pm.totalCount})
          </Button>
          {pm.categories.map((cat: any) => (
            <Button
              key={cat.id}
              variant={filter === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat.id)}
              className="rounded-full text-xs gap-1"
            >
              <span>{cat.icon}</span>
              {cat.name} ({cat.count})
            </Button>
          ))}
        </div>
      </section>

      {/* 7 大類 prompts */}
      <section className="space-y-6">
        {visibleCategories.map((cat: any) => (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('text-base font-extrabold border-2', CAT_COLOR[cat.color])}>
                {cat.icon} {cat.id}. {cat.name}
              </Badge>
              <span className="text-xs text-muted-foreground">{cat.count} 個 prompt（顯示 {cat.topPrompts.length} 個示範）</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {cat.topPrompts.map((p: any) => (
                <div key={p.id} className="card-soft p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold font-mono">{p.id}</Badge>
                      <p className="text-sm font-bold">{p.title}</p>
                    </div>
                    <Button
                      onClick={() => copyPrompt(p.prompt)}
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-7 px-2.5 text-xs gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      複製
                    </Button>
                  </div>
                  <div className="rounded-lg bg-secondary/40 p-3 border border-border/40">
                    <code className="text-[11px] text-foreground/85 leading-relaxed whitespace-pre-wrap font-mono block">
                      {p.prompt}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="card-soft p-6 bg-gradient-to-br from-violet-50/60 to-amber-50/30 border-violet-200/40 text-center">
        <Sparkles className="w-6 h-6 text-violet-700 mx-auto mb-2" />
        <h2 className="text-lg font-extrabold mb-2">想看完整 50 個 prompt？</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
          這頁示範 7 大類各 1-3 個。完整 50 個 + 安全規則 + 進階使用方法在 SOP 內。
        </p>
        <Badge className="bg-violet-100 text-violet-700 text-xs font-bold gap-1.5 border-violet-200 px-3 py-1.5">
          <MessageSquareCode className="w-3.5 h-3.5" />
          <code className="font-mono">skills/shopline-pm-prompts.md v1.0</code>
        </Badge>
      </section>
    </div>
  );
}
