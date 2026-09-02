import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="Trust & safety" title="Useful checks, honest limits, safer habits." intro="Verification can reduce risk, but it cannot guarantee a safe transaction. OwnerOnly explains what was checked and what still requires your judgment." sections={[
    { eyebrow: 'Identity', title: 'Government-ID check', body: 'Stripe Identity hosts the document-verification flow. OwnerOnly stores only the provider session ID, result, timestamps, failure category, and minimum approved fields—not raw ID images.' },
    { eyebrow: 'Ownership', title: 'Title or registration review', body: 'A private ownership document is reviewed to compare the seller’s verified legal name and VIN. The document is retained only for a short, configurable period.' },
    { eyebrow: 'Vehicle history', title: 'NMVTIS-backed report', body: 'When a provider is connected, reports may include title brands, odometer data, salvage or total-loss information, and certain theft data. They do not provide a complete repair history.' },
    { eyebrow: 'Before meeting', title: 'Keep conversations on-platform', body: 'Be cautious of urgent requests, suspicious links, gift cards, wires, crypto, overpayments, shipping stories, or pressure to leave the marketplace.' },
    { eyebrow: 'At the vehicle', title: 'Inspect and compare', body: 'Meet in public during daylight, bring another person, verify the VIN in multiple locations, compare it with the title, and arrange an independent inspection.' },
    { eyebrow: 'After a concern', title: 'Report and block', body: 'Use listing and user reports, block unwanted contact, and preserve messages. OwnerOnly sends suspicious cases to human review and supports appeals.' },
  ]} />;
}
