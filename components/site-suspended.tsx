"use client";

import React from "react";
import { PauseCircle, ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export interface SiteSuspendedProps {
  siteName?: string;
  subdomain?: string;
  expiredAt?: string | null;
  language?: string;
}

const COPY = {
  id: {
    badge: "Situs Dijeda",
    title: "Website ini sedang dijeda",
    intro: (name: string) =>
      `Masa aktif paket langganan ${name} telah berakhir, sehingga website ini sementara menampilkan halaman penangguhan.`,
    noName: "Masa aktif paket langganan website ini telah berakhir.",
    reassurance:
      "Seluruh konten, pengaturan, dan nama domain Anda tetap tersimpan aman. Website akan tampil kembali normal segera setelah paket diperpanjang.",
    expiredLabel: "Berakhir sejak",
    renew: "Perpanjang Paket Sekarang",
    dashboard: "Buka Dashboard",
    ownerNote: "Anda pemilik website ini?",
    madeWith: "Dipersembahkan oleh Webjoz",
  },
  en: {
    badge: "Suspended Site",
    title: "This website is suspended",
    intro: (name: string) =>
      `The subscription plan for ${name} has expired, so this website is temporarily showing a suspension page.`,
    noName: "The subscription plan for this website has expired.",
    reassurance:
      "All of your content, settings, and domain name remain safely stored. The website will return to normal as soon as you renew your plan.",
    expiredLabel: "Expired on",
    renew: "Renew My Plan",
    dashboard: "Open Dashboard",
    ownerNote: "Are you the owner of this website?",
    madeWith: "Powered by Webjoz",
  },
};

function formatDate(iso: string, locale: string): string | null {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return null;
  }
}

export default function SiteSuspended({
  siteName,
  subdomain,
  expiredAt,
  language,
}: SiteSuspendedProps) {
  const isEN = language === "en";
  const t = isEN ? COPY.en : COPY.id;
  const locale = isEN ? "en-GB" : "id-ID";
  const displayName = siteName?.trim() || subdomain || "";
  const formattedExpiry = expiredAt ? formatDate(expiredAt, locale) : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <PauseCircle className="h-8 w-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t.badge}
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">{t.title}</h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {displayName ? t.intro(displayName) : t.noName}
          </p>

          {formattedExpiry && (
            <p className="mt-2 text-sm text-slate-500">
              {t.expiredLabel}: <span className="text-slate-400">{formattedExpiry}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/dashboard/upgrade"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 sm:w-auto"
            >
              {t.renew}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t.dashboard}
            </a>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-left">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-xs leading-relaxed text-slate-400">{t.reassurance}</p>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            {t.ownerNote}{" "}
            <a href="/dashboard" className="text-slate-400 underline hover:text-slate-200">
              {t.dashboard}
            </a>
          </p>
        </div>
      </div>

      <footer className="border-t border-slate-900 py-5 text-center">
        <a
          href="https://www.webjoz.com"
          className="text-xs text-slate-600 transition hover:text-slate-400"
        >
          {t.madeWith}
        </a>
      </footer>
    </div>
  );
}
