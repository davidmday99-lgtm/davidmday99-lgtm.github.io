'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CarFront,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import {
  VehicleConditionFields,
  VehicleFeatureFields,
} from '@/components/listing-details-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateSellerCarfaxUrl } from '@/lib/carfax';
import { formatMileage, formatPrice } from '@/lib/demo-data';
import { engineSizeSuggestions } from '@/lib/engine-sizes';
import { conditionQuestionCount } from '@/lib/listing-disclosures';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';
import { catalogMakes, catalogModels } from '@/lib/vehicle-catalog';
import type { VehicleListingRow } from '@/lib/vehicle-listings';
import { getVehicleType } from '@/lib/vehicle-types';

type EditDraft = {
  year: string;
  make: string;
  model: string;
  trim: string;
  price: string;
  mileage: string;
  engine_size: string;
  location_public: string;
  body_style: string;
  transmission: string;
  fuel_type: string;
  drivetrain: string;
  title_status: string;
  lien_status: string;
  vehicle_condition: string;
  description: string;
  carfax_url: string;
  condition_answers: Record<string, string>;
  features: string[];
};

const drivetrainOptions = [
  'AWD',
  'FWD',
  'RWD',
  '4WD',
  'Chain',
  'Belt',
  'Shaft',
  'Other',
  'Not applicable',
];
const fuelOptions = [
  'Gasoline',
  'Diesel',
  'Hybrid',
  'Plug-in hybrid',
  'Electric',
  'Other',
  'Not applicable',
];
const transmissionOptions = [
  'Automatic',
  'Manual',
  'CVT',
  'Other',
  'Not applicable',
];

