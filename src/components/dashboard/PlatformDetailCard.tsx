import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface PlatformDetail {
  id: string;
  label: string;
  color: 'red' | 'orange' | 'cyan';
  achievementPct: number;
  gmv: number;
  achievementBar: number;
  target: number;
  uv: number;
  orders: number;
  aov: number;
  adSpend: number;
  roas: number;
  rating: string;
  ratingColor: 'green' | 'red' | 'amber';
}

const BORDER = {
  red: 'border-l-red-500',
  orange: 'border-l-orange-500',
  cyan: 'border-l-rose-400',
};

const BAR = {
  red: 'bg-red-400',
  orange: 'bg-orange-400',
  cyan: 'bg-rose-400',
};

const BADGE_TOP = {
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  cyan: 'bg-rose-100 text-rose-700',
};

const RATING_COLOR = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
};

export function PlatformDetailCard({ data }: { data: PlatformDetail }) {
  return (
    <div className={cn('card-soft p-5 border-l-4 space-y-4', BORDER[data.color])}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">{data.label}</h3>
        <Badge variant="secondary" className={cn('text-xs font-bold rounded-full', BADGE_TOP[data.color])}>
          {data.achievementPct}%
        </Badge>
      </div>

      <div>
        <p className="text-2xl font-extrabold tracking-tight">NT${formatNumber(data.gmv)}</p>
        <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 uppercase">月中數據 MTD</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">目標達成率</span>
          <span className="font-bold">{data.achievementBar}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', BAR[data.color])}
            style={{ width: `${Math.min(data.achievementBar, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">目標 {formatCurrency(data.target)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <p className="text-sm font-extrabold">{formatNumber(data.uv)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">流量 UV</p>
        </div>
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <p className="text-sm font-extrabold">{data.orders}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">訂單數</p>
        </div>
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <p className="text-sm font-extrabold">NT${formatNumber(data.aov)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">客單價</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 items-center pt-3 border-t border-border/60">
        <div className="text-center">
          <p className="text-sm font-extrabold">{(data.adSpend / 10000).toFixed(1)}萬</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">廣告費</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-extrabold">{data.roas}x</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">ROAS</p>
        </div>
        <div className="text-center">
          <Badge variant="outline" className={cn('text-xs font-bold rounded-md border', RATING_COLOR[data.ratingColor])}>
            {data.rating}
          </Badge>
          <p className="text-[10px] text-muted-foreground mt-0.5">評比</p>
        </div>
      </div>
    </div>
  );
}
