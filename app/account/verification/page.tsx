import { AccountShell } from '@/components/account-shell';
import { VerificationCenter } from '@/components/verification-center';

export default function Page() {
  return (
    <AccountShell eyebrow="Trust center" title="Verification status">
      <VerificationCenter />
    </AccountShell>
  );
}
