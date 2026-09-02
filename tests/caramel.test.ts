import { describe, expect, it } from 'vitest';

import {
  CARAMEL_FEES_URL,
  CARAMEL_HOW_IT_WORKS_URL,
  CARAMEL_START_URL,
  caramelFeeSummary,
} from '@/lib/caramel';

describe('Caramel checkout links', () => {
  it('uses direct official Caramel HTTPS pages', () => {
    for (const value of [
      CARAMEL_FEES_URL,
      CARAMEL_HOW_IT_WORKS_URL,
      CARAMEL_START_URL,
    ]) {
      const url = new URL(value);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('www.drivecaramel.com');
    }
  });

  it('matches the published base fee tiers', () => {
    expect(caramelFeeSummary).toEqual({
      buyerSelfService: 95,
      buyerFullService: 195,
      buyerPossibleMaximum: 295,
      sellerException: 95,
    });
  });
});
