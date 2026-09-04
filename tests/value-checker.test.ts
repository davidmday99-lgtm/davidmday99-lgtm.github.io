import { describe, expect, it } from 'vitest';

import { compareVehicleValue, parseDollarInput } from '@/lib/value-checker';

describe('value comparison', () => {
  it('accepts common currency formatting', () => {
    expect(parseDollarInput('$22,400')).toBe(22400);
    expect(parseDollarInput(' 23100 ')).toBe(23100);
    expect(parseDollarInput('not a value')).toBeNull();
  });

  it('compares an asking price with the KBB guide value', () => {
    expect(compareVehicleValue('$22,400', '$22,900')).toEqual({
      guideValue: 22400,
      askingPrice: 22900,
      askingDifference: 500,
      askingDifferencePercent: 2,
      askingPricePosition: 'above-guide',
    });
  });

  it('does not produce a comparison without a KBB value', () => {
    expect(compareVehicleValue('', '$22,900')).toBeNull();
  });
});
