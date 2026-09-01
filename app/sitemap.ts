import type { MetadataRoute } from 'next';

import { demoListings } from '@/lib/demo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.example';
  const publicRoutes = ['', '/search', '/how-it-works', '/trust-and-safety', '/seller-fees', '/about', '/help', '/terms', '/privacy'];
  return [...publicRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === '' ? 'daily' as const : 'weekly' as const })), ...demoListings.map((listing) => ({ url: `${base}/cars/${listing.slug}`, lastModified: new Date(), changeFrequency: 'daily' as const }))];
}
