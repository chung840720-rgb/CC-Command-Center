import { Library, Sparkles, Code2, BookOpen, Megaphone, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  category: 'mindset' | 'workflow' | 'platform' | 'business' | 'strategy';
  description: string;
  version: string;
  appliedIn?: string[];  // routes that use this skill
  trigger?: string;
}

const SKILLS: Skill[] = [
  // ⭐ 核心思考框架
  { category: 'mindset', name: 'cleanclean-pm.md', version: '⭐ v7.3', description: '電商 PM 核心脈絡 — 做任何電商相關決策前必讀。涵蓋四平台戰略、TA 族群、團隊分工、業務系統現況。', appliedIn: ['/', '/sales-battle'], trigger: '任何電商業務決策' },
  { category: 'mindset', name: '6-perspectives.md', version: 'v1.0', description: '6 切角思考框架（外部雷達官 / 內部關係官 / 數據觀測員 / 策略軍師 / 執行操盤手 / 成長觀察員）— 對齊老闆 9 字「洞察先機 / 全盤思維 / 持續迭代」。', appliedIn: ['/insights'], trigger: '月會、複雜決策、向上溝通' },
  { category: 'mindset', name: 'daren-mindset.md', version: 'v1.0', description: '達人心態 — 向上溝通必備：問題 / 結果 / 下一步 3 行格式。不訴苦、不請功、消除不安心感。', appliedIn: ['/insights'], trigger: '對主管的訊息草稿' },
  { category: 'mindset', name: 'monthly-report-mindset.md', version: '⭐ v1.0', description: '月會簡報心法 — 4 核心原則 + 5 必加要素：數字 + 變化幅度（MOM/YOY）、變化 + 絕對水位、業績類 + YoY% + 佔比、廣告類 + CPA、每頁 takeaway banner。', appliedIn: ['/sales-battle'], trigger: '月報 / 月會簡報 / 向老闆提案' },

  // 📋 工作流 SOP
  { category: 'workflow', name: 'daily-report.md', version: '⭐ v2.10', description: '電商日報 SOP — 含金字塔結構 / Notion ground truth 查核 / D 系列 convention / 廣告 / 2025 ground truth 補丁 / 四平台業務脈絡防呆 / 三問 row 對齊規則 / 環比鎖定 DoD。每天 10:55 出 3 份 Slack draft。', appliedIn: ['/insights', '/alerts'], trigger: '跑今日日報' },
  { category: 'workflow', name: 'weekly-report-skill-v1_1.md', version: 'v1.1', description: '官網週報製作完整 SOP — 14 項 Checklist 驗收、GA4 漏斗、Clarity 截圖、ER 路線圖。週四 14:00 電商部週會用。', appliedIn: ['/sales-battle'], trigger: '幫我做這週的官網週報' },
  { category: 'workflow', name: 'weekly-meeting.md', version: 'v1.0', description: '電商部週會運作規則 — 議程 / Action Items 釘選 / GA4 警戒線參考。', trigger: '週會主持 / 籌備' },
  { category: 'workflow', name: 'one-on-one.md', version: 'v1.0', description: '1:1 會議模板 — 與王大明 / 林小美的個人成長對話框架。', trigger: '組員 1:1' },
  { category: 'workflow', name: 'cross-team-campaign-sop.md', version: '⭐ v1.0', description: '官網活動跨組協作 SOP — 八階段 / 三階段 / L1-L4 等級 / 通路矩陣 / CRM 三段 / ET 對焦 / 月報 xlsx 處理。', appliedIn: ['/campaign'], trigger: '活動規劃 / 跨組對焦' },
  { category: 'workflow', name: 'ai-collaboration-sop.md', version: 'v1.0', description: 'AI 協作分工原則 — Claude / ChatGPT / Gemini 各自定位、Notion / Drive / Slack 知識回寫。', trigger: 'AI 工具使用衝突時' },
  { category: 'workflow', name: 'line-bot-maintenance.md', version: 'v1.0', description: 'LINE bot 維運 SOP — Claude CLI 升級後修復、PM2 daemon、startup .bat。', trigger: 'line bot 跑掉 / bot 沒回' },

  // 🔧 平台 ETL（合併後 1 個主檔）
  { category: 'platform', name: '4-platform-etl-master.md', version: '⭐ v1.0', description: '4 平台 ETL 完整架構主檔（合併原 shopline-api v2.5 + shopee-api v1.1 + momo-api v1.1 + meta-ads-mcp v1.1）。涵蓋 2 種架構（反向工程 + 官方 MCP）+ 4 平台全 endpoint + Plan B 純官網 GMV 計算 + JSESSIONID alive + CDP 反偵測 + Meta MCP OAuth callback + 21 條踩雷彙整 + 跨平台對齊規則。11 部章節。', appliedIn: ['/shopline', '/shopee', '/momo', '/shopee-direct', '/ads/meta', '/data-pipeline'], trigger: '4 平台任一取數 / 月報品類 / 設定新平台' },
  { category: 'platform', name: '⚡ MCP × AI Audience Playbook', version: '🆕 v1.0', description: '<strong>離職前壓軸 skill</strong>（合併原 shopline-pm-prompts v1.0 + crm-ai-audience-packs v1.0 + meta-ads-mcp v1.1 MCP 部分）。Meta + Shopline 雙官方 MCP 設定 + 50 個 PM 高頻提問範本（7 大類）+ 8 個自動化受眾包（5 維度設計）+ brand-voice 配對 + 跨 MCP 8 stages 工作流 + L1-L4 CRM × AI 成熟度路線 + 9 條踩雷 + ROI 估算（月省 29 hr / 年值 NT$ 17 萬）。13 部章節。', appliedIn: ['/ads/meta', '/vip', '/audience-packs', '/pm-prompts'], trigger: '拉訂單 / Cohort / 受眾包 / Meta MCP / Shopline MCP / 自然語言查' },

  // 📚 業務知識
  { category: 'business', name: 'products.md', version: 'v1.0', description: '產品線知識 — 洗衣精 / 柔濕巾 / 除黴 / 沐浴 / 洗手等品類，含主推 SKU 與通路策略。', trigger: '商品決策' },
  { category: 'business', name: 'brand-voice.md', version: 'v1.0', description: '品牌口吻 — 寫文案、審文案、判斷文案合規性、決定推播 / EDM / 商品頁文字方向。', trigger: '文案撰寫 / 審稿' },
  { category: 'business', name: 'platform-rules.md', version: 'v1.0', description: '四平台合規 — 蝦皮 / MOMO 禁止導流 / 商審週期 / 官網私域規則。', trigger: '活動規劃 / 跨平台' },
  { category: 'business', name: '品類分類規格_v4_1.md', version: '⭐ v4.2', description: '全平台品類分類 — 適用蝦皮 / MOMO / 官網 (Shopline)。動態偵測標題列、EXCLUDED_PATTERNS 排除清單機制。', appliedIn: ['/category', '/products'], trigger: '品類 ETL / 月報品類值' },
  { category: 'business', name: '蝦皮直營分類規格_v1.md', version: 'v1.0', description: '蝦皮專用分類規格 — 補蝦皮直營後台的特殊品類映射。', appliedIn: ['/shopee-direct'], trigger: '蝦皮直營取數' },

  // 🎯 戰略
  { category: 'strategy', name: '蝦皮通路戰略.md', version: '⭐ v1.0', description: '淨淨蝦皮通路布局 — TA 分流四象限（X 信任度 × Y 願付價格）+ 3 子通路經營策略（產品線 / 活動價規則 / 長期策略）+ 跟商城 PM 對焦原則 + 動態空間金句「順應平台風，找最佳利基點」。對老闆 / 蘇小美 / 蝦皮 KAM+蝦皮商城 PM 對焦用。', appliedIn: ['/shopee', '/shopee-direct'], trigger: '蝦皮戰略 / 直營 vs 商城 / TA 分流' },
];