function draftFrom(listing: VehicleListingRow): EditDraft {
  return {
    year: String(listing.year),
    make: listing.make,
    model: listing.model,
    trim: listing.trim ?? '',
    price: String(listing.price),
    mileage: String(listing.mileage),
    engine_size: listing.engine_size ?? '',
    location_public: listing.location_public,
    body_style: listing.body_style,
    transmission: listing.transmission,
    fuel_type: listing.fuel_type,
    drivetrain: listing.drivetrain,
    title_status: listing.title_status,
    lien_status: listing.lien_status,
    vehicle_condition: listing.vehicle_condition,
    description: listing.description,
    carfax_url: listing.carfax_url ?? '',
    condition_answers: { ...listing.condition_answers },
    features: [...listing.features],
  };
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  list,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  list?: string;
}) {
  return (
    <label className="text-sm font-bold text-navy">
      {label}
      <Input
        className="mt-2 h-11 rounded-none border-slate-300"
        list={list}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const values = options.includes(value) ? options : [value, ...options];
  return (
    <label className="text-sm font-bold text-navy">
      {label}
      <select
        className="mt-2 h-11 w-full border border-slate-300 bg-white px-3"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MyListings() {
  const [listings, setListings] = useState<VehicleListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [retainedPhotos, setRetainedPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [featuresReviewed, setFeaturesReviewed] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      void supabase
        .from('vehicle_listings')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(({ data: rows }) => {
          setListings((rows ?? []) as VehicleListingRow[]);
          setLoading(false);
        });
    });
  }, []);

  const editingListing = listings.find((listing) => listing.id === editingId);
  const makeOptions = useMemo(
    () => catalogMakes(editingListing?.vehicle_type),
    [editingListing?.vehicle_type],
  );
  const modelOptions = useMemo(
    () => catalogModels(editingListing?.vehicle_type, draft?.make ?? ''),
    [editingListing?.vehicle_type, draft?.make],
  );
  const engineOptions = useMemo(
    () => engineSizeSuggestions(editingListing?.vehicle_type),
    [editingListing?.vehicle_type],
  );

  function update<K extends keyof EditDraft>(key: K, value: EditDraft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function startEdit(listing: VehicleListingRow) {
    setEditingId(listing.id);
    setDraft(draftFrom(listing));
    setRetainedPhotos([...listing.photo_urls]);
    setNewPhotos([]);
    setFeaturesReviewed(true);
    setMessage('');
    setError('');
  }

  function cancelEdit() {
    setEditingId('');
    setDraft(null);
    setRetainedPhotos([]);
    setNewPhotos([]);
    setError('');
  }

  async function saveListing(listing: VehicleListingRow) {
    if (!draft) return;
    const year = Number(draft.year),
      price = Number(draft.price),
      mileage = Number(draft.mileage);
    const carfax = validateSellerCarfaxUrl(draft.carfax_url);
    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    )
      return setError('Enter a valid model year.');
    if (!Number.isInteger(price) || price < 0 || price > 10000000)
      return setError('Enter a whole-dollar price between $0 and $10,000,000.');
    if (!Number.isInteger(mileage) || mileage < 0 || mileage > 2000000)
      return setError('Enter valid mileage or engine hours.');
    if (
      !draft.make.trim() ||
      !draft.model.trim() ||
      !draft.engine_size.trim() ||
      !draft.location_public.trim()
    )
      return setError(
        'Complete the make, model, engine size, and public location.',
      );
    if (draft.description.trim().length < 10)
      return setError('The seller description must be at least 10 characters.');
    if (
      Object.values(draft.condition_answers).filter(Boolean).length <
      conditionQuestionCount
    )
      return setError('Answer every vehicle condition question.');
    if (!featuresReviewed)
      return setError('Confirm that you reviewed the installed features.');
    if (!carfax.valid) return setError(carfax.message);
    if (
      retainedPhotos.length + newPhotos.length < 1 ||
      retainedPhotos.length + newPhotos.length > 20
    )
      return setError('Keep or add between 1 and 20 vehicle photos.');

    setSavingId(listing.id);
    setError('');
    setMessage('');
    const form = new FormData();
    form.append('listing_id', listing.id);
    form.append('retained_photo_urls', JSON.stringify(retainedPhotos));
    form.append(
      'listing',
      JSON.stringify({
        ...draft,
        year,
        price,
        mileage,
        carfax_url: carfax.normalizedUrl,
      }),
    );
    newPhotos.forEach((photo) => form.append('photos', photo));
    const { data, error: invokeError } =
      await getSupabaseBrowserClient().functions.invoke('update-my-listing', {
        body: form,
      });
    setSavingId('');
    if (invokeError || !data?.listing) {
      setError(
        'The listing could not be updated. Please sign in and try again.',
      );
      return;
    }
    setListings((current) =>
      current.map((item) =>
        item.id === listing.id ? (data.listing as VehicleListingRow) : item,
      ),
    );
    cancelEdit();
    setMessage(
      listing.status === 'published'
        ? 'Your changes are live on the listing.'
        : 'Your listing changes were saved.',
    );
  }

  return (
    <section id="listings" className="mt-8 border-2 border-navy bg-white p-6">
      <div className="flex flex-col gap-4 border-b-2 border-navy pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase text-navy">
            My listings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit every public detail buyers see on your listing.
          </p>
        </div>
        <Button
          className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
          nativeButton={false}
          render={<a href="/sell" />}
        >
          <Plus /> Create listing
        </Button>
      </div>
      {message && (
        <p className="mt-5 border-l-4 border-teal-600 bg-teal-50 p-3 text-sm font-bold text-teal-900">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-5 border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-10 text-center font-bold text-slate-600">
          Loading your listings…
        </p>
      ) : listings.length ? (
        <div className="mt-6 space-y-5">
          {listings.map((listing) => (
            <article className="border-2 border-navy p-4" key={listing.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  className="aspect-[4/3] w-full object-cover sm:w-40"
                  src={listing.photo_urls[0]}
                  alt={`${listing.year} ${listing.make} ${listing.model}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2 py-1 text-xs font-black uppercase ${listing.status === 'published' ? 'border-teal-500 bg-teal-50 text-teal-800' : listing.status === 'rejected' ? 'border-red-500 bg-red-50 text-red-800' : 'border-amber-500 bg-amber-50 text-amber-900'}`}
                    >
                      {listing.status.replaceAll('_', ' ')}
                    </span>
                    <span className="border border-navy/30 bg-slate-100 px-2 py-1 text-xs font-black uppercase text-navy">
                      {getVehicleType(listing.vehicle_type).label}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-black uppercase text-navy">
                    {listing.year} {listing.make} {listing.model}
                    {listing.trim ? ` ${listing.trim}` : ''}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatMileage(listing.mileage)}{' '}
                    {getVehicleType(listing.vehicle_type).usageUnit} ·{' '}
                    {listing.engine_size
                      ? `${listing.engine_size} engine · `
                      : ''}
                    {formatPrice(listing.price)} · Near{' '}
                    {listing.location_public}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                  {listing.status !== 'removed' && editingId !== listing.id && (
                    <Button
                      className="h-10 rounded-none border-2 border-navy bg-[#f6b82b] font-black uppercase text-navy"
                      onClick={() => startEdit(listing)}
                      type="button"
                      variant="outline"
                    >
                      <Pencil /> Edit full listing
                    </Button>
                  )}
                  {listing.status === 'published' && (
                    <a
                      className="font-black uppercase text-teal-800 underline"
                      href={`/listing?slug=${encodeURIComponent(listing.slug)}`}
                    >
                      View live listing
                    </a>
                  )}
                </div>
              </div>

              {editingId === listing.id && draft && (
                <div className="mt-6 border-t-2 border-navy pt-6">
                  <div className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-navy">
                    <strong className="block uppercase">
                      Protected ownership details
                    </strong>
                    Category: {getVehicleType(listing.vehicle_type).label} ·{' '}
                    {getVehicleType(listing.vehicle_type).identifierLabel}:
                    ••••••{listing.vin.slice(-6)}. These stay locked because
                    they were used for ownership review.
                  </div>
                  <h4 className="mt-7 text-xl font-black uppercase text-navy">
                    Vehicle and pricing
                  </h4>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Year"
                      type="number"
                      value={draft.year}
                      onChange={(value) => update('year', value)}
                    />
                    <Field
                      label="Make"
                      list={`makes-${listing.id}`}
                      value={draft.make}
                      onChange={(value) => {
                        update('make', value);
                        update('model', '');
                      }}
                    />
                    <Field
                      label="Model"
                      list={`models-${listing.id}`}
                      value={draft.model}
                      onChange={(value) => update('model', value)}
                    />
                    <Field
                      label="Trim (optional)"
                      value={draft.trim}
                      onChange={(value) => update('trim', value)}
                    />
                    <Field
                      label="Asking price"
                      type="number"
                      value={draft.price}
                      onChange={(value) => update('price', value)}
                    />
                    <Field
                      label={getVehicleType(listing.vehicle_type).usageLabel}
                      type="number"
                      value={draft.mileage}
                      onChange={(value) => update('mileage', value)}
                    />
                    <Field
                      label="Public location (city, state)"
                      value={draft.location_public}
                      onChange={(value) => update('location_public', value)}
                    />
                    <SelectField
                      label="Type / style"
                      value={draft.body_style}
                      options={getVehicleType(listing.vehicle_type).styles}
                      onChange={(value) => update('body_style', value)}
                    />
                    <SelectField
                      label="Condition"
                      value={draft.vehicle_condition}
                      options={['Excellent', 'Good', 'Fair', 'Needs work']}
                      onChange={(value) => update('vehicle_condition', value)}
                    />
                    <SelectField
                      label="Title status"
                      value={draft.title_status}
                      options={['Clean', 'Rebuilt', 'Salvage', 'Other']}
                      onChange={(value) => update('title_status', value)}
                    />
                    <SelectField
                      label="Lien status"
                      value={draft.lien_status}
                      options={['No lien', 'Lien disclosed']}
                      onChange={(value) => update('lien_status', value)}
                    />
                    <SelectField
                      label="Drivetrain"
                      value={draft.drivetrain}
                      options={drivetrainOptions}
                      onChange={(value) => update('drivetrain', value)}
                    />
                    <SelectField
                      label="Fuel type"
                      value={draft.fuel_type}
                      options={fuelOptions}
                      onChange={(value) => update('fuel_type', value)}
                    />
                    <Field
                      label="Engine size"
                      list={`engines-${listing.id}`}
                      value={draft.engine_size}
                      onChange={(value) => update('engine_size', value)}
                    />
                    <SelectField
                      label="Transmission"
                      value={draft.transmission}
                      options={transmissionOptions}
                      onChange={(value) => update('transmission', value)}
                    />
                  </div>
                  <datalist id={`makes-${listing.id}`}>
                    {makeOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  <datalist id={`models-${listing.id}`}>
                    {modelOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  <datalist id={`engines-${listing.id}`}>
                    {engineOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                  <label className="mt-5 block text-sm font-bold text-navy">
                    Seller description
                    <Textarea
                      className="mt-2 min-h-36 rounded-none"
                      value={draft.description}
                      onChange={(event) =>
                        update('description', event.target.value)
                      }
                    />
                  </label>
                  <div className="mt-5">
                    <Field
                      label="CARFAX report link (optional)"
                      value={draft.carfax_url}
                      onChange={(value) => update('carfax_url', value)}
                    />
                  </div>
                  <VehicleConditionFields
                    answers={draft.condition_answers}
                    onAnswer={(id, answer) =>
                      update('condition_answers', {
                        ...draft.condition_answers,
                        [id]: answer,
                      })
                    }
                  />
                  <VehicleFeatureFields
                    reviewed={featuresReviewed}
                    selected={draft.features}
                    onReviewedChange={setFeaturesReviewed}
                    onToggle={(feature) =>
                      update(
                        'features',
                        draft.features.includes(feature)
                          ? draft.features.filter((item) => item !== feature)
                          : [...draft.features, feature],
                      )
                    }
                  />

                  <div className="mt-8">
                    <h4 className="text-xl font-black uppercase text-navy">
                      Listing photos
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Keep, remove, or add photos. At least one photo is
                      required.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {retainedPhotos.map((url, index) => (
                        <div className="relative" key={url}>
                          <img
                            className="aspect-[4/3] w-full object-cover"
                            src={url}
                          alt={`Vehicle view ${index + 1}`}
                          />
                          <button
                            aria-label={`Remove photo ${index + 1}`}
                            className="absolute right-1 top-1 grid size-9 place-items-center bg-red-700 text-white"
                            onClick={() =>
                              setRetainedPhotos((current) =>
                                current.filter((item) => item !== url),
                              )
                            }
                            type="button"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {newPhotos.length > 0 && (
                      <ul className="mt-3 text-sm text-slate-600">
                        {newPhotos.map((photo, index) => (
                          <li
                            className="flex items-center gap-2"
                            key={`${photo.name}-${photo.lastModified}`}
                          >
                            <ImagePlus className="size-4" />
                            {photo.name}
                            <button
                              className="font-bold text-red-700 underline"
                              onClick={() =>
                                setNewPhotos((current) =>
                                  current.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                )
                              }
                              type="button"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 border-2 border-navy bg-white px-4 py-3 text-sm font-black uppercase text-navy">
                      <ImagePlus className="size-4" /> Add photos
                      <input
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        multiple
                        onChange={(event) =>
                          setNewPhotos((current) =>
                            [
                              ...current,
                              ...Array.from(event.target.files ?? []),
                            ].slice(0, 20),
                          )
                        }
                        type="file"
                      />
                    </label>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-300 pt-5">
                    <Button
                      className="h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
                      disabled={savingId === listing.id}
                      onClick={() => void saveListing(listing)}
                      type="button"
                    >
                      {savingId === listing.id && (
                        <LoaderCircle className="animate-spin" />
                      )}
                      Save full listing
                    </Button>
                    <Button
                      className="h-11 rounded-none font-black uppercase"
                      disabled={savingId === listing.id}
                      onClick={cancelEdit}
                      type="button"
                      variant="outline"
                    >
                      <X /> Cancel
                    </Button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <span className="grid size-14 place-items-center border-2 border-navy bg-[#96d9ed] shadow-[4px_4px_0_#071c2c]">
            <CarFront className="size-7 text-navy" />
          </span>
          <h3 className="mt-6 text-xl font-black uppercase text-navy">
            No saved listings yet
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Your submitted listings will appear here and publish automatically
            after approval.
          </p>
        </div>
      )}
    </section>
  );
}
