import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-navy bg-[linear-gradient(110deg,#f6b82b_0%,#96d9ed_48%,#16b9ad_100%)] shadow-[0_5px_0_rgba(7,28,44,.16)]">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a className="flex h-20 w-60 items-center overflow-hidden lg:w-64" href="/" aria-label="OwnerOnly Cars home">
          <img alt="OwnerOnly Cars — Cars from people, not lots." className="w-full" src="/owneronly-logo.png" />
        </a>
        <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-wide text-navy lg:flex" aria-label="Main navigation">
          <a className="border-b-2 border-transparent py-2 hover:border-navy" href="/search">Buy From Owners</a>
          <a className="border-b-2 border-transparent py-2 hover:border-navy" href="/public-auto-auctions">Public Auto Auctions</a>
          <a className="border-b-2 border-transparent py-2 hover:border-navy" href="/sell">Sell Your Car</a>
          <a className="border-b-2 border-transparent py-2 hover:border-navy" href="/trust-and-safety">Trust & Safety</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button className="h-11 rounded-none px-4 font-black uppercase text-navy" nativeButton={false} render={<a href="/login" />} variant="ghost">Log in</Button>
          <Button className="h-11 rounded-none border-2 border-navy bg-[#f6b82b] px-5 font-black uppercase text-navy shadow-[4px_4px_0_#071c2c] hover:bg-[#ffd263]" nativeButton={false} render={<a href="/signup" />}>Join free</Button>
        </div>
        <Button aria-label="Open menu" className="md:hidden" size="icon" variant="ghost"><Menu /></Button>
      </div>
    </header>
  );
}
