"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Crosshair, Loader2, X, Check } from "lucide-react";

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  currentUrl?: string | null;
  onSave: (url: string) => void;
}

const DEFAULT_LAT = -6.2088;
const DEFAULT_LNG = 106.8456;

export default function LocationPicker({ open, onClose, currentUrl, onSave }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: string; lon: string; display_name: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingGeo, setDetectingGeo] = useState(false);

  // Auto-detect geolocation when popup opens
  useEffect(() => {
    if (!open || !navigator.geolocation) return;
    setDetectingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetectedCoords({ lat: latitude, lng: longitude });
        setDetectingGeo(false);
      },
      () => setDetectingGeo(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [open]);

  useEffect(() => {
    if (!open) return;

    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");

      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const fromUrl = (idx: number): number | null => {
        if (!currentUrl) return null;
        const m = currentUrl.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (!m) return null;
        const v = parseFloat(m[idx]);
        return isNaN(v) ? null : v;
      };

      const initLat = detectedCoords?.lat ?? fromUrl(1) ?? DEFAULT_LAT;
      const initLng = detectedCoords?.lng ?? fromUrl(2) ?? DEFAULT_LNG;

      const map = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([initLat, initLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(map);

      const marker = L.marker([initLat, initLng], { draggable: true }).addTo(map);

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setPosition({ lat: pos.lat, lng: pos.lng });
      });

      setPosition({ lat: initLat, lng: initLng });
      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, currentUrl, detectedCoords]);

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
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        setPosition({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => setLocating(false),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Pilih Lokasi
          </h2>
          <div className="flex items-center gap-2">
            {position && (
              <span className="text-[10px] text-gray-400 font-mono">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar — floating over the map */}
        <div className="relative">
          <div className="absolute top-3 left-3 right-3 z-10 flex gap-1.5">
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
                placeholder="Cari tempat..."
                className="w-full py-2 pl-3 pr-9 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-white/95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    searchRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={searchLocation}
              disabled={searching || !searchQuery.trim()}
              className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
            </button>
            <button
              onClick={detectLocation}
              disabled={locating}
              className="shrink-0 w-[38px] flex items-center justify-center rounded-lg bg-white/95 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-white hover:border-gray-300 disabled:opacity-40 shadow-sm transition-colors"
              title="Lokasi saya saat ini"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            </button>
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-[52px] left-3 right-[116px] z-20 bg-white border border-gray-200 rounded-lg shadow-xl max-h-44 overflow-y-auto">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goToResult(r.lat, r.lon, r.display_name)}
                  className="w-full text-left px-3.5 py-2.5 text-[12px] text-gray-600 hover:bg-emerald-50 hover:text-gray-900 border-b border-gray-100 last:border-0 transition-colors"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}

          {/* Map */}
          <div ref={mapRef} className="w-full h-[380px] bg-gray-100" />

          {/* Center instruction / detecting geo */}
          {detectingGeo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mendeteksi lokasi...
              </div>
            </div>
          )}
          {!detectingGeo && !position && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow text-sm text-gray-500">
                Klik peta untuk memilih lokasi
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50/80">
          <p className="text-[11px] text-gray-400">
            {position
              ? "Geser pin atau klik peta untuk menyesuaikan lokasi"
              : "Klik peta untuk menandai lokasi"}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!position}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
