import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#061C2B] py-[6px] shadow-[0_5px_0_rgba(6,28,43,.2)]">
      <div className="border-y-2 border-[#16C7BE] bg-[#FFF8EA]">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            className="flex h-[76px] w-52 shrink-0 items-center overflow-hidden sm:w-60 lg:w-[270px]"
            href="/"
            aria-label="OwnerOnly Cars home"
          >
            <img
              alt="OwnerOnly Cars — Cars from people, not lots."
              className="w-[230px] max-w-none sm:w-[270px] lg:w-[300px]"
              src="/owneronly-logo.png"
            />
          </a>
          <nav
            className="hidden items-center gap-7 text-center text-[11px] font-black uppercase leading-[1.15] tracking-wide text-[#061C2B] lg:flex"
            aria-label="Main navigation"
          >
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/search"
            >
              Buy From
              <br />
              Owners
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/public-auto-auctions"
            >
              Public Auto
              <br />
              Auctions
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/sell"
            >
              Sell Your
              <br />
              Car
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/trust-and-safety"
            >
              Trust &<br />
              Safety
            </a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              className="h-11 rounded-none px-4 text-xs font-black uppercase text-[#061C2B] hover:bg-[#16C7BE]/15 hover:text-[#0B8F89]"
              nativeButton={false}
              render={<a href="/login" />}
              variant="ghost"
            >
              Log in
            </Button>
            <Button
              className="h-11 rounded-none border-2 border-[#061C2B] bg-[#16C7BE] px-5 text-xs font-black uppercase text-[#061C2B] shadow-[3px_3px_0_#061C2B] hover:bg-[#FFB81C]"
              nativeButton={false}
              render={<a href="/signup" />}
            >
              Join free
            </Button>
          </div>
          <Button
            aria-label="Open menu"
            className="text-[#061C2B] hover:bg-[#16C7BE]/15 hover:text-[#0B8F89] lg:hidden"
            size="icon"
            variant="ghost"
          >
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  );
}
