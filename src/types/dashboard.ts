export interface Snapshot {
  _meta: {
    generatedAt: string;
    currency: string;
    anonymizationFactor: number;
    note: string;
    dateRange: { start: string; end: string };
  };
  kpi: {
    monthlyGmv: { value: number; currency: string; target: number; achievement: number };
    ytdGmv: { value: number; target: number; achievement: number };
    monthlyOrders: number;
    roas: number;
    adSpend: number;
  };
  alerts: Alert[];
  channels: Channel[];
  funnel: Funnel;
  categories: Category[];
  ads: { meta: AdsMeta };
  agenda: string[];
  todayActions: TodayAction[];
}

export interface Alert {
  id: string;
  level: 'red' | 'yellow' | 'green';
  title: string;
  platform: 'shopline' | 'shopee' | 'momo' | 'shopee-direct';
  tag: string;
  metric: {
    name: string;
    current: number;
    previous?: number;
    target?: number;
    deltaPct?: number;
  };
}

export interface Channel {
  id: 'shopline' | 'shopee' | 'momo';
  label: string;
  icon: string;
  monthlyGmv: number;
  achievement: number;
  yearlyGmv: number;
  roas: number;
  orders: number;
  ytdShare: number;
  characteristic: string;
  recommendation: string;
}

export interface Funnel {
  platform: string;
  stages: { key: string; label: string; value: number; rate: number | null }[];
  benchmarks: {
    addToCartRate: { yellow: number; red: number };
    purchaseRate: { yellow: number; red: number };
  };
}

export interface Category {
  name: string;
  shopline: number;
  shopee: number;
  momo: number;
  trend: 'up' | 'down' | 'flat';
  summary: string;
}

export interface AdsMeta {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
  reach: number;
}

export interface TodayAction {
  owner: string;
  status: string;
  task: string;
}

export interface AiInsight {
  interpretation: string;
  actions: string[];
  escalation: string;
}

export interface MockInsightsFile {
  _meta: { generatedAt: string; model: string; note: string };
  byAlertId: Record<string, { variants: AiInsight[] }>;
}
