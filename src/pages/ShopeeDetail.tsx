import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { PlatformDetailView } from '@/components/dashboard/PlatformDetailView';

export default function ShopeeDetail() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { getSnapshot().then(setData); }, []);
  return <PlatformDetailView data={data?.shopeeDetail} title="蝦皮旗艦" icon={ShoppingBag} iconColor="orange" />;
}
