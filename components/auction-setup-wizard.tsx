'use client';

import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  EyeOff,
  FileCheck2,
  Gavel,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateSellerCarfaxUrl } from '@/lib/carfax';
import {
  type AuctionValidationErrors,
  type PrivateAuctionDraft,
  emptyPrivateAuctionDraft,
  formatAuctionMoney,
  normalizeVin,
  validateAuctionOwnership,
  validateAuctionReserve,
  validateAuctionStory,
  validateAuctionTerms,
  validateAuctionVehicle,
} from '@/lib/private-auction-form';

const steps = [
  'Vehicle',
  'Terms',
  'Reserve',
  'Story & photos',
  'Ownership',
  'Review',
];

const acceptedPhotoTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const acceptedOwnershipTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const acceptedOwnershipExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
const maxFileBytes = 10 * 1024 * 1024;
const maxPhotos = 20;

type SelectedPhoto = {
  file: File;
  id: string;
  previewUrl: string;
};

const fieldClass =
  'mt-2 h-12 rounded-none border-2 border-[#061C2B] bg-white px-3 focus-visible:ring-[#16C7BE]';

export function AuctionSetupWizard() {
  const [step, setStep] = useState(0);
  const [highestUnlockedStep, setHighestUnlockedStep] = useState(0);
  const [draft, setDraft] = useState<PrivateAuctionDraft>(
    emptyPrivateAuctionDraft,
  );
  const [errors, setErrors] = useState<AuctionValidationErrors>({});
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [photoMessage, setPhotoMessage] = useState<string>();
  const [ownershipDocument, setOwnershipDocument] = useState<File>();
  const [ownershipMessage, setOwnershipMessage] = useState<string>();
  const [attested, setAttested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const photoUrls = useRef(new Set<string>());
  const carfaxValidation = validateSellerCarfaxUrl(draft.carfaxUrl);

  useEffect(() => {
    const urls = photoUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function updateDraft<K extends keyof PrivateAuctionDraft>(
    field: K,
    value: PrivateAuctionDraft[K],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      if (field === 'startingBid') delete next.reserveAmount;
      return next;
    });
  }

  function stepErrors(stepIndex: number): AuctionValidationErrors {
    switch (stepIndex) {
      case 0:
        return validateAuctionVehicle(draft);
      case 1:
        return validateAuctionTerms(draft);
      case 2:
        return validateAuctionReserve(draft);
      case 3: {
        const storyErrors = validateAuctionStory(draft, photos.length);
        if (!carfaxValidation.valid) {
          storyErrors.carfaxUrl = carfaxValidation.message;
        }
        return storyErrors;
      }
      case 4:
        return validateAuctionOwnership(Boolean(ownershipDocument));
      default:
        return {};
    }
  }

  function continueToNextStep() {
    const nextErrors = stepErrors(step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const nextStep = Math.min(steps.length - 1, step + 1);
    setHighestUnlockedStep((current) => Math.max(current, nextStep));
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function choosePhotos(event: ChangeEvent<HTMLInputElement>) {
    const chosenFiles = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!chosenFiles.length) return;

    const remainingSlots = Math.max(0, maxPhotos - photos.length);
    const validFiles = chosenFiles.filter(
      (file) => acceptedPhotoTypes.has(file.type) && file.size <= maxFileBytes,
    );
    const filesToAdd = validFiles.slice(0, remainingSlots);
    const newPhotos = filesToAdd.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      photoUrls.current.add(previewUrl);
      return {
        file,
        id: `${file.name}-${file.lastModified}-${photos.length + index}`,
        previewUrl,
      };
    });
    const nextCount = photos.length + newPhotos.length;

    setPhotos((current) => [...current, ...newPhotos]);
    setErrors((current) => {
      const next = { ...current };
      if (nextCount >= 6) delete next.photos;
      return next;
    });

    if (!remainingSlots) {
      setPhotoMessage(`You can add up to ${maxPhotos} photos.`);
    } else if (validFiles.length !== chosenFiles.length) {
      setPhotoMessage(
        'Some files were skipped. Use JPG, PNG, or WebP files no larger than 10 MB.',
      );
    } else if (validFiles.length > remainingSlots) {
      setPhotoMessage(`Only the first ${remainingSlots} photos were added.`);
    } else {
      setPhotoMessage(undefined);
    }
  }

  function removePhoto(photo: SelectedPhoto) {
    URL.revokeObjectURL(photo.previewUrl);
    photoUrls.current.delete(photo.previewUrl);
    setPhotos((current) => current.filter(({ id }) => id !== photo.id));
    setPhotoMessage(undefined);
  }

  function chooseOwnershipDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const filename = file.name.toLowerCase();
    const acceptedExtension = acceptedOwnershipExtensions.some((extension) =>
      filename.endsWith(extension),
    );

    if (!acceptedOwnershipTypes.has(file.type) && !acceptedExtension) {
      setOwnershipMessage('Choose a PDF, JPG, PNG, or WebP document.');
      return;
    }
    if (file.size > maxFileBytes) {
      setOwnershipMessage('The ownership document must be 10 MB or smaller.');
      return;
    }

    setOwnershipDocument(file);
    setOwnershipMessage(undefined);
    setErrors((current) => {
      const next = { ...current };
      delete next.ownershipDocument;
      return next;
    });
  }

  const allErrors = {
    ...validateAuctionVehicle(draft),
    ...validateAuctionTerms(draft),
    ...validateAuctionReserve(draft),
    ...validateAuctionStory(draft, photos.length),
    ...validateAuctionOwnership(Boolean(ownershipDocument)),
    ...(!carfaxValidation.valid ? { carfaxUrl: carfaxValidation.message } : {}),
  };
  const canSubmit = Object.keys(allErrors).length === 0 && attested;

  function resetAuction() {
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.previewUrl);
      photoUrls.current.delete(photo.previewUrl);
    });
    setDraft(emptyPrivateAuctionDraft);
    setPhotos([]);
    setOwnershipDocument(undefined);
    setAttested(false);
    setErrors({});
    setPhotoMessage(undefined);
    setOwnershipMessage(undefined);
    setHighestUnlockedStep(0);
    setStep(0);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="border-[3px] border-[#061C2B] bg-[#dff4f1] p-8 shadow-[8px_8px_0_#16C7BE]">
        <BadgeCheck className="size-11 text-[#0B8F89]" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#0B8F89]">
          All six steps complete
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase">
          Auction package ready for verification.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-700">
          Your vehicle details, auction terms, reserve choice, photos, ownership
          document, and seller attestation passed the form checks. Identity and
          ownership review must still be completed before an auction can be
          approved for publication.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="rounded-none bg-[#061C2B] font-black uppercase text-white"
            nativeButton={false}
            render={<a href="/account/verification" />}
          >
            Continue to verification <ArrowRight />
          </Button>
          <Button
            className="rounded-none border-2 border-[#061C2B] font-black uppercase"
            onClick={resetAuction}
            variant="outline"
          >
            Prepare another auction
          </Button>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          Practice mode: file selections remain in this browser tab and are not
          uploaded to public storage. Live bidding remains unavailable until
          secure auction storage, moderation, and bidding controls launch.
        </p>
      </div>
    );
  }

  return (
    <div className="border-[3px] border-[#061C2B] bg-white shadow-[8px_8px_0_rgba(6,28,43,.18)]">
      <ol className="grid grid-cols-3 border-b-[3px] border-[#061C2B] bg-[#dff4f1] sm:grid-cols-6">
        {steps.map((label, index) => {
          const unlocked = index <= highestUnlockedStep;
          const complete = index < highestUnlockedStep;
          return (
            <li
              className={`${index ? 'border-l border-[#061C2B]' : ''} ${index > 2 ? 'border-t border-[#061C2B] sm:border-t-0' : ''}`}
              key={label}
            >
              <button
                aria-current={index === step ? 'step' : undefined}
                className={`h-full w-full px-2 py-3 text-center text-[9px] font-black uppercase sm:text-[11px] ${index === step ? 'bg-[#16C7BE]' : complete ? 'bg-teal-50 text-[#0B8F89]' : 'text-slate-500'} ${unlocked ? 'cursor-pointer hover:bg-[#bcebe7]' : 'cursor-not-allowed opacity-60'}`}
                disabled={!unlocked}
                onClick={() => {
                  setStep(index);
                  setErrors({});
                }}
                type="button"
              >
                <span className="block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 block">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="p-6 sm:p-8">
        {Object.keys(errors).length > 0 ? (
          <div
            className="mb-7 flex gap-3 border-l-4 border-red-600 bg-red-50 p-4 text-sm font-bold text-red-800"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <p>Please correct the highlighted information before continuing.</p>
          </div>
        ) : null}

        {step === 0 ? (
          <VehicleStep
            draft={draft}
            errors={errors}
            updateDraft={updateDraft}
          />
        ) : null}
        {step === 1 ? (
          <TermsStep draft={draft} errors={errors} updateDraft={updateDraft} />
        ) : null}
        {step === 2 ? (
          <ReserveStep
            draft={draft}
            errors={errors}
            updateDraft={updateDraft}
          />
        ) : null}
        {step === 3 ? (
          <StoryStep
            choosePhotos={choosePhotos}
            draft={draft}
            errors={errors}
            photoMessage={photoMessage}
            photos={photos}
            removePhoto={removePhoto}
            updateDraft={updateDraft}
          />
        ) : null}
        {step === 4 ? (
          <OwnershipStep
            chooseOwnershipDocument={chooseOwnershipDocument}
            document={ownershipDocument}
            error={errors.ownershipDocument}
            message={ownershipMessage}
            removeDocument={() => {
              setOwnershipDocument(undefined);
              setOwnershipMessage(undefined);
            }}
          />
        ) : null}
        {step === 5 ? (
          <ReviewStep
            attested={attested}
            canSubmit={canSubmit}
            draft={draft}
            document={ownershipDocument}
            onAttestedChange={setAttested}
            onSubmit={() => setSubmitted(true)}
            photoCount={photos.length}
          />
        ) : null}

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-200 pt-5">
          <Button
            className="rounded-none border-2 border-[#061C2B] font-black uppercase"
            disabled={step === 0}
            onClick={() => {
              setStep((value) => Math.max(0, value - 1));
              setErrors({});
            }}
            variant="outline"
          >
            <ArrowLeft /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              className="rounded-none bg-[#061C2B] font-black uppercase text-white hover:bg-[#0B6F6A]"
              onClick={continueToNextStep}
            >
              Validate & continue <ArrowRight />
            </Button>
          ) : null}
        </div>
        <p className="mt-4 text-center text-xs font-bold text-slate-500">
          Required fields are validated at every step. Nothing is published
          without identity, ownership, and moderator review.
        </p>
      </div>
    </div>
  );
}

type UpdateDraft = <K extends keyof PrivateAuctionDraft>(
  field: K,
  value: PrivateAuctionDraft[K],
) => void;

function VehicleStep({
  draft,
  errors,
  updateDraft,
}: {
  draft: PrivateAuctionDraft;
  errors: AuctionValidationErrors;
  updateDraft: UpdateDraft;
}) {
  return (
    <StepFrame eyebrow="Step 1 of 6" title="Which vehicle are you auctioning?">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          error={errors.vin}
          label="VIN"
          maxLength={17}
          onChange={(value) => updateDraft('vin', normalizeVin(value))}
          placeholder="17-character VIN"
          value={draft.vin}
        />
        <Field
          error={errors.mileage}
          label="Current mileage"
          min="0"
          onChange={(value) => updateDraft('mileage', value)}
          placeholder="Example: 48,250"
          type="number"
          value={draft.mileage}
        />
        <Field
          error={errors.year}
          label="Model year"
          min="1900"
          onChange={(value) => updateDraft('year', value)}
          placeholder="Example: 2020"
          type="number"
          value={draft.year}
        />
        <Field
          error={errors.makeModel}
          label="Make and model"
          onChange={(value) => updateDraft('makeModel', value)}
          placeholder="Example: Honda Accord"
          value={draft.makeModel}
        />
      </div>
      <Notice>
        The VIN will be decoded through NHTSA and compared with the private
        ownership document during moderator review.
      </Notice>
    </StepFrame>
  );
}

function TermsStep({
  draft,
  errors,
  updateDraft,
}: {
  draft: PrivateAuctionDraft;
  errors: AuctionValidationErrors;
  updateDraft: UpdateDraft;
}) {
  return (
    <StepFrame eyebrow="Step 2 of 6" title="Set the auction terms.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          error={errors.startingBid}
          label="Starting bid"
          min="100"
          onChange={(value) => updateDraft('startingBid', value)}
          placeholder="Example: 5,000"
          type="number"
          value={draft.startingBid}
        />
        <SelectField
          error={errors.auctionLength}
          label="Auction length"
          onChange={(value) =>
            updateDraft('auctionLength', value as '3' | '5' | '7')
          }
          options={[
            ['3', '3 days'],
            ['5', '5 days'],
            ['7', '7 days'],
          ]}
          value={draft.auctionLength}
        />
        <Field
          error={errors.locationZip}
          label="Vehicle ZIP code"
          maxLength={5}
          onChange={(value) =>
            updateDraft('locationZip', value.replace(/\D/g, '').slice(0, 5))
          }
          placeholder="Example: 45202"
          value={draft.locationZip}
        />
        <SelectField
          error={errors.titleStatus}
          label="Title status"
          onChange={(value) => updateDraft('titleStatus', value)}
          options={[
            ['', 'Choose title status'],
            ['Clean', 'Clean'],
            ['Rebuilt', 'Rebuilt'],
            ['Salvage', 'Salvage'],
            ['Other', 'Other / needs review'],
          ]}
          value={draft.titleStatus}
        />
        <SelectField
          error={errors.lienStatus}
          label="Lien status"
          onChange={(value) => updateDraft('lienStatus', value)}
          options={[
            ['', 'Choose lien status'],
            ['No lien', 'No lien'],
            ['Release pending', 'Paid off; release pending'],
            ['Active lien', 'Active lien'],
          ]}
          value={draft.lienStatus}
        />
      </div>
      {draft.lienStatus === 'Active lien' ? (
        <label className="mt-5 block text-sm font-black uppercase">
          Lien payoff and release plan
          <Textarea
            aria-invalid={Boolean(errors.lienDetails)}
            className="mt-2 min-h-28 rounded-none border-2 border-[#061C2B] font-normal normal-case"
            onChange={(event) => updateDraft('lienDetails', event.target.value)}
            placeholder="Explain how the lender payoff and title release will be handled before transfer."
            value={draft.lienDetails}
          />
          <FieldError message={errors.lienDetails} />
        </label>
      ) : null}
      <Notice>
        Buyers see only an approximate location. Exact addresses, document
        details, and contact information stay private.
      </Notice>
    </StepFrame>
  );
}

function ReserveStep({
  draft,
  errors,
  updateDraft,
}: {
  draft: PrivateAuctionDraft;
  errors: AuctionValidationErrors;
  updateDraft: UpdateDraft;
}) {
  return (
    <StepFrame eyebrow="Step 3 of 6" title="Would you like a reserve?">
      <label className="flex cursor-pointer items-start gap-4 border-[3px] border-[#061C2B] bg-[#fff3cf] p-5">
        <input
          checked={draft.hasReserve}
          className="mt-1 size-5 accent-[#0B8F89]"
          onChange={(event) => updateDraft('hasReserve', event.target.checked)}
          type="checkbox"
        />
        <span>
          <strong className="block text-lg uppercase">
            Set a private reserve price
          </strong>
          <span className="mt-1 block text-sm leading-6 text-slate-700">
            If bidding does not reach this minimum, the vehicle does not
            automatically sell.
          </span>
        </span>
      </label>
      {draft.hasReserve ? (
        <div className="mt-6 max-w-sm">
          <Field
            error={errors.reserveAmount}
            label="Private reserve amount"
            min={draft.startingBid || '100'}
            onChange={(value) => updateDraft('reserveAmount', value)}
            placeholder="Example: 18,500"
            type="number"
            value={draft.reserveAmount}
          />
          <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <EyeOff className="mt-0.5 size-4 shrink-0" /> Bidders see only
            “reserve met” or “reserve not met”—never your dollar amount.
          </p>
        </div>
      ) : (
        <div className="mt-6 border-l-4 border-[#16C7BE] bg-slate-50 p-4 text-sm leading-6">
          <strong>No-reserve auction:</strong> the highest eligible bid can win
          when the auction closes, subject to bidder eligibility and the final
          auction rules.
        </div>
      )}
    </StepFrame>
  );
}

function StoryStep({
  choosePhotos,
  draft,
  errors,
  photoMessage,
  photos,
  removePhoto,
  updateDraft,
}: {
  choosePhotos: (event: ChangeEvent<HTMLInputElement>) => void;
  draft: PrivateAuctionDraft;
  errors: AuctionValidationErrors;
  photoMessage?: string;
  photos: SelectedPhoto[];
  removePhoto: (photo: SelectedPhoto) => void;
  updateDraft: UpdateDraft;
}) {
  const carfaxValidation = validateSellerCarfaxUrl(draft.carfaxUrl);

  return (
    <StepFrame eyebrow="Step 4 of 6" title="Show buyers the real vehicle.">
      <label className="block text-sm font-black uppercase">
        Seller story and vehicle condition
        <Textarea
          aria-invalid={Boolean(errors.description)}
          className="mt-2 min-h-40 rounded-none border-2 border-[#061C2B] font-normal normal-case"
          onChange={(event) => updateDraft('description', event.target.value)}
          placeholder="Why are you selling? Describe maintenance, condition, flaws, modifications, and anything a buyer should know."
          value={draft.description}
        />
        <span className="mt-2 block text-xs font-normal normal-case text-slate-500">
          {draft.description.trim().length} of 80 minimum characters
        </span>
        <FieldError message={errors.description} />
      </label>

      <label className="mt-6 block text-sm font-black uppercase">
        CARFAX report link{' '}
        <span className="font-normal normal-case">(optional)</span>
        <Input
          aria-invalid={Boolean(errors.carfaxUrl)}
          className={fieldClass}
          onChange={(event) => updateDraft('carfaxUrl', event.target.value)}
          placeholder="https://www.carfax.com/..."
          type="url"
          value={draft.carfaxUrl}
        />
        <span className="mt-2 block text-xs font-normal normal-case text-slate-500">
          Use only the official secure share link hosted on carfax.com.
        </span>
        <FieldError
          message={
            !carfaxValidation.valid
              ? carfaxValidation.message
              : errors.carfaxUrl
          }
        />
      </label>

      <div className="mt-6 flex min-h-48 flex-col items-center justify-center border-2 border-dashed border-[#061C2B] bg-slate-50 p-8 text-center">
        <Camera className="size-10 text-[#0B8F89]" />
        <label className="mt-4 font-black uppercase" htmlFor="auction-photos">
          Choose vehicle photos
        </label>
        <span className="mt-2 text-sm text-slate-600">
          Add 6–{maxPhotos} JPG, PNG, or WebP files · 10 MB maximum each
        </span>
        <Input
          accept="image/jpeg,image/png,image/webp"
          className="mt-4 h-auto max-w-xl cursor-pointer rounded-none border-2 border-[#061C2B] bg-white py-2 file:mr-4 file:border-0 file:bg-[#16C7BE] file:px-4 file:py-2 file:font-black file:uppercase"
          id="auction-photos"
          multiple
          onChange={choosePhotos}
          type="file"
        />
      </div>
      <FieldError message={errors.photos} />
      {photoMessage ? (
        <output className="mt-3 block text-sm font-bold text-amber-800">
          {photoMessage}
        </output>
      ) : null}

      {photos.length ? (
        <div className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-black uppercase">
              {photos.length} of {maxPhotos} photos selected
            </p>
            <label
              className="inline-flex cursor-pointer items-center gap-2 border-2 border-[#061C2B] bg-white px-4 py-2 text-sm font-black uppercase hover:bg-teal-50"
              htmlFor="auction-photos"
            >
              <Plus className="size-4" /> Add more
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <figure className="border-2 border-[#061C2B]" key={photo.id}>
                <img
                  alt={`Auction vehicle ${index + 1}: ${photo.file.name}`}
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
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 bg-[#dff4f1] p-5 text-sm sm:grid-cols-2">
        {[
          'Front, rear, and both sides',
          'Interior and odometer',
          'VIN plate or label',
          'Every known flaw or damage area',
        ].map((item) => (
          <p className="flex items-center gap-2 font-bold" key={item}>
            <CheckCircle2 className="size-4 text-[#0B8F89]" /> {item}
          </p>
        ))}
      </div>
    </StepFrame>
  );
}

function OwnershipStep({
  chooseOwnershipDocument,
  document,
  error,
  message,
  removeDocument,
}: {
  chooseOwnershipDocument: (event: ChangeEvent<HTMLInputElement>) => void;
  document?: File;
  error?: string;
  message?: string;
  removeDocument: () => void;
}) {
  return (
    <StepFrame eyebrow="Step 5 of 6" title="Prove you own the vehicle.">
      <p className="max-w-2xl leading-7 text-slate-600">
        Select a current title or registration. Review compares only the legal
        name and VIN. The document must never appear on the public auction.
      </p>
      <div className="mt-7 flex min-h-52 max-w-2xl flex-col items-center justify-center border-2 border-dashed border-[#061C2B] bg-slate-50 p-8 text-center">
        <FileCheck2 className="size-10 text-[#0B8F89]" />
        <label
          className="mt-4 font-black uppercase"
          htmlFor="auction-ownership-document"
        >
          {document ? 'Replace private document' : 'Choose private document'}
        </label>
        <span className="mt-2 text-sm text-slate-600">
          PDF, JPG, PNG, or WebP · 10 MB maximum
        </span>
        <Input
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          className="mt-4 h-auto cursor-pointer rounded-none border-2 border-[#061C2B] bg-white py-2 file:mr-4 file:border-0 file:bg-[#16C7BE] file:px-4 file:py-2 file:font-black file:uppercase"
          id="auction-ownership-document"
          onChange={chooseOwnershipDocument}
          type="file"
        />
      </div>
      <FieldError message={error} />
      {message ? (
        <p className="mt-3 text-sm font-bold text-red-700" role="alert">
          {message}
        </p>
      ) : null}
      {document ? (
        <div className="mt-5 flex max-w-2xl items-center justify-between gap-4 border-2 border-[#0B8F89] bg-teal-50 p-4">
          <div className="min-w-0">
            <p className="font-black uppercase">Private document selected</p>
            <p className="mt-1 truncate text-sm text-slate-600">
              {document.name} · {(document.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <Button
            className="shrink-0 rounded-none border-red-300 text-red-700 hover:bg-red-50"
            onClick={removeDocument}
            variant="outline"
          >
            <Trash2 /> Remove
          </Button>
        </div>
      ) : null}
      <Notice>
        Practice mode keeps the selected file only in this browser tab. The
        production launch will use private, access-controlled storage with
        automatic retention deletion.
      </Notice>
    </StepFrame>
  );
}

function ReviewStep({
  attested,
  canSubmit,
  draft,
  document,
  onAttestedChange,
  onSubmit,
  photoCount,
}: {
  attested: boolean;
  canSubmit: boolean;
  draft: PrivateAuctionDraft;
  document?: File;
  onAttestedChange: (value: boolean) => void;
  onSubmit: () => void;
  photoCount: number;
}) {
  const items = [
    [
      'Vehicle',
      `${draft.year} ${draft.makeModel} · ${Number(draft.mileage).toLocaleString()} miles`,
    ],
    ['VIN', draft.vin],
    ['Starting bid', formatAuctionMoney(draft.startingBid)],
    ['Auction length', `${draft.auctionLength} days`],
    ['Reserve', draft.hasReserve ? 'Private reserve selected' : 'No reserve'],
    ['Location', `Approximate area near ${draft.locationZip}`],
    ['Title / lien', `${draft.titleStatus} · ${draft.lienStatus}`],
    [
      'Seller materials',
      `${photoCount} photos · ${document?.name ?? 'No ownership document'}`,
    ],
  ];

  return (
    <StepFrame eyebrow="Step 6 of 6" title="Review before verification.">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div
            className="border-2 border-[#061C2B] bg-slate-50 p-4"
            key={label}
          >
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 break-words font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3 border-2 border-[#16C7BE] bg-[#dff4f1] p-5">
        <ShieldCheck className="mt-0.5 size-6 shrink-0 text-[#0B8F89]" />
        <p className="text-sm leading-6">
          Identity verification is separate from ownership review. Neither check
          guarantees the vehicle’s mechanical condition or a safe transaction.
        </p>
      </div>
      <label className="mt-6 flex items-start gap-3 text-sm leading-6">
        <input
          checked={attested}
          className="mt-1 size-5 accent-[#0B8F89]"
          onChange={(event) => onAttestedChange(event.target.checked)}
          type="checkbox"
        />
        <span>
          I attest that I own this vehicle, am not acting as a dealer, broker,
          reseller, or representative, and that the auction information is
          accurate to the best of my knowledge.
        </span>
      </label>
      <Button
        className={`mt-7 h-12 rounded-none font-black uppercase ${canSubmit ? 'bg-[#FFB81C] text-[#061C2B] shadow-[4px_4px_0_#061C2B] hover:bg-[#16C7BE]' : 'bg-slate-300 text-slate-600'}`}
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        <Gavel /> Prepare for verification
      </Button>
      {!attested ? (
        <p className="mt-3 text-sm font-bold text-amber-800">
          Complete the ownership attestation to continue.
        </p>
      ) : null}
    </StepFrame>
  );
}

function StepFrame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0B8F89]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.04em] sm:text-4xl">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Field({
  error,
  label,
  maxLength,
  min,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  error?: string;
  label: string;
  maxLength?: number;
  min?: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="text-sm font-black uppercase">
      {label}
      <Input
        aria-invalid={Boolean(error)}
        className={fieldClass}
        maxLength={maxLength}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <FieldError message={error} />
    </label>
  );
}

function SelectField({
  error,
  label,
  onChange,
  options,
  value,
}: {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  value: string;
}) {
  return (
    <label className="text-sm font-black uppercase">
      {label}
      <select
        aria-invalid={Boolean(error)}
        className={`${fieldClass} w-full`}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <span className="mt-2 block text-xs font-bold normal-case text-red-700">
      {message}
    </span>
  ) : null;
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 border-l-4 border-[#16C7BE] bg-slate-50 p-4 text-sm leading-6">
      {children}
    </div>
  );
}
