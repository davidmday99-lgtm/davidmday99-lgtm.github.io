import { describe, expect, it } from 'vitest';

import {
  getVehicleType,
  isValidVehicleIdentifier,
  vehicleTypes,
} from '@/lib/vehicle-types';

describe('vehicle categories', () => {
  it('supports every launch expansion category', () => {
    expect(vehicleTypes.map(({ value }) => value)).toEqual([
      'car',
      'motorcycle',
      'boat',
      'atv_utv',
      'rv_camper',
      'trailer',
      'snowmobile',
      'personal_watercraft',
    ]);
  });

  it('uses category-specific styles and usage labels', () => {
    expect(getVehicleType('boat').usageUnit).toBe('hours');
    expect(getVehicleType('boat').styles).toContain('Pontoon');
    expect(getVehicleType('rv_camper').styles).toContain('Class A');
    expect(getVehicleType('trailer').styles).toContain('Car hauler');
    expect(getVehicleType('snowmobile').styles).toContain('Vintage');
    expect(getVehicleType('personal_watercraft').usageUnit).toBe('hours');
  });

  it('validates road VINs, boat HINs, and trailer serials separately', () => {
    expect(isValidVehicleIdentifier('car', '1HGCM82633A004352')).toBe(true);
    expect(isValidVehicleIdentifier('boat', 'ABC12345D404')).toBe(true);
    expect(isValidVehicleIdentifier('trailer', 'TR-123456')).toBe(true);
    expect(isValidVehicleIdentifier('snowmobile', 'SNOW-123456')).toBe(true);
    expect(
      isValidVehicleIdentifier('personal_watercraft', 'ABC12345D404'),
    ).toBe(true);
    expect(isValidVehicleIdentifier('boat', 'TOO-SHORT')).toBe(false);
  });

  it('falls back to cars for older records without a category', () => {
    expect(getVehicleType(undefined).value).toBe('car');
  });
});
