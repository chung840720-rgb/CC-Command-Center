import { useEffect, useState } from 'react';
import { Package, Search, TrendingUp, TrendingDown, AlertTriangle, Skull, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { formatNumber, cn } from '@/lib/utils';

const INV_STATUS = {
  critical: { label: '🚨 缺貨', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  healthy:  { label: '✓ 健康', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  excess:   { label: '⚠ 偏多', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  dead:     { label: '💀 滯銷', color: 'bg-stone-200 text-stone-700 border-stone-300', icon: Skull },
};

const CAT_COLOR: Record<string, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
  zinc: 'bg-zinc-400',
};

export default function Products() {
  const [data, setData] = useState<any>(null);
  const [q, setQ] = useState('');
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const p = data.productsPage;

  const list = p.list.filter((sku: any) =>
    q === '' || sku.name.includes(q) || sku.sku.toLowerCase().includes(q.toLowerCase()) || sku.category.includes(q)
  );

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 執行操盤手視角</p>
            <h1 className="text-3xl font-black tracking-tight">📦 商品 SKU</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              SKU 級別商品 + 品類分類 v4.2 ETL + GMV 趨勢。4 平台（官網/蝦皮商城/MoMo/蝦皮直營）對齊度 99%+。
            </p>
            <div className="flex gap-2 mt-3 items-center flex-wrap">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">SKU {p.totalSku} 個</Badge>
              <Badge variant="secondary" className="bg-primary/15 text-primary rounded-md text-xs font-bold">每日自動同步</Badge>
              <SopBadge skills={[
                { name: '品類分類規格_v4_1.md', version: 'v4.2' },
                { name: 'products.md', version: 'v1.0' },
              ]} />
              <DateRangeSwitcher value="last30" compact />
            </div>
          </div>
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">品類分布</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {p.categoryBreakdown.map((c: any) => (
            <div key={c.name} className="rounded-xl border border-border/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{c.name}</p>
                <span className={cn('w-2 h-2 rounded-full', CAT_COLOR[c.color])} />
              </div>
              <p className="text-xl font-extrabold">{c.count}</p>
              <p className="text-[10px] text-muted-foreground">月 GMV {(c.gmv / 10000).toFixed(1)} 萬</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🆕 滯銷預警 / 庫存燈號 — 套 Shopline MCP prompt E1+E2 */}
      {data.productInventory && (
        <section className="card-soft p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                📉 滯銷預警 + 庫存日數燈號
              </h2>
              <p className="text-xs text-muted-foreground mt-1">套 <code className="px-1 bg-secondary rounded text-[10px]">shopline-pm-prompts.md E1+E2</code> 自動產出 — 庫存 ÷ 日均訂單 = 庫存日數</p>
            </div>
            <Badge variant="outline" className="bg-stone-50 text-stone-700 text-[10px] font-bold">📦 透過 Shopline MCP</Badge>
          </div>

          {/* 4 級燈號 summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.productInventory.summary).map(([k, v]: any) => {
              const cfg = INV_STATUS[k as keyof typeof INV_STATUS];
              return (
                <div key={k} className={cn('rounded-xl border p-3 text-center', cfg.color)}>
                  <p className="text-[10px] font-bold uppercase tracking-wider">{cfg.label}</p>
                  <p className="text-2xl font-extrabold mt-1">{v as number}</p>
                  <p className="text-[10px] mt-0.5">{k === 'critical' ? '< 7 天' : k === 'healthy' ? '7-30 天' : k === 'excess' ? '30-90 天' : '> 90 天'}</p>
                </div>
              );
            })}
          </div>

          {/* 11 SKU 預警表 */}
          <div className="overflow-x-auto rounded-xl border border-border/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/40 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-bold px-3 py-2.5">SKU</th>
                  <th className="text-left font-bold px-2 py-2.5">商品</th>
                  <th className="text-left font-bold px-2 py-2.5">品類</th>
                  <th className="text-right font-bold px-2 py-2.5">庫存</th>
                  <th className="text-right font-bold px-2 py-2.5">30d 日均</th>
                  <th className="text-right font-bold px-2 py-2.5">庫存日數</th>
                  <th className="text-left font-bold px-2 py-2.5">狀態 + 建議</th>
                </tr>
              </thead>
              <tbody>
                {data.productInventory.items.map((item: any) => {
                  const cfg = INV_STATUS[item.status as keyof typeof INV_STATUS];
                  return (
                    <tr key={item.sku} className="border-t border-border/40 hover:bg-secondary/20">
                      <td className="px-3 py-2.5 font-mono text-[11px]">{item.sku}</td>
                      <td className="px-2 py-2.5 font-bold text-xs">{item.name}</td>
                      <td className="px-2 py-2.5"><Badge variant="outline" className="text-[10px]">{item.category}</Badge></td>
                      <td className="px-2 py-2.5 text-right font-mono">{formatNumber(item.stock)}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-muted-foreground">{item.daily30d}</td>
                      <td className={cn('px-2 py-2.5 text-right font-extrabold font-mono',
                        item.status === 'critical' && 'text-red-600',
                        item.status === 'dead' && 'text-stone-600'
                      )}>
                        {item.daysLeft >= 999 ? '∞' : item.daysLeft.toFixed(1)} 天
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-[10px] font-bold', cfg.color)}>{cfg.label}</Badge>
                          <span className="text-[11px] text-foreground/80">{item.action}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI 建議 */}
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/40 text-xs leading-relaxed">
            <strong className="font-bold">💡 AI 建議：</strong>{data.productInventory.recommendation}
            <span className="ml-2 font-extrabold text-amber-700">滯銷庫存價值：NT$ {formatNumber(data.productInventory.totalDeadStockValue)}</span>
          </div>
        </section>
      )}

      <section className="card-soft p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-bold">熱銷商品列表</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜尋 SKU / 商品名 / 品類..."
              className="pl-9 pr-3 h-9 w-64 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-xs text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">SKU</th>
                <th className="text-left font-medium px-3 py-3">商品名稱</th>
                <th className="text-left font-medium px-3 py-3">品類</th>
                <th className="text-right font-medium px-3 py-3">售價</th>
                <th className="text-right font-medium px-3 py-3">庫存</th>
                <th className="text-right font-medium px-3 py-3">月 GMV</th>
                <th className="text-right font-medium px-3 py-3">月增率</th>
              </tr>
            </thead>
            <tbody>
              {list.map((sku: any) => (
                <tr key={sku.sku} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3.5 font-mono text-xs">{sku.sku}</td>
                  <td className="px-3 py-3.5 font-bold">{sku.name}</td>
                  <td className="px-3 py-3.5"><Badge variant="outline" className="text-[10px]">{sku.category}</Badge></td>
                  <td className="px-3 py-3.5 text-right font-mono">NT${sku.price}</td>
                  <td className="px-3 py-3.5 text-right font-mono">{formatNumber(sku.stock)}</td>
                  <td className="px-3 py-3.5 text-right font-mono font-bold">NT${formatNumber(sku.gmv)}</td>
                  <td className="px-3 py-3.5 text-right">
                    <span className={cn(
                      'flex items-center justify-end gap-0.5 font-bold',
                      sku.trend > 0 ? 'text-emerald-600' : 'text-red-500'
                    )}>
                      {sku.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {sku.trend > 0 ? '+' : ''}{sku.trend}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
