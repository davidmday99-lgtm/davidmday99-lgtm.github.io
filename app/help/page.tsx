import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Help & FAQ" title="Questions before you get rolling?" intro="Quick answers about eligibility, listings, contact, privacy, and safety." sections={[
    { title: 'Can a dealer list here?', body: 'No. OwnerOnly Cars is for private vehicle owners. Dealer, broker, reseller, and consignment inventory is prohibited.' },
    { title: 'Do I need to upload an ID or title?', body: 'No. Owner Only Cars does not require identity verification or an ownership-document upload. Sellers attest that they own the vehicle and are private owners.' },
    { title: 'Can I browse without an account?', body: 'Yes. Create a free account only when you want to publish, save favorites, post a wanted ad, or send a message.' },
    { title: 'Will my address be public?', body: 'No. Public listings display only an approximate location. Exact home addresses must not appear in listing descriptions or photos.' },
    { title: 'Does OwnerOnly handle payment?', body: 'No. The initial MVP does not offer payments, escrow, financing, title transfer, or shipping.' },
    { title: 'How do I report a concern?', body: 'Use the Report listing or Report user control. You can also block a user to prevent additional messages while moderators review the report.' },
  ]} />;
}
