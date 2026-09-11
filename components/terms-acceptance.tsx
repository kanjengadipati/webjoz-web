"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface TermsAcceptanceProps {
  agreed: boolean;
  onChange: (agreed: boolean) => void;
  showError?: boolean;
  disabled?: boolean;
}

export default function TermsAcceptance({ agreed, onChange, showError, disabled }: TermsAcceptanceProps) {
  const { t, isIndonesian } = useI18n();
  const termsHref = isIndonesian ? "/terms" : "/en/terms";

  return (
    <div>
      <div
        role="checkbox"
        aria-checked={agreed}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) onChange(!agreed);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!agreed);
          }
        }}
        className={`flex items-start gap-3 border rounded-xl p-3.5 transition-colors cursor-pointer bg-card select-none ${
          showError && !agreed
            ? "border-red-500/50 bg-red-500/[0.02]"
            : "border-border/70 hover:border-primary/40"
        }`}
      >
        <input
          type="checkbox"
          checked={agreed}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 mt-0.5 accent-primary rounded shrink-0 cursor-pointer"
        />
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-300 leading-snug">
            {t("dashboard.sites.publishTermsTitle")}{" "}
            <Link
              href={termsHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-[#3ddc84] dark:text-[#5fe3a0] underline underline-offset-4 decoration-[#3ddc84]/40 hover:decoration-[#3ddc84] hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>{t("dashboard.sites.publishTermsLink")}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
            </Link>
          </p>
        </div>
      </div>
      {showError && !agreed && (
        <p className="text-[11px] text-red-500 mt-1.5 ml-1">
          {t("dashboard.sites.publishTermsRequired")}
        </p>
      )}
    </div>
  );
}