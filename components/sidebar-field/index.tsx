"use client";

import React, { useState, useRef, useEffect } from "react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Loader2, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SIDEBAR_FIELD_CLASS } from "@/lib/editor-field-class";

// ─── Global AI Rewrite Singleton for Sidebar ─────────────────────────────────

type SidebarAiRewriteFn = (
  section: string,
  fieldKey: string,
  currentValue: string
) => Promise<string>;

let _globalSidebarAiRewrite: SidebarAiRewriteFn | null = null;

export function setSidebarAiRewrite(fn: SidebarAiRewriteFn | null) {
  _globalSidebarAiRewrite = fn;
}

export function getSidebarAiRewrite(): SidebarAiRewriteFn | null {
  return _globalSidebarAiRewrite;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AI_MIN_WORDS = 4;

function cleanAiText(raw: string): string {
  let cleaned = raw.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface SidebarFieldProps {
  section: string;
  fieldKey: string;
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  needsAttention?: boolean;
  hint?: string;
  disabled?: boolean;
  id?: string;
  undoCount?: number;
  onUndo?: () => void;
  rightAction?: React.ReactNode;
  onAiRewrite?: (section: string, fieldKey: string, currentValue: string) => Promise<string>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SidebarField({
  section,
  fieldKey,
  value = "",
  onChange,
  label,
  placeholder,
  multiline = false,
  rows = 3,
  maxLength,
  className = "",
  inputClassName = "",
  needsAttention = false,
  hint,
  disabled = false,
  id,
  undoCount,
  onUndo,
  rightAction,
  onAiRewrite,
}: SidebarFieldProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const isInteractingWithAiButtonRef = useRef(false);

  const [isFocused, setIsFocused] = useState(false);
  const [aiWriting, setAiWriting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const currentValue = value ?? "";
  const wordCount = currentValue.trim().split(/\s+/).filter(Boolean).length;

  const rewriteFn = onAiRewrite || _globalSidebarAiRewrite;
  const canRewrite = !!rewriteFn && (multiline || wordCount >= AI_MIN_WORDS);
  const showAiBadge = canRewrite && (isFocused || aiWriting);

  // Auto clear error after 3s
  useEffect(() => {
    if (!aiError) return;
    const timer = setTimeout(() => setAiError(null), 3000);
    return () => clearTimeout(timer);
  }, [aiError]);

  const handleBlur = () => {
    if (isInteractingWithAiButtonRef.current) return;
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleAiRewrite = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!rewriteFn || aiWriting || disabled) return;

    isInteractingWithAiButtonRef.current = false;
    const liveText = inputRef.current?.value ?? currentValue;

    setAiWriting(true);
    setAiError(null);

    try {
      let result = await rewriteFn(section, fieldKey, liveText);
      if (typeof result === "string" && result.trim()) {
        result = cleanAiText(result);
        onChange(result);
        if (inputRef.current) {
          inputRef.current.value = result;
        }
      }
    } catch (err: any) {
      setAiError(err?.message || "AI gagal menulis ulang teks.");
    } finally {
      setAiWriting(false);
      isInteractingWithAiButtonRef.current = false;
    }
  };

  const fieldId = id || `field-${section}.${fieldKey}`;
  const baseInputStyle = `${SIDEBAR_FIELD_CLASS} ${inputClassName} ${showAiBadge ? "pr-8" : ""}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label and actions header */}
      {(label || onUndo || rightAction) && (
        <label
          htmlFor={fieldId}
          className="flex items-center justify-between text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground"
        >
          <span className="flex items-center gap-1">
            {label}
            {needsAttention && <span className="text-amber-300">⚠️</span>}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {typeof undoCount === "number" && undoCount > 0 && onUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-sidebar-muted text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-all cursor-pointer focus:outline-none"
                title={`Undo perubahan field ini (${undoCount} kali)`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {rightAction}
          </div>
        </label>
      )}

      {/* Field Input/Textarea Container */}
      <div className="relative w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={fieldId}
            rows={rows}
            maxLength={maxLength}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${baseInputStyle} resize-none`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={fieldId}
            type="text"
            maxLength={maxLength}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={baseInputStyle}
          />
        )}

        {/* AI Sparkle Button — top-right corner, only appears when user clicks/focuses text */}
        {canRewrite && (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInteractingWithAiButtonRef.current = true;
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInteractingWithAiButtonRef.current = true;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInteractingWithAiButtonRef.current = true;
            }}
            onClick={handleAiRewrite}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAiRewrite(e);
            }}
            disabled={aiWriting || disabled}
            aria-label="Tulis ulang dengan AI"
            title={aiWriting ? "AI sedang menulis..." : "Tulis ulang dengan AI"}
            className={`absolute top-2 right-2 z-20 flex items-center justify-center w-6 h-6 sm:w-5 sm:h-5 rounded-full shadow-md border border-amber-400/70 transition-all duration-150 cursor-pointer
              before:absolute before:-inset-2 before:content-['']
              ${showAiBadge ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
              ${
                aiWriting
                  ? "bg-amber-500 text-white cursor-wait"
                  : "bg-slate-900/90 hover:bg-amber-500 text-amber-400 hover:text-white hover:border-amber-500 hover:scale-110 active:scale-95"
              }
            `}
          >
            {aiWriting ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-3 sm:h-3 animate-spin" />
            ) : (
              <SparkleIcon className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            )}
          </button>
        )}

        {/* Error tooltip */}
        {aiError && (
          <div className="absolute -bottom-6 right-0 max-w-[85vw] sm:max-w-xs z-30 text-[10px] text-red-400 bg-slate-900/95 px-2 py-0.5 rounded shadow-lg whitespace-normal border border-red-500/30 pointer-events-none">
            {aiError}
          </div>
        )}
      </div>

      {/* Hint text */}
      {hint && (
        <p className="text-[10px] text-sidebar-subtle-foreground leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

