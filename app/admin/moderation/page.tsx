import type { Metadata } from 'next';

import { AdminModerationConsole } from '@/components/admin-moderation-console';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Moderation Center | OwnerOnly Cars',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9] text-navy">
        <div className="border-b-2 border-navy bg-[#96d9ed] px-5 py-9 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">
              Private administrator area
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
              Trust & moderation center
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-navy/75">
              Review ownership documents, investigate automated risk flags, and
              suspend accounts with a permanent audit record.
            </p>
          </div>
        </div>
        <AdminModerationConsole />
      </main>
    </>
  );
}

