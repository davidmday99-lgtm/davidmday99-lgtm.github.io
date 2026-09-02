import { createClient } from 'npm:@supabase/supabase-js@2';

const defaultSiteOrigin = 'https://owneronlycars.com';

function response(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Access-Control-Allow-Headers': 'authorization, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      Vary: 'Origin',
    },
  });
}

Deno.serve(async (request) => {
  const siteOrigin = Deno.env.get('SITE_ORIGIN') ?? defaultSiteOrigin;
  const requestOrigin = request.headers.get('origin') ?? siteOrigin;

  if (
    requestOrigin !== siteOrigin &&
    requestOrigin !== 'http://localhost:3000'
  ) {
    return response({ error: 'origin_not_allowed' }, 403, siteOrigin);
  }

  if (request.method === 'OPTIONS') {
    return response({}, 204, requestOrigin);
  }

  if (request.method !== 'POST') {
    return response({ error: 'method_not_allowed' }, 405, requestOrigin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const authorization = request.headers.get('authorization');

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !serviceRoleKey ||
    !stripeSecretKey ||
    !authorization
  ) {
    return response({ error: 'service_not_configured' }, 503, requestOrigin);
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    return response({ error: 'authentication_required' }, 401, requestOrigin);
  }

  let returnUrl = `${siteOrigin}/account/verification?identity=returned`;
  try {
    const payload = await request.json();
    const requestedReturnUrl = new URL(payload.returnUrl);
    if (requestedReturnUrl.origin === siteOrigin) {
      returnUrl = requestedReturnUrl.toString();
    }
  } catch {
    // Use the trusted default return URL.
  }

  const form = new URLSearchParams({
    type: 'document',
    return_url: returnUrl,
    client_reference_id: user.id,
    'metadata[user_id]': user.id,
  });
  const stripeResponse = await fetch(
    'https://api.stripe.com/v1/identity/verification_sessions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `owneronly-identity-${user.id}-${new Date()
          .toISOString()
          .slice(0, 10)}`,
      },
      body: form,
    },
  );
  const stripeSession = await stripeResponse.json();

  if (!stripeResponse.ok || !stripeSession.id || !stripeSession.url) {
    return response({ error: 'identity_session_failed' }, 502, requestOrigin);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  await admin.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...user.app_metadata,
      identity_verification: {
        provider: 'stripe',
        session_id: stripeSession.id,
        status: stripeSession.status ?? 'requires_input',
        updated_at: new Date().toISOString(),
      },
    },
  });

  return response(
    { id: stripeSession.id, url: stripeSession.url },
    200,
    requestOrigin,
  );
});
