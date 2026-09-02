import { describe, expect, it } from 'vitest';

import {
  maskPhoneNumber,
  normalizePhoneNumber,
  phoneVerificationError,
} from '@/lib/phone-verification';

describe('phone verification helpers', () => {
  it('normalizes common US phone formats to E.164', () => {
    expect(normalizePhoneNumber('(941) 555-1234')).toBe('+19415551234');
    expect(normalizePhoneNumber('1-941-555-1234')).toBe('+19415551234');
  });

  it('accepts international E.164 input and rejects incomplete numbers', () => {
    expect(normalizePhoneNumber('+44 20 7946 0958')).toBe('+442079460958');
    expect(() => normalizePhoneNumber('555-1234')).toThrow(/valid mobile/i);
  });

  it('masks confirmed numbers and turns provider errors into useful copy', () => {
    expect(maskPhoneNumber('+19415551234')).toContain('1234');
    expect(phoneVerificationError('Unsupported phone provider')).toContain(
      'SMS verification is not active',
    );
  });
});
