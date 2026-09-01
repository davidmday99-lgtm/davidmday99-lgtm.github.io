import type { Metadata } from 'next';
import { ArrowRight, Gavel, Landmark, SearchCheck, ShieldAlert } from 'lucide-react';

import { AuctionDirectory } from '@/components/auction-directory';
import { AuctionShell } from '@/components/auction-shell';
import { AuctionSourceCard } from '@/components/auction-source-card';
import { federalAuctionSources } from '@/lib/auction-data';

export const metadata: Metadata = {
  title: 'Public Auto Auctions Directory',
  description: 'Find official federal, state, and local public vehicle auction sources across all 50 states and Washington, D.C.',
  alternates: { canonical: '/public-auto-auctions' },
};

export default function Page() {
  const structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'OwnerOnly Cars Public Auto Auctions Directory', description: 'Independent directory of official public vehicle auction sources in the United States.', isPartOf: { '@type': 'WebSite', name: 'OwnerOnly Cars' } };
  return (
    <AuctionShell>
      <main className="bg-[#f8f4e9]">
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
        <section className="border-b-2 border-navy bg-[#96d9ed] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div><p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">Official-source directory · all 50 states + D.C.</p><h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.9] tracking-[-0.065em] text-navy sm:text-7xl">Public auto auctions, kept in their own lane.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-navy/75">Explore government surplus, seized, impound, and authorized public vehicle auction sources without mixing them into verified private-owner listings.</p></div>
            <div className="border-2 border-navy bg-white p-6 shadow-[8px_8px_0_#071c2c]"><ShieldAlert className="size-8 text-teal-700" /><h2 className="mt-4 text-xl font-black uppercase text-navy">Directory, not an auction house</h2><p className="mt-3 text-sm leading-6 text-slate-600">OwnerOnly Cars never accepts bids, deposits, auction payments, credentials, or vehicle consignments. Register and bid only through the linked official operator.</p></div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl"><AuctionDirectory /></div>
        </section>

        <section className="border-y-2 border-navy bg-navy px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.23em] text-[#f6b82b]">Start with the operator</p><h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.055em] sm:text-6xl">Official national sources.</h2><p className="mt-5 max-w-3xl leading-7 text-slate-300">These sources were checked against official federal pages on September 1, 2026. Event dates, fees, inventory, title status, and eligibility are intentionally not copied unless confirmed from the current official event.</p><div className="mt-10 grid gap-7 lg:grid-cols-3">{federalAuctionSources.slice(0, 3).map((source) => <AuctionSourceCard key={source.id} source={source} />)}</div><a className="mt-9 inline-flex items-center gap-2 bg-[#f6b82b] px-5 py-4 text-sm font-black uppercase tracking-wide text-navy" href="/public-auto-auctions/federal">View every federal source <ArrowRight className="size-4" /></a></div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              [Landmark, 'Federal, state and local', 'Official agencies come first. Contractors appear only when an agency identifies them as authorized.'],
              [SearchCheck, 'Human-verified sources', 'Newly discovered sources remain private until a moderator approves the official relationship and access rules.'],
              [Gavel, 'Bid with the operator', 'OwnerOnly links out for registration and bidding and never handles auction funds or passwords.'],
            ].map(([Icon, title, body]) => <article className="border-2 border-navy bg-white p-6 shadow-[5px_5px_0_rgba(7,28,44,.14)]" key={String(title)}><Icon className="size-7 text-teal-700" /><h2 className="mt-6 text-2xl font-black uppercase leading-none text-navy">{String(title)}</h2><p className="mt-4 text-sm leading-6 text-slate-600">{String(body)}</p></article>)}
          </div>
        </section>
      </main>
    </AuctionShell>
  );
}
