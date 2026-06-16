import type { Channel } from '@/types/dashboard';
import { Globe, ShoppingBag, Store, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

const ICONS = {
  globe: Globe,
  'shopping-bag': ShoppingBag,
  store: Store,
};

const PRIORITY_COLOR = {
  red:   'border-red-200 bg-red-50/50',
  amber: 'border-amber-200 bg-amber-50/50',
  green: 'border-emerald-200 bg-emerald-50/50',
};

const PRIORITY_BADGE = {
  red:   'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
};

interface Props {
  channel: Channel;
  weekData?: {
    last7: { gmv: number; traffic: number; cr: number; aov: number; roas: number };
    prev7: { gmv: number; traffic: number; cr: number; aov: number; roas: number };
    insight: string;
    actionPriority: 'red' | 'amber' | 'green';
  };
}

function pct(curr: number, prev: number): number {
  if (!prev) return 0;
  return +(((curr - prev) / prev) * 100).toFixed(1);
}

function DeltaCell({ value, suffix, isPercent }: { value: number; suffix?: string; isPercent?: boolean }) {
  if (Math.abs(value) < 0.05) return <span className="text-muted-foreground">—</span>;
  const up = value > 0;
  return (
    <span className={cn('inline-flex items-center gap-0.5 font-bold', up ? 'text-emerald-600' : 'text-red-500')}>
      {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {Math.abs(value).toFixed(isPercent ? 2 : 1)}{suffix || '%'}
    </span>
  );
}

export function ChannelCard({ channel, weekData }: Props) {
  const Icon = ICONS[channel.icon as keyof typeof ICONS] ?? Globe;
  const wow = weekData;

  return (
    <div className={cn(
      'card-soft p-5 space-y-4 border',
      wow ? PRIORITY_COLOR[wow.actionPriority] : 'border-border'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <Icon className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">{channel.label}</h3>
            <p className="text-[10px] text-muted-foreground">5月累計 · 近7天指標</p>
          </div>
        </div>
        {wow && (
          <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full', PRIORITY_BADGE[wow.actionPriority])}>
            {wow.actionPriority === 'red' ? '⚠️ 優先修正' : wow.actionPriority === 'amber' ? '🎯 觀察調整' : '✅ 可加碼'}
          </span>
        )}
      </div>

      {/* 5 KPI 帶週環比（取自 CC-Data-Dashboard 設計）*/}
      {wow ? (
        <div className="grid grid-cols-5 gap-2">
          <KpiSlot icon="💰" label="業績" value={formatCurrency(wow.last7.gmv)} delta={pct(wow.last7.gmv, wow.prev7.gmv)} compareValue={formatCurrency(wow.prev7.gmv)} />
          <KpiSlot icon="👥" label="流量" value={wow.last7.traffic.toLocaleString()} delta={pct(wow.last7.traffic, wow.prev7.traffic)} />
          <KpiSlot icon="🔄" label="轉換率" value={`${wow.last7.cr}%`} delta={+(wow.last7.cr - wow.prev7.cr).toFixed(2)} suffix="pp" />
          <KpiSlot icon="🛒" label="客單價" value={formatCurrency(wow.last7.aov)} delta={pct(wow.last7.aov, wow.prev7.aov)} />
          <KpiSlot icon="📈" label="ROAS" value={`${wow.last7.roas}x`} delta={+(wow.last7.roas - wow.prev7.roas).toFixed(1)} suffix="pp" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">業績</p>
            <p className="text-lg font-extrabold">{formatCurrency(channel.monthlyGmv)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">達成</p>
            <p className="text-lg font-extrabold">{channel.achievement}%</p>
          </div>
        </div>
      )}

      {/* AI 建議（內嵌通路卡 — CC-Data-Dashboard 設計核心）*/}
      {wow && (
        <div className="pt-3 border-t border-border/60">
          <p className="text-xs leading-relaxed text-foreground/85">
            <span className="font-bold mr-1">💡</span>
            {wow.insight}
          </p>
        </div>
      )}
    </div>
  );
}

function KpiSlot({
  icon, label, value, delta, suffix, compareValue
}: {
  icon: string;
  label: string;
  value: string;
  delta: number;
  suffix?: string;
  compareValue?: string;
}) {
  return (
    <div>
      <p className="text-[9px] text-muted-foreground font-medium leading-tight">{icon} {label}</p>
      <p className="text-[13px] font-extrabold tracking-tight mt-1 truncate">{value}</p>
      {compareValue && <p className="text-[8px] text-muted-foreground/70 leading-tight">vs {compareValue}</p>}
      <div className="text-[10px] mt-0.5">
        <DeltaCell value={delta} suffix={suffix} isPercent={suffix === 'pp'} />
      </div>
    </div>
  );
}
