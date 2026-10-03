"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Crosshair, Loader2, X, Check, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  currentUrl?: string | null;
  onSave: (url: string) => void;
}

const DEFAULT_LAT = -6.2088;
const DEFAULT_LNG = 106.8456;

// Helper to parse coordinates from Google Maps URL
const parseUrlCoords = (url?: string | null) => {
  if (!url) return null;
  const m = url.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
};

const TILE_STYLES: Record<string, { url: string; labelKey: string }> = {
  default: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", labelKey: "dashboard.sitesEditor.mapTileOsm" },
  cyclosm: { url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png", labelKey: "dashboard.sitesEditor.mapTileCyclOsm" },
  light:   { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", labelKey: "dashboard.sitesEditor.mapTileLight" },
  dark:    { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", labelKey: "dashboard.sitesEditor.mapTileDark" },
  esri:    { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", labelKey: "dashboard.sitesEditor.mapTileEsriStreet" },
  satelit: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", labelKey: "dashboard.sitesEditor.mapTileSatelliteLabel" },
};

export default function LocationPicker({ open, onClose, currentUrl, onSave }: LocationPickerProps) {
  const { t } = useI18n();
  const mapRef = useRef<HTMLDivElement>(null);
  const initLeafletRef = useRef<(() => void) | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: string; lon: string; display_name: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number }>(() => {
    return parseUrlCoords(currentUrl) ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  });
  const detectedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [detectingGeo, setDetectingGeo] = useState(false);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tileStyle, setTileStyle] = useState("default");
  const tileStyleRef = useRef(tileStyle);
  useEffect(() => {
    tileStyleRef.current = tileStyle;
  }, [tileStyle]);
  const tileLayerRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const syncFrameRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    // Leaflet is imported asynchronously, so it may resolve before React has
    // committed the container for this render. Bail out and let the ref callback
    // retry once the node actually exists, otherwise the first click silently
    // produces a blank map.
    const start = (L: typeof import("leaflet")) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const urlCoords = parseUrlCoords(currentUrl);
      const detected = detectedCoordsRef.current;
      const initLat = detected?.lat ?? urlCoords?.lat ?? DEFAULT_LAT;
      const initLng = detected?.lng ?? urlCoords?.lng ?? DEFAULT_LNG;

      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([initLat, initLng], 15);

      // Leaflet measures the container once at init. Inside this flex column the
      // height is still settling on first paint, which leaves the map at 0x0 and
      // the tiles never render, so re-sync until the size is actually stable.
      let syncFrame = 0;
      const syncSize = () => {
        cancelAnimationFrame(syncFrame);
        syncFrame = requestAnimationFrame(() => map.invalidateSize({ animate: false }));
        syncFrameRef.current = syncFrame;
      };

      // Read via a ref: tileStyle is applied imperatively by the effect below, so it
      // must not force this map to be torn down and rebuilt.
      const tileInfo = TILE_STYLES[tileStyleRef.current] || TILE_STYLES.default;
      const tileLayer = L.tileLayer(tileInfo.url, { attribution: "" }).addTo(map);
      tileLayerRef.current = { layer: tileLayer, map };

      // Surface tile loading so the first click shows progress instead of an
      // empty (near-black) container that reads as a broken map.
      setTilesLoading(true);
      tileLayer.on("loading", () => setTilesLoading(true));
      tileLayer.on("load", () => setTilesLoading(false));

      const marker = L.marker([initLat, initLng], { interactive: false }).addTo(map);

      map.on("move", () => {
        const center = map.getCenter();
        marker.setLatLng(center);
      });

      map.on("moveend", () => {
        const center = map.getCenter();
        setPosition({ lat: center.lat, lng: center.lng });
      });

      map.on("click", (e: any) => {
        map.panTo(e.latlng);
      });

      setPosition({ lat: initLat, lng: initLng });
      mapInstanceRef.current = map;
      markerRef.current = marker;

      // The map lives inside a flex column whose height settles after mount,
      // so watch the container and re-sync Leaflet whenever its size changes.
      const observer = new ResizeObserver(syncSize);
      observer.observe(mapRef.current);
      resizeObserverRef.current = observer;

      syncSize();
      map.whenReady(syncSize);
      tileLayer.once("load", syncSize);
    };

    initLeafletRef.current = null;

    import("leaflet").then((L) => {
      if (cancelled) return;
      initLeafletRef.current = () => start(L);
      start(L);
    });

    return () => {
      cancelled = true;
      initLeafletRef.current = null;
      cancelAnimationFrame(syncFrameRef.current);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, currentUrl]);

  // Switch tile layer when style changes
  useEffect(() => {
    const ref = tileLayerRef.current;
    if (!ref) return;
    import("leaflet").then((L) => {
      ref.map.removeLayer(ref.layer);
      const tileInfo = TILE_STYLES[tileStyle] || TILE_STYLES.default;
      const next = L.tileLayer(tileInfo.url, { attribution: "" }).addTo(ref.map);
      ref.layer = next;
      next.once("load", () => ref.map.invalidateSize({ animate: false }));
      ref.map.invalidateSize({ animate: false });
    });
  }, [tileStyle]);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&accept-language=id`
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const goToResult = (lat: string, lon: string, name: string) => {
    const latF = parseFloat(lat);
    const lngF = parseFloat(lon);
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.setView([latF, lngF], 16);
    markerRef.current.setLatLng([latF, lngF]);
    setPosition({ lat: latF, lng: lngF });
    setSearchResults([]);
    setSearchQuery(name);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        detectedCoordsRef.current = { lat: latitude, lng: longitude };
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        setPosition({ lat: latitude, lng: longitude });
        setDetectingGeo(false);
      },
      () => setDetectingGeo(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = () => {
    if (!position) return;
    const url = `https://www.google.com/maps/place/@${position.lat},${position.lng},15z`;
    onSave(url);
    onClose();
  };

  if (!open) return null;

  // Render the overlay via a portal on document.body so it is not clipped
  // by the sidebar's overflow-y-auto or CSS transform stacking context.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh] md:max-h-[85vh] my-auto border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/10 shrink-0">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {t("dashboard.sitesEditor.mapPickerTitle")}
          </h2>
          <div className="flex items-center gap-2">
            {position && (
              <span className="text-[10px] text-gray-400 dark:text-gray-400 font-mono">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar — floating over the map */}
        <div className="relative flex-1 flex flex-col">
          <div className="absolute top-3 left-3 right-3 z-[1100] flex gap-1.5">
            <div className="relative flex-1 shadow-sm">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) setSearchResults([]);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchLocation();
                  if (e.key === "Escape") {
                    setSearchResults([]);
                    searchRef.current?.blur();
                  }
                }}
                placeholder={t("dashboard.sitesEditor.mapPickerSearchPlaceholder")}
                className="w-full h-[38px] py-2 pl-3 pr-9 rounded-lg border border-gray-400 dark:border-white/40 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    searchRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                  aria-label={t("dashboard.sitesEditor.mapPickerSearchBtn")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={searchLocation}
              disabled={searching || !searchQuery.trim()}
              className={`shrink-0 h-[38px] px-4 inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm transition-colors ${
                searching || !searchQuery.trim()
                  ? "bg-emerald-800 text-white/70 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white"
              }`}
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1.5" />
                  {t("dashboard.sitesEditor.mapPickerSearchBtn")}
                </>
              )}
            </button>
            <button
              onClick={detectLocation}
              disabled={detectingGeo}
              className="shrink-0 h-[38px] w-[38px] flex items-center justify-center rounded-lg bg-white dark:bg-neutral-800 border border-gray-400 dark:border-white/40 text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-gray-500 dark:hover:border-white/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              title={t("dashboard.sitesEditor.mapPickerMyLocationAria")}
            >
              {detectingGeo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            </button>
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-[52px] left-3 right-[54px] z-[1050] bg-white dark:bg-neutral-800 border border-gray-300 dark:border-white/15 rounded-lg shadow-xl max-h-44 overflow-y-auto">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goToResult(r.lat, r.lon, r.display_name)}
                  className="w-full text-left px-3.5 py-2.5 text-[12px] text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 hover:text-gray-900 dark:hover:text-gray-100 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}

          {/* Map */}
          <div
            ref={(node) => {
              mapRef.current = node;
              // The node attaching is the only reliable signal that the container
              // exists, which is what the async Leaflet import needs.
              if (node && open) initLeafletRef.current?.();
            }}
            className={`w-full flex-1 min-h-[220px] md:min-h-[320px] bg-gray-100 dark:bg-neutral-800`}
          />

          {/* Tile loading skeleton: without this the container reads as an
              empty dark box while tiles are still in flight. */}
          {tilesLoading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
              <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">{t("dashboard.sitesEditor.mapPickerLoading")}</span>
              </div>
            </div>
          )}

          {/* Center instruction / detecting geo */}
          {detectingGeo && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t("dashboard.sitesEditor.mapPickerDetecting")}
              </div>
            </div>
          )}
          {!detectingGeo && !position && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow text-sm text-gray-500 dark:text-gray-300">
                {t("dashboard.sitesEditor.mapPickerClickHint")}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 shrink-0 gap-4">
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 scrollbar-none py-0.5">
            {(Object.keys(TILE_STYLES) as Array<keyof typeof TILE_STYLES>).map((key) => (
              <button
                key={key}
                onClick={() => setTileStyle(key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  tileStyle === key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {t(TILE_STYLES[key].labelKey)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              {t("dashboard.sitesEditor.mapPickerCancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!position}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t("dashboard.sitesEditor.mapPickerConfirm")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
