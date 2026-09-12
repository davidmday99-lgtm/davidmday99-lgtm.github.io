'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { demoListings, type DemoListing } from '@/lib/demo-data';
import { engineSizeSuggestions } from '@/lib/engine-sizes';
import {
  catalogMakes,
  catalogModels,
  modelYearOptions,
} from '@/lib/vehicle-catalog';
import {
  emptyListingFilters,
  listingFiltersFromSearch,
  uniqueListingValues,
} from '@/lib/listing-filters';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import { toListingCard, type VehicleListingRow } from '@/lib/vehicle-listings';
import { getVehicleType, vehicleTypes } from '@/lib/vehicle-types';

const priceOptions = [
  ['', 'Any price'],
  ['under-5000', 'Under $5,000'],
  ['5000-10000', '$5,000–$10,000'],
  ['10000-20000', '$10,001–$20,000'],
  ['20000-30000', '$20,001–$30,000'],
  ['30000-50000', '$30,001–$50,000'],
  ['50000-plus', 'Over $50,000'],
];

const mileageOptions = [
  ['', 'Any mileage'],
  ['25000', '25,000 or less'],
  ['50000', '50,000 or less'],
  ['75000', '75,000 or less'],
  ['100000', '100,000 or less'],
  ['150000', '150,000 or less'],
  ['200000', '200,000 or less'],
];

const hoursOptions = [
  ['', 'Any hours'],
  ['100', '100 hours or less'],
  ['250', '250 hours or less'],
  ['500', '500 hours or less'],
  ['750', '750 hours or less'],
  ['1000', '1,000 hours or less'],
  ['2000', '2,000 hours or less'],
];

const transmissionOptions = [
  '',
  'Automatic',
  'Manual',
  'CVT',
  'Dual-clutch',
  'Other',
  'Not applicable',
];
const fuelOptions = [
  '',
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in hybrid',
  'Flex fuel',
  'Other',
  'Not applicable',
];
const drivetrainOptions = [
  '',
  'FWD',
  'RWD',
  'AWD',
  '4WD',
  'Shaft drive',
  'Chain drive',
  'Belt drive',
  'Other',
  'Not applicable',
];
const titleStatusOptions = ['', 'Clean', 'Rebuilt', 'Salvage', 'Other'];

