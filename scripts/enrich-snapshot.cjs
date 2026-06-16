// Enrich snapshot.json with grounded AI analysis traces
const fs = require('fs');
const path = require('path');
const SNAP = path.join(__dirname, '..', 'public', 'data', 'snapshot.json');
const s = JSON.parse(fs.readFileSync(SNAP, 'utf8'));

// === 1. MoMo+ → MoMo ===
function deepRename(obj) {
  if (typeof obj === 'string') return obj.replace(/MoMo\+/g, 'MoMo').replace(/MOMO\+/g, 'MOMO');
  if (Array.isArray(obj)) return obj.map(deepRename);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj)) out[k] = deepRename(obj[k]);
    return out;
  }
  return obj;
}
const enriched = deepRename(s);

// === 2. Campaign master (有 ID 的活動清單，所有 AI 分析都 traceTo 這些 ID) ===
enriched.campaignMaster = [
  {
    id: 'C-2606-01',
    name: '母嬰節擴大投放',
    period: '5/28 ~ 6/12',
    status: '進行中',
    owner: '饅頭+冠達(廣告代操)',
    platform: ['shopline','shopee','momo'],
    mainCategory: '洗衣精',
    action: 'Meta 廣告預算加碼 30%、主推「洗衣精 SET」素材 A/B 雙軌',
    expectedImpact: '洗衣精跨平台 GMV +20%',
  },
  {
    id: 'C-2606-02',
    name: '蝦皮 618 預熱',
    period: '6/8 ~ 6/18',
    status: '進行中',
    owner: '羽芯',
    platform: ['shopee','shopeeDirect'],
    mainCategory: '沐浴用品',
    action: '蝦皮關鍵字「沐浴 SET」+ 聯盟加碼，預算翻倍',
    expectedImpact: '蝦皮沐浴品類 +25%',
  },
  {
    id: 'C-2606-03',
    name: '沉睡會員喚醒（柔濕巾免費試用）',
    period: '5/25 ~ 6/15',
    status: '進行中',
    owner: '饅頭+媛媛(CRM)',
    platform: ['shopline'],
    mainCategory: '柔濕巾',
    action: '漸強 MAAC 推送 13 萬沉睡會員，1 包柔濕巾免費試用、自付運費 $60',
    expectedImpact: '官網柔濕巾保留水位，回購率 +12%',
  },
  {
    id: 'C-2606-04',
    name: 'MoMo 站內競價提升',
    period: '6/1 ~ 6/30',
    status: '進行中',
    owner: '跳跳',
    platform: ['momo'],
    mainCategory: '除黴/清潔',
    action: 'MoMo 關鍵字「除黴噴霧」競價 +25%、首頁推薦版位加購',
    expectedImpact: 'MoMo 除黴品類 +15%',
  },
  {
    id: 'C-2606-05',
    name: '618 主檔（4 平台齊發）',
    period: '6/15 ~ 6/20',
    status: '排程中',
    owner: '全組',
    platform: ['shopline','shopee','momo','shopeeDirect'],
    mainCategory: '全品類',
    action: '4 平台同步「滿千折百」+ Meta 主視覺 +蝦皮聯盟最大檔期擋',
    expectedImpact: '單檔 GMV 衝 1500 萬',
  },
  {
    id: 'C-2606-06',
    name: '柔濕巾 618 排除策略',
    period: '6/8 ~ 6/20',
    status: '進行中',
    owner: '饅頭',
    platform: ['shopline','shopee','momo'],
    mainCategory: '柔濕巾',
    action: '柔濕巾 618 不投廣告、預算移轉至洗衣精+沐浴',
    expectedImpact: '柔濕巾預期 -10~15%（策略性，非異常）',
  },
];

