'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Car,
  ExternalLink,
  Gauge,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

import { ContactSellerButton } from '@/components/contact-seller-button';
import { PublishedListingDisclosures } from '@/components/published-listing-disclosures';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { formatMileage, formatPrice } from '@/lib/demo-data';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import type { VehicleListingRow } from '@/lib/vehicle-listings';

export default function PublishedVehiclePage() {
  const [listing, setListing] = useState<VehicleListingRow>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug || !hasSupabaseConfig()) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    void getSupabaseBrowserClient()
      .from('vehicle_listings')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data }) => {
        setListing((data as VehicleListingRow | null) ?? undefined);
        setLoading(false);
      });
  }, []);

  const name = listing
    ? `${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`
    : '';

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[#f8f4e9]">
        {loading ? (
          <div className="mx-auto max-w-7xl px-5 py-20 text-center font-bold sm:px-8">
            Loading approved listing…
          </div>
        ) : !listing ? (
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
            <h1 className="text-4xl font-black uppercase text-navy">
              Listing not available
            </h1>
            <p className="mt-4 text-slate-600">
              This vehicle may still be under review or may no longer be active.
            </p>
            <a
              className="mt-6 inline-block font-black text-teal-800 underline"
              href="/search"
            >
              Browse approved cars
            </a>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <a
              className="text-sm font-bold text-slate-600 hover:underline"
              href="/search"
            >
              ← Browse cars
            </a>
            <div className="mt-6 grid gap-7 lg:grid-cols-[1.5fr_.8fr]">
              <section>
                <div className="overflow-hidden border-2 border-navy bg-white shadow-[8px_8px_0_rgba(7,28,44,.18)]">
                  <img
                    className="aspect-[16/10] size-full object-cover"
                    src={listing.photo_urls[0]}
                    alt={`${listing.year} ${name}`}
                  />
                </div>
                {listing.photo_urls.length > 1 && (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {listing.photo_urls.slice(1, 4).map((url, index) => (
                      <img
                        className="aspect-[4/3] size-full border-2 border-navy object-cover"
                        src={url}
                        alt={`${name} view ${index + 2}`}
                        key={url}
                      />
                    ))}
                  </div>
                )}
              </section>
              <aside className="h-fit border-2 border-navy bg-white p-6 shadow-[8px_8px_0_#16b9ad]">
                <Badge className="rounded-none bg-teal-100 text-teal-800">
                  <ShieldCheck /> Identity and ownership reviewed
                </Badge>
                <p className="mt-6 text-sm font-bold text-slate-500">
                  {listing.year} · {formatMileage(listing.mileage)} miles
                </p>
                <h1 className="mt-1 text-3xl font-black uppercase leading-none text-navy">
                  {name}
                </h1>
                <p className="mt-5 text-4xl font-black text-navy">
                  {formatPrice(listing.price)}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="size-4" /> Near {listing.location_public}
                </p>
                <ContactSellerButton
                  listingId={listing.id}
                  listingSlug={listing.slug}
                  sellerId={listing.user_id}
                />
              </aside>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_.65fr]">
              <section>
                <h2 className="text-3xl font-black uppercase text-navy">
                  Vehicle details
                </h2>
                <div className="mt-5 grid border-2 border-navy bg-white sm:grid-cols-2">
                  {[
                    ['VIN', listing.vin, ShieldCheck],
                    ['Mileage', `${formatMileage(listing.mileage)} mi`, Gauge],
                    ['Body style', listing.body_style, Car],
                    ['Drivetrain', listing.drivetrain, Car],
                    ['Transmission', listing.transmission, Car],
                    ['Fuel', listing.fuel_type, Car],
                    ['Title', listing.title_status, ShieldCheck],
                    ['Lien status', listing.lien_status, ShieldCheck],
                    ['Overall condition', listing.vehicle_condition, Car],
                  ].map(([label, value, Icon], index) => (
                    <div
                      className={`flex gap-4 border-slate-300 p-5 ${index > 1 ? 'border-t' : ''} ${index % 2 ? 'sm:border-l' : ''}`}
                      key={String(label)}
                    >
                      <Icon className="size-5 text-teal-700" />
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500">
                          {String(label)}
                        </p>
                        <p className="mt-1 font-bold text-navy">
                          {String(value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <h2 className="mt-10 text-3xl font-black uppercase text-navy">
                  Seller’s description
                </h2>
                <p className="mt-4 whitespace-pre-line leading-8 text-slate-700">
                  {listing.description}
                </p>
                <PublishedListingDisclosures
                  answers={listing.condition_answers}
                  features={listing.features}
                />
                {listing.carfax_url && (
                  <a
                    className="mt-7 inline-flex items-center gap-2 border-2 border-navy bg-white px-4 py-3 font-black uppercase text-navy"
                    href={listing.carfax_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Seller-provided CARFAX report{' '}
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </section>
              <aside className="h-fit border-2 border-navy bg-[#f6b82b] p-6">
                <AlertTriangle className="size-8" />
                <h2 className="mt-4 text-2xl font-black uppercase text-navy">
                  Meet safely.
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-navy/85">
                  <li>• Independently inspect the vehicle and title.</li>
                  <li>
                    • Confirm the VIN on the vehicle matches the paperwork.
                  </li>
                  <li>• Never use gift cards, crypto, or wire transfers.</li>
                </ul>
              </aside>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
