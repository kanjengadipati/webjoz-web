"use client";

import React from "react";

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
}

export function BlogPostsSection({ posts }: BlogPostsSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="w-full px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Blog</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Artikel dan informasi terbaru
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.id}
              className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
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
                <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                )}
                {post.published_at && (
                  <p className="text-xs text-muted-foreground/70 pt-1">
                    {new Date(post.published_at).toLocaleDateString("id-ID", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
