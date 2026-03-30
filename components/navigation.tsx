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
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === '/alerts' && activeAlerts > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
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
              <span className="text-xs font-medium">{item.label[language]}</span>
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
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Radio className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CGSN</h1>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Cyclone Ground Signal Network' : 'ঘূর্ণিঝড় গ্রাউন্ড সিগন্যাল নেটওয়ার্ক'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/20 px-3 py-1.5 text-warning">
              <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
              <span className="text-xs font-medium">
                {language === 'en' ? 'Offline' : 'অফলাইন'}
              </span>
            </div>
          )}
          {pendingCount > 0 && isOnline && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-1.5 text-primary">
              <span className="text-xs font-medium">
                {pendingCount} {language === 'en' ? 'pending' : 'অপেক্ষারত'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
