import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';

export default function MoMoDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return <PlatformDetailView data={data?.momoDetail} title="MoMo+" icon={Store} iconColor="red" />;
}
