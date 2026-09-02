import {
  CarFront,
  CheckCircle2,
  Eye,
  MessageSquare,
  Plus,
} from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Draft listings', value: '0', icon: CarFront, color: '#96d9ed' },
  { label: 'Listing views', value: '0', icon: Eye, color: '#f6b82b' },
  {
    label: 'New messages',
    value: '0',
    icon: MessageSquare,
    color: '#22b8ae',
  },
];

export default function Page() {
  return (
    <AccountShell eyebrow="Seller workspace" title="Your dashboard">
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            className="border-2 border-navy p-5 shadow-[5px_5px_0_rgba(7,28,44,.14)]"
            style={{ backgroundColor: color }}
            key={label}
          >
            <Icon className="size-6" />
            <p className="mt-6 text-4xl font-black text-navy">{value}</p>
            <p className="text-sm font-bold uppercase tracking-wide text-navy/70">
              {label}
            </p>
          </div>
        ))}
      </div>

      <section
        id="listings"
        className="mt-8 border-2 border-navy bg-white p-6"
      >
        <div className="flex flex-col gap-4 border-b-2 border-navy pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase text-navy">
              My listings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your private-owner vehicle listings.
            </p>
          </div>
          <Button
            className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
            nativeButton={false}
            render={<a href="/sell" />}
          >
            <Plus /> Create listing
          </Button>
        </div>

        <div className="mt-6 flex flex-col items-center border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <span className="grid size-14 place-items-center border-2 border-navy bg-[#96d9ed] shadow-[4px_4px_0_#071c2c]">
            <CarFront aria-hidden="true" className="size-7 text-navy" />
          </span>
          <h3 className="mt-6 text-xl font-black uppercase text-navy">
            No listings yet
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Your draft and published vehicles will appear here after you create
            your first listing.
          </p>
          <Button
            className="mt-6 h-11 rounded-none bg-[#f6b82b] font-black uppercase text-navy"
            nativeButton={false}
            render={<a href="/sell" />}
          >
            <Plus /> List your first vehicle
          </Button>
        </div>
      </section>

      <div className="mt-8 flex gap-3 border-l-4 border-teal-500 bg-teal-50 p-5">
        <CheckCircle2 className="size-5 shrink-0 text-teal-700" />
        <p className="text-sm leading-6 text-slate-700">
          Publishing stays locked until phone, identity,
          ownership-document, attestation, and listing review requirements are
          complete.
        </p>
      </div>
    </AccountShell>
  );
}
