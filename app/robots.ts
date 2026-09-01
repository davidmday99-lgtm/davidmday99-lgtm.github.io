import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://owneronlycars.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/dashboard',
        '/favorites',
        '/messages',
        '/settings',
        '/sell/',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
