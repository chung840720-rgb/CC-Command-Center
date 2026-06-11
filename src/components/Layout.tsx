import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { ChatBubble } from './ChatBubble';
import { MarqueeBar } from './MarqueeBar';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <MarqueeBar />
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
      <ChatBubble />
      <Toaster richColors position="top-center" />
    </div>
  );
}
