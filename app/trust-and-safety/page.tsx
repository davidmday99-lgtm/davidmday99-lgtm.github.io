import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Trust & safety" title="Open access, clear rules, safer habits." intro="Owner Only Cars does not verify user identity or ownership paperwork. Sellers attest that they are private owners, while buyers independently inspect the vehicle, seller, documents, and transaction." sections={[
    { eyebrow: 'Private-owner rule', title: 'No dealer inventory', body: 'Dealer, broker, reseller, and consignment listings are prohibited. Report suspicious commercial activity so an administrator can review and remove it.' },
    { eyebrow: 'Seller attestation', title: 'Owner-provided information', body: 'Sellers attest that they own the vehicle and that their listing is accurate. This statement is not independent proof, so buyers must compare the vehicle identifier with the original title or registration.' },
    { eyebrow: 'Vehicle history', title: 'Independent reports', body: 'A seller may share a third-party history link. Always confirm the report identifier matches the vehicle and remember that no report contains every repair or event.' },
    { eyebrow: 'Before meeting', title: 'Keep conversations on-platform', body: 'Be cautious of urgent requests, suspicious links, gift cards, wires, crypto, overpayments, shipping stories, or pressure to leave the marketplace.' },
    { eyebrow: 'At the vehicle', title: 'Inspect and compare', body: 'Meet in public during daylight, bring another person, verify the VIN in multiple locations, compare it with the title, and arrange an independent inspection.' },
    { eyebrow: 'After a concern', title: 'Report and block', body: 'Use listing and user reports, block unwanted contact, and preserve messages. OwnerOnly sends suspicious cases to human review and supports appeals.' },
  ]} />;
}
