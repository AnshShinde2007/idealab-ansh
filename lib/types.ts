export type IncidentType = 'flooding' | 'power_outage' | 'tree_fall' | 'strong_winds';
export type Severity = 'critical' | 'moderate' | 'safe';
export type Language = 'en' | 'bn';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  location: Location;
  timestamp: Date;
  description?: string;
  photoUrl?: string;
  reporterName?: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  isOffline?: boolean;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  region: string;
  timestamp: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'incident' | 'alert' | 'announcement';
  title: string;
  description: string;
  timestamp: Date;
  severity?: Severity;
  location?: Location;
}

export const INCIDENT_LABELS: Record<IncidentType, { en: string; bn: string }> = {
  flooding: { en: 'Flooding', bn: 'বন্যা' },
  power_outage: { en: 'Power Outage', bn: 'বিদ্যুৎ বিভ্রাট' },
  tree_fall: { en: 'Tree Fall / Blocked Road', bn: 'গাছ পড়া / রাস্তা বন্ধ' },
  strong_winds: { en: 'Strong Winds', bn: 'প্রবল বায়ু' },
};

export const SEVERITY_LABELS: Record<Severity, { en: string; bn: string }> = {
  critical: { en: 'Critical', bn: 'জটিল' },
  moderate: { en: 'Moderate', bn: 'মাঝারি' },
  safe: { en: 'Safe', bn: 'নিরাপদ' },
};

export const UI_LABELS = {
  report: { en: 'Report Incident', bn: 'ঘটনা রিপোর্ট করুন' },
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  alerts: { en: 'Alerts', bn: 'সতর্কতা' },
  feed: { en: 'Activity Feed', bn: 'কার্যকলাপ ফিড' },
  sendReport: { en: 'Send Report', bn: 'রিপোর্ট পাঠান' },
  location: { en: 'Your Location', bn: 'আপনার অবস্থান' },
  detectingLocation: { en: 'Detecting location...', bn: 'অবস্থান সনাক্ত করা হচ্ছে...' },
  addPhoto: { en: 'Add Photo', bn: 'ফটো যোগ করুন' },
  offline: { en: 'Offline - Will send when connected', bn: 'অফলাইন - সংযুক্ত হলে পাঠানো হবে' },
  reportSent: { en: 'Report Sent!', bn: 'রিপোর্ট পাঠানো হয়েছে!' },
  evacuate: { en: 'Evacuate Immediately', bn: 'এখনই সরে যান' },
  floodWarning: { en: 'Flood Warning', bn: 'বন্যার সতর্কতা' },
  stayIndoors: { en: 'Stay Indoors', bn: 'ঘরে থাকুন' },
};
