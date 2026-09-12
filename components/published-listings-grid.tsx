'use client';

import { SearchX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { demoListings, type DemoListing } from '@/lib/demo-data';
import {
  emptyListingFilters,
  filterListings,
  listingFiltersFromSearch,
} from '@/lib/listing-filters';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import { toListingCard, type VehicleListingRow } from '@/lib/vehicle-listings';
import { getVehicleType } from '@/lib/vehicle-types';

export function PublishedListingsGrid({
  includeDemos = true,
}: {
  includeDemos?: boolean;
}) {
  const [liveListings, setLiveListings] = useState<DemoListing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState(emptyListingFilters);
  const [currentSearch, setCurrentSearch] = useState('');
  const [dismissedEmptySearch, setDismissedEmptySearch] = useState<
    string | null
  >(null);

  useEffect(() => {
    const search = window.location.search;
    queueMicrotask(() => {
      setCurrentSearch(search);
      setFilters(listingFiltersFromSearch(search));
    });
    if (!hasSupabaseConfig()) {
      queueMicrotask(() => setLoaded(true));
      return;
    }
    const supabase = getSupabaseBrowserClient();
    void supabase
      .from('vehicle_listings')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setLiveListings(
          ((data ?? []) as VehicleListingRow[]).map(toListingCard),
        );
        setLoaded(true);
      });
  }, []);

  const allListings = includeDemos
    ? [...liveListings, ...demoListings]
    : liveListings;
  const listings = filterListings(allListings, filters);

  const emptySearchKey = currentSearch || 'unfiltered';
  const nationwideHref = useMemo(() => {
    const params = new URLSearchParams(currentSearch);
    params.set('distance', 'nationwide');
    return `/search?${params.toString()}`;
  }, [currentSearch]);
  const broadenHref =
    filters.distance === 'nationwide' ? '/search' : nationwideHref;
  const broadenLabel =
    filters.distance === 'nationwide'
      ? 'View all vehicles'
      : 'Search nationwide';

  const searchTarget = filters.make
    ? `a ${filters.make}${filters.model ? ` ${filters.model}` : ''}`
    : filters.query
      ? `a vehicle matching “${filters.query}”`
      : filters.type
        ? `a ${getVehicleType(filters.type).singular}`
        : 'a vehicle matching those filters';
  const searchArea =
    filters.distance === 'nationwide'
      ? 'in our current nationwide inventory'
      : filters.zip
        ? `within ${filters.distance || '50'} miles of ZIP ${filters.zip}`
        : `within ${filters.distance || '50'} miles of your selected area`;

  if (loaded && listings.length === 0) {
    return (
      <>
        <Dialog
          onOpenChange={(open) => {
            if (!open) setDismissedEmptySearch(emptySearchKey);
          }}
          open={dismissedEmptySearch !== emptySearchKey}
        >
          <DialogContent
            className="max-w-xl gap-0 rounded-none border-[3px] border-navy bg-[#FFF8EA] p-0 text-navy shadow-[10px_10px_0_#16C7BE] ring-0"
            showCloseButton={false}
          >
            <div className="flex items-center gap-3 border-b-[3px] border-navy bg-[#f6b82b] px-6 py-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-navy bg-white">
                <SearchX aria-hidden="true" className="size-6" />
              </span>
              <DialogHeader className="gap-1">
                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  New marketplace
                </p>
                <DialogTitle className="text-2xl font-black uppercase leading-tight sm:text-3xl">
                  Nothing in this search yet
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="px-6 py-6 sm:px-8">
              <DialogDescription className="text-base leading-7 text-slate-700">
                We’re just getting started, and we don’t have {searchTarget}{' '}
                listed {searchArea} right now.
              </DialogDescription>
              <p className="mt-4 border-l-4 border-teal-500 pl-4 text-sm font-bold leading-6 text-navy">
                New private-owner listings appear as sellers complete identity
                verification and ownership review.
              </p>
            </div>
            <DialogFooter className="m-0 flex-col rounded-none border-t-2 border-navy bg-white p-5 sm:flex-col sm:items-stretch">
              <a
                className="mb-2 text-center text-sm font-black uppercase text-teal-800 underline decoration-2 underline-offset-4 hover:text-navy"
                href="/wanted#post-wanted"
              >
                Looking for something specific? Post a wanted ad
              </a>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <DialogClose
                  render={
                    <Button
                      className="rounded-none border-2 border-navy font-black uppercase"
                      variant="outline"
                    />
                  }
                >
                  Keep browsing
                </DialogClose>
                <Button
                  className="rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400"
                  nativeButton={false}
                  render={<a href={broadenHref} />}
                >
                  {broadenLabel}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div
          aria-live="polite"
          className="border-[3px] border-navy bg-white p-7 shadow-[7px_7px_0_#f6b82b] sm:p-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f6b82b] text-navy">
              <SearchX aria-hidden="true" className="size-7" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
                New marketplace
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-navy">
                Nothing in this search yet
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                We’re just getting started, and we don’t have {searchTarget}{' '}
                listed {searchArea} right now. Please broaden your search or
                check back as new owners join.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400"
                  nativeButton={false}
                  render={<a href={broadenHref} />}
                >
                  {broadenLabel}
                </Button>
                <Button
                  className="rounded-none border-2 border-navy font-black uppercase"
                  nativeButton={false}
                  render={<a href="/search" />}
                  variant="outline"
                >
                  Clear all filters
                </Button>
                <Button
                  className="rounded-none font-black uppercase text-teal-800"
                  nativeButton={false}
                  render={<a href="/wanted#post-wanted" />}
                  variant="ghost"
                >
                  Post a wanted ad
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.slug} listing={listing} />
      ))}
    </div>
  );
}
