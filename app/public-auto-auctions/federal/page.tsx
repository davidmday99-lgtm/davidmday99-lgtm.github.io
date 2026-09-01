import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

import { AuctionShell } from '@/components/auction-shell';
import { AuctionSourceCard } from '@/components/auction-source-card';
import { federalAuctionSources } from '@/lib/auction-data';

export const metadata: Metadata = { title: 'Federal Vehicle Auction Sources', description: 'Official federal sources for public government surplus and seized vehicle auctions.', alternates: { canonical: '/public-auto-auctions/federal' } };

export default function Page() { return <AuctionShell><main className="bg-[#f8f4e9]"><section className="border-b-2 border-navy bg-[#f6b82b] px-5 py-16 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">Federal directory</p><h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[.92] tracking-[-0.06em] text-navy sm:text-7xl">Go to the official source first.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-navy/75">National starting points for federal fleet surplus, excess property, seized assets, forfeited property, and tax-seized merchandise.</p></div></section><section className="px-5 py-16 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-9 flex gap-4 border-2 border-navy bg-white p-5"><AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-700" /><p className="text-sm leading-6 text-slate-700">No current auction dates or vehicle inventory are reproduced here. Follow the official source, then confirm the individual event’s public access, license rules, fees, inspection, payment, and pickup requirements.</p></div><div className="grid gap-7 lg:grid-cols-2 xl:grid-cols-3">{federalAuctionSources.map((source) => <AuctionSourceCard key={source.id} source={source} />)}</div></div></section></main></AuctionShell>; }
