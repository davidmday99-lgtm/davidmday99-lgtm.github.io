alter table public.wanted_vehicle_ads
  drop constraint if exists wanted_vehicle_ads_status_check;

alter table public.wanted_vehicle_ads
  add constraint wanted_vehicle_ads_status_check
  check (status in ('published', 'paused', 'removed'));

create or replace function public.update_my_wanted_vehicle_ad(
  target_ad_id uuid,
  p_vehicle_type text,
  p_make text,
  p_model text,
  p_year_min integer,
  p_year_max integer,
  p_max_budget integer,
  p_location_public text,
  p_search_distance text,
  p_description text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  clean_make text := nullif(btrim(coalesce(p_make, '')), '');
  clean_model text := nullif(btrim(coalesce(p_model, '')), '');
  clean_location text := btrim(coalesce(p_location_public, ''));
  clean_description text := btrim(coalesce(p_description, ''));
  result_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  if p_vehicle_type not in (
    'car', 'motorcycle', 'boat', 'atv_utv', 'rv_camper', 'trailer',
    'snowmobile', 'personal_watercraft'
  ) then
    raise exception using errcode = 'P0001', message = 'vehicle_type_invalid';
  end if;

  if char_length(clean_location) < 2 or char_length(clean_location) > 120 then
    raise exception using errcode = 'P0001', message = 'location_invalid';
  end if;

  if char_length(clean_description) < 20 or char_length(clean_description) > 1500 then
    raise exception using errcode = 'P0001', message = 'description_invalid';
  end if;

  if p_search_distance not in ('25', '50', '100', 'nationwide') then
    raise exception using errcode = 'P0001', message = 'distance_invalid';
  end if;

  if p_year_min is not null and (p_year_min < 1900 or p_year_min > 2100) then
    raise exception using errcode = 'P0001', message = 'year_range_invalid';
  end if;

  if p_year_max is not null and (p_year_max < 1900 or p_year_max > 2100) then
    raise exception using errcode = 'P0001', message = 'year_range_invalid';
  end if;

  if p_year_min is not null and p_year_max is not null and p_year_min > p_year_max then
    raise exception using errcode = 'P0001', message = 'year_range_invalid';
  end if;

  if p_max_budget is not null and (p_max_budget < 0 or p_max_budget > 10000000) then
    raise exception using errcode = 'P0001', message = 'budget_invalid';
  end if;

  update public.wanted_vehicle_ads
  set
    vehicle_type = p_vehicle_type,
    make = clean_make,
    model = clean_model,
    year_min = p_year_min,
    year_max = p_year_max,
    max_budget = p_max_budget,
    location_public = clean_location,
    search_distance = p_search_distance,
    description = clean_description
  where id = target_ad_id and user_id = current_user_id
  returning id into result_id;

  if result_id is null then
    raise exception using errcode = 'P0001', message = 'wanted_ad_not_available';
  end if;

  return result_id;
end;
$$;

create or replace function public.set_my_wanted_vehicle_ad_status(
  target_ad_id uuid,
  new_status text
)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  saved_status text;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  if new_status not in ('published', 'paused') then
    raise exception using errcode = 'P0001', message = 'status_invalid';
  end if;

  if new_status = 'published' and exists (
    select 1 from public.wanted_vehicle_ads
    where id = target_ad_id and user_id = current_user_id and expires_at <= now()
  ) then
    raise exception using errcode = 'P0001', message = 'wanted_ad_expired';
  end if;

  update public.wanted_vehicle_ads
  set status = new_status
  where id = target_ad_id and user_id = current_user_id
  returning status into saved_status;

  if saved_status is null then
    raise exception using errcode = 'P0001', message = 'wanted_ad_not_available';
  end if;

  return saved_status;
end;
$$;

create or replace function public.renew_my_wanted_vehicle_ad(target_ad_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  renewed_until timestamptz;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  update public.wanted_vehicle_ads
  set status = 'published', expires_at = now() + interval '90 days'
  where id = target_ad_id and user_id = current_user_id
  returning expires_at into renewed_until;

  if renewed_until is null then
    raise exception using errcode = 'P0001', message = 'wanted_ad_not_available';
  end if;

  return renewed_until;
end;
$$;

create or replace function public.delete_my_wanted_vehicle_ad(target_ad_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  removed_count integer;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  delete from public.wanted_vehicle_ads
  where id = target_ad_id and user_id = current_user_id;
  get diagnostics removed_count = row_count;

  if removed_count = 0 then
    raise exception using errcode = 'P0001', message = 'wanted_ad_not_available';
  end if;

  return true;
end;
$$;

create table if not exists public.wanted_ad_conversations (
  id uuid primary key default gen_random_uuid(),
  wanted_ad_id uuid not null references public.wanted_vehicle_ads(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  responder_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (wanted_ad_id, owner_user_id, responder_user_id),
  check (owner_user_id <> responder_user_id)
);

create table if not exists public.wanted_ad_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.wanted_ad_conversations(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists wanted_ad_conversations_owner_updated_idx
  on public.wanted_ad_conversations (owner_user_id, updated_at desc);
create index if not exists wanted_ad_conversations_responder_updated_idx
  on public.wanted_ad_conversations (responder_user_id, updated_at desc);
create index if not exists wanted_ad_messages_conversation_created_idx
  on public.wanted_ad_messages (conversation_id, created_at);

alter table public.wanted_ad_conversations enable row level security;
alter table public.wanted_ad_messages enable row level security;

revoke all on public.wanted_ad_conversations from anon, authenticated;
revoke all on public.wanted_ad_messages from anon, authenticated;
grant select on public.wanted_ad_conversations to authenticated;
grant select on public.wanted_ad_messages to authenticated;
grant select, insert, update, delete on public.wanted_ad_conversations to service_role;
grant select, insert, update, delete on public.wanted_ad_messages to service_role;

drop policy if exists wanted_conversation_participants_read on public.wanted_ad_conversations;
create policy wanted_conversation_participants_read
on public.wanted_ad_conversations
for select
to authenticated
using (auth.uid() = owner_user_id or auth.uid() = responder_user_id);

drop policy if exists wanted_conversation_messages_read on public.wanted_ad_messages;
create policy wanted_conversation_messages_read
on public.wanted_ad_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.wanted_ad_conversations conversation
    where conversation.id = conversation_id
      and (
        auth.uid() = conversation.owner_user_id
        or auth.uid() = conversation.responder_user_id
      )
  )
);

create or replace function public.start_wanted_ad_conversation(target_wanted_ad_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_identity_status text;
  ad_owner_id uuid;
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
    into ad_owner_id
  from public.wanted_vehicle_ads
  where id = target_wanted_ad_id
    and status = 'published'
    and expires_at > now();

  if ad_owner_id is null then
    raise exception using errcode = 'P0001', message = 'wanted_ad_not_available';
  end if;

  if ad_owner_id = current_user_id then
    raise exception using errcode = 'P0001', message = 'cannot_contact_yourself';
  end if;

  insert into public.wanted_ad_conversations (
    wanted_ad_id, owner_user_id, responder_user_id
  ) values (
    target_wanted_ad_id, ad_owner_id, current_user_id
  )
  on conflict (wanted_ad_id, owner_user_id, responder_user_id)
  do update set updated_at = now()
  returning id into result_id;

  return result_id;
end;
$$;

create or replace function public.send_wanted_ad_message(
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
    from public.wanted_ad_conversations conversation
    where conversation.id = target_conversation_id
      and (
        conversation.owner_user_id = current_user_id
        or conversation.responder_user_id = current_user_id
      )
  ) then
    raise exception using errcode = 'P0001', message = 'conversation_not_available';
  end if;

  insert into public.wanted_ad_messages (conversation_id, sender_user_id, body)
  values (target_conversation_id, current_user_id, clean_body)
  returning id into result_id;

  update public.wanted_ad_conversations
  set updated_at = now()
  where id = target_conversation_id;

  return result_id;
end;
$$;

revoke all on function public.update_my_wanted_vehicle_ad(uuid, text, text, text, integer, integer, integer, text, text, text) from public, anon;
revoke all on function public.set_my_wanted_vehicle_ad_status(uuid, text) from public, anon;
revoke all on function public.renew_my_wanted_vehicle_ad(uuid) from public, anon;
revoke all on function public.delete_my_wanted_vehicle_ad(uuid) from public, anon;
revoke all on function public.start_wanted_ad_conversation(uuid) from public, anon;
revoke all on function public.send_wanted_ad_message(uuid, text) from public, anon;

grant execute on function public.update_my_wanted_vehicle_ad(uuid, text, text, text, integer, integer, integer, text, text, text) to authenticated;
grant execute on function public.set_my_wanted_vehicle_ad_status(uuid, text) to authenticated;
grant execute on function public.renew_my_wanted_vehicle_ad(uuid) to authenticated;
grant execute on function public.delete_my_wanted_vehicle_ad(uuid) to authenticated;
grant execute on function public.start_wanted_ad_conversation(uuid) to authenticated;
grant execute on function public.send_wanted_ad_message(uuid, text) to authenticated;

select 'wanted ad management and messaging ready' as result;
