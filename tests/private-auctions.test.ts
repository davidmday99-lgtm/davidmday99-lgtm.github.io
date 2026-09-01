import { describe, expect, it } from 'vitest';

import { nextMinimumBid, reserveLabel } from '@/lib/private-auction-data';

describe('private seller auction rules', () => {
  it('calculates the next eligible bid from the fixed increment', () => {
    expect(nextMinimumBid(21_800, 250)).toBe(22_050);
  });

  it('never exposes a reserve dollar amount through the public label', () => {
    expect(reserveLabel('met')).toBe('Reserve met');
    expect(reserveLabel('not-met')).toBe('Reserve not met');
    expect(reserveLabel('none')).toBe('No reserve');
  });
});
