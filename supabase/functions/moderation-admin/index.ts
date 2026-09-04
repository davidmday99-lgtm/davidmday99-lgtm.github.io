import { createClient } from 'npm:@supabase/supabase-js@2';

import {
  stripeVerificationSessionUrl,
  verifiedLegalName,
  type StripeVerifiedOutputs,
} from './stripe-identity.ts';

const productionOrigin = 'https://owneronlycars.com';
const previewOrigin = 'https://owneronly-cars.lucky2551.chatgpt.site';

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
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
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
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization)
    return null;
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

function isAdministrator(user: {
  email?: string;
  app_metadata?: Record<string, unknown>;
}) {
  if (user.app_metadata?.role === 'administrator') return true;
  const allowedEmails = (Deno.env.get('ADMIN_EMAILS') ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(
    user.email && allowedEmails.includes(user.email.toLowerCase()),
  );
}

function cleanReason(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 2000) : '';
}

function safeReview(review: Record<string, unknown>) {
  return {
    id: review.id,
    userId: review.user_id,
    listingReference: review.listing_reference,
    claimedVin: review.claimed_vin,
    originalFilename: review.original_filename,
    mimeType: review.mime_type,
    fileSizeBytes: review.file_size_bytes,
    status: review.status,
    riskLevel: review.risk_level,
    aiSummary: review.ai_summary,
    aiFlags: review.ai_flags,
    aiResult: review.ai_result,
    reviewerNotes: review.reviewer_notes,
    reviewedAt: review.reviewed_at,
    retainUntil: review.retain_until,
    createdAt: review.created_at,
  };
}

