import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { stateAuctionGuides } from '@/lib/auction-data';

describe('public sitemap', () => {
  it('includes the public marketplace and every state auction guide', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain('https://owneronlycars.com');
    expect(urls).toContain('https://owneronlycars.com/our-story');
    expect(urls).toContain('https://owneronlycars.com/contact');
    expect(urls).toContain('https://owneronlycars.com/private-seller-auctions');

    for (const state of stateAuctionGuides) {
      expect(urls).toContain(
        `https://owneronlycars.com/public-auto-auctions/${state.slug}`,
      );
    }
  });

  it('does not submit private screens or fictional inventory to search engines', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.some((url) => url.includes('/account/'))).toBe(false);
    expect(urls.some((url) => url.includes('/dashboard'))).toBe(false);
    expect(urls.some((url) => url.includes('/cars/'))).toBe(false);
    expect(
      urls.some((url) => /private-seller-auctions\/.+-auction$/.test(url)),
    ).toBe(false);
  });
});
