'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, EyeOff, Gavel } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const steps = ['Vehicle', 'Terms', 'Reserve', 'Story & photos', 'Review'];

const fieldClass =
  'mt-2 h-12 rounded-none border-2 border-[#061C2B] bg-white px-3 focus-visible:ring-[#16C7BE]';

export function AuctionSetupWizard() {
  const [step, setStep] = useState(0);
  const [hasReserve, setHasReserve] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border-[3px] border-[#061C2B] bg-[#dff4f1] p-8 shadow-[8px_8px_0_#16C7BE]">
        <BadgeCheck className="size-11 text-[#0B8F89]" />
        <h2 className="mt-5 text-3xl font-black uppercase">
          Demo review complete.
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-slate-700">
          This preview was not saved or submitted. In the live product, the
          seller would complete identity and ownership review before a moderator
          could approve the auction.
        </p>
        <Button
          className="mt-6 rounded-none bg-[#061C2B] font-black uppercase text-white"
          onClick={() => {
            setStep(0);
            setSubmitted(false);
          }}
        >
          Build another preview
        </Button>
      </div>
    );
  }

  return (
    <div className="border-[3px] border-[#061C2B] bg-white shadow-[8px_8px_0_rgba(6,28,43,.18)]">
      <ol className="grid grid-cols-5 border-b-[3px] border-[#061C2B] bg-[#dff4f1]">
        {steps.map((label, index) => (
          <li
            className={`min-w-0 px-2 py-3 text-center text-[9px] font-black uppercase sm:text-xs ${index === step ? 'bg-[#16C7BE]' : ''} ${index ? 'border-l border-[#061C2B]' : ''}`}
            key={label}
          >
            <span className="block">{index + 1}</span>
            <span className="hidden sm:block">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-6 sm:p-8">
        {step === 0 ? <VehicleStep /> : null}
        {step === 1 ? <TermsStep /> : null}
        {step === 2 ? (
          <ReserveStep hasReserve={hasReserve} setHasReserve={setHasReserve} />
        ) : null}
        {step === 3 ? <StoryStep /> : null}
        {step === 4 ? <ReviewStep hasReserve={hasReserve} /> : null}

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-200 pt-5">
          <Button
            className="rounded-none border-2 border-[#061C2B] font-black uppercase"
            disabled={step === 0}
            onClick={() => setStep((value) => value - 1)}
            variant="outline"
          >
            <ArrowLeft /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              className="rounded-none bg-[#061C2B] font-black uppercase text-white hover:bg-[#0B6F6A]"
              onClick={() => setStep((value) => value + 1)}
            >
              Save & continue <ArrowRight />
            </Button>
          ) : (
            <Button
              className="rounded-none bg-[#FFB81C] font-black uppercase text-[#061C2B] hover:bg-[#16C7BE]"
              onClick={() => setSubmitted(true)}
            >
              <Gavel /> Finish demo setup
            </Button>
          )}
        </div>
        <p className="mt-4 text-center text-xs font-bold text-slate-500">
          Demonstration only—entries are not uploaded, saved, or submitted.
        </p>
      </div>
    </div>
  );
}

function VehicleStep() {
  return (
    <StepFrame eyebrow="Step 1" title="Which vehicle are you auctioning?">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="VIN" placeholder="17-character VIN" />
        <Field
          label="Current mileage"
          placeholder="Example: 48,250"
          type="number"
        />
        <Field label="Year" placeholder="Example: 2020" type="number" />
        <Field label="Make and model" placeholder="Example: Honda Accord" />
      </div>
      <Notice>
        The live flow will decode the VIN, then require the title or
        registration to confirm the seller’s legal name and VIN.
      </Notice>
    </StepFrame>
  );
}

function TermsStep() {
  return (
    <StepFrame eyebrow="Step 2" title="Set the auction terms.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Starting bid"
          placeholder="Example: 5,000"
          type="number"
        />
        <label className="text-sm font-black uppercase">
          Auction length
          <select className={`${fieldClass} w-full`} defaultValue="7">
            <option value="3">3 days</option>
            <option value="5">5 days</option>
            <option value="7">7 days</option>
          </select>
        </label>
      </div>
      <div className="mt-5 border-2 border-[#061C2B] bg-[#dff4f1] p-4 text-sm leading-6">
        <strong>Planned rule:</strong> OwnerOnly sets consistent bid increments
        and extends the closing time when a qualified bid arrives in the final
        two minutes, helping prevent last-second sniping.
      </div>
    </StepFrame>
  );
}

