'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Incident, Alert, ActivityItem, Language, IncidentType, Severity, Location } from './types';

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Connection status
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;

  // Incidents
  incidents: Incident[];
  pendingIncidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'status'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  syncPendingIncidents: () => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;

  // Activity feed
  activities: ActivityItem[];

  // Filters for dashboard
  filters: {
    types: IncidentType[];
    severities: Severity[];
    timeRange: 'all' | '1h' | '6h' | '24h';
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;

  // User location
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock initial data for demo
const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'flooding',
    severity: 'critical',
    location: { lat: 21.4272, lng: 92.0058, address: 'Cox\'s Bazar Beach Road' },
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    description: 'Severe flooding near the beach area, water level rising rapidly',
    status: 'acknowledged',
  },
  {
    id: '2',
    type: 'power_outage',
    severity: 'moderate',
    location: { lat: 21.4352, lng: 91.9872, address: 'Kolatoli Area' },
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    description: 'Power lines down due to strong winds',
    status: 'pending',
  },
  {
    id: '3',
    type: 'tree_fall',
    severity: 'moderate',
    location: { lat: 21.4189, lng: 92.0134, address: 'Marine Drive' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    description: 'Large tree blocking main road',
    status: 'acknowledged',
  },
  {
    id: '4',
    type: 'strong_winds',
    severity: 'critical',
    location: { lat: 21.4421, lng: 91.9756, address: 'Laboni Beach' },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    description: 'Wind speeds exceeding 100 km/h',
    status: 'pending',
  },
  {
    id: '5',
    type: 'flooding',
    severity: 'safe',
    location: { lat: 21.4098, lng: 92.0245, address: 'Inani Beach' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    description: 'Minor water logging, situation under control',
    status: 'resolved',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Cyclone Mocha Warning',
    message: 'Severe cyclone expected to make landfall within 6 hours. All residents in coastal areas should evacuate immediately to designated shelters.',
    severity: 'critical',
    region: 'Cox\'s Bazar District',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isActive: true,
  },
  {
    id: '2',
    title: 'Heavy Rainfall Alert',
    message: 'Heavy rainfall expected in the next 2 hours. Avoid low-lying areas and stay indoors.',
    severity: 'moderate',
    region: 'Coastal Belt',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isActive: true,
  },
];

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Evacuation Order Issued',
    description: 'All residents within 5km of coastline must evacuate to cyclone shelters immediately.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    severity: 'critical',
  },
  {
    id: '2',
    type: 'incident',
    title: 'Flooding Reported',
    description: 'Severe flooding reported near Cox\'s Bazar Beach Road. Emergency teams dispatched.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: 'critical',
    location: { lat: 21.4272, lng: 92.0058 },
  },
  {
    id: '3',
    type: 'announcement',
    title: 'Shelter Capacity Update',
    description: 'Cyclone Shelter #12 (Kolatoli School) is at 80% capacity. New arrivals directed to Shelter #15.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: '4',
    type: 'incident',
    title: 'Power Outage',
    description: 'Major power outage in Kolatoli area affecting 5000+ households.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    severity: 'moderate',
    location: { lat: 21.4352, lng: 91.9872 },
  },
  {
    id: '5',
    type: 'alert',
    title: 'Storm Surge Warning',
    description: 'Storm surge of 3-4 meters expected along the coast. Stay away from beaches.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    severity: 'critical',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      isOnline: true,
      setIsOnline: (status) => set({ isOnline: status }),

      incidents: mockIncidents,
      pendingIncidents: [],
      addIncident: (incident) => {
        const newIncident: Incident = {
          ...incident,
          id: generateId(),
          timestamp: new Date(),
          status: 'pending',
          isOffline: !get().isOnline,
        };

        if (get().isOnline) {
          set((state) => ({
            incidents: [newIncident, ...state.incidents],
            activities: [
              {
                id: generateId(),
                type: 'incident',
                title: `${incident.type.replace('_', ' ').toUpperCase()} Reported`,
                description: incident.description || 'New incident reported by community member.',
                timestamp: new Date(),
                severity: incident.severity,
                location: incident.location,
              },
              ...state.activities,
            ],
          }));
        } else {
          set((state) => ({
            pendingIncidents: [newIncident, ...state.pendingIncidents],
          }));
        }
      },
      updateIncidentStatus: (id, status) => {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, status } : inc
          ),
        }));
      },
      syncPendingIncidents: () => {
        const pending = get().pendingIncidents;
        if (pending.length > 0 && get().isOnline) {
          set((state) => ({
            incidents: [...pending.map((p) => ({ ...p, isOffline: false })), ...state.incidents],
            pendingIncidents: [],
          }));
        }
      },

      alerts: mockAlerts,
      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: generateId(),
          timestamp: new Date(),
        };
        set((state) => ({
          alerts: [newAlert, ...state.alerts],
          activities: [
            {
              id: generateId(),
              type: 'alert',
              title: alert.title,
              description: alert.message,
              timestamp: new Date(),
              severity: alert.severity,
            },
            ...state.activities,
          ],
        }));
      },
      dismissAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, isActive: false } : a
          ),
        }));
      },

      activities: mockActivities,

      filters: {
        types: [],
        severities: [],
        timeRange: 'all',
      },
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
    }),
    {
      name: 'cgsn-storage',
      partialize: (state) => ({
        language: state.language,
        pendingIncidents: state.pendingIncidents,
      }),
    }
  )
);
