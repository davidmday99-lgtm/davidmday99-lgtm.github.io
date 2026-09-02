import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Heart,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

import { ListingCard } from '@/components/listing-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoListings } from '@/lib/demo-data';
import { SUPPORT_URL } from '@/lib/support';

const checks = [
  {
    number: '01',
    icon: BadgeCheck,
    title: 'Identity checked',
    body: 'Government-ID document verification through a hosted Stripe Identity flow.',
    limit: 'Confirms identity—not vehicle ownership.',
    color: 'bg-[#f6b82b]',
  },
  {
    number: '02',
    icon: FileCheck2,
    title: 'Ownership reviewed',
    body: 'Seller legal name and VIN are compared with current title or registration documents.',
    limit: 'Does not confirm mechanical condition.',
    color: 'bg-[#96d9ed]',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'History available',
    body: 'Title, odometer, brand, salvage and certain theft data from an approved provider.',
    limit: 'Does not contain a complete repair history.',
    color: 'bg-[#22b8ae]',
  },
];

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Identity verified',
    detail: 'Government-ID check',
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <aside
          className="border-b-2 border-[#061C2B] bg-[#16C7BE] px-5 sm:px-8"
          aria-label="Seller invitation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div>
              <p className="text-lg font-black leading-tight text-[#061C2B] sm:text-xl">
                Help launch Owner Only Cars—
                <a
                  className="underline decoration-2 underline-offset-4 hover:text-[#FFF8EA]"
                  href="/our-story"
                >
                  read our story
                </a>
                .
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#061C2B]/80 sm:text-base">
                List your vehicle and help build a better marketplace for
                everyday Americans.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:shrink-0">
              <Button
                className="h-12 w-fit rounded-none border-2 border-[#061C2B] bg-[#061C2B] px-5 text-xs font-black uppercase text-[#FFF8EA] hover:bg-[#FFF8EA] hover:text-[#061C2B]"
                nativeButton={false}
                render={<a href="/sell" />}
              >
                List your car <ArrowRight />
              </Button>
              <Button
                className="h-12 w-fit rounded-none border-2 border-[#061C2B] bg-transparent px-5 text-xs font-black uppercase text-[#061C2B] hover:bg-[#FFF8EA]"
                nativeButton={false}
                render={
                  <a
                    aria-label="Support our launch using secure Stripe checkout (opens in a new tab)"
                    href={SUPPORT_URL}
                    rel="noreferrer"
                    target="_blank"
                  />
                }
              >
                <Heart /> Support our launch
              </Button>
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden border-b-[3px] border-navy bg-navy text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,transparent_0_9px,rgba(255,255,255,.2)_9px_10px)]" />
          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 lg:pb-12 lg:pt-12">
            <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
              <div className="relative z-10">
                <img
                  alt="Owner Only Cars"
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
                  src="/owneronly-mustang-hero-navy.png"
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
                >
                  Owner listings
                </a>
                <a
                  className="pb-[11px] text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-navy"
                  href="/private-seller-auctions"
                >
                  Private auctions
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

        <section
          id="trust"
          className="bg-[#dff4f8] px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-7 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-700">
                  Three checks. Three different answers.
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.95] tracking-[-0.06em] text-navy sm:text-6xl">
                  Know what each badge actually means.
                </h2>
              </div>
              <p className="max-w-xl border-l-4 border-teal-500 pl-6 text-lg leading-8 text-slate-700">
                Verification helps establish useful facts, but no badge makes a
                marketplace scam-proof. Owner Only Cars shows the check—and its
                limit.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {checks.map(
                ({ number, icon: Icon, title, body, limit, color }) => (
                  <article
                    className={`${color} flex min-h-[340px] flex-col border-2 border-navy p-7 shadow-[7px_7px_0_rgba(7,28,44,.22)]`}
                    key={title}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-black tracking-[0.2em]">
                        {number}
                      </span>
                      <Icon className="size-8" />
                    </div>
                    <h3 className="mt-auto text-3xl font-black uppercase leading-none tracking-[-0.045em] text-navy">
                      {title}
                    </h3>
                    <p className="mt-5 leading-7 text-navy/80">{body}</p>
                    <p className="mt-5 border-t border-navy/40 pt-4 text-xs font-black uppercase tracking-wide text-navy">
                      Limit: {limit}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="browse"
          className="bg-[#f8f4e9] px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 border-b-2 border-navy pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-700">
                  Demo marketplace
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.055em] text-navy sm:text-6xl">
                  Fresh from local owners.
                </h2>
              </div>
              <a
                className="flex items-center gap-2 font-black uppercase tracking-wide text-navy"
                href="/search"
              >
                View all cars <ArrowRight className="size-5" />
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              These fictional listings use original demonstration imagery and
              are clearly labeled as demo data.
            </p>
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {demoListings.map((listing) => (
                <ListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.23em] text-[#f6b82b]">
              Designed for privacy
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.94] tracking-[-0.06em] sm:text-6xl">
              We store the result.{' '}
              <span className="text-teal-300">Not your license.</span>
            </h2>
            <div className="mt-12 border-y border-white/20">
              {[
                [
                  '01 / Identity',
                  'Stripe hosts the government-ID document check. Owner Only Cars stores the provider session ID, status, timestamps, and minimum approved fields.',
                ],
                [
                  '02 / Location',
                  'Public listings show an approximate area—not an exact home address.',
                ],
                [
                  '03 / Contact',
                  'Phone numbers and email addresses stay private by default; verified users contact each other through the marketplace.',
                ],
              ].map(([label, body]) => (
                <div
                  className="grid gap-4 border-b border-white/20 py-7 last:border-b-0 md:grid-cols-[220px_1fr]"
                  key={label}
                >
                  <h3 className="font-black uppercase tracking-wide text-teal-300">
                    {label}
                  </h3>
                  <p className="max-w-3xl leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
            <Button
              className="mt-9 h-12 rounded-none bg-white px-6 font-black uppercase tracking-wide text-navy hover:bg-teal-200"
              nativeButton={false}
              render={<a href="/trust-and-safety" />}
            >
              Read trust & safety <ArrowRight />
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
