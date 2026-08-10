"use client";

import { useI18n } from "@/lib/i18n/context";

const OPTIONS = [
  { code: "id" as const, label: "ID" },
  { code: "en" as const, label: "EN" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={`inline-flex items-center rounded-full border border-border/60 bg-background/80 p-0.5 text-xs font-semibold backdrop-blur ${className}`}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          aria-label={`Switch language to ${opt.label}`}
          aria-pressed={locale === opt.code}
          onClick={() => setLocale(opt.code)}
          className={`rounded-full px-2.5 py-1 transition cursor-pointer ${
            locale === opt.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
