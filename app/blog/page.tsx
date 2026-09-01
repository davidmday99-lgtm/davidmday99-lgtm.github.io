import type { Metadata } from 'next';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'OwnerOnly Journal | Private Car Buying & Selling',
  description:
    'Practical guidance for private car buyers and sellers, plus the story behind OwnerOnly Cars.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [featured, ...morePosts] = blogPosts;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] text-[#061C2B]">
        <section className="border-b-[3px] border-[#061C2B] bg-[#061C2B] px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.6fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.23em] text-[#16C7BE]">
                The OwnerOnly Journal
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl">
                Real guidance.
                <span className="block text-[#FFB81C]">No sales pitch.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Straightforward help for buying and selling a vehicle privately,
                understanding verification, and avoiding common transaction
                traps.
              </p>
            </div>
            <div className="border-2 border-[#16C7BE] bg-[#0a293c] p-6">
              <ShieldCheck className="size-8 text-[#FFB81C]" />
              <p className="mt-4 font-black uppercase">
                Education, not a guarantee
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Safety guidance reduces uncertainty. It cannot guarantee a
                vehicle’s condition or a safe transaction.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
              Featured story
            </p>
            <article className="mt-5 grid overflow-hidden border-[3px] border-[#061C2B] bg-white shadow-[9px_9px_0_rgba(6,28,43,.18)] lg:grid-cols-[1.1fr_.9fr]">
              <a
                className="block overflow-hidden border-b-[3px] border-[#061C2B] lg:border-b-0 lg:border-r-[3px]"
                href={'/blog/' + featured.slug}
              >
                <img
                  alt={featured.imageAlt}
                  className="aspect-[16/10] size-full object-cover transition duration-300 hover:scale-[1.02]"
                  src={featured.image}
                />
              </a>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0B8F89]">
                  {featured.category} · {featured.readTime}
                </p>
                <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                  <a href={'/blog/' + featured.slug}>{featured.title}</a>
                </h2>
                <p className="mt-5 leading-7 text-slate-600">
                  {featured.excerpt}
                </p>
                <Button
                  className="mt-7 w-fit rounded-none bg-[#061C2B] font-black uppercase text-white hover:bg-[#0B6F6A]"
                  nativeButton={false}
                  render={<a href={'/blog/' + featured.slug} />}
                >
                  Read the story <ArrowRight />
                </Button>
              </div>
            </article>
          </div>
        </section>

        <section className="border-y-[3px] border-[#061C2B] bg-[#dff4f1] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-5 border-b-[3px] border-[#061C2B] pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0B8F89]">
                  Guides & explainers
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-6xl">
                  Read before you deal.
                </h2>
              </div>
              <BookOpen className="hidden size-12 text-[#0B8F89] sm:block" />
            </div>
            <div className="mt-9 grid gap-7 md:grid-cols-2">
              {morePosts.map((post) => (
                <article
                  className="overflow-hidden border-[3px] border-[#061C2B] bg-white shadow-[7px_7px_0_rgba(6,28,43,.16)]"
                  key={post.slug}
                >
                  <a
                    className="block overflow-hidden border-b-[3px] border-[#061C2B]"
                    href={'/blog/' + post.slug}
                  >
                    <img
                      alt={post.imageAlt}
                      className="aspect-[16/9] size-full object-cover transition duration-300 hover:scale-[1.02]"
                      src={post.image}
                    />
                  </a>
                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0B8F89]">
                      {post.category} · {post.readTime}
                    </p>
                    <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.04em]">
                      <a href={'/blog/' + post.slug}>{post.title}</a>
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                    <a
                      className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase hover:text-[#0B8F89]"
                      href={'/blog/' + post.slug}
                    >
                      Read article <ArrowRight className="size-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
