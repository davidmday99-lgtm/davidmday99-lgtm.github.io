import { AccountShell } from '@/components/account-shell';
import { ListingWizard } from '@/components/listing-wizard';
import { SellerIdentityGate } from '@/components/seller-identity-gate';

export default function Page() {
  return (
    <AccountShell eyebrow="Private-owner listing" title="Sell your car">
      <SellerIdentityGate>
        <ListingWizard />
      </SellerIdentityGate>
    </AccountShell>
  );
}
