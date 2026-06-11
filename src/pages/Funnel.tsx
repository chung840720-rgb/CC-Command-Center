import { useEffect, useState } from 'react';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ArrowDown, Megaphone, MousePointerClick, ShoppingCart, CreditCard } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  impression: Megaphone,
  session: MousePointerClick,
  addToCart: ShoppingCart,
  checkout: CreditCard,
  purchase: CreditCard,
};

export default function Funnel() {
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;

  const { funnel, ads } = data;
  const max = Math.max(...funnel.stages.map((s) => s.value));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">行銷漏斗總覽</h1>
        <p className="text-sm text-muted-foreground">
          整合 Meta 廣告觸及 + GA4 進站行為 + Shopline 訂單，從廣告投放到完成購買全鏈路監測。
        </p>
      </header>

      {/* 4 KPI top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="FB 觸及" value={`${(ads.meta.reach / 10000).toFixed(0)}萬`} subValue={`花費 ${(ads.meta.spend / 10000).toFixed(1)}萬`} />
        <KpiCard label="加購率" value="53.3%" subValue="基準 50%+ ✅" />
        <KpiCard label="完成購買率" value="75.0%" subValue="基準 50%+ ✅" />
        <KpiCard label="整體 ROAS" value={`${ads.meta.roas} 倍`} subValue="花費效率穩定" />
      </div>

      {/* Funnel viz */}
      <section className="card-soft p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold">官網 Shopline 漏斗</h2>
          <Badge variant="outline" className="text-xs">過去 30 天</Badge>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          {funnel.stages.map((stage, i) => {
            const widthPct = (stage.value / max) * 100;
            const Icon = STAGE_ICONS[stage.key] ?? Megaphone;
            return (
              <div key={stage.key} className="space-y-2">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-all',
                    'bg-gradient-to-r from-primary/15 to-primary/5'
                  )}
                  style={{ width: `${widthPct}%`, minWidth: '280px' }}
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{stage.label}</p>
                    <p className="text-lg font-extrabold">{formatNumber(stage.value)}</p>
                  </div>
                  {stage.rate !== null && (
                    <Badge variant="secondary" className="text-[10px] font-bold shrink-0">
                      {stage.rate}%
                    </Badge>
                  )}
                </div>
                {i < funnel.stages.length - 1 && (
                  <div className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                    <ArrowDown className="w-3 h-3" />
                    <span>
                      流失 {(((stage.value - funnel.stages[i + 1].value) / stage.value) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border/60">
          <p className="text-xs font-bold text-muted-foreground mb-2">關鍵觀察</p>
          <ul className="space-y-1.5 text-sm">
            <li>• 進站 → 加購率 53%，遠高於業界平均（30-40%），代表官網商品頁說服力強</li>
            <li>• 加購 → 結帳掉到 22.5%（流失最大），可能金流頁面卡頓或物流選項不清楚</li>
            <li>• 結帳 → 購買 75%，正常區間</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
