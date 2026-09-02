export type PrivateAuctionDraft = {
  vin: string;
  mileage: string;
  year: string;
  makeModel: string;
  startingBid: string;
  auctionLength: '3' | '5' | '7';
  locationZip: string;
  titleStatus: string;
  lienStatus: string;
  lienDetails: string;
  hasReserve: boolean;
  reserveAmount: string;
  description: string;
  carfaxUrl: string;
};

export type AuctionValidationErrors = Record<string, string>;

export const emptyPrivateAuctionDraft: PrivateAuctionDraft = {
  vin: '',
  mileage: '',
  year: '',
  makeModel: '',
  startingBid: '',
  auctionLength: '7',
  locationZip: '',
  titleStatus: '',
  lienStatus: '',
  lienDetails: '',
  hasReserve: false,
  reserveAmount: '',
  description: '',
  carfaxUrl: '',
};

const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVin(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 17);
}

export function validateAuctionVehicle(
  draft: PrivateAuctionDraft,
  latestYear = new Date().getFullYear() + 1,
): AuctionValidationErrors {
  const errors: AuctionValidationErrors = {};
  const mileage = Number(draft.mileage);
  const year = Number(draft.year);

  if (!vinPattern.test(normalizeVin(draft.vin))) {
    errors.vin = 'Enter a valid 17-character VIN without I, O, or Q.';
  }
  if (
    !draft.mileage ||
    !Number.isInteger(mileage) ||
    mileage < 0 ||
    mileage > 2_000_000
  ) {
    errors.mileage = 'Enter the current whole-number mileage.';
  }
  if (
    !draft.year ||
    !Number.isInteger(year) ||
    year < 1900 ||
    year > latestYear
  ) {
    errors.year = `Enter a model year from 1900 through ${latestYear}.`;
  }
  if (draft.makeModel.trim().length < 3) {
    errors.makeModel = 'Enter the vehicle make and model.';
  }

  return errors;
}

export function validateAuctionTerms(
  draft: PrivateAuctionDraft,
): AuctionValidationErrors {
  const errors: AuctionValidationErrors = {};
  const startingBid = Number(draft.startingBid);

  if (
    !draft.startingBid ||
    !Number.isFinite(startingBid) ||
    startingBid < 100 ||
    startingBid > 2_000_000
  ) {
    errors.startingBid = 'Enter a starting bid between $100 and $2,000,000.';
  }
  if (!['3', '5', '7'].includes(draft.auctionLength)) {
    errors.auctionLength = 'Choose a 3-, 5-, or 7-day auction.';
  }
  if (!/^\d{5}$/.test(draft.locationZip)) {
    errors.locationZip =
      'Enter a 5-digit ZIP code. Only an approximate location is public.';
  }
  if (!draft.titleStatus) {
    errors.titleStatus = 'Choose the current title status.';
  }
  if (!draft.lienStatus) {
    errors.lienStatus = 'Choose the current lien status.';
  }
  if (
    draft.lienStatus === 'Active lien' &&
    draft.lienDetails.trim().length < 20
  ) {
    errors.lienDetails =
      'Explain how the lien will be paid and released before the vehicle changes hands.';
  }

  return errors;
}

export function validateAuctionReserve(
  draft: PrivateAuctionDraft,
): AuctionValidationErrors {
  if (!draft.hasReserve) return {};

  const reserve = Number(draft.reserveAmount);
  const startingBid = Number(draft.startingBid);

  if (
    !draft.reserveAmount ||
    !Number.isFinite(reserve) ||
    reserve < startingBid
  ) {
    return {
      reserveAmount:
        'The reserve must be at least as high as the starting bid.',
    };
  }
  if (reserve > 2_000_000) {
    return { reserveAmount: 'The reserve cannot exceed $2,000,000.' };
  }

  return {};
}

export function validateAuctionStory(
  draft: PrivateAuctionDraft,
  photoCount: number,
): AuctionValidationErrors {
  const errors: AuctionValidationErrors = {};

  if (draft.description.trim().length < 80) {
    errors.description =
      'Describe the vehicle, maintenance, condition, and known flaws in at least 80 characters.';
  }
  if (photoCount < 6) {
    errors.photos = `Add at least 6 current vehicle photos (${photoCount} selected).`;
  }

  return errors;
}

export function validateAuctionOwnership(
  hasDocument: boolean,
): AuctionValidationErrors {
  if (hasDocument) return {};
  return {
    ownershipDocument: 'Add a current title or registration document.',
  };
}

export function formatAuctionMoney(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount)
    : 'Not entered';
}
