"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Trash2, Check, ExternalLink, Globe } from "lucide-react";
import {
  SocialIcon,
  SocialPlatformSelect,
  getSocialPlatformDef,
  SOCIAL_PLATFORMS,
} from "../social-platforms";

export interface SocialLinkItem {
  platform: string;
  url: string;
}

interface InlineSocialEditorProps {
  links: SocialLinkItem[];
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  defaultColor?: string;
  hoverColor?: string;
  iconSize?: number;
  pill?: boolean;
  labelClass?: string;
  containerClassName?: string;
}

export default function InlineSocialEditor({
  links = [],
  onUpdateField,
  isEditorMode = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  defaultColor,
  hoverColor,
  iconSize = 14,
  pill = false,
  labelClass,
  containerClassName = "flex flex-wrap items-center gap-2.5",
}: InlineSocialEditorProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const [isCustomPlatform, setIsCustomPlatform] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    if (activeIndex === null && !isAddingNew) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        closePopover();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, isAddingNew]);

  const openEdit = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    collapseSheetForInlineEdit?.();
    onEditingStateChange?.(true);

    const item = links[index];
    const platform = item?.platform || "instagram";
    const isCustom = !getSocialPlatformDef(platform);

    setActiveIndex(index);
    setIsAddingNew(false);
    setEditingPlatform(platform);
    setIsCustomPlatform(isCustom);
    setEditingUrl(item?.url || "");

    setTimeout(() => urlInputRef.current?.focus(), 50);
  };

  const openAddNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    collapseSheetForInlineEdit?.();
    onEditingStateChange?.(true);

    setActiveIndex(null);
    setIsAddingNew(true);
    setEditingPlatform("instagram");
    setIsCustomPlatform(false);
    setEditingUrl("https://instagram.com/");

    setTimeout(() => urlInputRef.current?.focus(), 50);
  };

  const closePopover = () => {
    setActiveIndex(null);
    setIsAddingNew(false);
    onEditingStateChange?.(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const platformName = (editingPlatform || "instagram").trim();
    let url = (editingUrl || "").trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    let updated = [...links];
    if (isAddingNew) {
      updated.push({ platform: platformName, url });
    } else if (activeIndex !== null && activeIndex >= 0 && activeIndex < links.length) {
      updated[activeIndex] = { platform: platformName, url };
    }

    onUpdateField?.("footer", "social_links", updated);
    closePopover();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeIndex !== null && activeIndex >= 0 && activeIndex < links.length) {
      const updated = links.filter((_, i) => i !== activeIndex);
      onUpdateField?.("footer", "social_links", updated);
    }
    closePopover();
  };

  // If in preview mode (not editor), render standard links
  if (!isEditorMode) {
    if (links.length === 0) return null;
    return (
      <div className={containerClassName}>
        {links.map((link, i) => {
          const def = getSocialPlatformDef(link.platform);
          const label = def?.label || link.platform;
          if (pill) {
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--dt-radius)] border border-white/10 bg-muted/40 transition-all hover:bg-white/[0.08] hover:border-border"
                style={{ color: defaultColor || "var(--dt-text)" }}
                title={label}
              >
                <SocialIcon platform={link.platform} size={iconSize} />
                <span className={labelClass || "text-[11px]"}>{label}</span>
              </a>
            );
          }
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: defaultColor }}
              onMouseEnter={(e) => {
                if (hoverColor) e.currentTarget.style.color = hoverColor;
              }}
              onMouseLeave={(e) => {
                if (defaultColor) e.currentTarget.style.color = defaultColor;
              }}
              title={label}
            >
              <SocialIcon platform={link.platform} size={iconSize} />
              <span className={labelClass}>{label}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // In Editor Mode: Interactive items with popover
  const showPopover = activeIndex !== null || isAddingNew;

  return (
    <div className="relative">
      <div className={containerClassName}>
        {links.map((link, i) => {
          const def = getSocialPlatformDef(link.platform);
          const label = def?.label || link.platform;
          const isCurrentActive = activeIndex === i;

          if (pill) {
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => openEdit(i, e)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--dt-radius)] border transition-all cursor-pointer ${
                  isCurrentActive
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                    : "border-white/10 bg-muted/40 hover:border-primary/50 hover:bg-white/[0.08]"
                }`}
                style={{ color: defaultColor || "var(--dt-text)" }}
                title={`Klik untuk edit ${label}`}
              >
                <SocialIcon platform={link.platform} size={iconSize} />
                <span className={labelClass || "text-[11px]"}>{label}</span>
              </button>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={(e) => openEdit(i, e)}
              className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                isCurrentActive
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "hover:bg-white/10"
              }`}
              style={{ color: isCurrentActive ? undefined : defaultColor }}
              title={`Klik untuk edit ${label}`}
            >
              <SocialIcon platform={link.platform} size={iconSize} />
              <span className={labelClass}>{label}</span>
            </button>
          );
        })}

        {/* Add Button */}
        <button
          type="button"
          onClick={openAddNew}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border border-dashed border-border/80 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/70 hover:bg-primary/5 transition-all cursor-pointer"
          title="Tambah Media Sosial"
        >
          <Plus className="w-3 h-3 text-primary" />
          <span>{links.length === 0 ? "Tambah Media Sosial" : "Tambah"}</span>
        </button>
      </div>

      {/* Inline Popover Editor */}
      {showPopover && (
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 bottom-full mb-2 z-50 w-72 max-w-[90vw] rounded-xl border border-border/80 bg-popover text-popover-foreground p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            boxShadow: "0 16px 40px -8px rgba(0,0,0,0.4), 0 0 0 1px var(--border)",
          }}
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border/60">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              {isAddingNew ? (
                <>
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  Tambah Media Sosial
                </>
              ) : (
                <>
                  <SocialIcon platform={editingPlatform} size={14} className="text-primary" />
                  Edit Media Sosial
                </>
              )}
            </span>
            <button
              type="button"
              onClick={closePopover}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-2.5">
            {/* Platform Selection */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Platform
              </label>
              {isCustomPlatform ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editingPlatform}
                    onChange={(e) => setEditingPlatform(e.target.value)}
                    placeholder="Nama platform (cth. Threads)"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomPlatform(false);
                      setEditingPlatform("instagram");
                    }}
                    className="text-[11px] text-muted-foreground hover:text-foreground px-1.5 py-1"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg border border-border bg-muted/30 flex items-center justify-center shrink-0">
                    {getSocialPlatformDef(editingPlatform) ? (
                      <SocialIcon platform={editingPlatform} size={15} />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <SocialPlatformSelect
                    value={editingPlatform}
                    onChange={(v) => {
                      if (v === "__custom__") {
                        setIsCustomPlatform(true);
                        setEditingPlatform("");
                      } else {
                        setEditingPlatform(v);
                        // Autofill URL prefix if empty or matching default
                        if (!editingUrl || editingUrl.startsWith("https://")) {
                          const def = SOCIAL_PLATFORMS[v];
                          if (def) {
                            setEditingUrl(`https://${v}.com/`);
                          }
                        }
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tautan / URL
              </label>
              <input
                ref={urlInputRef}
                type="text"
                value={editingUrl}
                onChange={(e) => setEditingUrl(e.target.value)}
                placeholder="https://instagram.com/akun"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-border/50">
              {!isAddingNew ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400 py-1 px-1.5 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Hapus media sosial ini"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={closePopover}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium rounded-lg bg-primary text-primary-foreground hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-3 h-3" />
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
