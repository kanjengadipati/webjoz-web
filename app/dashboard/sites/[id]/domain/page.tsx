"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CustomDomainRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params?.id;

  useEffect(() => {
    if (siteId) {
      router.replace(`/dashboard/domains?site_id=${siteId}`);
    } else {
      router.replace("/dashboard/domains");
    }
  }, [siteId, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}
