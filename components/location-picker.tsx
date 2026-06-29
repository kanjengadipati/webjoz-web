"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, Crosshair, Loader2, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ lat: string; lon: string; display_name: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const initLat = DEFAULT_LAT;
    const initLng = DEFAULT_LNG;

    // Load Leaflet dynamically (client only)
    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([initLat, initLng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
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

      // Try to parse existing URL for initial position
      if (currentUrl) {
        const coordMatch = currentUrl.match(/@?(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          const lat = parseFloat(coordMatch[1]);
          const lng = parseFloat(coordMatch[2]);
          if (!isNaN(lat) && !isNaN(lng)) {
            map.setView([lat, lng], 15);
            marker.setLatLng([lat, lng]);
            setPosition({ lat, lng });
          }
        }
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, currentUrl]);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const goToResult = (lat: string, lon: string) => {
    const latF = parseFloat(lat);
    const lngF = parseFloat(lon);
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.setView([latF, lngF], 16);
    markerRef.current.setLatLng([latF, lngF]);
    setPosition({ lat: latF, lng: lngF });
    setSearchResults([]);
    setSearchQuery("");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 w-[90vw] max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Pilih Lokasi
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative px-4 pt-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                placeholder="Cari tempat, jalan, kota..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500 outline-none focus:border-primary/50"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
            </div>
            <button
              onClick={searchLocation}
              disabled={searching}
              className="px-3 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
            </button>
            <button
              onClick={detectLocation}
              disabled={locating}
              className="px-3 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50"
              title="Deteksi lokasi saya"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            </button>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 top-full mt-1 z-10 bg-[#22223b] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goToResult(r.lat, r.lon)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/5 border-b border-white/5 last:border-0"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 m-4 min-h-[350px] rounded-xl overflow-hidden">
          <div ref={mapRef} className="w-full h-[350px]" />

          <style>{`${`.leaflet-container { background: #1a1a2e; border-radius: 0.75rem; }`}`}</style>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
          <p className="text-[11px] text-slate-500">
            {position
              ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
              : "Klik peta untuk memilih lokasi"}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-white/5">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!position}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-40"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
