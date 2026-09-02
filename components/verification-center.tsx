'use client';

import type { User } from '@supabase/supabase-js';
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LoaderCircle,
  Phone,
  RotateCcw,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginPath } from '@/lib/auth-return';
import {
  maskPhoneNumber,
  normalizePhoneNumber,
  phoneVerificationError,
} from '@/lib/phone-verification';
import {
  identityFailureMessage,
  normalizeIdentityStatus,
} from '@/lib/identity-verification';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

function getIdentityStatus(user?: User | null) {
  const verification = user?.app_metadata?.identity_verification;
  if (!verification || typeof verification !== 'object') return 'not_started';

  const status = (verification as { status?: unknown }).status;
  return normalizeIdentityStatus(status);
}

function getIdentityEndpoint() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('example-project')) return undefined;

  return new URL(
    '/functions/v1/create-identity-verification',
    supabaseUrl,
  ).toString();
}

export function VerificationCenter() {
  const [user, setUser] = useState<User | null | undefined>(() =>
    hasSupabaseConfig() ? undefined : null,
  );
  const [phonePanelOpen, setPhonePanelOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');
  const [code, setCode] = useState('');
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [identityBusy, setIdentityBusy] = useState(false);
  const [identityFailure, setIdentityFailure] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');

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

  const phoneVerified = Boolean(user?.phone && user.phone_confirmed_at);
  const userId = user?.id;
  const identityStatus = useMemo(() => getIdentityStatus(user), [user]);
  const verificationLoginPath = loginPath('/account/verification');

  const showMessage = useCallback(
    (text: string, tone: 'error' | 'success' = 'error') => {
      setMessage(text);
      setMessageTone(tone);
    },
    [],
  );

  async function sendPhoneCode() {
    if (!user) {
      showMessage('Log in before starting phone verification.');
      return;
    }

    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhoneNumber(phone);
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : 'Enter a valid phone number.',
      );
      return;
    }

    setPhoneBusy(true);
    setMessage(undefined);
    const { error } = await getSupabaseBrowserClient().auth.updateUser({
      phone: normalizedPhone,
    });
    setPhoneBusy(false);

    if (error) {
      showMessage(phoneVerificationError(error.message));
      return;
    }

    setPendingPhone(normalizedPhone);
    showMessage(
      'A six-digit verification code was sent by text message.',
      'success',
    );
  }

  async function verifyPhoneCode() {
    if (!pendingPhone || !/^\d{6}$/.test(code)) {
      showMessage('Enter the six-digit code from the text message.');
      return;
    }

    setPhoneBusy(true);
    setMessage(undefined);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: pendingPhone,
      token: code,
      type: 'phone_change',
    });

    if (error) {
      setPhoneBusy(false);
      showMessage(phoneVerificationError(error.message));
      return;
    }

    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setPhoneBusy(false);
    setPhonePanelOpen(false);
    setCode('');
    showMessage('Your mobile number is verified.', 'success');
  }

  async function resendPhoneCode() {
    if (!pendingPhone) return;

    setPhoneBusy(true);
    const { error } = await getSupabaseBrowserClient().auth.resend({
      type: 'phone_change',
      phone: pendingPhone,
    });
    setPhoneBusy(false);

    if (error) {
      showMessage(phoneVerificationError(error.message));
      return;
    }

    showMessage('A new verification code was sent.', 'success');
  }

  async function startIdentityCheck() {
    if (!user) {
      showMessage('Log in before starting identity verification.');
      return;
    }

    const endpoint = getIdentityEndpoint();
    if (!endpoint) {
      showMessage('Identity verification is not activated yet.');
      return;
    }

    setIdentityBusy(true);
    setMessage(undefined);

    try {
      const {
        data: { session },
      } = await getSupabaseBrowserClient().auth.getSession();

      if (!session) throw new Error('missing_session');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          returnUrl: `${window.location.origin}/account/verification?identity=returned`,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('identity_not_active');
        throw new Error('identity_unavailable');
      }

      const result = (await response.json()) as {
        failureCategory?: string | null;
        failureReason?: string | null;
        status?: unknown;
        url?: string;
      };
      const returnedStatus = normalizeIdentityStatus(result.status);
      setIdentityFailure(
        result.failureReason ??
          identityFailureMessage(result.failureCategory) ??
          undefined,
      );

      if (returnedStatus === 'processing' || returnedStatus === 'verified') {
        const { data } = await getSupabaseBrowserClient().auth.getUser();
        setUser(data.user);
        setIdentityBusy(false);
        showMessage(
          returnedStatus === 'verified'
            ? 'Your identity verification is complete.'
            : 'Stripe is still processing your submission. You can refresh the status here.',
          returnedStatus === 'verified' ? 'success' : 'error',
        );
        return;
      }

      const verificationUrl = result.url ? new URL(result.url) : undefined;
      const trustedStripeHost =
        verificationUrl?.protocol === 'https:' &&
        (verificationUrl.hostname === 'verify.stripe.com' ||
          verificationUrl.hostname.endsWith('.stripe.com'));

      if (!verificationUrl || !trustedStripeHost) {
        throw new Error('identity_unavailable');
      }

      window.location.assign(verificationUrl.toString());
    } catch (error) {
      setIdentityBusy(false);
      showMessage(
        error instanceof Error && error.message === 'identity_not_active'
          ? 'Stripe Identity is not active yet. The secure verification service must be deployed before IDs can be collected.'
          : 'Identity verification could not start. Please try again later.',
      );
    }
  }

  const refreshIdentityStatus = useCallback(
    async (showResult = true) => {
      const endpoint = getIdentityEndpoint();
      if (!endpoint) return 'not_started' as const;

      setIdentityBusy(true);
      if (showResult) setMessage(undefined);

      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error('missing_session');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'status' }),
        });
        if (!response.ok) throw new Error('identity_unavailable');

        const result = (await response.json()) as {
          failureCategory?: string | null;
          failureReason?: string | null;
          status?: unknown;
        };
        const status = normalizeIdentityStatus(result.status);
        setIdentityFailure(
          result.failureReason ??
            identityFailureMessage(result.failureCategory) ??
            undefined,
        );

        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        if (showResult) {
          if (status === 'verified') {
            showMessage('Your identity verification is complete.', 'success');
          } else if (status === 'processing') {
            showMessage('Stripe is still processing your submission.');
          } else if (status === 'requires_input') {
            showMessage(
              result.failureReason ??
                identityFailureMessage(result.failureCategory) ??
                'Stripe needs another clear ID submission. The retry button is ready.',
            );
          } else {
            showMessage('You can start a new identity check now.');
          }
        }

        return status;
      } catch {
        if (showResult) {
          showMessage(
            'The verification status could not be refreshed. Please try again.',
          );
        }
        return 'not_started' as const;
      } finally {
        setIdentityBusy(false);
      }
    },
    [showMessage],
  );

  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;
    if (
      new URLSearchParams(window.location.search).get('identity') !== 'returned'
    ) {
      return;
    }

    let active = true;
    void (async () => {
      for (let attempt = 0; attempt < 4 && active; attempt += 1) {
        const status = await refreshIdentityStatus(attempt === 3);
        if (status !== 'processing') {
          if (active && attempt < 3) await refreshIdentityStatus(true);
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 2500));
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshIdentityStatus, userId]);

  if (user === undefined) {
    return (
      <div className="flex min-h-64 items-center justify-center border-2 border-navy bg-white">
        <LoaderCircle
          aria-hidden="true"
          className="size-8 animate-spin text-teal-700"
        />
        <span className="sr-only">Loading verification status</span>
      </div>
    );
  }

  const identityCopy = {
    not_started: {
      status: 'Not started',
      body: 'Hosted government-ID document check through Stripe Identity.',
      action: 'Start identity check',
    },
    requires_input: {
      status: 'Needs attention',
      body:
        identityFailure ??
        'Stripe needs another submission before the identity check can be completed.',
      action: 'Try identity check again',
    },
    processing: {
      status: 'Processing',
      body: 'Stripe is processing the submitted identity information.',
      action: 'Refresh status',
    },
    verified: {
      status: 'Complete',
      body: 'Government-ID document check completed.',
      action: 'Complete',
    },
    canceled: {
      status: 'Not completed',
      body: 'The previous check was canceled. You can start a new secure ID check.',
      action: 'Start a new check',
    },
    redacted: {
      status: 'New check needed',
      body: 'The previous verification record is no longer available. Start a new secure ID check.',
      action: 'Start a new check',
    },
  }[identityStatus];

  return (
    <>
      {!user ? (
        <div className="mb-6 border-2 border-[#f6b82b] bg-amber-50 p-5 text-navy">
          <p className="font-black uppercase">Log in to verify your account</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Verification status is loaded from the signed-in account and is
            never assumed.
          </p>
          <Button
            className="mt-4 rounded-none bg-[#16c7be] font-black uppercase text-navy"
            nativeButton={false}
            render={<a href={verificationLoginPath} />}
          >
            Log in
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <VerificationCard
          action={
            !user
              ? 'Log in to verify'
              : phoneVerified
                ? 'Complete'
                : 'Verify phone'
          }
          body={
            phoneVerified
              ? maskPhoneNumber(user?.phone)
              : 'Confirm a mobile number using a six-digit text-message code.'
          }
          color="bg-teal-50"
          complete={phoneVerified}
          disabled={phoneVerified}
          href={!user ? verificationLoginPath : undefined}
          icon={Phone}
          onAction={() => setPhonePanelOpen(true)}
          status={
            !user
              ? 'Sign in required'
              : phoneVerified
                ? 'Complete'
                : 'Not started'
          }
          title="Phone verification"
        />

        <VerificationCard
          action={
            !user
              ? 'Log in to verify'
              : identityBusy
                ? 'Connecting…'
                : identityCopy.action
          }
          body={identityCopy.body}
          color="bg-[#96d9ed]"
          complete={identityStatus === 'verified'}
          disabled={identityBusy || identityStatus === 'verified'}
          href={!user ? verificationLoginPath : undefined}
          icon={BadgeCheck}
          loading={identityBusy}
          onAction={() =>
            void (identityStatus === 'processing'
              ? refreshIdentityStatus()
              : startIdentityCheck())
          }
          status={!user ? 'Sign in required' : identityCopy.status}
          title="Identity verification"
        />

        <VerificationCard
          action={!user ? 'Log in to continue' : 'Create a listing'}
          body="Submit a current title or registration inside each vehicle listing for private review."
          color="bg-[#f6b82b]"
          complete={false}
          disabled={false}
          href={user ? '/sell' : loginPath('/sell')}
          icon={FileCheck2}
          status="Needed per listing"
          title="Ownership verification"
        />
      </div>

      {phonePanelOpen && user && !phoneVerified ? (
        <section className="mt-7 border-2 border-navy bg-white p-6 shadow-[6px_6px_0_rgba(7,28,44,.15)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
                Secure SMS check
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-navy">
                Verify your mobile number
              </h2>
            </div>
            <Button
              className="rounded-none"
              onClick={() => setPhonePanelOpen(false)}
              variant="ghost"
            >
              Close
            </Button>
          </div>

          {!pendingPhone ? (
            <div className="mt-6 max-w-lg">
              <label
                className="text-sm font-bold text-navy"
                htmlFor="verification-phone"
              >
                Mobile phone
              </label>
              <Input
                autoComplete="tel"
                className="mt-2 h-12 rounded-none"
                id="verification-phone"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(555) 555-1234"
                type="tel"
                value={phone}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                United States numbers may be entered normally. Include + and the
                country code for other countries.
              </p>
              <Button
                className="mt-5 h-11 rounded-none bg-[#16c7be] font-black uppercase text-navy hover:bg-[#f6b82b]"
                disabled={phoneBusy}
                onClick={() => void sendPhoneCode()}
              >
                {phoneBusy ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Phone />
                )}
                Send verification code
              </Button>
            </div>
          ) : (
            <div className="mt-6 max-w-lg">
              <p className="text-sm leading-6 text-slate-600">
                Enter the six-digit code sent to the mobile number ending in{' '}
                {pendingPhone.slice(-4)}.
              </p>
              <label
                className="mt-4 block text-sm font-bold text-navy"
                htmlFor="verification-code"
              >
                Verification code
              </label>
              <Input
                autoComplete="one-time-code"
                className="mt-2 h-12 rounded-none text-lg tracking-[0.25em]"
                id="verification-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ''))
                }
                placeholder="000000"
                value={code}
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  className="h-11 rounded-none bg-[#16c7be] font-black uppercase text-navy hover:bg-[#f6b82b]"
                  disabled={phoneBusy || code.length !== 6}
                  onClick={() => void verifyPhoneCode()}
                >
                  {phoneBusy ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <CheckCircle2 />
                  )}
                  Verify code
                </Button>
                <Button
                  className="h-11 rounded-none border-navy"
                  disabled={phoneBusy}
                  onClick={() => void resendPhoneCode()}
                  variant="outline"
                >
                  <RotateCcw /> Resend code
                </Button>
                <Button
                  className="h-11 rounded-none"
                  onClick={() => {
                    setPendingPhone('');
                    setCode('');
                  }}
                  variant="ghost"
                >
                  Change number
                </Button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      {message ? (
        <output
          aria-live="polite"
          className={`mt-6 block border-l-4 p-4 text-sm font-bold leading-6 text-navy ${
            messageTone === 'success'
              ? 'border-teal-600 bg-teal-50'
              : 'border-[#f6b82b] bg-amber-50'
          }`}
        >
          {message}
        </output>
      ) : null}

      <div className="mt-8 border-2 border-navy bg-white p-6">
        <div className="flex gap-4">
          <AlertCircle className="mt-1 size-6 shrink-0 text-teal-700" />
          <div>
            <h2 className="font-black uppercase text-navy">Privacy promise</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Phone status comes from the authenticated account. Stripe hosts
              government-ID document collection. Owner Only Cars stores only the
              provider session ID, result, timestamps, failure category, and
              minimum approved fields—not raw ID images.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function VerificationCard({
  action,
  body,
  color,
  complete,
  disabled,
  href,
  icon: Icon,
  loading,
  onAction,
  status,
  title,
}: {
  action: string;
  body: string;
  color: string;
  complete: boolean;
  disabled: boolean;
  href?: string;
  icon: typeof Phone;
  loading?: boolean;
  onAction?: () => void;
  status: string;
  title: string;
}) {
  return (
    <article
      className={`${color} border-2 border-navy p-6 shadow-[6px_6px_0_rgba(7,28,44,.15)]`}
    >
      <div className="flex items-center justify-between">
        <Icon className="size-7" />
        {complete ? (
          <CheckCircle2 className="size-5 text-teal-800" />
        ) : (
          <Clock3 className="size-5" />
        )}
      </div>
      <p className="mt-8 text-xs font-black uppercase tracking-wide">
        {status}
      </p>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-navy">
        {title}
      </h2>
      <p className="mt-4 min-h-20 leading-6 text-navy/75">{body}</p>
      <Button
        className="mt-5 h-11 w-full rounded-none border-navy bg-white"
        disabled={disabled}
        nativeButton={!href}
        onClick={href ? undefined : onAction}
        render={href ? <a href={href} /> : undefined}
        variant="outline"
      >
        {loading ? <LoaderCircle className="animate-spin" /> : null}
        {action}
      </Button>
    </article>
  );
}
