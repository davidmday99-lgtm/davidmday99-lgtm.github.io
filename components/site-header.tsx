'use client';

import type { User } from '@supabase/supabase-js';
import {
  BadgeCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

function userInitials(user: User) {
  const fullName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';

  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  return user.email?.slice(0, 1).toUpperCase() ?? 'U';
}

function AccountMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const avatarUrl =
    typeof user.user_metadata.avatar_url === 'string'
      ? user.user_metadata.avatar_url
      : typeof user.user_metadata.picture === 'string'
        ? user.user_metadata.picture
        : undefined;
  const displayName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name
      : 'Your account';

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.assign('/');
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label={`Open account menu for ${displayName}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="block rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#FFB81C]"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        type="button"
      >
        <Avatar className="size-11 border-2 border-[#061C2B] bg-[#16C7BE] shadow-[3px_3px_0_#061C2B]">
          {avatarUrl ? (
            <AvatarImage alt="" referrerPolicy="no-referrer" src={avatarUrl} />
          ) : null}
          <AvatarFallback className="bg-[#16C7BE] font-black text-[#061C2B]">
            {userInitials(user)}
          </AvatarFallback>
        </Avatar>
      </button>
      {isOpen ? (
        <div
          aria-label="Account options"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 border-2 border-[#061C2B] bg-[#FFF8EA] p-2 text-[#061C2B] shadow-[5px_5px_0_#061C2B]"
          role="menu"
        >
          <div className="px-2 py-2">
            <span className="block truncate text-sm font-black text-[#061C2B]">
              {displayName}
            </span>
            <span className="mt-1 block truncate text-xs font-normal text-slate-600">
              {user.email}
            </span>
          </div>
          <div className="my-1 h-px bg-[#061C2B]/20" />
          <a
            className="flex items-center gap-2 px-2 py-2 text-sm font-bold hover:bg-[#16C7BE] focus:bg-[#16C7BE] focus:outline-none"
            href="/dashboard"
            role="menuitem"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </a>
          <a
            className="flex items-center gap-2 px-2 py-2 text-sm font-bold hover:bg-[#16C7BE] focus:bg-[#16C7BE] focus:outline-none"
            href="/account/verification"
            role="menuitem"
          >
            <BadgeCheck className="size-4" />
            Verification
          </a>
          <a
            className="flex items-center gap-2 px-2 py-2 text-sm font-bold hover:bg-[#16C7BE] focus:bg-[#16C7BE] focus:outline-none"
            href="/settings"
            role="menuitem"
          >
            <Settings className="size-4" />
            Privacy & settings
          </a>
          <div className="my-1 h-px bg-[#061C2B]/20" />
          <button
            className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-bold text-red-700 hover:bg-red-100 focus:bg-red-100 focus:outline-none"
            onClick={() => void signOut()}
            role="menuitem"
            type="button"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = getSupabaseBrowserClient();
    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#061C2B] py-[6px] shadow-[0_5px_0_rgba(6,28,43,.2)]">
      <div className="border-y-2 border-[#16C7BE] bg-[#FFF8EA]">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            className="flex h-[76px] w-[234px] shrink-0 items-center overflow-hidden sm:w-[274px] lg:w-[304px]"
            href="/"
            aria-label="Owner Only Cars home"
          >
            <img
              alt="Owner Only Cars — Cars from people, not lots."
              className="w-[230px] max-w-none sm:w-[270px] lg:w-[300px]"
              src="/owneronly-logo.png"
            />
          </a>
          <nav
            className="hidden items-center gap-3 text-center text-[10px] font-black uppercase leading-[1.15] tracking-wide text-[#061C2B] lg:flex xl:text-[11px]"
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
              href="/private-seller-auctions"
            >
              Private Seller
              <br />
              Auctions
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
              href="/value-checker"
            >
              Value
              <br />
              Checker
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/trust-and-safety"
            >
              Trust &<br />
              Safety
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/our-story"
            >
              Our
              <br />
              Story
            </a>
            <a
              className="border-b-2 border-transparent py-3 hover:border-[#16C7BE] hover:text-[#0B8F89]"
              href="/blog"
            >
              Blog
            </a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <AccountMenu user={user} />
            ) : (
              <>
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
              </>
            )}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {user ? <AccountMenu user={user} /> : null}
            <Button
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="text-[#061C2B] hover:bg-[#16C7BE]/15 hover:text-[#0B8F89]"
              onClick={() => setMobileMenuOpen((open) => !open)}
              size="icon"
              variant="ghost"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen ? (
          <nav
            aria-label="Mobile navigation"
            className="border-t-2 border-[#061C2B] bg-[#FFF8EA] px-5 py-5 lg:hidden"
            id="mobile-navigation"
          >
            <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2">
              {[
                ['Buy from owners', '/search'],
                ['Private seller auctions', '/private-seller-auctions'],
                ['Public auto auctions', '/public-auto-auctions'],
                ['Sell your car', '/sell'],
                ['Value checker', '/value-checker'],
                ['Trust & safety', '/trust-and-safety'],
                ['Our story', '/our-story'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <a
                  className="border-2 border-[#061C2B] bg-white px-4 py-3 text-sm font-black uppercase text-[#061C2B] hover:bg-[#16C7BE]"
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mx-auto mt-4 flex max-w-7xl gap-3 border-t border-[#061C2B]/20 pt-4">
              {user ? (
                <>
                  <Button
                    className="h-11 flex-1 rounded-none border-2 border-[#061C2B] bg-white font-black uppercase text-[#061C2B]"
                    nativeButton={false}
                    render={<a href="/dashboard" />}
                    variant="outline"
                  >
                    Dashboard
                  </Button>
                  <Button
                    className="h-11 flex-1 rounded-none bg-[#16C7BE] font-black uppercase text-[#061C2B] hover:bg-[#FFB81C]"
                    nativeButton={false}
                    render={<a href="/settings" />}
                  >
                    Settings
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="h-11 flex-1 rounded-none border-2 border-[#061C2B] bg-white font-black uppercase text-[#061C2B]"
                    nativeButton={false}
                    render={<a href="/login" />}
                    variant="outline"
                  >
                    Log in
                  </Button>
                  <Button
                    className="h-11 flex-1 rounded-none bg-[#16C7BE] font-black uppercase text-[#061C2B] hover:bg-[#FFB81C]"
                    nativeButton={false}
                    render={<a href="/signup" />}
                  >
                    Join free
                  </Button>
                </>
              )}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
