import type { Metadata } from "next";
import PublicSite from "@/components/public-site";
import { fetchPublicSiteMetadata } from "@/lib/public-site-meta";
import { fetchPublicSiteInitial } from "@/lib/public-site-data";

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
  const initial = await fetchPublicSiteInitial(host);
  return <PublicSite host={host} initial={initial} />;
}
