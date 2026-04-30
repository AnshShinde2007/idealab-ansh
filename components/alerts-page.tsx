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
  CheckCircle,
  Activity,
  ShieldAlert,
  ArrowRight,
  ChevronRight
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
    color: 'from-critical/20 to-critical/40 border-critical/30',
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
    color: 'from-critical/20 to-critical/40 border-critical/30',
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
    color: 'from-critical/20 to-critical/40 border-critical/30',
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
    color: 'from-warning/20 to-warning/40 border-warning/30',
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
    color: 'from-primary/20 to-primary/40 border-primary/30',
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
    color: 'from-safe/20 to-safe/40 border-safe/30',
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
  critical: 'bg-critical text-white shadow-critical/20',
  moderate: 'bg-warning text-warning-foreground shadow-warning/20',
  safe: 'bg-safe text-white shadow-safe/20',
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
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    addAlert(alertData);
    
    setIsSending(false);
    setShowSuccess(true);
    setShowCreateAlert(false);
    setSelectedQuickAlert(null);
    setCustomTitle('');
    setCustomMessage('');
    setCustomSeverity('moderate');
    setSelectedRegion('all');

    setTimeout(() => setShowSuccess(false), 4000);
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 60) return `${diff} ${language === 'en' ? 'min ago' : 'মিনিট আগে'}`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ${language === 'en' ? 'hours ago' : 'ঘণ্টা আগে'}`;
    return `${Math.floor(diff / 1440)} ${language === 'en' ? 'days ago' : 'দিন আগে'}`;
  };

  return (
    <div className="relative min-h-screen pb-[calc(10rem+env(safe-area-inset-bottom,0px))] pt-3 sm:pt-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/5 blur-[100px] rounded-full" />
      <div className="scan-line" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-3 sm:px-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Command Center
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {language === 'en' ? 'Alerts' : 'সতর্কতা'} <span className="text-primary">{language === 'en' ? 'Studio' : 'স্টুডিও'}</span>
          </h2>
        </div>
        <LanguageToggle />
      </div>

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="glass mx-6 flex w-full max-w-xs flex-col items-center justify-center p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-safe/20 text-safe shadow-xl shadow-safe/20">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <p className="text-xl font-black text-foreground">
              {language === 'en' ? 'ALERT BROADCASTED!' : 'সতর্কতা সম্প্রচারিত!'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Notification has been sent to all users in the region.
            </p>
          </Card>
        </div>
      )}

      {/* Create Alert Action - Sticky at bottom to match Report Page */}
      <div className="px-3 sm:px-4 sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px))] z-40">
        <button
          onClick={() => setShowCreateAlert(true)}
          className="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-critical to-red-800 p-6 shadow-2xl shadow-critical/40 transition-all duration-300 active:scale-95"
        >
          <div className="absolute top-0 right-0 p-2 opacity-20 transition-transform duration-500 group-hover:scale-150">
             <Plus className="h-12 w-12" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
              <Megaphone className="h-8 w-8" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                New Broadcast
              </p>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {language === 'en' ? 'Issue Emergency Alert' : 'জরুরি সতর্কতা জারি করুন'}
              </h3>
            </div>
            <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>
        </button>
      </div>

      {/* Active Alerts List */}
      <div className="mb-10 px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {language === 'en' ? 'Active Broadcasts' : 'সক্রিয় সম্প্রচার'}
          </h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-black text-primary">
            {activeAlerts.length}
          </span>
        </div>

        {activeAlerts.length === 0 ? (
          <Card className="glass flex flex-col items-center justify-center border-dashed border-white/10 p-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/20 text-muted-foreground/30">
              <Bell className="h-8 w-8" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              {language === 'en' ? 'No active alerts' : 'কোনো সক্রিয় সতর্কতা নেই'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <Card key={alert.id} className="glass group relative overflow-hidden border-0 p-5 shadow-xl animate-in slide-in-from-left-4 duration-500">
                <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: `var(--${alert.severity})` }} />
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider", severityColors[alert.severity])}>
                      {SEVERITY_LABELS[alert.severity][language]}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-8 w-8 rounded-lg glass text-muted-foreground hover:text-critical"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <h4 className="text-lg font-black tracking-tight mb-1">{alert.title}</h4>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">{alert.message}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  <MapPin className="h-3 w-3" />
                  {alert.region}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Alerts Section */}
      {pastAlerts.length > 0 && (
        <div className="px-3 sm:px-4 mb-8">
           <h3 className="mb-4 px-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            {language === 'en' ? 'Broadcast History' : 'সম্প্রচার ইতিহাস'}
          </h3>
          <div className="space-y-3">
            {pastAlerts.slice(0, 5).map(alert => (
              <Card key={alert.id} className="glass border-0 p-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-4">
                  <div className={cn("h-1.5 w-1.5 rounded-full", severityColors[alert.severity].split(' ')[0])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{alert.title}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{formatTime(alert.timestamp)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Modal (Redesigned as Drawer/Overlay) */}
      {showCreateAlert && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:p-4 md:items-center animate-in fade-in duration-300">
          <div className="max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom,0px)-1rem))] w-full max-w-lg overflow-y-auto rounded-t-[2.5rem] glass p-6 pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:p-8 sm:pb-8 md:rounded-[2.5rem] border-white/10 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500">
            <div className="mb-8 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">New Alert</p>
                 <h3 className="text-2xl font-black tracking-tight">
                    {language === 'en' ? 'Broadcast' : 'সম্প্রচার'}
                  </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateAlert(false)} className="rounded-full glass h-10 w-10">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Template Selection */}
            <div className="mb-8">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {language === 'en' ? 'Emergency Templates' : 'জরুরি টেমপ্লেট'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickAlerts.map(alert => {
                  const Icon = alert.icon;
                  return (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedQuickAlert(selectedQuickAlert?.id === alert.id ? null : alert)}
                      className={cn(
                        "relative flex flex-col items-center gap-3 rounded-[1.5rem] p-5 text-center transition-all duration-300",
                        selectedQuickAlert?.id === alert.id
                          ? `bg-gradient-to-br ${alert.color} ring-2 ring-primary scale-[1.02] shadow-xl`
                          : "glass border-white/5 hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        selectedQuickAlert?.id === alert.id ? "bg-white/20" : "bg-primary/10 text-primary"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider leading-tight line-clamp-2">{alert.title[language]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Preview / Form */}
            {selectedQuickAlert ? (
              <Card className="mb-8 glass border-primary/20 p-5 animate-in zoom-in-95 duration-300">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Template Preview</span>
                 </div>
                <p className="mb-2 text-lg font-black tracking-tight">{selectedQuickAlert.title[language]}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{selectedQuickAlert.message[language]}</p>
              </Card>
            ) : (
              <div className="mb-8 space-y-5 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {language === 'en' ? 'Alert Title' : 'সতর্কতার শিরোনাম'}
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={language === 'en' ? 'Enter title...' : 'শিরোনাম লিখুন...'}
                    className="w-full rounded-2xl glass border-0 p-4 text-sm font-bold placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {language === 'en' ? 'Broadcast Message' : 'সম্প্রচার বার্তা'}
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={language === 'en' ? 'Describe the situation...' : 'বার্তা লিখুন...'}
                    className="w-full rounded-2xl glass border-0 p-4 text-sm font-medium placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {language === 'en' ? 'Severity Level' : 'তীব্রতা'}
                  </label>
                  <div className="flex gap-2">
                    {(['critical', 'moderate', 'safe'] as Severity[]).map(sev => (
                      <button
                        key={sev}
                        onClick={() => setCustomSeverity(sev)}
                        className={cn(
                          "flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                          customSeverity === sev ? severityColors[sev] : "glass border-white/5 text-muted-foreground"
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
            <div className="mb-10">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {language === 'en' ? 'Broadcast Region' : 'লক্ষ্য অঞ্চল'}
              </label>
              <div className="relative">
                 <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full rounded-2xl glass border-0 p-4 text-sm font-bold focus:ring-2 focus:ring-primary appearance-none"
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id} className="bg-background text-foreground">
                        {region.name[language]}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                  </div>
              </div>
            </div>

            {/* Broadcast Button */}
            <Button
              onClick={handleSendAlert}
              disabled={(!selectedQuickAlert && (!customTitle || !customMessage)) || isSending}
              className={cn(
                "w-full h-20 rounded-[1.5rem] gap-3 text-lg font-black uppercase tracking-[0.15em] transition-all duration-500 shadow-2xl",
                (selectedQuickAlert || (customTitle && customMessage))
                  ? "bg-gradient-to-r from-critical to-red-800 shadow-critical/40 hover:scale-[1.01]" 
                  : "bg-muted text-muted-foreground shadow-none"
              )}
            >
              {isSending ? (
                 <Activity className="h-8 w-8 animate-pulse" />
              ) : (
                <Send className="h-8 w-8" />
              )}
              {language === 'en' ? 'Broadcast Alert' : 'সতর্কতা সম্প্রচার করুন'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

