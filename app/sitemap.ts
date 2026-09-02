import type { MetadataRoute } from 'next';

import { stateAuctionGuides } from '@/lib/auction-data';
import { blogPosts } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.com'
  ).replace(/\/+$/, '');
  const publicRoutes = [
    '',
    '/search',
    '/how-it-works',
    '/trust-and-safety',
    '/seller-fees',
    '/about',
    '/our-story',
    '/help',
    '/contact',
    '/blog',
    '/terms',
    '/privacy',
    '/private-seller-auctions',
    '/public-auto-auctions',
    '/public-auto-auctions/federal',
    '/public-auto-auctions/online',
    '/public-auto-auctions/auction-safety',
    '/public-auto-auctions/how-auctions-work',
  ];
  return [
    ...publicRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date('2026-09-02'),
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1 : route === '/search' ? 0.9 : 0.7,
    })),
    ...stateAuctionGuides.map((state) => ({
      url: `${base}/public-auto-auctions/${state.slug}`,
      lastModified: new Date('2026-09-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedIso),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
