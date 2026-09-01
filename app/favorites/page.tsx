import { Heart } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { ListingCard } from '@/components/listing-card';
import { demoListings } from '@/lib/demo-data';

export default function Page() { return <AccountShell eyebrow="Buyer workspace" title="Saved cars"><div className="mb-6 flex items-center gap-3 border-2 border-navy bg-white p-4"><Heart className="size-5 text-teal-700" /><p className="text-sm text-slate-600">Two fictional demo listings are saved to illustrate the buyer favorites state.</p></div><div className="grid gap-7 md:grid-cols-2">{demoListings.slice(0, 2).map((listing) => <ListingCard key={listing.slug} listing={listing} />)}</div></AccountShell>; }
