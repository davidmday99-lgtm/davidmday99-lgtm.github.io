import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage cta={false} eyebrow="Legal placeholder" title="Terms of use" intro="This placeholder must be replaced with attorney-reviewed terms before public launch." sections={[
    { title: 'Marketplace role', body: 'OwnerOnly Cars provides a venue for private owners and buyers to find and communicate with one another. It is not a dealer, broker, escrow provider, lender, transporter, inspector, or title-transfer service.' },
    { title: 'Eligibility and private-owner attestation', body: 'Publishing and messaging require a signed-in account. Sellers must own the listed vehicle and must not act as a dealer, broker, reseller, or representative. Owner Only Cars does not verify identity or ownership documents.' },
    { title: 'Prohibited conduct', body: 'Dealer inventory, misrepresentation, fraud, harassment, unsafe content, duplicate inventory, evasion of safeguards, and unlawful activity are prohibited.' },
    { title: 'Professional review required', body: 'State-by-state dealer licensing, sale limits, disclosures, lemon laws, title requirements, taxes, privacy obligations, and marketplace liability require legal review.' },
  ]} />;
}
