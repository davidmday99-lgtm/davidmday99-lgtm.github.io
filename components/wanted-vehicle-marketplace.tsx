'use client';

import type { User } from '@supabase/supabase-js';
import {
  BadgeCheck,
  CirclePlus,
  DollarSign,
  LoaderCircle,
  MapPin,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { loginPath } from '@/lib/auth-return';
import { normalizeIdentityStatus } from '@/lib/identity-verification';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import { catalogMakes, catalogModels } from '@/lib/vehicle-catalog';
import { getVehicleType, vehicleTypes } from '@/lib/vehicle-types';
import {
  emptyWantedVehicleDraft,
  wantedBudgetLabel,
  wantedVehicleDraftError,
  wantedYearLabel,
  type WantedVehicleAdRow,
  type WantedVehicleDraft,
} from '@/lib/wanted-ads';

const wantedAdColumns =
  'id,user_id,vehicle_type,make,model,year_min,year_max,max_budget,location_public,search_distance,description,status,expires_at,created_at';

function identityStatusFor(user?: User | null) {
  const verification = user?.app_metadata?.identity_verification;
  return normalizeIdentityStatus(
    verification && typeof verification === 'object'
      ? (verification as { status?: unknown }).status
      : undefined,
  );
}

function WantedFormGate({
  user,
  children,
}: {
  user: User | null | undefined;
  children: React.ReactNode;
}) {
  if (user === undefined) {
    return (
      <div className="grid min-h-64 place-items-center border-2 border-navy bg-white">
        <LoaderCircle
          aria-label="Checking account verification"
          className="size-8 animate-spin text-teal-700"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <WantedGateCard
        body="Sign in to post what you are looking for. Your email and contact details will not appear in the public ad."
        href={loginPath('/wanted')}
        label="Log in to post"
        title="Sign in before posting a wanted ad."
      />
    );
  }

  if (identityStatusFor(user) !== 'verified') {
    return (
      <WantedGateCard
        body="Wanted ads are limited to verified people so owners know the request came from a real buyer."
        href="/account/verification"
        label="Complete verification"
        title="Verify once before posting."
      />
    );
  }

  return <>{children}</>;
}

function WantedGateCard({
  body,
  href,
  label,
  title,
}: {
  body: string;
  href: string;
  label: string;
  title: string;
}) {
  return (
    <div className="border-[3px] border-navy bg-white p-7 shadow-[7px_7px_0_#16C7BE]">
      <BadgeCheck aria-hidden="true" className="size-9 text-teal-700" />
      <h2 className="mt-5 text-2xl font-black uppercase text-navy">{title}</h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{body}</p>
      <Button
        className="mt-6 h-12 rounded-none bg-teal-500 px-6 font-black uppercase text-navy hover:bg-[#f6b82b]"
        nativeButton={false}
        render={<a href={href} />}
      >
        {label}
      </Button>
    </div>
  );
}

export function WantedVehicleMarketplace() {
  const [user, setUser] = useState<User | null | undefined>(() =>
    hasSupabaseConfig() ? undefined : null,
  );
  const [ads, setAds] = useState<WantedVehicleAdRow[]>([]);
  const [adsLoading, setAdsLoading] = useState(() => hasSupabaseConfig());
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState<WantedVehicleDraft>(
    emptyWantedVehicleDraft,
  );
  const [safeAttestation, setSafeAttestation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadAds() {
    const { data, error } = await getSupabaseBrowserClient()
      .from('wanted_vehicle_ads')
      .select(wantedAdColumns)
      .eq('status', 'published')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setLoadError('Wanted ads could not be loaded. Please try again shortly.');
    } else {
      setAds((data ?? []) as WantedVehicleAdRow[]);
      setLoadError('');
    }
    setAdsLoading(false);
  }

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    queueMicrotask(() => void loadAds());
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

  const makeSuggestions = useMemo(
    () => catalogMakes(draft.vehicleType),
    [draft.vehicleType],
  );
  const modelSuggestions = useMemo(
    () => catalogModels(draft.vehicleType, draft.make),
    [draft.make, draft.vehicleType],
  );

  function updateDraft<K extends keyof WantedVehicleDraft>(
    key: K,
    value: WantedVehicleDraft[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === 'vehicleType' ? { make: '', model: '' } : {}),
      ...(key === 'make' ? { model: '' } : {}),
    }));
  }

  async function submitWantedAd(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setSuccess('');

    if (!user) {
      window.location.assign(loginPath('/wanted'));
      return;
    }
    if (identityStatusFor(user) !== 'verified') {
      window.location.assign('/account/verification');
      return;
    }
    if (!safeAttestation) {
      setSubmitError(
        'Confirm that the ad does not include private contact information.',
      );
      return;
    }

    const validationError = wantedVehicleDraftError(draft);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    const { error } = await getSupabaseBrowserClient().rpc(
      'create_wanted_vehicle_ad',
      {
        p_vehicle_type: draft.vehicleType,
        p_make: draft.make.trim(),
        p_model: draft.model.trim(),
        p_year_min: draft.yearMin ? Number(draft.yearMin) : null,
        p_year_max: draft.yearMax ? Number(draft.yearMax) : null,
        p_max_budget: draft.maxBudget ? Number(draft.maxBudget) : null,
        p_location_public: draft.locationPublic.trim(),
        p_search_distance: draft.searchDistance,
        p_description: draft.description.trim(),
      },
    );
    setSubmitting(false);

    if (error) {
      const message = error.message ?? '';
      if (message.includes('identity_verification_required')) {
        window.location.assign('/account/verification');
        return;
      }
      setSubmitError(
        message.includes('active_ad_limit_reached')
          ? 'You already have 10 active wanted ads. Contact support if an old ad should be removed.'
          : 'Your wanted ad could not be posted. Please try again.',
      );
      return;
    }

    setDraft(emptyWantedVehicleDraft);
    setSafeAttestation(false);
    setSuccess('Your wanted ad is live for 90 days.');
    setAdsLoading(true);
    await loadAds();
  }

  return (
    <>
      <section
        className="scroll-mt-28 border-b-[3px] border-navy bg-[#f8f4e9] px-5 py-14 sm:px-8 lg:py-20"
        id="post-wanted"
      >
        <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
              Post a wanted ad
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-navy sm:text-5xl">
              Tell owners exactly what you want.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Add the vehicle, budget, and approximate area. Your email, phone
              number, and street address stay off the public ad.
            </p>
            <div className="mt-8 border-l-4 border-[#f6b82b] bg-white p-5 text-sm font-bold leading-6 text-navy">
              Do not include contact information, payment details, or a precise
              home address. Public ads expire after 90 days.
            </div>
          </div>

          <WantedFormGate user={user}>
            <form
              className="border-[3px] border-navy bg-white p-6 shadow-[8px_8px_0_#16C7BE] sm:p-8"
              onSubmit={(event) => void submitWantedAd(event)}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-black text-navy">
                  Vehicle category
                  <select
                    className="mt-2 h-12 w-full border border-slate-300 bg-white px-3 text-base"
                    onChange={(event) =>
                      updateDraft(
                        'vehicleType',
                        event.target.value as WantedVehicleDraft['vehicleType'],
                      )
                    }
                    value={draft.vehicleType}
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-black text-navy">
                  Make (optional)
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    list="wanted-make-suggestions"
                    onChange={(event) =>
                      updateDraft('make', event.target.value)
                    }
                    placeholder="Jeep"
                    value={draft.make}
                  />
                  <datalist id="wanted-make-suggestions">
                    {makeSuggestions.map((make) => (
                      <option key={make} value={make} />
                    ))}
                  </datalist>
                </label>
                <label className="text-sm font-black text-navy">
                  Model (optional)
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    list="wanted-model-suggestions"
                    onChange={(event) =>
                      updateDraft('model', event.target.value)
                    }
                    placeholder="Grand Cherokee"
                    value={draft.model}
                  />
                  <datalist id="wanted-model-suggestions">
                    {modelSuggestions.map((model) => (
                      <option key={model} value={model} />
                    ))}
                  </datalist>
                </label>
                <label className="text-sm font-black text-navy">
                  Maximum budget (optional)
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    inputMode="numeric"
                    min="0"
                    onChange={(event) =>
                      updateDraft('maxBudget', event.target.value)
                    }
                    placeholder="25000"
                    type="number"
                    value={draft.maxBudget}
                  />
                </label>
                <label className="text-sm font-black text-navy">
                  Earliest year (optional)
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    max="2100"
                    min="1900"
                    onChange={(event) =>
                      updateDraft('yearMin', event.target.value)
                    }
                    placeholder="2018"
                    type="number"
                    value={draft.yearMin}
                  />
                </label>
                <label className="text-sm font-black text-navy">
                  Latest year (optional)
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    max="2100"
                    min="1900"
                    onChange={(event) =>
                      updateDraft('yearMax', event.target.value)
                    }
                    placeholder="2022"
                    type="number"
                    value={draft.yearMax}
                  />
                </label>
                <label className="text-sm font-black text-navy">
                  City, state, or ZIP
                  <Input
                    className="mt-2 h-12 rounded-none border-slate-300"
                    onChange={(event) =>
                      updateDraft('locationPublic', event.target.value)
                    }
                    placeholder="St. Louis, MO"
                    required
                    value={draft.locationPublic}
                  />
                </label>
                <label className="text-sm font-black text-navy">
                  Search area
                  <select
                    className="mt-2 h-12 w-full border border-slate-300 bg-white px-3 text-base"
                    onChange={(event) =>
                      updateDraft(
                        'searchDistance',
                        event.target
                          .value as WantedVehicleDraft['searchDistance'],
                      )
                    }
                    value={draft.searchDistance}
                  >
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                    <option value="nationwide">Nationwide</option>
                  </select>
                </label>
              </div>
              <label className="mt-5 block text-sm font-black text-navy">
                What are you looking for?
                <Textarea
                  className="mt-2 min-h-36 rounded-none border-slate-300 text-base"
                  maxLength={1500}
                  onChange={(event) =>
                    updateDraft('description', event.target.value)
                  }
                  placeholder="Share must-have features, acceptable condition, title preference, color, or other useful details."
                  required
                  value={draft.description}
                />
              </label>
              <label className="mt-5 flex items-start gap-3 text-sm font-bold leading-6 text-navy">
                <input
                  checked={safeAttestation}
                  className="mt-1 size-4 accent-teal-600"
                  onChange={(event) => setSafeAttestation(event.target.checked)}
                  type="checkbox"
                />
                I have not included an email address, phone number, street
                address, payment details, or other sensitive information.
              </label>
              {submitError ? (
                <p className="mt-5 border-l-4 border-red-600 bg-red-50 p-4 text-sm font-bold text-red-800">
                  {submitError}
                </p>
              ) : null}
              {success ? (
                <p className="mt-5 border-l-4 border-teal-600 bg-teal-50 p-4 text-sm font-bold text-teal-900">
                  {success}
                </p>
              ) : null}
              <Button
                className="mt-6 h-12 rounded-none bg-[#f6b82b] px-6 font-black uppercase text-navy hover:bg-teal-400"
                disabled={submitting}
                type="submit"
              >
                {submitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <CirclePlus />
                )}
                {submitting ? 'Posting…' : 'Post wanted ad'}
              </Button>
            </form>
          </WantedFormGate>
        </div>
      </section>

      <section className="bg-navy px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b border-white/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                Active requests
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em]">
                Vehicles buyers want
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-300">
              Public ads show only an approximate search area. Every poster was
              identity verified when the ad was created.
            </p>
          </div>

          {adsLoading ? (
            <div className="grid min-h-48 place-items-center">
              <LoaderCircle
                aria-label="Loading wanted ads"
                className="size-8 animate-spin text-teal-300"
              />
            </div>
          ) : loadError ? (
            <p className="mt-8 border-2 border-red-400 bg-red-950/40 p-5 font-bold text-red-100">
              {loadError}
            </p>
          ) : ads.length === 0 ? (
            <div className="mt-8 border-2 border-dashed border-teal-300 bg-white/5 p-8 text-center">
              <Search
                aria-hidden="true"
                className="mx-auto size-9 text-teal-300"
              />
              <h3 className="mt-4 text-2xl font-black uppercase">
                No wanted ads yet
              </h3>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">
                Be the first verified buyer to tell private owners what you are
                looking for.
              </p>
              <a
                className="mt-5 inline-block font-black uppercase text-[#f6b82b] underline underline-offset-4"
                href="#post-wanted"
              >
                Post the first wanted ad
              </a>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {ads.map((ad) => {
                const vehicleType = getVehicleType(ad.vehicle_type);
                const title =
                  [ad.make, ad.model].filter(Boolean).join(' ') ||
                  vehicleType.label;
                return (
                  <article
                    className="border-[3px] border-white bg-[#FFF8EA] p-6 text-navy shadow-[7px_7px_0_#16C7BE]"
                    key={ad.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="bg-teal-100 px-3 py-1 text-xs font-black uppercase text-teal-900">
                        <BadgeCheck className="mr-1 inline size-4" /> Verified
                        buyer
                      </span>
                      <span className="text-xs font-bold uppercase text-slate-500">
                        {vehicleType.label}
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                      Wanted: {title}
                    </h3>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-300 py-4 text-sm font-bold">
                      <span>{wantedYearLabel(ad)}</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-4 text-teal-700" />
                        {wantedBudgetLabel(ad.max_budget)}
                      </span>
                    </div>
                    <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-slate-700">
                      {ad.description}
                    </p>
                    <div className="mt-6 flex items-start gap-2 border-l-4 border-[#f6b82b] bg-white p-3 text-sm font-bold">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      <span>
                        {ad.search_distance === 'nationwide'
                          ? 'Nationwide search'
                          : `Within ${ad.search_distance} miles of ${ad.location_public}`}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
