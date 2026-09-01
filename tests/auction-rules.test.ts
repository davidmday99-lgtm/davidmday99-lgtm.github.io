import { describe, expect, it } from 'vitest';

import { acceptsAuctionPaymentOnPlatform, assertAuctionNotOwnerListing, canApproveAuctionSource, defaultPublicEvents, eventDuplicateKey, findDuplicateSource, isAuctionEventExpired, validateAuctionUrl } from '@/lib/auction-rules';
import type { AuctionEventRecord, AuctionSourceRecord } from '@/lib/auction-types';
import { independentAuctionSources } from '@/lib/auction-data';

const event = (overrides: Partial<AuctionEventRecord> = {}): AuctionEventRecord => ({ id: 'e1', title: 'City Fleet Sale', sourceId: 's1', state: 'WI', publicEligibility: 'confirmed', sourceUrl: 'https://example.gov/auction', lastUpdatedAt: '2026-09-01T12:00:00Z', status: 'approved', ...overrides });
const source = (url: string): AuctionSourceRecord => ({ id: 's1', sourceName: 'Official Source', agencyOrAuthorizedContractor: 'Public Agency', officialSourceUrl: url, termsAndRegistrationUrl: url, sourceCategory: 'state surplus', statesServed: ['WI'], publicAccessStatus: 'confirmed', licenseRequirement: 'none', format: 'online', verificationStatus: 'approved' });

describe('auction expiration and public access', () => {
  it('handles timezone offsets when expiring an event', () => { expect(isAuctionEventExpired(event({ closesAt: '2026-09-01T10:00:00-05:00' }), new Date('2026-09-01T15:00:01Z'))).toBe(true); });
  it('hides expired, restricted, unknown and unapproved events by default', () => { const events = [event({ id: 'public', closesAt: '2026-09-02T00:00:00Z' }), event({ id: 'expired', closesAt: '2026-08-31T00:00:00Z' }), event({ id: 'licensed', publicEligibility: 'restricted' }), event({ id: 'unknown', publicEligibility: 'unknown' }), event({ id: 'draft', status: 'draft' })]; expect(defaultPublicEvents(events, new Date('2026-09-01T00:00:00Z')).map((item) => item.id)).toEqual(['public']); });
});

describe('source moderation and safety', () => {
  it('rejects malicious and non-HTTPS URLs', () => { expect(validateAuctionUrl('javascript:alert(1)').valid).toBe(false); expect(validateAuctionUrl('http://auction.example.gov').valid).toBe(false); expect(validateAuctionUrl('https://auction.example.gov/path').valid).toBe(true); });
  it('requires a moderator or administrator to approve sources', () => { expect(canApproveAuctionSource('user')).toBe(false); expect(canApproveAuctionSource('auction_moderator')).toBe(true); expect(canApproveAuctionSource('administrator')).toBe(true); });
  it('detects duplicate source URLs after normalization', () => { expect(findDuplicateSource({ officialSourceUrl: 'https://EXAMPLE.gov/auctions/?tracking=1' }, [source('https://example.gov/auctions')])?.id).toBe('s1'); });
  it('creates stable event duplicate keys', () => { expect(eventDuplicateKey(event({ title: '  CITY   FLEET SALE ' }))).toBe(eventDuplicateKey(event({ title: 'city fleet sale' }))); });
});

describe('marketplace separation', () => {
  it('prevents auction entries from becoming owner listings', () => { expect(() => assertAuctionNotOwnerListing({ recordType: 'owner_listing' })).toThrow(/cannot be published/); expect(() => assertAuctionNotOwnerListing({ recordType: 'auction_event' })).not.toThrow(); });
  it('never accepts bids or auction payments', () => { expect(acceptsAuctionPaymentOnPlatform()).toBe(false); });
});

describe('independent auction options', () => {
  it('classifies AutoBidMaster separately and stores a clean canonical URL', () => {
    const autoBidMaster = independentAuctionSources.find((item) => item.id === 'autobidmaster');
    expect(autoBidMaster?.sourceType).toBe('independent-broker');
    expect(autoBidMaster?.officialUrl).toBe('https://www.autobidmaster.com/en/');
    expect(autoBidMaster?.agency).toMatch(/independent third-party/i);
  });
});
