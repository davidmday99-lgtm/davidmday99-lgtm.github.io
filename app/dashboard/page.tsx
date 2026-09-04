import { CarFront, CheckCircle2, Eye, MessageSquare } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { MyListings } from '@/components/my-listings';

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

      <MyListings />

      <div className="mt-8 flex gap-3 border-l-4 border-teal-500 bg-teal-50 p-5">
        <CheckCircle2 className="size-5 shrink-0 text-teal-700" />
        <p className="text-sm leading-6 text-slate-700">
          Publishing stays locked until phone, identity, ownership-document,
          attestation, and listing review requirements are complete.
        </p>
      </div>
    </AccountShell>
  );
}
