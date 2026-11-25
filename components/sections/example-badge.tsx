"use client";
import React from "react";

/**
 * Marks a section whose content is still a system-generated sample ("_is_example").
 * Editor-only: the public site never renders sample sections, and the server drops
 * them on publish until the user edits them.
 */
export function ExampleBadgeWrap({
  show,
  language,
  children,
}: {
  show: boolean;
  language?: string;
  children: React.ReactNode;
}) {
  if (!show) return <>{children}</>;
  const isEN = (language || "id").toLowerCase().startsWith("en");
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 20,
          pointerEvents: "none",
          padding: "3px 10px",
          borderRadius: 999,
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #f59e0b",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.4,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      >
        {isEN ? "Sample \u2014 edit it, or it won't be published" : "Contoh \u2014 edit, atau tidak akan tayang"}
      </div>
      {children}
    </div>
  );
}
