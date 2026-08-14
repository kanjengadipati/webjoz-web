import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Situs — Webjoz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubdomainPreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
