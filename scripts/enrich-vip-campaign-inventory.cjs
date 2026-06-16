// 擴充 snapshot：vipCohort + campaignRoi + productInventory + pmPrompts
const fs = require('fs');
const path = require('path');
const SNAP = path.join(__dirname, '..', 'public', 'data', 'snapshot.json');
const s = JSON.parse(fs.readFileSync(SNAP, 'utf8'));

// ════════════════════════════════════════════════
// 1. VIP Cohort 行為差異（3 等級）
// ════════════════════════════════════════════════
s.vipCohort = {
  period: '近 90 天',
  tiers: [
    {
      name: '銀卡',
      memberCount: 8420,
      avgOrderValue: 1180,
      monthlyOrderFreq: 1.4,
      retention90d: 38,
      creditUsageRate: 22,
      preferredCategories: ['洗衣精', '柔濕巾', '家事皂'],
      avgLTV: 4920,
      color: 'stone',
    },
    {
      name: '金卡',
      memberCount: 1340,
      avgOrderValue: 1850,
      monthlyOrderFreq: 2.8,
      retention90d: 71,
      creditUsageRate: 45,
      preferredCategories: ['洗衣精 SET', '沐浴用品', '潔顏三部曲'],
      avgLTV: 18650,
      color: 'amber',
    },
    {
      name: '白金卡',
      memberCount: 285,
      avgOrderValue: 2940,
      monthlyOrderFreq: 4.2,
      retention90d: 88,
      creditUsageRate: 62,
      preferredCategories: ['全品類組合', '訂閱制', '聯名款'],
      avgLTV: 52800,
      color: 'violet',
    },
  ],
  // 升級門檻試算
  upgradeSimulation: {
    currentThreshold: 12000,
    scenarios: [
      { threshold: 12000, eligibleSilver: 0,    estimatedGmvLift: 0,        note: '現況基準' },
      { threshold: 10000, eligibleSilver: 412,  estimatedGmvLift: 5128400,  note: '降 17% → 412 銀卡可升金' },
      { threshold: 8000,  eligibleSilver: 1024, estimatedGmvLift: 11890200, note: '降 33% → 1,024 銀卡可升金' },
      { threshold: 6000,  eligibleSilver: 2156, estimatedGmvLift: 18923400, note: '降 50% → ROI 邊際效益遞減' },
    ],
    recommendation: '建議降至 NT$ 10,000（412 人升級 / 預期 GMV +512 萬）',
  },
  // 沉睡 VIP Top 20（脫敏）
  sleepingVips: {
    total: 47,
    description: '金卡/白金卡，> 60 天無下單',
    top5: [
      { id: 'VIP-A', tier: '白金', daysSinceOrder: 87, ltv: 89200, preferredCategory: '洗衣精' },
      { id: 'VIP-B', tier: '白金', daysSinceOrder: 76, ltv: 65800, preferredCategory: '潔顏三部曲' },
      { id: 'VIP-C', tier: '金',   daysSinceOrder: 92, ltv: 42300, preferredCategory: '沐浴 SET' },
      { id: 'VIP-D', tier: '金',   daysSinceOrder: 68, ltv: 38900, preferredCategory: '家事皂' },
      { id: 'VIP-E', tier: '金',   daysSinceOrder: 84, ltv: 35200, preferredCategory: '柔濕巾' },
    ],
  },
  // 高 LTV 共同特徵
  highLtvTraits: [
    { trait: '首購 ≥ NT$ 1,500',                impact: '+ 45% 後 90 天 GMV', confidence: 'high' },
    { trait: '首購來源 utm_source = email',     impact: '+ 38% LTV',         confidence: 'high' },
    { trait: '首購 30 天內回購',                impact: '+ 62% 留存率',      confidence: 'high' },
    { trait: '購買 ≥ 2 個品類',                 impact: '+ 28% LTV',         confidence: 'medium' },
    { trait: '訂閱制客戶',                      impact: '+ 156% LTV',        confidence: 'high' },
  ],
};

