"use client";

import { useEffect } from "react";
import { Button, Card, CardContent, CardHeader, SectionTitle } from "@/components/ui";

export default function InvestigateError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[60vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-rose-500/20 bg-rose-500/5">
        <CardHeader className="border-b border-border/60">
          <SectionTitle 
            eyebrow="System Error" 
            title="Failed to Load Dashboard" 
          />
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-8 pb-6 text-center">
          <div className="mb-4 rounded-full bg-rose-500/10 p-4 text-rose-600 dark:text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-10">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We encountered an unexpected error while trying to load the investigation module. This could be a network issue or a temporary backend failure.
          </p>
          <Button 
            onClick={() => unstable_retry()}
            className="w-full bg-rose-600 text-white hover:bg-rose-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