const CATEGORY_META = {
  mindset:  { label: '🧠 核心思考框架', count: 0, icon: BookOpen,    color: 'bg-violet-100 text-violet-700' },
  workflow: { label: '📋 工作流 SOP',   count: 0, icon: Briefcase,    color: 'bg-amber-100 text-amber-700' },
  platform: { label: '🔧 平台 API 反向工程', count: 0, icon: Code2,   color: 'bg-emerald-100 text-emerald-700' },
  business: { label: '📚 業務知識',     count: 0, icon: Megaphone,    color: 'bg-rose-100 text-rose-700' },
  strategy: { label: '🎯 戰略框架',     count: 0, icon: Globe,        color: 'bg-cyan-100 text-cyan-700' },
};

SKILLS.forEach((s) => (CATEGORY_META[s.category].count++));

export default function Skills() {
  return (
    <div className="space-y-6">
      <section className="card-soft p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Library className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">關於本工具</p>
            <h1 className="text-3xl font-black tracking-tight">SOP Skills 索引</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-prose leading-relaxed">
              這個 dashboard <strong>不是純 AI demo</strong> — 它是我 18 個月電商組組長期間實際使用的工作工具（脫敏 demo 版）。
              下面 <strong>{SKILLS.length} 份 SOP Skills</strong> 是我寫的，整個 dashboard 的業務邏輯、AI 判讀、分析框架都繞著它們轉。
              <strong className="text-primary">數字部分為真實業績結構 × random(0.65~0.95) anonymize</strong>，
              不洩漏絕對值但保留趨勢與通路占比 — 確保 demo 看起來真實，又遵守商業道德。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-primary text-primary-foreground text-xs font-bold gap-1"><Sparkles className="w-3 h-3" />18 個月實戰沉澱</Badge>
              <Badge variant="outline" className="text-xs font-bold">{SKILLS.length} 份 Skills</Badge>
              <Badge variant="outline" className="text-xs font-bold">{SKILLS.filter((s) => s.version.includes('⭐')).length} 份標星（高頻使用）</Badge>
            </div>

            {/* Johnny vs Claude 拆分工聲明 */}
            <div className="mt-4 p-4 rounded-xl bg-stone-50/60 border border-stone-200/50">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">🤝 透明聲明：我寫了什麼 / Claude 寫了什麼</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div>
                  <p className="font-bold text-foreground mb-1">🧑 Johnny（我）寫的：</p>
                  <ul className="space-y-0.5 text-foreground/80 list-disc list-inside">
                    <li>21 份 SOP 的<strong>業務邏輯</strong>（4 平台戰略、命名規則、踩雷沉澱）</li>
                    <li>所有<strong>業務判斷</strong>（哪個 KPI 重要、紅綠燈閾值、員旅特例）</li>
                    <li>每條 SOP 的<strong>架構決定</strong>與適用情境</li>
                    <li>UX 判斷（哪頁該有什麼、4 階段哲學的順序）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">🤖 Claude 寫的：</p>
                  <ul className="space-y-0.5 text-foreground/80 list-disc list-inside">
                    <li>SOP 的<strong>格式化 + Markdown 結構</strong>（章節編號、表格）</li>
                    <li>Dashboard 的<strong>React/TSX 程式碼</strong>（95%）</li>
                    <li>Anonymization script + batch processing</li>
                    <li>Cross-reference 校對（4 平台名稱一致化）</li>
                  </ul>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">面試挑任一份 SOP 問細節 — 我能講出當時情境、誰參與、為什麼這樣設計。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <div key={key} className="card-soft p-4 text-center">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2', meta.color)}>
              <meta.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold">{meta.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{meta.label}</p>
          </div>
        ))}
      </section>

      {Object.entries(CATEGORY_META).map(([key, meta]) => (
        <section key={key} className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', meta.color)}>
              <meta.icon className="w-4 h-4" />
            </span>
            {meta.label}
            <Badge variant="outline" className="text-[10px]">{meta.count}</Badge>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {SKILLS.filter((s) => s.category === key).map((s) => (
              <div key={s.name} className="card-soft p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-sm font-bold font-mono break-all">{s.name}</code>
                      <Badge variant="outline" className="text-[10px] font-bold">{s.version}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-foreground/85">{s.description}</p>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                  {s.trigger && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>觸發：{s.trigger}</span>
                    </div>
                  )}
                  {s.appliedIn && s.appliedIn.length > 0 && (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-[10px] text-muted-foreground">應用於：</span>
                      {s.appliedIn.map((r) => (
                        <Link key={r} to={r} className="text-[10px] text-primary font-mono hover:underline">{r}</Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="card-soft p-6 bg-gradient-to-br from-primary/5 to-accent/30 text-center space-y-3">
        <Sparkles className="w-6 h-6 text-primary mx-auto" />
        <h2 className="text-lg font-bold">這個 Dashboard 的本質</h2>
        <p className="text-sm leading-relaxed max-w-2xl mx-auto">
          一般人問「Claude 能幹嘛」，給 prompt 玩。<br />
          我把 <strong>18 個月實戰工作經驗</strong>提煉成 <strong>{SKILLS.length} 份 SOP — 符合公司規範 + 必踩坑指南的全方位 skill</strong>，
          每次 AI call 都自動套對應 skill — 從爬蟲、日報、活動規劃、戰略對焦到品類分析。<br />
          這個 dashboard 就是這套 skill 系統的 <strong>可視化證據</strong> — Demo Only 永不串真實系統。
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          為什麼選擇 Demo Only？<a href="#/trust" className="text-primary underline ml-1 font-semibold">看信任聲明</a>
        </p>
      </section>
    </div>
  );
}
