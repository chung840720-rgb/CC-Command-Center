import { useEffect, useState } from 'react';
import { Users, Sparkles, Copy, Send, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SopBadge } from '@/components/dashboard/SopBadge';
import { formatNumber, cn } from '@/lib/utils';
import { toast } from 'sonner';

const BV_COLOR: Record<string, string> = {
  真安心: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  真好用: 'bg-amber-100 text-amber-800 border-amber-200',
  真貼心: 'bg-rose-100 text-rose-700 border-rose-200',
};

const STATUS_COLOR: Record<string, { label: string; color: string }> = {
  ready:   { label: '✓ Ready 可推',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  pending: { label: '⏳ 待 PM 審核', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const MATURITY_COLOR: Record<string, string> = {
  past:       'bg-stone-100 text-stone-500 border-stone-200',
  current:    'bg-emerald-100 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400 ring-offset-2',
  target_6mo: 'bg-amber-50 text-amber-700 border-amber-200',
  target_1y:  'bg-stone-50 text-stone-600 border-stone-200',
};

export default function AudiencePacks() {
  const [data, setData] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const ap = data.audiencePacks;
  if (!ap) return <div className="p-6">尚無受眾包資料</div>;

  const totalPeople = ap.packs.reduce((s: number, p: any) => s + p.memberCount, 0);
  const totalEstGmv = ap.packs.reduce((s: number, p: any) => s + p.estimatedGmv, 0);

  const copyDraft = (draft: string) => {
    navigator.clipboard?.writeText(draft);
    toast.success('Draft 已複製，可貼進漸強 MAAC / EDM 工具');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="card-soft p-6 flex flex-col lg:flex-row lg:items-start gap-5 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · CRM × AI（執行操盤手 + 內部關係官）</p>
            <h1 className="text-3xl font-black tracking-tight">👥 自動化受眾包雷達</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              {ap.description}
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Badge className="bg-rose-100 text-rose-700 rounded-md text-xs font-bold border-rose-200">
                ⚡ 全自動 CRM × AI
              </Badge>
              <SopBadge skills={[
                { name: 'crm-ai-audience-packs.md', version: 'v1.0' },
                { name: 'brand-voice.md', version: 'v1.0' },
                { name: 'shopline-pm-prompts.md', version: 'v1.0' },
              ]} />
              <Badge variant="outline" className="text-[10px] bg-secondary/60">最後掃描：{ap.scanTime}</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 4 KPI 摘要 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-soft p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">識別包數</p>
          <p className="text-3xl font-extrabold mt-1 text-primary">{ap.packs.length}</p>
        </div>
        <div className="card-soft p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">總覆蓋人數</p>
          <p className="text-3xl font-extrabold mt-1">{formatNumber(totalPeople)}</p>
        </div>
        <div className="card-soft p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">預估總 GMV</p>
          <p className="text-3xl font-extrabold mt-1 text-emerald-600">NT${(totalEstGmv / 10000).toFixed(0)}萬</p>
        </div>
        <div className="card-soft p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">成熟度</p>
          <p className="text-base font-extrabold mt-1 text-amber-600">{ap.maturityLevel}</p>
        </div>
      </div>

      {/* 8 受眾包 */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">📦 8 個 AI 識別的受眾包</h2>
          <p className="text-xs text-muted-foreground mt-1">點開看條件 + brand-voice draft + 推播時機建議</p>
        </div>

        {ap.packs.map((pack: any) => {
          const isExpanded = expandedId === pack.id;
          const st = STATUS_COLOR[pack.status];
          return (
            <div key={pack.id} className="card-soft overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : pack.id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="text-3xl shrink-0">{pack.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-base font-extrabold">#{pack.id} {pack.name}</span>
                    <Badge variant="outline" className={cn('text-[10px] font-bold', BV_COLOR[pack.brandVoice])}>{pack.brandVoice}</Badge>
                    <Badge variant="outline" className={cn('text-[10px] font-bold', st.color)}>{st.label}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{pack.who}</p>
                </div>
                <div className="text-right shrink-0 hidden md:block">
                  <p className="text-[10px] text-muted-foreground">{formatNumber(pack.memberCount)} 人</p>
                  <p className="text-sm font-extrabold text-emerald-600">NT${formatNumber(pack.estimatedGmv)}</p>
                  <p className="text-[10px] text-muted-foreground">預估 CVR {pack.expectedCvr}%</p>
                </div>
                <ArrowRight className={cn('w-4 h-4 shrink-0 transition-transform', isExpanded && 'rotate-90')} />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border/40 p-4 space-y-3 bg-secondary/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/60 p-3 border border-border/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">推播通路</p>
                      <div className="flex flex-wrap gap-1">
                        {pack.pushChannel.map((c: string) => (
                          <Badge key={c} variant="outline" className="text-[10px] font-bold">{c}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-3 border border-border/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">最佳時機</p>
                      <p className="text-sm font-bold">⏰ {pack.bestTime}</p>
                    </div>
                    <div className="rounded-lg bg-white/60 p-3 border border-border/40">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">推薦 SKU</p>
                      <p className="text-xs font-bold">{pack.recommendedSku}</p>
                    </div>
                  </div>

                  {/* AI 產 draft */}
                  <div className="rounded-lg bg-gradient-to-br from-amber-50/50 to-rose-50/40 p-3 border border-amber-200/40">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI 產推播 Draft（套 brand-voice {pack.brandVoice}）
                      </p>
                      <Button
                        onClick={() => copyDraft(pack.draftSample)}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        複製
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90 italic">「{pack.draftSample}」</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                    <p className="text-[10px] text-muted-foreground italic">
                      ⚠ AI 不直接發送 — 必須 CRM 組長審核後手動 Send（道德底線）
                    </p>
                    <Button variant="outline" size="sm" disabled className="h-7 px-3 text-xs gap-1">
                      <Send className="w-3 h-3" />
                      送 CRM 審核（Demo 模式）
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 跨 MCP 工作流 */}
      <section className="card-soft p-6 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">🔄 跨 MCP 全自動工作流（8 stages）</h2>
          <p className="text-xs text-muted-foreground mt-1">Shopline MCP × Meta MCP × Claude × 漸強 MAAC 整合</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ap.workflow.map((w: any) => (
            <div key={w.step} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-extrabold">{w.step}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{w.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">🛠 {w.tool}</p>
                <p className="text-[10px] text-amber-700 font-bold mt-0.5">⏱ {w.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* L1-L4 成熟度路線 */}
      <section className="card-soft p-6 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">📈 CRM × AI 成熟度路線圖</h2>
          <p className="text-xs text-muted-foreground mt-1">當前 {ap.maturityLevel} · 1 年內目標 L4 智能</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {ap.maturityLevels.map((m: any) => (
            <div key={m.level} className={cn('rounded-xl border-2 p-3 text-center', MATURITY_COLOR[m.status])}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-base font-extrabold">{m.level}</span>
                {m.status === 'current' && <Zap className="w-3.5 h-3.5" />}
                {m.status === 'past' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {(m.status === 'target_6mo' || m.status === 'target_1y') && <Clock className="w-3.5 h-3.5" />}
              </div>
              <p className="text-xs font-bold mb-1">{m.name}</p>
              <p className="text-[10px] leading-tight">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 階段哲學 narrative */}
      <section className="card-soft p-5 bg-gradient-to-br from-rose-50/40 to-violet-50/30 border-rose-200/40">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-rose-700 mb-1">📚 對齊 4 階段哲學</p>
            <p className="text-foreground/80">
              <strong>串聯：</strong>Shopline MCP + Meta MCP + brand-voice ← <strong>找脈絡：</strong>8 包受眾識別 ← <strong>AI 建議：</strong>個人化 draft + 推播時機 ← <strong>輔助判定：</strong>CRM 組長審核（不替妳發推播 — 道德底線）
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
