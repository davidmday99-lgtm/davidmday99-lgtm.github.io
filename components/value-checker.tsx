'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Info,
  Scale,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { compareVehicleValue } from '@/lib/value-checker';

const KBB_APPRAISAL_URL = 'https://www.kbb.com/whats-my-car-worth/';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function ResultCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`border-2 border-navy p-5 ${emphasis ? 'bg-[#FFB81C] shadow-[5px_5px_0_#061C2B]' : 'bg-white'}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-navy/70">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-navy">
        {value}
      </p>
    </div>
  );
}

export function ValueChecker() {
  const [vehicle, setVehicle] = useState('');
  const [mileage, setMileage] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [kbbValue, setKbbValue] = useState('');
  const [askingPrice, setAskingPrice] = useState('');

  const comparison = useMemo(
    () => compareVehicleValue(kbbValue, askingPrice),
    [askingPrice, kbbValue],
  );

  const positionCopy = comparison?.askingPricePosition
    ? {
        'below-guide': 'The asking price is below the Kelley Blue Book value.',
        'matches-guide': 'The asking price matches the Kelley Blue Book value.',
        'above-guide': 'The asking price is above the Kelley Blue Book value.',
      }[comparison.askingPricePosition]
    : null;

  return (
    <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <section className="border-2 border-navy bg-white p-5 shadow-[7px_7px_0_rgba(7,28,44,.16)] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#96d9ed] text-navy">
            <Gauge className="size-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
              Step 1
            </p>
            <h2 className="text-2xl font-black uppercase text-navy">
              Keep the inputs consistent
            </h2>
          </div>
        </div>

        <p className="mt-5 leading-7 text-slate-600">
          Use the correct trim, mileage, condition, options, and ZIP code when
          checking Kelley Blue Book. Small differences can move the result
          considerably.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-navy sm:col-span-2">
            Vehicle
            <Input
              className="mt-2 h-12 rounded-none"
              onChange={(event) => setVehicle(event.target.value)}
              placeholder="2021 Honda CR-V EX AWD"
              value={vehicle}
            />
          </label>
          <label className="text-sm font-bold text-navy">
            Mileage
            <Input
              className="mt-2 h-12 rounded-none"
              inputMode="numeric"
              onChange={(event) => setMileage(event.target.value)}
              placeholder="48,500"
              value={mileage}
            />
          </label>
          <label className="text-sm font-bold text-navy">
            ZIP code
            <Input
              className="mt-2 h-12 rounded-none"
              inputMode="numeric"
              maxLength={5}
              onChange={(event) =>
                setZipCode(event.target.value.replace(/\D/g, '').slice(0, 5))
              }
              placeholder="63101"
              value={zipCode}
            />
          </label>
        </div>

        <div className="mt-6">
          <Button
            className="h-12 w-full rounded-none bg-navy font-black uppercase"
            nativeButton={false}
            render={
              <a href={KBB_APPRAISAL_URL} rel="noreferrer" target="_blank" />
            }
          >
            Open Kelley Blue Book <ExternalLink />
          </Button>
        </div>

        <div className="mt-6 flex gap-3 border-l-4 border-[#16C7BE] bg-teal-50 p-4 text-sm leading-6 text-slate-700">
          <Info className="mt-0.5 size-5 shrink-0 text-teal-800" />
          <p>
            Choose <strong>private-party value</strong>. A dealer trade-in value
            is not the same as a private-sale value.
          </p>
        </div>
      </section>

      <section className="border-2 border-navy bg-[#dff4f8] p-5 shadow-[7px_7px_0_#061C2B] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[#FFB81C] text-navy">
            <Calculator className="size-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
              Step 2
            </p>
            <h2 className="text-2xl font-black uppercase text-navy">
              Check the asking price
            </h2>
          </div>
        </div>

        {(vehicle || mileage || zipCode) && (
          <p className="mt-5 border-b border-navy/20 pb-4 text-sm font-bold text-navy">
            {[vehicle, mileage ? `${mileage} miles` : '', zipCode ? `ZIP ${zipCode}` : '']
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-navy">
            Kelley Blue Book private-party value
            <Input
              className="mt-2 h-12 rounded-none bg-white"
              inputMode="decimal"
              onChange={(event) => setKbbValue(event.target.value)}
              placeholder="$22,400"
              value={kbbValue}
            />
          </label>
          <label className="text-sm font-bold text-navy">
            Asking price <span className="font-normal text-slate-500">(optional)</span>
            <Input
              className="mt-2 h-12 rounded-none bg-white"
              inputMode="decimal"
              onChange={(event) => setAskingPrice(event.target.value)}
              placeholder="$22,900"
              value={askingPrice}
            />
          </label>
        </div>

        {comparison ? (
          <div className="mt-7" aria-live="polite">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="KBB private-party value"
                value={currency.format(comparison.guideValue)}
                emphasis
              />
              {comparison.askingPrice !== null && (
                <>
                  <ResultCard
                    label="Asking price"
                    value={currency.format(comparison.askingPrice)}
                  />
                  <ResultCard
                    label="Difference"
                    value={`${currency.format(Math.abs(comparison.askingDifference ?? 0))} · ${Math.abs(comparison.askingDifferencePercent ?? 0)}%`}
                  />
                </>
              )}
            </div>

            {comparison.askingPrice !== null && (
              <div className="mt-5 border-2 border-navy bg-white p-5">
                <div className="flex items-start gap-3">
                  <Scale className="mt-0.5 size-6 shrink-0 text-teal-700" />
                  <div>
                    <h3 className="font-black uppercase text-navy">
                      Asking-price check
                    </h3>
                    <p className="mt-2 leading-7 text-slate-700">
                      {positionCopy}{' '}
                      <strong>
                        It is {currency.format(Math.abs(comparison.askingDifference ?? 0))}{' '}
                        ({Math.abs(comparison.askingDifferencePercent ?? 0)}%)
                        {comparison.askingDifference === 0
                          ? ' from the KBB value'
                          : comparison.askingDifference && comparison.askingDifference > 0
                            ? ' above the KBB value'
                            : ' below the KBB value'}.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-3 border-l-4 border-teal-600 bg-white p-4 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-700" />
              <p>
                Use this guide as a negotiation starting point. Vehicle
                condition, local demand, title history, options, and inspection
                findings can justify a different price.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-7 border-2 border-dashed border-navy/45 bg-white/70 p-8 text-center">
            <Calculator className="mx-auto size-9 text-teal-700" />
            <p className="mt-3 font-black uppercase text-navy">
              Enter the Kelley Blue Book value
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The asking-price check will appear here automatically.
            </p>
          </div>
        )}
      </section>

      <aside className="lg:col-span-2">
        <div className="flex flex-col gap-4 border-2 border-navy bg-navy p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFB81C]">
              Independent sources
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              OwnerOnly Cars is not affiliated with or endorsed by Kelley Blue
              Book. Its name and valuation results belong to its owner.
              OwnerOnly does not copy, store, or certify Kelley Blue Book data;
              this page only calculates from the number you enter.
            </p>
          </div>
          <Button
            className="h-11 shrink-0 rounded-none bg-white font-black uppercase text-navy hover:bg-[#FFB81C]"
            nativeButton={false}
            render={<a href="/search" />}
          >
            Compare listings <ArrowRight />
          </Button>
        </div>
      </aside>
    </div>
  );
}
