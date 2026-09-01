export type BlogSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedLabel: string;
  publishedIso: string;
  readTime: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-we-are-building-owneronly-cars',
    title: 'Why we’re building OwnerOnly Cars',
    excerpt:
      'A marketplace for everyday Americans who want to buy and sell directly—without dealer inventory or confusing verification claims.',
    category: 'Our mission',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '4 min read',
    image: '/owneronly-mustang-hero-navy.png',
    imageAlt: 'Classic dark blue car on the OwnerOnly Cars navy background',
    intro:
      'Buying a car is already a major decision. It should not be harder to tell whether you are dealing with the actual owner, what has been checked, and what still needs your own inspection.',
    sections: [
      {
        heading: 'Cars from people, not lots.',
        paragraphs: [
          'OwnerOnly Cars is being built for private owners and private buyers. Dealer, broker, reseller, and consignment inventory do not belong in the owner marketplace.',
          'The goal is simple: help neighbors find one another, understand the available trust signals, and keep more control over the conversation and the deal.',
        ],
      },
      {
        heading: 'Verification should be specific.',
        paragraphs: [
          'A verified identity does not prove vehicle ownership. Ownership documents do not prove mechanical condition. A vehicle-history report may not contain every repair or event.',
          'Instead of combining those checks into one vague promise, OwnerOnly Cars explains what each badge establishes—and what it does not.',
        ],
      },
      {
        heading: 'A marketplace built in public.',
        paragraphs: [
          'The listings and auctions currently shown on the site are fictional demonstrations. We are sharing the experience early while the secure account, document-review, messaging, moderation, and bidding systems are built and tested.',
          'That honesty matters. We will not call the marketplace scam-proof, and we will not present a preview as a finished transaction platform.',
        ],
      },
    ],
  },
  {
    slug: 'what-owner-verification-really-means',
    title: 'What owner verification really means',
    excerpt:
      'Identity, ownership documents, and vehicle history answer different questions. Here is how to read the badges.',
    category: 'Trust & safety',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '5 min read',
    image: '/owner-car-driveway.png',
    imageAlt: 'Fictional owner vehicle parked in a residential driveway',
    intro:
      'Verification can reduce uncertainty, but no badge can guarantee a safe transaction or tell you everything about a vehicle.',
    sections: [
      {
        heading: 'Identity verification',
        paragraphs: [
          'A government-document and matching-selfie check helps establish that the account holder likely matches the submitted ID. It does not establish that the person owns the vehicle.',
        ],
      },
      {
        heading: 'Ownership review',
        paragraphs: [
          'A separate title or registration review compares the verified legal name and VIN with the submitted vehicle document. Exceptions should go to human review rather than being silently approved.',
        ],
      },
      {
        heading: 'Vehicle history',
        paragraphs: [
          'A history report can surface title brands, odometer information, salvage or total-loss information, and certain theft data. It may not include every repair, accident, inspection, or title event.',
        ],
      },
      {
        heading: 'What buyers still need to do',
        bullets: [
          'Inspect the vehicle and arrange an independent mechanical inspection.',
          'Compare the VIN on the dashboard, door label, documents, and history report.',
          'Confirm the seller’s title and lien status before exchanging money.',
          'Meet safely and avoid gift cards, unexpected wires, or pressure to act immediately.',
        ],
      },
    ],
  },
  {
    slug: 'private-party-test-drive-safety-checklist',
    title: 'A safer private-party test-drive checklist',
    excerpt:
      'Simple preparation for buyers and sellers before meeting a stranger, sharing a vehicle, or discussing payment.',
    category: 'Buying guide',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '6 min read',
    image: '/demo-pickup.png',
    imageAlt: 'Fictional private-owner pickup truck demonstration listing',
    intro:
      'A test drive should help evaluate the vehicle—not create unnecessary personal or payment risk for either person.',
    sections: [
      {
        heading: 'Before the meeting',
        bullets: [
          'Keep early communication on the marketplace.',
          'Choose a busy public location during daylight hours.',
          'Tell someone where you are going and when you expect to return.',
          'Bring another adult when practical.',
        ],
      },
      {
        heading: 'For sellers',
        bullets: [
          'Do not publish your exact home address, phone number, or email address.',
          'Confirm the driver has a valid license and discuss the route before handing over keys.',
          'Remove personal documents, garage remotes, and valuables from the vehicle.',
          'Do not accept a screenshot as proof of payment.',
        ],
      },
      {
        heading: 'For buyers',
        bullets: [
          'Check the VIN in multiple locations and compare it with the title or registration.',
          'Ask for service records, known defects, title status, and lien information.',
          'Do not let urgency replace an independent inspection.',
          'Leave if the vehicle, documents, seller identity, or meeting location does not match the listing.',
        ],
      },
      {
        heading: 'After the drive',
        paragraphs: [
          'Take time to review the vehicle, documents, inspection findings, and payment plan. A legitimate private seller should understand why a careful buyer needs time to verify a major purchase.',
        ],
      },
    ],
  },
];

export const findBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
