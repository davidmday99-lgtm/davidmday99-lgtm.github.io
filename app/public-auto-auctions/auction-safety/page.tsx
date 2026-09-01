import type { Metadata } from 'next';
import { AlertTriangle, BanknoteX, CarFront, ExternalLink, FileCheck2, ShieldAlert, Truck } from 'lucide-react';

import { AuctionShell } from '@/components/auction-shell';

export const metadata: Metadata = { title: 'Public Auto Auction Safety', description: 'Safety guidance for checking official public vehicle auctions, terms, titles, fees, inspections, payment and pickup.', alternates: { canonical: '/public-auto-auctions/auction-safety' } };

const safety = [
  { icon: ExternalLink, title: 'Verify the official source', body: 'Open the linked agency or agency-authorized operator. Confirm the event exists and that registration is still open.' },
  { icon: CarFront, title: 'Assume as-is', body: 'Auction vehicles may be sold as-is and where-is. Photos and descriptions are not a substitute for inspection.' },
  { icon: FileCheck2, title: 'Confirm the title', body: 'Check the title or ownership document supplied, title brand, VIN, release process, taxes, and any licensing restriction.' },
  { icon: AlertTriangle, title: 'Price the full cost', body: 'Confirm buyer premium, deposit, taxes, accepted payment methods, storage fees, and removal deadlines before bidding.' },
  { icon: Truck, title: 'Plan pickup first', body: 'Know the pickup location, hours, deadline, loading limits, drivability, and transportation requirement before you win.' },
  { icon: BanknoteX, title: 'Pay only the operator', body: 'Never send money based solely on OwnerOnly. OwnerOnly never accepts auction bids, deposits, payments, or credentials.' },
];

export default function Page() { return <AuctionShell><main className="bg-[#f8f4e9]"><section className="border-b-2 border-navy bg-[#f6b82b] px-5 py-16 sm:px-8"><div className="mx-auto max-w-7xl"><ShieldAlert className="size-10" /><h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[.9] tracking-[-0.06em] text-navy sm:text-7xl">Treat every bid like a final decision.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-navy/75">Directory inclusion is not an endorsement, affiliation, condition report, or vehicle guarantee.</p></div></section><section className="px-5 py-16 sm:px-8"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">{safety.map(({ icon: Icon, title, body }, index) => <article className={`${index === 5 ? 'bg-navy text-white' : 'bg-white text-navy'} border-2 border-navy p-6 shadow-[6px_6px_0_rgba(7,28,44,.14)]`} key={title}><Icon className={`size-7 ${index === 5 ? 'text-teal-300' : 'text-teal-700'}`} /><h2 className="mt-8 text-2xl font-black uppercase leading-none">{title}</h2><p className={`mt-4 text-sm leading-6 ${index === 5 ? 'text-slate-300' : 'text-slate-600'}`}>{body}</p></article>)}</div></section></main></AuctionShell>; }
