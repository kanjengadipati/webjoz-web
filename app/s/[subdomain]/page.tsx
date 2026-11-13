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
  const resolvedParams = await params;
  return fetchPublicSiteMetadata(resolvedParams.subdomain);
}

export default async function SubdomainPathPage({ params }: PageProps) {
  const resolvedParams = await params;
  const initial = await fetchPublicSiteInitial(resolvedParams.subdomain);
  return <PublicSite subdomain={resolvedParams.subdomain} initial={initial} />;
}
