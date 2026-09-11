"use client";

import { useState } from "react";
import { TriangleAlert, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface ModerationViolation {
  field?: string;
  category?: string;
  keyword?: string;
}

export interface ModerationBlockProps {
  violations: ModerationViolation[];
  onAppealSubmit: (message: string) => void;
  submitting?: boolean;
  appealed?: boolean;
}

function categoryLabel(t: (k: string, f?: string) => string, category?: string): string {
  switch (category) {
    case "pinjol":
      return t("dashboard.sites.moderationCatPinjol", "Layanan pinjaman online (pinjol)");
    case "judi":
      return t("dashboard.sites.moderationCatJudi", "Perjudian / slot");
    case "alkohol":
      return t("dashboard.sites.moderationCatAlkohol", "Penjualan minuman beralkohol");
    case "barang_haram":
      return t("dashboard.sites.moderationCatBarangHaram", "Penjualan barang haram / narkoba");
    default:
      return category || "-";
  }
}

export default function ModerationBlock({ violations, onAppealSubmit, submitting, appealed }: ModerationBlockProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const groups = new Map<string, ModerationViolation[]>();
  for (const v of violations) {
    const key = v.category || "other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }

  if (appealed) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/[0.04] rounded-xl p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
          {t("dashboard.sites.moderationAppealSent")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-red-500/30 bg-red-500/[0.03] rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
            <TriangleAlert className="w-4.5 h-4.5 text-red-500" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-[13px] font-bold text-foreground leading-snug">
              {t("dashboard.sites.moderationTitle")}
            </h4>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed">
              {t("dashboard.sites.moderationDesc")}
            </p>
          </div>
        </div>

        <ul className="space-y-1.5">
          {Array.from(groups.entries()).map(([cat, items]) => (
            <li key={cat} className="text-[12px] leading-relaxed">
              <span className="font-semibold text-red-600 dark:text-red-400">{categoryLabel(t, cat)}</span>
              {" — "}
              <span className="text-muted-foreground">
                {t("dashboard.sites.moderationKeywordPrefix")}
                {items.map((v) => v.keyword).filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-bold text-foreground/80 tracking-wide">
          {t("dashboard.sites.moderationAppealTitle")}
        </p>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (touched && e.target.value.trim()) setTouched(false);
          }}
          rows={3}
          disabled={submitting}
          placeholder={t("dashboard.sites.moderationAppealPlaceholder")}
          className={`w-full bg-background border rounded-xl px-3 py-2.5 text-[13px] outline-none resize-none placeholder:text-muted-foreground min-w-0 font-normal ${
            touched && !message.trim()
              ? "border-red-500/50"
              : "border-border focus:border-primary/60 focus:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
          }`}
        />
        {touched && !message.trim() && (
          <p className="text-[11px] text-red-500">
            {t("dashboard.sites.moderationAppealRequired")}
          </p>
        )}
        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            if (!message.trim()) {
              setTouched(true);
              return;
            }
            onAppealSubmit(message.trim());
          }}
          className="flex items-center justify-center gap-2 w-full rounded-xl h-10 text-[13px] font-bold cursor-pointer transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_25%,transparent)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("dashboard.sites.moderationAppealSubmitting")}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t("dashboard.sites.moderationAppealBtn")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}