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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-area-pb">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-1 py-3 sm:px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === '/alerts' && activeAlerts > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition-all duration-300 sm:rounded-2xl sm:px-3 sm:py-2",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                {showBadge && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-[9px] font-black text-white shadow-lg shadow-critical/40">
                    {activeAlerts}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary shadow-lg shadow-primary" />
                )}
              </div>
              <span className={cn(
                "max-w-full truncate text-[10px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-60"
              )}>
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
    <header className="sticky top-0 z-40 glass border-b border-white/10 safe-area-pt">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-background">
              <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">CGSN</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
                {language === 'en' ? 'Signal Active' : 'সংকেত সক্রিয়'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-1.5 border-amber-500/20">
              <WifiOff className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                {language === 'en' ? 'Offline' : 'অফলাইন'}
              </span>
            </div>
          )}
          {pendingCount > 0 && isOnline && (
            <div className="bg-indigo-500/20 flex items-center gap-2 rounded-xl px-3 py-1.5 border border-indigo-500/20">
              <RefreshCw className="h-3 w-3 text-indigo-400 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                {pendingCount} Syncing
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function RefreshCw(props: React.ComponentProps<typeof Radio>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

