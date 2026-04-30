'use client';

import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMounted } from '@/hooks/use-mounted';
import { 
  Droplets, 
  Zap, 
  TreeDeciduous, 
  Wind,
  Filter,
  X,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Circle,
  Activity,
  Radar,
  Crosshair,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IncidentType, Severity, Incident } from '@/lib/types';
import { INCIDENT_LABELS, SEVERITY_LABELS } from '@/lib/types';

const typeIcons: Record<IncidentType, typeof Droplets> = {
  flooding: Droplets,
  power_outage: Zap,
  tree_fall: TreeDeciduous,
  strong_winds: Wind,
};

const severityColors: Record<Severity, string> = {
  critical: 'bg-critical',
  moderate: 'bg-warning',
  safe: 'bg-safe',
};

function MapPin3D({ incident, onClick, isSelected }: { incident: Incident; onClick: () => void; isSelected: boolean }) {
  const Icon = typeIcons[incident.type];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
        isSelected ? "z-30 scale-125" : "z-20 hover:z-30 hover:scale-110"
      )}
      style={{
        left: `${((incident.location.lng - 91.95) / 0.15) * 100}%`,
        top: `${((21.48 - incident.location.lat) / 0.12) * 100}%`,
      }}
    >
      {/* Dynamic Pulse for critical/moderate incidents */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-20",
          incident.severity === 'critical' ? "bg-critical" : "bg-warning"
        )} style={{ animationDuration: '2s' }} />
        {isSelected && (
          <div className="absolute inset-0 rounded-full blur-xl bg-primary/40 animate-pulse" />
        )}
      </div>
      
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 border-2",
        isSelected ? "border-white scale-110" : "border-white/10",
        severityColors[incident.severity]
      )}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      
      {/* Coordinate Label on Hover/Select */}
      {(isSelected) && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg glass px-2 py-1 text-[8px] font-black text-white shadow-xl animate-in fade-in zoom-in duration-300">
          {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
        </div>
      )}
    </button>
  );
}

