import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Wallet, Eye, MousePointerClick, TrendingUp, Target, AlertTriangle, BookOpen, Plug, Sparkles, ArrowRight, Image as ImageIcon, RotateCw, BarChart3, Globe, ShoppingBag, Store, Trophy, Zap } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiTile } from '@/components/dashboard/KpiTile';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { formatNumber, cn } from '@/lib/utils';

const AUDIENCE_COLOR: Record<string, string> = {
  RT:        'border-emerald-200 bg-emerald-50/60',
  'RT-溫熱':  'border-amber-200 bg-amber-50/60',
  NEW:       'border-sky-200 bg-sky-50/60',
};

const PLATFORM_ICON: Record<string, { icon: any; bg: string }> = {
  官網:     { icon: Globe, bg: 'bg-amber-100 text-amber-700' },
  蝦皮:     { icon: ShoppingBag, bg: 'bg-orange-100 text-orange-700' },
  MoMo:     { icon: Store, bg: 'bg-red-100 text-red-700' },
  蝦皮直營: { icon: Zap, bg: 'bg-violet-100 text-violet-700' },
};

const TYPE_COLOR: Record<string, string> = {
  問題解決型: 'bg-amber-100 text-amber-800 border-amber-200',
  促購型:     'bg-rose-100 text-rose-800 border-rose-200',
  生活情境型: 'bg-violet-100 text-violet-800 border-violet-200',
  教育型:     'bg-blue-100 text-blue-800 border-blue-200',
  證言型:     'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const CREATIVE_PLATFORM_COLOR: Record<string, string> = {
  Meta:   'bg-blue-100 text-blue-700 border-blue-200',
  Google: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function AdsMeta() {
  const [data, setData] = useState<any>(null);
  const [creativeFilter, setCreativeFilter] = useState<'全部素材' | 'Meta' | 'Google'>('全部素材');
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const m = data.adsMeta;
  const ac = data.adCreatives;
  const campaignMaster = data.campaignMaster || [];
  const adActionsMaster = data.adActionsMaster || [];

  const findCampaign = (id: string) => campaignMaster.find((c: any) => c.id === id);
  const findAction = (id: string) => adActionsMaster.find((a: any) => a.id === id);

  const creativeRanking = creativeFilter === '全部素材' ? ac?.ranking || [] : (ac?.ranking || []).filter((r: any) => r.platform === creativeFilter);
  const sortedCreatives = [...creativeRanking].sort((a: any, b: any) => b.roas - a.roas);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Megaphone className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 廣告效率（Meta + Google + 素材）</p>
            <h1 className="text-3xl font-black tracking-tight">📘 廣告效率（整合分析）</h1>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Badge className="bg-stone-100 text-stone-700 rounded-md text-xs font-bold border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mr-1" />
                Demo 架構 · 不串真實資料
              </Badge>
              <SopBadge skills={[{ name: 'meta-ads-mcp.md', version: 'v1.1' }]} />
              <DateRangeSwitcher value="last7" compact />
            </div>
          </div>
        </div>
      </section>

      {/* KPI 6 格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiTile label="花費（近 7 天）" value={`NT$${(m.kpi.spend / 1000).toFixed(0)}k`} subValue={`${m.kpi.period}`} icon={Wallet} iconColor="cyan" />
        <KpiTile label="曝光" value={`${(m.kpi.impressions / 10000).toFixed(0)}萬`} subValue="總觸及" icon={Eye} iconColor="purple" />
        <KpiTile label="點擊" value={formatNumber(m.kpi.clicks)} subValue={`CTR ${m.kpi.ctr}%`} icon={MousePointerClick} iconColor="amber" />
        <KpiTile label="CPM" value={`NT$${m.kpi.cpm}`} subValue="千次曝光" icon={Target} iconColor="pink" />
        <KpiTile label="ROAS（綜合）" value={`${m.kpi.roas}x`} subValue="平均回收" icon={TrendingUp} iconColor="green" />
        <KpiTile label="轉換數" value={formatNumber(m.kpi.conversions)} subValue="購買事件" icon={Sparkles} iconColor="cyan" />
      </div>

      {/* 紅旗警示（最大花費 + 最低 ROAS）*/}
      {m.redFlags && m.redFlags.length > 0 && (
        <section className="card-soft p-5 border-2 border-red-200 bg-red-50/40">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold text-red-700">🚨 紅旗警示</h2>
            <Badge variant="outline" className="bg-red-100 text-red-700 text-[10px] font-bold border-red-200">
              {m.redFlags.length} 項
            </Badge>
          </div>
          {m.redFlags.map((f: any, i: number) => (
            <div key={i} className="bg-white/80 rounded-lg p-4 border border-red-100/60">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-extrabold text-red-700">{f.adSet}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{f.campaign}</p>
                </div>
                <Badge className="bg-red-100 text-red-700 text-[10px] font-bold border-red-200">CRITICAL</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 my-3 text-center">
                <div className="bg-red-50/60 rounded p-2">
                  <p className="text-[10px] text-muted-foreground">花費</p>
                  <p className="text-sm font-extrabold text-red-700">NT${formatNumber(f.spend)}</p>
                </div>
                <div className="bg-red-50/60 rounded p-2">
                  <p className="text-[10px] text-muted-foreground">ROAS</p>
                  <p className="text-sm font-extrabold text-red-700">{f.roas}x</p>
                </div>
                <div className="bg-red-50/60 rounded p-2">
                  <p className="text-[10px] text-muted-foreground">CTR</p>
                  <p className="text-sm font-extrabold text-red-700">{f.ctr}%</p>
                </div>
              </div>
              <p className="text-xs text-foreground/85"><strong>問題：</strong>{f.issue}</p>
              <p className="text-xs text-red-700 font-bold mt-1.5"><strong>建議行動：</strong>{f.action}</p>
            </div>
          ))}
        </section>
      )}

      {/* Top 10 廣告組 by ROAS */}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold tracking-tight">📊 廣告組 Top 10（依 ROAS 排序）</h2>
            <p className="text-xs text-muted-foreground mt-1">Demo 數據（離職前實測架構）· 命名規則保留 · 絕對值已脫敏</p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="text-left font-bold px-3 py-3 w-10">#</th>
                <th className="text-left font-bold px-3 py-3">廣告組</th>
                <th className="text-left font-bold px-3 py-3">Campaign</th>
                <th className="text-center font-bold px-2 py-3">受眾</th>
                <th className="text-right font-bold px-3 py-3">ROAS</th>
                <th className="text-right font-bold px-3 py-3">花費</th>
                <th className="text-right font-bold px-3 py-3">CTR</th>
                <th className="text-right font-bold px-3 py-3">CPM</th>
                <th className="text-right font-bold px-3 py-3">轉換</th>
              </tr>
            </thead>
            <tbody>
              {m.topAdSets.map((row: any) => (
                <tr key={row.rank} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="px-3 py-3 font-extrabold text-muted-foreground">{row.rank}</td>
                  <td className="px-3 py-3 font-bold text-xs">{row.name}</td>
                  <td className="px-3 py-3 text-[11px] text-muted-foreground font-mono">{row.campaign}</td>
                  <td className="px-2 py-3 text-center">
                    <Badge variant="outline" className={cn('text-[9px] font-bold', AUDIENCE_COLOR[row.audience] || 'bg-stone-50 border-stone-200')}>{row.audience}</Badge>
                  </td>
                  <td className={cn(
                    'px-3 py-3 text-right font-extrabold font-mono',
                    row.roas >= 5 ? 'text-emerald-600' : row.roas >= 3 ? 'text-amber-600' : 'text-red-500'
                  )}>{row.roas}x</td>
                  <td className="px-3 py-3 text-right font-mono">NT${formatNumber(row.spend)}</td>
                  <td className="px-3 py-3 text-right font-mono">{row.ctr}%</td>
                  <td className="px-3 py-3 text-right font-mono text-muted-foreground">${row.cpm}</td>
                  <td className="px-3 py-3 text-right font-mono font-bold">{row.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 受眾類型分布 */}
      {m.audienceBreakdown && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight">👥 受眾類型分布（39 個廣告組）</h2>
              <p className="text-xs text-muted-foreground mt-1">RT 為主力（ROAS 穩 5-10x）、NEW 冷受眾為拉新但 11 組 ROAS 不可用</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {m.audienceBreakdown.map((aud: any) => (
              <div key={aud.type} className="rounded-xl border border-border/60 p-4 space-y-2 bg-secondary/30">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{aud.type}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-extrabold tracking-tight">{aud.count}</p>
                  <p className="text-[10px] text-muted-foreground">組</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-border/40">
                  <p className="text-[10px] text-muted-foreground">總花費 <strong className="text-foreground font-extrabold">NT${formatNumber(aud.totalSpend)}</strong></p>
                  <p className="text-[10px] text-muted-foreground">
                    平均 ROAS{' '}
                    {aud.avgRoas != null ? (
                      <strong className={cn('font-extrabold', aud.avgRoas >= 4 ? 'text-emerald-600' : 'text-amber-600')}>
                        {aud.avgRoas}x
                      </strong>
                    ) : (
                      <span className="text-muted-foreground italic">—（不可用）</span>
                    )}
                  </p>
                </div>
                <p className="text-[10px] leading-relaxed text-foreground/75 pt-2 border-t border-border/40">{aud.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI 戰術摘要 — trace 到既有活動 */}
      {m.insight && (
        <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-amber-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-base font-extrabold tracking-tight">AI 戰術摘要</h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85 mb-4">{m.insight.summary}</p>
          <div className="space-y-2">
            {m.insight.actionItems.map((item: any, i: number) => {
              const ad = item.linkedAd ? findAction(item.linkedAd) : null;
              const camp = ad ? findCampaign(ad.linkedCampaign) : null;
              return (
                <div key={i} className="bg-white/70 rounded-lg p-3 border border-border/40">
                  <p className="text-sm leading-relaxed">{item.text}</p>
                  {ad && camp && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/40 text-[10px]">
                      <Link to="/ads/creatives" className="text-violet-600 font-bold hover:underline flex items-center gap-1">
                        📣 {ad.id} <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                      <Link to="/campaign" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                        📋 {camp.id} {camp.name} <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 命名規則 SOP — 履歷武力展示 */}
      {m.namingConvention && (
        <section className="card-soft p-6 bg-gradient-to-br from-stone-50/60 to-amber-50/30">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-stone-700" />
            <h2 className="text-base font-extrabold tracking-tight">📚 廣告組命名規則 SOP（Johnny 個人沉澱）</h2>
          </div>
          <div className="bg-white/70 rounded-lg p-4 border border-border/40 mb-4">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">命名 pattern</p>
            <code className="text-sm font-mono font-bold text-stone-700">{m.namingConvention.pattern}</code>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-2">範例</p>
            {m.namingConvention.examples.map((ex: any, i: number) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-center bg-secondary/30 rounded p-3 text-xs">
                <code className="font-mono font-bold text-stone-700">{ex.name}</code>
                <span className="text-muted-foreground hidden md:inline">→</span>
                <span className="text-foreground/75">{ex.meaning}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-2">受眾分層（漏斗順序）</p>
            <div className="flex items-center gap-2 flex-wrap">
              {m.namingConvention.audienceLayers.map((layer: string, i: number) => (
                <>
                  <Badge key={layer} variant="outline" className="text-[10px] font-bold bg-white">{layer}</Badge>
                  {i < m.namingConvention.audienceLayers.length - 1 && (
                    <ArrowRight key={`arrow-${i}`} className="w-3 h-3 text-muted-foreground" />
                  )}
                </>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 素材層級分析（合併自原 /ads/creatives）*/}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {ac && (
        <>
          {/* 區段分隔標題 */}
          <section className="card-soft p-5 bg-gradient-to-br from-rose-50/40 to-amber-50/30 border-rose-200/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-700" />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">🎨 素材層級分析</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">跨平台素材效率 · A/B 雙軌 · 4 通路素材貢獻 · AI 行動建議</p>
              </div>
            </div>
          </section>

          {/* A/B 雙軌測試 */}
          {ac.abTest && (
            <section className="card-soft p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                  <RotateCw className="w-5 h-5 text-foreground/70" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold">{ac.abTest.title}</h2>
                    <Badge variant="outline" className="text-[10px]">{ac.abTest.subtitle}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">{ac.abTest.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ac.abTest.tracks.map((t: any) => (
                  <div key={t.name} className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold">{t.name}</p>
                      <Badge variant="secondary" className={cn(
                        'text-xs font-bold',
                        t.metricColor === 'primary' && 'bg-primary/15 text-primary',
                        t.metricColor === 'emerald' && 'bg-emerald-100 text-emerald-700'
                      )}>{t.metric}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.examples}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 跨平台素材排行榜 */}
          {ac.ranking && (
            <section className="card-soft p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    跨平台素材排行榜
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">示範排序：先看回收，再看點擊率、花費與訂單。</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
                  <Link to="/insights">看 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                {(['全部素材', 'Meta', 'Google'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setCreativeFilter(f)}
                    className={cn(
                      'h-8 px-4 rounded-full text-xs font-semibold transition-colors',
                      creativeFilter === f
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/40 text-xs text-muted-foreground">
                      <th className="text-left font-medium px-4 py-3">素材</th>
                      <th className="text-left font-medium px-3 py-3">類型</th>
                      <th className="text-left font-medium px-3 py-3">平台</th>
                      <th className="text-right font-medium px-3 py-3">花費</th>
                      <th className="text-right font-medium px-3 py-3">帶動業績</th>
                      <th className="text-right font-medium px-3 py-3">廣告回收</th>
                      <th className="text-right font-medium px-3 py-3">點擊率</th>
                      <th className="text-right font-medium px-3 py-3">訂單</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCreatives.map((r: any, i: number) => {
                      const isTop = i === 0;
                      return (
                        <tr key={r.name + i} className={cn('border-t border-border/40 hover:bg-secondary/20 transition-colors', isTop && 'bg-primary/5')}>
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              {isTop && (
                                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                                  <Trophy className="w-3 h-3" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold leading-tight">{r.name}</p>
                                <p className="text-[11px] text-muted-foreground mt-1 max-w-md leading-relaxed">{r.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', TYPE_COLOR[r.type])}>{r.type}</Badge>
                          </td>
                          <td className="px-3 py-4">
                            <Badge variant="outline" className={cn('text-[10px] font-bold rounded-md', CREATIVE_PLATFORM_COLOR[r.platform])}>{r.platform}</Badge>
                          </td>
                          <td className="px-3 py-4 text-right font-mono">NT${formatNumber(r.spend)}</td>
                          <td className="px-3 py-4 text-right font-mono font-bold">NT${formatNumber(r.gmv)}</td>
                          <td className={cn('px-3 py-4 text-right font-extrabold', r.roas >= 4 ? 'text-emerald-600' : r.roas >= 2.5 ? 'text-amber-600' : 'text-red-500')}>{r.roas} 倍</td>
                          <td className="px-3 py-4 text-right">{r.ctr}%</td>
                          <td className="px-3 py-4 text-right font-bold">{r.orders}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 素材類型 ROAS 比較 */}
          {ac.typeRoas && (
            <section className="card-soft p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h2 className="text-base font-bold">素材類型 ROAS 比較</h2>
              </div>
              <p className="text-xs text-muted-foreground">看哪個類型在整體預算下最有效率 — 影響下一檔素材策略</p>
              <div className="space-y-2.5">
                {ac.typeRoas.map((t: any) => {
                  const max = Math.max(...ac.typeRoas.map((x: any) => x.avgRoas));
                  const widthPct = (t.avgRoas / max) * 100;
                  return (
                    <div key={t.type} className="grid grid-cols-[120px_1fr_120px] gap-3 items-center">
                      <span className="text-sm font-medium">{t.type}</span>
                      <div className="h-7 rounded-md bg-secondary overflow-hidden relative">
                        <div className={cn(
                          'h-full rounded-md transition-all',
                          t.color === 'amber' && 'bg-amber-400',
                          t.color === 'rose' && 'bg-rose-400',
                          t.color === 'violet' && 'bg-violet-400',
                          t.color === 'blue' && 'bg-blue-400',
                          t.color === 'emerald' && 'bg-emerald-400'
                        )} style={{ width: `${widthPct}%` }} />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">{t.avgRoas} 倍</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-right">花費 NT${formatNumber(t.totalSpend)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* AI 行動建議 4 卡（加碼/複用/改投/砍）*/}
          {ac.recommendation && (
            <section className="card-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    AI 素材行動建議
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">套用 <code className="px-1 bg-secondary rounded">daily-report.md skill v2.10</code> 的「解讀 → 建議 → 升級判斷」3 段式</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-bold">📋 SOP Applied</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ac.recommendation.map((r: any, i: number) => (
                  <div key={i} className={cn(
                    'rounded-xl border p-4 space-y-2',
                    r.action === '加碼' && 'border-emerald-200 bg-emerald-50/40',
                    r.action === '複用' && 'border-primary/30 bg-primary/5',
                    r.action === '改投' && 'border-amber-200 bg-amber-50/40',
                    r.action === '砍' && 'border-red-200 bg-red-50/40'
                  )}>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn(
                        'text-[11px] font-bold rounded-md',
                        r.action === '加碼' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                        r.action === '複用' && 'bg-primary/15 text-primary border-primary/30',
                        r.action === '改投' && 'bg-amber-100 text-amber-700 border-amber-200',
                        r.action === '砍' && 'bg-red-100 text-red-700 border-red-200'
                      )}>{r.action}</Badge>
                      <Badge variant="outline" className={cn(
                        'text-[10px]',
                        r.priority === '高' && 'bg-red-50 text-red-700 border-red-200',
                        r.priority === '中' && 'bg-amber-50 text-amber-700 border-amber-200'
                      )}>優先 {r.priority}</Badge>
                    </div>
                    <p className="text-sm font-bold">{r.target}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
