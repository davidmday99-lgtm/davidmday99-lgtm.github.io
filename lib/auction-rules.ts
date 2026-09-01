import type { AuctionEventRecord, AuctionSourceRecord } from '@/lib/auction-types';

const blockedProtocols = new Set(['javascript:', 'data:', 'file:', 'ftp:']);

export function validateAuctionUrl(value: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(value);
    if (blockedProtocols.has(parsed.protocol) || parsed.protocol !== 'https:') return { valid: false, reason: 'Auction URLs must use HTTPS.' };
    if (!parsed.hostname.includes('.') || parsed.username || parsed.password) return { valid: false, reason: 'Auction URL host or credentials are invalid.' };
    return { valid: true };
  } catch { return { valid: false, reason: 'Auction URL is malformed.' }; }
}

export function isAuctionEventExpired(event: Pick<AuctionEventRecord, 'closesAt'>, now = new Date()): boolean {
  if (!event.closesAt) return false;
  const closing = new Date(event.closesAt);
  return Number.isFinite(closing.getTime()) && closing.getTime() <= now.getTime();
}

export function defaultPublicEvents(events: AuctionEventRecord[], now = new Date()): AuctionEventRecord[] {
  return events.filter((event) => event.status === 'approved' && event.publicEligibility === 'confirmed' && !isAuctionEventExpired(event, now));
}

export function normalizeSourceUrl(value: string): string {
  const parsed = new URL(value);
  parsed.hash = '';
  parsed.search = '';
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.pathname = parsed.pathname.replace(/\/$/, '');
  return parsed.toString().replace(/\/$/, '');
}

export function findDuplicateSource(candidate: Pick<AuctionSourceRecord, 'officialSourceUrl'>, existing: AuctionSourceRecord[]) {
  const normalized = normalizeSourceUrl(candidate.officialSourceUrl);
  return existing.find((source) => normalizeSourceUrl(source.officialSourceUrl) === normalized);
}

export function eventDuplicateKey(event: Pick<AuctionEventRecord, 'sourceId' | 'title' | 'startsAt' | 'closesAt'>): string {
  return [event.sourceId, event.title.trim().toLowerCase().replaceAll(/\s+/g, ' '), event.startsAt ?? '', event.closesAt ?? ''].join('|');
}

export function canApproveAuctionSource(role: string): boolean { return role === 'auction_moderator' || role === 'administrator'; }

export function assertAuctionNotOwnerListing(record: { recordType: string }) {
  if (record.recordType === 'owner_listing') throw new Error('Auction entries cannot be published as verified private-owner listings.');
}

export function acceptsAuctionPaymentOnPlatform() { return false; }
