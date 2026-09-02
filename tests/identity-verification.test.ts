import { describe, expect, it } from 'vitest';

import {
  canRetryIdentity,
  identityFailureMessage,
  normalizeIdentityStatus,
} from '@/lib/identity-verification';

describe('identity verification helpers', () => {
  it('keeps Stripe statuses that affect retry behavior', () => {
    expect(normalizeIdentityStatus('requires_input')).toBe('requires_input');
    expect(normalizeIdentityStatus('processing')).toBe('processing');
    expect(normalizeIdentityStatus('verified')).toBe('verified');
    expect(normalizeIdentityStatus('canceled')).toBe('canceled');
    expect(normalizeIdentityStatus('redacted')).toBe('redacted');
  });

  it('treats missing and unexpected statuses as not started', () => {
    expect(normalizeIdentityStatus(undefined)).toBe('not_started');
    expect(normalizeIdentityStatus('mystery')).toBe('not_started');
  });

  it('allows another attempt after a non-clear result', () => {
    expect(canRetryIdentity('requires_input')).toBe(true);
    expect(canRetryIdentity('canceled')).toBe(true);
    expect(canRetryIdentity('processing')).toBe(false);
    expect(canRetryIdentity('verified')).toBe(false);
  });

  it('turns Stripe failure codes into useful customer guidance', () => {
    expect(identityFailureMessage('document_not_readable')).toContain(
      'good light',
    );
    expect(identityFailureMessage('unknown_code')).toBeUndefined();
  });
});
