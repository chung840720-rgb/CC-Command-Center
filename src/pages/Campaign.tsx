import { useEffect, useState } from 'react';
import {
  CalendarClock,
  PlusCircle,
  FileDown,
  LayoutGrid,
  Brain,
  FileCheck,
  ListChecks,
  Trophy,
  Wallet,
  ShoppingCart,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { formatNumber, cn } from '@/lib/utils';

const STATUS_COLOR = {
  '規劃中': 'bg-amber-100 text-amber-800 border-amber-200',
  '進行中': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  '已完成': 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

const PLATFORM_COLOR: Record<string, string> = {
  官網: 'bg-amber-50 text-amber-800 border-amber-200',
  蝦皮: 'bg-orange-50 text-orange-800 border-orange-200',
  MoMo: 'bg-red-50 text-red-800 border-red-200',
  全通路: 'bg-violet-50 text-violet-800 border-violet-200',
};

export default function Campaign() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const c = data.campaign;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <CalendarClock className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">行動與活動</p>
            <h1 className="text-3xl font-black tracking-tight">電商導購活動</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose">
              集中管理官網、蝦皮、MoMo 的促銷活動：規劃、進行、完成、業績、客單價與復盤報告放在同一頁。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button className="rounded-full gap-1.5 font-semibold bg-gradient-to-br from-primary to-amber-500 border-0 shadow-sm shadow-primary/30">
            <PlusCircle className="w-4 h-4" />
            新增導購活動
          </Button>
          <Button variant="outline" className="rounded-full gap-1.5 font-semibold">
            <FileDown className="w-4 h-4" />
            產出完成報告書
          </Button>
        </div>
      </section>

      {/* 5 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiTile label="活動總業績" value={`${(c.kpi.totalGmv / 10000).toFixed(0)}萬`} subValue="Demo 期間合計" icon={Wallet} iconColor="cyan" />
        <KpiTile label="總訂單" value={formatNumber(c.kpi.totalOrders)} subValue="已完成 + 進行中" icon={ShoppingCart} iconColor="purple" />
        <KpiTile label="平均客單價" value={`NT$${formatNumber(c.kpi.avgAov)}`} subValue="促銷活動平均" icon={Receipt} iconColor="amber" />
        <KpiTile label="整體廣告回收" value={`${c.kpi.totalRoas} 倍`} subValue={`花費 ${(c.kpi.totalSpend / 10000).toFixed(1)}萬`} icon={TrendingUp} iconColor="green" />
        <KpiTile label="最佳活動" value={c.kpi.bestCampaign.name} subValue={`${c.kpi.bestCampaign.roas} 倍`} icon={Trophy} iconColor="pink" />
      </div>

      {/* Kanban + 判讀 */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4">
        <section className="card-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold">導購活動進度表</h2>
            </div>
            <p className="text-xs text-muted-foreground">Trello 式看板：規劃中、進行中、已完成，歷史紀錄也保留。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KanbanColumn title="規劃中" status="規劃中" cards={c.kanban.planning} />
            <KanbanColumn title="進行中" status="進行中" cards={c.kanban.inProgress} />
            <KanbanColumn title="已完成" status="已完成" cards={c.kanban.completed} />
          </div>
        </section>

        <section className="card-soft p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">目前判讀</h2>
          </div>
          <p className="text-xs text-muted-foreground">活動買票低讀支援節會決算。</p>
          <div className="space-y-2.5">
            {c.judgement.map((j: any) => (
              <div
                key={j.label}
                className={cn(
                  'rounded-xl p-3.5 border',
                  j.color === 'cyan' && 'bg-cyan-50 border-cyan-200',
                  j.color === 'amber' && 'bg-amber-50 border-amber-200',
                  j.color === 'primary' && 'bg-primary/10 border-primary/30'
                )}
              >
                <p className={cn(
                  'text-xs font-bold mb-1.5',
                  j.color === 'cyan' && 'text-cyan-800',
                  j.color === 'amber' && 'text-amber-800',
                  j.color === 'primary' && 'text-primary'
                )}>{j.label}</p>
                <p className="text-sm leading-relaxed text-foreground/80">{j.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 活動成效報表 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">活動成效報表</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {['全部通路', '已完成', '進行中'].map((f, i) => (
              <button
                key={f}
                className={cn(
                  'h-8 px-4 rounded-full text-xs font-semibold transition-colors',
                  i === 0 ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">每個活動的業績、訂單、客單價、花費回收。</p>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">活動</th>
                <th className="text-left font-medium px-3 py-3">狀態</th>
                <th className="text-left font-medium px-3 py-3">通路</th>
                <th className="text-right font-medium px-3 py-3">銷售業績</th>
                <th className="text-right font-medium px-3 py-3">訂單</th>
                <th className="text-right font-medium px-3 py-3">客單價</th>
                <th className="text-right font-medium px-3 py-3">廣告花費</th>
                <th className="text-right font-medium px-3 py-3">廣告回收</th>
                <th className="text-right font-medium px-3 py-3">達成率</th>
              </tr>
            </thead>
            <tbody>
              {c.summary.map((row: any, i: number) => (
                <tr key={i} className="border-t border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold leading-tight">{row.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{row.dateRange}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', STATUS_COLOR[row.status as keyof typeof STATUS_COLOR])}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs font-medium">{row.platform}</span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono font-bold">
                    {row.gmv ? `${(row.gmv / 10000).toFixed(1)}萬` : '0'}
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono">{formatNumber(row.orders)}</td>
                  <td className="px-3 py-3.5 text-right font-mono">{row.aov ? `NT$${formatNumber(row.aov)}` : '尚未開跑'}</td>
                  <td className="px-3 py-3.5 text-right font-mono">{(row.spend / 10000).toFixed(1)}萬</td>
                  <td className={cn(
                    'px-3 py-3.5 text-right font-extrabold',
                    row.roas == null ? 'text-muted-foreground font-normal text-xs' :
                    row.roas >= 7 ? 'text-emerald-600' :
                    row.roas >= 4 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {row.roas != null ? `${row.roas} 倍` : '尚未開跑'}
                  </td>
                  <td className={cn(
                    'px-3 py-3.5 text-right font-extrabold',
                    row.achievement == null ? 'text-muted-foreground font-normal text-xs' :
                    row.achievement >= 100 ? 'text-emerald-600' :
                    row.achievement >= 70 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {row.achievement != null ? `${row.achievement}%` : '規劃中'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Demo Report + Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card-soft p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">完成報告書 Demo</h2>
          </div>
          <p className="text-xs text-muted-foreground">活動結束後，一鍵產出，保留可用的結論。</p>

          <div className="rounded-xl border border-border/40 p-4 space-y-4 bg-secondary/20">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="outline" className="text-[10px] mb-2">完成報告書</Badge>
                <h3 className="text-lg font-extrabold">{c.demoReport.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{c.demoReport.dateRange}｜{c.demoReport.platform}｜負責人 {c.demoReport.owner}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">已完成</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <ReportKpi label="活動業績" value={`${(c.demoReport.kpi.gmv / 10000).toFixed(0)}萬`} />
              <ReportKpi label="訂單數" value={formatNumber(c.demoReport.kpi.orders)} />
              <ReportKpi label="客單價" value={`NT$${formatNumber(c.demoReport.kpi.aov)}`} />
              <ReportKpi label="廣告回收" value={`${c.demoReport.kpi.roas} 倍`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {c.demoReport.sections.map((s: any) => (
                <div key={s.title} className="rounded-lg bg-white p-3 border border-border/30">
                  <p className="text-[11px] font-bold text-primary mb-1.5">{s.title}</p>
                  <p className="text-xs leading-relaxed text-foreground/80">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card-soft p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">完成報告書欄位</h2>
          </div>
          <p className="text-xs text-muted-foreground">之後可做成正式一鍵產出。</p>
          <div className="space-y-3">
            {c.reportTemplate.map((f: any, i: number) => (
              <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 text-[11px] font-bold">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.items}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function KanbanColumn({ title, status, cards }: { title: string; status: string; cards: any[] }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-bold">{title}</p>
        <Badge variant="outline" className="text-[10px] rounded-full">{cards.length}</Badge>
      </div>
      <div className="space-y-2.5">
        {cards.map((card: any, i: number) => (
          <div key={i} className="rounded-xl border border-border/60 bg-white p-3.5 space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-1 flex-wrap">
              <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', STATUS_COLOR[status as keyof typeof STATUS_COLOR])}>
                {status}
              </Badge>
              {card.platforms?.map((p: string) => (
                <Badge key={p} variant="outline" className={cn('text-[10px] font-bold rounded-md', PLATFORM_COLOR[p])}>{p}</Badge>
              ))}
            </div>
            <p className="text-sm font-bold leading-tight">{card.name}</p>
            <p className="text-[10px] text-muted-foreground">{card.dateRange}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{card.description}</p>
            {(card.gmv != null || card.aov != null) && (
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/40">
                <div className="rounded-md bg-secondary/40 p-2 text-center">
                  <p className="text-[9px] text-muted-foreground">業績</p>
                  <p className="text-sm font-extrabold mt-0.5">{card.gmv != null ? `${card.gmv}萬` : '—'}</p>
                </div>
                <div className="rounded-md bg-secondary/40 p-2 text-center">
                  <p className="text-[9px] text-muted-foreground">客單價</p>
                  <p className="text-sm font-extrabold mt-0.5">{card.aov ? `NT$${formatNumber(card.aov)}` : '—'}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2.5 border border-border/30 text-center">
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-base font-extrabold">{value}</p>
    </div>
  );
}
