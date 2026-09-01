import { BadgeCheck, CarFront, Heart, LayoutDashboard, LockKeyhole, MessageSquare, Settings } from 'lucide-react';

import { SiteHeader } from '@/components/site-header';

const links = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Verification', '/account/verification', BadgeCheck],
  ['My listings', '/dashboard#listings', CarFront],
  ['Favorites', '/favorites', Heart],
  ['Messages', '/messages', MessageSquare],
  ['Privacy & settings', '/settings', Settings],
] as const;

export function AccountShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8f4e9]">
        <div className="border-b-2 border-navy bg-[#96d9ed] px-5 py-10 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">{eyebrow}</p><h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-navy sm:text-5xl">{title}</h1></div></div>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit border-2 border-navy bg-white p-3 shadow-[6px_6px_0_rgba(7,28,44,.15)]"><nav aria-label="Account"><ul className="space-y-1">{links.map(([label, href, Icon]) => <li key={href}><a className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-navy" href={href}><Icon className="size-4" />{label}</a></li>)}</ul></nav><div className="mt-3 border-t border-slate-200 p-3 text-xs leading-5 text-slate-500"><LockKeyhole className="mb-2 size-4" />Demo account surface. No real personal data is stored.</div></aside>
          <section>{children}</section>
        </div>
      </main>
    </>
  );
}
