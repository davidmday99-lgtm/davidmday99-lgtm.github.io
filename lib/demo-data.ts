export type DemoListing = {
  vehicleType?: string;
  slug: string;
  year: number;
  name: string;
  make?: string;
  model?: string;
  price: number;
  mileage: number;
  engineSize?: string;
  location: string;
  distance: number;
  image: string;
  bodyStyle: string;
  transmission: string;
  fuel: string;
  drivetrain: string;
  titleStatus: string;
  href?: string;
  isDemo?: boolean;
};

export const demoListings: DemoListing[] = [
  {
    vehicleType: 'car',
    slug: '2021-midsize-touring-crossover',
    year: 2021,
    name: 'Midsize Touring Crossover',
    price: 24800,
    mileage: 38240,
    engineSize: '2.5L',
    location: 'Near Madison, WI',
    distance: 12,
    image: '/owner-car-driveway.png',
    bodyStyle: 'SUV',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    drivetrain: 'AWD',
    titleStatus: 'Clean',
    isDemo: true,
  },
  {
    vehicleType: 'car',
    slug: '2018-city-hatchback',
    year: 2018,
    name: 'City Five-Door Hatchback',
    price: 11200,
    mileage: 68410,
    engineSize: '1.5L',
    location: 'Near Milwaukee, WI',
    distance: 47,
    image: '/demo-hatchback.png',
    bodyStyle: 'Hatchback',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    drivetrain: 'FWD',
    titleStatus: 'Clean',
    isDemo: true,
  },
  {
    vehicleType: 'car',
    slug: '2019-crew-cab-pickup',
    year: 2019,
    name: 'Crew Cab Everyday Pickup',
    price: 21900,
    mileage: 59220,
    engineSize: '3.5L',
    location: 'Near Rockford, IL',
    distance: 55,
    image: '/demo-pickup.png',
    bodyStyle: 'Pickup',
    transmission: 'Automatic',
    fuel: 'Gasoline',
    drivetrain: '4WD',
    titleStatus: 'Clean',
    isDemo: true,
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

export const formatMileage = (mileage: number) =>
  new Intl.NumberFormat('en-US').format(mileage);
