import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';
import { SopBadge } from '@/components/dashboard/SopBadge';

export default function ShopeeDirectDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return (
    <div className="space-y-4">
      <SopBadge skills={[
        { name: '蝦皮通路戰略.md', version: 'v1.0' },
        { name: '蝦皮直營分類規格.md', version: 'v1.0' },
        { name: 'shopee-api.md', version: 'v1.1' },
      ]} />
      <PlatformDetailView data={data?.shopeeDirectDetail} title="蝦皮直營" icon={Target} iconColor="violet" />
    </div>
  );
}
