import { createClient } from 'npm:@supabase/supabase-js@2';

const productionOrigin = 'https://owneronlycars.com';
const previewOrigin = 'https://owneronly-cars.lucky2551.chatgpt.site';
const maximumPhotoBytes = 10 * 1024 * 1024;
const maximumPhotoCount = 20;
const maximumNewPhotoBytes = 18 * 1024 * 1024;

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
        'authorization, x-client-info, apikey, content-type, traceparent, tracestate, baggage',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      Vary: 'Origin',
    },
  });
}

function cleanText(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function detectPhotoMime(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return 'image/jpeg';
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((value, index) => bytes[index] === value)) return 'image/png';
  if (
    new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
    new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
  )
    return 'image/webp';
  return null;
}

function extensionFor(mime: string) {
  return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
}

type EditableListing = {
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  mileage: number;
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
  carfax_url: string | null;
  condition_answers: Record<string, string>;
  features: string[];
};

function parseListing(
  value: FormDataEntryValue | null,
): EditableListing | null {
  if (typeof value !== 'string') return null;
  try {
    const candidate = JSON.parse(value) as Record<string, unknown>;
    const year = Number(candidate.year),
      price = Number(candidate.price),
      mileage = Number(candidate.mileage);
    const carfax = cleanText(candidate.carfax_url, 500);
    const listing: EditableListing = {
      year,
      make: cleanText(candidate.make, 80),
      model: cleanText(candidate.model, 80),
      trim: cleanText(candidate.trim, 80) || null,
      price,
      mileage,
      engine_size: cleanText(candidate.engine_size, 60),
      location_public: cleanText(candidate.location_public, 120),
      body_style: cleanText(candidate.body_style, 60),
      transmission: cleanText(candidate.transmission, 60),
      fuel_type: cleanText(candidate.fuel_type, 60),
      drivetrain: cleanText(candidate.drivetrain, 60),
      title_status: cleanText(candidate.title_status, 60),
      lien_status: cleanText(candidate.lien_status, 60),
      vehicle_condition: cleanText(candidate.vehicle_condition, 60),
      description: cleanText(candidate.description, 4000),
      carfax_url: carfax || null,
      condition_answers:
        candidate.condition_answers &&
        typeof candidate.condition_answers === 'object'
          ? Object.fromEntries(
              Object.entries(
                candidate.condition_answers as Record<string, unknown>,
              )
                .filter(([, answer]) => typeof answer === 'string')
                .slice(0, 100)
                .map(([key, answer]) => [
                  key.slice(0, 80),
                  cleanText(answer, 100),
                ]),
            )
          : {},
      features: Array.isArray(candidate.features)
        ? [
            ...new Set(
              candidate.features
                .filter((item): item is string => typeof item === 'string')
                .map((item) => item.trim().slice(0, 100))
                .filter(Boolean),
            ),
          ].slice(0, 100)
        : [],
    };
    const currentYear = new Date().getUTCFullYear();
    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > currentYear + 1 ||
      !Number.isInteger(price) ||
      price < 0 ||
      price > 10000000 ||
      !Number.isInteger(mileage) ||
      mileage < 0 ||
      mileage > 2000000 ||
      !listing.make ||
      !listing.model ||
      !listing.engine_size ||
      listing.location_public.length < 2 ||
      !listing.body_style ||
      !listing.transmission ||
      !listing.fuel_type ||
      !listing.drivetrain ||
      !listing.title_status ||
      !listing.lien_status ||
      !listing.vehicle_condition ||
      listing.description.length < 10
    )
      return null;
    if (carfax) {
      const url = new URL(carfax),
        host = url.hostname.toLowerCase();
      if (
        url.protocol !== 'https:' ||
        (host !== 'carfax.com' && !host.endsWith('.carfax.com')) ||
        url.username ||
        url.password
      )
        return null;
      listing.carfax_url = url.toString();
    }
    return listing;
  } catch {
    return null;
  }
}

function storagePath(url: string, userId: string, listingId: string) {
  try {
    const marker = '/storage/v1/object/public/vehicle-photos/';
    const pathname = new URL(url).pathname,
      markerIndex = pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    const path = decodeURIComponent(
      pathname.slice(markerIndex + marker.length),
    );
    return path.startsWith(`${userId}/${listingId}/`) ? path : null;
  } catch {
    return null;
  }
}

