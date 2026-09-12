'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { demoListings, type DemoListing } from '@/lib/demo-data';
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
import { vehicleTypes } from '@/lib/vehicle-types';

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

function FilterSelect({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[][];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <select
        aria-label={label}
        className="mt-1 h-10 w-full border border-slate-300 bg-white px-3 text-sm"
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
  const years = [...new Set(relevantListings.map((listing) => listing.year))]
    .sort((left, right) => right - left)
    .map(String);

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === 'make' ? { model: '' } : {}),
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
          options={valueOptions(years, 'Any year')}
          value={filters.year}
        />
        <FilterSelect
          label="Mileage / hours"
          name="mileage"
          onChange={(value) => updateFilter('mileage', value)}
          options={mileageOptions}
          value={filters.mileage}
        />
        <FilterSelect
          label="Make"
          name="make"
          onChange={(value) => updateFilter('make', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'make'),
            'All makes',
          )}
          value={filters.make}
        />
        <FilterSelect
          label="Model"
          name="model"
          onChange={(value) => updateFilter('model', value)}
          options={valueOptions(
            uniqueListingValues(modelListings, 'model'),
            'All models',
          )}
          value={filters.model}
        />
        <FilterSelect
          label="Body style"
          name="bodyStyle"
          onChange={(value) => updateFilter('bodyStyle', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'bodyStyle'),
            'All styles',
          )}
          value={filters.bodyStyle}
        />
        <FilterSelect
          label="Transmission"
          name="transmission"
          onChange={(value) => updateFilter('transmission', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'transmission'),
            'Any transmission',
          )}
          value={filters.transmission}
        />
        <FilterSelect
          label="Fuel type"
          name="fuel"
          onChange={(value) => updateFilter('fuel', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'fuel'),
            'Any fuel',
          )}
          value={filters.fuel}
        />
        <FilterSelect
          label="Drivetrain"
          name="drivetrain"
          onChange={(value) => updateFilter('drivetrain', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'drivetrain'),
            'Any drivetrain',
          )}
          value={filters.drivetrain}
        />
        <FilterSelect
          label="Title status"
          name="titleStatus"
          onChange={(value) => updateFilter('titleStatus', value)}
          options={valueOptions(
            uniqueListingValues(relevantListings, 'titleStatus'),
            'Any title status',
          )}
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
