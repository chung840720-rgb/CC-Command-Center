import { Navigate } from 'react-router-dom';

// 廣告素材效率已合併到 /ads/meta（廣告效率 — Meta + 素材 整合頁）
// 保留此 route 防止外部連結斷裂
export default function AdsCreatives() {
  return <Navigate to="/ads/meta" replace />;
}
