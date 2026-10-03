"use client";
import React, { useEffect, useRef } from "react";

// Same tile URLs as shared.tsx TILE_STYLES
export const TILE_URLS: Record<string, string> = {
  default:  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  cyclosm:  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  light:    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  dark:     "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
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
  /** Google Maps URL chosen in the editor; its coordinates drive the map */
  mapsUrl?: string | null;
  /** Explicit coordinates; takes precedence over mapsUrl when both are given */
  lat?: number;
  lng?: number;
}

const FALLBACK = { lat: -6.2088, lng: 106.8456 };

function parseCoords(url?: string | null): { lat: number; lng: number } | null {
  if (!url) return null;
  const m = url.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

/**
 * Leaflet-based map centred on the location picked in the editor.
 * Falls back to Jakarta when no location has been chosen yet, and follows the
 * URL when it changes. Respects the editor's "Gaya Peta" tile style setting.
 */
export default function LeafletMap({
  style,
  className,
  tileStyle,
  filter,
  opacity = 1,
  zoom = 15,
  invertTiles = false,
  mapsUrl,
  lat,
  lng,
}: LeafletMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const mapRef = useRef<any>(null);
  const tileRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const coords =
    lat !== undefined && lng !== undefined ? { lat, lng } : parseCoords(mapsUrl) || FALLBACK;

  useEffect(() => {
    if (!ref.current || initRef.current) return;
    initRef.current = true;
    let sizeTimer: ReturnType<typeof setTimeout> | null = null;

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

      markerRef.current = L.marker([coords.lat, coords.lng]).addTo(map);
      sizeTimer = setTimeout(() => { if (mapRef.current) map.invalidateSize(); }, 200);
    });

    return () => {
      if (sizeTimer !== null) clearTimeout(sizeTimer);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; initRef.current = false; }
    };
    // Deliberately mount-once: including the visual props here would tear the
    // map down on every tile-style or filter tweak. They are applied by the
    // effects below instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lng]);

  // Init is mount-once, so a location picked after mount has to be applied
  // imperatively or the map stays on the previous centre.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([coords.lat, coords.lng], map.getZoom(), { animate: false });
    markerRef.current?.setLatLng([coords.lat, coords.lng]);
  }, [coords.lat, coords.lng]);

  // Hot-swap tile layer when tileStyle changes (editor "Gaya Peta" toggle)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    import("leaflet").then((L) => {
      map.removeLayer(tileRef.current);
      const url = TILE_URLS[tileStyle || "default"] ?? TILE_URLS.default;
      const layer = L.tileLayer(url, { attribution: "", opacity });
      // Reapply the composed filter, otherwise swapping tiles drops the
      // grayscale/invert treatment the variant relies on.
      const composedFilter = [
        invertTiles ? "grayscale(1) invert(1) hue-rotate(180deg)" : null,
        filter ?? null,
      ].filter(Boolean).join(" ");
      if (composedFilter) {
        layer.on("tileload", (e) => {
          (e.tile as HTMLImageElement).style.filter = composedFilter;
        });
      }
      layer.addTo(map);
      tileRef.current = layer;
    });
    // opacity/filter/invertTiles are read above; tileStyle is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileStyle]);

  return <div ref={ref} style={{ width: "100%", height: "100%", ...style }} className={className} />;
}
