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
  /** Called with the newly chosen Google Maps URL */
  onPickLocation?: (url: string) => void;
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
          {/* Translucent overlay — intercepts map interactions so user must
              click the button rather than dragging the live preview map */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
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
              border: "none",
              background: "rgba(16,185,129,0.92)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(5,150,105,0.97)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.92)";
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
          onSave={(url) => {
            onPickLocation?.(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
