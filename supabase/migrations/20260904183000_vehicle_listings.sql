insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-photos',
  'vehicle-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.vehicle_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_id uuid not null unique references public.document_reviews(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  vin text not null check (vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  year integer not null check (year between 1900 and 2100),
  make text not null check (char_length(make) between 1 and 80),
  model text not null check (char_length(model) between 1 and 80),
  trim text,
  price integer not null check (price between 0 and 10000000),
  mileage integer not null check (mileage between 0 and 2000000),
  location_public text not null check (char_length(location_public) between 2 and 120),
  body_style text not null check (char_length(body_style) between 1 and 60),
  transmission text not null check (char_length(transmission) between 1 and 60),
  fuel_type text not null check (char_length(fuel_type) between 1 and 60),
  drivetrain text not null check (char_length(drivetrain) between 1 and 60),
  title_status text not null check (char_length(title_status) between 1 and 60),
  lien_status text not null check (char_length(lien_status) between 1 and 60),
  vehicle_condition text not null check (char_length(vehicle_condition) between 1 and 60),
  description text not null check (char_length(description) between 10 and 4000),
  carfax_url text,
  condition_answers jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  photo_urls jsonb not null check (jsonb_typeof(photo_urls) = 'array' and jsonb_array_length(photo_urls) between 1 and 20),
  status text not null default 'pending_review' check (status in ('pending_review', 'published', 'rejected', 'removed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicle_listings_public
  on public.vehicle_listings (status, published_at desc);
create index if not exists idx_vehicle_listings_owner
  on public.vehicle_listings (user_id, created_at desc);

alter table public.vehicle_listings enable row level security;
revoke all on public.vehicle_listings from anon, authenticated;
grant select on public.vehicle_listings to anon, authenticated;

drop policy if exists vehicle_listings_public_or_owner_read on public.vehicle_listings;
create policy vehicle_listings_public_or_owner_read
on public.vehicle_listings
for select
to anon, authenticated
using (status = 'published' or user_id = auth.uid());

create or replace function public.touch_vehicle_listing_updated_at()
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

drop trigger if exists vehicle_listings_touch_updated_at on public.vehicle_listings;
create trigger vehicle_listings_touch_updated_at
before update on public.vehicle_listings
for each row execute function public.touch_vehicle_listing_updated_at();

select 'vehicle_listings migration ready' as result;
