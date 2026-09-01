export type BlogSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: {
    label: string;
    href: string;
  }[];
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
    title: 'Why we’re building Owner Only Cars',
    excerpt:
      'A marketplace for everyday Americans who want to buy and sell directly—without dealer inventory or confusing verification claims.',
    category: 'Our mission',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '4 min read',
    image: '/owneronly-mustang-hero-navy.png',
    imageAlt: 'Classic dark blue car on the Owner Only Cars navy background',
    intro:
      'Buying a car is already a major decision. It should not be harder to tell whether you are dealing with the actual owner, what has been checked, and what still needs your own inspection.',
    sections: [
      {
        heading: 'Cars from people, not lots.',
        paragraphs: [
          'Owner Only Cars is being built for private owners and private buyers. Dealer, broker, reseller, and consignment inventory do not belong in the owner marketplace.',
          'The goal is simple: help neighbors find one another, understand the available trust signals, and keep more control over the conversation and the deal.',
        ],
      },
      {
        heading: 'Verification should be specific.',
        paragraphs: [
          'A verified identity does not prove vehicle ownership. Ownership documents do not prove mechanical condition. A vehicle-history report may not contain every repair or event.',
          'Instead of combining those checks into one vague promise, Owner Only Cars explains what each badge establishes—and what it does not.',
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
  {
    slug: 'credit-union-auto-loans-and-financing',
    title: 'Are credit unions usually the best place to finance a car?',
    excerpt:
      'Credit unions can offer competitive auto-loan terms, but the best offer depends on your credit, the vehicle, the loan length, fees, and the lender.',
    category: 'Financing guide',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '7 min read',
    image: '/demo-hatchback.png',
    imageAlt: 'Fictional private-owner hatchback demonstration listing',
    intro:
      'A credit union is a smart place to start shopping for an auto loan—but it is not automatically the cheapest choice. Get a firm offer, compare it with other lenders, and judge the full cost instead of looking only at the monthly payment.',
    sections: [
      {
        heading: 'Why start with a credit union?',
        paragraphs: [
          'Credit unions are member-owned financial institutions, and many offer auto loans for new and used vehicles. Their rates and fees can be competitive, which makes them a useful first stop when gathering quotes.',
          'Still, membership does not guarantee the lowest rate. Your credit history, income, loan amount, vehicle age, mileage, down payment, and requested loan term can all affect the offer. Banks and other lenders may beat it, so compare actual written terms.',
        ],
      },
      {
        heading: 'Get preapproved before choosing the car.',
        paragraphs: [
          'A preapproval tells you the amount, annual percentage rate, and loan term a lender may offer before you commit to a vehicle. It creates a useful baseline and helps keep the vehicle price separate from the financing conversation.',
          'Ask whether the preapproval works for a private-party purchase. Some lenders have different requirements for a vehicle bought from its owner instead of a dealership.',
        ],
      },
      {
        heading: 'Compare the same numbers.',
        paragraphs: [
          'The Consumer Financial Protection Bureau recommends comparing more than the monthly payment. Put each offer side by side and review:',
        ],
        bullets: [
          'The amount financed after the down payment and any trade-in.',
          'The annual percentage rate (APR), which includes the interest rate and certain loan fees.',
          'The loan term in months.',
          'The monthly payment and number of payments.',
          'The total of payments and total interest over the life of the loan.',
          'Origination fees, late fees, prepayment terms, and optional products.',
        ],
      },
      {
        heading: 'A lower payment can cost more.',
        paragraphs: [
          'Stretching a loan over 72 or 84 months may reduce the monthly payment, but it usually increases the total interest paid. A long term can also leave you owing more than the vehicle is worth for a longer period.',
          'Choose a payment that fits your budget, but check the total cost before deciding that the lowest monthly number is the best deal.',
        ],
      },
      {
        heading: 'Ask these private-sale questions.',
        bullets: [
          'Does the lender finance private-party vehicle purchases?',
          'Are there limits on vehicle age, mileage, title status, or purchase price?',
          'What title, registration, insurance, inspection, and seller documents are required?',
          'How will an existing lien be paid off and released?',
          'Will the lender pay the seller directly, and when can the buyer safely take possession?',
        ],
        paragraphs: [
          'Do not send money based only on a screenshot, email, or payment promise. Confirm the lender’s process using a trusted phone number or official website, and independently verify the title, VIN, seller identity, and lien status.',
        ],
      },
      {
        heading: 'A practical shopping plan.',
        bullets: [
          'Check your credit reports and correct errors before applying.',
          'Start with a credit union you can join, then compare at least two other lenders.',
          'Request quotes for the same amount, down payment, and term.',
          'Read every disclosure before signing and question fees or add-ons you do not understand.',
          'Budget for insurance, taxes, registration, maintenance, and repairs—not only the loan payment.',
        ],
        paragraphs: [
          'Owner Only Cars does not arrange financing, recommend a particular lender, or receive compensation from the sources below. This guide is educational and should not replace advice based on your financial situation.',
        ],
      },
      {
        heading: 'Official resources.',
        links: [
          {
            label: 'CFPB: How to compare auto-loan offers',
            href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/',
          },
          {
            label: 'CFPB: What to know before shopping for an auto loan',
            href: 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-before-i-shop-for-auto-loan-at-a-bank-credit-union-dealership-or-other-lender-en-755/',
          },
          {
            label: 'MyCreditUnion.gov: Auto loans',
            href: 'https://mycreditunion.gov/manage-your-money/consumer-loans-credit-cards/auto-loans',
          },
          {
            label: 'FTC: Financing or leasing a car',
            href: 'https://consumer.ftc.gov/articles/financing-or-leasing-car',
          },
        ],
      },
    ],
  },
];

export const findBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
