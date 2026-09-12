export const vehicleTypes = [
  {
    value: 'car',
    label: 'Cars',
    singular: 'car',
    identifierLabel: '17-character VIN',
    identifierPlaceholder: 'Enter the vehicle VIN',
    usageLabel: 'Mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'AWD',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
    styles: [
      'SUV',
      'Sedan',
      'Hatchback',
      'Pickup',
      'Coupe',
      'Convertible',
      'Wagon',
      'Van',
      'Other',
    ],
  },
  {
    value: 'motorcycle',
    label: 'Motorcycles',
    singular: 'motorcycle',
    identifierLabel: '17-character VIN',
    identifierPlaceholder: 'Enter the motorcycle VIN',
    usageLabel: 'Mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'Other',
      fuelType: 'Gasoline',
      transmission: 'Manual',
    },
    styles: [
      'Cruiser',
      'Sport',
      'Touring',
      'Adventure',
      'Dual-sport',
      'Scooter',
      'Dirt bike',
      'Trike',
      'Other',
    ],
  },
  {
    value: 'boat',
    label: 'Boats',
    singular: 'boat',
    identifierLabel: '12-character HIN',
    identifierPlaceholder: 'Enter the hull identification number',
    usageLabel: 'Engine hours',
    usageUnit: 'hours',
    defaults: {
      drivetrain: 'Other',
      fuelType: 'Gasoline',
      transmission: 'Other',
    },
    styles: [
      'Fishing boat',
      'Pontoon',
      'Bowrider',
      'Center console',
      'Cabin cruiser',
      'Sailboat',
      'Personal watercraft',
      'Other',
    ],
  },
  {
    value: 'atv_utv',
    label: 'ATVs & UTVs',
    singular: 'ATV or UTV',
    identifierLabel: '17-character VIN',
    identifierPlaceholder: 'Enter the ATV or UTV VIN',
    usageLabel: 'Mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'Other',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
    styles: ['ATV', 'Side-by-side / UTV', 'Utility', 'Sport', 'Youth', 'Other'],
  },
  {
    value: 'rv_camper',
    label: 'RVs & campers',
    singular: 'RV or camper',
    identifierLabel: '17-character VIN',
    identifierPlaceholder: 'Enter the RV or camper VIN',
    usageLabel: 'Mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'RWD',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
    styles: [
      'Class A',
      'Class B',
      'Class C',
      'Camper van',
      'Fifth wheel',
      'Travel trailer',
      'Truck camper',
      'Pop-up camper',
      'Other',
    ],
  },
  {
    value: 'trailer',
    label: 'Trailers',
    singular: 'trailer',
    identifierLabel: 'VIN or manufacturer serial number',
    identifierPlaceholder: 'Enter the VIN or serial number',
    usageLabel: 'Estimated mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'Not applicable',
      fuelType: 'Not applicable',
      transmission: 'Not applicable',
    },
    styles: [
      'Utility',
      'Enclosed',
      'Car hauler',
      'Boat trailer',
      'Equipment',
      'Dump',
      'Horse',
      'Other',
    ],
  },
  {
    value: 'snowmobile',
    label: 'Snowmobiles',
    singular: 'snowmobile',
    identifierLabel: 'VIN or manufacturer serial number',
    identifierPlaceholder: 'Enter the snowmobile VIN or serial number',
    usageLabel: 'Mileage',
    usageUnit: 'miles',
    defaults: {
      drivetrain: 'Other',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
    styles: [
      'Trail',
      'Touring',
      'Mountain',
      'Utility',
      'Performance',
      'Youth',
      'Vintage',
      'Other',
    ],
  },
  {
    value: 'personal_watercraft',
    label: 'Personal watercraft / jet skis',
    singular: 'personal watercraft',
    identifierLabel: '12-character HIN',
    identifierPlaceholder: 'Enter the hull identification number',
    usageLabel: 'Engine hours',
    usageUnit: 'hours',
    defaults: {
      drivetrain: 'Other',
      fuelType: 'Gasoline',
      transmission: 'Other',
    },
    styles: [
      'Stand-up',
      'Sit-down',
      'Touring',
      'Performance',
      'Recreation',
      'Fishing',
      'Other',
    ],
  },
] as const;

export type VehicleType = (typeof vehicleTypes)[number]['value'];

export const vehicleTypeValues = new Set<string>(
  vehicleTypes.map(({ value }) => value),
);

export function isVehicleType(value: unknown): value is VehicleType {
  return typeof value === 'string' && vehicleTypeValues.has(value);
}

export function getVehicleType(value: unknown) {
  return vehicleTypes.find((type) => type.value === value) ?? vehicleTypes[0];
}

export function isValidVehicleIdentifier(
  vehicleType: VehicleType,
  identifier: string,
) {
  const normalized = identifier.trim().toUpperCase();
  if (vehicleType === 'boat' || vehicleType === 'personal_watercraft')
    return /^[A-HJ-NPR-Z0-9]{12}$/.test(normalized);
  if (vehicleType === 'trailer' || vehicleType === 'snowmobile')
    return /^[A-Z0-9-]{6,20}$/.test(normalized);
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalized);
}

export function vehicleTypeLabel(value: unknown) {
  return getVehicleType(value).singular;
}
