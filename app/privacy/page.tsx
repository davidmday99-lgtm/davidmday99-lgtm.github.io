import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return (
    <MarketingPage
      cta={false}
      eyebrow="Privacy"
      title="Privacy comes before convenience."
      intro="This placeholder describes the intended data-minimization approach and must be replaced with counsel-reviewed disclosures before launch."
      sections={[
        {
          title: 'Identity data',
          body: 'Stripe hosts government-document verification. OwnerOnly Cars intends to store only the verification session ID, outcome, timestamps, failure category, and minimum approved fields—not raw ID images.',
        },
        {
          title: 'Ownership documents',
          body: 'Title or registration images are stored in a private, access-controlled area for review. If you give consent during upload, the document may be sent to OpenAI for automated risk screening. The screening returns limited signals such as document type, legibility, a VIN-last-six comparison, name-match status, and possible visible alteration; a human makes every final decision. Documents are not shown on public listings and are marked for removal under a configurable retention policy.',
        },
        {
          title: 'Public listing data',
          body: 'Public pages exclude exact addresses, legal names, emails, phone numbers, private document URLs, device information, and raw risk signals.',
        },
        {
          title: 'Contact messages',
          body: 'When you use the contact form, the name, email address, optional phone number, topic, and message you provide are relayed to Owner Only Cars through FormSubmit for email delivery. Do not use the general contact form to send identity, ownership, payment, or other sensitive documents.',
        },
        {
          title: 'Your controls',
          body: 'Planned controls include data export, account deletion, consent choices, communication preferences, and clear retention schedules subject to legal preservation needs.',
        },
      ]}
    />
  );
}
