-- Edge Functions use the service role to create listings and to publish or
-- remove them after a moderator decision. Keep browser clients read-only.
grant select, insert, update, delete
on table public.vehicle_listings
to service_role;

select 'vehicle listing service-role permissions ready' as result;
