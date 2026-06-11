import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'flat';
  highlight?: 'primary' | 'destructive' | 'success';
}

export function KpiCard({ label, value, subValue, highlight }: Props) {
  return (
    <div className="card-soft p-5">
      <p className="text-xs text-muted-foreground font-medium mb-2">{label}</p>
      <p
        className={cn(
          'text-2xl font-extrabold tracking-tight',
          highlight === 'destructive' && 'text-destructive',
          highlight === 'primary' && 'text-primary'
        )}
      >
        {value}
      </p>
      {subValue && <p className="text-xs text-muted-foreground mt-1.5">{subValue}</p>}
    </div>
  );
}
