import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a className="flex h-16 w-52 items-center overflow-hidden" href="/" aria-label="OwnerOnly Cars home">
          <img alt="OwnerOnly Cars — Cars from people, not lots." className="w-full" src="/owneronly-logo.png" />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex" aria-label="Main navigation">
          <a className="hover:text-navy" href="/search">Browse cars</a>
          <a className="hover:text-navy" href="/how-it-works">How it works</a>
          <a className="hover:text-navy" href="/trust-and-safety">Trust & safety</a>
          <a className="hover:text-navy" href="/seller-fees">Seller fees</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button className="h-10 px-4 text-navy" nativeButton={false} render={<a href="/login" />} variant="ghost">Log in</Button>
          <Button className="h-10 bg-teal-500 px-5 font-bold text-navy hover:bg-teal-400" nativeButton={false} render={<a href="/sell" />}>Sell your car</Button>
        </div>
        <Button aria-label="Open menu" className="md:hidden" size="icon" variant="ghost"><Menu /></Button>
      </div>
    </header>
  );
}
