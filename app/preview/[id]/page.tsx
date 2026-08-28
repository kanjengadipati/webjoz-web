import PublicSite from "@/components/public-site";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    preview_token?: string;
  }>;
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const siteId = parseInt(resolvedParams.id, 10);
  const previewToken = typeof resolvedSearch.preview_token === "string" ? resolvedSearch.preview_token : undefined;

  if (isNaN(siteId)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <p>ID preview tidak valid.</p>
      </div>
    );
  }

  return <PublicSite siteId={siteId} previewToken={previewToken} />;
}
