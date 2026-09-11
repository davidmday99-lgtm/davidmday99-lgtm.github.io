alter table public.vehicle_listings
  add column if not exists vehicle_type text not null default 'car';

alter table public.vehicle_listings
  drop constraint if exists vehicle_listings_vehicle_type_check;
alter table public.vehicle_listings
  add constraint vehicle_listings_vehicle_type_check
  check (
    vehicle_type in (
      'car',
      'motorcycle',
      'boat',
      'atv_utv',
      'rv_camper',
      'trailer'
    )
  );

alter table public.vehicle_listings
  drop constraint if exists vehicle_listings_vin_check;
alter table public.vehicle_listings
  drop constraint if exists vehicle_listings_identifier_check;
alter table public.vehicle_listings
  add constraint vehicle_listings_identifier_check
  check (vin ~ '^[A-Z0-9-]{6,20}$');

alter table public.document_reviews
  drop constraint if exists document_reviews_claimed_vin_check;
alter table public.document_reviews
  drop constraint if exists document_reviews_claimed_identifier_check;
alter table public.document_reviews
  add constraint document_reviews_claimed_identifier_check
  check (claimed_vin ~ '^[A-Z0-9-]{6,20}$');

create index if not exists idx_vehicle_listings_public_type
  on public.vehicle_listings (vehicle_type, status, published_at desc);

select 'vehicle categories migration ready' as result;
