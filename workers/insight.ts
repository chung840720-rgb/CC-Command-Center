// ============================================================
// Cloudflare Worker — POST /insight
// 收 alert 上下文 → 套 ecommerce-pm + daily-report skill prompt
//                 → 呼叫 Claude Haiku 4.5 → 回 JSON
// ============================================================
//
// Deploy:
//   wrangler secret put ANTHROPIC_API_KEY   # 一次性，把 key 存進 Cloudflare 內
//   wrangler dev                            # 本地 localhost:8787（V2 開發用）
//   wrangler deploy                          # 真正 push 到 *.workers.dev（V2 之後）
//
// Frontend call:
//   const r = await fetch(WORKER_URL + "/insight", {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify({ alert, snapshot }),
//   });

export interface Env {
  ANTHROPIC_API_KEY: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SYSTEM_PROMPT = `你是 DEMO 電商戰情中心的 AI 分析師，個性精準、不廢話。
品牌脈絡：
- 母嬰清潔品牌，TA 為 25-40 歲已婚女性 / 媽媽家庭
- 4 平台分工：官網（信任重度，月 ~65 萬，主推 VIP）/ 蝦皮商城（多品類，月 ~30 萬）/ MOMO（站內流量）/ 蝦皮直營（防禦控制，閒置不分析）
- 2025 YOY +24%（蝦皮升級商城旗艦店 +117% 為主驅動）

業務脈絡防呆（重要 — 不要把這些當異常）：
- 蝦皮直營戰略卡位，業績波動皆為常態
- MOMO 非大檔期 $10-15K/日 為常態
- 蝦皮商城 618 預熱期廣告 +30-50% 為策略執行
- 官網 CRM 私域活動（三三補貨日 / VIP 私訊 / 流失客喚回）為 GMV 主驅動

請以「**問題 → 結果 → 下一步**」3 段式回答，遵守：
1. 解讀 1 句話（含 1-2 個關鍵數字）
2. 行動 3 條（具體可執行）
3. 升級判斷 1 句話（什麼狀況要請笙闆裁示）

語氣中文、精準、不訴苦不請功。回 JSON 純物件，不要 markdown 或 code fence。`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response("Bad JSON", { status: 400, headers: CORS });
    }

    const { alert, snapshot } = body || {};
    if (!alert) {
      return new Response("Missing 'alert' in body", { status: 400, headers: CORS });
    }

    const userPrompt = `今日異常：
平台：${alert.platform}
標題：${alert.title}
指標：${JSON.stringify(alert.metric)}
標籤：${alert.tag}

dashboard 相關數據（30 天）：
${JSON.stringify(snapshot?.channels || [], null, 2)}

請給：
{
  "interpretation": "1 句話解讀（含關鍵數字）",
  "actions": ["行動 1", "行動 2", "行動 3"],
  "escalation": "升級判斷 1 句話"
}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(
        JSON.stringify({ error: "anthropic_call_failed", status: anthropicRes.status, detail: errText.slice(0, 500) }),
        { status: 502, headers: { ...CORS, "content-type": "application/json" } }
      );
    }

    const data = await anthropicRes.json();
    const rawText: string = data?.content?.[0]?.text ?? "";

    let parsed: any = null;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { interpretation: rawText, actions: [], escalation: "" };
    }

    return new Response(
      JSON.stringify({
        ok: true,
        usage: data?.usage,
        result: parsed,
      }),
      { headers: { ...CORS, "content-type": "application/json" } }
    );
  },
};
