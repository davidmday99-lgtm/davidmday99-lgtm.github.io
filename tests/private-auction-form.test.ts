import { describe, expect, it } from 'vitest';

import {
  emptyPrivateAuctionDraft,
  normalizeVin,
  validateAuctionReserve,
  validateAuctionStory,
  validateAuctionTerms,
  validateAuctionVehicle,
} from '@/lib/private-auction-form';

describe('private auction setup validation', () => {
  it('normalizes VIN input and rejects forbidden VIN letters', () => {
    expect(normalizeVin('1hg-cm82633a004352')).toBe('1HGCM82633A004352');
    expect(
      validateAuctionVehicle(
        {
          ...emptyPrivateAuctionDraft,
          vin: '1HGCM82633A00O352',
          mileage: '48000',
          year: '2020',
          makeModel: 'Honda Accord',
        },
        2027,
      ).vin,
    ).toMatch(/valid 17-character VIN/);
  });

  it('requires complete auction terms and a lien-release explanation', () => {
    const errors = validateAuctionTerms({
      ...emptyPrivateAuctionDraft,
      startingBid: '5000',
      locationZip: '45202',
      titleStatus: 'Clean',
      lienStatus: 'Active lien',
      lienDetails: 'Will handle it',
    });

    expect(errors.startingBid).toBeUndefined();
    expect(errors.locationZip).toBeUndefined();
    expect(errors.lienDetails).toMatch(/paid and released/);
  });

  it('keeps a private reserve at or above the starting bid', () => {
    expect(
      validateAuctionReserve({
        ...emptyPrivateAuctionDraft,
        startingBid: '5000',
        hasReserve: true,
        reserveAmount: '4500',
      }).reserveAmount,
    ).toMatch(/at least as high/);
  });

  it('requires a useful seller story and at least six photos', () => {
    const errors = validateAuctionStory(
      { ...emptyPrivateAuctionDraft, description: 'Too short' },
      5,
    );

    expect(errors.description).toMatch(/at least 80 characters/);
    expect(errors.photos).toMatch(/at least 6/);
  });
});
