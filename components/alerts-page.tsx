'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageToggle } from '@/components/language-toggle';
import { 
  AlertTriangle,
  Bell,
  Send,
  Plus,
  X,
  Clock,
  MapPin,
  Megaphone,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Severity } from '@/lib/types';
import { SEVERITY_LABELS } from '@/lib/types';

const quickAlerts = [
  { 
    id: 'evacuate', 
    title: { en: 'Evacuate Immediately', bn: 'এখনই সরে যান' },
    message: { 
      en: 'All residents must evacuate to designated cyclone shelters immediately. Follow official routes.', 
      bn: 'সমস্ত বাসিন্দাদের অবিলম্বে নির্ধারিত ঘূর্ণিঝড় আশ্রয়ে সরে যেতে হবে। অফিসিয়াল রুট অনুসরণ করুন।' 
    },
    severity: 'critical' as Severity,
    icon: AlertTriangle,
  },
  { 
    id: 'flood', 
    title: { en: 'Flood Warning', bn: 'বন্যার সতর্কতা' },
    message: { 
      en: 'Heavy flooding expected in the next 2 hours. Move to higher ground immediately.', 
      bn: 'আগামী ২ ঘণ্টায় ভারী বন্যা প্রত্যাশিত। অবিলম্বে উঁচু জায়গায় সরে যান।' 
    },
    severity: 'critical' as Severity,
    icon: AlertTriangle,
  },
  { 
    id: 'surge', 
    title: { en: 'Storm Surge Alert', bn: 'ঝড়ো জলোচ্ছ্বাস সতর্কতা' },
    message: { 
      en: 'Storm surge of 3-4 meters expected. Stay away from coastal areas and beaches.', 
      bn: '৩-৪ মিটার ঝড়ো জলোচ্ছ্বাস প্রত্যাশিত। উপকূলীয় এলাকা এবং সমুদ্র সৈকত থেকে দূরে থাকুন।' 
    },
    severity: 'critical' as Severity,
    icon: AlertTriangle,
  },
  { 
    id: 'indoors', 
    title: { en: 'Stay Indoors', bn: 'ঘরে থাকুন' },
    message: { 
      en: 'Strong winds detected. Stay indoors, away from windows. Secure loose objects.', 
      bn: 'শক্তিশালী বাতাস সনাক্ত হয়েছে। ঘরে থাকুন, জানালা থেকে দূরে। আলগা জিনিস সুরক্ষিত করুন।' 
    },
    severity: 'moderate' as Severity,
    icon: Bell,
  },
  { 
    id: 'update', 
    title: { en: 'Situation Update', bn: 'পরিস্থিতি আপডেট' },
    message: { 
      en: 'The cyclone has passed. Stay alert for updates. Do not return to coastal areas yet.', 
      bn: 'ঘূর্ণিঝড় পার হয়ে গেছে। আপডেটের জন্য সতর্ক থাকুন। এখনও উপকূলীয় এলাকায় ফিরে যাবেন না।' 
    },
    severity: 'moderate' as Severity,
    icon: Megaphone,
  },
  { 
    id: 'safe', 
    title: { en: 'All Clear', bn: 'সব নিরাপদ' },
    message: { 
      en: 'The area is now safe. You may return to your homes. Exercise caution with damaged structures.', 
      bn: 'এলাকা এখন নিরাপদ। আপনি আপনার বাড়িতে ফিরে যেতে পারেন। ক্ষতিগ্রস্ত কাঠামোর সাথে সতর্কতা অবলম্বন করুন।' 
    },
    severity: 'safe' as Severity,
    icon: CheckCircle,
  },
];

const regions = [
  { id: 'all', name: { en: 'All Coastal Areas', bn: 'সমস্ত উপকূলীয় এলাকা' } },
  { id: 'coxs', name: { en: 'Cox\'s Bazar District', bn: 'কক্সবাজার জেলা' } },
  { id: 'kolatoli', name: { en: 'Kolatoli Area', bn: 'কলাতলি এলাকা' } },
  { id: 'laboni', name: { en: 'Laboni Beach', bn: 'লাবনী বিচ' } },
  { id: 'inani', name: { en: 'Inani Beach', bn: 'ইনানী বিচ' } },
];

const severityColors: Record<Severity, string> = {
  critical: 'bg-critical text-critical-foreground',
  moderate: 'bg-warning text-warning-foreground',
  safe: 'bg-safe text-safe-foreground',
};

const severityBorders: Record<Severity, string> = {
  critical: 'border-critical',
  moderate: 'border-warning',
  safe: 'border-safe',
};