// === 3. Ad Actions（廣告動作清單，AI 分析 trace 到此）===
enriched.adActionsMaster = [
  { id: 'AD-001', platform: 'Meta', date: '5/28', action: '加碼母嬰節廣告組（洗衣精 SET）+ 預算 +30%', linkedCampaign: 'C-2606-01' },
  { id: 'AD-002', platform: '蝦皮關鍵字', date: '6/1', action: '加碼「沐浴 SET」競價 +40%', linkedCampaign: 'C-2606-02' },
  { id: 'AD-003', platform: 'MoMo 站內', date: '6/1', action: '「除黴噴霧」競價 +25%、首頁推薦', linkedCampaign: 'C-2606-04' },
  { id: 'AD-004', platform: '漸強 MAAC', date: '5/25', action: '13 萬沉睡 + 7 萬 LINE UID 推柔濕巾試用', linkedCampaign: 'C-2606-03' },
  { id: 'AD-005', platform: '蝦皮聯盟', date: '6/3', action: '618 預熱聯盟分潤 +5%', linkedCampaign: 'C-2606-02' },
  { id: 'AD-006', platform: 'Meta + Google', date: '6/8 起暫停', action: '柔濕巾 618 廣告全停（策略性）', linkedCampaign: 'C-2606-06' },
];

// === 4. weekOverWeek AI insight 加 trace ===
enriched.weekOverWeek.shopline.traceTo = ['C-2606-03', 'AD-004'];
enriched.weekOverWeek.shopline.insight = '🚨 流量與轉換率同步下滑，主因 5/25 起預算移轉到沉睡會員喚醒（AD-004），常規廣告降溫。建議：若 6/15 前喚醒 ROAS 沒回到 2.5x，6/16 起恢復常規廣告';
enriched.weekOverWeek.shopee.traceTo = ['C-2606-02', 'AD-002', 'AD-005'];
enriched.weekOverWeek.shopee.insight = '🎯 轉換率↑因「沐浴 SET」廣告（AD-002）精準命中，建議於 6/8 起聯盟分潤加碼（AD-005）已啟動，預期下週流量回升';
enriched.weekOverWeek.momo.traceTo = ['C-2606-04', 'AD-003'];
enriched.weekOverWeek.momo.insight = '🚀 「除黴噴霧」競價提升（AD-003）效果顯著，ROAS 23.9x，建議將相同策略複製到 MoMo「洗衣精」關鍵字測試（提報下次週會）';

// === 5. categoryContribution 加 trace ===
enriched.categoryContribution.categories.forEach(cat => {
  if (cat.name === '洗衣精')    { cat.traceTo = ['C-2606-01', 'AD-001']; cat.adAction = '【C-2606-01】Meta 加碼母嬰節廣告組（5/28 起）、洗衣精 SET 主推'; }
  if (cat.name === '沐浴用品')  { cat.traceTo = ['C-2606-02', 'AD-002']; cat.adAction = '【C-2606-02】蝦皮關鍵字加碼「沐浴 SET」（6/1 起）、聯盟分潤 +5%'; }
  if (cat.name === '柔濕巾')    { cat.traceTo = ['C-2606-06', 'AD-006']; cat.adAction = '【C-2606-06】618 主動排除廣告（節省預算移至洗衣精+沐浴，策略性）'; }
  if (cat.name === '除黴/清潔'){ cat.traceTo = ['C-2606-04', 'AD-003']; cat.adAction = '【C-2606-04】MoMo 關鍵字「除黴噴霧」競價提升 25%、首頁推薦'; }
  if (cat.name === '其他/配件'){ cat.traceTo = []; cat.adAction = '無重大廣告動作（保留 618 主檔 C-2606-05 預算）'; }
});

