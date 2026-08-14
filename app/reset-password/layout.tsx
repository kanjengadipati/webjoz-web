import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi — Webjoz",
  description: "Buat kata sandi baru untuk akun Webjoz Anda.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: siteUrl("/reset-password"),
  },
};

export default function ResetPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
