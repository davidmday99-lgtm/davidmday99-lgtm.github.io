import type { VehicleType } from '@/lib/vehicle-types';

export type WantedVehicleAdRow = {
  id: string;
  user_id: string;
  vehicle_type: VehicleType;
  make: string | null;
  model: string | null;
  year_min: number | null;
  year_max: number | null;
  max_budget: number | null;
  location_public: string;
  search_distance: '25' | '50' | '100' | 'nationwide';
  description: string;
  status: 'published' | 'removed';
  expires_at: string;
  created_at: string;
};

export type WantedVehicleDraft = {
  vehicleType: VehicleType;
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  maxBudget: string;
  locationPublic: string;
  searchDistance: '25' | '50' | '100' | 'nationwide';
  description: string;
};

export const emptyWantedVehicleDraft: WantedVehicleDraft = {
  vehicleType: 'car',
  make: '',
  model: '',
  yearMin: '',
  yearMax: '',
  maxBudget: '',
  locationPublic: '',
  searchDistance: '50',
  description: '',
};

export function wantedVehicleDraftError(draft: WantedVehicleDraft) {
  const yearMin = draft.yearMin ? Number(draft.yearMin) : undefined;
  const yearMax = draft.yearMax ? Number(draft.yearMax) : undefined;
  const maxBudget = draft.maxBudget ? Number(draft.maxBudget) : undefined;

  if (yearMin !== undefined && (yearMin < 1900 || yearMin > 2100)) {
    return 'Enter a starting year between 1900 and 2100.';
  }
  if (yearMax !== undefined && (yearMax < 1900 || yearMax > 2100)) {
    return 'Enter an ending year between 1900 and 2100.';
  }
  if (yearMin !== undefined && yearMax !== undefined && yearMin > yearMax) {
    return 'The starting year cannot be later than the ending year.';
  }
  if (maxBudget !== undefined && (maxBudget < 0 || maxBudget > 10_000_000)) {
    return 'Enter a maximum budget between $0 and $10,000,000.';
  }
  if (draft.locationPublic.trim().length < 2) {
    return 'Enter the city, state, or ZIP code where you are searching.';
  }
  const descriptionLength = draft.description.trim().length;
  if (descriptionLength < 20 || descriptionLength > 1500) {
    return 'Describe what you want in 20 to 1,500 characters.';
  }
  return undefined;
}

export function wantedYearLabel(ad: WantedVehicleAdRow) {
  if (ad.year_min && ad.year_max && ad.year_min !== ad.year_max) {
    return `${ad.year_min}–${ad.year_max}`;
  }
  if (ad.year_min) return `${ad.year_min} or newer`;
  if (ad.year_max) return `${ad.year_max} or older`;
  return 'Any year';
}

export function wantedBudgetLabel(maxBudget: number | null) {
  if (maxBudget === null) return 'Budget open';
  return `Up to $${maxBudget.toLocaleString('en-US')}`;
}
