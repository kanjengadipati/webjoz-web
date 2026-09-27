import type { Metadata } from "next";
import Image from "next/image";
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-muted-foreground">
            Blog &amp; Panduan
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Tips membangun bisnis online untuk UMKM Indonesia
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Panduan praktis tentang website bisnis, SEO, dan jualan online —
            ditulis untuk pelaku usaha yang tidak punya banyak waktu.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/40"
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Terbaru · {featured.category}
              </p>
              <h2 className="mt-4 text-xl font-bold leading-snug sm:text-2xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {featured.description}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
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

      <footer className="border-t border-border py-10 text-center">
        <Link
          href="/create"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/85"
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
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-foreground/40"
    >
      <div>
        <p className="text-xs font-semibold text-muted-foreground">
          {post.category}
        </p>
        <h2 className="mt-4 text-base font-semibold leading-snug">
          {post.title}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {post.description}
        </p>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}