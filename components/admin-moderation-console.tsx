'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileSearch,
  History,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

type Review = {
  id: string;
  userId: string;
  listingReference: string | null;
  claimedVin: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  status: 'queued' | 'ai_reviewing' | 'human_review' | 'approved' | 'rejected';
  riskLevel: 'unknown' | 'low' | 'medium' | 'high';
  aiSummary: string | null;
  aiFlags: string[];
  aiResult: Record<string, unknown> | null;
  reviewerNotes: string | null;
  reviewedAt: string | null;
  retainUntil: string;
  createdAt: string;
};

type MarketplaceUser = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastSignInAt: string | null;
  bannedUntil: string | null;
  role: string;
  identityStatus: string;
  verifiedLegalName: string | null;
};

type AuditAction = {
  id: string;
  actor_user_id: string;
  target_user_id: string | null;
  document_review_id: string | null;
  subject_reference: string | null;
  action: string;
  reason: string;
  created_at: string;
};

type DashboardData = {
  currentUserId: string;
  users: MarketplaceUser[];
  reviews: Review[];
  actions: AuditAction[];
};

type Tab = 'documents' | 'accounts' | 'activity';

function functionUrl(name: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error('Supabase is not configured.');
  return new URL(`/functions/v1/${name}`, base).toString();
}

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function isBlocked(user: MarketplaceUser) {
  return Boolean(
    user.bannedUntil && new Date(user.bannedUntil).getTime() > Date.now(),
  );
}

function humanizeFlag(flag: string) {
  if (flag.startsWith('ai_note:')) return flag.slice(8);
  return flag.replaceAll('_', ' ');
}

