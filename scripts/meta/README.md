# Meta Ads MCP → Dashboard Sync

對應 SOP：`淨淨工作區/skills/meta-ads-mcp.md` v1.1

---

## 🚀 一句 prompt 跑完整個流程

對 Claude Code 講：

```
用 mcp__meta-ads__ads_get_ad_entities 拉淨淨 act_1322065504565230 近 7 天的
adset 數據（fields: id, name, amount_spent, impressions, clicks, ctr, cpm,
purchase_roas, limit: 200），把回傳的整個 JSON object 寫進
scripts/meta/raw-meta-entities.json，然後跑 `node scripts/meta/sync-meta-snapshot.cjs`，
最後 `npm run build && npm run deploy`。
```

Claude Code 會：
1. 呼叫 MCP tool 拉真實資料
2. 把 `{ ad_entities: [...], summary: {...} }` JSON 寫進 `raw-meta-entities.json`
3. 跑 `sync-meta-snapshot.cjs`：解析 → 脫敏 → 寫 snapshot
4. `npm run build && npm run deploy` → GH Pages 自動更新

---

## 📦 檔案說明

| 檔案 | 用途 | 是否可 commit |
|---|---|---|
| `sync-meta-snapshot.cjs` | 主腳本 — 處理脫敏 + 寫 snapshot | ✅ 公開 |
| `raw-meta-entities.json` | 暫存 MCP 拉到的原始 JSON | ❌ **.gitignore**（含真實 BM 資料）|
| `README.md` | 本文件 | ✅ 公開 |

⚠️ `raw-meta-entities.json` 是中介檔，**絕對不能推上 git**（含未脫敏真實業績）。
跑完 `sync-meta-snapshot.cjs` 後可手動 delete。

---

## 🔧 換新公司用法

只需改 `sync-meta-snapshot.cjs` 上方 CONFIG 段：

```javascript
const ANONYMIZATION_FACTOR = 0.82;   // 想揭露多少絕對值（0.6~1.0）
const KOL_MAP = {                     // 新公司的 KOL 名稱對應
  '陳道明': 'KOL-A',
  '蔡阿嘎': 'KOL-B',
  // ...
};
```

然後改 prompt 內的 ad account ID（`act_XXXXX`）即可。

---

## 🧪 本地測試

如要不依賴 MCP 跑測試：

1. 手動準備 `raw-meta-entities.json`（仿真結構，見下方 example）
2. `node scripts/meta/sync-meta-snapshot.cjs`
3. 檢查 `public/data/snapshot.json` 的 `adsMeta` 區塊有更新

### Example raw-meta-entities.json 結構
```json
{
  "ad_entities": [
    {
      "id": "120246626676840610",
      "name": "(KOL-A)洗衣精_影片10秒_排：已購買洗衣精",
      "amount_spent": "NT$7,936 TWD",
      "impressions": "27,618",
      "clicks": "812",
      "ctr": "2.94%",
      "cpm": "NT$287 TWD",
      "purchase_roas": "4.60"
    }
  ],
  "summary": { "total_count": 2762 }
}
```

---

## 🛡 安全

- `raw-meta-entities.json` 加進 `.gitignore` 防誤推
- 跑完即刪（不留中介檔）
- Snapshot 最終是脫敏版本（factor 0.82 + KOL generic 化），可安全 commit + deploy