// === 6. 競品改成 4 家：淨毒五郎 / 漫享 / DUDA CLEAN / 古寶 ===
enriched.competitorAds = {
  summary: {
    period: '近 30 天觀察',
    insight: '4 家競品都在加碼母嬰節，但策略路線分歧 — 淨毒五郎主打「消毒科技敘事」、漫享主打「療癒感包裝」、DUDA CLEAN 主打「KOL 業配密度」、古寶主打「中草本天然訴求」',
  },
  competitors: [
    {
      name: '淨毒五郎',
      logo: '🦠',
      positioning: '消毒科技 / 媽嬰級認證',
      adSpendEst: 'NT$ 280 萬/月',
      mainPlatform: 'Meta + 蝦皮',
      latestMove: '5/30 上「次氯酸 PRO」新品，Meta 影片素材主打實驗室畫面（科學感）',
      strategy: '技術敘事 + 認證背書 + 媽嬰部落客深度合作',
      threat: 'medium',
      ourCounter: '我們的母嬰級認證更多（SNQ + Dermatest + SGS），素材可突顯「PR50+ 競品」優勢',
    },
    {
      name: '漫享',
      logo: '🌸',
      positioning: '療癒生活 / 香氛調性',
      adSpendEst: 'NT$ 180 萬/月',
      mainPlatform: 'Meta + Instagram',
      latestMove: '6/1 推「家事香氛系列」， KOL Reels 重押（蔡阿嘎夫婦剛接他們的業配）',
      strategy: '視覺包裝 + KOL 生活情境 + IG 重投',
      threat: 'high',
      ourCounter: '我們也有蔡阿嘎夫婦合作，且品牌承諾「真療癒」更貼合 — 可加強 IG/Threads 投放',
    },
    {
      name: 'DUDA CLEAN',
      logo: '⚡',
      positioning: '高 CP 值 / 蝦皮第一',
      adSpendEst: 'NT$ 220 萬/月',
      mainPlatform: '蝦皮 + Meta',
      latestMove: '6/3 起蝦皮關鍵字「洗衣精」競價狂飆（搶我們 618 預熱版位）',
      strategy: '蝦皮關鍵字壟斷 + 折扣戰 + 微型 KOL 鋪量',
      threat: 'high',
      ourCounter: '我們不打價格戰，改攻「成份透明 + 安全認證」差異化；蝦皮關鍵字改鎖「母嬰洗衣精」長尾',
    },
    {
      name: '古寶',
      logo: '🌿',
      positioning: '中草本 / 老牌信任',
      adSpendEst: 'NT$ 120 萬/月',
      mainPlatform: 'MoMo + 官網',
      latestMove: '5/28 MoMo 首頁買版主打「古寶皂」新包裝，Google 品牌字加碼',
      strategy: '中老年信任 + MoMo 站內深耕 + 包裝重設計',
      threat: 'low',
      ourCounter: 'TA 重疊度低（古寶偏 40+）；我們持續鎖 25-40 年輕媽媽',
    },
  ],
  actions: [
    { priority: 'high', text: '【針對 DUDA CLEAN】蝦皮關鍵字改鎖「母嬰洗衣精」長尾字 — 5 天內提報', traceTo: 'AD-002' },
    { priority: 'high', text: '【針對漫享】Threads/IG 投放預算 +20% — 利用蔡阿嘎夫婦既有合作做差異化', traceTo: 'AD-001' },
    { priority: 'medium', text: '【針對淨毒五郎】下次月會 P5 加 1 頁「淨淨認證一覽 vs 競品」', traceTo: null },
  ],
};

enriched.competitorWeb = {
  summary: '4 家競品官網/社群分析',
  lastUpdated: '2026-06-11',
  competitors: [
    { name: '淨毒五郎', web: 'jinduwulang.com', traffic: '~120K/月', topPage: '/products/cl-pro', conversion: '2.1%', social: { ig: '6.2萬', threads: '8.4K' } },
    { name: '漫享',     web: 'manxiang.tw',     traffic: '~85K/月',  topPage: '/scent-series', conversion: '2.8%', social: { ig: '12.4萬', threads: '23K' } },
    { name: 'DUDA CLEAN', web: 'shopee.tw/dudaclean', traffic: '~280K/月（蝦皮）', topPage: '/laundry-set', conversion: '4.2%', social: { ig: '3.1萬', threads: '—' } },
    { name: '古寶',     web: 'gubao.com.tw',    traffic: '~45K/月',  topPage: '/products/soap', conversion: '1.6%', social: { ig: '2.8萬', threads: '—' } },
  ],
};

