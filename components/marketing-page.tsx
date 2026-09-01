import { ArrowRight } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

export type MarketingSection = {
  title: string;
  body: string;
  eyebrow?: string;
};

export function MarketingPage({ eyebrow, title, intro, sections, cta = true }: { eyebrow: string; title: string; intro: string; sections: MarketingSection[]; cta?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b-2 border-navy bg-[#96d9ed] px-5 py-20 text-navy sm:px-8 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.23em] text-teal-800">{eyebrow}</p>
            <h1 className="mt-4 text-balance text-4xl font-black uppercase leading-[.95] tracking-[-0.06em] sm:text-6xl">{title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-navy/75">{intro}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-2 lg:py-24">
          {sections.map((section, index) => (
            <article className={`border-2 border-navy p-7 shadow-[6px_6px_0_rgba(7,28,44,.14)] sm:p-8 ${index === 0 ? 'bg-[#f6b82b]' : 'bg-white'}`} key={section.title}>
              {section.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">{section.eyebrow}</p>}
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-navy">{section.title}</h2>
              <p className="mt-4 leading-7 text-slate-600">{section.body}</p>
            </article>
          ))}
        </section>
        {cta && (
          <section className="border-t border-slate-200 bg-slate-50 px-5 py-16 text-center sm:px-8">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-navy">Ready to buy or sell owner-to-owner?</h2>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="h-11 bg-teal-500 px-6 font-bold text-navy hover:bg-teal-400" nativeButton={false} render={<a href="/search" />}>Browse cars <ArrowRight /></Button>
              <Button className="h-11 px-6" nativeButton={false} render={<a href="/sell" />} variant="outline">Sell your car</Button>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
