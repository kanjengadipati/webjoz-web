import type { Metadata } from "next";
import { ChangelogContent } from "./changelog-content";

export const metadata: Metadata = {
  title: "Changelog — Apa yang Baru | Webjoz",
  description:
    "Lihat pembaruan terbaru dari Webjoz — fitur baru, perbaikan, dan peningkatan platform AI website builder.",
  keywords: [
    "changelog webjoz",
    "pembaruan webjoz",
    "fitur baru",
    "update platform",
  ],
  alternates: { canonical: "https://www.webjoz.com/changelog" },
  openGraph: {
    title: "Changelog — Apa yang Baru | Webjoz",
    description:
      "Lihat pembaruan terbaru dari Webjoz — fitur baru, perbaikan, dan peningkatan.",
    url: "https://www.webjoz.com/changelog",
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Changelog — Apa yang Baru | Webjoz",
    description: "Lihat pembaruan terbaru dari Webjoz.",
  },
};

export default function ChangelogPage() {
  return <ChangelogContent />;
}