export function AlertsPage() {
  const { language, alerts, addAlert, dismissAlert } = useStore();
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedQuickAlert, setSelectedQuickAlert] = useState<typeof quickAlerts[0] | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customSeverity, setCustomSeverity] = useState<Severity>('moderate');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeAlerts = alerts.filter(a => a.isActive);
  const pastAlerts = alerts.filter(a => !a.isActive);

  const handleSendAlert = async () => {
    const alertData = selectedQuickAlert 
      ? {
          title: selectedQuickAlert.title[language],
          message: selectedQuickAlert.message[language],
          severity: selectedQuickAlert.severity,
          region: regions.find(r => r.id === selectedRegion)?.name[language] || 'All Areas',
          isActive: true,
        }
      : {
          title: customTitle,
          message: customMessage,
          severity: customSeverity,
          region: regions.find(r => r.id === selectedRegion)?.name[language] || 'All Areas',
          isActive: true,
        };

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addAlert(alertData);
    
    setIsSending(false);
    setShowSuccess(true);
    setShowCreateAlert(false);
    setSelectedQuickAlert(null);
    setCustomTitle('');
    setCustomMessage('');
    setCustomSeverity('moderate');
    setSelectedRegion('all');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 60) return `${diff} ${language === 'en' ? 'min ago' : 'মিনিট আগে'}`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ${language === 'en' ? 'hours ago' : 'ঘণ্টা আগে'}`;
    return `${Math.floor(diff / 1440)} ${language === 'en' ? 'days ago' : 'দিন আগে'}`;
  };

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-3 sm:pt-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 px-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold sm:text-2xl">
            {language === 'en' ? 'Alert Management' : 'সতর্কতা ব্যবস্থাপনা'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {language === 'en' 
              ? 'Send emergency alerts to affected regions' 
              : 'ক্ষতিগ্রস্ত অঞ্চলে জরুরি সতর্কতা পাঠান'}
          </p>
        </div>
        <div className="shrink-0 self-end sm:self-auto">
          <LanguageToggle />
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mx-3 mb-6 flex items-center gap-3 rounded-xl bg-safe/20 p-4 sm:mx-4">
          <CheckCircle className="h-6 w-6 text-safe" />
          <p className="text-lg font-bold text-safe">
            {language === 'en' ? 'Alert Sent Successfully!' : 'সতর্কতা সফলভাবে পাঠানো হয়েছে!'}
          </p>
        </div>
      )}

      {/* Create Alert Button */}
      <div className="mb-6 px-3 sm:px-4">
        <Button
          onClick={() => setShowCreateAlert(true)}
          className="w-full gap-3 bg-critical py-5 text-base font-bold hover:bg-critical/90 sm:py-6 sm:text-lg"
        >
          <Plus className="h-6 w-6" />
          {language === 'en' ? 'Create New Alert' : 'নতুন সতর্কতা তৈরি করুন'}
        </Button>
      </div>

      {/* Active Alerts */}
      <div className="mb-8 px-3 sm:px-4">
        <h3 className="mb-4 text-lg font-semibold">
          {language === 'en' ? 'Active Alerts' : 'সক্রিয় সতর্কতা'} ({activeAlerts.length})
        </h3>
        {activeAlerts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'No active alerts' : 'কোনো সক্রিয় সতর্কতা নেই'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <Card key={alert.id} className={cn("overflow-hidden border-l-4", severityBorders[alert.severity])}>
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", severityColors[alert.severity])}>
                        {SEVERITY_LABELS[alert.severity][language]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="mb-2 font-bold">{alert.title}</h4>
                  <p className="mb-3 text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {alert.region}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Alerts */}
      {pastAlerts.length > 0 && (
        <div className="px-3 sm:px-4">
          <h3 className="mb-4 text-lg font-semibold">
            {language === 'en' ? 'Past Alerts' : 'পূর্ববর্তী সতর্কতা'}
          </h3>
          <div className="space-y-3">
            {pastAlerts.slice(0, 5).map(alert => (
              <Card key={alert.id} className="p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", severityColors[alert.severity].split(' ')[0])} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:p-4 md:items-center">
          <div className="max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom,0px)-1rem))] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:p-6 sm:pb-6 md:rounded-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {language === 'en' ? 'Create Alert' : 'সতর্কতা তৈরি করুন'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateAlert(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Alert Templates */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                {language === 'en' ? 'Quick Templates' : 'দ্রুত টেমপ্লেট'}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {quickAlerts.map(alert => {
                  const Icon = alert.icon;
                  return (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedQuickAlert(selectedQuickAlert?.id === alert.id ? null : alert)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all",
                        selectedQuickAlert?.id === alert.id
                          ? severityColors[alert.severity]
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="line-clamp-2 text-[11px] font-medium leading-tight sm:text-xs">{alert.title[language]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Quick Alert Preview or Custom Message */}
            {selectedQuickAlert ? (
              <Card className={cn("mb-6 border-2 p-4", severityBorders[selectedQuickAlert.severity])}>
                <p className="mb-2 font-bold">{selectedQuickAlert.title[language]}</p>
                <p className="text-sm text-muted-foreground">{selectedQuickAlert.message[language]}</p>
              </Card>
            ) : (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {language === 'en' ? 'Title' : 'শিরোনাম'}
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={language === 'en' ? 'Enter alert title...' : 'সতর্কতার শিরোনাম লিখুন...'}
                    className="w-full rounded-xl border border-border bg-secondary p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {language === 'en' ? 'Message' : 'বার্তা'}
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={language === 'en' ? 'Enter alert message...' : 'সতর্কতার বার্তা লিখুন...'}
                    className="w-full rounded-xl border border-border bg-secondary p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {language === 'en' ? 'Severity' : 'তীব্রতা'}
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    {(['critical', 'moderate', 'safe'] as Severity[]).map(sev => (
                      <button
                        key={sev}
                        onClick={() => setCustomSeverity(sev)}
                        className={cn(
                          "w-full rounded-lg py-2 text-sm font-medium transition-all sm:flex-1",
                          customSeverity === sev ? severityColors[sev] : "bg-secondary text-foreground"
                        )}
                      >
                        {SEVERITY_LABELS[sev][language]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Region Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                {language === 'en' ? 'Target Region' : 'লক্ষ্য অঞ্চল'}
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendAlert}
              disabled={(!selectedQuickAlert && (!customTitle || !customMessage)) || isSending}
              className="w-full gap-3 bg-critical py-5 text-base font-bold hover:bg-critical/90 sm:py-6 sm:text-lg"
            >
              {isSending ? (
                <span className="animate-spin">
                  <Send className="h-6 w-6" />
                </span>
              ) : (
                <Send className="h-6 w-6" />
              )}
              {language === 'en' ? 'Send Alert to All Users' : 'সমস্ত ব্যবহারকারীদের সতর্কতা পাঠান'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
