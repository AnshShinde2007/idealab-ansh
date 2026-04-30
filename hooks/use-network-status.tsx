'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function useNetworkStatus() {
  const { isOnline, setIsOnline, syncPendingIncidents, pendingIncidents } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      toast.success('Back online', {
        description: 'Connection restored. Syncing pending data...',
        icon: <Wifi className="h-4 w-4" />,
      });

      // Sync pending incidents when coming back online
      if (pendingIncidents.length > 0) {
        setIsSyncing(true);
        try {
          await syncPendingIncidents();
          toast.success('Sync complete', {
            description: `${pendingIncidents.length} reports successfully synchronized.`,
          });
        } catch (error) {
          toast.error('Sync failed', {
            description: 'Could not sync some reports. Will retry later.',
          });
        } finally {
          setIsSyncing(false);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline', {
        description: 'Reports will be saved and synced when you reconnect.',
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, syncPendingIncidents, pendingIncidents.length]);

  return { isOnline, isSyncing };
}

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const { isOnline, isSyncing } = useNetworkStatus();
  
  return (
    <>
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center bg-primary/90 py-1 text-[10px] font-bold text-white uppercase tracking-widest animate-in fade-in slide-in-from-top duration-300">
          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
          Synchronizing Emergency Data
        </div>
      )}
      {children}
    </>
  );
}

