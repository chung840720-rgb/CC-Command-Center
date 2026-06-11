import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Pencil, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navConfig = [
  { type: 'link' as const, label: '作戰總覽', to: '/' },
  {
    type: 'dropdown' as const,
    label: '電商通路',
    items: [
      { label: '官網 Shopline', to: '/shopline' },
      { label: '蝦皮旗艦', to: '/shopee' },
      { label: 'MoMo+', to: '/momo' },
      { label: '蝦皮直營', to: '/shopee-direct' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '數位廣告',
    items: [
      { label: 'Meta 廣告', to: '/ads/meta' },
      { label: 'Google 廣告', to: '/ads/google' },
      { label: '廣告素材', to: '/ads/creatives' },
      { label: '競品廣告', to: '/ads/competitor' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '行動與活動',
    items: [
      { label: '活動規劃', to: '/campaign' },
      { label: '異常監測', to: '/alerts' },
      { label: '上傳報表', to: '/upload' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '觀察分析',
    items: [
      { label: 'AI 決策建議', to: '/insights' },
      { label: '行銷漏斗', to: '/funnel' },
      { label: '品類熱度', to: '/category' },
      { label: '競品網站', to: '/competitor-web' },
      { label: 'GA 分析', to: '/analytics' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '資料與設定',
    items: [
      { label: '商品資料', to: '/products' },
      { label: '操作日誌', to: '/log' },
      { label: '願池', to: '/wishpool' },
      { label: '平台串接', to: '/connect' },
    ],
  },
];

export function TopNav() {
  const { pathname } = useLocation();
  const isActive = (p: string) => pathname === p;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">電商作戰中心</span>
            <span className="text-[10px] tracking-[2px] text-muted-foreground font-medium">CLEANCLEAN COMMAND</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 ml-2">
          {navConfig.map((item) =>
            item.type === 'link' ? (
              <Button
                key={item.label}
                asChild
                variant={isActive(item.to) ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'h-9 rounded-full font-semibold text-xs px-4',
                  isActive(item.to) && 'shadow-sm'
                )}
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ) : (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-full font-semibold text-xs px-3 gap-1"
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-xl">
                  {item.items.map((sub) => (
                    <DropdownMenuItem key={sub.to} asChild>
                      <Link to={sub.to} className="cursor-pointer">{sub.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </nav>

        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-9 rounded-full font-semibold text-xs gap-1.5">
            <Pencil className="w-3 h-3" />
            編輯模式
          </Button>
        </div>
      </div>
    </header>
  );
}
