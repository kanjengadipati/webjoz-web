"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-current/25 border-t-current/70 text-primary" />
    </div>
  );
}
