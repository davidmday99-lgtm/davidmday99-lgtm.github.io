import type { Metadata } from 'next';
import { Search, ShieldCheck } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WantedVehicleMarketplace } from '@/components/wanted-vehicle-marketplace';

export const metadata: Metadata = {
  title: 'Wanted Vehicles',
  description:
    'Post or browse wanted vehicle ads from identity-verified buyers looking for cars, motorcycles, boats, RVs, ATVs, trailers, snowmobiles, and personal watercraft.',
  alternates: { canonical: '/wanted' },
};

export default function WantedVehiclesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9]">
        <section className="relative overflow-hidden border-b-[3px] border-navy bg-navy px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,transparent_0_9px,rgba(255,255,255,.2)_9px_10px)]" />
          <div className="relative mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_0.55fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-300">
                Buyer wanted ads
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl">
                Looking for something specific?
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                Post the vehicle you want so private owners can see real buyer
                demand. Wanted ads are free and active for 90 days.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-2 border-teal-300 bg-white/5 p-5">
                <Search className="size-7 text-[#f6b82b]" />
                <p className="mt-3 font-black uppercase">
                  Any vehicle category
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Cars, powersports, boats, RVs, trailers, and more.
                </p>
              </div>
              <div className="border-2 border-teal-300 bg-white/5 p-5">
                <ShieldCheck className="size-7 text-[#f6b82b]" />
                <p className="mt-3 font-black uppercase">Verified posters</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Identity verification is required before an ad goes live.
                </p>
              </div>
            </div>
          </div>
        </section>
        <WantedVehicleMarketplace />
      </main>
      <SiteFooter />
    </>
  );
}
