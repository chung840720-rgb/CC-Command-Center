import { useEffect, useState } from 'react';
import { Crown, TrendingUp, Users, Sparkles, ArrowUpRight, Moon } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { formatNumber, cn } from '@/lib/utils';

const TIER_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  stone:  { bg: 'bg-stone-100',  text: 'text-stone-700',  border: 'border-stone-300' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
};

export default function Vip() {
  const [data, setData] = useState<any>(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const vip = data.vipCohort;
  if (!vip) return <div className="p-6">尚無 VIP cohort 資料</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Crown className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 內部關係官 + CRM 視角</p>
            <h1 className="text-3xl font-black tracking-tight">👑 VIP 會員行為分析</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              透過 <strong>Shopline MCP</strong> 套用 <code className="px-1 bg-secondary rounded text-[10px]">shopline-pm-prompts.md D1-D10</code> 自動分析：
              3 等級行為差異 / 升級門檻試算 / 沉睡 VIP 名單 / 高 LTV 共同特徵。
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Badge className="bg-amber-100 text-amber-700 rounded-md text-xs font-bold border-amber-200">
                📦 Shopline MCP × CRM
              </Badge>
              <SopBadge skills={[{ name: 'shopline-pm-prompts.md', version: 'v1.0' }]} />
              <DateRangeSwitcher value="last30" compact />
            </div>
          </div>
        </div>
      </section>

      {/* 三等級行為對比 */}
      <section className="card-soft p-6 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">📊 3 等級行為對比</h2>
          <p className="text-xs text-muted-foreground mt-1">{vip.period} 行為差異總覽</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {vip.tiers.map((t: any) => {
            const c = TIER_COLOR[t.color];
            return (
              <div key={t.name} className={cn('card-soft p-5 border-2', c.border, c.bg.replace('bg-', 'bg-') + '/30')}>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className={cn('w-5 h-5', c.text)} />
                  <h3 className={cn('text-xl font-extrabold', c.text)}>{t.name}</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">會員數</span>
                    <span className="font-extrabold">{formatNumber(t.memberCount)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">平均客單</span>
                    <span className="font-bold">NT${formatNumber(t.avgOrderValue)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">月下單頻率</span>
                    <span className="font-bold">{t.monthlyOrderFreq} 次</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">90 日留存</span>
                    <span className="font-bold">{t.retention90d}%</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">購物金使用</span>
                    <span className="font-bold">{t.creditUsageRate}%</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">平均 LTV</span>
                    <span className={cn('font-extrabold text-base', c.text)}>NT${formatNumber(t.avgLTV)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/40">
                    <p className="text-[10px] text-muted-foreground mb-1">偏好品類 Top 3</p>
                    <div className="flex flex-wrap gap-1">
                      {t.preferredCategories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="text-[9px] font-bold">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 升級門檻試算（互動式）*/}
      <section className="card-soft p-6 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            ⚙️ 升級門檻試算器
          </h2>
          <p className="text-xs text-muted-foreground mt-1">調整門檻 → 預估升級人數 + GMV 增量</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {vip.upgradeSimulation.scenarios.map((s: any, i: number) => (
            <button
              key={i}
              onClick={() => setScenarioIdx(i)}
              className={cn(
                'rounded-xl border-2 p-4 transition-all text-left',
                scenarioIdx === i ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-secondary/20 hover:border-primary/40'
              )}
            >
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">門檻</p>
              <p className="text-lg font-extrabold mt-1">NT${formatNumber(s.threshold)}</p>
              <p className="text-[10px] text-muted-foreground mt-2">可升級人數</p>
              <p className="text-base font-bold text-amber-700">{formatNumber(s.eligibleSilver)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">預期 GMV +</p>
              <p className="text-sm font-extrabold text-emerald-600">NT${(s.estimatedGmvLift / 10000).toFixed(0)}萬</p>
            </button>
          ))}
        </div>
        <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/40 text-xs leading-relaxed">
          <strong className="font-bold">當前選擇：</strong>{vip.upgradeSimulation.scenarios[scenarioIdx].note}
          <br />
          <strong className="font-bold">🎯 AI 建議：</strong>{vip.upgradeSimulation.recommendation}
        </div>
      </section>

      {/* 沉睡 VIP 名單 + 高 LTV 特徵 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        {/* 沉睡 VIP */}
        <section className="card-soft p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-stone-500" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">😴 沉睡 VIP 名單</h2>
              <p className="text-[10px] text-muted-foreground">{vip.sleepingVips.description} · 共 {vip.sleepingVips.total} 人</p>
            </div>
          </div>
          <div className="space-y-2">
            {vip.sleepingVips.top5.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-stone-50 border border-stone-200/40">
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className={cn(
                    'text-[10px] font-bold',
                    v.tier === '白金' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                  )}>{v.tier}卡</Badge>
                  <span className="font-mono text-xs">{v.id}</span>
                  <span className="text-[10px] text-muted-foreground">/ 偏好 {v.preferredCategory}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-stone-700">{v.daysSinceOrder} 天無下單</p>
                  <p className="text-[10px] text-muted-foreground">LTV NT${formatNumber(v.ltv)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground italic">建議客服優先電話致意 — 不送禮，只問候</p>
        </section>

        {/* 高 LTV 共同特徵 */}
        <section className="card-soft p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">🌟 高 LTV 共同特徵</h2>
              <p className="text-[10px] text-muted-foreground">前 10% 高 LTV 客戶的 5 個預測因子</p>
            </div>
          </div>
          <div className="space-y-2">
            {vip.highLtvTraits.map((tr: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/40">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">{tr.trait}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold border-emerald-200">{tr.impact}</Badge>
                  <Badge variant="outline" className="text-[9px] font-bold">{tr.confidence}</Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground italic">💡 行銷可優化：首購 promo 設 NT$ 1,500 + 30 天內回購激勵</p>
        </section>
      </div>

      {/* 4 階段哲學 narrative */}
      <section className="card-soft p-5 bg-gradient-to-br from-amber-50/40 to-violet-50/30 border-amber-200/40">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-amber-700 mb-1">📚 套用 4 階段哲學</p>
            <p className="text-foreground/80">
              <strong>串聯：</strong>orders + customers + membership_tier_data ← <strong>找脈絡：</strong>3 等級行為對比 ← <strong>AI 建議：</strong>升級門檻試算 + 沉睡名單 ← <strong>輔助判定：</strong>留決定權給 CRM 組（不替妳發推播）
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
