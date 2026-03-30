'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Circle
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

const typeColors: Record<IncidentType, string> = {
  flooding: 'bg-blue-500',
  power_outage: 'bg-amber-500',
  tree_fall: 'bg-green-500',
  strong_winds: 'bg-cyan-500',
};

const severityColors: Record<Severity, string> = {
  critical: 'bg-critical',
  moderate: 'bg-warning',
  safe: 'bg-safe',
};

const severityRings: Record<Severity, string> = {
  critical: 'ring-critical/50',
  moderate: 'ring-warning/50',
  safe: 'ring-safe/50',
};

function MapPin3D({ incident, onClick, isSelected }: { incident: Incident; onClick: () => void; isSelected: boolean }) {
  const Icon = typeIcons[incident.type];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
        isSelected ? "z-20 scale-125" : "z-10 hover:z-20 hover:scale-110"
      )}
      style={{
        left: `${((incident.location.lng - 91.95) / 0.15) * 100}%`,
        top: `${((21.48 - incident.location.lat) / 0.12) * 100}%`,
      }}
    >
      {/* Pulse animation for critical incidents */}
      {incident.severity === 'critical' && (
        <span className="absolute inset-0 animate-ping rounded-full bg-critical/40" style={{ animationDuration: '1.5s' }} />
      )}
      
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full ring-4 shadow-lg transition-all",
        severityColors[incident.severity],
        severityRings[incident.severity],
        isSelected && "ring-8"
      )}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      
      {/* Pin tail */}
      <div className={cn(
        "absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent",
        incident.severity === 'critical' && "border-t-critical",
        incident.severity === 'moderate' && "border-t-warning",
        incident.severity === 'safe' && "border-t-safe"
      )} />
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
    <div className="absolute right-4 top-4 z-30 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{language === 'en' ? 'Filters' : 'ফিল্টার'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Incident Types */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {language === 'en' ? 'Incident Type' : 'ঘটনার ধরন'}
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(typeIcons) as IncidentType[]).map(type => {
            const Icon = typeIcons[type];
            const isActive = filters.types.length === 0 || filters.types.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  isActive ? typeColors[type] + " text-white" : "bg-secondary text-muted-foreground"
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
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {language === 'en' ? 'Severity' : 'তীব্রতা'}
        </p>
        <div className="flex gap-2">
          {(Object.keys(severityColors) as Severity[]).map(severity => {
            const isActive = filters.severities.length === 0 || filters.severities.includes(severity);
            return (
              <button
                key={severity}
                onClick={() => toggleSeverity(severity)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  isActive ? severityColors[severity] + " text-white" : "bg-secondary text-muted-foreground"
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
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {language === 'en' ? 'Time Range' : 'সময়সীমা'}
        </p>
        <div className="flex gap-2">
          {[
            { value: 'all', label: { en: 'All', bn: 'সব' } },
            { value: '1h', label: { en: '1h', bn: '১ ঘ.' } },
            { value: '6h', label: { en: '6h', bn: '৬ ঘ.' } },
            { value: '24h', label: { en: '24h', bn: '২৪ ঘ.' } },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilters({ timeRange: value as typeof filters.timeRange })}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                filters.timeRange === value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
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
    <div className="absolute bottom-4 left-4 right-4 z-30 md:left-auto md:w-96">
      <Card className="overflow-hidden border-2" style={{ borderColor: `var(--${incident.severity})` }}>
        <div className={cn("flex items-center gap-3 p-4", severityColors[incident.severity])}>
          <Icon className="h-8 w-8 text-white" />
          <div className="flex-1">
            <p className="font-bold text-white">{INCIDENT_LABELS[incident.type][language]}</p>
            <p className="text-sm text-white/80">{SEVERITY_LABELS[incident.severity][language]}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {timeDiff < 60 
                ? `${timeDiff} ${language === 'en' ? 'min ago' : 'মিনিট আগে'}`
                : `${Math.floor(timeDiff / 60)} ${language === 'en' ? 'hours ago' : 'ঘণ্টা আগে'}`
              }
            </span>
          </div>

          <div className="mb-4 flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</span>
          </div>

          {incident.description && (
            <p className="mb-4 text-sm">{incident.description}</p>
          )}

          {/* Status */}
          <div className="mb-4 flex items-center gap-2">
            {incident.status === 'pending' && (
              <>
                <Circle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {language === 'en' ? 'Pending Review' : 'পর্যালোচনা অপেক্ষারত'}
                </span>
              </>
            )}
            {incident.status === 'acknowledged' && (
              <>
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {language === 'en' ? 'Acknowledged' : 'স্বীকৃত'}
                </span>
              </>
            )}
            {incident.status === 'resolved' && (
              <>
                <CheckCircle className="h-4 w-4 text-safe" />
                <span className="text-sm font-medium text-safe">
                  {language === 'en' ? 'Resolved' : 'সমাধান হয়েছে'}
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {incident.status === 'pending' && (
              <Button 
                onClick={() => updateIncidentStatus(incident.id, 'acknowledged')}
                className="flex-1 bg-primary"
              >
                {language === 'en' ? 'Acknowledge' : 'স্বীকার করুন'}
              </Button>
            )}
            {incident.status === 'acknowledged' && (
              <Button 
                onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                className="flex-1 bg-safe text-safe-foreground hover:bg-safe/90"
              >
                {language === 'en' ? 'Mark Resolved' : 'সমাধান চিহ্নিত করুন'}
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              {language === 'en' ? 'Dispatch Team' : 'দল প্রেরণ করুন'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DashboardPage() {
  const { language, incidents, filters } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(incident.type)) {
        return false;
      }
      // Severity filter
      if (filters.severities.length > 0 && !filters.severities.includes(incident.severity)) {
        return false;
      }
      // Time filter
      if (filters.timeRange !== 'all') {
        const hours = parseInt(filters.timeRange);
        const cutoff = Date.now() - hours * 60 * 60 * 1000;
        if (new Date(incident.timestamp).getTime() < cutoff) {
          return false;
        }
      }
      return true;
    });
  }, [incidents, filters]);

  // Stats
  const stats = useMemo(() => ({
    total: filteredIncidents.length,
    critical: filteredIncidents.filter(i => i.severity === 'critical').length,
    pending: filteredIncidents.filter(i => i.status === 'pending').length,
    resolved: filteredIncidents.filter(i => i.status === 'resolved').length,
  }), [filteredIncidents]);

  return (
    <div className="relative flex h-[calc(100vh-120px)] flex-col">
      {/* Stats Bar */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{stats.total}</span>
          <span className="text-sm text-muted-foreground">
            {language === 'en' ? 'Incidents' : 'ঘটনা'}
          </span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-critical" />
          <span className="text-sm font-medium">{stats.critical} {language === 'en' ? 'Critical' : 'জটিল'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="text-sm font-medium">{stats.pending} {language === 'en' ? 'Pending' : 'অপেক্ষারত'}</span>
        </div>
        <div className="ml-auto">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {language === 'en' ? 'Filters' : 'ফিল্টার'}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 overflow-hidden bg-[#0a1628]">
        {/* Stylized Map Background */}
        <div className="absolute inset-0">
          {/* Grid lines */}
          <svg className="h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Coastline representation */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628] to-[#0f2847]" />
          <div className="absolute bottom-0 right-0 top-0 w-1/3 bg-gradient-to-l from-blue-900/30 to-transparent" />
          
          {/* Region labels */}
          <div className="absolute left-1/4 top-1/4 text-xs font-medium text-muted-foreground/50">
            {language === 'en' ? 'KOLATOLI' : 'কলাতলি'}
          </div>
          <div className="absolute right-1/4 top-1/3 text-xs font-medium text-muted-foreground/50">
            {language === 'en' ? 'LABONI BEACH' : 'লাবনী বিচ'}
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-xs font-medium text-muted-foreground/50">
            {language === 'en' ? 'MARINE DRIVE' : 'মেরিন ড্রাইভ'}
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-xs font-medium text-muted-foreground/50">
            {language === 'en' ? 'INANI' : 'ইনানী'}
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

        {/* Filter Panel */}
        <FilterPanel 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          language={language}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 rounded-xl bg-card/90 p-3 backdrop-blur-sm">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {language === 'en' ? 'SEVERITY' : 'তীব্রতা'}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-critical" />
              <span className="text-xs">{language === 'en' ? 'Critical' : 'জটিল'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-xs">{language === 'en' ? 'Moderate' : 'মাঝারি'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-safe" />
              <span className="text-xs">{language === 'en' ? 'Safe' : 'নিরাপদ'}</span>
            </div>
          </div>
        </div>

        {/* Selected Incident Detail */}
        <IncidentDetail 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)}
          language={language}
        />
      </div>
    </div>
  );
}
