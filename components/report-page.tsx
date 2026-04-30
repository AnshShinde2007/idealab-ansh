'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageToggle } from '@/components/language-toggle';
import { NearestShelters } from '@/components/nearest-shelters';
import { useMounted } from '@/hooks/use-mounted';
import { 
  Droplets, 
  Zap, 
  TreeDeciduous, 
  Wind,
  MapPin,
  Camera,
  Send,
  CheckCircle,
  Loader2,
  AlertTriangle,
  WifiOff,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IncidentType, Severity } from '@/lib/types';
import { INCIDENT_LABELS, UI_LABELS } from '@/lib/types';

const incidentButtons = [
  { type: 'flooding' as IncidentType, icon: Droplets, color: 'from-blue-600 to-blue-800 shadow-blue-900/40' },
  { type: 'power_outage' as IncidentType, icon: Zap, color: 'from-amber-500 to-amber-700 shadow-amber-900/40' },
  { type: 'tree_fall' as IncidentType, icon: TreeDeciduous, color: 'from-green-600 to-green-800 shadow-green-900/40' },
  { type: 'strong_winds' as IncidentType, icon: Wind, color: 'from-cyan-500 to-cyan-700 shadow-cyan-900/40' },
];

const severityButtons = [
  { level: 'critical' as Severity, label: { en: 'Critical', bn: 'জটিল' }, color: 'bg-critical shadow-critical/30' },
  { level: 'moderate' as Severity, label: { en: 'Moderate', bn: 'মাঝারি' }, color: 'bg-warning shadow-warning/30' },
  { level: 'safe' as Severity, label: { en: 'Low Risk', bn: 'কম ঝুঁকি' }, color: 'bg-safe shadow-safe/30' },
];

