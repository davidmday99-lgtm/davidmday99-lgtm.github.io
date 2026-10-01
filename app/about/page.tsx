import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Why OwnerOnly" title="Cars from people, not lots." intro="When every dollar matters, private owners and buyers deserve a place designed around direct, transparent conversations—not dealer inventory." sections={[
    { title: 'A marketplace for owners', body: 'Dealer, broker, and reseller listings are prohibited. Sellers attest that they own the vehicle and are not acting as a dealer or vehicle broker.' },
    { title: 'Open and straightforward', body: 'Posting is free, and sellers do not need to scan an ID or upload ownership paperwork. Buyers remain responsible for independent checks before a sale.' },
    { title: 'Privacy by design', body: 'Public profiles and listings use approximate locations. Contact details, legal names, and addresses stay off public pages.' },
    { title: 'Human moderation', body: 'Users can report suspicious or commercial activity. Administrators review concerns and may remove listings or suspend accounts that break the private-owner rules.' },
  ]} />;
}
