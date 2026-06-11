import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconBg?: string;
  breadcrumb?: string;
  title: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
  callout?: string;
  calloutVariant?: 'amber' | 'sky';
}

export function PageHeader({
  icon: Icon,
  iconBg = 'bg-primary/15 text-primary',
  breadcrumb,
  title,
  subtitle,
  rightSlot,
  callout,
  calloutVariant = 'amber',
}: Props) {
  return (
    <section className="card-soft p-6 lg:p-7">
      <div className="flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', iconBg)}>
            <Icon className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            {breadcrumb && (
              <p className="text-[11px] text-muted-foreground font-bold mb-1.5">{breadcrumb}</p>
            )}
            <h1 className="text-3xl font-black tracking-tight mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground max-w-prose leading-relaxed">{subtitle}</p>
            {callout && (
              <Badge
                variant="secondary"
                className={cn(
                  'mt-4 rounded-full text-xs font-semibold px-3 py-1.5 border',
                  calloutVariant === 'amber' && 'bg-amber-50 text-amber-900 border-amber-200',
                  calloutVariant === 'sky' && 'bg-sky-50 text-sky-900 border-sky-200'
                )}
              >
                {callout}
              </Badge>
            )}
          </div>
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </section>
  );
}
