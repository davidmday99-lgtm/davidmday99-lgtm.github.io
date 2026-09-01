import {
  ArrowRight,
  BadgeCheck,
  DollarSign,
  Handshake,
  ShieldCheck,
} from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

const principles = [
  {
    icon: DollarSign,
    number: '01',
    title: 'Keep more money with people',
    body: 'A private owner and a buyer should be able to make a fair deal without an unnecessary dealer markup standing between them.',
  },
  {
    icon: Handshake,
    number: '02',
    title: 'Make direct deals feel clearer',
    body: 'OwnerOnly is designed for straightforward conversations between real people, with private contact details and understandable steps.',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Build trust honestly',
    body: 'Identity, ownership, and vehicle-history checks answer different questions. We explain what each check means—and what it cannot guarantee.',
  },
];

export default function OurStoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] text-[#061C2B]">
        <section className="overflow-hidden border-b-[3px] border-[#061C2B] bg-[#061C2B] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#16C7BE]">
                Our story
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-7xl">
                Built for everyday Americans.
                <span className="block text-[#FFB81C]">Not dealer lots.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">
                I built OwnerOnly Cars because buying or selling a vehicle
                should not mean handing more of your hard-earned money to an
                unnecessary middleman.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  className="h-12 rounded-none bg-[#FFB81C] px-6 font-black uppercase text-[#061C2B] hover:bg-[#FFF8EA]"
                  nativeButton={false}
                  render={<a href="/sell" />}
                >
                  Sell your car <ArrowRight />
                </Button>
                <Button
                  className="h-12 rounded-none border-2 border-[#16C7BE] bg-transparent px-6 font-black uppercase text-white hover:bg-[#16C7BE] hover:text-[#061C2B]"
                  nativeButton={false}
                  render={<a href="/search" />}
                >
                  Browse the marketplace
                </Button>
              </div>
            </div>

            <div className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-[430px]">
              <img
                alt="A dark navy classic Mustang shown in side profile"
                className="absolute inset-0 size-full object-contain object-center"
                src="/owneronly-mustang-hero-navy.png"
              />
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
                Why I started this
              </p>
              <div className="mt-5 h-2 w-24 bg-[#FFB81C]" />
            </div>
            <div>
              <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-6xl">
                A good car deal should help a family—not feed another markup.
              </h2>
              <div className="mt-8 max-w-3xl space-y-6 text-lg leading-8 text-slate-700">
                <p>
                  Everyday Americans are already watching every dollar. A car is
                  often how we get to work, take children to school, care for
                  family, and keep life moving. The process of buying one should
                  feel direct, understandable, and fair.
                </p>
                <p>
                  OwnerOnly Cars is my answer: a marketplace where private
                  owners can meet buyers directly, where dealer and broker
                  inventory is not allowed, and where useful verification
                  signals are explained in plain language.
                </p>
                <p>
                  The goal is simple—help sellers keep more of the value of
                  their vehicle and help buyers find a fair deal from a real
                  person.
                </p>
              </div>
              <blockquote className="mt-10 border-l-[6px] border-[#16C7BE] bg-[#061C2B] p-7 text-2xl font-black leading-tight text-[#FFF8EA] sm:text-3xl">
                “Cars from people, not lots” is more than a tagline. It is the
                reason this marketplace exists.
              </blockquote>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-[#061C2B] bg-[#dff4f1] px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
              The idea behind OwnerOnly
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-none tracking-[-0.04em] sm:text-6xl">
              Direct deals. Clear checks. Honest limits.
            </h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {principles.map(({ icon: Icon, number, title, body }) => (
                <article
                  className="flex min-h-[300px] flex-col border-[3px] border-[#061C2B] bg-[#FFF8EA] p-7 shadow-[7px_7px_0_#16C7BE]"
                  key={title}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black tracking-[0.2em]">
                      {number}
                    </span>
                    <Icon className="size-8 text-[#0B8F89]" />
                  </div>
                  <h3 className="mt-auto text-2xl font-black uppercase leading-none">
                    {title}
                  </h3>
                  <p className="mt-5 leading-7 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <article className="border-[3px] border-[#061C2B] bg-white p-8">
              <BadgeCheck className="size-9 text-[#0B8F89]" />
              <h2 className="mt-6 text-3xl font-black uppercase">
                What we are building
              </h2>
              <ul className="mt-6 space-y-4 leading-7 text-slate-700">
                <li>Private-owner vehicle listings—not dealer inventory.</li>
                <li>Separate identity and vehicle-ownership reviews.</li>
                <li>Private messaging without public contact details.</li>
                <li>Clear safety guidance and human moderation.</li>
              </ul>
            </article>
            <article className="border-[3px] border-[#061C2B] bg-[#FFB81C] p-8">
              <ShieldCheck className="size-9" />
              <h2 className="mt-6 text-3xl font-black uppercase">
                What we will never promise
              </h2>
              <p className="mt-6 text-lg leading-8">
                No badge can guarantee a safe transaction, a vehicle’s
                condition, or a complete history. OwnerOnly will show what was
                checked, explain the limit, and remind every buyer to inspect
                the vehicle and verify its title independently.
              </p>
            </article>
          </div>

          <div className="mx-auto mt-10 max-w-6xl border-2 border-dashed border-[#061C2B] bg-[#dff4f1] p-7 text-center">
            <p className="font-black uppercase tracking-wide">
              We are at the beginning.
            </p>
            <p className="mt-2 text-slate-700">
              There are no live owner listings yet. Vehicles marked as demos are
              fictional examples showing how the marketplace will work.
            </p>
          </div>
        </section>

        <section className="bg-[#061C2B] px-5 py-20 text-center text-white sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#16C7BE]">
            Help write the next chapter
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black uppercase leading-none tracking-[-0.04em] sm:text-6xl">
            Help build a better car marketplace.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            List your vehicle, share OwnerOnly Cars, and help create a direct
            marketplace for everyday Americans.
          </p>
          <Button
            className="mt-9 h-12 rounded-none bg-[#FFB81C] px-7 font-black uppercase text-[#061C2B] hover:bg-[#FFF8EA]"
            nativeButton={false}
            render={<a href="/sell" />}
          >
            List your vehicle <ArrowRight />
          </Button>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
