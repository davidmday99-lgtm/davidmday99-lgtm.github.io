import { createClient } from 'npm:@supabase/supabase-js@2';

const productionOrigin = 'https://owneronlycars.com';
const previewOrigin = 'https://owneronly-cars.lucky2551.chatgpt.site';
const maximumPhotoBytes = 10 * 1024 * 1024;
const maximumPhotoCount = 20;
const maximumCombinedPhotoBytes = 18 * 1024 * 1024;

type VehicleType =
  | 'car'
  | 'motorcycle'
  | 'boat'
  | 'atv_utv'
  | 'rv_camper'
  | 'trailer'
  | 'snowmobile'
  | 'personal_watercraft';

type ListingDraft = {
  vehicleType: VehicleType;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  engineSize: string;
  mileage: number;
  price: number;
  location: string;
  bodyStyle: string;
  vehicleCondition: string;
  titleStatus: string;
  lienStatus: string;
  drivetrain: string;
  fuelType: string;
  transmission: string;
  description: string;
  carfaxUrl: string | null;
  conditionAnswers: Record<string, string>;
  features: string[];
};

function allowedOrigin(request: Request) {
  const configured = Deno.env.get('SITE_ORIGIN') ?? productionOrigin;
  const origin = request.headers.get('origin') ?? configured;
  return new Set([
    configured,
    productionOrigin,
    previewOrigin,
    'http://localhost:3000',
  ]).has(origin)
    ? origin
    : null;
}

function jsonResponse(body: unknown, status: number, origin: string) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: {
      'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      Vary: 'Origin',
    },
  });
}

function preflight(request: Request) {
  const origin = allowedOrigin(request);
  if (!origin)
    return jsonResponse({ error: 'origin_not_allowed' }, 403, productionOrigin);
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, origin);
  if (request.method !== 'POST')
    return jsonResponse({ error: 'method_not_allowed' }, 405, origin);
  return origin;
}

async function authenticateRequest(request: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authorization = request.headers.get('authorization');
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) return null;

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser();
  if (error || !data.user) return null;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return { admin, user: data.user };
}

function cleanText(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function parseListingDraft(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null;
  try {
    const candidate = JSON.parse(value) as Record<string, unknown>;
    const allowedTypes = new Set<VehicleType>([
      'car', 'motorcycle', 'boat', 'atv_utv', 'rv_camper', 'trailer',
      'snowmobile', 'personal_watercraft',
    ]);
    const vehicleType = cleanText(candidate.vehicleType, 30) as VehicleType;
    const year = Number(candidate.year);
    const mileage = Number(candidate.mileage);
    const price = Number(candidate.price);
    const carfaxUrl = cleanText(candidate.carfaxUrl, 500) || null;
    const draft: ListingDraft = {
      vehicleType: allowedTypes.has(vehicleType) ? vehicleType : 'car',
      year,
      make: cleanText(candidate.make, 80),
      model: cleanText(candidate.model, 80),
      trim: cleanText(candidate.trim, 80) || null,
      engineSize: cleanText(candidate.engineSize, 60),
      mileage,
      price,
      location: cleanText(candidate.location, 120),
      bodyStyle: cleanText(candidate.bodyStyle, 60),
      vehicleCondition: cleanText(candidate.vehicleCondition, 60),
      titleStatus: cleanText(candidate.titleStatus, 60),
      lienStatus: cleanText(candidate.lienStatus, 60),
      drivetrain: cleanText(candidate.drivetrain, 60),
      fuelType: cleanText(candidate.fuelType, 60),
      transmission: cleanText(candidate.transmission, 60),
      description: cleanText(candidate.description, 4000),
      carfaxUrl,
      conditionAnswers:
        candidate.conditionAnswers && typeof candidate.conditionAnswers === 'object'
          ? (candidate.conditionAnswers as Record<string, string>)
          : {},
      features: Array.isArray(candidate.features)
        ? candidate.features
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim().slice(0, 100))
            .filter(Boolean)
            .slice(0, 100)
        : [],
    };
    const currentYear = new Date().getUTCFullYear();
    if (
      !Number.isInteger(year) || year < 1900 || year > currentYear + 1 ||
      !Number.isInteger(mileage) || mileage < 0 || mileage > 2_000_000 ||
      !Number.isInteger(price) || price < 0 || price > 10_000_000 ||
      !draft.make || !draft.model || !draft.engineSize ||
      draft.location.length < 2 || draft.description.length < 10 ||
      !draft.bodyStyle || !draft.vehicleCondition || !draft.titleStatus ||
      !draft.lienStatus || !draft.drivetrain || !draft.fuelType ||
      !draft.transmission
    ) return null;
    if (carfaxUrl && !new URL(carfaxUrl).hostname.toLowerCase().endsWith('carfax.com'))
      return null;
    return draft;
  } catch {
    return null;
  }
}