// === 7. 今日 3 事項（連結到實際活動）===
enriched.todayTasks = {
  date: '2026-06-11',
  weekday: '週四',
  daysUntilMonthlyReview: 2, // 假設 6/13 月會
  tasks: [
    {
      priority: 1,
      title: '11:00 跑日報 Cowork',
      detail: '羽芯 + 跳跳已填 Sheets，按 SOP 跑 3 份 Slack draft（群組 + DM x2）',
      perspective: '數據觀測員',
      linkedCampaign: 'C-2606-02',
      sopRef: 'daily-report.md v2.10',
    },
    {
      priority: 2,
      title: '跟羽芯確認 618 預熱（C-2606-02）進度',
      detail: '蝦皮「沐浴 SET」廣告 ROAS 是否達 3.0x、聯盟分潤 +5% 是否已生效',
      perspective: '執行操盤手 + 內部關係官',
      linkedCampaign: 'C-2606-02',
      sopRef: 'weekly-meeting.md',
    },
    {
      priority: 3,
      title: '檢視沉睡會員喚醒（C-2606-03）ROAS',
      detail: '5/25 起跑 17 天，目前喚醒人數 / 喚醒 ROAS — 若低於 2.5x 月會前要決定是否續推',
      perspective: '策略軍師',
      linkedCampaign: 'C-2606-03',
      sopRef: 'cleanclean-pm.md 第7.2部',
    },
  ],
};

// === 8. 黃金三指標（流量 × 客單價 × 轉換率）— 月報核心 ===
enriched.goldenTriangle = {
  period: '6月 MTD',
  description: '笙闆月報 P2 核心 — 流量 × 客單價 × 轉換率（黃金三指標）',
  platforms: [
    { id: 'shopline', label: '官網', traffic: 36212, aov: 1302, cr: 1.49, target: { cr: 2.0 }, alert: 'cr-low' },
    { id: 'shopee',   label: '蝦皮', traffic: 22147, aov: 921,  cr: 5.50, target: { cr: 5.0 }, alert: null },
    { id: 'momo',     label: 'MoMo', traffic: 2132,  aov: 1203, cr: 7.81, target: { cr: 6.0 }, alert: null },
  ],
  insight: '官網轉換率 1.49% 偏低（目標 2.0%）— 與沉睡會員喚醒（C-2606-03）導入流量但未轉換有關，建議檢視 LP 與 cart abandonment',
};

// === 9. 笙闆三行回報草稿 ===
enriched.bossReport = {
  draftedAt: '2026-06-11 09:30',
  draftFor: '6月 MTD 業績向上溝通',
  draft: {
    conclusion: '【結論】MTD 達成 88%，蝦皮+MoMo 達標、官網落後 26pp',
    status: '【現況】官網卡在 C-2606-03 喚醒期 ROAS 待驗證（5/25 跑至今 17 天），蝦皮 +18% YoY 持穩、MoMo +52% YoY 超標',
    next: '【下一步】6/15 主檔（C-2606-05）4 平台齊發 + 喚醒檔 6/15 結算決定續推與否',
  },
  basedOn: ['C-2606-03', 'C-2606-05'],
  sopRef: 'daren-mindset.md + monthly-report-mindset.md',
};

fs.writeFileSync(SNAP, JSON.stringify(enriched, null, 2));
console.log('✅ snapshot enriched');
console.log('  - MoMo+ renamed:', JSON.stringify(enriched).match(/MoMo\+/g)?.length || 0);
console.log('  - campaignMaster:', enriched.campaignMaster.length, 'activities');
console.log('  - adActionsMaster:', enriched.adActionsMaster.length, 'actions');
console.log('  - competitorAds:', enriched.competitorAds.competitors.length, 'competitors');
console.log('  - todayTasks:', enriched.todayTasks.tasks.length, 'tasks');
console.log('  - goldenTriangle:', enriched.goldenTriangle.platforms.length, 'platforms');
console.log('  - bossReport draft:', enriched.bossReport.draftedAt);
