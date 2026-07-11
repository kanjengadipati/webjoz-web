"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BlogLayout } from "./types";

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url?: string;
  published_at: string;
  created_at: string;
}

interface BlogPostsSectionProps {
  posts: BlogPostItem[];
  layout?: BlogLayout;
}

/** Strip HTML tags from excerpt — guards against corrupted DB entries */
function stripHtml(s: string): string {
  if (!s) return "";
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function blogPath(pathname: string, postSlug: string): string {
  const parts = pathname.split("/").filter(Boolean);
  // Path-based local dev: /s/[subdomain]/...
  if (parts[0] === "s" && parts[1]) {
    return `/s/${parts[1]}/blog/${postSlug}`;
  }
  // Production rewrite: /site/[subdomain]/...
  if (parts[0] === "site" && parts[1]) {
    return `/site/${parts[1]}/blog/${postSlug}`;
  }
  // Preview mode: /preview/[id]/...
  if (parts[0] === "preview" && parts[1]) {
    return `/preview/${parts[1]}/blog/${postSlug}`;
  }
  // Custom domain: subdomain.webjoz.com — relative path works fine
  return `/blog/${postSlug}`;
}

function PostDate({ date }: { date: string }) {
  return (
    <p className="text-xs text-muted-foreground/70">
      {new Date(date).toLocaleDateString("id-ID", {
        year: "numeric", month: "long", day: "numeric",
      })}
    </p>
  );
}

function PostCard({ post, pathname }: { post: BlogPostItem; pathname: string }) {
  const excerpt = stripHtml(post.excerpt);
  return (
    <Link
      key={post.id}
      href={blogPath(pathname, post.slug)}
      className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow group block"
    >
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-48 object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="p-5 space-y-2">
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        )}
        {post.published_at && <PostDate date={post.published_at} />}
        <span className="inline-block text-sm font-semibold text-primary mt-1 group-hover:underline">
          Baca Selengkapnya →
        </span>
      </div>
    </Link>
  );
}

function layoutGrid(posts: BlogPostItem[], pathname: string) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => <PostCard key={post.id} post={post} pathname={pathname} />)}
    </div>
  );
}

function layoutList(posts: BlogPostItem[], pathname: string) {
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Link
          key={post.id}
          href={blogPath(pathname, post.slug)}
          className="flex flex-col sm:flex-row gap-5 rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow group"
        >
          {post.cover_image_url ? (
            <div className="sm:w-56 shrink-0">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-48 sm:h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ) : (
            <div className="sm:w-56 shrink-0 hidden sm:block" />
          )}
          <div className="p-5 space-y-2 flex-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
            {stripHtml(post.excerpt) && (
              <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(post.excerpt)}</p>
            )}
            {post.published_at && <PostDate date={post.published_at} />}
            <span className="inline-block text-sm font-semibold text-primary mt-1 group-hover:underline">
              Baca Selengkapnya →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function layoutFeatured(posts: BlogPostItem[], pathname: string) {
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;
  return (
    <div className="space-y-8">
      <Link
        href={blogPath(pathname, featured.slug)}
        className="block rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow group"
      >
        {featured.cover_image_url && (
          <img
            src={featured.cover_image_url}
            alt={featured.title}
            className="w-full h-64 md:h-80 object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="p-6 md:p-8 space-y-3">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">Unggulan</span>
          <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">{featured.title}</h3>
          {featured.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 max-w-2xl">{stripHtml(featured.excerpt)}</p>
          )}
          {featured.published_at && <PostDate date={featured.published_at} />}
          <span className="inline-block text-sm font-semibold text-primary mt-2 group-hover:underline">
            Baca Selengkapnya →
          </span>
        </div>
      </Link>
      {rest.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map(post => <PostCard key={post.id} post={post} pathname={pathname} />)}
        </div>
      )}
    </div>
  );
}

function layoutMinimal(posts: BlogPostItem[], pathname: string) {
  return (
    <div className="max-w-3xl mx-auto divide-y">
      {posts.map(post => (
        <Link
          key={post.id}
          href={blogPath(pathname, post.slug)}
          className="block py-4 group hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{post.title}</h3>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{stripHtml(post.excerpt)}</p>
              )}
            </div>
            {post.published_at && (
              <p className="text-xs text-muted-foreground/60 shrink-0 pt-0.5">
                {new Date(post.published_at).toLocaleDateString("id-ID", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function BlogPostsSection({ posts, layout = "grid" }: BlogPostsSectionProps) {
  const pathname = usePathname();
  if (!posts || posts.length === 0) return null;

  const renderer = {
    grid: layoutGrid,
    list: layoutList,
    featured: layoutFeatured,
    minimal: layoutMinimal,
  }[layout] || layoutGrid;

  return (
    <section id="blog" className="w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Blog</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Artikel dan informasi terbaru
        </p>
        {renderer(posts, pathname)}
      </div>
    </section>
  );
}
