import type { Metadata } from 'next';
import { Mail, MessageSquareText, ShieldAlert } from 'lucide-react';

import { ContactForm } from '@/components/contact-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Contact Owner Only Cars',
  description:
    'Contact Owner Only Cars about buying, selling, private seller auctions, account verification, or safety concerns.',
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] text-[#061C2B]">
        <section className="border-b-2 border-[#061C2B] bg-[#96D9ED] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="block-label">Contact Owner Only Cars</span>
            <h1 className="mt-7 max-w-4xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.05em] sm:text-6xl">
              Tell us how we can help.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#183B53]">
              Questions about buying, selling, auctions, your account, or a
              safety concern? Send us a message and we’ll reply by email.
            </p>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <aside className="space-y-5">
              <InfoCard
                icon={<MessageSquareText className="size-6" />}
                title="Start with the details"
                body="Tell us which part of the site you were using and what you expected to happen. Clear details help us respond faster."
              />
              <InfoCard
                icon={<Mail className="size-6" />}
                title="Replies come by email"
                body="Use an email address you check regularly. Your address is used to answer your message and is never shown publicly."
              />
              <InfoCard
                icon={<ShieldAlert className="size-6" />}
                title="Keep documents private"
                body="Never send an ID, title, registration, banking information, or payment details through this general contact form."
                accent
              />
            </aside>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Send a message
              </h2>
              <p className="mt-3 mb-6 leading-7 text-slate-600">
                All fields are required except your phone number.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({
  icon,
  title,
  body,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <article
      className={`border-2 border-[#061C2B] p-5 shadow-[5px_5px_0_rgba(6,28,43,.18)] ${accent ? 'bg-[#FFB81C]' : 'bg-white'}`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center bg-[#061C2B] text-white">
          {icon}
        </span>
        <h2 className="text-lg font-black uppercase tracking-[-0.02em]">
          {title}
        </h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#29465A]">{body}</p>
    </article>
  );
}
