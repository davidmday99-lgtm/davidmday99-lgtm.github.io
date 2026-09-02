import { createClient } from 'npm:@supabase/supabase-js@2';

const defaultSiteOrigin = 'https://owneronlycars.com';
const previewSiteOrigin = 'https://owneronly-cars.lucky2551.chatgpt.site';

type StripeVerificationSession = {
  id?: string;
  last_error?: { code?: string; reason?: string } | null;
  metadata?: { user_id?: string };
  status?: string;
  url?: string | null;
  verified_outputs?: { first_name?: string; last_name?: string } | null;
};

function response(body: unknown, status: number, origin: string) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
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

function cleanReason(value: unknown) {
  return typeof value === 'string' ? value.slice(0, 240) : null;
}

function cleanStatus(value: unknown) {
  return value === 'verified' ||
    value === 'processing' ||
    value === 'requires_input' ||
    value === 'canceled' ||
    value === 'redacted'
    ? value
    : 'requires_input';
}

async function retrieveStripeSession(secret: string, sessionId: string) {
  const result = await fetch(
    `https://api.stripe.com/v1/identity/verification_sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  );

  if (result.status === 404) return null;
  if (!result.ok) throw new Error('stripe_retrieve_failed');
  return (await result.json()) as StripeVerificationSession;
}

Deno.serve(async (request) => {
  const siteOrigin = Deno.env.get('SITE_ORIGIN') ?? defaultSiteOrigin;
  const requestOrigin = request.headers.get('origin') ?? siteOrigin;
  const allowedOrigins = new Set([
    siteOrigin,
    previewSiteOrigin,
    'http://localhost:3000',
  ]);

  if (!allowedOrigins.has(requestOrigin)) {
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

  let payload: {
    action?: unknown;
    forceNew?: unknown;
    returnUrl?: unknown;
  } = {};
  try {
    payload = await request.json();
  } catch {
    // The default action starts a new or retryable session.
  }

  const action = payload.action === 'status' ? 'status' : 'start';
  const forceNew = action === 'start' && payload.forceNew === true;
  let returnUrl = `${siteOrigin}/account/verification?identity=returned`;
  try {
    const requestedReturnUrl = new URL(String(payload.returnUrl));
    if (allowedOrigins.has(requestedReturnUrl.origin)) {
      returnUrl = requestedReturnUrl.toString();
    }
  } catch {
    // Use the trusted default return URL.
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const previous = user.app_metadata?.identity_verification;
  const previousSessionId =
    previous && typeof previous === 'object'
      ? (previous as { session_id?: unknown }).session_id
      : undefined;

  let stripeSession: StripeVerificationSession | null = null;
  if (!forceNew && typeof previousSessionId === 'string' && previousSessionId) {
    try {
      stripeSession = await retrieveStripeSession(
        stripeSecretKey,
        previousSessionId,
      );
    } catch (error) {
      console.error('stripe_identity_session_retrieve_failed', {
        action,
        message: error instanceof Error ? error.message : 'unknown_error',
        sessionId: previousSessionId.slice(0, 12),
      });

      // A stale session or a session created with a replaced Stripe key must
      // never permanently block a customer from starting a fresh check.
      if (action === 'status') {
        return response(
          { error: 'identity_status_failed' },
          502,
          requestOrigin,
        );
      }

      stripeSession = null;
    }

    if (
      stripeSession?.metadata?.user_id &&
      stripeSession.metadata.user_id !== user.id
    ) {
      return response(
        { error: 'identity_session_mismatch' },
        403,
        requestOrigin,
      );
    }
  }

  async function synchronize(session: StripeVerificationSession) {
    const status = cleanStatus(session.status);
    const failureReason = cleanReason(session.last_error?.reason);
    const verifiedName =
      status === 'verified'
        ? [
            session.verified_outputs?.first_name,
            session.verified_outputs?.last_name,
          ]
            .filter(Boolean)
            .join(' ') || null
        : null;

    await admin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        identity_verification: {
          provider: 'stripe',
          session_id: session.id,
          status,
          verified_name: verifiedName,
          failure_category: session.last_error?.code ?? null,
          failure_reason: failureReason,
          updated_at: new Date().toISOString(),
        },
      },
    });

    return {
      status,
      failureCategory: session.last_error?.code ?? null,
      failureReason,
    };
  }

  if (stripeSession?.id) {
    const current = await synchronize(stripeSession);

    if (action === 'status') {
      return response(current, 200, requestOrigin);
    }

    if (current.status === 'verified' || current.status === 'processing') {
      return response(current, 200, requestOrigin);
    }

    if (current.status === 'requires_input' && stripeSession.url) {
      return response(
        { ...current, id: stripeSession.id, url: stripeSession.url },
        200,
        requestOrigin,
      );
    }
  } else if (action === 'status') {
    return response({ status: 'not_started' }, 200, requestOrigin);
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
        'Idempotency-Key': `owneronly-identity-${user.id}-${crypto.randomUUID()}`,
      },
      body: form,
    },
  );
  stripeSession = await stripeResponse.json();

  if (!stripeResponse.ok || !stripeSession.id || !stripeSession.url) {
    return response({ error: 'identity_session_failed' }, 502, requestOrigin);
  }

  const current = await synchronize(stripeSession);

  return response(
    { ...current, id: stripeSession.id, url: stripeSession.url },
    200,
    requestOrigin,
  );
});
