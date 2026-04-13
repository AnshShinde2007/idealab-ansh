import type { Location } from '@/lib/types';

export interface CycloneShelter {
  id: string;
  lat: number;
  lng: number;
  name: { en: string; bn: string };
  /** Optional public note (demo / illustrative). */
  note?: { en: string; bn: string };
}

/** Representative Cox's Bazar coastal area shelters for evacuation UX (demo coordinates). */
export const CYCLONE_SHELTERS: CycloneShelter[] = [
  {
    id: 'kolatoli-1',
    lat: 21.4318,
    lng: 91.9942,
    name: { en: 'Kolatoli cyclone shelter', bn: 'কলাতলি ঘূর্ণিঝড় আশ্রয়কেন্দ্র' },
    note: {
      en: 'Near Kolatoli beach approach — follow volunteer signs.',
      bn: 'কলাতলি সমুদ্র সৈকত প্রবেশপথের কাছে — স্বেচ্ছাসেবকের নির্দেশনা মেনে চলুন।',
    },
  },
  {
    id: 'cox-town-hall',
    lat: 21.4275,
    lng: 92.0055,
    name: { en: 'Cox’s Bazar town hall shelter', bn: 'কক্সবাজার টাউন হল আশ্রয়কেন্দ্র' },
    note: { en: 'Central assembly point when beach roads are closed.', bn: 'সমুদ্র সড়ক বন্ধ থাকলে কেন্দ্রীয় সমাবেশস্থল।' },
  },
  {
    id: 'marine-drive',
    lat: 21.4162,
    lng: 92.0188,
    name: { en: 'Marine Drive community shelter', bn: 'মেরিন ড্রাইভ কমিউনিটি আশ্রয়কেন্দ্র' },
  },
  {
    id: 'laboni',
    lat: 21.4412,
    lng: 91.9786,
    name: { en: 'Laboni beach area shelter', bn: 'লাবনী বিচ এলাকার আশ্রয়কেন্দ্র' },
  },
  {
    id: 'ramu',
    lat: 21.3689,
    lng: 92.0954,
    name: { en: 'Ramu upazila cyclone centre', bn: 'রামু উপজেলা ঘূর্ণিঝড় কেন্দ্র' },
    note: { en: 'Inland option if coastal surge risk is high.', bn: 'উপকূলীয় জলোচ্ছ্বাসের ঝুঁকি বেশি হলে অভ্যন্তরীণ বিকল্প।' },
  },
];

const R = 6371;

export function distanceKm(from: Pick<Location, 'lat' | 'lng'>, to: Pick<Location, 'lat' | 'lng'>): number {
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function nearestShelters(
  user: Pick<Location, 'lat' | 'lng'>,
  limit = 3
): { shelter: CycloneShelter; distanceKm: number }[] {
  return CYCLONE_SHELTERS.map((shelter) => ({
    shelter,
    distanceKm: distanceKm(user, { lat: shelter.lat, lng: shelter.lng }),
  }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function formatDistance(km: number, language: 'en' | 'bn'): string {
  if (km < 1) {
    const m = Math.round(km * 1000);
    return language === 'en' ? `${m} m` : `${m} মি`;
  }
  return language === 'en' ? `${km.toFixed(1)} km` : `${km.toFixed(1)} কিমি`;
}

export function mapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
