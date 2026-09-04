create table if not exists public.listing_conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.vehicle_listings(id) on delete cascade,
  buyer_user_id uuid not null references auth.users(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_user_id, seller_user_id),
  check (buyer_user_id <> seller_user_id)
);

create table if not exists public.listing_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.listing_conversations(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists listing_conversations_buyer_updated_idx
  on public.listing_conversations (buyer_user_id, updated_at desc);
create index if not exists listing_conversations_seller_updated_idx
  on public.listing_conversations (seller_user_id, updated_at desc);
create index if not exists listing_messages_conversation_created_idx
  on public.listing_messages (conversation_id, created_at);

alter table public.listing_conversations enable row level security;
alter table public.listing_messages enable row level security;

revoke all on public.listing_conversations from anon, authenticated;
revoke all on public.listing_messages from anon, authenticated;
grant select on public.listing_conversations to authenticated;
grant select on public.listing_messages to authenticated;
grant select, insert, update, delete on public.listing_conversations to service_role;
grant select, insert, update, delete on public.listing_messages to service_role;

drop policy if exists conversation_participants_read on public.listing_conversations;
create policy conversation_participants_read
on public.listing_conversations
for select
to authenticated
using (auth.uid() = buyer_user_id or auth.uid() = seller_user_id);

drop policy if exists conversation_messages_read on public.listing_messages;
create policy conversation_messages_read
on public.listing_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.listing_conversations conversation
    where conversation.id = conversation_id
      and (auth.uid() = conversation.buyer_user_id or auth.uid() = conversation.seller_user_id)
  )
);

create or replace function public.start_listing_conversation(target_listing_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_identity_status text;
  listing_seller_id uuid;
  result_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  select coalesce(raw_app_meta_data -> 'identity_verification' ->> 'status', '')
    into current_identity_status
  from auth.users
  where id = current_user_id;

  if current_identity_status <> 'verified' then
    raise exception using errcode = 'P0001', message = 'identity_verification_required';
  end if;

  select user_id
    into listing_seller_id
  from public.vehicle_listings
  where id = target_listing_id and status = 'published';

  if listing_seller_id is null then
    raise exception using errcode = 'P0001', message = 'listing_not_available';
  end if;

  if listing_seller_id = current_user_id then
    raise exception using errcode = 'P0001', message = 'cannot_contact_yourself';
  end if;

  insert into public.listing_conversations (
    listing_id,
    buyer_user_id,
    seller_user_id
  ) values (
    target_listing_id,
    current_user_id,
    listing_seller_id
  )
  on conflict (listing_id, buyer_user_id, seller_user_id)
  do update set updated_at = now()
  returning id into result_id;

  return result_id;
end;
$$;

create or replace function public.send_listing_message(
  target_conversation_id uuid,
  message_body text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  clean_body text := btrim(coalesce(message_body, ''));
  result_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  if char_length(clean_body) < 1 or char_length(clean_body) > 2000 then
    raise exception using errcode = 'P0001', message = 'message_length_invalid';
  end if;

  if not exists (
    select 1
    from public.listing_conversations conversation
    where conversation.id = target_conversation_id
      and (
        conversation.buyer_user_id = current_user_id
        or conversation.seller_user_id = current_user_id
      )
  ) then
    raise exception using errcode = 'P0001', message = 'conversation_not_available';
  end if;

  insert into public.listing_messages (conversation_id, sender_user_id, body)
  values (target_conversation_id, current_user_id, clean_body)
  returning id into result_id;

  update public.listing_conversations
  set updated_at = now()
  where id = target_conversation_id;

  return result_id;
end;
$$;

revoke all on function public.start_listing_conversation(uuid) from public, anon;
revoke all on function public.send_listing_message(uuid, text) from public, anon;
grant execute on function public.start_listing_conversation(uuid) to authenticated;
grant execute on function public.send_listing_message(uuid, text) to authenticated;

select 'listing conversations ready' as result;
