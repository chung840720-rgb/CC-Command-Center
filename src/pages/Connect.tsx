import { useEffect, useState } from 'react';
import { Settings, CheckCircle2, AlertCircle, Eye, EyeOff, Info, Shield, Save, Zap } from 'lucide-react';
import { getSnapshot } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Connect() {
  const [data, setData] = useState<any>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  useEffect(() => { getSnapshot().then(setData); }, []);
  if (!data) return <Skeleton className="h-96 rounded-2xl" />;

  const ecommerce = data.connect.platforms.filter((p: any) => p.category === '電商平台');
  const analytics = data.connect.platforms.filter((p: any) => p.category === '流量與廣告分析');

  function renderCard(p: any) {
    const connected = p.status === 'connected';
    return (
      <div key={p.id} className="card-soft p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className={cn(
            'text-base font-bold',
            connected ? 'text-primary' : 'text-foreground'
          )}>{p.name}</h3>
          <Badge variant="outline" className={cn(
            'text-xs font-bold gap-1.5 rounded-full',
            connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          )}>
            {connected ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {connected ? '已串接' : '未串接'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{p.description}</p>

        <div className={cn(
          'rounded-xl border p-4 space-y-3 flex-1',
          connected ? 'bg-emerald-50/40 border-emerald-100' : 'bg-secondary/40 border-border'
        )}>
          {p.fields.map((f: any) => (
            <div key={f.label}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{f.label}</span>
                {!connected && f.secret && (
                  <button
                    onClick={() => setShowSecret((s) => ({ ...s, [`${p.id}-${f.label}`]: !s[`${p.id}-${f.label}`] }))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showSecret[`${p.id}-${f.label}`] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              {connected ? (
                <p className="font-mono text-xs mt-0.5">{f.value}</p>
              ) : (
                <input
                  type={f.secret && !showSecret[`${p.id}-${f.label}`] ? 'password' : 'text'}
                  defaultValue={f.secret ? '' : f.value}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-ring"
                />
              )}
              {f.hint && <p className="text-[10px] text-muted-foreground mt-0.5">{f.hint}</p>}
            </div>
          ))}
          {connected && (
            <button className="text-xs text-primary underline-offset-2 hover:underline">重新設定</button>
          )}
        </div>

        {p.warning && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">{p.warning}</p>
          </div>
        )}
        {p.note && (
          <div className="mt-3 rounded-lg bg-secondary/60 border border-border p-3 flex gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{p.note}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          {!connected && (
            <Button size="sm" className="flex-1 rounded-md gap-1.5 bg-orange-500 hover:bg-orange-600">
              <Save className="w-3.5 h-3.5" /> 儲存設定
            </Button>
          )}
          <Button variant="outline" size="sm" className={cn('rounded-md gap-1.5', connected && 'flex-1')}>
            <Zap className="w-3.5 h-3.5" /> 測試連線
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card-soft p-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Settings className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-bold mb-1.5">資料與設定</p>
            <h1 className="text-3xl font-black tracking-tight">串接設定</h1>
            <p className="text-sm text-muted-foreground mt-2">串接後自動同步數據，免手動上傳報表</p>
          </div>
        </div>
      </section>

      <div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3">電商平台</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ecommerce.map(renderCard)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3">流量與廣告分析</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analytics.map(renderCard)}
        </div>
      </div>

      <section className="rounded-2xl bg-secondary/30 border border-border p-5 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold mb-1">安全說明</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            所有 API 憑證均加密儲存於 Cloudflare KV，不會外洩。測試連線會向對應平台發送驗證請求以確認憑證有效。若需重新設定，點選「重新設定」即可覆蓋原有憑證。
          </p>
        </div>
      </section>
    </div>
  );
}
