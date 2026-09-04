import type { DemoListing } from '@/lib/demo-data';

export type VehicleListingRow = {
  id: string;
  user_id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  mileage: number;
  location_public: string;
  body_style: string;
  transmission: string;
  fuel_type: string;
  drivetrain: string;
  title_status: string;
  lien_status: string;
  vehicle_condition: string;
  description: string;
  carfax_url: string | null;
  condition_answers: Record<string, string>;
  features: string[];
  photo_urls: string[];
  status: 'pending_review' | 'published' | 'rejected' | 'removed';
  published_at: string | null;
  created_at: string;
};

export function toListingCard(row: VehicleListingRow): DemoListing {
  return {
    slug: row.slug,
    year: row.year,
    name: `${row.make} ${row.model}${row.trim ? ` ${row.trim}` : ''}`,
    price: row.price,
    mileage: row.mileage,
    location: `Near ${row.location_public}`,
    distance: 0,
    image: row.photo_urls[0] ?? '/owner-car-driveway.png',
    bodyStyle: row.body_style,
    transmission: row.transmission,
    fuel: row.fuel_type,
    drivetrain: row.drivetrain,
    titleStatus: row.title_status,
    href: `/listing?slug=${encodeURIComponent(row.slug)}`,
    isDemo: false,
  };
}
