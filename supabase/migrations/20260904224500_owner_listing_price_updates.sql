create or replace function public.update_my_listing_price(
  target_listing_id uuid,
  new_price integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_price integer;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if new_price < 0 or new_price > 10000000 then
    raise exception 'invalid_listing_price' using errcode = '22023';
  end if;

  update public.vehicle_listings
  set price = new_price
  where id = target_listing_id
    and user_id = auth.uid()
    and status in ('pending_review', 'published', 'rejected')
  returning price into saved_price;

  if saved_price is null then
    raise exception 'listing_not_editable' using errcode = '42501';
  end if;

  return saved_price;
end;
$$;

revoke all on function public.update_my_listing_price(uuid, integer) from public;
grant execute on function public.update_my_listing_price(uuid, integer) to authenticated;

select 'owner listing price updates ready' as result;
