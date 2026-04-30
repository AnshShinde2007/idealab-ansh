'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useMounted } from '@/hooks/use-mounted';
import { 
  AlertTriangle, 
  MapPin, 
  Bell, 
  Activity,
  Radio,
  WifiOff,
  RefreshCw,
  Zap
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
  const mounted = useMounted();
  const { language, alerts } = useStore();
  const activeAlerts = alerts.filter(a => a.isActive && a.severity === 'critical').length;

  if (!mounted) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-area-pb">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 py-3 sm:px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === '/alerts' && activeAlerts > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-2xl px-1 py-1 transition-all duration-500",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <div className="relative group">
                {isActive && (
                  <div className="absolute inset-0 -z-10 blur-xl bg-primary/30 rounded-full scale-150 animate-pulse" />
                )}
                <Icon className={cn(
                  "h-6 w-6 transition-all duration-500", 
                  isActive ? "stroke-[2.5px] scale-110" : "group-hover:scale-110"
                )} />
                
                {showBadge && (
                  <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-critical text-[9px] font-black text-white shadow-lg shadow-critical/40 border-2 border-background animate-in zoom-in duration-300">
                    {activeAlerts}
                  </span>
                )}
              </div>
              <span className={cn(
                "max-w-full truncate text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-0.5"
              )}>
                {item.label[language]}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="h-1 w-1 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(var(--primary),0.5)]" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Header() {
  const { isOnline, pendingIncidents, language, alerts } = useStore();
  const mounted = useMounted();
  const pendingCount = pendingIncidents.length;
  const criticalCount = alerts.filter(a => a.isActive && a.severity === 'critical').length;

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10 safe-area-pt">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-700",
              criticalCount > 0 
                ? "bg-critical shadow-[0_0_20px_rgba(var(--critical),0.4)] animate-pulse" 
                : "bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/20"
            )}>
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-background">
              <div className={cn("h-2 w-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">CGSN</h1>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                 <Zap className={cn("h-3 w-3 animate-pulse", criticalCount > 0 ? "text-critical" : "text-primary")} />
                 <span className={cn("text-[7px] font-black uppercase tracking-widest", criticalCount > 0 ? "text-critical" : "text-primary")}>
                    {criticalCount > 0 ? 'Threat Detected' : 'Signal Stable'}
                 </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("h-1 w-1 rounded-full animate-pulse", isOnline ? "bg-emerald-500" : "bg-amber-500")} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
                {language === 'en' ? 'Signal Active' : 'সংকেত সক্রিয়'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
             <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 border-critical/20 animate-pulse">
                <AlertTriangle className="h-3 w-3 text-critical" />
                <span className="text-[9px] font-black uppercase tracking-widest text-critical">DEFCON 1</span>
             </div>
          )}
          {!isOnline && (
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-1.5 border-amber-500/20">
              <WifiOff className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                {language === 'en' ? 'Offline' : 'অফলাইন'}
              </span>
            </div>
          )}
          {pendingCount > 0 && isOnline && (
            <div className="bg-primary/20 flex items-center gap-2 rounded-xl px-3 py-1.5 border border-primary/20">
              <RefreshCw className="h-3 w-3 text-primary animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                {pendingCount} Syncing
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