function ReserveStep({
  hasReserve,
  setHasReserve,
}: {
  hasReserve: boolean;
  setHasReserve: (value: boolean) => void;
}) {
  return (
    <StepFrame eyebrow="Step 3" title="Would you like a reserve?">
      <label className="flex cursor-pointer items-start gap-4 border-[3px] border-[#061C2B] bg-[#fff3cf] p-5">
        <input
          checked={hasReserve}
          className="mt-1 size-5 accent-[#0B8F89]"
          onChange={(event) => setHasReserve(event.target.checked)}
          type="checkbox"
        />
        <span>
          <strong className="block text-lg uppercase">
            Set a private reserve price
          </strong>
          <span className="mt-1 block text-sm leading-6 text-slate-700">
            If bidding does not reach this minimum, the vehicle does not
            automatically sell.
          </span>
        </span>
      </label>
      {hasReserve ? (
        <div className="mt-6 max-w-sm">
          <Field
            label="Private reserve amount"
            placeholder="Example: 18,500"
            type="number"
          />
          <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <EyeOff className="mt-0.5 size-4 shrink-0" /> Bidders see only
            “reserve met” or “reserve not met”—never your dollar amount.
          </p>
        </div>
      ) : (
        <div className="mt-6 border-l-4 border-[#16C7BE] bg-slate-50 p-4 text-sm leading-6">
          <strong>No-reserve auction:</strong> the highest eligible bid can win
          when the auction closes, subject to the final auction rules and bidder
          eligibility.
        </div>
      )}
    </StepFrame>
  );
}

function StoryStep() {
  return (
    <StepFrame eyebrow="Step 4" title="Show buyers the real vehicle.">
      <label className="block text-sm font-black uppercase">
        Seller story and vehicle condition
        <textarea
          className="mt-2 min-h-36 w-full border-2 border-[#061C2B] bg-white p-3 font-normal normal-case outline-none focus:ring-3 focus:ring-[#16C7BE]/50"
          placeholder="Why are you selling? Describe maintenance, condition, flaws, modifications, and anything a buyer should know."
        />
      </label>
      <div className="mt-5 border-2 border-dashed border-[#061C2B] bg-slate-50 p-8 text-center">
        <p className="font-black uppercase">Photo upload area</p>
        <p className="mt-2 text-sm text-slate-600">
          The live flow will validate file signatures, strip metadata, and
          require exterior, interior, VIN, odometer, and flaw photos.
        </p>
      </div>
    </StepFrame>
  );
}

function ReviewStep({ hasReserve }: { hasReserve: boolean }) {
  return (
    <StepFrame eyebrow="Step 5" title="Review the planned auction.">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['Seller', 'Identity + ownership review required'],
          ['Auction', 'Starting bid + timed closing'],
          [
            'Reserve',
            hasReserve ? 'Private reserve selected' : 'No reserve selected',
          ],
          ['Buyer access', 'Verified accounts only'],
        ].map(([label, value]) => (
          <div
            className="border-2 border-[#061C2B] bg-slate-50 p-4"
            key={label}
          >
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 font-black">{value}</p>
          </div>
        ))}
      </div>
      <label className="mt-6 flex items-start gap-3 text-sm leading-6">
        <input className="mt-1 size-5 accent-[#0B8F89]" type="checkbox" />
        <span>
          I would attest that I own this vehicle, am not acting as a dealer,
          broker, or reseller, and would follow the auction rules. This checkbox
          is a visual demo only.
        </span>
      </label>
    </StepFrame>
  );
}

function StepFrame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0B8F89]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="text-sm font-black uppercase">
      {label}
      <Input className={fieldClass} placeholder={placeholder} type={type} />
    </label>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 border-l-4 border-[#16C7BE] bg-slate-50 p-4 text-sm leading-6">
      {children}
    </div>
  );
}
