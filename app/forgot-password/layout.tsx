import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi — Webjoz",
  description:
    "Reset kata sandi akun Webjoz Anda. Masukkan email atau nomor WhatsApp untuk menerima tautan atau kode verifikasi.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: siteUrl("/forgot-password"),
  },
};

export default function ForgotPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
