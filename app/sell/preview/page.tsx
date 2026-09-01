import { Eye, LockKeyhole } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import { demoListings } from '@/lib/demo-data';

export default function Page() { return <AccountShell eyebrow="Listing preview" title="Check what buyers will see"><div className="grid gap-8 lg:grid-cols-[390px_1fr]"><ListingCard listing={demoListings[0]} /><section className="border-2 border-navy bg-white p-6"><Eye className="size-7 text-teal-700" /><h2 className="mt-4 text-2xl font-black uppercase text-navy">Public fields only</h2><p className="mt-3 leading-7 text-slate-600">The preview excludes your legal name, exact address, phone, email, private ownership documents, provider session IDs, device data, and risk signals.</p><div className="mt-6 border-l-4 border-teal-500 bg-teal-50 p-4"><LockKeyhole className="mr-2 inline size-4" /><span className="text-sm font-bold text-navy">Approximate location: Near Madison, WI</span></div><div className="mt-7 flex flex-wrap gap-3"><Button className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy">Return to editor</Button><Button className="h-11 rounded-none" disabled variant="outline">Submit after verification</Button></div></section></div></AccountShell>; }