function FilterSelect({
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  options: string[][];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <select
        aria-label={label}
        className="mt-1 h-10 w-full border border-slate-300 bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={`${name}-${optionValue}`} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function valueOptions(values: string[], allLabel: string) {
  return [['', allLabel], ...values.map((value) => [value, value])];
}

function mergedValues(...groups: string[][]) {
  return [...new Set(groups.flat().filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function ListingSearchFilters() {
  const [listings, setListings] = useState<DemoListing[]>(demoListings);
  const [filters, setFilters] = useState(emptyListingFilters);

  useEffect(() => {
    queueMicrotask(() => setFilters(listingFiltersFromSearch(window.location.search)));
    if (!hasSupabaseConfig()) return;
    void getSupabaseBrowserClient()
      .from('vehicle_listings')
      .select('*')
      .eq('status', 'published')
      .then(({ data }) => {
        setListings([
          ...((data ?? []) as VehicleListingRow[]).map(toListingCard),
          ...demoListings,
        ]);
      });
  }, []);

  const relevantListings = useMemo(
    () =>
      filters.type
        ? listings.filter(
            (listing) => (listing.vehicleType ?? 'car') === filters.type,
          )
        : listings,
    [filters.type, listings],
  );
  const modelListings = filters.make
    ? relevantListings.filter((listing) => listing.make === filters.make)
    : relevantListings;
  const selectedType = filters.type ? getVehicleType(filters.type) : undefined;
  const usesHours =
    filters.type === 'boat' || filters.type === 'personal_watercraft';
  const makes = mergedValues(
    catalogMakes(filters.type),
    uniqueListingValues(relevantListings, 'make'),
  );
  const models = filters.make
    ? mergedValues(
        catalogModels(filters.type, filters.make),
        uniqueListingValues(modelListings, 'model'),
      )
    : [];
  const styles = mergedValues(
    selectedType
      ? [...selectedType.styles]
      : vehicleTypes.flatMap((type) => [...type.styles]),
    uniqueListingValues(relevantListings, 'bodyStyle'),
  );
  const engineSizes = mergedValues(
    engineSizeSuggestions(filters.type),
    uniqueListingValues(relevantListings, 'engineSize'),
  );

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === 'make' ? { model: '' } : {}),
      ...(name === 'type'
        ? { make: '', model: '', bodyStyle: '', engineSize: '' }
        : {}),
    }));
  }

  return (
    <aside className="chunky-card h-fit bg-white p-5">
      <div className="flex items-center justify-between border-b-2 border-navy pb-4">
        <h2 className="font-black uppercase text-navy">Filters</h2>
        <SlidersHorizontal className="size-5" />
      </div>
      <form action="/search" className="mt-5 space-y-4">
        <FilterSelect
          label="Vehicle category"
          name="type"
          onChange={(value) => updateFilter('type', value)}
          options={[
            ['', 'All vehicles'],
            ...vehicleTypes.map((type) => [type.value, type.label]),
          ]}
          value={filters.type ?? ''}
        />
        <FilterSelect
          label="Distance"
          name="distance"
          onChange={(value) => updateFilter('distance', value)}
          options={[
            ['25', 'Within 25 miles'],
            ['50', 'Within 50 miles'],
            ['100', 'Within 100 miles'],
            ['nationwide', 'Nationwide'],
          ]}
          value={filters.distance}
        />
        <FilterSelect
          label="Price"
          name="price"
          onChange={(value) => updateFilter('price', value)}
          options={priceOptions}
          value={filters.price}
        />
        <FilterSelect
          label="Year"
          name="year"
          onChange={(value) => updateFilter('year', value)}
          options={valueOptions(modelYearOptions(), 'Any year')}
          value={filters.year}
        />
        <FilterSelect
          label={usesHours ? 'Engine hours' : 'Mileage'}
          name="mileage"
          onChange={(value) => updateFilter('mileage', value)}
          options={usesHours ? hoursOptions : mileageOptions}
          value={filters.mileage}
        />
        <FilterSelect
          label="Engine size"
          name="engineSize"
          onChange={(value) => updateFilter('engineSize', value)}
          options={valueOptions(engineSizes, 'Any engine size')}
          value={filters.engineSize}
        />
        <FilterSelect
          label="Make"
          name="make"
          onChange={(value) => updateFilter('make', value)}
          options={valueOptions(makes, 'All makes')}
          value={filters.make}
        />
        <FilterSelect
          disabled={!filters.make}
          label="Model"
          name="model"
          onChange={(value) => updateFilter('model', value)}
          options={valueOptions(
            models,
            filters.make ? 'All models' : 'Choose a make first',
          )}
          value={filters.model}
        />
        <FilterSelect
          label="Body style"
          name="bodyStyle"
          onChange={(value) => updateFilter('bodyStyle', value)}
          options={valueOptions(styles, 'All styles')}
          value={filters.bodyStyle}
        />
        <FilterSelect
          label="Transmission"
          name="transmission"
          onChange={(value) => updateFilter('transmission', value)}
          options={valueOptions(transmissionOptions.slice(1), 'Any transmission')}
          value={filters.transmission}
        />
        <FilterSelect
          label="Fuel type"
          name="fuel"
          onChange={(value) => updateFilter('fuel', value)}
          options={valueOptions(fuelOptions.slice(1), 'Any fuel')}
          value={filters.fuel}
        />
        <FilterSelect
          label="Drivetrain"
          name="drivetrain"
          onChange={(value) => updateFilter('drivetrain', value)}
          options={valueOptions(drivetrainOptions.slice(1), 'Any drivetrain')}
          value={filters.drivetrain}
        />
        <FilterSelect
          label="Title status"
          name="titleStatus"
          onChange={(value) => updateFilter('titleStatus', value)}
          options={valueOptions(titleStatusOptions.slice(1), 'Any title status')}
          value={filters.titleStatus}
        />
        <Button
          className="mt-6 h-11 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400"
          type="submit"
        >
          Apply filters
        </Button>
        <a
          className="block text-center text-xs font-black uppercase text-slate-500 underline underline-offset-4 hover:text-navy"
          href="/search"
        >
          Clear filters
        </a>
      </form>
    </aside>
  );
}
