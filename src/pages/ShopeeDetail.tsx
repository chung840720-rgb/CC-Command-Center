import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';
import { SopBadge } from '@/components/dashboard/SopBadge';

export default function ShopeeDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return (
    <div className="space-y-4">
      <SopBadge skills={[
        { name: 'shopee-api.md', version: 'v1.1' },
        { name: '蝦皮通路戰略.md', version: 'v1.0' },
      ]} />
      <PlatformDetailView
        data={data?.shopeeDetail}
        monthlyData={data?.monthlyByPlatform?.shopee}
        title="蝦皮旗艦" icon={ShoppingBag} iconColor="orange"
      />
    </div>
  );
}
