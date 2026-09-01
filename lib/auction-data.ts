export type PublicAccessStatus = 'confirmed' | 'restricted' | 'unknown';
export type LicenseRequirement = 'none' | 'dealer' | 'salvage' | 'dismantler' | 'unknown';

export type AuctionSource = {
  id: string;
  name: string;
  agency: string;
  officialUrl: string;
  termsUrl: string;
  category: string;
  statesServed: string[];
  publicAccess: PublicAccessStatus;
  publicAccessNote: string;
  licenseRequirement: LicenseRequirement;
  format: 'online' | 'in-person' | 'hybrid';
  verificationStatus: 'verified' | 'review-needed';
  lastChecked: string;
  nextReview: string;
};

export type StateAuctionGuide = {
  name: string;
  code: string;
  slug: string;
  region: 'Northeast' | 'Midwest' | 'South' | 'West';
  officialDirectoryUrl: string;
};

const nationwide = ['ALL'];

export const federalAuctionSources: AuctionSource[] = [
  {
    id: 'usagov-vehicle-auctions',
    name: 'USAGov Government Vehicle Auctions',
    agency: 'U.S. General Services Administration / USAGov',
    officialUrl: 'https://www.usa.gov/car-auctions',
    termsUrl: 'https://www.usa.gov/car-auctions',
    category: 'Official federal directory',
    statesServed: nationwide,
    publicAccess: 'confirmed',
    publicAccessNote: 'Official directory linking to federal auction operators. Registration and eligibility vary by operator.',
    licenseRequirement: 'unknown',
    format: 'hybrid',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
  {
    id: 'gsa-fleet',
    name: 'GSA Fleet Vehicle Sales',
    agency: 'U.S. General Services Administration',
    officialUrl: 'https://marketplace.gsafleet.gov/',
    termsUrl: 'https://marketplace.gsafleet.gov/',
    category: 'Federal fleet surplus',
    statesServed: nationwide,
    publicAccess: 'confirmed',
    publicAccessNote: 'GSA identifies its pre-owned vehicle auctions as open to public auction bidders. Registration is required.',
    licenseRequirement: 'none',
    format: 'hybrid',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
  {
    id: 'gsa-auctions',
    name: 'GSA Auctions',
    agency: 'U.S. General Services Administration',
    officialUrl: 'https://gsaauctions.gov/',
    termsUrl: 'https://gsaauctions.gov/html/navigate/termsandconditions.html',
    category: 'Federal excess property',
    statesServed: nationwide,
    publicAccess: 'confirmed',
    publicAccessNote: 'The public may buy government personal property; confirm each lot’s restrictions and terms.',
    licenseRequirement: 'unknown',
    format: 'online',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
  {
    id: 'us-marshals',
    name: 'U.S. Marshals Service Asset Forfeiture',
    agency: 'U.S. Marshals Service / Department of Justice',
    officialUrl: 'https://www.usmarshals.gov/what-we-do/asset-forfeiture',
    termsUrl: 'https://www.usmarshals.gov/what-we-do/asset-forfeiture',
    category: 'Seized and forfeited property',
    statesServed: nationwide,
    publicAccess: 'confirmed',
    publicAccessNote: 'USMS identifies online and live personal-property auctions as open to the public. Contractor terms vary.',
    licenseRequirement: 'unknown',
    format: 'hybrid',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
  {
    id: 'treasury-auctions',
    name: 'U.S. Treasury Auctions',
    agency: 'U.S. Department of the Treasury',
    officialUrl: 'https://home.treasury.gov/services/treasury-auctions',
    termsUrl: 'https://www.treasury.gov/auctions/treasury/gp/termsandconditions.pdf',
    category: 'Forfeited and tax-seized property',
    statesServed: nationwide,
    publicAccess: 'confirmed',
    publicAccessNote: 'General property auctions may be public, while specific salvage lots can require licensing. Check the lot terms.',
    licenseRequirement: 'unknown',
    format: 'hybrid',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
  {
    id: 'irs-auctions',
    name: 'IRS Property Auctions',
    agency: 'Internal Revenue Service; operator linked by U.S. Treasury',
    officialUrl: 'https://www.irsauctions.gov/',
    termsUrl: 'https://www.irsauctions.gov/',
    category: 'Tax-seized property',
    statesServed: nationwide,
    publicAccess: 'unknown',
    publicAccessNote: 'Vehicles may appear among other merchandise. Eligibility, schedule, and terms must be confirmed for each event.',
    licenseRequirement: 'unknown',
    format: 'hybrid',
    verificationStatus: 'verified',
    lastChecked: '2026-09-01',
    nextReview: '2026-10-01',
  },
];

const rawStates: Array<[string, string, StateAuctionGuide['region']]> = [
  ['Alabama', 'AL', 'South'], ['Alaska', 'AK', 'West'], ['Arizona', 'AZ', 'West'], ['Arkansas', 'AR', 'South'],
  ['California', 'CA', 'West'], ['Colorado', 'CO', 'West'], ['Connecticut', 'CT', 'Northeast'], ['Delaware', 'DE', 'South'],
  ['District of Columbia', 'DC', 'South'], ['Florida', 'FL', 'South'], ['Georgia', 'GA', 'South'], ['Hawaii', 'HI', 'West'],
  ['Idaho', 'ID', 'West'], ['Illinois', 'IL', 'Midwest'], ['Indiana', 'IN', 'Midwest'], ['Iowa', 'IA', 'Midwest'],
  ['Kansas', 'KS', 'Midwest'], ['Kentucky', 'KY', 'South'], ['Louisiana', 'LA', 'South'], ['Maine', 'ME', 'Northeast'],
  ['Maryland', 'MD', 'South'], ['Massachusetts', 'MA', 'Northeast'], ['Michigan', 'MI', 'Midwest'], ['Minnesota', 'MN', 'Midwest'],
  ['Mississippi', 'MS', 'South'], ['Missouri', 'MO', 'Midwest'], ['Montana', 'MT', 'West'], ['Nebraska', 'NE', 'Midwest'],
  ['Nevada', 'NV', 'West'], ['New Hampshire', 'NH', 'Northeast'], ['New Jersey', 'NJ', 'Northeast'], ['New Mexico', 'NM', 'West'],
  ['New York', 'NY', 'Northeast'], ['North Carolina', 'NC', 'South'], ['North Dakota', 'ND', 'Midwest'], ['Ohio', 'OH', 'Midwest'],
  ['Oklahoma', 'OK', 'South'], ['Oregon', 'OR', 'West'], ['Pennsylvania', 'PA', 'Northeast'], ['Rhode Island', 'RI', 'Northeast'],
  ['South Carolina', 'SC', 'South'], ['South Dakota', 'SD', 'Midwest'], ['Tennessee', 'TN', 'South'], ['Texas', 'TX', 'South'],
  ['Utah', 'UT', 'West'], ['Vermont', 'VT', 'Northeast'], ['Virginia', 'VA', 'South'], ['Washington', 'WA', 'West'],
  ['West Virginia', 'WV', 'South'], ['Wisconsin', 'WI', 'Midwest'], ['Wyoming', 'WY', 'West'],
];

export const stateAuctionGuides: StateAuctionGuide[] = rawStates.map(([name, code, region]) => ({
  name,
  code,
  region,
  slug: name.toLowerCase().replaceAll(' ', '-'),
  officialDirectoryUrl: `https://www.usa.gov/states/${name.toLowerCase().replaceAll(' ', '-')}`,
}));

export const auctionCategories = [
  'State surplus-property agencies',
  'City, county and municipal surplus',
  'Police, sheriff and seized vehicles',
  'Impound and abandoned vehicles',
  'Federal vehicles located in the state',
];

export function findStateGuide(slug: string) {
  return stateAuctionGuides.find((state) => state.slug === slug || state.code.toLowerCase() === slug.toLowerCase());
}
