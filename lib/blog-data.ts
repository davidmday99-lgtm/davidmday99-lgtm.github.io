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
    slug: 'private-owner-car-buying-checklist',
    title: 'Buying a car from a private owner: the no-rush checklist',
    excerpt:
      'A practical step-by-step guide to checking the seller, VIN, title, vehicle history, inspection, payment plan, and paperwork before you buy.',
    category: 'Buying guide',
    publishedLabel: 'September 1, 2026',
    publishedIso: '2026-09-01',
    readTime: '8 min read',
    image: '/owner-car-driveway.png',
    imageAlt: 'Private-owner vehicle parked in a residential driveway',
    intro:
      'A private sale can be a straightforward way to buy a vehicle, but it puts more responsibility on the buyer. Slow the process down, verify each part separately, and be willing to walk away when the car, seller, documents, or payment instructions do not line up.',
    sections: [
      {
        heading: '1. Set the real budget first.',
        paragraphs: [
          'Decide what you can spend before you start negotiating. Include sales tax, title and registration charges, insurance, an independent inspection, immediate maintenance, and a repair cushion—not only the advertised price.',
          'If you need financing, confirm that the lender handles private-party purchases. Ask what vehicle, seller, title, lien, insurance, and payment documents it requires before agreeing to a deal.',
        ],
      },
      {
        heading: '2. Keep the first conversation on-platform.',
        paragraphs: [
          'Use marketplace messaging while you ask basic questions. Avoid publishing your phone number, personal email, or home address. Moving off-platform too early can remove useful reporting, blocking, and moderation tools.',
        ],
        bullets: [
          'Ask why the vehicle is being sold and how long the seller has owned it.',
          'Ask about title status, liens, known damage, warning lights, mechanical problems, and recent repairs.',
          'Ask whether the seller will allow an independent inspection.',
          'Do not send a deposit merely because someone says other buyers are waiting.',
        ],
      },
      {
        heading: '3. Check the VIN in more than one place.',
        paragraphs: [
          'Compare the 17-character VIN shown in the listing with the VIN at the lower windshield, the driver-door label, and the ownership document. A mismatch, altered plate, unreadable label, or explanation that keeps changing is a reason to stop.',
          'Use the official NHTSA decoder to confirm basic vehicle information. A decoder helps identify the vehicle; it does not prove ownership, title status, mileage, or mechanical condition.',
        ],
      },
      {
        heading: '4. Read history reports for what they actually cover.',
        paragraphs: [
          'An NMVTIS report can provide current and prior state-title information, title brands, the latest reported odometer data, and certain junk, salvage, total-loss, and theft information. It is an important check, but it is not a complete repair or accident history.',
          'Also run the VIN through NHTSA’s recall lookup. The result may identify unrepaired safety recalls for participating manufacturers, but NHTSA explains that the search has limits and may not show every campaign or completed repair.',
        ],
      },
      {
        heading: '5. Inspect the vehicle in daylight.',
        bullets: [
          'Meet in a busy public place and bring another adult when practical.',
          'Confirm the seller, vehicle, plate, VIN, mileage, and documents match the listing.',
          'Check tires, lights, glass, fluids, visible leaks, body gaps, rust, warning lights, accessories, and both sets of keys.',
          'Test the vehicle on an agreed route that includes normal streets and safe braking and turning conditions.',
          'Never let a short test drive replace a professional inspection.',
        ],
      },
      {
        heading: '6. Pay for an independent inspection.',
        paragraphs: [
          'Choose the mechanic yourself and request a written report that identifies the vehicle and estimated repair costs. The FTC recommends an independent mechanical inspection even when a used vehicle has already been described as inspected or certified.',
          'If the seller will not permit a reasonable inspection or mobile inspection, treat that refusal as useful information and consider another vehicle.',
        ],
      },
      {
        heading: '7. Verify the title and lien before payment.',
        paragraphs: [
          'Compare the seller’s legal name and the VIN with the title or current registration. Review the title for brands, alterations, missing signatures, ownership conflicts, and a recorded lien. A name mismatch may have a legitimate explanation, but it should be resolved with the relevant motor-vehicle agency—not waved away.',
          'Title-transfer, tax, inspection, notarization, plate, and bill-of-sale rules vary by state. Check the official motor-vehicle agency for the state where the transaction will occur. Do not rely on a generic online checklist for state-specific requirements.',
        ],
      },
      {
        heading: '8. Agree on a payment and handoff plan.',
        paragraphs: [
          'Before anyone exchanges money or keys, agree on where the payment will be verified, how an existing lien will be released, when the title will be signed, and when possession changes. A bank, credit union, or motor-vehicle office may be a safer setting when the transaction requires lender or title coordination.',
          'Do not pay with gift cards or send money because someone claims you must act immediately. Sellers should reject overpayment checks and requests to send the extra money elsewhere; the FTC warns that the deposited funds can appear available before the fake check is discovered.',
        ],
      },
      {
        heading: '9. Keep copies and complete the state process.',
        bullets: [
          'Use a written bill of sale when required or helpful, and give both parties a copy.',
          'Record the date, price, VIN, mileage, vehicle description, and the parties’ signatures as state law allows or requires.',
          'Complete title, registration, tax, plate, insurance, lien, and seller-notice steps through the appropriate official agencies.',
          'Keep the listing, inspection report, history report, signed documents, and payment records.',
        ],
      },
      {
        heading: '10. Know the walk-away signs.',
        bullets: [
          'The seller will not meet in person or allow an independent inspection.',
          'The VIN, vehicle, seller, title, or listing details do not match.',
          'The price is paired with urgency, secrecy, or an unusual shipping story.',
          'Payment must be made by gift card, cryptocurrency, unexpected wire, or an overpayment arrangement.',
          'You are told to ignore a title brand, open lien, ownership mismatch, or missing document.',
        ],
        paragraphs: [
          'A good deal should survive careful questions. No badge, report, platform, or payment method replaces your own inspection and independent verification.',
        ],
      },
      {
        heading: 'Official resources.',
        links: [
          {
            label: 'NHTSA: Decode a VIN',
            href: 'https://www.nhtsa.gov/vin-decoder',
          },
          {
            label: 'NHTSA: Check for safety recalls',
            href: 'https://www.nhtsa.gov/recalls',
          },
          {
            label: 'NMVTIS: Understand a vehicle-history report',
            href: 'https://vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr',
          },
          {
            label: 'FTC: What to know when buying a used car online',
            href: 'https://consumer.ftc.gov/consumer-alerts/2024/07/what-know-when-buying-used-car-online',
          },
          {
            label: 'FTC: Avoid phony online car sales',
            href: 'https://consumer.ftc.gov/consumer-alerts/2019/06/put-brakes-phony-online-car-sales',
          },
          {
            label: 'FTC: Fake-check scams targeting online car sellers',
            href: 'https://consumer.ftc.gov/consumer-alerts/2025/02/fake-check-scam-targets-online-car-sellers',
          },
        ],
      },
    ],
  },
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
