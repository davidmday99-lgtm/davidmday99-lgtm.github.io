export type ReserveStatus = 'met' | 'not-met' | 'none';

export type DemoPrivateAuction = {
  slug: string;
  year: number;
  name: string;
  image: string;
  mileage: number;
  location: string;
  currentBid: number;
  bidCount: number;
  minimumIncrement: number;
  timeLeft: string;
  endLabel: string;
  reserveStatus: ReserveStatus;
  bodyStyle: string;
  transmission: string;
  drivetrain: string;
  titleStatus: string;
};

export const demoPrivateAuctions: DemoPrivateAuction[] = [
  {
    slug: '2021-touring-crossover-auction',
    year: 2021,
    name: 'Midsize Touring Crossover',
    image: '/owner-car-driveway.png',
    mileage: 38240,
    location: 'Near Madison, WI',
    currentBid: 21800,
    bidCount: 17,
    minimumIncrement: 250,
    timeLeft: '1 day 4 hours',
    endLabel: 'Ends Friday at 7:00 PM CT',
    reserveStatus: 'met',
    bodyStyle: 'SUV',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    titleStatus: 'Clean',
  },
  {
    slug: '2018-city-hatchback-auction',
    year: 2018,
    name: 'City Five-Door Hatchback',
    image: '/demo-hatchback.png',
    mileage: 68410,
    location: 'Near Milwaukee, WI',
    currentBid: 8600,
    bidCount: 9,
    minimumIncrement: 200,
    timeLeft: '2 days 6 hours',
    endLabel: 'Ends Saturday at 6:30 PM CT',
    reserveStatus: 'not-met',
    bodyStyle: 'Hatchback',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    titleStatus: 'Clean',
  },
  {
    slug: '2019-everyday-pickup-auction',
    year: 2019,
    name: 'Crew Cab Everyday Pickup',
    image: '/demo-pickup.png',
    mileage: 59220,
    location: 'Near Rockford, IL',
    currentBid: 18500,
    bidCount: 23,
    minimumIncrement: 250,
    timeLeft: '4 days 2 hours',
    endLabel: 'Ends Monday at 8:00 PM CT',
    reserveStatus: 'none',
    bodyStyle: 'Pickup',
    transmission: 'Automatic',
    drivetrain: '4WD',
    titleStatus: 'Clean',
  },
];

export const reserveLabel = (status: ReserveStatus) => {
  if (status === 'met') return 'Reserve met';
  if (status === 'not-met') return 'Reserve not met';
  return 'No reserve';
};

export const nextMinimumBid = (currentBid: number, minimumIncrement: number) =>
  currentBid + minimumIncrement;
