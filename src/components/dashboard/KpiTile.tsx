import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconColor?: 'cyan' | 'green' | 'amber' | 'pink' | 'purple';
}

const COLORS = {
  cyan: 'bg-cyan-100 text-cyan-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  pink: 'bg-pink-100 text-pink-700',
  purple: 'bg-violet-100 text-violet-700',
};

export function KpiTile({ label, value, subValue, badge, icon: Icon, iconColor = 'cyan' }: Props) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', COLORS[iconColor])}>
          <Icon className="w-4 h-4" strokeWidth={2.4} />
        </div>
      </div>
      <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-1.5">{subValue}</p>}
      {badge && (
        <p className="text-[10px] text-muted-foreground font-medium mt-2">{badge}</p>
      )}
    </div>
  );
}
