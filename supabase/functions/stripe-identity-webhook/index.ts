import { createClient } from 'npm:@supabase/supabase-js@2';

import {
  stripeVerificationSessionUrl,
  verifiedLegalName,
  type StripeVerifiedOutputs,
} from './stripe-identity.ts';

function secureEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function verifyStripeSignature(
  body: string,
  signatureHeader: string,
  secret: string,
) {
  const parts = signatureHeader.split(',');
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  const expected = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return signatures.some((signature) => secureEqual(signature, expected));
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const webhookSecret = Deno.env.get('STRIPE_IDENTITY_WEBHOOK_SECRET');
  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  if (
    !webhookSecret ||
    !signature ||
    !(await verifyStripeSignature(rawBody, signature, webhookSecret))
  ) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(rawBody);
  let session = event.data?.object as {
    id?: string;
    metadata?: { user_id?: string };
    last_error?: { code?: string; reason?: string } | null;
    verified_outputs?: StripeVerifiedOutputs;
  };
  const userId = session?.metadata?.user_id;
  const statuses = {
    'identity.verification_session.processing': 'processing',
    'identity.verification_session.verified': 'verified',
    'identity.verification_session.requires_input': 'requires_input',
    'identity.verification_session.canceled': 'canceled',
    'identity.verification_session.redacted': 'redacted',
  };
  const status = statuses[event.type];

  if (!status || !userId || !session?.id) {
    return new Response('Ignored', { status: 200 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response('Service not configured', { status: 503 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const {
    data: { user },
  } = await admin.auth.admin.getUserById(userId);

  if (!user) return new Response('User not found', { status: 404 });

  if (status === 'verified' && stripeSecretKey && session.id) {
    try {
      const stripeResponse = await fetch(
        stripeVerificationSessionUrl(session.id),
        { headers: { Authorization: `Bearer ${stripeSecretKey}` } },
      );
      if (stripeResponse.ok) {
        session = await stripeResponse.json();
      } else {
        console.error('stripe_verified_outputs_retrieve_failed', {
          sessionId: session.id.slice(0, 12),
          status: stripeResponse.status,
        });
      }
    } catch (error) {
      console.error('stripe_verified_outputs_retrieve_failed', {
        message: error instanceof Error ? error.message : 'unknown_error',
        sessionId: session.id.slice(0, 12),
      });
    }
  }

  const { error } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...user.app_metadata,
      identity_verification: {
        provider: 'stripe',
        session_id: session.id,
        status,
        verified_name:
          status === 'verified'
            ? verifiedLegalName(session.verified_outputs ?? null)
            : null,
        failure_category: session.last_error?.code ?? null,
        failure_reason:
          typeof session.last_error?.reason === 'string'
            ? session.last_error.reason.slice(0, 240)
            : null,
        updated_at: new Date().toISOString(),
      },
    },
  });

  return new Response(error ? 'Update failed' : 'OK', {
    status: error ? 500 : 200,
  });
});
