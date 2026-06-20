import PublicSite from "@/components/public-site";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const siteId = parseInt(resolvedParams.id, 10);

  if (isNaN(siteId)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <p>ID preview tidak valid.</p>
      </div>
    );
  }

  return <PublicSite siteId={siteId} />;
}
