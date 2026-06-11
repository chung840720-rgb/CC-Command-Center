import { useEffect, useState } from 'react';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ChannelCard } from '@/components/dashboard/ChannelCard';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Eye,
  Target,
  Sparkles,
  Compass,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Gauge,
} from 'lucide-react';

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

export default function Home() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [activeMonthIdx, setActiveMonthIdx] = useState(4);  // 預設 5月

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-72 w-full rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // 依 activeMonthIdx 取對應月份 KPI
  const monthKey = MONTHS[activeMonthIdx];
  const monthTotal = (data as any).monthlyTotal?.[monthKey];
  const kpi = monthTotal
    ? {
        monthlyGmv: { value: monthTotal.gmv, target: monthTotal.target, achievement: monthTotal.achievement },
        ytdGmv: data.kpi.ytdGmv,
        monthlyOrders: monthTotal.orders,
        roas: monthTotal.roas,
        adSpend: monthTotal.adSpend,
      }
    : data.kpi;
  const monthLabel = monthKey;

  // 依 activeMonthIdx swap 各通路卡資料
  const channels = data.channels.map((c: any) => {
    const m = (data as any).monthlyByPlatform?.[c.id]?.[monthKey];
    if (!m) return c;
    return {
      ...c,
      monthlyGmv: m.gmv,
      achievement: m.achievement,
      roas: m.roas,
      orders: m.orders,
      ytdShare: m.sharePct,
    };
  });

  return (
    <div className="space-y-6">
      <SopBadge skills={[
        { name: 'cleanclean-pm.md', version: 'v7.3' },
        { name: 'monthly-report-mindset.md', version: 'v1.0' },
        { name: '6-perspectives.md', version: 'v1.0' },
      ]} />

      {/* Hero card */}
      <section className="hero-gradient rounded-3xl border border-white/60 shadow-[0_4px_30px_-8px_rgba(20,180,200,0.15)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 p-10">
          {/* Left */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <Badge variant="outline" className="bg-white/70 backdrop-blur rounded-full font-semibold text-xs gap-1.5 py-1 px-3 shadow-sm border-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                官網・蝦皮・MoMo 3大電商通路
              </Badge>
              <h1 className="text-[3.5rem] font-black leading-[1.05] tracking-tight">
                <span className="bg-gradient-to-r from-primary via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  數位電商3大平台
                </span>
                <br />
                <span className="text-foreground">行銷增長作戰中心</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Johnny demo 品牌核心營收來源，主力戰場
              </p>
            </div>
            <Badge variant="secondary" className="bg-amber-100/70 text-amber-900 border-amber-200/60 rounded-full px-3 py-1 text-xs font-semibold w-fit">
              {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}｜目前查看 {MONTHS[activeMonthIdx]} 累積
            </Badge>
          </div>

          {/* Right — KPI panel */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-md p-5 space-y-4 border border-white/80 shadow-[0_8px_30px_-12px_rgba(20,180,200,0.25)]">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">今日作戰摘要</p>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-base font-bold text-foreground/85">數字、認知、經驗 ，決定行動</p>

            <div className="space-y-2.5">
              <div className="rounded-xl bg-gradient-to-br from-white to-secondary/30 p-3.5 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">{monthKey}業績</p>
                <p className="text-xl font-extrabold tracking-tight">{formatCurrency(kpi.monthlyGmv.value)}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">達成 {kpi.monthlyGmv.achievement}%</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-white to-secondary/30 p-3.5 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">年度累計</p>
                <p className="text-xl font-extrabold tracking-tight">{formatCurrency(kpi.ytdGmv.value)}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">YTD 達成 {kpi.ytdGmv.achievement}%</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-white to-secondary/30 p-3.5 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">ROAS（廣告投報率）</p>
                <p className="text-xl font-extrabold tracking-tight">{kpi.roas} 倍</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">花費 {formatCurrency(kpi.adSpend)}</p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-xl px-3 py-2.5 text-xs font-medium text-accent-foreground/90">
              會議節奏：看戰情、拆通路、開行動、做復盤。
            </div>
          </div>
        </div>
      </section>

      {/* 4 KPI grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={`${monthLabel}業績`}
          value={`${(kpi.monthlyGmv.value / 10000).toFixed(0)}萬`}
          subValue={formatCurrency(kpi.monthlyGmv.value)}
        />
        <KpiCard
          label="目標達成"
          value={`${kpi.monthlyGmv.achievement}%`}
          subValue={`還差 ${formatCurrency(Math.max(0, kpi.monthlyGmv.target - kpi.monthlyGmv.value))}`}
          highlight={kpi.monthlyGmv.achievement >= 100 ? undefined : "destructive"}
        />
        <KpiCard
          label="年度累計業績"
          value={`${(kpi.ytdGmv.value / 10000).toFixed(0)}萬`}
          subValue={`YTD ${kpi.ytdGmv.achievement}%`}
        />
        <KpiCard
          label="訂單數"
          value={`${formatNumber(kpi.monthlyOrders)} 筆`}
          subValue="三通路合計"
        />
      </section>

      {/* 3 警示 row */}
      <section className="flex flex-wrap gap-x-8 gap-y-3 px-1">
        <div className="flex items-center gap-2 text-sm">
          <TrendingDown className="w-4 h-4 text-destructive" />
          <span className="text-muted-foreground">優先修正</span>
          <span className="font-semibold">官網 ROAS 偏低</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">加碼候選</span>
          <span className="font-semibold">MOMO 回收最高</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">今日節奏</span>
          <span className="font-semibold">判斷 → 行動 → 復盤</span>
        </div>
      </section>

      {/* 通路儀錶板 */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold">電商通路儀錶板</h2>
            <p className="text-xs text-muted-foreground mt-1">
              綜合看總業績，再拆到各通路找原因：官網看轉換，蝦皮看活動與品項，MoMo 看檔期與量體。
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            上傳蝦皮 / MoMo 報表 <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        {/* Month tabs (functional) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {MONTHS.map((m, i) => {
            const hasData = !!(data as any).monthlyTotal?.[m];
            const isActive = i === activeMonthIdx;
            return (
              <button
                key={m}
                onClick={() => setActiveMonthIdx(i)}
                className={`shrink-0 px-3 h-8 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : hasData
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'bg-secondary/40 text-muted-foreground/60 hover:bg-secondary/60'
                }`}
              >
                {m}
                {isActive && hasData && <span className="ml-1.5 text-[9px] opacity-80">MTD</span>}
                {!hasData && <span className="ml-1.5 text-[9px] opacity-60">待匯入</span>}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {channels.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      </section>

      {/* 議程 + 行動建議 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">作戰會議議程</h3>
              <p className="text-xs text-muted-foreground mt-1">AI 分析議程建議</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Eye className="w-3 h-3" />
              看戰情
            </Button>
          </div>
          <div className="space-y-3">
            {data.agenda.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">今日行動建議</h3>
              <p className="text-xs text-muted-foreground mt-1">有洞察，才有好策略 有執行，才有好結果</p>
            </div>
            <Button size="sm" variant="ghost" className="text-primary text-xs">看日誌</Button>
          </div>
          <div className="space-y-3">
            {data.todayActions.map((act, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{act.owner}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium">{act.status}</p>
                  <p className="text-sm font-medium truncate">{act.task}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {act.status === '今日判斷' ? '今日判斷' : act.status === '可行動' ? '可行動' : '復盤中'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 作戰路徑 */}
      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">作戰路徑</h3>
            <p className="text-xs text-muted-foreground mt-1">真正切頁靠左側，首頁只保留今天最常走的路徑。</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Compass className="w-3 h-3" />
            檢查串接狀態
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '看戰情', desc: '業績、目標、ROAS、缺口', icon: Eye },
            { label: '拆通路', desc: '官網、蝦皮、MoMo 各自診斷', icon: Target },
            { label: '開行動', desc: '記錄誰要做什麼、何時檢查', icon: Sparkles },
            { label: '做復盤', desc: '活動結束後留下下次可用的結論', icon: CheckCircle2 },
          ].map(({ label, desc, icon: Icon }) => (
            <div
              key={label}
              className="p-4 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-accent/30 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <p className="font-bold text-sm mb-1">{label}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
