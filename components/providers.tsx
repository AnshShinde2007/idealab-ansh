'use client';

import { NetworkStatusProvider } from '@/hooks/use-network-status';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NetworkStatusProvider>
      {children}
      <Toaster position="top-center" expand={false} richColors closeButton />
    </NetworkStatusProvider>
  );
}