Deno.serve(async (request) => {
  const preflightResult = preflight(request);
  if (typeof preflightResult !== 'string') return preflightResult;
  const origin = allowedOrigin(request) ?? preflightResult;

  const authenticated = await authenticateRequest(request);
  if (!authenticated)
    return jsonResponse({ error: 'authentication_required' }, 401, origin);
  const { admin, user } = authenticated;
  if (!isAdministrator(user))
    return jsonResponse({ error: 'administrator_required' }, 403, origin);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400, origin);
  }

  if (payload.action === 'dashboard') {
    const [usersResult, reviewsResult, actionsResult] = await Promise.all([
      admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
      admin
        .from('document_reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      admin
        .from('moderation_actions')
        .select(
          'id, actor_user_id, target_user_id, document_review_id, subject_reference, action, reason, created_at',
        )
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (usersResult.error || reviewsResult.error || actionsResult.error) {
      console.error('dashboard_load_failed', {
        users: usersResult.error?.message ?? null,
        reviews: reviewsResult.error?.message ?? null,
        actions: actionsResult.error?.message ?? null,
      });
      return jsonResponse({ error: 'dashboard_load_failed' }, 502, origin);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const users = await Promise.all(
      usersResult.data.users.map(async (candidate) => {
        const identity = candidate.app_metadata?.identity_verification as
          | {
              session_id?: unknown;
              status?: unknown;
              verified_name?: unknown;
              [key: string]: unknown;
            }
          | undefined;
        let verifiedName =
          typeof identity?.verified_name === 'string' &&
          identity.verified_name.trim()
            ? identity.verified_name.trim()
            : null;

        if (
          !verifiedName &&
          identity?.status === 'verified' &&
          typeof identity.session_id === 'string' &&
          identity.session_id &&
          stripeSecretKey
        ) {
          try {
            const stripeResponse = await fetch(
              stripeVerificationSessionUrl(identity.session_id),
              { headers: { Authorization: `Bearer ${stripeSecretKey}` } },
            );
            if (stripeResponse.ok) {
              const stripeSession = (await stripeResponse.json()) as {
                verified_outputs?: StripeVerifiedOutputs;
              };
              verifiedName = verifiedLegalName(
                stripeSession.verified_outputs ?? null,
              );
              if (verifiedName) {
                await admin.auth.admin.updateUserById(candidate.id, {
                  app_metadata: {
                    ...candidate.app_metadata,
                    identity_verification: {
                      ...identity,
                      verified_name: verifiedName,
                      updated_at: new Date().toISOString(),
                    },
                  },
                });
              }
            }
          } catch (error) {
            console.error('admin_identity_name_refresh_failed', {
              message: error instanceof Error ? error.message : 'unknown_error',
              userId: candidate.id.slice(0, 12),
            });
          }
        }

        return {
          id: candidate.id,
          email: candidate.email ?? 'No email',
          displayName:
            candidate.user_metadata?.full_name ??
            candidate.user_metadata?.name ??
            candidate.user_metadata?.display_name ??
            'Marketplace user',
          createdAt: candidate.created_at,
          lastSignInAt: candidate.last_sign_in_at,
          bannedUntil: candidate.banned_until ?? null,
          role: candidate.app_metadata?.role ?? 'user',
          identityStatus: identity?.status ?? 'not_started',
          verifiedLegalName: verifiedName,
        };
      }),
    );

    return jsonResponse(
      {
        currentUserId: user.id,
        users,
        reviews: (reviewsResult.data ?? []).map(safeReview),
        actions: actionsResult.data ?? [],
      },
      200,
      origin,
    );
  }

  if (payload.action === 'document_url') {
    const reviewId = String(payload.reviewId ?? '');
    const { data: review, error } = await admin
      .from('document_reviews')
      .select('document_path, original_filename, retain_until')
      .eq('id', reviewId)
      .maybeSingle();
    if (error || !review)
      return jsonResponse({ error: 'review_not_found' }, 404, origin);
    if (new Date(review.retain_until).getTime() <= Date.now()) {
      return jsonResponse({ error: 'document_retention_expired' }, 410, origin);
    }

    const { data, error: signedUrlError } = await admin.storage
      .from('ownership-documents')
      .createSignedUrl(review.document_path, 300, {
        download: review.original_filename,
      });
    if (signedUrlError || !data?.signedUrl) {
      return jsonResponse({ error: 'document_link_failed' }, 502, origin);
    }
    return jsonResponse(
      { url: data.signedUrl, expiresInSeconds: 300 },
      200,
      origin,
    );
  }

  if (payload.action === 'review_document') {
    const reviewId = String(payload.reviewId ?? '');
    const decision = String(payload.decision ?? '');
    const reason = cleanReason(payload.reason);
    if (!['approved', 'rejected', 'human_review'].includes(decision)) {
      return jsonResponse({ error: 'invalid_review_decision' }, 400, origin);
    }
    if (reason.length < 3)
      return jsonResponse({ error: 'review_reason_required' }, 400, origin);

    const { data: review, error: reviewError } = await admin
      .from('document_reviews')
      .select('id, user_id')
      .eq('id', reviewId)
      .maybeSingle();
    if (reviewError || !review)
      return jsonResponse({ error: 'review_not_found' }, 404, origin);

    const now = new Date().toISOString();
    const { error: updateError } = await admin
      .from('document_reviews')
      .update({
        status: decision,
        reviewer_notes: reason,
        reviewed_by: user.id,
        reviewed_at: decision === 'human_review' ? null : now,
      })
      .eq('id', reviewId);
    if (updateError)
      return jsonResponse({ error: 'review_update_failed' }, 502, origin);

    const auditAction =
      decision === 'approved'
        ? 'document_approved'
        : decision === 'rejected'
          ? 'document_rejected'
          : 'document_returned_to_review';
    await admin.from('moderation_actions').insert({
      actor_user_id: user.id,
      target_user_id: review.user_id,
      document_review_id: review.id,
      action: auditAction,
      reason,
    });

    return jsonResponse({ ok: true }, 200, origin);
  }

  if (payload.action === 'delete_document') {
    const reviewId = String(payload.reviewId ?? '');
    const reason = cleanReason(payload.reason);
    if (reason.length < 3)
      return jsonResponse({ error: 'deletion_reason_required' }, 400, origin);

    const { data: review, error: reviewError } = await admin
      .from('document_reviews')
      .select('id, document_path')
      .eq('id', reviewId)
      .maybeSingle();
    if (reviewError || !review)
      return jsonResponse({ error: 'review_not_found' }, 404, origin);

    const { error: storageError } = await admin.storage
      .from('ownership-documents')
      .remove([review.document_path]);
    if (storageError)
      return jsonResponse(
        { error: 'document_storage_delete_failed' },
        502,
        origin,
      );

    const { data: deleted, error: deleteError } = await admin.rpc(
      'delete_document_review_with_audit',
      {
        p_actor_user_id: user.id,
        p_reason: reason,
        p_review_id: review.id,
      },
    );
    if (deleteError)
      return jsonResponse({ error: 'review_delete_failed' }, 502, origin);
    if (!deleted)
      return jsonResponse({ error: 'review_not_found' }, 404, origin);

    return jsonResponse({ ok: true }, 200, origin);
  }

  if (payload.action === 'set_user_block') {
    const targetUserId = String(payload.userId ?? '');
    const blocked = payload.blocked === true;
    const reason = cleanReason(payload.reason);
    if (!targetUserId || targetUserId === user.id) {
      return jsonResponse({ error: 'cannot_change_own_access' }, 400, origin);
    }
    if (reason.length < 3)
      return jsonResponse({ error: 'moderation_reason_required' }, 400, origin);

    const { data: targetResult, error: targetError } =
      await admin.auth.admin.getUserById(targetUserId);
    const target = targetResult.user;
    if (targetError || !target)
      return jsonResponse({ error: 'user_not_found' }, 404, origin);
    if (target.app_metadata?.role === 'administrator') {
      return jsonResponse({ error: 'cannot_block_administrator' }, 400, origin);
    }

    const now = new Date().toISOString();
    const { error: updateError } = await admin.auth.admin.updateUserById(
      targetUserId,
      {
        ban_duration: blocked ? '876000h' : 'none',
        app_metadata: {
          ...target.app_metadata,
          moderation: blocked
            ? {
                status: 'blocked',
                reason,
                updated_at: now,
                updated_by: user.id,
              }
            : { status: 'active', updated_at: now, updated_by: user.id },
        },
      },
    );
    if (updateError)
      return jsonResponse({ error: 'account_update_failed' }, 502, origin);

    await admin.from('moderation_actions').insert({
      actor_user_id: user.id,
      target_user_id: targetUserId,
      action: blocked ? 'user_blocked' : 'user_unblocked',
      reason,
    });

    return jsonResponse({ ok: true }, 200, origin);
  }

  return jsonResponse({ error: 'unknown_action' }, 400, origin);
});
