import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage cta={false} eyebrow="Privacy placeholder" title="Privacy comes before convenience." intro="This placeholder describes the intended data-minimization approach and must be replaced with counsel-reviewed disclosures before launch." sections={[
    { title: 'Identity data', body: 'Stripe hosts government-document and selfie verification. OwnerOnly Cars intends to store only the verification session ID, outcome, timestamps, failure category, and minimum approved fields.' },
    { title: 'Ownership documents', body: 'Title or registration images are private, access-controlled, and retained only long enough for review and appeal under a configurable retention policy.' },
    { title: 'Public listing data', body: 'Public pages exclude exact addresses, legal names, emails, phone numbers, private document URLs, device information, and raw risk signals.' },
    { title: 'Your controls', body: 'Planned controls include data export, account deletion, consent choices, communication preferences, and clear retention schedules subject to legal preservation needs.' },
  ]} />;
}