Deno.serve(async (request) => {
  const origin = allowedOrigin(request);
  if (!origin)
    return jsonResponse({ error: 'origin_not_allowed' }, 403, productionOrigin);
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, origin);
  if (request.method !== 'POST')
    return jsonResponse({ error: 'method_not_allowed' }, 405, origin);
  const supabaseUrl = Deno.env.get('SUPABASE_URL'),
    anonKey = Deno.env.get('SUPABASE_ANON_KEY'),
    serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    authorization = request.headers.get('authorization');
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization)
    return jsonResponse({ error: 'unauthorized' }, 401, origin);
  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData.user)
    return jsonResponse({ error: 'unauthorized' }, 401, origin);
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: 'invalid_form_data' }, 400, origin);
  }
  const listingId = cleanText(form.get('listing_id'), 80),
    updates = parseListing(form.get('listing'));
  let retained: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get('retained_photo_urls') ?? '[]'));
    if (
      !Array.isArray(parsed) ||
      parsed.some((item) => typeof item !== 'string')
    )
      throw new Error();
    retained = [...new Set(parsed)].slice(0, maximumPhotoCount);
  } catch {
    return jsonResponse({ error: 'invalid_photo_selection' }, 400, origin);
  }
  const photos = form
    .getAll('photos')
    .filter((item): item is File => item instanceof File);
  if (!listingId || !updates)
    return jsonResponse({ error: 'listing_details_required' }, 400, origin);
  const { data: existing, error: lookupError } = await admin
    .from('vehicle_listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', authData.user.id)
    .maybeSingle();
  if (lookupError || !existing)
    return jsonResponse({ error: 'listing_not_found' }, 404, origin);
  if (existing.status === 'removed')
    return jsonResponse({ error: 'removed_listing_locked' }, 409, origin);
  const currentUrls = Array.isArray(existing.photo_urls)
    ? (existing.photo_urls as string[])
    : [];
  if (retained.some((url) => !currentUrls.includes(url)))
    return jsonResponse({ error: 'invalid_photo_selection' }, 400, origin);
  if (
    retained.length + photos.length < 1 ||
    retained.length + photos.length > maximumPhotoCount
  )
    return jsonResponse({ error: 'vehicle_photos_required' }, 400, origin);
  if (
    photos.some((photo) => photo.size < 1 || photo.size > maximumPhotoBytes) ||
    photos.reduce((total, photo) => total + photo.size, 0) >
      maximumNewPhotoBytes
  )
    return jsonResponse({ error: 'invalid_vehicle_photo_size' }, 400, origin);

  const uploadedPaths: string[] = [],
    uploadedUrls: string[] = [];
  for (let index = 0; index < photos.length; index += 1) {
    const bytes = new Uint8Array(await photos[index].arrayBuffer()),
      mime = detectPhotoMime(bytes);
    if (!mime) {
      if (uploadedPaths.length)
        await admin.storage.from('vehicle-photos').remove(uploadedPaths);
      return jsonResponse({ error: 'invalid_vehicle_photo' }, 400, origin);
    }
    const path = `${authData.user.id}/${listingId}/edit-${Date.now()}-${index}.${extensionFor(mime)}`;
    const { error } = await admin.storage
      .from('vehicle-photos')
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (error) {
      if (uploadedPaths.length)
        await admin.storage.from('vehicle-photos').remove(uploadedPaths);
      return jsonResponse(
        { error: 'vehicle_photo_upload_failed' },
        502,
        origin,
      );
    }
    uploadedPaths.push(path);
    uploadedUrls.push(
      admin.storage.from('vehicle-photos').getPublicUrl(path).data.publicUrl,
    );
  }
  const finalUrls = [...retained, ...uploadedUrls];
  const { data: updated, error: updateError } = await admin
    .from('vehicle_listings')
    .update({ ...updates, photo_urls: finalUrls })
    .eq('id', listingId)
    .eq('user_id', authData.user.id)
    .select('*')
    .single();
  if (updateError || !updated) {
    if (uploadedPaths.length)
      await admin.storage.from('vehicle-photos').remove(uploadedPaths);
    return jsonResponse({ error: 'listing_update_failed' }, 502, origin);
  }
  const removedPaths = currentUrls
    .filter((url) => !retained.includes(url))
    .map((url) => storagePath(url, authData.user.id, listingId))
    .filter((path): path is string => Boolean(path));
  if (removedPaths.length)
    await admin.storage.from('vehicle-photos').remove(removedPaths);
  return jsonResponse({ listing: updated }, 200, origin);
});
