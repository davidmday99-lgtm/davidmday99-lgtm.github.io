'use client';

import type { User } from '@supabase/supabase-js';
import {
  BadgeCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.assign('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open account menu for ${displayName}`}
        className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#FFB81C]"
      >
        <Avatar className="size-11 border-2 border-[#061C2B] bg-[#16C7BE] shadow-[3px_3px_0_#061C2B]">
          {avatarUrl ? (
            <AvatarImage
              alt=""
              referrerPolicy="no-referrer"
              src={avatarUrl}
            />
          ) : null}
          <AvatarFallback className="bg-[#16C7BE] font-black text-[#061C2B]">
            {userInitials(user)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-none border-2 border-[#061C2B] bg-[#FFF8EA] p-2 text-[#061C2B] shadow-[5px_5px_0_#061C2B]"
        sideOffset={10}
      >
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block truncate text-sm font-black text-[#061C2B]">
            {displayName}
          </span>
          <span className="mt-1 block truncate text-xs font-normal text-slate-600">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#061C2B]/20" />
        <DropdownMenuItem
          className="cursor-pointer rounded-none px-2 py-2 font-bold focus:bg-[#16C7BE]"
          onClick={() => window.location.assign('/dashboard')}
        >
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-none px-2 py-2 font-bold focus:bg-[#16C7BE]"
          onClick={() => window.location.assign('/account/verification')}
        >
          <BadgeCheck />
          Verification
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-none px-2 py-2 font-bold focus:bg-[#16C7BE]"
          onClick={() => window.location.assign('/settings')}
        >
          <Settings />
          Privacy & settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#061C2B]/20" />
        <DropdownMenuItem
          className="cursor-pointer rounded-none px-2 py-2 font-bold text-red-700 focus:bg-red-100 focus:text-red-800"
          onClick={() => void signOut()}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);

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
              aria-label="Open menu"
              className="text-[#061C2B] hover:bg-[#16C7BE]/15 hover:text-[#0B8F89]"
              size="icon"
              variant="ghost"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