// ════════════════════════════════════════════════
// 2. 活動 ROI 排行榜（過去 5 檔）
// ════════════════════════════════════════════════
s.campaignRoiRanking = {
  period: '近 6 個月',
  campaigns: [
    {
      name: '母嬰節擴大投放',
      period: '5/28 ~ 6/12',
      spend: 285000,
      gmv: 1620000,
      roas: 5.68,
      orders: 1240,
      avgOrderValue: 1306,
      newCustomers: 412,
      discountRate: 12,
      reuseTimes: 3,
      verdict: 'top1',
      insight: 'Meta 廣告 + 商品頁 CTA 組合最佳，明年同期延長 2 週',
    },
    {
      name: '蝦皮 618 預熱',
      period: '6/8 ~ 6/18',
      spend: 156000,
      gmv: 752000,
      roas: 4.82,
      orders: 815,
      avgOrderValue: 923,
      newCustomers: 268,
      discountRate: 15,
      reuseTimes: 2,
      verdict: 'top2',
      insight: '長尾關鍵字效果優於熱門字 — 下次提早 7 天卡位',
    },
    {
      name: 'MoMo 站內競價',
      period: '6/1 ~ 6/30',
      spend: 95000,
      gmv: 420000,
      roas: 4.42,
      orders: 350,
      avgOrderValue: 1200,
      newCustomers: 178,
      discountRate: 8,
      reuseTimes: 4,
      verdict: 'top3',
      insight: '除黴噴霧長期王牌，搭配首頁 banner 效果穩',
    },
    {
      name: '沉睡會員喚醒（柔濕巾試用）',
      period: '5/25 ~ 6/15',
      spend: 48000,
      gmv: 198000,
      roas: 4.13,
      orders: 220,
      avgOrderValue: 900,
      newCustomers: 0,
      discountRate: 38,
      reuseTimes: 1,
      verdict: 'good',
      insight: '純喚醒老客，效率高但 GMV 規模有限',
    },
    {
      name: '雙11 預熱（2025）',
      period: '2025/10/20 ~ 11/10',
      spend: 420000,
      gmv: 1820000,
      roas: 4.33,
      orders: 1480,
      avgOrderValue: 1230,
      newCustomers: 380,
      discountRate: 18,
      reuseTimes: 5,
      verdict: 'good',
      insight: '常規老檔，今年改 5 階段倒數 CTA 效果可期',
    },
    {
      name: '官網直播首場',
      period: '3/15 一次性',
      spend: 35000,
      gmv: 42000,
      roas: 1.20,
      orders: 38,
      avgOrderValue: 1100,
      newCustomers: 12,
      discountRate: 25,
      reuseTimes: 0,
      verdict: 'flop',
      insight: '直播流量未達預期，明年不再單獨開檔，併入大型活動',
    },
  ],
  insight: 'Top 3 活動皆有「短期 + 多次重複使用 + 折扣率 < 15%」共同特徵。直播首場 ROAS 1.2 低於 2.5x 警戒線 → 砍。',
};

