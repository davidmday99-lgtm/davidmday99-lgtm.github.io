import { CalendarCheck2, ExternalLink, Globe2, LockKeyhole, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { AuctionSource } from '@/lib/auction-data';

export function AuctionSourceCard({ source }: { source: AuctionSource }) {
  const accessLabel = source.publicAccess === 'confirmed' ? 'Public access confirmed' : source.publicAccess === 'restricted' ? 'License required' : 'Eligibility not confirmed';
  return (
    <article className="flex h-full flex-col border-2 border-navy bg-white p-6 shadow-[6px_6px_0_rgba(7,28,44,.14)]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={`rounded-none ${source.publicAccess === 'confirmed' ? 'bg-teal-100 text-teal-800' : source.publicAccess === 'restricted' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'}`}>{source.publicAccess === 'confirmed' ? <ShieldCheck /> : <LockKeyhole />}{accessLabel}</Badge>
        <Badge className="rounded-none" variant="outline">{source.format}</Badge>
      </div>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-teal-700">{source.category}</p>
      <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-[-0.035em] text-navy">{source.name}</h2>
      <p className="mt-3 text-sm font-bold text-slate-600">{source.agency}</p>
      <p className="mt-5 text-sm leading-6 text-slate-600">{source.publicAccessNote}</p>
      <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-xs">
        <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">License requirement</dt><dd className="font-black uppercase text-navy">{source.licenseRequirement === 'unknown' ? 'Check event terms' : source.licenseRequirement}</dd></div>
        <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Last successfully checked</dt><dd className="font-bold text-navy">{source.lastChecked}</dd></div>
        <div className="flex justify-between gap-4"><dt className="font-bold text-slate-500">Next scheduled review</dt><dd className="font-bold text-navy">{source.nextReview}</dd></div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <a className="inline-flex items-center gap-2 bg-navy px-4 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-teal-800" href={source.officialUrl} rel="noopener noreferrer" target="_blank"><Globe2 className="size-4" /> Official source <ExternalLink className="size-3" /></a>
        <a className="inline-flex items-center gap-2 border border-navy px-4 py-3 text-xs font-black uppercase tracking-wide text-navy hover:bg-slate-50" href={source.termsUrl} rel="noopener noreferrer" target="_blank"><CalendarCheck2 className="size-4" /> Terms</a>
      </div>
    </article>
  );
}
