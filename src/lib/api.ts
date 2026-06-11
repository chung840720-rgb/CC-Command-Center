import type { Snapshot, Alert, AiInsight, MockInsightsFile } from '@/types/dashboard';

const USE_REAL_LLM = import.meta.env.VITE_USE_REAL_LLM === 'true';
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';
const BASE = import.meta.env.BASE_URL;

let _snapshotCache: Snapshot | null = null;
let _insightsCache: MockInsightsFile | null = null;
const _variantCursor: Record<string, number> = {};

export async function getSnapshot(): Promise<Snapshot> {
  if (_snapshotCache) return _snapshotCache;
  const r = await fetch(`${BASE}data/snapshot.json`);
  _snapshotCache = await r.json();
  return _snapshotCache!;
}

async function getMockInsights(): Promise<MockInsightsFile> {
  if (_insightsCache) return _insightsCache;
  const r = await fetch(`${BASE}data/mock-ai-insights.json`);
  _insightsCache = await r.json();
  return _insightsCache!;
}

export async function getInsight(alert: Alert, forceNew = false): Promise<AiInsight> {
  // 假裝 LLM 思考時間（demo 體感更真）
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  if (USE_REAL_LLM) {
    const snapshot = await getSnapshot();
    const res = await fetch(`${WORKER_URL}/insight`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ alert, snapshot }),
    });
    const data = await res.json();
    return data.result;
  }

  // Mock mode — 從預烤 variants 輪流取（forceNew 時切換到下一個）
  const insights = await getMockInsights();
  const variants = insights.byAlertId[alert.id]?.variants || [];
  if (variants.length === 0) {
    return {
      interpretation: '此 alert 尚無預烤回應',
      actions: [],
      escalation: '',
    };
  }
  if (forceNew) {
    _variantCursor[alert.id] = ((_variantCursor[alert.id] ?? 0) + 1) % variants.length;
  } else {
    _variantCursor[alert.id] = _variantCursor[alert.id] ?? 0;
  }
  return variants[_variantCursor[alert.id]];
}

export function isLiveMode(): boolean {
  return USE_REAL_LLM;
}
