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
      ? 'Demo list — always follow official instructions and marked routes.'
      : 'ডেমো তালিকা — সরকারি নির্দেশনা ও চিহ্নিত রুট অনুসরণ করুন।';
  const openMaps = language === 'en' ? 'Directions' : 'দিকনির্দেশ';
  const browseNearby =
    language === 'en' ? 'Search shelters near me' : 'আমার কাছে আশ্রয়কেন্দ্র খুঁজুন';
  const mapsSearchHref = `https://www.google.com/maps/search/cyclone+shelter/@${userLat},${userLng},13z`;

  return (
    <div className="mb-6 px-3 sm:px-4">
      <Card className="overflow-hidden border-border/80 p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Building2 className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <ul className="space-y-3">
          {ranked.map(({ shelter, distanceKm }) => (
            <li
              key={shelter.id}
              className="flex flex-col gap-2 rounded-xl bg-secondary/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium leading-snug">{shelter.name[language]}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  <Navigation className="mr-1 inline h-3.5 w-3.5 align-text-bottom" aria-hidden />
                  {formatDistance(distanceKm, language)}
                </p>
                {shelter.note && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {shelter.note[language]}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5 self-start sm:self-auto" asChild>
                <a href={mapsDirectionsUrl(shelter.lat, shelter.lng)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {openMaps}
                </a>
              </Button>
            </li>
          ))}
        </ul>

        <Button variant="ghost" size="sm" className="mt-3 w-full text-muted-foreground" asChild>
          <a href={mapsSearchHref} target="_blank" rel="noopener noreferrer">
            {browseNearby}
          </a>
        </Button>
      </Card>
    </div>
  );
}
