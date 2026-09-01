import { AlertTriangle, CheckCircle2, Clock3, Download, FileUp, Link2Off, Plus, RefreshCw, ShieldCheck } from 'lucide-react';

import { AccountShell } from '@/components/account-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { federalAuctionSources } from '@/lib/auction-data';

export default function Page() {
  return (
    <AccountShell eyebrow="Administrator moderation" title="Auction source review">
      <div className="mb-7 grid gap-4 md:grid-cols-4">{[
        { label: 'Approved sources', value: federalAuctionSources.length, icon: ShieldCheck, color: '#22b8ae' },
        { label: 'Awaiting review', value: 0, icon: Clock3, color: '#f6b82b' },
        { label: 'Broken-link alerts', value: 0, icon: Link2Off, color: '#96d9ed' },
        { label: 'Expired events hidden', value: 0, icon: RefreshCw, color: '#ffffff' },
      ].map(({ label, value, icon: Icon, color }) => <div className="border-2 border-navy p-5 shadow-[5px_5px_0_rgba(7,28,44,.13)]" key={label} style={{ backgroundColor: color }}><Icon className="size-6" /><p className="mt-5 text-3xl font-black text-navy">{value}</p><p className="mt-1 text-xs font-black uppercase tracking-wide text-navy/65">{label}</p></div>)}</div>
      <section className="border-2 border-navy bg-white p-6">
        <div className="flex flex-col gap-4 border-b-2 border-navy pb-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-black uppercase text-navy">Source registry</h2><p className="mt-1 text-sm text-slate-500">Human approval required before public display.</p></div><div className="flex flex-wrap gap-2"><Button className="rounded-none" variant="outline"><FileUp /> Import CSV</Button><Button className="rounded-none" variant="outline"><Download /> Export CSV</Button><Button className="rounded-none bg-teal-500 font-black uppercase text-navy"><Plus /> Add source</Button></div></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[820px] border-collapse text-left text-sm"><thead><tr className="border-b border-slate-300 text-xs font-black uppercase tracking-wide text-slate-500"><th className="p-3">Source</th><th className="p-3">Category</th><th className="p-3">Access</th><th className="p-3">Link check</th><th className="p-3">Last verified</th><th className="p-3">Moderation</th></tr></thead><tbody>{federalAuctionSources.map((source) => <tr className="border-b border-slate-200" key={source.id}><td className="p-3"><p className="font-bold text-navy">{source.name}</p><p className="mt-1 text-xs text-slate-500">{source.agency}</p></td><td className="p-3 text-slate-600">{source.category}</td><td className="p-3"><Badge className="rounded-none bg-teal-100 text-teal-800">{source.publicAccess}</Badge></td><td className="p-3"><span className="flex items-center gap-2 font-bold text-teal-700"><CheckCircle2 className="size-4" /> Passed</span></td><td className="p-3 text-slate-600">{source.lastChecked}</td><td className="p-3"><Badge className="rounded-none" variant="outline">Approved</Badge></td></tr>)}</tbody></table></div>
      </section>
      <div className="mt-7 flex gap-4 border-2 border-amber-500 bg-amber-50 p-5"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" /><p className="text-sm leading-6 text-amber-950">Demonstration administration surface. Production actions require an elevated role, server-side authorization, strict CSV validation, duplicate detection, immutable approval audit events, historical retention, and safe URL checks.</p></div>
    </AccountShell>
  );
}
