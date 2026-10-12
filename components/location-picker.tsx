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
  /** Current tile style from content — the picker starts/selects from it */
  tileStyle?: string;
  onSave: (url: string, tileStyle: string) => void;
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

export default function LocationPicker({ open, onClose, currentUrl, tileStyle: initialTileStyle, onSave }: LocationPickerProps) {
  const { t } = useI18n();
  const mapRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropDown = useRef(false);
  const initLeafletRef = useRef<(() => void) | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: string; lon: string; display_name: string }>>([]);
  const [activeResult, setActiveResult] = useState(0);
  // Mirrors dropdown visibility for the document-level Escape handler. A DOM ref
  // is not usable here: React unmounts the dropdown before that listener runs,
  // which would make the ref null and skip the "dropdown still open" check.
  const dropdownOpenRef = useRef(false);
  useEffect(() => {
    dropdownOpenRef.current = searchResults.length > 0;
  }, [searchResults]);
  // Arrow keys move aria-activedescendant without moving DOM focus, so the listbox
  // has to be scrolled by hand or the active option ends up outside the viewport.
  useEffect(() => {
    if (searchResults.length === 0) return;
    document
      .getElementById(`map-picker-result-${activeResult}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeResult, searchResults.length]);
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number }>(() => {
    return parseUrlCoords(currentUrl) ?? { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  });
  const detectedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [detectingGeo, setDetectingGeo] = useState(false);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tileStyle, setTileStyle] = useState(initialTileStyle ?? "default");
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

      const urlCoords = parseUrlCoords(currentUrl);
      const detected = detectedCoordsRef.current;
      const initLat = detected?.lat ?? urlCoords?.lat ?? DEFAULT_LAT;
      const initLng = detected?.lng ?? urlCoords?.lng ?? DEFAULT_LNG;

      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([initLat, initLng], 15);

      let syncFrame = 0;
      const syncSize = () => {
        cancelAnimationFrame(syncFrame);
        syncFrame = requestAnimationFrame(() => map.invalidateSize({ animate: false }));
        syncFrameRef.current = syncFrame;
      };

      const tileInfo = TILE_STYLES[tileStyleRef.current] || TILE_STYLES.default;
      const tileLayer = L.tileLayer(tileInfo.url, { attribution: "" }).addTo(map);
      tileLayerRef.current = { layer: tileLayer, map };

      setTilesLoading(true);
      tileLayer.on("loading", () => setTilesLoading(true));
      tileLayer.on("load", () => setTilesLoading(false));

      const monoMarkerIcon = L.divIcon({
        className: "!bg-transparent !border-none",
        html: `
          <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; pointer-events: none;">
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
              <path d="M14 0C6.268 0 0 6.268 0 14c0 10.2 14 22 14 22s14-11.8 14-22c0-7.732-6.268-14-14-14z" fill="#09090b" stroke="#ffffff" stroke-width="2"/>
              <circle cx="14" cy="14" r="4.5" fill="#ffffff"/>
            </svg>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([initLat, initLng], { icon: monoMarkerIcon, interactive: false }).addTo(map);

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
      setActiveResult(0);
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
    onSave(url, tileStyle);
    onClose();
  };

  // Render the overlay via a portal on document.body so it is not clipped
  // by the sidebar's overflow-y-auto or CSS transform stacking context.
  // Backdrop click closes, but only when the press started on the backdrop itself
  // so dragging a map or selecting text does not dismiss the picker.
  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) backdropDown.current = true;
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && backdropDown.current) onClose();
    backdropDown.current = false;
  };

  // Escape closes the dialog, and Tab is trapped inside it. When the results
  // dropdown is open, Escape clears it first (handled by the input's own keydown)
  // and focus should land on the search field so the picker is keyboard-usable.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (dropdownOpenRef.current) {
          setSearchResults([]);
          searchRef.current?.focus();
          return;
        }
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (activeEl === first || !dialogRef.current?.contains(activeEl))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

    if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("dashboard.sitesEditor.mapPickerTitle")}
        className="bg-neutral-950 text-neutral-100 rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh] md:max-h-[85vh] my-auto border border-neutral-800 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 shrink-0 bg-neutral-950">
          <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" />
            {t("dashboard.sitesEditor.mapPickerTitle")}
          </h2>
          <div className="flex items-center gap-2.5">
            {position && (
              <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            )}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar — floating over the map */}
        <div className="relative flex-1 flex flex-col">
          <div className="absolute top-3 left-3 right-3 z-[1100] flex gap-2">
            <div className="relative flex-1">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveResult(0);
                  if (!e.target.value) setSearchResults([]);
                }}
                onKeyDown={(e) => {
                  const count = searchResults.length;
                  if (count > 0) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveResult((i) => (i + 1) % count);
                      return;
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveResult((i) => (i - 1 + count) % count);
                      return;
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const picked = searchResults[activeResult];
                      if (picked) {
                        goToResult(picked.lat, picked.lon, picked.display_name);
                        return;
                      }
                    }
                  }
                  if (e.key === "Enter") searchLocation();
                }}
                role="combobox"
                aria-expanded={searchResults.length > 0}
                aria-autocomplete="list"
                aria-controls="map-picker-results"
                aria-activedescendant={searchResults.length > 0 ? `map-picker-result-${activeResult}` : undefined}
                placeholder={t("dashboard.sitesEditor.mapPickerSearchPlaceholder")}
                className="w-full h-10 py-2 pl-3.5 pr-9 rounded-lg border border-neutral-700/80 text-sm text-white placeholder-neutral-500 bg-neutral-900/95 backdrop-blur-md focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    searchRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-white transition-colors"
                  aria-label={t("dashboard.sitesEditor.mapPickerSearchBtn")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={searchLocation}
              disabled={searching || !searchQuery.trim()}
              className={`shrink-0 h-10 px-4 inline-flex items-center justify-center rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                searching || !searchQuery.trim()
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
                  : "bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300"
              }`}
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  {t("dashboard.sitesEditor.mapPickerSearchBtn")}
                </>
              )}
            </button>
            <button
              onClick={detectLocation}
              disabled={detectingGeo}
              className="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={t("dashboard.sitesEditor.mapPickerMyLocationAria")}
            >
              {detectingGeo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            </button>
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div
              id="map-picker-results"
              role="listbox"
              tabIndex={-1}
              className="absolute top-[56px] left-3 right-[58px] z-[1050] bg-neutral-900/98 backdrop-blur-md border border-neutral-800 rounded-lg max-h-44 overflow-y-auto"
            >
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  id={`map-picker-result-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === activeResult}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveResult(i)}
                  onClick={() => goToResult(r.lat, r.lon, r.display_name)}
                  className={`w-full text-left px-3.5 py-2.5 text-[12px] border-b border-neutral-800/60 last:border-0 transition-colors ${
                    i === activeResult
                      ? "bg-neutral-800 text-white font-medium"
                      : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
                  }`}
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
            className="w-full flex-1 min-h-[260px] md:min-h-[340px] bg-neutral-950"
          />

          {/* Tile loading skeleton */}
          {tilesLoading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-neutral-950">
              <div className="flex flex-col items-center gap-2 text-neutral-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">{t("dashboard.sitesEditor.mapPickerLoading")}</span>
              </div>
            </div>
          )}

          {/* Center instruction / detecting geo */}
          {detectingGeo && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
              <div className="bg-neutral-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-800 text-sm text-neutral-200 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t("dashboard.sitesEditor.mapPickerDetecting")}
              </div>
            </div>
          )}
          {!detectingGeo && !position && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-neutral-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-neutral-800 text-sm text-neutral-300">
                {t("dashboard.sitesEditor.mapPickerClickHint")}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 bg-neutral-950 shrink-0 gap-3">
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 scrollbar-none py-0.5">
            {(Object.keys(TILE_STYLES) as Array<keyof typeof TILE_STYLES>).map((key) => (
              <button
                key={key}
                onClick={() => setTileStyle(key)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  tileStyle === key
                    ? "bg-white text-neutral-950 font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/70"
                }`}
              >
                {t(TILE_STYLES[key].labelKey)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              {t("dashboard.sitesEditor.mapPickerCancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={!position}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-white text-neutral-950 hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              {t("dashboard.sitesEditor.mapPickerConfirm")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
