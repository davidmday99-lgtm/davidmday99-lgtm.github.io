'use client';

import { useEffect, useState } from 'react';
import { CarFront, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatMileage, formatPrice } from '@/lib/demo-data';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import type { VehicleListingRow } from '@/lib/vehicle-listings';

export function MyListings() {
  const [listings, setListings] = useState<VehicleListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      void supabase
        .from('vehicle_listings')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(({ data: rows }) => {
          setListings((rows ?? []) as VehicleListingRow[]);
          setLoading(false);
        });
    });
  }, []);

  return (
    <section id="listings" className="mt-8 border-2 border-navy bg-white p-6">
      <div className="flex flex-col gap-4 border-b-2 border-navy pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase text-navy">
            My listings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your private-owner vehicle listings.
          </p>
        </div>
        <Button
          className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
          nativeButton={false}
          render={<a href="/sell" />}
        >
          <Plus /> Create listing
        </Button>
      </div>

      {loading ? (
        <p className="py-10 text-center font-bold text-slate-600">
          Loading your listings…
        </p>
      ) : listings.length ? (
        <div className="mt-6 space-y-4">
          {listings.map((listing) => (
            <article
              className="flex flex-col gap-4 border-2 border-navy p-4 sm:flex-row sm:items-center"
              key={listing.id}
            >
              <img
                className="aspect-[4/3] w-full object-cover sm:w-40"
                src={listing.photo_urls[0]}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`border px-2 py-1 text-xs font-black uppercase ${listing.status === 'published' ? 'border-teal-500 bg-teal-50 text-teal-800' : listing.status === 'rejected' ? 'border-red-500 bg-red-50 text-red-800' : 'border-amber-500 bg-amber-50 text-amber-900'}`}
                  >
                    {listing.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black uppercase text-navy">
                  {listing.year} {listing.make} {listing.model}
                  {listing.trim ? ` ${listing.trim}` : ''}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {formatMileage(listing.mileage)} miles ·{' '}
                  {formatPrice(listing.price)} · Near {listing.location_public}
                </p>
              </div>
              {listing.status === 'published' && (
                <a
                  className="font-black uppercase text-teal-800 underline"
                  href={`/listing?slug=${encodeURIComponent(listing.slug)}`}
                >
                  View live listing
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <span className="grid size-14 place-items-center border-2 border-navy bg-[#96d9ed] shadow-[4px_4px_0_#071c2c]">
            <CarFront className="size-7 text-navy" />
          </span>
          <h3 className="mt-6 text-xl font-black uppercase text-navy">
            No saved listings yet
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Listings submitted after this update will appear here and publish
            automatically after approval.
          </p>
        </div>
      )}
    </section>
  );
}
