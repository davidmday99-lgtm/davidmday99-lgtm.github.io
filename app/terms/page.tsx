import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage cta={false} eyebrow="Legal placeholder" title="Terms of use" intro="This placeholder must be replaced with attorney-reviewed terms before public launch." sections={[
    { title: 'Marketplace role', body: 'OwnerOnly Cars provides a venue for private owners and buyers to find and communicate with one another. It is not a dealer, broker, escrow provider, lender, transporter, inspector, or title-transfer service.' },
    { title: 'Eligibility and verification', body: 'Publishing and messaging require required verification. Verification badges establish limited facts and do not guarantee identity, ownership, vehicle condition, legality, or transaction safety.' },
    { title: 'Prohibited conduct', body: 'Dealer inventory, misrepresentation, fraud, harassment, unsafe content, duplicate inventory, evasion of safeguards, and unlawful activity are prohibited.' },
    { title: 'Professional review required', body: 'State-by-state dealer licensing, sale limits, disclosures, lemon laws, title requirements, taxes, privacy obligations, and marketplace liability require legal review.' },
  ]} />;
}
