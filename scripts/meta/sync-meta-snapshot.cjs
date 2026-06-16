#!/usr/bin/env node
/**
 * Meta Ads MCP → Dashboard Snapshot Sync
 * ==========================================
 *
 * 設計目的：把從 Meta Ads MCP（mcp__meta-ads__ads_get_ad_entities）拉到的
 * 真實廣告數據，自動套上 anonymization + KOL generic 化 + 結構化，寫進
 * dashboard 的 snapshot.json。
 *
 * 使用流程（一句 prompt 就能跑完）：
 *
 *   給 Claude Code 講這句：
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ 用 mcp__meta-ads__ads_get_ad_entities 拉淨淨 act_XXX 近 7   │
 *   │ 天的 adset 數據（fields: id, name, amount_spent,            │
 *   │ impressions, clicks, ctr, cpm, purchase_roas, limit: 200）  │
 *   │ → 寫進 scripts/meta/raw-meta-entities.json                   │
 *   │ → 跑 `node scripts/meta/sync-meta-snapshot.cjs`              │
 *   │ → 跑 `npm run build && npm run deploy`                       │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * Claude Code 會：
 *   1. 呼叫 MCP tool 拉真實資料
 *   2. 把回傳的 ad_entities JSON 寫進 raw-meta-entities.json
 *   3. 跑本 script → 處理 + 寫 snapshot
 *   4. build + deploy
 *
 * 換新公司用法：改 KOL_MAP 即可（其餘配置自動）
 *
 * 版本：v1.0（2026-06-16 沉澱）
 * Owner：Johnny / 饅頭 / 鍾尚勲
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// CONFIG（換公司只需改這段）
// ═══════════════════════════════════════════════════════════════

const ANONYMIZATION_FACTOR = 0.82;   // 0.65~0.95 之間，保留 ratio 但混淆絕對值
const TOP_N = 10;                     // Top N by ROAS
const ROAS_HEALTHY_THRESHOLD = 5;    // ROAS >= 5 視為健康
const ROAS_RED_FLAG_THRESHOLD = 1;   // ROAS < 1 視為紅旗
const SPEND_RED_FLAG_THRESHOLD = 10000; // 花費 > NT$10k 才會被列入紅旗候選

// KOL 名稱 generic 化映射（避免洩漏業務關係）
// 換公司就改這個 map
const KOL_MAP = {
  'KOL-A': 'KOL-A',
  'KOL-B':   'KOL-B',
  'KOL-C': 'KOL-C',
  'KOL-D':   'KOL-D',
  'KOC-1':   'KOC-1',
  'KOC-2':   'KOC-2',
  'KOC-3':   'KOC-3',
};

// 受眾分類規則（依命名 pattern 推斷）
const AUDIENCE_RULES = [
  { pattern: /加入購物車.*未購買/, type: 'RT 加購未購' },
  { pattern: /已購買名單.*已購買/, type: 'RT 已購買名單' },
  { pattern: /KOL|KOC|PV、|影片10秒/, type: 'RT 溫熱+KOC素材' },
  { pattern: /LL\d+%|lookalike/i,    type: 'NEW LL lookalike' },
  { pattern: /公里|地址|門市|台茂/,  type: '實體門市導流' },
  { pattern: /25\+|20\+|興趣|住家/,  type: '冷受眾興趣' },
];

const PATHS = {
  rawInput:  path.join(__dirname, 'raw-meta-entities.json'),
  snapshot:  path.join(__dirname, '..', '..', 'public', 'data', 'snapshot.json'),
};

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

const a = (n) => Math.round(n * ANONYMIZATION_FACTOR);

function parseMetaNumber(s) {
  // "NT$4,219 TWD" → 4219 / "10.66" → 10.66 / "Not available" → null
  if (s === 'Not available' || s == null) return null;
  if (typeof s === 'number') return s;
  const cleaned = String(s).replace(/[^\d.-]/g, '');
  return cleaned ? parseFloat(cleaned) : null;
}

function genericizeKOLNames(name) {
  let result = name;
  for (const [real, generic] of Object.entries(KOL_MAP)) {
    result = result.replace(new RegExp(real, 'g'), generic);
  }
  return result;
}

function inferAudienceType(name) {
  for (const rule of AUDIENCE_RULES) {
    if (rule.pattern.test(name)) return rule.type;
  }
  return '其他';
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

function main() {
  // 1. 讀 Claude Code dump 的原始資料
  if (!fs.existsSync(PATHS.rawInput)) {
    console.error('❌ Raw input not found:', PATHS.rawInput);
    console.error('   請先讓 Claude Code 呼叫 mcp__meta-ads__ads_get_ad_entities');
    console.error('   並把回傳的 ad_entities JSON 寫進該檔案');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(PATHS.rawInput, 'utf8'));
  const adsEntitiesRaw = typeof raw.ad_entities === 'string'
    ? JSON.parse(raw.ad_entities)
    : raw.ad_entities;

  console.log(`📥 Read ${adsEntitiesRaw.length} adsets from raw input`);
  console.log(`   Total in account: ${raw.summary?.total_count || 'N/A'}`);

  // 2. 過濾出有花費的 adsets + 解析數字
  const parsed = adsEntitiesRaw
    .map((e) => ({
      id: e.id,
      name: e.name,
      spend: parseMetaNumber(e.amount_spent),
      impressions: parseMetaNumber(e.impressions),
      clicks: parseMetaNumber(e.clicks),
      ctr: parseMetaNumber(e.ctr),
      cpm: parseMetaNumber(e.cpm),
      roas: parseMetaNumber(e.purchase_roas),
    }))
    .filter((e) => e.spend != null && e.spend > 0);

  console.log(`   Active (spend > 0): ${parsed.length}`);

  const withRoas = parsed.filter((e) => e.roas != null);
  console.log(`   Valid ROAS: ${withRoas.length}`);
  console.log(`   N/A ROAS:   ${parsed.length - withRoas.length}`);

  // 3. Top N by ROAS（本地排序，因 API 不支援）
  const top = [...withRoas].sort((a, b) => b.roas - a.roas).slice(0, TOP_N);

  const topAdSets = top.map((row, i) => ({
    rank: i + 1,
    name: genericizeKOLNames(row.name),
    campaign: '(by adset query — campaign info needs separate call)',
    audience: inferAudienceType(row.name),
    roas: row.roas,
    spend: a(row.spend),
    impressions: a(row.impressions),
    clicks: a(row.clicks),
    ctr: row.ctr,
    cpm: a(row.cpm),
    conversions: a(Math.round((row.spend * row.roas) / 1000)),
  }));

  // 4. 紅旗（高花費 + 低 ROAS）
  const redFlags = parsed
    .filter((e) => e.roas != null && e.roas < ROAS_RED_FLAG_THRESHOLD && e.spend >= SPEND_RED_FLAG_THRESHOLD)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 3)
    .map((row) => ({
      adSet: genericizeKOLNames(row.name),
      campaign: '(待對應 campaign master)',
      spend: a(row.spend),
      roas: row.roas,
      ctr: row.ctr,
      issue: `花費 NT$${a(row.spend).toLocaleString()} / ROAS ${row.roas} / CTR ${row.ctr}%`,
      action: '⛔ 立刻暫停，預算移轉到 Top 5 已購買名單 RT 組',
      severity: 'critical',
    }));

  // 5. 受眾分布
  const audGroups = {};
  for (const e of parsed) {
    const type = inferAudienceType(e.name);
    if (!audGroups[type]) audGroups[type] = { count: 0, totalSpend: 0, roasSum: 0, roasCount: 0 };
    audGroups[type].count++;
    audGroups[type].totalSpend += e.spend;
    if (e.roas != null) {
      audGroups[type].roasSum += e.roas;
      audGroups[type].roasCount++;
    }
  }
  const audienceBreakdown = Object.entries(audGroups).map(([type, g]) => ({
    type,
    count: g.count,
    totalSpend: a(Math.round(g.totalSpend)),
    avgRoas: g.roasCount > 0 ? +(g.roasSum / g.roasCount).toFixed(2) : null,
    note: g.roasCount === 0 ? '全部 ROAS 不可用 — 歸因檢視' : `${g.roasCount}/${g.count} 有 ROAS`,
  }));

  // 6. 整體 KPI
  const totalSpend = parsed.reduce((sum, e) => sum + e.spend, 0);
  const totalImpressions = parsed.reduce((sum, e) => sum + (e.impressions || 0), 0);
  const totalClicks = parsed.reduce((sum, e) => sum + (e.clicks || 0), 0);
  const weightedRoas = withRoas.length > 0
    ? +(withRoas.reduce((sum, e) => sum + (e.roas * e.spend), 0) / withRoas.reduce((sum, e) => sum + e.spend, 0)).toFixed(2)
    : null;

  // 7. 寫進 snapshot
  const snap = JSON.parse(fs.readFileSync(PATHS.snapshot, 'utf8'));
  snap.adsMeta = {
    source: {
      method: 'Meta Ads MCP via Claude Code (direct call)',
      mcpUrl: 'https://mcp.facebook.com/ads',
      pulledAt: new Date().toISOString(),
      adAccount: 'act_REDACTED',
      note: `Demo Only — anonymization factor ${ANONYMIZATION_FACTOR} + KOL 名稱 generic 化`,
      workflow: '1. mcp__meta-ads__ads_get_field_context (verify fields) → 2. ads_get_ad_entities (level=adset) → 3. sync-meta-snapshot.cjs',
    },
    kpi: {
      spend: a(Math.round(totalSpend)),
      impressions: a(Math.round(totalImpressions)),
      clicks: a(Math.round(totalClicks)),
      ctr: totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : null,
      cpm: totalImpressions > 0 ? a(Math.round((totalSpend / totalImpressions) * 1000)) : null,
      cpc: totalClicks > 0 ? a(Math.round(totalSpend / totalClicks)) : null,
      roas: weightedRoas,
      conversions: a(Math.round((totalSpend * (weightedRoas || 0)) / 1000)),
      period: 'last_7d',
    },
    topAdSets,
    audienceBreakdown,
    redFlags,
    insight: {
      summary: `近期 ${parsed.length} 個 active adsets，${withRoas.length} 個有 ROAS，${parsed.length - withRoas.length} 個歸因不可用。Top ${TOP_N} 由 ${topAdSets[0]?.audience || '未知'} 主導（ROAS ${topAdSets[0]?.roas}x）。`,
      traceTo: [],
      actionItems: redFlags.map((f) => ({ text: `⛔ ${f.action.replace('⛔ ', '')}（${f.adSet.slice(0, 30)}...）`, linkedAd: null })),
    },
    namingConvention: snap.adsMeta?.namingConvention || null, // 保留原 namingConvention
  };

  fs.writeFileSync(PATHS.snapshot, JSON.stringify(snap, null, 2));
  console.log('✅ Snapshot updated:', PATHS.snapshot);
  console.log(`   Top adset: ${topAdSets[0]?.name} (ROAS ${topAdSets[0]?.roas}x)`);
  console.log(`   Red flags: ${redFlags.length}`);
  console.log(`   Anonymized total spend: NT$${snap.adsMeta.kpi.spend.toLocaleString()}`);
  console.log('');
  console.log('Next: npm run build && npm run deploy');
}

main();
