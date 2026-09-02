'use client';

import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  FileCheck2,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CARFAX_REPORTS_URL, validateSellerCarfaxUrl } from '@/lib/carfax';

const steps = [
  'VIN & vehicle',
  'Price & condition',
  'Features & story',
  'Photos',
  'Ownership',
  'Review',
];

const acceptedPhotoTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const maxPhotoBytes = 10 * 1024 * 1024;
const maxPhotos = 20;
const acceptedOwnershipTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const acceptedOwnershipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
const maxOwnershipBytes = 10 * 1024 * 1024;

type SelectedPhoto = {
  file: File;
  id: string;
  previewUrl: string;
};

export function ListingWizard() {
  const [step, setStep] = useState(0);
  const [carfaxUrl, setCarfaxUrl] = useState('');
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string>();
  const [ownershipDocument, setOwnershipDocument] = useState<File>();
  const [ownershipError, setOwnershipError] = useState<string>();
  const photoUrls = useRef(new Set<string>());
  const carfaxValidation = validateSellerCarfaxUrl(carfaxUrl);

  useEffect(() => {
    const urls = photoUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function choosePhotos(event: ChangeEvent<HTMLInputElement>) {
    const chosenFiles = Array.from(event.target.files ?? []);
    const remainingSlots = Math.max(0, maxPhotos - photos.length);
    const validFiles = chosenFiles.filter(
      (file) =>
        acceptedPhotoTypes.has(file.type) && file.size <= maxPhotoBytes,
    );
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const nextPhotos = filesToAdd.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      photoUrls.current.add(previewUrl);
      return {
        file,
        id: `${file.name}-${file.lastModified}-${photos.length + index}`,
        previewUrl,
      };
    });

    setPhotos((current) => [...current, ...nextPhotos]);

    if (remainingSlots === 0) {
      setPhotoError(`You can add up to ${maxPhotos} vehicle photos.`);
    } else if (validFiles.length !== chosenFiles.length) {
      setPhotoError('Use JPG, PNG, or WebP files no larger than 10 MB each.');
    } else if (validFiles.length > remainingSlots) {
      setPhotoError(`Only the first ${remainingSlots} photos were added.`);
    } else {
      setPhotoError(undefined);
    }

    event.target.value = '';
  }

  function removePhoto(photo: SelectedPhoto) {
    URL.revokeObjectURL(photo.previewUrl);
    photoUrls.current.delete(photo.previewUrl);
    setPhotos((current) => current.filter(({ id }) => id !== photo.id));
    setPhotoError(undefined);
  }

  function chooseOwnershipDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const normalizedName = file.name.toLowerCase();
    const hasAcceptedExtension = acceptedOwnershipExtensions.some((extension) =>
      normalizedName.endsWith(extension),
    );

    if (!acceptedOwnershipTypes.has(file.type) && !hasAcceptedExtension) {
      setOwnershipError('Choose a PDF, JPG, PNG, or WebP document.');
      return;
    }

    if (file.size > maxOwnershipBytes) {
      setOwnershipError('The ownership document must be 10 MB or smaller.');
      return;
    }

    setOwnershipDocument(file);
    setOwnershipError(undefined);
  }

  const reviewItems = [
    { label: 'VIN decoded', ready: true },
    { label: 'Vehicle facts entered', ready: true },
    { label: 'Description complete', ready: true },
    {
      label: carfaxUrl.trim()
        ? carfaxValidation.valid
          ? 'CARFAX link added (seller-provided)'
          : 'CARFAX link needs correction'
        : 'CARFAX link not added (optional)',
      ready: carfaxValidation.valid,
    },
    {
      label:
        photos.length > 0
          ? `${photos.length} vehicle photo${photos.length === 1 ? '' : 's'} added`
          : 'Photos still needed',
      ready: photos.length > 0,
    },
    {
      label: ownershipDocument
        ? `Ownership document selected: ${ownershipDocument.name}`
        : 'Ownership document still needed',
      ready: Boolean(ownershipDocument),
    },
    { label: 'Seller attestation required', ready: false },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 border-2 border-navy bg-white sm:grid-cols-6">
        {steps.map((label, index) => (
          <button
            className={`border-navy p-3 text-left text-xs font-black uppercase tracking-wide sm:min-h-20 ${index > 0 ? 'border-l' : ''} ${step === index ? 'bg-teal-400 text-navy' : index < step ? 'bg-teal-50 text-teal-800' : 'text-slate-500'}`}
            key={label}
            onClick={() => setStep(index)}
            type="button"
          >
            <span className="block text-[10px]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-1 block">{label}</span>
          </button>
        ))}
      </div>

      <section className="mt-7 border-2 border-navy bg-white p-6 shadow-[8px_8px_0_rgba(7,28,44,.15)] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
          Step {step + 1} of 6
        </p>

        {step === 0 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Start with the VIN.
            </h2>
            <p className="mt-2 text-slate-600">
              NHTSA vPIC will decode basic vehicle information. You can correct
              non-authoritative descriptive fields later.
            </p>
            <label className="mt-7 block max-w-lg text-sm font-bold text-navy">
              17-character VIN
              <Input
                className="mt-2 h-12 rounded-none font-mono uppercase"
                maxLength={17}
                placeholder="Enter the vehicle VIN"
              />
            </label>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Set the facts and price.
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Mileage" value="38240" />
              <Field label="Asking price" value="24800" />
              <SelectField label="Condition" value="Good" />
              <SelectField label="Title status" value="Clean" />
              <SelectField label="Lien status" value="No lien" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Tell the owner’s story.
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <SelectField label="Drivetrain" value="AWD" />
              <SelectField label="Fuel type" value="Gasoline" />
              <SelectField label="Transmission" value="Automatic" />
            </div>
            <label className="mt-5 block text-sm font-bold text-navy">
              Seller description
              <Textarea
                className="mt-2 min-h-36 rounded-none"
                defaultValue="Well-kept everyday vehicle with regular maintenance. Selling because our household needs changed."
              />
            </label>
            <div className="mt-7 border-2 border-navy bg-teal-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
                Vehicle history · optional
              </p>
              <label
                className="mt-3 block text-sm font-bold text-navy"
                htmlFor="carfax-url"
              >
                CARFAX report link
              </label>
              <Input
                aria-describedby="carfax-help carfax-error"
                aria-invalid={!carfaxValidation.valid}
                className="mt-2 h-12 rounded-none bg-white"
                id="carfax-url"
                inputMode="url"
                onChange={(event) => setCarfaxUrl(event.target.value)}
                placeholder="https://www.carfax.com/..."
                type="url"
                value={carfaxUrl}
              />
              <p
                className="mt-2 text-sm leading-6 text-slate-600"
                id="carfax-help"
              >
                Paste the official share link hosted on carfax.com. Do not
                upload a PDF or screenshot. Buyers will be told to confirm that
                the report VIN matches the vehicle.
              </p>
              {!carfaxValidation.valid && (
                <p
                  className="mt-2 text-sm font-bold text-red-700"
                  id="carfax-error"
                >
                  {carfaxValidation.message}
                </p>
              )}
              <a
                className="mt-3 inline-block text-sm font-black text-teal-800 underline"
                href={CARFAX_REPORTS_URL}
                rel="noreferrer"
                target="_blank"
              >
                Get a report directly from CARFAX
              </a>
              <p className="mt-2 text-xs text-slate-500">
                This is a direct, non-affiliate link. CARFAX is not an OwnerOnly
                verification badge.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Add clear, current photos.
            </h2>
            <p className="mt-2 text-slate-600">
              Choose up to {maxPhotos} JPG, PNG, or WebP photos. Each file can
              be up to 10 MB.
            </p>

            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="vehicle-photos"
              multiple
              onChange={choosePhotos}
              type="file"
            />
            <label
              className="mt-7 flex min-h-56 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-400 bg-slate-50 p-8 text-center transition hover:border-teal-600 hover:bg-teal-50 focus-within:border-teal-700"
              htmlFor="vehicle-photos"
            >
              <Camera className="size-10 text-teal-700" />
              <span className="mt-4 font-black uppercase text-navy">
                Choose vehicle photos
              </span>
              <span className="mt-2 text-sm text-slate-500">
                Select one or several photos from your device
              </span>
            </label>

            {photoError && (
              <p
                className="mt-4 border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-800"
                role="alert"
              >
                {photoError}
              </p>
            )}

            {photos.length > 0 && (
              <div className="mt-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase text-navy">
                    {photos.length} of {maxPhotos} photos selected
                  </p>
                  <label
                    className="inline-flex cursor-pointer items-center gap-2 border-2 border-navy bg-white px-4 py-2 text-sm font-black uppercase text-navy hover:bg-teal-50"
                    htmlFor="vehicle-photos"
                  >
                    <Plus className="size-4" /> Add more
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <figure
                      className="relative overflow-hidden border-2 border-navy bg-white"
                      key={photo.id}
                    >
                      <img
                        alt={`Vehicle ${index + 1}: ${photo.file.name}`}
                        className="aspect-[4/3] w-full object-cover"
                        src={photo.previewUrl}
                      />
                      <figcaption className="flex items-center justify-between gap-3 p-3">
                        <span className="min-w-0 truncate text-xs font-bold text-slate-600">
                          {photo.file.name}
                        </span>
                        <button
                          aria-label={`Remove ${photo.file.name}`}
                          className="grid size-9 shrink-0 place-items-center border border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => removePhoto(photo)}
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  These previews remain available while this listing page stays
                  open. Final submission will use private, access-controlled
                  storage and server-side validation.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Submit ownership proof.
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Upload a current title or registration to a private,
              access-controlled bucket. Review compares only the verified legal
              name and VIN. Documents are automatically removed after a
              configurable retention period.
            </p>
            <input
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              aria-describedby="ownership-document-help ownership-document-error"
              className="sr-only"
              id="ownership-document"
              onChange={chooseOwnershipDocument}
              type="file"
            />
            <label
              className="mt-7 flex min-h-48 w-full max-w-xl cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-400 bg-slate-50 p-8 text-center transition hover:border-teal-600 hover:bg-teal-50 focus-within:border-teal-700"
              htmlFor="ownership-document"
            >
              <FileCheck2 className="size-10 text-teal-700" />
              <span className="mt-4 font-black uppercase text-navy">
                {ownershipDocument
                  ? 'Replace ownership document'
                  : 'Choose private document'}
              </span>
              <span className="mt-2 text-sm text-slate-500">
                PDF, JPG, PNG, or WebP · maximum 10 MB
              </span>
            </label>

            {ownershipError && (
              <p
                className="mt-4 max-w-xl border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-800"
                id="ownership-document-error"
                role="alert"
              >
                {ownershipError}
              </p>
            )}

            {ownershipDocument && (
              <div className="mt-4 flex max-w-xl items-center justify-between gap-4 border-2 border-teal-600 bg-teal-50 p-4">
                <div className="min-w-0">
                  <p className="font-black text-navy">Document selected</p>
                  <p className="mt-1 truncate text-sm text-slate-600">
                    {ownershipDocument.name} ·{' '}
                    {(ownershipDocument.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  aria-label={`Remove ${ownershipDocument.name}`}
                  className="shrink-0 rounded-none border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setOwnershipDocument(undefined);
                    setOwnershipError(undefined);
                  }}
                  type="button"
                  variant="outline"
                >
                  <Trash2 /> Remove
                </Button>
              </div>
            )}

            <p
              className="mt-4 max-w-2xl text-xs leading-5 text-slate-500"
              id="ownership-document-help"
            >
              During this practice version, the selected document remains only
              in this browser tab and is cleared when the page refreshes. It is
              not uploaded until private document storage is connected.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-navy">
              Review before submission.
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {reviewItems.map(({ label, ready }) => (
                <div
                  className={`flex gap-3 border p-4 ${ready ? 'border-teal-500 bg-teal-50' : 'border-amber-400 bg-amber-50'}`}
                  key={label}
                >
                  <CheckCircle2
                    className={`size-5 ${ready ? 'text-teal-700' : 'text-amber-700'}`}
                  />
                  <span className="text-sm font-bold text-navy">{label}</span>
                </div>
              ))}
            </div>
            <label className="mt-7 flex items-start gap-3 text-sm leading-6 text-slate-700">
              <input className="mt-1 size-4" type="checkbox" />I attest
              that I own this vehicle, am not acting as a dealer, broker,
              reseller, or representative, and the listing is accurate to the
              best of my knowledge.
            </label>
            <Button
              className="mt-6 h-12 rounded-none bg-slate-300 font-black uppercase text-slate-600"
              disabled
            >
              Submit for review
            </Button>
          </div>
        )}

        <div className="mt-10 flex justify-between border-t border-slate-200 pt-6">
          <Button
            className="rounded-none"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            variant="outline"
          >
            <ArrowLeft /> Back
          </Button>
          {step < 5 && (
            <Button
              className="rounded-none bg-navy"
              disabled={step === 4 && !ownershipDocument}
              onClick={() => setStep((current) => Math.min(5, current + 1))}
            >
              Save & continue <ArrowRight />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="text-sm font-bold text-navy">
      {label}
      <Input className="mt-2 h-11 rounded-none" defaultValue={value} />
    </label>
  );
}

function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <label className="text-sm font-bold text-navy">
      {label}
      <select
        className="mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm"
        defaultValue={value}
      >
        <option>{value}</option>
        <option>Other</option>
      </select>
    </label>
  );
}
