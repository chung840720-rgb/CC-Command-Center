import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';
import { SopBadge } from '@/components/dashboard/SopBadge';

export default function MoMoDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return (
    <div className="space-y-4">
      <SopBadge skills={[{ name: 'momo-api.md', version: 'v1.1' }]} />
      <PlatformDetailView
        data={data?.momoDetail}
        monthlyData={data?.monthlyByPlatform?.momo}
        title="MoMo+" icon={Store} iconColor="red"
      />
    </div>
  );
}
