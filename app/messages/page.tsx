import { AccountShell } from '@/components/account-shell';
import { MessagesCenter } from '@/components/messages-center';

export default function Page() {
  return (
    <AccountShell eyebrow="Verified conversations" title="Messages">
      <MessagesCenter />
    </AccountShell>
  );
}
