import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Clock3, EyeOff, Gavel } from 'lucide-react';

import { PrivateAuctionCard } from '@/components/private-auction-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { demoPrivateAuctions } from '@/lib/private-auction-data';

export const metadata: Metadata = {
  title: 'Private Seller Auctions | OwnerOnly Cars',
  description:
    'Preview verified private-owner vehicle auctions with optional seller reserves and clear bidding rules.',
  alternates: { canonical: '/private-seller-auctions' },
};

const auctionChecks = [
  {
    icon: BadgeCheck,
    title: 'Verified private sellers',
    body: 'Identity and ownership review are required before an auction can go live.',
  },
  {
    icon: EyeOff,
    title: 'Optional hidden reserve',
    body: 'The seller may set a minimum acceptable price. Bidders see only whether it has been met.',
  },
  {
    icon: Clock3,
    title: 'Timed, auditable bidding',
    body: 'Every accepted bid needs a server timestamp, bidder identity, increment check, and immutable audit event.',
  },
];

export default function PrivateSellerAuctionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] pt-4 text-[#061C2B] sm:pt-5">
        <section
          className="border-y-[3px] border-[#061C2B] bg-[#FFB81C] px-5 py-6 sm:px-8 sm:py-7"
          aria-label="Private Seller Auctions launch status"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p className="shrink-0 text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl">
              Coming soon
            </p>
            <p className="max-w-2xl text-base font-bold leading-7 sm:text-right">
              Preview how verified private sellers will auction their vehicles.
              Live listings and bidding are not available yet.
            </p>
          </div>
        </section>
        <section className="border-b-[3px] border-[#061C2B] bg-[#061C2B] px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.23em] text-[#16C7BE]">
                Private owners · timed bidding
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl">
                Private seller
                <span className="block text-[#FFB81C]">vehicle auctions.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Let verified owners auction their own vehicles directly to
                verified buyers, with an optional reserve price and clear bid
                activity—without mixing in dealer inventory.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  className="h-12 rounded-none bg-[#FFB81C] px-6 font-black uppercase text-[#061C2B] hover:bg-[#FFF8EA]"
                  nativeButton={false}
                  render={<a href="/private-seller-auctions/create" />}
                >
                  Auction your car <ArrowRight />
                </Button>
                <Button
                  className="h-12 rounded-none border-2 border-[#16C7BE] bg-transparent px-6 font-black uppercase text-white hover:bg-[#16C7BE] hover:text-[#061C2B]"
                  nativeButton={false}
                  render={<a href="#demo-auctions" />}
                >
                  Browse auctions
                </Button>
              </div>
            </div>
            <aside className="border-2 border-[#16C7BE] bg-[#0a293c] p-6 shadow-[8px_8px_0_#16C7BE]">
              <Gavel className="size-9 text-[#FFB81C]" />
              <h2 className="mt-5 text-2xl font-black uppercase">
                Preview mode—not live bidding
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                These fictional auctions demonstrate the experience. No bid,
                reserve, vehicle, or seller shown here is real, and no payment
                is accepted.
              </p>
            </aside>
          </div>
        </section>

        <section className="border-b-2 border-[#061C2B] bg-[#dff4f1] px-5 py-8 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {auctionChecks.map(({ icon: Icon, title, body }) => (
              <div className="flex gap-4" key={title}>
                <span className="flex size-11 shrink-0 items-center justify-center border-2 border-[#061C2B] bg-[#16C7BE]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-black uppercase">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-24" id="demo-auctions">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 border-b-[3px] border-[#061C2B] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
                  Fictional examples
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-6xl">
                  Preview private auctions.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Demo vehicles are not for sale. Bid controls show the planned
                interaction only.
              </p>
            </div>
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {demoPrivateAuctions.map((auction) => (
                <PrivateAuctionCard auction={auction} key={auction.slug} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y-[3px] border-[#061C2B] bg-[#FFB81C] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em]">
              The auction path
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-6xl">
              Set it. Verify it. Bid on it.
            </h2>
            <div className="mt-10 grid border-[3px] border-[#061C2B] bg-[#FFF8EA] md:grid-cols-3">
              {[
                [
                  '01',
                  'Seller sets the terms',
                  'Choose a starting bid, 3-, 5-, or 7-day duration, and an optional private reserve.',
                ],
                [
                  '02',
                  'OwnerOnly reviews the vehicle',
                  'Identity, ownership, VIN, photos, title status, and auction terms must pass review.',
                ],
                [
                  '03',
                  'Verified buyers bid',
                  'Accepted bids follow fixed increments. The highest eligible bid wins only when the auction rules are satisfied.',
                ],
              ].map(([number, title, body], index) => (
                <article
                  className={`p-7 ${index > 0 ? 'border-t-[3px] border-[#061C2B] md:border-l-[3px] md:border-t-0' : ''}`}
                  key={title}
                >
                  <p className="text-xs font-black tracking-[0.2em]">
                    {number}
                  </p>
                  <h3 className="mt-8 text-2xl font-black uppercase leading-none">
                    {title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#061C2B] px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#16C7BE]">
                Own the vehicle? Set the terms.
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
                Build your auction preview.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                Reserve pricing stays private. Payments, escrow, financing, and
                title transfer are not part of this first version.
              </p>
            </div>
            <Button
              className="h-12 rounded-none bg-[#16C7BE] px-7 font-black uppercase text-[#061C2B] hover:bg-[#FFF8EA]"
              nativeButton={false}
              render={<a href="/private-seller-auctions/create" />}
            >
              Start an auction <ArrowRight />
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
