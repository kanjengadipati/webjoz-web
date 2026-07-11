"use client";

import { useParams } from "next/navigation";
import PublicBlogIndex from "@/components/public-blog-index";

export default function BlogIndexPage() {
  const { subdomain } = useParams();
  return <PublicBlogIndex subdomain={String(subdomain ?? "")} routePrefix="/site" />;
}
