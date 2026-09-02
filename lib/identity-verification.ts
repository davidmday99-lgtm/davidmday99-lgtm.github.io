export type IdentityStatus =
  | 'not_started'
  | 'requires_input'
  | 'processing'
  | 'verified'
  | 'canceled'
  | 'redacted';

export function normalizeIdentityStatus(value: unknown): IdentityStatus {
  if (
    value === 'requires_input' ||
    value === 'processing' ||
    value === 'verified' ||
    value === 'canceled' ||
    value === 'redacted'
  ) {
    return value;
  }

  return 'not_started';
}

export function identityFailureMessage(value: unknown) {
  switch (value) {
    case 'document_expired':
      return 'The ID is expired. Please use a current government-issued ID.';
    case 'document_unverified_other':
      return 'Stripe could not verify that ID. Please try again with a clear image of another accepted ID.';
    case 'document_type_not_supported':
      return 'That document type is not supported. Please use an accepted government-issued ID.';
    case 'document_too_large':
      return 'The ID image is too large. Please retake it and try again.';
    case 'document_missing_back':
      return 'The back of the ID is still needed. Please reopen the check and submit both sides.';
    case 'document_missing_front':
      return 'The front of the ID is still needed. Please reopen the check and submit both sides.';
    case 'document_not_readable':
      return 'The ID image was not clear enough to read. Retake it in good light with all four corners visible.';
    case 'document_failed_greyscale':
      return 'Please submit a color image of the original ID.';
    case 'document_failed_copy':
      return 'Please submit a photo of the original ID rather than a copy or screenshot.';
    case 'document_failed_other':
      return 'Stripe could not confirm the document. Please retake clear images and try again.';
    default:
      return undefined;
  }
}

export function canRetryIdentity(status: IdentityStatus) {
  return (
    status === 'not_started' ||
    status === 'requires_input' ||
    status === 'canceled' ||
    status === 'redacted'
  );
}

export function canStartSellerListing(status: IdentityStatus) {
  return status === 'verified';
}
