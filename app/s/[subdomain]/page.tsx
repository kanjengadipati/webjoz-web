import PublicSite from "@/components/public-site";

interface PageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainPathPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicSite subdomain={resolvedParams.subdomain} />;
}
