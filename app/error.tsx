"use client";

import { useEffect } from "react";
import { Button, Card, CardContent, CardHeader, SectionTitle } from "@/components/ui";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-rose-500/20 bg-rose-500/5">
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow="Recovery" title="Something went wrong" />
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            The console hit an unexpected error. Try again to re-render this view.
          </p>
          <Button className="mt-6 w-full" onClick={() => unstable_retry()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
