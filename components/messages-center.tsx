'use client';

import type { User } from '@supabase/supabase-js';
import {
  AlertTriangle,
  LoaderCircle,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { loginPath } from '@/lib/auth-return';
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from '@/lib/supabase-browser';

type ListingSummary = {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  photo_urls: string[];
  status: string;
};

type WantedAdSummary = {
  id: string;
  user_id: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  year_min: number | null;
  year_max: number | null;
  status: string;
};

type ListingConversation = {
  key: string;
  kind: 'listing';
  id: string;
  listing_id: string;
  buyer_user_id: string;
  seller_user_id: string;
  created_at: string;
  updated_at: string;
  listing?: ListingSummary;
};

type WantedConversation = {
  key: string;
  kind: 'wanted';
  id: string;
  wanted_ad_id: string;
  owner_user_id: string;
  responder_user_id: string;
  created_at: string;
  updated_at: string;
  wantedAd?: WantedAdSummary;
};

type Conversation = ListingConversation | WantedConversation;

type Message = {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
};

function relatedRow(value: unknown, key: string) {
  if (!value || typeof value !== 'object') return undefined;
  const relation = (value as Record<string, unknown>)[key];
  return Array.isArray(relation) ? relation[0] : relation;
}

function normalizeListingConversation(
  value: unknown,
): ListingConversation | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as Record<string, unknown>;
  if (
    typeof row.id !== 'string' ||
    typeof row.listing_id !== 'string' ||
    typeof row.buyer_user_id !== 'string' ||
    typeof row.seller_user_id !== 'string' ||
    typeof row.created_at !== 'string' ||
    typeof row.updated_at !== 'string'
  ) {
    return undefined;
  }
  const listing = relatedRow(row, 'vehicle_listings');
  return {
    key: `listing:${row.id}`,
    kind: 'listing',
    id: row.id,
    listing_id: row.listing_id,
    buyer_user_id: row.buyer_user_id,
    seller_user_id: row.seller_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    listing:
      listing && typeof listing === 'object'
        ? (listing as ListingSummary)
        : undefined,
  };
}

function normalizeWantedConversation(
  value: unknown,
): WantedConversation | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as Record<string, unknown>;
  if (
    typeof row.id !== 'string' ||
    typeof row.wanted_ad_id !== 'string' ||
    typeof row.owner_user_id !== 'string' ||
    typeof row.responder_user_id !== 'string' ||
    typeof row.created_at !== 'string' ||
    typeof row.updated_at !== 'string'
  ) {
    return undefined;
  }
  const wantedAd = relatedRow(row, 'wanted_vehicle_ads');
  return {
    key: `wanted:${row.id}`,
    kind: 'wanted',
    id: row.id,
    wanted_ad_id: row.wanted_ad_id,
    owner_user_id: row.owner_user_id,
    responder_user_id: row.responder_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    wantedAd:
      wantedAd && typeof wantedAd === 'object'
        ? (wantedAd as WantedAdSummary)
        : undefined,
  };
}

function listingName(listing?: ListingSummary) {
  if (!listing) return 'Vehicle listing';
  return `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`;
}

function wantedAdName(ad?: WantedAdSummary) {
  if (!ad) return 'Wanted vehicle';
  const name = [ad.make, ad.model].filter(Boolean).join(' ');
  const years =
    ad.year_min && ad.year_max
      ? ad.year_min === ad.year_max
        ? `${ad.year_min}`
        : `${ad.year_min}–${ad.year_max}`
      : ad.year_min
        ? `${ad.year_min} or newer`
        : ad.year_max
          ? `${ad.year_max} or older`
          : '';
  return `Wanted: ${[years, name || 'Any vehicle'].filter(Boolean).join(' ')}`;
}

function conversationName(conversation: Conversation) {
  return conversation.kind === 'listing'
    ? listingName(conversation.listing)
    : wantedAdName(conversation.wantedAd);
}

