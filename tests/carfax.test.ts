import { describe, expect, it } from 'vitest';

import { validateSellerCarfaxUrl } from '@/lib/carfax';

describe('seller CARFAX link validation', () => {
  it('accepts an empty optional value', () => {
    expect(validateSellerCarfaxUrl('')).toEqual({ valid: true, normalizedUrl: null });
  });

  it('accepts secure CARFAX domains and subdomains', () => {
    expect(validateSellerCarfaxUrl('https://www.carfax.com/vehicle-history-reports/').valid).toBe(true);
    expect(validateSellerCarfaxUrl('https://secure.carfax.com/report/example').valid).toBe(true);
  });

  it('rejects insecure or lookalike links', () => {
    expect(validateSellerCarfaxUrl('http://www.carfax.com/report').valid).toBe(false);
    expect(validateSellerCarfaxUrl('https://carfax.com.example.com/report').valid).toBe(false);
    expect(validateSellerCarfaxUrl('https://fakecarfax.com/report').valid).toBe(false);
  });
});
