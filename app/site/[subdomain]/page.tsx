import type { Metadata } from "next";
import PublicSite from "@/components/public-site";
import { fetchPublicSiteMetadata } from "@/lib/public-site-meta";
import { fetchPublicSiteInitial } from "@/lib/public-site-data";

interface PageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subdomain } = await params;
  return fetchPublicSiteMetadata(subdomain);
}

export default async function SiteBySubdomainPage({ params }: PageProps) {
  const { subdomain } = await params;
  const initial = await fetchPublicSiteInitial(subdomain);
  return <PublicSite subdomain={subdomain} initial={initial} />;
}
