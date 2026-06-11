import type { Channel } from '@/types/dashboard';
import { Globe, ShoppingBag, Store } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const ICONS = {
  globe: Globe,
  'shopping-bag': ShoppingBag,
  store: Store,
};

interface Props {
  channel: Channel;
}

export function ChannelCard({ channel }: Props) {
  const Icon = ICONS[channel.icon as keyof typeof ICONS] ?? Globe;
  return (
    <div className="card-soft p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-foreground" />
        </div>
        <h3 className="text-base font-bold">{channel.label}</h3>
      </div>

      <p className="text-xs text-muted-foreground">{channel.characteristic.replace(/。$/, '')}</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-muted-foreground">業績</p>
          <p className="text-lg font-extrabold">{formatCurrency(channel.monthlyGmv)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">達成</p>
          <p className="text-lg font-extrabold">{channel.achievement}%</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">年度累計</p>
          <p className="text-sm font-bold">{formatCurrency(channel.yearlyGmv)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">ROAS</p>
          <p className="text-sm font-bold">{channel.roas} 倍</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">訂單</p>
          <p className="text-sm font-bold">{channel.orders}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">YTD 佔比</p>
          <p className="text-sm font-bold">{channel.ytdShare}%</p>
        </div>
      </div>

      <div className="pt-3 border-t border-border/60">
        <p className="text-xs leading-relaxed text-muted-foreground">{channel.recommendation}</p>
      </div>
    </div>
  );
}
