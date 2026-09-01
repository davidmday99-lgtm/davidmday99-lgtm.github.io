import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Why OwnerOnly" title="Cars from people, not lots." intro="When every dollar matters, private owners and buyers deserve a place designed around direct, transparent conversations—not dealer inventory." sections={[
    { title: 'A marketplace for owners', body: 'Dealer, broker, and reseller listings are prohibited. Sellers attest that they own the vehicle and are not acting as a dealer or vehicle broker.' },
    { title: 'Trust through clarity', body: 'We separate identity, ownership, and vehicle-history checks because each establishes something different. Badges never promise that a transaction is risk-free.' },
    { title: 'Privacy by design', body: 'Public profiles and listings use approximate locations. Contact details, legal names, addresses, and private documents stay off public pages.' },
    { title: 'Human judgment stays central', body: 'Automated risk signals can send activity to review, but a shared IP address or automated score never creates an automatic ban on its own.' },
  ]} />;
}
