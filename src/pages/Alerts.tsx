import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { cn } from '@/lib/utils';

const TIMELINE = [
  { time: '10:30', label: 'Meta 廣告 ROAS 突破 5.0', icon: TrendingUp, level: 'good' },
  { time: '09:15', label: 'Shopline 漏斗加購率破紀錄 (53%)', icon: TrendingUp, level: 'good' },
  { time: '08:40', label: '自動取數完成（4 平台）', icon: CheckCircle2, level: 'info' },
  { time: '08:18', label: 'Shoplytics SSO 健檢通過', icon: CheckCircle2, level: 'info' },
  { time: '08:00', label: '蝦皮商城活動上架（618 預熱）', icon: Clock, level: 'info' },
];

export default function Alerts() {
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 rounded-2xl" />;

  const red = data.alerts.filter((a) => a.level === 'red');
  const yellow = data.alerts.filter((a) => a.level === 'yellow');
  const green = data.alerts.filter((a) => a.level === 'green');

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">異常監測</h1>
        <p className="text-sm text-muted-foreground">
          每日 08:40 自動 ETL 後跑異常偵測，套用 daily-report skill 燈號規則（DoD ±10/15%）+ 業務脈絡防呆。
        </p>
        <SopBadge skills={[
          { name: 'daily-report.md', version: 'v2.10' },
          { name: 'cleanclean-pm.md', version: 'v7.3' },
        ]} className="mt-2" />
      </header>

      {/* 3 列 alert summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertColumn level="red" alerts={red} title="🔴 高優先" />
        <AlertColumn level="yellow" alerts={yellow} title="🟡 中優先" />
        <AlertColumn level="green" alerts={green} title="🟢 加碼候選" />
      </div>

      {/* Timeline */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">今日事件流</h2>
          <Badge variant="outline" className="text-xs">即時更新</Badge>
        </div>
        <div className="space-y-3">
          {TIMELINE.map((evt, i) => {
            const Icon = evt.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="text-xs text-muted-foreground font-mono shrink-0 w-12 pt-1">{evt.time}</div>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    evt.level === 'good' && 'bg-primary/15 text-primary',
                    evt.level === 'info' && 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm leading-tight pt-1.5">{evt.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AlertColumn({
  level,
  alerts,
  title,
}: {
  level: 'red' | 'yellow' | 'green';
  alerts: Snapshot['alerts'];
  title: string;
}) {
  return (
    <div className="card-soft p-5 space-y-3">
      <h3 className="text-sm font-bold">{title}</h3>
      {alerts.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">無此優先級異常</p>
      ) : (
        alerts.map((a) => (
          <div key={a.id} className="space-y-2 pb-3 border-b border-border/40 last:border-0">
            <div className="flex items-start gap-2">
              {level === 'red' && <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
              {level === 'yellow' && <TrendingDown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
              {level === 'green' && <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight">{a.title}</p>
                <Badge variant="secondary" className="text-[10px] font-normal mt-1.5">
                  {a.tag}
                </Badge>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1 -ml-2 h-8 text-primary">
              <Link to="/insights">
                看 AI 分析 <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