export function AdminModerationConsole() {
  const [data, setData] = useState<DashboardData>();
  const [tab, setTab] = useState<Tab>('documents');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState<string>();
  const [query, setQuery] = useState('');
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [accountReasons, setAccountReasons] = useState<Record<string, string>>(
    {},
  );
  const [documentLinks, setDocumentLinks] = useState<Record<string, string>>(
    {},
  );

  const invokeAdmin = useCallback(async (payload: Record<string, unknown>) => {
    if (!hasSupabaseConfig())
      throw new Error('The secure review service is not configured.');
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken)
      throw new Error('Sign in to an administrator account first.');

    let response: Response;
    try {
      response = await fetch(functionUrl('moderation-admin'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        'The secure moderation service could not be reached. Refresh the page and try again.',
      );
    }
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      [key: string]: unknown;
    };
    if (!response.ok) {
      if (body.error === 'administrator_required') {
        throw new Error(
          'This account is signed in, but it is not an approved administrator.',
        );
      }
      if (body.error === 'dashboard_load_failed') {
        throw new Error(
          'The moderation queue could not be loaded. Refresh the page and try again.',
        );
      }
      throw new Error(
        'The moderation service could not complete that request.',
      );
    }
    return body;
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setData((await invokeAdmin({ action: 'dashboard' })) as DashboardData);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The dashboard could not load.',
      );
    } finally {
      setLoading(false);
    }
  }, [invokeAdmin]);

  useEffect(() => {
    queueMicrotask(() => void loadDashboard());
  }, [loadDashboard]);

  const queue = useMemo(
    () =>
      data?.reviews.filter(
        (review) =>
          review.status === 'human_review' ||
          review.status === 'queued' ||
          review.status === 'ai_reviewing',
      ) ?? [],
    [data],
  );
  const highRisk = queue.filter((review) => review.riskLevel === 'high').length;
  const blockedUsers = data?.users.filter(isBlocked).length ?? 0;
  const visibleUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data?.users ?? [];
    return (data?.users ?? []).filter((user) =>
      `${user.displayName} ${user.email}`.toLowerCase().includes(normalized),
    );
  }, [data, query]);

  async function reviewDocument(
    review: Review,
    decision: 'approved' | 'rejected' | 'human_review',
  ) {
    const reason = reviewNotes[review.id]?.trim() ?? '';
    if (reason.length < 3) {
      setError('Add a short review note before recording a decision.');
      return;
    }
    setBusy(`review-${review.id}`);
    setError(undefined);
    try {
      await invokeAdmin({
        action: 'review_document',
        reviewId: review.id,
        decision,
        reason,
      });
      await loadDashboard();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The review could not be saved.',
      );
    } finally {
      setBusy(undefined);
    }
  }

  async function loadDocumentLink(review: Review) {
    setBusy(`link-${review.id}`);
    setError(undefined);
    try {
      const result = (await invokeAdmin({
        action: 'document_url',
        reviewId: review.id,
      })) as { url: string };
      setDocumentLinks((current) => ({ ...current, [review.id]: result.url }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'A private document link could not be created.',
      );
    } finally {
      setBusy(undefined);
    }
  }

  async function deleteDocument(review: Review) {
    const reason = reviewNotes[review.id]?.trim() ?? '';
    if (reason.length < 3) {
      setError(
        'Add a short review note explaining why this document is being deleted.',
      );
      return;
    }
    const confirmed = window.confirm(
      `Permanently delete ${review.originalFilename}? The private file and review record will be removed. The audit entry will remain.`,
    );
    if (!confirmed) return;

    setBusy(`delete-${review.id}`);
    setError(undefined);
    try {
      await invokeAdmin({
        action: 'delete_document',
        reviewId: review.id,
        reason,
      });
      setDocumentLinks((current) => {
        const next = { ...current };
        delete next[review.id];
        return next;
      });
      await loadDashboard();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The document could not be deleted.',
      );
    } finally {
      setBusy(undefined);
    }
  }

  async function changeAccountAccess(user: MarketplaceUser, blocked: boolean) {
    const reason = accountReasons[user.id]?.trim() ?? '';
    if (reason.length < 3) {
      setError('Add a reason before blocking or restoring an account.');
      return;
    }
    setBusy(`user-${user.id}`);
    setError(undefined);
    try {
      await invokeAdmin({
        action: 'set_user_block',
        userId: user.id,
        blocked,
        reason,
      });
      await loadDashboard();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'The account could not be updated.',
      );
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          icon={FileSearch}
          label="Waiting for review"
          value={queue.length}
          tone="teal"
        />
        <Metric
          icon={AlertTriangle}
          label="High-risk flags"
          value={highRisk}
          tone="amber"
        />
        <Metric
          icon={Ban}
          label="Blocked accounts"
          value={blockedUsers}
          tone="navy"
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-2 border-navy bg-white p-3">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Moderation sections"
        >
          <TabButton
            active={tab === 'documents'}
            onClick={() => setTab('documents')}
          >
            <FileSearch /> Documents
          </TabButton>
          <TabButton
            active={tab === 'accounts'}
            onClick={() => setTab('accounts')}
          >
            <Users /> Accounts
          </TabButton>
          <TabButton
            active={tab === 'activity'}
            onClick={() => setTab('activity')}
          >
            <History /> Audit log
          </TabButton>
        </div>
        <Button
          className="rounded-none"
          disabled={loading}
          onClick={() => void loadDashboard()}
          variant="outline"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      <div className="mt-5 border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Human decision required.</strong> Automated screening only
        identifies possible mismatches, poor legibility, or visible alteration.
        It never proves authenticity and never blocks a user.
      </div>

      {error && (
        <div
          className="mt-5 border-2 border-red-700 bg-red-50 p-4 font-bold text-red-800"
          role="alert"
        >
          {error}{' '}
          {error.includes('Sign in') && (
            <a className="underline" href="/login?next=/admin/moderation">
              Go to login
            </a>
          )}
        </div>
      )}

      {loading && !data ? (
        <div className="mt-6 border-2 border-navy bg-white p-10 text-center font-bold">
          Loading the secure review queue…
        </div>
      ) : null}

      {!loading && data && tab === 'documents' && (
        <section className="mt-6 space-y-5" aria-label="Document review queue">
          {data.reviews.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="No documents yet"
              body="New ownership submissions will appear here after private upload and automated screening."
            />
          ) : (
            data.reviews.map((review) => (
              <article
                className="border-2 border-navy bg-white p-5 shadow-[6px_6px_0_rgba(7,28,44,.12)] sm:p-6"
                key={review.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge level={review.riskLevel} />
                      <StatusBadge status={review.status} />
                    </div>
                    <h2 className="mt-4 text-xl font-black uppercase">
                      {review.originalFilename}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      VIN ending {review.claimedVin.slice(-6)} ·{' '}
                      {(review.fileSizeBytes / 1048576).toFixed(1)} MB ·
                      submitted {formatDate(review.createdAt)}
                    </p>
                    {!review.listingReference && (
                      <p className="mt-3 border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
                        Legacy submission: no vehicle details or vehicle photos
                        were saved with this document. Approval verifies the
                        ownership document but cannot publish a listing. The
                        seller must submit the listing again.
                      </p>
                    )}
                    <p className="mt-1 text-sm text-slate-600">
                      Seller:{' '}
                      {data.users.find(
                        (candidate) => candidate.id === review.userId,
                      )?.displayName ?? 'Marketplace user'}{' '}
                      · ID status:{' '}
                      {data.users
                        .find((candidate) => candidate.id === review.userId)
                        ?.identityStatus.replaceAll('_', ' ') ?? 'unknown'}
                    </p>
                    {data.users.find(
                      (candidate) => candidate.id === review.userId,
                    )?.verifiedLegalName ? (
                      <p className="mt-1 text-sm font-bold text-navy">
                        Stripe-verified legal name:{' '}
                        {
                          data.users.find(
                            (candidate) => candidate.id === review.userId,
                          )?.verifiedLegalName
                        }
                      </p>
                    ) : (
                      <p className="mt-2 border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
                        Verified legal name unavailable—do not approve ownership
                        until the identity result is refreshed.
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs leading-5 text-slate-500">
                    <Clock3 className="mr-1 inline size-4" /> Private copy
                    expires {formatDate(review.retainUntil)}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
                  <div className="border border-slate-300 bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-teal-800">
                      Automated screening
                    </p>
                    <p className="mt-2 leading-6 text-slate-700">
                      {review.aiSummary ?? 'Screening is still in progress.'}
                    </p>
                    {review.aiFlags?.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {review.aiFlags.map((flag) => (
                          <li
                            className="border border-amber-400 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900"
                            key={flag}
                          >
                            {humanizeFlag(flag)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="border border-slate-300 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Private document
                    </p>
                    {documentLinks[review.id] ? (
                      <a
                        className="mt-3 inline-flex items-center gap-2 font-black text-teal-800 underline"
                        href={documentLinks[review.id]}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open secure copy <ExternalLink className="size-4" />
                      </a>
                    ) : (
                      <Button
                        className="mt-3 rounded-none"
                        disabled={busy === `link-${review.id}`}
                        onClick={() => void loadDocumentLink(review)}
                        variant="outline"
                      >
                        <ShieldCheck /> Create 5-minute link
                      </Button>
                    )}
                  </div>
                </div>

                <label className="mt-5 block text-sm font-bold">
                  Reviewer note
                  <Textarea
                    className="mt-2 min-h-24 rounded-none"
                    onChange={(event) =>
                      setReviewNotes((current) => ({
                        ...current,
                        [review.id]: event.target.value,
                      }))
                    }
                    placeholder="Record the evidence behind your decision…"
                    value={reviewNotes[review.id] ?? review.reviewerNotes ?? ''}
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="rounded-none bg-teal-500 font-black uppercase text-navy"
                    disabled={
                      busy === `review-${review.id}` ||
                      busy === `delete-${review.id}` ||
                      !data.users.find(
                        (candidate) => candidate.id === review.userId,
                      )?.verifiedLegalName
                    }
                    onClick={() => void reviewDocument(review, 'approved')}
                  >
                    <CheckCircle2 /> Approve ownership
                  </Button>
                  <Button
                    className="rounded-none border-red-700 bg-white font-black uppercase text-red-700"
                    disabled={
                      busy === `review-${review.id}` ||
                      busy === `delete-${review.id}`
                    }
                    onClick={() => void reviewDocument(review, 'rejected')}
                    variant="outline"
                  >
                    <XCircle /> Reject document
                  </Button>
                  {review.status !== 'human_review' && (
                    <Button
                      className="rounded-none"
                      disabled={
                        busy === `review-${review.id}` ||
                        busy === `delete-${review.id}`
                      }
                      onClick={() =>
                        void reviewDocument(review, 'human_review')
                      }
                      variant="outline"
                    >
                      <RotateCcw /> Return to queue
                    </Button>
                  )}
                  <Button
                    className="rounded-none border-red-800 bg-red-800 font-black uppercase text-white hover:bg-red-900"
                    disabled={
                      busy === `review-${review.id}` ||
                      busy === `delete-${review.id}`
                    }
                    onClick={() => void deleteDocument(review)}
                  >
                    <Trash2 />{' '}
                    {busy === `delete-${review.id}`
                      ? 'Deleting…'
                      : 'Delete permanently'}
                  </Button>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {!loading && data && tab === 'accounts' && (
        <section className="mt-6" aria-label="User accounts">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search accounts</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 size-5 text-slate-500" />
            <Input
              className="h-12 rounded-none border-2 border-navy bg-white pl-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email"
              value={query}
            />
          </label>
          <div className="mt-5 space-y-4">
            {visibleUsers.map((marketplaceUser) => {
              const blocked = isBlocked(marketplaceUser);
              const protectedAccount =
                marketplaceUser.id === data.currentUserId ||
                marketplaceUser.role === 'administrator';
              return (
                <article
                  className="grid gap-5 border-2 border-navy bg-white p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center"
                  key={marketplaceUser.id}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-100">
                      <UserRound className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-black">
                        {marketplaceUser.displayName}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {marketplaceUser.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Joined {formatDate(marketplaceUser.createdAt)} · ID:{' '}
                        {marketplaceUser.identityStatus.replaceAll('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <label className="text-sm font-bold">
                    Moderation reason
                    <Input
                      className="mt-2 h-11 rounded-none"
                      onChange={(event) =>
                        setAccountReasons((current) => ({
                          ...current,
                          [marketplaceUser.id]: event.target.value,
                        }))
                      }
                      placeholder={
                        blocked
                          ? 'Reason for restoring access'
                          : 'Violation or safety reason'
                      }
                      value={accountReasons[marketplaceUser.id] ?? ''}
                    />
                  </label>
                  <Button
                    className={`rounded-none font-black uppercase ${blocked ? 'bg-teal-500 text-navy' : 'border-red-700 text-red-700'}`}
                    disabled={
                      protectedAccount || busy === `user-${marketplaceUser.id}`
                    }
                    onClick={() =>
                      void changeAccountAccess(marketplaceUser, !blocked)
                    }
                    variant={blocked ? 'default' : 'outline'}
                  >
                    {blocked ? (
                      <>
                        <RotateCcw /> Restore account
                      </>
                    ) : (
                      <>
                        <Ban /> Block account
                      </>
                    )}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {!loading && data && tab === 'activity' && (
        <section
          className="mt-6 overflow-x-auto border-2 border-navy bg-white"
          aria-label="Moderation audit log"
        >
          {data.actions.length === 0 ? (
            <EmptyState
              icon={History}
              title="No moderation activity"
              body="Every document decision and account access change will be recorded here."
            />
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {data.actions.map((action) => (
                  <tr className="border-t border-slate-200" key={action.id}>
                    <td className="p-4 font-black uppercase">
                      {action.action.replaceAll('_', ' ')}
                    </td>
                    <td className="max-w-xl p-4 text-slate-700">
                      {action.reason}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {action.subject_reference ??
                        action.target_user_id?.slice(0, 8) ??
                        action.document_review_id?.slice(0, 8) ??
                        '—'}
                    </td>
                    <td className="p-4 text-slate-600">
                      {formatDate(action.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: number;
  tone: 'teal' | 'amber' | 'navy';
}) {
  const colors = {
    teal: 'bg-[#dff4f1]',
    amber: 'bg-[#FFB81C]',
    navy: 'bg-navy text-white',
  }[tone];
  return (
    <div
      className={`border-2 border-navy p-5 shadow-[5px_5px_0_rgba(7,28,44,.15)] ${colors}`}
    >
      <Icon className="size-6" />
      <p className="mt-5 text-4xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-selected={active}
      className={`inline-flex h-11 items-center gap-2 px-4 text-xs font-black uppercase ${active ? 'bg-navy text-white' : 'bg-slate-100 text-navy hover:bg-teal-50'}`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

function RiskBadge({ level }: { level: Review['riskLevel'] }) {
  const styles = {
    high: 'border-red-700 bg-red-50 text-red-800',
    medium: 'border-amber-500 bg-amber-50 text-amber-900',
    low: 'border-teal-600 bg-teal-50 text-teal-800',
    unknown: 'border-slate-400 bg-slate-50 text-slate-700',
  }[level];
  return (
    <span className={`border px-2 py-1 text-xs font-black uppercase ${styles}`}>
      {level} risk
    </span>
  );
}

function StatusBadge({ status }: { status: Review['status'] }) {
  return (
    <span className="border border-slate-300 bg-white px-2 py-1 text-xs font-black uppercase text-slate-700">
      {status.replaceAll('_', ' ')}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BadgeCheck;
  title: string;
  body: string;
}) {
  return (
    <div className="border-2 border-dashed border-slate-400 bg-white p-10 text-center">
      <Icon className="mx-auto size-10 text-teal-700" />
      <h2 className="mt-4 text-2xl font-black uppercase">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{body}</p>
    </div>
  );
}
