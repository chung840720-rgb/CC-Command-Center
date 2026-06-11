import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  skills: { name: string; version?: string }[];
  className?: string;
}

/**
 * 在 page header 下方顯示「📋 套用 SOP」標記，點擊跳 /skills 索引
 * 用於彰顯這個 dashboard 不是純 AI demo，是真實工作工具
 */
export function SopBadge({ skills, className }: Props) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
        <FileText className="w-3 h-3" />
        本頁套用 SOP：
      </span>
      {skills.map((s) => (
        <Link key={s.name} to="/skills">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold gap-1 hover:bg-primary/20 cursor-pointer transition-colors font-mono"
          >
            {s.name} {s.version && <span className="opacity-70">{s.version}</span>}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
