import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Simple seller fees" title="No dealer markup. No surprise add-ons." intro="The MVP fee model is intentionally straightforward. Final pricing remains a business decision before launch." sections={[
    { eyebrow: 'Browsing', title: '$0 to shop', body: 'Anyone can browse public inventory. Buyers never pay OwnerOnly Cars to view a listing.' },
    { eyebrow: 'Listing', title: 'One clear seller fee', body: 'Proposed MVP model: a single flat publication fee shown before checkout, with no commission on the sale price. Amount pending owner approval.' },
    { eyebrow: 'Verification', title: 'Included in the flow', body: 'Identity and ownership review costs should be incorporated into the disclosed seller fee rather than presented as surprise add-ons.' },
    { eyebrow: 'Not included', title: 'No transaction services', body: 'The initial MVP does not provide payment processing, escrow, financing, shipping, inspections, title transfer, registration, or tax services.' },
  ]} />;
}
