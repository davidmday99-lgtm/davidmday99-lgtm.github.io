import type { VehicleType } from '@/lib/vehicle-types';

const literSizes = [
  'Electric motor',
  '1.0L',
  '1.2L',
  '1.3L',
  '1.4L',
  '1.5L',
  '1.6L',
  '1.8L',
  '2.0L',
  '2.3L',
  '2.4L',
  '2.5L',
  '2.7L',
  '3.0L',
  '3.3L',
  '3.5L',
  '3.6L',
  '3.8L',
  '4.0L',
  '4.3L',
  '4.6L',
  '4.8L',
  '5.0L',
  '5.3L',
  '5.7L',
  '6.0L',
  '6.2L',
  '6.4L',
  '6.6L',
  '6.7L',
  '7.0L',
  '8.0L or larger',
];

const powersportSizes = [
  'Electric motor',
  '49cc',
  '50cc',
  '90cc',
  '110cc',
  '125cc',
  '150cc',
  '200cc',
  '250cc',
  '300cc',
  '350cc',
  '400cc',
  '450cc',
  '500cc',
  '600cc',
  '650cc',
  '700cc',
  '750cc',
  '800cc',
  '850cc',
  '900cc',
  '1000cc',
  '1100cc',
  '1200cc',
  '1300cc',
  '1400cc or larger',
];

const boatPowerSizes = [
  'No engine',
  'Electric motor',
  'Under 10 hp',
  '10 hp',
  '25 hp',
  '40 hp',
  '50 hp',
  '60 hp',
  '75 hp',
  '90 hp',
  '115 hp',
  '150 hp',
  '175 hp',
  '200 hp',
  '225 hp',
  '250 hp',
  '300 hp',
  '350 hp',
  '400 hp',
  '450 hp',
  '500 hp or more',
];

const categoryEngineSizes: Record<VehicleType, readonly string[]> = {
  car: literSizes,
  motorcycle: powersportSizes,
  boat: boatPowerSizes,
  atv_utv: powersportSizes,
  rv_camper: ['Not applicable (towable/no engine)', ...literSizes],
  trailer: ['Not applicable (no engine)'],
  snowmobile: powersportSizes,
  personal_watercraft: powersportSizes,
};

export function engineSizeSuggestions(type?: VehicleType) {
  const values = type
    ? categoryEngineSizes[type]
    : Object.values(categoryEngineSizes).flat();
  return [...new Set(values)].sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true }),
  );
}
