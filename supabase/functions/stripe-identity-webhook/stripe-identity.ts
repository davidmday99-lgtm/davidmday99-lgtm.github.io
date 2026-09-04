export type StripeVerifiedOutputs = {
  first_name?: string | null;
  last_name?: string | null;
} | null;

export function stripeVerificationSessionUrl(sessionId: string) {
  const url = new URL(
    `https://api.stripe.com/v1/identity/verification_sessions/${encodeURIComponent(sessionId)}`,
  );
  url.searchParams.append('expand[]', 'verified_outputs');
  return url.toString();
}

export function verifiedLegalName(outputs: StripeVerifiedOutputs) {
  const name = [outputs?.first_name, outputs?.last_name]
    .filter(
      (part): part is string =>
        typeof part === 'string' && Boolean(part.trim()),
    )
    .map((part) => part.trim())
    .join(' ');

  return name || null;
}
