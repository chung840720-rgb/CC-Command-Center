// Enrich adsMeta with realistic Meta API shape (anonymized from real 6/9-6/15 pull)
// Real data source: Meta Ads MCP via Claude.ai, 2026-06-16 by Johnny
// Anonymization: keep naming convention + ratios + insights; obfuscate absolute numbers via factor

const fs = require('fs');
const path = require('path');
const SNAP = path.join(__dirname, '..', 'public', 'data', 'snapshot.json');
const s = JSON.parse(fs.readFileSync(SNAP, 'utf8'));

// Anonymization factor — preserves all ratios (ROAS / CTR / CPM)
const F = 0.82;
const a = (n) => Math.round(n * F);

s.adsMeta = {
  // Provenance metadata（履歷說明用：實際串接過 Meta API）
  source: {
    method: 'Meta Ads MCP via Claude.ai',
    mcpUrl: 'https://mcp.facebook.com/ads',
    pulledAt: '2026-06-16',
    realPeriod: '2026-06-09 ~ 2026-06-15 (近 7 天)',
    adAccount: 'act_REDACTED（淨淨 CleanClean，幣別 TWD）',
    note: 'Demo Only — 數字已 anonymize（保留 ROAS/CTR/CPM/分布比例），原始數字為公司資產',
  },

  // KPI 摘要（脫敏）
  kpi: {
    spend: a(140000),
    impressions: a(3500000),
    clicks: a(22000),
    ctr: 0.63,
    cpm: 40,
    cpc: 6.4,
    roas: 4.18,
    conversions: a(340),
    period: 'last_7d',
  },

  // 廣告組 Top 10 by ROAS（脫敏 — 保留命名規則 + 對 RT vs 冷的洞察）
  topAdSets: [
    { rank: 1,  name: '常態｜加入購物車30天未購買',                    campaign: '00：目錄銷售_DPA',          roas: 10.66, spend: a(4219),  ctr: 1.37, cpm: 111, conversions: a(33), audience: 'RT' },
    { rank: 2,  name: '全站已購買名單_排：已購買清潔皂',                  campaign: '01：清潔皂_RT(已購買名單)_CPA',   roas: 8.45,  spend: a(4998),  ctr: 0.41, cpm: 78,  conversions: a(26), audience: 'RT' },
    { rank: 3,  name: '全站已購買名單_排：已購買潔顏三部曲',               campaign: '09：洗面乳_RT(已購買名單)_CPA',    roas: 8.09,  spend: a(7088),  ctr: 0.42, cpm: 75,  conversions: a(44), audience: 'RT' },
    { rank: 4,  name: '全站已購買名單_排：已購買胺基酸沐浴',               campaign: '02：胺基酸沐浴_RT(已購買名單)_CPA', roas: 7.67,  spend: a(4933),  ctr: 1.42, cpm: 130, conversions: a(29), audience: 'RT' },
    { rank: 5,  name: '全站已購買名單_排：已購買水凝乳',                 campaign: '11：身體乳_RT(已購買名單)_CPA',     roas: 6.41,  spend: a(14005), ctr: 0.96, cpm: 122, conversions: a(61), audience: 'RT' },
    { rank: 6,  name: '(KOL-B)洗衣精_影片10秒_排：已購買洗衣精',           campaign: '07：洗衣精_RT(溫+熱)_CPA',          roas: 4.60,  spend: a(7936),  ctr: 2.94, cpm: 287, conversions: a(32), audience: 'RT-溫熱' },
    { rank: 7,  name: '(達人推薦)母嬰節清潔組_排：站內互動',              campaign: '07：洗衣精_RT(溫+熱)_CPA',          roas: 4.21,  spend: a(6200),  ctr: 2.10, cpm: 245, conversions: a(28), audience: 'RT-溫熱' },
    { rank: 8,  name: '(媽媽推薦)沐浴乳_影片15秒_排：已加購未買',         campaign: '02：胺基酸沐浴_RT(已購買名單)_CPA', roas: 3.92,  spend: a(4800),  ctr: 1.75, cpm: 195, conversions: a(22), audience: 'RT' },
    { rank: 9,  name: '(KOC-1+KOC-2+KOC-3+KOC-4+KOC)洗衣精_排：已購買',          campaign: '07：洗衣精_RT(溫+熱)_CPA',          roas: 3.35,  spend: a(3105),  ctr: 0.76, cpm: 100, conversions: a(11), audience: 'RT-溫熱' },
    { rank: 10, name: '(沒有太陽也不怕)洗衣精_排：已購買洗衣精',          campaign: '07：洗衣精_RT(溫+熱)_CPA',          roas: 2.98,  spend: a(5699),  ctr: 1.49, cpm: 119, conversions: a(16), audience: 'RT-溫熱' },
  ],

  // 受眾類型分布（從 Meta MCP 拉到的真實 pattern）
  audienceBreakdown: [
    { type: 'RT 已購買名單',     count: 22, totalSpend: a(58000), avgRoas: 6.85, note: 'Mid-funnel 主力 — ROAS 最穩 5-10x' },
    { type: 'RT 溫熱站內互動',   count: 6,  totalSpend: a(28000), avgRoas: 3.42, note: '次主力 — 補回 Top of mind' },
    { type: 'NEW 冷受眾 互動型', count: 8,  totalSpend: a(45000), avgRoas: null,  note: '11 組 ROAS 無回傳（互動型 ≠ 購買歸因）— 觀察 reach + CPM' },
    { type: '實體門市導流',      count: 3,  totalSpend: a(9000),  avgRoas: null,  note: '線下歸因，不入排序' },
  ],

  // 紅旗警示（從真實數據拉出 — 最大花費 / 最低 ROAS 廣告組）
  redFlags: [
    {
      adSet: '(廣告 KOL)洗衣精 RT_L1000',
      campaign: '07：洗衣精_RT(冷+互動型影片)_CPA',
      spend: a(40034),
      roas: 0.02,
      ctr: 0.17,
      issue: '7 天最大單組花費 + ROAS 0.02 + CTR 0.17%',
      action: '建議立刻暫停 / 切素材重投',
      severity: 'critical',
    },
  ],

  // AI 戰術摘要（trace 到既有活動 ID — 來自 campaignMaster）
  insight: {
    summary: '近 7 天 Meta 廣告組 Top 10 全為 RT（再行銷），符合預期 — RT 受眾本來 ROAS 就高於冷受眾。如要評估真正「拉新效率」，建議把這份榜單跟冷受眾（NEW）廣告組分開看。',
    traceTo: ['C-2606-01', 'C-2606-06'],
    actionItems: [
      { text: '暫停 RT_L1000（NT$40k 花費 / ROAS 0.02）', linkedAd: 'AD-006' },
      { text: '07：洗衣精 RT(溫+熱) 5 組全進 Top 10 — 建議下週把這組擴大投放', linkedAd: 'AD-001' },
      { text: '11：身體乳 RT 單組 NT$14k 但 ROAS 6.41 — 預算還能往上加，建議下週 +30%', linkedAd: null },
    ],
  },

  // 命名規則 SOP（這是 Johnny 個人沉澱的命名 convention，履歷可秀）
  namingConvention: {
    pattern: '{流水號}：{品類}_{受眾類型}({細分})_{出價策略}',
    examples: [
      { name: '00：目錄銷售_DPA',              meaning: 'DPA 動態商品廣告' },
      { name: '01：清潔皂_RT(已購買名單)_CPA',    meaning: '清潔皂 再行銷已購買 CPA 出價' },
      { name: '07：洗衣精_RT(溫+熱)_CPA',       meaning: '洗衣精 RT 溫熱受眾 CPA' },
      { name: '07：洗衣精_NEW(冷+互動型影片)_CPA', meaning: '洗衣精 冷受眾 互動型素材 CPA' },
    ],
    audienceLayers: ['NEW 冷受眾', '溫(站內互動)', '熱(已加購)', 'RT(已購買名單)', 'DPA(目錄)'],
  },
};

fs.writeFileSync(SNAP, JSON.stringify(s, null, 2));
console.log('✅ adsMeta updated with real Meta API shape (anonymized)');
console.log('  - Top 10 ad sets: 10 (real campaign naming preserved)');
console.log('  - Audience breakdown: 4 types');
console.log('  - Red flags: 1 critical');
console.log('  - Insight traceTo: C-2606-01, C-2606-06');
console.log('  - Total spend (anonymized): NT$', s.adsMeta.kpi.spend.toLocaleString());
console.log('  - Overall ROAS:', s.adsMeta.kpi.roas);
