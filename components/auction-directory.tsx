'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { stateAuctionGuides } from '@/lib/auction-data';

export function AuctionDirectory() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const results = useMemo(() => stateAuctionGuides.filter((state) => (region === 'All regions' || state.region === region) && `${state.name} ${state.code}`.toLowerCase().includes(query.trim().toLowerCase())), [query, region]);
  return (
    <div>
      <form className="border-2 border-navy bg-white p-4 shadow-[8px_8px_0_#071c2c]" onSubmit={(event) => event.preventDefault()}>
        <div className="flex items-center gap-2 border-b-2 border-navy pb-4"><SlidersHorizontal className="size-5" /><h2 className="font-black uppercase text-navy">Find public auction sources</h2></div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="md:col-span-2"><span className="sr-only">State or code</span><div className="flex h-12 items-center gap-3 border border-slate-300 px-3"><Search className="size-4 text-slate-500" /><Input className="h-10 border-0 p-0 shadow-none focus-visible:ring-0" onChange={(event) => setQuery(event.target.value)} placeholder="State or two-letter code" value={query} /></div></label>
          <label><span className="sr-only">Region</span><select className="h-12 w-full border border-slate-300 bg-white px-3 text-sm" onChange={(event) => setRegion(event.target.value)} value={region}><option>All regions</option><option>Northeast</option><option>Midwest</option><option>South</option><option>West</option></select></label>
          <Button className="h-12 rounded-none bg-teal-500 font-black uppercase text-navy hover:bg-teal-400" type="submit">Search directory</Button>
        </div>
        <details className="mt-4 border-t border-slate-200 pt-4">
          <summary className="cursor-pointer text-xs font-black uppercase tracking-wide text-teal-800">More auction filters</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['ZIP and radius', 'Any distance'], ['Format', 'Online or in person'], ['Source type', 'All government sources'], ['Public eligibility', 'Public results only'],
              ['Closing date', 'Any confirmed date'], ['Vehicle type', 'All vehicles'], ['Title status', 'Any confirmed status'], ['License required', 'No license by default'], ['Inspection', 'Any availability'],
            ].map(([label, defaultValue]) => <label className="text-xs font-bold text-slate-600" key={label}>{label}<select className="mt-1 h-10 w-full border border-slate-300 bg-white px-2 text-sm"><option>{defaultValue}</option><option>Not confirmed—check with auction</option></select></label>)}
          </div>
        </details>
      </form>
      <div className="mt-8 flex items-center justify-between border-b-2 border-navy pb-4"><p className="font-bold text-navy">{results.length} state and district guides</p><p className="text-xs text-slate-500">Directory view · auction events remain separate from owner listings</p></div>
      {results.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{results.map((state) => <a className="group flex min-h-36 flex-col border-2 border-navy bg-white p-5 shadow-[5px_5px_0_rgba(7,28,44,.12)] hover:bg-[#dff4f8]" href={`/public-auto-auctions/${state.slug}`} key={state.code}><div className="flex items-start justify-between"><span className="text-3xl font-black text-teal-700">{state.code}</span><ArrowRight className="size-5 transition group-hover:translate-x-1" /></div><h3 className="mt-auto text-xl font-black uppercase leading-none text-navy">{state.name}</h3><p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">{state.region}</p></a>)}</div> : <div className="mt-6 border-2 border-dashed border-slate-400 bg-white p-10 text-center"><h3 className="text-xl font-black uppercase text-navy">No matching state guide</h3><p className="mt-2 text-slate-600">Clear the search or choose a different region.</p></div>}
    </div>
  );
}
