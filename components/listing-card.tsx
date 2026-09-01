import { Heart, MapPin, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoListing, formatMileage, formatPrice } from '@/lib/demo-data';

export function ListingCard({ listing }: { listing: DemoListing }) {
  return (
    <article className="group overflow-hidden border-2 border-navy bg-white shadow-[7px_7px_0_rgba(7,28,44,.16)] transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <a href={`/cars/${listing.slug}`} aria-label={`View ${listing.year} ${listing.name}`}>
          <img alt={`${listing.year} ${listing.name} demonstration listing`} className="size-full object-cover transition duration-500 group-hover:scale-[1.02]" src={listing.image} />
        </a>
        <Badge className="absolute left-3 top-3 rounded-none border border-navy bg-white text-navy shadow-sm"><ShieldCheck /> Owner verified</Badge>
        <Button aria-label="Save listing" className="absolute right-3 top-3 rounded-none border border-navy bg-white/95 text-navy shadow-sm" size="icon" variant="ghost"><Heart /></Button>
        <Badge className="absolute bottom-3 left-3 rounded-none border-0 bg-navy/90 text-white">Demo data</Badge>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{listing.year} · {formatMileage(listing.mileage)} miles</p>
            <h2 className="mt-1 font-bold tracking-tight text-navy"><a href={`/cars/${listing.slug}`}>{listing.name}</a></h2>
          </div>
          <p className="text-lg font-bold text-navy">{formatPrice(listing.price)}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{listing.drivetrain}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{listing.transmission}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{listing.titleStatus} title</span>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><MapPin className="size-4" /> {listing.location} · {listing.distance} mi</p>
      </div>
    </article>
  );
}
