import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';

export default function ShopeeDirectDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return <PlatformDetailView data={data?.shopeeDirectDetail} title="蝦皮直營" icon={Target} iconColor="violet" />;
}
