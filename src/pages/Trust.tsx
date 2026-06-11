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
            { icon: FileText, title: 'SOP 概念可外帶，數據不可', desc: '20 份 SOP Skills 是我寫的個人能力沉澱（可外帶），對應的真實業績、SKU 細節、銷售排行（不可外帶）。' },
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
            { num: 2, title: '我會留下類似深度的工作沉澱', desc: '18 個月寫了 20 份 SOP + 4 平台爬蟲，這個密度可重複。你雇用我，預期有同等規模的能力沉澱可繼承。' },
            { num: 3, title: '你的資料永遠是你的', desc: '我的 portfolio 永遠只會放「概念框架 + Demo」，不會放真實業績截圖。截圖如果出現，那只是 anonymized 後的 demo URL screenshot。' },
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
            20 份 SOP Skills、4 平台反向工程爬蟲、完整 Workers 架構 code 都在 GitHub repo 內 —
            純粹的能力證明，不依賴任何真實業績數據。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="card-soft p-8 text-center space-y-4 bg-gradient-to-br from-primary/10 to-accent/40">
        <Sparkles className="w-8 h-8 text-primary mx-auto" />
        <h2 className="text-xl font-bold">想看真實能力？</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          我把 18 個月的電商 PM 工作脈絡用 demo 形式攤開給你看 — 20 份 SOP / 4 平台爬蟲架構 / 完整迭代軌跡 / AI 業務脈絡套用。<br />
          剩下的，我們面試聊聊。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button asChild className="rounded-full gap-2 font-semibold bg-gradient-to-br from-primary to-amber-500 border-0 shadow-lg shadow-primary/25">
            <Link to="/skills">看 20 份 SOP <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full gap-2 font-semibold">
            <Link to="/data-pipeline">看爬蟲架構 <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
