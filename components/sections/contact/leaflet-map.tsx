"use client";
import React, { useEffect, useRef, useState } from "react";

// Same tile URLs as shared.tsx TILE_STYLES
const TILE_URLS: Record<string, string> = {
  default:  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  cyclosm:  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  light:    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark:     "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  esri:     "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  satelit:  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

interface LeafletMapProps {
  style?: React.CSSProperties;
  className?: string;
  /** Tile style key — matches the editor's "Gaya Peta" options */
  tileStyle?: string | null;
  /** Extra CSS filter on top of the tile style, e.g. "grayscale(1)" */
  filter?: string;
  /** Tile opacity (0–1) */
  opacity?: number;
  zoom?: number;
  /** Invert tiles — useful for dark-background variants */
  invertTiles?: boolean;
}

/**
 * Leaflet-based map using browser geolocation (Jakarta fallback).
 * Respects the editor's "Gaya Peta" tile style setting.
 */
export default function LeafletMap({
  style,
  className,
  tileStyle,
  filter,
  opacity = 1,
  zoom = 15,
  invertTiles = false,
}: LeafletMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const mapRef = useRef<any>(null);
  const tileRef = useRef<any>(null);
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 });

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

      const map = L.map(ref.current, { zoomControl: false, scrollWheelZoom: false }).setView(
        [coords.lat, coords.lng], zoom
      );
      mapRef.current = map;

      const url = TILE_URLS[tileStyle || "default"] ?? TILE_URLS.default;
      const composedFilter = [
        invertTiles ? "grayscale(1) invert(1) hue-rotate(180deg)" : null,
        filter ?? null,
      ].filter(Boolean).join(" ");

      const layer = L.tileLayer(url, { attribution: "", opacity });
      if (composedFilter) {
        layer.on("tileload", (e) => {
          (e.tile as HTMLImageElement).style.filter = composedFilter;
        });
      }
      layer.addTo(map);
      tileRef.current = layer;

      L.marker([coords.lat, coords.lng]).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; initRef.current = false; } };
  }, [coords.lat, coords.lng]);

  // Hot-swap tile layer when tileStyle changes (editor "Gaya Peta" toggle)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    import("leaflet").then((L) => {
      map.removeLayer(tileRef.current);
      const url = TILE_URLS[tileStyle || "default"] ?? TILE_URLS.default;
      const layer = L.tileLayer(url, { attribution: "", opacity });
      layer.addTo(map);
      tileRef.current = layer;
    });
  }, [tileStyle]);

  return <div ref={ref} style={{ width: "100%", height: "100%", ...style }} className={className} />;
}
