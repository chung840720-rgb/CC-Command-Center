import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { RoadmapPage } from '@/components/RoadmapPage';
import Home from '@/pages/Home';
import Insights from '@/pages/Insights';
import Funnel from '@/pages/Funnel';
import Category from '@/pages/Category';
import Alerts from '@/pages/Alerts';
import SalesBattle from '@/pages/SalesBattle';
import ShoplineDetail from '@/pages/ShoplineDetail';
import ShopeeDetail from '@/pages/ShopeeDetail';
import MoMoDetail from '@/pages/MoMoDetail';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* V1 完整實作 */}
          <Route path="/" element={<Home />} />
          <Route path="/sales-battle" element={<SalesBattle />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/category" element={<Category />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/shopline" element={<ShoplineDetail />} />
          <Route path="/shopee" element={<ShopeeDetail />} />
          <Route path="/momo" element={<MoMoDetail />} />

          {/* Roadmap placeholder */}
          <Route path="/shopee-direct" element={<RoadmapPage name="蝦皮直營詳細" />} />
          <Route path="/campaign" element={<RoadmapPage name="活動規劃" />} />
          <Route path="/products" element={<RoadmapPage name="商品資料" />} />
          <Route path="/upload" element={<RoadmapPage name="上傳報表" />} />
          <Route path="/analytics" element={<RoadmapPage name="GA 分析" />} />
          <Route path="/ads/meta" element={<RoadmapPage name="Meta 廣告" />} />
          <Route path="/ads/google" element={<RoadmapPage name="Google 廣告" />} />
          <Route path="/ads/creatives" element={<RoadmapPage name="廣告素材" />} />
          <Route path="/ads/competitor" element={<RoadmapPage name="競品廣告" />} />
          <Route path="/competitor-web" element={<RoadmapPage name="競品網站" />} />
          <Route path="/log" element={<RoadmapPage name="操作日誌" />} />
          <Route path="/wishpool" element={<RoadmapPage name="願池" />} />
          <Route path="/connect" element={<RoadmapPage name="平台串接" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
