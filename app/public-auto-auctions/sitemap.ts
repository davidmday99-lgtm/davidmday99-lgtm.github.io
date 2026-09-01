import type { MetadataRoute } from 'next';

import { stateAuctionGuides } from '@/lib/auction-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.example';
  return stateAuctionGuides.map((state) => ({ url: `${base}/public-auto-auctions/${state.slug}`, lastModified: new Date('2026-09-01'), changeFrequency: 'monthly' }));
}
