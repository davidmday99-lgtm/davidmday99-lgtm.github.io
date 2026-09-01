import { Landmark, ShieldAlert } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const auctionNav = [
  ['All states', '/public-auto-auctions'],
  ['Federal sources', '/public-auto-auctions/federal'],
  ['Online auctions', '/public-auto-auctions/online'],
  ['How auctions work', '/public-auto-auctions/how-auctions-work'],
  ['Auction safety', '/public-auto-auctions/auction-safety'],
] as const;

export function AuctionShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="border-b-2 border-navy bg-[#f6b82b] text-navy">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3 text-xs font-bold sm:px-8">
          <Landmark className="size-4 shrink-0" />
          <p>Independent informational directory. OwnerOnly Cars is not affiliated with any government agency or auction operator.</p>
        </div>
      </div>
      <nav className="border-b-2 border-navy bg-white" aria-label="Public auto auction navigation">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8">
          {auctionNav.map(([label, href]) => <a className="whitespace-nowrap border-x border-transparent px-4 py-4 text-xs font-black uppercase tracking-wide text-slate-600 hover:border-navy hover:bg-[#dff4f8] hover:text-navy" href={href} key={href}>{label}</a>)}
        </div>
      </nav>
      {children}
      <section className="border-y-2 border-navy bg-[#f8f4e9] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-4"><ShieldAlert className="mt-1 size-6 shrink-0 text-teal-700" /><div><h2 className="font-black uppercase text-navy">Before you register or bid</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Verify the auction through the linked official source. Confirm public eligibility, licensing, title status, buyer premium, taxes, deposit, inspection, payment, pickup, and transportation rules directly with the operator. Auction vehicles may be sold as-is.</p></div></div>
      </section>
      <SiteFooter />
    </>
  );
}
