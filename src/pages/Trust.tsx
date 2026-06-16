import { ShieldCheck, Lock, Eye, FileText, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Trust() {
  return (
    <div className="space-y-6">
      <section className="card-soft p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">信任聲明</p>
            <h1 className="text-3xl font-black tracking-tight">為什麼這是 Demo Only</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              這個 dashboard <strong className="text-primary">不會也不能</strong>串接真實系統 —
              不是技術限制，是<strong className="text-primary">職業道德選擇</strong>。
              下面說明為什麼這個選擇對你（未來雇主）有利。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold gap-1">
                <Lock className="w-3 h-3" />Demo Only · 永久
              </Badge>
              <Badge variant="outline" className="text-xs font-bold">主動披露透明</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 對前雇主的承諾 */}
      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-accent/30">
        <div className="flex gap-3 mb-4">
          <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold">對前雇主的承諾</h2>
            <p className="text-xs text-muted-foreground mt-0.5">2026/06/18 是我最後工作日，從那天起 —</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
          {[
            { icon: Lock, title: '不存取任何系統', desc: 'Shopline / 蝦皮 / MoMo 的後台 OTP、Service Account、API key 在最後一日全數移除，不留備份。' },
            { icon: Eye, title: '不外流任何商業資料', desc: 'Dashboard 內所有業績數字皆 anonymized — per platform per month 用隨機 factor (×0.65~0.95)，不洩漏絕對值。' },
            { icon: FileText, title: 'SOP 概念可外帶，數據不可', desc: '19 份 SOP Skills 是我寫的個人能力沉澱（可外帶），對應的真實業績、SKU 細節、銷售排行（不可外帶）。' },
            { icon: ShieldCheck, title: '爬蟲 code 公開但不執行', desc: 'GitHub 上的 Playwright + CDP code 是過去工作沉澱，但離職後再執行針對前雇主即構成不當存取，不會做。' },
          ].map((it, i) => (
            <div key={i} className="rounded-xl bg-white/60 border border-border/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <it.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-bold">{it.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 對未來雇主的承諾 */}
      <section className="card-soft p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          對未來雇主（你）的承諾
        </h2>
        <div className="space-y-3">
          {[
            { num: 1, title: '同樣的尊重會延伸到你', desc: '在貴司任職期間，我會像在前公司那樣沉澱 SOP / 寫 Skill / 反向工程平台 API，但離職那天，所有系統存取權限歸還，所有真實資料留下。' },
            { num: 2, title: '我會留下類似深度的工作沉澱', desc: '18 個月寫了 19 份 SOP + 4 平台爬蟲，這個密度可重複。你雇用我，預期有同等規模的能力沉澱可繼承。' },
            { num: 3, title: '你的資料永遠是你的', desc: '我的 portfolio 永遠只會放「概念框架 + Demo」，不會放真實業績截圖、員工本名、老闆 quote、KOL 真實名稱（全 anonymized）。' },
            { num: 4, title: '不帶技術棧、只帶能力', desc: '這個 dashboard 的 Playwright + CDP + Claude Code + GH Pages 是個人 demo 用，不會原封不動搬到貴司。貴司用什麼工具我就用什麼 — 我帶的是「PM 思考方法」+「沉澱 SOP 的能力」。' },
            { num: 5, title: '優先 anchor metric，不沉迷工具', desc: '我會優先問你「成功的定義是什麼」，把工具服務這個 anchor，不是反過來。如果你定義「3 個月內補回業績 X%」，我會用最簡單的工具達成，不會花 1 個月把 dashboard 做漂亮。' },
            { num: 6, title: 'AI 不替人發送 — 道德底線', desc: '所有 CRM 受眾包推播 / 客服訊息 / 廣告投放 draft，AI 只產出建議，最終必須人類審核 + 手動 Send。這條底線比技術能力重要 — 防 AI 代發踩雷，保護客戶信任。' },
          ].map((it) => (
            <div key={it.num} className="flex gap-3 p-4 rounded-xl bg-secondary/30">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                {it.num}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-1">{it.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pick a SOP, Ask Me Anything — 面試現場可被詢問的 SOP 細節 */}
      <section className="card-soft p-6 bg-gradient-to-br from-amber-50/40 to-rose-50/30 border-amber-200/40">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-amber-700" />
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">📚 Pick a SOP, Ask Me Anything</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              不信 19 份 SOP 是我寫的？挑這 7 份問細節 — 我能 5 分鐘講完背景 / 當時情境 / 為什麼這樣設計 / 踩了哪個雷。
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {[
            { skill: 'daily-report.md v2.10', bait: '「環比鎖定 DoD（vs T-1，不混 WoW）」為什麼這個規則？踩了什麼雷？', area: '日報 SOP' },
            { skill: 'shopline-api.md v2.5', bait: 'Playwright auto-refresh 怎麼設計？.cmd CRLF 規則為什麼會炸 exit 255？', area: '反向工程' },
            { skill: 'cross-team-campaign-sop.md v1.0', bait: '8 階段活動 SOP 哪一段最容易卡？L1-L4 怎麼判定？', area: '跨組協作' },
            { skill: 'meta-ads-mcp.md v1.1', bait: 'purchase_roas API 端不可排序你怎麼解？OAuth callback URL 流程是什麼？', area: 'MCP 串接' },
            { skill: '蝦皮通路戰略.md v1.0', bait: 'TA 分流四象限是怎麼推導出來的？跟蝦皮商城 PM 怎麼對焦？', area: '通路戰略' },
            { skill: 'shopline-pm-prompts.md v1.0', bait: '50 個 prompt 哪 1 個最常用？怎麼套 brand-voice 自動產推播 draft？', area: 'AI × PM' },
            { skill: 'crm-ai-audience-packs.md v1.0', bait: '8 個受眾包怎麼設計？為什麼 AI 不能直接發推播？跨 MCP 工作流 8 stages 各做什麼？', area: 'CRM × AI 殺手級' },
            { skill: 'monthly-report-mindset.md v1.0', bait: '月會簡報「5 必加要素」每一項怎麼來？對老闆的「不安心感」怎麼消除？', area: '向上溝通' },
          ].map((q, i) => (
            <div key={i} className="card-soft p-3 bg-white/70 border border-border/40">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <code className="text-[11px] font-mono font-bold text-amber-700">{q.skill}</code>
                <Badge variant="outline" className="text-[9px] font-bold shrink-0">{q.area}</Badge>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">「{q.bait}」</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic mt-4">
          這 6 個都是會被面試官 deep-dive 的點。我準備好被問了。
        </p>
      </section>

      {/* 為什麼這策略對你有利 */}
      <section className="card-soft p-6 border-l-4 border-l-primary">
        <h2 className="text-lg font-bold mb-3">為什麼這個策略對你有利</h2>
        <div className="space-y-3 text-sm leading-relaxed text-foreground/85">
          <p>
            <strong className="text-primary">1. 證明我有商業道德底線。</strong>
            AI 時代最稀缺的不是會用 AI 的人，是「能用 AI 不踩商業道德紅線」的人。
            我主動選擇 demo only 而不是「我還能串到淨淨系統給你看」，這就是底線。
          </p>
          <p>
            <strong className="text-primary">2. 證明我能在「不能用真實資料」的限制下，依然產出工作工具。</strong>
            這個 dashboard 用 anonymized 數據 + 真實業務脈絡 SOP 建構，
            完整還原了我 18 個月電商組長的工作。如果離開真實資料就做不出來，那才是技術不夠扎實。
          </p>
          <p>
            <strong className="text-primary">3. 證明我是「能讓 AI 落地工作」的人，不是「玩 prompt」的人。</strong>
            19 份 SOP Skills、4 平台反向工程爬蟲、完整 Workers 架構 code 都在 GitHub repo 內 —
            純粹的能力證明，不依賴任何真實業績數據。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="card-soft p-8 text-center space-y-4 bg-gradient-to-br from-primary/10 to-accent/40">
        <Sparkles className="w-8 h-8 text-primary mx-auto" />
        <h2 className="text-xl font-bold">想看真實能力？</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          我把 18 個月的電商 PM 工作脈絡用 demo 形式攤開給你看 — 19 份 SOP / 4 平台爬蟲架構 / 完整迭代軌跡 / AI 業務脈絡套用。<br />
          剩下的，我們面試聊聊。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button asChild className="rounded-full gap-2 font-semibold bg-gradient-to-br from-primary to-amber-500 border-0 shadow-lg shadow-primary/25">
            <Link to="/skills">看 19 份 SOP <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full gap-2 font-semibold">
            <Link to="/data-pipeline">看爬蟲架構 <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
