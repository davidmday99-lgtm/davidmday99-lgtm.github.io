'use client';

import type { User } from '@supabase/supabase-js';
import { BadgeCheck, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { loginPath } from '@/lib/auth-return';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

export function SellerIdentityGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null | undefined>(() =>
    hasSupabaseConfig() ? undefined : null,
  );

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

  if (user === undefined) {
    return (
      <div className="flex min-h-72 items-center justify-center border-2 border-navy bg-white">
        <LoaderCircle
          aria-hidden="true"
          className="size-8 animate-spin text-teal-700"
        />
        <span className="sr-only">Checking account sign-in</span>
      </div>
    );
  }

  if (!user) {
    return (
      <GateCard
        body="Sign in to create, publish, and manage your vehicle listing. No identity check or ownership-document upload is required."
        buttonHref={loginPath('/sell')}
        buttonLabel="Log in to continue"
        eyebrow="Free owner account"
        icon={LockKeyhole}
        title="Log in before creating a listing."
      />
    );
  }

  return <>{children}</>;
}

function GateCard({
  body,
  buttonHref,
  buttonLabel,
  eyebrow,
  icon: Icon,
  title,
}: {
  body: string;
  buttonHref: string;
  buttonLabel: string;
  eyebrow: string;
  icon: typeof BadgeCheck;
  title: string;
}) {
  return (
    <section className="border-2 border-navy bg-white p-6 shadow-[8px_8px_0_rgba(7,28,44,.15)] sm:p-8">
      <div className="flex max-w-2xl items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center border-2 border-navy bg-[#96d9ed]">
          <Icon aria-hidden="true" className="size-6 text-navy" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-navy sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">{body}</p>
          <Button
            className="mt-6 h-12 rounded-none bg-[#16c7be] px-6 font-black uppercase text-navy shadow-[4px_4px_0_#061c2b] hover:bg-[#f6b82b]"
            nativeButton={false}
            render={<a href={buttonHref} />}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
