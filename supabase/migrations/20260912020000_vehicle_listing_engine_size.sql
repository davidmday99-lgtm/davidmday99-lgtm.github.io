alter table public.vehicle_listings
  add column if not exists engine_size text;

alter table public.vehicle_listings
  drop constraint if exists vehicle_listings_engine_size_check;

alter table public.vehicle_listings
  add constraint vehicle_listings_engine_size_check
  check (
    engine_size is null
    or char_length(btrim(engine_size)) between 1 and 60
  );

comment on column public.vehicle_listings.engine_size is
  'Seller-reported engine displacement or power. Null is retained only for legacy listings.';

select 'vehicle listing engine size migration ready' as result;
