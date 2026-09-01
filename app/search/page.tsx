import {
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

import { ListingCard } from '@/components/listing-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoListings } from '@/lib/demo-data';

const filters = [
  ['Distance', '50 miles'],
  ['Price', 'Any price'],
  ['Year', 'Any year'],
  ['Mileage', 'Any mileage'],
  ['Make', 'All makes'],
  ['Model', 'All models'],
  ['Body style', 'All styles'],
  ['Transmission', 'Any'],
  ['Fuel type', 'Any fuel'],
  ['Drivetrain', 'Any'],
  ['Title status', 'Clean title'],
];

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Identity verified',
    detail: 'ID and selfie check',
  },
  {
    icon: FileCheck2,
    title: 'Ownership reviewed',
    detail: 'Name and VIN compared',
  },
  {
    icon: MessageCircle,
    title: 'Safer messaging',
    detail: 'Contact details stay private',
  },
];

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9]">
        <section className="relative overflow-hidden border-b-[3px] border-navy bg-navy text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,transparent_0_9px,rgba(255,255,255,.2)_9px_10px)]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 lg:pb-12 lg:pt-12">
            <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
              <div className="relative z-10">
                <img
                  alt="OwnerOnly Cars"
                  className="h-auto w-[250px] object-contain object-left sm:w-[330px]"
                  src="/owneronly-hero-logo.png"
                />
                <h1 className="owner-hero-title mt-6 max-w-2xl text-5xl leading-[0.92] sm:text-7xl lg:text-[5.7rem]">
                  Find your next car—
                  <span className="block text-[#f6b82b]">
                    from a real owner.
                  </span>
                </h1>
                <p className="mt-6 border-l-4 border-[#f6b82b] pl-4 text-sm font-bold text-slate-100 sm:text-base">
                  Verified private sellers. No dealer listings.
                </p>
              </div>

              <div className="relative min-h-[220px] sm:min-h-[285px] lg:min-h-[330px]">
                <img
                  alt="A dark navy classic Mustang shown in side profile"
                  className="absolute inset-0 size-full object-contain object-center drop-shadow-[0_20px_18px_rgba(0,0,0,.42)]"
                  src="/owneronly-mustang-hero.png"
                />
              </div>
            </div>

            <div className="relative z-20 mt-8 border-2 border-white bg-white text-navy shadow-[7px_7px_0_#16b9ad]">
              <nav
                className="flex h-11 items-end gap-7 border-b border-slate-200 px-4 sm:px-6"
                aria-label="Inventory type"
              >
                <a
                  className="border-b-[3px] border-teal-500 pb-2 text-xs font-black uppercase tracking-wide"
                  href="/search"
                  aria-current="page"
                >
                  Owner listings
                </a>
                <a
                  className="pb-[11px] text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-navy"
                  href="/public-auto-auctions"
                >
                  Public auctions
                </a>
              </nav>
              <form
                action="/search"
                className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_200px_160px] lg:p-5"
                aria-label="Search owner listings"
              >
                <label>
                  <span className="sr-only">Make, model or keyword</span>
                  <Input
                    className="h-12 rounded-[2px] border-slate-300 bg-white"
                    name="q"
                    placeholder="Make, model or keyword"
                  />
                </label>
                <label>
                  <span className="sr-only">ZIP code</span>
                  <Input
                    className="h-12 rounded-[2px] border-slate-300 bg-white"
                    inputMode="numeric"
                    name="zip"
                    placeholder="ZIP code"
                  />
                </label>
                <label>
                  <span className="sr-only">Search distance</span>
                  <select
                    className="h-12 w-full rounded-[2px] border border-slate-300 bg-white px-3 text-sm text-slate-700"
                    defaultValue="50"
                    name="distance"
                  >
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                    <option value="nationwide">Nationwide</option>
                  </select>
                </label>
                <Button
                  className="h-12 rounded-[2px] bg-[#f6b82b] font-black uppercase text-navy hover:bg-[#ffd263]"
                  type="submit"
                >
                  Find cars
                </Button>
              </form>
            </div>

            <div className="mt-9 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-0">
              {trustSignals.map(({ icon: Icon, title, detail }, index) => (
                <div
                  className={`flex items-center gap-3 sm:px-6 ${index > 0 ? 'sm:border-l sm:border-white/20' : ''}`}
                  key={title}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-teal-300 bg-teal-500/20">
                    <Icon aria-hidden="true" className="size-5 text-teal-200" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-white">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-300">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[250px_1fr]">
          <aside className="chunky-card h-fit bg-white p-5">
            <div className="flex items-center justify-between border-b-2 border-navy pb-4">
              <h2 className="font-black uppercase text-navy">Filters</h2>
              <SlidersHorizontal className="size-5" />
            </div>
            <div className="mt-5 space-y-4">
              {filters.map(([label, value]) => (
                <label className="block" key={label}>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                    {label}
                  </span>
                  <select
                    className="mt-1 h-10 w-full border border-slate-300 bg-white px-3 text-sm"
                    defaultValue={value}
                    aria-label={label}
                  >
                    <option>{value}</option>
                    <option>All options</option>
                  </select>
                </label>
              ))}
            </div>
            <Button className="mt-6 h-11 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400">
              Apply filters
            </Button>
          </aside>
          <section>
            <div className="flex items-center justify-between border-b-[3px] border-navy pb-4">
              <div>
                <p className="font-black uppercase tracking-wide text-navy">
                  Recent owner listings
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  3 fictional demonstration vehicles
                </p>
              </div>
              <select
                aria-label="Sort results"
                className="h-10 border-2 border-navy bg-white px-3 text-sm font-bold"
              >
                <option>Best match</option>
                <option>Price: low to high</option>
                <option>Newest first</option>
              </select>
            </div>
            <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {demoListings.map((listing) => (
                <ListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
            <div className="mt-10 border-2 border-dashed border-slate-400 bg-white/60 p-10 text-center">
              <h2 className="text-xl font-black uppercase text-navy">
                That’s all the demo inventory.
              </h2>
              <p className="mt-2 text-slate-600">
                Try expanding your distance or changing a filter when live
                listings are connected.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
