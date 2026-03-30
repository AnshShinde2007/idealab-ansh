'use client';

import { NetworkStatusProvider } from '@/hooks/use-network-status';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NetworkStatusProvider>
      {children}
    </NetworkStatusProvider>
  );
}
