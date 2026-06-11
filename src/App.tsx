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
import AdsCreatives from '@/pages/AdsCreatives';
import Campaign from '@/pages/Campaign';
import Analytics from '@/pages/Analytics';
import Connect from '@/pages/Connect';
import AdsMeta from '@/pages/AdsMeta';
import AdsGoogle from '@/pages/AdsGoogle';
import AdsCompetitor from '@/pages/AdsCompetitor';
import CompetitorWeb from '@/pages/CompetitorWeb';
import Products from '@/pages/Products';
import Upload from '@/pages/Upload';
import Log from '@/pages/Log';
import Wishpool from '@/pages/Wishpool';
import ShopeeDirectDetail from '@/pages/ShopeeDirectDetail';

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

          <Route path="/shopee-direct" element={<ShopeeDirectDetail />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/products" element={<Products />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ads/meta" element={<AdsMeta />} />
          <Route path="/ads/google" element={<AdsGoogle />} />
          <Route path="/ads/creatives" element={<AdsCreatives />} />
          <Route path="/ads/competitor" element={<AdsCompetitor />} />
          <Route path="/competitor-web" element={<CompetitorWeb />} />
          <Route path="/log" element={<Log />} />
          <Route path="/wishpool" element={<Wishpool />} />
          <Route path="/connect" element={<Connect />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
