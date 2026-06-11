import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  Pencil,
  Gauge,
  Store,
  Megaphone,
  Calendar,
  Search,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navConfig = [
  { type: 'link' as const, label: '作戰總覽', to: '/', icon: Gauge },
  {
    type: 'dropdown' as const,
    label: '電商通路',
    icon: Store,
    items: [
      { label: '官網 Shopline', subtitle: '流量轉換看商品頁', to: '/shopline' },
      { label: '蝦皮旗艦', subtitle: '活動與排名觀察', to: '/shopee' },
      { label: 'MoMo+', subtitle: '檔期與量體', to: '/momo' },
      { label: '蝦皮直營', subtitle: '戰略卡位', to: '/shopee-direct' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '數位廣告',
    icon: Megaphone,
    items: [
      { label: 'Meta 廣告', subtitle: 'Meta 投放數據與素材判斷', to: '/ads/meta' },
      { label: 'Google 廣告', subtitle: 'Google 搜尋與廣告表現', to: '/ads/google' },
      { label: '素材成效', subtitle: '素材 CTR、CPM、ROAS 比較', to: '/ads/creatives' },
      { label: '競品廣告分析', subtitle: '競品廣告投放觀察', to: '/ads/competitor' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '行動與活動',
    icon: Calendar,
    items: [
      { label: '活動規劃', subtitle: '檔期 timeline', to: '/campaign' },
      { label: '異常監測', subtitle: '今日要關注的事', to: '/alerts' },
      { label: '上傳報表', subtitle: '手動補資料入口', to: '/upload' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '觀察分析',
    icon: Search,
    items: [
      { label: 'AI 決策建議', subtitle: '異常 + 行動建議', to: '/insights' },
      { label: '行銷漏斗', subtitle: '全鏈路 funnel', to: '/funnel' },
      { label: '品類熱度', subtitle: '跨平台品類', to: '/category' },
      { label: '競品網站', subtitle: 'AI 解析競品', to: '/competitor-web' },
      { label: 'GA 分析', subtitle: 'GA4 流量行為', to: '/analytics' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '資料與設定',
    icon: Settings,
    items: [
      { label: '商品資料', subtitle: 'SKU 級別 ETL', to: '/products' },
      { label: '操作日誌', subtitle: 'team 互動紀錄', to: '/log' },
      { label: '願池', subtitle: '許願清單', to: '/wishpool' },
      { label: '平台串接', subtitle: 'API auth 管理', to: '/connect' },
    ],
  },
];

export function TopNav() {
  const { pathname } = useLocation();
  const isActive = (p: string) => pathname === p;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 mr-4 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 ring-1 ring-primary/30 flex items-center justify-center shadow-sm">
            <Gauge className="w-5 h-5 text-primary" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">電商作戰中心</span>
            <span className="text-[10px] tracking-[2px] text-muted-foreground font-bold">DEMO COMMAND</span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5 ml-2">
          {navConfig.map((item) => {
            const ItemIcon = item.icon;
            if (item.type === 'link') {
              return (
                <Button
                  key={item.label}
                  asChild
                  variant={isActive(item.to) ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-10 rounded-full font-semibold text-xs px-4 gap-1.5',
                    isActive(item.to) && 'shadow-md shadow-primary/25'
                  )}
                >
                  <Link to={item.to}>
                    {ItemIcon && <ItemIcon className="w-3.5 h-3.5" strokeWidth={2.4} />}
                    {item.label}
                  </Link>
                </Button>
              );
            }
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 rounded-full font-semibold text-xs px-3 gap-1.5"
                  >
                    {ItemIcon && <ItemIcon className="w-3.5 h-3.5" strokeWidth={2.4} />}
                    {item.label}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-xl p-2 min-w-[260px]">
                  {item.items.map((sub) => (
                    <DropdownMenuItem key={sub.to} asChild className="rounded-lg p-0">
                      <Link
                        to={sub.to}
                        className="cursor-pointer w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-accent/60"
                      >
                        {ItemIcon && (
                          <div className="w-8 h-8 rounded-lg bg-accent/70 flex items-center justify-center shrink-0 mt-0.5">
                            <ItemIcon className="w-4 h-4 text-accent-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-tight">{sub.label}</p>
                          {'subtitle' in sub && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{sub.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </nav>

        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-10 rounded-full font-semibold text-xs gap-1.5">
            <Pencil className="w-3 h-3" />
            編輯模式
          </Button>
        </div>
      </div>
    </header>
  );
}
