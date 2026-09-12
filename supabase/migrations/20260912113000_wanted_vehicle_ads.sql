create table if not exists public.wanted_vehicle_ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_type text not null check (
    vehicle_type in (
      'car',
      'motorcycle',
      'boat',
      'atv_utv',
      'rv_camper',
      'trailer',
      'snowmobile',
      'personal_watercraft'
    )
  ),
  make text check (make is null or char_length(make) between 1 and 80),
  model text check (model is null or char_length(model) between 1 and 80),
  year_min integer check (year_min is null or year_min between 1900 and 2100),
  year_max integer check (year_max is null or year_max between 1900 and 2100),
  max_budget integer check (max_budget is null or max_budget between 0 and 10000000),
  location_public text not null check (char_length(location_public) between 2 and 120),
  search_distance text not null default '50' check (
    search_distance in ('25', '50', '100', 'nationwide')
  ),
  description text not null check (char_length(description) between 20 and 1500),
  status text not null default 'published' check (status in ('published', 'removed')),
  expires_at timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (year_min is null or year_max is null or year_min <= year_max)
);

create index if not exists wanted_vehicle_ads_public_idx
  on public.wanted_vehicle_ads (status, created_at desc);
create index if not exists wanted_vehicle_ads_owner_idx
  on public.wanted_vehicle_ads (user_id, created_at desc);
create index if not exists wanted_vehicle_ads_type_idx
  on public.wanted_vehicle_ads (vehicle_type, status, created_at desc);

alter table public.wanted_vehicle_ads enable row level security;

revoke all on public.wanted_vehicle_ads from anon, authenticated;
grant select on public.wanted_vehicle_ads to anon, authenticated;
grant select, insert, update, delete on public.wanted_vehicle_ads to service_role;

drop policy if exists wanted_vehicle_ads_public_or_owner_read on public.wanted_vehicle_ads;
create policy wanted_vehicle_ads_public_or_owner_read
on public.wanted_vehicle_ads
for select
to anon, authenticated
using (
  (status = 'published' and expires_at > now())
  or user_id = auth.uid()
);

create or replace function public.touch_wanted_vehicle_ad_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wanted_vehicle_ads_touch_updated_at on public.wanted_vehicle_ads;
create trigger wanted_vehicle_ads_touch_updated_at
before update on public.wanted_vehicle_ads
for each row execute function public.touch_wanted_vehicle_ad_updated_at();

create or replace function public.create_wanted_vehicle_ad(
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
  current_identity_status text;
  clean_make text := nullif(btrim(coalesce(p_make, '')), '');
  clean_model text := nullif(btrim(coalesce(p_model, '')), '');
  clean_location text := btrim(coalesce(p_location_public, ''));
  clean_description text := btrim(coalesce(p_description, ''));
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

  if p_vehicle_type not in (
    'car',
    'motorcycle',
    'boat',
    'atv_utv',
    'rv_camper',
    'trailer',
    'snowmobile',
    'personal_watercraft'
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

  if p_year_min is not null and p_year_max is not null and p_year_min > p_year_max then
    raise exception using errcode = 'P0001', message = 'year_range_invalid';
  end if;

  if (
    select count(*)
    from public.wanted_vehicle_ads
    where user_id = current_user_id
      and status = 'published'
      and expires_at > now()
  ) >= 10 then
    raise exception using errcode = 'P0001', message = 'active_ad_limit_reached';
  end if;

  insert into public.wanted_vehicle_ads (
    user_id,
    vehicle_type,
    make,
    model,
    year_min,
    year_max,
    max_budget,
    location_public,
    search_distance,
    description
  ) values (
    current_user_id,
    p_vehicle_type,
    clean_make,
    clean_model,
    p_year_min,
    p_year_max,
    p_max_budget,
    clean_location,
    p_search_distance,
    clean_description
  )
  returning id into result_id;

  return result_id;
end;
$$;

revoke all on function public.create_wanted_vehicle_ad(
  text,
  text,
  text,
  integer,
  integer,
  integer,
  text,
  text,
  text
) from public, anon;
grant execute on function public.create_wanted_vehicle_ad(
  text,
  text,
  text,
  integer,
  integer,
  integer,
  text,
  text,
  text
) to authenticated;

select 'wanted vehicle ads ready' as result;
