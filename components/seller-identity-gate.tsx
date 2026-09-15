'use client';

import type { User } from '@supabase/supabase-js';
import { BadgeCheck, LoaderCircle, LockKeyhole } from 'lucide-react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { loginPath } from '@/lib/auth-return';
import {
  type IdentityStatus,
  normalizeIdentityStatus,
} from '@/lib/identity-verification';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

function identityStatusFor(user?: User | null) {
  const verification = user?.app_metadata?.identity_verification;
  if (!verification || typeof verification !== 'object') {
    return normalizeIdentityStatus(undefined);
  }

  return normalizeIdentityStatus((verification as { status?: unknown }).status);
}

const SellerIdentityContext = createContext<IdentityStatus>('not_started');

export function useSellerIdentityStatus() {
  return useContext(SellerIdentityContext);
}

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

  const identityStatus = useMemo(() => identityStatusFor(user), [user]);

  if (user === undefined) {
    return (
      <div className="flex min-h-72 items-center justify-center border-2 border-navy bg-white">
        <LoaderCircle
          aria-hidden="true"
          className="size-8 animate-spin text-teal-700"
        />
        <span className="sr-only">Checking seller verification</span>
      </div>
    );
  }

  if (!user) {
    return (
      <GateCard
        body="Sign in first so we can securely check whether your government ID has already been verified."
        buttonHref={loginPath('/sell')}
        buttonLabel="Log in to continue"
        eyebrow="Seller protection"
        icon={LockKeyhole}
        title="Log in before creating a listing."
      />
    );
  }

  return (
    <SellerIdentityContext.Provider value={identityStatus}>
      {identityStatus !== 'verified' && (
        <section className="mb-7 border-2 border-teal-700 bg-teal-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center border-2 border-navy bg-[#96d9ed]">
              <BadgeCheck aria-hidden="true" className="size-5 text-navy" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
                Build first · verify when ready
              </p>
              <h2 className="mt-2 text-xl font-black uppercase text-navy sm:text-2xl">
                Create and preview your listing before verification.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Complete the vehicle details and preview how the listing will
                look. Stripe identity verification and private ownership-document
                review are required only when you are ready to submit it.
              </p>
            </div>
          </div>
        </section>
      )}
      {children}
    </SellerIdentityContext.Provider>
  );
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
