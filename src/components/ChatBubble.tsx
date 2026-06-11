import { useState } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STARTER_QUESTIONS = [
  '昨天官網有什麼異常嗎？',
  '本月哪個品類成長最快？',
  'MOMO ROAS 為什麼這麼高？',
  '618 預熱期該怎麼配預算？',
];

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBubble() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');

  function handleSend(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: 'user', content: text },
      {
        role: 'assistant',
        content:
          '💡 此功能為 V2 真實 LLM 串接預覽。Cloudflare Workers + Claude API 程式碼已實作於 `workers/insight.ts` 與 `workers/chat.ts`，待 Anthropic 加值通過後啟用即可。',
      },
    ]);
    setInput('');
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <SheetTitle className="flex items-center gap-2">
              戰情 AI 助理
              <Badge variant="secondary" className="text-[10px] font-normal">V2 Preview</Badge>
            </SheetTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            問我關於 4 平台業績、異常、品類、廣告效率的任何問題。
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">💬 試試這些問題：</p>
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-accent/40 hover:bg-accent border border-border/40 hover:border-primary/30 transition-colors text-sm font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="問問題..."
            className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            size="icon"
            onClick={() => handleSend(input)}
            className="rounded-full shrink-0"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
