import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  ExternalLink,
  FileCheck2,
  Landmark,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CARAMEL_FEES_URL,
  CARAMEL_HOW_IT_WORKS_URL,
  CARAMEL_START_URL,
  caramelFeeSummary,
} from '@/lib/caramel';

const services = [
  { icon: BadgeCheck, label: 'Buyer and seller identity checks' },
  { icon: Landmark, label: 'Secure, traceable payment' },
  { icon: FileCheck2, label: 'Title and registration support' },
  { icon: CarFront, label: 'Optional financing and delivery' },
];

export function CaramelCheckoutSection() {
  return (
    <section className="border-y-[3px] border-navy bg-[#f6b82b] px-5 py-20 text-navy sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.23em] text-navy/65">
            Optional third-party checkout
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[.95] tracking-[-0.055em] sm:text-6xl">
            Found the car? Caramel can handle the transaction.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-navy/80">
            After an OwnerOnly buyer and seller agree on a deal, either party
            can choose to continue on Caramel for checkout. The transaction
            happens on Caramel—not on OwnerOnly Cars.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {services.map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-3 border-2 border-navy bg-[#fff8ea] p-4 font-bold"
                key={label}
              >
                <Icon className="size-5 shrink-0 text-teal-700" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              className="h-12 rounded-none border-2 border-navy bg-navy px-5 font-black uppercase text-white hover:bg-teal-700"
              nativeButton={false}
              render={
                <a href={CARAMEL_START_URL} rel="noreferrer" target="_blank" />
              }
            >
              Start with Caramel <ExternalLink />
            </Button>
            <Button
              className="h-12 rounded-none border-2 border-navy bg-white px-5 font-black uppercase text-navy"
              nativeButton={false}
              render={
                <a
                  href={CARAMEL_HOW_IT_WORKS_URL}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              variant="outline"
            >
              See how it works <ArrowRight />
            </Button>
          </div>
        </div>

        <aside className="border-2 border-navy bg-white p-7 shadow-[8px_8px_0_rgba(7,28,44,.22)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
            Caramel&apos;s published fees
          </p>
          <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em]">
            Know the cost before checkout.
          </h3>
          <dl className="mt-7 divide-y-2 divide-navy/15 border-y-2 border-navy">
            <div className="grid grid-cols-[1fr_auto] gap-5 py-5">
              <div>
                <dt className="font-black uppercase">Buyer</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600">
                  Handles their own title and registration
                </dd>
              </div>
              <dd className="text-3xl font-black">
                ${caramelFeeSummary.buyerSelfService}
              </dd>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-5 py-5">
              <div>
                <dt className="font-black uppercase">Buyer</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600">
                  Caramel handles title and registration
                </dd>
              </div>
              <dd className="text-3xl font-black">
                ${caramelFeeSummary.buyerFullService}
              </dd>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-5 py-5">
              <div>
                <dt className="font-black uppercase">Seller</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-600">
                  Base fee is generally waived above $1,000
                </dd>
              </div>
              <dd className="text-3xl font-black">$0*</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-5 text-slate-600">
            *Caramel may charge sellers ${caramelFeeSummary.sellerException} for
            a lien, a title not in the seller&apos;s name, or a sale below
            $1,000. Buyer fees may increase to $
            {caramelFeeSummary.buyerPossibleMaximum}. Fees and eligibility are
            set by Caramel and can change.
          </p>
          <a
            className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-teal-800 underline decoration-2 underline-offset-4"
            href={CARAMEL_FEES_URL}
            rel="noreferrer"
            target="_blank"
          >
            Verify current fees on Caramel <ExternalLink className="size-4" />
          </a>
          <p className="mt-6 border-l-4 border-[#f6b82b] bg-amber-50 p-4 text-sm font-bold leading-6">
            OwnerOnly Cars is not affiliated with Caramel, does not receive a
            referral fee, and does not control Caramel&apos;s eligibility,
            pricing, payments, or service.
          </p>
        </aside>
      </div>
    </section>
  );
}
