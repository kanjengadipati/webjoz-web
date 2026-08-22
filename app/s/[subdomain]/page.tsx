import type { Metadata } from "next";
import PublicSite from "@/components/public-site";
import { fetchPublicSiteMetadata } from "@/lib/public-site-meta";

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
  return <PublicSite subdomain={resolvedParams.subdomain} />;
}
