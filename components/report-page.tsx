'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageToggle } from '@/components/language-toggle';
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
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IncidentType, Severity } from '@/lib/types';
import { INCIDENT_LABELS, UI_LABELS } from '@/lib/types';

const incidentButtons = [
  { type: 'flooding' as IncidentType, icon: Droplets, color: 'bg-blue-600 hover:bg-blue-700' },
  { type: 'power_outage' as IncidentType, icon: Zap, color: 'bg-amber-600 hover:bg-amber-700' },
  { type: 'tree_fall' as IncidentType, icon: TreeDeciduous, color: 'bg-green-600 hover:bg-green-700' },
  { type: 'strong_winds' as IncidentType, icon: Wind, color: 'bg-cyan-600 hover:bg-cyan-700' },
];

const severityButtons = [
  { level: 'critical' as Severity, label: { en: 'Critical', bn: 'জটিল' }, color: 'bg-critical' },
  { level: 'moderate' as Severity, label: { en: 'Moderate', bn: 'মাঝারি' }, color: 'bg-warning' },
  { level: 'safe' as Severity, label: { en: 'Low Risk', bn: 'কম ঝুঁকি' }, color: 'bg-safe' },
];

export function ReportPage() {
  const { language, isOnline, addIncident, userLocation, setUserLocation, alerts } = useStore();
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
    if (!userLocation) {
      detectLocation();
    }
  }, [userLocation, detectLocation]);

  const handleSubmit = async () => {
    if (!selectedType || !userLocation) return;

    setIsSending(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));

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

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen pb-24 pt-4">
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-critical/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-critical" />
            <div className="flex-1">
              <p className="font-bold text-critical">
                {language === 'en' ? 'CRITICAL ALERT' : 'জরুরি সতর্কতা'}
              </p>
              <p className="mt-1 text-sm text-critical/90">
                {criticalAlerts[0].message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Language Toggle */}
      <div className="mb-6 flex items-center justify-between px-4">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Report Incident' : 'ঘটনা রিপোর্ট করুন'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Tap the type of emergency you are experiencing' 
              : 'আপনি যে ধরনের জরুরি অবস্থার সম্মুখীন তা ট্যাপ করুন'}
          </p>
        </div>
        <LanguageToggle />
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="mx-4 mb-6 flex items-center gap-3 rounded-xl bg-warning/20 p-4">
          <WifiOff className="h-5 w-5 text-warning" />
          <p className="text-sm font-medium text-warning">
            {UI_LABELS.offline[language]}
          </p>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-4 mb-6 flex items-center gap-3 rounded-xl bg-safe/20 p-4">
          <CheckCircle className="h-6 w-6 text-safe" />
          <p className="text-lg font-bold text-safe">
            {UI_LABELS.reportSent[language]}
          </p>
        </div>
      )}

      {/* Incident Type Buttons */}
      <div className="mb-8 grid grid-cols-2 gap-4 px-4">
        {incidentButtons.map(({ type, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all duration-200 active:scale-95",
              selectedType === type 
                ? `${color} text-white ring-4 ring-primary/50 scale-[1.02]` 
                : "bg-secondary text-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className="h-12 w-12" strokeWidth={1.5} />
            <span className="text-center text-lg font-bold leading-tight">
              {INCIDENT_LABELS[type][language]}
            </span>
          </button>
        ))}
      </div>

      {/* Severity Selection */}
      {selectedType && (
        <div className="mb-8 px-4">
          <h3 className="mb-3 text-lg font-semibold">
            {language === 'en' ? 'Severity Level' : 'তীব্রতার মাত্রা'}
          </h3>
          <div className="flex gap-3">
            {severityButtons.map(({ level, label, color }) => (
              <button
                key={level}
                onClick={() => setSelectedSeverity(level)}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                  selectedSeverity === level
                    ? `${color} ${level === 'warning' ? 'text-warning-foreground' : 'text-white'} ring-2 ring-offset-2 ring-offset-background`
                    : "bg-secondary text-foreground"
                )}
                style={{
                  ringColor: selectedSeverity === level ? `var(--${level})` : undefined
                }}
              >
                {label[language]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="mb-6 px-4">
        <Card className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            userLocation ? "bg-safe/20 text-safe" : "bg-muted text-muted-foreground"
          )}>
            {isLocating ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <MapPin className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{UI_LABELS.location[language]}</p>
            <p className="text-sm text-muted-foreground">
              {isLocating 
                ? UI_LABELS.detectingLocation[language]
                : userLocation?.address || `${userLocation?.lat?.toFixed(4)}, ${userLocation?.lng?.toFixed(4)}`
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={detectLocation}
            disabled={isLocating}
            className="shrink-0"
          >
            {language === 'en' ? 'Refresh' : 'রিফ্রেশ'}
          </Button>
        </Card>
      </div>

      {/* Optional Description */}
      {selectedType && (
        <div className="mb-6 px-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'en' ? 'Add details (optional)...' : 'বিবরণ যোগ করুন (ঐচ্ছিক)...'}
            className="w-full rounded-xl border border-border bg-secondary p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>
      )}

      {/* Add Photo Button */}
      {selectedType && (
        <div className="mb-8 px-4">
          <Button
            variant="outline"
            className="w-full gap-3 py-6 text-lg"
          >
            <Camera className="h-6 w-6" />
            {UI_LABELS.addPhoto[language]}
          </Button>
        </div>
      )}

      {/* Submit Button */}
      <div className="px-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedType || !userLocation || isSending}
          className={cn(
            "w-full gap-3 py-8 text-xl font-bold transition-all duration-200",
            selectedType 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {isSending ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <Send className="h-7 w-7" />
          )}
          {UI_LABELS.sendReport[language]}
        </Button>
      </div>
    </div>
  );
}
