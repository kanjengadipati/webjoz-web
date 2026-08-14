import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Verifikasi Email — Webjoz",
  description: "Verifikasi alamat email Anda untuk mengaktifkan akun Webjoz.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: siteUrl("/verify"),
  },
};

export default function VerifyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
