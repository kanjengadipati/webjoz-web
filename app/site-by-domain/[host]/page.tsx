import type { Metadata } from "next";
import PublicSite from "@/components/public-site";
import { fetchPublicSiteMetadata } from "@/lib/public-site-meta";

interface PageProps {
  params: Promise<{
    host: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { host } = await params;
  return fetchPublicSiteMetadata(host);
}

export default async function DomainSitePage({ params }: PageProps) {
  const { host } = await params;
  return <PublicSite host={host} />;
}
