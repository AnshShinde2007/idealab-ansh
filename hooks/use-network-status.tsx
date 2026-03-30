'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function useNetworkStatus() {
  const { isOnline, setIsOnline, syncPendingIncidents, pendingIncidents } = useStore();

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Sync pending incidents when coming back online
      if (pendingIncidents.length > 0) {
        syncPendingIncidents();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, syncPendingIncidents, pendingIncidents.length]);

  return isOnline;
}

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  useNetworkStatus();
  return <>{children}</>;
}
