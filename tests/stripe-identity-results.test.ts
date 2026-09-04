import { describe, expect, it } from 'vitest';

import {
  stripeVerificationSessionUrl,
  verifiedLegalName,
} from '@/supabase/functions/create-identity-verification/stripe-identity';

describe('Stripe Identity result handling', () => {
  it('requests expanded verified outputs when retrieving a session', () => {
    const url = new URL(stripeVerificationSessionUrl('vs_test/example'));

    expect(url.pathname).toContain('vs_test%2Fexample');
    expect(url.searchParams.get('expand[]')).toBe('verified_outputs');
  });

  it('stores only a normalized verified legal name', () => {
    expect(
      verifiedLegalName({ first_name: '  David ', last_name: ' Day  ' }),
    ).toBe('David Day');
    expect(verifiedLegalName(null)).toBeNull();
  });
});
