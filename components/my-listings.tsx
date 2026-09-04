'use client';

import { useEffect, useState } from 'react';
import { Check, CarFront, LoaderCircle, Pencil, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatMileage, formatPrice } from '@/lib/demo-data';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import type { VehicleListingRow } from '@/lib/vehicle-listings';

export function MyListings() {
  const [listings, setListings] = useState<VehicleListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState('');
  const [priceDraft, setPriceDraft] = useState('');
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  function startPriceEdit(listing: VehicleListingRow) {
    setEditingId(listing.id);
    setPriceDraft(String(listing.price));
    setMessage('');
    setError('');
  }

  function cancelPriceEdit() {
    setEditingId('');
    setPriceDraft('');
    setError('');
  }

  async function savePrice(listing: VehicleListingRow) {
    const nextPrice = Number(priceDraft);
    if (
      !priceDraft.trim() ||
      !Number.isInteger(nextPrice) ||
      nextPrice < 0 ||
      nextPrice > 10000000
    ) {
      setError('Enter a whole-dollar price between $0 and $10,000,000.');
      return;
    }

    setSavingId(listing.id);
    setError('');
    setMessage('');
    const { data, error: updateError } = await getSupabaseBrowserClient().rpc(
      'update_my_listing_price',
      {
        target_listing_id: listing.id,
        new_price: nextPrice,
      },
    );
    setSavingId('');

    if (updateError || typeof data !== 'number') {
      setError('The price could not be updated. Please sign in and try again.');
      return;
    }

    setListings((current) =>
      current.map((item) =>
        item.id === listing.id ? { ...item, price: data } : item,
      ),
    );
    setEditingId('');
    setPriceDraft('');
    setMessage(
      listing.status === 'published'
        ? 'Price updated on the live listing.'
        : 'Price updated successfully.',
    );
  }

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

      {message && (
        <p className="mt-5 border-l-4 border-teal-600 bg-teal-50 p-3 text-sm font-bold text-teal-900">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-5 border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

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
                {editingId === listing.id && (
                  <div className="mt-4 max-w-sm border-2 border-navy bg-amber-50 p-3">
                    <label
                      className="text-xs font-black uppercase tracking-wide text-navy"
                      htmlFor={`listing-price-${listing.id}`}
                    >
                      Asking price
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Input
                        autoFocus
                        className="h-11 min-w-0 flex-1 rounded-none border-2 border-navy bg-white"
                        disabled={savingId === listing.id}
                        id={`listing-price-${listing.id}`}
                        inputMode="numeric"
                        max={10000000}
                        min={0}
                        onChange={(event) => setPriceDraft(event.target.value)}
                        step={1}
                        type="number"
                        value={priceDraft}
                      />
                      <Button
                        className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
                        disabled={savingId === listing.id}
                        onClick={() => void savePrice(listing)}
                        type="button"
                      >
                        {savingId === listing.id ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <Check />
                        )}
                        Save
                      </Button>
                      <Button
                        className="h-11 rounded-none font-black uppercase"
                        disabled={savingId === listing.id}
                        onClick={cancelPriceEdit}
                        type="button"
                        variant="outline"
                      >
                        <X /> Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                {listing.status !== 'removed' && editingId !== listing.id && (
                  <Button
                    className="h-10 rounded-none border-2 border-navy bg-[#f6b82b] font-black uppercase text-navy"
                    onClick={() => startPriceEdit(listing)}
                    type="button"
                    variant="outline"
                  >
                    <Pencil /> Edit price
                  </Button>
                )}
                {listing.status === 'published' && (
                  <a
                    className="font-black uppercase text-teal-800 underline"
                    href={`/listing?slug=${encodeURIComponent(listing.slug)}`}
                  >
                    View live listing
                  </a>
                )}
              </div>
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
