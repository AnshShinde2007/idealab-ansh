import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CGSN — Cyclone Ground Signal Network',
    short_name: 'CGSN',
    description:
      'Real-time disaster communication for coastal cyclone response: report incidents, map view, alerts, and activity feed.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'portrait-primary',
    lang: 'en',
    categories: ['weather', 'utilities', 'navigation'],
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any',
      },
    ],
  };
}
