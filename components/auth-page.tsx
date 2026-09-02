'use client';

import { CheckCircle2, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSafeAuthReturnTo } from '@/lib/auth-return';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup';
  const [googleBusy, setGoogleBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  function returnAfterSignIn() {
    return getSafeAuthReturnTo(window.location.search);
  }

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = getSupabaseBrowserClient();
    let active = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setMessage('We could not finish Google sign-in. Please try again.');
        return;
      }
      if (data.session) window.location.replace(returnAfterSignIn());
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) window.location.replace(returnAfterSignIn());
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function continueWithGoogle() {
    setMessage(undefined);

    if (!hasSupabaseConfig()) {
      setMessage(
        'Google sign-in is ready in the site, but the Supabase project still needs to be connected.',
      );
      return;
    }

    setGoogleBusy(true);
    const supabase = getSupabaseBrowserClient();
    const returnTo = returnAfterSignIn();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login?oauth=complete&returnTo=${encodeURIComponent(returnTo)}`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      setMessage('Google sign-in could not start. Please try again.');
      setGoogleBusy(false);
    }
  }

  function handleEmailPreview(event: { preventDefault(): void }) {
    event.preventDefault();
    setMessage('Email sign-in is not connected yet. Please use Google.');
  }

  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100vh-5rem)] bg-[#f8f4e9] lg:grid-cols-2">
        <section className="flex items-center px-5 py-14 sm:px-10 lg:px-[max(3rem,calc((100vw-80rem)/2))]">
          <div className="w-full max-w-md">
            <p className="block-label">
              {signup ? 'Join the marketplace' : 'Welcome back'}
            </p>
            <h1 className="mt-7 text-5xl font-black uppercase leading-[.9] text-navy">
              {signup ? 'Create your account.' : 'Log in securely.'}
            </h1>
            <p className="mt-4 text-slate-600">
              {signup
                ? 'Browse immediately. Verify before listing or messaging.'
                : 'Access favorites, messages, listings, and verification status.'}
            </p>
            <form
              className="chunky-panel mt-8 space-y-5 bg-white p-6"
              onSubmit={handleEmailPreview}
            >
              <Button
                aria-describedby="google-auth-note"
                className="h-13 w-full rounded-none border-2 border-navy bg-[#16c7be] font-black uppercase tracking-wide text-navy shadow-[4px_4px_0_#071c2c] hover:bg-[#f6b82b] disabled:bg-[#16c7be] disabled:text-navy disabled:opacity-70"
                disabled={googleBusy}
                onClick={continueWithGoogle}
                type="button"
                variant="outline"
              >
                {googleBusy ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center border-2 border-navy bg-white text-base font-black normal-case text-[#4285f4]"
                  >
                    G
                  </span>
                )}
                {googleBusy
                  ? 'Connecting to Google…'
                  : signup
                    ? 'Sign up with Google'
                    : 'Continue with Google'}
              </Button>
              <p
                className="text-center text-xs leading-5 text-slate-500"
                id="google-auth-note"
              >
                Google securely handles sign-in. Owner Only Cars never receives
                your Google password or requests access to your Gmail.
              </p>
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  or continue with email
                </span>
                <span className="h-px flex-1 bg-slate-300" />
              </div>
              <label className="block text-sm font-bold text-navy">
                Email address
                <Input
                  className="mt-2 h-11 rounded-none"
                  type="email"
                  placeholder="you@example.com"
                />
              </label>
              {signup && (
                <label className="block text-sm font-bold text-navy">
                  Mobile phone
                  <Input
                    className="mt-2 h-11 rounded-none"
                    type="tel"
                    placeholder="(555) 555-1234"
                  />
                </label>
              )}
              <label className="block text-sm font-bold text-navy">
                Password
                <Input
                  className="mt-2 h-11 rounded-none"
                  type="password"
                  placeholder="At least 12 characters"
                />
              </label>
              <Button className="h-12 w-full rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400">
                {signup ? 'Create account' : 'Log in'}
              </Button>
              {message && (
                <output className="border-l-4 border-[#f6b82b] bg-amber-50 p-3 text-sm font-bold leading-6 text-navy">
                  {message}
                </output>
              )}
            </form>
            <p className="mt-6 text-sm text-slate-600">
              {signup ? 'Already have an account?' : 'New to Owner Only Cars?'}{' '}
              <a
                className="font-bold text-teal-800 underline"
                href={signup ? '/login' : '/signup'}
              >
                {signup ? 'Log in' : 'Create an account'}
              </a>
            </p>
          </div>
        </section>
        <section className="hidden items-center bg-navy px-16 text-white lg:flex">
          <div className="max-w-lg">
            <LockKeyhole className="size-12 text-teal-300" />
            <h2 className="mt-6 text-4xl font-black uppercase leading-none tracking-[-0.05em]">
              Verify once. Know what every badge means.
            </h2>
            <ul className="mt-8 space-y-5 text-slate-300">
              {[
                'Google or email account sign-in',
                'Phone and account confirmation',
                'Hosted government-ID check',
                'Separate ownership-document review',
                'Approximate public location only',
              ].map((item) => (
                <li className="flex items-center gap-3" key={item}>
                  <CheckCircle2 className="size-5 text-teal-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
