"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { SidebarField } from "@/components/sidebar-field";
import LocationPicker from "@/components/location-picker";
import LocationMapPreview from "@/components/location-map-preview";
import { getEnabledMapTiles } from "@/lib/design-assets-config";
import { request } from "@/lib/api/client";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

const ALL_MAP_TILES = [
  { key: "default", label: "OSM" },
  { key: "cyclosm", label: "CyclOSM" },
  { key: "light", label: "Terang" },
  { key: "dark", label: "Gelap" },
  { key: "esri", label: "Esri" },
  { key: "satelit", label: "Satelit" },
];

const MAP_TILE_I18N_KEYS: Record<string, string> = {
  light: "dashboard.sitesEditor.mapTileLight",
  dark: "dashboard.sitesEditor.mapTileDark",
  satelit: "dashboard.sitesEditor.mapTileSatellite",
};

export function ContactSectionForm({
  content,
  updateField,
  needsAttention,
  fieldClass,
  fieldUndoStacks,
  undoField,
  token,
}: BaseSectionFormProps) {
  const { t } = useI18n();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [resolvingMaps, setResolvingMaps] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  if (!content.contact) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.contactContentAlign")}
        </label>
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {[
            { value: "left", label: t("dashboard.sitesEditor.commonLeft") },
            { value: "center", label: t("dashboard.sitesEditor.commonCenter") },
            { value: "right", label: t("dashboard.sitesEditor.commonRight") },
          ].map((option) => {
            const active = (content.contact.align || "center") === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("contact", "align", option.value)}
                className={`rounded-md px-2 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <SidebarField
        section="contact"
        fieldKey="title"
        label={t("dashboard.sitesEditor.contactTitle")}
        needsAttention={needsAttention("contact.title")}
        value={content.contact.title || ""}
        onChange={(val) => updateField("contact", "title", val)}
        undoCount={fieldUndoStacks?.["contact.title"]?.length}
        onUndo={() => undoField?.("contact", "title")}
      />
      <SidebarField
        section="contact"
        fieldKey="address"
        label={`${t("dashboard.sitesEditor.contactAddress")} (${t("dashboard.sitesEditor.commonOptional")})`}
        value={content.contact.address || ""}
        onChange={(val) => updateField("contact", "address", val)}
        undoCount={fieldUndoStacks?.["contact.address"]?.length}
        onUndo={() => undoField?.("contact", "address")}
      />
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.contactPhone")}{" "}
          <span className="text-sidebar-subtle-foreground normal-case font-normal">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>{" "}
          {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
        </label>
        <input
          id="field-contact.phone"
          type="text"
          value={content.contact.phone || ""}
          onChange={(e) => {
            const val = e.target.value;
            updateField("contact", "phone", val);
            const digits = val.replace(/\D/g, "");
            if (digits) {
              let formattedDigits = digits;
              if (formattedDigits.startsWith("0")) {
                formattedDigits = "62" + formattedDigits.slice(1);
              }
              if (/wa\.me|whatsapp\.com/i.test(content.hero?.cta_url || "")) {
                updateField("hero", "cta_url", `https://wa.me/${formattedDigits}`);
              }
              if (/wa\.me|whatsapp\.com/i.test(content.cta?.button_url || "")) {
                updateField("cta", "button_url", `https://wa.me/${formattedDigits}`);
              }
            }
          }}
          className={fieldClass("contact.phone", SIDEBAR_FIELD_CLASS)}
        />
        <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
          {t("dashboard.sitesEditor.contactPhoneHint")}
        </p>
      </div>
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.contactEmail")}{" "}
          <span className="text-sidebar-subtle-foreground normal-case font-normal">
            {t("dashboard.sitesEditor.commonOptional")}
          </span>
        </label>
        <input
          id="field-contact.email"
          type="email"
          value={content.contact.email || ""}
          onChange={(e) => updateField("contact", "email", e.target.value)}
          className={fieldClass("contact.email", SIDEBAR_FIELD_CLASS)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
        <span className="text-[12px] font-medium text-sidebar-foreground">
          {t("dashboard.sitesEditor.contactShowForm")}
        </span>
        <input
          type="checkbox"
          checked={content.contact.show_lead_form !== false}
          onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
        <span className="text-[12px] font-medium text-sidebar-foreground">
          {t("dashboard.sitesEditor.contactShowMap")}
        </span>
        <input
          type="checkbox"
          checked={content.contact.show_map !== false}
          onChange={(e) => updateField("contact", "show_map", e.target.checked)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5">
        <span className="text-[12px] font-medium text-sidebar-foreground">
          {t("dashboard.sitesEditor.contactShowWhatsAppCard")}
        </span>
        <input
          type="checkbox"
          checked={content.contact.show_whatsapp_card !== false}
          onChange={(e) => updateField("contact", "show_whatsapp_card", e.target.checked)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      </div>
      <div className="rounded-lg border border-border bg-muted/40 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-sidebar-foreground">
            {t("dashboard.sitesEditor.mapStyleLabel")}
          </span>
          <span className="text-[10px] text-sidebar-subtle-foreground truncate">
            {getEnabledMapTiles(ALL_MAP_TILES.map((o) => o.key)).length} {t("dashboard.sitesEditor.optionsCount")}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {getEnabledMapTiles(ALL_MAP_TILES.map((o) => o.key)).map((key) => {
            const opt = ALL_MAP_TILES.find((o) => o.key === key)!;
            const active = (content.contact.map_tile_style || "default") === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => updateField("contact", "map_tile_style", opt.key)}
                aria-pressed={active}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                }`}
              >
                {MAP_TILE_I18N_KEYS[opt.key] ? t(MAP_TILE_I18N_KEYS[opt.key]) : opt.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          Link Google Maps <span className="text-sidebar-subtle-foreground normal-case font-normal">(opsional)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="field-contact.maps_url"
            type="url"
            value={content.contact.maps_url || ""}
            onChange={(e) => {
              updateField("contact", "maps_url", e.target.value);
              setResolveError(null);
            }}
            placeholder="https://www.google.com/maps/embed?pb=... atau share link Google Maps"
            className="flex-1 w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-sidebar-foreground placeholder-sidebar-subtle-foreground"
          />
          <button
            type="button"
            onClick={() => setShowLocationPicker(true)}
            className="shrink-0 px-3 py-1.5 rounded-md text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title={t("dashboard.sitesEditor.pickLocation")}
          >
            {t("dashboard.sitesEditor.pickLocation")}
          </button>
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.mapPreviewLabel")}
          </label>
          <LocationMapPreview
            url={content.contact.maps_url}
            tileStyle={content.contact.map_tile_style}
            emptyLabel={t("dashboard.sitesEditor.mapPreviewEmpty")}
            clickLabel={t("dashboard.sitesEditor.mapPreviewEditAria")}
            onClick={() => setShowLocationPicker(true)}
          />
        </div>

        {/* Form position layout selector */}
        <div className="space-y-1 pt-2">
          <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.contactFormLayout")}
          </label>
          <div className="flex flex-wrap gap-1">
            {([
              { value: "right", label: t("dashboard.sitesEditor.contactFormLayoutInfoLeft") },
              { value: "left", label: t("dashboard.sitesEditor.contactFormLayoutFormLeft") },
              { value: "stack", label: t("dashboard.sitesEditor.contactFormLayoutStack") },
            ] as const).map((opt) => {
              const active = (content.contact.form_position || "right") === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("contact", "form_position", opt.value)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
            {t("dashboard.sitesEditor.contactFormLayoutHint")}
          </p>
        </div>

        {/* Map layout selector */}
        <div className="space-y-1 pt-2">
          <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.contactMapLayout")}
          </label>
          <div className="flex flex-wrap gap-1">
            {([
              { value: "inline", label: t("dashboard.sitesEditor.contactMapLayoutInline") },
              { value: "full", label: t("dashboard.sitesEditor.contactMapLayoutFull") },
            ] as const).map((opt) => {
              const active = (content.contact.map_layout || "inline") === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("contact", "map_layout", opt.value)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
            {t("dashboard.sitesEditor.contactMapLayoutHint")}
          </p>
        </div>

        <div className="flex gap-2 mt-1.5">
          <button
            type="button"
            onClick={async () => {
              const url = content.contact.maps_url?.trim();
              if (!url || !/goo\.gl|maps\.app\.goo/.test(url)) return;
              setResolvingMaps(true);
              try {
                const res = await request<{ embed_url: string; final_url: string; google_maps_url: string }>(
                  `/ai/public/resolve-maps-url?url=${encodeURIComponent(url)}`,
                  undefined,
                  token ?? undefined
                );
                if (res.data?.google_maps_url) {
                  updateField("contact", "maps_url", res.data.google_maps_url);
                }
              } catch {
                setResolveError(t("dashboard.sitesEditor.contactResolveError"));
              } finally {
                setResolvingMaps(false);
              }
            }}
            disabled={resolvingMaps || !/goo\.gl|maps\.app\.goo/.test(content.contact.maps_url || "")}
            className="shrink-0 px-3 py-1.5 rounded-md text-[12px] font-medium border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {resolvingMaps ? "..." : "Resolve"}
          </button>
        </div>
        {content.contact.maps_url &&
          !/\/maps\/embed\?pb=|openstreetmap\.org\/export/.test(content.contact.maps_url) &&
          !/@?(-?\d+\.\d+),(-?\d+\.\d+)/.test(content.contact.maps_url) && (
            <p className="text-[10px] text-amber-400 leading-relaxed">
              {t("dashboard.sitesEditor.contactInvalidMapLink")}
            </p>
          )}
        {resolveError && <p className="text-[10px] text-red-400 leading-relaxed">{resolveError}</p>}
        <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
          {t("dashboard.sitesEditor.contactMapsLinkHint")}
        </p>

        <LocationPicker
          open={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          currentUrl={content.contact.maps_url}
          tileStyle={content.contact.map_tile_style}
          onSave={(url, tileStyle) => {
            updateField("contact", "maps_url", url);
            updateField("contact", "map_tile_style", tileStyle);
          }}
        />
      </div>
    </div>
  );
}

