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
          title: 'No verification-document collection',
          body: 'Owner Only Cars does not require an ID scan, title image, or registration image to publish a listing. Do not send these documents through listings, messages, or the general contact form.',
        },
        {
          title: 'Public listing data',
          body: 'Public pages exclude exact addresses, account emails, phone numbers, device information, and private messages.',
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
