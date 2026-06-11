import { AlertCircle } from 'lucide-react';

/**
 * 跑馬燈公告欄 — 在 Layout 頂部顯示商業道德 disclaimer
 * CSS animation 從右往左跑
 */
export function MarqueeBar() {
  const text = '本網頁所有數據皆為虛構資料，不包含任何來自實際雇主的商業敏感資料';
  // 重複多次確保連續無縫
  const repeated = Array(6).fill(text);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border-b border-amber-200 overflow-hidden">
      <div className="flex items-center gap-3 py-2">
        <div className="shrink-0 px-4 flex items-center gap-1.5 border-r border-amber-300/60">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">公告</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="marquee-track flex gap-12 whitespace-nowrap">
            {repeated.map((t, i) => (
              <span key={i} className="text-xs font-medium text-amber-900/90 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
