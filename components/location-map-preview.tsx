"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapPin } from "lucide-react";
import { parseGoogleMapsCoords } from "@/components/templates/shared";
import { TILE_URLS } from "@/components/sections/contact/leaflet-map";

interface LocationMapPreviewProps {
  url?: string | null;
  tileStyle?: string | null;
  className?: string;
  emptyLabel?: string;
  clickLabel?: string;
  zoom?: number;
  onClick?: () => void;
}

/**
 * Read-only preview of the map that the public site will render for a given
 * Google Maps URL. Uses the same coordinate parser and tile catalogue as the
 * live Contact section so the sidebar matches the published result.
 */
export default function LocationMapPreview({
  url,
  tileStyle,
  className = "h-36 w-full",
  emptyLabel,
  clickLabel,
  zoom = 15,
  onClick,
}: LocationMapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const coords = useMemo(() => parseGoogleMapsCoords(url), [url]);

  useEffect(() => {
    if (!coords || !containerRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      import("leaflet/dist/leaflet.css");

      const iconProto = L.Icon.Default.prototype as unknown as Record<string, unknown>;
      delete iconProto._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([coords.lat, coords.lng], zoom);

      mapRef.current = map;
      L.tileLayer(TILE_URLS[tileStyle || "default"] || TILE_URLS.default, { attribution: "" }).addTo(map);
      L.marker([coords.lat, coords.lng], { interactive: false }).addTo(map);

      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coords, tileStyle, zoom]);

  if (!coords) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-center px-3`}
      >
        <MapPin className="w-4 h-4 text-sidebar-subtle-foreground shrink-0" />
        <span className="text-[10px] leading-relaxed text-sidebar-subtle-foreground">{emptyLabel}</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-lg overflow-hidden border border-border bg-muted`}>
      <div ref={containerRef} className="absolute inset-0" />
      <span className="absolute bottom-1.5 right-1.5 z-10 rounded bg-background/85 px-1.5 py-0.5 font-mono text-[9px] text-sidebar-muted-foreground pointer-events-none">
        {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
      </span>
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label={clickLabel}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        />
      )}
    </div>
  );
}
