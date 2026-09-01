import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="A clearer private sale" title="From search to driveway, in five straightforward steps." intro="OwnerOnly Cars makes the signals around a private sale easier to see while keeping buyers and sellers in control of the transaction." sections={[
    { eyebrow: '01 / Browse', title: 'Search public listings', body: 'Anyone may explore listings and compare approximate location, price, mileage, specifications, and visible verification status.' },
    { eyebrow: '02 / Verify', title: 'Complete your checks', body: 'Create an account, verify your phone, and complete hosted identity verification before you can publish a listing or contact another user.' },
    { eyebrow: '03 / Review', title: 'Understand every badge', body: 'Identity, ownership documents, and vehicle history are reviewed separately so each badge has a specific, limited meaning.' },
    { eyebrow: '04 / Connect', title: 'Message on-platform', body: 'Verified buyers and sellers communicate without exposing email addresses or phone numbers by default.' },
    { eyebrow: '05 / Meet', title: 'Inspect independently', body: 'Meet safely, inspect the vehicle, compare the VIN with the title, and use qualified legal or mechanical help when needed.' },
    { eyebrow: 'MVP boundary', title: 'You control the sale', body: 'OwnerOnly Cars does not provide payments, escrow, financing, title transfer, or legal advice in the initial product.' },
  ]} />;
}
