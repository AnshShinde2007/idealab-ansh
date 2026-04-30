'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
import { useMounted } from '@/hooks/use-mounted';
import { 
  AlertTriangle,
  Bell,
  Megaphone,
  MapPin,
  Clock,
  RefreshCw,
  Droplets,
  Zap,
  TreeDeciduous,
  Wind,
  Filter,
  Activity,
  Signal,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Severity, IncidentType } from '@/lib/types';

const severityColors: Record<Severity, string> = {
  critical: 'bg-critical/20 text-critical border-critical/30',
  moderate: 'bg-warning/20 text-warning border-warning/30',
  safe: 'bg-safe/20 text-safe border-safe/30',
};

const typeIcons: Record<IncidentType, typeof Droplets> = {
  flooding: Droplets,
  power_outage: Zap,
  tree_fall: TreeDeciduous,
  strong_winds: Wind,
};

type ActivityType = 'all' | 'incident' | 'alert' | 'announcement';

export function FeedPage() {
  const { language, activities, incidents } = useStore();
  const mounted = useMounted();
  const [filter, setFilter] = useState<ActivityType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter(a => a.type === filter);
  }, [activities, filter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return language === 'en' ? 'JUST NOW' : 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
    return `${Math.floor(diff / 86400)}D AGO`;
  };

  const getActivityIcon = (type: string, title: string) => {
    if (type === 'alert') return AlertTriangle;
    if (type === 'announcement') return Megaphone;
    
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('flood')) return Droplets;
    if (lowerTitle.includes('power')) return Zap;
    if (lowerTitle.includes('tree') || lowerTitle.includes('road')) return TreeDeciduous;
    if (lowerTitle.includes('wind')) return Wind;
    
    return Bell;
  };

  const stats = useMemo(() => {
    const lastHour = Date.now() - 60 * 60 * 1000;
    return {
      totalIncidents: incidents.length,
      lastHourIncidents: incidents.filter(i => new Date(i.timestamp).getTime() > lastHour).length,
      criticalActive: incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
    };
  }, [incidents]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen pb-[calc(10rem+env(safe-area-inset-bottom,0px))] pt-3 sm:pt-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -z-10 h-64 w-64 bg-primary/5 blur-[100px] rounded-full" />
      <div className="scan-line" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-3 sm:px-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Signal className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Live Network
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {language === 'en' ? 'Activity' : 'কার্যকলাপ'} <span className="text-primary">{language === 'en' ? 'Feed' : 'ফিড'}</span>
          </h2>
        </div>
        <LanguageToggle />
      </div>

      {/* Live Stats Banner */}
      <div className="mx-3 mb-8 grid grid-cols-3 gap-3 sm:mx-4">
        {[
          { label: 'Total Signal', value: stats.totalIncidents, color: 'text-primary' },
          { label: '60m Delta', value: stats.lastHourIncidents, color: 'text-warning' },
          { label: 'Threats', value: stats.criticalActive, color: 'text-critical' },
        ].map((stat, i) => (
          <Card key={i} className="glass border-white/5 p-4 flex flex-col items-center justify-center text-center shadow-xl">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</span>
            <p className={cn("text-2xl font-black tracking-tighter sm:text-3xl", stat.color)}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto px-3 pb-2 sm:px-4 scrollbar-hide">
        {[
          { id: 'all', label: { en: 'ALL', bn: 'সব' } },
          { id: 'incident', label: { en: 'INCIDENTS', bn: 'ঘটনা' } },
          { id: 'alert', label: { en: 'ALERTS', bn: 'সতর্কতা' } },
          { id: 'announcement', label: { en: 'UPDATES', bn: 'আপডেট' } },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.id as ActivityType)}
            className={cn(
              "shrink-0 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              filter === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass border-white/5 text-muted-foreground"
            )}
          >
            {tab.label[language]}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className={cn("ml-auto shrink-0 glass h-10 w-10 rounded-xl border-white/5", isRefreshing && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4 px-3 sm:px-4">
        {filteredActivities.length === 0 ? (
          <Card className="glass flex flex-col items-center justify-center p-12 text-center border-white/5">
            <Filter className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {language === 'en' ? 'No telemetry found' : 'কোনো তথ্য পাওয়া যায়নি'}
            </p>
          </Card>
        ) : (
          filteredActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type, activity.title);
            const isNew = index < 3;

            return (
              <Card 
                key={activity.id} 
                className={cn(
                  "glass group relative overflow-hidden border-0 p-5 shadow-xl transition-all duration-500",
                  isNew && "animate-in slide-in-from-right-4 duration-500"
                )}
              >
                {/* Severity vertical bar */}
                <div className={cn(
                  "absolute top-0 bottom-0 left-0 w-1.5 opacity-60",
                  activity.severity === 'critical' && "bg-critical",
                  activity.severity === 'moderate' && "bg-warning",
                  !activity.severity && "bg-primary"
                )} />

                <div className="flex gap-5">
                  {/* Icon with background */}
                  <div className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner",
                    activity.severity === 'critical' ? "bg-critical/20 text-critical" :
                    activity.severity === 'moderate' ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className={cn(
                            "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border",
                            activity.type === 'alert' && "bg-critical/10 text-critical border-critical/20",
                            activity.type === 'incident' && "bg-warning/10 text-warning border-warning/20",
                            activity.type === 'announcement' && "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {activity.type}
                          </span>
                       </div>
                       <span className="text-[10px] font-black text-muted-foreground/60 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>

                    <h4 className="text-lg font-black tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">{activity.title}</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 mb-4">{activity.description}</p>

                    <div className="flex items-center justify-between">
                       {activity.location ? (
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{activity.location.lat.toFixed(4)}, {activity.location.lng.toFixed(4)}</span>
                          </div>
                        ) : <div />}
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg glass border-white/5 text-[9px] font-black uppercase tracking-widest gap-2">
                           View Details <ArrowUpRight className="h-3 w-3" />
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="mt-10 px-3 sm:px-4">
          <Button variant="ghost" className="w-full h-14 rounded-2xl glass border-white/5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
            {language === 'en' ? 'Sync More Records' : 'আরও রেকর্ড সিঙ্ক করুন'}
          </Button>
        </div>
      )}
    </div>
  );
}