// ════════════════════════════════════════════════
// 3. 商品庫存 / 滯銷預警
// ════════════════════════════════════════════════
s.productInventory = {
  period: '當下',
  totalSku: 47,
  summary: {
    critical: 3,    // 庫存 < 7 天
    healthy: 18,    // 7-30 天
    excess: 14,     // 30-90 天
    deadStock: 12,  // > 90 天
  },
  items: [
    // 缺貨警示
    { sku: 'WSH-001', name: '真濃縮洗衣精 800ML', category: '洗衣精', stock: 42, daily30d: 28, daysLeft: 1.5, status: 'critical', action: '⚡ 立即補貨 800 瓶' },
    { sku: 'WSH-008', name: '洗衣精補充瓶 1L',    category: '洗衣精', stock: 65, daily30d: 18, daysLeft: 3.6, status: 'critical', action: '⚡ 補貨 500 瓶' },
    { sku: 'BTH-003', name: '胺基酸沐浴乳 500ML', category: '沐浴',   stock: 88, daily30d: 22, daysLeft: 4.0, status: 'critical', action: '⚡ 補貨 600 瓶' },
    // 健康
    { sku: 'WSH-002', name: '洗衣精 SET 2 入',    category: '洗衣精', stock: 320, daily30d: 18, daysLeft: 17.8, status: 'healthy', action: '✓ 健康' },
    { sku: 'FAC-005', name: '潔顏三部曲',          category: '洗面乳', stock: 285, daily30d: 14, daysLeft: 20.4, status: 'healthy', action: '✓ 健康' },
    { sku: 'BTH-001', name: '沐浴 SET',           category: '沐浴',   stock: 198, daily30d: 11, daysLeft: 18.0, status: 'healthy', action: '✓ 健康' },
    // 偏多
    { sku: 'WET-002', name: '柔濕巾旅行裝',        category: '柔濕巾', stock: 450, daily30d: 8, daysLeft: 56.3, status: 'excess', action: '⚠ 庫存偏多，考慮促銷' },
    { sku: 'FAC-008', name: '溫和洗面乳 200ML',   category: '洗面乳', stock: 380, daily30d: 6, daysLeft: 63.3, status: 'excess', action: '⚠ 庫存偏多' },
    // 滯銷
    { sku: 'WET-007', name: '柔濕巾經典包 (舊版)', category: '柔濕巾', stock: 1240, daily30d: 0, daysLeft: 999, status: 'dead', action: '💀 30 天無訂單 — 清倉 / 下架' },
    { sku: 'OLD-003', name: '家事皂禮盒 2025 春',  category: '家事皂', stock: 680, daily30d: 0, daysLeft: 999, status: 'dead', action: '💀 30 天無訂單 — 清倉' },
    { sku: 'OLD-005', name: '節慶限定洗衣精',      category: '洗衣精', stock: 520, daily30d: 1, daysLeft: 520, status: 'dead', action: '💀 庫存日數 > 90 天' },
  ],
  totalDeadStockValue: 1180000,
  recommendation: '本月清倉 3 個滯銷 SKU 可回收 NT$ 118 萬庫存價值。同時補 3 個缺貨 SKU。',
};

