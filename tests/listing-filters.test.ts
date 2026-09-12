import { describe, expect, it } from 'vitest';

import { demoListings } from '@/lib/demo-data';
import {
  filterListings,
  listingFiltersFromSearch,
} from '@/lib/listing-filters';

describe('listing filters', () => {
  it('reads supported search parameters', () => {
    expect(
      listingFiltersFromSearch(
        '?type=car&price=20000-30000&year=2021&bodyStyle=SUV&engineSize=2.5L',
      ),
    ).toMatchObject({
      type: 'car',
      price: '20000-30000',
      year: '2021',
      bodyStyle: 'SUV',
      engineSize: '2.5L',
    });
  });

  it('filters listings by seller-reported engine size', () => {
    const filters = listingFiltersFromSearch('?engineSize=2.5L');
    expect(filterListings(demoListings, filters).map(({ slug }) => slug)).toEqual([
      '2021-midsize-touring-crossover',
    ]);
  });

  it('filters by category, year, price, mileage, and style', () => {
    const filters = listingFiltersFromSearch(
      '?type=car&price=20000-30000&year=2021&mileage=50000&bodyStyle=SUV',
    );
    expect(filterListings(demoListings, filters).map(({ slug }) => slug)).toEqual([
      '2021-midsize-touring-crossover',
    ]);
  });

  it('combines make and model filters for live inventory', () => {
    const listing = {
      ...demoListings[0],
      make: 'Toyota',
      model: 'Highlander',
    };
    const filters = listingFiltersFromSearch('?make=Toyota&model=Highlander');
    expect(filterListings([listing, ...demoListings.slice(1)], filters)).toEqual([
      listing,
    ]);
  });
});
