"use client";
import React, { useEffect, useRef, useState } from "react";

interface LeafletMapProps {
  style?: React.CSSProperties;
  className?: string;
  /** CSS filter applied to the map tiles, e.g. "grayscale(1)" */
  filter?: string;
  /** CSS opacity for the tile layer */
  opacity?: number;
  zoom?: number;
  /** If true, invert the tiles (for dark backgrounds) */
  invertTiles?: boolean;
}

/**
 * Leaflet-based map that uses browser geolocation (Jakarta fallback).
 * Drop-in replacement for Google Maps <iframe> — no API key needed.
 */
export default function LeafletMap({
  style,
  className,
  filter,
  opacity = 1,
  zoom = 15,
  invertTiles = false,
}: LeafletMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 }); // Jakarta fallback

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

      // Fix default icon paths (bundler strips them)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const tileFilter = [
        invertTiles ? "grayscale(1) invert(1) hue-rotate(180deg)" : null,
        filter,
      ]
        .filter(Boolean)
        .join(" ");

      const map = L.map(ref.current, { zoomControl: false, scrollWheelZoom: false }).setView(
        [coords.lat, coords.lng],
        zoom
      );

      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
        opacity,
      });

      if (tileFilter) {
        tileLayer.on("tileload", (e) => {
          (e.tile as HTMLImageElement).style.filter = tileFilter;
        });
      }

      tileLayer.addTo(map);
      L.marker([coords.lat, coords.lng]).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);

      return () => map.remove();
    });
  }, [coords.lat, coords.lng]);

  return <div ref={ref} style={{ width: "100%", height: "100%", ...style }} className={className} />;
}