export function ReportPage() {
  const { language, isOnline, addIncident, userLocation, setUserLocation, alerts } = useStore();
  const mounted = useMounted();
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>('moderate');
  const [isLocating, setIsLocating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [description, setDescription] = useState('');

  const criticalAlerts = alerts.filter(a => a.isActive && a.severity === 'critical');

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        // Fallback to mock location if geolocation fails
        setUserLocation({ lat: 21.4272, lng: 92.0058, address: 'Cox\'s Bazar' });
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }, [setUserLocation]);

  useEffect(() => {
    if (!userLocation && mounted) {
      detectLocation();
    }
  }, [userLocation, detectLocation, mounted]);

  const handleSubmit = async () => {
    if (!selectedType || !userLocation) return;

    setIsSending(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1200));

    addIncident({
      type: selectedType,
      severity: selectedSeverity,
      location: userLocation,
      description: description || undefined,
    });

    setIsSending(false);
    setShowSuccess(true);
    setSelectedType(null);
    setDescription('');
    setSelectedSeverity('moderate');

    setTimeout(() => setShowSuccess(false), 4000);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-3 sm:pt-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 bg-critical/5 blur-[100px] rounded-full" />
      <div className="scan-line" />

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="mx-3 mb-6 overflow-hidden rounded-2xl bg-critical/10 border border-critical/20 p-4 sm:mx-4 backdrop-blur-md emergency-pulse">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-critical/20 text-critical shadow-lg shadow-critical/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-critical">
                {language === 'en' ? 'CRITICAL ALERT' : 'জরুরি সতর্কতা'}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground/90 leading-tight">
                {criticalAlerts[0].message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Language Toggle */}
      <div className="mb-6 flex items-center justify-between px-3 sm:px-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {isOnline ? 'System Live' : 'Offline Mode'}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {language === 'en' ? 'Report' : 'রিপোর্ট'} <span className="text-primary">{language === 'en' ? 'Incident' : 'ঘটনা'}</span>
          </h2>
        </div>
        <LanguageToggle />
      </div>

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="glass mx-6 flex w-full max-w-xs flex-col items-center justify-center p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-safe/20 text-safe shadow-xl shadow-safe/20">
              <CheckCircle className="h-10 w-10" />
            </div>
            <p className="text-xl font-black text-foreground">
              {UI_LABELS.reportSent[language]}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Emergency responders have been notified.
            </p>
          </Card>
        </div>
      )}

      {/* Incident Type Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 px-3 sm:gap-6 sm:px-4">
        {incidentButtons.map(({ type, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl p-6 transition-all duration-300 active:scale-95",
              selectedType === type 
                ? `bg-gradient-to-br ${color} text-white ring-offset-background ring-4 ring-primary shadow-2xl scale-[1.02]` 
                : "glass text-foreground hover:bg-card/80 border-white/5"
            )}
          >
            {selectedType === type && (
              <div className="absolute top-0 right-0 p-2">
                <CheckCircle className="h-4 w-4 text-white/50" />
              </div>
            )}
            <Icon className={cn(
              "h-12 w-12 transition-transform duration-500 group-hover:scale-110",
              selectedType === type ? "text-white" : "text-primary"
            )} strokeWidth={1.5} />
            <span className="text-center text-sm font-black uppercase tracking-wider leading-tight">
              {INCIDENT_LABELS[type][language]}
            </span>
          </button>
        ))}
      </div>

      {/* Severity Selection */}
      {selectedType && (
        <div className="mb-8 px-3 sm:px-4 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {language === 'en' ? 'Severity Level' : 'তীব্রতার মাত্রা'}
          </h3>
          <div className="flex gap-2 sm:gap-4">
            {severityButtons.map(({ level, label, color }) => (
              <button
                key={level}
                onClick={() => setSelectedSeverity(level)}
                className={cn(
                  "flex-1 rounded-2xl px-4 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300",
                  selectedSeverity === level
                    ? `${color} ${level === 'moderate' ? 'text-warning-foreground' : 'text-white'} shadow-xl ring-2 ring-offset-2 ring-offset-background`
                    : "glass text-muted-foreground"
                )}
              >
                {label[language]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Card */}
      <div className="mb-8 px-3 sm:px-4">
        <Card className="glass relative overflow-hidden border-0 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-colors duration-500",
              userLocation ? "bg-safe/10 text-safe" : "bg-muted text-muted-foreground"
            )}>
              {isLocating ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <MapPin className="h-7 w-7" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {UI_LABELS.location[language]}
              </p>
              <p className="mt-0.5 truncate text-lg font-bold">
                {isLocating 
                  ? UI_LABELS.detectingLocation[language]
                  : userLocation?.address || `${userLocation?.lat?.toFixed(4)}, ${userLocation?.lng?.toFixed(4)}`
                }
              </p>
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={detectLocation}
              disabled={isLocating}
              className="rounded-xl glass border-white/10"
            >
              <RefreshCw className={cn("h-4 w-4", isLocating && "animate-spin")} />
            </Button>
          </div>
        </Card>
      </div>

      {userLocation && !isLocating && (
        <div className="mb-8">
           <NearestShelters language={language} userLat={userLocation.lat} userLng={userLocation.lng} />
        </div>
      )}

      {/* Optional Description */}
      {selectedType && (
        <div className="mb-6 px-3 sm:px-4 animate-in slide-in-from-bottom-4 duration-700">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'en' ? 'ADD DETAILS (OPTIONAL)...' : 'বিবরণ যোগ করুন (ঐচ্ছিক)...'}
            className="w-full rounded-2xl glass border-0 p-5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
            rows={3}
          />
        </div>
      )}

      {/* Add Photo Button */}
      {selectedType && (
        <div className="mb-10 px-3 sm:px-4 animate-in slide-in-from-bottom-4 duration-700">
          <Button
            variant="outline"
            className="w-full glass border-dashed border-primary/30 h-16 rounded-2xl gap-3 text-sm font-black uppercase tracking-widest"
          >
            <Camera className="h-5 w-5 text-primary" />
            {UI_LABELS.addPhoto[language]}
          </Button>
        </div>
      )}

      {/* Submit Button */}
      <div className="px-3 sm:px-4 sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px))] z-50">
        <Button
          onClick={handleSubmit}
          disabled={!selectedType || !userLocation || isSending}
          className={cn(
            "w-full h-20 rounded-2xl gap-3 text-lg font-black uppercase tracking-[0.15em] transition-all duration-500 shadow-2xl",
            selectedType 
              ? "bg-primary hover:bg-primary/90 shadow-primary/40" 
              : "bg-muted text-muted-foreground shadow-none"
          )}
        >
          {isSending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Send className="h-8 w-8" />
          )}
          {UI_LABELS.sendReport[language]}
        </Button>
      </div>
    </div>
  );
}

// Sub-component for Refresh icon
function RefreshCw(props: React.ComponentProps<typeof Loader2>) {
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

