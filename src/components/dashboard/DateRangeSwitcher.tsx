import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateRangeKey = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';

export interface DateRange {
  key: DateRangeKey;
  label: string;
  start?: string;
  end?: string;
}

const PRESETS: DateRange[] = [
  { key: 'today',     label: '今天'    },
  { key: 'yesterday', label: '昨天'    },
  { key: 'last7',     label: '近 7 天'  },
  { key: 'last30',    label: '近 30 天' },
];

interface Props {
  value?: DateRangeKey;
  onChange?: (range: DateRange) => void;
  className?: string;
  compact?: boolean;
}

export function DateRangeSwitcher({ value = 'last7', onChange, className, compact }: Props) {
  const [active, setActive] = useState<DateRangeKey>(value);
  const [customOpen, setCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePick = (range: DateRange) => {
    setActive(range.key);
    onChange?.(range);
  };

  const handleCustom = () => {
    if (customStart && customEnd) {
      const range: DateRange = { key: 'custom', label: `${customStart} ~ ${customEnd}`, start: customStart, end: customEnd };
      setActive('custom');
      setCustomOpen(false);
      onChange?.(range);
    }
  };

  return (
    <div className={cn('relative inline-flex items-center gap-1 p-1 rounded-full bg-secondary/60 border border-border', className)}>
      <Calendar className={cn('text-muted-foreground ml-2 mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => handlePick(p)}
          className={cn(
            'rounded-full font-semibold transition-colors',
            compact ? 'h-6 px-2.5 text-[10px]' : 'h-7 px-3 text-xs',
            active === p.key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
          )}
        >
          {p.label}
        </button>
      ))}
      <button
        onClick={() => setCustomOpen((o) => !o)}
        className={cn(
          'rounded-full font-semibold transition-colors flex items-center gap-1',
          compact ? 'h-6 px-2.5 text-[10px]' : 'h-7 px-3 text-xs',
          active === 'custom'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground/70 hover:text-foreground hover:bg-white/50'
        )}
      >
        自訂
        <ChevronDown className={cn('opacity-60', compact ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
      </button>

      {customOpen && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-border z-50 flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-2 py-1 text-xs rounded border border-border outline-none focus:border-primary"
          />
          <span className="text-xs text-muted-foreground">~</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-2 py-1 text-xs rounded border border-border outline-none focus:border-primary"
          />
          <button
            onClick={handleCustom}
            disabled={!customStart || !customEnd}
            className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40"
          >
            套用
          </button>
        </div>
      )}
    </div>
  );
}
