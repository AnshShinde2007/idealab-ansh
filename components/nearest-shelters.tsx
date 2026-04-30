'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ExternalLink, Navigation } from 'lucide-react';
import { nearestShelters, formatDistance, mapsDirectionsUrl } from '@/lib/shelters';
import type { Language } from '@/lib/types';

type NearestSheltersProps = {
  language: Language;
  userLat: number;
  userLng: number;
};

export function NearestShelters({ language, userLat, userLng }: NearestSheltersProps) {
  const ranked = useMemo(
    () => nearestShelters({ lat: userLat, lng: userLng }, 3),
    [userLat, userLng]
  );

  const title =
    language === 'en' ? 'Nearest cyclone shelters' : 'নিকটতম ঘূর্ণিঝড় আশ্রয়কেন্দ্র';
  const subtitle =
    language === 'en'
      ? 'Always follow official instructions and marked routes.'
      : 'সরকারি নির্দেশনা ও চিহ্নিত রুট অনুসরণ করুন।';
  const openMaps = language === 'en' ? 'Directions' : 'দিকনির্দেশ';
  const browseNearby =
    language === 'en' ? 'Search shelters near me' : 'আমার কাছে আশ্রয়কেন্দ্র খুঁজুন';
  const mapsSearchHref = `https://www.google.com/maps/search/cyclone+shelter/@${userLat},${userLng},13z`;

  return (
    <div className="mb-6 px-3 sm:px-4">
      <Card className="glass relative overflow-hidden border-0 p-5 shadow-xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-lg shadow-primary/20">
            <Building2 className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black tracking-tight leading-tight">{title}</h3>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <ul className="space-y-3">
          {ranked.map(({ shelter, distanceKm }) => (
            <li
              key={shelter.id}
              className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white/10 transition-colors duration-300"
            >
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-wider leading-snug">{shelter.name[language]}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Navigation className="h-3 w-3" aria-hidden />
                    {formatDistance(distanceKm, language)}
                  </span>
                </div>
                {shelter.note && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-medium">
                    {shelter.note[language]}
                  </p>
                )}
              </div>
              <Button variant="secondary" size="sm" className="glass h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[10px] shrink-0 gap-1.5 self-start sm:self-auto border-white/10" asChild>
                <a href={mapsDirectionsUrl(shelter.lat, shelter.lng)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {openMaps}
                </a>
              </Button>
            </li>
          ))}
        </ul>

        <Button variant="ghost" size="sm" className="mt-4 w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5" asChild>
          <a href={mapsSearchHref} target="_blank" rel="noopener noreferrer">
            {browseNearby}
          </a>
        </Button>
      </Card>
    </div>
  );
}

