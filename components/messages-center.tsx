'use client';

import type { User } from '@supabase/supabase-js';
import {
  AlertTriangle,
  LoaderCircle,
  MessageSquare,
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

type Conversation = {
  id: string;
  listing_id: string;
  buyer_user_id: string;
  seller_user_id: string;
  created_at: string;
  updated_at: string;
  listing?: ListingSummary;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
};

function normalizeConversation(value: unknown): Conversation | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as Record<string, unknown>;
  const related = Array.isArray(row.vehicle_listings)
    ? row.vehicle_listings[0]
    : row.vehicle_listings;
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
  return {
    id: row.id,
    listing_id: row.listing_id,
    buyer_user_id: row.buyer_user_id,
    seller_user_id: row.seller_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    listing:
      related && typeof related === 'object'
        ? (related as ListingSummary)
        : undefined,
  };
}

function listingName(listing?: ListingSummary) {
  if (!listing) return 'Vehicle listing';
  return `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`;
}

export function MessagesCenter() {
  const [user, setUser] = useState<User | null>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async (currentUser: User) => {
    const requested = new URLSearchParams(window.location.search).get(
      'conversation',
    );
    const { data, error: queryError } = await getSupabaseBrowserClient()
      .from('listing_conversations')
      .select(
        'id, listing_id, buyer_user_id, seller_user_id, created_at, updated_at, vehicle_listings(id, slug, year, make, model, trim, photo_urls, status)',
      )
      .order('updated_at', { ascending: false });

    if (queryError) {
      setError('Messages could not be loaded. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const rows = (data ?? [])
      .map(normalizeConversation)
      .filter((row): row is Conversation => Boolean(row));
    setUser(currentUser);
    setConversations(rows);
    setActiveId(
      requested && rows.some((row) => row.id === requested)
        ? requested
        : (rows[0]?.id ?? ''),
    );
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error: queryError } = await getSupabaseBrowserClient()
      .from('listing_messages')
      .select('id, conversation_id, sender_user_id, body, created_at')
      .eq('conversation_id', conversationId)
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

  useEffect(() => {
    setMessages([]);
    setError('');
    if (activeId) void loadMessages(activeId);
  }, [activeId, loadMessages]);

  const activeConversation = useMemo(
    () => conversations.find((row) => row.id === activeId),
    [activeId, conversations],
  );

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!activeId || !body || sending) return;
    setSending(true);
    setError('');
    const { error: sendError } = await getSupabaseBrowserClient().rpc(
      'send_listing_message',
      { target_conversation_id: activeId, message_body: body },
    );
    setSending(false);
    if (sendError) {
      setError('Your message was not sent. Please try again.');
      return;
    }
    setDraft('');
    await loadMessages(activeId);
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
          Conversations are private to the buyer and verified seller.
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
          conversations.map((conversation) => (
            <button
              className={`w-full border-b border-slate-200 p-4 text-left hover:bg-teal-50 ${conversation.id === activeId ? 'bg-teal-50' : 'bg-white'}`}
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-navy">
                  {conversation.seller_user_id === user.id
                    ? 'Buyer conversation'
                    : 'Verified seller'}
                </p>
                <ShieldCheck className="size-4 shrink-0 text-teal-700" />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {listingName(conversation.listing)}
              </p>
            </button>
          ))
        ) : (
          <p className="p-5 text-sm leading-6 text-slate-500">
            No conversations yet. Buyers can start one from an approved vehicle
            listing.
          </p>
        )}
      </aside>

      <section className="flex min-w-0 flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 p-4">
              {activeConversation.listing?.photo_urls?.[0] && (
                <img
                  alt=""
                  className="size-12 border border-navy object-cover"
                  src={activeConversation.listing.photo_urls[0]}
                />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold text-navy">
                  {listingName(activeConversation.listing)}
                </h2>
                <p className="text-xs text-slate-500">
                  Private conversation attached to this listing
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
                    Ask about availability, condition, or arranging a safe
                    public meeting.
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
              New buyer conversations about your published vehicles will appear
              here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
