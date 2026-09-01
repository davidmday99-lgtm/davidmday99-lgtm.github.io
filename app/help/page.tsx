import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Help & FAQ" title="Questions before you get rolling?" intro="Quick answers about eligibility, verification, listings, contact, privacy, and safety." sections={[
    { title: 'Can a dealer list here?', body: 'No. OwnerOnly Cars is for private vehicle owners. Dealer, broker, reseller, and consignment inventory is prohibited.' },
    { title: 'Does identity verification prove ownership?', body: 'No. Identity verification establishes that a person likely matches the submitted ID. Ownership documents are reviewed separately.' },
    { title: 'Can I browse without an account?', body: 'Yes. You need a verified account before publishing a listing or contacting another user.' },
    { title: 'Will my address be public?', body: 'No. Public listings display only an approximate location. Exact home addresses must not appear in listing descriptions or photos.' },
    { title: 'Does OwnerOnly handle payment?', body: 'No. The initial MVP does not offer payments, escrow, financing, title transfer, or shipping.' },
    { title: 'How do I report a concern?', body: 'Use the Report listing or Report user control. You can also block a user to prevent additional messages while moderators review the report.' },
  ]} />;
}
