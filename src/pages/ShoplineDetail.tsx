import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';
import { SopBadge } from '@/components/dashboard/SopBadge';

export default function ShoplineDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return (
    <div className="space-y-4">
      <SopBadge skills={[{ name: 'shopline-api.md', version: 'v2.5' }]} />
      <PlatformDetailView data={data?.shoplineDetail} title="官網 Shopline" icon={Globe} iconColor="amber" />
    </div>
  );
}
