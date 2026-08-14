import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog Webjoz — Tips Website Bisnis & UMKM Indonesia",
  description:
    "Artikel dan panduan untuk membantu UMKM Indonesia membuat website, berjualan online, dan berkembang dengan bantuan AI. Tips SEO, template website, dan strategi bisnis digital.",
  keywords: [
    "blog website bisnis",
    "tips umkm",
    "panduan website",
    "seo indonesia",
    "jualan online",
    "webjoz blog",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl("/blog"),
  },
  openGraph: {
    title: "Blog Webjoz — Tips Website Bisnis & UMKM Indonesia",
    description:
      "Artikel dan panduan untuk membantu UMKM Indonesia membuat website dan berkembang dengan AI.",
    url: siteUrl("/blog"),
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Webjoz — Tips Website Bisnis & UMKM Indonesia",
    description:
      "Artikel dan panduan untuk membantu UMKM Indonesia membuat website dan berkembang dengan AI.",
    images: ["/opengraph-image.png"],
  },
};

export default function BlogIndexPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <main className="min-h-screen bg-[#080808] text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Webjoz
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/template-gallery" className="text-xs font-medium text-slate-400 transition hover:text-white">
              Template
            </Link>
            <Link
              href="/create"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Buat Website Gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Blog &amp; Panduan
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Tips membangun bisnis online untuk UMKM Indonesia
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            Panduan praktis tentang website bisnis, SEO, dan jualan online —
            ditulis untuk pelaku usaha yang tidak punya banyak waktu.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 transition hover:border-white/25"
          >
            <div>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                Terbaru · {featured.category}
              </span>
              <h2 className="mt-4 text-xl font-bold leading-snug transition group-hover:text-amber-300 sm:text-2xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {featured.description}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readingTime}</span>
            </div>
          </Link>

          <div className="grid gap-6 sm:grid-cols-2">
            {rest.slice(0, 2).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center">
        <Link
          href="/create"
          className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400"
        >
          Buat Website Bisnis Saya — Gratis
        </Link>
      </footer>
    </main>
  );
}

function PostCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
    >
      <div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {post.category}
        </span>
        <h2 className="mt-4 text-base font-semibold leading-snug transition group-hover:text-amber-300">
          {post.title}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
          {post.description}
        </p>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
