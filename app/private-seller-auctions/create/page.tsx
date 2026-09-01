import type { Metadata } from 'next';
import { BadgeCheck, Camera, FileCheck2, UserCheck } from 'lucide-react';

import { AuctionSetupWizard } from '@/components/auction-setup-wizard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Create a Private Seller Auction | OwnerOnly Cars',
  description:
    'Preview the OwnerOnly Cars vehicle auction setup flow with an optional private reserve.',
};

const requirements = [
  [
    UserCheck,
    'Verified account',
    'Phone and identity verification are required before publication.',
  ],
  [
    FileCheck2,
    'Ownership documents',
    'The title or registration must align with the verified legal name and VIN.',
  ],
  [
    Camera,
    'Honest photos',
    'Show every side, the interior, odometer, VIN, and known flaws.',
  ],
] as const;

export default function CreatePrivateAuctionPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] px-5 py-12 text-[#061C2B] sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-600">
            <a
              className="font-black hover:underline"
              href="/private-seller-auctions"
            >
              Private seller auctions
            </a>{' '}
            / Create
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_330px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
                Seller auction preview
              </p>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl">
                Auction your car.
                <span className="block text-[#0B8F89]">Set your terms.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Choose a starting bid and auction length, then decide whether
                you want a private reserve. This demonstration does not save or
                publish anything.
              </p>
              <div className="mt-10">
                <AuctionSetupWizard />
              </div>
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-28">
              <div className="border-[3px] border-[#061C2B] bg-[#FFB81C] p-6 shadow-[7px_7px_0_#061C2B]">
                <BadgeCheck className="size-9" />
                <h2 className="mt-4 text-2xl font-black uppercase">
                  Before going live
                </h2>
                <p className="mt-3 text-sm leading-6">
                  Every auction must pass seller, ownership, vehicle, and
                  content review. A badge reduces uncertainty; it does not
                  guarantee condition or safety.
                </p>
              </div>
              {requirements.map(([Icon, title, body]) => (
                <div
                  className="flex gap-4 border-2 border-[#061C2B] bg-white p-5"
                  key={title}
                >
                  <Icon className="size-6 shrink-0 text-[#0B8F89]" />
                  <div>
                    <h2 className="font-black uppercase">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-xs leading-5 text-slate-500">
                Payments, escrow, financing, and title transfer are not provided
                in this MVP. Final auction terms and binding-bid rules require
                legal review before launch.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
