"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken, useAuthReady } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { Button } from "@/components/ui";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const authReady = useAuthReady();
  const authToken = useAuthToken();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authReady) return;
    if (!authToken) {
      router.push(`/login?redirect=${encodeURIComponent(`/invitations/${token}`)}`);
      return;
    }

    (async () => {
      try {
        await request(`/invitations/${token}/accept`, {
          method: "POST",
        }, authToken);
        setStatus("success");
        setMessage("Berhasil bergabung ke tim!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Gagal menerima undangan.");
      }
    })();
  }, [authReady, authToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl border bg-card text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Memproses undangan...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            <h1 className="text-lg font-bold">{message}</h1>
            <p className="text-sm text-muted-foreground">Anda sekarang dapat mengakses tim di dashboard.</p>
            <Button onClick={() => router.push("/dashboard")}>Ke Dashboard</Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold">Gagal</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button variant="outline" onClick={() => router.push("/login")}>Kembali ke Login</Button>
          </>
        )}
      </div>
    </div>
  );
}
