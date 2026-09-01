import { ArrowRight, CarFront, CheckCircle2, Eye, MessageSquare, Plus } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Draft listings', value: '1', icon: CarFront, color: '#96d9ed' },
  { label: 'Listing views', value: '0', icon: Eye, color: '#f6b82b' },
  { label: 'New messages', value: '0', icon: MessageSquare, color: '#22b8ae' },
];

export default function Page() { return <AccountShell eyebrow="Seller workspace" title="Your dashboard"><div className="grid gap-5 md:grid-cols-3">{stats.map(({ label, value, icon: Icon, color }) => <div className="border-2 border-navy p-5 shadow-[5px_5px_0_rgba(7,28,44,.14)]" style={{ backgroundColor: color }} key={label}><Icon className="size-6" /><p className="mt-6 text-4xl font-black text-navy">{value}</p><p className="text-sm font-bold uppercase tracking-wide text-navy/70">{label}</p></div>)}</div><section id="listings" className="mt-8 border-2 border-navy bg-white p-6"><div className="flex flex-col gap-4 border-b-2 border-navy pb-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black uppercase text-navy">My listings</h2><p className="mt-1 text-sm text-slate-500">Demo seller workspace</p></div><Button className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy" nativeButton={false} render={<a href="/sell" />}><Plus /> Create listing</Button></div><div className="mt-6 grid items-center gap-5 border border-slate-300 p-4 sm:grid-cols-[110px_1fr_auto]"><img alt="Draft crossover listing" className="aspect-[4/3] size-full object-cover" src="/owner-car-driveway.png" /><div><Badge className="rounded-none bg-amber-100 text-amber-800">Draft</Badge><h3 className="mt-2 font-black uppercase text-navy">2021 Midsize Touring Crossover</h3><p className="mt-1 text-sm text-slate-500">Step 4 of 6 · Photos</p></div><a className="flex items-center gap-2 font-black uppercase text-teal-800" href="/sell">Continue <ArrowRight className="size-4" /></a></div></section><div className="mt-8 flex gap-3 border-l-4 border-teal-500 bg-teal-50 p-5"><CheckCircle2 className="size-5 shrink-0 text-teal-700" /><p className="text-sm leading-6 text-slate-700">Publishing stays locked until phone, identity, ownership-document, attestation, and listing review requirements are complete.</p></div></AccountShell>; }
