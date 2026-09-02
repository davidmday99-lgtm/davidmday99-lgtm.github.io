'use client';

import { Check, ListChecks } from 'lucide-react';

import {
  conditionQuestionGroups,
  featureGroups,
} from '@/lib/listing-disclosures';

export function VehicleConditionFields({
  answers,
  onAnswer,
}: {
  answers: Record<string, string>;
  onAnswer: (id: string, answer: string) => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-start gap-3 border-l-4 border-teal-600 bg-teal-50 p-4">
        <ListChecks className="mt-0.5 size-5 shrink-0 text-teal-800" />
        <div>
          <h3 className="font-black uppercase text-navy">Vehicle condition disclosure</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Answer every question accurately. “Yes” answers are disclosures—not automatic rejections.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {conditionQuestionGroups.map((group) => (
          <fieldset className="border border-slate-300 bg-slate-50 p-4" key={group.category}>
            <legend className="px-2 text-xs font-black uppercase tracking-[0.14em] text-teal-800">
              {group.category}
            </legend>
            <div className="space-y-4">
              {group.questions.map((question) => (
                <label className="block text-sm font-bold leading-5 text-navy" key={question.id}>
                  {question.label}
                  <select
                    className="mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm font-normal"
                    onChange={(event) => onAnswer(question.id, event.target.value)}
                    value={answers[question.id] ?? ''}
                  >
                    <option value="">Choose an answer</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export function VehicleFeatureFields({
  reviewed,
  selected,
  onReviewedChange,
  onToggle,
}: {
  reviewed: boolean;
  selected: string[];
  onReviewedChange: (reviewed: boolean) => void;
  onToggle: (feature: string) => void;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-black uppercase text-navy">Installed features and upgrades</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Select only equipment currently installed and working on this vehicle.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {featureGroups.map((group) => (
          <fieldset className="border border-slate-300 bg-slate-50 p-4" key={group.category}>
            <legend className="px-2 text-xs font-black uppercase tracking-[0.14em] text-teal-800">
              {group.category}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.features.map((feature) => (
                <label className="flex items-start gap-2 text-sm leading-5 text-navy" key={feature}>
                  <input
                    checked={selected.includes(feature)}
                    className="mt-0.5 size-4 shrink-0"
                    onChange={() => onToggle(feature)}
                    type="checkbox"
                  />
                  {feature}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <label className="mt-5 flex items-start gap-3 border-2 border-navy bg-white p-4 text-sm font-bold leading-6 text-navy">
        <input
          checked={reviewed}
          className="mt-1 size-4 shrink-0"
          onChange={(event) => onReviewedChange(event.target.checked)}
          type="checkbox"
        />
        <span>
          I reviewed this list and selected only installed equipment.
          {selected.length > 0 && (
            <span className="mt-1 flex items-center gap-1 text-xs font-normal text-teal-800">
              <Check className="size-3" /> {selected.length} features selected
            </span>
          )}
        </span>
      </label>
    </div>
  );
}
