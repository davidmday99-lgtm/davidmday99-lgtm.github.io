export function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;

  throw new Error(
    'Enter a valid mobile number, including the country code when outside the United States.',
  );
}

export function maskPhoneNumber(value?: string | null) {
  if (!value) return 'Mobile number confirmed.';

  const digits = value.replace(/\D/g, '');
  const ending = digits.slice(-4);
  return ending
    ? `Mobile number ending in ${ending} confirmed.`
    : 'Mobile number confirmed.';
}

export function phoneVerificationError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes('phone provider') ||
    normalized.includes('sms provider') ||
    normalized.includes('unsupported phone')
  ) {
    return 'SMS verification is not active yet. The marketplace owner must connect an SMS provider in Supabase.';
  }

  if (
    normalized.includes('rate limit') ||
    normalized.includes('security purposes')
  ) {
    return 'Please wait before requesting another verification code.';
  }

  if (normalized.includes('expired') || normalized.includes('invalid')) {
    return 'That verification code is invalid or expired. Request a new code and try again.';
  }

  return 'Phone verification could not be completed. Please try again.';
}
