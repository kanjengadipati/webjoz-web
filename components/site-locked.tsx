"use client";

import React from "react";
import { ShieldOff, ArrowRight, LayoutDashboard, LifeBuoy } from "lucide-react";

export interface SiteLockedProps {
  siteName?: string;
  subdomain?: string;
  language?: string;
}

const COPY = {
  id: {
    badge: "Situs Dinonaktifkan",
    title: "Website ini dinonaktifkan",
    intro: (name: string) =>
      `Website ${name} dinonaktifkan karena melanggar kebijakan layanan kami.`,
    noName: "Website ini dinonaktifkan karena melanggar kebijakan layanan kami.",
    reassurance:
      "Jika Anda pemilik website ini, silakan masuk ke dashboard untuk melihat detail atau mengajukan banding. Seluruh konten dan pengaturan Anda tetap tersimpan.",
    dashboard: "Buka Dashboard",
    support: "Hubungi Dukungan",
    ownerNote: "Anda pemilik website ini?",
    madeWith: "Dipersembahkan oleh Webjoz",
  },
  en: {
    badge: "Site Disabled",
    title: "This website is disabled",
    intro: (name: string) =>
      `The website ${name} has been disabled for violating our terms of service.`,
    noName: "This website has been disabled for violating our terms of service.",
    reassurance:
      "If you are the owner, please sign in to your dashboard to view details or submit an appeal. All of your content and settings remain safely stored.",
    dashboard: "Open Dashboard",
    support: "Contact Support",
    ownerNote: "Are you the owner of this website?",
    madeWith: "Powered by Webjoz",
  },
};

export default function SiteLocked({ siteName, subdomain, language }: SiteLockedProps) {
  const isEN = language === "en";
  const t = isEN ? COPY.en : COPY.id;
  const displayName = siteName?.trim() || subdomain || "";

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <ShieldOff className="h-8 w-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t.badge}
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">{t.title}</h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {displayName ? t.intro(displayName) : t.noName}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t.dashboard}
            </a>
            <a
              href="/help"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
            >
              {t.support}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-left">
            <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
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
