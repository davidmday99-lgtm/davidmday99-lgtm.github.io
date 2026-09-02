import { describe, expect, it } from 'vitest';

import { getSafeAuthReturnTo, loginPath } from '@/lib/auth-return';

describe('authentication return paths', () => {
  it('returns a signed-in visitor to the requested Owner Only Cars page', () => {
    expect(getSafeAuthReturnTo('?returnTo=%2Faccount%2Fverification')).toBe(
      '/account/verification',
    );
    expect(loginPath('/account/verification')).toBe(
      '/login?returnTo=%2Faccount%2Fverification',
    );
  });

  it('rejects external and protocol-relative redirects', () => {
    expect(getSafeAuthReturnTo('?returnTo=https://example.com')).toBe(
      '/dashboard',
    );
    expect(getSafeAuthReturnTo('?returnTo=%2F%2Fevil.example')).toBe(
      '/dashboard',
    );
  });
});
