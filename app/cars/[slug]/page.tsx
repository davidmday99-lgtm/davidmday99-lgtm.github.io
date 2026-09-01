import type { Metadata } from 'next';
import { AlertTriangle, Calendar, Car, Flag, Gauge, Heart, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { demoListings, formatMileage, formatPrice } from '@/lib/demo-data';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const listing = demoListings.find((item) => item.slug === params.slug) ?? demoListings[0];
  const description = `${listing.year} ${listing.name}, ${formatMileage(listing.mileage)} miles, near ${listing.location.replace('Near ', '')}. Demonstration listing.`;
  return { title: `${listing.year} ${listing.name} | OwnerOnly Cars`, description, openGraph: { title: `${listing.year} ${listing.name}`, description, images: [{ url: listing.image }] }, twitter: { card: 'summary_large_image', title: `${listing.year} ${listing.name}`, description, images: [listing.image] } };
}

export default function VehiclePage({ params }: { params: { slug: string } }) {
  const listing = demoListings.find((item) => item.slug === params.slug) ?? demoListings[0];
  const specs = [['Mileage', `${formatMileage(listing.mileage)} mi`, Gauge], ['Body style', listing.bodyStyle, Car], ['Year', String(listing.year), Calendar], ['Location', listing.location, MapPin]] as const;
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f8f4e9]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-sm text-slate-600"><a className="font-bold hover:underline" href="/search">Browse cars</a> / {listing.year} {listing.name}</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_.8fr]">
            <section>
              <div className="relative overflow-hidden border-2 border-navy bg-white shadow-[8px_8px_0_rgba(7,28,44,.18)]"><img alt={`${listing.year} ${listing.name} demonstration listing`} className="aspect-[16/10] size-full object-cover" src={listing.image} /><Badge className="absolute left-4 top-4 rounded-none bg-navy text-white">Demo listing</Badge></div>
              <div className="mt-6 grid grid-cols-3 gap-3">{[listing.image, listing.image, listing.image].map((image, index) => <div className="overflow-hidden border-2 border-navy bg-white" key={index}><img alt={`Vehicle gallery view ${index + 1}`} className={`aspect-[4/3] size-full object-cover ${index === 1 ? 'object-left' : index === 2 ? 'object-right' : ''}`} src={image} /></div>)}</div>
            </section>
            <aside className="h-fit border-2 border-navy bg-white p-6 shadow-[8px_8px_0_#16b9ad] lg:sticky lg:top-24">
              <div className="flex items-center justify-between"><Badge className="rounded-none bg-teal-100 text-teal-800"><ShieldCheck /> Owner verified</Badge><Button aria-label="Save listing" size="icon" variant="outline"><Heart /></Button></div>
              <p className="mt-6 text-sm font-bold text-slate-500">{listing.year} · {formatMileage(listing.mileage)} miles</p><h1 className="mt-1 text-3xl font-black uppercase leading-none tracking-[-0.045em] text-navy">{listing.name}</h1><p className="mt-5 text-4xl font-black text-navy">{formatPrice(listing.price)}</p><p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><MapPin className="size-4" /> {listing.location}</p>
              <Button className="mt-7 h-12 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400"><MessageSquare /> Contact verified seller</Button><p className="mt-3 text-center text-xs text-slate-500">Sign in and complete verification to message.</p>
              <button className="mt-6 flex w-full items-center justify-center gap-2 border-t border-slate-200 pt-5 text-sm font-bold text-slate-600 hover:text-red-700"><Flag className="size-4" /> Report listing</button>
            </aside>
          </div>

          <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_.65fr]">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-[-0.045em] text-navy">Vehicle details</h2><div className="mt-5 grid border-2 border-navy bg-white sm:grid-cols-2">{specs.map(([label, value, Icon], index) => <div className={`flex gap-4 p-5 ${index % 2 ? 'sm:border-l' : ''} ${index > 1 ? 'border-t' : ''} border-slate-300`} key={label}><Icon className="size-5 text-teal-700" /><div><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 font-bold text-navy">{value}</p></div></div>)}</div>
              <h2 className="mt-10 text-3xl font-black uppercase tracking-[-0.045em] text-navy">Seller’s description</h2><p className="mt-4 max-w-3xl leading-8 text-slate-700">Well-kept, everyday vehicle with regular maintenance and a clean interior. Selling because our household needs changed. This is fictional demonstration content and not a real offer to sell.</p>
            </div>
            <div className="border-2 border-navy bg-[#f6b82b] p-6 shadow-[6px_6px_0_rgba(7,28,44,.18)]"><AlertTriangle className="size-8" /><h2 className="mt-4 text-2xl font-black uppercase text-navy">Meet safely.</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-navy/85"><li>• Meet in a public place during daylight.</li><li>• Independently inspect the vehicle and title.</li><li>• Never send gift cards or wire money to hold a car.</li><li>• Verify the VIN on the vehicle matches the title.</li></ul><a className="mt-6 inline-block font-black uppercase underline" href="/trust-and-safety">All safety tips</a></div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
