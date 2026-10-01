-- Open marketplace launch: accounts remain required for publishing and messaging,
-- but phone, identity, and ownership-document verification are no longer gates.

alter table public.vehicle_listings
  alter column review_id drop not null;

alter table public.vehicle_listings
  alter column status set default 'published';

create or replace function public.start_listing_conversation(target_listing_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  listing_seller_id uuid;
  result_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  select user_id into listing_seller_id
  from public.vehicle_listings
  where id = target_listing_id and status = 'published';

  if listing_seller_id is null then
    raise exception using errcode = 'P0001', message = 'listing_not_available';
  end if;
  if listing_seller_id = current_user_id then
    raise exception using errcode = 'P0001', message = 'cannot_contact_yourself';
  end if;

  insert into public.listing_conversations (listing_id, buyer_user_id, seller_user_id)
  values (target_listing_id, current_user_id, listing_seller_id)
  on conflict (listing_id, buyer_user_id, seller_user_id)
  do update set updated_at = now()
  returning id into result_id;
  return result_id;
end;
$$;

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
  if (
    select count(*) from public.wanted_vehicle_ads
    where user_id = current_user_id and status = 'published' and expires_at > now()
  ) >= 10 then
    raise exception using errcode = 'P0001', message = 'active_ad_limit_reached';
  end if;

  insert into public.wanted_vehicle_ads (
    user_id, vehicle_type, make, model, year_min, year_max, max_budget,
    location_public, search_distance, description
  ) values (
    current_user_id, p_vehicle_type, clean_make, clean_model, p_year_min,
    p_year_max, p_max_budget, clean_location, p_search_distance,
    clean_description
  ) returning id into result_id;
  return result_id;
end;
$$;

create or replace function public.start_wanted_ad_conversation(target_wanted_ad_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  ad_owner_id uuid;
  result_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'authentication_required';
  end if;

  select user_id into ad_owner_id
  from public.wanted_vehicle_ads
  where id = target_wanted_ad_id and status = 'published' and expires_at > now();

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

revoke all on function public.start_listing_conversation(uuid) from public, anon;
revoke all on function public.create_wanted_vehicle_ad(text, text, text, integer, integer, integer, text, text, text) from public, anon;
revoke all on function public.start_wanted_ad_conversation(uuid) from public, anon;
grant execute on function public.start_listing_conversation(uuid) to authenticated;
grant execute on function public.create_wanted_vehicle_ad(text, text, text, integer, integer, integer, text, text, text) to authenticated;
grant execute on function public.start_wanted_ad_conversation(uuid) to authenticated;

select 'open private-owner marketplace ready' as result;
