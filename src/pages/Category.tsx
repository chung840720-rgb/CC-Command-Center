import { useEffect, useState } from 'react';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Category() {
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">跨平台品類熱度</h1>
        <p className="text-sm text-muted-foreground">
          整合官網 / 蝦皮 / MOMO 三平台 v4.1 品類分類 ETL，每月對齊度 99-100% 自動跑。
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.categories.map((cat) => (
          <CategoryCard key={cat.name} category={cat} />
        ))}
      </div>

      <section className="card-soft p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold">本月 AI 摘要</h2>
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">
          本月洗衣精跨 3 平台領跑（蝦皮 +35% / MOMO +22% / 官網 +28%），主因母嬰節檔期推升；
          柔濕巾因 618 排除策略呈衰退趨勢（-12 ~ -15%），為預期內；
          除黴與沐浴受夏季旺季驅動，蝦皮通路加碼有效（+12% / +20%）。
        </p>
        <p className="text-sm leading-relaxed text-foreground/85 mt-3">
          <strong>建議</strong>：7月推柔濕巾回擊檔，主打官網 VIP 私域促銷；蝦皮持續加碼沐浴 SET 組合品。
        </p>
      </section>
    </div>
  );
}

function CategoryCard({ category }: { category: Snapshot['categories'][number] }) {
  const isUp = category.trend === 'up';
  const Icon = isUp ? TrendingUp : TrendingDown;
  const avg = (category.shopline + category.shopee + category.momo) / 3;

  return (
    <div className="card-soft p-5 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-bold">{category.name}</h3>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isUp ? 'bg-primary/15 text-primary' : 'bg-destructive/10 text-destructive'
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={cn('text-3xl font-extrabold', isUp ? 'text-primary' : 'text-destructive')}>
          {avg > 0 ? '+' : ''}
          {avg.toFixed(0)}%
        </span>
        <span className="text-xs text-muted-foreground">平均</span>
      </div>

      <div className="space-y-1.5">
        {(['shopline', 'shopee', 'momo'] as const).map((p) => {
          const val = category[p];
          const label = p === 'shopline' ? '官網' : p === 'shopee' ? '蝦皮' : 'MoMo';
          return (
            <div key={p} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className={cn('font-bold', val >= 0 ? 'text-primary' : 'text-destructive')}>
                {val > 0 ? '+' : ''}
                {val}%
              </span>
            </div>
          );
        })}
      </div>

      <Badge variant="secondary" className="w-full justify-start text-[10px] font-normal py-1.5">
        {category.summary}
      </Badge>
    </div>
  );
}
