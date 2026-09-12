import type { Metadata } from 'next';
import { BadgeCheck, FileCheck2, ShieldCheck } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { ListingWizard } from '@/components/listing-wizard';
import { SellerIdentityGate } from '@/components/seller-identity-gate';

export const metadata: Metadata = {
  title: 'Sell Your Vehicle Privately',
  description:
    'Create a private-owner vehicle listing on OwnerOnly Cars. Verified sellers can list cars, motorcycles, boats, RVs, ATVs, trailers, snowmobiles, and personal watercraft.',
  alternates: { canonical: '/sell' },
};

const listingSteps = [
  {
    icon: BadgeCheck,
    title: 'Verify your identity',
    detail:
      'Complete the secure government-ID check through Stripe Identity before entering vehicle details.',
  },
  {
    icon: FileCheck2,
    title: 'Document the vehicle',
    detail:
      'Add vehicle facts, condition disclosures, photos, and proof of ownership.',
  },
  {
    icon: ShieldCheck,
    title: 'Publish after review',
    detail:
      'Ownership documents receive a private human review before publication.',
  },
] as const;

export default function Page() {
  return (
    <AccountShell eyebrow="Private-owner listing" title="Sell your vehicle">
      <section className="mb-8 border-2 border-navy bg-white p-6 shadow-[6px_6px_0_rgba(7,28,44,.15)] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
          Cars from people, not lots
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
          Create a verified private-owner listing.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Posting is free. Sell your vehicle directly to buyers without dealer
          inventory or an unnecessary dealer markup. Stripe Identity handles the
          government-ID check, and Owner Only Cars separately reviews ownership
          documents before publication.
        </p>
        <ol className="mt-6 grid gap-4 lg:grid-cols-3">
          {listingSteps.map(({ icon: Icon, title, detail }, index) => (
            <li className="border border-slate-300 bg-slate-50 p-4" key={title}>
              <div className="flex items-center gap-3">
                <Icon aria-hidden="true" className="size-5 text-teal-800" />
                <span className="text-xs font-black uppercase tracking-wide text-teal-800">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-3 font-black uppercase text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <SellerIdentityGate>
        <ListingWizard />
      </SellerIdentityGate>
    </AccountShell>
  );
}