function FilterPanel({ 
  isOpen, 
  onClose,
  language
}: { 
  isOpen: boolean; 
  onClose: () => void;
  language: 'en' | 'bn';
}) {
  const { filters, setFilters } = useStore();

  const toggleType = (type: IncidentType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ types });
  };

  const toggleSeverity = (severity: Severity) => {
    const severities = filters.severities.includes(severity)
      ? filters.severities.filter(s => s !== severity)
      : [...filters.severities, severity];
    setFilters({ severities });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute left-3 right-3 top-16 z-40 max-h-[min(80dvh,calc(100dvh-12rem))] w-auto overflow-y-auto rounded-3xl glass p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 animate-in slide-in-from-top-4 duration-500 sm:left-auto sm:right-6 sm:top-6 sm:w-80">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest">{language === 'en' ? 'Tactical Filters' : 'ট্যাকটিক্যাল ফিল্টার'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full glass h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Incident Types */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {language === 'en' ? 'Incident Signal' : 'ঘটনার সংকেত'}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(typeIcons) as IncidentType[]).map(type => {
            const Icon = typeIcons[type];
            const isActive = filters.types.length === 0 || filters.types.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass text-muted-foreground opacity-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {INCIDENT_LABELS[type][language]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Severity */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {language === 'en' ? 'Threat Level' : 'হুমকির মাত্রা'}
        </p>
        <div className="flex gap-2">
          {(Object.keys(severityColors) as Severity[]).map(severity => {
            const isActive = filters.severities.length === 0 || filters.severities.includes(severity);
            return (
              <button
                key={severity}
                onClick={() => toggleSeverity(severity)}
                className={cn(
                  "flex-1 rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                  isActive ? severityColors[severity] + " text-white shadow-lg" : "glass text-muted-foreground opacity-50"
                )}
              >
                {SEVERITY_LABELS[severity][language]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Range */}
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {language === 'en' ? 'History Window' : 'ইতিহাস উইন্ডো'}
        </p>
        <div className="flex gap-2">
          {[
            { value: 'all', label: { en: 'ALL', bn: 'সব' } },
            { value: '1h', label: { en: '1H', bn: '১ঘ.' } },
            { value: '6h', label: { en: '6H', bn: '৬ঘ.' } },
            { value: '24h', label: { en: '24H', bn: '২৪ঘ.' } },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilters({ timeRange: value as typeof filters.timeRange })}
              className={cn(
                "flex-1 rounded-xl px-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                filters.timeRange === value ? "bg-white text-black shadow-lg" : "glass text-muted-foreground opacity-50"
              )}
            >
              {label[language]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IncidentDetail({ incident, onClose, language }: { incident: Incident | null; onClose: () => void; language: 'en' | 'bn' }) {
  const { updateIncidentStatus } = useStore();
  
  if (!incident) return null;

  const Icon = typeIcons[incident.type];
  const timeDiff = Math.floor((Date.now() - new Date(incident.timestamp).getTime()) / 60000);

  return (
    <div className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-3 right-3 z-40 animate-in slide-in-from-bottom-4 duration-500 md:bottom-6 md:right-6 md:left-auto md:w-96">
      <Card className="glass relative overflow-hidden border-0 p-0 shadow-2xl">
        <div className="absolute top-0 left-0 bottom-0 w-2" style={{ backgroundColor: `var(--${incident.severity})` }} />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl text-white", severityColors[incident.severity])}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-xl font-black tracking-tight">{INCIDENT_LABELS[incident.type][language]}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {SEVERITY_LABELS[incident.severity][language]}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeDiff < 60 
                      ? `${timeDiff} min ago`
                      : `${Math.floor(timeDiff / 60)}h ago`
                    }
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="glass h-10 w-10 rounded-full text-muted-foreground hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 glass p-4 rounded-2xl border-white/5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm font-medium leading-relaxed">
                {incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}
              </span>
            </div>

            {incident.description && (
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                "{incident.description}"
              </p>
            )}

            <div className="flex items-center gap-3 glass px-4 py-3 rounded-2xl border-white/5">
              {incident.status === 'pending' && <Circle className="h-4 w-4 text-warning animate-pulse" />}
              {incident.status === 'acknowledged' && <Activity className="h-4 w-4 text-primary animate-pulse" />}
              {incident.status === 'resolved' && <CheckCircle className="h-4 w-4 text-safe" />}
              <span className="text-xs font-black uppercase tracking-widest">
                Status: <span className={cn(
                  incident.status === 'pending' && "text-warning",
                  incident.status === 'acknowledged' && "text-primary",
                  incident.status === 'resolved' && "text-safe"
                )}>
                  {incident.status}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {incident.status === 'pending' && (
              <Button 
                onClick={() => updateIncidentStatus(incident.id, 'acknowledged')}
                className="glass border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] h-12 rounded-xl"
              >
                Acknowledge
              </Button>
            )}
            {incident.status === 'acknowledged' && (
              <Button 
                onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                className="bg-safe text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl shadow-lg shadow-safe/20"
              >
                Resolve
              </Button>
            )}
            <Button variant="secondary" className="glass border-white/5 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl col-span-1">
              Dispatch
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DashboardPage() {
  const { language, incidents, filters } = useStore();
  const mounted = useMounted();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      if (filters.types.length > 0 && !filters.types.includes(incident.type)) return false;
      if (filters.severities.length > 0 && !filters.severities.includes(incident.severity)) return false;
      if (filters.timeRange !== 'all') {
        const hours = parseInt(filters.timeRange);
        const cutoff = Date.now() - hours * 60 * 60 * 1000;
        if (new Date(incident.timestamp).getTime() < cutoff) return false;
      }
      return true;
    });
  }, [incidents, filters]);

  const stats = useMemo(() => ({
    total: filteredIncidents.length,
    critical: filteredIncidents.filter(i => i.severity === 'critical').length,
    pending: filteredIncidents.filter(i => i.status === 'pending').length,
  }), [filteredIncidents]);

  if (!mounted) return null;

  return (
    <div className="relative flex h-[calc(100dvh-7.25rem)] min-h-[400px] flex-col sm:h-[calc(100vh-140px)] overflow-hidden">
      {/* Tactical Stats Bar */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-white/5 glass px-4 py-3 sm:px-6 sm:py-4 scrollbar-hide">
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Signals</span>
            <span className="text-2xl font-black tracking-tighter sm:text-3xl leading-none">{stats.total}</span>
          </div>
        </div>
        
        <div className="h-10 w-[1px] bg-white/10 shrink-0" />
        
        <div className="flex shrink-0 items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-critical/20 text-critical shadow-inner">
             <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-critical/70">Critical</span>
            <span className="text-xl font-black leading-none">{stats.critical}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-warning/20 text-warning shadow-inner">
             <Radar className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-warning/70">Awaiting</span>
            <span className="text-xl font-black leading-none">{stats.pending}</span>
          </div>
        </div>

        <div className="ml-auto shrink-0">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "glass h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 transition-all",
              showFilters ? "bg-primary text-white border-primary/50" : "border-white/10 text-muted-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Tactical Filter</span>
          </Button>
        </div>
      </div>

      {/* Command Map Container */}
      <div className="relative flex-1 overflow-hidden bg-[#060b13]">
        {/* Stylized Tactical Map */}
        <div className="absolute inset-0">
          {/* Tactical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '160px 160px' }} />
          
          {/* Depth Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060b13_100%)]" />
          
          {/* Radar Scan Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square animate-[spin_8s_linear_infinite] bg-gradient-to-tr from-primary/50 via-transparent to-transparent rounded-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-primary/20 rounded-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-primary/10 rounded-full" />
          </div>

          {/* Region Annotations */}
          <div className="absolute left-1/4 top-1/4 select-none">
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
               <Crosshair className="h-3 w-3" /> KOLATOLI_SECTOR
            </span>
          </div>
          <div className="absolute right-1/4 top-1/3 select-none">
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
               <Crosshair className="h-3 w-3" /> LABONI_BEACH
            </span>
          </div>
          <div className="absolute bottom-1/3 left-1/3 select-none">
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
               <Crosshair className="h-3 w-3" /> MARINE_DRIVE_SOUTH
            </span>
          </div>
          <div className="absolute bottom-1/4 right-1/3 select-none">
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
               <Crosshair className="h-3 w-3" /> INANI_STATION
            </span>
          </div>
        </div>

        {/* Incident Pins */}
        <div className="absolute inset-0">
          {filteredIncidents.map(incident => (
            <MapPin3D
              key={incident.id}
              incident={incident}
              onClick={() => setSelectedIncident(incident)}
              isSelected={selectedIncident?.id === incident.id}
            />
          ))}
        </div>

        {/* Tactical UI Layers */}
        <FilterPanel 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          language={language}
        />

        {/* Visual Legend */}
        <div className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-3 z-30 sm:bottom-6 sm:left-6 flex flex-col gap-3">
          <Card className="glass border-white/5 p-4 rounded-2xl shadow-xl">
             <div className="flex items-center gap-2 mb-3">
                <Activity className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tactical Legend</span>
             </div>
             <div className="space-y-2.5">
                {[
                  { key: 'critical', color: 'bg-critical' },
                  { key: 'moderate', color: 'bg-warning' },
                  { key: 'safe', color: 'bg-safe' }
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className={cn("h-1.5 w-6 rounded-full", item.color)} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.key}</span>
                  </div>
                ))}
             </div>
          </Card>

          {/* Weather Telemetry Mini-Card */}
          <Card className="glass border-white/5 p-4 rounded-2xl shadow-xl hidden sm:block">
            <div className="flex items-center gap-3">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Wind Speed</span>
                  <span className="text-sm font-black italic">124 KM/H</span>
               </div>
               <div className="h-8 w-[1px] bg-white/10" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-warning mb-1">Category</span>
                  <span className="text-sm font-black italic">CAT-3</span>
               </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Mini-Feed (Desktop only) */}
        <div className="hidden lg:block absolute top-6 left-6 z-30 w-64 space-y-3">
           <div className="glass p-3 rounded-xl border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Live Telemetry</span>
              <div className="flex gap-1">
                 <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
                 <div className="h-1 w-1 bg-primary rounded-full animate-pulse delay-75" />
                 <div className="h-1 w-1 bg-primary rounded-full animate-pulse delay-150" />
              </div>
           </div>
           
           {/* Storm Tracker HUD Item */}
           <Card className="glass border-primary/20 p-4 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                 <Wind className="h-12 w-12 text-primary -mr-4 -mt-4 rotate-12" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Storm Projection</p>
              <div className="flex items-end justify-between">
                 <div>
                    <p className="text-2xl font-black italic leading-none">MOCHA</p>
                    <p className="text-[8px] font-bold text-muted-foreground mt-1">ETA: 4.5 HOURS</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] font-black uppercase text-critical">Landfall Risk</p>
                    <p className="text-lg font-black text-critical leading-none">EXTREME</p>
                 </div>
              </div>
           </Card>

           {filteredIncidents.slice(0, 3).map(i => (
             <Card key={i.id} className="glass border-white/5 p-3 rounded-xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setSelectedIncident(i)}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 truncate">{i.location.address || 'Unknown Sector'}</p>
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-bold text-muted-foreground">{new Date(i.timestamp).toLocaleTimeString()}</span>
                   <div className={cn("h-1 w-12 rounded-full", severityColors[i.severity])} />
                </div>
             </Card>
           ))}
        </div>

        {/* Selected Incident View */}
        <IncidentDetail 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)}
          language={language}
        />
      </div>
    </div>
  );
}

