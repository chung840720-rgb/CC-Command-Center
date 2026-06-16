import { useEffect, useState } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, Clock, FileText } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatNumber, cn } from '@/lib/utils';

export default function Upload() {
  const [data, setData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;
  const u = data.uploadPage;

  return (
    <div className="space-y-6">
      <section className="card-soft p-6 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <UploadIcon className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-bold mb-1.5">做行動 · 執行操盤手視角</p>
          <h1 className="text-3xl font-black tracking-tight">上傳報表</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">蝦皮、MoMo、廣告平台的歷史報表手動補入口（已串接 API 則自動同步，本頁面用於補洞）。</p>
        </div>
      </section>

      <section
        className={cn(
          'card-soft p-12 text-center border-2 border-dashed transition-colors cursor-pointer',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          toast.success('Demo 模式 — 拖曳上傳已收到', { description: '生產環境會送進 Cloudflare R2 + 解析 worker' });
        }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold mb-2">拖曳檔案到此處</h2>
        <p className="text-sm text-muted-foreground mb-4">或</p>
        <Button onClick={() => toast.success('Demo 模式', { description: '生產環境會開檔案選擇器' })} className="rounded-full font-semibold">
          選擇檔案
        </Button>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {u.supportedFormats.map((f: string) => (
            <Badge key={f} variant="outline" className="text-[10px] font-normal">{f}</Badge>
          ))}
        </div>
      </section>

      <section className="card-soft p-6 space-y-4">
        <h2 className="text-base font-bold">上傳歷史</h2>
        <div className="space-y-2">
          {u.history.map((h: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{h.filename}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {h.platform}｜{h.uploadedAt}｜{formatNumber(h.rows)} 行
                </p>
              </div>
              <Badge variant="outline" className={cn(
                'text-[10px] font-bold gap-1 shrink-0',
                h.status === '已處理' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              )}>
                {h.status === '已處理' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {h.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
