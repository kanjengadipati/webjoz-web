"use client";
import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import type { ContactVariantProps } from "./types";
import DynamicLeadForm from "./lead-form";

// Minimal Leaflet-based map — uses browser geolocation or Jakarta fallback
function MapEmbed({ style, className }: { style?: React.CSSProperties; className?: string }) {
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 }); // Jakarta fallback
  const ref = React.useRef<HTMLDivElement>(null);
  const initRef = React.useRef(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  useEffect(() => {
    if (!ref.current || initRef.current) return;
    initRef.current = true;
    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");
      if (!ref.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map = L.map(ref.current, { zoomControl: false, scrollWheelZoom: false }).setView([coords.lat, coords.lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "" }).addTo(map);
      L.marker([coords.lat, coords.lng]).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);
      return () => map.remove();
    });
  }, [coords.lat, coords.lng]);

  return <div ref={ref} style={{ width: "100%", height: "100%", ...style }} className={className} />;
}

export default function ClassicSplit({ contact: c, onSubmitLead, leadSubmitting, leadSuccess, leadError }: ContactVariantProps) {
  const hasLeadForm = Boolean(c.show_lead_form && onSubmitLead);
  const displayAddress = c.address || "Jl. Malioboro No. 123, Yogyakarta, Indonesia";
  const displayPhone = c.phone || "+62 812-3456-7890";
  const displayEmail = c.email || "hello@domain.com";
  const [mapCoords, setMapCoords] = useState({ lat: -6.2088, lng: 106.8456 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const iconBox: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
    color: "var(--dt-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  return (
    <section id="contact" style={{ padding: "var(--dt-spacing) 1.5rem", background: "color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div className="lg:col-span-5" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "9999px", background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)", marginBottom: "1rem" }}>
              Hubungi Kami
            </span>
            <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)", fontSize: "clamp(1.25rem, 4.5cqw, 2rem)", color: "var(--dt-text)", margin: 0, marginBottom: "1rem" } as any}>
              {c.title}
            </h2>
            <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Punya pertanyaan atau ingin diskusi? Kirim pesan dan kami akan merespons dalam waktu 24 jam.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={iconBox}><Phone style={{ width: 18, height: 18 }} /></div>
                <div>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>Telepon</h4>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--dt-text)", margin: "0.125rem 0 0" }}>{displayPhone}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={iconBox}><Mail style={{ width: 18, height: 18 }} /></div>
                <div>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>Email</h4>
                  <a href={`mailto:${displayEmail}`} style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--dt-primary)", textDecoration: "none", margin: "0.125rem 0 0", display: "block" }}>{displayEmail}</a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={iconBox}><MapPin style={{ width: 18, height: 18 }} /></div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: 0 }}>Kantor</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--dt-text-muted)", margin: "0.125rem 0 0.75rem", lineHeight: 1.5 }}>{displayAddress}</p>
                  <div style={{ borderRadius: "0.75rem", overflow: "hidden", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", height: "8rem" }}>
                    <MapEmbed />
                  </div>
                  <a href={`https://www.google.com/maps/place/@${mapCoords.lat},${mapCoords.lng}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.6875rem", fontWeight: 500, color: "var(--dt-primary)", textDecoration: "none", marginTop: "0.375rem" }}>
                    <Globe style={{ width: 13, height: 13 }} /> Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          {hasLeadForm && (
            <div style={{ background: "var(--dt-surface)", padding: "2rem", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)" }}>
              <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, color: "var(--dt-text)", marginBottom: "1.5rem", marginTop: 0 }}>Hubungi Kami</h3>
              <DynamicLeadForm onSubmit={onSubmitLead!} submitting={leadSubmitting} success={leadSuccess} error={leadError} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
