import type { Metadata } from 'next';
import { ArrowLeft, Clock3, ShieldAlert } from 'lucide-react';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { blogPosts, findBlogPost } from '@/lib/blog-data';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = findBlogPost(params.slug);
  if (!post) return { title: 'Article Not Found | Owner Only Cars' };

  return {
    title: post.title + ' | Owner Only Journal',
    description: post.excerpt,
    alternates: { canonical: '/blog/' + post.slug },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedIso,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = findBlogPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="bg-[#FFF8EA] text-[#061C2B]">
        <article>
          <header className="border-b-[3px] border-[#061C2B] bg-[#061C2B] px-5 py-14 text-white sm:px-8 lg:py-20">
            <div className="mx-auto max-w-5xl">
              <a
                className="inline-flex items-center gap-2 text-sm font-black uppercase text-[#16C7BE] hover:text-[#FFB81C]"
                href="/blog"
              >
                <ArrowLeft className="size-4" /> Owner Only Journal
              </a>
              <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-[#FFB81C]">
                {post.category}
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-7xl">
                {post.title}
              </h1>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
                <time dateTime={post.publishedIso}>{post.publishedLabel}</time>
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4" /> {post.readTime}
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
            <img
              alt={post.imageAlt}
              className="aspect-[16/8] w-full border-[3px] border-[#061C2B] bg-white object-cover shadow-[9px_9px_0_rgba(6,28,43,.18)]"
              src={post.image}
            />

            <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-[1fr_250px]">
              <div>
                <p className="border-l-4 border-[#16C7BE] pl-5 text-xl font-bold leading-9">
                  {post.intro}
                </p>
                {post.sections.map((section) => (
                  <section className="mt-10" key={section.heading}>
                    <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em]">
                      {section.heading}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p
                        className="mt-5 text-lg leading-8 text-slate-700"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets ? (
                      <ul className="mt-5 space-y-4 text-lg leading-8 text-slate-700">
                        {section.bullets.map((bullet) => (
                          <li className="flex gap-3" key={bullet}>
                            <span className="mt-3 size-2 shrink-0 bg-[#16C7BE]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>

              <aside className="h-fit border-[3px] border-[#061C2B] bg-[#FFB81C] p-5 lg:sticky lg:top-28">
                <ShieldAlert className="size-7" />
                <h2 className="mt-4 text-xl font-black uppercase">
                  Use your own judgment
                </h2>
                <p className="mt-3 text-sm leading-6">
                  This article is general educational information—not legal,
                  financial, mechanical, or safety advice. Verify the vehicle,
                  documents, people, and transaction independently.
                </p>
              </aside>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
