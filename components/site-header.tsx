import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-[#16C7BE] bg-[#061C2B] shadow-[0_5px_0_rgba(6,28,43,.2)]">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          className="flex h-20 w-56 items-center overflow-hidden lg:w-60"
          href="/"
          aria-label="OwnerOnly Cars home"
        >
          <img
            alt="OwnerOnly Cars — Cars from people, not lots."
            className="max-h-[72px] w-full object-contain object-left"
            src="/owneronly-hero-logo.png"
          />
        </a>
        <nav
          className="hidden items-center gap-6 text-xs font-black uppercase tracking-wide text-[#FFF8EA] lg:flex"
          aria-label="Main navigation"
        >
          <a
            className="border-b-2 border-transparent py-2 hover:border-[#16C7BE] hover:text-[#16C7BE]"
            href="/search"
          >
            Buy From Owners
          </a>
          <a
            className="border-b-2 border-transparent py-2 hover:border-[#16C7BE] hover:text-[#16C7BE]"
            href="/public-auto-auctions"
          >
            Public Auto Auctions
          </a>
          <a
            className="border-b-2 border-transparent py-2 hover:border-[#16C7BE] hover:text-[#16C7BE]"
            href="/sell"
          >
            Sell Your Car
          </a>
          <a
            className="border-b-2 border-transparent py-2 hover:border-[#16C7BE] hover:text-[#16C7BE]"
            href="/trust-and-safety"
          >
            Trust & Safety
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button
            className="h-11 rounded-none px-4 font-black uppercase text-[#FFF8EA] hover:bg-[#16C7BE]/15 hover:text-[#16C7BE]"
            nativeButton={false}
            render={<a href="/login" />}
            variant="ghost"
          >
            Log in
          </Button>
          <Button
            className="h-11 rounded-none border-2 border-[#FFB81C] bg-[#FFB81C] px-5 font-black uppercase text-[#061C2B] shadow-[4px_4px_0_#16C7BE] hover:bg-[#FFF8EA]"
            nativeButton={false}
            render={<a href="/signup" />}
          >
            Join free
          </Button>
        </div>
        <Button
          aria-label="Open menu"
          className="text-[#FFF8EA] hover:bg-[#16C7BE]/15 hover:text-[#16C7BE] lg:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
}
