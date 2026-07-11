"use client";

import { useParams } from "next/navigation";
import PublicBlogDetail from "@/components/public-blog-detail";

export default function BlogDetailPage() {
  const { subdomain, slug } = useParams();
  return (
    <PublicBlogDetail
      subdomain={String(subdomain ?? "")}
      slug={String(slug ?? "")}
      routePrefix="/site"
    />
  );
}
