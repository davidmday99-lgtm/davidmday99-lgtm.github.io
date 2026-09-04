create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ownership-documents',
  'ownership-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.document_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_reference text,
  claimed_vin text not null check (claimed_vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  document_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 10485760),
  status text not null default 'queued' check (status in ('queued', 'ai_reviewing', 'human_review', 'approved', 'rejected')),
  risk_level text not null default 'unknown' check (risk_level in ('unknown', 'low', 'medium', 'high')),
  ai_summary text,
  ai_flags jsonb not null default '[]'::jsonb,
  ai_result jsonb,
  ai_model text,
  ai_reviewed_at timestamptz,
  reviewer_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  retain_until timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists document_reviews_status_created_idx
  on public.document_reviews (status, created_at desc);
create index if not exists document_reviews_user_created_idx
  on public.document_reviews (user_id, created_at desc);
create index if not exists document_reviews_risk_idx
  on public.document_reviews (risk_level, created_at desc);

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  target_user_id uuid references auth.users(id) on delete set null,
  document_review_id uuid references public.document_reviews(id) on delete set null,
  action text not null check (action in ('document_approved', 'document_rejected', 'document_returned_to_review', 'user_blocked', 'user_unblocked')),
  reason text not null check (char_length(reason) between 3 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists moderation_actions_created_idx
  on public.moderation_actions (created_at desc);
create index if not exists moderation_actions_target_idx
  on public.moderation_actions (target_user_id, created_at desc);

alter table public.document_reviews enable row level security;
alter table public.moderation_actions enable row level security;

revoke all on public.document_reviews from anon, authenticated;
revoke all on public.moderation_actions from anon, authenticated;
revoke all on public.document_reviews from service_role;
revoke all on public.moderation_actions from service_role;

grant select, insert, update, delete on public.document_reviews to service_role;
grant select, insert, update, delete on public.moderation_actions to service_role;

create or replace function public.touch_document_review_updated_at()
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

drop trigger if exists document_reviews_touch_updated_at on public.document_reviews;
create trigger document_reviews_touch_updated_at
before update on public.document_reviews
for each row execute function public.touch_document_review_updated_at();
