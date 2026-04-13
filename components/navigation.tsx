'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  AlertTriangle, 
  MapPin, 
  Bell, 
  Activity,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    href: '/', 
    icon: AlertTriangle, 
    label: { en: 'Report', bn: 'রিপোর্ট' } 
  },
  { 
    href: '/dashboard', 
    icon: MapPin, 
    label: { en: 'Map', bn: 'মানচিত্র' } 
  },
  { 
    href: '/alerts', 
    icon: Bell, 
    label: { en: 'Alerts', bn: 'সতর্কতা' } 
  },
  { 
    href: '/feed', 
    icon: Activity, 
    label: { en: 'Feed', bn: 'ফিড' } 
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { language, alerts } = useStore();
  const activeAlerts = alerts.filter(a => a.isActive && a.severity === 'critical').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-pb">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-1 py-2 sm:px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === '/alerts' && activeAlerts > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-all duration-200 sm:gap-1 sm:rounded-xl sm:px-3 sm:py-2",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", isActive && "scale-110")} />
                {showBadge && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-critical-foreground">
                    {activeAlerts}
                  </span>
                )}
              </div>
              <span className="max-w-full truncate text-[10px] font-medium sm:text-xs">
                {item.label[language]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Header() {
  const { isOnline, pendingIncidents, language } = useStore();
  const pendingCount = pendingIncidents.length;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg safe-area-pt">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary sm:h-10 sm:w-10">
            <Radio className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight sm:text-lg">CGSN</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {language === 'en' ? 'Cyclone Ground Signal Network' : 'ঘূর্ণিঝড় গ্রাউন্ড সিগন্যাল নেটওয়ার্ক'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          {!isOnline && (
            <div className="flex items-center gap-1.5 rounded-lg bg-warning/20 px-2 py-1 text-warning sm:gap-2 sm:px-3 sm:py-1.5">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-warning" />
              <span className="text-[10px] font-medium sm:text-xs">
                {language === 'en' ? 'Offline' : 'অফলাইন'}
              </span>
            </div>
          )}
          {pendingCount > 0 && isOnline && (
            <div className="flex items-center gap-1.5 rounded-lg bg-primary/20 px-2 py-1 text-primary sm:gap-2 sm:px-3 sm:py-1.5">
              <span className="text-[10px] font-medium sm:text-xs">
                {pendingCount} {language === 'en' ? 'pending' : 'অপেক্ষারত'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
