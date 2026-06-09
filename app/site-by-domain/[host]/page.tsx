import PublicSite from "@/components/public-site";

interface PageProps {
  params: Promise<{
    host: string;
  }>;
}

export default async function CustomDomainPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <PublicSite host={resolvedParams.host} />;
}
