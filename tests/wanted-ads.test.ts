import { describe, expect, it } from 'vitest';

import {
  emptyWantedVehicleDraft,
  wantedBudgetLabel,
  wantedDraftFromAd,
  wantedVehicleDraftError,
  wantedYearLabel,
  type WantedVehicleAdRow,
} from '@/lib/wanted-ads';

const ad: WantedVehicleAdRow = {
  id: 'ad-1',
  user_id: 'user-1',
  vehicle_type: 'car',
  make: 'Jeep',
  model: 'Grand Cherokee',
  year_min: 2018,
  year_max: 2022,
  max_budget: 25_000,
  location_public: 'St. Louis, MO',
  search_distance: '100',
  description: 'Looking for a clean-title SUV with service records.',
  status: 'published',
  expires_at: '2026-12-01T00:00:00.000Z',
  created_at: '2026-09-12T00:00:00.000Z',
};

describe('wanted vehicle ads', () => {
  it('validates the required public location and description', () => {
    expect(wantedVehicleDraftError(emptyWantedVehicleDraft)).toMatch(
      /city, state, or ZIP code/,
    );
    expect(
      wantedVehicleDraftError({
        ...emptyWantedVehicleDraft,
        locationPublic: 'St. Louis, MO',
        description: 'Looking for a clean SUV with service records.',
      }),
    ).toBeUndefined();
  });

  it('rejects a reversed year range', () => {
    expect(
      wantedVehicleDraftError({
        ...emptyWantedVehicleDraft,
        locationPublic: '63303',
        description: 'Looking for a clean SUV with service records.',
        yearMin: '2024',
        yearMax: '2020',
      }),
    ).toMatch(/starting year/);
  });

  it('formats the public search summary', () => {
    expect(wantedYearLabel(ad)).toBe('2018–2022');
    expect(wantedBudgetLabel(ad.max_budget)).toBe('Up to $25,000');
  });

  it('loads an existing ad into the edit form without losing values', () => {
    expect(wantedDraftFromAd(ad)).toMatchObject({
      vehicleType: 'car',
      make: 'Jeep',
      model: 'Grand Cherokee',
      yearMin: '2018',
      yearMax: '2022',
      maxBudget: '25000',
      locationPublic: 'St. Louis, MO',
      searchDistance: '100',
    });
  });
});
