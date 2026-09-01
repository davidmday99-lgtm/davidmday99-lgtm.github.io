import { Clock3, Gavel, MapPin, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { formatMileage, formatPrice } from '@/lib/demo-data';
import {
  type DemoPrivateAuction,
  reserveLabel,
} from '@/lib/private-auction-data';

export function PrivateAuctionCard({
  auction,
}: {
  auction: DemoPrivateAuction;
}) {
  const reserveClass =
    auction.reserveStatus === 'not-met'
      ? 'bg-[#FFB81C] text-[#061C2B]'
      : 'bg-[#dff4f1] text-[#0B6F6A]';

  return (
    <article className="group overflow-hidden border-[3px] border-[#061C2B] bg-white shadow-[7px_7px_0_rgba(6,28,43,.18)]">
      <a
        className="relative block overflow-hidden border-b-[3px] border-[#061C2B] bg-slate-100"
        href={`/private-seller-auctions/${auction.slug}`}
      >
        <img
          alt={`${auction.year} ${auction.name} demonstration auction`}
          className="aspect-[16/10] size-full object-cover transition duration-300 group-hover:scale-[1.02]"
          src={auction.image}
        />
        <Badge className="absolute left-3 top-3 rounded-none bg-[#061C2B] text-white">
          Demo auction
        </Badge>
        <span className="absolute bottom-0 right-0 bg-[#16C7BE] px-3 py-2 text-xs font-black uppercase text-[#061C2B]">
          {auction.timeLeft}
        </span>
      </a>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase text-[#0B6F6A]">
            <ShieldCheck className="size-4" /> Verified owner
          </span>
          <span
            className={`px-2 py-1 text-[10px] font-black uppercase ${reserveClass}`}
          >
            {reserveLabel(auction.reserveStatus)}
          </span>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
          {auction.year} · {formatMileage(auction.mileage)} miles
        </p>
        <h2 className="mt-1 text-2xl font-black uppercase leading-none text-[#061C2B]">
          <a href={`/private-seller-auctions/${auction.slug}`}>
            {auction.name}
          </a>
        </h2>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin className="size-4" /> {auction.location}
        </p>
        <div className="mt-5 grid grid-cols-2 border-y border-slate-200 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Current bid
            </p>
            <p className="mt-1 text-2xl font-black text-[#061C2B]">
              {formatPrice(auction.currentBid)}
            </p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Bid activity
            </p>
            <p className="mt-1 font-black text-[#061C2B]">
              {auction.bidCount} demo bids
            </p>
          </div>
        </div>
        <a
          className="mt-5 flex h-11 items-center justify-center gap-2 bg-[#061C2B] px-4 text-sm font-black uppercase text-white hover:bg-[#0B6F6A]"
          href={`/private-seller-auctions/${auction.slug}`}
        >
          <Gavel className="size-4" /> View auction
        </a>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500">
          <Clock3 className="size-3.5" /> {auction.endLabel}
        </p>
      </div>
    </article>
  );
}
