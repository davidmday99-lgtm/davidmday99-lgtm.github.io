import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react';

import { ListingCard } from '@/components/listing-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoListings } from '@/lib/demo-data';

const checks = [
  {
    number: '01',
    icon: BadgeCheck,
    title: 'Identity checked',
    body: 'Government ID and matching selfie through a hosted Stripe Identity flow.',
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="grid min-h-[650px] border-b-2 border-navy bg-[#f8f4e9] lg:grid-cols-[1.02fr_.98fr]">
          <div className="retro-sunrise flex items-center border-navy px-5 py-16 sm:px-10 lg:border-r-[3px] lg:px-[max(3rem,calc((100vw-80rem)/2))] lg:py-24 lg:pr-14">
            <div className="max-w-2xl">
              <p className="block-label">The private-owner marketplace</p>
              <h1 className="retro-display mt-8 text-balance text-6xl uppercase leading-[.78] sm:text-8xl xl:text-[6.6rem]">
                Skip the lot. <span className="retro-display-teal block">Meet the owner.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-700">Buy directly from verified private owners and avoid dealer markups. Clear checks, honest limits, and cars from people—not lots.</p>

              <div className="mt-9 grid grid-cols-2 border-2 border-b-0 border-navy text-xs font-black uppercase tracking-wide">
                <a className="bg-navy px-4 py-3 text-center text-white" href="/search">Private-owner vehicles</a>
                <a className="bg-[#f6b82b] px-4 py-3 text-center text-navy hover:bg-[#ffc642]" href="/public-auto-auctions">Public auto auctions</a>
              </div>
              <form action="/search" className="chunky-panel bg-white p-3" aria-label="Search private-owner vehicles">
                <div className="grid gap-2 sm:grid-cols-[1fr_160px_auto]">
                  <label className="flex h-14 items-center gap-3 border border-slate-300 px-4 text-slate-500 focus-within:border-teal-600">
                    <Search aria-hidden="true" className="size-5 shrink-0" />
                    <span className="sr-only">Make or model</span>
                    <Input className="h-11 border-0 p-0 text-base shadow-none focus-visible:ring-0" name="q" placeholder="Make or model" />
                  </label>
                  <label className="flex h-14 items-center gap-3 border border-slate-300 px-4 text-slate-500 focus-within:border-teal-600">
                    <MapPin aria-hidden="true" className="size-5 shrink-0" />
                    <span className="sr-only">ZIP code</span>
                    <Input className="h-11 border-0 p-0 text-base shadow-none focus-visible:ring-0" inputMode="numeric" name="zip" placeholder="ZIP code" />
                  </label>
                  <Button className="h-14 rounded-none bg-navy px-6 font-black uppercase tracking-wide text-white hover:bg-teal-700" type="submit">Search <ArrowRight /></Button>
                </div>
              </form>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-navy/20 pt-5 text-xs font-bold uppercase tracking-wide text-slate-700">
                <span>Private sellers only</span><span>•</span><span>Free to browse</span><span>•</span><span>Approximate locations</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden bg-teal-500 lg:min-h-full">
            <img alt="A privately owned blue crossover parked in a residential driveway" className="absolute inset-0 size-full object-cover" src="/owner-car-driveway.png" />
            <div className="absolute inset-x-0 bottom-0 border-t-2 border-navy bg-teal-400/95 p-5 text-navy backdrop-blur-sm sm:p-7">
              <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[0.18em]">Real owner. Clear signals.</p><p className="mt-1 text-sm font-semibold">Every live seller completes required checks first.</p></div>
                <Badge className="h-8 shrink-0 rounded-none border border-navy bg-white text-navy"><CheckCircle2 /> Verified path</Badge>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="bg-[#dff4f8] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-7 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-700">Three checks. Three different answers.</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.95] tracking-[-0.06em] text-navy sm:text-6xl">Know what each badge actually means.</h2>
              </div>
              <p className="max-w-xl border-l-4 border-teal-500 pl-6 text-lg leading-8 text-slate-700">Verification helps establish useful facts, but no badge makes a marketplace scam-proof. OwnerOnly shows the check—and its limit.</p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {checks.map(({ number, icon: Icon, title, body, limit, color }) => (
                <article className={`${color} flex min-h-[340px] flex-col border-2 border-navy p-7 shadow-[7px_7px_0_rgba(7,28,44,.22)]`} key={title}>
                  <div className="flex items-start justify-between"><span className="text-xs font-black tracking-[0.2em]">{number}</span><Icon className="size-8" /></div>
                  <h3 className="mt-auto text-3xl font-black uppercase leading-none tracking-[-0.045em] text-navy">{title}</h3>
                  <p className="mt-5 leading-7 text-navy/80">{body}</p>
                  <p className="mt-5 border-t border-navy/40 pt-4 text-xs font-black uppercase tracking-wide text-navy">Limit: {limit}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="browse" className="bg-[#f8f4e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 border-b-2 border-navy pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.23em] text-teal-700">Demo marketplace</p><h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.055em] text-navy sm:text-6xl">Fresh from local owners.</h2></div>
              <a className="flex items-center gap-2 font-black uppercase tracking-wide text-navy" href="/search">View all cars <ArrowRight className="size-5" /></a>
            </div>
            <p className="mt-5 text-sm text-slate-600">These fictional listings use original demonstration imagery and are clearly labeled as demo data.</p>
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{demoListings.map((listing) => <ListingCard key={listing.slug} listing={listing} />)}</div>
          </div>
        </section>

        <section className="bg-navy px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.23em] text-[#f6b82b]">Designed for privacy</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.94] tracking-[-0.06em] sm:text-6xl">We store the result. <span className="text-teal-300">Not your license.</span></h2>
            <div className="mt-12 border-y border-white/20">
              {[['01 / Identity', 'Stripe hosts the document and selfie check. OwnerOnly stores the provider session ID, status, timestamps, and minimum approved fields.'], ['02 / Location', 'Public listings show an approximate area—not an exact home address.'], ['03 / Contact', 'Phone numbers and email addresses stay private by default; verified users contact each other through the marketplace.']].map(([label, body]) => (
                <div className="grid gap-4 border-b border-white/20 py-7 last:border-b-0 md:grid-cols-[220px_1fr]" key={label}><h3 className="font-black uppercase tracking-wide text-teal-300">{label}</h3><p className="max-w-3xl leading-7 text-slate-300">{body}</p></div>
              ))}
            </div>
            <Button className="mt-9 h-12 rounded-none bg-white px-6 font-black uppercase tracking-wide text-navy hover:bg-teal-200" nativeButton={false} render={<a href="/trust-and-safety" />}>Read trust & safety <ArrowRight /></Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
