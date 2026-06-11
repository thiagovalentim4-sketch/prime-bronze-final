import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';
import { WhatsAppButton } from '@/components/public/whatsapp-button';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
