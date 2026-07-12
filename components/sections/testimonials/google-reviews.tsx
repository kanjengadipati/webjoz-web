"use client";
import React from "react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface Props {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
}

function StarRow({ rating = 5 }: { rating?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" style={{ width: 14, height: 14, fill: i < Math.round(rating) ? "#FBBC05" : "rgba(255,255,255,0.15)" }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }} fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>Google</span>
    </div>
  );
}

export default function TestimonialsGoogleReviews({ testimonials: t, design_token }: Props) {
  if (!t?.items?.length) return null;

  const items = t.items;

  // Compute aggregate rating from items that have a rating
  const ratedItems = items.filter(i => (i as any).rating > 0);
  const avgRating = ratedItems.length
    ? ratedItems.reduce((sum, i) => sum + ((i as any).rating ?? 0), 0) / ratedItems.length
    : null;

  return (
    <section
      id="testimonials"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {t.eyebrow && (
            <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>
              {t.eyebrow}
            </span>
          )}
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.1rem)", color: "var(--dt-text)", marginTop: t.eyebrow ? "0.5rem" : 0, marginBottom: 0 }}>
            {t.title}
          </h2>
          {t.subtitle && (
            <p style={{ color: "var(--dt-text-muted)", fontSize: "0.95rem", marginTop: "0.5rem", marginBottom: 0 }}>{t.subtitle}</p>
          )}

          {/* Aggregate Google rating badge */}
          {avgRating !== null && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "1rem", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(251,188,5,0.1)", border: "1px solid rgba(251,188,5,0.25)" }}>
              <StarRow rating={Math.round(avgRating)} />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FBBC05" }}>{avgRating.toFixed(1)}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--dt-text-muted)" }}>dari {ratedItems.length} ulasan</span>
              <GoogleBadge />
            </div>
          )}
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
          gap: "1.25rem",
        }}>
          {items.map((item, idx) => {
            const anyItem = item as any;
            const hasPhoto = !!anyItem.avatar_url;
            const isGoogle = anyItem.source === "google";
            const rating: number = anyItem.rating ?? 0;
            const initials = item.avatar_initials || item.name?.charAt(0)?.toUpperCase() || "?";
            const accentColor = item.avatar_color || "var(--dt-primary)";

            return (
              <div
                key={idx}
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                  borderRadius: "var(--dt-radius-lg)",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                }}
              >
                {/* Top row: avatar + name + Google badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {/* Avatar */}
                    {hasPhoto ? (
                      <img
                        src={anyItem.avatar_url}
                        alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)" }}
                      />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{initials}</span>
                      </div>
                    )}
                    {/* Name + role */}
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--dt-text)", fontSize: "0.875rem", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
                      {(item.role || item.company) && (
                        <p style={{ color: "var(--dt-text-muted)", fontSize: "0.75rem", margin: 0, lineHeight: 1.3 }}>
                          {item.role}{item.company ? ` · ${item.company}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  {isGoogle && <GoogleBadge />}
                </div>

                {/* Star rating */}
                {rating > 0 && <StarRow rating={rating} />}

                {/* Quote */}
                <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0, flexGrow: 1, fontStyle: "italic" }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
