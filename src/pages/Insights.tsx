import { useEffect, useState } from 'react';
import type { Snapshot, Alert, AiInsight } from '@/types/dashboard';
import { getSnapshot, getInsight, isLiveMode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SopBadge } from '@/components/dashboard/SopBadge';
import {
  RefreshCw,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Insights() {
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">AI 決策建議</h1>
          <Badge variant={isLiveMode() ? 'default' : 'secondary'} className="gap-1">
            <Sparkles className="w-3 h-3" />
            {isLiveMode() ? 'Live LLM' : 'Demo Mode'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          每個異常自動套用 daily-report + ecommerce-pm SOP Skill，AI 產出「解讀 → 建議 → 升級判斷」三段式分析。
        </p>
        <SopBadge skills={[
          { name: 'daily-report.md', version: 'v2.10' },
          { name: 'cleanclean-pm.md', version: 'v7.3' },
          { name: 'daren-mindset.md', version: 'v1.0' },
        ]} className="mt-2" />
      </header>

      <div className="space-y-4">
        {data.alerts.map((alert) => (
          <AlertInsightCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

function AlertInsightCard({ alert }: { alert: Alert }) {
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getInsight(alert).then((r) => {
      setInsight(r);
      setLoading(false);
    });
  }, [alert]);

  async function regenerate() {
    setRegenerating(true);
    const r = await getInsight(alert, true);
    setInsight(r);
    setRegenerating(false);
    toast.success('已重新生成', { description: 'AI 套用不同切角產生新建議' });
  }

  const isRed = alert.level === 'red';
  const isGreen = alert.level === 'green';
  const TrendIcon = isGreen ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        'card-soft p-6 space-y-5 border-l-4',
        isRed && 'border-l-destructive',
        alert.level === 'yellow' && 'border-l-amber-400',
        isGreen && 'border-l-primary'
      )}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              isRed && 'bg-destructive/15 text-destructive',
              alert.level === 'yellow' && 'bg-amber-100 text-amber-700',
              isGreen && 'bg-primary/15 text-primary'
            )}
          >
            <TrendIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] font-bold',
                  isRed && 'bg-destructive/10 text-destructive',
                  alert.level === 'yellow' && 'bg-amber-100 text-amber-800',
                  isGreen && 'bg-primary/10 text-primary'
                )}
              >
                {alert.tag}
              </Badge>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">{alert.platform}</span>
            </div>
            <h3 className="text-base font-bold">{alert.title}</h3>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
          onClick={regenerate}
          disabled={regenerating || loading}
        >
          <RefreshCw className={cn('w-3 h-3', regenerating && 'animate-spin')} />
          重新生成
        </Button>
      </div>

      {loading || !insight ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interpretation */}
          <div className="flex gap-3">
            <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-muted-foreground mb-1">AI 解讀</p>
              <p className="text-sm leading-relaxed">{insight.interpretation}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-muted-foreground mb-2">建議行動</p>
              <ol className="space-y-1.5">
                {insight.actions.map((a, i) => (
                  <li key={i} className="text-sm leading-relaxed flex gap-2">
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Escalation */}
          {insight.escalation && (
            <div className="flex gap-3 rounded-xl bg-amber-50/60 border border-amber-200/50 p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800 mb-1">升級判斷</p>
                <p className="text-sm leading-relaxed text-amber-900">{insight.escalation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <ThumbsUp className="w-3 h-3" />
          採納
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <MessageSquare className="w-3 h-3" />
          留言
        </Button>
        <Zap className="w-3 h-3 text-muted-foreground ml-auto" />
        <span className="text-[10px] text-muted-foreground">claude-haiku-4-5</span>
      </div>
    </div>
  );
}