function validIdentifier(vehicleType: VehicleType, value: string) {
  if (vehicleType === 'boat' || vehicleType === 'personal_watercraft')
    return /^[A-HJ-NPR-Z0-9]{12}$/.test(value);
  if (vehicleType === 'trailer' || vehicleType === 'snowmobile')
    return /^[A-Z0-9-]{6,20}$/.test(value);
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
}

function detectImageType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return { mime: 'image/jpeg', extension: 'jpg' };
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((value, index) => bytes[index] === value))
    return { mime: 'image/png', extension: 'png' };
  const decoder = new TextDecoder();
  if (decoder.decode(bytes.slice(0, 4)) === 'RIFF' && decoder.decode(bytes.slice(8, 12)) === 'WEBP')
    return { mime: 'image/webp', extension: 'webp' };
  return null;
}

function slugPart(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '').slice(0, 42);
}

Deno.serve(async (request) => {
  const preflightResult = preflight(request);
  if (typeof preflightResult !== 'string') return preflightResult;
  const origin = allowedOrigin(request) ?? preflightResult;
  const authenticated = await authenticateRequest(request);
  if (!authenticated)
    return jsonResponse({ error: 'authentication_required' }, 401, origin);
  const { admin, user } = authenticated;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: 'invalid_form_data' }, 400, origin);
  }
  const listing = parseListingDraft(form.get('listing'));
  const identifier = String(form.get('vin') ?? '').trim().toUpperCase();
  const photos = form.getAll('photos').filter((entry): entry is File => entry instanceof File);
  if (!listing)
    return jsonResponse({ error: 'listing_details_required' }, 400, origin);
  if (!validIdentifier(listing.vehicleType, identifier))
    return jsonResponse({ error: 'valid_vin_required' }, 400, origin);
  if (photos.length < 1 || photos.length > maximumPhotoCount)
    return jsonResponse({ error: 'vehicle_photos_required' }, 400, origin);
  if (
    photos.some((photo) => photo.size < 1 || photo.size > maximumPhotoBytes) ||
    photos.reduce((total, photo) => total + photo.size, 0) > maximumCombinedPhotoBytes
  ) return jsonResponse({ error: 'invalid_vehicle_photo_size' }, 400, origin);

  const listingId = crypto.randomUUID();
  const slug = `${slugPart(String(listing.year))}-${slugPart(listing.make)}-${slugPart(listing.model)}-${listingId.slice(0, 8)}`;
  const photoPaths: string[] = [];
  const photoUrls: string[] = [];
  for (let index = 0; index < photos.length; index += 1) {
    const bytes = new Uint8Array(await photos[index].arrayBuffer());
    const detected = detectImageType(bytes);
    if (!detected) {
      if (photoPaths.length) await admin.storage.from('vehicle-photos').remove(photoPaths);
      return jsonResponse({ error: 'invalid_vehicle_photo' }, 400, origin);
    }
    const path = `${user.id}/${listingId}/${index + 1}.${detected.extension}`;
    const { error } = await admin.storage.from('vehicle-photos').upload(path, bytes, {
      contentType: detected.mime,
      upsert: false,
    });
    if (error) {
      if (photoPaths.length) await admin.storage.from('vehicle-photos').remove(photoPaths);
      return jsonResponse({ error: 'vehicle_photo_upload_failed' }, 502, origin);
    }
    photoPaths.push(path);
    photoUrls.push(admin.storage.from('vehicle-photos').getPublicUrl(path).data.publicUrl);
  }

  const { error: insertError } = await admin.from('vehicle_listings').insert({
    id: listingId,
    user_id: user.id,
    review_id: null,
    slug,
    vehicle_type: listing.vehicleType,
    vin: identifier,
    year: listing.year,
    make: listing.make,
    model: listing.model,
    trim: listing.trim,
    engine_size: listing.engineSize,
    price: listing.price,
    mileage: listing.mileage,
    location_public: listing.location,
    body_style: listing.bodyStyle,
    transmission: listing.transmission,
    fuel_type: listing.fuelType,
    drivetrain: listing.drivetrain,
    title_status: listing.titleStatus,
    lien_status: listing.lienStatus,
    vehicle_condition: listing.vehicleCondition,
    description: listing.description,
    carfax_url: listing.carfaxUrl,
    condition_answers: listing.conditionAnswers,
    features: listing.features,
    photo_urls: photoUrls,
    status: 'published',
    published_at: new Date().toISOString(),
  });
  if (insertError) {
    await admin.storage.from('vehicle-photos').remove(photoPaths);
    return jsonResponse({ error: 'listing_save_failed' }, 502, origin);
  }
  return jsonResponse(
    { listingId, slug, status: 'published', message: 'Listing published.' },
    200,
    origin,
  );
});
