import { Map, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  name: string;
  description?: string;
}

export function RoadmapPage({ name, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
        <Map className="w-7 h-7 text-accent-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {description ?? '此頁面已規劃，V2 / V3 將實作完成。'}
      </p>
      <Badge variant="secondary" className="gap-1.5">
        <Sparkles className="w-3 h-3" />
        Roadmap
      </Badge>
    </div>
  );
}
