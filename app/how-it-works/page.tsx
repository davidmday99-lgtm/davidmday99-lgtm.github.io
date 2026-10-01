import { MarketingPage } from '@/components/marketing-page';

export default function Page() {
  return <MarketingPage eyebrow="A clearer private sale" title="From search to driveway, in five straightforward steps." intro="Owner Only Cars keeps private owners and buyers in control without document scans or dealer inventory." sections={[
    { eyebrow: '01 / Browse', title: 'Search public listings', body: 'Anyone may explore listings and compare approximate location, price, mileage, specifications, and seller-provided disclosures.' },
    { eyebrow: '02 / List', title: 'Publish for free', body: 'Create an account, add complete vehicle details and photos, attest that you are a private owner, and publish immediately.' },
    { eyebrow: '03 / Moderate', title: 'Keep dealers out', body: 'Dealer, broker, reseller, and consignment inventory is prohibited. Users can report concerns, and administrators may remove listings or suspend accounts.' },
    { eyebrow: '04 / Connect', title: 'Message on-platform', body: 'Signed-in buyers and sellers communicate without exposing email addresses or phone numbers by default.' },
    { eyebrow: '05 / Meet', title: 'Inspect independently', body: 'Meet safely, inspect the vehicle, compare the VIN with the title, and use qualified legal or mechanical help when needed.' },
    { eyebrow: 'MVP boundary', title: 'You control the sale', body: 'OwnerOnly Cars does not provide payments, escrow, financing, title transfer, or legal advice in the initial product.' },
  ]} />;
}