// ════════════════════════════════════════════════
// 4. 50 PM Prompts Catalog (簡化版索引)
// ════════════════════════════════════════════════
s.pmPrompts = {
  description: '50 個經實戰驗證的 Shopline MCP × PM 提問範本（對應 skills/shopline-pm-prompts.md v1.0）',
  totalCount: 50,
  categories: [
    { id: 'A', name: '日報 / 即時查詢',     count: 10, icon: '📊', color: 'emerald', topPrompts: [
      { id: 'A1', title: '昨日業績一句話總結',  prompt: '拉昨天台灣時區所有訂單，按 created_from 排除 pos 跟 one_page_store，給我純官網 confirmed/completed 的 GMV + 訂單數 + 平均客單，然後套三行回報老闆格式。' },
      { id: 'A3', title: '昨日 Top 5 熱銷 SKU', prompt: '拉昨天訂單的 subtotal_items，按 SKU 加總 GMV + 數量，給我 Top 5 SKU 排行 + 各占當日 GMV %。' },
      { id: 'A10', title: '流失客戶名單',        prompt: '找 60 天前有下單、近 30 天沒下單的 customer_id：流失客戶總數 + 累計貢獻 GMV + VIP 等級分布。' },
    ]},
    { id: 'B', name: '廣告 ROAS 真實反查',   count: 5,  icon: '📘', color: 'blue',    topPrompts: [
      { id: 'B1', title: '真實 UTM Source ROAS', prompt: '拉本月所有訂單，按 utm_data.utm_source 分群算 GMV，搭配 Meta MCP 拉同期間花費，算「真實 ROAS」vs「Meta 自報 ROAS」對照表。' },
    ]},
    { id: 'C', name: '促銷 / 活動 ROI',     count: 5,  icon: '🎯', color: 'rose',    topPrompts: [
      { id: 'C1', title: '上月各活動 GMV',  prompt: '拉上月所有訂單，看 promotion_items.promotion.title_translations.zh-hant 分群：每個活動帶幾筆 / GMV / 平均客單 / ROI 排行。' },
    ]},
    { id: 'D', name: 'VIP / 會員行為',      count: 10, icon: '👑', color: 'amber',   topPrompts: [
      { id: 'D1', title: '三等級行為差異',   prompt: '拉近 90 天訂單，按 membership_tier 分群：各等級平均客單 + 月平均下單次數 + 偏好品類 Top 3 + 購物金使用比例。' },
      { id: 'D2', title: '升級貢獻 LTV',     prompt: '比較持有銀卡 vs 持有金卡客戶的 90 天累計 GMV，算升級後 GMV 增量 + ROI 試算。' },
      { id: 'D3', title: '沉睡 VIP 名單',    prompt: '找 membership_tier 是金卡或白金卡，但近 60 天無下單的客戶名單 + 累計 LTV 排序。' },
    ]},
    { id: 'E', name: '滯銷 / 庫存',         count: 5,  icon: '📦', color: 'stone',   topPrompts: [
      { id: 'E1', title: '滯銷 SKU 名單',     prompt: '列出所有 SKU，過去 30 天無訂單的：SKU + 庫存 + 上次有訂單多久前 + 建議（清倉/改包裝/下架）。' },
      { id: 'E2', title: '庫存日數 / 銷售速度', prompt: '所有 SKU 算「庫存 ÷ 過去 30 天日均」= 庫存日數，分 4 級燈號：缺貨 / 健康 / 偏多 / 滯銷。' },
    ]},
    { id: 'F', name: '訂單品質 / 異常',     count: 5,  icon: '🚨', color: 'red',     topPrompts: [
      { id: 'F2', title: '重複地址檢查',     prompt: '過去 30 天同一個 delivery_address.address_1 出現 > 3 次的訂單，列出可能 KOL 團購或經銷商私下大量採購。' },
    ]},
    { id: 'G', name: '月報 / 週報自動產出', count: 10, icon: '📝', color: 'violet',  topPrompts: [
      { id: 'G1', title: '月報 P2 各平台業績', prompt: '拉上月 4 平台訂單，產出月報 P2 表格：每平台 GMV / 訂單 / 客單 / ROAS / 廣告費 / 占比 / MOM / YOY。套 monthly-report-mindset 5 必加要素。' },
      { id: 'G6', title: '週訊四平台戰況',   prompt: '拉上週一到日 4 平台訂單，套 weekly-report-skill-v1_1.md 格式：WoW / YoY / 燈號 / 月累計達成 / 亮點警示。' },
    ]},
  ],
  roiEstimate: {
    description: '若團隊全套用，估算月省工時',
    items: [
      { task: '日報數據彙整',  old: '30 min/day', new: '2 min/day', monthSaving: '14 hr' },
      { task: '週訊產出',     old: '90 min/wk',  new: '10 min/wk', monthSaving: '5.3 hr' },
      { task: '月報 P2-P6',   old: '4 hr/月',    new: '30 min/月', monthSaving: '3.5 hr' },
      { task: '滯銷 / 庫存',  old: '2 hr/月',    new: '5 min/月',  monthSaving: '1.9 hr' },
      { task: 'VIP cohort',  old: '8 hr/季',    new: '30 min/季', monthSaving: '2.5 hr/月' },
      { task: '廣告 ROAS',   old: '6 hr/季',    new: '20 min/季', monthSaving: '1.9 hr/月' },
    ],
    monthTotal: '~ 29 小時',
    yearValueNtd: 174000,
  },
};

fs.writeFileSync(SNAP, JSON.stringify(s, null, 2));
console.log('✅ snapshot 擴充完成');
console.log('  - vipCohort: 3 tiers + 升級試算 + 沉睡 VIP + 高 LTV 特徵');
console.log('  - campaignRoiRanking: 6 個活動含一個 flop');
console.log('  - productInventory: 11 SKU 含 4 級燈號');
console.log('  - pmPrompts: 7 大類 / 50 個');
