import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Simple seller fees" title="No dealer markup. No surprise add-ons." intro="Owner Only Cars is open to private owners, and posting a standard listing is free." sections={[
    { eyebrow: 'Browsing', title: '$0 to shop', body: 'Anyone can browse public inventory. Buyers never pay OwnerOnly Cars to view a listing.' },
    { eyebrow: 'Listing', title: '$0 to post', body: 'Private owners can create and publish a standard vehicle listing for free. No identity-verification or ownership-document fee is required.' },
    { eyebrow: 'Owner rule', title: 'Private sellers only', body: 'Dealer, broker, reseller, representative, and consignment inventory is prohibited and may be removed.' },
    { eyebrow: 'Not included', title: 'No transaction services', body: 'The initial MVP does not provide payment processing, escrow, financing, shipping, inspections, title transfer, registration, or tax services.' },
  ]} />;
}
