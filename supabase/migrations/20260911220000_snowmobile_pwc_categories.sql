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
      'trailer',
      'snowmobile',
      'personal_watercraft'
    )
  );

select 'snowmobile and personal watercraft categories ready' as result;
