import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog/posts";
import { siteUrl } from "@/lib/site-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const canonical = siteUrl(`/blog/${post.slug}`);
  return {
    title: `${post.title} | Blog Webjoz`,
    description: post.description,
    keywords: post.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: "Webjoz",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/opengraph-image.png"],
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo2.png" alt="Webjoz" width={80} height={48} className="h-6 w-auto object-contain" />
            <span className="text-sm font-semibold tracking-tight">Webjoz</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/template-gallery" className="text-xs font-medium text-muted-foreground transition hover:text-foreground">
              Template
            </Link>
            <Link
              href="/create"
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Buat Website Gratis
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link href="/blog" className="transition hover:text-foreground">
            &larr; Semua Artikel
          </Link>
        </nav>
        <div className="mt-6 flex items-center gap-2 text-xs">
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {post.category}
          </span>
          <span className="text-muted-foreground">{post.date}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{post.readingTime} baca</span>
        </div>
        <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-10 space-y-10">
          {post.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {section.heading}
              </h2>
              {section.body.map((paragraph, j) => (
                <p key={j} className="mt-3 leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-card p-8 text-center">
          <h3 className="text-lg font-bold">Siap membuat website bisnis Anda?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Buat website profesional dengan AI dalam 5 menit. Gratis untuk memulai.
          </p>
          <Link
            href="/create"
            className="mt-5 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
          >
            Buat Website Sekarang
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold">Artikel Lainnya</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/40"
            >
              <p className="self-start text-[10px] font-semibold text-muted-foreground">
                {p.category}
              </p>
              <h3 className="mt-3 text-sm font-semibold leading-snug">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}