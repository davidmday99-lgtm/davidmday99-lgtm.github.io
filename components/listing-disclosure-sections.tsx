import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  CARAMEL_FEES_URL,
  CARAMEL_HOW_IT_WORKS_URL,
  CARAMEL_START_URL,
} from '@/lib/caramel';
import { getListingDisclosure } from '@/lib/listing-disclosures';

export function ListingDisclosureSections({ slug }: { slug: string }) {
  const disclosure = getListingDisclosure(slug);

  return (
    <>
      <section className="mt-10" id="condition">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
          As reported by owner
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-navy">
          Vehicle condition
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          These answers are seller disclosures, not an inspection or guarantee.
          Confirm condition independently before paying.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {disclosure.condition.map((group) => (
            <article
              className="border-2 border-navy bg-white p-5"
              key={group.category}
            >
              <h3 className="font-black uppercase text-navy">
                {group.category}
              </h3>
              <dl className="mt-4 divide-y divide-slate-200">
                {group.items.map((item) => (
                  <div
                    className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                    key={item.question}
                  >
                    <dt className="text-sm leading-5 text-slate-600">
                      {item.question}
                    </dt>
                    <dd>
                      <Badge
                        className={`rounded-none ${item.needsAttention ? 'bg-amber-100 text-amber-900' : 'bg-teal-50 text-teal-800'}`}
                      >
                        {item.needsAttention ? (
                          <AlertTriangle />
                        ) : (
                          <CheckCircle2 />
                        )}{' '}
                        {item.answer}
                      </Badge>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" id="features">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
          As reported by owner
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-navy">
          Features and upgrades
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {disclosure.features.map((group) => (
            <article
              className="border border-slate-300 bg-white p-5"
              key={group.category}
            >
              <h3 className="font-black uppercase text-navy">
                {group.category}
              </h3>
              <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li className="flex items-start gap-2" key={item}>
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2" id="seller">
        <article className="border-2 border-navy bg-[#96d9ed] p-6 shadow-[6px_6px_0_rgba(7,28,44,.16)]">
          <UserRound className="size-7 text-navy" />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-navy/65">
            Seller information
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase text-navy">
            Private owner · approximate location
          </h2>
          <dl className="mt-5 space-y-3 text-sm text-navy">
            <div className="flex gap-3">
              <ShieldCheck className="size-5 shrink-0" />
              <div>
                <dt className="font-black">Identity</dt>
                <dd>{disclosure.seller.identity}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="size-5 shrink-0" />
              <div>
                <dt className="font-black">Ownership</dt>
                <dd>{disclosure.seller.ownership}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <LockKeyhole className="size-5 shrink-0" />
              <div>
                <dt className="font-black">Privacy</dt>
                <dd>{disclosure.seller.locationPrivacy}</dd>
              </div>
            </div>
          </dl>
        </article>

        <article className="border-2 border-navy bg-white p-6 shadow-[6px_6px_0_rgba(7,28,44,.16)]">
          <Search className="size-7 text-teal-700" />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-teal-800">
            Independent research
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase text-navy">
            Reviews, recalls, and value
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            OwnerOnly does not invent an owner-review rating or copy another
            site’s score. Use current third-party research and confirm it
            matches the exact year, trim, and VIN.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 border-2 border-navy bg-navy px-4 py-3 text-sm font-black uppercase text-white"
              href="https://www.edmunds.com/car-reviews/"
              rel="noreferrer"
              target="_blank"
            >
              Owner reviews <ExternalLink className="size-4" />
            </a>
            <a
              className="inline-flex items-center gap-2 border-2 border-navy bg-white px-4 py-3 text-sm font-black uppercase text-navy"
              href="https://www.nhtsa.gov/recalls"
              rel="noreferrer"
              target="_blank"
            >
              Recall lookup <ExternalLink className="size-4" />
            </a>
            <a
              className="inline-flex items-center gap-2 border-2 border-navy bg-[#f6b82b] px-4 py-3 text-sm font-black uppercase text-navy"
              href="/value-checker"
            >
              Value checker
            </a>
          </div>
        </article>
      </section>

      <section className="mt-12 border-2 border-navy bg-navy p-6 text-white shadow-[7px_7px_0_#16b9ad]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6b82b]">
          Transaction support · third party
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase">
          Optional checkout with Caramel
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          After the buyer and seller agree, either party may choose to continue
          on Caramel for identity verification, offers, secure payment,
          financing, title and registration support, and pickup or delivery
          options. Caramel is a separate service. OwnerOnly is not affiliated
          with Caramel and receives no referral fee.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-2 border-2 border-white bg-[#f6b82b] px-4 py-3 text-sm font-black uppercase text-navy"
            href={CARAMEL_START_URL}
            rel="noreferrer"
            target="_blank"
          >
            Start secure checkout <ExternalLink className="size-4" />
          </a>
          <a
            className="inline-flex items-center gap-2 border-2 border-white bg-white px-4 py-3 text-sm font-black uppercase text-navy"
            href={CARAMEL_HOW_IT_WORKS_URL}
            rel="noreferrer"
            target="_blank"
          >
            How Caramel works <ExternalLink className="size-4" />
          </a>
          <a
            className="inline-flex items-center gap-2 border-2 border-white px-4 py-3 text-sm font-black uppercase text-white"
            href={CARAMEL_FEES_URL}
            rel="noreferrer"
            target="_blank"
          >
            Current fees <ExternalLink className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
