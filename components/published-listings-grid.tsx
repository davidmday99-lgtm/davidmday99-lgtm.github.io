'use client';

import { useEffect, useState } from 'react';

import { ListingCard } from '@/components/listing-card';
import { demoListings, type DemoListing } from '@/lib/demo-data';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import { toListingCard, type VehicleListingRow } from '@/lib/vehicle-listings';
import { getVehicleType, isVehicleType } from '@/lib/vehicle-types';

export function PublishedListingsGrid({
  includeDemos = true,
}: {
  includeDemos?: boolean;
}) {
  const [liveListings, setLiveListings] = useState<DemoListing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState<string>();

  useEffect(() => {
    const requestedType = new URLSearchParams(window.location.search).get(
      'type',
    );
    queueMicrotask(() =>
      setSelectedType(isVehicleType(requestedType) ? requestedType : undefined),
    );
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
  const listings = selectedType
    ? allListings.filter(
        (listing) => (listing.vehicleType ?? 'car') === selectedType,
      )
    : allListings;

  if (loaded && listings.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-400 bg-white/60 p-10 text-center">
        <h2 className="text-xl font-black uppercase text-navy">
          No approved{' '}
          {selectedType
            ? getVehicleType(selectedType).label.toLowerCase()
            : 'owner listings'}{' '}
          yet
        </h2>
        <p className="mt-2 text-slate-600">
          Approved vehicles appear here automatically after human review.
        </p>
      </div>
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
