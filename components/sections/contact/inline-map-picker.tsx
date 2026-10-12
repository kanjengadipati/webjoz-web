"use client";
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import LeafletMap from "./leaflet-map";
import dynamic from "next/dynamic";

// LocationPicker is heavy (Leaflet + portal) — lazy-load it
const LocationPicker = dynamic(() => import("@/components/location-picker"), {
  ssr: false,
});

interface InlineMapPickerProps {
  mapsUrl?: string | null;
  tileStyle?: string | null;
  filter?: string;
  invertTiles?: boolean;
  opacity?: number;
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
  /** Shown in editor mode to let user change the pin */
  isEditorMode?: boolean;
  /** Called with the newly chosen Google Maps URL + tile style */
  onPickLocation?: (url: string, tileStyle: string) => void;
  language?: "id" | "en";
}

/**
 * LeafletMap + an editor-mode "Pilih Lokasi" overlay button.
 * Self-contained: manages its own LocationPicker modal state.
 */
export default function InlineMapPicker({
  mapsUrl,
  tileStyle,
  filter,
  invertTiles,
  opacity,
  zoom,
  style,
  className,
  isEditorMode,
  onPickLocation,
  language = "id",
}: InlineMapPickerProps) {
  const [open, setOpen] = useState(false);
  const isEN = language === "en";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <LeafletMap
        mapsUrl={mapsUrl}
        tileStyle={tileStyle}
        filter={filter}
        invertTiles={invertTiles}
        opacity={opacity}
        zoom={zoom}
        style={style}
        className={className}
      />

      {isEditorMode && onPickLocation && (
        <>
          {/* Translucent overlay — whole map is clickable to open the picker
              and also intercepts map drag/zoom so users don't fight the live map */}
          <div
            role="button"
            aria-label={isEN ? "Edit location" : "Edit lokasi"}
            title={isEN ? "Edit location" : "Edit lokasi"}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          />

          {/* Pill button centred on the map */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "#09090b",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
              transition: "background 0.15s, border-color 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#18181b";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.45)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#09090b";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1)";
            }}
          >
            <MapPin style={{ width: 14, height: 14 }} />
            {isEN ? "Pick Location" : "Pilih Lokasi"}
          </button>
        </>
      )}

      {open && (
        <LocationPicker
          open={open}
          onClose={() => setOpen(false)}
          currentUrl={mapsUrl}
          tileStyle={tileStyle ?? undefined}
          onSave={(url, ts) => {
            onPickLocation?.(url, ts);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
