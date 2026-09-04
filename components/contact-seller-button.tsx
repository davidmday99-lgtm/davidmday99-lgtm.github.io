'use client';

import type { User } from '@supabase/supabase-js';
import { LoaderCircle, MessageSquare } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { loginPath } from '@/lib/auth-return';
import { normalizeIdentityStatus } from '@/lib/identity-verification';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

function identityStatusFor(user: User | null) {
  const verification = user?.app_metadata?.identity_verification;
  return normalizeIdentityStatus(
    verification && typeof verification === 'object'
      ? (verification as { status?: unknown }).status
      : undefined,
  );
}

export function ContactSellerButton({
  listingId,
  sellerId,
  listingSlug,
}: {
  listingId: string;
  sellerId: string;
  listingSlug: string;
}) {
  const [user, setUser] = useState<User | null>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      queueMicrotask(() => setUser(null));
      return;
    }
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

  const isSeller = Boolean(user && user.id === sellerId);
  const status = useMemo(() => identityStatusFor(user ?? null), [user]);

  async function contactSeller() {
    setError('');
    const returnTo = `/listing?slug=${encodeURIComponent(listingSlug)}`;
    if (!user) {
      window.location.assign(loginPath(returnTo));
      return;
    }
    if (isSeller) {
      window.location.assign('/messages');
      return;
    }
    if (status !== 'verified') {
      window.location.assign('/account/verification');
      return;
    }

    setBusy(true);
    const { data, error: requestError } = await getSupabaseBrowserClient().rpc(
      'start_listing_conversation',
      { target_listing_id: listingId },
    );
    setBusy(false);

    if (requestError || typeof data !== 'string') {
      const message = requestError?.message ?? '';
      if (message.includes('identity_verification_required')) {
        window.location.assign('/account/verification');
        return;
      }
      setError(
        message.includes('listing_not_available')
          ? 'This listing is no longer available.'
          : 'The conversation could not be opened. Please try again.',
      );
      return;
    }

    window.location.assign(`/messages?conversation=${encodeURIComponent(data)}`);
  }

  return (
    <div className="mt-7">
      <Button
        className="h-12 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400"
        disabled={busy || user === undefined}
        onClick={() => void contactSeller()}
      >
        {busy || user === undefined ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <MessageSquare />
        )}
        {isSeller ? 'Open seller inbox' : 'Contact verified seller'}
      </Button>
      {error && (
        <p className="mt-3 border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}
      {!isSeller && (
        <p className="mt-3 text-center text-xs text-slate-500">
          Sign in and complete identity verification to message.
        </p>
      )}
    </div>
  );
}
