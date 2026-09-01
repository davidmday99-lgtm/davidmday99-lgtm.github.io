import type { Metadata } from 'next';
import {
  BadgeCheck,
  CalendarClock,
  CarFront,
  EyeOff,
  Gauge,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

import { DemoBidPanel } from '@/components/demo-bid-panel';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { formatMileage } from '@/lib/demo-data';
import { demoPrivateAuctions } from '@/lib/private-auction-data';

export function generateStaticParams() {
  return demoPrivateAuctions.map((auction) => ({ slug: auction.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const auction =
    demoPrivateAuctions.find((item) => item.slug === params.slug) ??
    demoPrivateAuctions[0];
  return {
    title: `${auction.year} ${auction.name} Demo Auction | OwnerOnly Cars`,
    description: `Fictional preview auction for a ${auction.year} ${auction.name}. No live bids are accepted.`,
  };
}

export default function PrivateAuctionPage({
  params,
}: {
  params: { slug: string };
}) {
  const auction =
    demoPrivateAuctions.find((item) => item.slug === params.slug) ??
    demoPrivateAuctions[0];
  const specs = [
    ['Mileage', `${formatMileage(auction.mileage)} mi`, Gauge],
    ['Body style', auction.bodyStyle, CarFront],
    ['Transmission', auction.transmission, CarFront],
    ['Drivetrain', auction.drivetrain, CarFront],
    ['Title status', auction.titleStatus, BadgeCheck],
    ['Approximate location', auction.location, MapPin],
  ] as const;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] text-[#061C2B]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-sm text-slate-600">
            <a
              className="font-black hover:underline"
              href="/private-seller-auctions"
            >
              Private seller auctions
            </a>{' '}
            / {auction.year} {auction.name}
          </p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.45fr_.75fr]">
            <section>
              <div className="relative overflow-hidden border-[3px] border-[#061C2B] bg-white shadow-[8px_8px_0_rgba(6,28,43,.18)]">
                <img
                  alt={`${auction.year} ${auction.name} fictional demonstration auction`}
                  className="aspect-[16/10] size-full object-cover"
                  src={auction.image}
                />
                <Badge className="absolute left-4 top-4 rounded-none bg-[#061C2B] text-white">
                  Fictional demo auction
                </Badge>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[auction.image, auction.image, auction.image].map(
                  (image, index) => (
                    <div
                      className="overflow-hidden border-2 border-[#061C2B] bg-white"
                      key={index}
                    >
                      <img
                        alt={`Demonstration vehicle view ${index + 1}`}
                        className={`aspect-[4/3] size-full object-cover ${index === 1 ? 'object-left' : index === 2 ? 'object-right' : ''}`}
                        src={image}
                      />
                    </div>
                  ),
                )}
              </div>
            </section>

            <div>
              <div className="mb-5 flex items-center justify-between gap-3 border-l-4 border-[#FFB81C] bg-[#061C2B] p-4 text-white">
                <span className="flex items-center gap-2 text-sm font-black uppercase">
                  <CalendarClock className="size-5 text-[#16C7BE]" />{' '}
                  {auction.timeLeft} left
                </span>
                <span className="text-xs text-slate-300">
                  {auction.endLabel}
                </span>
              </div>
              <DemoBidPanel
                bidCount={auction.bidCount}
                currentBid={auction.currentBid}
                minimumIncrement={auction.minimumIncrement}
                reserveStatus={auction.reserveStatus}
              />
            </div>
          </div>

          <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_.65fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0B8F89]">
                {auction.year} · verified-owner preview
              </p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-6xl">
                {auction.name}
              </h1>
              <p className="mt-5 max-w-3xl leading-8 text-slate-700">
                Fictional seller description: regularly maintained, clean
                interior, and used as an everyday household vehicle. The seller
                is auctioning it because their transportation needs changed.
                This is not a real vehicle or offer.
              </p>

              <h2 className="mt-10 text-3xl font-black uppercase">
                Vehicle details
              </h2>
              <div className="mt-5 grid border-[3px] border-[#061C2B] bg-white sm:grid-cols-2">
                {specs.map(([label, value, Icon], index) => (
                  <div
                    className={`flex gap-4 p-5 ${index % 2 ? 'sm:border-l-2' : ''} ${index > 1 ? 'border-t-2' : ''} border-[#061C2B]`}
                    key={label}
                  >
                    <Icon className="size-5 text-[#0B8F89]" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 font-bold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 text-3xl font-black uppercase">
                Demo bid activity
              </h2>
              <div className="mt-5 border-[3px] border-[#061C2B] bg-white">
                {[
                  ['Buyer 8•••4', '$21,800', '14 minutes ago'],
                  ['Buyer 2•••9', '$21,550', '22 minutes ago'],
                  ['Buyer 8•••4', '$21,300', '1 hour ago'],
                ].map(([buyer, amount, time], index) => (
                  <div
                    className={`grid grid-cols-[1fr_auto] gap-2 p-4 ${index ? 'border-t border-slate-200' : ''}`}
                    key={`${buyer}-${amount}`}
                  >
                    <p className="font-black">{buyer}</p>
                    <p className="font-black">{amount}</p>
                    <p className="text-xs text-slate-500">
                      Anonymous demo bidder
                    </p>
                    <p className="text-xs text-slate-500">{time}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="border-[3px] border-[#061C2B] bg-[#dff4f1] p-6">
                <BadgeCheck className="size-8 text-[#0B8F89]" />
                <h2 className="mt-4 text-2xl font-black uppercase">
                  What verification means
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Identity review checks the seller’s identity. Ownership review
                  separately checks that the legal name and VIN align with
                  vehicle documents. Neither guarantees condition or a safe
                  transaction.
                </p>
              </div>
              <div className="border-[3px] border-[#061C2B] bg-[#FFB81C] p-6">
                <EyeOff className="size-8" />
                <h2 className="mt-4 text-2xl font-black uppercase">
                  Reserve rule
                </h2>
                <p className="mt-3 text-sm leading-6">
                  A reserve amount remains hidden from bidders. The page shows
                  only whether it has been met. If it is not met, the vehicle
                  does not automatically sell.
                </p>
              </div>
              <div className="border-[3px] border-[#061C2B] bg-white p-6">
                <ShieldAlert className="size-8 text-[#0B8F89]" />
                <h2 className="mt-4 text-2xl font-black uppercase">
                  Auction safety
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li>• Inspect the vehicle and title independently.</li>
                  <li>
                    • Sellers and connected accounts may not bid on their own
                    vehicle.
                  </li>
                  <li>
                    • Never pay with gift cards or an unexpected wire request.
                  </li>
                  <li>
                    • Payments, escrow, financing, and title transfer are
                    outside this MVP.
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
