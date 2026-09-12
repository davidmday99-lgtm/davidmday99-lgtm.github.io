import type { DemoListing } from '@/lib/demo-data';
import { isVehicleType, type VehicleType } from '@/lib/vehicle-types';

export type ListingFilters = {
  type?: VehicleType;
  query: string;
  distance: string;
  price: string;
  year: string;
  mileage: string;
  engineSize: string;
  make: string;
  model: string;
  bodyStyle: string;
  transmission: string;
  fuel: string;
  drivetrain: string;
  titleStatus: string;
};

export const emptyListingFilters: ListingFilters = {
  query: '',
  distance: '50',
  price: '',
  year: '',
  mileage: '',
  engineSize: '',
  make: '',
  model: '',
  bodyStyle: '',
  transmission: '',
  fuel: '',
  drivetrain: '',
  titleStatus: '',
};

export function listingFiltersFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const requestedType = params.get('type');

  return {
    type: isVehicleType(requestedType) ? requestedType : undefined,
    query: params.get('q')?.trim() ?? '',
    distance: params.get('distance') ?? '50',
    price: params.get('price') ?? '',
    year: params.get('year') ?? '',
    mileage: params.get('mileage') ?? '',
    engineSize: params.get('engineSize')?.trim() ?? '',
    make: params.get('make') ?? '',
    model: params.get('model') ?? '',
    bodyStyle: params.get('bodyStyle') ?? '',
    transmission: params.get('transmission') ?? '',
    fuel: params.get('fuel') ?? '',
    drivetrain: params.get('drivetrain') ?? '',
    titleStatus: params.get('titleStatus') ?? '',
  } satisfies ListingFilters;
}

function equalText(left: string | undefined, right: string) {
  return (left ?? '').localeCompare(right, undefined, {
    sensitivity: 'accent',
  }) === 0;
}

function matchesPrice(price: number, range: string) {
  if (!range) return true;
  if (range === 'under-5000') return price < 5000;
  if (range === '5000-10000') return price >= 5000 && price <= 10000;
  if (range === '10000-20000') return price > 10000 && price <= 20000;
  if (range === '20000-30000') return price > 20000 && price <= 30000;
  if (range === '30000-50000') return price > 30000 && price <= 50000;
  if (range === '50000-plus') return price > 50000;
  return true;
}

export function filterListings(
  listings: DemoListing[],
  filters: ListingFilters,
) {
  const query = filters.query.toLocaleLowerCase();
  const maximumMileage = Number(filters.mileage);
  const maximumDistance = Number(filters.distance);

  return listings.filter((listing) => {
    if (filters.type && (listing.vehicleType ?? 'car') !== filters.type)
      return false;
    if (
      query &&
      ![
        listing.year,
        listing.name,
        listing.make,
        listing.model,
        listing.bodyStyle,
        listing.engineSize,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()
        .includes(query)
    )
      return false;
    if (!matchesPrice(listing.price, filters.price)) return false;
    if (filters.year && String(listing.year) !== filters.year) return false;
    if (maximumMileage > 0 && listing.mileage > maximumMileage) return false;
    if (
      filters.engineSize &&
      !equalText(listing.engineSize, filters.engineSize)
    )
      return false;
    if (filters.make && !equalText(listing.make, filters.make)) return false;
    if (filters.model && !equalText(listing.model, filters.model)) return false;
    if (filters.bodyStyle && !equalText(listing.bodyStyle, filters.bodyStyle))
      return false;
    if (
      filters.transmission &&
      !equalText(listing.transmission, filters.transmission)
    )
      return false;
    if (filters.fuel && !equalText(listing.fuel, filters.fuel)) return false;
    if (
      filters.drivetrain &&
      !equalText(listing.drivetrain, filters.drivetrain)
    )
      return false;
    if (
      filters.titleStatus &&
      !equalText(listing.titleStatus, filters.titleStatus)
    )
      return false;
    if (
      filters.distance !== 'nationwide' &&
      maximumDistance > 0 &&
      listing.distance > 0 &&
      listing.distance > maximumDistance
    )
      return false;
    return true;
  });
}

export function uniqueListingValues(
  listings: DemoListing[],
  field:
    | 'make'
    | 'model'
    | 'bodyStyle'
    | 'transmission'
    | 'fuel'
    | 'drivetrain'
    | 'titleStatus'
    | 'engineSize',
) {
  return [...new Set(listings.map((listing) => listing[field]).filter(Boolean))]
    .map(String)
    .sort((left, right) => left.localeCompare(right));
}
