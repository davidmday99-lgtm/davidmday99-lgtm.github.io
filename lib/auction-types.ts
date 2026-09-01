export type AuctionSourceRecord = {
  id: string;
  sourceName: string;
  agencyOrAuthorizedContractor: string;
  officialSourceUrl: string;
  termsAndRegistrationUrl: string;
  sourceCategory: string;
  statesServed: string[];
  publicAccessStatus: 'confirmed' | 'restricted' | 'unknown';
  licenseRequirement: 'none' | 'dealer' | 'salvage' | 'dismantler' | 'unknown';
  format: 'online' | 'in-person' | 'hybrid';
  verificationStatus: 'pending' | 'approved' | 'retired';
  lastSuccessfullyCheckedAt?: string;
  nextScheduledReviewAt?: string;
  internalModerationNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
};

export type AuctionEventRecord = {
  id: string;
  title: string;
  sourceId: string;
  startsAt?: string;
  closesAt?: string;
  timezone?: string;
  physicalLocation?: string;
  state: string;
  onlineBiddingUrl?: string;
  registrationDeadline?: string;
  publicEligibility: 'confirmed' | 'restricted' | 'unknown';
  deposit?: string;
  buyerPremium?: string;
  acceptedPaymentMethods?: string[];
  inspectionDates?: string[];
  vehicleCategories?: string[];
  titleStatusInformation?: string;
  sourceUrl: string;
  lastUpdatedAt: string;
  status: 'draft' | 'approved' | 'expired' | 'retired';
};

export type AuctionLocationRecord = { id: string; sourceId: string; state: string; city?: string; postalCode?: string; timezone: string; approximateLatitude?: number; approximateLongitude?: number };
export type AuctionVehicleRecord = { id: string; eventId: string; sourceVehicleId?: string; vin?: string; year?: number; make?: string; model?: string; category?: string; titleStatus?: string; sourceUrl: string; lastUpdatedAt: string };
export type SourceVerificationLogRecord = { id: string; sourceId: string; checkedAt: string; checkedBy: string; outcome: 'passed' | 'changed' | 'broken' | 'blocked'; notes?: string };
export type SourceChangeAlertRecord = { id: string; sourceId: string; detectedAt: string; changeType: 'url' | 'terms' | 'access' | 'license' | 'schedule' | 'other'; status: 'open' | 'reviewing' | 'resolved'; summary: string };
export type StateAuctionGuideRecord = { id: string; state: string; slug: string; usefulContent: string; status: 'draft' | 'published' | 'retired'; lastReviewedAt?: string; reviewedBy?: string };
