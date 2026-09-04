import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  conditionQuestionGroups,
  featureGroups,
} from '@/lib/listing-disclosures';

function needsAttention(questionId: string, answer: string) {
  if (questionId === 'starts_drives') return answer !== 'Starts and drives';
  if (questionId === 'key_count') return answer !== '2 or more';
  return answer === 'Yes' || answer === 'Not sure' || answer === 'No keys';
}

export function PublishedListingDisclosures({
  answers,
  features,
}: {
  answers: Record<string, string>;
  features: string[];
}) {
  const categorizedFeatures = featureGroups
    .map((group) => ({
      category: group.category,
      items: group.features.filter((feature) => features.includes(feature)),
    }))
    .filter((group) => group.items.length > 0);
  const knownFeatures = new Set(
    featureGroups.flatMap((group) => [...group.features]),
  );
  const uncategorizedFeatures = features.filter(
    (feature) => !knownFeatures.has(feature),
  );
  if (uncategorizedFeatures.length) {
    categorizedFeatures.push({
      category: 'Other reported features',
      items: uncategorizedFeatures,
    });
  }

  return (
    <>
      <section className="mt-12" id="condition">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
          As reported by owner
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-navy">
          Vehicle condition
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          These are the seller’s submitted answers. They are not an independent
          inspection or guarantee, so buyers should confirm the condition before
          paying.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {conditionQuestionGroups.map((group) => (
            <article
              className="border-2 border-navy bg-white p-5"
              key={group.category}
            >
              <h3 className="font-black uppercase text-navy">
                {group.category}
              </h3>
              <dl className="mt-4 divide-y divide-slate-200">
                {group.questions.map((question) => {
                  const answer = answers[question.id] || 'Not provided';
                  const flagged =
                    answer === 'Not provided' ||
                    needsAttention(question.id, answer);
                  return (
                    <div
                      className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                      key={question.id}
                    >
                      <dt className="text-sm leading-5 text-slate-600">
                        {question.label}
                      </dt>
                      <dd>
                        <Badge
                          className={`rounded-none ${flagged ? 'bg-amber-100 text-amber-900' : 'bg-teal-50 text-teal-800'}`}
                        >
                          {flagged ? <AlertTriangle /> : <CheckCircle2 />}
                          {answer}
                        </Badge>
                      </dd>
                    </div>
                  );
                })}
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
        {categorizedFeatures.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {categorizedFeatures.map((group) => (
              <article
                className="border-2 border-navy bg-white p-5"
                key={group.category}
              >
                <h3 className="font-black uppercase text-navy">
                  {group.category}
                </h3>
                <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  {group.items.map((feature) => (
                    <li className="flex items-start gap-2" key={feature}>
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 border-2 border-navy bg-white p-5 text-sm text-slate-600">
            The seller did not select any installed features.
          </div>
        )}
      </section>

      <section className="mt-12 border-2 border-navy bg-teal-50 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-teal-800" />
          <div>
            <h2 className="text-xl font-black uppercase text-navy">
              Identity and ownership reviewed
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              OwnerOnly reviewed the seller’s identity and ownership document
              before publication. Buyers must still inspect the vehicle, verify
              the VIN, and review the original title before completing a sale.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
