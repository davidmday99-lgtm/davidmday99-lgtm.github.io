import type { MetadataRoute } from 'next';

import { demoListings } from '@/lib/demo-data';
import { stateAuctionGuides } from '@/lib/auction-data';
import { blogPosts } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.com';
  const publicRoutes = [
    '',
    '/search',
    '/how-it-works',
    '/trust-and-safety',
    '/seller-fees',
    '/about',
    '/help',
    '/blog',
    '/terms',
    '/privacy',
    '/public-auto-auctions',
    '/public-auto-auctions/federal',
    '/public-auto-auctions/online',
    '/public-auto-auctions/auction-safety',
    '/public-auto-auctions/how-auctions-work',
  ];
  return [
    ...publicRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    })),
    ...stateAuctionGuides.map((state) => ({
      url: `${base}/public-auto-auctions/${state.slug}`,
      lastModified: new Date('2026-09-01'),
      changeFrequency: 'monthly' as const,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedIso),
      changeFrequency: 'monthly' as const,
    })),
    ...demoListings.map((listing) => ({
      url: `${base}/cars/${listing.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
    })),
  ];
}
