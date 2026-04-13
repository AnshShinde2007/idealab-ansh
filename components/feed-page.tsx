'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
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
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Severity, IncidentType } from '@/lib/types';

const severityColors: Record<Severity, string> = {
  critical: 'bg-critical/20 text-critical border-critical/30',
  moderate: 'bg-warning/20 text-warning border-warning/30',
  safe: 'bg-safe/20 text-safe border-safe/30',
};

const severityIconColors: Record<Severity, string> = {
  critical: 'text-critical',
  moderate: 'text-warning',
  safe: 'text-safe',
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
  const [filter, setFilter] = useState<ActivityType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    return activities.filter(a => a.type === filter);
  }, [activities, filter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return language === 'en' ? 'Just now' : 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)} ${language === 'en' ? 'min ago' : 'মিনিট আগে'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${language === 'en' ? 'hours ago' : 'ঘণ্টা আগে'}`;
    return `${Math.floor(diff / 86400)} ${language === 'en' ? 'days ago' : 'দিন আগে'}`;
  };

  const getActivityIcon = (type: string, title: string) => {
    if (type === 'alert') return AlertTriangle;
    if (type === 'announcement') return Megaphone;
    
    // Try to match incident type from title
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('flood')) return Droplets;
    if (lowerTitle.includes('power')) return Zap;
    if (lowerTitle.includes('tree') || lowerTitle.includes('road')) return TreeDeciduous;
    if (lowerTitle.includes('wind')) return Wind;
    
    return Bell;
  };

  // Stats
  const stats = useMemo(() => {
    const lastHour = Date.now() - 60 * 60 * 1000;
    return {
      totalIncidents: incidents.length,
      lastHourIncidents: incidents.filter(i => new Date(i.timestamp).getTime() > lastHour).length,
      criticalActive: incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
    };
  }, [incidents]);

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-3 sm:pt-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 px-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold sm:text-2xl">
            {language === 'en' ? 'Activity Feed' : 'কার্যকলাপ ফিড'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Real-time updates from the field' 
              : 'মাঠ থেকে রিয়েল-টাইম আপডেট'}
          </p>
        </div>
        <div className="shrink-0 self-end sm:self-auto">
          <LanguageToggle />
        </div>
      </div>

      {/* Live Stats Banner */}
      <div className="mx-3 mb-6 grid grid-cols-3 gap-2 sm:mx-4 sm:gap-3">
        <Card className="p-3 text-center sm:p-4">
          <p className="text-2xl font-bold text-primary sm:text-3xl">{stats.totalIncidents}</p>
          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
            {language === 'en' ? 'Total Reports' : 'মোট রিপোর্ট'}
          </p>
        </Card>
        <Card className="p-3 text-center sm:p-4">
          <p className="text-2xl font-bold text-warning sm:text-3xl">{stats.lastHourIncidents}</p>
          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
            {language === 'en' ? 'Last Hour' : 'শেষ ঘন্টা'}
          </p>
        </Card>
        <Card className="p-3 text-center sm:p-4">
          <p className="text-2xl font-bold text-critical sm:text-3xl">{stats.criticalActive}</p>
          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
            {language === 'en' ? 'Critical' : 'জটিল'}
          </p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto px-3 pb-1 sm:px-4">
        {[
          { id: 'all', label: { en: 'All', bn: 'সব' } },
          { id: 'incident', label: { en: 'Incidents', bn: 'ঘটনা' } },
          { id: 'alert', label: { en: 'Alerts', bn: 'সতর্কতা' } },
          { id: 'announcement', label: { en: 'Updates', bn: 'আপডেট' } },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.id as ActivityType)}
            className="shrink-0"
          >
            {tab.label[language]}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className={cn("ml-auto shrink-0", isRefreshing && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4 px-3 sm:px-4">
        {filteredActivities.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <Filter className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'No activities found' : 'কোনো কার্যকলাপ পাওয়া যায়নি'}
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
                  "relative overflow-hidden border-l-4 transition-all duration-300",
                  activity.severity ? severityColors[activity.severity].split(' ')[2] : "border-primary/30",
                  isNew && "animate-in slide-in-from-top-2"
                )}
              >
                {/* New indicator */}
                {isNew && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {language === 'en' ? 'NEW' : 'নতুন'}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      activity.severity 
                        ? severityColors[activity.severity].split(' ').slice(0, 2).join(' ')
                        : "bg-primary/20 text-primary"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-medium",
                          activity.type === 'alert' && "bg-critical/20 text-critical",
                          activity.type === 'incident' && "bg-warning/20 text-warning",
                          activity.type === 'announcement' && "bg-primary/20 text-primary"
                        )}>
                          {activity.type === 'alert' && (language === 'en' ? 'ALERT' : 'সতর্কতা')}
                          {activity.type === 'incident' && (language === 'en' ? 'INCIDENT' : 'ঘটনা')}
                          {activity.type === 'announcement' && (language === 'en' ? 'UPDATE' : 'আপডেট')}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>

                      <h4 className="mb-1 font-bold leading-tight">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>

                      {/* Location if available */}
                      {activity.location && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {activity.location.lat.toFixed(4)}, {activity.location.lng.toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Severity bar at bottom for critical/moderate items */}
                {activity.severity && activity.severity !== 'safe' && (
                  <div className={cn(
                    "h-1",
                    activity.severity === 'critical' && "bg-critical",
                    activity.severity === 'moderate' && "bg-warning"
                  )} />
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="mt-6 px-3 sm:px-4">
          <Button variant="outline" className="w-full">
            {language === 'en' ? 'Load More' : 'আরও লোড করুন'}
          </Button>
        </div>
      )}
    </div>
  );
}
