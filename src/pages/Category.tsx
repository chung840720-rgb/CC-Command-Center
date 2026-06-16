import { useEffect, useState } from 'react';
import type { Snapshot } from '@/types/dashboard';
import { getSnapshot } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Sparkles, ArrowRight, Megaphone, BarChart3 } from 'lucide-react';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { formatNumber, cn } from '@/lib/utils';

const PLATFORM_COLOR: Record<string, string> = {
  shopline:     'bg-amber-500',
  shopee:       'bg-orange-500',
  momo:         'bg-red-500',
  shopeeDirect: 'bg-violet-500',
};

const PLATFORM_LABEL: Record<string, string> = {
  shopline: '官網',
  shopee: '蝦皮',
  momo: 'MoMo',
  shopeeDirect: '直營',
};

const PLATFORM_TEXT_COLOR: Record<string, string> = {
  shopline:     'text-amber-700 bg-amber-50',
  shopee:       'text-orange-700 bg-orange-50',
  momo:         'text-red-700 bg-red-50',
  shopeeDirect: 'text-violet-700 bg-violet-50',
};

export default function Category() {
  const [data, setData] = useState<Snapshot | null>(null);

  useEffect(() => {
    getSnapshot().then(setData);
  }, []);

  if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;

  const cc = (data as any).categoryContribution;
  const totalGmv = cc?.categories?.reduce((s: number, c: any) => s + c.totalGmv, 0) || 0;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 執行操盤手視角</p>
            <h1 className="text-3xl font-black tracking-tight">🏷️ 品類貢獻度</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              PM 撥動業績的核心邏輯 — <strong>廣告端做了什麼異動 → 品類貢獻度如何變化</strong>。
              不是「看哪個品類紅」，而是「看廣告動作能撥動哪個品類」。
            </p>
          </div>
          <DateRangeSwitcher value="last7" compact />
        </div>
        <div className="text-[10px] text-muted-foreground">
          目前顯示：本週 {cc?.weekStart} ~ {cc?.weekEnd} · vs 上週 {cc?.prevWeekStart} ~ {cc?.prevWeekEnd}
        </div>
        <SopBadge skills={[
          { name: '品類分類規格.md', version: 'v4.2' },
          { name: 'cleanclean-pm.md', version: 'v7.3' },
        ]} />
      </header>

      {/* ━━━ 大區塊 1：本週總業績組成 ━━━ */}
      {cc && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                本週 5 大品類業績組成
              </h2>
              <p className="text-xs text-muted-foreground mt-1">本週總業績 NT${formatNumber(totalGmv)}．以下圖每段大小即該品類占比</p>
            </div>
          </div>
          <div className="flex h-12 rounded-xl overflow-hidden border border-border/40">
            {cc.categories.map((cat: any, i: number) => (
              <div
                key={cat.name}
                className={cn('flex flex-col items-center justify-center text-xs font-bold text-white transition-all hover:opacity-90',
                  ['bg-primary', 'bg-amber-500', 'bg-orange-400', 'bg-rose-400', 'bg-stone-400'][i % 5])}
                style={{ width: `${cat.sharePct}%` }}
              >
                {cat.sharePct >= 10 ? (
                  <>
                    <span className="leading-none">{cat.icon} {cat.sharePct}%</span>
                  </>
                ) : `${cat.sharePct}%`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ━━━ 大區塊 2：每品類完整因果矩陣 ━━━ */}
      {cc && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight">廣告動作 ↔ 品類反應</h2>
          <div className="space-y-3">
            {cc.categories.map((cat: any) => {
              const up = cat.wowPct >= 0;
              return (
                <div key={cat.name} className="card-soft p-6">
                  {/* Top row：品類標題 + 環比 */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{cat.icon}</div>
                      <div>
                        <h3 className="text-xl font-extrabold tracking-tight">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          本週 NT${formatNumber(cat.totalGmv)}．占總業績 {cat.sharePct}%
                        </p>
                      </div>
                    </div>
                    <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                      up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    )}>
                      {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-extrabold">{up ? '+' : ''}{cat.wowPct}%</span>
                      <span className="text-xs">vs 上週</span>
                    </div>
                  </div>

                  {/* Middle row：4 平台貢獻 */}
                  <div className="mb-4">
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">4 平台貢獻拆解</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(cat.platforms).map(([key, val]: any) => {
                        const widthPct = (val / cat.totalGmv) * 100;
                        return (
                          <div key={key} className={cn('rounded-lg p-3', PLATFORM_TEXT_COLOR[key])}>
                            <p className="text-[10px] font-bold mb-1">{PLATFORM_LABEL[key]}</p>
                            <p className="text-sm font-extrabold mb-1">NT${formatNumber(val)}</p>
                            <div className="h-1.5 bg-white/60 rounded overflow-hidden">
                              <div className={cn('h-full', PLATFORM_COLOR[key])} style={{ width: `${widthPct}%` }} />
                            </div>
                            <p className="text-[10px] mt-1.5 font-bold">{Math.round(widthPct)}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom row：廣告動作 + 品類反應因果連結 */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3">
                    <div className="bg-violet-50/50 border border-violet-100 rounded-lg p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Megaphone className="w-4 h-4 text-violet-600" />
                        <p className="text-[11px] font-bold uppercase tracking-wider text-violet-700">廣告動作（投入）</p>
                      </div>
                      <p className="text-sm font-bold text-foreground leading-relaxed">{cat.adAction}</p>
                    </div>

                    <div className="flex items-center justify-center text-primary">
                      <ArrowRight className="w-6 h-6" />
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">品類反應（產出）</p>
                      </div>
                      <p className="text-sm font-bold text-foreground leading-relaxed">{cat.reaction}</p>
                    </div>
                  </div>

                  {/* Trace 到活動規劃 / 廣告效率 */}
                  {cat.traceTo?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-4 flex-wrap text-[10px]">
                      <span className="text-muted-foreground font-bold">📎 trace to：</span>
                      {cat.traceTo.filter((id: string) => id.startsWith('C-')).map((id: string) => (
                        <Link key={id} to="/campaign" className="text-emerald-700 hover:underline font-bold flex items-center gap-1">
                          📋 活動 {id}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                      {cat.traceTo.filter((id: string) => id.startsWith('AD-')).map((id: string) => (
                        <Link key={id} to="/ads/creatives" className="text-violet-600 hover:underline font-bold flex items-center gap-1">
                          📣 廣告動作 {id}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━ AI 摘要 ━━━ */}
      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-amber-50/40">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-base font-extrabold tracking-tight">本週 AI 戰術摘要</h2>
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-foreground/85">
          <li className="flex gap-2">
            <span className="text-primary shrink-0 font-bold">▸</span>
            <span>洗衣精 +28% — 母嬰節 Meta 加碼有效，<strong>建議延伸到 7 月 LINE 廣告測試</strong>，看能不能複製到官網 CRM 客群。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0 font-bold">▸</span>
            <span>柔濕巾 -13% — 618 主動排除是策略性的，<strong>7 月需要主動回擊檔</strong>，建議主打官網 VIP 私域促銷。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0 font-bold">▸</span>
            <span>除黴 +14% — 蝦皮關鍵字加價反應好，<strong>建議擴大到 MoMo 同關鍵字測試</strong>，看是否能複製。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0 font-bold">▸</span>
            <span>沐浴用品 +18% — SET 組合廣告反應好，<strong>建議跟商品開發討論能否擴充 SKU 組合</strong>。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
