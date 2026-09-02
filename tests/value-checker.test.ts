import { describe, expect, it } from 'vitest';

import { compareVehicleValues, parseDollarInput } from '@/lib/value-checker';

describe('value comparison', () => {
  it('accepts common currency formatting', () => {
    expect(parseDollarInput('$22,400')).toBe(22400);
    expect(parseDollarInput(' 23100 ')).toBe(23100);
    expect(parseDollarInput('not a value')).toBeNull();
  });

  it('calculates a two-guide range and midpoint', () => {
    expect(compareVehicleValues('$22,400', '$23,100', '$22,900')).toEqual({
      low: 22400,
      high: 23100,
      midpoint: 22750,
      spread: 700,
      spreadPercent: 3,
      askingPrice: 22900,
      askingDifference: 150,
      askingDifferencePercent: 1,
      askingPricePosition: 'within-range',
    });
  });

  it('does not produce a comparison without both sources', () => {
    expect(compareVehicleValues('$22,400', '')).toBeNull();
  });
});

