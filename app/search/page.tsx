import { SlidersHorizontal } from 'lucide-react';

import { ListingCard } from '@/components/listing-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoListings } from '@/lib/demo-data';

const filters = [
  ['Distance', '50 miles'], ['Price', 'Any price'], ['Year', 'Any year'], ['Mileage', 'Any mileage'],
  ['Make', 'All makes'], ['Model', 'All models'], ['Body style', 'All styles'], ['Transmission', 'Any'],
  ['Fuel type', 'Any fuel'], ['Drivetrain', 'Any'], ['Title status', 'Clean title'],
];

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9]">
        <section className="border-b-2 border-navy bg-[#96d9ed] px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">Private-owner inventory</p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div><h1 className="text-4xl font-black uppercase tracking-[-0.055em] text-navy sm:text-6xl">Find your next car.</h1><p className="mt-3 text-navy/70">Fictional demonstration listings · verified-owner design preview</p></div>
              <form className="flex w-full max-w-xl gap-2 border-2 border-navy bg-white p-2 shadow-[6px_6px_0_#071c2c]">
                <Input className="h-11 rounded-none border-slate-300" placeholder="Make, model or keyword" />
                <Input className="h-11 w-28 rounded-none border-slate-300" placeholder="ZIP" />
                <Button className="h-11 rounded-none bg-navy px-5">Search</Button>
              </form>
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit border-2 border-navy bg-white p-5 shadow-[6px_6px_0_rgba(7,28,44,.15)]">
            <div className="flex items-center justify-between border-b-2 border-navy pb-4"><h2 className="font-black uppercase text-navy">Filters</h2><SlidersHorizontal className="size-5" /></div>
            <div className="mt-5 space-y-4">{filters.map(([label, value]) => <label className="block" key={label}><span className="text-xs font-black uppercase tracking-wide text-slate-600">{label}</span><select className="mt-1 h-10 w-full border border-slate-300 bg-white px-3 text-sm" defaultValue={value} aria-label={label}><option>{value}</option><option>All options</option></select></label>)}</div>
            <Button className="mt-6 h-11 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400">Apply filters</Button>
          </aside>
          <section>
            <div className="flex items-center justify-between border-b-2 border-navy pb-4"><p className="font-bold text-navy">3 owner listings</p><select aria-label="Sort results" className="h-10 border border-navy bg-white px-3 text-sm"><option>Best match</option><option>Price: low to high</option><option>Newest first</option></select></div>
            <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">{demoListings.map((listing) => <ListingCard key={listing.slug} listing={listing} />)}</div>
            <div className="mt-10 border-2 border-dashed border-slate-400 bg-white/60 p-10 text-center"><h2 className="text-xl font-black uppercase text-navy">That’s all the demo inventory.</h2><p className="mt-2 text-slate-600">Try expanding your distance or changing a filter when live listings are connected.</p></div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