export function MessagesCenter() {
  const [user, setUser] = useState<User | null>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async (currentUser: User) => {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedListing = searchParams.get('conversation');
    const requestedWanted = searchParams.get('wantedConversation');
    const supabase = getSupabaseBrowserClient();
    const [listingResult, wantedResult] = await Promise.all([
      supabase
        .from('listing_conversations')
        .select(
          'id, listing_id, buyer_user_id, seller_user_id, created_at, updated_at, vehicle_listings(id, slug, year, make, model, trim, photo_urls, status)',
        )
        .order('updated_at', { ascending: false }),
      supabase
        .from('wanted_ad_conversations')
        .select(
          'id, wanted_ad_id, owner_user_id, responder_user_id, created_at, updated_at, wanted_vehicle_ads(id, user_id, vehicle_type, make, model, year_min, year_max, status)',
        )
        .order('updated_at', { ascending: false }),
    ]);

    if (listingResult.error || wantedResult.error) {
      setError('Messages could not be loaded. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const listingRows = (listingResult.data ?? [])
      .map(normalizeListingConversation)
      .filter((row): row is ListingConversation => Boolean(row));
    const wantedRows = (wantedResult.data ?? [])
      .map(normalizeWantedConversation)
      .filter((row): row is WantedConversation => Boolean(row));
    const rows: Conversation[] = [...listingRows, ...wantedRows].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    const requestedKey = requestedWanted
      ? `wanted:${requestedWanted}`
      : requestedListing
        ? `listing:${requestedListing}`
        : '';
    setUser(currentUser);
    setConversations(rows);
    setActiveKey(
      requestedKey && rows.some((row) => row.key === requestedKey)
        ? requestedKey
        : (rows[0]?.key ?? ''),
    );
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (conversation: Conversation) => {
    const table =
      conversation.kind === 'listing'
        ? 'listing_messages'
        : 'wanted_ad_messages';
    const { data, error: queryError } = await getSupabaseBrowserClient()
      .from(table)
      .select('id, conversation_id, sender_user_id, body, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
    if (queryError) {
      setError('This conversation could not be loaded. Please try again.');
      return;
    }
    setMessages((data ?? []) as Message[]);
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      queueMicrotask(() => {
        setUser(null);
        setLoading(false);
      });
      return;
    }
    const supabase = getSupabaseBrowserClient();
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      if (data.user) void loadConversations(data.user);
      else setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [loadConversations]);

  const activeConversation = useMemo(
    () => conversations.find((row) => row.key === activeKey),
    [activeKey, conversations],
  );

  useEffect(() => {
    setMessages([]);
    setError('');
    if (activeConversation) void loadMessages(activeConversation);
  }, [activeConversation, loadMessages]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!activeConversation || !body || sending) return;
    setSending(true);
    setError('');
    const functionName =
      activeConversation.kind === 'listing'
        ? 'send_listing_message'
        : 'send_wanted_ad_message';
    const { error: sendError } = await getSupabaseBrowserClient().rpc(
      functionName,
      {
        target_conversation_id: activeConversation.id,
        message_body: body,
      },
    );
    setSending(false);
    if (sendError) {
      setError('Your message was not sent. Please try again.');
      return;
    }
    setDraft('');
    await loadMessages(activeConversation);
  }

  if (loading || user === undefined) {
    return (
      <div className="grid min-h-96 place-items-center border-2 border-navy bg-white">
        <LoaderCircle className="size-8 animate-spin text-teal-700" />
        <span className="sr-only">Loading messages</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border-2 border-navy bg-white p-8 text-center shadow-[6px_6px_0_rgba(7,28,44,.15)]">
        <MessageSquare className="mx-auto size-10 text-teal-700" />
        <h2 className="mt-4 text-2xl font-black uppercase text-navy">
          Sign in to see messages
        </h2>
        <p className="mt-3 text-slate-600">
          Conversations are private to the two verified members.
        </p>
        <Button
          className="mt-6 h-11 rounded-none bg-teal-500 font-black uppercase text-navy"
          nativeButton={false}
          render={<a href={loginPath('/messages')} />}
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="grid min-h-[560px] border-2 border-navy bg-white md:grid-cols-[300px_1fr]">
      <aside className="border-b-2 border-navy md:border-b-0 md:border-r-2">
        <div className="border-b border-slate-200 p-4">
          <h2 className="font-black uppercase text-navy">Conversations</h2>
        </div>
        {conversations.length ? (
          conversations.map((conversation) => {
            const label =
              conversation.kind === 'listing'
                ? conversation.seller_user_id === user.id
                  ? 'Buyer conversation'
                  : 'Verified seller'
                : conversation.owner_user_id === user.id
                  ? 'Vehicle owner response'
                  : 'Verified buyer';
            return (
              <button
                className={`w-full border-b border-slate-200 p-4 text-left hover:bg-teal-50 ${conversation.key === activeKey ? 'bg-teal-50' : 'bg-white'}`}
                key={conversation.key}
                onClick={() => setActiveKey(conversation.key)}
                type="button"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-navy">{label}</p>
                  {conversation.kind === 'wanted' ? (
                    <Search className="size-4 shrink-0 text-amber-600" />
                  ) : (
                    <ShieldCheck className="size-4 shrink-0 text-teal-700" />
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {conversationName(conversation)}
                </p>
              </button>
            );
          })
        ) : (
          <p className="p-5 text-sm leading-6 text-slate-500">
            No conversations yet. Start one from a vehicle listing or a wanted
            ad.
          </p>
        )}
      </aside>

      <section className="flex min-w-0 flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 p-4">
              {activeConversation.kind === 'listing' &&
                activeConversation.listing?.photo_urls?.[0] && (
                  <img
                    alt=""
                    className="size-12 border border-navy object-cover"
                    src={activeConversation.listing.photo_urls[0]}
                  />
                )}
              {activeConversation.kind === 'wanted' ? (
                <div className="grid size-12 shrink-0 place-items-center border border-navy bg-amber-100">
                  <Search className="size-6 text-navy" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold text-navy">
                  {conversationName(activeConversation)}
                </h2>
                <p className="text-xs text-slate-500">
                  Private conversation attached to this{' '}
                  {activeConversation.kind === 'listing'
                    ? 'vehicle listing'
                    : 'wanted ad'}
                </p>
              </div>
              <Badge className="rounded-none bg-teal-100 text-teal-800">
                <ShieldCheck /> Verified
              </Badge>
            </div>

            <div
              aria-live="polite"
              className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 p-5"
            >
              {messages.length ? (
                messages.map((message) => {
                  const mine = message.sender_user_id === user.id;
                  return (
                    <div
                      className={`max-w-[85%] border-2 border-navy p-3 text-sm leading-6 ${mine ? 'ml-auto bg-teal-100' : 'mr-auto bg-white'}`}
                      key={message.id}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.body}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="m-auto max-w-md text-center">
                  <MessageSquare className="mx-auto size-10 text-teal-700" />
                  <h3 className="mt-4 text-2xl font-black uppercase text-navy">
                    Start the conversation
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {activeConversation.kind === 'wanted'
                      ? 'Share the vehicle you have, its condition, and where it is located.'
                      : 'Ask about availability, condition, or arranging a safe public meeting.'}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="flex gap-2 border-t border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}
              </div>
            )}
            <form
              className="border-t-2 border-navy p-4"
              onSubmit={(event) => void sendMessage(event)}
            >
              <label className="sr-only" htmlFor="message-body">
                Message
              </label>
              <div className="flex gap-2">
                <textarea
                  className="min-h-12 flex-1 resize-y border-2 border-slate-300 px-3 py-2 outline-none focus:border-teal-600"
                  id="message-body"
                  maxLength={2000}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message…"
                  rows={2}
                  value={draft}
                />
                <Button
                  aria-label="Send message"
                  className="h-auto min-h-12 rounded-none bg-teal-500 px-5 font-black uppercase text-navy"
                  disabled={!draft.trim() || sending}
                  type="submit"
                >
                  {sending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="m-auto max-w-md p-8 text-center">
            <MessageSquare className="mx-auto size-10 text-teal-700" />
            <h2 className="mt-4 text-2xl font-black uppercase text-navy">
              Your inbox is ready
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Messages about your listings and wanted ads will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
