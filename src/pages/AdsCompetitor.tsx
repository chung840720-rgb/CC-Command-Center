import { useEffect, useState } from 'react';
import { Crosshair, Sparkles, Brain, Target, ArrowRight, Camera, Hash, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { DateRangeSwitcher } from '@/components/dashboard/DateRangeSwitcher';
import { cn } from '@/lib/utils';

const THREAT_COLOR: Record<string, string> = {
  high:   'border-red-300 bg-red-50/50',
  medium: 'border-amber-300 bg-amber-50/50',
  low:    'border-emerald-300 bg-emerald-50/50',
};
const THREAT_BADGE: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-emerald-100 text-emerald-700',
};
const THREAT_LABEL: Record<string, string> = {
  high:   '⚠️ 高威脅',
  medium: '🎯 中威脅',
  low:    '✓ 低威脅',
};
const PRIORITY_BADGE: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-emerald-100 text-emerald-700',
};

export default function AdsCompetitor() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const c = data.competitorAds;
  const webData = data.competitorWeb;
  const campaignMaster = data.campaignMaster || [];
  const adActionsMaster = data.adActionsMaster || [];

  const findAction = (id: string) => adActionsMaster.find((a: any) => a.id === id);
  const findCampaign = (id: string) => campaignMaster.find((cm: any) => cm.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <Crosshair className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">找問題 · 外部雷達官視角</p>
          <h1 className="text-3xl font-black tracking-tight">🔭 競品雷達</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
            鎖定 4 家直接競品 — <strong>淨毒五郎 / 漫享 / DUDA CLEAN / 古寶</strong> — 每週爬取廣告動態、官網流量、社群動態，AI 解析「我們能參考的最小版本」並關聯到我們既有活動。
          </p>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <SopBadge skills={[
              { name: '6-perspectives.md', version: 'v1.0' },
              { name: 'brand-voice.md', version: 'v1.0' },
            ]} />
            <DateRangeSwitcher value="last30" compact />
          </div>
        </div>
      </section>

      {/* AI 雷達摘要 */}
      <section className="card-soft p-6 bg-gradient-to-br from-rose-50/40 to-amber-50/30 border-rose-200/50">
        <div className="flex gap-3">
          <Brain className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-700 mb-1.5">{c.summary.period}．AI 雷達摘要</p>
            <p className="text-sm leading-relaxed">{c.summary.insight}</p>
          </div>
        </div>
      </section>

      {/* 4 家競品策略拆解 */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold tracking-tight">4 家競品策略拆解</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {c.competitors.map((comp: any) => (
            <div key={comp.name} className={cn('card-soft p-5 border-2', THREAT_COLOR[comp.threat])}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{comp.logo}</div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">{comp.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{comp.positioning}</p>
                  </div>
                </div>
                <Badge className={cn('text-[10px] font-bold', THREAT_BADGE[comp.threat])}>{THREAT_LABEL[comp.threat]}</Badge>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">月廣告預算（估）</span>
                  <span className="font-extrabold text-primary">{comp.adSpendEst}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">主戰場</span>
                  <span className="font-bold">{comp.mainPlatform}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3 border border-border/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1.5">📍 最新動態</p>
                  <p className="text-xs leading-relaxed">{comp.latestMove}</p>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-border/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">🎯 策略</p>
                  <p className="text-xs leading-relaxed">{comp.strategy}</p>
                </div>
                <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-200/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">💡 我們的反制</p>
                  <p className="text-xs leading-relaxed">{comp.ourCounter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 官網/社群比較 */}
      {webData && (
        <section className="card-soft p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                官網流量 + 社群比較
              </h2>
              <p className="text-xs text-muted-foreground mt-1">{webData.summary}．資料區間視右側選擇</p>
            </div>
            <DateRangeSwitcher value="last30" compact />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="py-2.5 pr-3 font-bold">競品</th>
                  <th className="py-2.5 px-2 text-right font-bold">官網</th>
                  <th className="py-2.5 px-2 text-right font-bold">流量</th>
                  <th className="py-2.5 px-2 text-right font-bold">熱門頁</th>
                  <th className="py-2.5 px-2 text-right font-bold">轉換率</th>
                  <th className="py-2.5 px-2 text-right font-bold">
                    <span className="inline-flex items-center gap-0.5"><Camera className="w-3 h-3" />IG</span>
                  </th>
                  <th className="py-2.5 pl-2 text-right font-bold">
                    <span className="inline-flex items-center gap-0.5"><Hash className="w-3 h-3" />Threads</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {webData.competitors.map((w: any) => (
                  <tr key={w.name} className="border-b border-border/40 hover:bg-secondary/30">
                    <td className="py-3 pr-3 font-bold">{w.name}</td>
                    <td className="py-3 px-2 text-right text-[11px] font-mono text-muted-foreground">{w.web}</td>
                    <td className="py-3 px-2 text-right font-mono">{w.traffic}</td>
                    <td className="py-3 px-2 text-right text-[11px] font-mono text-muted-foreground">{w.topPage}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold">{w.conversion}</td>
                    <td className="py-3 px-2 text-right font-mono">{w.social.ig}</td>
                    <td className="py-3 pl-2 text-right font-mono">{w.social.threads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* AI 行動建議（trace 到既有活動/廣告）*/}
      <section className="card-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-extrabold tracking-tight">AI 反制行動建議</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-primary">
            <Link to="/insights">看更多 AI 分析 <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">每條建議都 trace 到既有「活動規劃」或「廣告效率」中的具體動作 ID — 不是憑空建議</p>
        <div className="space-y-3">
          {c.actions.map((act: any, i: number) => {
            const tracedAd = act.traceTo ? findAction(act.traceTo) : null;
            const tracedCampaign = tracedAd ? findCampaign(tracedAd.linkedCampaign) : null;
            return (
              <div key={i} className="rounded-xl bg-secondary/40 p-4">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-extrabold">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge className={cn('text-[9px] font-bold', PRIORITY_BADGE[act.priority])}>
                        {act.priority === 'high' ? '⚠️ 高優先' : act.priority === 'medium' ? '🎯 中優先' : '低優先'}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{act.text}</p>
                    {tracedAd && (
                      <div className="mt-2.5 pt-2.5 border-t border-border/40 space-y-1">
                        <Link to="/ads/creatives" className="text-[10px] text-violet-600 hover:underline font-bold flex items-center gap-1">
                          📣 trace to 廣告動作 {tracedAd.id}：{tracedAd.action}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                        {tracedCampaign && (
                          <Link to="/campaign" className="text-[10px] text-emerald-700 hover:underline font-bold flex items-center gap-1">
                            📋 trace to 活動 {tracedCampaign.id}：{tracedCampaign.name}
                            <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs leading-relaxed">
          <Sparkles className="inline w-3 h-3 text-primary mr-1" />
          <span className="font-bold">雷達會議三段式（cleanclean-pm 3.4）：</span>看到什麼 → 為何有效 → 我們能參考的最小版本．每週五電商部週會固定 15 分鐘執行
        </div>
      </section>
    </div>
  );
}
