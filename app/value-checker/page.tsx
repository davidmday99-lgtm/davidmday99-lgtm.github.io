import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ValueChecker } from '@/components/value-checker';

export const metadata: Metadata = {
  title: 'Used Car Value Checker | OwnerOnly Cars',
  description:
    'Compare Kelley Blue Book and Edmunds private-party values, calculate a midpoint and range, and check an asking price.',
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9] text-navy">
        <section className="border-b-2 border-navy bg-[#96d9ed] px-5 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <span className="block-label">Independent value comparison</span>
            <h1 className="mt-7 max-w-5xl text-4xl font-black uppercase leading-[.94] tracking-[-0.055em] sm:text-6xl">
              Check the value from two trusted guides.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-navy/75">
              Run the same vehicle through Kelley Blue Book and Edmunds, then
              compare their private-party values and the seller’s asking price
              in one place.
            </p>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <ValueChecker />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

