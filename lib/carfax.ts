export const CARFAX_REPORTS_URL = 'https://www.carfax.com/vehicle-history-reports/';

export type CarfaxUrlValidation =
  | { valid: true; normalizedUrl: string | null }
  | { valid: false; normalizedUrl: null; message: string };

export function validateSellerCarfaxUrl(value: string): CarfaxUrlValidation {
  const candidate = value.trim();

  if (!candidate) {
    return { valid: true, normalizedUrl: null };
  }

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase();
    const isCarfaxDomain = hostname === 'carfax.com' || hostname.endsWith('.carfax.com');

    if (url.protocol !== 'https:' || !isCarfaxDomain || url.username || url.password) {
      return {
        valid: false,
        normalizedUrl: null,
        message: 'Use a secure report link hosted on carfax.com.',
      };
    }

    return { valid: true, normalizedUrl: url.toString() };
  } catch {
    return {
      valid: false,
      normalizedUrl: null,
      message: 'Enter the complete CARFAX link, including https://.',
    };
  }
}
