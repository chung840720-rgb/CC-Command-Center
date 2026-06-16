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
  Eye,
  AlertTriangle,
  Rocket,
  Brain,
  Sparkles,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 4 父分類，對應 6-perspectives PM 思考框架（非老闆 dashboard 結構）
// 看戰情按通路切（每通路內分自然/付費）— 一個畫面把通路全貌看完
const navConfig = [
  {
    type: 'dropdown' as const,
    label: '看戰情',
    icon: Eye,
    perspective: '數據觀測員',
    items: [
      { label: '戰情總覽', subtitle: '跨通路 KPI + 月度視角', to: '/' },
      { label: '官網', subtitle: '自然 + 付費拆分（Shopline）', to: '/shopline' },
      { label: '蝦皮', subtitle: '自然 + 付費拆分', to: '/shopee' },
      { label: 'MoMo', subtitle: '自然 + 付費拆分', to: '/momo' },
      { label: '蝦皮直營', subtitle: '新通路卡位戰', to: '/shopee-direct' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '找問題',
    icon: AlertTriangle,
    perspective: '策略軍師 + 外部雷達官',
    items: [
      { label: '異常監測', subtitle: '今日要關注的事', to: '/alerts' },
      { label: 'AI 決策建議', subtitle: '套 SOP 給三段式分析', to: '/insights' },
      { label: '競品雷達', subtitle: '廣告 + 官網 AI 解析', to: '/ads/competitor' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '做行動',
    icon: Rocket,
    perspective: '執行操盤手 + 內部關係官',
    items: [
      { label: '🏷️ 品類貢獻度', subtitle: 'PM 撥動業績的核心 — 廣告動作 ↔ 品類反應', to: '/category' },
      { label: '📘 廣告效率', subtitle: 'Meta MCP + Google + 素材分析', to: '/ads/meta' },
      { label: '👑 VIP 會員行為', subtitle: '🆕 3 等級 + 升級試算（Shopline MCP）', to: '/vip' },
      { label: '👥 自動受眾包', subtitle: '🆕 CRM × AI 跨 MCP 工作流 · 8 包', to: '/audience-packs' },
      { label: '商品 SKU + 滯銷', subtitle: '🆕 庫存日數燈號（Shopline MCP）', to: '/products' },
      { label: '活動 + ROI 排行', subtitle: '🆕 6 個月 ROI 排行（Shopline MCP）', to: '/campaign' },
    ],
  },
  {
    type: 'dropdown' as const,
    label: '沉澱與信任',
    icon: Brain,
    perspective: '成長觀察員',
    items: [
      { label: '📚 SOP Skills 索引', subtitle: '19 份個人能力沉澱（2 master + 17 SOP）', to: '/skills' },
      { label: '💬 PM Prompt 庫', subtitle: '🆕 50 個 Shopline MCP × PM 範本', to: '/pm-prompts' },
      { label: '🚀 資料管線架構', subtitle: '4 平台反向工程（過去沉澱）', to: '/data-pipeline' },
      { label: '📝 迭代軌跡', subtitle: '單日 14+ 個版本', to: '/changelog' },
      { label: '🛡 信任聲明', subtitle: '為什麼 Demo Only — 商業道德承諾', to: '/trust' },
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
            <Sparkles className="w-5 h-5 text-primary" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">Johnny PM 工作台</span>
            <span className="text-[10px] tracking-[2px] text-muted-foreground font-bold">6-PERSPECTIVES · ECOMMERCE</span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5 ml-2">
          {navConfig.map((item) => {
            const ItemIcon = item.icon;
            const anyActive = item.items.some((sub) => isActive(sub.to));
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={anyActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-10 rounded-full font-semibold text-xs px-3 gap-1.5',
                      anyActive && 'shadow-md shadow-primary/25'
                    )}
                  >
                    {ItemIcon && <ItemIcon className="w-3.5 h-3.5" strokeWidth={2.4} />}
                    {item.label}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-xl p-2 min-w-[280px]">
                  {item.perspective && (
                    <div className="px-3 py-2 mb-1 rounded-md bg-primary/5 border border-primary/10">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">6 切角視角</p>
                      <p className="text-xs font-bold text-primary mt-0.5">{item.perspective}</p>
                    </div>
                  )}
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
          <Button asChild variant="outline" size="sm" className="h-10 rounded-full font-semibold text-xs gap-1.5">
            <Link to="/">
              <Home className="w-3.5 h-3.5" />
              首頁
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
